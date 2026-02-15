# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Data-driven static site (NO build process) |
| **Content** | 223+ HTML resources, 219 quiz questions, 8 categories |

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
| `data.js` | Add to `section.resources` array, update counts | Resource won't appear in navigation |
| `index.js` | Add to `searchData` array | Resource won't appear in search |

**Verification:** Run `python3 scripts/ci/check_data_integrity.py` to detect sync issues.

Additionally, update `siteStats.totalResources` in `data.js` when resource counts change.

### 3. GitHub Pages Path Requirement

All CSS/asset paths **MUST** include `/aws_sap_studying/` prefix:

```html
<!-- ✅ CORRECT -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>

<!-- ❌ WRONG - Will 404 on GitHub Pages -->
<link href="/css/variables.css" rel="stylesheet"/>
```

### 4. W3C Validation Required

All HTML **MUST** pass https://validator.w3.org/ before committing.

Automated check: `python3 scripts/ci/validate_html_w3c.py --pr-mode`

### 5. Immediate Push After Commit

```bash
git add . && git commit -m "feat: description" && git push origin gh-pages
```

Always push immediately—commits without push don't deploy. CI runs on PRs to `gh-pages` and `master` branches.

## Quick Start

```bash
# 1. Setup Python environment (one-time)
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# 2. Start dev server
python3 server.py  # → http://localhost:8080/

# 3. Make changes, run pre-commit checks (see "Pre-Commit Checklist" below), then deploy
git add . && git commit -m "feat: description" && git push origin gh-pages
```

## Deployment

After completing code changes, **ALWAYS** commit AND deploy to GitHub Pages in the same session. Do not wait for the user to remind you to push.

```bash
git add <files> && git commit -m "feat: description" && git push origin gh-pages
```

## Environment

- Use `uv` instead of `pip` for Python package management
- Always create/activate a virtual environment before installing packages
- Never use `pip install` directly — use `uv pip install`

## Architecture

### Data-Driven Navigation System

```
index.html          ← Shell page (HTML structure only)
├── data.js         ← Pure data definitions (NO HTML tags)
├── render.js       ← Template functions (data → HTML)
└── index.js        ← UI handlers + searchData array
```

**Key Principle**: Data in `data.js` contains NO HTML. All HTML generation happens in `render.js`.

### Static Site Constraints

- ❌ NO npm, webpack, vite, or build tools
- ❌ NO React, Vue, Angular, or frameworks
- ❌ NO external CDNs or libraries
- ✅ Pure HTML/CSS/JavaScript only
- ✅ Must work completely offline

### Shared CSS Files

Located in `css/` directory:
- `variables.css` - CSS custom properties (z-index layers, colors, spacing)
- `common.css` - Shared UI components (header, breadcrumbs, scroll-to-top)
- `layout.css` - Layout utilities and grid
- `responsive.css` - Media queries and mobile styles

### Sidebar TOC Z-Index Hierarchy

When adding sidebar TOC to pages, ensure proper z-index layering to avoid header overlap:

| Element | Z-Index | Notes |
|---------|---------|-------|
| Header | `1002` (`--z-header`) | Fixed top navigation |
| Sidebar TOC Toggle | `1003` | Must be above header |
| Sidebar TOC | `1000` | Below header, uses `top: 60px` |

**Important**: Sidebar TOC must use `top: 60px` (header height) and `height: calc(100vh - 60px)` to avoid overlapping with the fixed header.

## Common Workflows

### Add New HTML Learning Resource

**Use the skill** (handles steps 1-3 automatically):
```bash
/skill integrate
```

Or manually:

1. Place HTML files in `new_html/`
2. Run integration:
   ```bash
   python3 scripts/html_management/integrate_resource_complete.py
   ```
3. Update `data.js` AND `index.js` (see Two-Place Update Rule)
4. Validate: https://validator.w3.org/
5. Test: `python3 server.py`
6. Deploy: `git add . && git commit -m "feat: ..." && git push origin gh-pages`

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

### Deploy to GitHub Pages

