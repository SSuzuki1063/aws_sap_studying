# Tasks: Page Object Model（POM）パターン採用

**Input**: Design documents from `/specs/003-page-object-model/`
**Prerequisites**: plan.md ✅ | spec.md ✅

**Tests**: 既存60+テストが後方互換で全パスすることがバリデーション基準。新規テストタスクは不要。

**Organization**: 基底クラス → 新Page Object → 既存ConceptMapPage移行 → 検証の順。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1=共通POM導入, US2=回帰テスト活用, US3=基底クラス抽出

---

## Phase 1: Setup

**Purpose**: 設計確認と準備

- [x] T001 Read existing `tests/e2e/helpers/ConceptMapPage.ts` and confirm all public methods/properties to preserve
- [x] T002 Read HTML structure of index page (`src/pages/index.astro` or `dist/index.html`) to identify selectors for `IndexPage`
- [x] T003 Read HTML structure of learning-resources page (`src/pages/learning-resources.astro` or `dist/learning-resources.html`) to identify selectors for `LearningResourcesPage`

---

## Phase 2: Foundational — BasePage 基底クラス

**Purpose**: 全Page Objectが継承する基底クラスを作成

- [x] T004 [US3] Create `tests/e2e/helpers/BasePage.ts` with shared interface:
  - Constructor: accept `Page`, define `pagePath` abstract property
  - Shared readonly locators: `header` (`.fixed-nav-header`), `hamburgerBtn` (`#hamburgerBtn`), `mainNav` (`#mainNav`), `themeToggle` (`.theme-toggle`), `searchInput` (`#searchInput`), `searchClear` (`#searchClear`), `searchResults` (`#searchResults`), `searchResultsCount` (`#searchResultsCount`), `scrollToTop` (`#scrollToTop`), `mainContent` (`#main-content`)
  - Methods: `goto()` (navigate to `pagePath` + call `waitForReady()`), `waitForReady()` (default: wait for `mainContent` visible), `getAllLinks()` (return `{ href, text }[]` from all `<a>` tags), `getPageTitle()`, `toggleTheme()`, `getTheme()`, `toggleNav()`
  - Export class

**Checkpoint**: `BasePage.ts` compiles without errors.

---

## Phase 3: User Story 1 — 新Page Object作成 (Priority: P1) MVP

**Goal**: IndexPage と LearningResourcesPage を作成し、BasePage を継承

**Independent Test**: 各Page Objectが `new IndexPage(page)` / `new LearningResourcesPage(page)` でインスタンス化でき、`goto()` でページ遷移できる

- [x] T005 [P] [US1] Create `tests/e2e/helpers/IndexPage.ts` extending `BasePage`:
  - Set `pagePath` to `/aws_sap_studying/`
  - Page-specific locators: `heroTitle` (`.hero-title`), `heroCta` (`.hero-cta`), `heroCards` (`.hero-card`), `statItems` (`.stat-item`), `updateHistory` (`#update-history-container`)
  - Methods: `clickConceptMapLink()` (click `.hero-btn-primary`), `clickLearningResources()` (click `.hero-btn-secondary`), `getHeroCards()` → `{ title, badge, href }[]`, `getNavLinks()` → `{ text, href }[]` from `.fixed-nav-links a`, `searchFor(query)` (fill searchInput + wait for results), `clearSearch()`, `getSearchResultCount()`
  - Override `waitForReady()`: wait for `.hero` to be visible

- [x] T006 [P] [US1] Create `tests/e2e/helpers/LearningResourcesPage.ts` extending `BasePage`:
  - Set `pagePath` to `/aws_sap_studying/learning-resources.html`
  - Page-specific locators: `categoryNav` (`.category-nav`), `categoryLinks` (`.category-link`), `resourceList` (`.resource-list`), `sidebarToc` (`#sidebar-toc`), `tocToggle` (`#sidebar-toc-toggle`), `statsGrid` (`.stats-grid`)
  - Methods: `getCategories()` → `{ name, count, href }[]`, `getResourceItems()` → `{ text, href }[]`, `getCategoryCount()`, `toggleSidebarToc()`, `searchFor(query)` (inherit or override from BasePage)
  - Override `waitForReady()`: wait for `.container` to be visible

**Checkpoint**: Both new Page Objects compile. `new IndexPage(page).goto()` and `new LearningResourcesPage(page).goto()` work.

---

## Phase 4: User Story 1 (cont.) — ConceptMapPage 移行

**Goal**: 既存 ConceptMapPage を BasePage 継承に移行しつつ後方互換100%維持

