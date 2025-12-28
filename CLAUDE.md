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

# 6. CRITICAL: Update data files manually
# - Update data.js: Add to section.resources array and update counts
# - Update index.js: Add to searchData array (required for search)

# 7. Commit and deploy to GitHub Pages
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages

# 8. Verify deployment (wait 1-2 minutes)
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

## Quick Reference: Common Tasks

### Adding a New HTML Resource (Manual Method)

**Step 1: Place the HTML file**
- Put file in appropriate category directory (e.g., `networking/`, `security-governance/`)
- Use naming convention: `aws-[service]-[topic].html`

**Step 2: Update data.js**
```javascript
// Find the appropriate category and section, then add:
{
  title: 'Your Resource Title',
  href: 'category/your-resource.html'
}
// Update section.count and category.count
```

**Step 3: Update index.js**
```javascript
// Add to the searchData array:
const searchData = [
  // ... existing entries ...
  {
    title: 'Your Resource Title',
    category: 'カテゴリ名',
    file: 'category/your-resource.html'
  }
];
```

**Step 4: Test**
```bash
python3 server.py
# Visit http://localhost:8080/ and verify:
# - Resource appears in navigation
# - Search finds the resource
# - Resource loads correctly
```

### Testing Changes Locally

```bash
# Start development server
python3 server.py

# Open browser to http://localhost:8080/

# Test checklist:
# - Navigation works
# - Search finds resources
# - Mobile responsive (use browser dev tools)
# - All links work
```

### Deploying to GitHub Pages

```bash
# 1. Test locally first!
python3 server.py

# 2. W3C validate all modified HTML files
# Visit https://validator.w3.org/

# 3. Commit and push to gh-pages
git add .
git commit -m "feat: descriptive message"
git push origin gh-pages

# 4. Verify deployment (wait 1-2 minutes)
# Visit https://ssuzuki1063.github.io/aws_sap_studying/
```

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

**Main Application Files:**
- `index.html` - Main navigation interface (uses data-driven architecture with data.js + render.js)
- `data.js` - **CRITICAL**: Pure data definitions for categories, resources, and quick navigation
- `render.js` - Template functions that generate HTML from data.js
- `index.js` - UI event handlers (search, scroll, category navigation)
- `knowledge-base.html` - Alternative table-based navigation with advanced filtering
- `home.html` - Default homepage content loaded on initial page load
- `table-of-contents.html` - Comprehensive table of contents for all resources (static reference page, manually maintained)

**Quiz Application:**
- `quiz.html` - Interactive quiz application for exam preparation
- `quiz-app.js` - Quiz application logic
- `quiz-data-extended.js` - Quiz question database (194 questions across 13 categories)

**Development Tools:**
- `server.py` - Development server with CORS support

**Automation Scripts:**
- `scripts/html_management/add_breadcrumbs.py` - Add breadcrumb navigation to all HTML files
- `scripts/html_management/remove_breadcrumbs.py` - Remove breadcrumb navigation from HTML files
- `scripts/html_management/add_toc.py` - Add page-internal table of contents to all HTML files
- `scripts/html_management/integrate_new_html.py` - **IMPORTANT**: Automated integration script for new HTML files
- `scripts/quiz_management/analyze_quiz.py` - Quiz statistics and analysis tool

**Note on Script Duplication:** Automation scripts exist in two locations:
- `scripts/` - Main scripts for direct CLI usage (primary location)
- `.claude/skills/aws-knowledge-organizer/scripts/` - Copies for the Claude skill workflow
These should be kept in sync when making script changes.

## Detailed Documentation

For detailed information on specific topics, see these documents:

### 📐 Architecture & Design
**[@docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Comprehensive architecture documentation
- Data-driven architecture (data.js + render.js + index.js)
- Navigation system and search functionality
- Quiz system and knowledge base interface
- Design constraints and offline-first philosophy
- Browser compatibility and performance considerations

### 🛠️ Development Workflows
**[@docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)** - Complete development guide
- Adding new learning resources (automated and manual)
- Modifying navigation and adding quiz questions
- Automation workflows (breadcrumbs, TOC, bulk integration)
- W3C HTML validation (REQUIRED)
- Testing checklist and debugging tips

### 🔀 Git Operations
**[@docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)** - Git workflow and deployment
- Branching strategy (gh-pages, master, feature branches)
- Commit guidelines and push requirements
- GitHub Pages deployment process
- Development workflows (direct commit vs feature branch)
- Troubleshooting deployment issues

### 📝 Coding Standards
**[@docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)** - Coding standards and best practices
- Data-driven development principles (6 critical rules)
- File naming conventions
- CSS, JavaScript, and HTML standards
- Security and performance standards
- Code review checklist

## Critical Rules to Remember

### Data-Driven Architecture

When adding new resources, **MUST** update **TWO** places:

1. **`data.js`** - Add to appropriate `section.resources` array and update counts
2. **`index.js`** - Add to `searchData` array (search won't work without this!)

Without these updates, the resource won't appear in navigation or search results.

### Static Site Constraints

This is a **fully static website** with:
- ❌ NO backend server
- ❌ NO database
- ❌ NO build process
- ❌ NO Node.js/npm
- ❌ NO external dependencies or CDNs
- ✅ Pure HTML/CSS/JavaScript only
- ✅ All resources work offline

### Deployment

- **Production branch**: `gh-pages` (auto-deploys to GitHub Pages)
- **Development branch**: `master` (base for pull requests)
- **Push immediately** after committing: `git push origin gh-pages`
- **Verify deployment**: https://ssuzuki1063.github.io/aws_sap_studying/ (1-2 minutes)

### W3C Validation

**REQUIRED for all HTML files** before committing:
- Visit https://validator.w3.org/
- Fix all errors and warnings
- Ensures accessibility, cross-browser compatibility, and professional quality

## Getting Help

- **Architecture questions**: See [@docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Development workflows**: See [@docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- **Git operations**: See [@docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)
- **Coding standards**: See [@docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)
- **Claude skill**: Use `/skill aws-knowledge-organizer` for guided workflows
