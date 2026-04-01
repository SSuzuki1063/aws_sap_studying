---
paths:
  - "new_html/**/*"
  - "replace_html/**/*"
  - "src/data/resource-registry.json"
  - "src/data/update-history.json"
  - "scripts/generate-data.mjs"
---

# Resource Integration Workflow

## Always Use Skills (Critical Rule 1)

```bash
/skill resource   # unified entry point; auto-routes to integrate / replace / delete
/ship             # full pipeline: integrate -> validate -> build -> commit -> deploy (self-correcting, max 5 retries)
```

| Intent | Skill |
|--------|-------|
| Add new HTML resource | `/skill integrate` or `/ship` |
| Update existing resource | `/skill replace` |
| Remove a resource | `/skill delete` |

**Never manually copy HTML files into `src/pages/`.** Skills handle HTML-to-Astro conversion, registry updates, data regeneration, and validation.

## Integration Flow

1. Place raw HTML in `new_html/` (new) or `replace_html/` (update)
2. Skill converts HTML -> `.astro` using rawContent + `set:html` pattern
3. File placed in `src/pages/<category>/`
4. `src/data/resource-registry.json` updated (displayCategory, section, priority, etc.)
5. `src/data/update-history.json` updated with changelog entry
6. `node scripts/generate-data.mjs` regenerates `public/data.js`, `public/index.js`, `src/data/resources.ts`
7. `npm run build` validates data integrity
8. W3C validation runs on the built output

## Manual Post-Integration Checklist (if not using skills)

After converting HTML -> `.astro` and placing in `src/pages/<category>/`, you **MUST**:
1. Update `src/data/resource-registry.json` (add entry with displayCategory, section)
2. Update `src/data/update-history.json` (add changelog entry at top)
3. Run `node scripts/generate-data.mjs`
4. Run `npm run build` — build success validates data integrity
5. Run `python3 scripts/ci/validate_html_w3c.py --pr-mode` — W3C validation

## Directory -> displayCategory Mapping

| Page Directory (`src/pages/`) | displayCategory |
|---|---|
| `networking/` | `networking` |
| `security-governance/` | `security-governance` |
| `compute-applications/` | `compute-applications` |
| `storage-database/` | `storage-database` |
| `migration/` | `migration` |
| `analytics-bigdata/` | `analytics-operations` |
| `development-deployment/` | `development-deployment` |
| `content-delivery-dns/` | `content-delivery-dns` |
| `continuous-improvement/` | Maps to one of the 8 above |
| `cost-control/` | Maps to one of the 8 above |
| `new-solutions/` | Maps to one of the 8 above |
| `organizational-complexity/` | Maps to one of the 8 above |

The 8 display categories render in this order: `networking`, `security-governance`, `compute-applications`, `content-delivery-dns`, `development-deployment`, `storage-database`, `migration`, `analytics-operations`.

## Categorization Gotchas

- Networking-related files (VPC, Transit Gateway, IPv6, Flow Logs, Route 53) -> `networking`, NOT `compute-applications`
- Always run W3C validation BEFORE git add/commit, not after
- `generate-data.mjs` auto-assigns categories via keyword matching from `category-meta.json` — verify the assignment is correct
- Orphaned registry entries (no matching `.astro` file) trigger warnings in `generate-data.mjs`

**Staging directories** (not committed): `new_html/` (.gitkeep only), `replace_html/`
