# Automation Workflow Reference

Complete guide to the automated integration workflow for AWS SAP learning resources.

## Overview

The `integrate_resource_complete.py` orchestration script automates the complete workflow for integrating new HTML learning resources into the repository.

**What it automates:**
- File categorization and movement
- Breadcrumb navigation addition
- Page-internal table of contents generation

**What it does NOT automate:**
- data.js updates (section.resources, counts)
- index.js searchData updates
- W3C HTML validation
- Local testing
- Git operations

## Complete Workflow Diagram

```
new_html/
  ├── aws-service-A.html
  └── aws-service-B.html
        ↓
[integrate_resource_complete.py]
        ↓
Step 1: Environment Validation
  ✓ Check all required scripts exist
        ↓
Step 2: File Integration (integrate_new_html.py)
  ✓ Analyze HTML title and content
  ✓ Score keywords for categorization
  ✓ Move to appropriate category directory
  ✓ Update index.html resource counts
        ↓
Step 3: Breadcrumbs (add_breadcrumbs.py)
  ✓ Detect category from file path
  ✓ Generate breadcrumb HTML
  ✓ Insert after <div class="container">
  ✓ Add breadcrumb CSS
        ↓
Step 4: TOC (add_toc.py)
  ✓ Extract h2/h3 headings
  ✓ Generate unique IDs
  ✓ Create collapsible TOC
  ✓ Insert after breadcrumbs
        ↓
Display Manual Steps Reminder
        ↓
[MANUAL: Update data.js]
[MANUAL: Update index.js]
[MANUAL: W3C Validation]
[MANUAL: Local Testing]
[MANUAL: Git Commit & Push]
```

## Usage Examples

### Basic Usage

```bash
# Standard workflow
python3 scripts/html_management/integrate_resource_complete.py
```

### Dry Run (Preview Only)

```bash
# Preview what would happen without making changes
python3 scripts/html_management/integrate_resource_complete.py --dry-run
```

**Note:** Dry run only previews integrate_new_html.py. Breadcrumbs and TOC scripts are idempotent (safe to run multiple times), so they run normally.

### Custom Source Directory

```bash
# Use a different source directory
python3 scripts/html_management/integrate_resource_complete.py --source custom_html/
```

### Verbose Mode

```bash
# See detailed output from all scripts
python3 scripts/html_management/integrate_resource_complete.py --verbose
```

## Manual Steps After Automation

After the orchestration script completes, you **MUST** perform these manual steps:

### 1. Update data.js

**Location:** `/data.js`

**Action:** Add new resource to appropriate section

**Example:**
```javascript
// Find the appropriate category and section
{
  id: "networking",
  title: "ネットワーキング",
  icon: "🌐",
  count: 25,  // Increment this
  sections: [
    {
      id: "vpc-basics",
      title: "VPC & ネットワーク基礎",
      icon: "🏗️",
      count: 8,  // Increment this
      resources: [
        // Add new resource here
        {
          title: "AWS Direct Connect完全ガイド",
          href: "networking/aws-direct-connect-guide.html"
        }
      ]
    }
  ]
}
```

### 2. Update index.js

**Location:** `/index.js`

**Action:** Add to searchData array

**Example:**
```javascript
const searchData = [
  // ... existing entries ...
  {
    title: 'AWS Direct Connect完全ガイド',
    category: 'ネットワーキング',
    file: 'networking/aws-direct-connect-guide.html'
  }
];
```

**CRITICAL:** Title and file path must EXACTLY match what's in data.js.

### 3. W3C HTML Validation

**URL:** https://validator.w3.org/

**Action:**
1. Upload each modified HTML file
2. Fix all errors and warnings
3. Re-validate until clean

**Why it matters:**
- Ensures cross-browser compatibility
- Improves accessibility
- Prevents rendering issues
- Professional quality assurance

### 4. Local Testing

```bash
python3 server.py
# Visit http://localhost:8080/
```

**Test Checklist:**
- [ ] New resource appears in navigation
- [ ] Search finds the resource
- [ ] File loads correctly in iframe
- [ ] Breadcrumbs show correct hierarchy
- [ ] Page-internal TOC expands/collapses
- [ ] TOC links scroll to correct headings
- [ ] Return button links to learning-resources.html
- [ ] Mobile responsive (test at 768px breakpoint)

### 5. Git Operations

```bash
git add .
git commit -m "feat: 新規AWS学習リソースを統合"
git push origin gh-pages
```

### 6. Deployment Verification

- Wait 1-2 minutes for GitHub Pages to deploy
- Visit https://ssuzuki1063.github.io/aws_sap_studying/
- Spot-check new resources load correctly

## Error Handling

### Environment Validation Fails

**Symptom:** Script reports missing scripts

**Solution:**
```bash
# Verify scripts exist
ls -la scripts/html_management/
# Should show: integrate_new_html.py, add_breadcrumbs.py, add_toc.py
```

### integrate_new_html.py Fails

**Symptom:** Script exits after Step 2

**Causes:**
- No HTML files in source directory
- Invalid HTML files
- Permission issues

**Solution:**
1. Check source directory exists and has HTML files
2. Verify HTML files are well-formed
3. Check file permissions

### Breadcrumbs or TOC Fails

**Symptom:** Warning message but script continues

**Impact:** Non-critical - some files may not get breadcrumbs/TOC

**Solution:**
- Review error messages
- Run individual scripts manually with verbose output
- Check specific file for issues

## Troubleshooting

### Files not categorized correctly

**Cause:** Keyword scoring didn't match expected category

**Solution:**
1. Check file title and h1 content
2. Review CATEGORY_MAPPINGS in integrate_new_html.py
3. Manually move file to correct directory
4. Update data.js and index.js accordingly

### Breadcrumbs not appearing

**Cause:** File already has breadcrumbs, or insertion point not found

**Solution:**
1. Search file for 'breadcrumb-nav' class
2. Verify file has `<div class="container">` or `<body>` tag
3. Run add_breadcrumbs.py directly on specific file

### TOC not appearing

**Cause:** File has <2 headings, or already has TOC

**Solution:**
1. Verify file has at least 2 h2/h3 headings
2. Search file for 'toc-container' id
3. Run add_toc.py with --dry-run to see what would happen

## Best Practices

1. **Always run dry-run first**
   - Preview changes before execution
   - Verify categorization is correct

2. **Test locally before deploying**
   - Catch issues early
   - Verify all features work

3. **W3C validate religiously**
   - Invalid HTML causes problems
   - Professional quality matters

4. **Update data files carefully**
   - Double-check titles match exactly
   - Verify counts are correct
   - Search won't work without index.js updates

5. **Commit incrementally**
   - Don't batch too many changes
   - Easier to rollback if needed

6. **Verify deployment**
   - GitHub Pages can have delays
   - Always check production site

## Related Documentation

- [SKILL.md](../SKILL.md) - Main skill documentation
- [data_structure_guide.md](data_structure_guide.md) - Data.js and index.js structure
- [validation_checklist.md](validation_checklist.md) - Complete testing checklist
- [category_mappings.md](category_mappings.md) - Category determination logic
