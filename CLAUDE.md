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
- `analytics-bigdata/` - Analytics and operational services (Kinesis, cost tools, metrics, availability)
- `data-analytics/` - Data analytics pipelines (Kinesis Firehose, Redshift, serverless data pipelines)
- `organizational-complexity/` - Multi-account and organizational management (RAM, SCP, tag policies, Service Catalog)
- `continuous-improvement/` - Operational excellence resources (Systems Manager, CodeDeploy, CloudTrail, WAF, CDK)
- `cost-control/` - Cost optimization resources (S3 storage classes, Lambda concurrency)
- `new-solutions/` - Newly added solution architectures and patterns
- `index.html` - Main navigation interface with collapsible sidebar
- `quiz.html` - Interactive quiz application for exam preparation

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
- Main navigation uses JavaScript for dynamic content loading via iframe injection
- `loadContent(filename)` function handles category-specific file loading (index.html:952-980)
- Sidebar collapse/expand functionality with CSS transitions and localStorage persistence (index.html:1126-1144)
- Mobile-responsive with hamburger menu toggle for small screens (index.html:1147-1155)
- Search functionality with real-time filtering across all resources (index.html:1057-1120)
- Category accordion system with single-expand behavior (index.html:932-950)
- No external dependencies - completely offline-capable learning platform

### Quiz System
- Interactive quiz application (`quiz.html`, `quiz-app.js`, `quiz-data-extended.js`)
- Category-based question selection across 9 AWS domains
- Real-time scoring and feedback with explanations
- Progress tracking with visual progress bar
- Responsive design for all device sizes

### File Patterns
- HTML files use descriptive naming: `aws-[service]-[topic].html` or `[service]_[topic]_infographic.html`
- All content is static HTML/CSS/JavaScript with no external dependencies
- SVG graphics are inline for offline accessibility

### Key JavaScript Files
- `index.html` (lines 931-1223) - Main navigation logic, search functionality, sidebar controls
- `quiz-app.js` - Quiz application logic (question rendering, scoring, navigation)
- `quiz-data-extended.js` - Quiz question database organized by AWS domain categories
- `main.js` - Additional utility functions (if present, verify usage before modifying)

## Development Commands

### Local Development Server
- `python3 server.py` - Starts a local HTTP server on port 8080 with CORS headers for development
- Server serves content from the repository root with cache-disabled headers for development
- Access the application at `http://localhost:8080/`

### File Operations
- No build process required - all content is static HTML/CSS/JavaScript
- No package managers or dependencies - self-contained learning resources
- Preview changes by opening `index.html` directly in browser or using the Python server

## Working with Content

### Adding New Learning Resources
1. Create HTML file following existing naming conventions (`aws-[service]-[topic].html`)
2. Use consistent CSS styling with AWS brand colors (#232F3E, #FF9900)
3. Include SVG diagrams for visual explanation
4. Update `index.html` navigation sidebar (lines 559-911) to include new resource
5. Add entry to search data array in `index.html` (lines 983-1055) for searchability
6. Place file in appropriate topical directory matching AWS SAP exam domains
7. Ensure content is self-contained with inline CSS and SVG for offline use

### Modifying Navigation
- Update `index.html` sidebar structure (lines 559-911) to add/remove categories
- Modify `loadContent()` function calls to match new file paths
- Update search data array (lines 983-1055) when adding/removing resources
- Ensure category organization aligns with AWS SAP exam domains
- Test mobile responsiveness after navigation changes

### Adding Quiz Questions
- Add questions to `quiz-data-extended.js` following existing structure
- Organize by category (networking, security-governance, compute-applications, etc.)
- Each question requires: question text, 4 options, correct answer index, and explanation
- Update question count in category card if adding to new category

### File Organization
- When reorganizing files, update all references in `index.html`
- Maintain logical grouping by AWS service domains
- Remove any `.html:Zone.Identifier` files that may appear from Windows downloads

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
- Ensure iframe sandbox permissions are correct (line 959: `sandbox = 'allow-same-origin allow-scripts allow-forms'`)
- Test with Python server to avoid CORS issues

### Performance Considerations
- Each HTML file should be self-contained to minimize HTTP requests
- SVG graphics should be inline rather than external files
- Avoid external dependencies (CDNs, external CSS/JS) for offline capability
- Large infographic files are acceptable as they're loaded on-demand via iframe