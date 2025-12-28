# Development Guide

This document provides detailed development workflows and best practices for the AWS SAP study resource repository.

## Development Commands

### Local Development Server

```bash
python3 server.py
```

- Starts a local HTTP server on port 8080 with CORS headers for development
- Server serves content from repository root with cache-disabled headers
- Access the application at `http://localhost:8080/`
- **Note**: `server.py` has hardcoded path `/home/suzuki100603/aws_sap` - update if repository location changes

### File Operations

- No build process required - all content is static HTML/CSS/JavaScript
- No package managers or dependencies - self-contained learning resources
- Preview changes by opening `index.html` directly in browser or using the Python server
- For local file access, use Python server to avoid CORS restrictions with iframes

## Working with Content

### Adding New Learning Resources

**IMPORTANT**: There are two workflows for adding new resources - automated (recommended) and manual:

#### Option 1: Automated Integration (Recommended)

Use the `scripts/html_management/integrate_new_html.py` script to automatically categorize and integrate new HTML files:

1. Place new HTML files in `new_html/` directory
2. Run integration script:
   ```bash
   # Dry run to preview changes
   python3 scripts/html_management/integrate_new_html.py --dry-run

   # Execute integration
   python3 scripts/html_management/integrate_new_html.py
   ```
3. The script will:
   - Analyze HTML title and content to determine appropriate category
   - Move file to correct directory (e.g., `networking/`, `security-governance/`)
   - Update `index.html` navigation sidebar automatically
   - Update resource counts for affected categories
   - Remove Zone.Identifier files from Windows downloads
4. **W3C Validation (REQUIRED)**: Validate all modified HTML files
   - Visit https://validator.w3.org/
   - Upload or paste HTML content to check for errors and warnings
   - Fix all errors and warnings before proceeding
5. Review changes and commit to git
6. Test via local server: `python3 server.py`

**Script features:**
- AI-powered keyword detection for smart categorization
- Automatic section detection based on AWS service keywords
- Handles multiple files in batch
- Safe dry-run mode to preview changes

#### Option 2: Manual Integration

If you prefer manual control or the script categorizes incorrectly:

1. Create HTML file following naming conventions:
   - Preferred: `aws-[service]-[topic].html` (e.g., `aws-lambda-metrics.html`)
   - Alternative: `[service]_[topic]_infographic.html` (e.g., `ecs_infographic.html`)
