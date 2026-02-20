<!--
SYNC IMPACT REPORT
==================
Version change: (unset) → 1.0.0
Ratification:   2026-02-20 (initial)
Last Amended:   2026-02-20

Modified principles:
  - All sections are NEW (first-time constitution ratification)

Added sections:
  - Core Principles (5 principles)
  - Quality Gates
  - Deployment & Workflow Standards
  - Governance

Removed sections:
  - None (initial fill)

Templates reviewed:
  - .specify/templates/plan-template.md      ✅ Constitution Check section present; no updates needed
  - .specify/templates/spec-template.md      ✅ Aligns with static-site, accessibility constraints; no updates needed
  - .specify/templates/tasks-template.md     ✅ Task categories match principle-driven task types; no updates needed
  - .specify/templates/constitution-template.md  ✅ Source template; no changes needed

Deferred TODOs:
  - None. All placeholders resolved from CLAUDE.md and repo context.
-->

# AWS SAP Study Hub Constitution

## Core Principles

### I. Static-First Architecture

All features MUST be implemented as pure HTML/CSS/JavaScript with no build tools,
no package managers (npm, pip for frontend), no JavaScript frameworks (React, Vue,
Angular), and no external CDN dependencies. Every page MUST function completely
offline after initial load.

**Non-negotiable constraints:**
- No webpack, vite, rollup, or any bundler
- No component frameworks or SPA routers
- CSS changes MUST use the shared `css/` layer (variables → common → layout → responsive → components)
- New component CSS files go in `css/components/` and are added automatically by
  integration scripts — never add them manually

**Rationale:** GitHub Pages hosts this site as a static file server. Build pipelines
add fragility and maintenance burden. The offline constraint ensures the resource
remains useful in exam environments without network access.

### II. GitHub Pages Path Compliance

Every CSS `<link>`, JavaScript `<script>`, and asset reference in HTML files MUST
use the `/aws_sap_studying/` path prefix. Bare paths (e.g., `/css/variables.css`)
will 404 in production on GitHub Pages.

**Non-negotiable rule:**
```html
<!-- CORRECT -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>

<!-- FORBIDDEN -->
<link href="/css/variables.css" rel="stylesheet"/>
```

The local dev server (`server.py`) strips the prefix automatically, so the same
paths work on both localhost and production.

**Rationale:** GitHub Pages serves repositories under a subpath. Hard-coded absolute
paths without the prefix break every HTML file silently — they return HTTP 200 on
localhost but 404 in production, making this class of bug particularly dangerous.

### III. Data-View Separation (Two-Place Update Rule)

`data.js` MUST contain pure data — no HTML tags whatsoever. All HTML generation
happens exclusively in `render.js`. When a new HTML resource is added, it MUST be
registered in **both**:

| File | Field | Consequence if missing |
|------|-------|------------------------|
| `data.js` | `section.resources[]` + `count` + category `count` + `siteStats.totalResources` | Resource invisible in navigation |
| `index.js` | `searchData[]` | Resource invisible in search |

Verify with: `python3 scripts/ci/check_data_integrity.py`

**Rationale:** The navigation and search systems are completely independent. Updating
only one creates silent inconsistency that is hard to detect during manual review
but immediately noticeable to users who cannot find resources.

### IV. Accessibility & Standards Compliance (NON-NEGOTIABLE)

All HTML MUST pass W3C validation **before** git staging. All visual elements MUST
meet WCAG 2.1 AA color contrast requirements. These checks are enforced
automatically by the integration pipeline and block CI.

**W3C validation:**
- Run automatically inside `integrate_resource_complete.py` (step 7); aborts before
  `git add` on failure
- Manual: `python3 scripts/ci/validate_html_w3c.py --pr-mode`
- Skip only with explicit `--skip-validation` flag (document the reason)

**WCAG 2.1 AA color rules:**
- Body text MUST use `#374151` or `#1f2937` (neutral, ≥9.86:1 contrast)
- Accent text MUST use `#dc7600` (not `#FF9900`, which fails on normal-size text)
- Secondary labels MUST use `#6B7280` (4.83:1 ≥ AA threshold)
- Theme colors (AWS Orange, AWS Dark) are for backgrounds/borders/icons — never
  as foreground on same-hue backgrounds (NG-007 rule)
- Asymmetric grids MUST add headings/labels to clarify intent (NG-008 rule)

**Rationale:** This is a public educational resource. Accessibility failures exclude
learners with visual impairments. W3C validation failures produce rendering bugs in
non-Chrome browsers that are difficult to reproduce and debug.

