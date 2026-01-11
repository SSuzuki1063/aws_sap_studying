# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**⚠️ IMPORTANT:** Development rules and constraints are defined in `.claude/claude_rules.json`. Read that file for critical requirements like data-driven architecture, W3C validation, and git workflows.

## Repository Overview

AWS SAP (Solutions Architect Professional) exam study resource repository with HTML-based learning materials.

**Live Site**: https://ssuzuki1063.github.io/aws_sap_studying/
**Stats**: 179 HTML resources, 194 quiz questions, 13 categories
**Architecture**: Data-driven (data.js → render.js → index.js) static site with NO build process

## Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/SSuzuki1063/aws_sap_studying.git
cd aws_sap_studying

# 2. Python environment (one-time)
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv pip install beautifulsoup4 lxml html5lib requests

# 3. Start dev server
python3 server.py  # → http://localhost:8080/

# 4. Make changes
# - Add HTML to new_html/
# - Update data.js AND index.js (CRITICAL!)
# - W3C validate: https://validator.w3.org/
# - Test locally

# 5. Deploy
git add . && git commit -m "feat: description" && git push origin gh-pages
```

**First-time checklist:**
- [ ] Python 3.11+ installed
- [ ] `uv` installed ([guide](https://github.com/astral-sh/uv))
- [ ] Can access http://localhost:8080/
- [ ] Read `.claude/claude_rules.json` (critical rules)
- [ ] Read `docs/CODING_STANDARDS.md` (data-driven principles)

## Critical Architecture Concepts

### 1. Shared CSS Architecture (2025-01 Refactor)

**Background**: To eliminate 21,645 lines of CSS duplication across 179 HTML files, shared CSS files were introduced.

**CSS Files** (in `css/` directory):
- `variables.css` - CSS custom properties (colors, spacing, typography)
- `common.css` - Shared UI components (fixed header, breadcrumbs, scroll-to-top)
- `layout.css` - Layout utilities and responsive grid
- `responsive.css` - Media queries and mobile styles

**CRITICAL: GitHub Pages Path Requirement**

All CSS/asset paths MUST include the repository name prefix `/aws_sap_studying/`:

```html
<!-- ✅ CORRECT - GitHub Pages compatible -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>

<!-- ❌ WRONG - Will fail on GitHub Pages -->
<link href="/css/variables.css" rel="stylesheet"/>
```

**Why**: GitHub Pages serves this site at `https://ssuzuki1063.github.io/aws_sap_studying/`, not at the root domain. Absolute paths like `/css/` resolve to `https://ssuzuki1063.github.io/css/` (404), not the repository subdirectory.

**Verification**: After adding/modifying HTML files, check that CSS loads correctly:
```bash
# Search for incorrect paths (should return 0)
grep -r 'href="/css/' --include="*.html" | wc -l

# Search for correct paths (should match all HTML files with shared CSS)
grep -r 'href="/aws_sap_studying/css/' --include="*.html" | wc -l
```

### 2. Data-Driven Navigation System

**Architecture**: `index.html` is split into three files:

```
index.html          ← Shell page (HTML structure only)
├── data.js         ← Pure data (NO HTML tags)
├── render.js       ← Template functions (data → HTML)
└── index.js        ← UI handlers (search, scroll, navigation)
```

**TWO-PLACE UPDATE RULE** (Most Common Mistake):

When adding new HTML resources, you MUST update:

1. **`data.js`** - Add to `categoriesData` array:
   ```javascript
   {
     title: 'Your Resource Title',
     href: 'category/your-resource.html'
   }
   // Also increment section.count and category.count
   ```

2. **`index.js`** - Add to `searchData` array:
   ```javascript
   {
     title: 'Your Resource Title',
     category: 'カテゴリ名',
     file: 'category/your-resource.html'
   }
   ```

**Without BOTH updates**: Resource won't appear in navigation sidebar OR search results.

**Verification**:
```bash
python3 scripts/ci/check_data_integrity.py
```

### 3. Static Site Constraints

**NO build process, NO dependencies**:
- NO npm, webpack, vite, or any build tools
- NO React, Vue, Angular, or frameworks
- NO external CDNs or libraries
- Pure HTML/CSS/JavaScript only
- Must work completely offline

## Most Common Workflows

### 1. Add New HTML Learning Resource