2. Use consistent CSS styling with AWS brand colors (#232F3E, #FF9900)
3. Include inline SVG diagrams for visual explanations
4. **W3C Validation (REQUIRED)**: Validate the HTML file
   - Visit https://validator.w3.org/
   - Upload or paste HTML content to check for errors and warnings
   - Fix all errors and warnings before integration
5. **Manually update `table-of-contents.html`**: This is a static reference page that should be kept in sync
6. Place file in appropriate topical directory matching AWS SAP exam domains
7. Ensure content is self-contained with inline CSS and SVG for offline use
8. Test loading via local server to verify paths and functionality

**Note**: The automated script updates `index.html` but NOT `table-of-contents.html`. Keep the TOC page in sync manually if using automation.

**CRITICAL**: After using the automated script OR manual integration, you MUST also manually update:
1. **`data.js`** - Add resource to appropriate `section.resources` array and update counts
2. **`index.js`** - Add resource to `searchData` array (required for search functionality)

Without these updates, the resource won't appear in the navigation or search results on the main page.

### Modifying Navigation

**Current Architecture (Data-Driven):**
- **Primary method**: Update `data.js` to modify categories, sections, and resources
- **Search**: Update `searchData` array in `index.js` when adding/removing resources
- **Rendering**: The `render.js` functions automatically generate HTML from data

**Legacy Information (Pre-2025 Refactor):**
- Old method was to directly edit `index.html` sidebar structure
- This is no longer recommended - use `data.js` instead
- `index.html` now only contains the shell structure

**When modifying navigation:**
1. Edit `data.js` to add/remove/reorganize categories and resources
2. Update `index.js` `searchData` array for search functionality
3. Ensure category organization aligns with AWS SAP exam domains
4. Test with `python3 server.py` to verify navigation and search work
5. Test mobile responsiveness after navigation changes

### Adding Quiz Questions

1. Edit `quiz-data-extended.js` and add to appropriate category
2. Follow the exact structure shown in Architecture section
3. Category keys must match HTML class names (e.g., 'networking', 'security-governance')
4. Each question requires:
   - Unique `id` field
   - `question` text (Japanese)
   - Array of 4 `options`
   - `correct` answer index (0-3)
   - Detailed `explanation` text
5. Question count automatically calculated by `getTotalQuestions()` function

## Automation Workflows

### Breadcrumb Management

Add or remove breadcrumb navigation across all HTML files:

```bash
# Add breadcrumbs to all HTML files
python3 scripts/html_management/add_breadcrumbs.py

# Remove breadcrumbs from all HTML files
python3 scripts/html_management/remove_breadcrumbs.py
```

The breadcrumb scripts automatically:
- Detect category from file path
- Map to appropriate major/minor category names
- Insert breadcrumb navigation HTML at the top of each file
- Maintain consistent styling across all pages

### Page-Internal Table of Contents (TOC) Management

Add or update page-internal table of contents across all HTML files:

```bash
# Preview changes without applying (recommended first step)
python3 scripts/html_management/add_toc.py --dry-run

# Add/update TOC in all HTML files
python3 scripts/html_management/add_toc.py

# Use custom directory
python3 scripts/html_management/add_toc.py --dir /path/to/directory
```

The TOC script automatically:
- Extracts h2 and h3 headings from each HTML file
- Generates unique IDs for headings (preserves existing IDs if present)
- Creates collapsible table of contents with smooth scroll navigation
- Inserts TOC after breadcrumb navigation or first h1 tag
- Skips files with fewer than 2 headings
- Excludes index.html, table-of-contents.html, quiz.html, and home.html
- Updates existing TOC if script is run again (idempotent operation)

### Bulk HTML Integration

The `scripts/html_management/integrate_new_html.py` script provides powerful automation:

```bash
# Preview what would happen (no changes made)
python3 scripts/html_management/integrate_new_html.py --dry-run

# Integrate files from new_html/ directory
python3 scripts/html_management/integrate_new_html.py

# Use custom source directory
python3 scripts/html_management/integrate_new_html.py --source custom_directory/
```

**Categorization Algorithm:**
- Scans HTML title and H1 tags for keywords
- Matches against predefined AWS service keyword mappings
- Scores each category based on keyword matches
- Selects best-fit category automatically
- Defaults to `compute-applications` if no strong match

**Keyword mappings** (defined in script):
- `security-governance`: IAM, Cognito, SCP, Organizations, KMS, CMK, WAF, Shield
- `compute-applications`: EC2, Lambda, ECS, Auto Scaling, ALB, SQS, SNS, Patch Manager
- `networking`: VPC, Direct Connect, VPN, Transit Gateway, PrivateLink, ENI
- `storage-database`: S3, EBS, EFS, RDS, Aurora, DynamoDB, ElastiCache
- `development-deployment`: CloudFormation, CDK, SAM, CodePipeline, EventBridge, API Gateway
- And more (see script for complete mappings)

### File Organization

- When reorganizing files, search `index.html` for all references (sidebar + search data)
- Maintain logical grouping by AWS service domains
- Remove `.html:Zone.Identifier` files that appear from Windows downloads (automated by `scripts/html_management/integrate_new_html.py`)
- Some files may have duplicates across directories (e.g., `new-solutions/` and domain-specific folders)
- Use `table-of-contents.html` as static reference - it's NOT automatically updated by scripts

## HTML Quality Assurance

**W3C Validation is REQUIRED for all HTML files** - This ensures code quality, accessibility, and cross-browser compatibility.

### Why W3C Validation Matters

1. **Standards Compliance**: Ensures HTML follows official W3C standards
2. **Cross-browser Compatibility**: Valid HTML works consistently across all browsers
3. **Accessibility**: Proper HTML structure is essential for screen readers and assistive technologies
4. **SEO Benefits**: Search engines favor well-structured, valid HTML
5. **Maintainability**: Valid code is easier to debug and maintain
6. **Professional Quality**: Demonstrates commitment to web development best practices

### How to Validate HTML Files

**Official W3C Validator**: https://validator.w3.org/

**Validation Methods:**

1. **Upload File** (Recommended for new files)
   - Go to https://validator.w3.org/
   - Click "Validate by File Upload" tab
   - Select your HTML file
   - Click "Check" button
   - Review errors and warnings

2. **Direct Input** (Good for quick checks)
   - Go to https://validator.w3.org/
   - Click "Validate by Direct Input" tab
   - Copy and paste your HTML content
   - Click "Check" button
   - Review errors and warnings

3. **URL Validation** (For deployed pages)
   - Go to https://validator.w3.org/
   - Enter the full URL: `https://ssuzuki1063.github.io/aws_sap_studying/[path]/[filename].html`
   - Click "Check" button
   - Review errors and warnings

### Common HTML Validation Issues to Watch For

**Critical Errors (MUST FIX):**
- Unclosed tags (missing closing tags like `</div>`, `</section>`)
- Mismatched tags (opening `<div>` but closing `</span>`)
- Missing required attributes (e.g., `alt` attribute on `<img>` tags)
- Duplicate IDs (ID attributes must be unique within a page)
- Invalid nesting (e.g., `<p>` inside another `<p>`)
- Missing DOCTYPE declaration

**Warnings (SHOULD FIX):**
- Missing `lang` attribute on `<html>` tag
- Empty heading tags (`<h1></h1>`)
- Obsolete attributes or elements
- Missing `alt` text on images
- Consecutive heading levels skipped (e.g., `<h1>` directly to `<h3>`)

### Validation Workflow

**When creating new HTML files:**
```bash
# 1. Create HTML file
# 2. Validate at https://validator.w3.org/ (upload file or paste content)
# 3. Fix all errors and warnings
# 4. Re-validate until clean (no errors)
# 5. Proceed with integration workflow
```

**When modifying existing HTML files:**
```bash
# 1. Make modifications
# 2. Validate modified file at https://validator.w3.org/
# 3. Fix any new errors introduced by changes
# 4. Re-validate until clean
# 5. Test locally with python3 server.py
# 6. Commit and push
```

### Integration with Development Workflow

W3C validation is integrated into all HTML workflows:
- **Quick Start Workflow**: Step 5 (before commit)
- **Automated Integration**: Step 4 (after script execution)
- **Manual Integration**: Step 4 (before placing in directory)
- **Testing Checklist**: Third item in HTML Learning Resources section

**CRITICAL**: Do not skip W3C validation. Invalid HTML can cause:
- Rendering issues in different browsers
- Accessibility problems for users with disabilities
- SEO penalties
- Maintenance headaches
- Unprofessional appearance

### Tips for Efficient Validation

1. **Validate early and often** - Don't wait until the end
2. **Use HTML5 DOCTYPE** - `<!DOCTYPE html>`
3. **Include language attribute** - `<html lang="ja">` for Japanese content
4. **Use semantic HTML** - `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
5. **Always include alt text** - Essential for accessibility
6. **Check for typos** - Misspelled tag names cause errors
7. **Validate SVG separately** - Inline SVG should also be valid
8. **Test in multiple browsers** - Even valid HTML can have browser quirks

## Common Maintenance Tasks

### Testing the Application

1. Start local server: `python3 server.py`
2. Open browser to `http://localhost:8080/`
3. Test navigation: Click through categories to verify all links work
4. Test search: Search for resources to verify search data is current
5. Test mobile: Use browser dev tools to test responsive design
6. Test quiz: Click "理解度クイズ" to verify quiz functionality

### Testing Checklist for New Resources

When adding new learning resources or quiz questions, verify:

**HTML Learning Resources:**
- [ ] File placed in correct category directory
- [ ] File follows naming convention: `aws-[service]-[topic].html`
- [ ] **W3C Validation passed**: All HTML validated at https://validator.w3.org/ with no errors
- [ ] Breadcrumb navigation present and working
- [ ] Page-internal TOC generated (if 2+ headings)
- [ ] SVG diagrams are inline (not external links)
- [ ] CSS uses AWS brand colors (#232F3E, #FF9900)
- [ ] Content loads correctly in iframe
- [ ] Mobile responsive (test at 768px and 1024px breakpoints)
- [ ] **CRITICAL**: Added to `data.js` (section.resources array and updated counts)
- [ ] **CRITICAL**: Added to `searchData` array in `index.js`
- [ ] Resource appears in navigation on index.html
- [ ] Search functionality finds the resource
- [ ] No external dependencies (CDNs, external CSS/JS)
- [ ] All links work correctly

**Quiz Questions:**
- [ ] Added to correct category in `quiz-data-extended.js`
- [ ] Unique `id` field (format: `[service]-[topic]-[year]`)
- [ ] Question text clear and specific
- [ ] Exactly 4 options provided
- [ ] `correct` index is 0-3
- [ ] Explanation is comprehensive (2-4 sentences)
- [ ] No syntax errors: `node -c quiz-data-extended.js`
- [ ] Question displays correctly in quiz UI
- [ ] All options display without truncation
- [ ] Explanation shows after answer selection

**Final Steps:**
- [ ] Tested locally with `python3 server.py`
- [ ] Git commit with descriptive message
- [ ] Pushed to `gh-pages` branch
- [ ] Verified on GitHub Pages site

### Debugging Content Loading Issues

- Check browser console for 404 errors indicating missing files
- Verify file paths in `index.html` match actual file locations
- Ensure iframe sandbox permissions are correct: `sandbox = 'allow-same-origin allow-scripts allow-forms'`
- Test with Python server to avoid CORS issues
- If content doesn't display, check iframe `onerror` and `onload` handlers in `loadContent()` function
- Verify search functionality by checking `searchData` array includes new resources

## Analyzing Quiz Statistics

```bash
# View quiz statistics and category distribution
python3 scripts/quiz_management/analyze_quiz.py
```

This displays:
- Question count per category
- Total questions and categories
- Category balance analysis
- Min/max questions by category
