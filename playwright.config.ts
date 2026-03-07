import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  snapshotDir: 'tests/e2e/__snapshots__',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    locale: 'en-US',
    timezoneId: 'UTC',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    {
      name: 'qa',
      use: { ...devices['Desktop Chrome'] },
      testDir: './tests/e2e/qa',
      retries: 0,  // QA report specs should not be retried
    },
  ],
  webServer: {
    command: 'npm run preview:test',
    url: 'http://localhost:4321/aws_sap_studying/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  timeout: 15_000,
  expect: { timeout: 8_000 },
});
