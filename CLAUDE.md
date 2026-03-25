# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository built with Astro SSG.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Astro 5.x SSG (build: `npm run build` → `dist/`) |
| **Content** | 312+ resource pages (.astro), 8 display categories, 12 page directories |
| **Branches** | `master` (source), `gh-pages` (build output, CI-managed) |

## File Editing Rules

Always edit Astro source files under `src/`, NEVER edit root legacy HTML/JS files directly. The deployed site is built from `src/` — changes to root files will not be reflected in production.

## Deploy Workflow

After any code change, always commit AND deploy unless told otherwise. The standard flow is: fix → verify build → commit → deploy to gh-pages.

## CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**
> File-type-specific details are in `.claude/rules/` (loaded automatically when editing matching files).

1. **Always Use Skills for Resource Integration** — `/skill resource` (unified entry point) or `/ship` (full pipeline). Never manually copy HTML files into `src/pages/`.
2. **Registry-Driven Data** — When adding resources, update `src/data/resource-registry.json` + `src/data/update-history.json`, then run `node scripts/generate-data.mjs` to regenerate `public/data.js`, `public/index.js`, and `src/data/resources.ts`. Details: `.claude/rules/data-navigation.md`
3. **GitHub Pages Path Prefix** — All paths MUST include `/aws_sap_studying/`. Details: `.claude/rules/html-standards.md`
4. **W3C Validation Required** — All HTML must pass validation before commit. `python3 scripts/ci/validate_html_w3c.py --pr-mode`. CSS: `npm run qa:css-validate:pr`.
5. **Deploy via `/deploy` Skill** — Commits, merges to master, pushes. GitHub Actions builds and deploys to gh-pages automatically.
6. **Use `<h2>` for Section Headings** — `ResourceLayout.astro` TOC only recognizes `<h2>`/`<h3>`. Details: `.claude/rules/html-standards.md`

## Resource Categorization

Networking-related AWS resources (VPC, Route 53, IPv6, Flow Logs, Transit Gateway) must be categorized under `networking`, NOT `compute-applications`. Always verify category before committing.

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

## Working Style

- Minimize planning phases — move to implementation quickly
- Do not spend entire sessions in planning/exploration mode without producing code
- When working with large files or PDFs, be aware of token limits and chunk output proactively

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
| Build pipeline, Astro config, categories, layouts, authoring pattern | `.claude/docs/build-pipeline.md` |
| Testing & QA (Playwright, validation, POM/COM) | `.claude/docs/testing.md` |
| CI/CD workflows, pre-commit hooks, deployment | `.claude/docs/ci-cd.md` |
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
