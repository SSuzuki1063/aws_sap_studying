import { test, expect } from '@playwright/test';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

test.describe('Navigation — page load & L1 interactions', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/概念マップ|Concept Map/i);
  });

  test('loading message disappears after page load', async () => {
    await expect(cm.loadingMsg).toBeHidden();
  });

  test('detail placeholder is visible before any selection', async () => {
    await expect(cm.detailPlaceholder).toBeVisible();
  });

  test('detail title is hidden before any L3 selection', async () => {
    await expect(cm.detailTitle).toBeHidden();
  });

  test('L1 domain buttons are rendered', async ({ page }) => {
    const l1Buttons = page.locator('button.mm-node-btn.mm-l1-btn');
    const count = await l1Buttons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('L2 services are visible on initial load (L1 starts expanded)', async ({ page }) => {
    // L1 domains start open — L2 service buttons are immediately visible
    const l2Container = page.locator('#mm-children-dom-compute');
    await expect(l2Container).toBeVisible();
    const l2Buttons = l2Container.locator('button.mm-node-btn.mm-l2-btn');
    await expect(l2Buttons.first()).toBeVisible();
  });

  test('breadcrumb updates when L3 is selected', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const items = await cm.getBreadcrumbItems();
    expect(items.length).toBeGreaterThanOrEqual(2);
    // Last item should have aria-current="page"
    const lastBtn = cm.breadcrumb.locator('button[aria-current="page"]');
    await expect(lastBtn).toBeVisible();
  });

  test('detail panel shows content after L3 click', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    await expect(cm.detailTitle).toBeVisible();
    await expect(cm.detailPlaceholder).toBeHidden();
  });
});
