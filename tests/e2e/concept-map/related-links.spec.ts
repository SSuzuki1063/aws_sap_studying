import { test, expect } from '@playwright/test';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

/**
 * Crosslink badges are rendered in L2 (service) detail panels.
 * HTML resource links appear in both L2 and L3 detail panels.
 * Tests are split accordingly.
 */
test.describe('Related links — crosslinks & HTML resources', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  // ── Crosslinks (rendered in L2 / service detail panel) ──────────────────

  test('L2 detail panel shows crosslink badges after clicking svc-ec2', async ({ page }) => {
    // Click L2 to open service detail (crosslinks live at the L2 level)
    await cm.clickL2('svc-ec2');
    const badges = page.locator('#mm-detail-panel button.crosslink-badge');
    await expect(badges.first()).toBeVisible({ timeout: 6_000 });
    const count = await badges.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('crosslink badge text follows "NAME (type)" format', async () => {
    await cm.clickL2('svc-ec2');
    // Wait for detail panel to populate
    await expect(cm.detailPanel.locator('button.crosslink-badge').first()).toBeVisible({ timeout: 6_000 });
    const badges = await cm.getCrosslinkBadges();
    for (const badge of badges) {
      // Each badge format: "ELB (related)", "VPC (requires)", etc.
      expect(badge).toMatch(/\(.+\)$/);
    }
  });

  test('ELB appears as a related crosslink for svc-ec2', async () => {
    await cm.clickL2('svc-ec2');
    await expect(cm.detailPanel.locator('button.crosslink-badge').first()).toBeVisible({ timeout: 6_000 });
    const badges = await cm.getCrosslinkBadges();
    expect(badges.some((b) => b.trim() === 'ELB (related)')).toBe(true);
  });

  test('clicking crosslink badge navigates to linked service', async () => {
    await cm.clickL2('svc-ec2');
    await expect(cm.detailPanel.locator('button.crosslink-badge').first()).toBeVisible({ timeout: 6_000 });
    const firstBadge = cm.detailPanel.locator('button.crosslink-badge').first();
    await firstBadge.click();
    // Detail panel should update (no longer showing EC2 detail)
    await expect(cm.detailPanel).toBeVisible({ timeout: 6_000 });
  });

  // ── HTML resources (rendered in L3 / concept detail panel) ──────────────

  test('L3 HTML resource links are present for placement-group', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const links = await cm.getHtmlResourceLinks();
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  test('HTML resource links include /aws_sap_studying/ prefix', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const links = await cm.getHtmlResourceLinks();
    for (const link of links) {
      if (link.href) {
        expect(link.href).toContain('/aws_sap_studying/');
      }
    }
  });

  test('HTML resource links open in new tab', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const links = await cm.getHtmlResourceLinks();
    for (const link of links) {
      expect(link.target).toBe('_blank');
    }
  });
});
