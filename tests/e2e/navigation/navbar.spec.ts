import { test, expect } from '@playwright/test';
import { IndexPage, ConceptMapPage, LearningResourcesPage } from '../helpers';

test.describe('Navbar regression', () => {
  test('navbar contains expected links on index page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    const links = await indexPage.navbar.getLinks();
    // Root index.html has 7 nav links (profile, learning-resources, roadmap, exam_guide, knowledge-base, quiz, bookmark)
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  test('navbar contains expected links on concept-map page', async ({ page }) => {
    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();

    const links = await conceptMapPage.navbar.getLinks();
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  test('navbar contains expected links on learning-resources page', async ({ page }) => {
    const lrPage = new LearningResourcesPage(page);
    await lrPage.goto();

    const links = await lrPage.navbar.getLinks();
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  test('nav link navigates to learning-resources page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await indexPage.navbar.navigateTo('learning-resources');
    expect(page.url()).toContain('learning-resources.html');
  });

  test('logo navigates back to index page', async ({ page }) => {
    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();

    // The logo link in the header navigates to index
    await conceptMapPage.navbar.navigateTo('index');
    expect(page.url()).toContain('index.html');
  });

  test('cross-page round-trip via header links', async ({ page }) => {
    // index -> learning-resources (via nav link)
    const indexPage = new IndexPage(page);
    await indexPage.goto();
    await indexPage.navbar.navigateTo('learning-resources');
    expect(page.url()).toContain('learning-resources.html');

    // learning-resources -> index (via logo link)
    const lrPage = new LearningResourcesPage(page);
    await lrPage.navbar.navigateTo('index');
    expect(page.url()).toContain('index.html');
  });

  test('mobile hamburger opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const indexPage = new IndexPage(page);
    await indexPage.goto();

    // Initially closed
    expect(await indexPage.navbar.isOpen()).toBe(false);

    // Open
    await indexPage.navbar.openMobile();
    expect(await indexPage.navbar.isOpen()).toBe(true);

    // Close
    await indexPage.navbar.closeMobile();
    expect(await indexPage.navbar.isOpen()).toBe(false);
  });

  test('mobile nav links are visible when open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await indexPage.navbar.openMobile();
    await expect(indexPage.navbar.mainNav).toBeVisible();
  });
});
