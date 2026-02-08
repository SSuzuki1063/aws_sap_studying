# Validation & Deployment Checklist

## Pre-Commit Validation (REQUIRED)

### W3C HTML Validation

**CRITICAL:** All HTML files MUST pass W3C validation before committing.

#### Why W3C Validation Matters

1. **Standards Compliance** - Ensures HTML follows official W3C standards
2. **Cross-browser Compatibility** - Valid HTML works consistently across browsers
3. **Accessibility** - Proper HTML structure essential for screen readers
4. **SEO Benefits** - Search engines favor well-structured HTML
5. **Maintainability** - Valid code easier to debug and maintain
6. **Professional Quality** - Demonstrates commitment to best practices

#### Validation Methods

**Option 1: Upload File (Recommended for new files)**

1. Visit https://validator.w3.org/
2. Click "Validate by File Upload" tab
3. Select your HTML file
4. Click "Check" button
5. Review errors and warnings
6. Fix ALL errors before proceeding

**Option 2: Direct Input (Quick checks)**

1. Visit https://validator.w3.org/
2. Click "Validate by Direct Input" tab
3. Copy and paste HTML content
4. Click "Check" button
5. Review errors and warnings

**Option 3: URL Validation (For deployed pages)**

1. Visit https://validator.w3.org/
2. Enter URL: `https://ssuzuki1063.github.io/aws_sap_studying/[path]/[filename].html`
3. Click "Check" button
4. Review errors and warnings

### Common HTML Validation Issues

**Critical Errors (MUST FIX):**

- ❌ Unclosed tags (missing `</div>`, `</section>`)
- ❌ Mismatched tags (opening `<div>` but closing `</span>`)
- ❌ Missing required attributes (e.g., `alt` on `<img>` tags)
- ❌ Duplicate IDs (IDs must be unique within a page)
- ❌ Invalid nesting (e.g., `<p>` inside another `<p>`)
- ❌ Missing DOCTYPE declaration

**Warnings (SHOULD FIX):**

- ⚠️ Missing `lang` attribute on `<html>` tag
- ⚠️ Empty heading tags (`<h1></h1>`)
- ⚠️ Obsolete attributes or elements
- ⚠️ Missing `alt` text on images
- ⚠️ Consecutive heading levels skipped (e.g., `<h1>` to `<h3>`)

### JavaScript Syntax Validation (For Quiz Questions)

```bash
# Verify quiz-data-extended.js syntax
node -c quiz-data-extended.js

# No output = success
# Error messages = fix syntax before committing
```

## Automated Integration Workflow

When using the `integrate_resource_complete.py` orchestration script:

- [ ] Files placed in new_html/ directory
- [ ] Dry-run executed successfully
- [ ] Complete integration executed without critical errors
- [ ] Breadcrumbs added to all new files (check for warnings)
- [ ] Page-internal TOC added to all new files (check for warnings)
- [ ] Manual data.js updates completed
- [ ] Manual index.js updates completed
- [ ] All automated and manual steps verified

Script command:
```bash
python3 scripts/html_management/integrate_resource_complete.py --dry-run
python3 scripts/html_management/integrate_resource_complete.py
```

See [automation_workflow.md](automation_workflow.md) for complete documentation.

---

## HTML Learning Resource Checklist

Use this checklist when adding new HTML learning resources:

### File Creation & Placement

