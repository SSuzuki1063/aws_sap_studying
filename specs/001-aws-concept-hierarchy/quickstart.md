# Quickstart: Playwright Regression Testing System

## Prerequisites

```bash
npm ci
npx playwright install chromium
```

## Run Regression Tests Locally

```bash
# Build the site first (Astro SSG)
npm run build

# Run all regression tests
npm run test:regression

# Run specific suite
npx playwright test --project=regression-visual
npx playwright test --project=regression-nav
npx playwright test --project=regression-links
npx playwright test --project=regression-interaction

# Run with visible browser
npx playwright test --project=regression-visual --headed
```

## Update Visual Baselines

When you intentionally change the UI:

```bash
npx playwright test --project=regression-visual --update-snapshots
git add tests/__screenshots__/
git commit -m "chore: update visual regression baselines"
```

## View Reports

```bash
npx playwright show-report
```

## Key Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | 4 new regression projects added |
| `tests/e2e/visual/visual-regression.spec.ts` | Screenshot comparison tests |
| `tests/e2e/navigation/navigation.spec.ts` | Cross-page navigation tests |
| `tests/e2e/links/link-validation.spec.ts` | Broken link detection |
| `tests/e2e/interaction/interaction.spec.ts` | Interactive component tests |
| `tests/__screenshots__/` | Visual regression baselines |
| `.github/workflows/regression-tests.yml` | CI workflow |

## CI Behavior

- **Trigger**: PR or push to master
- **Browser**: Chromium only (performance)
- **Retries**: 2 in CI, 0 locally
- **Artifacts**: Screenshots and HTML report uploaded on failure
- **Target runtime**: < 2 minutes
