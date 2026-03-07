# Tasks: Component Object Model + Regression Tests

**Input**: Design documents from `/specs/003-page-object-model/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/test-expectations.md

**Tests**: Regression test specs ARE the deliverable (US2). Existing 58 concept-map tests serve as backward compatibility validation.

**Organization**: Component Objects (foundational) -> Page Object composition (US1) -> Regression test suites (US2) -> Polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1=Component composition into Page Objects, US2=Regression test suites

---

## Phase 1: Setup

**Purpose**: Create directory structure for Component Objects

- [x] T001 Create `tests/e2e/components/` directory and remove `.gitkeep` placeholder files from `tests/e2e/visual/`, `tests/e2e/navigation/`, `tests/e2e/links/`, `tests/e2e/interaction/`

---

## Phase 2: Foundational — Component Objects

**Purpose**: Implement the 4 Component Object classes. These are standalone classes with no dependencies on each other. Each accepts a Playwright `Page` instance and encapsulates a reusable UI component's selectors and interaction methods.

**CRITICAL**: No regression test spec can be written until these components exist and are composed into Page Objects.

- [x] T002 [P] Create `NavbarComponent` in `tests/e2e/components/NavbarComponent.ts` — Locators: `header` (`.fixed-nav-header`), `hamburgerBtn` (`#hamburgerBtn`), `mainNav` (`#mainNav`), `navLinks` (`.fixed-nav-links a`). Methods: `navigateTo(name: 'index' | 'concept-map' | 'learning-resources')` clicks the matching nav link, `getLinks()` returns `{text, href}[]` from all nav links, `openMobile()` clicks hamburgerBtn if not already open, `closeMobile()` clicks hamburgerBtn if open, `isOpen()` reads `aria-expanded` attribute. See `data-model.md` NavbarComponent entity and `contracts/test-expectations.md` NavbarComponentContract.
- [x] T003 [P] Create `SearchComponent` in `tests/e2e/components/SearchComponent.ts` — Locators: `input` (`#searchInput`), `clearBtn` (`#searchClear`), `results` (`#searchResults`), `resultsCount` (`#searchResultsCount`), `noResults` (`#searchNoResults`). Methods: `fill(query)` fills input and waits briefly for results to render, `clear()` clicks clearBtn, `getResultCount()` returns text content of resultsCount span, `hasResults()` checks if results container is visible, `waitForResults()` waits for results container visible. See `data-model.md` SearchComponent entity.
- [x] T004 [P] Create `ThemeToggleComponent` in `tests/e2e/components/ThemeToggleComponent.ts` — Locator: `toggleBtn` (`.theme-toggle`). Methods: `toggle()` clicks toggleBtn, `getTheme()` returns `html[data-theme]` attribute value (string | undefined), `isDarkMode()` returns `true` if `getTheme() === 'dark'`. See `data-model.md` ThemeToggleComponent entity.
- [x] T005 [P] Create `ScrollToTopComponent` in `tests/e2e/components/ScrollToTopComponent.ts` — Locator: `button` (`#scrollToTop`). Methods: `click()` clicks button, `isVisible()` checks if button is currently visible (opacity/display), `waitForVisible()` waits for button to appear. See `data-model.md` ScrollToTopComponent entity.
- [x] T006 Create component barrel export in `tests/e2e/components/index.ts` — Export all 4 component classes: `NavbarComponent`, `SearchComponent`, `ThemeToggleComponent`, `ScrollToTopComponent`. Depends on T002-T005.

**Checkpoint**: All 4 Component Objects compile. `npx tsc --noEmit tests/e2e/components/*.ts` passes.

---

## Phase 3: US1 — Page Object Composition (Priority: P1)

**Goal**: Compose Component Objects into existing Page Objects as `readonly` properties. Existing public methods remain unchanged for backward compatibility. New component properties provide finer-grained access for regression tests.

**Independent Test**: `npx playwright test --project=chromium tests/e2e/concept-map/` — all 58 tests pass unchanged.

### Implementation for US1