```bash
# Run pre-commit checks first (see "Pre-Commit Checklist" section)
# Then deploy (auto-deploys in 1-2 min)
git add . && git commit -m "feat: description" && git push origin gh-pages
```

**Branches**: `gh-pages` (production), `master` (development/PRs)

## File Integration

When integrating new HTML resource files, always place them in the **correct root-level category directories** (NOT in `scripts/html_management/` or other script directories). Verify file placement before committing.

| Category Directory | Example |
|-------------------|---------|
| `networking/` | Transit Gateway, VPN |
| `security-governance/` | KMS, IAM |
| `compute-applications/` | Lambda, ECS |

## Bulk File Operations

When modifying large numbers of HTML files (100+), use **Python scripts** rather than shell scripts for parsing and transformation. Shell script regex/parsing is unreliable at scale. Always validate the full count of affected files before and after changes.

```bash
# Before: count target files
find . -name "*.html" -path "./networking/*" -o -path "./security-governance/*" | wc -l

# After: verify same count was processed
```

## Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/html_management/integrate_resource_complete.py` | Full integration workflow (recommended) |
| `scripts/html_management/integrate_new_html.py` | Categorize and move HTML files |
| `scripts/html_management/add_breadcrumbs.py` | Add breadcrumb navigation |
| `scripts/html_management/add_sidebar_toc.py` | Add left sidebar TOC |
| `scripts/html_management/add_home_button.py` | Add 「リソース集に戻る」button |
| `scripts/html_management/add_prev_next_nav.py --bottom-nav-only` | Add page bottom navigation (資料幅に揃えたページ下部ナビ) |
| `scripts/html_management/fix_html_issues.py` | Fix HTML entity escaping & sidebar TOC positioning |
| `scripts/ci/check_data_integrity.py` | Verify data.js ⟷ index.js sync |
| `scripts/ci/validate_html_w3c.py` | W3C HTML validation |
| `scripts/accessibility/check_contrast_ratio.py` | WCAG 2.1 color contrast check |
| `scripts/accessibility/check_heading_hierarchy.py` | Heading hierarchy (h1→h2→h3) check |
| `scripts/accessibility/fix_heading_hierarchy.py` | Auto-fix heading hierarchy skips |

## Directory Structure

**Content Directories** (11 physical directories, consolidated into 8 logical categories in `data.js`):

| Directory | Content | data.js Category |
|-----------|---------|------------------|
| `networking/` | Direct Connect, Transit Gateway, VPN, PrivateLink | `networking` |
| `security-governance/` | IAM, SCP, WAF, KMS, Cognito | `security-governance` |
| `compute-applications/` | EC2, Lambda, ECS, Auto Scaling | `compute-applications` |
| `storage-database/` | S3, EBS, EFS, RDS Aurora, ElastiCache | `storage-database` |
| `migration/` | DMS, Migration Hub, DR strategies | `migration` |
| `analytics-bigdata/` | Kinesis, Redshift, Glue, QuickSight | `analytics-operations` |
| `development-deployment/` | CloudFormation, CDK, SAM, EventBridge | `development-deployment` |
| `content-delivery-dns/` | CloudFront, Route53, Global Accelerator | `content-delivery-dns` |
| `new-solutions/` | Cross-cutting resources (referenced from multiple categories) | *(various)* |
| `organizational-complexity/` | Organizations, Control Tower, RAM | *(within other categories)* |
| `continuous-improvement/` | Systems Manager, CodeDeploy, CloudTrail | *(within other categories)* |
| `cost-control/` | Savings Plans, storage optimization | *(within other categories)* |

**Note**: `data.js` has 8 categories. Some physical directories (`organizational-complexity/`, `continuous-improvement/`, `cost-control/`) have their resources mapped into other logical categories. The `new-solutions/` directory contains cross-cutting resources referenced from multiple categories.

**Key Files:**

| File | Purpose |
|------|---------|
| `index.html` | Main navigation shell (primary entry point) |
| `knowledge-base.html` | Alternative table-based resource browser |
| `data.js` | **CRITICAL**: Category/resource data |
| `render.js` | Template functions |
| `index.js` | UI handlers + searchData |
| `quiz-data-extended.js` | Quiz questions (219 questions) |
| `quiz-app.js` | Quiz UI logic and state management |
| `server.py` | Local dev server (port 8080) |
| `css/*.css` | Shared stylesheets |

