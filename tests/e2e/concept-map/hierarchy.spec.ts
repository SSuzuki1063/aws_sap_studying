import { test, expect } from '@playwright/test';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

test.describe('Hierarchy — L1 → L2 → L3 → L4 expansion', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  // L1 domains start EXPANDED by default (aria-expanded='true').
  // Clicking L1 toggles: first click closes, second click re-opens.

  test('L1 children container is visible on initial load', async ({ page }) => {
    // All L1 domains start expanded — no click needed
    await expect(page.locator('#mm-children-dom-compute')).toBeVisible();
  });

  test('L1 toggle: click closes, second click re-opens', async ({ page }) => {
    // Initially open
    await expect(page.locator('#mm-children-dom-compute')).toBeVisible();
    // First click: closes
    await cm.clickL1('dom-compute');
    await expect(page.locator('#mm-children-dom-compute')).toBeHidden();
    // Second click: re-opens
    await cm.clickL1('dom-compute');
    await expect(page.locator('#mm-children-dom-compute')).toBeVisible();
  });

  test('L2 click expands L3 children container', async ({ page }) => {
    // L1 starts open so L2 button is visible
    await cm.clickL2('svc-ec2');
    await expect(page.locator('#mm-children-svc-ec2')).toBeVisible();
  });

  test('L3 items render after L2 expansion (no loading spinner)', async ({ page }) => {
    await cm.clickL2('svc-ec2');
    await cm.waitForL3Rendered('svc-ec2');
    const l3Buttons = page.locator('#mm-children-svc-ec2 button.mm-l3-btn');
    const count = await l3Buttons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('EC2 L3 contains expected concepts', async ({ page }) => {
    await cm.clickL2('svc-ec2');
    await cm.waitForL3Rendered('svc-ec2');

    const l3Container = page.locator('#mm-children-svc-ec2');
    await expect(
      l3Container.locator('button[data-node-id="con-ec2-placement-group"]'),
    ).toBeVisible();
    await expect(
      l3Container.locator('button[data-node-id="con-ec2-auto-scaling"]'),
    ).toBeVisible();
    await expect(
      l3Container.locator('button[data-node-id="con-ec2-purchase-options"]'),
    ).toBeVisible();
  });

  test('L3 click shows detail panel with matching title', async () => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    await expect(cm.detailTitle).toContainText('プレイスメントグループ');
  });

  test('L4 keyword items appear after L3 click', async ({ page }) => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const keywords = page.locator('.keyword-item');
    const count = await keywords.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('L2 toggle: second click collapses L3 children', async ({ page }) => {
    await cm.clickL2('svc-ec2');
    await expect(page.locator('#mm-children-svc-ec2')).toBeVisible();
    await cm.clickL2('svc-ec2');
    await expect(page.locator('#mm-children-svc-ec2')).toBeHidden();
  });

  test('all 10 L2 services are present in the DOM', async ({ page }) => {
    const serviceIds = [
      'svc-ec2', 'svc-iam', 'svc-vpc', 'svc-lambda', 'svc-rds',
      'svc-s3', 'svc-cloudfront', 'svc-route53', 'svc-elb', 'svc-cloudwatch',
    ];
    for (const id of serviceIds) {
      const btn = page.locator(`button.mm-node-btn.mm-l2-btn[data-node-id="${id}"]`);
      expect(await btn.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('progress bar is present and has valid aria attributes', async () => {
    // Progress fill starts at width:0% so it has no visible area, but must be in the DOM
    await expect(cm.progressFill).toBeAttached();
    const role = await cm.progressFill.getAttribute('role');
    expect(role).toBe('progressbar');
    const valuenow = await cm.progressFill.getAttribute('aria-valuenow');
    expect(Number(valuenow)).toBeGreaterThanOrEqual(0);
    const valuemax = await cm.progressFill.getAttribute('aria-valuemax');
    expect(Number(valuemax)).toBeGreaterThan(0);
  });
});
