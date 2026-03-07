# Test Expectations Contract

**Date**: 2026-03-07

## Regression Test Acceptance Criteria

### Visual Regression Suite (`tests/e2e/visual/`)

| Test | Pages | Viewports | Theme | Acceptance |
|------|-------|-----------|-------|------------|
| Full-page screenshot | index, concept-map, learning-resources | desktop (1280x720) | light | maxDiffPixelRatio < 0.005 |
| Full-page screenshot | index, concept-map, learning-resources | mobile (390x844) | light | maxDiffPixelRatio < 0.005 |
| Dark mode screenshot | index, concept-map, learning-resources | desktop (1280x720) | dark | maxDiffPixelRatio < 0.005 |

**Total**: 9 screenshot comparisons
**Baseline update**: `npx playwright test --project=chromium tests/e2e/visual/ --update-snapshots`

### Navigation Suite (`tests/e2e/navigation/`)

| Test | Acceptance |
|------|------------|
| Navbar contains expected links | >= 6 nav links present on each page |
| Each nav link navigates to correct page | URL contains expected page path after click |
| Mobile hamburger opens/closes | aria-expanded toggles, menu becomes visible/hidden |
| Cross-page round-trip | index -> concept-map -> learning-resources -> index completes |
| Active page indicator | Current page link has distinct visual state |

**Total**: ~12 test cases (4 tests x 3 pages)

### Link Validation Suite (`tests/e2e/links/`)

| Test | Acceptance |
|------|------------|
| Internal links return HTTP 200 | All `<a>` with href starting `/aws_sap_studying/` return 200 |
| External links have valid URL format | All `<a>` with http/https parse as valid URL |
| Anchor links target existing elements | All `<a>` with `#hash` have matching element on page |
| No empty href attributes | Zero `<a>` with href="" or href="#" (except scroll-to-top) |

**Total**: ~8 test cases (link categories x pages)

### Interaction Suite (`tests/e2e/interaction/`)

| Test | Acceptance |
|------|------------|
| Theme toggle switches mode | data-theme changes from undefined/light to dark and back |
| Theme persists across navigation | Toggle on page A, navigate to page B, theme remains |
| Search returns results for valid query | Result count > 0 for known terms ("VPC", "EC2") |
| Search shows no-results for gibberish | No-results message visible for "xyznonexistent" |
| Search clear resets state | After clear, input empty, results hidden |
| Scroll-to-top appears on scroll | Button visible after scrolling 300px+ |
| Scroll-to-top scrolls to top | After click, scrollY near 0 |

**Total**: ~10 test cases

## Component Object Contract

### NavbarComponent

```typescript
interface NavbarComponentContract {
  // Locators: readonly, always available
  header: Locator;       // .fixed-nav-header — exists on all pages
  hamburgerBtn: Locator; // #hamburgerBtn — exists on all pages
  mainNav: Locator;      // #mainNav — exists on all pages

  // Methods
  navigateTo(name: 'index' | 'concept-map' | 'learning-resources'): Promise<void>;
  getLinks(): Promise<Array<{ text: string; href: string }>>;
  openMobile(): Promise<void>;   // clicks hamburgerBtn
  closeMobile(): Promise<void>;  // clicks hamburgerBtn or presses Escape
  isOpen(): Promise<boolean>;    // reads aria-expanded
}
```

### SearchComponent

```typescript
interface SearchComponentContract {
  input: Locator;        // #searchInput
  clearBtn: Locator;     // #searchClear
  results: Locator;      // #searchResults
  resultsCount: Locator; // #searchResultsCount

  fill(query: string): Promise<void>;
  clear(): Promise<void>;
  getResultCount(): Promise<string>;
  hasResults(): Promise<boolean>;
  waitForResults(): Promise<void>;
}
```

### ThemeToggleComponent

```typescript
interface ThemeToggleComponentContract {
  toggleBtn: Locator;  // .theme-toggle

  toggle(): Promise<void>;
  getTheme(): Promise<string | undefined>;
  isDarkMode(): Promise<boolean>;
}
```

### ScrollToTopComponent

```typescript
interface ScrollToTopComponentContract {
  button: Locator;  // #scrollToTop

  click(): Promise<void>;
  isVisible(): Promise<boolean>;
  waitForVisible(): Promise<void>;
}
```

## Backward Compatibility Contract

The following Page Object public API MUST NOT change:

### BasePage (preserved methods)
- `goto(): Promise<void>`
- `waitForReady(): Promise<void>`
- `getAllLinks(): Promise<Array<{ href: string; text: string }>>`
- `getPageTitle(): Promise<string>`
- `toggleTheme(): Promise<void>`
- `getTheme(): Promise<string | undefined>`
- `toggleNav(): Promise<void>`

### ConceptMapPage (preserved methods — used by 58 tests)
- `clickL1(domainId: string): Promise<void>`
- `clickL2(serviceId: string): Promise<void>`
- `clickL3(conceptId: string): Promise<void>`
- `waitForL3Rendered(serviceId: string): Promise<void>`
- `navigateTo(domainId: string, serviceId: string, conceptId?: string): Promise<void>`
- `applyAxisFilter(axisId: string): Promise<void>`
- `applySapFilter(sapId: string): Promise<void>`
- `clearFilters(): Promise<void>`
- `isServiceFilteredOut(serviceId: string): Promise<boolean>`
- `getBreadcrumbItems(): Promise<string[]>`
- `getCrosslinkBadges(): Promise<string[]>`
- `getHtmlResourceLinks(): Promise<Array<{ text: string; href: string; target: string }>>`
- `switchToMapTab(): Promise<void>`
- `switchToDetailTab(): Promise<void>`

### Import paths (must remain valid)
- `import { ConceptMapPage } from '../helpers/ConceptMapPage'`
- `import { ConceptMapPage } from '../helpers'`
- `import { IndexPage, ConceptMapPage, LearningResourcesPage } from '../helpers'`
