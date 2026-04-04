# Workflows & File Reference

## Common Workflows

### Add New HTML Learning Resource

**Use the skill** (recommended — handles HTML→Astro conversion, registry, data generation, validation):
```bash
/skill integrate    # or /skill resource (auto-routes)
/ship               # full autonomous pipeline with self-correcting gates
```

Manual steps (if not using skills):
1. Place HTML files in `new_html/`
2. Convert HTML → `.astro` using rawContent + `set:html` pattern
3. Place in `src/pages/<category>/`
4. Update `src/data/resource-registry.json` + `src/data/update-history.json`
5. Run `node scripts/generate-data.mjs`
6. Run `npm run build` (validates data integrity)
7. Run `python3 scripts/ci/validate_html_w3c.py --pr-mode` (W3C validation)
8. Deploy with `/deploy`

### Replace/Update an Existing Resource

```bash
/skill replace   # place updated file in replace_html/ first
```

### Delete a Resource

```bash
/skill delete
```

### Add Quiz Question

Edit `js/quiz-data-extended.js`. Structure: `quizData['category-key'].questions[]`:

```javascript
{
  id: 'unique-id',
  question: '質問文',
  options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
  correct: 0,              // Index 0-3
  explanation: '詳細な解説'
}
```

Validate: `node -c js/quiz-data-extended.js`

### Deploy

```bash
/deploy   # commit → merge to master → push → GitHub Actions builds → gh-pages
```

## File Placement

Resource pages: `src/pages/<category>/*.astro` (13 page directories, 8 display categories).

**Staging directories** (not committed):
- `new_html/` — New HTML files waiting for integration
- `replace_html/` — Updated versions of existing files

### File Naming

| Pattern | Example |
|---------|---------|
| `aws-[service]-[topic].astro` (preferred) | `aws-lambda-metrics.astro` |
| `[service]_[topic]_infographic.astro` (legacy) | `ecs_infographic.astro` |

Lowercase with hyphens. `build.format: 'file'` → output is `category/filename.html`.

## Bulk File Operations

When modifying 100+ files, use Python scripts (not shell regex). Validate file counts before and after.

## Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-data.mjs` | Generate `public/data.js`, `public/index.js`, `src/data/resources.ts` |
| `scripts/ci/validate_html_w3c.py` | W3C validation (`--pr-mode` / `--files`) |
| `scripts/ci/check_data_integrity.py` | `public/data.js` ⟷ `public/index.js` sync check |
| `scripts/ci/check_css_quality.py` | CSS quality (`--pr-mode`) |
| `scripts/ci/check_internal_links.py` | Broken link checker |
| `scripts/ci/check_file_naming.py` | Naming convention check |
| `scripts/ci/post_integration_check.py` | Verify integrated files have required components |
| `scripts/check_fixed_headers.py` | Fixed header presence check |
| `scripts/accessibility/check_contrast_ratio.py` | WCAG color contrast |
| `scripts/accessibility/check_heading_hierarchy.py` | Heading hierarchy (h1→h2→h3) |
| `scripts/accessibility/fix_heading_hierarchy.py` | Auto-fix heading hierarchy skips |
| `scripts/accessibility/suggest_color_fixes.py` | Suggest accessible alternative colors |
| `scripts/git_hooks/update_last_modified.py` | Auto-update `public/data.js` lastUpdated date |
| `scripts/concept_management/generate_concept_index.py` | Regenerate concept map indexes |
