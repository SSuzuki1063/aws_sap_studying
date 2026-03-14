# Concept Map System (`concept-map.html`)

A second data-driven feature with its own architecture separate from the main navigation system.

## Directory Structure

```
concepts/
├── axes/        # L0: 8 design axes (change rarely)
├── domains/     # L1: 8 AWS domains (change rarely)
├── services/    # L2 svc-*.json files — L3 concepts and L4 keywords are NESTED inside these
├── concept-index.json   ← AUTO-GENERATED — never hand-edit
└── search-index.json    ← AUTO-GENERATED — never hand-edit
```

## ID Prefix Convention (4 layers)

`axis-` / `dom-` / `svc-` / `con-` / `kw-`

## Key Rules

- **L3 and L4 have no standalone files** — they are nested inside their parent `svc-*.json`.
- After any edit to `concepts/services/`:

```bash
python3 scripts/concept_management/generate_concept_index.py --validate  # validate
python3 scripts/concept_management/generate_concept_index.py              # regenerate indexes
```

## JS Engine

`js/concept-engine/DiagramRenderer.js` — native SVG rendering (IIFE, `ConceptEngine.diagram`).

- Supports `decision_tree` / `flow` (BFS layout) / `comparison` (table)
- No Mermaid, D3, or external libraries
- Lazy-loaded on first toggle expand

## References

Full schema and valid values: `.claude/skills/concept-map-manager/references/`
