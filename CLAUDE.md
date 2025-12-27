# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AWS SAP (Solutions Architect Professional) exam study resource repository containing HTML-based learning materials. The repository serves as a comprehensive visual learning platform with infographics, technical diagrams, and detailed explanations of AWS services and concepts.

**Live Site**: https://ssuzuki1063.github.io/aws_sap_studying/
**Current Stats**: 120+ HTML learning resources, 194 quiz questions across 13 categories

## Quick Start Workflows

### Adding New HTML Learning Resources (Most Common Task)
```bash
# 1. Place HTML files in new_html/ directory

# 2. Preview integration
python3 scripts/html_management/integrate_new_html.py --dry-run

# 3. Execute integration (moves files, updates index.html automatically)
python3 scripts/html_management/integrate_new_html.py

# 4. Test locally
python3 server.py
# Visit http://localhost:8080/

# 5. W3C Validation (REQUIRED)
# Validate all modified HTML files
# Visit https://validator.w3.org/
# Upload or paste HTML content to check for errors and warnings
# Fix all errors before committing

# 6. Commit and deploy to GitHub Pages
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages

# 7. Verify deployment (wait 1-2 minutes)
# Visit https://ssuzuki1063.github.io/aws_sap_studying/
# GitHub Pagesが自動的にgh-pagesブランチの変更を検出してウェブページを更新します
```

### Local Development & Testing
```bash
# Start development server
python3 server.py

# Access at http://localhost:8080/
# - Test navigation and search
# - Verify new resources load correctly
# - Check mobile responsiveness
```

### Adding Quiz Questions
Edit `quiz-data-extended.js` and add questions to appropriate category object. Question count updates automatically.

### Analyzing Quiz Statistics
```bash
# View quiz statistics and category distribution
python3 scripts/quiz_management/analyze_quiz.py
```
This displays:
- Question count per category
- Total questions and categories
- Category balance analysis
- Min/max questions by category

### Using Claude Skills
This repository includes a custom Claude skill for specialized workflows:

```bash
# Activate the aws-knowledge-organizer skill
/skill aws-knowledge-organizer
```

The skill provides guided workflows for:
- Adding new AWS learning resources with automated categorization
- Creating quiz questions with templates and validation
- Reorganizing content across categories
- Bulk automation operations

See `.claude/skills/aws-knowledge-organizer/SKILL.md` for detailed documentation.

## Directory Structure

The repository is organized into topical categories aligned with AWS SAP exam domains:

- `networking/` - Networking services (Direct Connect, Transit Gateway, VPN, PrivateLink, EIP/NAT)
- `security-governance/` - Security and governance services (SCP, IAM, WAF, Tag Policies, Cognito, CMK)
- `compute-applications/` - Compute and application services (EC2, Lambda, ECS, EFA, Auto Scaling, ALB)
- `content-delivery-dns/` - Content delivery and DNS services (CloudFront, Route53, Global Accelerator)
- `development-deployment/` - Development and deployment services (CloudFormation, Service Catalog, CDK, SAM, EventBridge, API Gateway)
- `storage-database/` - Storage and database services (S3, EBS, EFS, RDS Aurora, ElastiCache, MSK, S3 security)
- `migration/` - Migration services (DMS, Migration Hub, DR strategies, Blue/Green deployments, migration planning)
- `analytics-bigdata/` - Analytics and operational services (Kinesis, Kinesis Firehose, Redshift, cost tools, metrics, availability, data pipelines)
- `organizational-complexity/` - Multi-account and organizational management (RAM, SCP, tag policies, Service Catalog)
- `continuous-improvement/` - Operational excellence resources (Systems Manager, CodeDeploy, CloudTrail, WAF, CDK)
- `cost-control/` - Cost optimization resources (S3 storage classes, Lambda concurrency)
- `new-solutions/` - Newly added solution architectures and patterns

