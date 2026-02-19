# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Data-driven static site (NO build process) |
| **Content** | 223+ HTML resources, 219 quiz questions, 8 categories |
| **Branches** | `gh-pages` (production), `master` (development/PRs) |

## ⚠️ CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**

### 1. Always Use Skills for Resource Integration

```bash
/skill integrate
```

When integrating new AWS learning resources, **ALWAYS** use the skill. It ensures proper workflow execution (categorization → breadcrumbs → TOC → data updates) and prevents integration errors.

### 2. Two-Place Update Rule

When adding HTML resources, you **MUST** update **TWO** files:

| File | What to Update | If Missing |
|------|----------------|------------|
| `data.js` | Add to `section.resources` array, update section `count` and category `count` | Resource won't appear in navigation |
| `index.js` | Add to `searchData` array | Resource won't appear in search |

Also update `siteStats.totalResources` in `data.js` when resource counts change.

**Verification:** `python3 scripts/ci/check_data_integrity.py`

### 3. GitHub Pages Path Requirement

All CSS/asset paths **MUST** include `/aws_sap_studying/` prefix:

```html
<!-- ✅ CORRECT -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>

<!-- ❌ WRONG - Will 404 on GitHub Pages -->
<link href="/css/variables.css" rel="stylesheet"/>
```

The local dev server (`server.py`) automatically strips this prefix so paths work both locally and on GitHub Pages.

### 4. W3C Validation Required

All HTML **MUST** pass W3C validation before committing.

- **Integration workflow**: W3C validation runs **automatically** inside `integrate_resource_complete.py` (step 7). If any file fails, the script aborts before git staging.
- **Manual check**: `python3 scripts/ci/validate_html_w3c.py --pr-mode`
- **Targeted check**: `python3 scripts/ci/validate_html_w3c.py --files networking/foo.html`
- **Offline/skip**: `python3 scripts/html_management/integrate_resource_complete.py --skip-validation`

### 5. Immediate Push After Commit

Always push immediately — commits without push don't deploy:

```bash
git add <files> && git commit -m "feat: description" && git push origin gh-pages
```

### 6. Use `<h2>` Semantic Tags for Section Headings

`add_sidebar_toc.py` **only recognizes `<h2>` and `<h3>` tags**. Files using `<div>` for section headings will silently skip TOC generation with no error.

```html
<!-- ✅ CORRECT — sidebar TOC will be generated -->
<h2 class="section-title">セクション名</h2>

<!-- ❌ WRONG — TOC silently skipped, no error shown -->
<div class="section-title">セクション名</div>
```

The integrate script (step 4) prints `⚠️【要対応】` if TOC was skipped for a file. When you see that warning, convert `<div class="section-title">` to `<h2 class="section-title">` and re-run.

## Quick Start

```bash
# 1. Setup Python environment (one-time)
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# 2. Start dev server
python3 server.py  # → http://localhost:8080/

# 3. Make changes, run pre-commit checks, then deploy
git add <files> && git commit -m "feat: description" && git push origin gh-pages
```

## Environment

- Use `uv` instead of `pip` for Python package management (`uv pip install`)
- Always create/activate a virtual environment before installing packages

## Architecture

### Data-Driven Navigation System

```
index.html          ← Shell page (HTML structure only)
├── data.js         ← Pure data definitions (NO HTML tags)
├── render.js       ← Template functions (data → HTML)
└── index.js        ← UI handlers + searchData array
```

**Key Principle**: Data in `data.js` contains NO HTML. All HTML generation happens in `render.js`.

### Resource Data Shape (`data.js`)

```javascript
// categoriesData[].sections[].resources[]
{ title: 'Resource Name', href: 'category/filename.html', priority: 'high' }
```

The `priority` field is optional: `'high'` | `'medium'` | `'low'` | omitted (treated as `'medium'`). Used by render.js for visual priority indicators (🔴 high / 🟡 medium / 🔵 low).

### Search Data Shape (`index.js`)

```javascript
// searchData[]
{ title: 'Resource Name', category: 'カテゴリ名', file: 'category/filename.html' }
```

