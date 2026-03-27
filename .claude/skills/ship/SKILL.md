---
name: ship
description: |
  Autonomous shipping pipeline with self-correcting quality gates.
  Integrates staging → validates categories → runs Build/W3C/E2E gates in self-correcting loops (max 5 iterations each) → commits → deploys.
  Handles new_html/ (integrate) and replace_html/ (replace) staging directories.
  ALL three quality gates must pass with ZERO errors before commit. Failures are auto-diagnosed and fixed.
allowed-tools: Bash(ls:*), Bash(cat:*), Bash(node:*), Bash(python3:*), Bash(npm run:*), Bash(npx:*), Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git checkout:*), Bash(git merge:*), Bash(git fetch:*), Bash(git rev-parse:*), Bash(gh run:*), Bash(gh api:*), Bash(kill:*), Bash(curl:*), Bash(lsof:*), Read, Edit, Glob, Grep, Write
---

# /ship — Autonomous Resource Shipping Pipeline

Five-step pipeline with **self-correcting quality gates**. Steps 1-2 are linear gates (halt on fail). Step 3 contains three quality gates that **autonomously diagnose and fix errors** in a loop (max 5 iterations each). Only after ALL three gates pass with zero errors does the pipeline proceed to commit and deploy.

## Context (auto-loaded)

- Git status: !`git status --short`
- Current branch: !`git branch --show-current`
- Staging (new_html): !`ls new_html/ 2>/dev/null`
- Staging (replace_html): !`ls replace_html/ 2>/dev/null`
- Recent commits: !`git log --oneline -5`

---

## Pipeline Overview

```
┌──────────────┐     ┌──────────────────┐
│ 1. Integrate │────▶│ 2. Categorize    │
│   Staging    │ gate│   Validation     │
└──────────────┘     └───────┬──────────┘
                             │ gate
              ┌──────────────▼──────────────┐
              │  3. QUALITY GATES            │
              │  ┌────────┐  ┌────────┐     │
              │  │ Gate A ├─▶│ Gate B │     │
              │  │ Build  │  │ W3C    │     │
              │  └──▲─────┘  └──┬─▲───┘     │
              │     │fix        │ │fix      │
              │     └───────────┘ │         │
              │  rebuild bridge   │         │
              │       ┌───────────┘         │
              │  ┌────▼───┐                 │
              │  │ Gate C │                 │
              │  │ E2E    │                 │
              │  └──▲──┬──┘                 │
              │     │  │fix                 │
              │     └──┘                    │
              └──────────────┬──────────────┘
                             │ all 3 pass
              ┌──────────────▼──────────────┐
              │ 4. Commit   │  5. Deploy    │
              └─────────────┴───────────────┘
```

---

## Iteration Tracking

Maintain a running log throughout the pipeline. Initialize at the start:

```
gate_log = {
  gateA: [],   // { iteration, status, errors_found, fixes_applied[] }
  gateB: [],
  gateC: [],
}
total_fixes = 0
```

Record each iteration's outcome as you go. This log feeds the Final Report.

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

Use the **Category Reference Table** below to classify. NEVER guess — always match against the table.

