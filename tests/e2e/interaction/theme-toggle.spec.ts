import { test, expect } from '@playwright/test';
import { IndexPage, ConceptMapPage } from '../helpers';

test.describe('Theme toggle interaction', () => {
  test('toggle switches theme from light to dark and back', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(false);

    await indexPage.themeToggleComponent.toggle();
    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(true);

    await indexPage.themeToggleComponent.toggle();
    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(false);
  });

  test('theme persists across page navigation', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await indexPage.themeToggleComponent.toggle();
    expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(true);

    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();
    expect(await conceptMapPage.themeToggleComponent.isDarkMode()).toBe(true);
  });
});
