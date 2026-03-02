---
name: aws-knowledge-organizer
description: Organize and manage AWS SAP exam study resources. Use when adding new AWS learning materials, creating quiz questions, reorganizing content by categories, or automating bulk operations like breadcrumb navigation or table of contents generation. Includes automation scripts, category classification references, and templates for HTML resources and quiz questions.
---

# AWS Knowledge Organizer

## Overview

This skill provides tools and workflows for managing a comprehensive AWS Solutions Architect Professional (SAP) exam study resource repository. The repository serves as a static HTML-based learning platform with infographics, technical diagrams, and detailed explanations organized into AWS SAP exam domain categories.

Use this skill when:
- Adding new AWS learning resources (HTML files with service documentation, diagrams, or guides)
- Creating or updating quiz questions for exam preparation
- Reorganizing or consolidating existing resources across categories
- Automating bulk operations (breadcrumbs, table of contents, file categorization)
- Understanding the repository's category structure and classification system

## Repository Architecture

The repository is a fully static website with NO backend, NO build process, and NO external dependencies. All content is offline-capable HTML/CSS/JavaScript.

**Key files:**
- `index.html` - Main navigation interface with collapsible sidebar and search
- `quiz.html` + `quiz-data-extended.js` - Interactive quiz system
- `table-of-contents.html` - Static reference page (manually maintained)
- Category directories: `networking/`, `security-governance/`, `compute-applications/`, etc.

**Navigation system:**
- Dynamic content loading via iframe injection
- Client-side search across all resources
- Category accordion with single-expand behavior
- Mobile-responsive with hamburger menu

## Core Tasks

### Task 1: Adding New AWS Learning Resources

The recommended workflow uses automation for categorization and integration:

#### Automated Integration (Recommended)

1. Place new HTML files in the `new_html/` directory
2. Run dry-run to preview categorization:
   ```bash
   python3 scripts/integrate_new_html.py --dry-run
   ```
3. Execute integration:
   ```bash
   python3 scripts/integrate_new_html.py
   ```
   This script will:
   - Analyze HTML title and content for AWS service keywords
   - Determine appropriate category using keyword scoring
   - Move file to correct directory (e.g., `networking/`, `security-governance/`)
   - Update `index.html` sidebar navigation automatically
   - Update resource counts
   - Remove Zone.Identifier files from Windows downloads

4. Test locally:
   ```bash
   python3 server.py
   # Visit http://localhost:8080/
   ```

5. Commit changes:
   ```bash
   git add .
   git commit -m "feat: 新規AWS学習リソースを追加"
   git push origin gh-pages
   ```

**Important:** The script updates `index.html` sidebar automatically, but does NOT update the `searchData` array. Manually add new resources to the search data in `index.html`.

#### Manual Integration (When Automation Categorizes Incorrectly)

1. Create HTML file following naming conventions:
   - Preferred: `aws-[service]-[topic].html`
   - Alternative: `[service]_[topic]_infographic.html`

2. Use the HTML template from `assets/html-template.html` as a starting point

3. Place file in appropriate category directory (see `references/categories.md` for classification criteria)

4. Manually update `index.html`:
   - Add resource to sidebar under correct category
   - Add entry to `searchData` array for search functionality

5. Test and commit

#### Categorization System

The repository organizes content into 9 categories aligned with AWS SAP exam domains. Consult `references/categories.md` for:
- Complete category list with directory names
- AWS service to category keyword mappings
- Categorization algorithm details
- Adding new categories

### Task 2: Creating Quiz Questions

Quiz questions are stored in `quiz-data-extended.js` with category-based organization.

#### Adding Questions

1. Open `quiz-data-extended.js` in the repository root

2. Locate the appropriate category object (see `references/quiz-structure.md` for category keys)

3. Use the template from `assets/quiz-question-template.js`:
   ```javascript
   {
     id: '[service]-[topic]-[year]',
     question: '[問題文]',
     options: [
       '[選択肢1]',
       '[選択肢2]',
       '[選択肢3]',
       '[選択肢4]'
     ],
     correct: 0,  // Index 0-3
     explanation: '[詳細な解説]'
   }
   ```

4. Ensure unique `id` across all categories (format: `[service]-[topic]-[year]`)

5. Write clear, scenario-based questions in Japanese

6. Provide exactly 4 plausible options

7. Write comprehensive explanations (2-4 sentences) covering:
   - Why the correct answer is right
   - Why other options are wrong or suboptimal
   - Relevant AWS best practices or documentation concepts

8. Test in browser at `/quiz.html`

9. Commit changes

#### Quiz Best Practices

Consult `references/quiz-structure.md` for:
- Detailed question object structure
- Question ID conventions
- Category keys and helper functions
- Question writing best practices with examples
- Validation checklist

### Task 3: Reorganizing and Consolidating Resources

When resources are duplicated or miscategorized:

1. **Analyze current state:**
   - Search for duplicate content: `grep -r "[keyword]" .`
   - Identify miscategorized files
   - Review category distribution

2. **Plan reorganization:**
   - Decide on consolidation strategy
   - Identify target directories
   - Map files to new locations

3. **Execute moves:**
   ```bash
   git mv old-location/file.html new-location/file.html
   ```

4. **Update navigation:**
   - Edit `index.html` sidebar structure
   - Update `searchData` array with new paths
   - Update `table-of-contents.html` manually

5. **Test and commit:**
   ```bash
   python3 server.py
   # Test navigation and search
   git add .
   git commit -m "refactor: リソース構成を最適化"
   git push origin gh-pages
   ```

### Task 4: Bulk Automation Operations

The skill includes scripts for common bulk operations:

