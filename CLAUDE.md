# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

| Item | Value |
|------|-------|
| **Live Site** | https://ssuzuki1063.github.io/aws_sap_studying/ |
| **Architecture** | Data-driven static site (NO build process) |
| **Content** | 216+ HTML resources, 194 quiz questions, 13 categories |

## ⚠️ CRITICAL RULES

> **These rules prevent the most common mistakes. Violating them breaks the site.**

### 1. Always Use Skills for Resource Integration

```bash
/skill aws-sap-dev
```

When integrating new AWS learning resources, **ALWAYS** use the skill. It ensures proper workflow execution (categorization → breadcrumbs → TOC → data updates) and prevents integration errors.

### 2. Two-Place Update Rule

When adding HTML resources, you **MUST** update **TWO** files:

| File | What to Update | If Missing |
|------|----------------|------------|
| `data.js` | Add to `section.resources` array, update counts | Resource won't appear in navigation |
| `index.js` | Add to `searchData` array | Resource won't appear in search |

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

### 5. Immediate Push After Commit

```bash
git add . && git commit -m "feat: description" && git push origin gh-pages
```

Always push immediately—commits without push don't deploy.

## Quick Start

```bash
# 1. Setup Python environment (one-time)
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# 2. Start dev server
python3 server.py  # → http://localhost:8080/

# 3. Make changes, then deploy
git add . && git commit -m "feat: description" && git push origin gh-pages
```

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
/skill aws-sap-dev
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
# 1. Test locally
python3 server.py

# 2. Run checks
python3 scripts/ci/check_data_integrity.py
python3 scripts/ci/validate_html_w3c.py --pr-mode
node -c quiz-data-extended.js data.js render.js index.js

# 3. Deploy (auto-deploys in 1-2 min)
git add . && git commit -m "feat: description" && git push origin gh-pages
```

**Branches**: `gh-pages` (production), `master` (development/PRs)

## Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/html_management/integrate_resource_complete.py` | Full integration workflow (recommended) |
| `scripts/html_management/integrate_new_html.py` | Categorize and move HTML files |
| `scripts/html_management/add_breadcrumbs.py` | Add breadcrumb navigation |
| `scripts/html_management/add_sidebar_toc.py` | Add left sidebar TOC |
| `scripts/html_management/add_home_button.py` | Add 「リソース集に戻る」button |
| `scripts/html_management/add_prev_next_nav.py` | Add 「← 前へ / 次へ →」navigation bar |
| `scripts/html_management/fix_html_issues.py` | Fix HTML entity escaping & sidebar TOC positioning |
| `scripts/ci/check_data_integrity.py` | Verify data.js ⟷ index.js sync |
| `scripts/ci/validate_html_w3c.py` | W3C HTML validation |
| `scripts/accessibility/check_contrast_ratio.py` | WCAG 2.1 color contrast check |

## Directory Structure

**Content Categories** (match AWS SAP exam domains):

| Directory | Content |
|-----------|---------|
| `networking/` | Direct Connect, Transit Gateway, VPN, PrivateLink |
| `security-governance/` | IAM, SCP, WAF, KMS, Cognito |
| `compute-applications/` | EC2, Lambda, ECS, Auto Scaling |
| `storage-database/` | S3, EBS, EFS, RDS Aurora, ElastiCache |
| `migration/` | DMS, Migration Hub, DR strategies |
| `analytics-bigdata/` | Kinesis, Redshift, Glue, QuickSight |
| `development-deployment/` | CloudFormation, CDK, SAM, EventBridge |
| `content-delivery-dns/` | CloudFront, Route53, Global Accelerator |
| `organizational-complexity/` | Organizations, Control Tower, RAM |
| `continuous-improvement/` | Systems Manager, CodeDeploy, CloudTrail |
| `cost-control/` | Savings Plans, storage optimization |

**Key Files:**

| File | Purpose |
|------|---------|
| `index.html` | Main navigation shell |
| `data.js` | **CRITICAL**: Category/resource data |
| `render.js` | Template functions |
| `index.js` | UI handlers + searchData |
| `quiz-data-extended.js` | Quiz questions |
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

⚠️ Original AWS Orange `#FF9900` is NOT accessible for normal text—use `#dc7600` instead.

## Pre-Commit Checklist

```bash
# Required checks
python3 server.py                                      # Local test
python3 scripts/ci/check_data_integrity.py             # data.js ⟷ index.js
python3 scripts/ci/validate_html_w3c.py --pr-mode      # W3C validation
python3 scripts/accessibility/check_contrast_ratio.py  # Color contrast
node -c quiz-data-extended.js data.js render.js index.js  # JS syntax

# Verify CSS paths (should return 0 incorrect)
grep -r 'href="/css/' --include="*.html" | wc -l
```

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
| Skill Details | `.claude/skills/aws-sap-dev/SKILL.md` |