- [ ] File placed in correct category directory
- [ ] File follows naming convention: `aws-[service]-[topic].html`
- [ ] HTML includes `<!DOCTYPE html>` declaration
- [ ] HTML includes `<html lang="ja">` tag
- [ ] **W3C validation passed** (no errors at https://validator.w3.org/)

### Content Quality

- [ ] Breadcrumb navigation present and working
- [ ] Page-internal TOC generated (if 2+ headings exist)
- [ ] SVG diagrams are inline (not external links)
- [ ] CSS uses AWS brand colors (#232F3E, #FF9900)
- [ ] Content is self-contained (no external dependencies)
- [ ] No CDN links (all resources must be local/inline)
- [ ] Images include `alt` attributes
- [ ] Heading hierarchy is logical (h1 → h2 → h3)

### Data Structure Updates (**CRITICAL**)

- [ ] **Added to data.js** (section.resources array)
- [ ] **Section count incremented** in data.js
- [ ] **Category count incremented** in data.js
- [ ] **Added to searchData array** in index.js
- [ ] Titles match exactly between data.js and index.js
- [ ] File paths match exactly (href in data.js = file in index.js)

### Local Testing

- [ ] Started local server: `python3 server.py`
- [ ] Resource appears in navigation on index.html
- [ ] Category count displays correctly
- [ ] Clicking resource loads HTML correctly in iframe
- [ ] Search functionality finds the resource
- [ ] Clicking search result loads HTML correctly
- [ ] Mobile responsive (test at 768px and 1024px breakpoints)
- [ ] No JavaScript errors in browser console
- [ ] All links within resource work correctly

## Quiz Question Checklist

Use this checklist when adding quiz questions:

### Question Structure

- [ ] Added to correct category in `quiz-data-extended.js`
- [ ] Unique `id` field (format: `[service]-[topic]-[year]`)
- [ ] Question text clear and specific (Japanese)
- [ ] Exactly 4 options provided
- [ ] `correct` index is 0-3 (not out of bounds)
- [ ] Explanation is comprehensive (2-4 sentences, Japanese)

### Syntax Validation

- [ ] No syntax errors: `node -c quiz-data-extended.js`
- [ ] Proper JSON structure (commas, brackets, quotes)
- [ ] No trailing commas in objects/arrays

### UI Testing

- [ ] Question displays correctly in quiz UI
- [ ] All options display without truncation
- [ ] Explanation shows after answer selection
- [ ] Category badge displays correctly
- [ ] Navigation to next question works

## Deployment Checklist

### Pre-Deployment

- [ ] All validation checks passed (W3C, syntax)
- [ ] Local testing completed successfully
- [ ] Git working directory is clean (no uncommitted changes)
- [ ] Currently on `gh-pages` branch (production)

### Commit

- [ ] Descriptive commit message following format:
  - `feat:` for new features/resources
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `refactor:` for code restructuring
- [ ] Example: `feat: 新規AWS Lambdaメトリクス学習リソースを追加`

### Push & Deploy

```bash
# Standard deployment workflow
git add .
git commit -m "feat: descriptive message"
git push origin gh-pages  # CRITICAL: Push immediately after commit

# Verify push success
git status
# Should show: "Your branch is up to date with 'origin/gh-pages'"
```

### Post-Deployment Verification

- [ ] Wait 1-2 minutes for GitHub Pages auto-deployment
- [ ] Visit https://ssuzuki1063.github.io/aws_sap_studying/
- [ ] New resource appears in navigation
- [ ] Resource count updated correctly
- [ ] Search finds the new resource
- [ ] Resource loads correctly when clicked
- [ ] No broken links or 404 errors
- [ ] Mobile responsive on live site

## Troubleshooting

### Resource Not Appearing in Navigation

**Possible causes:**
- Not added to `data.js` resources array
- Section/category count not updated
- File path in `href` doesn't match actual file location

**Solution:** Verify data.js updates and file paths

### Resource Not Appearing in Search

**Possible causes:**
- Not added to `searchData` array in index.js
- Title mismatch between data.js and searchData

**Solution:** Add to searchData with exact matching title and file path

### Deployment Not Reflecting on Live Site

**Possible causes:**
- Forgot to push to remote: `git push origin gh-pages`
- GitHub Pages deployment delay (can take 1-2 minutes)
- Browser cache showing old version

**Solutions:**
1. Check `git status` to confirm push
2. Wait 1-2 minutes for GitHub Pages
3. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
4. Check GitHub Actions tab for Pages build errors

### W3C Validation Errors

**Common fixes:**
- Add missing `alt` attributes to images
- Close all open tags
- Fix nested `<p>` tags (not allowed in HTML)
- Add `lang="ja"` to `<html>` tag
- Ensure proper DOCTYPE: `<!DOCTYPE html>`

### Quiz Not Loading

**Possible causes:**
- Syntax error in quiz-data-extended.js
- Trailing comma in last object
- Missing comma between objects

**Solution:** Run `node -c quiz-data-extended.js` to find syntax errors
