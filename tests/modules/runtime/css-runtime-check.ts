/**
 * CSS Runtime Check — Playwright-based computed style verification.
 *
 * Uses getComputedStyle() and getBoundingClientRect() to verify that CSS
 * rules are actually applied at runtime, catching issues that static
 * syntax validation cannot detect (e.g. selector specificity battles,
 * missing @import chains, JS-toggled classes).
 */

import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import type {
  CssPageRuntimeConfig,
  CssPageRuntimeResult,
  CssRuntimeDiff,
  BoundingRectResult,
  CssRuntimeReport,
} from '../types/index.js';

const REPORT_DIR = 'qa-reports';
const REPORT_FILE = path.join(REPORT_DIR, 'css-runtime.json');

// ── Core verification logic ───────────────────────────────────────────────────

/**
 * Check computed CSS properties for a single page configuration.
 * The page must already be navigated to the correct URL before calling this.
 */
export async function checkPageRuntime(
  page: Page,
  config: CssPageRuntimeConfig,
): Promise<CssPageRuntimeResult> {
  const viewport = config.viewport ?? { width: 1280, height: 800 };
  await page.setViewportSize(viewport);
  await page.goto(config.url, { waitUntil: 'domcontentloaded' });

  // Wait briefly for CSS transitions to settle
  await page.waitForTimeout(500);

  const diffs: CssRuntimeDiff[] = [];
  const boundingRects: BoundingRectResult[] = [];

  for (const expectation of config.expectations) {
    const { selector, property, expected, tolerance } = expectation;

    // Get computed style value
    const actual = await page.evaluate(
      ({ sel, prop }: { sel: string; prop: string }) => {
        const el = document.querySelector(sel);
        if (!el) return '__ELEMENT_NOT_FOUND__';
        return window.getComputedStyle(el).getPropertyValue(prop).trim();
      },
      { sel: selector, prop: property },
    );

    let passed: boolean;
    if (actual === '__ELEMENT_NOT_FOUND__') {
      passed = false;
    } else if (tolerance !== undefined) {
      // Numeric tolerance comparison (e.g. for px values)
      const actualNum = parseFloat(actual);
      const expectedNum = parseFloat(expected);
      passed = !isNaN(actualNum) && !isNaN(expectedNum) && Math.abs(actualNum - expectedNum) <= tolerance;
    } else if (expected.startsWith('/') && expected.endsWith('/')) {
      // Regex match
      const pattern = expected.slice(1, -1);
      passed = new RegExp(pattern).test(actual);
    } else {
      passed = actual === expected;
    }

    diffs.push({ selector, property, expected, actual, passed });

    // Also collect bounding rect for the first selector per page
    if (boundingRects.length === 0 || boundingRects.every((r) => r.selector !== selector)) {
      const rect = await page.evaluate(
        ({ sel }: { sel: string }) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { width: r.width, height: r.height, top: r.top, left: r.left };
        },
        { sel: selector },
      );
      if (rect) {
        boundingRects.push({ selector, ...rect });
      }
    }
  }

  const passed = diffs.every((d) => d.passed);

  return {
    url: config.url,
    label: config.label,
    viewport,
    diffs,
    boundingRects,
    passed,
    checkedAt: new Date().toISOString(),
  };
}

// ── Report helpers ────────────────────────────────────────────────────────────

/**
 * Load the runtime expectations config from disk.
 */
export function loadExpectations(configPath = 'tests/config/css-runtime-expectations.json'): CssPageRuntimeConfig[] {
  const raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw) as CssPageRuntimeConfig[];
}

/**
 * Write the CSS runtime report to qa-reports/css-runtime.json.
 */
export function writeCssRuntimeReport(results: CssPageRuntimeResult[]): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const report: CssRuntimeReport = {
    generatedAt: new Date().toISOString(),
    totalPages: results.length,
    passedPages: results.filter((r) => r.passed).length,
    failedPages: results.filter((r) => !r.passed).length,
    results,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');
}

/**
 * Load an existing css-runtime.json report from disk.
 */
export function loadCssRuntimeReport(reportPath = REPORT_FILE): CssRuntimeReport | null {
  if (!fs.existsSync(reportPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as CssRuntimeReport;
  } catch {
    return null;
  }
}
