import { test, expect } from '@playwright/test';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

/**
 * DOM snapshot tests capture structural data as text snapshots.
 * Run with --update-snapshots to generate the initial baseline.
 * These tests will fail if the DOM structure changes unexpectedly,
 * serving as regression guards.
 *
 * Note: toMatchSnapshot only accepts string/Buffer, not arrays.
 * Arrays are joined with newlines before snapshotting.
 */
test.describe('DOM Snapshots — structural regression tests', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  test('L1 domain list structure snapshot', async ({ page }) => {
    const l1Buttons = page.locator('button.mm-node-btn.mm-l1-btn');
    const count = await l1Buttons.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(((await l1Buttons.nth(i).textContent()) ?? '').trim());
    }
    // Sort for stable ordering across runs
    expect(names.sort().join('\n')).toMatchSnapshot('l1-domain-names.txt');
  });

  test('EC2 L3 concept list snapshot after expansion', async ({ page }) => {
    await cm.clickL2('svc-ec2');
    await cm.waitForL3Rendered('svc-ec2');

    const l3Buttons = page.locator('#mm-children-svc-ec2 button.mm-l3-btn');
    const count = await l3Buttons.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(((await l3Buttons.nth(i).textContent()) ?? '').trim());
    }
    expect(names.join('\n')).toMatchSnapshot('svc-ec2-l3-concepts.txt');
  });

  test('placement-group detail panel content snapshot', async ({ page }) => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    await expect(cm.detailTitle).toBeVisible();

    const titleText = ((await cm.detailTitle.textContent()) ?? '').trim();
    const badges = await cm.getCrosslinkBadges();
    const links = await cm.getHtmlResourceLinks();

    const snapshot = [
      `title: ${titleText}`,
      `badges: ${badges.sort().join(', ')}`,
      `links: ${links.map((l) => l.href).sort().join(', ')}`,
    ].join('\n');
    expect(snapshot).toMatchSnapshot('placement-group-detail.txt');
  });

  test('filter section tag IDs snapshot', async ({ page }) => {
    const tagBtns = page.locator('button.mm-tag-btn');
    const count = await tagBtns.count();
    const tagIds: string[] = [];
    for (let i = 0; i < count; i++) {
      tagIds.push((await tagBtns.nth(i).getAttribute('data-tag-id')) ?? '');
    }
    expect(tagIds.sort().join('\n')).toMatchSnapshot('filter-tag-ids.txt');
  });

  test('breadcrumb after L3 navigation snapshot', async ({ page }) => {
    await cm.navigateTo('dom-compute', 'svc-ec2', 'con-ec2-placement-group');
    const items = await cm.getBreadcrumbItems();
    expect(items.join('\n')).toMatchSnapshot('breadcrumb-l3-navigation.txt');
  });
});
