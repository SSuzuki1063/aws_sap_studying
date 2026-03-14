---
name: ship
description: |
  Full shipping pipeline: integrate staging → validate categories → W3C validate → Astro build → commit → deploy.
  Use when ready to ship new or updated HTML resources through the complete pipeline with error gates at each step.
  Handles new_html/ (integrate) and replace_html/ (replace) staging directories.
  Each step must pass before the next begins. Any failure halts the pipeline with actionable diagnostics.
allowed-tools: Bash(ls:*), Bash(cat:*), Bash(node:*), Bash(python3:*), Bash(npm run:*), Bash(npx:*), Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git checkout:*), Bash(git merge:*), Bash(git fetch:*), Bash(git rev-parse:*), Bash(gh run:*), Bash(gh api:*), Read, Edit, Glob, Grep, Write
---

# /ship — Full Resource Shipping Pipeline

Six-step pipeline with **error gates** between each step. Any failure halts the pipeline immediately.

## Context (auto-loaded)

- Git status: !`git status --short`
- Current branch: !`git branch --show-current`
- Staging (new_html): !`ls new_html/ 2>/dev/null`
- Staging (replace_html): !`ls replace_html/ 2>/dev/null`
- Recent commits: !`git log --oneline -5`

---

## Pipeline Overview

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│ 1. Integrate │────▶│ 2. Categorize    │────▶│ 3. W3C         │
│   Staging    │ gate│   Validation     │ gate│   Validation   │
└──────────────┘     └──────────────────┘     └────────────────┘
                                                      │ gate
┌──────────────┐     ┌──────────────────┐     ┌───────▼────────┐
│ 6. Deploy    │◀────│ 5. Commit        │◀────│ 4. Astro       │
│   gh-pages   │ gate│   Summary        │ gate│   Build        │
└──────────────┘     └──────────────────┘     └────────────────┘
```

---

## Step 1: Integrate Staging Files

**Goal:** Convert HTML files in `new_html/` or `replace_html/` into Astro resources.

### 1a. Check staging directories

```bash
ls new_html/ 2>/dev/null
ls replace_html/ 2>/dev/null
```

### 1b. Process new files (if new_html/ has files)

For each `.html` file in `new_html/`, perform the **HTML → Astro conversion**:

#### 1b-i. Extract CSS
- Extract all `<style>` blocks from `<head>` into `css/pages/<filename>.css`
- Preserve dark mode media queries and all selectors

#### 1b-ii. Extract body content
- Extract innerHTML of `<body>` (everything between `<body>` and `</body>`)
- Remove all `<script>` tags from the extracted content
- This becomes the `rawContent` template literal

#### 1b-iii. Parse headings for TOC
- Extract `<h2>` and `<h3>` headings with their `id` attributes
- Clean heading text: strip HTML tags, normalize all whitespace (including newlines) to single spaces
- Build `tocItems` array: `{ id: 'heading-id', text: 'Heading Text', level: 2 }`

#### 1b-iv. Determine category and section
- Read `src/data/resource-registry.json` for existing category/section patterns
- Determine the correct category directory (one of 8: networking, security-governance, etc.)
- Determine the section within that category

#### 1b-v. Create .astro file

**CRITICAL: Use the rawContent + set:html pattern** to avoid Astro JSX parsing errors with literal `{}` in SVG styles, code examples, etc.

```astro
---
import ResourceLayout from '../../layouts/ResourceLayout.astro';

const frontmatter = {
  title: 'Page Title',
  category: '<category>',
  tocItems: [
    { id: 'section-id', text: 'Section Title', level: 2 },
    // ...
  ],
  pageCss: '/aws_sap_studying/css/pages/<filename>.css',
};

const rawContent = `
  <!-- paste extracted body content here -->
`;
---
<ResourceLayout frontmatter={frontmatter}>
  <Fragment set:html={rawContent} />
