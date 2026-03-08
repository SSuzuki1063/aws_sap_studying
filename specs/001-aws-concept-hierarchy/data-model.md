# Data Model: Playwright Regression Testing System

**Date**: 2026-03-06

---

## Entities

### 1. Playwright Config Projects (extends `playwright.config.ts`)

```typescript
// New projects added to existing config
{
  name: 'regression-visual',
  testDir: './tests/e2e/visual',
  use: { ...devices['Desktop Chrome'] },
}
{
  name: 'regression-nav',
  testDir: './tests/e2e/navigation',
  use: { ...devices['Desktop Chrome'] },
}
{
  name: 'regression-links',
  testDir: './tests/e2e/links',
  use: { ...devices['Desktop Chrome'] },
}
{
  name: 'regression-interaction',
  testDir: './tests/e2e/interaction',
  use: { ...devices['Desktop Chrome'] },
}
```

### 2. Visual Regression Test Matrix

```typescript
interface VisualTestConfig {
  pages: Array<{
    name: string;           // Human-readable name
    path: string;           // URL path (with /aws_sap_studying/ prefix)
    threshold: number;      // maxDiffPixelRatio (0.01 = 1%)
    waitForSelector?: string; // Element to wait for before screenshot
  }>;
  viewports: Array<{
    name: string;           // 'desktop' | 'tablet' | 'mobile'
    width: number;
    height: number;
  }>;
}

// Concrete values
const config: VisualTestConfig = {
  pages: [
    { name: 'index', path: '/aws_sap_studying/', threshold: 0.01 },
    { name: 'concept-map', path: '/aws_sap_studying/concept-map.html', threshold: 0.02, waitForSelector: '#mm-app-root' },
    { name: 'learning-resources', path: '/aws_sap_studying/learning-resources.html', threshold: 0.01 },
  ],
  viewports: [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ],
};
```

### 3. Navigation Test Data

```typescript
interface NavigationTest {
  name: string;
  from: string;                // Starting URL path
  action: 'click-link';       // Action type
  selector: string;           // CSS selector to click
  expectedUrl: string | RegExp; // Expected destination
  expectedHeading?: string;    // Expected visible heading text
}
```

### 4. Link Validation Report

```typescript
interface LinkReport {
  page: string;
  totalLinks: number;
  checkedLinks: number;
  brokenLinks: BrokenLink[];
  warnings: LinkWarning[];
  duration: number;         // milliseconds
}

interface BrokenLink {
  url: string;
  status: number;
  sourceSelector: string;  // CSS path to the <a> tag
  linkText: string;
}

interface LinkWarning {
  url: string;
  reason: string;          // 'timeout' | 'external-error' | 'redirect'
  status?: number;
}
```

### 5. Screenshot Baseline Directory Structure

```text
tests/__screenshots__/
├── visual-regression-spec-ts/
│   ├── index-desktop-1440x900.png
│   ├── index-tablet-768x1024.png
│   ├── index-mobile-390x844.png
│   ├── concept-map-desktop-1440x900.png
│   ├── concept-map-tablet-768x1024.png
│   ├── concept-map-mobile-390x844.png
│   ├── learning-resources-desktop-1440x900.png
│   ├── learning-resources-tablet-768x1024.png
│   └── learning-resources-mobile-390x844.png
```

---

## Relationships

```text
playwright.config.ts
  ├── projects[regression-visual] → tests/e2e/visual/
  ├── projects[regression-nav]    → tests/e2e/navigation/
  ├── projects[regression-links]  → tests/e2e/links/
  └── projects[regression-interaction] → tests/e2e/interaction/

tests/__screenshots__/  ←  baseline storage (Playwright managed)

.github/workflows/regression-tests.yml  ←  CI entry point
```
