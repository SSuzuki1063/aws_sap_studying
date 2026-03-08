# Research: Playwright Regression Testing System

**Date**: 2026-03-06 | **Status**: Complete

---

## R1: Visual Regression — Playwright Built-in vs. Third-Party

**Decision**: Use Playwright's built-in `toHaveScreenshot()` API
**Rationale**: Native support since Playwright 1.22. No additional dependencies. Handles baseline management, diff generation, and CI artifact upload natively.
**Alternatives considered**:
- `percy.io` — Rejected: SaaS dependency, cost, overkill for static site
- `reg-suit` — Rejected: Additional dependency, complex setup, unmaintained
- `pixelmatch` (manual) — Rejected: Reinventing what Playwright already provides
- Existing `tests/modules/ui-regression/` scaffold — Rejected: Incomplete, uses custom approach when Playwright built-in is superior

**Configuration**:
```typescript
expect(page).toHaveScreenshot('name.png', {
  fullPage: true,
  maxDiffPixelRatio: 0.01,  // 1% tolerance for font rendering
  animations: 'disabled',   // Prevent animation flakiness
});
```

**Baseline Management**:
- First run: `--update-snapshots` generates baselines
- Baselines stored in `tests/__screenshots__/` (committed to git)
- Platform-specific baselines: `{name}-{project}-linux.png` suffix auto-handled by Playwright

---

## R2: Link Validation — Browser Navigation vs. HTTP API

**Decision**: Use Playwright's `request` API context for link validation
**Rationale**: 10-100x faster than browser navigation. Can check 100+ links in < 30 seconds with controlled concurrency. No DOM rendering overhead.

**Alternatives considered**:
- Browser navigation per link — Rejected: Too slow (2-5s per link)
- External tool (`linkchecker`, `broken-link-checker`) — Rejected: Additional dependency, harder to integrate with Playwright reporting
- `fetch()` in page context — Rejected: CORS restrictions on external links

**Implementation**:
```typescript
const apiContext = await request.newContext();
const response = await apiContext.head(url, { timeout: 10000 });
expect(response.status()).toBeLessThan(400);
```

**External Link Strategy**:
- Internal links: Hard fail on status >= 400
- External links: Soft fail (warning) — logged but don't block CI
- Reason: External sites may rate-limit CI runners, causing false failures

---

## R3: Page Discovery — Which Pages to Test

**Decision**: Test 3 primary pages: `/`, `/concept-map.html`, `/learning-resources.html`

**Research findings**:
- `study-guide.html` (mentioned in user spec) does NOT exist in the repository
- `learning-resources.html` exists and serves a similar purpose (resource listings)
- `concept-map.html` is the most interactive page (existing 60+ tests)
- `index.html` (home) is the entry point

**Pages available but excluded from regression (low risk)**:
- `quiz.html` — Separate testing concern
- `bookmark.html`, `profile.html` — User-specific features
- `aws_glossary.html`, `exam_guide.html` — Static reference pages

---

## R4: CI Performance — Meeting the 2-Minute Budget

**Decision**: Chromium-only, parallel tests, skip external link checks in CI

**Research findings**:
- Existing CI uses Chromium-only for E2E (`--project=chromium`)
- Full 3-browser testing adds ~3x runtime — not needed for regression detection
- Cross-browser bugs are rare on static content sites
- Playwright parallel execution: 4 workers on GitHub Actions (2-core runner)

**Performance breakdown** (estimated):
| Suite | Time | Parallelizable |
|-------|------|----------------|
| Visual (9 screenshots) | 30s | Yes (3 pages x 3 viewports) |
| Navigation (4 tests) | 10s | Yes |
| Links (internal only in CI) | 30s | Yes (concurrent HEAD requests) |
| Interaction (5-8 tests) | 15s | Yes |
| **Total** | **~85s** | **Within 2-min budget** |

---

## R5: Existing Infrastructure Integration

**Decision**: Add new Playwright projects to existing config, not a separate config

**Research findings**:
- Current `playwright.config.ts` has 5 projects: chromium, firefox, webkit, mobile-chrome, qa
- Adding 4 regression projects (one per suite) enables selective execution
- Existing web server config (`server.py` or `astro preview`) is reused
- Existing `tests/modules/` shared code (types, validators) can be extended

**Integration points**:
- `playwright.config.ts` — Add 4 new projects
- `package.json` — Add `test:regression` script
- `.github/workflows/` — Add `regression-tests.yml`

---

## R6: Astro Build Requirement

**Decision**: Tests run against built output (`npm run build` then `astro preview`)

**Research findings**:
- The repository has migrated to Astro SSG (per CLAUDE.md)
- Existing CI workflows run `npm run build` before testing
- `server.py` serves raw HTML files; Astro preview serves built `dist/`
- Regression tests should test the production-like build output

The existing `playwright.config.ts` webServer config handles this automatically.
