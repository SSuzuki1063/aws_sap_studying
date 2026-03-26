# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository built with Astro SSG.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Astro 5.x SSG (`npm run build` → `dist/`) |
| **Content** | 312+ resource pages (.astro), 8 display categories, 12 page directories |
| **Branches** | `master` (source), `gh-pages` (build output, CI-managed) |

## Quick Start

```bash
# Python (validation scripts)
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# Node.js (Astro build + Playwright E2E tests + QA system)
npm ci
npm run dev       # → http://localhost:4321/aws_sap_studying/
npm run preview   # production preview (requires prior build)
```

## Commands

### Build & Dev

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (syncs assets → astro dev) |
| `npm run build` | Full production build (sync → generate-data → astro build → `dist/`) |
| `npm run preview` | Preview production build locally |
| `node scripts/generate-data.mjs` | Regenerate `public/data.js`, `public/index.js`, `src/data/resources.ts` from registry |

### Testing

| Command | Purpose |
|---------|---------|
| `npm run test:e2e:chromium` | Run all E2E tests (chromium) |
| `npx playwright test --project=chromium tests/e2e/navigation/navbar.spec.ts` | Run a single test file |
| `npx playwright test --project=chromium -g "test name"` | Run a single test by name |
| `npx playwright test --project=qa` | QA-only tests (CSS validation, runtime checks) |
| `npx astro check` | Astro/TypeScript diagnostics (runs as PostToolUse hook on .astro edits) |

### Validation & QA

| Command | Purpose |
|---------|---------|
| `python3 scripts/ci/validate_html_w3c.py --pr-mode` | W3C HTML validation (changed files only) |
| `npm run qa:css-validate:pr` | CSS W3C validation (changed files only) |
| `npm run qa:all` | Full QA pipeline (CSS validate + runtime + report) |

## CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**

1. **Always Use Skills for Resource Integration** — `/skill resource` (unified entry point) or `/ship` (full pipeline). Never manually copy HTML files into `src/pages/`.
2. **Registry-Driven Data** — When adding resources, update `src/data/resource-registry.json` + `src/data/update-history.json`, then run `node scripts/generate-data.mjs`. Details: `.claude/rules/data-navigation.md`
3. **GitHub Pages Path Prefix** — All paths MUST include `/aws_sap_studying/`. Configured in `astro.config.mjs` as `base`.
4. **W3C Validation Required** — All HTML must pass validation before commit.
5. **Deploy via `/deploy` Skill** — Commits, merges to master, pushes. GitHub Actions builds and deploys to gh-pages automatically.
6. **Use `<h2>` for Section Headings** — `ResourceLayout.astro` TOC only recognizes `<h2>`/`<h3>`. Details: `.claude/rules/html-standards.md`
7. **Edit `src/`, NEVER root files** — The deployed site is built from `src/`. Changes to root HTML/JS files have no effect.
8. **Networking categorization** — VPC, Route 53, IPv6, Flow Logs, Transit Gateway → `networking`, NOT `compute-applications`.

## Architecture

### Dual Rendering Model

The site uses **two rendering approaches** that coexist:

**Build-time (Astro)** — Learning resource hub pages (`src/pages/learning-resources/[category].astro`) import data from `src/data/resources.ts` at build time. Components in `src/components/` render HTML statically.

**Runtime (client-side JS)** — These pages still load `public/data.js` + `public/render.js` at runtime:
- `index.astro` — categories, update history, quick nav
- `bookmark.astro` — bookmark management
- `knowledge-base.astro` — search + categorized display

### Data Pipeline

```
src/data/resource-registry.json  ─┐
src/data/update-history.json     ─┤
src/data/category-meta.json      ─┤   node scripts/generate-data.mjs
src/data/section-icons.json      ─┤   ──────────────────────────────→
src/data/exam-domains.json       ─┤
src/data/resource-summaries.json ─┘
                                      ├─ public/data.js    (runtime: categories, stats, history)
                                      ├─ public/index.js   (runtime: search index)
                                      └─ src/data/resources.ts (build-time: typed TS module)
```

`generate-data.mjs` auto-assigns new resources to categories/sections via keyword matching from `category-meta.json`. The 8 display categories render in this order: `networking`, `security-governance`, `compute-applications`, `content-delivery-dns`, `development-deployment`, `storage-database`, `migration`, `analytics-operations`.

### Layout System

