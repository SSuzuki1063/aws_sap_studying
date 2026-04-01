---
paths:
  - "astro.config.mjs"
  - "package.json"
  - "src/layouts/**"
  - "src/integrations/**"
  - "concepts/**/*.json"
---

# Build Pipeline & Assets

## Build Configuration

`astro.config.mjs`: `format: 'file'` generates `networking/foo.html` (not `networking/foo/index.html`). Vite rollup preserves original asset filenames (no hashing) so CSS/JS paths remain stable. `base: '/aws_sap_studying'` sets the GitHub Pages path prefix.

## Asset Sync

Static assets live at repository root (`css/`, `js/`, `concepts/`, `BlackBelt/`) and are rsynced to `public/` at build time (`npm run build`). Astro then copies `public/` into `dist/`.

- Edit CSS/JS in root directories (`css/`, `js/`), not in `public/`
- `concepts/` JSON files are the source of truth; `public/concepts/` is generated
- Pre-commit hook blocks staging `public/concepts/`
- **Exception**: `public/render.js` is edited directly (not rsynced from root)

## Dual Rendering Model

**Build-time (Astro)** — Learning resource hub pages (`src/pages/learning-resources/[category].astro`) import data from `src/data/resources.ts` at build time. Components in `src/components/` render HTML statically.

**Runtime (client-side JS)** — These pages still load `public/data.js` + `public/render.js` at runtime:
- `index.astro` — categories, update history, quick nav
- `bookmark.astro` — bookmark management
- `knowledge-base.astro` — search + categorized display

## Layout System

| Layout | Used By | Features |
|--------|---------|----------|
| `BaseLayout.astro` | Special pages (index, quiz, roadmap, profile, glossary) | Minimal HTML shell; page injects CSS/JS via `<Fragment slot="head">` |
| `ResourceLayout.astro` | 320+ content pages | SidebarTOC (M3 design, scroll spy), Breadcrumb, FixedNavHeader, PageBottomNav, reading progress bar |
| `LearningResourcesLayout.astro` | Hub page (`learning-resources/[category].astro`) | Build-time TOC, search/bookmark scripts |

## Concept Map System

`concepts/services/*.json` define AWS service concept hierarchies (L2 services → L3 concepts → L4 keywords + crosslinks). `concepts/concept-index.json` and `concepts/search-index.json` are derived indexes. Managed via `/skill concept-map-manager`.

The `js/concept-engine/` module (7 files) provides modular visualization: `MindmapController.js` (orchestrator), `ConceptLoader.js`, `ConceptIndex.js`, `CrossLinkResolver.js`, `DiagramRenderer.js`, `SearchEngine.js`, `TagSystem.js`. Used by `concept-map.astro`.
