# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository built with Astro SSG.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Astro 5.x SSG (build: `npm run build` → `dist/`) |
| **Content** | 290 resource pages (.astro), 8 display categories, 12 page directories |
| **Branches** | `master` (source), `gh-pages` (build output, CI-managed) |

## ⚠️ CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**
> File-type-specific details are in `.claude/rules/` (loaded automatically when editing matching files).

1. **Always Use Skills for Resource Integration** — `/skill resource` (unified entry point) or `/ship` (full pipeline). Never manually copy HTML files into `src/pages/`.
2. **Registry-Driven Data** — When adding resources, update `src/data/resource-registry.json` + `src/data/update-history.json`, then run `node scripts/generate-data.mjs` to regenerate `public/data.js`, `public/index.js`, and `src/data/resources.ts`. Details: `.claude/rules/data-navigation.md`
3. **GitHub Pages Path Prefix** — All paths MUST include `/aws_sap_studying/`. Details: `.claude/rules/html-standards.md`
4. **W3C Validation Required** — All HTML must pass validation before commit. `python3 scripts/ci/validate_html_w3c.py --pr-mode`. CSS: `npm run qa:css-validate:pr`.
5. **Deploy via `/deploy` Skill** — Commits, merges to master, pushes. GitHub Actions builds and deploys to gh-pages automatically.
6. **Use `<h2>` for Section Headings** — `ResourceLayout.astro` TOC only recognizes `<h2>`/`<h3>`. Details: `.claude/rules/html-standards.md`

## Quick Start

```bash
# Python (validation scripts)
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# Node.js (Astro build + Playwright E2E tests + QA system)
npm ci
npm run dev       # → http://localhost:4321/aws_sap_studying (dev server, syncs assets first)
npm run preview   # → http://localhost:4321/aws_sap_studying (production preview, requires build)
```

