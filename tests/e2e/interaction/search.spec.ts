import { test, expect } from '@playwright/test';
import { IndexPage, LearningResourcesPage } from '../helpers';

test.describe('Search interaction', () => {
  test('search returns results for known term on index page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await indexPage.search.fill('VPC');
    expect(await indexPage.search.hasResults()).toBe(true);
    expect(await indexPage.search.getResultCount()).not.toBe('0');
  });

  test('search shows no-results for unknown term', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await indexPage.search.fill('xyznonexistent');
    await page.waitForTimeout(300);
    const noResultsVisible = await indexPage.search.noResults.isVisible();
    expect(noResultsVisible).toBe(true);
  });

  test('search clear resets state', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    // Fill search
    await indexPage.search.fill('VPC');
    expect(await indexPage.search.hasResults()).toBe(true);

    // Clear
    await indexPage.search.clear();
    const inputValue = await indexPage.search.input.inputValue();
    expect(inputValue).toBe('');
  });

  test('search works on learning-resources page', async ({ page }) => {
    const lrPage = new LearningResourcesPage(page);
    await lrPage.goto();

    await lrPage.search.fill('VPC');
    expect(await lrPage.search.hasResults()).toBe(true);
    expect(await lrPage.search.getResultCount()).not.toBe('0');
  });
});
