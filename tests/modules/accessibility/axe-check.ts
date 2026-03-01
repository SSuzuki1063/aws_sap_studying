/**
 * axe-core accessibility check helper.
 *
 * Extracted from tests/e2e/concept-map/accessibility.spec.ts so the
 * same KNOWN_VIOLATIONS list and AxeBuilder chain can be reused across
 * QA specs without duplication.
 */

import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Pre-existing violations that are tracked separately and excluded from
 * automated QA scans so that NEW violations are still caught.
 *
 * These match the list in accessibility.spec.ts exactly.
 */
export const KNOWN_VIOLATIONS = [
  'aria-progressbar-name',    // #mm-progress-fill missing aria-label
  'aria-required-children',   // ul[role="tree"] requires li[role="treeitem"] children
  'aria-required-parent',     // div[role="treeitem"] keywords need parent role="tree"
  'listitem',                 // <li> inside ul[role="tree"] is semantically invalid
  'color-contrast',           // .mm-detail-placeholder has insufficient contrast
] as const;

export interface AxeCheckResult {
  url: string;
  violationCount: number;
  criticalCount: number;
  violations: Array<{
    id: string;
    impact: string | undefined;
    description: string;
    nodes: string[];
  }>;
  passed: boolean;
  checkedAt: string;
}

/**
 * Run axe-core WCAG 2.1 AA scan on the current page.
 * Excludes KNOWN_VIOLATIONS so only regressions are reported.
 *
 * @param page - Playwright page (already navigated)
 * @param url  - URL label for reporting
 */
export async function runAxeCheck(page: Page, url: string): Promise<AxeCheckResult> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules([...KNOWN_VIOLATIONS])
    .analyze();

  const criticalViolations = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );

  return {
    url,
    violationCount: results.violations.length,
    criticalCount: criticalViolations.length,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => n.target.join(', ')),
    })),
    passed: criticalViolations.length === 0,
    checkedAt: new Date().toISOString(),
  };
}