| displayCategory | AWS Services | Sections |
|---|---|---|
| `networking` | VPC, Subnet, Security Group, NACL, ENI, IPv6, Flow Logs, Transit Gateway, VPN, Direct Connect, VGW, DGW, PrivateLink, VPC Endpoint, VPC Peering, Network Firewall, Cloud WAN, Prefix List | VPC & ネットワーク基礎 / Direct Connect & ハイブリッドネットワーク / Transit Gateway & ゲートウェイ |
| `security-governance` | IAM, STS, SSO, Organizations, SCP, AWS Config, CloudTrail, GuardDuty, Security Hub, Inspector, Macie, KMS, ACM, Secrets Manager, WAF, Shield, Firewall Manager, Control Tower | IAM & 認証・認可 / Organizations & ガバナンス / セキュリティ監視・脅威検知 / 暗号化 & 証明書管理 |
| `compute-applications` | EC2, Placement Groups, AMI, Auto Scaling, ELB (ALB/NLB/CLB), Lambda, ECS, EKS, Fargate, App Runner, Elastic Beanstalk, SSM, Patch Manager | EC2 & インスタンス管理 / Auto Scaling & ロードバランシング / Lambda & サーバーレス / コンテナ & アプリケーション統合 / システム運用 & パッチ管理 |
| `content-delivery-dns` | CloudFront, Route 53, Global Accelerator, WAF (CloudFront-specific) | CloudFront & コンテンツ配信 / Route53 & DNS管理 |
| `development-deployment` | CodePipeline, CodeBuild, CodeDeploy, CodeCommit, CloudFormation, CDK, SAM, API Gateway, EventBridge, SNS, SQS, Step Functions | CI/CD & デプロイ / CI/CD & デプロイメント / IaC & CloudFormation / API & イベント駆動 |
| `storage-database` | S3, EBS, EFS, FSx, Storage Gateway, RDS, Aurora, DynamoDB, ElastiCache, Redshift, DocumentDB | S3 & オブジェクトストレージ / ブロック & ファイルストレージ / データベース & キャッシング |
| `migration` | DMS, SCT, Migration Hub, Application Discovery Service, MGN, DataSync, Transfer Family, Backup (DR context) | DMS & データベース移行 / Migration Hub & 移行戦略 / ディザスタリカバリ (DR) |
| `analytics-operations` | Athena, Glue, EMR, Kinesis, QuickSight, Lake Formation, CloudWatch, X-Ray, OpenSearch | データ分析 / 分析・運用 / 理解度クイズ・用語集 |

**Ambiguous services (frequently misclassified):**
- Route 53, CloudFront, Global Accelerator → `content-delivery-dns` (NOT networking)
- WAF → `security-governance` (default) or `content-delivery-dns` (CloudFront-specific context)
- VPN, PrivateLink → `networking` (NOT security)
- Systems Manager → `compute-applications` (manages compute instances)
- Backup → `migration` (DR context) or `storage-database` (storage context)

**Page directory ≠ displayCategory:** Files in `new-solutions/`, `continuous-improvement/`, `cost-control/`, `organizational-complexity/` are mapped to one of the 8 display categories via `displayCategory` in `resource-registry.json`.

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

4. **`src/data/category-descriptions.json`** — Consider updating if:
   - A new high-priority/advanced resource should appear in `recommended_first` (max 5 per category)
   - The resource is the first in a new topic area that should be reflected in `key_topics`
   - This file is NOT auto-generated — it requires manual editing
   - Changes here are picked up by `npm run build` (no script needed)

### 1c. Process replacement files (if replace_html/ has files)

Same conversion process as 1b, but **overwrite** the existing `.astro` and `.css` files.
No registry updates needed for replacements (entries already exist).

### 1d. No staging files

If both directories are empty, skip to Step 2 (validate existing uncommitted changes).

### GATE 1: If any conversion fails, STOP.
Report which files failed and why. Do NOT proceed to Step 2.

### 1e. Clean up staging directories

After successful integration, delete the original HTML files from staging:

```bash
# Remove processed files
rm -f new_html/*.html 2>/dev/null
rm -f replace_html/*.html 2>/dev/null

# Remove empty staging directories (optional)
rmdir new_html 2>/dev/null
rmdir replace_html 2>/dev/null
```

Report which files were cleaned up. This prevents duplicate processing on subsequent `/ship` runs.

---

## Step 2: Category Validation

**Goal:** Verify (a) frontmatter `category` matches directory, and (b) `displayCategory` in registry is correct for the AWS service.

### 2a. Frontmatter/directory consistency

```bash
node scripts/validate-categories.js --verbose
```

This checks all `src/pages/<category>/*.astro` files: the frontmatter `category: 'X'` field must equal the directory name `X`.

### 2b. displayCategory verification (new/changed resources only)

For each resource added or modified in this `/ship` run, verify:

1. `displayCategory` in `resource-registry.json` matches the **Category Reference Table** in Step 1b-iv
2. `section` matches one of the listed sections for that category
3. If the service is in the "Ambiguous services" list, the decision rule was followed

This is a manual check — cross-reference the resource's AWS service against the table. If a mismatch is found, fix `resource-registry.json` and re-run `node scripts/generate-data.mjs` before proceeding.

