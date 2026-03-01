import { test, expect } from '@playwright/test';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

test.describe('Mobile tabs — viewport switching & tab state', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  test('desktop (1280px): both columns are visible without tabs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    // On desktop, columns should NOT have the hidden class
    const hiddenCols = page.locator('.mm-col--hidden');
    const count = await hiddenCols.count();
    expect(count).toBe(0);
  });

  test('mobile (390px): tab bar is visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(cm.tabMap).toBeVisible();
    await expect(cm.tabDetail).toBeVisible();
  });

  test('mobile: map tab is active by default', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(cm.tabMap).toHaveAttribute('aria-selected', 'true');
    await expect(cm.tabMap).toHaveClass(/mm-tab--active/);
  });

  test('mobile: clicking detail tab switches active state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await cm.switchToDetailTab();
    await expect(cm.tabDetail).toHaveAttribute('aria-selected', 'true');
    await expect(cm.tabDetail).toHaveClass(/mm-tab--active/);
    await expect(cm.tabMap).toHaveAttribute('aria-selected', 'false');
  });

  test('mobile: map tab has role="tab"', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(cm.tabMap).toHaveAttribute('role', 'tab');
    await expect(cm.tabDetail).toHaveAttribute('role', 'tab');
  });

  test('mobile: selecting L3 auto-switches to detail tab', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    // Ensure we start on map tab
    await cm.switchToMapTab();
    await expect(cm.tabMap).toHaveClass(/mm-tab--active/);

    // Navigate to an L3 concept — app should auto-switch to detail tab
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    await expect(cm.tabDetail).toHaveClass(/mm-tab--active/, { timeout: 6_000 });
  });

  test('mobile: switching back to map tab works', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await cm.switchToDetailTab();
    await cm.switchToMapTab();
    await expect(cm.tabMap).toHaveAttribute('aria-selected', 'true');
  });

  test('mobile: map column hidden when detail tab is active', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await cm.switchToDetailTab();
    const hiddenCols = page.locator('.mm-col--hidden');
    const count = await hiddenCols.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
