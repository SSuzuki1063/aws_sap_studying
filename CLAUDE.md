# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Data-driven static site (NO build process) |
| **Content** | 259+ HTML resources, 219 quiz questions, 8 categories |
| **Branches** | `gh-pages` (production), `master` (development/PRs) |

## ⚠️ CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**

### 1. Always Use Skills for Resource Integration

```bash
/skill resource   # ← unified entry point; auto-routes to integrate / replace / delete
```

When managing HTML resources, **ALWAYS** use `/skill resource` (or a specific sub-skill). It ensures proper workflow execution (categorization → breadcrumbs → TOC → data updates) and prevents integration errors.

| Intent | Skill |
|--------|-------|
| Add new HTML resource | `/skill integrate` |
| Update existing resource | `/skill replace` |
| Remove a resource | `/skill delete` |
| Unsure / batch operation | `/skill resource` (auto-diagnoses) |

### 2. Three-Place Update Rule

When adding HTML resources, you **MUST** update **THREE** places in two files:

| File | What to Update | If Missing |
|------|----------------|------------|
| `data.js` | Add to `section.resources` array, update section `count` and category `count` | Resource won't appear in navigation |
| `data.js` | Add entry to `updateHistory[]` array (prepend to top) | index.html timeline stays stale |
| `index.js` | Add to `searchData` array | Resource won't appear in search |

**data.js resource shape:**
```javascript
// categoriesData[].sections[].resources[]
{ title: 'Resource Name', href: 'category/filename.html', priority: 'high' }
// priority: 'high' | 'medium' | 'low' | omitted → defaults to 'medium'
// render.js maps: high=🔴 medium=🟡 low=🔵
```

**index.js searchData shape:**
```javascript
{ title: 'Resource Name', category: 'カテゴリ名', file: 'category/filename.html' }
```

`updateHistory` entry format:
```javascript
{ date: 'YYYY-MM-DD', type: 'content', title: '概要', description: '詳細', categories: ['networking'], tags: [] }
```
`type`: `'content'` = リソース追加 / `'feature'` = UI機能 / `'fix'` = バグ修正

**Count sync:** `python3 scripts/html_management/update_counts.py`
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

The integrate script (step 4) prints `⚠️【要対応】` if TOC was skipped. Convert `<div class="section-title">` to `<h2 class="section-title">` and re-run.

**Sidebar TOC is also skipped when** the file has fewer than 2 `<h2>`/`<h3>` tags, or the file is `index.html`, `table-of-contents.html`, `quiz.html`, `home.html`, or `knowledge-base.html`.

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

**Replace an existing resource:** Place the updated file in `replace_html/` (same filename), then use `/skill replace`. No `data.js`/`index.js` update needed since the file path doesn't change.

**HTML authoring requirements:** Every new HTML file must start with:
```html
<!DOCTYPE html>
<html lang="ja">
```
SVG diagrams must be **inline** (not external files). Every SVG needs `role="img"` and `aria-label`.

## Resource Integration

### Integration Workflow for New HTML Resources

When integrating new HTML files:
1. Validate W3C compliance BEFORE git add/commit (not after)
2. Verify auto-categorization is correct (especially networking vs compute-applications)
3. Ensure fixed header template is applied
4. Ensure sidebar TOC is properly generated
5. Add navigation links from index.html

### Directory → data.js Category Mapping

| Directory | data.js category key |
|-----------|----------------------|
| `networking/` | `networking` |
| `security-governance/` | `security-governance` |
| `compute-applications/` | `compute-applications` |
| `storage-database/` | `storage-database` |
| `migration/` | `migration` |
| `analytics-bigdata/` | `analytics-operations` |
| `development-deployment/` | `development-deployment` |
| `content-delivery-dns/` | `content-delivery-dns` |

**Staging directories** (not committed directly): `new_html/` (new files awaiting integration), `replace_html/` (updated versions of existing files).

## Architecture

### Data-Driven Navigation

```
index.html          ← Shell page (HTML structure only)
├── data.js         ← Pure data (NO HTML tags — text/numbers/objects only)
├── render.js       ← Template functions (data → HTML generation)
└── index.js        ← UI handlers + searchData array
```

`table-of-contents.html` is a **legacy** static secondary nav — NOT the primary entry point.

**`render.js` template functions:**

