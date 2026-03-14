---
paths:
  - "public/data.js"
  - "public/index.js"
  - "public/render.js"
  - "src/data/resource-registry.json"
  - "src/data/update-history.json"
---

# Data-Driven Navigation Rules

## Registry-Driven Data (Critical Rule 2)

Resource data is managed via `src/data/resource-registry.json` (single source of truth). **Do NOT manually edit `public/data.js` or `public/index.js`** — they are auto-generated.

### Adding/Updating Resources

1. Update `src/data/resource-registry.json` (add/modify entry)
2. Update `src/data/update-history.json` (add changelog entry at top)
3. Run `node scripts/generate-data.mjs` → generates `public/data.js`, `public/index.js`, `src/data/resources.ts`

Or use `/skill resource` / `/ship` which handle all of this automatically.

## data.js — Pure Data Only

- **NO HTML tags** in data objects — pure data only (text, numbers, objects, arrays)
- All HTML generation happens in `render.js` template functions
- Keep data and presentation logic completely separated

```javascript
// ❌ WRONG
{ title: '<h2>AWS Lambda</h2>' }
// ✅ CORRECT
{ title: 'AWS Lambda' }
```

**Resource shape** (generated into `categoriesData[].sections[].resources[]`):
```javascript
{ title: 'Resource Name', href: 'category/filename.html', priority: 'high' }
// priority: 'high' | 'medium' | 'low' | omitted → defaults to 'medium'
```

**searchData shape** (generated into `public/index.js`):
```javascript
{ title: 'Resource Name', category: 'カテゴリ名', file: 'category/filename.html' }
```

## render.js — Single Template Pattern

ALL HTML generation must happen in centralized template functions:
- Use template literals to generate HTML from `data.js` objects
- NO scattered HTML generation across multiple files
- Functions: `renderCategoryQuickNav`, `renderResourceList`, `renderSection`, `renderMajorCategory`, `renderAllCategories`
- Used by `index.astro` only (learning-resources uses build-time rendering via `src/data/resources.ts`)

## Verification

```bash
python3 scripts/ci/check_data_integrity.py            # public/data.js ⟷ public/index.js sync
npm run build                                          # Build success = data integrity validated
```

> ⚠️ `public/data.js` の `lastUpdated` 行末の `// GIT_LAST_COMMIT_DATE` コメントは **削除禁止**。
> pre-commit hook がこのマーカーで日付を自動更新する。
