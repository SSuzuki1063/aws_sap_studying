---
paths:
  - "css/**/*.css"
  - "src/**/*.css"
---

# CSS Standards

## WCAG 2.1 Accessible Color Palette

ONLY use verified colors from `docs/CODING_STANDARDS.md`:

**AWS Brand:**
- `#232F3E` (AWS Dark) — Headers, main text on light bg
- `#dc7600` (AWS Orange Accessible) — Accents, large text
- `#FF9900` (AWS Orange Original) — ONLY for large text (18pt+ or 14pt bold+)

**Text:** `#374151` (Primary), `#6B7280` (Secondary)
**UI:** `#909296` (Border), `#F9FAFB` (Light BG)
**Quiz:** `#3378be` (Good), `#008662` (Excellent), `#c35237` (Poor), `#9e6c0f` (Fair)

Use CSS variables:
```css
:root {
  --color-aws-dark: #232F3E;
  --color-aws-orange: #dc7600;
  --color-text-primary: #374151;
  --color-bg-light: #F9FAFB;
  --color-border: #909296;
}
```

NEVER add new colors without running `scripts/accessibility/check_contrast_ratio.py`.

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px
- Touch targets: 44px minimum (mobile)

## Z-Index Hierarchy

| Element | Z-Index | Variable |
|---------|---------|----------|
| Fixed header | `1002` | `--z-header` |
| Sidebar TOC toggle | `1003` | — |
| Sidebar TOC panel | `1000` | — |

Sidebar TOC: `top: var(--header-height)` and `height: calc(100vh - var(--header-height))`.

## Design Token Rule: No Hardcoded Header Heights

**NEVER hardcode header-related pixel values.** Always use `var(--header-height)`:

```css
/* ✅ CORRECT */
body { padding-top: var(--header-height, 60px); }
top: var(--header-height);
height: calc(100vh - var(--header-height, 60px));

/* ❌ WRONG — will break if --header-height changes */
body { padding-top: 56px; }
top: 60px;  /* ヘッダー高さ */
height: calc(100vh - 80px);
```

Key CSS variables defined in `css/variables.css`:
- `--header-height: 60px` — 固定ヘッダーの高さ
- `--z-header: 1002` — ヘッダーのz-index

## General Rules

- Verify WCAG contrast compliance (minimum AA) when modifying colors on dark backgrounds
- Prefer grid layouts over complex margin-based positioning
- When removing inline styles, verify equivalent CSS link tags exist and check cascade order
- CI check: `python3 scripts/ci/check_css_quality.py --pr-mode`
