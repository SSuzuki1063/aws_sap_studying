# CLAUDE.md

AWS SAP study site — Astro 5.x SSG, 320+ pages, 8 categories.
Live: https://ssuzuki1063.github.io/aws_sap_studying/ | Branches: `master` (source), `gh-pages` (CI build output)

## CRITICAL RULES

1. **Use Skills for resources** — `/skill resource` or `/ship`. Never manually copy HTML into `src/pages/`.
2. **Registry-driven data** — Update `src/data/resource-registry.json` + `update-history.json`, run `node scripts/generate-data.mjs`.
3. **Path prefix** — All paths MUST include `/aws_sap_studying/` (configured in `astro.config.mjs` as `base`).
4. **W3C validation** — All HTML must pass before commit.
5. **Deploy** — Use `/deploy` skill. CI builds and deploys to gh-pages.
6. **Headings** — Use `<h2>`/`<h3>` for sections (`ResourceLayout.astro` TOC depends on this).
7. **Edit `src/` only** — Root HTML/JS files have no effect on the deployed site.
8. **Networking category** — VPC, Route 53, IPv6, Flow Logs, Transit Gateway → `networking`.

## Architecture

Dual rendering: build-time Astro (`src/data/resources.ts`) + runtime JS (`data.js`/`render.js` for index, bookmark, knowledge-base). Static assets (`css/`, `js/`, `concepts/`) rsynced to `public/` at build. See `.claude/docs/architecture.md`.

## Environment & Style

- Use `uv` (not `pip`) for Python; always activate venv first
- Minimize planning — move to implementation quickly
- Chunk output proactively for large files/PDFs

## Reference

Commands, quick start, rules index: `.claude/docs/commands.md`
