---
paths:
  - "css/**/*.css"
  - "src/**/*.css"
---

# CSS Standards

## CSS Architecture — Two-Layer Token System

| File | Role | Load Order |
|------|------|------------|
| `css/variables.css` | Core design tokens (colors, spacing, z-index, layout, M3 surfaces) | 1st |
| `css/design-system.css` | Extended tokens (Inter font, 8px spacing, card tokens, nav tokens) | 2nd (after variables.css, before component CSS) |

Both define `:root` variables. `design-system.css` **extends** `variables.css` — does not override core tokens.

Edit CSS in root `css/` directory, NOT in `public/` — rsync copies to public at build time.

## WCAG 2.1 Accessible Color Palette

Use verified colors from `css/variables.css`:

**AWS Brand:**
- `--color-aws-dark` (#232F3E) — Headers, main text on light bg
- `--color-aws-orange` (#dc7600) — Accents, large text (4.5:1+)
- `--color-aws-orange-original` (#FF9900) — ONLY for large text (18pt+ or 14pt bold+)
- `--color-aws-orange-hover` (#EC7211) — Hover state

**Text:** `--color-text-primary` (#374151), `--color-text-secondary` (#6B7280), `--color-text-tertiary` (#6f7682)
**UI:** `--color-border` (#909296), `--color-border-light` (#E5E7EB), `--color-bg-light` (#F9FAFB)
**Status:** `--color-success` (#10B981), `--color-warning` (#F59E0B), `--color-error` (#EF4444), `--color-info` (#3B82F6)

**Category colors** (category-specific UI — defined in variables.css):
`--color-category-networking`, `--color-category-security`, `--color-category-compute`,
`--color-category-content`, `--color-category-development`, `--color-category-storage`,
`--color-category-migration`, `--color-category-analytics`

NEVER add new colors without running `scripts/accessibility/check_contrast_ratio.py`.

## Material 3 Surface Tokens (variables.css)

Used for card/container surfaces:

| Token | Value | Use |
|-------|-------|-----|
| `--m3-surface` | #FAFAF9 | Default surface |
| `--m3-surface-container` | #F5F4F2 | Card backgrounds |
| `--m3-surface-container-high` | #EFEEEC | Elevated containers |
| `--m3-on-surface` | #1C1B1F | Text on surface |
| `--m3-on-surface-variant` | #49454F | Secondary text on surface |
| `--m3-outline` | #CAC4D0 | Borders |

M3 radius: `--radius-card` (16px), `--radius-card-lg` (20px), `--radius-container` (24px), `--radius-input` (12px), `--radius-badge` (8px), `--radius-pill` (100px).

## Design System Tokens (design-system.css)

Extended tokens for modern documentation styling:
- **Surface**: `--ds-bg`, `--ds-bg-card`, `--ds-bg-elevated`, `--ds-bg-inset`, `--ds-bg-subtle`
- **Text**: `--ds-text`, `--ds-text-secondary`, `--ds-text-tertiary`, `--ds-text-muted`
- **Accent**: `--ds-accent` (#2563EB), `--ds-accent-hover`, `--ds-accent-light`
- **Border**: `--ds-border` (#E2E8F0), `--ds-border-strong`
- **Card**: `--card-radius`, `--card-shadow`, `--card-shadow-hover`, `--card-hover-lift`
- **8px spacing**: `--space-1` (4px) through `--space-20` (80px)
- **Navigation**: `--nav-bg`, `--nav-bg-solid`, `--nav-border`, `--nav-link-color`

## Responsive Breakpoints

CSS variables in `css/variables.css`:

| Name | Variable | Value |
|------|----------|-------|
| Mobile | `--breakpoint-mobile` | 480px |
| Tablet | `--breakpoint-tablet` | 768px |
| Desktop | `--breakpoint-desktop` | 1024px |
| Wide | `--breakpoint-wide` | 1280px |

Touch targets: 44px minimum (mobile).

## Z-Index Hierarchy

Full hierarchy from `css/variables.css`:

| Element | Z-Index | Variable |
|---------|---------|----------|
| Base | `1` | `--z-base` |
| Dropdown | `100` | `--z-dropdown` |
| Sticky | `500` | `--z-sticky` |
| Scroll-top / Sidebar TOC panel | `1000` | `--z-scroll-top` |
| Reading progress bar | `1001` | `--z-progress-bar` |
| Fixed header | `1002` | `--z-header` |
| Sidebar TOC toggle | `1003` | — |
| Modal | `2000` | `--z-modal` |
| Tooltip | `3000` | `--z-tooltip` |

Sidebar TOC: `top: var(--header-height)` and `height: calc(100vh - var(--header-height))`.

## Design Token Rule: No Hardcoded Values

**NEVER hardcode header-related pixel values.** Always use `var(--header-height)`:

```css
/* CORRECT */
body { padding-top: var(--header-height, 60px); }
height: calc(100vh - var(--header-height, 60px));

/* WRONG */
body { padding-top: 56px; }
height: calc(100vh - 80px);
```

Key layout dimensions (`css/variables.css`):
- `--header-height: 60px` / `--container-max-width: 1200px` / `--sidebar-width: 280px`

## General Rules

- Verify WCAG contrast compliance (minimum AA) when modifying colors
- Prefer grid layouts over complex margin-based positioning
- When removing inline styles, verify equivalent CSS link tags exist and check cascade order
- CI check: `python3 scripts/ci/check_css_quality.py --pr-mode`
