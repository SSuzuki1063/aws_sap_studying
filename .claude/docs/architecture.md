# Architecture Reference

## Dual Rendering Model

The site uses two rendering approaches:

**Build-time (Astro SSG)** — Learning resource hub pages import `src/data/resources.ts` (auto-generated TypeScript module) and render static HTML via Astro components.

**Runtime (client-side JS)** — These pages load `public/data.js` + `public/render.js` at runtime:
- `index.astro` — categories, update history, quick nav
- `bookmark.astro` — bookmark management
- `knowledge-base.astro` — search + categorized display

## Data Pipeline

```
src/data/resource-registry.json  ─┐
src/data/update-history.json     ─┤  node scripts/generate-data.mjs
src/data/category-meta.json      ─┤  ──────────────────────────────→
(+ 6 other JSON configs)         ─┘
                                      ├─ public/data.js    (runtime)
                                      ├─ public/index.js   (runtime search)
                                      └─ src/data/resources.ts (build-time)
```

## Resource Data Shapes

**`public/data.js`** — `categoriesData[].sections[].resources[]`:
```javascript
{ title: 'Resource Name', href: 'category/filename.html', priority: 'high' }
```

**`public/index.js`** — `searchData[]`:
```javascript
{ title: 'Resource Name', category: 'カテゴリ名', file: 'category/filename.html' }
```

## `public/render.js` Template Functions

| Function | Purpose |
|----------|---------|
| `renderCategoryQuickNav(navData)` | Quick navigation cards |
| `renderResourceList(resources)` | Resource `<li>` items within a section |
| `renderSection(section)` | Subcategory block with resource list |
| `renderMajorCategory(category)` | Full category accordion panel |
| `renderAllCategories(categoriesData)` | Renders all 8 categories |
| `renderQuickNavToDOM(containerId, data)` | Mounts quick nav into DOM |
| `renderCategoriesToDOM(containerId, data)` | Mounts categories into DOM |

Sidebar accordion state and desktop sidebar collapse are persisted via `localStorage`.

## Layout System

| Layout | Used By | Features |
|--------|---------|----------|
| `BaseLayout.astro` | Special pages (index, quiz, roadmap, profile, glossary) | Minimal HTML shell; `<Fragment slot="head">` for CSS/JS |
| `ResourceLayout.astro` | 300+ content pages | SidebarTOC (h2/h3 scan), Breadcrumb, FixedNavHeader, PageBottomNav, progress bar |
| `LearningResourcesLayout.astro` | Hub + category detail pages | Build-time TOC, search/bookmark scripts |

## Asset Sync

Static assets live at repository root (`css/`, `js/`, `concepts/`, `BlackBelt/`) and are rsynced to `public/` at build time. Astro copies `public/` into `dist/`.

- Edit CSS/JS in root directories, not in `public/`
- **Exception**: `public/render.js` is edited directly (not rsynced from root)
- `public/data.js` and `public/index.js` are auto-generated — never edit manually

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Main entry point (runtime data-driven via `public/data.js` + `public/render.js`) |
| `src/pages/learning-resources.astro` | Hub page (build-time via `src/data/resources.ts`) |
| `src/pages/learning-resources/[category].astro` | Category detail pages (build-time, `getStaticPaths()`) |
| `src/data/resource-registry.json` | Single source of truth for all resource metadata |
| `scripts/generate-data.mjs` | Generates `public/data.js`, `public/index.js`, `src/data/resources.ts` |
| `public/render.js` | Runtime HTML template functions |
| `public/data.js` | Auto-generated runtime data |
| `public/index.js` | Auto-generated search index |

## CSS Specificity Pitfall

`css/common.css` sets `h1-h6 { color: var(--color-text-primary); }` (gray). This overrides color inherited from parent elements. Pages with dark-background headers must set color explicitly:

```css
/* Works — direct rule */
.page-header h1 { color: #fff; }

/* Fails — h1 ignores inheritance from parent */
.page-header { color: #fff; }
```
