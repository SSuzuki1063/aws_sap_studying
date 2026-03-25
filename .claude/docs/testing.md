# Testing & QA

## Playwright E2E tests

```bash
npm run test:e2e:chromium                              # all specs (chromium)
npx playwright test --project=chromium tests/e2e/concept-map/filters.spec.ts  # single spec
npx playwright test --project=qa                       # QA specs only
npx playwright test --project=mobile-chrome            # mobile viewport
npx playwright test --headed                           # visible browser (debugging)
npm run test:e2e:ui                                    # interactive UI mode
```

Playwright projects: `chromium`, `firefox`, `webkit`, `mobile-chrome` (Pixel 5), `qa` (reads JSON reports).
Config: `baseURL: http://localhost:4321`, webServer: `npm run preview:test`, retries: 2 in CI / 0 locally.

## CSS & HTML validation (before committing)

```bash
python3 scripts/ci/validate_html_w3c.py --pr-mode   # HTML: changed files only
npm run qa:css-validate:pr                           # CSS W3C: changed files only
```

## Full QA pipeline (after starting preview server)

```bash
npm run build && npx astro preview &
npm run qa:all   # css-validate + css-runtime + unified report → qa-reports/index.html
```

## Playwright test architecture

`tests/` has two distinct layers:
- **`tests/e2e/concept-map/`** — 7 spec files, 58 tests (tabs, filters, accessibility, hierarchy, navigation, related-links, dom-snapshot)
- **`tests/e2e/navigation/`** — navbar regression tests (links, mobile hamburger, cross-page navigation)
- **`tests/e2e/links/`** — link validation tests (internal HTTP 200, external URL format, no empty hrefs)
- **`tests/e2e/interaction/`** — interaction tests (theme toggle, search, scroll-to-top)
- **`tests/e2e/visual/`** — visual regression screenshot tests (desktop/mobile, light/dark)
- **`tests/e2e/qa/`** — QA specs that read JSON reports: `css-validation.spec.ts`, `css-runtime.spec.ts`
- **`tests/e2e/helpers/`** — Page Object Model classes (see below)
- **`tests/e2e/components/`** — Component Object Model classes (see below)
- **`tests/modules/`** — Shared TypeScript modules: `types/`, `validators/`, `runtime/`, `accessibility/`, `dom/`, `ui-regression/`, `report/`
- **`tests/config/css-runtime-expectations.json`** — Per-page CSS property expectations (desktop + mobile viewports)

## Page Object Model (POM) + Component Object Model (COM)

All test specs use Page Object classes from `tests/e2e/helpers/`, which compose Component Objects from `tests/e2e/components/`:

```text
Component Objects (tests/e2e/components/)
├── NavbarComponent          — .fixed-nav-header: nav links, mobile hamburger, page routing
├── SearchComponent          — #searchInput: fill, clear, result count, has-results
├── ThemeToggleComponent     — .theme-toggle: toggle, getTheme, isDarkMode
└── ScrollToTopComponent     — #scrollToTop: click, isVisible, waitForVisible

Page Objects (tests/e2e/helpers/) — compose Component Objects as readonly properties
BasePage (abstract)          — navbar, themeToggleComponent, scrollToTopComponent + goto(), getAllLinks()
├── IndexPage                — search (SearchComponent) + index.html-specific locators
├── ConceptMapPage           — concept-map.html: L1/L2/L3 hierarchy, filters, breadcrumbs, detail panel
└── LearningResourcesPage   — search (SearchComponent) + learning-resources.html-specific locators
```

Import via barrel: `import { IndexPage, ConceptMapPage, NavbarComponent } from '../helpers'`

When writing new test specs, always use Page Object/Component Object methods — never write raw CSS selectors in spec files.

## Regression test commands

```bash
npx playwright test --project=chromium tests/e2e/navigation/   # navbar regression
npx playwright test --project=chromium tests/e2e/links/         # link validation
npx playwright test --project=chromium tests/e2e/interaction/   # theme, search, scroll-to-top
npx playwright test --project=chromium tests/e2e/visual/        # visual regression screenshots
npx playwright test --project=chromium tests/e2e/visual/ --update-snapshots  # regenerate baselines
```
