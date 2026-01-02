# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AWS SAP (Solutions Architect Professional) exam study resource repository containing HTML-based learning materials. The repository serves as a comprehensive visual learning platform with infographics, technical diagrams, and detailed explanations of AWS services and concepts.

**Live Site**: https://ssuzuki1063.github.io/aws_sap_studying/
**Current Stats**: 120+ HTML learning resources, 194 quiz questions across 13 categories

## Quick Start (New Contributors)

```bash
# 1. Clone repository
git clone https://github.com/SSuzuki1063/aws_sap_studying.git
cd aws_sap_studying

# 2. Set up Python environment (one-time)
uv venv
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate  # Windows
uv pip install beautifulsoup4 lxml html5lib requests

# 3. Start development server
python3 server.py

# 4. Open browser
# Visit: http://localhost:8080/

# 5. Make changes and test
# - Add HTML files to new_html/
# - Run integration script
# - Update data.js and index.js (CRITICAL!)
# - Test locally before committing
```

**First-time checklist:**
- [ ] Python 3.11+ installed
- [ ] `uv` package manager installed ([install guide](https://github.com/astral-sh/uv))
- [ ] Virtual environment activated
- [ ] Can access http://localhost:8080/
- [ ] Read `docs/CODING_STANDARDS.md` (data-driven principles)

## Architecture Overview

This repository uses a **data-driven architecture** that separates data, rendering, and UI logic:

```
data.js          ← Pure data definitions (categories, resources, metadata)
    ↓
render.js        ← Template functions (data → HTML)
    ↓
index.js         ← UI event handlers (search, navigation, interactions)
```

**Critical: TWO-place update requirement** when adding new resources:
- ⚠️ **`data.js`** - Add to `section.resources` array and update counts
- ⚠️ **`index.js`** - Add to `searchData` array (required for search)

**Static Site Constraints**:
- ❌ NO backend server, database, build process, Node.js/npm, or external CDNs
- ✅ Pure HTML/CSS/JavaScript only - all resources work offline

## Python Development Environment Setup

This project uses `uv` for Python dependency management (10-100x faster than pip):

```bash
# Install uv (one-time, if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh
# OR on Windows:
# powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Create virtual environment (one-time per clone)
uv venv

# Activate virtual environment (each terminal session)
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate  # Windows

# Install dependencies
uv pip install beautifulsoup4 lxml html5lib requests

# Deactivate when done
deactivate
```

**Why uv?**
- 10-100x faster than pip
- Automatic Python version management
- Better dependency resolution
- Single binary, no Python required to bootstrap

## Most Common Workflows

### 1. Add New HTML Learning Resource (Automated - Recommended)

```bash
# Place HTML files in new_html/ directory
# Then run:
python3 scripts/html_management/integrate_new_html.py --dry-run  # Preview
python3 scripts/html_management/integrate_new_html.py            # Execute

# ⚠️ CRITICAL: Script does NOT auto-update data.js and index.js
# You MUST manually update both files (see step-by-step below)

# Test locally
python3 server.py  # Visit http://localhost:8080/

# W3C validate (REQUIRED): https://validator.w3.org/
# Fix all errors before committing

# Deploy
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages
```

**Step-by-step: Manual data file updates after integration**

After running `integrate_new_html.py`, you MUST update:

**1. Update `data.js`:**
```javascript
// Find appropriate category and section, then add:
{
  title: 'Your Resource Title',
  href: 'category/your-resource.html'
}
// Also update section.count and category.count
```

**2. Update `index.js`:**
```javascript
// Add to searchData array (search won't work without this!):
const searchData = [
  // ... existing entries ...
  {
    title: 'Your Resource Title',
    category: 'カテゴリ名',
    file: 'category/your-resource.html'
  }
];
```

**3. Verify:**
```bash
python3 server.py
# Visit http://localhost:8080/ and check:
# - Resource appears in navigation
# - Search finds the resource
# - Resource loads correctly
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
# Start development server (auto-detects script directory as web root)
python3 server.py

# Access at http://localhost:8080/
# Test navigation, search, mobile responsiveness
```

**Server features:**
- **Port**: 8080 (hardcoded)
- **CORS**: Enabled for cross-origin iframe loading
- **Cache**: Disabled (all responses have no-cache headers)
- **Path handling**: Automatic URL decoding for non-ASCII filenames
- **Auto-detection**: Serves from repository root automatically

**Server capabilities detail:**
- CORS headers enabled for development (`Access-Control-Allow-Origin: *`)
- Cache-Control headers prevent browser caching (`no-cache, no-store, must-revalidate`)
- URL path decoding handles Japanese filenames correctly
- Request logging to console for debugging

### 4. Deploy to GitHub Pages

```bash
# 1. Test locally first
python3 server.py

# 2. W3C validate: https://validator.w3.org/

# 3. Commit and push to gh-pages branch
git add .
git commit -m "feat: descriptive message"
git push origin gh-pages

# 4. Verify (wait 1-2 minutes)
# https://ssuzuki1063.github.io/aws_sap_studying/
```

**Branches:**
- `gh-pages` - Production (auto-deploys to GitHub Pages)
- `master` - Development base (for PRs)

## Automation Scripts Quick Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| **HTML Management** |
| `integrate_new_html.py` | Auto-categorize and integrate new HTML files | `python3 scripts/html_management/integrate_new_html.py [--dry-run]` |
| `integrate_resource_complete.py` | Complete resource integration with validation | `python3 scripts/html_management/integrate_resource_complete.py` |
| `add_breadcrumbs.py` | Add breadcrumb navigation to all HTML files | `python3 scripts/html_management/add_breadcrumbs.py` |
| `remove_breadcrumbs.py` | Remove breadcrumb navigation | `python3 scripts/html_management/remove_breadcrumbs.py` |
| `add_toc.py` | Add page-internal table of contents | `python3 scripts/html_management/add_toc.py [--dry-run]` |
| `add_home_button.py` | Add home button to HTML files | `python3 scripts/html_management/add_home_button.py` |
| `add_svg_alt_text.py` | Add accessibility alt text to SVGs | `python3 scripts/html_management/add_svg_alt_text.py` |
| **Quiz Management** |
| `analyze_quiz.py` | Display quiz statistics and category distribution | `python3 scripts/quiz_management/analyze_quiz.py` |
| **Accessibility** |
| `check_contrast_ratio.py` | Verify WCAG 2.1 color contrast ratios | `python3 scripts/accessibility/check_contrast_ratio.py` |
| `suggest_color_fixes.py` | Suggest accessible color alternatives | `python3 scripts/accessibility/suggest_color_fixes.py` |
| `check_heading_hierarchy.py` | Verify heading structure (h1→h2→h3) | `python3 scripts/accessibility/check_heading_hierarchy.py` |
| **CI/CD** |
| `check_data_integrity.py` | Verify data.js ⟷ index.js synchronization | `python3 scripts/ci/check_data_integrity.py` |
| `validate_html_w3c.py` | W3C HTML validation (supports --pr-mode) | `python3 scripts/ci/validate_html_w3c.py [--pr-mode]` |
| `check_internal_links.py` | Validate internal links (warning only) | `python3 scripts/ci/check_internal_links.py` |
| `check_file_naming.py` | Check file naming conventions | `python3 scripts/ci/check_file_naming.py` |

## Claude Skills

**Recommended:** Use the `aws-sap-dev` skill for comprehensive development workflows:

```bash
/skill aws-sap-dev
```

Provides:
- Guided workflows for adding HTML resources and quiz questions
- Data-driven architecture compliance checking
- W3C HTML validation integration
- GitHub Pages deployment workflows
- Templates and troubleshooting guides

**Alternative:** `/skill aws-knowledge-organizer` for legacy workflows

See `.claude/skills/aws-sap-dev/SKILL.md` for detailed documentation.

## Directory Structure

**Content Categories** (aligned with AWS SAP exam domains):
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

*Application Core:*
- `index.html` - Main navigation interface (shell structure)
- `data.js` - **CRITICAL**: Pure data definitions for all content
- `render.js` - Template functions (data → HTML generation)
- `index.js` - UI event handlers (search, scroll, navigation)
- `home.html` - Default homepage content
- `knowledge-base.html` - Alternative table-based navigation
- `table-of-contents.html` - Static reference page (manually maintained)

*Quiz System:*
- `quiz.html` - Interactive quiz application
- `quiz-app.js` - Quiz logic and progress tracking
- `quiz-data-extended.js` - 194 questions across 13 categories

*Development Tools:*
- `server.py` - Local development server with CORS support

*Git Automation:*
- `.git/hooks/pre-commit` - Auto-updates `data.js` lastUpdated field

**Script Duplication Note:** Scripts exist in both `scripts/` (primary) and `.claude/skills/aws-knowledge-organizer/scripts/` (for skill workflow). Keep in sync when modifying.

## Data-Driven Development Rules

When modifying content, **strictly follow** these principles (see `docs/CODING_STANDARDS.md` for details):

1. ✅ **Data as pure objects** - All content in `data.js` as JavaScript objects/arrays (NO HTML tags)
2. ✅ **Single template pattern** - HTML generation in centralized functions (`render.js`)
3. ❌ **No manual HTML editing** - Don't modify structure in `index.html`
4. ⚠️ **Two-place updates** - Always update both `data.js` AND `index.js` when adding resources

## W3C Validation (REQUIRED)

**ALL HTML files must pass W3C validation before committing:**

1. Visit https://validator.w3.org/
2. Upload file or paste content
3. Fix all errors and warnings
4. Ensures accessibility, cross-browser compatibility, and professional quality

See `scripts/accessibility/w3c_validation_guide.md` for detailed guidance.

## Git Hook System

**Auto-updates last modified date** - no action required:
- Pre-commit hook runs `scripts/git_hooks/update_last_modified.py`
- Updates `data.js` lastUpdated field with current commit date
- **Pre-installed**: Hook is already in `.git/hooks/pre-commit` (ready to use)
- Troubleshooting: If hook doesn't execute, run `chmod +x .git/hooks/pre-commit`

**Manual hook installation** (only if missing):
```bash
# Copy hook to .git/hooks/
cp scripts/git_hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Verify hook is executable
ls -la .git/hooks/pre-commit
```

**How the hook works:**
1. Triggered automatically before each `git commit`
2. Extracts latest commit date from git history
3. Updates `lastUpdated` field in `data.js`
4. Auto-stages the updated `data.js` file
5. Proceeds with commit

## CI/CD Pipeline

**Automated quality checks** run on every Pull Request:

**Critical Checks (PR blocked if failed):**
- ✅ Data Integrity Check - Verifies data.js ⟷ index.js synchronization
- ✅ W3C HTML Validation - Modified files only (PR mode)
- ✅ Accessibility Checks - WCAG 2.1 AA color contrast
- ✅ JavaScript Syntax Check - All JS files

**Warning Checks (non-blocking):**
- ⚠️ Internal Links Validation - Broken link detection
- ⚠️ File Naming Convention - Recommended patterns check

**Run checks locally before PR:**
```bash
# Setup (one-time)
uv venv
source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# Run critical checks
python3 scripts/ci/check_data_integrity.py
python3 scripts/ci/validate_html_w3c.py --pr-mode
python3 scripts/accessibility/check_contrast_ratio.py
node -c quiz-data-extended.js data.js render.js index.js
```

**Common CI/CD issues:**
- **Data integrity failed** → Add missing resources to `index.js` searchData array
- **W3C validation failed** → Visit https://validator.w3.org/ for error details
- **JS syntax error** → Check for missing commas, quotes in quiz-data-extended.js

See `docs/CI_CD_GUIDE.md` for comprehensive CI/CD documentation.

## Accessibility Workflows

This repository follows WCAG 2.1 Level AA standards. Use these scripts:

```bash
# Verify color contrast ratios
python3 scripts/accessibility/check_contrast_ratio.py

# Get accessible color suggestions
python3 scripts/accessibility/suggest_color_fixes.py

# Check heading hierarchy (h1→h2→h3)
python3 scripts/accessibility/check_heading_hierarchy.py
```

See `docs/WCAG21_GUIDELINES.md` and `docs/ACCESSIBILITY_AUDIT.md` for comprehensive guidelines.

## Legacy Documentation

**AGENTS.md**: Contains legacy guidelines from earlier repository structure. **Refer to CLAUDE.md (this file) for current workflows.**

**Key differences from AGENTS.md:**
- AGENTS.md predates the data-driven architecture refactor (data.js + render.js + index.js pattern)
- Old workflow suggested direct `index.html` editing - now use `data.js` instead
- Server command was `python -m http.server 8000` - now use `python3 server.py` for CORS support
- Missing CI/CD pipeline documentation and automation scripts

**When to reference AGENTS.md:** Historical context only. All active development should follow CLAUDE.md.

## Detailed Documentation

For in-depth information, consult these comprehensive guides:

### 📐 Architecture & Design
**[@docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**
- Data-driven architecture (data.js + render.js + index.js)
- Navigation system and search functionality
- Quiz system and knowledge base interface
- Design constraints and offline-first philosophy

### 🛠️ Development Workflows
**[@docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)**
- Adding new learning resources (automated and manual)
- Modifying navigation and adding quiz questions
- Automation workflows (breadcrumbs, TOC, bulk integration)
- W3C HTML validation requirements
- Testing checklist and debugging tips

### 🔀 Git Operations
**[@docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)**
- Branching strategy (gh-pages, master, feature branches)
- Commit guidelines and push requirements
- GitHub Pages deployment process
- Development workflows (direct commit vs feature branch)

### 🔄 CI/CD Pipeline
**[@docs/CI_CD_GUIDE.md](docs/CI_CD_GUIDE.md)**
- Automated quality checks on Pull Requests
- Local testing workflows
- Data integrity and W3C validation
- Troubleshooting CI/CD failures

### 📝 Coding Standards
**[@docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)**
- Data-driven development principles (6 critical rules)
- File naming conventions
- CSS, JavaScript, and HTML standards
- WCAG 2.1 AA color palette and accessibility standards

### ♿ Accessibility
**[@docs/WCAG21_GUIDELINES.md](docs/WCAG21_GUIDELINES.md)**
- WCAG 2.1 Level AA compliance guidelines
- Color contrast requirements
- Keyboard navigation and screen reader support

## Quick Reference Card

**Most common mistake:** Forgetting to update both `data.js` AND `index.js` when adding resources

**Testing checklist:**
```bash
python3 server.py                                      # Local test
python3 scripts/ci/check_data_integrity.py             # CI/CD: Data integrity
python3 scripts/ci/validate_html_w3c.py --pr-mode      # CI/CD: W3C validation
python3 scripts/accessibility/check_contrast_ratio.py  # CI/CD: Accessibility
node -c quiz-data-extended.js data.js render.js        # CI/CD: JS syntax
git add . && git commit -m "..." && git push origin gh-pages  # Deploy
```

**Getting help:**
- Architecture questions → `docs/ARCHITECTURE.md`
- Development workflows → `docs/DEVELOPMENT_GUIDE.md`
- Git operations → `docs/GIT_WORKFLOW.md`
- Coding standards → `docs/CODING_STANDARDS.md`
- CI/CD pipeline → `docs/CI_CD_GUIDE.md`
- Claude skills → `/skill aws-sap-dev`
