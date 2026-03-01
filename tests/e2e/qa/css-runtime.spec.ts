/**
 * CSS Runtime Check Spec — uses Playwright + getComputedStyle() to verify
 * that CSS rules are applied correctly at runtime.
 *
 * Reads expectations from tests/config/css-runtime-expectations.json and
 * writes results to qa-reports/css-runtime.json.
 *
 * Run: playwright test --project=qa tests/e2e/qa/css-runtime.spec.ts
 */

import { test, expect } from '@playwright/test';
import {
  checkPageRuntime,
  loadExpectations,
  writeCssRuntimeReport,
} from '../../modules/runtime/css-runtime-check.js';
import type { CssPageRuntimeResult } from '../../modules/types/index.js';

const configs = loadExpectations();
const allResults: CssPageRuntimeResult[] = [];

test.describe('CSS Runtime Check', () => {
  test.afterAll(() => {
    writeCssRuntimeReport(allResults);
  });

  for (const config of configs) {
    test(config.label, async ({ page }) => {
      const result = await checkPageRuntime(page, config);
      allResults.push(result);

      // Report any failing expectations with a clear diff
      const failures = result.diffs.filter((d) => !d.passed);
      if (failures.length > 0) {
        const summary = failures
          .map((d) => `  ${d.selector} [${d.property}]\n    expected: ${d.expected}\n    actual:   ${d.actual}`)
          .join('\n');
        throw new Error(`${failures.length} CSS property check(s) failed for "${config.label}":\n${summary}`);
      }

      expect(failures).toHaveLength(0);
    });
  }
});
