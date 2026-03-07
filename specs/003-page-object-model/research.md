# Research: Component Object Model + Regression Test Architecture

**Feature Branch**: `003-page-object-model`
**Date**: 2026-03-07
**Status**: Complete

---

## R-001: Component Object vs Page Object — Composition Strategy

**Decision**: Component Objects are composed inside Page Objects via delegation, not inheritance.

**Rationale**: The existing POM (BasePage -> IndexPage/ConceptMapPage/LearningResourcesPage) is consumed by 58 passing tests. Refactoring Page Objects to inherit from Component Objects would break the class hierarchy. Composition (Page Object holds component instances as properties) preserves the public API while enabling component reuse.

**Alternatives considered**:
- **Mixin-based approach**: TypeScript mixins add complexity and make IDE navigation harder. Rejected.
- **Replace Page Objects with Components**: Would break 58 existing tests that import from `helpers/`. Rejected.
- **Component Objects as standalone (no Page Object integration)**: Loses the benefit of DRY — test authors would need to choose between Page Object methods and Component methods for the same action. Rejected.

**Pattern**:
```typescript
// Page Object composes Component Objects
class IndexPage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly search: SearchComponent;
  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.search = new SearchComponent(page);
  }
  // Existing methods delegate or remain as-is for backward compat
}
```

---

## R-002: Shared UI Components Identified from HTML Analysis

**Decision**: Extract 4 Component Objects based on DOM analysis of all 3 pages.

| Component | Shared Across | Key Selectors | Current Location |
|-----------|--------------|---------------|-----------------|
| NavbarComponent | All 3 pages | `.fixed-nav-header`, `#hamburgerBtn`, `#mainNav`, `.fixed-nav-links a` | BasePage (partial) |
| SearchComponent | index, learning-resources | `#searchInput`, `#searchClear`, `#searchResults`, `#searchResultsCount` | BasePage (locators) + IndexPage/LearningResourcesPage (methods) |
| ThemeToggleComponent | All 3 pages | `.theme-toggle`, `html[data-theme]` | BasePage (`toggleTheme`, `getTheme`) |
| ScrollToTopComponent | All 3 pages | `#scrollToTop` | BasePage (locator only) |

**Not extracted** (page-specific, no reuse benefit):
- ConceptMap tree/filter/breadcrumb/detail-panel — only used on concept-map.html
- ResourceList/CategoryNav — only used on learning-resources.html
- HeroSection — only used on index.html

**Rationale**: Only components that appear on 2+ pages justify extraction. ConceptMap interactions are complex but page-specific; keeping them in ConceptMapPage avoids unnecessary indirection.

---

## R-003: Regression Test Suite Design

**Decision**: 4 regression test suites organized by test category, each using POM + COM.

### visual/ — Screenshot Comparison
- Capture full-page screenshots for each page at desktop (1280x720) and mobile (390x844)
- Use Playwright's `toHaveScreenshot()` with configurable threshold (0.2% pixel diff)
- Baseline management: `tests/e2e/__screenshots__/` directory (already configured in playwright.config.ts)
- Theme variants: capture both light and dark mode

### navigation/ — Navbar Links & Routing
- Verify all navbar links exist and point to correct pages
- Click each link and verify page loads (URL + waitForReady)
- Mobile navigation: hamburger open/close, link visibility
- Cross-page navigation: index -> concept-map -> learning-resources round-trip

### links/ — Anchor Tag Validation
- Use `getAllLinks()` from each Page Object to collect all `<a>` tags
- Categorize: internal (same-origin), external (different origin), anchor (#hash)
- Validate internal links return HTTP 200 (via `page.request.get()`)
- Skip external links in CI (network dependency); validate format only

### interaction/ — UI Component Behavior
- Theme toggle: click toggle, verify `data-theme` changes, verify persistence across navigation
- Search: type query, verify results appear, clear, verify reset
- Scroll-to-top: scroll down, verify button appears, click, verify scroll position
- Concept map: node expansion, detail panel, filter apply/clear (leverage existing ConceptMapPage methods)

---

## R-004: Backward Compatibility Strategy

**Decision**: Zero changes to existing spec files. Component Objects add new capabilities without modifying Page Object public APIs.

**Strategy**:
1. Page Object public methods/properties remain unchanged (same name, signature, return type)
2. Component Object instances are added as NEW readonly properties on Page Objects
3. BasePage locators that overlap with Component Objects remain (dual access is acceptable for backward compat)
4. Barrel export (`helpers/index.ts`) adds Component Object exports without removing existing ones
5. New component directory: `tests/e2e/components/` (separate from `helpers/`)

**Verification**: Run `npx playwright test --project=chromium tests/e2e/concept-map/` after every change — all 58 tests must pass.

---

## R-005: Directory Structure Decision

**Decision**: Extend existing structure rather than reorganize.

**Rationale**: The user-requested structure (`tests/pages/`, `tests/components/`, `tests/specs/`) conflicts with the existing layout where specs live in `tests/e2e/concept-map/` and page objects in `tests/e2e/helpers/`. Moving files would break imports in 7 existing spec files. Instead, we add `tests/e2e/components/` alongside the existing structure.

```text
tests/e2e/
  helpers/              # EXISTING — Page Objects (unchanged)
    BasePage.ts
    IndexPage.ts
    ConceptMapPage.ts
    LearningResourcesPage.ts
    index.ts            # Barrel export (extended with components)
  components/           # NEW — Component Objects
    NavbarComponent.ts
    SearchComponent.ts
    ThemeToggleComponent.ts
    ScrollToTopComponent.ts
    index.ts            # Component barrel export
  concept-map/          # EXISTING — 7 spec files (unchanged)
  visual/               # NEW — Visual regression specs
  navigation/           # NEW — Navigation specs
  links/                # NEW — Link validation specs
  interaction/          # NEW — Interaction specs
```

---

## R-006: Screenshot Baseline Management

**Decision**: Use Playwright's built-in `toHaveScreenshot()` with per-project snapshot paths.

**Rationale**: Playwright 1.44+ has mature screenshot comparison. The project already configures `snapshotDir: 'tests/e2e/__snapshots__'` in playwright.config.ts. Using built-in functionality avoids custom image comparison logic.

**Configuration**:
- maxDiffPixelRatio: 0.005 (0.5% tolerance for anti-aliasing)
- animations: 'disabled' (prevent flaky diffs from CSS transitions)
- First run generates baselines; subsequent runs compare against them
- Update baselines: `npx playwright test --update-snapshots`

---

## R-007: Link Validation Approach

**Decision**: Use Playwright's `page.request` API for internal link checking, format-only validation for external links.

**Rationale**: External link checking adds network dependency and flakiness to CI. Internal links (same-origin) can be reliably checked against the local dev server.

**Implementation**:
- Collect links via `getAllLinks()` on each page
- Categorize by URL pattern: internal (`/aws_sap_studying/`), external (http/https other domain), anchor (`#`)
- Internal: `page.request.get(url)` → assert status 200
- External: validate URL format (parseable, has protocol)
- Anchor: verify target element exists via `page.locator(hash).count() > 0`
- Deduplicate across pages to avoid redundant checks
