import { type Page, type Locator } from '@playwright/test';

/**
 * Component Object for the search input/results UI.
 * Shared between index.html and learning-resources.html
 * (both use #searchInput / #searchResults selectors).
 */
export class SearchComponent {
  readonly page: Page;
  readonly input: Locator;
  readonly clearBtn: Locator;
  readonly results: Locator;
  readonly resultsCount: Locator;
  readonly noResults: Locator;

  constructor(page: Page) {
    this.page         = page;
    this.input        = page.locator('#searchInput');
    this.clearBtn     = page.locator('#searchClear');
    this.results      = page.locator('#searchResults');
    this.resultsCount = page.locator('#searchResultsCount');
    this.noResults    = page.locator('#searchNoResults');
  }

  /** Type a search query into the input and wait briefly for results. */
  async fill(query: string): Promise<void> {
    await this.input.fill(query);
    // Allow time for the search handler to filter and render results
    await this.page.waitForTimeout(300);
  }

  /** Click the clear button to reset search. */
  async clear(): Promise<void> {
    await this.clearBtn.click();
  }

  /** Get the current result count text (e.g., "5"). */
  async getResultCount(): Promise<string> {
    return ((await this.resultsCount.textContent()) ?? '').trim();
  }

  /** Check if the results container is currently visible. */
  async hasResults(): Promise<boolean> {
    return this.results.isVisible();
  }

  /** Wait for the results container to become visible. */
  async waitForResults(): Promise<void> {
    await this.results.waitFor({ state: 'visible', timeout: 5_000 });
  }
}