- [x] T007 [US1] Add component composition to `BasePage` in `tests/e2e/helpers/BasePage.ts` — Import `NavbarComponent`, `ThemeToggleComponent`, `ScrollToTopComponent` from `../components`. Add `readonly navbar`, `readonly themeToggle`, `readonly scrollToTop` properties initialized in constructor. Existing locator properties (`header`, `hamburgerBtn`, `mainNav`, `themeToggle` locator, `searchInput`, `scrollToTop` locator, etc.) MUST remain unchanged. Existing methods `toggleTheme()`, `getTheme()`, `toggleNav()` remain as-is (do NOT delegate to components — preserves exact behavior). Note: the `themeToggle` locator conflicts with the `themeToggle` component name — use `themeToggleComponent` for the component property, or rename the component property to `theme` to avoid collision.
- [x] T008 [P] [US1] Add `SearchComponent` composition to `IndexPage` in `tests/e2e/helpers/IndexPage.ts` — Import `SearchComponent` from `../components`. Add `readonly search: SearchComponent` property initialized in constructor. Existing `searchFor()`, `clearSearch()`, `getSearchResultCount()` methods remain unchanged.
- [x] T009 [P] [US1] Add `SearchComponent` composition to `LearningResourcesPage` in `tests/e2e/helpers/LearningResourcesPage.ts` — Import `SearchComponent` from `../components`. Add `readonly search: SearchComponent` property initialized in constructor. Existing `searchFor()`, `clearSearch()` methods remain unchanged. Note: ConceptMapPage does NOT get SearchComponent — it uses `#concept-search` (different selector).
- [x] T010 [US1] Extend barrel exports in `tests/e2e/helpers/index.ts` — Add re-exports for all component classes: `export { NavbarComponent, SearchComponent, ThemeToggleComponent, ScrollToTopComponent } from '../components'`. This enables `import { NavbarComponent, IndexPage } from '../helpers'` in spec files.
- [x] T011 [US1] Backward compatibility verification — Run `npx playwright test --project=chromium tests/e2e/concept-map/`. All 58 tests MUST pass with zero changes to spec files. If any test fails, fix the composition change in T007-T009 that caused the failure before proceeding.

**Checkpoint**: Page Objects compose Component Objects. All 58 existing tests pass unchanged. Component properties are accessible via `page.navbar`, `page.themeToggleComponent`, `page.scrollToTop`, `page.search`.

---

## Phase 4: US2 — Navigation & Link Regression Tests (Priority: P1)

**Goal**: Implement navigation and link validation test suites using POM + COM exclusively (zero CSS selectors in spec files).

**Independent Test**: `npx playwright test --project=chromium tests/e2e/navigation/ tests/e2e/links/`

### Implementation for US2 — Navigation

- [x] T012 [US2] Create navbar regression spec in `tests/e2e/navigation/navbar.spec.ts` — Tests per `contracts/test-expectations.md` Navigation Suite: (1) navbar contains >= 6 links on each of the 3 pages, (2) each nav link navigates to correct page (click link, verify URL contains expected page path), (3) mobile hamburger opens/closes (set viewport to 390x844, click hamburger, verify aria-expanded toggles and menu becomes visible/hidden), (4) cross-page round-trip (index -> concept-map -> learning-resources -> index via NavbarComponent.navigateTo()). Import all 3 Page Objects from `../helpers`. Use `NavbarComponent` via Page Object `.navbar` property.

### Implementation for US2 — Links

- [x] T013 [US2] Create link validation spec in `tests/e2e/links/link-validation.spec.ts` — Tests per `contracts/test-expectations.md` Link Validation Suite: (1) collect all links from each page via `getAllLinks()`, (2) filter internal links (href starts with `/aws_sap_studying/`), validate each returns HTTP 200 via `page.request.get()`, (3) filter external links (http/https), validate URL parses successfully, (4) verify no `<a>` with empty href (`href=""` or `href="#"` except scroll-to-top anchors). Deduplicate URLs across pages. Import all 3 Page Objects from `../helpers`.

**Checkpoint**: `npx playwright test --project=chromium tests/e2e/navigation/ tests/e2e/links/` passes.

---

## Phase 5: US2 — Interaction Regression Tests (Priority: P1)

**Goal**: Implement interaction test suites covering theme toggle, search, and scroll-to-top.

**Independent Test**: `npx playwright test --project=chromium tests/e2e/interaction/`

### Implementation for US2 — Interaction

- [x] T014 [P] [US2] Create theme toggle spec in `tests/e2e/interaction/theme-toggle.spec.ts` — Tests: (1) toggle switches `data-theme` from default to `dark` and back to light, (2) theme persists across navigation: toggle to dark on IndexPage, navigate to ConceptMapPage via `.goto()`, verify `isDarkMode()` is still true. Use `ThemeToggleComponent` via Page Object `.themeToggleComponent` property. Import `IndexPage`, `ConceptMapPage` from `../helpers`.
- [x] T015 [P] [US2] Create search spec in `tests/e2e/interaction/search.spec.ts` — Tests: (1) fill "VPC" on IndexPage, verify `hasResults()` is true and `getResultCount()` is not "0", (2) fill "xyznonexistent", verify no-results message is visible, (3) clear search, verify input is empty and results hidden. Repeat core search test on LearningResourcesPage to verify component reuse. Use `SearchComponent` via Page Object `.search` property.
- [x] T016 [P] [US2] Create scroll-to-top spec in `tests/e2e/interaction/scroll-to-top.spec.ts` — Tests: (1) navigate to IndexPage, scroll down 500px via `page.evaluate(() => window.scrollBy(0, 500))`, verify `isVisible()` becomes true, (2) click scroll-to-top, verify `window.scrollY` is near 0. Use `ScrollToTopComponent` via Page Object `.scrollToTop` property (or dedicated component name if renamed to avoid locator collision).

**Checkpoint**: `npx playwright test --project=chromium tests/e2e/interaction/` passes.

---

## Phase 6: US2 — Visual Regression Tests (Priority: P1)

**Goal**: Implement screenshot comparison tests for visual regression detection.