</ResourceLayout>
```

**Template literal escaping rules** for `rawContent`:
- Backticks: `` ` `` → `` \` ``
- Backslashes: `\` → `\\`
- Template expressions: `${` → `\${`

#### 1b-vi. Update data registries

1. **`src/data/resource-registry.json`** — Add entry:
   ```json
   "<category>/<filename>.html": {
     "displayCategory": "<category>",
     "section": "<section-name>"
   }
   ```

2. **`src/data/update-history.json`** — Add changelog entry at the top of the array:
   ```json
   {
     "date": "YYYY-MM-DD",
     "type": "content",
     "title": "新規リソース追加: <titles>",
     "description": "<description>",
     "categories": ["<category1>", "<category2>"],
     "tags": ["tag1", "tag2"]
   }
   ```

3. **Regenerate data files:**
   ```bash
   node scripts/generate-data.mjs
   ```
   This produces both `public/data.js` and `src/data/resources.ts`.

### 1c. Process replacement files (if replace_html/ has files)

Same conversion process as 1b, but **overwrite** the existing `.astro` and `.css` files.
No registry updates needed for replacements (entries already exist).

### 1d. No staging files

If both directories are empty, skip to Step 2 (validate existing uncommitted changes).

### ❌ GATE 1: If any conversion fails, STOP.
Report which files failed and why. Do NOT proceed to Step 2.

### ⚠️ Common Astro Build Pitfalls (from past failures)

| Problem | Cause | Solution |
|---------|-------|----------|
| `Expected } but found :` | Literal `{}` in body HTML (SVG `<style>`, code examples) | Use `rawContent` + `set:html` pattern (NOT direct template) |
| `Expected ) but found {` | `{'{'}` escaping inside `<style>` tags | Never use `{'{'}` escaping — use `rawContent` pattern instead |
| `Unterminated string literal` | Multiline text in tocItems strings | `clean_text()`: strip HTML, normalize whitespace to single spaces |
| Missing CSS styles | `<style>` left in body instead of extracted | Extract ALL `<style>` from `<head>` to `css/pages/` |

---

## Step 2: Category Validation

**Goal:** Verify every resource file's frontmatter `category` matches its directory.

```bash
node scripts/validate-categories.js --verbose
```

This checks all `src/pages/<category>/*.astro` files: the frontmatter `category: 'X'` field must equal the directory name `X`.

### ❌ GATE 2: If validation fails (exit ≠ 0), STOP.

Report each mismatched file. Offer to fix by either:
- Moving the file to the correct directory, OR
- Updating the frontmatter category to match the directory

Do NOT proceed to Step 3 until all files pass.

---

## Step 3: W3C HTML Validation

**Goal:** Ensure all changed HTML passes W3C validation.

### 3a. HTML validation (changed files only)

```bash
python3 scripts/ci/validate_html_w3c.py --pr-mode
```

### 3b. CSS validation (changed files only)

```bash
npm run qa:css-validate:pr
```

### 3c. Auto-fix common W3C errors

If validation fails, attempt to fix these common patterns:
- **Duplicate IDs** → Append `-2`, `-3` suffix
- **Missing `alt` on `<img>`** → Add descriptive `alt` from context
- **Missing `role="img"` on `<svg>`** → Add `role="img"`
- **`<section>` without heading** → Add an `<h2>` or convert to `<div>`
- **Stray end tags** → Remove them
- **Unclosed elements** → Close them

After fixing, re-run validation:
```bash
python3 scripts/ci/validate_html_w3c.py --pr-mode
```

### ❌ GATE 3: If validation still fails after auto-fix attempt, STOP.

Show the remaining errors with line numbers. Do NOT proceed to Step 4.
The user must manually fix these before re-running `/ship`.

---

## Step 4: Astro Build

**Goal:** Verify the site builds successfully with all changes.

```bash
npm run build
```

This runs the full pipeline:
1. `sync:concepts` — Copy concept map JSON
2. `sync:static` — Copy CSS/JS/images to public/
3. `generate-data.mjs` — Produce data.js + resources.ts
4. `astro build` — SSG render to dist/

### 4a. Verify critical outputs exist

After build, confirm these exist in `dist/`:
```bash
ls dist/index.html dist/data.js dist/css/common.css dist/js/ 2>/dev/null
```

### ❌ GATE 4: If build fails (exit ≠ 0), STOP.

Show the build error output. Common causes:
- Literal `{}` in body HTML → use rawContent + set:html pattern (see Step 1 pitfalls table)
- TypeScript errors in `.astro` files
- Missing imports
- Invalid frontmatter syntax
- `generate-data.mjs` failure (check resource-registry.json syntax)

Do NOT proceed to Step 5.

---

## Step 5: Commit with Summary

**Goal:** Create a well-structured commit capturing all changes.

### 5a. Data integrity check

Build success (Step 4) guarantees data integrity since `generate-data.mjs` produces both `public/data.js` and `src/data/resources.ts` from `resource-registry.json`. No separate integrity script needed.

Optionally verify:
```bash
python3 scripts/ci/check_data_integrity.py
```
Note: This script checks `public/data.js` ⟷ `public/index.js` consistency. Warnings are acceptable if the build succeeded.

### 5b. Stage changes

```bash
git add -A
```

Review what's staged:
```bash
git status
git diff --cached --stat
```

### 5c. Generate commit message

Analyze the staged changes and create a Conventional Commits message:

- **New resources:** `feat: add N new resources — <brief titles>`
- **Updated resources:** `fix(<category>): update <resource-name> — <what changed>`
- **Multiple resources:** `feat: add N new resources across <categories>`
- **Mixed operations:** `feat: add N resources, update M resources`

Include a body listing each file changed:
```
feat: add 3 new resources — Global Accelerator IoT, E2E暗号化, VPC DNS設定

- content-delivery-dns/aws-global-accelerator-iot-guide.astro (new)
- security-governance/e2e-encryption-guide.astro (new)
- networking/vpc-dns-settings-guide.astro (new)
- Updated resource-registry.json, update-history.json
- Passed: category validation, W3C, Astro build
```

### 5d. Commit

```bash
git commit -m "<message>"
```

### ❌ GATE 5: If commit fails (e.g., pre-commit hook), STOP.

If the pre-commit hook (`validate-categories.js`) fails, that means Step 2 was somehow bypassed — go back and fix. Do NOT use `--no-verify`.

---

## Step 6: Deploy to gh-pages

**Goal:** Push to master and verify GitHub Actions deployment succeeds.

### 6a. Ensure on master

If not on `master`:
```bash
git checkout master
git merge <source-branch> -m "Merge branch '<source-branch>' into master"
```

### 6b. Push

```bash
git push origin master
```

### 6c. Monitor deployment

```bash
gh run list --limit 3
gh run watch <run-id> --exit-status
```

### 6d. Verify

If the workflow succeeds:
```bash
git fetch origin gh-pages
```

### ❌ GATE 6: If deployment fails, STOP.

Show failed logs:
```bash
gh run view <run-id> --log-failed
```

Report the failure and do NOT retry automatically. The user should investigate.

---

## Final Report

On success, output this summary:

```
╔══════════════════════════════════════════════════╗
║  🚀 SHIP COMPLETE                               ║
╠══════════════════════════════════════════════════╣
║  ✅ Step 1: Integration      — PASSED           ║
║  ✅ Step 2: Category check   — PASSED           ║
║  ✅ Step 3: W3C validation   — PASSED           ║
║  ✅ Step 4: Astro build      — PASSED           ║
║  ✅ Step 5: Commit           — <hash> <message> ║
║  ✅ Step 6: Deploy           — Run #<id> ✓      ║
╠══════════════════════════════════════════════════╣
║  🌐 https://ssuzuki1063.github.io/aws_sap_studying/
╚══════════════════════════════════════════════════╝
```

On failure, output which step failed and all steps that were skipped:

```
╔══════════════════════════════════════════════════╗
║  ❌ SHIP FAILED at Step N                        ║
╠══════════════════════════════════════════════════╣
║  ✅ Step 1: Integration      — PASSED           ║
║  ✅ Step 2: Category check   — PASSED           ║
║  ❌ Step 3: W3C validation   — FAILED           ║
║  ⊘ Step 4: Astro build      — SKIPPED          ║
║  ⊘ Step 5: Commit           — SKIPPED          ║
║  ⊘ Step 6: Deploy           — SKIPPED          ║
╠══════════════════════════════════════════════════╣
║  Fix the errors above, then re-run /ship         ║
╚══════════════════════════════════════════════════╝
```