| Layout | Used By | Features |
|--------|---------|----------|
| `BaseLayout.astro` | Special pages (index, quiz, roadmap, profile, glossary) | Minimal HTML shell; page injects CSS/JS via `<Fragment slot="head">` |
| `ResourceLayout.astro` | 258+ content pages | SidebarTOC, Breadcrumb, FixedNavHeader, PageBottomNav, reading progress bar |
| `LearningResourcesLayout.astro` | Hub page (`learning-resources/[category].astro`) | Build-time TOC, search/bookmark scripts |

### Asset Sync

Static assets live at repository root (`css/`, `js/`, `concepts/`, `BlackBelt/`) and are rsynced to `public/` at build time. Astro then copies `public/` into `dist/`. This means:
- Edit CSS/JS in root directories (`css/`, `js/`), not in `public/`
- `concepts/` JSON files are the source of truth; `public/concepts/` is generated
- Pre-commit hook blocks staging `public/concepts/`

### Concept Map System

`concepts/services/*.json` define AWS service concept hierarchies (L2 services → L3 concepts → L4 keywords + crosslinks). `concepts/concept-index.json` and `concepts/search-index.json` are derived indexes. Visualized by `js/concept-engine/MindmapController.js` on `concept-map.html`. Managed via `/skill concept-map-manager`.

### Build Configuration

`astro.config.mjs`: `format: 'file'` generates `networking/foo.html` (not `networking/foo/index.html`). Vite rollup preserves original asset filenames (no hashing) so CSS/JS paths remain stable.

## Pre-Commit Hooks

Three auto-checks run on every `git commit`:
1. **Guard**: blocks staging `public/concepts/` (build-time generated)
2. **Last modified date**: `update_last_modified.py` updates `data.js` via `// GIT_LAST_COMMIT_DATE` marker
3. **WCAG contrast**: `check_contrast_ratio.py` — exit 1 if violations

## CI/CD

- **deploy.yml** — push to master → `npm run build` → verify critical assets exist in `dist/` → deploy to gh-pages
- **qa-unified.yml** — PR validation: W3C HTML + CSS validation (static), then Playwright + CSS runtime (runtime)
- **playwright-e2e.yml** — full E2E across chromium/firefox/webkit/mobile-chrome

## Testing Architecture

Tests in `tests/e2e/` organized by concern: `interaction/`, `navigation/`, `links/`, `concept-map/`, `qa/`, `visual/`. Playwright projects: chromium, firefox, webkit, mobile-chrome, plus a dedicated `qa` project (CSS/runtime only, no retries). `tests/modules/` provides shared utilities for accessibility (axe), DOM semantic checks, CSS validation, and unified QA reporting.

## Environment

- Use `uv` instead of `pip` for Python package management
- Always create/activate a virtual environment before installing packages

## Working Style

- Minimize planning phases — move to implementation quickly
- Do not spend entire sessions in planning/exploration mode without producing code
- When working with large files or PDFs, be aware of token limits and chunk output proactively

## Documentation Reference

**Auto-loaded rules** (triggered when editing matching files):

| Rule | File |
|------|------|
| HTML/Astro (paths, W3C, WCAG, headings) | `.claude/rules/html-standards.md` |
| Data/navigation (data.js, render.js, registry) | `.claude/rules/data-navigation.md` |
| CSS (colors, z-index, responsive) | `.claude/rules/css-standards.md` |
| JS (vanilla JS, conventions) | `.claude/rules/javascript-standards.md` |
| Integration workflow (new_html/, replace_html/) | `.claude/rules/integration-workflow.md` |

**Extended docs** (read on demand):

| Topic | File |
|-------|------|
| Build pipeline, Astro config, layouts, authoring | `.claude/docs/build-pipeline.md` |
| Testing & QA (Playwright, POM/COM) | `.claude/docs/testing.md` |
| CI/CD workflows, pre-commit hooks, deployment | `.claude/docs/ci-cd.md` |
| Architecture, Key Files, render.js | `.claude/docs/architecture.md` |
| Workflows, File Placement, Key Scripts | `.claude/docs/workflows.md` |
| WCAG Colors, CI/CD Pipeline | `.claude/docs/accessibility.md` |
| Pre-Commit Checklist | `.claude/docs/pre-commit.md` |
| Available Skills | `.claude/docs/skills.md` |
| Concept Map System | `.claude/docs/concept-map.md` |
