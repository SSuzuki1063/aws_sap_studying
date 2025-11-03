# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AWS SAP (Solutions Architect Professional) exam study resource repository containing HTML-based learning materials. The repository serves as a comprehensive visual learning platform with infographics, technical diagrams, and detailed explanations of AWS services and concepts.

## Quick Start Workflows

### Adding New HTML Learning Resources (Most Common Task)
```bash
# 1. Place HTML files in new_html/ directory
# 2. Preview integration
python3 integrate_new_html.py --dry-run

# 3. Execute integration (moves files, updates index.html automatically)
python3 integrate_new_html.py

# 4. Test locally
python3 server.py
# Visit http://localhost:8080/

# 5. Commit changes
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages
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

## Directory Structure

The repository is organized into topical categories aligned with AWS SAP exam domains:

- `networking/` - Networking services (Direct Connect, Transit Gateway, VPN, PrivateLink, EIP/NAT)
- `security-governance/` - Security and governance services (SCP, IAM, WAF, Tag Policies, Cognito, CMK)
- `compute-applications/` - Compute and application services (EC2, Lambda, ECS, EFA, Auto Scaling, ALB)
- `content-delivery-dns/` - Content delivery and DNS services (CloudFront, Route53, Global Accelerator)
- `development-deployment/` - Development and deployment services (CloudFormation, Service Catalog, CDK, SAM, EventBridge, API Gateway)
- `storage-database/` - Storage and database services (S3, EBS, EFS, RDS Aurora, ElastiCache, MSK)
- `migration-transfer/` - Migration services (DMS, Migration Hub, DR strategies)
- `migration-planning/` - Migration planning resources
- `migration/` - Additional migration resources
- `storage/` - Storage security resources
- `analytics-bigdata/` - Analytics and operational services (Kinesis, cost tools, metrics, availability)
- `data-analytics/` - Data analytics pipelines (Kinesis Firehose, Redshift, serverless data pipelines)
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
- `quiz-data-extended.js` - Quiz question database (100+ questions across 9 categories)
- `server.py` - Development server with CORS support
- `main.js` - Additional utility functions (verify usage before modifying)
- `add_breadcrumbs.py` - Utility script to add breadcrumb navigation to all HTML files
- `remove_breadcrumbs.py` - Utility script to remove breadcrumb navigation from HTML files
- `add_toc.py` - Utility script to add page-internal table of contents to all HTML files
- `integrate_new_html.py` - **IMPORTANT**: Automated integration script for new HTML files (see Automation Workflows section)

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

**Important**: When adding new resources via `integrate_new_html.py` or manually, the `searchData` array in `index.html` must be updated to include the new resource. The script does NOT automatically update the search data.

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
  - Smooth scroll navigation to heading anchors
  - Automatic ID generation for headings
  - Mobile-responsive design
  - Blue gradient styling matching AWS brand
  - Positioned after breadcrumb navigation or first h1 tag
- Implementation: Inline CSS and JavaScript for offline capability

#### Quiz System
- Interactive quiz application (`quiz.html`, `quiz-app.js`, `quiz-data-extended.js`)
- Category-based question selection across 9 AWS domains
- Real-time scoring and feedback with explanations
- Progress tracking with visual progress bar
- LocalStorage integration for tracking quiz history (optional feature via QuizProgress class)
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
Use the `integrate_new_html.py` script to automatically categorize and integrate new HTML files:

1. Place new HTML files in `new_html/` directory
2. Run integration script:
   ```bash
   # Dry run to preview changes
   python3 integrate_new_html.py --dry-run

   # Execute integration
   python3 integrate_new_html.py
   ```
3. The script will:
   - Analyze HTML title and content to determine appropriate category
   - Move file to correct directory (e.g., `networking/`, `security-governance/`)
   - Update `index.html` navigation sidebar automatically
   - Update resource counts for affected categories
   - Remove Zone.Identifier files from Windows downloads
4. Review changes and commit to git
5. Test via local server: `python3 server.py`

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
4. **Manually update `table-of-contents.html`**: This is a static reference page that should be kept in sync
5. Place file in appropriate topical directory matching AWS SAP exam domains
6. Ensure content is self-contained with inline CSS and SVG for offline use
7. Test loading via local server to verify paths and functionality

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
python3 add_breadcrumbs.py

# Remove breadcrumbs from all HTML files
python3 remove_breadcrumbs.py
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
python3 add_toc.py --dry-run

# Add/update TOC in all HTML files
python3 add_toc.py

# Use custom directory
python3 add_toc.py --dir /path/to/directory
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
The `integrate_new_html.py` script provides powerful automation:

```bash
# Preview what would happen (no changes made)
python3 integrate_new_html.py --dry-run

# Integrate files from new_html/ directory
python3 integrate_new_html.py

# Use custom source directory
python3 integrate_new_html.py --source custom_directory/
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
- Remove `.html:Zone.Identifier` files that appear from Windows downloads (automated by `integrate_new_html.py`)
- Some files may have duplicates across directories (e.g., `new-solutions/` and domain-specific folders)
- Use `table-of-contents.html` as static reference - it's NOT automatically updated by scripts

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

### Branching Strategy
- Current branch: `gh-pages` (GitHub Pages deployment)
- No main/master branch configured in this repository
- Create feature branches for significant additions: `feature/[service-name]` or `feature/[topic]`
- Merge completed features back to gh-pages after testing

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
- Repository is deployed via GitHub Pages on the `gh-pages` branch
- All commits to `gh-pages` will be automatically deployed
- No build process - files are served as-is

### Browser Compatibility
- Designed for modern browsers with CSS Grid and Flexbox support
- Mobile-responsive with breakpoints at 768px and 1024px
- Touch-friendly targets on mobile devices (44px minimum)

### Content Language
- All content is in Japanese (日本語)
- File paths and code use English
- Comments and explanations in learning materials are in Japanese
- 機能追加・機能変更・ソースコード変更といったあらゆる変更はgitにコミットし、リモートリポジトリに反映させるようにしてください。
- webサイトの機能変更は、静的サイトの要素のみで機能変更を完結させること

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
- 検索機能を新たに実装したことを追記してください