import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchComponent } from '../components/SearchComponent';

/**
 * Page Object Model for learning-resources.html.
 * Encapsulates category navigation, resource lists, sidebar TOC, search,
 * learning mode selection, domain navigation, and filter controls.
 */
export class LearningResourcesPage extends BasePage {
  readonly pagePath = '/aws_sap_studying/learning-resources.html';

  // ── Component Objects ─────────────────────────────────────────────────────
  readonly search: SearchComponent;

  // ── Page-specific locators ──────────────────────────────────────────────
  readonly categoryNav: Locator;
  readonly categoryLinks: Locator;
  readonly resourceList: Locator;
  readonly sidebarToc: Locator;
  readonly tocToggle: Locator;
  readonly container: Locator;
  readonly statsGrid: Locator;

  // ── Filter & Mode locators ────────────────────────────────────────────────
  readonly learningModeCards: Locator;
  readonly domainCards: Locator;
  readonly categoryFilter: Locator;
  readonly serviceFilter: Locator;
  readonly domainFilter: Locator;
  readonly difficultyFilter: Locator;
  readonly timeFilter: Locator;
  readonly filterClearBtn: Locator;
  readonly filterStatus: Locator;
  readonly filterNoResults: Locator;

  constructor(page: Page) {
    super(page);
    this.search        = new SearchComponent(page);
    this.categoryNav   = page.locator('.category-nav');
    this.categoryLinks = page.locator('.category-link');
    this.resourceList  = page.locator('.resource-list');
    this.sidebarToc    = page.locator('#sidebar-toc');
    this.tocToggle     = page.locator('#sidebar-toc-toggle');
    this.container     = page.locator('.container');
    this.statsGrid     = page.locator('.stats-grid');

    // Filter & Mode
    this.learningModeCards = page.locator('.learning-mode-card');
    this.domainCards       = page.locator('.domain-card');
    this.categoryFilter    = page.locator('#categoryFilter');
    this.serviceFilter     = page.locator('#serviceFilter');
    this.domainFilter      = page.locator('#domainFilter');
    this.difficultyFilter  = page.locator('#difficultyFilter');
    this.timeFilter        = page.locator('#timeFilter');
    this.filterClearBtn    = page.locator('#filterClear');
    this.filterStatus      = page.locator('#filterStatus');
    this.filterNoResults   = page.locator('#filterNoResults');
  }

  /** Wait for the main container to be visible (page-specific load signal). */
  override async waitForReady(): Promise<void> {
    await this.container.waitFor({ state: 'visible', timeout: 10_000 });
  }

  // ── Learning Mode ─────────────────────────────────────────────────────────

  /** Select a learning mode by its data-mode-id. */
  async selectLearningMode(modeId: string): Promise<void> {
    await this.page.locator(`.learning-mode-card[data-mode-id="${modeId}"]`).click();
  }

  /** Check if a learning mode card is active. */
  async isModeActive(modeId: string): Promise<boolean> {
    const card = this.page.locator(`.learning-mode-card[data-mode-id="${modeId}"]`);
    return (await card.getAttribute('aria-pressed')) === 'true';
  }

  // ── Domain Cards ──────────────────────────────────────────────────────────

  /** Select a domain card by domain ID (1-4). */
  async selectDomain(domainId: number): Promise<void> {
    await this.page.locator(`.domain-card[data-domain-id="${domainId}"]`).click();
  }

  // ── Filters ───────────────────────────────────────────────────────────────

  /** Set a specific filter dropdown value. */
  async setFilter(filterId: string, value: string): Promise<void> {
    await this.page.locator(`#${filterId}`).selectOption(value);
    // Trigger change event for filters that rely on it
    await this.page.locator(`#${filterId}`).dispatchEvent('change');
  }

  /** Clear all filters using the reset button. */
  async clearFilters(): Promise<void> {
    // Make sure button is visible first
    if (await this.filterClearBtn.isVisible()) {
      await this.filterClearBtn.click();
    }
  }

  /** Get the filter status text. */
  async getFilterStatusText(): Promise<string> {
    if (!(await this.filterStatus.isVisible())) return '';
    return (await this.filterStatus.textContent()) ?? '';
  }

  /** Count visible (not filter-hidden) resource items. */
  async getVisibleResourceCount(): Promise<number> {
    return this.page.locator('.resource-list li[data-service]:not(.filter-hidden)').count();
  }

  /** Check if the no-results message is visible. */
  async isFilterNoResultsVisible(): Promise<boolean> {
    return this.filterNoResults.isVisible();
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
