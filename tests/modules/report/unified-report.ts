#!/usr/bin/env tsx
/**
 * Unified QA Report Generator
 *
 * Reads individual JSON reports from qa-reports/ and produces:
 *   - qa-reports/index.html  — human-readable summary
 *   - qa-reports/summary.json — machine-readable summary for CI step summary
 *
 * Usage:
 *   tsx tests/modules/report/unified-report.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import type {
  CssValidationReport,
  CssRuntimeReport,
  QaStatus,
  QaSectionSummary,
  UnifiedQaSummary,
} from '../types/index.js';

const REPORT_DIR = 'qa-reports';

// ── Git helpers ───────────────────────────────────────────────────────────────

function getGitInfo(): { sha: string; branch: string } {
  const sha = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const branch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  return { sha, branch };
}

// ── Report loaders ────────────────────────────────────────────────────────────

function loadJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function buildCssValidationSection(): QaSectionSummary {
  const report = loadJson<CssValidationReport>(path.join(REPORT_DIR, 'css-validation.json'));
  if (!report) {
    return { name: 'CSS Validation (W3C)', status: 'not-run', totalChecks: 0, passedChecks: 0, failedChecks: 0, reportFile: null };
  }
  const status: QaStatus = report.invalidFiles > 0 ? 'fail' : 'pass';
  return {
    name: 'CSS Validation (W3C)',
    status,
    totalChecks: report.totalFiles,
    passedChecks: report.validFiles,
    failedChecks: report.invalidFiles,
    reportFile: 'css-validation.json',
  };
}

function buildCssRuntimeSection(): QaSectionSummary {
  const report = loadJson<CssRuntimeReport>(path.join(REPORT_DIR, 'css-runtime.json'));
  if (!report) {
    return { name: 'CSS Runtime Check', status: 'not-run', totalChecks: 0, passedChecks: 0, failedChecks: 0, reportFile: null };
  }
  const status: QaStatus = report.failedPages > 0 ? 'fail' : 'pass';
  return {
    name: 'CSS Runtime Check',
    status,
    totalChecks: report.totalPages,
    passedChecks: report.passedPages,
    failedChecks: report.failedPages,
    reportFile: 'css-runtime.json',
  };
}

function buildHtmlValidationSection(): QaSectionSummary {
  // HTML validation runs via Python — we check for a marker file written by the CI step
  const markerFile = path.join(REPORT_DIR, 'html-validation-result.json');
  const result = loadJson<{ passed: boolean; fileCount: number; errorCount: number }>(markerFile);
  if (!result) {
    return { name: 'HTML Validation (W3C)', status: 'not-run', totalChecks: 0, passedChecks: 0, failedChecks: 0, reportFile: null };
  }
  return {
    name: 'HTML Validation (W3C)',
    status: result.passed ? 'pass' : 'fail',
    totalChecks: result.fileCount,
    passedChecks: result.passed ? result.fileCount : result.fileCount - result.errorCount,
    failedChecks: result.errorCount,
    reportFile: 'html-validation-result.json',
  };
}

function buildAccessibilitySection(): QaSectionSummary {
  const markerFile = path.join(REPORT_DIR, 'accessibility-result.json');
  const result = loadJson<{ passed: boolean; totalTests: number; passedTests: number }>(markerFile);
  if (!result) {
    return { name: 'Accessibility (axe-core)', status: 'not-run', totalChecks: 0, passedChecks: 0, failedChecks: 0, reportFile: null };
  }
  return {
    name: 'Accessibility (axe-core)',
    status: result.passed ? 'pass' : 'fail',
    totalChecks: result.totalTests,
    passedChecks: result.passedTests,
    failedChecks: result.totalTests - result.passedTests,
    reportFile: 'accessibility-result.json',
  };
}

// ── HTML generation ───────────────────────────────────────────────────────────

function statusBadge(status: QaStatus): string {
  const map: Record<QaStatus, { color: string; text: string }> = {
    pass:    { color: '#2ea44f', text: 'PASS' },
    fail:    { color: '#cf222e', text: 'FAIL' },
    skip:    { color: '#9a6700', text: 'SKIP' },
    'not-run': { color: '#6e7781', text: 'NOT RUN' },
  };
  const { color, text } = map[status];
  return `<span style="background:${color};color:#fff;padding:2px 8px;border-radius:4px;font-size:0.85em;font-weight:bold">${text}</span>`;
}

function generateHtml(summary: UnifiedQaSummary): string {
  const sections = Object.values(summary.sections);
  const overallColor = summary.overallStatus === 'pass' ? '#2ea44f' : summary.overallStatus === 'fail' ? '#cf222e' : '#6e7781';

  const rows = sections.map((s) => `
    <tr>
      <td style="padding:8px 12px">${s.name}</td>
      <td style="padding:8px 12px;text-align:center">${statusBadge(s.status)}</td>
      <td style="padding:8px 12px;text-align:right">${s.totalChecks}</td>
      <td style="padding:8px 12px;text-align:right;color:#2ea44f">${s.passedChecks}</td>
      <td style="padding:8px 12px;text-align:right;color:${s.failedChecks > 0 ? '#cf222e' : 'inherit'}">${s.failedChecks}</td>
      <td style="padding:8px 12px">${s.reportFile ? `<a href="${s.reportFile}">${s.reportFile}</a>` : '—'}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QA Report — aws-sap-studying</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 24px; color: #1f2328; }
    h1 { font-size: 1.5rem; margin-bottom: 4px; }
    .meta { color: #6e7781; font-size: 0.875rem; margin-bottom: 24px; }
    .overall { display: inline-block; padding: 4px 16px; border-radius: 6px; color: #fff; font-weight: bold; font-size: 1.1rem; background: ${overallColor}; margin-bottom: 24px; }
    table { border-collapse: collapse; width: 100%; max-width: 900px; }
    th { background: #f6f8fa; text-align: left; padding: 8px 12px; border-bottom: 2px solid #d0d7de; font-size: 0.875rem; }
    td { border-bottom: 1px solid #d0d7de; font-size: 0.875rem; }
    tr:last-child td { border-bottom: none; }
    a { color: #0969da; }
  </style>
</head>
<body>
  <h1>QA Report</h1>
  <div class="meta">
    Generated: ${summary.generatedAt}
    ${summary.branch ? ` · Branch: <code>${summary.branch}</code>` : ''}
    ${summary.gitSha ? ` · SHA: <code>${summary.gitSha}</code>` : ''}
  </div>
  <div class="overall">Overall: ${summary.overallStatus.toUpperCase()}</div>
  <table>
    <thead>
      <tr>
        <th>Check</th><th>Status</th><th>Total</th><th>Passed</th><th>Failed</th><th>Report</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main(): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const { sha, branch } = getGitInfo();

  const sections = {
    cssValidation: buildCssValidationSection(),
    cssRuntime: buildCssRuntimeSection(),
    htmlValidation: buildHtmlValidationSection(),
    accessibility: buildAccessibilitySection(),
  };

  const statuses = Object.values(sections).map((s) => s.status);
  const overallStatus: QaStatus =
    statuses.includes('fail') ? 'fail' :
    statuses.every((s) => s === 'pass') ? 'pass' :
    statuses.some((s) => s === 'not-run') ? 'not-run' : 'skip';

  const summary: UnifiedQaSummary = {
    generatedAt: new Date().toISOString(),
    overallStatus,
    gitSha: sha || undefined,
    branch: branch || undefined,
    sections,
  };

  // Write JSON summary
  fs.writeFileSync(
    path.join(REPORT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8',
  );

  // Write HTML report
  fs.writeFileSync(path.join(REPORT_DIR, 'index.html'), generateHtml(summary), 'utf8');

  console.log(`\nUnified QA Report generated:`);
  console.log(`  ${REPORT_DIR}/index.html`);
  console.log(`  ${REPORT_DIR}/summary.json`);
  console.log(`  Overall: ${summary.overallStatus.toUpperCase()}`);

  // Print GitHub Step Summary format if running in CI
  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
      '## QA Report Summary',
      '',
      `**Overall: ${summary.overallStatus.toUpperCase()}**`,
      '',
      '| Check | Status | Passed | Failed |',
      '|-------|--------|--------|--------|',
      ...Object.values(sections).map((s) =>
        `| ${s.name} | ${s.status.toUpperCase()} | ${s.passedChecks} | ${s.failedChecks} |`
      ),
    ];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  }
}

main();