### GATE 2: If validation fails (exit ≠ 0) or displayCategory is wrong, STOP.

Report each mismatched file. Offer to fix by either:
- Moving the file to the correct directory, OR
- Updating the frontmatter category to match the directory, OR
- Correcting the `displayCategory`/`section` in `resource-registry.json`

Do NOT proceed to Step 3 until all checks pass.

---

## Step 3: Quality Gates (Self-Correcting)

**Three sequential quality gates, each with a self-correcting loop (max 5 iterations). ALL THREE must pass with ZERO errors before proceeding to Step 4.**

The gates run in order: **Build → W3C → E2E**. If a later gate's fix invalidates an earlier gate, re-run the earlier gate with its remaining iteration budget.

---

### Gate A: Astro Build (max 5 iterations)

**Goal:** Verify the site builds successfully with all changes.

#### Loop Structure

```
gateA_iteration = 0

LOOP:
  gateA_iteration += 1
  IF gateA_iteration > 5: HALT — "Gate A: exceeded max iterations"

  Run: npm run build
  Capture full stdout + stderr

  IF exit code == 0:
    Verify critical outputs:
      ls dist/index.html dist/data.js dist/css/common.css dist/js/ 2>/dev/null
      ls dist/learning-resources.html dist/learning-resources/ 2>/dev/null
    Log: gate_log.gateA.push({ iteration: N, status: 'PASS' })
    BREAK — Gate A passed

  Parse error output to identify: file path, line number, error message
  Read the failing source file
  Diagnose root cause using the Error Pattern Table below
  Apply the fix

  IF no fix could be determined:
    HALT — "Gate A: unfixable build error" + full error output

  Log: gate_log.gateA.push({ iteration: N, status: 'FAIL', errors_found: [...], fixes_applied: [...] })
  total_fixes += 1
  GOTO LOOP
```

#### Gate A Error Pattern Table

