# Commands & Quick Start

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
