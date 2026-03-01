# Architecture Reference

## Data-Driven Navigation System

```
index.html          ← Shell page (HTML structure only)
├── data.js         ← Pure data definitions (NO HTML tags)
├── render.js       ← Template functions (data → HTML)
└── index.js        ← UI handlers + searchData array
```

**Key Principle**: `data.js` contains NO HTML. All HTML generation happens in `render.js`.

`table-of-contents.html` is a **legacy secondary** static page — it is NOT the primary navigation. `index.html` is the primary entry point.

### Resource Data Shape (`data.js`)

```javascript
// categoriesData[].sections[].resources[]
{ title: 'Resource Name', href: 'category/filename.html', priority: 'high' }
```

`priority` is optional: `'high'` | `'medium'` | `'low'` | omitted (defaults to `'medium'`).
Used by render.js for visual indicators (🔴 high / 🟡 medium / 🔵 low).

### Search Data Shape (`index.js`)

```javascript
// searchData[]
{ title: 'Resource Name', category: 'カテゴリ名', file: 'category/filename.html' }
```

### Local Dev Server (`server.py`)

Strips `/aws_sap_studying/` from URLs so GitHub Pages-style absolute paths resolve correctly on localhost. This is why HTML files use `/aws_sap_studying/css/...` — they work on both environments.

## Static Site Constraints

- ❌ NO npm, webpack, vite, or build tools
- ❌ NO React, Vue, Angular, or frameworks
- ❌ NO external CDNs or libraries
- ✅ Pure HTML/CSS/JavaScript only
- ✅ Must work completely offline

## Shared CSS Files

`css/` directory (loaded via `<link>` in every HTML page):
- `variables.css` — CSS custom properties (z-index layers, colors, spacing)
- `common.css` — Shared UI components (header, breadcrumbs, scroll-to-top)
- `layout.css` — Layout utilities and grid
- `responsive.css` — Media queries and mobile styles

`css/components/` (added automatically by integration scripts — **do not add manually**):
- `sidebar-toc.css`, `page-bottom-nav.css`, `priority-group.css`, `roadmap.css`, `bookmark.css`, etc.

## Sidebar TOC Generation

`add_sidebar_toc.py` skips a file when:

- File is in `new_html/`, `.git/`, `__pycache__/`, or `.claude/`
- Filename is `index.html`, `table-of-contents.html`, `quiz.html`, `home.html`, or `knowledge-base.html`
- File has **fewer than 2 `<h2>`/`<h3>` tags** → prints `⏭️ スキップ`

When skipped in the integrate workflow, step 4 output shows `⚠️【要対応】`.

### Z-Index Hierarchy

| Element | Z-Index | Notes |
|---------|---------|-------|
| Header | `1002` (`--z-header`) | Fixed top navigation |
| Sidebar TOC Toggle | `1003` | Must be above header |
| Sidebar TOC | `1000` | Uses `top: 60px` |

Sidebar TOC must use `top: 60px` and `height: calc(100vh - 60px)`.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main navigation shell (**primary** entry point — data-driven) |
| `table-of-contents.html` | Legacy secondary navigation — static, manually maintained |
| `knowledge-base.html` | Alternative table-based resource browser |
| `data.js` | **CRITICAL**: Category/resource data (pure data, no HTML) |
| `render.js` | Template functions (data → HTML generation) |
| `index.js` | UI handlers + searchData array |
| `quiz-data-extended.js` | Quiz questions (219 questions, organized by category key) |
| `quiz-app.js` | Quiz UI logic; `QuizProgress` class (localStorage score tracking, not exposed in UI) |
| `server.py` | Local dev server (port 8080, rewrites GitHub Pages paths) |

## `render.js` Template Functions

| Function | Purpose |
|----------|---------|
| `renderCategoryQuickNav(navData)` | Quick navigation cards at top of page |
| `renderResourceList(resources)` | Resource `<li>` items within a section |
| `renderSection(section)` | Subcategory block with its resource list |
| `renderMajorCategory(category)` | Full category accordion panel |
| `renderAllCategories(categoriesData)` | Renders all 8 categories |
| `renderQuickNavToDOM(containerId, data)` | Mounts quick nav into DOM |
| `renderCategoriesToDOM(containerId, data)` | Mounts categories into DOM |

Sidebar accordion state and desktop sidebar collapse are persisted via `localStorage`.
