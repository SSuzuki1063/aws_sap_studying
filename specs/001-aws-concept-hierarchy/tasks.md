# Tasks: Playwright Regression Testing System

**Input**: Design documents from `/specs/001-aws-concept-hierarchy/`
**Prerequisites**: plan.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: This feature IS a test suite. No separate test tasks needed — each implementation task produces runnable tests.

**Organization**: Tasks are grouped by test suite (user story). Each suite is independently implementable and verifiable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1=Visual, US2=Navigation, US3=Links, US4=Interaction)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend existing Playwright config and create test directory structure

- [ ] T001 Create test directory structure: `tests/e2e/visual/`, `tests/e2e/navigation/`, `tests/e2e/links/`, `tests/e2e/interaction/`
- [ ] T002 Add 4 regression projects (`regression-visual`, `regression-nav`, `regression-links`, `regression-interaction`) to `playwright.config.ts`
- [ ] T003 Add `test:regression` npm script to `package.json` that runs all 4 regression projects

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ensure the build and server work correctly for regression tests

**This phase is minimal** — the existing Playwright infrastructure handles most foundational concerns (browser install, server startup, reporter config).

- [ ] T004 Verify existing `playwright.config.ts` webServer config serves built Astro output on port 8080 for regression projects (may need to adjust `reuseExistingServer` or add build step)
- [ ] T005 Verify the 3 target pages load successfully: `/aws_sap_studying/`, `/aws_sap_studying/concept-map.html`, `/aws_sap_studying/learning-resources.html`

**Checkpoint**: Regression projects registered, directories created, server serves pages — test files can now be implemented.

---

## Phase 3: User Story 1 — Visual Regression Tests (Priority: P1) MVP

**Goal**: Detect UI regressions via full-page screenshot comparison across 3 pages x 3 viewports = 9 screenshots

**Independent Test**: Run `npx playwright test --project=regression-visual` — should capture/compare 9 screenshots and fail on visual diff exceeding threshold

### Implementation for User Story 1

- [ ] T006 [US1] Create visual regression spec with 3-page x 3-viewport matrix using `toHaveScreenshot()` in `tests/e2e/visual/visual-regression.spec.ts`
  - Pages: index (threshold 0.01), concept-map (threshold 0.02, waitFor `#mm-app-root`), learning-resources (threshold 0.01)
  - Viewports: desktop 1440x900, tablet 768x1024, mobile 390x844
  - Options: `fullPage: true`, `animations: 'disabled'`
- [ ] T007 [US1] Generate initial screenshot baselines by running `npx playwright test --project=regression-visual --update-snapshots`
- [ ] T008 [US1] Verify baselines are stored in `tests/e2e/visual/visual-regression.spec.ts-snapshots/` and commit them

**Checkpoint**: Visual regression suite runs independently. `npx playwright test --project=regression-visual` passes with baseline screenshots.

---

## Phase 4: User Story 2 — Navigation Tests (Priority: P1)

**Goal**: Verify cross-page navigation works — clicking links on home page reaches correct destinations with expected content

**Independent Test**: Run `npx playwright test --project=regression-nav` — should verify 4 navigation flows complete successfully

### Implementation for User Story 2

- [ ] T009 [US2] Create navigation test spec in `tests/e2e/navigation/navigation.spec.ts`
  - Test 1: Home → Concept Map — click link matching `a[href*="concept-map"]`, assert URL contains `concept-map`, assert page heading visible
  - Test 2: Home → Learning Resources — click link matching `a[href*="learning-resources"]`, assert URL match, assert heading visible
  - Test 3: Home → GitHub — verify link with `href` containing `github.com` exists in DOM (do not navigate)
  - Test 4: Concept Map → Home — click breadcrumb/home link, assert URL returns to `/aws_sap_studying/`

**Checkpoint**: Navigation suite runs independently. All 4 navigation tests pass.

---

## Phase 5: User Story 3 — Link Validation Tests (Priority: P2)

**Goal**: Detect broken internal links and warn about broken external links across all 3 target pages

**Independent Test**: Run `npx playwright test --project=regression-links` — should collect all `<a>` tags, HEAD-check internal links, warn on external failures

### Implementation for User Story 3

- [ ] T010 [US3] Create link validation spec in `tests/e2e/links/link-validation.spec.ts`
  - For each of 3 pages: collect all `<a>` tags via `page.$$eval`
  - Skip: `mailto:`, `javascript:`, `tel:`, empty `href`, `href="#"`
  - Internal links (`/aws_sap_studying/*`): HTTP HEAD via `request.newContext()`, assert status < 400
  - Anchor links (`#id`): verify target element exists in DOM via `page.locator('#id')`
  - External links (`http*`): HTTP HEAD with 10s timeout, log warnings on failure (do NOT fail test)
  - Deduplicate URLs before checking (same link may appear multiple times)
  - Use concurrency limit (e.g., Promise pool of 5) for parallel HEAD requests

**Checkpoint**: Link validation suite runs independently. Internal links all resolve, external link warnings logged.

---

## Phase 6: User Story 4 — Interaction Tests (Priority: P2)

