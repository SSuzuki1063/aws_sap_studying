import { test, expect } from '@playwright/test';
import { IndexPage, ConceptMapPage, LearningResourcesPage } from '../helpers';

const screenshotOpts = {
  maxDiffPixelRatio: 0.005,
  animations: 'disabled' as const,
};

test.describe('Visual regression — desktop light', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('index page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();
    await expect(page).toHaveScreenshot('index-desktop-light.png', screenshotOpts);
  });

  test('concept-map page', async ({ page }) => {
    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();
    await expect(page).toHaveScreenshot('concept-map-desktop-light.png', screenshotOpts);
  });

  test('learning-resources page', async ({ page }) => {
    const lrPage = new LearningResourcesPage(page);
    await lrPage.goto();
    await expect(page).toHaveScreenshot('learning-resources-desktop-light.png', screenshotOpts);
  });
});

test.describe('Visual regression — mobile light', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('index page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();
    await expect(page).toHaveScreenshot('index-mobile-light.png', screenshotOpts);
  });

  test('concept-map page', async ({ page }) => {
    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();
    await expect(page).toHaveScreenshot('concept-map-mobile-light.png', screenshotOpts);
  });

  test('learning-resources page', async ({ page }) => {
    const lrPage = new LearningResourcesPage(page);
    await lrPage.goto();
    await expect(page).toHaveScreenshot('learning-resources-mobile-light.png', screenshotOpts);
  });
});

test.describe('Visual regression — desktop dark', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('index page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();
    await indexPage.themeToggleComponent.toggle();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('index-desktop-dark.png', screenshotOpts);
  });

  test('concept-map page', async ({ page }) => {
    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();
    await conceptMapPage.themeToggleComponent.toggle();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('concept-map-desktop-dark.png', screenshotOpts);
  });

  test('learning-resources page', async ({ page }) => {
    const lrPage = new LearningResourcesPage(page);
    await lrPage.goto();
    await lrPage.themeToggleComponent.toggle();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('learning-resources-desktop-dark.png', screenshotOpts);
  });
});
