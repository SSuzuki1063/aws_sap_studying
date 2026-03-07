# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Astro SSG (build: `npm run build` → `dist/`) |
| **Content** | 290+ resources (.astro), 219 quiz questions, 8 categories |
| **Branches** | `master` (source), `gh-pages` (build output, CI-managed) |

## ⚠️ CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**
> File-type-specific details are in `.claude/rules/` (loaded automatically when editing matching files).

1. **Always Use Skills for Resource Integration** — `/skill resource` (unified entry point). Never manually run integration scripts.
2. **Three-Place Update Rule** — When adding resources, update `data.js` resources array + `data.js` updateHistory + `index.js` searchData. Details: `.claude/rules/data-navigation.md`
3. **GitHub Pages Path Prefix** — All paths MUST include `/aws_sap_studying/`. Details: `.claude/rules/html-standards.md`
4. **W3C Validation Required** — All HTML must pass validation before commit. `python3 scripts/ci/validate_html_w3c.py --pr-mode`. CSS files also require W3C validation: `npm run qa:css-validate:pr`.
5. **Deploy via `/deploy` Skill** — Commits, merges to master, pushes. GitHub Actions builds and deploys to gh-pages automatically.
6. **Use `<h2>` for Section Headings** — `add_sidebar_toc.py` only recognizes `<h2>`/`<h3>`. Details: `.claude/rules/html-standards.md`

## Quick Start

```bash
# Python (HTML generation, validation scripts)
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests
python3 server.py  # → http://localhost:8080/

# Node.js (Playwright E2E tests + QA system)
npm ci
```

## Environment

- Use `uv` instead of `pip` for Python package management
- Always create/activate a virtual environment before installing packages

## Testing & QA

### Playwright E2E tests
```bash
npm run test:e2e:chromium                              # all concept-map specs (chromium only)
npx playwright test --project=chromium tests/e2e/concept-map/filters.spec.ts  # single spec file
npx playwright test --project=qa                       # QA spec suite only
npx playwright test --headed                           # visible browser (debugging)
```

### CSS & HTML validation (before committing)
```bash
python3 scripts/ci/validate_html_w3c.py --pr-mode   # HTML: changed files only
npm run qa:css-validate:pr                           # CSS W3C: changed files only
```

### Full QA pipeline (after starting server)
```bash
python3 server.py &
npm run qa:all   # css-validate + css-runtime + unified report → qa-reports/index.html
```

### Playwright test architecture
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

### Page Object Model (POM) + Component Object Model (COM)
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

### Regression test commands
```bash
npx playwright test --project=chromium tests/e2e/navigation/   # navbar regression
npx playwright test --project=chromium tests/e2e/links/         # link validation
npx playwright test --project=chromium tests/e2e/interaction/   # theme, search, scroll-to-top
npx playwright test --project=chromium tests/e2e/visual/        # visual regression screenshots
npx playwright test --project=chromium tests/e2e/visual/ --update-snapshots  # regenerate baselines
```

CI: `.github/workflows/qa-unified.yml` — 4-job pipeline: static-validation (no browser) → runtime-validation (Playwright) → visual-regression (`if: false`, pending baselines) → publish-report.

## Documentation Reference

| Topic | File |
|-------|------|
| **HTML rules** (paths, W3C, WCAG, headings) | `.claude/rules/html-standards.md` |
| **Data/navigation rules** (data.js, render.js) | `.claude/rules/data-navigation.md` |
| **CSS rules** (colors, z-index, responsive) | `.claude/rules/css-standards.md` |
| **JS rules** (vanilla JS, conventions) | `.claude/rules/javascript-standards.md` |
| **Integration workflow** (scripts, categorization) | `.claude/rules/integration-workflow.md` |
| Architecture, Key Files, render.js | `.claude/docs/architecture.md` |
| Workflows, File Placement, Key Scripts | `.claude/docs/workflows.md` |
| WCAG Colors, Deprecated Colors, CI/CD Pipeline | `.claude/docs/accessibility.md` |
| Pre-Commit Checklist, Hook Info | `.claude/docs/pre-commit.md` |
| Available Skills, Speckit Commands | `.claude/docs/skills.md` |
| Concept Map System | `.claude/docs/concept-map.md` |
| Architecture (detailed) | `docs/ARCHITECTURE.md` |
| Development Guide | `docs/DEVELOPMENT_GUIDE.md` |
| Git Workflow | `docs/GIT_WORKFLOW.md` |
| Coding Standards | `docs/CODING_STANDARDS.md` |
| CI/CD Pipeline | `docs/CI_CD_GUIDE.md` |
| Accessibility | `docs/WCAG21_GUIDELINES.md` |
| QA CI workflow (CSS + runtime) | `.github/workflows/qa-unified.yml` |
| QA shared types | `tests/modules/types/index.ts` |

## Deployment

- Use `/deploy` skill for the full pipeline: commit → merge to master → push → GitHub Actions build → gh-pages
- GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds with `npm run build` and deploys `dist/` to gh-pages on master push
- `master` = source code, `gh-pages` = build output only (managed by CI)
- Standard workflow: implement → validate → `/deploy`

## Working Style

- Minimize planning phases — move to implementation quickly
- Do not spend entire sessions in planning/exploration mode without producing code
- When working with large files or PDFs, be aware of token limits and chunk output proactively

## Active Technologies
- TypeScript 5.4.5 (existing), Node.js 20+ + `@playwright/test` 1.44.0 (existing), `@axe-core/playwright` 4.10.1 (existing), `tsx` 4.21.0 (existing) (001-playwright-regression-tests)
- File-based screenshot baselines in `tests/__screenshots__/`; JSON reports in `qa-reports/` (001-playwright-regression-tests)
- TypeScript 5.4.5 + @playwright/test 1.44.0, @axe-core/playwright 4.10.1, tsx 4.21.0 (003-page-object-model)
- N/A (test infrastructure only) (003-page-object-model)

## Recent Changes
- 001-playwright-regression-tests: Added TypeScript 5.4.5 (existing), Node.js 20+ + `@playwright/test` 1.44.0 (existing), `@axe-core/playwright` 4.10.1 (existing), `tsx` 4.21.0 (existing)