## WCAG 2.1 AA Color Palette

| Color | Code | Usage | Contrast |
|-------|------|-------|----------|
| AWS Dark | `#232F3E` | Headers, headings | 12.98:1 ✅ |
| AWS Orange (Accessible) | `#dc7600` | Accents, large text | 3.17:1 ✅ |
| Primary Text | `#374151` | Body text | 9.86:1 ✅ |
| Secondary Text | `#6B7280` | Labels, helpers | 4.83:1 ✅ |
| Border | `#909296` | Borders, UI components | 3.12:1 ✅ |

### Color Usage Rules

⚠️ **Original AWS Orange `#FF9900`** is NOT accessible for normal text—use `#dc7600` instead.

⚠️ **同系色背景×同系色文字は禁止**（NG-007）:
- ❌ 薄緑背景に緑文字、薄紫背景に紫文字
- ✅ 本文テキストは常に無彩色（`#374151`, `#1f2937`）を使用
- ✅ テーマカラーは背景・枠線・アイコンのみに限定

⚠️ **同列情報の非対称レイアウトは禁止**（NG-008）:
- ❌ 4要素を3+1に分割（下段が「余り」に見える）
- ✅ 同列要素は均等グリッド（2×2, 3×2 等）で配置
- ✅ 非対称を使う場合は見出し・ラベルで意味差を明示

⚠️ **CSSカスケード保全ルール**:
- インラインスタイル削除時は、CSSカスケード順序を維持し、必要な`<link>`タグが全て存在することを確認
- 白テキストを使用する場合は、背景が暗いことを保証するフォールバック背景を必ず追加
- 一括修正後は必ず数ファイルを目視確認してリグレッションをチェック

詳細は `.claude/skills/wcag-accessibility/SKILL.md` を参照。

## Pre-Commit Checklist

```bash
# 1. Start local server and test in browser
python3 server.py  # → http://localhost:8080/

# 2. Run CI-blocking checks (these fail PR if broken)
python3 scripts/ci/check_data_integrity.py             # data.js ⟷ index.js sync
python3 scripts/ci/validate_html_w3c.py --pr-mode      # W3C HTML validation
python3 scripts/accessibility/check_contrast_ratio.py  # WCAG color contrast
node -c quiz-data-extended.js data.js render.js index.js quiz-app.js  # JS syntax

# 3. Run advisory checks (warnings only, but recommended)
python3 scripts/accessibility/check_heading_hierarchy.py  # h1→h2→h3 order
python3 scripts/ci/check_internal_links.py                # Broken links
python3 scripts/ci/check_file_naming.py                   # Naming conventions

# 4. Verify GitHub Pages paths (should return 0)
grep -r 'href="/css/' --include="*.html" | wc -l
```

## Available Skills

| Skill | Usage | Purpose |
|-------|-------|---------|
| `integrate` | `/skill integrate` | HTML resource integration (categorization → breadcrumbs → TOC → data updates) |
| `wcag-accessibility` | `/skill wcag-accessibility` | WCAG 2.1 AA verification (contrast, headings, SVG, semantic HTML) |
| `aws-knowledge-organizer` | `/skill aws-knowledge-organizer` | Organize AWS study resources: bulk operations, TOC generation, quiz management |

## CI/CD Pipeline

GitHub Actions runs on PRs to `gh-pages` and `master` branches (`.github/workflows/pr-quality-check.yml`):

| Check | Blocking | Command |
|-------|----------|---------|
| Data Integrity | ✅ Yes | `python3 scripts/ci/check_data_integrity.py` |
| W3C HTML Validation | ✅ Yes | `python3 scripts/ci/validate_html_w3c.py --pr-mode` |
| Color Contrast | ✅ Yes | `python3 scripts/accessibility/check_contrast_ratio.py` |
| JavaScript Syntax | ✅ Yes | `node -c quiz-data-extended.js data.js render.js index.js` |
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
