# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Data-driven static site (NO build process) |
| **Content** | 259+ HTML resources, 219 quiz questions, 8 categories |
| **Branches** | `gh-pages` (production), `master` (development/PRs) |

## ⚠️ CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**
> File-type-specific details are in `.claude/rules/` (loaded automatically when editing matching files).

1. **Always Use Skills for Resource Integration** — `/skill resource` (unified entry point). Never manually run integration scripts.
2. **Three-Place Update Rule** — When adding resources, update `data.js` resources array + `data.js` updateHistory + `index.js` searchData. Details: `.claude/rules/data-navigation.md`
3. **GitHub Pages Path Prefix** — All paths MUST include `/aws_sap_studying/`. Details: `.claude/rules/html-standards.md`
4. **W3C Validation Required** — All HTML must pass validation before commit. `python3 scripts/ci/validate_html_w3c.py --pr-mode`. CSS files also require W3C validation: `npm run qa:css-validate:pr`.
5. **Immediate Push After Commit** — `git add <files> && git commit -m "feat: ..." && git push origin gh-pages`
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

### Playwright E2E tests (concept-map.html)
```bash
npm run test:e2e:chromium          # run existing concept-map specs (chromium only)
npx playwright test --project=qa   # run QA spec suite only
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

### Playwright QA architecture
`tests/` has two distinct layers:
- **`tests/e2e/concept-map/`** — existing interactive specs (tabs, filters, accessibility, DOM)
- **`tests/e2e/qa/`** — QA specs that read JSON reports: `css-validation.spec.ts` (asserts on static analysis output), `css-runtime.spec.ts` (getComputedStyle + BoundingRect checks)
- **`tests/modules/`** — Shared TypeScript modules: `types/`, `validators/`, `runtime/`, `accessibility/`, `dom/`, `ui-regression/`, `report/`
- **`tests/config/css-runtime-expectations.json`** — Per-page CSS property expectations (desktop + mobile viewports)

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

- Always commit AND deploy to gh-pages unless explicitly told otherwise
- Standard workflow: implement → validate → git add → git commit → deploy to gh-pages

## Working Style

- Minimize planning phases — move to implementation quickly
- Do not spend entire sessions in planning/exploration mode without producing code
- When working with large files or PDFs, be aware of token limits and chunk output proactively
