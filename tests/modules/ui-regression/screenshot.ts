/**
 * Screenshot helper — scaffold only.
 *
 * Baseline management (initial generation → commit → CI comparison cycle)
 * is handled in a separate task. This module provides the capture interface
 * so the visual-regression spec can import from a stable path.
 */

import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import type { ScreenshotMetadata } from '../types/index.js';

const SCREENSHOT_DIR = 'qa-reports/screenshots';

/**
 * Take a screenshot and save it to qa-reports/screenshots/<label>.png.
 * Returns metadata for use in comparison and reporting.
 */
export async function takeScreenshot(
  page: Page,
  url: string,
  label: string,
  viewport = { width: 1280, height: 800 },
): Promise<ScreenshotMetadata> {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const safeName = label.replace(/[^a-zA-Z0-9-_]/g, '_');
  const filePath = path.join(SCREENSHOT_DIR, `${safeName}.png`);

  await page.screenshot({ path: filePath, fullPage: false });

  return {
    url,
    label,
    viewport,
    filePath,
    takenAt: new Date().toISOString(),
  };
}
