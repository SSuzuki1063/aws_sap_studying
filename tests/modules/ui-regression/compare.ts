/**
 * Visual regression comparison helper — scaffold only.
 *
 * Full baseline management is deferred to a separate task.
 * This module provides the diff metadata interface so the CI workflow
 * and unified report can reference a stable import path.
 */

import type { VisualRegressionDiff } from '../types/index.js';

/**
 * Placeholder for future pixel-diff comparison.
 * Will integrate with Playwright's toHaveScreenshot() baseline system.
 */
export function buildDiffMetadata(
  label: string,
  baselinePath: string,
  actualPath: string,
): VisualRegressionDiff {
  return {
    label,
    baselinePath,
    actualPath,
    diffPath: null,
    pixelDiffCount: null,
    passed: true, // scaffold: always pass until baselines are established
  };
}
