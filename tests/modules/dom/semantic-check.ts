/**
 * DOM semantic structure verification helper.
 *
 * Extracted from tests/e2e/concept-map/dom-snapshot.spec.ts patterns.
 * Provides reusable checks for DOM structure validation in QA specs.
 */

import type { Page } from '@playwright/test';

export interface DomCheckResult {
  check: string;
  passed: boolean;
  actual: unknown;
  expected: unknown;
}

export interface SemanticCheckResult {
  url: string;
  checks: DomCheckResult[];
  passed: boolean;
  checkedAt: string;
}

/**
 * Verify that an element exists and has an expected attribute value.
 */
export async function checkAttribute(
  page: Page,
  selector: string,
  attribute: string,
  expected: string,
): Promise<DomCheckResult> {
  const actual = await page.evaluate(
    ({ sel, attr }: { sel: string; attr: string }) => {
      const el = document.querySelector(sel);
      return el ? el.getAttribute(attr) : null;
    },
    { sel: selector, attr: attribute },
  );

  return {
    check: `${selector}[${attribute}]`,
    passed: actual === expected,
    actual,
    expected,
  };
}

/**
 * Count elements matching a selector and verify the count is within bounds.
 */
export async function checkElementCount(
  page: Page,
  selector: string,
  min: number,
  max?: number,
): Promise<DomCheckResult> {
  const count = await page.evaluate(
    ({ sel }: { sel: string }) => document.querySelectorAll(sel).length,
    { sel: selector },
  );

  const upperBound = max ?? Infinity;
  const passed = count >= min && count <= upperBound;

  return {
    check: `count(${selector})`,
    passed,
    actual: count,
    expected: max !== undefined ? `${min}..${max}` : `>=${min}`,
  };
}

/**
 * Verify heading hierarchy on a page — h2 before h3, no skipped levels.
 * Returns a simplified pass/fail result rather than enumerating every heading.
 */
export async function checkHeadingHierarchy(page: Page): Promise<DomCheckResult> {
  const issues = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    const skips: string[] = [];
    let prev = 0;
    for (const h of headings) {
      const level = parseInt(h.tagName[1], 10);
      if (prev > 0 && level > prev + 1) {
        skips.push(`h${prev} → h${level}`);
      }
      prev = level;
    }
    return skips;
  });

  return {
    check: 'heading-hierarchy',
    passed: issues.length === 0,
    actual: issues.length === 0 ? 'no skips' : issues.join(', '),
    expected: 'no skips',
  };
}
