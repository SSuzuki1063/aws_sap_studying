import { test, expect } from '@playwright/test';
import { ConceptMapPage } from '../helpers/ConceptMapPage';

test.describe('Filters — tag buttons, OR/AND logic, clear', () => {
  let cm: ConceptMapPage;

  test.beforeEach(async ({ page }) => {
    cm = new ConceptMapPage(page);
    await cm.goto();
  });

  test('filter tag buttons are rendered', async ({ page }) => {
    const tagButtons = page.locator('button.mm-tag-btn');
    const count = await tagButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('clear button is hidden before any filter is applied', async () => {
    await expect(cm.filterClear).toBeHidden();
  });

  test('filter status is initially empty', async () => {
    const text = (await cm.filterStatus.textContent()) ?? '';
    expect(text.trim()).toBe('');
  });

  test('applying one axis filter activates tag button', async ({ page }) => {
    await cm.applyAxisFilter('axis-security');
    const btn = page.locator('button.mm-tag-btn[data-tag-id="axis-security"]');
    await expect(btn).toHaveClass(/mm-tag-active/);
  });

  test('filter status shows count after one filter applied', async () => {
    await cm.applyAxisFilter('axis-security');
    await expect(cm.filterStatus).toContainText('1個のフィルタ適用中');
  });

  test('clear button appears after filter is applied', async () => {
    await cm.applyAxisFilter('axis-security');
    await expect(cm.filterClear).toBeVisible();
  });

  test('same-type filters use OR logic (axis-security OR axis-cost)', async ({ page }) => {
    // Apply two axis filters; services with EITHER tag should be visible
    await cm.applyAxisFilter('axis-security');
    await cm.applyAxisFilter('axis-cost');
    await expect(cm.filterStatus).toContainText('2個のフィルタ適用中');

    // At least some services should remain visible (not all filtered out)
    const visibleItems = page.locator('li.mm-l2-item:not(.mm-filtered)');
    const count = await visibleItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('clear button removes all active filters', async ({ page }) => {
    await cm.applyAxisFilter('axis-security');
    await cm.clearFilters();

    const btn = page.locator('button.mm-tag-btn[data-tag-id="axis-security"]');
    await expect(btn).not.toHaveClass(/mm-tag-active/);
    await expect(cm.filterClear).toBeHidden();
    const text = (await cm.filterStatus.textContent()) ?? '';
    expect(text.trim()).toBe('');
  });

  test('clicking active filter deactivates it (toggle off)', async ({ page }) => {
    await cm.applyAxisFilter('axis-security');
    const btn = page.locator('button.mm-tag-btn[data-tag-id="axis-security"]');
    await expect(btn).toHaveClass(/mm-tag-active/);

    // Click again to deactivate
    await btn.click();
    await expect(btn).not.toHaveClass(/mm-tag-active/);
    await expect(cm.filterClear).toBeHidden();
  });
});
