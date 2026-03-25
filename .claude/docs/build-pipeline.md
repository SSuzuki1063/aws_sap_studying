# Build Pipeline & Astro Architecture

## Build Pipeline

The build (`npm run build`) runs these steps in order:
1. `sync:concepts` — copies `concepts/` → `public/concepts/` (concept map JSON data)
2. `sync:static` — copies `css/`, `js/`, `output_images/` → `public/` (source CSS/JS lives at repo root, NOT in `src/`)
3. `generate-data.mjs` — reads `src/data/resource-registry.json` and produces **three outputs**:
   - `public/data.js` — runtime data for index, knowledge-base, bookmark pages (loaded via `<script>`)
   - `public/index.js` — search data (searchData array) for client-side search
   - `src/data/resources.ts` — build-time TypeScript data imported by hub + category detail pages
4. `astro build` — SSG render to `dist/`

**`src/data/resources.ts` is auto-generated** — never edit it manually.

### When to Update What

| What you're doing | Files to update | Then run |
|---|---|---|
| Adding/removing a resource page | `src/data/resource-registry.json` + `src/data/update-history.json` | `node scripts/generate-data.mjs` |
| Changing resource metadata (title, category, tags) | `src/data/resource-registry.json` | `node scripts/generate-data.mjs` |
| Changing category descriptions/exam relevance/recommended reads | `src/data/category-descriptions.json` | `npm run build` (no script needed) |
| Adding/editing concept map data | `concepts/services/<service>.json` | `python3 scripts/concept_management/generate_concept_index.py` |

Use `/skill resource` or `/ship` for the full workflow — they handle these updates automatically.

### Astro Configuration

- `build.format: 'file'` — produces `networking/foo.html` (NOT `networking/foo/index.html`)
- Asset filenames are NOT hashed — `assetFileNames: '[name][extname]'` preserves original paths
- Base path: `/aws_sap_studying` (critical — already enforced by Critical Rule #3)

## Category Architecture

Resource pages live in `src/pages/<directory>/`. There are **12 page directories** but only **8 display categories** used in data.js navigation:

| Display Category (data.js) | Page Directory | Resources |
|---|---|---|
| `networking` | `networking/` | 87 |
| `security-governance` | `security-governance/` | 81 |
| `compute-applications` | `compute-applications/` | 57 |
| `content-delivery-dns` | `content-delivery-dns/` | 25 |
| `development-deployment` | `development-deployment/` | 22 |
| `storage-database` | `storage-database/` | 14 |
| `migration` | `migration/` | 11 |
| `analytics-operations` | `analytics-bigdata/` | 15 |

Additional directories (`continuous-improvement/`, `cost-control/`, `new-solutions/`, `organizational-complexity/`) contain pages whose `displayCategory` in `resource-registry.json` maps them into one of the 8 display categories above.

## Learning Resources: Hub + Category Detail Pages

The learning-resources section uses a **two-layer architecture**:

| Page | File | URL |
|------|------|-----|
| **Hub** (overview, category cards, search, recent updates) | `src/pages/learning-resources.astro` | `/learning-resources.html` |
| **Category detail** (overview, exam relevance, filters, resource list) | `src/pages/learning-resources/[category].astro` | `/learning-resources/<id>.html` |

`[category].astro` uses `getStaticPaths()` to generate all 8 category pages from `categoriesData`. Category descriptions/exam relevance come from `src/data/category-descriptions.json`.

**Key patterns:**
- Resource hrefs in `resources.ts` are relative (e.g., `networking/foo.html`). Category pages are under `learning-resources/`, so `[category].astro` prefixes hrefs with `../` to resolve correctly.
- Category pages use a hidden `<input id="categoryFilter" value={category.id}>` to scope `index.js` filters without JS changes.
- Search (`public/index.js`) uses absolute paths (`/aws_sap_studying/` + `item.file`) so links work from any page depth.

## Key Layouts

| Layout | Used by |
|--------|---------|
| `BaseLayout.astro` | Most pages (index, quiz, concept-map, etc.) |
| `ResourceLayout.astro` | Individual resource pages (`src/pages/<category>/*.astro`) |
| `LearningResourcesLayout.astro` | Hub page + category detail pages (accepts `extraCss` prop for page-specific CSS) |

## Astro Resource Authoring Pattern

Resource `.astro` files use the **rawContent + `set:html`** pattern to safely render HTML containing literal `{}` (SVG inline styles, CLI examples like `Tags=[{Key=Name}]`):

```astro
---
import ResourceLayout from '../../layouts/ResourceLayout.astro';
const frontmatter = {
  title: 'Page Title',
  category: '<directory-name>',
  tocItems: [{ id: 'section-id', text: 'Section Title', level: 2 }],
  pageCss: '/aws_sap_studying/css/pages/<filename>.css',
};
const rawContent = `
  <!-- body HTML here — backticks escaped as \\\`, $ as \\$ -->
`;
---
<ResourceLayout frontmatter={frontmatter}>
  <Fragment set:html={rawContent} />
</ResourceLayout>
```

**Do NOT** place body HTML directly in the Astro template — any `{}` will be parsed as JSX expressions and cause build errors.

### Sub-agent Code Quality

When using sub-agents to generate `.astro` files: (1) never escape backticks in template literals, (2) use string types for level props, (3) verify frontmatter prop spreading matches the layout's expected interface. Always run `astro build` after agent-generated files.

## CSS Specificity Pitfall: Inline h1/p Color

`css/common.css` sets `h1, h2, h3, h4, h5, h6 { color: var(--color-text-primary); }` (gray `#374151`). This **overrides** color inherited from parent elements like `.page-header { color: white; }` because direct rules beat inheritance. Pages with dark-background headers **must** set `color` explicitly on `.page-header h1` or `.header h1`:

```css
/* Explicit — works */
.page-header h1 { color: #fff; }

/* Inheritance only — h1 appears gray on dark background */
.page-header { color: #fff; }  /* h1 ignores this */
```

## Legacy Root HTML Files

Root-level `networking/*.html`, `compute-applications/*.html` etc. are **pre-Astro legacy files**. The source of truth is `src/pages/**/*.astro`. Legacy files are useful only as reference when an `.astro` file has `<!-- CONTENT EXTRACTION FAILED -->` (incomplete HTML→Astro conversion).
