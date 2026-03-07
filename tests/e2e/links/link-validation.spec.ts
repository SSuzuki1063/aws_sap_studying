import { test, expect } from '@playwright/test';
import { IndexPage, ConceptMapPage, LearningResourcesPage } from '../helpers';

test.describe('Link validation', () => {
  const internalLinkSet = new Set<string>();

  test('index page internal links return 200', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    const allLinks = await indexPage.getAllLinks();
    const internal = allLinks.filter((l) =>
      l.href.startsWith('/aws_sap_studying/') && !l.href.startsWith('/aws_sap_studying/#'),
    );

    for (const link of internal) {
      if (internalLinkSet.has(link.href)) continue;
      internalLinkSet.add(link.href);
      const response = await page.request.get(link.href);
      expect(response.status(), `Broken link: ${link.href}`).toBe(200);
    }
  });

  test('concept-map page internal links return 200', async ({ page }) => {
    const conceptMapPage = new ConceptMapPage(page);
    await conceptMapPage.goto();

    const allLinks = await conceptMapPage.getAllLinks();
    const internal = allLinks.filter((l) =>
      l.href.startsWith('/aws_sap_studying/') && !l.href.startsWith('/aws_sap_studying/#'),
    );

    for (const link of internal) {
      if (internalLinkSet.has(link.href)) continue;
      internalLinkSet.add(link.href);
      const response = await page.request.get(link.href);
      expect(response.status(), `Broken link: ${link.href}`).toBe(200);
    }
  });

  test('learning-resources page internal links return 200', async ({ page }) => {
    const lrPage = new LearningResourcesPage(page);
    await lrPage.goto();

    const allLinks = await lrPage.getAllLinks();
    const internal = allLinks.filter((l) =>
      l.href.startsWith('/aws_sap_studying/') && !l.href.startsWith('/aws_sap_studying/#'),
    );

    for (const link of internal) {
      if (internalLinkSet.has(link.href)) continue;
      internalLinkSet.add(link.href);
      const response = await page.request.get(link.href);
      expect(response.status(), `Broken link: ${link.href}`).toBe(200);
    }
  });

  test('external links have valid URL format', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    const allLinks = await indexPage.getAllLinks();
    const external = allLinks.filter((l) =>
      l.href.startsWith('http://') || l.href.startsWith('https://'),
    );

    for (const link of external) {
      expect(() => new URL(link.href), `Invalid URL: ${link.href}`).not.toThrow();
    }
  });

  test('no empty href attributes on index page', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    const allLinks = await indexPage.getAllLinks();
    const emptyHrefs = allLinks.filter(
      (l) => l.href === '' || l.href === '#',
    );
    expect(emptyHrefs, 'Found links with empty href').toHaveLength(0);
  });
});
