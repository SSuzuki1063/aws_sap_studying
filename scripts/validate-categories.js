#!/usr/bin/env node
/**
 * Category Validation for AWS SAP Study Resources
 *
 * Validates that Astro resource files have a frontmatter `category` field
 * that matches their parent directory under src/pages/.
 *
 * Example: src/pages/networking/foo.astro must have category: 'networking'
 *
 * Exit codes:
 *   0: All files correctly categorized (or no files to check)
 *   1: Mismatched categorization detected
 *
 * Usage:
 *   node scripts/validate-categories.js              # All resource files
 *   node scripts/validate-categories.js --staged      # Staged files only
 *   node scripts/validate-categories.js --verbose      # Show each file check
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(REPO_ROOT, 'src/pages');

// Known category directories (subdirectories of src/pages/ that hold resources)
const VALID_CATEGORIES = [
  'networking',
  'security-governance',
  'compute-applications',
  'storage-database',
  'content-delivery-dns',
  'development-deployment',
  'migration',
  'analytics-bigdata',
  'organizational-complexity',
  'continuous-improvement',
  'cost-control',
  'new-solutions',
];

/**
 * Extract the `category` value from Astro frontmatter.
 * Looks for: category: 'value' or category: "value"
 */
function extractCategory(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/category:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

/**
 * Get resource files to validate.
 */
function getFilesToValidate(stagedOnly) {
  if (stagedOnly) {
    try {
      const output = execFileSync(
        'git',
        ['diff', '--cached', '--name-only', '--diff-filter=ACM'],
        { cwd: REPO_ROOT, encoding: 'utf-8' }
      );
      return output
        .trim()
        .split('\n')
        .filter((f) => f && f.endsWith('.astro') && f.startsWith('src/pages/'))
        .filter((f) => {
          const parts = f.split('/');
          // Must be src/pages/<category>/file.astro (depth 4), not src/pages/file.astro (depth 3)
          return parts.length >= 4;
        });
    } catch {
      return [];
    }
  }

  // All resource files in category directories
  const files = [];
  for (const category of VALID_CATEGORIES) {
    const dir = path.join(PAGES_DIR, category);
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir)) {
        if (file.endsWith('.astro')) {
          files.push(path.join('src/pages', category, file));
        }
      }
    }
  }
  return files;
}

function main() {
  const args = process.argv.slice(2);
  const stagedOnly = args.includes('--staged');
  const verbose = args.includes('--verbose');

  console.log('');
  console.log('='.repeat(70));
  console.log('📂 Category Validation (frontmatter ↔ directory)');
  console.log('='.repeat(70));
  console.log('');

  const files = getFilesToValidate(stagedOnly);

  if (files.length === 0) {
    console.log('⚠ No resource files to validate.');
    console.log('='.repeat(70));
    process.exit(0);
  }

  console.log(`Mode: ${stagedOnly ? 'Staged files only' : 'All resource files'}`);
  console.log(`Files to check: ${files.length}\n`);

  const errors = [];
  let checked = 0;

  for (const relPath of files) {
    const parts = relPath.split('/');
    const dirCategory = parts[2]; // src/pages/<category>/file.astro
    const absPath = path.join(REPO_ROOT, relPath);

    if (!fs.existsSync(absPath)) continue;

    const frontmatterCategory = extractCategory(absPath);
    checked++;

    if (!frontmatterCategory) {
      // No category in frontmatter — may be a non-resource page, skip silently
      if (verbose) {
        console.log(`  ⊘ ${relPath} (no category in frontmatter, skipped)`);
      }
      continue;
    }

    if (frontmatterCategory !== dirCategory) {
      errors.push({
        file: relPath,
        dirCategory,
        frontmatterCategory,
      });
      if (verbose) {
        console.log(`  ✗ ${relPath}`);
        console.log(`    Directory: ${dirCategory} | Frontmatter: ${frontmatterCategory}`);
      }
    } else {
      if (verbose) {
        console.log(`  ✓ ${relPath}`);
      }
    }
  }

  // Also check new_html/ for files that should be categorized
  const newHtmlDir = path.join(REPO_ROOT, 'new_html');
  const newHtmlFiles = [];
  if (fs.existsSync(newHtmlDir)) {
    for (const file of fs.readdirSync(newHtmlDir)) {
      if (file.endsWith('.html') || file.endsWith('.astro')) {
        newHtmlFiles.push(file);
      }
    }
  }

  // Summary
  console.log('');
  console.log('='.repeat(70));

  if (newHtmlFiles.length > 0) {
    console.log(`📦 Staging: ${newHtmlFiles.length} file(s) in new_html/ awaiting integration`);
    for (const f of newHtmlFiles) {
      console.log(`   • ${f}`);
    }
    console.log('');
  }

  if (errors.length === 0) {
    console.log('✅ CATEGORY VALIDATION PASSED');
    console.log(`All ${checked} resource files have matching directory ↔ frontmatter category.`);
    console.log('='.repeat(70));
    console.log('');
    process.exit(0);
  } else {
    console.log('❌ CATEGORY VALIDATION FAILED');
    console.log(`Found ${errors.length} mismatch(es):\n`);

    for (const err of errors) {
      console.log(`  ✗ ${err.file}`);
      console.log(`    Directory: ${err.dirCategory} → Frontmatter: ${err.frontmatterCategory}`);
    }

    console.log('');
    console.log('💡 Fix: Either move the file to the correct directory,');
    console.log('   or update the frontmatter category field to match the directory.');
    console.log('='.repeat(70));
    console.log('');
    process.exit(1);
  }
}

main();