#### Add Breadcrumb Navigation to All Pages

```bash
python3 scripts/add_breadcrumbs.py
```

Automatically adds breadcrumb navigation (Home > Major Category > Sub Category) to all HTML learning resource pages with consistent AWS brand styling.

#### Remove Breadcrumb Navigation

```bash
python3 scripts/remove_breadcrumbs.py
```

Removes breadcrumb navigation from all pages.

#### Add Page-Internal Table of Contents

```bash
# Preview changes first (recommended)
python3 scripts/add_toc.py --dry-run

# Apply to all pages
python3 scripts/add_toc.py

# Use custom directory
python3 scripts/add_toc.py --dir /path/to/directory
```

Automatically generates collapsible table of contents from h2 and h3 headings. Features:
- Default state: collapsed (folded)
- Right-aligned positioning on desktop
- Smooth scroll navigation
- Automatic heading ID generation
- Skips pages with fewer than 2 headings

## Design Constraints

**Critical:** This is a fully static website with specific constraints:

- **No Node.js/npm**: No package managers, no build process
- **No external dependencies**: All CSS/JS must be inline or in local files
- **No CDNs**: No loading from external URLs for offline capability
- **Pure HTML/CSS/JavaScript**: Everything runs client-side
- **Python server is for development only**: `server.py` provides local CORS support for testing

All new content must adhere to these constraints for offline capability.

## File Organization Patterns

**HTML naming:**
- Preferred: `aws-[service]-[topic].html` (e.g., `aws-lambda-metrics.html`)
- Alternative: `[service]_[topic]_infographic.html`
- Use lowercase with hyphens
- Be descriptive for search discoverability

**Git operations:**
- Commit all feature additions and modifications immediately
- Use commit message prefixes: `feat:`, `fix:`, `refactor:`, `docs:`
- Always push to `gh-pages` branch (GitHub Pages deployment)

**CSS styling:**
- Use AWS brand colors: `#232F3E` (dark blue), `#FF9900` (orange)
- Inline CSS in HTML files for offline capability
- Responsive design with mobile breakpoints at 768px and 1024px

## Resources

### scripts/

Contains automation scripts for bulk operations and resource integration:

- `integrate_new_html.py` - AI-powered HTML categorization and integration
- `add_breadcrumbs.py` - Bulk breadcrumb navigation insertion
- `remove_breadcrumbs.py` - Bulk breadcrumb navigation removal
- `add_toc.py` - Page-internal table of contents generation

All scripts can be executed directly without loading into context. Use `--dry-run` flags where available to preview changes safely.

### references/

Documentation and reference material for category classification and quiz structure:

- `categories.md` - AWS SAP category classification system, service keyword mappings, and categorization algorithm details
- `quiz-structure.md` - Complete quiz data structure documentation, question object specifications, best practices, and validation checklist

Load these references when making classification decisions or creating quiz content.

### assets/

Templates for creating new content:

- `html-template.html` - Complete HTML template for AWS learning resources with AWS brand styling, breadcrumb navigation, info boxes, code blocks, and SVG diagram placeholders
- `quiz-question-template.js` - Quiz question template with example questions, checklist, and category keys

Copy and customize these templates when creating new resources or quiz questions.

## Common Workflows

### Workflow: "Add a new AWS Direct Connect learning resource"

1. Create HTML file using `assets/html-template.html` or obtain existing HTML
2. Save to `new_html/aws-direct-connect-[topic].html`
3. Run `python3 scripts/integrate_new_html.py --dry-run` to preview
4. Execute `python3 scripts/integrate_new_html.py` (likely categorizes to `networking/`)
5. Update `searchData` array in `index.html` manually
6. Test with `python3 server.py`
7. Commit and push to `gh-pages`

### Workflow: "Create 5 new S3 quiz questions"

1. Review S3 documentation and AWS SAP exam topics
2. Open `quiz-data-extended.js`
3. Navigate to `storage-database` category
4. Use template from `assets/quiz-question-template.js`
5. Create 5 questions with unique IDs (e.g., `s3-storage-class-2024`)
6. Ensure varied correct answer positions (not all option 0)
7. Write detailed explanations covering why each answer is correct/incorrect
8. Test at `/quiz.html`
9. Commit changes

### Workflow: "Reorganize all Route 53 resources into content-delivery-dns category"

1. Search for Route 53 files: `grep -r "Route53" . --include="*.html"`
2. Identify files in wrong categories
3. Move files: `git mv old-dir/route53-file.html content-delivery-dns/`
4. Update `index.html` sidebar navigation
5. Update `searchData` array with new paths
6. Update `table-of-contents.html` manually
7. Test navigation and search
8. Commit with message: `refactor: Route53リソースをcontent-delivery-dnsに統合`

## Troubleshooting

**Problem: New resource doesn't appear in navigation**
- Check file path is correct
- Verify `index.html` sidebar includes the resource
- Ensure category section exists in sidebar
- Clear browser cache and reload

**Problem: Search doesn't find new resource**
- Verify `searchData` array in `index.html` includes the resource
- Check `title`, `category`, and `file` properties are correct
- Ensure file path matches actual location

**Problem: Quiz questions don't display**
- Check `quiz-data-extended.js` for syntax errors (browser console)
- Verify `id` is unique (search for duplicates)
- Ensure `correct` index is 0-3
- Confirm category key matches existing categories

**Problem: Automated categorization is incorrect**
- Use manual integration workflow instead
- Update `CATEGORY_KEYWORDS` in `integrate_new_html.py` for better future matching
- Move file to correct directory with `git mv`
- Update `index.html` accordingly
