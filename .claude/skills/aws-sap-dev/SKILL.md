---
name: aws-sap-dev
description: Development and deployment workflows for AWS SAP learning resource repository. Use when working with the AWS SAP study resource repository (https://ssuzuki1063.github.io/aws_sap_studying/) for: (1) Adding new HTML learning resources, (2) Creating quiz questions, (3) Managing data-driven architecture (data.js, index.js updates), (4) W3C HTML validation, (5) GitHub Pages deployment, (6) Running automation scripts (breadcrumbs, TOC, integration). Handles static site constraints (NO backend, NO build process, NO external dependencies). Critical workflow: MUST update TWO places when adding resources (data.js AND index.js).
---

# AWS SAP Learning Resource Development Skill

## Overview

This skill provides guided workflows for developing and deploying learning resources for the AWS Solutions Architect Professional (SAP) exam study repository.

**Live Site:** https://ssuzuki1063.github.io/aws_sap_studying/
**Current Stats:** 120+ HTML resources, 194 quiz questions across 13 categories
**Architecture:** Data-driven (data.js + render.js + index.js)

## Core Workflows

### 1. Adding New HTML Learning Resources (Most Common)

This is the primary workflow for adding new AWS learning content to the repository.

#### Option A: Complete Automated Integration (RECOMMENDED)

**When to use:** When you have new HTML files ready to be categorized and integrated.

**Steps:**

1. **Place HTML files** in `new_html/` directory

2. **Preview complete integration** (dry-run):
   ```bash
   python3 scripts/html_management/integrate_resource_complete.py --dry-run
   ```

3. **Execute complete integration**:
   ```bash
   python3 scripts/html_management/integrate_resource_complete.py
   ```

   This orchestration script automatically runs in sequence:
   - `integrate_new_html.py` - Categorizes and moves files
   - `add_breadcrumbs.py` - Adds breadcrumb navigation
   - `add_toc.py` - Adds page-internal table of contents

4. **CRITICAL: Manual data updates** (TWO places required):

   a. **Update data.js:**
   - Find appropriate category and section
   - Add resource object to `section.resources` array
   - Increment `section.count`
   - Increment `category.count`
   - See [data_structure_guide.md](references/data_structure_guide.md)

   b. **Update index.js:**
   - Add entry to `searchData` array with exact matching title and file path
   - See [data_structure_guide.md](references/data_structure_guide.md)

5. **W3C Validation** (REQUIRED):
   - Visit https://validator.w3.org/
   - Upload or paste HTML content
   - Fix ALL errors and warnings
   - See [validation_checklist.md](references/validation_checklist.md)

6. **Local testing**:
   ```bash
   python3 server.py
   # Visit http://localhost:8080/
   # Verify: navigation shows resource, search finds resource, file loads correctly
   ```

7. **Commit and deploy**:
   ```bash
   git add .
   git commit -m "feat: 新規AWS学習リソースを追加"
   git push origin gh-pages  # GitHub Pages auto-deploys in 1-2 minutes
   ```

8. **Verify deployment**:
   - Wait 1-2 minutes
   - Visit https://ssuzuki1063.github.io/aws_sap_studying/
   - Confirm resource appears and loads correctly

#### Option B: Individual Script Execution (Advanced)

**When to use:** When you need fine-grained control over each step or are debugging issues.

**Steps:**

Run scripts individually in this order:

1. **Categorize and move files:**
   ```bash
   python3 scripts/html_management/integrate_new_html.py --dry-run
   python3 scripts/html_management/integrate_new_html.py
   ```

2. **Add breadcrumbs:**
   ```bash
   python3 scripts/html_management/add_breadcrumbs.py
   ```

3. **Add TOC:**
   ```bash
   python3 scripts/html_management/add_toc.py
   ```

4. **Continue with manual data updates** (same as Option A, steps 4-8)

See [automation_workflow.md](references/automation_workflow.md) for detailed documentation.

#### Option C: Manual Creation

**When to use:** Creating a new HTML resource from scratch.

**Steps:**

1. **Create HTML file** using template:
   - Copy `assets/html_resource_template.html`
   - Follow naming convention: `aws-[service]-[topic].html`
   - Use AWS brand colors (#232F3E, #FF9900)
   - Include inline SVG diagrams (no external images)
   - Ensure offline-capable (no CDNs, no external dependencies)

2. **Place file** in appropriate category directory:
   - Use [category_mappings.md](references/category_mappings.md) to determine correct category
   - Common categories: `networking/`, `security-governance/`, `compute-applications/`, `storage-database/`

3. **W3C Validation** (REQUIRED):
   - Validate at https://validator.w3.org/
   - Fix all errors before proceeding

4. **CRITICAL: Update data structures** (same as Option A, step 4):
   - Update `data.js` (add to resources array, increment counts)
   - Update `index.js` (add to searchData array)
   - See [data_structure_guide.md](references/data_structure_guide.md)

5. **Test, commit, deploy** (same as Option A, steps 6-8)

### 2. Creating Quiz Questions

**When to use:** Adding new quiz questions to quiz-data-extended.js.

**Steps:**

1. **Choose category:**
   - networking, security-governance, compute-applications, content-delivery-dns, development-deployment, storage-database, migration-transfer, analytics-operations, organizational-complexity, continuous-improvement, cost-control, new-solutions, comprehensive
   - See [category_mappings.md](references/category_mappings.md)

2. **Create question** following structure:
   ```javascript
   {
     id: 'service-topic-year',  // e.g., 'lambda-concurrency-2024'
     question: 'Question text in Japanese',
     options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
     correct: 0,  // Index 0-3
     explanation: 'Detailed explanation in Japanese (2-4 sentences)'
   }
   ```
   - See [quiz_question_template.md](references/quiz_question_template.md) for detailed guidelines

3. **Add to quiz-data-extended.js:**
   - Locate appropriate category object
   - Add question to category's `questions` array

4. **Syntax validation**:
   ```bash
   node -c quiz-data-extended.js
   # No output = success
   ```

5. **UI testing**:
   ```bash
   python3 server.py
   # Visit http://localhost:8080/quiz.html
   # Select category and verify question displays correctly
   ```

6. **Commit and deploy**:
   ```bash
   git add quiz-data-extended.js
   git commit -m "feat: [category]カテゴリに新規クイズ問題を追加"
   git push origin gh-pages
   ```

### 3. Running Automation Scripts

#### Complete Integration Workflow (Recommended)

Use the orchestration script for streamlined integration:

```bash
# Preview complete workflow
python3 scripts/html_management/integrate_resource_complete.py --dry-run

# Execute complete workflow
python3 scripts/html_management/integrate_resource_complete.py

# Custom source directory
python3 scripts/html_management/integrate_resource_complete.py --source custom_html/

# Verbose output for debugging
python3 scripts/html_management/integrate_resource_complete.py --verbose
```

This chains: `integrate_new_html.py` → `add_breadcrumbs.py` → `add_toc.py`

See [automation_workflow.md](references/automation_workflow.md) for comprehensive documentation.

#### Individual Script Usage

For fine-grained control, run scripts separately:

**Breadcrumb Management:**
```bash
python3 scripts/html_management/add_breadcrumbs.py
```

Adds breadcrumb navigation (Home > Category > SubCategory) to all HTML files.

**TOC Management:**
```bash
# Preview changes
python3 scripts/html_management/add_toc.py --dry-run

# Execute
python3 scripts/html_management/add_toc.py

# Custom directory
python3 scripts/html_management/add_toc.py --dir /path/to/directory
```

Generates page-internal collapsible table of contents from h2/h3 headings.

**Quiz Statistics:**
```bash
python3 scripts/quiz_management/analyze_quiz.py
```

Displays question count per category and balance analysis.

### 4. Data-Driven Architecture Compliance

**Critical Rules:**

When adding resources, you MUST update TWO places:

1. **data.js** - Add to `section.resources` array and update counts
2. **index.js** - Add to `searchData` array

Without both updates:
- Missing data.js update = Resource won't appear in navigation
- Missing index.js update = Resource won't appear in search
- Missing count updates = Counts will be incorrect

**Verification:**

After any data structure changes:
```bash
# Test locally
python3 server.py

# Verify:
# 1. Resource appears in navigation sidebar
# 2. Category count displays correctly
# 3. Clicking resource loads HTML file
# 4. Searching for resource finds it
# 5. Clicking search result loads HTML file
```

See [data_structure_guide.md](references/data_structure_guide.md) for complete reference.

### 5. W3C HTML Validation Workflow

**Why Required:**
- Standards compliance
- Cross-browser compatibility
- Accessibility (screen readers)
- SEO benefits
- Professional quality

**Process:**

1. **Visit validator:** https://validator.w3.org/

2. **Validate:**
   - Upload file, OR
   - Paste HTML content, OR
   - Enter deployed URL

3. **Fix errors:**
   - Unclosed tags
   - Mismatched tags
   - Missing required attributes (especially `alt` on images)
   - Duplicate IDs
   - Invalid nesting

4. **Fix warnings:**
   - Missing `lang="ja"` on `<html>`
   - Empty heading tags
   - Obsolete attributes
   - Missing alt text on images

5. **Re-validate** until clean (no errors)

See [validation_checklist.md](references/validation_checklist.md) for detailed checklist.

### 6. GitHub Pages Deployment

**Deployment Flow:**

```
git push origin gh-pages → GitHub detects changes → Auto-deploy (1-2 min) → Live site updated
```

**Steps:**

1. **Test locally first:**
   ```bash
   python3 server.py
   # Verify everything works at http://localhost:8080/
   ```

2. **W3C validate** all modified HTML files

3. **Commit with descriptive message:**
   ```bash
   git add .
   git commit -m "feat: descriptive message"
   # Commit message formats:
   # - feat: for new features/resources
   # - fix: for bug fixes
   # - docs: for documentation
   # - refactor: for code restructuring
   ```

4. **Push to gh-pages** (CRITICAL):
   ```bash
   git push origin gh-pages
   ```

5. **Verify deployment:**
   ```bash
   # Wait 1-2 minutes, then visit:
   # https://ssuzuki1063.github.io/aws_sap_studying/
   ```

**Important Notes:**

- **Immediate deployment:** Changes to `gh-pages` branch deploy automatically
- **No build process:** Static files served directly
- **Test before pushing:** Changes go live immediately

## Repository Constraints

### Static Site Architecture

**CRITICAL:** This is a fully static website.

**NO:**
- ❌ Backend server
- ❌ Database
- ❌ Build process
- ❌ Node.js/npm
- ❌ External dependencies
- ❌ CDNs

**YES:**
- ✅ Pure HTML/CSS/JavaScript
- ✅ All resources inline or local
- ✅ Works completely offline
- ✅ Instant deployment (no build step)

### Development Server

`python3 server.py` is ONLY for local development with CORS support. The deployed site on GitHub Pages serves static files directly.

## Common Tasks Quick Reference

**Add new HTML resource:**
1. Place in `new_html/` → 2. Run `integrate_new_html.py` → 3. Update data.js AND index.js → 4. W3C validate → 5. Test locally → 6. Commit and push

**Add quiz question:**
1. Choose category → 2. Create question in quiz-data-extended.js → 3. Syntax check: `node -c quiz-data-extended.js` → 4. Test in quiz.html → 5. Commit and push

**Deploy changes:**
1. Test locally → 2. W3C validate → 3. Commit → 4. `git push origin gh-pages` → 5. Verify after 1-2 min

## Troubleshooting

**Resource not in navigation:**
- Check: Did you update data.js resources array and counts?

**Resource not in search:**
- Check: Did you update index.js searchData array?

**Deployment not live:**
- Check: Did you push to gh-pages branch?
- Wait: GitHub Pages takes 1-2 minutes to deploy
- Cache: Hard refresh browser (Ctrl+Shift+R)

**Quiz not loading:**
- Check: Run `node -c quiz-data-extended.js` for syntax errors
- Common issue: Trailing commas, missing commas, mismatched brackets

## Reference Files

- **[data_structure_guide.md](references/data_structure_guide.md)** - Complete guide to data.js and index.js structures
- **[quiz_question_template.md](references/quiz_question_template.md)** - Quiz question format and guidelines
- **[validation_checklist.md](references/validation_checklist.md)** - W3C validation and deployment checklist
- **[category_mappings.md](references/category_mappings.md)** - AWS service to category mappings

## Assets

- **[html_resource_template.html](assets/html_resource_template.html)** - Template for new HTML learning resources