### V. Semantic HTML Structure for TOC Generation

Section headings MUST use `<h2>` and `<h3>` HTML tags. Using `<div class="section-title">`
causes `add_sidebar_toc.py` to silently skip TOC generation with no error, leaving
pages without navigation.

```html
<!-- CORRECT — sidebar TOC generated -->
<h2 class="section-title">セクション名</h2>

<!-- FORBIDDEN — TOC silently skipped -->
<div class="section-title">セクション名</div>
```

The integrate script prints `⚠️【要対応】` when TOC is skipped. That warning MUST
be resolved before committing: convert the `<div>` to `<h2>`.

Files with fewer than 2 `<h2>`/`<h3>` tags are intentionally skipped (no TOC
needed). Files in `new_html/`, `.git/`, `__pycache__/`, or named `index.html`,
`table-of-contents.html`, `quiz.html`, `home.html`, `knowledge-base.html` are
also excluded by design.

**Rationale:** The sidebar TOC is the primary in-page navigation mechanism for
long AWS topic pages. Silent skips create invisible UX degradation that is only
discoverable by visual inspection of every page.

## Quality Gates

The following checks MUST pass before any commit reaches `gh-pages`:

| Check | Command | Blocks CI |
|-------|---------|-----------|
| Data integrity | `python3 scripts/ci/check_data_integrity.py` | Yes |
| W3C HTML validation | `python3 scripts/ci/validate_html_w3c.py --pr-mode` | Yes |
| WCAG color contrast | `python3 scripts/accessibility/check_contrast_ratio.py` | Yes |
| JavaScript syntax | `node -c quiz-data-extended.js data.js render.js index.js quiz-app.js` | Yes |
| Heading hierarchy | `python3 scripts/accessibility/check_heading_hierarchy.py` | Warning |
| Internal links | `python3 scripts/ci/check_internal_links.py` | Warning |
| File naming | `python3 scripts/ci/check_file_naming.py` | Warning |

Blocking failures MUST be resolved before merging. Warning-level checks SHOULD be
resolved; if deferred, document the reason in the PR description.

Post-integration verification: `python3 scripts/ci/post_integration_check.py`
verifies that all integrated files have CSS links, breadcrumbs, TOC, and bottom
navigation.

## Deployment & Workflow Standards

**Integration workflow:** When adding new HTML learning resources, the `/skill integrate`
command (or `integrate_resource_complete.py` manually) MUST be used. It enforces:
categorize → breadcrumbs → sidebar TOC → home button → prev/next nav →
W3C validation → `git add`.

**File placement:**
- New HTML resources: `new_html/` (processed by integrate script)
- Updated HTML resources: `replace_html/` (same filename as target)
- Never commit files from `new_html/` or `replace_html/` directly

**Commit and push are atomic:** A commit without an immediate push does not deploy.
Every commit MUST be followed by:
```bash
git push origin gh-pages
```

**File naming:** New resources MUST follow `aws-[service]-[topic].html` (lowercase,
hyphenated). Legacy underscore patterns are retained for existing files only.

**Bulk operations:** When modifying 100+ HTML files, use Python scripts
(not shell regex). Always validate file counts before and after changes.

## Governance

This constitution supersedes all other development practices documented elsewhere
in the repository. When a conflict exists between this constitution and another
document, this constitution takes precedence; update the other document to align.

**Amendment procedure:**
1. Proposed amendments MUST be drafted as a pull request targeting `master`
2. The PR description MUST include: rationale, affected principles, migration plan
   for any existing files that violate the new rule
3. After merge, `LAST_AMENDED_DATE` and `CONSTITUTION_VERSION` MUST be updated
4. Dependent templates (plan, spec, tasks) MUST be reviewed for propagation

**Versioning policy:**
- MAJOR: Backward-incompatible governance changes (principle removal, redefinition
  that invalidates existing compliant files)
- MINOR: New principle or section added; materially expanded guidance
- PATCH: Clarifications, wording refinements, typo fixes

**Compliance review:** All PRs to `gh-pages` and `master` are reviewed against
this constitution via `.github/workflows/pr-quality-check.yml`. Reviewers MUST
verify that the Constitution Check in `plan.md` is satisfied for any feature work.

For runtime development guidance, refer to `CLAUDE.md` (the authoritative
operational reference) and `.claude/claude_rules.json`.

**Version**: 1.0.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20
