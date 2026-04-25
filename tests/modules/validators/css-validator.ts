#!/usr/bin/env tsx
/**
 * W3C CSS Syntax Validator
 *
 * Validates CSS files against the W3C CSS Validation API.
 * Mirrors the git-diff strategy from scripts/ci/validate_html_w3c.py.
 *
 * Usage:
 *   tsx tests/modules/validators/css-validator.ts            # all CSS files
 *   tsx tests/modules/validators/css-validator.ts --pr-mode  # changed files only
 *
 * Exit codes:
 *   0: All files valid (or no CSS files to check)
 *   1: Validation errors found
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import type {
  CssValidationMessage,
  CssFileValidationResult,
  CssValidationReport,
} from '../types/index.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const W3C_CSS_API = 'https://jigsaw.w3.org/css-validator/validator';
const RATE_LIMIT_MS = 1100; // W3C asks for ≤1 req/s; 100ms buffer
const REPORT_DIR = 'qa-reports';
const REPORT_FILE = path.join(REPORT_DIR, 'css-validation.json');

// Path prefix added by GitHub Pages — strip when reading local files
const GH_PAGES_PREFIX = '/aws_sap_studying/';

// ── ANSI colors ───────────────────────────────────────────────────────────────

const C = {
  green:  '\x1b[92m',
  red:    '\x1b[91m',
  yellow: '\x1b[93m',
  blue:   '\x1b[94m',
  bold:   '\x1b[1m',
  reset:  '\x1b[0m',
} as const;

// ── Git diff strategy (mirrors validate_html_w3c.py) ─────────────────────────
// Uses spawnSync (not exec/execSync) to avoid shell injection.

function runGit(...args: string[]): { stdout: string; ok: boolean } {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  return {
    stdout: result.stdout ?? '',
    ok: result.status === 0 && !result.error,
  };
}

function getModifiedCssFiles(): string[] {
  const strategies: string[][] = [
    ['diff', '--name-only', 'origin/gh-pages...HEAD'],
    ['diff', '--name-only', 'HEAD'],
    ['diff', '--name-only', '--cached'],
  ];

  for (const args of strategies) {
    const { stdout, ok } = runGit(...args);
    if (!ok) continue;

    const files = stdout.trim().split('\n').filter(Boolean);
    const cssFiles = files.filter((f) => f.endsWith('.css') && fs.existsSync(f));
    if (cssFiles.length > 0) {
      console.log(`${C.blue}[git-diff]${C.reset} Strategy: git ${args.slice(0, 2).join(' ')} — found ${cssFiles.length} CSS file(s)`);
      return cssFiles;
    }
  }

  console.log(`${C.yellow}[git-diff]${C.reset} No changed CSS files found — nothing to validate`);
  return [];
}

function getAllCssFiles(): string[] {
  const result: string[] = [];

  function walk(dir: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.css')) {
        result.push(fullPath);
      }
    }
  }

  walk('.');
  return result;
}

// ── W3C CSS API call ──────────────────────────────────────────────────────────

interface W3cCssApiResponse {
  cssvalidation: {
    result: {
      errorcount: number;
      warningcount: number;
    };
    errors?: Array<{
      line: number;
      errortype: string;
      context: string;
      skippedstring: string;
      message: string;
    }>;
    warnings?: Array<{
      line: number;
      level: number;
      message: string;
      type: string;
    }>;
  };
}

function httpsPost(cssContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      profile: 'css3',
      output: 'json',
      warning: '2',
    });
    const url = new URL(`${W3C_CSS_API}?${params.toString()}`);

    const body = Buffer.from(cssContent, 'utf8');
    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Content-Length': body.length,
        'User-Agent': 'aws-sap-qa-validator/1.0',
      },
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function validateCssFile(filePath: string): Promise<CssFileValidationResult> {
  const now = new Date().toISOString();

  // Resolve local file path: strip GH Pages prefix if present
  let localPath = filePath;
  if (localPath.startsWith(GH_PAGES_PREFIX)) {
    localPath = localPath.slice(GH_PAGES_PREFIX.length);
  }

  if (!fs.existsSync(localPath)) {
    return {
      filePath,
      isValid: true,
      errors: [],
      warnings: [],
      skipped: true,
      validatedAt: now,
    };
  }

  const cssContent = fs.readFileSync(localPath, 'utf8');

  let rawJson: string;
  try {
    rawJson = await httpsPost(cssContent);
  } catch (err) {
    console.error(`${C.red}[ERROR]${C.reset} Network error for ${filePath}: ${err}`);
    return {
      filePath,
      isValid: false,
      errors: [{ line: 0, col: 0, message: `Network error: ${err}`, context: '', type: 'error' }],
      warnings: [],
      skipped: false,
      validatedAt: now,
    };
  }

  let parsed: W3cCssApiResponse;
  try {
    parsed = JSON.parse(rawJson) as W3cCssApiResponse;
  } catch {
    // Cloudflare bot challenge or HTML error page — API is unreachable, not a CSS error.
    const looksLikeCloudflareChallenge =
      rawJson.includes('Just a moment...') || rawJson.startsWith('<!DOCTYPE');
    if (looksLikeCloudflareChallenge) {
      console.warn(`${C.yellow}[SKIP]${C.reset} W3C CSS API unreachable (Cloudflare challenge) for ${filePath}`);
      return {
        filePath,
        isValid: true,
        errors: [],
        warnings: [],
        skipped: true,
        validatedAt: now,
      };
    }
    console.error(`${C.red}[ERROR]${C.reset} Failed to parse W3C response for ${filePath}`);
    return {
      filePath,
      isValid: false,
      errors: [{ line: 0, col: 0, message: 'Invalid JSON from W3C API', context: '', type: 'error' }],
      warnings: [],
      skipped: false,
      validatedAt: now,
    };
  }

  const validation = parsed.cssvalidation;
  const errors: CssValidationMessage[] = (validation.errors ?? []).map((e) => ({
    line: e.line,
    col: 0,
    message: e.message,
    context: e.context,
    type: 'error' as const,
  }));
  const warnings: CssValidationMessage[] = (validation.warnings ?? []).map((w) => ({
    line: w.line,
    col: 0,
    message: w.message,
    context: w.type,
    type: 'warning' as const,
  }));

  return {
    filePath,
    isValid: errors.length === 0,
    errors,
    warnings,
    skipped: false,
    validatedAt: now,
  };
}

// ── Sleep helper ──────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const isPrMode = process.argv.includes('--pr-mode');
  const mode: 'full' | 'pr' = isPrMode ? 'pr' : 'full';

  console.log(`${C.bold}${C.blue}W3C CSS Validator${C.reset} — mode: ${mode}`);
  console.log('─'.repeat(60));

  const cssFiles = isPrMode ? getModifiedCssFiles() : getAllCssFiles();

  if (cssFiles.length === 0) {
    console.log(`${C.green}✓ No CSS files to validate${C.reset}`);
    writeReport({ mode, files: [] });
    process.exit(0);
  }

  console.log(`Validating ${cssFiles.length} file(s)...\n`);

  const results: CssFileValidationResult[] = [];
  let hasErrors = false;

  for (let i = 0; i < cssFiles.length; i++) {
    const filePath = cssFiles[i];
    process.stdout.write(`[${i + 1}/${cssFiles.length}] ${path.basename(filePath)}... `);

    const result = await validateCssFile(filePath);
    results.push(result);

    if (result.skipped) {
      console.log(`${C.yellow}SKIPPED${C.reset} (file not found)`);
    } else if (result.isValid) {
      const warnNote = result.warnings.length > 0
        ? ` (${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''})`
        : '';
      console.log(`${C.green}PASS${C.reset}${warnNote}`);
    } else {
      hasErrors = true;
      console.log(`${C.red}FAIL${C.reset} (${result.errors.length} error${result.errors.length > 1 ? 's' : ''})`);
      for (const err of result.errors.slice(0, 5)) {
        console.log(`  ${C.red}✗${C.reset} Line ${err.line}: ${err.message}`);
        if (err.context) console.log(`    Context: ${err.context}`);
      }
      if (result.errors.length > 5) {
        console.log(`  ... and ${result.errors.length - 5} more error(s)`);
      }
    }

    // Rate limit: don't sleep after the last file
    if (i < cssFiles.length - 1) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  writeReport({ mode, files: results });

  console.log('\n' + '─'.repeat(60));
  const validCount = results.filter((r) => r.isValid && !r.skipped).length;
  const invalidCount = results.filter((r) => !r.isValid).length;
  const skippedCount = results.filter((r) => r.skipped).length;

  console.log(`${C.bold}Summary:${C.reset} ${validCount} passed, ${invalidCount} failed, ${skippedCount} skipped`);
  console.log(`Report: ${REPORT_FILE}`);

  process.exit(hasErrors ? 1 : 0);
}

function writeReport(params: { mode: 'full' | 'pr'; files: CssFileValidationResult[] }): void {
  const { mode, files } = params;
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const report: CssValidationReport = {
    generatedAt: new Date().toISOString(),
    mode,
    totalFiles: files.length,
    validFiles: files.filter((r) => r.isValid && !r.skipped).length,
    invalidFiles: files.filter((r) => !r.isValid).length,
    skippedFiles: files.filter((r) => r.skipped).length,
    results: files,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');
}

main().catch((err) => {
  console.error(`${C.red}Fatal error:${C.reset}`, err);
  process.exit(1);
});
