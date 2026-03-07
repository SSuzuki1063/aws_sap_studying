import { test, expect } from '@playwright/test';
import { IndexPage } from '../helpers';

test.describe('Scroll-to-top interaction', () => {
  test('button appears after scrolling down', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    // Initially hidden
    expect(await indexPage.scrollToTopComponent.isVisible()).toBe(false);

    // Scroll down 500px
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Button should now be visible
    await indexPage.scrollToTopComponent.waitForVisible();
    expect(await indexPage.scrollToTopComponent.isVisible()).toBe(true);
  });

  test('clicking button scrolls to top', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    await indexPage.scrollToTopComponent.waitForVisible();

    // Click scroll-to-top
    await indexPage.scrollToTopComponent.click();
    await page.waitForTimeout(500);

    // Verify scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });
});
