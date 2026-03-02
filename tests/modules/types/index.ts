/**
 * Shared TypeScript interfaces for the QA validation system.
 * All modules import from this file — no circular dependencies.
 */

// ── CSS W3C Validation ────────────────────────────────────────────────────────

export interface CssValidationMessage {
  line: number;
  col: number;
  message: string;
  context: string;
  type: 'error' | 'warning' | 'info';
}

export interface CssFileValidationResult {
  filePath: string;
  isValid: boolean;
  errors: CssValidationMessage[];
  warnings: CssValidationMessage[];
  skipped: boolean;
  validatedAt: string;
}

export interface CssValidationReport {
  generatedAt: string;
  mode: 'full' | 'pr';
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  skippedFiles: number;
  results: CssFileValidationResult[];
}

// ── CSS Runtime Check ─────────────────────────────────────────────────────────

export interface CssPropertyExpectation {
  selector: string;
  property: string;
  /** Expected value (exact string match, or regex if wrapped in /.../) */
  expected: string;
  /** Numeric tolerance for px/% values (e.g. 2 means ±2px) */
  tolerance?: number;
}

export interface CssPageRuntimeConfig {
  url: string;
  label: string;
  viewport?: { width: number; height: number };
  expectations: CssPropertyExpectation[];
}

export interface CssRuntimeDiff {
  selector: string;
  property: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface BoundingRectResult {
  selector: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface CssPageRuntimeResult {
  url: string;
  label: string;
  viewport: { width: number; height: number };
  diffs: CssRuntimeDiff[];
  boundingRects: BoundingRectResult[];
  passed: boolean;
  checkedAt: string;
}

export interface CssRuntimeReport {
  generatedAt: string;
  totalPages: number;
  passedPages: number;
  failedPages: number;
  results: CssPageRuntimeResult[];
}

// ── Unified QA Report ─────────────────────────────────────────────────────────

export type QaStatus = 'pass' | 'fail' | 'skip' | 'not-run';

export interface QaSectionSummary {
  name: string;
  status: QaStatus;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  reportFile: string | null;
}

export interface UnifiedQaSummary {
  generatedAt: string;
  overallStatus: QaStatus;
  gitSha?: string;
  branch?: string;
  sections: {
    cssValidation: QaSectionSummary;
    cssRuntime: QaSectionSummary;
    htmlValidation: QaSectionSummary;
    accessibility: QaSectionSummary;
  };
}

// ── Screenshot / Visual Regression ───────────────────────────────────────────

export interface ScreenshotMetadata {
  url: string;
  label: string;
  viewport: { width: number; height: number };
  filePath: string;
  takenAt: string;
}

export interface VisualRegressionDiff {
  label: string;
  baselinePath: string;
  actualPath: string;
  diffPath: string | null;
  pixelDiffCount: number | null;
  passed: boolean;
}