```bash
# Step 1: Place HTML files in new_html/
# Step 2: Run integration script
python3 scripts/html_management/integrate_new_html.py --dry-run  # Preview
python3 scripts/html_management/integrate_new_html.py            # Execute

# Step 3: CRITICAL - Manual updates required
# ⚠️ Script does NOT auto-update data.js and index.js
```

**Manual updates after integration:**

```javascript
// 1. Update data.js - Add to appropriate section
{
  title: 'Your Resource Title',
  href: 'category/your-resource.html'
}
// Also update section.count and category.count

// 2. Update index.js - Add to searchData array
const searchData = [
  // ... existing entries ...
  {
    title: 'Your Resource Title',
    category: 'カテゴリ名',
    file: 'category/your-resource.html'
  }
];
```

**Ensure correct CSS paths in new HTML files**:
```html
<!-- Include these at the top of <head> -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>
```

```bash
# Step 4: Validate and test
python3 scripts/ci/check_data_integrity.py  # Verify sync
# Visit https://validator.w3.org/ and validate HTML
python3 server.py  # Test navigation and search

# Step 5: Deploy
git add . && git commit -m "feat: 新規AWS学習リソースを追加" && git push origin gh-pages
```

### 2. Add Quiz Question

Edit `quiz-data-extended.js`:

```javascript
{
  id: 'unique-id',
  question: '質問文',
  options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
  correct: 0,  // Index 0-3
  explanation: '詳細な解説（2-4文）'
}
```

Test: `python3 server.py` → Open quiz.html

### 3. Local Development & Testing

```bash
python3 server.py  # → http://localhost:8080/
```

**Server features:** Port 8080, CORS enabled, cache disabled, Japanese filenames supported

### 4. Deploy to GitHub Pages

```bash
# 1. Test locally
python3 server.py

# 2. W3C validate all modified HTML
# https://validator.w3.org/

# 3. Run CI/CD checks locally
python3 scripts/ci/check_data_integrity.py
python3 scripts/ci/validate_html_w3c.py --pr-mode
python3 scripts/accessibility/check_contrast_ratio.py
node -c quiz-data-extended.js data.js render.js index.js

# 4. Deploy to gh-pages branch
git add .
git commit -m "feat: descriptive message"
git push origin gh-pages  # Auto-deploys to GitHub Pages (1-2 min)
```

**Branches:**
- `gh-pages` - Production (auto-deploys)
- `master` - Development base (for PRs)

## Automation Scripts Quick Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| **HTML Management** |
| `integrate_new_html.py` | Auto-categorize and integrate new HTML files | `python3 scripts/html_management/integrate_new_html.py [--dry-run]` |
| `add_breadcrumbs.py` | Add breadcrumb navigation | `python3 scripts/html_management/add_breadcrumbs.py` |
| `add_toc.py` | Add page-internal TOC | `python3 scripts/html_management/add_toc.py [--dry-run]` |
| `add_svg_alt_text.py` | Add accessibility alt text to SVGs | `python3 scripts/html_management/add_svg_alt_text.py` |
| **Quiz Management** |
| `analyze_quiz.py` | Display quiz statistics | `python3 scripts/quiz_management/analyze_quiz.py` |
| **Accessibility** |
| `check_contrast_ratio.py` | Verify WCAG 2.1 color contrast | `python3 scripts/accessibility/check_contrast_ratio.py` |
| `suggest_color_fixes.py` | Suggest accessible color alternatives | `python3 scripts/accessibility/suggest_color_fixes.py` |
| `check_heading_hierarchy.py` | Verify heading structure | `python3 scripts/accessibility/check_heading_hierarchy.py` |
| **CI/CD** |
| `check_data_integrity.py` | Verify data.js ⟷ index.js sync | `python3 scripts/ci/check_data_integrity.py` |
| `validate_html_w3c.py` | W3C HTML validation | `python3 scripts/ci/validate_html_w3c.py [--pr-mode]` |
| `check_internal_links.py` | Validate internal links | `python3 scripts/ci/check_internal_links.py` |
| `check_file_naming.py` | Check file naming conventions | `python3 scripts/ci/check_file_naming.py` |

## Claude Skills

**Recommended:** Use the `aws-sap-dev` skill for comprehensive workflows:

```bash
/skill aws-sap-dev
```

**Provides:** Guided workflows, data-driven architecture compliance, W3C validation, deployment workflows, templates

**Alternative:** `/skill aws-knowledge-organizer` for legacy workflows

See `.claude/skills/aws-sap-dev/SKILL.md` for details.

## Directory Structure