**Independent Test**: `npx playwright test --project=chromium tests/e2e/visual/`

### Implementation for US2 — Visual

- [x] T017 [US2] Create visual regression spec in `tests/e2e/visual/visual-regression.spec.ts` — 9 screenshot tests per `contracts/test-expectations.md`: (1) 3 pages x desktop (1280x720) in light mode, (2) 3 pages x mobile (390x844) in light mode, (3) 3 pages x desktop (1280x720) in dark mode (toggle theme before screenshot). Use `toHaveScreenshot()` with `{ maxDiffPixelRatio: 0.005, animations: 'disabled' }`. Use Page Object `goto()` + `waitForReady()` for each page. Name screenshots descriptively: `index-desktop-light.png`, `concept-map-mobile-light.png`, `learning-resources-desktop-dark.png`, etc.
- [x] T018 [US2] Generate baseline screenshots — Run `npx playwright test --project=chromium tests/e2e/visual/ --update-snapshots`. Verify baselines are created in `tests/e2e/__snapshots__/`. Confirm test passes against baselines. Commit baseline images.

**Checkpoint**: `npx playwright test --project=chromium tests/e2e/visual/` passes against generated baselines.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, full verification, cleanup

- [x] T019 Update `CLAUDE.md` Testing & QA section — Add Component Object Model documentation: `tests/e2e/components/` directory listing, COM class hierarchy, import patterns (`import { NavbarComponent } from '../components'`), and regression test run commands (`npx playwright test --project=chromium tests/e2e/navigation/` etc).
- [x] T020 Full regression run — Execute `npx playwright test --project=chromium` to verify ALL tests pass together: 58 existing concept-map tests + new navigation/links/interaction/visual regression suites. Report total test count and pass rate.
- [x] T021 Validate `quickstart.md` examples — Verify each code snippet from `quickstart.md` is achievable with the implemented API: component property access paths, method signatures, import paths all match the actual implementation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — creates Component Objects
- **US1 (Phase 3)**: Depends on Phase 2 — composes components into Page Objects
- **US2 Navigation/Links (Phase 4)**: Depends on Phase 3 — uses composed Page Objects
- **US2 Interaction (Phase 5)**: Depends on Phase 3 — uses composed Page Objects
- **US2 Visual (Phase 6)**: Depends on Phase 3 — uses composed Page Objects
- **Polish (Phase 7)**: Depends on Phases 4-6 completion

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2) — no dependencies on US2
- **US2 (P1)**: Depends on US1 (Phase 3) — needs composed Page Objects to write selector-free specs

### Critical Path

```text
T001 → T002-T005 (parallel) → T006 → T007 → T008+T009 (parallel) → T010 → T011 → T012-T016 (parallel) → T017 → T018 → T019-T021
```

### Parallel Opportunities

Within Phase 2 (Foundational):
```
T002: NavbarComponent      ─┐
T003: SearchComponent       ├─ All parallel (different files, no deps)
T004: ThemeToggleComponent  │
T005: ScrollToTopComponent ─┘
→ T006: barrel export (depends on T002-T005)
```

Within Phase 3 (US1):
```
T007: BasePage composition (must be first — subclasses inherit)
→ T008: IndexPage + SearchComponent    ─┐ parallel (different files)
→ T009: LearningResourcesPage + Search ─┘
→ T010: barrel exports (depends on T008-T009)
→ T011: backward compat verification
```

Phases 4, 5, 6 can proceed in parallel after Phase 3:
```
Phase 4: T012 + T013 (navigation + links)  ─┐
Phase 5: T014 + T015 + T016 (interaction)    ├─ All parallel (different directories)
Phase 6: T017 → T018 (visual + baselines)   ─┘
```

---

## Implementation Strategy

### MVP First (Phase 1-3 Only)

1. Complete Phase 1: Setup (directory)
2. Complete Phase 2: Foundational (4 Component Objects)
3. Complete Phase 3: US1 (Page Object composition + backward compat)
4. **STOP and VALIDATE**: 58 existing tests pass, component properties accessible
5. Safe stopping point — all existing functionality preserved, COM layer available

### Full Delivery (Add Phases 4-7)

6. Complete Phases 4-6 (parallel if possible): all 4 regression test suites
7. Complete Phase 7: Polish, documentation, full verification
8. **FINAL VALIDATION**: All tests pass (58 existing + ~39 new regression tests)

---

## Notes

- [P] tasks = different files, no dependencies on each other
- [US1/US2] label maps task to specific user story for traceability
- Zero CSS selectors allowed in any regression spec file (SC-001 from spec.md)
- ConceptMapPage does NOT get SearchComponent — its search uses `#concept-search` (different selectors from `#searchInput`)
- `themeToggle` property name collision: BasePage already has `readonly themeToggle: Locator`. The component property must use a different name (e.g., `themeToggleComponent` or `theme`)
- `scrollToTop` has the same collision issue — use `scrollToTopComponent` or similar
- Visual regression baselines must be generated (T018) before comparison tests can pass in CI
- Commit after each phase checkpoint
