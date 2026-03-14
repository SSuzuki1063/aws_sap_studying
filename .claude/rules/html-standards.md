---
paths:
  - "**/*.html"
  - "**/*.astro"
---

# HTML Standards

## GitHub Pages Path Requirement (Critical Rule 3)

All CSS/asset paths **MUST** include `/aws_sap_studying/` prefix:

```html
<!-- ✅ CORRECT -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>

<!-- ❌ WRONG - Will 404 on GitHub Pages -->
<link href="/css/variables.css" rel="stylesheet"/>
```

Astro dev server (`npm run dev`) handles the base path via `astro.config.mjs`.

## W3C Validation Required (Critical Rule 4)

All HTML **MUST** pass W3C validation before committing.

- **Manual check**: `python3 scripts/ci/validate_html_w3c.py --pr-mode`
- **Targeted check**: `python3 scripts/ci/validate_html_w3c.py --files networking/foo.html`
- **Integration**: `/skill resource` and `/ship` run validation automatically

## Semantic Heading Tags (Critical Rule 6)

`ResourceLayout.astro` **only recognizes `<h2>` and `<h3>` tags** for sidebar TOC generation. Files using `<div>` for section headings will silently skip TOC.

```html
<!-- ✅ CORRECT — sidebar TOC will be generated -->
<h2 class="section-title">セクション名</h2>

<!-- ❌ WRONG — TOC silently skipped -->
<div class="section-title">セクション名</div>
```

## WCAG 2.1 Level AA Compliance

- Color contrast: Text 4.5:1, UI components 3:1
- All images need `alt` attributes (decorative: `alt=""`)
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`
- Heading hierarchy: h1 → h2 → h3 (no skipping levels)
- Keyboard navigation: All functions accessible via keyboard
- Verify: `python3 scripts/accessibility/check_contrast_ratio.py`

## HTML Authoring Requirements

- SVG diagrams must be **inline** (not external files)
- Every SVG needs `role="img"` and `aria-label`
- Resource pages are `.astro` files using the rawContent + `set:html` pattern (see CLAUDE.md)

## Shared CSS Load Order

Handled by `ResourceLayout.astro` and `BaseLayout.astro` layouts. When writing raw HTML for staging (`new_html/`), load CSS in this order:

```html
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>
```

## File Naming Conventions

- Preferred: `aws-[service]-[topic].html` (e.g. `aws-lambda-metrics.html`)
- Alternative: `[service]_[topic]_infographic.html` (e.g. `ecs_infographic.html`)
- Use lowercase with hyphens
