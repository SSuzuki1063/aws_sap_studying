---
paths:
  - "**/*.html"
  - "**/*.astro"
  - "src/components/**"
  - "src/layouts/**"
---

# HTML / Astro Standards

## Astro Page Architecture

Resource pages are `.astro` files in `src/pages/<category>/`. Three layout types:

| Layout | Used By | Features |
|--------|---------|----------|
| `ResourceLayout.astro` | 300+ content pages | SidebarTOC (h2/h3 scan), Breadcrumb, FixedNavHeader, PageBottomNav, progress bar |
| `BaseLayout.astro` | Special pages (index, quiz, roadmap, profile, glossary) | Minimal HTML shell; page injects CSS/JS via `<Fragment slot="head">` |
| `LearningResourcesLayout.astro` | Hub page (`learning-resources/[category].astro`) | Build-time TOC, search/bookmark scripts |

### Component Library (`src/components/`)

| Component | Purpose |
|-----------|---------|
| `SidebarTOC.astro` | Sidebar TOC with M3 design, scroll spy |
| `FixedNavHeader.astro` | Fixed navigation header |
| `Breadcrumb.astro` | Breadcrumb navigation |
| `PageBottomNav.astro` | Previous/next page navigation |
| `ResourceList.astro` / `ResourceItem.astro` | Resource listing in hub pages |
| `MajorCategory.astro` / `CategorySection.astro` | Category hierarchy rendering |
| `CategoryCard.astro` / `CategoryOverview.astro` | Category cards and overviews |
| `CategoryQuickNav.astro` | Quick navigation for categories |
| `DomainNav.astro` / `LearningModeSelector.astro` | Exam domain navigation, learning modes |
| `RelatedCategories.astro` | Related category suggestions |
| `Footer.astro` / `HomeButton.astro` | Footer and home button |

## GitHub Pages Path Requirement (Critical Rule 3)

All CSS/asset paths **MUST** include `/aws_sap_studying/` prefix:

```html
<!-- CORRECT -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>

<!-- WRONG - Will 404 on GitHub Pages -->
<link href="/css/variables.css" rel="stylesheet"/>
```

Astro dev server (`npm run dev`) handles the base path via `astro.config.mjs`.

## W3C Validation Required (Critical Rule 4)

All HTML **MUST** pass W3C validation before committing.

- **Manual check**: `python3 scripts/ci/validate_html_w3c.py --pr-mode`
- **Targeted check**: `python3 scripts/ci/validate_html_w3c.py --files networking/foo.html`
- **Integration**: `/skill resource` and `/ship` run validation automatically

## Semantic Heading Tags (Critical Rule 6)

`SidebarTOC.astro` (used by `ResourceLayout.astro`) **only recognizes `<h2>` and `<h3>` tags** for sidebar TOC generation. Files using `<div>` for section headings will silently skip TOC.

```html
<!-- CORRECT — sidebar TOC will be generated -->
<h2 class="section-title">セクション名</h2>

<!-- WRONG — TOC silently skipped -->
<div class="section-title">セクション名</div>
```

## WCAG 2.1 Level AA Compliance

- Color contrast: Text 4.5:1, UI components 3:1
- All images need `alt` attributes (decorative: `alt=""`)
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`
- Heading hierarchy: h1 → h2 → h3 (no skipping levels)
- Keyboard navigation: All functions accessible via keyboard
- SVG: must be **inline**, with `role="img"` and `aria-label`
- Verify: `python3 scripts/accessibility/check_contrast_ratio.py`

## Shared CSS Load Order

Handled by layouts automatically. When writing raw HTML for staging (`new_html/`):

```html
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/design-system.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>
```

## File Naming Conventions

For `.astro` resource pages in `src/pages/<category>/`:
- Preferred: `aws-[service]-[topic].astro` (e.g. `aws-lambda-metrics.astro`)
- Alternative: `[service]_[topic]_infographic.astro` (e.g. `ecs_infographic.astro`)
- Use lowercase with hyphens
- Astro builds with `format: 'file'` → output is `category/filename.html` (not `category/filename/index.html`)