| Function | Purpose |
|----------|---------|
| `renderCategoryQuickNav(navData)` | Quick-nav cards at top of page |
| `renderResourceList(resources)` | Resource `<li>` items in a section |
| `renderSection(section)` | Subcategory block with resource list |
| `renderMajorCategory(category)` | Full category accordion panel |
| `renderAllCategories(categoriesData)` | Renders all 8 categories |

Sidebar accordion state and desktop collapse are persisted via `localStorage`.

### Shared CSS Load Order

Every content HTML page must load CSS in this exact order:

```html
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>
```

`css/components/` files (e.g. `sidebar-toc.css`, `page-bottom-nav.css`) are **added automatically** by integration scripts — do not add manually.

### Z-Index Hierarchy

| Element | Z-Index | Variable |
|---------|---------|----------|
| Fixed header | `1002` | `--z-header` |
| Sidebar TOC toggle button | `1003` | — |
| Sidebar TOC panel | `1000` | — |

Sidebar TOC must use `top: 60px` and `height: calc(100vh - 60px)`.

## Environment

- Use `uv` instead of `pip` for Python package management (`uv pip install`)
- Always create/activate a virtual environment before installing packages

## Pre-Commit Checklist

```bash
# 1. CI-blocking checks (exit 1 = must fix before commit)
python3 scripts/ci/check_data_integrity.py               # data.js ⟷ index.js sync
python3 scripts/ci/validate_html_w3c.py --pr-mode        # W3C HTML validation (auto-run by integrate script)
python3 scripts/ci/check_css_quality.py --pr-mode        # CSS quality: !important / ID selectors / nesting / global tags
python3 scripts/accessibility/check_contrast_ratio.py    # WCAG color contrast
python3 scripts/accessibility/check_heading_hierarchy.py # h1→h2→h3 order (exit 1 if violations)
python3 scripts/check_fixed_headers.py                   # Fixed header present in all content HTML
node -c quiz-data-extended.js data.js render.js index.js quiz-app.js  # JS syntax

# 2. Advisory checks (warnings only)
python3 scripts/ci/check_internal_links.py                # Broken links
python3 scripts/ci/check_file_naming.py                   # Naming conventions

# 3. Verify no bare CSS paths (should return 0)
grep -r 'href="/css/' --include="*.html" | wc -l
```

**Pre-commit hook** (runs automatically on every `git commit`):
1. `scripts/git_hooks/update_last_modified.py` — updates `data.js` lastUpdated date
2. `scripts/accessibility/check_contrast_ratio.py` — WCAG AA contrast check
3. `scripts/check_fixed_headers.py` — fixed header presence check (261 files)

> ⚠️ `data.js` の `lastUpdated` 行末の `// GIT_LAST_COMMIT_DATE` コメントは **削除禁止**。
> pre-commit hook がこのマーカーを正規表現で検索して日付を書き換える。消すと自動更新が止まる。

## Available Skills

| Skill | Usage | Purpose |
|-------|-------|---------|
| `resource` | `/skill resource` | HTMLリソース統合管理オーケストレーター（integrate/replace/delete を自動ルーティング） |
| `integrate` | `/skill integrate` | HTML resource integration (categorization → breadcrumbs → TOC → W3C validation → git staging → data update guidance) |
| `replace` | `/skill replace` | 既存HTMLリソースを replace_html/ の新バージョンで置換（data.js/index.js 更新不要） |
| `delete` | `/skill delete` | HTMLリソースをサイトから完全削除（data.js・index.js・HTMLファイル・概念マップ参照・隣接ページナビを整合） |
| `blackbelt` | `/skill blackbelt` | AWS Black Belt PDF を学習リソースとして登録（data.js・index.js のデータ登録のみ。W3C検証・TOC不要） |
| `ship` | `/skill ship` | Stage → commit → push → deploy to gh-pages |
| `wcag-accessibility` | `/skill wcag-accessibility` | WCAG 2.1 AA verification (contrast, headings, SVG, semantic HTML) |
| `aws-knowledge-organizer` | `/skill aws-knowledge-organizer` | Organize AWS study resources: bulk operations, TOC generation, quiz management |
| `concept-map-manager` | `/skill concept-map-manager` | AWS概念マップ JSONデータ管理: L2サービス追加・L3/L4編集・クロスリンク設定・インデックス再生成 |