### Key Files
- `index.html` - Main navigation interface with collapsible sidebar, search, and category-based navigation
- `home.html` - Default homepage content loaded on initial page load
- `table-of-contents.html` - Comprehensive table of contents for all resources (static reference page)
- `quiz.html` - Interactive quiz application for exam preparation
- `quiz-app.js` - Quiz application logic
- `quiz-data-extended.js` - Quiz question database (194 questions across 13 categories)
- `server.py` - Development server with CORS support
- `main.js` - Additional utility functions (verify usage before modifying)
- `scripts/html_management/add_breadcrumbs.py` - Utility script to add breadcrumb navigation to all HTML files
- `scripts/html_management/remove_breadcrumbs.py` - Utility script to remove breadcrumb navigation from HTML files
- `scripts/html_management/add_toc.py` - Utility script to add page-internal table of contents to all HTML files
- `scripts/html_management/integrate_new_html.py` - **IMPORTANT**: Automated integration script for new HTML files (see Automation Workflows section)
- `scripts/quiz_management/analyze_quiz.py` - Quiz statistics and analysis tool

## Architecture

### Navigation System
- `index.html` serves as the main entry point with a collapsible sidebar navigation
- Each category in the sidebar dynamically loads HTML content using iframe injection
- JavaScript functions handle category expansion/collapse and content loading

