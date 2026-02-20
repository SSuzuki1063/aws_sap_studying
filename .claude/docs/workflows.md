# Workflows & File Reference

## Common Workflows

### Add New HTML Learning Resource

**Use the skill** (handles categorization, breadcrumbs, TOC, and data updates):
```bash
/skill integrate
```

Or manually:

1. Place HTML files in `new_html/`
2. Run: `python3 scripts/html_management/integrate_resource_complete.py`
   - Auto-runs: categorize → breadcrumbs → sidebar TOC → home button → prev/next nav → **W3C validation** → **`git add`** (aborts before staging if W3C fails)
3. Update `data.js` AND `index.js` (see Two-Place Update Rule in CLAUDE.md)
4. Test: `python3 server.py`
5. Deploy: `git add data.js index.js && git commit -m "feat: ..." && git push origin gh-pages`

### Replace/Update an Existing Resource

Place the replacement file in `replace_html/` (same filename as the target), then run the integration script. No `data.js`/`index.js` update needed (file path doesn't change).

### Add Quiz Question

Edit `quiz-data-extended.js`. The top-level structure is `quizData['category-key'].questions[]`:

```javascript
const quizData = {
  'category-key': {
    title: 'カテゴリ名',
    icon: '🔒',
    questions: [
      {
        id: 'unique-id',         // Must be globally unique
        question: '質問文',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
        correct: 0,              // Index 0-3 of correct option
        explanation: '詳細な解説'
      }
    ]
  }
}
```

Helper functions at the bottom of `quiz-data-extended.js`:
- `getTotalQuestions(categoryKey)` — returns question count for a category
- `getAllQuestions(categoryKey)` — returns a copy of all questions for a category

Validate: `node -c quiz-data-extended.js`

## File Placement

HTML resources go in **root-level category directories** (NOT in `scripts/`):

| Directory | data.js Category |
|-----------|------------------|
| `networking/` | `networking` |
| `security-governance/` | `security-governance` |
| `compute-applications/` | `compute-applications` |
| `storage-database/` | `storage-database` |
| `migration/` | `migration` |
| `analytics-bigdata/` | `analytics-operations` |
| `development-deployment/` | `development-deployment` |
| `content-delivery-dns/` | `content-delivery-dns` |
| `new-solutions/` | *(various — cross-cutting resources)* |
| `organizational-complexity/` | *(mapped into other categories)* |
| `continuous-improvement/` | *(mapped into other categories)* |
| `cost-control/` | *(mapped into other categories)* |

**Staging directories** (processed by integrate script, not committed directly):
- `new_html/` — New HTML files waiting for integration
- `replace_html/` — Updated versions of existing HTML files

### HTML File Naming Conventions

| Pattern | Example |
|---------|---------|
| `aws-[service]-[topic].html` (preferred) | `aws-lambda-metrics.html` |
| `[service]_[topic]_infographic.html` (legacy) | `ecs_infographic.html` |

Use lowercase. New files must follow the hyphenated `aws-` prefix pattern.

## HTML Authoring Requirements

All new HTML resource files must include:

```html
<!DOCTYPE html>
<html lang="ja">
```

SVG diagrams must be **inline** (not external files) — required for offline capability.
Every SVG must have `role="img"` and `aria-label`.

## Branch Sync Workflow

After direct commits to `gh-pages` (hotfixes), sync back to `master`:

```bash
git checkout master && git merge gh-pages && git push origin master
```

After merging a PR into `master`, deploy to production:

```bash
git checkout gh-pages && git merge master && git push origin gh-pages
```

Feature branch naming: `feature/[service-name]`, `fix/[issue]`, `refactor/[component]`.

## Bulk File Operations

When modifying 100+ HTML files, use **Python scripts** (not shell regex). Validate file counts before and after.

## Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/html_management/integrate_resource_complete.py` | Full integration workflow (use `--skip-validation` to bypass W3C) |
| `scripts/html_management/integrate_new_html.py` | Categorize and move HTML files |
| `scripts/html_management/add_breadcrumbs.py` | Add breadcrumb navigation |
| `scripts/html_management/add_sidebar_toc.py` | Add left sidebar TOC (requires 2+ `<h2>`/`<h3>` tags) |
| `scripts/html_management/add_home_button.py` | Add 「リソース集に戻る」button |
| `scripts/html_management/add_prev_next_nav.py --bottom-nav-only` | Add page bottom navigation |
| `scripts/html_management/fix_html_issues.py` | Fix HTML entity escaping & sidebar TOC positioning |
| `scripts/ci/check_data_integrity.py` | Verify data.js ⟷ index.js sync |
| `scripts/ci/validate_html_w3c.py` | W3C validation (`--pr-mode` for changed files, `--files` for specific files) |
| `scripts/ci/post_integration_check.py` | Verify integrated files have all required components |
| `scripts/ci/check_internal_links.py` | Broken link checker |
| `scripts/ci/check_file_naming.py` | Naming convention check |
| `scripts/accessibility/check_contrast_ratio.py` | WCAG 2.1 color contrast check |
| `scripts/accessibility/suggest_color_fixes.py` | Suggest accessible alternative colors |
| `scripts/accessibility/check_heading_hierarchy.py` | Heading hierarchy (h1→h2→h3) check |
| `scripts/accessibility/fix_heading_hierarchy.py` | Auto-fix heading hierarchy skips |
