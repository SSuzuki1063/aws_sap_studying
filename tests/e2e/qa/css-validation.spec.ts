/**
 * CSS Validation Spec — asserts on the static analysis report produced by
 * css-validator.ts (which runs without Playwright).
 *
 * In CI: static-validation job writes qa-reports/css-validation.json,
 * then this spec reads it and asserts that no CSS files have errors.
 *
 * Run locally after: npm run qa:css-validate
 */

import { test, expect } from '@playwright/test';
import { loadCssValidationReport } from '../../modules/validators/html-validator.js';
import type { CssValidationReport } from '../../modules/types/index.js';

test.describe('CSS W3C Validation', () => {
  let report: CssValidationReport | null;

  test.beforeAll(() => {
    report = loadCssValidationReport('qa-reports/css-validation.json') as CssValidationReport | null;
  });

  test('css-validation.json report exists', () => {
    expect(report).not.toBeNull();
    expect(report).toHaveProperty('results');
  });

  test('no CSS files have validation errors', () => {
    if (!report) test.skip();
    const failing = report!.results.filter((r) => !r.isValid && !r.skipped);
    if (failing.length > 0) {
      const summary = failing
        .map((f) => {
          const errLines = f.errors
            .slice(0, 3)
            .map((e) => `  Line ${e.line}: ${e.message}`)
            .join('\n');
          return `${f.filePath}:\n${errLines}`;
        })
        .join('\n\n');
      throw new Error(`${failing.length} CSS file(s) failed W3C validation:\n\n${summary}`);
    }
    expect(failing.length).toBe(0);
  });

  test('validation summary matches counts', () => {
    if (!report) test.skip();
    const actualInvalid = report!.results.filter((r) => !r.isValid && !r.skipped).length;
    expect(report!.invalidFiles).toBe(actualInvalid);
  });
});