### Local Dev Server (`server.py`)

The dev server rewrites requests: it strips `/aws_sap_studying/` from URLs so GitHub Pages-style absolute paths resolve correctly on localhost. This is why HTML files use `/aws_sap_studying/css/...` paths — they work on both production and local dev.

### Static Site Constraints

- ❌ NO npm, webpack, vite, or build tools
- ❌ NO React, Vue, Angular, or frameworks
- ❌ NO external CDNs or libraries
- ✅ Pure HTML/CSS/JavaScript only
- ✅ Must work completely offline

### Shared CSS Files

`css/` directory (loaded via `<link>` in every HTML page):
- `variables.css` - CSS custom properties (z-index layers, colors, spacing)
- `common.css` - Shared UI components (header, breadcrumbs, scroll-to-top)
- `layout.css` - Layout utilities and grid
- `responsive.css` - Media queries and mobile styles

`css/components/` directory (added automatically by integration scripts — do not add manually):
- `sidebar-toc.css` - Left sidebar TOC (added by `add_sidebar_toc.py`)
- `page-bottom-nav.css` - Bottom prev/next navigation (added by `add_prev_next_nav.py`)
- Other component CSS files (`priority-group.css`, `roadmap.css`, `bookmark.css`, etc.)

### Sidebar TOC Generation

`add_sidebar_toc.py` adds a collapsible left sidebar TOC to HTML files. It **skips** a file when:

- The file is in `new_html/`, `.git/`, `__pycache__/`, or `.claude/`
- The filename is `index.html`, `table-of-contents.html`, `quiz.html`, `home.html`, or `knowledge-base.html`
- The file has **fewer than 2 `<h2>`/`<h3>` tags** → prints `⏭️ スキップ` in output

When a file is silently skipped in the integrate workflow, the step 4 output will show a `⚠️【要対応】` warning block listing the affected files.

### Sidebar TOC Z-Index Hierarchy

| Element | Z-Index | Notes |
|---------|---------|-------|
| Header | `1002` (`--z-header`) | Fixed top navigation |
| Sidebar TOC Toggle | `1003` | Must be above header |
| Sidebar TOC | `1000` | Below header, uses `top: 60px` |

Sidebar TOC must use `top: 60px` (header height) and `height: calc(100vh - 60px)` to avoid overlapping with the fixed header.

## Common Workflows

### Add New HTML Learning Resource

**Use the skill** (handles categorization, breadcrumbs, TOC, and data updates):
```bash
/skill integrate
```

Or manually:

1. Place HTML files in `new_html/`
2. Run: `python3 scripts/html_management/integrate_resource_complete.py`
   - Auto-runs: categorize → breadcrumbs → sidebar TOC → home button → prev/next nav → **W3C validation** → **`git add`** (aborts before staging if W3C fails)
3. Update `data.js` AND `index.js` (see Two-Place Update Rule)
4. Test: `python3 server.py`
5. Deploy: `git add data.js index.js && git commit -m "feat: ..." && git push origin gh-pages`

### Replace/Update an Existing Resource

