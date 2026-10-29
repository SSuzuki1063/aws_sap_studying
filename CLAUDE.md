# CLAUDE.md

AWS SAP study site — Astro 5.x SSG, 320+ pages, 8 display categories.
Live: https://ssuzuki1063.github.io/aws_sap_studying/ | Branches: `master` (source), `gh-pages` (CI build output)

## Core rules

1. **Add, replace or delete resources with skills** — use `/skill resource` (routes to integrate / replace / delete) or `/ship` (integrate → Build / W3C / E2E gates → commit → deploy). Put incoming HTML in `new_html/` (new) or `replace_html/` (replacement) and let the skill convert it into `src/pages/`. The skills also update the registry, category assignment and history, which a hand-copied file would miss.
2. **Registry-driven data** — resource metadata lives in `src/data/resource-registry.json` and `src/data/update-history.json`. After changing either, run `node scripts/generate-data.mjs` to regenerate `public/data.js`, `public/index.js` and `src/data/resources.ts`. Edit the registry rather than the generated files, because the next build overwrites them.
3. **Path prefix** — write every internal path with the `/aws_sap_studying/` prefix (the `base` in `astro.config.mjs`). GitHub Pages serves the site under that subpath, so a path without it 404s in production even if it works in some local setups.
4. **W3C validation** — before committing page changes, run `npm run build` and then `python3 scripts/ci/validate_html_w3c.py --pr-mode --base-dir dist`, and fix every error. This is the same check CI runs on the build output, and it fails the PR on any error. Without `--base-dir dist` the script checks the repo root instead of the built pages.
5. **Deploy** — use the `/deploy` command. It merges to `master`, and CI builds and pushes to `gh-pages`. Merging to `master` publishes the site, so deploy only when the user asks.
6. **Headings** — structure page sections with `<h2>` / `<h3>`. The table of contents in `ResourceLayout.astro` is built from them.
7. **Where to edit** — pages: `src/pages/`. Shared CSS / JS / concept data: the root `css/`, `js/`, `concepts/` (rsynced to `public/` at build). `public/render.js` is the one file edited in `public/` directly. The root category folders (`networking/`, `security-governance/` and so on) hold legacy source HTML that is not part of the build, so edits there don't reach the site.
8. **Networking category** — classify VPC, Route 53, IPv6, Flow Logs and Transit Gateway resources as `networking`.

Detailed rules load automatically when editing matching files (`.claude/rules/*.md`); the index is in `.claude/docs/commands.md`.

## Architecture

Dual rendering: build-time Astro (`src/data/resources.ts`) + runtime JS (`data.js` / `render.js` for index, bookmark, knowledge-base). Details: `.claude/docs/architecture.md`.

## Environment & style

- **Python** (validation scripts only; there is no `pyproject.toml`) — set up with `uv venv && source .venv/bin/activate && uv pip install beautifulsoup4 lxml html5lib requests`, and activate the venv before running `python3 scripts/...`, since the scripts rely on those packages.
- **Node** — `npm ci`, then `npm run dev` (http://localhost:4321/aws_sap_studying/) or `npm run build`.
- **Pace** — keep planning short and move to implementation quickly; the user prefers seeing working changes over long plans.
- **Large files / PDFs** — read and write them in chunks, so a single huge read or output doesn't get truncated.

## Reference

Commands, quick start and the rules index: `.claude/docs/commands.md`.
