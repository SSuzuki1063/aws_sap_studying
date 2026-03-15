import { test, expect } from '@playwright/test';
import { LearningResourcesPage } from '../helpers';

test.describe('Learning Resources Filters', () => {
  let lrPage: LearningResourcesPage;

  test.beforeEach(async ({ page }) => {
    lrPage = new LearningResourcesPage(page);
    await lrPage.goto();
  });

  // --- Learning Mode Preset ---

  test('selecting a learning mode applies preset filters', async () => {
    await lrPage.selectLearningMode('beginner');

    // Difficulty should be set to beginner
    const diffVal = await lrPage.difficultyFilter.inputValue();
    expect(diffVal).toBe('beginner');

    // Filter status should be visible
    const statusText = await lrPage.getFilterStatusText();
    expect(statusText).toContain('リソース');
  });

  test('clicking active mode deactivates it and clears filters', async () => {
    // Activate
    await lrPage.selectLearningMode('beginner');
    let diffVal = await lrPage.difficultyFilter.inputValue();
    expect(diffVal).toBe('beginner');

    // Deactivate by clicking again
    await lrPage.selectLearningMode('beginner');
    diffVal = await lrPage.difficultyFilter.inputValue();
    expect(diffVal).toBe('');
  });

  test('changing filter after mode deactivates mode indicator', async ({ page }) => {
    await lrPage.selectLearningMode('networking-focus');

    // Verify mode is active
    const card = page.locator('.learning-mode-card[data-mode-id="networking-focus"]');
    expect(await card.getAttribute('aria-pressed')).toBe('true');

    // Change a filter manually
    await lrPage.setFilter('difficultyFilter', 'advanced');

    // Mode should be deactivated
    expect(await card.getAttribute('aria-pressed')).toBe('false');
  });

  // --- Domain Card ↔ Domain Filter Sync ---

  test('clicking domain card sets domain filter dropdown', async () => {
    await lrPage.selectDomain(1);

    const domainVal = await lrPage.domainFilter.inputValue();
    expect(domainVal).toBe('1');
  });

  test('domain card and domain filter stay in sync', async ({ page }) => {
    // Click domain card 2
    await lrPage.selectDomain(2);
    expect(await lrPage.domainFilter.inputValue()).toBe('2');

    // Click same card again to deselect
    await lrPage.selectDomain(2);
    expect(await lrPage.domainFilter.inputValue()).toBe('');
  });

  // --- Tags Search ---

  test('search matches resource tags "comparison"', async () => {
    await lrPage.searchFor('comparison');
    const count = await lrPage.searchResultsCount.textContent();
    expect(parseInt(count ?? '0', 10)).toBeGreaterThan(0);
  });

  test('search matches resource tags "ha"', async () => {
    await lrPage.searchFor('ha');
    const count = await lrPage.searchResultsCount.textContent();
    expect(parseInt(count ?? '0', 10)).toBeGreaterThan(0);
  });

  // --- 0件時表示 ---

  test('shows no-results message when filters eliminate all resources', async () => {
    // Set very restrictive filters: beginner + domain 4 + time 60+
    await lrPage.setFilter('difficultyFilter', 'advanced');
    await lrPage.setFilter('timeFilter', '60+');
    await lrPage.setFilter('categoryFilter', 'migration');

    const visible = await lrPage.getVisibleResourceCount();
    if (visible === 0) {
      expect(await lrPage.isFilterNoResultsVisible()).toBe(true);
    }
  });

  test('no-results message disappears when filters are cleared', async () => {
    // Apply restrictive filters first
    await lrPage.setFilter('difficultyFilter', 'advanced');
    await lrPage.setFilter('timeFilter', '60+');
    await lrPage.setFilter('categoryFilter', 'migration');

    // Clear filters
    await lrPage.clearFilters();
    expect(await lrPage.isFilterNoResultsVisible()).toBe(false);
  });

  // --- Filter Status Summary ---

  test('filter status shows condition summary', async () => {
    await lrPage.setFilter('categoryFilter', 'networking');

    const statusText = await lrPage.getFilterStatusText();
    expect(statusText).toContain('カテゴリ');
    expect(statusText).toContain('リソース');
  });

  // --- Keyboard Navigation ---

  test('learning mode cards are keyboard accessible', async ({ page }) => {
    const firstCard = lrPage.learningModeCards.first();
    await firstCard.focus();
    await page.keyboard.press('Enter');

    // Should have activated the mode
    expect(await firstCard.getAttribute('aria-pressed')).toBe('true');
  });

  test('domain cards are keyboard accessible', async ({ page }) => {
    const firstCard = lrPage.domainCards.first();
    await firstCard.focus();
    await page.keyboard.press('Enter');

    // Domain filter should be set
    const domainVal = await lrPage.domainFilter.inputValue();
    expect(domainVal).not.toBe('');
  });

  test('filter reset button is keyboard accessible', async ({ page }) => {
    // Apply a filter first so reset button appears
    await lrPage.setFilter('categoryFilter', 'networking');

    // Tab to reset button and press Enter
    await lrPage.filterClearBtn.focus();
    await page.keyboard.press('Enter');

    // Filters should be cleared
    expect(await lrPage.categoryFilter.inputValue()).toBe('');
  });
});