Place the replacement HTML file in `replace_html/` (same filename as the target), then run the integration script. The script processes `replace_html/` the same way as `new_html/`. After integration, no `data.js`/`index.js` update is needed (the file path doesn't change).

### Add Quiz Question

Edit `quiz-data-extended.js`:

```javascript
{
  id: 'unique-id',
  question: '質問文',
  options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
  correct: 0,  // Index 0-3
  explanation: '詳細な解説'
}
```

Validate: `node -c quiz-data-extended.js`

## File Placement

HTML resources go in **root-level category directories** (NOT in `scripts/` or other tool directories):

| Directory | data.js Category |
|-----------|------------------|
| `networking/` | `networking` |
| `security-governance/` | `security-governance` |
| `compute-applications/` | `compute-applications` |
| `storage-database/` | `storage-database` |
| `migration/` | `migration` |
| `analytics-bigdata/` | `analytics-operations` |
| `development-deployment/` | `development-deployment` |
| `content-delivery-dns/` | `content-delivery-dns` |
| `new-solutions/` | *(various — cross-cutting resources)* |
| `organizational-complexity/` | *(mapped into other categories)* |
| `continuous-improvement/` | *(mapped into other categories)* |
| `cost-control/` | *(mapped into other categories)* |

**Note**: `data.js` has 8 logical categories. Some physical directories have resources mapped into other categories.

**Staging directories** (processed by integrate script, not committed directly):
- `new_html/` — New HTML files waiting for integration
- `replace_html/` — Updated versions of existing HTML files

### HTML File Naming Conventions

| Pattern | Example |
|---------|---------|
| `aws-[service]-[topic].html` (preferred) | `aws-lambda-metrics.html`, `aws-direct-connect-guide.html` |
| `[service]_[topic]_infographic.html` (legacy) | `ecs_infographic.html`, `auto_scaling_infographic.html` |

Use lowercase. New files should follow the hyphenated `aws-` prefix pattern.

## Bulk File Operations

When modifying 100+ HTML files, use **Python scripts** (not shell script regex). Always validate file counts before and after changes.

## Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/html_management/integrate_resource_complete.py` | Full integration workflow: categorize → nav → W3C validate → `git add` (use `--skip-validation` to bypass W3C) |
| `scripts/html_management/integrate_new_html.py` | Categorize and move HTML files |
| `scripts/html_management/add_breadcrumbs.py` | Add breadcrumb navigation |
| `scripts/html_management/add_sidebar_toc.py` | Add left sidebar TOC (requires 2+ `<h2>`/`<h3>` tags) |
| `scripts/html_management/add_home_button.py` | Add 「リソース集に戻る」button |
| `scripts/html_management/add_prev_next_nav.py --bottom-nav-only` | Add page bottom navigation |
| `scripts/html_management/fix_html_issues.py` | Fix HTML entity escaping & sidebar TOC positioning |
| `scripts/ci/check_data_integrity.py` | Verify data.js ⟷ index.js sync |
| `scripts/ci/validate_html_w3c.py` | W3C HTML validation (`--pr-mode` for changed files, `--files f1.html f2.html` for specific files) |
| `scripts/ci/post_integration_check.py` | Verify integrated files have all required components (CSS links, breadcrumbs, TOC, nav) |
| `scripts/ci/check_internal_links.py` | Broken link checker |
| `scripts/ci/check_file_naming.py` | File naming convention check |
| `scripts/accessibility/check_contrast_ratio.py` | WCAG 2.1 color contrast check |
| `scripts/accessibility/check_heading_hierarchy.py` | Heading hierarchy (h1→h2→h3) check |
| `scripts/accessibility/fix_heading_hierarchy.py` | Auto-fix heading hierarchy skips |

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main navigation shell (primary entry point) |
| `knowledge-base.html` | Alternative table-based resource browser |
| `data.js` | **CRITICAL**: Category/resource data (pure data, no HTML) |
| `render.js` | Template functions (data → HTML generation) |
| `index.js` | UI handlers + searchData array |
| `quiz-data-extended.js` | Quiz questions (219 questions) |
| `quiz-app.js` | Quiz UI logic and state management |
| `server.py` | Local dev server (port 8080, rewrites GitHub Pages paths) |

## WCAG 2.1 AA Color Palette

| Color | Code | Usage | Contrast |
|-------|------|-------|----------|
| AWS Dark | `#232F3E` | Headers, headings | 12.98:1 ✅ |
| AWS Orange (Accessible) | `#dc7600` | Accents, large text | 3.17:1 ✅ |
| Primary Text | `#374151` | Body text | 9.86:1 ✅ |
| Secondary Text | `#6B7280` | Labels, helpers | 4.83:1 ✅ |
| Border | `#909296` | Borders, UI components | 3.12:1 ✅ |
| Quiz Good | `#3378be` | Quiz UI only | ✅ |
| Quiz Excellent | `#008662` | Quiz UI only | ✅ |
| Quiz Poor | `#c35237` | Quiz UI only | ✅ |
| Quiz Fair | `#9e6c0f` | Quiz UI only | ✅ |

### Color Usage Rules

- **`#FF9900` (original AWS Orange)** is allowed **only for large text** (18pt+ or 14pt bold+) — use `#dc7600` for all other text
- **同系色背景×同系色文字は禁止** (NG-007): body text must use neutral colors (`#374151`, `#1f2937`); theme colors for backgrounds/borders/icons only
- **同列情報の非対称レイアウトは禁止** (NG-008): use even grids (2×2, 3×2); if asymmetric, add headings/labels to show intent
- **CSSカスケード保全ルール**: when removing inline styles, verify CSS cascade order and `<link>` tags remain correct; add fallback backgrounds behind white text

Full details: `.claude/skills/wcag-accessibility/SKILL.md`

## Pre-Commit Checklist

```bash
# 1. CI-blocking checks (these fail PR if broken)
python3 scripts/ci/check_data_integrity.py             # data.js ⟷ index.js sync
python3 scripts/ci/validate_html_w3c.py --pr-mode      # W3C HTML validation (auto-run by integrate script)
python3 scripts/accessibility/check_contrast_ratio.py  # WCAG color contrast
node -c quiz-data-extended.js data.js render.js index.js quiz-app.js  # JS syntax

# 2. Advisory checks (warnings only, but recommended)
python3 scripts/accessibility/check_heading_hierarchy.py  # h1→h2→h3 order
python3 scripts/ci/check_internal_links.py                # Broken links
python3 scripts/ci/check_file_naming.py                   # Naming conventions

# 3. Verify no bare CSS paths (should return 0)
grep -r 'href="/css/' --include="*.html" | wc -l
```

## Available Skills

| Skill | Usage | Purpose |
|-------|-------|---------|
| `integrate` | `/skill integrate` | HTML resource integration (categorization → breadcrumbs → TOC → W3C validation → git staging → data update guidance) |
| `wcag-accessibility` | `/skill wcag-accessibility` | WCAG 2.1 AA verification (contrast, headings, SVG, semantic HTML) |
| `aws-knowledge-organizer` | `/skill aws-knowledge-organizer` | Organize AWS study resources: bulk operations, TOC generation, quiz management |

## CI/CD Pipeline

GitHub Actions runs on PRs to `gh-pages` and `master` (`.github/workflows/pr-quality-check.yml`). Triggered by changes to `*.html`, `data.js`, `index.js`, `quiz-data-extended.js`, `*.css`, `*.py`.

| Check | Blocking | Command |
|-------|----------|---------|
| Data Integrity | ✅ Yes | `python3 scripts/ci/check_data_integrity.py` |
| W3C HTML Validation | ✅ Yes | `python3 scripts/ci/validate_html_w3c.py --pr-mode` |
| Color Contrast | ✅ Yes | `python3 scripts/accessibility/check_contrast_ratio.py` |
| JavaScript Syntax | ✅ Yes | `node -c quiz-data-extended.js data.js render.js index.js quiz-app.js` |
| Heading Hierarchy | ⚠️ Warning | `python3 scripts/accessibility/check_heading_hierarchy.py` |
| Internal Links | ⚠️ Warning | `python3 scripts/ci/check_internal_links.py` |
| File Naming | ⚠️ Warning | `python3 scripts/ci/check_file_naming.py` |

## Detailed Documentation

| Topic | File |
|-------|------|
| Architecture | `docs/ARCHITECTURE.md` |
| Development Guide | `docs/DEVELOPMENT_GUIDE.md` |
| Git Workflow | `docs/GIT_WORKFLOW.md` |
| Coding Standards | `docs/CODING_STANDARDS.md` |
| CI/CD Pipeline | `docs/CI_CD_GUIDE.md` |
| Accessibility | `docs/WCAG21_GUIDELINES.md` |
| Development Rules | `.claude/claude_rules.json` |
| AWS SAP Skill | `.claude/skills/integrate/SKILL.md` |
| WCAG Skill | `.claude/skills/wcag-accessibility/SKILL.md` |
| Knowledge Organizer Skill | `.claude/skills/aws-knowledge-organizer/SKILL.md` |
