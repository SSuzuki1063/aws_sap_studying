import { type Page, type Locator } from '@playwright/test';
import { NavbarComponent } from '../components/NavbarComponent';
import { ThemeToggleComponent } from '../components/ThemeToggleComponent';
import { ScrollToTopComponent } from '../components/ScrollToTopComponent';

/**
 * Base Page Object shared by all page-specific POM classes.
 * Provides common locators (header, nav, search, theme toggle),
 * shared methods (goto, getAllLinks, theme management),
 * and Component Object composition for finer-grained access.
 */
export abstract class BasePage {
  readonly page: Page;

  /** Subclasses MUST define the URL path for this page. */
  abstract readonly pagePath: string;

  // ── Component Objects ─────────────────────────────────────────────────────
  readonly navbar: NavbarComponent;
  readonly themeToggleComponent: ThemeToggleComponent;
  readonly scrollToTopComponent: ScrollToTopComponent;

  // ── Shared locators (present on all pages) ──────────────────────────────
  readonly header: Locator;
  readonly hamburgerBtn: Locator;
  readonly mainNav: Locator;
  readonly themeToggle: Locator;
  readonly searchInput: Locator;
  readonly searchClear: Locator;
  readonly searchResults: Locator;
  readonly searchResultsCount: Locator;
  readonly scrollToTop: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Component Objects
    this.navbar                = new NavbarComponent(page);
    this.themeToggleComponent  = new ThemeToggleComponent(page);
    this.scrollToTopComponent  = new ScrollToTopComponent(page);

    // Locators (preserved for backward compatibility)
    this.header             = page.locator('.fixed-nav-header');
    this.hamburgerBtn       = page.locator('#hamburgerBtn');
    this.mainNav            = page.locator('#mainNav');
    this.themeToggle        = page.locator('.theme-toggle');
    this.searchInput        = page.locator('#searchInput');
    this.searchClear        = page.locator('#searchClear');
    this.searchResults      = page.locator('#searchResults');
    this.searchResultsCount = page.locator('#searchResultsCount');
    this.scrollToTop        = page.locator('#scrollToTop');
    this.mainContent        = page.locator('#main-content');
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  /** Navigate to this page and wait for it to be ready. */
  async goto(): Promise<void> {
    await this.page.goto(this.pagePath);
    await this.waitForReady();
  }

  /**
   * Wait for the page to be fully loaded and ready for interaction.
   * Subclasses should override this for page-specific load signals.
   */
  async waitForReady(): Promise<void> {
    await this.mainContent.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /** Return the page title. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  // ── Links ───────────────────────────────────────────────────────────────

  /** Collect all links on the page as { href, text } pairs. */
  async getAllLinks(): Promise<Array<{ href: string; text: string }>> {
    const anchors = this.page.locator('a[href]');
    const count = await anchors.count();
    const links: Array<{ href: string; text: string }> = [];
    for (let i = 0; i < count; i++) {
      const a = anchors.nth(i);
      links.push({
        href: (await a.getAttribute('href')) ?? '',
        text: ((await a.textContent()) ?? '').trim(),
      });
    }
    return links;
  }

  // ── Theme ───────────────────────────────────────────────────────────────

  /** Toggle the dark/light theme. */
  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  /** Get the current theme value from the document element. */
  async getTheme(): Promise<string | undefined> {
    return this.page.locator('html').getAttribute('data-theme').then(
      (v) => v ?? undefined,
    );
  }

  // ── Mobile nav ──────────────────────────────────────────────────────────

  /** Toggle the mobile hamburger menu. */
  async toggleNav(): Promise<void> {
    await this.hamburgerBtn.click();
  }
}
