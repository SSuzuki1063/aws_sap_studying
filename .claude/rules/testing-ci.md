---
paths:
  - "tests/**"
  - ".github/workflows/**"
  - "scripts/ci/**"
  - "scripts/accessibility/**"
  - "scripts/check_fixed_headers.py"
  - "scripts/git_hooks/**"
  - "playwright.config.*"
---

# Testing, CI/CD & Pre-Commit Hooks

## Testing Architecture

Tests in `tests/e2e/` organized by concern: `interaction/`, `navigation/`, `links/`, `concept-map/`, `qa/`, `visual/`. Playwright projects: chromium, firefox, webkit, mobile-chrome, plus a dedicated `qa` project (CSS/runtime only, no retries). `tests/modules/` provides shared utilities for accessibility (axe), DOM semantic checks, CSS validation, and unified QA reporting.

### Commands

| Command | Purpose |
|---------|---------|
| `npm run test:e2e:chromium` | Run all E2E tests (chromium) |
| `npx playwright test --project=chromium tests/e2e/navigation/navbar.spec.ts` | Run a single test file |
| `npx playwright test --project=chromium -g "test name"` | Run a single test by name |
| `npx playwright test --project=qa` | QA-only tests (CSS validation, runtime checks) |
| `npx astro check` | Astro/TypeScript diagnostics |

### Validation & QA

| Command | Purpose |
|---------|---------|
| `python3 scripts/ci/validate_html_w3c.py --pr-mode` | W3C HTML validation (changed files only) |
| `python3 scripts/ci/validate_html_w3c.py --files networking/foo.html` | W3C validation (specific file) |
| `npm run qa:css-validate:pr` | CSS W3C validation (changed files only) |
| `npm run qa:all` | Full QA pipeline (CSS validate + runtime + report) |

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | push to master / manual | `npm run build` → verify critical assets in `dist/` → deploy to gh-pages |
| `qa-unified.yml` | PR to master/gh-pages (CSS/src/public/tests changes) | W3C HTML + CSS validation (static), then Playwright + CSS runtime |
| `playwright-e2e.yml` | push to master / PR (src/public/tests changes) | Full E2E across chromium/firefox/webkit/mobile-chrome |
| `pr-quality-check.yml` | PR to master/gh-pages (src/public/scripts changes) | CSS validation + link checks |

## Pre-Commit Hooks

Four auto-checks run on every `git commit` (`.git/hooks/pre-commit`):

1. **Guard**: blocks staging `public/concepts/` (build-time generated)
2. **Last modified date**: `scripts/git_hooks/update_last_modified.py` updates `data.js` via `// GIT_LAST_COMMIT_DATE` marker
3. **WCAG contrast**: `scripts/accessibility/check_contrast_ratio.py` — exit 1 if violations
4. **Fixed headers**: `scripts/check_fixed_headers.py` — validates fixed header structure

> `public/data.js` の `lastUpdated` 行末の `// GIT_LAST_COMMIT_DATE` コメントは **削除禁止**。
