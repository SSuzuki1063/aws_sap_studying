# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository built with Astro SSG.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Astro 5.x SSG (`npm run build` → `dist/`) |
| **Content** | 320+ resource pages (.astro), 8 display categories, 13 page directories |
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

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (syncs assets → astro dev) |
| `npm run build` | Full production build (sync → generate-data → astro build → `dist/`) |
| `npm run preview` | Preview production build locally |
| `node scripts/generate-data.mjs` | Regenerate `public/data.js`, `public/index.js`, `src/data/resources.ts` |
| `npm run test:e2e:chromium` | Run all E2E tests (chromium) |
| `npx playwright test --project=chromium tests/e2e/navigation/navbar.spec.ts` | Run a single test file |
| `npx playwright test --project=chromium -g "test name"` | Run a single test by name |
| `npx astro check` | Astro/TypeScript diagnostics |
| `python3 scripts/ci/validate_html_w3c.py --pr-mode` | W3C HTML validation (changed files) |
| `npm run qa:all` | Full QA pipeline |

## CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**

1. **Always Use Skills for Resource Integration** — `/skill resource` (unified entry point) or `/ship` (autonomous pipeline with self-correcting Build/W3C/E2E gates, max 5 retries each). Never manually copy HTML files into `src/pages/`.
2. **Registry-Driven Data** — When adding resources, update `src/data/resource-registry.json` + `src/data/update-history.json`, then run `node scripts/generate-data.mjs`. Details: `.claude/rules/data-navigation.md`
3. **GitHub Pages Path Prefix** — All paths MUST include `/aws_sap_studying/`. Configured in `astro.config.mjs` as `base`.
4. **W3C Validation Required** — All HTML must pass validation before commit.
5. **Deploy via `/deploy` Skill** — Commits, merges to master, pushes. GitHub Actions builds and deploys to gh-pages automatically.
6. **Use `<h2>` for Section Headings** — `ResourceLayout.astro` TOC only recognizes `<h2>`/`<h3>`.
7. **Edit `src/`, NEVER root files** — The deployed site is built from `src/`. Changes to root HTML/JS files have no effect.
8. **Networking categorization** — VPC, Route 53, IPv6, Flow Logs, Transit Gateway → `networking`, NOT `compute-applications`.

## Architecture (Summary)

The site uses **dual rendering**: build-time Astro (hub pages via `src/data/resources.ts`) + runtime JS (`data.js`/`render.js` for index, bookmark, knowledge-base). Static assets in root (`css/`, `js/`, `concepts/`) are rsynced to `public/` at build time. Details in rules below.

## Environment

- Use `uv` instead of `pip` for Python package management
- Always create/activate a virtual environment before installing packages

## Working Style

- Minimize planning phases — move to implementation quickly
- Do not spend entire sessions in planning/exploration mode without producing code
- When working with large files or PDFs, be aware of token limits and chunk output proactively

## Rules Reference

**Auto-loaded rules** (triggered when editing matching files):

| Rule | File |
|------|------|
| HTML/Astro (paths, W3C, WCAG, headings, components, layouts) | `.claude/rules/html-standards.md` |
| Data/navigation (pipeline, registry, render.js, resources.ts) | `.claude/rules/data-navigation.md` |
| CSS (two-layer tokens, M3 surfaces, z-index, responsive) | `.claude/rules/css-standards.md` |
| JS (vanilla JS, concept-engine, conventions) | `.claude/rules/javascript-standards.md` |
| Integration workflow (new_html/, replace_html/, skills) | `.claude/rules/integration-workflow.md` |
| Build pipeline (asset sync, layouts, concept map, Astro config) | `.claude/rules/build-and-assets.md` |
| Testing, CI/CD, pre-commit hooks | `.claude/rules/testing-ci.md` |

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