**Goal**: Verify interactive components respond correctly to user actions (concept-map hierarchy, search, filters, mobile tabs)

**Independent Test**: Run `npx playwright test --project=regression-interaction` — should verify 5-6 interaction scenarios pass

### Implementation for User Story 4

- [ ] T011 [US4] Create interaction test spec in `tests/e2e/interaction/interaction.spec.ts`
  - Test 1: Concept Map L1 expand — click first `.mm-l1-item`, assert children container becomes visible
  - Test 2: Concept Map L2 expand — click first `.mm-l2-item` (after L1 expand), assert L3 concepts appear
  - Test 3: Concept Map search — type query in `#mm-search-input`, assert results filter (visible items count changes)
  - Test 4: Concept Map filter — click first `.mm-tag-btn`, assert tag gets `.mm-tag-active` class
  - Test 5: Mobile tab switch — set viewport to 390x844, click `[role="tab"]`, assert tab panel visibility toggles
  - Test 6 (optional): Dark mode toggle — if toggle button exists, click it, assert `data-theme` or CSS class changes

**Checkpoint**: Interaction suite runs independently. All interactive component tests pass.

---

## Phase 7: CI Integration & Polish

**Purpose**: GitHub Actions workflow and cross-cutting improvements

- [ ] T012 Create GitHub Actions workflow in `.github/workflows/regression-tests.yml`
  - Trigger: `pull_request` + `push` to `master`
  - Path filter: `**/*.html`, `**/*.css`, `**/*.js`, `public/**`, `src/**`, `tests/e2e/visual/**`, `tests/e2e/navigation/**`, `tests/e2e/links/**`, `tests/e2e/interaction/**`
  - Steps: checkout → setup-node@v4 (Node 20) → `npm ci` → `npx playwright install chromium` → `npm run build` → run all 4 regression projects → upload `playwright-report/` and `test-results/` artifacts on failure
  - Set `CI=true` env variable (Playwright config already uses this for retries/workers)
- [ ] T013 Run full regression suite locally and verify all tests pass: `npm run test:regression`
- [ ] T014 Verify CI workflow runs correctly by pushing branch and checking GitHub Actions output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phases 3-6)**: All depend on Foundational (Phase 2) completion
  - US1 (Visual) and US2 (Navigation) can run in parallel — different directories, no shared state
  - US3 (Links) and US4 (Interaction) can run in parallel — different directories, no shared state
  - All 4 stories can technically run in parallel
- **CI & Polish (Phase 7)**: Depends on all 4 user stories being complete

### User Story Dependencies

- **US1 (Visual)**: Standalone — only needs pages to load
- **US2 (Navigation)**: Standalone — only needs links to exist on pages
- **US3 (Links)**: Standalone — only needs `<a>` tags on pages
- **US4 (Interaction)**: Standalone — only needs interactive components on concept-map

### Within Each User Story

- Single implementation task per story (one spec file each)
- US1 has extra tasks for baseline generation/commit

### Parallel Opportunities

All 4 user stories are fully independent — they test different aspects, write to different files, and have no shared mutable state.

```text
Phase 1 (T001-T003) → Phase 2 (T004-T005) → ┬→ US1 (T006-T008)  ─┐
                                              ├→ US2 (T009)        ├→ Phase 7 (T012-T014)
                                              ├→ US3 (T010)        │
                                              └→ US4 (T011)       ─┘
```

---

## Parallel Example: All User Stories

```bash
# After Phase 2 completes, launch all 4 stories in parallel:
Task: "Create visual regression spec in tests/e2e/visual/visual-regression.spec.ts"
Task: "Create navigation test spec in tests/e2e/navigation/navigation.spec.ts"
Task: "Create link validation spec in tests/e2e/links/link-validation.spec.ts"
Task: "Create interaction test spec in tests/e2e/interaction/interaction.spec.ts"
```

---

## Implementation Strategy

### MVP First (US1 + US2 = Visual + Navigation)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Complete Phase 3: Visual Regression (T006-T008)
4. **STOP and VALIDATE**: `npx playwright test --project=regression-visual` passes
5. Complete Phase 4: Navigation (T009)
6. **VALIDATE**: Both suites pass independently

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add Visual Regression → 9 screenshot baselines captured → Validate (MVP!)
3. Add Navigation → 4 nav flows verified → Validate
4. Add Link Validation → Broken links detected → Validate
5. Add Interaction → Component behavior verified → Validate
6. Add CI workflow → Automated on every PR → Deploy

### Performance Budget Check

After all suites are implemented, run the full suite and verify total time < 2 minutes:
```bash
time npx playwright test --project=regression-visual --project=regression-nav --project=regression-links --project=regression-interaction
```

---

## Notes

- All 4 spec files are independent — no shared helpers needed (existing `ConceptMapPage.ts` helper can be reused in US4 if helpful but is not required)
- Screenshot baselines (US1) must be committed to git — they are the "expected" reference
- External link validation is intentionally soft-fail to prevent flaky CI
- The existing `playwright.config.ts` already handles CI detection (`process.env.CI`) for retries and worker count
