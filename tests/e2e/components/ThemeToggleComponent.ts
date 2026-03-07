import { type Page, type Locator } from '@playwright/test';

/**
 * Component Object for the dark/light theme toggle button.
 * Present on all pages — reads and writes html[data-theme].
 */
export class ThemeToggleComponent {
  readonly page: Page;
  readonly toggleBtn: Locator;

  constructor(page: Page) {
    this.page      = page;
    this.toggleBtn = page.locator('.theme-toggle');
  }

  /** Click the theme toggle button. */
  async toggle(): Promise<void> {
    await this.toggleBtn.click();
  }

  /** Get the current data-theme attribute value (e.g., "dark" or undefined). */
  async getTheme(): Promise<string | undefined> {
    const value = await this.page.locator('html').getAttribute('data-theme');
    return value ?? undefined;
  }

  /** Returns true if the current theme is "dark". */
  async isDarkMode(): Promise<boolean> {
    return (await this.getTheme()) === 'dark';
  }
}
