# Test Expectations Contract: Regression Testing System

**Date**: 2026-03-06

---

## Visual Regression Expectations

### Screenshot Matrix (9 total)

| Page | Viewport | Expected State |
|------|----------|---------------|
| index | 1440x900 | Hero section visible, navigation bar rendered, cards layout |
| index | 768x1024 | Responsive layout, stacked cards |
| index | 390x844 | Mobile menu, single column |
| concept-map | 1440x900 | Two-column layout, nav + detail panel, no tab bar |
| concept-map | 768x1024 | Responsive layout, possible side-by-side |
| concept-map | 390x844 | Tab bar visible, single column, mobile tabs |
| learning-resources | 1440x900 | Resource grid/list layout |
| learning-resources | 768x1024 | Responsive grid |
| learning-resources | 390x844 | Single column stack |

### Comparison Settings

```typescript
{
  maxDiffPixelRatio: 0.01,   // Default: 1% tolerance
  animations: 'disabled',     // Freeze all CSS animations
  fullPage: true,             // Capture full scrollable page
}
// concept-map exception: 0.02 threshold (dynamic content)
```

---

## Navigation Expectations

| # | From | Action | Expected URL | Expected Element |
|---|------|--------|-------------|-----------------|
| 1 | `/aws_sap_studying/` | Click concept-map link | `/concept-map.html` | Page heading visible |
| 2 | `/aws_sap_studying/` | Click learning-resources link | `/learning-resources.html` | Page heading visible |
| 3 | `/aws_sap_studying/` | Verify GitHub link | `href` contains `github.com` | Link present in DOM |
| 4 | `/aws_sap_studying/concept-map.html` | Click home/breadcrumb | `/aws_sap_studying/` | Home page content visible |

---

## Link Validation Expectations

### Internal Links

- All `<a>` tags with `href` starting with `/aws_sap_studying/` MUST resolve with HTTP status < 400
- Anchor links (`href="#..."`) MUST have matching `id` in the same document
- Empty `href=""` or `href="#"` are allowed (skip validation)

### External Links

- All `<a>` tags with `href` starting with `http` checked via HTTP HEAD
- Timeout: 10 seconds
- Status >= 400: logged as warning, NOT a test failure
- Reason: External sites may rate-limit or block CI runners

### Exclusions

- `mailto:` links — skip
- `javascript:` links — skip
- `tel:` links — skip

---

## Interaction Expectations

### Concept Map

| # | Action | Selector | Expected Result |
|---|--------|----------|----------------|
| 1 | Click L1 domain node | `.mm-l1-item` first | Children container becomes visible |
| 2 | Click L2 service node | `.mm-l2-item` first | L3 concepts expand |
| 3 | Type in search box | `#mm-search-input` | Results filter (items count changes) |
| 4 | Click filter tag | `.mm-tag-btn` first | Tag gets `.mm-tag-active` class |
| 5 | Mobile tab switch | `[role="tab"]` (390px viewport) | Tab panel visibility toggles |

### Home Page

| # | Action | Selector | Expected Result |
|---|--------|----------|----------------|
| 6 | Dark mode toggle (if exists) | Dark mode toggle button | `data-theme` or class changes |
