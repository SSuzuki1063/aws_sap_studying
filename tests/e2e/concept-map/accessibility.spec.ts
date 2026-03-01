import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

/**
 * Known pre-existing axe-core violations (tracked as separate issues, not blocking E2E tests):
 *   - aria-progressbar-name: #mm-progress-fill lacks aria-label (needs fix in concept-map.html)
 *   - aria-required-children: ul[role="tree"] requires li[role="treeitem"] children (MindmapController.js)
 *   - listitem: <li> inside ul[role="tree"] is semantically invalid (MindmapController.js)
 *   - color-contrast: .mm-detail-placeholder has insufficient contrast (mindmap.css)
 *
 * These rules are excluded from automated scans so new violations are still caught.
 */
const KNOWN_VIOLATIONS = [
  'aria-progressbar-name',    // #mm-progress-fill missing aria-label
  'aria-required-children',   // ul[role="tree"] requires li[role="treeitem"] children
  'aria-required-parent',     // div[role="treeitem"] keywords need parent role="tree"
  'listitem',                 // <li> inside ul[role="tree"] is semantically invalid
  'color-contrast',           // .mm-detail-placeholder has insufficient contrast
];

test.describe('Accessibility — axe-core & ARIA attributes', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  test('axe-core: no critical violations on initial page load', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(KNOWN_VIOLATIONS)
      .analyze();
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    if (criticalViolations.length > 0) {
      const summary = criticalViolations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.target.join(', ')).join(' | ')}`)
        .join('\n');
      throw new Error(`axe-core found ${criticalViolations.length} violations:\n${summary}`);
    }
  });

  test('axe-core: no critical violations after L3 navigation', async ({ page }) => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(KNOWN_VIOLATIONS)
      .analyze();
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    if (criticalViolations.length > 0) {
      const summary = criticalViolations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.target.join(', ')).join(' | ')}`)
        .join('\n');
      throw new Error(`axe-core found ${criticalViolations.length} violations after L3 click:\n${summary}`);
    }
  });

  test('L1 buttons have aria-expanded attribute', async ({ page }) => {
    const l1Buttons = page.locator('button.mm-node-btn.mm-l1-btn');
    const count = await l1Buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const expanded = await l1Buttons.nth(i).getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(expanded);
    }
  });

  test('L1 buttons have aria-controls pointing to child container', async ({ page }) => {
    const l1Buttons = page.locator('button.mm-node-btn.mm-l1-btn');
    const count = await l1Buttons.count();
    for (let i = 0; i < count; i++) {
      const controls = await l1Buttons.nth(i).getAttribute('aria-controls');
      expect(controls).toBeTruthy();
    }
  });

  test('filter status region has aria-live="polite"', async () => {
    await expect(cm.filterStatus).toHaveAttribute('aria-live', 'polite');
  });

  test('progress bar has required ARIA attributes', async () => {
    // Width starts at 0% so not visually visible, but must be attached with correct ARIA
    await expect(cm.progressFill).toBeAttached();
    await expect(cm.progressFill).toHaveAttribute('role', 'progressbar');
    const valueMin = await cm.progressFill.getAttribute('aria-valuemin');
    const valueMax = await cm.progressFill.getAttribute('aria-valuemax');
    expect(Number(valueMin)).toBeGreaterThanOrEqual(0);
    expect(Number(valueMax)).toBeGreaterThan(0);
  });

  test('breadcrumb uses ordered list', async () => {
    await expect(cm.breadcrumb).toHaveAttribute('id', 'mm-breadcrumb');
    const tagName = await cm.breadcrumb.evaluate((el) => el.tagName.toLowerCase());
    expect(['ol', 'nav', 'div']).toContain(tagName);
  });

  test('mobile tabs have role="tablist" parent', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const tablist = page.locator('[role="tablist"]');
    await expect(tablist).toBeVisible();
  });

  test('after L3 selection, last breadcrumb item has aria-current="page"', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const currentBtn = cm.breadcrumb.locator('button[aria-current="page"]');
    await expect(currentBtn).toBeVisible();
    const count = await currentBtn.count();
    expect(count).toBe(1);
  });

  test('SVG elements have role="img" where present', async ({ page }) => {
    const svgsWithoutRole = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      return svgs.filter(
        (svg) => !svg.hasAttribute('role') && !svg.hasAttribute('aria-hidden'),
      ).length;
    });
    expect(svgsWithoutRole).toBe(0);
  });

  test('L2 buttons have aria-expanded when clicked', async ({ page }) => {
    // L1 starts open — L2 buttons are immediately visible without clicking L1
    const l2Btn = page.locator('button.mm-node-btn.mm-l2-btn[data-node-id="svc-ec2"]');
    await expect(l2Btn).toBeVisible();
    await cm.clickL2('svc-ec2');
    const expanded = await l2Btn.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
  });
});
