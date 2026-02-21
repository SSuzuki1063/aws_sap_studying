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
/skill integrate
```

When integrating new AWS learning resources, **ALWAYS** use the skill. It ensures proper workflow execution (categorization → breadcrumbs → TOC → data updates) and prevents integration errors.

### 2. Three-Place Update Rule

When adding HTML resources, you **MUST** update **THREE** places in two files:

| File | What to Update | If Missing |
|------|----------------|------------|
| `data.js` | Add to `section.resources` array, update section `count` and category `count` | Resource won't appear in navigation |
| `data.js` | Add entry to `updateHistory[]` array (prepend to top) | index.html timeline stays stale |
| `index.js` | Add to `searchData` array | Resource won't appear in search |

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

**Replace an existing resource:** Place the updated file in `replace_html/` (same filename), then run `integrate_resource_complete.py`. No `data.js`/`index.js` update needed since the file path doesn't change.

**HTML authoring requirements:** Every new HTML file must start with:
```html
<!DOCTYPE html>
<html lang="ja">
```
SVG diagrams must be **inline** (not external files). Every SVG needs `role="img"` and `aria-label`.

## Environment

- Use `uv` instead of `pip` for Python package management (`uv pip install`)
- Always create/activate a virtual environment before installing packages

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

## Active Technologies
- Vanilla JavaScript (ES6+), Python 3.11（スクリプト層） + なし（外部ライブラリ・CDN・npmパッケージ一切不使用） (001-aws-concept-hierarchy)
- JSON静的ファイル（`concepts/` ディレクトリ）。データベース不使用 (001-aws-concept-hierarchy)
- `js/concept-engine/DiagramRenderer.js` — ネイティブ SVG 描画エンジン（IIFE, `ConceptEngine.diagram`）。decision_tree / flow（BFS レイアウト）/ comparison（表形式）の 3 テンプレート対応。Mermaid・D3 等外部ライブラリ不使用。📊 トグル初回展開時に動的遅延ロード (001-aws-concept-hierarchy)

## Recent Changes
- 001-aws-concept-hierarchy: Added Vanilla JavaScript (ES6+), Python 3.11（スクリプト層） + なし（外部ライブラリ・CDN・npmパッケージ一切不使用）
