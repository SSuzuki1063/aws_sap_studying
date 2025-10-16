# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AWS SAP (Solutions Architect Professional) exam study resource repository containing HTML-based learning materials. The repository serves as a comprehensive visual learning platform with infographics, technical diagrams, and detailed explanations of AWS services and concepts.

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
- `table-of-contents.html` - Comprehensive table of contents for all resources
- `quiz.html` - Interactive quiz application for exam preparation
- `quiz-app.js` - Quiz application logic
- `quiz-data-extended.js` - Quiz question database (100+ questions across 9 categories)
- `server.py` - Development server with CORS support
- `main.js` - Additional utility functions (verify usage before modifying)

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
- `toggleSidebarCollapse()` - Desktop sidebar collapse with localStorage persistence
- `toggleMobileMenu()` - Mobile hamburger menu toggle
- `loadQuiz()` - Opens quiz.html in new tab

Search data structure: Array of objects with `{title, category, file}` - must be updated when adding new resources.

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
1. Create HTML file following naming conventions:
   - Preferred: `aws-[service]-[topic].html` (e.g., `aws-lambda-metrics.html`)
   - Alternative: `[service]_[topic]_infographic.html` (e.g., `ecs_infographic.html`)
2. Use consistent CSS styling with AWS brand colors (#232F3E, #FF9900)
3. Include inline SVG diagrams for visual explanations
4. Update **two locations** in `index.html`:
   - Navigation sidebar: Add resource item in appropriate category section
   - Search data array: Add entry with `{title, category, file}` structure
5. Place file in appropriate topical directory matching AWS SAP exam domains
6. Ensure content is self-contained with inline CSS and SVG for offline use
7. Test loading via local server to verify paths and functionality

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

### File Organization
- When reorganizing files, search `index.html` for all references (sidebar + search data)
- Maintain logical grouping by AWS service domains
- Remove `.html:Zone.Identifier` files that appear from Windows downloads
- Some files may have duplicates across directories (e.g., `new-solutions/` and domain-specific folders)

## Git Operations and Version Control

### Repository Management
- This repository uses Git for version control and change tracking
- User identity is configured as: suzuki100603@gmail.com (Suzuki)
- All changes should be committed with descriptive messages in Japanese or English

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