| Error Pattern in Output | Diagnosis | Auto-Fix |
|---|---|---|
| `Expected } but found :` | Literal `{}` in HTML body (SVG `<style>`, code blocks) | Convert `.astro` file to use `rawContent` + `set:html` pattern |
| `Expected ) but found {` | `{'{'}` escaping inside `<style>` tags | Replace with `rawContent` pattern instead of JSX escaping |
| `Unterminated string literal` | Multiline text in tocItems strings | Strip HTML tags, normalize all whitespace to single spaces |
| `Unterminated template literal` | Unescaped backtick in rawContent | Escape: `` ` `` → `` \` `` |
| `${` interpreted as expression | Unescaped `${` in rawContent | Escape: `${` → `\${` |
| `is not defined` / `Cannot find module` | Missing import in frontmatter | Add the missing import statement |
| `Type 'X' is not assignable` | TypeScript type error | Fix based on specific type mismatch |
| `generate-data.mjs` failure | JSON syntax error in registry | Parse and fix the JSON |
| Missing CSS styles in output | `<style>` left in body instead of extracted to css/pages/ | Extract all `<style>` from `<head>` to `css/pages/` |

#### Build Outputs

After build, confirm these exist in `dist/`:
- `dist/index.html`, `dist/data.js`, `dist/css/common.css`, `dist/js/`
- `dist/learning-resources.html`, `dist/learning-resources/` (8 category detail pages)

---

### Gate B: W3C Validation (max 5 iterations)

**Goal:** Ensure all changed HTML and CSS passes W3C validation.

#### Important: Track whether any fixes are applied

```
gateB_fixes_applied = false
```

If any fix is applied during Gate B, a rebuild is required before Gate C (see Rebuild Bridge below).

#### Loop Structure

```
gateB_iteration = 0

LOOP:
  gateB_iteration += 1
  IF gateB_iteration > 5: HALT — "Gate B: exceeded max iterations"

  Run HTML validation:
    python3 scripts/ci/validate_html_w3c.py --pr-mode
  Capture output and exit code → html_result

  Run CSS validation:
    npm run qa:css-validate:pr
  Capture output and exit code → css_result

  IF html_result == 0 AND css_result == 0:
    Log: gate_log.gateB.push({ iteration: N, status: 'PASS' })
    BREAK — Gate B passed

  Parse error output into structured list:
    [{file, line, col, message, extract}, ...]

  IMPORTANT: W3C errors reference line numbers in the BUILT HTML (dist/),
  not in the .astro source. To fix:
    1. Identify which .astro source file produced the error (file path maps directly)
    2. Find the corresponding content in the rawContent template literal
    3. Apply the fix in the rawContent
    4. Set gateB_fixes_applied = true

  For CSS errors, fix directly in css/pages/*.css files.

  For each error, attempt auto-fix using the Error Pattern Table below.

  IF no fixes could be applied:
    HALT — "Gate B: unfixable W3C errors" + remaining errors

  Log: gate_log.gateB.push({ iteration: N, status: 'FAIL', errors_found: [...], fixes_applied: [...] })
  total_fixes += (number of fixes)
  GOTO LOOP
```

#### Gate B Error Pattern Table

| W3C Error Message | Auto-Fix |
|---|---|
| `Duplicate ID "X"` | Append `-2`, `-3` suffix to duplicate IDs in the `.astro` rawContent |
| `An img element must have an alt attribute` | Add `alt=""` (decorative) or infer descriptive text from context |
| `Stray end tag "X"` | Remove the stray end tag |
| `Unclosed element "X"` | Add the closing tag |
| `Element "X" not allowed as child of element "Y"` | Restructure the HTML (e.g., move block element out of inline) |
| `The role attribute must not be used on a X element` | Remove or change the role attribute |
| `Bad value X for attribute Y` | Fix the attribute value |
| `Section lacks heading` | Add an `<h2>` or convert `<section>` to `<div>` |
| SVG missing `role="img"` | Add `role="img"` to the `<svg>` element |
| CSS parse error | Fix the CSS syntax in `css/pages/*.css` |

#### Rebuild Bridge (Gate B → Gate C)

After Gate B passes, if `gateB_fixes_applied == true`:

1. Run `npm run build` to incorporate the W3C fixes
2. If the rebuild **succeeds**: proceed to Gate C
3. If the rebuild **fails**: return to Gate A with its **remaining** iteration budget (do not reset to 0). If Gate A originally used 1 iteration, it has 4 remaining. If Gate A is now at 5/5, HALT.

```
IF gateB_fixes_applied:
  Run: npm run build
  IF exit code != 0:
    IF gateA_iteration >= 5: HALT — "Gate A: exceeded max after rebuild bridge"
    Re-enter Gate A loop (continues from current gateA_iteration)
```

---

### Gate C: Playwright E2E Tests (max 5 iterations)

**Goal:** Verify the fully-built site passes all E2E tests.

#### Server Management

Do NOT let Playwright's `webServer` config handle the build (it would trigger a redundant `npm run preview:test`). Instead, manage the preview server explicitly:

**Start the server before the first test run:**
```bash
# Kill any existing process on port 4321
lsof -ti:4321 | xargs kill -9 2>/dev/null

# Start preview server in background
npx astro preview --port 4321 &

# Wait for server to be ready (poll up to 30 seconds)
for i in $(seq 1 30); do
  curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/aws_sap_studying/ | grep -q 200 && break
  sleep 1
done
```

**After all Gate C iterations complete (pass or fail), kill the server:**
```bash
lsof -ti:4321 | xargs kill -9 2>/dev/null
```

#### Loop Structure

```
gateC_iteration = 0

Start preview server (see above)

LOOP:
  gateC_iteration += 1
  IF gateC_iteration > 5:
    Kill preview server
    HALT — "Gate C: exceeded max iterations"

  Run: npx playwright test --project=chromium
  Capture full stdout + stderr

  IF exit code == 0:
    Log: gate_log.gateC.push({ iteration: N, status: 'PASS', test_count: <N tests> })
    Kill preview server
    BREAK — Gate C passed

  Parse Playwright output to identify:
    - Which test file failed
    - The assertion that failed (expected vs. received)
    - The page URL being tested

  For each failure, trace back to the source:
    1. Read the failing test file to understand what it checks
    2. Identify which .astro source file or CSS/JS file produces the failing behavior
    3. Apply the fix

  IF no fix could be determined:
    Kill preview server
    HALT — "Gate C: unfixable test failure" + Playwright output

  After fixing source files:
    Kill preview server
    Rebuild: npm run build
    IF build fails: re-enter Gate A with remaining budget
    Restart preview server (same commands as initial start)

  Log: gate_log.gateC.push({ iteration: N, status: 'FAIL', failures: [...], fixes_applied: [...] })
  total_fixes += (number of fixes)
  GOTO LOOP
```

#### Gate C Error Pattern Table

| Failure Pattern | Diagnosis | Auto-Fix |
|---|---|---|
| `net::ERR_CONNECTION_REFUSED` | Preview server not running | Restart the server |
| `expect(received).toBe(200)` on link | Broken internal link | Fix the `href` in source .astro file |
| `Timed out waiting for selector` | DOM element missing | Check build output for the expected element; fix source |
| `expect(received).toContainText` | Text content mismatch | Verify source content matches expected text |
| `expect(received).toHaveCSS` | CSS property mismatch | Fix in the relevant css/pages/ file |
| axe-core accessibility violation | A11y rule failure | Fix based on specific rule (missing label, contrast, etc.) |
| Snapshot mismatch | Visual regression | If change is intentional: update snapshot; if not: fix source |
| Navigation/routing error | Broken navigation link | Fix href or routing in source |

---

### Quality Gate Failure Protocol

If ANY gate exhausts its 5 iterations without passing:

1. **Kill the preview server** (if Gate C was reached)
2. **Print the full iteration log** showing what was attempted and fixed at each iteration
3. **Print remaining unfixed errors** with file paths and line numbers
4. **Do NOT proceed** to Step 4 (commit) or Step 5 (deploy)
5. **Output the failure report** (see Final Report section)

---

## Step 4: Commit with Summary

**Goal:** Create a well-structured commit capturing all changes and gate iterations.

### 4a. Data integrity check

Build success (Gate A) guarantees data integrity since `generate-data.mjs` produces both `public/data.js` and `src/data/resources.ts` from `resource-registry.json`. No separate integrity script needed.

Optionally verify:
```bash
python3 scripts/ci/check_data_integrity.py
```

### 4b. Stage changes

```bash
git add -A
```

Review what's staged:
```bash
git status
git diff --cached --stat
```

### 4c. Generate commit message

Analyze the staged changes and create a Conventional Commits message:

- **New resources:** `feat: add N new resources — <brief titles>`
- **Updated resources:** `fix(<category>): update <resource-name> — <what changed>`
- **Multiple resources:** `feat: add N new resources across <categories>`
- **Mixed operations:** `feat: add N resources, update M resources`

Include a body listing each file changed AND the gate iteration summary:
```
feat: add 3 new resources — Global Accelerator IoT, E2E暗号化, VPC DNS設定

- content-delivery-dns/aws-global-accelerator-iot-guide.astro (new)
- security-governance/e2e-encryption-guide.astro (new)
- networking/vpc-dns-settings-guide.astro (new)
- Updated resource-registry.json, update-history.json

Quality gates: A(1) B(2) C(1) — 2 auto-fixes applied
```

### 4d. Commit

```bash
git commit -m "<message>"
```

### GATE 4: If commit fails (e.g., pre-commit hook), STOP.

If the pre-commit hook (`validate-categories.js`) fails, that means Step 2 was somehow bypassed — go back and fix. Do NOT use `--no-verify`.

---

## Step 5: Deploy to gh-pages

**Goal:** Push to master and verify GitHub Actions deployment succeeds.

### 5a. Ensure on master

If not on `master`:
```bash
git checkout master
git merge <source-branch> -m "Merge branch '<source-branch>' into master"
```

### 5b. Push

```bash
git push origin master
```

### 5c. Monitor deployment

```bash
gh run list --limit 3
gh run watch <run-id> --exit-status
```

### 5d. Verify

If the workflow succeeds:
```bash
git fetch origin gh-pages
```

### GATE 5: If deployment fails, STOP.

Show failed logs:
```bash
gh run view <run-id> --log-failed
```

Report the failure and do NOT retry automatically. The user should investigate.

---

## Final Report

### On Success

```
+======================================================+
|  SHIP COMPLETE (autonomous)                          |
+======================================================+
|  Step 1: Integration         — PASSED                |
|  Step 2: Category validation — PASSED                |
|  Gate A: Astro Build         — PASSED (N iterations) |
|  Gate B: W3C Validation      — PASSED (N iterations) |
|  Gate C: Playwright E2E      — PASSED (N iterations) |
|  Step 4: Commit              — <hash> <message>      |
|  Step 5: Deploy              — Run #<id>             |
+======================================================+
|  Auto-fix log:                                       |
|  [A-1] FIX: <description>                            |
|  [B-1] FIX: <description>                            |
|  [B-2] FIX: <description>                            |
|  ...                                                 |
+------------------------------------------------------+
|  Total auto-fixes: N | Total iterations: N           |
|  https://ssuzuki1063.github.io/aws_sap_studying/     |
+======================================================+
```

If all gates passed on the first iteration (no auto-fixes needed):

```
+======================================================+
|  SHIP COMPLETE (clean run)                           |
+======================================================+
|  Step 1: Integration         — PASSED                |
|  Step 2: Category validation — PASSED                |
|  Gate A: Astro Build         — PASSED (1 iteration)  |
|  Gate B: W3C Validation      — PASSED (1 iteration)  |
|  Gate C: Playwright E2E      — PASSED (N tests, 0 fail)|
|  Step 4: Commit              — <hash> <message>      |
|  Step 5: Deploy              — Run #<id>             |
+======================================================+
|  No auto-fixes needed. Clean run.                    |
|  https://ssuzuki1063.github.io/aws_sap_studying/     |
+======================================================+
```

### On Failure

```
+======================================================+
|  SHIP FAILED at Gate X (iteration N/5)               |
+======================================================+
|  Step 1: Integration         — PASSED                |
|  Step 2: Category validation — PASSED                |
|  Gate A: Astro Build         — PASSED (N iterations) |
|  Gate B: W3C Validation      — FAILED (5/5)          |
|  Gate C: Playwright E2E      — SKIPPED               |
|  Step 4: Commit              — SKIPPED               |
|  Step 5: Deploy              — SKIPPED               |
+======================================================+
|  Auto-fix attempts:                                  |
|  [B-1] FIX: Added alt="" to 2 img elements           |
|  [B-2] FIX: Removed stray </div> end tag             |
|  [B-3] FIX: Renamed duplicate ID "overview"          |
|  [B-4] FIX: Converted <section> to <div>             |
|  [B-5] FAIL: Could not fix remaining errors          |
|                                                      |
|  REMAINING ERRORS:                                   |
|  vpc-flow-logs.html:42 — Element X not allowed       |
|  vpc-flow-logs.html:87 — Bad value for attribute     |
+------------------------------------------------------+
|  Manual intervention required.                       |
|  Fix the errors above, then re-run /ship             |
+======================================================+
```

---

## Common Astro Build Pitfalls (Reference)

| Problem | Cause | Solution |
|---------|-------|----------|
| `Expected } but found :` | Literal `{}` in body HTML (SVG `<style>`, code examples) | Use `rawContent` + `set:html` pattern (NOT direct template) |
| `Expected ) but found {` | `{'{'}` escaping inside `<style>` tags | Never use `{'{'}` escaping — use `rawContent` pattern instead |
| `Unterminated string literal` | Multiline text in tocItems strings | `clean_text()`: strip HTML, normalize whitespace to single spaces |
| Missing CSS styles | `<style>` left in body instead of extracted | Extract ALL `<style>` from `<head>` to `css/pages/` |
| Category page resource links 404 | Resource hrefs resolve wrong from `learning-resources/` | `[category].astro` prefixes `../` to all resource hrefs — verify adjustment exists |
| Search results link to wrong page | `index.js` uses relative paths | Search links must use absolute paths: `/aws_sap_studying/` + `item.file` |
| Category page missing from build | `category-descriptions.json` missing entry for new category | Add entry with `description`, `exam_relevance`, `key_topics`, `recommended_first`, `related_categories`, `color` |
