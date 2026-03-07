import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for learning-resources.html.
 * Encapsulates category navigation, resource lists, sidebar TOC, and search.
 */
export class LearningResourcesPage extends BasePage {
  readonly pagePath = '/aws_sap_studying/learning-resources.html';

  // ── Page-specific locators ──────────────────────────────────────────────
  readonly categoryNav: Locator;
  readonly categoryLinks: Locator;
  readonly resourceList: Locator;
  readonly sidebarToc: Locator;
  readonly tocToggle: Locator;
  readonly container: Locator;
  readonly statsGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryNav   = page.locator('.category-nav');
    this.categoryLinks = page.locator('.category-link');
    this.resourceList  = page.locator('.resource-list');
    this.sidebarToc    = page.locator('#sidebar-toc');
    this.tocToggle     = page.locator('#sidebar-toc-toggle');
    this.container     = page.locator('.container');
    this.statsGrid     = page.locator('.stats-grid');
  }

  /** Wait for the main container to be visible (page-specific load signal). */
  override async waitForReady(): Promise<void> {
    await this.container.waitFor({ state: 'visible', timeout: 10_000 });
  }

  // ── Categories ──────────────────────────────────────────────────────────

  /** Get all category links with name, resource count, and href. */
  async getCategories(): Promise<Array<{ name: string; count: string; href: string }>> {
    const links = this.categoryLinks;
    const count = await links.count();
    const result: Array<{ name: string; count: string; href: string }> = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      result.push({
        name: ((await link.locator('.category-link-text').textContent()) ?? '').trim(),
        count: ((await link.locator('.category-link-count').textContent()) ?? '').trim(),
        href: (await link.getAttribute('href')) ?? '',
      });
    }
    return result;
  }

  /** Get the number of category links. */
  async getCategoryCount(): Promise<number> {
    return this.categoryLinks.count();
  }

  // ── Resources ───────────────────────────────────────────────────────────

  /** Get all resource items as { text, href } pairs. */
  async getResourceItems(): Promise<Array<{ text: string; href: string }>> {
    const items = this.resourceList.locator('a');
    const count = await items.count();
    const result: Array<{ text: string; href: string }> = [];
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      result.push({
        text: ((await item.textContent()) ?? '').trim(),
        href: (await item.getAttribute('href')) ?? '',
      });
    }
    return result;
  }

  // ── Sidebar TOC ─────────────────────────────────────────────────────────

  /** Toggle the sidebar table of contents open/closed. */
  async toggleSidebarToc(): Promise<void> {
    await this.tocToggle.click();
  }

  // ── Search ──────────────────────────────────────────────────────────────

  /** Type a search query and wait for results to appear. */
  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchResults.waitFor({ state: 'visible', timeout: 5_000 });
  }

  /** Clear the search input. */
  async clearSearch(): Promise<void> {
    await this.searchClear.click();
  }
}
