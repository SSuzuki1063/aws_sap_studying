import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model for concept-map.html
 * Encapsulates all selectors and interactions for the AWS Concept Map page.
 */
export class ConceptMapPage {
  readonly page: Page;

  // Key locators
  readonly loadingMsg: Locator;
  readonly filterStatus: Locator;
  readonly filterClear: Locator;
  readonly detailPanel: Locator;
  readonly detailTitle: Locator;
  readonly detailPlaceholder: Locator;
  readonly breadcrumb: Locator;
  readonly progressPct: Locator;
  readonly progressFill: Locator;
  readonly tabMap: Locator;
  readonly tabDetail: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingMsg        = page.locator('#loading-msg');
    this.filterStatus      = page.locator('#mm-filter-status[aria-live="polite"]');
    this.filterClear       = page.locator('#mm-filter-clear');
    this.detailPanel       = page.locator('#mm-detail-panel');
    this.detailTitle       = page.locator('#mm-detail-panel h2.mm-detail-name-ja');
    this.detailPlaceholder = page.locator('p.mm-detail-placeholder');
    this.breadcrumb        = page.locator('#mm-breadcrumb');
    this.progressPct       = page.locator('#mm-progress-pct');
    this.progressFill      = page.locator('#mm-progress-fill[role="progressbar"]');
    this.tabMap            = page.locator('#mm-tab-map');
    this.tabDetail         = page.locator('#mm-tab-detail');
  }

  /** Navigate to the concept map and wait for initial load to complete. */
  async goto(): Promise<void> {
    await this.page.goto('/aws_sap_studying/concept-map.html');
    // Wait for loading spinner to disappear
    await this.loadingMsg.waitFor({ state: 'hidden', timeout: 10_000 });
  }

  // ── L1 / L2 / L3 navigation ───────────────────────────────────────────────

  /** Click an L1 domain button (e.g. 'dom-compute'). */
  async clickL1(domainId: string): Promise<void> {
    await this.page
      .locator(`button.mm-node-btn.mm-l1-btn[data-node-id="${domainId}"]`)
      .click();
  }

  /** Click an L2 service button (e.g. 'svc-ec2'). */
  async clickL2(serviceId: string): Promise<void> {
    await this.page
      .locator(`button.mm-node-btn.mm-l2-btn[data-node-id="${serviceId}"]`)
      .click();
  }

  /** Wait until L3 items have finished lazy-loading for the given service. */
  async waitForL3Rendered(serviceId: string): Promise<void> {
    const loading = this.page.locator(
      `#mm-children-${serviceId} li.mm-l3-loading`,
    );
    // If a loading indicator appears, wait for it to disappear
    try {
      await loading.first().waitFor({ state: 'hidden', timeout: 8_000 });
    } catch {
      // Loading indicator may not appear if already cached — that's fine
    }
  }

  /**
   * Click an L3 concept button in the tree navigator.
   * Scoped to #mm-nav-col to avoid the duplicate L3 buttons that appear
   * in the L2 detail panel's key_concepts list.
   */
  async clickL3(conceptId: string): Promise<void> {
    await this.page
      .locator(`#mm-nav-col button.mm-node-btn.mm-l3-btn[data-node-id="${conceptId}"]`)
      .click();
  }

  /**
   * Full navigation: navigate to a concept without clicking L1.
   * L1 domains start expanded by default (aria-expanded='true'), so L2 buttons
   * are already visible. We just need to click L2, wait for L3 to load, then click L3.
   */
  async navigateTo(domainId: string, serviceId: string, conceptId: string): Promise<void> {
    // L1 starts open — wait for L2 button to be visible (no L1 click needed)
    const l2Btn = this.page.locator(`button.mm-node-btn.mm-l2-btn[data-node-id="${serviceId}"]`);
    await expect(l2Btn).toBeVisible({ timeout: 6_000 });

    await this.clickL2(serviceId);
    const l3Container = this.page.locator(`#mm-children-${serviceId}`);
    await expect(l3Container).toBeVisible({ timeout: 6_000 });
    await this.waitForL3Rendered(serviceId);

    await this.clickL3(conceptId);
  }

  // ── Filters ───────────────────────────────────────────────────────────────

  /** Click a filter tag button by its tag ID (e.g. 'axis-security'). */
  async applyAxisFilter(axisId: string): Promise<void> {
    await this.page
      .locator(`button.mm-tag-btn[data-tag-id="${axisId}"]`)
      .click();
  }

  /** Click a SAP-domain filter button (e.g. 'sap-migration'). */
  async applySapFilter(sapId: string): Promise<void> {
    await this.page
      .locator(`button.mm-tag-btn[data-tag-id="${sapId}"]`)
      .click();
  }

  /** Click the "clear filters" button. */
  async clearFilters(): Promise<void> {
    await this.filterClear.click();
  }

  /**
   * Returns true if the L2 service list item has the mm-filtered class.
   * Note: li.mm-l2-item has no data-svc-id; the service ID is on the child button.
   */
  async isServiceFilteredOut(serviceId: string): Promise<boolean> {
    const item = this.page.locator(
      `li.mm-l2-item:has(button[data-node-id="${serviceId}"]).mm-filtered`,
    );
    return item.count().then((n) => n > 0);
  }

  // ── Breadcrumb ────────────────────────────────────────────────────────────

  /** Returns the text of each breadcrumb button in order. */
  async getBreadcrumbItems(): Promise<string[]> {
    const buttons = this.breadcrumb.locator('li.mm-breadcrumb-item button.mm-breadcrumb-btn');
    const count = await buttons.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      texts.push((await buttons.nth(i).textContent()) ?? '');
    }
    return texts.map((t) => t.trim());
  }

  // ── Detail panel ──────────────────────────────────────────────────────────

  /** Returns the text content of all crosslink badge buttons. */
  async getCrosslinkBadges(): Promise<string[]> {
    const badges = this.detailPanel.locator('button.crosslink-badge');
    const count = await badges.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      texts.push((await badges.nth(i).textContent()) ?? '');
    }
    return texts.map((t) => t.trim());
  }

  /** Returns href, visible text, and target for all HTML resource links. */
  async getHtmlResourceLinks(): Promise<Array<{ text: string; href: string; target: string }>> {
    const links = this.detailPanel.locator('a.mm-html-resource-link');
    const count = await links.count();
    const result: Array<{ text: string; href: string; target: string }> = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      result.push({
        text:   ((await link.textContent()) ?? '').trim(),
        href:   (await link.getAttribute('href')) ?? '',
        target: (await link.getAttribute('target')) ?? '',
      });
    }
    return result;
  }

  // ── Mobile tabs ───────────────────────────────────────────────────────────

  /** Switch to mobile map tab. */
  async switchToMapTab(): Promise<void> {
    await this.tabMap.click();
  }

  /** Switch to mobile detail tab. */
  async switchToDetailTab(): Promise<void> {
    await this.tabDetail.click();
  }
}
