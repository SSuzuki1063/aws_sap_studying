---
paths:
  - "new_html/**/*"
  - "replace_html/**/*"
  - "src/data/resource-registry.json"
  - "src/data/update-history.json"
  - "scripts/generate-data.mjs"
---

# Resource Integration Workflow

## Always Use Skills

```bash
/skill resource   # ← unified entry point; auto-routes to integrate / replace / delete
/ship             # ← full pipeline: integrate → validate → build → commit → deploy
```

| Intent | Skill |
|--------|-------|
| Add new HTML resource | `/skill integrate` or `/ship` |
| Update existing resource | `/skill replace` |
| Remove a resource | `/skill delete` |

## Post-Integration Data Updates Required

After converting HTML → `.astro` and placing in `src/pages/<category>/`, you **MUST**:
1. Update `src/data/resource-registry.json` (add entry with displayCategory, section)
2. Update `src/data/update-history.json` (add changelog entry at top)
3. Run `node scripts/generate-data.mjs` to regenerate `public/data.js`, `public/index.js`, and `src/data/resources.ts`

Build success (`npm run build`) validates data integrity — no separate integrity check needed.

## Categorization Gotchas

- Networking-related files (VPC, Transit Gateway, IPv6, Flow Logs) → `networking`, NOT `compute-applications`
- Always run W3C validation BEFORE git add/commit, not after
- After integrating, verify the Astro build succeeds (`npm run build`)

## Directory → displayCategory Mapping

| Page Directory | displayCategory (in resource-registry.json) |
|---|---|
| `networking/` | `networking` |
| `security-governance/` | `security-governance` |
| `compute-applications/` | `compute-applications` |
| `storage-database/` | `storage-database` |
| `migration/` | `migration` |
| `analytics-bigdata/` | `analytics-operations` |
| `development-deployment/` | `development-deployment` |
| `content-delivery-dns/` | `content-delivery-dns` |
| `continuous-improvement/` | (maps to one of the 8 above) |
| `cost-control/` | (maps to one of the 8 above) |
| `new-solutions/` | (maps to one of the 8 above) |
| `organizational-complexity/` | (maps to one of the 8 above) |

**Staging directories** (not committed): `new_html/`, `replace_html/`