- [x] T007 [US1] Modify `tests/e2e/helpers/ConceptMapPage.ts` to extend `BasePage`:
  - Add `extends BasePage` to class declaration
  - Set `pagePath` to `/aws_sap_studying/concept-map.html`
  - Move shared locators (if any overlap with BasePage) to `super()` call
  - Keep ALL existing readonly properties and methods UNCHANGED
  - Override `waitForReady()`: extract `loadingMsg.waitFor({ state: 'hidden' })` from existing `goto()`
  - Override `goto()`: call `super.goto()` which triggers `waitForReady()` override
  - Ensure `super(page)` is called in constructor

- [x] T008 [US1] Run existing concept-map E2E tests to verify backward compatibility: `npx playwright test --project=chromium tests/e2e/concept-map/`
  - All 60+ tests MUST pass with zero changes to spec files
  - If any test fails, fix ConceptMapPage.ts without changing spec files

**Checkpoint**: All existing 60+ tests pass. ConceptMapPage extends BasePage. No spec file changes.

---

## Phase 5: User Story 2 — 回帰テストスイートでのPOM活用準備

**Goal**: 回帰テストスイートのディレクトリ構造を作成し、Page Objectの re-export を整備

- [x] T009 [US2] Create barrel export file `tests/e2e/helpers/index.ts`:
  - Re-export all Page Objects: `export { BasePage } from './BasePage'`, `export { IndexPage } from './IndexPage'`, `export { ConceptMapPage } from './ConceptMapPage'`, `export { LearningResourcesPage } from './LearningResourcesPage'`
  - This enables `import { IndexPage, ConceptMapPage } from '../helpers'` in spec files

- [x] T010 [US2] Create regression test directories and placeholder specs:
  - `tests/e2e/visual/` directory
  - `tests/e2e/navigation/` directory
  - `tests/e2e/links/` directory
  - `tests/e2e/interaction/` directory
  - Each directory gets a minimal `.gitkeep` or placeholder spec importing the relevant Page Object to verify imports work

**Checkpoint**: All directories exist. Barrel export compiles. Page Objects are importable from each regression test directory.

---

## Phase 6: Polish & Verification

**Purpose**: 最終検証とドキュメント

- [x] T011 Run full existing E2E test suite to confirm no regressions: `npx playwright test --project=chromium`
- [x] T012 Verify TypeScript compilation of all new files: `npx tsc --noEmit tests/e2e/helpers/*.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (T001-T003) → Phase 2 (T004) → Phase 3 (T005, T006 parallel) → Phase 4 (T007 → T008) → Phase 5 (T009, T010) → Phase 6 (T011-T012)
```

### User Story Dependencies

- **US3 (BasePage)**: Must complete FIRST — all other Page Objects depend on it
- **US1 (IndexPage + LearningResourcesPage)**: Can be built in parallel after BasePage (T005 ∥ T006)
- **US1 (ConceptMapPage migration)**: Must follow new Page Objects (depends on BasePage being stable)
- **US2 (Regression suite prep)**: After all Page Objects are complete

### Critical Path

```text
T004 (BasePage) → T005+T006 (parallel: IndexPage + LearningResourcesPage) → T007 (ConceptMapPage migration) → T008 (backward compat test) → T009-T010 (barrel + dirs)
```

### Parallel Opportunities

- T001, T002, T003 — all setup reads are independent
- T005, T006 — IndexPage and LearningResourcesPage have zero dependencies on each other
- T009, T010 — barrel export and directory creation are independent
- T011, T012 — test run and TypeScript check are independent

---

## Implementation Strategy

### MVP First (Phase 2 + Phase 3)

1. Create BasePage (T004)
2. Create IndexPage + LearningResourcesPage (T005, T006 — parallel)
3. **VALIDATE**: New Page Objects compile and `goto()` works
4. This provides immediate value: regression tests can be written using POM

### Incremental Delivery

1. BasePage → Foundation ready
2. IndexPage + LearningResourcesPage → New pages covered
3. ConceptMapPage migration → Backward-compatible inheritance
4. Barrel export + regression dirs → Ready for 001-playwright-regression-tests implementation

---

## Notes

- ConceptMapPage migration (T007) is the highest-risk task — run T008 immediately after to catch regressions
- The `searchFor()` method in BasePage may need page-specific behavior since index.js and learning-resources.js handle search differently. If so, override in subclasses
- `getAllLinks()` returns raw `<a>` hrefs — the link validation spec will filter/categorize them
- Dark mode toggle (`toggleTheme()`, `getTheme()`) is in BasePage since the same `theme-toggle.js` runs on all pages
