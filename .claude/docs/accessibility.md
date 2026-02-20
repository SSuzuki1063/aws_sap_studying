# Accessibility & CI/CD Reference

## WCAG 2.1 AA Color Palette

| Color | Code | Usage | Contrast |
|-------|------|-------|----------|
| AWS Dark | `#232F3E` | Headers, headings | 12.98:1 ✅ |
| AWS Orange (Accessible) | `#dc7600` | Accents, large text | 3.17:1 ✅ |
| Primary Text | `#374151` | Body text | 9.86:1 ✅ |
| Secondary Text | `#6B7280` | Labels, helpers | 4.83:1 ✅ |
| Tertiary Text | `#6f7682` | Breadcrumb separators | 4.58:1 ✅ |
| Border | `#909296` | Borders, UI components | 3.12:1 ✅ |
| Quiz Good | `#3378be` | Quiz UI only | 4.59:1 ✅ |
| Quiz Excellent | `#008662` | Quiz UI only | 4.58:1 ✅ |
| Quiz Poor | `#c35237` | Quiz UI only | 4.58:1 ✅ |
| Quiz Fair | `#9e6c0f` | Quiz UI only | 4.56:1 ✅ |

## Deprecated Colors (do not use)

| Color | Code | Replacement |
|-------|------|-------------|
| Border (original) | `#E5E7EB` | `#909296` |
| Quiz Good (original) | `#74b9ff` | `#3378be` |
| Quiz Excellent (original) | `#00b894` | `#008662` |
| Quiz Poor (original) | `#e17055` | `#c35237` |
| Quiz Fair (original) | `#fdcb6e` | `#9e6c0f` |

## Color Usage Rules

- **`#FF9900` (original AWS Orange)** — allowed **only for large text** (18pt+ or 14pt bold+); use `#dc7600` for all other text
- **NG-007** (同系色背景×同系色文字は禁止): body text must use neutral colors (`#374151`, `#1f2937`); theme colors for backgrounds/borders/icons only
- **NG-008** (同列情報の非対称レイアウトは禁止): use even grids (2×2, 3×2); if asymmetric, add headings/labels
- **CSSカスケード保全ルール**: when removing inline styles, verify CSS cascade order and `<link>` tags; add fallback backgrounds behind white text

Full details: `.claude/skills/wcag-accessibility/SKILL.md`

## CI/CD Pipeline

GitHub Actions runs on PRs to `gh-pages` and `master` (`.github/workflows/pr-quality-check.yml`).
Triggered by changes to `*.html`, `data.js`, `index.js`, `quiz-data-extended.js`, `*.css`, `*.py`.

| Check | Blocking | Command |
|-------|----------|---------|
| Data Integrity | ✅ Yes | `python3 scripts/ci/check_data_integrity.py` |
| W3C HTML Validation | ✅ Yes | `python3 scripts/ci/validate_html_w3c.py --pr-mode` |
| Color Contrast | ✅ Yes | `python3 scripts/accessibility/check_contrast_ratio.py` |
| JavaScript Syntax | ✅ Yes | `node -c quiz-data-extended.js data.js render.js index.js quiz-app.js` |
| Heading Hierarchy | ⚠️ Warning | `python3 scripts/accessibility/check_heading_hierarchy.py` |
| Internal Links | ⚠️ Warning | `python3 scripts/ci/check_internal_links.py` |
| File Naming | ⚠️ Warning | `python3 scripts/ci/check_file_naming.py` |
