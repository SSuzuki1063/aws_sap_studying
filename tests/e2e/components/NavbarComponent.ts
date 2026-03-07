import { type Page, type Locator } from '@playwright/test';

/**
 * Component Object for the fixed navigation header.
 * Shared across all pages — encapsulates nav link interactions,
 * mobile hamburger menu, and page routing.
 */
export class NavbarComponent {
  readonly page: Page;
  readonly header: Locator;
  readonly hamburgerBtn: Locator;
  readonly mainNav: Locator;
  readonly navLinks: Locator;

  private static readonly NAV_MAP: Record<string, string> = {
    'index': 'index.html',
    'concept-map': 'concept-map.html',
    'learning-resources': 'learning-resources.html',
  };

  constructor(page: Page) {
    this.page         = page;
    this.header       = page.locator('.fixed-nav-header');
    this.hamburgerBtn = page.locator('#hamburgerBtn');
    this.mainNav      = page.locator('#mainNav');
    this.navLinks     = page.locator('.fixed-nav-links a');
  }

  /**
   * Click a link in the header that navigates to the given page.
   * Searches all links inside .fixed-nav-header (nav links + logo).
   */
  async navigateTo(name: 'index' | 'concept-map' | 'learning-resources'): Promise<void> {
    const href = NavbarComponent.NAV_MAP[name];
    const headerLinks = this.header.locator(`a[href*="${href}"]`);
    const count = await headerLinks.count();
    if (count === 0) {
      throw new Error(`No header link found for "${name}" (href containing "${href}")`);
    }
    await headerLinks.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Get all navigation links as { text, href } pairs. */
  async getLinks(): Promise<Array<{ text: string; href: string }>> {
    const count = await this.navLinks.count();
    const links: Array<{ text: string; href: string }> = [];
    for (let i = 0; i < count; i++) {
      const link = this.navLinks.nth(i);
      links.push({
        text: ((await link.textContent()) ?? '').trim(),
        href: (await link.getAttribute('href')) ?? '',
      });
    }
    return links;
  }

  /** Open the mobile hamburger menu (no-op if already open). */
  async openMobile(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.hamburgerBtn.click();
    }
  }

  /** Close the mobile hamburger menu (no-op if already closed). */
  async closeMobile(): Promise<void> {
    if (await this.isOpen()) {
      await this.hamburgerBtn.click();
    }
  }

  /** Check if the mobile nav is currently open via aria-expanded. */
  async isOpen(): Promise<boolean> {
    const expanded = await this.hamburgerBtn.getAttribute('aria-expanded');
    return expanded === 'true';
  }
}