**Content Categories** (AWS SAP exam domains):
- `networking/` - Direct Connect, Transit Gateway, VPN, PrivateLink
- `security-governance/` - IAM, SCP, WAF, KMS, Cognito
- `compute-applications/` - EC2, Lambda, ECS, Auto Scaling
- `content-delivery-dns/` - CloudFront, Route53, Global Accelerator
- `development-deployment/` - CloudFormation, CDK, SAM, EventBridge
- `storage-database/` - S3, EBS, EFS, RDS Aurora, ElastiCache
- `migration/` - DMS, Migration Hub, DR strategies
- `analytics-bigdata/` - Kinesis, Redshift, Glue, QuickSight
- `organizational-complexity/` - Organizations, Control Tower, RAM
- `continuous-improvement/` - Systems Manager, CodeDeploy, CloudTrail
- `cost-control/` - Savings Plans, storage classes optimization
- `new-solutions/` - Newly added solution architectures

**Key Files:**
- `index.html` - Main navigation (shell structure)
- `data.js` - **CRITICAL**: Pure data definitions
- `render.js` - Template functions (data → HTML)
- `index.js` - UI event handlers (search, navigation)
- `quiz-data-extended.js` - 194 quiz questions
- `server.py` - Local dev server with CORS
- `.git/hooks/pre-commit` - Auto-updates lastUpdated field
- `css/` - Shared CSS files (variables, common, layout, responsive)

## Critical Rules (Summary)

**See `.claude/claude_rules.json` for complete rules.** Key reminders:

1. **Two-place update**: Always update `data.js` AND `index.js` when adding resources
2. **GitHub Pages paths**: Use `/aws_sap_studying/css/` not `/css/` for all asset paths
3. **W3C validation**: REQUIRED for all HTML before committing
4. **Static site**: NO backend, NO build process, NO external dependencies
5. **Data-driven**: Pure data in data.js, HTML generation in render.js only
6. **WCAG 2.1 AA**: Color contrast 4.5:1 (text), 3:1 (UI components)
7. **Git workflow**: `git commit` → `git push origin gh-pages` immediately

## Detailed Documentation

**For in-depth information, consult:**

- **Architecture & Design** → `docs/ARCHITECTURE.md` (data-driven architecture, navigation, quiz system)
- **Development Workflows** → `docs/DEVELOPMENT_GUIDE.md` (adding resources, automation, W3C validation)
- **Git Operations** → `docs/GIT_WORKFLOW.md` (branching, commits, deployment)
- **CI/CD Pipeline** → `docs/CI_CD_GUIDE.md` (automated checks, troubleshooting)
- **Coding Standards** → `docs/CODING_STANDARDS.md` (data-driven principles, color palette, naming)
- **Accessibility** → `docs/WCAG21_GUIDELINES.md` (WCAG 2.1 AA compliance, checklists)

## Quick Reference Card

**Most common mistakes:**
1. Forgetting to update both `data.js` AND `index.js` when adding resources
2. Using `/css/` instead of `/aws_sap_studying/css/` for asset paths
3. Skipping W3C validation before committing

**Pre-commit checklist:**
```bash
python3 server.py                                      # Local test
python3 scripts/ci/check_data_integrity.py             # Verify data.js ⟷ index.js sync
python3 scripts/ci/validate_html_w3c.py --pr-mode      # W3C validation
python3 scripts/accessibility/check_contrast_ratio.py  # Color contrast
node -c quiz-data-extended.js data.js render.js        # JS syntax
git add . && git commit -m "..." && git push origin gh-pages  # Deploy
```

**Path verification:**
```bash
# Check for incorrect CSS paths (should be 0)
grep -r 'href="/css/' --include="*.html" | wc -l

# Check for correct CSS paths
grep -r 'href="/aws_sap_studying/css/' --include="*.html" | wc -l
```

**Getting help:**
- Rules and constraints → `.claude/claude_rules.json`
- Architecture → `docs/ARCHITECTURE.md`
- Workflows → `docs/DEVELOPMENT_GUIDE.md`
- Git → `docs/GIT_WORKFLOW.md`
- Standards → `docs/CODING_STANDARDS.md`
- CI/CD → `docs/CI_CD_GUIDE.md`
- Skills → `/skill aws-sap-dev`

## Legacy Documentation

**AGENTS.md** contains legacy guidelines. Use CLAUDE.md for current workflows.

**Key differences:** AGENTS.md predates data-driven refactor, suggested direct index.html editing, used `python -m http.server 8000` instead of server.py.