### Speckit Feature Development Commands

| Command | Usage | Purpose |
|---------|-------|---------|
| `speckit.specify` | `/speckit.specify` | Create/update feature spec from natural language description |
| `speckit.clarify` | `/speckit.clarify` | Identify underspecified areas in current spec |
| `speckit.plan` | `/speckit.plan` | Generate implementation plan from spec |
| `speckit.tasks` | `/speckit.tasks` | Generate dependency-ordered tasks.md |
| `speckit.implement` | `/speckit.implement` | Execute tasks from tasks.md |
| `speckit.analyze` | `/speckit.analyze` | Cross-artifact consistency analysis (spec/plan/tasks) |
| `speckit.checklist` | `/speckit.checklist` | Generate custom checklist for current feature |
| `speckit.constitution` | `/speckit.constitution` | Create/update project constitution at `.specify/memory/constitution.md` |

Speckit artifacts are stored in `specs/[###-feature-name]/` directories.

## Documentation Reference

| Topic | File |
|-------|------|
| **Architecture, Key Files, render.js** | `.claude/docs/architecture.md` |
| **Workflows, File Placement, Key Scripts** | `.claude/docs/workflows.md` |
| **WCAG Colors, Deprecated Colors, CI/CD Pipeline** | `.claude/docs/accessibility.md` |
| Architecture (detailed) | `docs/ARCHITECTURE.md` |
| Development Guide | `docs/DEVELOPMENT_GUIDE.md` |
| Git Workflow | `docs/GIT_WORKFLOW.md` |
| Coding Standards | `docs/CODING_STANDARDS.md` |
| CI/CD Pipeline | `docs/CI_CD_GUIDE.md` |
| Accessibility | `docs/WCAG21_GUIDELINES.md` |
| Development Rules | `.claude/claude_rules.json` |
| AWS SAP Skill | `.claude/skills/integrate/SKILL.md` |
| WCAG Skill | `.claude/skills/wcag-accessibility/SKILL.md` |
| Knowledge Organizer Skill | `.claude/skills/aws-knowledge-organizer/SKILL.md` |
| Concept Map Manager Skill | `.claude/skills/concept-map-manager/SKILL.md` |
| Replace Skill | `.claude/skills/replace/SKILL.md` |
| Delete Skill | `.claude/skills/delete/SKILL.md` |
| Black Belt Skill | `.claude/skills/blackbelt/SKILL.md` |
| Resource Orchestrator Skill | `.claude/skills/resource/SKILL.md` |

## Concept Map System (`concept-map.html`)

A second data-driven feature with its own architecture separate from the main navigation system.

```
concepts/
├── axes/        # L0: 8 design axes (change rarely)
├── domains/     # L1: 8 AWS domains (change rarely)
├── services/    # L2 svc-*.json files — L3 concepts and L4 keywords are NESTED inside these
├── concept-index.json   ← AUTO-GENERATED — never hand-edit
└── search-index.json    ← AUTO-GENERATED — never hand-edit
```

**4-layer ID prefix convention:** `axis-` / `dom-` / `svc-` / `con-` / `kw-`

**L3 and L4 have no standalone files** — they are nested inside their parent `svc-*.json`.

After any edit to `concepts/services/`:

```bash
python3 scripts/concept_management/generate_concept_index.py --validate  # validate
python3 scripts/concept_management/generate_concept_index.py              # regenerate indexes
```

**JS engine:** `js/concept-engine/DiagramRenderer.js` — native SVG rendering (IIFE, `ConceptEngine.diagram`). Supports `decision_tree` / `flow` (BFS layout) / `comparison` (table). No Mermaid, D3, or external libraries. Lazy-loaded on first toggle expand.

Full schema and valid values: `.claude/skills/concept-map-manager/references/`

## Branch Workflow

**Daily work (resource integration, W3C fixes, bug fixes, WCAG) → commit directly to `gh-pages`.**

Feature branches only for large refactors or major new features.

| Scenario | Command |
|----------|---------|
| Sync `master` after hotfix on `gh-pages` | `git checkout master && git merge gh-pages && git push origin master` |
| Deploy feature branch after merging PR to `master` | `git checkout gh-pages && git merge master && git push origin gh-pages` |

Feature branch naming: `feature/[service-name]`, `fix/[issue]`, `refactor/[component]`
