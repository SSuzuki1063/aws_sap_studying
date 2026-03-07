import { test, expect } from '@playwright/test';
import { IndexPage, ConceptMapPage } from '../helpers';

/**
 * Theme toggle tests.
 * Note: The theme toggle button (.theme-toggle) only exists in the Astro-built
 * dist/ output. The root HTML files served by server.py do not include it.
 * These tests are skipped when the toggle button is not present on the page.
 */
test.describe('Theme toggle interaction', () => {
  test('toggle switches theme from light to dark and back', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    // Skip if theme toggle is not present (root HTML lacks it)
    const toggleVisible = await indexPage.themeToggle.isVisible().catch(() => false);
    test.skip(!toggleVisible, 'Theme toggle not present on this page');

    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(false);

    await indexPage.themeToggleComponent.toggle();
    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(true);

    await indexPage.themeToggleComponent.toggle();
    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(false);
  });

  test('theme persists across page navigation', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    const toggleVisible = await indexPage.themeToggle.isVisible().catch(() => false);
    test.skip(!toggleVisible, 'Theme toggle not present on this page');

    await indexPage.themeToggleComponent.toggle();
    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(true);

    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();
    expect(await conceptMapPage.themeToggleComponent.isDarkMode()).toBe(true);
  });
});