### Key npm Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (syncs concepts + static assets → astro dev) |
| `npm run build` | Full production build (sync → generate-data → astro build → `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run preview:test` | Build + preview (used by Playwright webServer) |
| `node scripts/generate-data.mjs` | Regenerate `public/data.js`, `public/index.js`, `src/data/resources.ts` from registry |
| `npm run test:e2e:chromium` | Run all E2E tests (chromium) |
| `npm run qa:css-validate:pr` | CSS W3C validation (changed files only) |
| `npm run qa:all` | Full QA pipeline (CSS validate + runtime + report) |

## Environment

- Use `uv` instead of `pip` for Python package management
- Always create/activate a virtual environment before installing packages

## Build Pipeline

The build (`npm run build`) runs these steps in order:
1. `sync:concepts` — copies `concepts/` → `public/concepts/` (concept map JSON data)
2. `sync:static` — copies `css/`, `js/`, `output_images/` → `public/` (source CSS/JS lives at repo root, NOT in `src/`)
3. `generate-data.mjs` — reads `src/data/resource-registry.json` and produces **three outputs**:
   - `public/data.js` — runtime data for index, knowledge-base, bookmark pages (loaded via `<script>`)
   - `public/index.js` — search data (searchData array) for client-side search
   - `src/data/resources.ts` — build-time TypeScript data imported by `learning-resources.astro`
4. `astro build` — SSG render to `dist/`

**`src/data/resources.ts` is auto-generated** — never edit it manually.

### When to Update What

| What you're doing | Files to update | Then run |
|---|---|---|
| Adding/removing a resource page | `src/data/resource-registry.json` + `src/data/update-history.json` | `node scripts/generate-data.mjs` |
| Changing resource metadata (title, category, tags) | `src/data/resource-registry.json` | `node scripts/generate-data.mjs` |
| Adding/editing concept map data | `concepts/services/<service>.json` | `python3 scripts/concept_management/generate_concept_index.py` |

Use `/skill resource` or `/ship` for the full workflow — they handle these updates automatically.

### Astro Configuration

- `build.format: 'file'` — produces `networking/foo.html` (NOT `networking/foo/index.html`)
- Asset filenames are NOT hashed — `assetFileNames: '[name][extname]'` preserves original paths
- Base path: `/aws_sap_studying` (critical — already enforced by Critical Rule #3)

### Category Architecture

Resource pages live in `src/pages/<directory>/`. There are **12 page directories** but only **8 display categories** used in data.js navigation:

| Display Category (data.js) | Page Directory | Resources |
|---|---|---|
| `networking` | `networking/` | 72 |
| `security-governance` | `security-governance/` | 80 |
| `compute-applications` | `compute-applications/` | 57 |
| `content-delivery-dns` | `content-delivery-dns/` | 23 |
| `development-deployment` | `development-deployment/` | 22 |
| `storage-database` | `storage-database/` | 14 |
| `migration` | `migration/` | 11 |
| `analytics-operations` | `analytics-bigdata/` | 15 |

Additional directories (`continuous-improvement/`, `cost-control/`, `new-solutions/`, `organizational-complexity/`) contain pages whose `displayCategory` in `resource-registry.json` maps them into one of the 8 display categories above.

### Key Layouts

| Layout | Used by |
|--------|---------|
| `BaseLayout.astro` | Most pages (index, quiz, concept-map, etc.) |
| `ResourceLayout.astro` | Individual resource pages (`src/pages/<category>/*.astro`) |
| `LearningResourcesLayout.astro` | `learning-resources.astro` (build-time rendered catalog) |

### Astro Resource Authoring Pattern

Resource `.astro` files use the **rawContent + `set:html`** pattern to safely render HTML containing literal `{}` (SVG inline styles, CLI examples like `Tags=[{Key=Name}]`):

```astro
---
import ResourceLayout from '../../layouts/ResourceLayout.astro';
const frontmatter = {
  title: 'Page Title',
  category: '<directory-name>',
  tocItems: [{ id: 'section-id', text: 'Section Title', level: 2 }],
  pageCss: '/aws_sap_studying/css/pages/<filename>.css',
};
const rawContent = `
  <!-- body HTML here — backticks escaped as \\\`, $ as \\$ -->
`;
---
<ResourceLayout frontmatter={frontmatter}>
  <Fragment set:html={rawContent} />
</ResourceLayout>
```

**Do NOT** place body HTML directly in the Astro template — any `{}` will be parsed as JSX expressions and cause build errors.

### CSS Specificity Pitfall: Inline h1/p Color

`css/common.css` sets `h1, h2, h3, h4, h5, h6 { color: var(--color-text-primary); }` (gray `#374151`). This **overrides** color inherited from parent elements like `.page-header { color: white; }` because direct rules beat inheritance. Pages with dark-background headers **must** set `color` explicitly on `.page-header h1` or `.header h1`:

```css
/* ✅ Explicit — works */
.page-header h1 { color: #fff; }

/* ❌ Inheritance only — h1 appears gray on dark background */
.page-header { color: #fff; }  /* h1 ignores this */
```

### Legacy Root HTML Files

Root-level `networking/*.html`, `compute-applications/*.html` etc. are **pre-Astro legacy files**. The source of truth is `src/pages/**/*.astro`. Legacy files are useful only as reference when an `.astro` file has `<!-- CONTENT EXTRACTION FAILED -->` (incomplete HTML→Astro conversion).

## Testing & QA

### Playwright E2E tests
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

### CSS & HTML validation (before committing)
```bash
python3 scripts/ci/validate_html_w3c.py --pr-mode   # HTML: changed files only
npm run qa:css-validate:pr                           # CSS W3C: changed files only
```

### Full QA pipeline (after starting preview server)
```bash
npm run build && npx astro preview &
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

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push to master | `npm run build` → verify critical assets → deploy `dist/` to gh-pages |
| `playwright-e2e.yml` | Push/PR to master | Run concept-map, navigation, links, interaction E2E tests |
| `qa-unified.yml` | Manual / scheduled | 4-job pipeline: static-validation → runtime-validation → visual-regression → publish-report |
| `pr-quality-check.yml` | PR to master | Pre-merge quality checks |

## Pre-Commit Hooks

Git hooks run automatically on every `git commit`:

1. `scripts/git_hooks/update_last_modified.py` — updates `data.js` lastUpdated date
2. `scripts/accessibility/check_contrast_ratio.py` — WCAG AA contrast check
3. `scripts/check_fixed_headers.py` — fixed header presence check

> **`data.js` の `lastUpdated` 行末の `// GIT_LAST_COMMIT_DATE` コメントは削除禁止。**
> Pre-commit hook がこのマーカーで日付を自動更新する。

## Deployment

- Use `/deploy` skill for the full pipeline: commit → merge to master → push → GitHub Actions build → gh-pages
- GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds with `npm run build` and deploys `dist/` to gh-pages on master push
- `master` = source code, `gh-pages` = build output only (managed by CI)
- Standard workflow: implement → validate → `/deploy`

## Documentation Reference

**Auto-loaded rules** (triggered when editing matching files):

| Rule | File |
|------|------|
| HTML (paths, W3C, WCAG, headings) | `.claude/rules/html-standards.md` |
| Data/navigation (data.js, render.js) | `.claude/rules/data-navigation.md` |
| CSS (colors, z-index, responsive) | `.claude/rules/css-standards.md` |
| JS (vanilla JS, conventions) | `.claude/rules/javascript-standards.md` |
| Integration workflow | `.claude/rules/integration-workflow.md` |

**Extended docs** (read on demand):

| Topic | File |
|-------|------|
| Architecture, Key Files, render.js | `.claude/docs/architecture.md` |
| Workflows, File Placement, Key Scripts | `.claude/docs/workflows.md` |
| WCAG Colors, CI/CD Pipeline | `.claude/docs/accessibility.md` |
| Pre-Commit Checklist | `.claude/docs/pre-commit.md` |
| Available Skills | `.claude/docs/skills.md` |
| Concept Map System | `.claude/docs/concept-map.md` |
| Architecture (detailed) | `docs/ARCHITECTURE.md` |
| Development Guide | `docs/DEVELOPMENT_GUIDE.md` |
| Git Workflow | `docs/GIT_WORKFLOW.md` |
| Coding Standards | `docs/CODING_STANDARDS.md` |
| CI/CD Pipeline | `docs/CI_CD_GUIDE.md` |
| Accessibility | `docs/WCAG21_GUIDELINES.md` |
| QA CI workflow | `.github/workflows/qa-unified.yml` |
| QA shared types | `tests/modules/types/index.ts` |

## Working Style

- Minimize planning phases — move to implementation quickly
- Do not spend entire sessions in planning/exploration mode without producing code
- When working with large files or PDFs, be aware of token limits and chunk output proactively
