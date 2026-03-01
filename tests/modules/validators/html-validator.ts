/**
 * HTML Validator — TypeScript wrapper around scripts/ci/validate_html_w3c.py
 *
 * Runs the Python W3C HTML validation script and parses its exit code.
 * This wrapper enables integration into the unified QA report pipeline.
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface HtmlValidationRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  passed: boolean;
  ranAt: string;
}

/**
 * Run the W3C HTML validation Python script.
 * @param prMode - If true, validates only changed HTML files (--pr-mode)
 */
export function runHtmlValidation(prMode = false): HtmlValidationRunResult {
  const args = ['scripts/ci/validate_html_w3c.py'];
  if (prMode) args.push('--pr-mode');

  const result = spawnSync('python3', args, {
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });

  const exitCode = result.status ?? 1;
  return {
    exitCode,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    passed: exitCode === 0,
    ranAt: new Date().toISOString(),
  };
}

/**
 * Load an existing css-validation.json report from disk (produced by css-validator.ts).
 * Returns null if the file doesn't exist.
 */
export function loadCssValidationReport(reportPath = 'qa-reports/css-validation.json'): unknown | null {
  if (!fs.existsSync(reportPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as unknown;
  } catch {
    return null;
  }
}
