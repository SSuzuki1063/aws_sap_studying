---
paths:
  - "js/**/*.js"
  - "public/**/*.js"
---

# JavaScript Standards

## Vanilla JS Only — No Frameworks or Build Tools

- NO React, Vue, Angular
- NO webpack, vite, parcel (except Astro/Vite for SSG build pipeline)
- Use pure ES6+ JavaScript features for client-side code
- No external dependencies in client-side code

> **Exception**: Astro SSG is used as the build tool (`astro.config.mjs`, `src/integrations/`).
> Node.js scripts (`scripts/`), config files, and `.mjs` files may use Node.js APIs and imports.
> This rule applies to **client-side JS** in `js/` and `public/` only.

## Client-Side JS Structure

| Path | Purpose |
|------|---------|
| `js/sidebar-toc.js` | Sidebar TOC interactions (scroll spy, toggle) |
| `js/scroll-progress.js` | Reading progress bar |
| `js/mobile-nav.js` | Mobile navigation handler |
| `js/theme-toggle.js` | Theme switching |
| `js/concept-engine/` | Concept map module (7 files, see below) |
| `public/render.js` | Runtime HTML rendering (template functions for index.astro) |
| `public/data.js` | Auto-generated runtime data (DO NOT edit manually) |
| `public/index.js` | Auto-generated search index (DO NOT edit manually) |

### Concept Engine Module (`js/concept-engine/`)

Modular architecture for the concept map visualization (`concept-map.astro`):

| File | Responsibility |
|------|---------------|
| `MindmapController.js` | Main controller, orchestrates rendering |
| `ConceptLoader.js` | Loads JSON concept data |
| `ConceptIndex.js` | Indexes concepts for lookup |
| `CrossLinkResolver.js` | Resolves cross-references between concepts |
| `DiagramRenderer.js` | SVG/canvas diagram rendering |
| `SearchEngine.js` | Client-side concept search |
| `TagSystem.js` | Tag-based filtering |

## Edit Locations

- Edit JS in root `js/` directory — rsync copies to `public/` at build time
- `public/render.js` is an exception: edit directly (not rsynced from root)
- `public/data.js` and `public/index.js` are generated — edit source files in `src/data/` and run `generate-data.mjs`

## Conventions

- Function naming: `camelCase` (e.g. `renderCategoryQuickNav`, `performSearch`)
- Variables: `const` for immutable, `let` only when reassignment needed
- Syntax check: `node -c <file.js>`
