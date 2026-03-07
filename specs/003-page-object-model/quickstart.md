# Quickstart: Component Object Model + Regression Tests

**Date**: 2026-03-07

## Scenario 1: Using Component Objects in a New Test

```typescript
import { test, expect } from '@playwright/test';
import { IndexPage } from '../helpers';

test('navbar links navigate to correct pages', async ({ page }) => {
  const indexPage = new IndexPage(page);
  await indexPage.goto();

  // Use Component Object for navbar interactions
  const links = await indexPage.navbar.getLinks();
  expect(links.length).toBeGreaterThan(0);

  // Navigate via navbar component
  await indexPage.navbar.navigateTo('concept-map');
  expect(page.url()).toContain('concept-map.html');
});
```

## Scenario 2: Theme Toggle Across Pages

```typescript
import { test, expect } from '@playwright/test';
import { IndexPage, ConceptMapPage } from '../helpers';

test('theme persists across page navigation', async ({ page }) => {
  const indexPage = new IndexPage(page);
  await indexPage.goto();

  // Toggle to dark mode via component
  await indexPage.themeToggleComponent.toggle();
  expect(await indexPage.themeToggleComponent.isDarkMode()).toBe(true);

  // Navigate to another page
  const conceptMapPage = new ConceptMapPage(page);
  await conceptMapPage.goto();

  // Theme should persist
  expect(await conceptMapPage.themeToggleComponent.isDarkMode()).toBe(true);
});
```

## Scenario 3: Search Component Reuse

```typescript
import { test, expect } from '@playwright/test';
import { IndexPage, LearningResourcesPage } from '../helpers';

test('search works on index page', async ({ page }) => {
  const indexPage = new IndexPage(page);
  await indexPage.goto();

  await indexPage.search.fill('VPC');
  expect(await indexPage.search.hasResults()).toBe(true);
  expect(await indexPage.search.getResultCount()).not.toBe('0');

  await indexPage.search.clear();
  expect(await indexPage.search.hasResults()).toBe(false);
});

test('search works on learning resources page', async ({ page }) => {
  const lrPage = new LearningResourcesPage(page);
  await lrPage.goto();

  // Same Component Object API, different page
  await lrPage.search.fill('Lambda');
  expect(await lrPage.search.hasResults()).toBe(true);
});
```

## Scenario 4: Visual Regression Test

```typescript
import { test, expect } from '@playwright/test';
import { IndexPage } from '../helpers';

test('index page visual snapshot - light mode', async ({ page }) => {
  const indexPage = new IndexPage(page);
  await indexPage.goto();
  await expect(page).toHaveScreenshot('index-light-desktop.png', {
    maxDiffPixelRatio: 0.005,
    animations: 'disabled',
  });
});
```

## Scenario 5: Link Validation Test

```typescript
import { test, expect } from '@playwright/test';
import { IndexPage } from '../helpers';

test('all internal links return 200', async ({ page }) => {
  const indexPage = new IndexPage(page);
  await indexPage.goto();

  const links = await indexPage.getAllLinks();
  const internalLinks = links.filter(l => l.href.startsWith('/aws_sap_studying/'));

  for (const link of internalLinks) {
    const response = await page.request.get(link.href);
    expect(response.status(), `Broken link: ${link.href}`).toBe(200);
  }
});
```

## Scenario 6: Backward-Compatible Existing Test (unchanged)

```typescript
// This existing test continues to work WITHOUT any changes:
import { ConceptMapPage } from '../helpers/ConceptMapPage';

test('filter by axis tag', async ({ page }) => {
  const cmp = new ConceptMapPage(page);
  await cmp.goto();
  await cmp.applyAxisFilter('axis-security');
  // ... assertions unchanged
});
```

## Running Tests

```bash
# Run all regression tests
npx playwright test --project=chromium tests/e2e/visual/ tests/e2e/navigation/ tests/e2e/links/ tests/e2e/interaction/

# Run a specific suite
npx playwright test --project=chromium tests/e2e/navigation/

# Run existing tests (unchanged)
npx playwright test --project=chromium tests/e2e/concept-map/

# Update visual baselines
npx playwright test --project=chromium tests/e2e/visual/ --update-snapshots

# Run all E2E tests together
npx playwright test --project=chromium
```
