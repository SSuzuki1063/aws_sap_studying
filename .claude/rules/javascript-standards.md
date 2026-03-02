---
paths:
  - "**/*.js"
---

# JavaScript Standards

## Vanilla JS Only — No Frameworks or Build Tools

- NO React, Vue, Angular
- NO webpack, vite, parcel (except Astro/Vite for SSG build pipeline)
- Use pure ES6+ JavaScript features for client-side code
- No external dependencies in client-side code

> **Exception**: Astro SSG is used as the build tool (`astro.config.mjs`, `src/integrations/`).
> Astro-specific JS/MJS files in `src/` and project root config files may use Node.js APIs and imports.

## Conventions

- Function naming: `camelCase` (e.g. `renderCategoryQuickNav`, `performSearch`)
- Variables: `const` for immutable, `let` only when reassignment needed
- Syntax check: `node -c <file.js>`