### Content Structure
- Each HTML file is a self-contained learning module with:
  - Embedded SVG diagrams and technical illustrations
  - Step-by-step explanations with numbered sections
  - AWS CLI examples and code snippets
  - Responsive CSS using AWS brand colors (#232F3E, #FF9900)
  - Japanese language content optimized for Japanese learners

**Important Architecture Note:**
This is NOT a typical table-of-contents.html based static site. The repository has two different navigation systems:
1. **`index.html`** - Main dynamic navigation page (THIS is the primary navigation, NOT table-of-contents.html)
2. **`table-of-contents.html`** - Static reference page for quick browsing (secondary, manually maintained)

When adding resources, `index.html` must be updated (automatically by `integrate_new_html.py` or manually).

### Technical Implementation

#### Main Navigation (index.html)
- Dynamic content loading via iframe injection with `loadContent(filename)` function
- Sidebar collapse/expand functionality with CSS transitions and localStorage persistence
- Mobile-responsive with hamburger menu toggle for small screens
- Search functionality with real-time filtering across all resources
- Category accordion system with single-expand behavior (closes others when opening one)
- No external dependencies - completely offline-capable learning platform

Key JavaScript functions in index.html:
- `toggleCategory(categoryId)` - Handles category accordion expansion/collapse
- `loadContent(filename)` - Loads HTML content into iframe with error handling
- `performSearch(query)` - Filters and displays search results from searchData array
- `clearSearch()` - Clears search input and hides results
- `toggleSidebarCollapse()` - Desktop sidebar collapse with localStorage persistence
- `toggleMobileMenu()` - Mobile hamburger menu toggle
- `loadQuiz()` - Opens quiz.html in new tab

#### Resource Search System
The site includes a comprehensive search functionality for finding learning resources:

**Search Features:**
- **Real-time search**: Results filter automatically as you type
- **Search scope**: Searches across all 120+ resource titles and categories
- **Keyboard shortcuts**:
  - `Enter` - Execute search
  - `Escape` - Clear search and reset results
- **Visual feedback**: Search results count, category badges, and "no results" message
- **Responsive design**: Grid layout adapts to screen size

**Search Data Structure:**
```javascript
const searchData = [
  {
    title: 'Resource Title',
    category: 'Category Name',
    file: 'path/to/resource.html'
  },
  // ... 120+ entries covering all resources
];
```

**Important**: When adding new resources via `scripts/html_management/integrate_new_html.py` or manually, the `searchData` array in `index.html` must be updated to include the new resource. The script does NOT automatically update the search data.

**Search Implementation:**
- Location: Positioned between statistics section and category navigation
- Styling: Green gradient design (`#F0FDF4` to `#DCFCE7`) with AWS brand accent colors
- Results: Grid layout with category badges, max height with scrolling
- Clear button: Appears when search input has text, clicking resets search

#### Category Quick Navigation
- Category quick links section added below statistics section on index.html
- Each major category has an ID anchor for in-page navigation:
  - `#networking` - ネットワーキング
  - `#security-governance` - セキュリティ・ガバナンス
  - `#compute-applications` - コンピュート・アプリケーション
  - `#content-delivery-dns` - コンテンツ配信・DNS
  - `#development-deployment` - 開発・デプロイメント
  - `#storage-database` - ストレージ・データベース
  - `#migration-transfer` - 移行・転送
  - `#analytics-operations` - 分析・運用・クイズ
- Smooth scroll behavior implemented via CSS `scroll-behavior: smooth`
- 8 category cards with icons, names, and resource counts
- Hover animations with color transitions and shadow effects

#### Breadcrumb Navigation
- All HTML learning resource pages include breadcrumb navigation
- Breadcrumbs show: Home > Major Category > Sub Category
- Link back to index.html for easy navigation
- Consistent styling with AWS brand colors

#### Page-Internal Table of Contents (TOC)
- All learning resource pages include a collapsible table of contents
- Automatically generated from h2 and h3 heading tags
- Features:
  - Expandable/collapsible with toggle button
  - **Default state: collapsed (folded)** - Users must click to expand
  - **Right-aligned positioning** on desktop (max-width: 400px)
  - Full-width display on mobile devices (screen width < 768px)
  - Smooth scroll navigation to heading anchors
  - Automatic ID generation for headings
  - Mobile-responsive design
  - Blue gradient styling matching AWS brand
  - Positioned after breadcrumb navigation or first h1 tag
- Implementation: Inline CSS and JavaScript for offline capability
- UI Controls:
  - Toggle button shows `▶ 展開する` when collapsed
  - Toggle button shows `▼ 折りたたむ` when expanded
  - Smooth CSS transitions for expand/collapse animations

#### Quiz System
- Interactive quiz application (`quiz.html`, `quiz-app.js`, `quiz-data-extended.js`)
- Category-based question selection across 13 AWS domains
- Real-time scoring and feedback with explanations
- Progress tracking with visual progress bar
- **Quiz Progress Tracking**: The `QuizProgress` class in `quiz-app.js` provides localStorage-based progress tracking functionality. It saves quiz scores, dates, and performance metrics per category. This feature is implemented but not exposed in the UI by default - it can be enabled by adding UI controls to view saved progress data.
- Responsive design for all device sizes

Quiz data structure in `quiz-data-extended.js`:
```javascript
const quizData = {
  'category-key': {
    title: 'Category Title',
    icon: 'emoji',
    questions: [
      {
        id: 'unique-id',
        question: 'Question text',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct: 0, // Index of correct answer
        explanation: 'Detailed explanation'
      }
    ]
  }
}

// Helper functions (defined at bottom of quiz-data-extended.js)
function getTotalQuestions(categoryKey) { ... }  // Returns question count for category
function getAllQuestions(categoryKey) { ... }   // Returns copy of all questions for category
```

### File Patterns
- HTML files use descriptive naming: `aws-[service]-[topic].html` or `[service]_[topic]_infographic.html`
- All content is static HTML/CSS/JavaScript with no external dependencies
- SVG graphics are inline for offline accessibility
- CSS uses AWS brand colors: `#232F3E` (dark blue), `#FF9900` (orange)

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

### Modifying Navigation
- Update `index.html` sidebar structure in category sections to add/remove categories
- Add `<div class="category">` blocks with `toggleCategory()` onclick handlers
- Each resource needs `<div class="resource-item">` with `loadContent()` onclick handler
- **Critical**: Update search data array (`const searchData`) when adding/removing resources
- Ensure category organization aligns with AWS SAP exam domains
- Test mobile responsiveness after navigation changes

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

### Automation Workflows

#### Breadcrumb Management
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

#### Page-Internal Table of Contents (TOC) Management
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

#### Bulk HTML Integration
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

### HTML Quality Assurance

**W3C Validation is REQUIRED for all HTML files** - This ensures code quality, accessibility, and cross-browser compatibility.

#### Why W3C Validation Matters
1. **Standards Compliance**: Ensures HTML follows official W3C standards
2. **Cross-browser Compatibility**: Valid HTML works consistently across all browsers
3. **Accessibility**: Proper HTML structure is essential for screen readers and assistive technologies
4. **SEO Benefits**: Search engines favor well-structured, valid HTML
5. **Maintainability**: Valid code is easier to debug and maintain
6. **Professional Quality**: Demonstrates commitment to web development best practices

#### How to Validate HTML Files

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

#### Common HTML Validation Issues to Watch For

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

#### Validation Workflow

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

#### Integration with Development Workflow

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

#### Tips for Efficient Validation

1. **Validate early and often** - Don't wait until the end
2. **Use HTML5 DOCTYPE** - `<!DOCTYPE html>`
3. **Include language attribute** - `<html lang="ja">` for Japanese content
4. **Use semantic HTML** - `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
5. **Always include alt text** - Essential for accessibility
6. **Check for typos** - Misspelled tag names cause errors
7. **Validate SVG separately** - Inline SVG should also be valid
8. **Test in multiple browsers** - Even valid HTML can have browser quirks

## Git Operations and Version Control

### Repository Management
- This repository uses Git for version control and change tracking
- User identity is configured as: suzuki100603@gmail.com (Suzuki)
- All changes should be committed with descriptive messages in Japanese or English
- **CRITICAL**: All feature additions, modifications, and source code changes MUST be committed to Git and pushed to the remote repository immediately after completion

### Commit Guidelines
- Make atomic commits for logical changes (single feature/fix per commit)
- Use descriptive commit messages that explain the purpose of changes
- Include both English and Japanese descriptions when helpful for learning context
- Commit messages should follow the format: `[Type]: Brief description`
  - Types: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `refactor` (code restructuring)

### Push to Remote Repository
**CRITICAL WORKFLOW**: After committing changes locally, ALWAYS push to the remote repository immediately.

```bash
# Standard workflow for gh-pages branch
git add .
git commit -m "feat: Your descriptive commit message"
git push origin gh-pages  # REQUIRED: Push to remote immediately

# For other branches
git push origin <branch-name>
```

**Why this is critical:**
- **GitHub Pages deployment**: Changes to `gh-pages` branch trigger automatic deployment
- **Backup**: Ensures your work is backed up to GitHub
- **Collaboration**: Makes your changes visible to other collaborators
- **CI/CD**: Triggers automated testing and deployment pipelines
- **History preservation**: Remote repository serves as the source of truth

**Common mistake to avoid:**
- ❌ Committing locally but forgetting to push
- ✅ Always follow: `git add` → `git commit` → `git push`

**Verification after push:**
```bash
# Verify push was successful
git status
# Should show: "Your branch is up to date with 'origin/gh-pages'"

# For gh-pages branch specifically, verify deployment
# Visit https://ssuzuki1063.github.io/aws_sap_studying/ after 1-2 minutes
```

### Branching Strategy

This repository uses a two-branch workflow with feature branches for development:

#### Main Branches

**`gh-pages` (Production/Deployment Branch)**
- **Purpose**: Live production environment deployed to GitHub Pages
- **URL**: https://ssuzuki1063.github.io/aws_sap_studying/
- **Auto-deployment**: All commits are automatically deployed within minutes
- **ウェブページ更新**: このブランチへのコミット＆プッシュがGitHub Pagesのウェブページ更新をトリガーします
- **Usage**: Direct commits for hotfixes and small updates; merge feature branches here after testing
- **Protection**: This is the current active branch - always verify changes work before pushing
- **Deployment Flow**: `git push origin gh-pages` → GitHub Pagesが自動検出 → 1〜2分で本番サイト更新

**`master` (Development Base Branch)**
- **Purpose**: Main development branch and base for pull requests
- **Usage**: Use as the base branch when creating PRs for code review
- **Workflow**: Feature branches should be created from `master` and merged back via PR
- **Sync**: Should be kept in sync with `gh-pages` for consistency

#### Feature Branches

Create feature branches for significant additions or experimental changes:

**Naming Conventions:**
- `feature/[service-name]` - New AWS service learning resources (e.g., `feature/lambda-monitoring`)
- `feature/[topic]` - New features or enhancements (e.g., `feature/quiz-categories`)
- `fix/[issue]` - Bug fixes (e.g., `fix/navigation-mobile`)
- `refactor/[component]` - Code refactoring (e.g., `refactor/search-function`)

**Feature Branch Workflow:**
```bash
# Create feature branch from master
git checkout master
git pull origin master
git checkout -b feature/new-service-guide

# Make changes and commit
git add .
git commit -m "feat: Add new service guide"

# Push feature branch
git push origin feature/new-service-guide

# Create PR to master for review
gh pr create --base master --head feature/new-service-guide

# After PR approval, merge to master
# Then merge master to gh-pages for deployment
git checkout gh-pages
git merge master
git push origin gh-pages
```

#### Development Workflows

**Option 1: Direct Commit to gh-pages (Quick Updates)**
Use for small, tested changes that don't require review:
```bash
# Work directly on gh-pages
git checkout gh-pages
git pull origin gh-pages

# Make changes
python3 scripts/html_management/integrate_new_html.py

# W3C Validation (REQUIRED)
# Validate all modified HTML files at https://validator.w3.org/
# Fix all errors before committing

# Test locally
python3 server.py
# Verify at http://localhost:8080/

# Commit and deploy
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages

# Site automatically deploys in 1-2 minutes
```

**Option 2: Feature Branch + PR (Complex Changes)**
Use for significant features, refactoring, or changes that benefit from review:
```bash
# Create feature branch from master
git checkout master
git checkout -b feature/quiz-improvements

# Develop and test
# ... make changes ...

# W3C Validation (REQUIRED)
# Validate all modified HTML files at https://validator.w3.org/
# Fix all errors before committing

python3 server.py  # Test locally

# Commit to feature branch
git add .
git commit -m "feat: クイズシステムを改善"
git push origin feature/quiz-improvements

# Create pull request
gh pr create --base master --title "クイズシステム改善" --body "詳細な説明"

# After review and approval, merge to master
# Then deploy to gh-pages
git checkout gh-pages
git merge master
git push origin gh-pages
```

#### Branch Synchronization

Keep `master` and `gh-pages` in sync to avoid divergence:

```bash
# Sync master with gh-pages
git checkout master
git merge gh-pages
git push origin master

# Or sync gh-pages with master
git checkout gh-pages
git merge master
git push origin gh-pages
```

**When to sync:**
- After direct commits to `gh-pages` → sync to `master`
- After merging PRs to `master` → sync to `gh-pages` for deployment
- Before creating new feature branches → ensure `master` is current

### Change Tracking Best Practices
- Commit frequently to track incremental progress on learning materials
- Use `.gitignore` to exclude temporary files, OS-specific files, and build artifacts
- Tag major milestones (e.g., completion of service categories): `git tag -a v1.0 -m "Complete networking section"`

### File Management
- Always commit changes after adding new learning resources
- Update navigation and references in the same commit when adding new files
- Remove outdated or duplicate content through Git operations to maintain history

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
- [ ] Added to `index.html` sidebar navigation
- [ ] Added to `searchData` array in `index.html`
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

### Performance Considerations
- Each HTML file should be self-contained to minimize HTTP requests
- SVG graphics should be inline rather than external files
- Avoid external dependencies (CDNs, external CSS/JS) for offline capability
- Large infographic files are acceptable as they're loaded on-demand via iframe
- Search is client-side only - no backend processing required

## Important Notes

### Deployment

このリポジトリはGitHub Pagesを使用してウェブページを公開しています。

#### GitHub Pages自動デプロイメントの仕組み

**デプロイメントソース**: `gh-pages`ブランチ
**公開URL**: https://ssuzuki1063.github.io/aws_sap_studying/

**重要**: `gh-pages`ブランチへのコミットがウェブページ更新のトリガーになります。

#### デプロイメントプロセス

1. **ローカルで変更を加える**
   ```bash
   # ファイルを編集・追加
   python3 scripts/html_management/integrate_new_html.py
   ```

2. **ローカルでテストする**
   ```bash
   python3 server.py
   # http://localhost:8080/ でテスト
   ```

3. **gh-pagesブランチにコミット＆プッシュ**
   ```bash
   git add .
   git commit -m "feat: 新規学習リソースを追加"
   git push origin gh-pages
   ```

4. **GitHub Pagesが自動的にデプロイ**
   - プッシュ後、GitHubが自動的にgh-pagesブランチの内容を検出
   - 1〜2分以内に本番サイトへ自動デプロイ
   - ビルドプロセスなし - 静的ファイルがそのまま配信される

5. **デプロイメント確認**
   ```bash
   # ブラウザで公開サイトを確認
   # https://ssuzuki1063.github.io/aws_sap_studying/
   ```

#### デプロイメント設定

- **ソースブランチ**: `gh-pages`（GitHubリポジトリ設定で指定）
- **公開ディレクトリ**: ルートディレクトリ `/`
- **ビルドプロセス**: なし（静的HTMLファイルをそのまま配信）
- **カスタムドメイン**: 未設定（GitHub提供のドメインを使用）

#### デプロイメント時の注意事項

- **即座に公開される**: `gh-pages`へのプッシュは1〜2分で本番反映されます
- **テストを忘れずに**: 本番反映前に必ずローカルでテストしてください
- **大きな変更はPRを使用**: 複雑な変更は`master`ブランチでPRレビューしてから`gh-pages`へマージ
- **デプロイメント履歴**: GitHubのActions/Pagesタブでデプロイメント履歴を確認可能

#### トラブルシューティング

デプロイメントが反映されない場合：
1. GitHubリポジトリのSettings > Pagesでgh-pagesブランチが選択されているか確認
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
3. GitHub ActionsタブでPages buildエラーがないか確認
4. `index.html`が正しくコミットされているか確認

### Browser Compatibility
- Designed for modern browsers with CSS Grid and Flexbox support
- Mobile-responsive with breakpoints at 768px and 1024px
- Touch-friendly targets on mobile devices (44px minimum)

### Content Language
- All content is in Japanese (日本語)
- File paths and code use English
- Comments and explanations in learning materials are in Japanese

## Design Constraints & Philosophy

### Static Site Architecture
**CRITICAL**: This is a fully static website with NO backend server, NO database, NO build process.

- **No Node.js/npm**: No package.json, no npm install, no webpack/vite/parcel
- **No external dependencies**: All CSS/JS must be inline or in local files
- **No CDNs**: No loading from external URLs for offline capability
- **Pure HTML/CSS/JavaScript**: Everything runs client-side in the browser
- **Python server is for development only**: The `server.py` script is ONLY for local testing with CORS support. The deployed site on GitHub Pages serves static files directly.

### Offline-First Design
All resources must work without internet:
- SVG diagrams embedded inline in HTML files
- No external image URLs or font CDNs
- No API calls or external data fetching
- JavaScript is vanilla JS with no framework dependencies

### Why This Architecture?
1. **Zero deployment complexity**: Push to gh-pages = instant deployment
2. **Perfect offline study**: Download repo and study anywhere
3. **Fast loading**: No build step, no bundling, instant page loads
4. **Educational clarity**: Students can view source and learn web development basics
5. **Maximum portability**: Works on any web server, USB drive, or local filesystem

## Coding Standards

### Data-Driven Development Principles

When writing code for this repository, **STRICTLY ADHERE** to the following rules to maintain separation of concerns and code maintainability:

#### Rule 1: HTML Structure Preservation
**DO NOT modify HTML structure** (header, main, section, footer, and other semantic tags).
- Existing HTML tag hierarchy must remain unchanged
- No reorganization of DOM structure
- Preserve semantic HTML5 structure

#### Rule 2: No Manual HTML Tag Manipulation
**DO NOT add, remove, or change nesting of HTML tags manually**.
- No inserting new `<div>`, `<section>`, `<article>` tags
- No deleting existing structural tags
- No changing parent-child relationships between tags

#### Rule 3: Content as Pure Data
**ALL content must be defined as JavaScript data structures** (arrays, objects).
- Content lives in separate data files (e.g., `data.js`, `quiz-data-extended.js`)
- Use objects and arrays to represent content hierarchies
- Keep data files focused on data only, not presentation logic

#### Rule 4: Single Template Function Pattern
**HTML generation must happen in ONE centralized template function**.
- Create a single rendering function that consumes data
- All HTML output is generated programmatically from this function
- No scattered HTML generation across multiple files

#### Rule 5: No Manual Closing Tags
**DO NOT manually write closing tags** - let template functions handle them.
- Template functions should automatically generate matching closing tags
- Use template literals or DOM methods that enforce proper tag closure
- Prevent unclosed tag bugs through automated generation

#### Rule 6: Pure Data in Data Files
**data.js and similar files must contain ONLY pure data** - no HTML tags.
- No HTML strings embedded in data objects
- Content as plain text, numbers, or structured objects
- Markdown acceptable for simple formatting if processed programmatically

### Example: Correct Data-Driven Pattern

**❌ WRONG - HTML mixed with data:**
```javascript
// data.js
const content = {
  title: '<h2>AWS Lambda</h2>',
  description: '<p>Serverless compute service</p>'
};
```

**✅ CORRECT - Pure data with template function:**
```javascript
// data.js (pure data only)
const content = {
  title: 'AWS Lambda',
  description: 'Serverless compute service'
};

// render.js (single template function)
function renderContent(data) {
  return `
    <h2>${data.title}</h2>
    <p>${data.description}</p>
  `;
}
```

### Benefits of This Approach

1. **Maintainability**: Data changes don't risk breaking HTML structure
2. **Scalability**: Adding new content is as simple as adding data objects
3. **Testability**: Data and rendering logic can be tested independently
4. **Separation of Concerns**: Content editors work with data, developers work with templates
5. **Consistency**: Single template ensures uniform HTML structure across all content
6. **Error Prevention**: Automated tag generation eliminates unclosed tag bugs

### When These Rules Apply

**ALWAYS apply these rules when:**
- Adding new quiz questions to `quiz-data-extended.js`
- Creating new learning content
- Modifying existing content
- Building new features that render dynamic content

**Exceptions (these are static files, rules don't apply):**
- Editing individual HTML learning resource files (`aws-*.html`)
- Modifying `index.html` navigation structure (must be done carefully)
- Updating static pages like `home.html`, `table-of-contents.html`

### Code Review Checklist

Before committing code changes, verify:
- [ ] No HTML tags present in data files
- [ ] Content defined as pure JavaScript objects/arrays
- [ ] Single template function handles all HTML generation
- [ ] No manual HTML structure modifications
- [ ] Closing tags generated automatically by template function
- [ ] Data and presentation logic are completely separated
