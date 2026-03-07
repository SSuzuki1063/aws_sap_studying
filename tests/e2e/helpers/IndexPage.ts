import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for index.html (home page).
 * Encapsulates hero section, navigation cards, search, and stats.
 */
export class IndexPage extends BasePage {
  readonly pagePath = '/aws_sap_studying/';

  // ── Page-specific locators ──────────────────────────────────────────────
  readonly heroTitle: Locator;
  readonly heroCta: Locator;
  readonly heroCards: Locator;
  readonly statItems: Locator;
  readonly updateHistory: Locator;
  readonly hero: Locator;

  constructor(page: Page) {
    super(page);
    this.heroTitle     = page.locator('.hero-title');
    this.heroCta       = page.locator('.hero-cta');
    this.heroCards     = page.locator('.hero-card');
    this.statItems     = page.locator('.stat-item');
    this.updateHistory = page.locator('#update-history-container');
    this.hero          = page.locator('.hero');
  }

  /** Wait for the hero section to be visible (page-specific load signal). */
  override async waitForReady(): Promise<void> {
    await this.hero.waitFor({ state: 'visible', timeout: 10_000 });
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  /** Click the primary CTA button (Concept Map link). */
  async clickConceptMapLink(): Promise<void> {
    await this.page.locator('.hero-btn.hero-btn-primary').click();
  }

  /** Click the secondary CTA button (Learning Resources link). */
  async clickLearningResources(): Promise<void> {
    await this.page.locator('.hero-btn.hero-btn-secondary').click();
  }

  /** Get all hero navigation cards with title, badge, and href. */
  async getHeroCards(): Promise<Array<{ title: string; badge: string; href: string }>> {
    const cards = this.heroCards;
    const count = await cards.count();
    const result: Array<{ title: string; badge: string; href: string }> = [];
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      result.push({
        title: ((await card.locator('.hero-card-title').textContent()) ?? '').trim(),
        badge: ((await card.locator('.hero-card-badge').textContent()) ?? '').trim(),
        href: (await card.getAttribute('href')) ?? '',
      });
    }
    return result;
  }

  /** Get all navigation links from the fixed header nav. */
  async getNavLinks(): Promise<Array<{ text: string; href: string }>> {
    const links = this.page.locator('.fixed-nav-links a');
    const count = await links.count();
    const result: Array<{ text: string; href: string }> = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      result.push({
        text: ((await link.textContent()) ?? '').trim(),
        href: (await link.getAttribute('href')) ?? '',
      });
    }
    return result;
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

  /** Get the search result count text. */
  async getSearchResultCount(): Promise<string> {
    return ((await this.searchResultsCount.textContent()) ?? '').trim();
  }
}
