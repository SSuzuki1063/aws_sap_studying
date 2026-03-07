import { type Page, type Locator } from '@playwright/test';

/**
 * Component Object for the scroll-to-top floating button.
 * Present on all pages — appears after scrolling 300px+.
 */
export class ScrollToTopComponent {
  readonly page: Page;
  readonly button: Locator;

  constructor(page: Page) {
    this.page   = page;
    this.button = page.locator('#scrollToTop');
  }

  /** Click the scroll-to-top button. */
  async click(): Promise<void> {
    await this.button.click();
  }

  /** Check if the button is currently visible. */
  async isVisible(): Promise<boolean> {
    return this.button.isVisible();
  }

  /** Wait for the button to become visible. */
  async waitForVisible(): Promise<void> {
    await this.button.waitFor({ state: 'visible', timeout: 5_000 });
  }
}
