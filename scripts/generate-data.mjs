#!/usr/bin/env node
/**
 * generate-data.mjs — Auto-generate data.js and searchData from .astro frontmatter.
 *
 * Reads all .astro content pages, cross-references with resource-registry.json
 * (for cross-directory mappings and priority overrides), and generates:
 *   - public/data.js (categoriesData, categoryQuickNav, siteStats, updateHistory)
 *   - Replaces searchData in public/index.js
 *
 * For NEW resources (not in resource-registry.json):
 *   - Auto-assigns to directory-based category
 *   - Uses category-meta.json for section grouping via keyword matching
 *   - Default priority: 'medium' (omitted from output)
 *
 * Usage:
 *   node scripts/generate-data.mjs
 *   node scripts/generate-data.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Load reference data ───────────────────────────────────────────────────

const categoryMeta = JSON.parse(readFileSync(join(ROOT, 'src/data/category-meta.json'), 'utf-8'));
const resourceRegistry = JSON.parse(readFileSync(join(ROOT, 'src/data/resource-registry.json'), 'utf-8'));
const sectionIcons = JSON.parse(readFileSync(join(ROOT, 'src/data/section-icons.json'), 'utf-8'));
const updateHistory = JSON.parse(readFileSync(join(ROOT, 'src/data/update-history.json'), 'utf-8'));

// ─── Configuration ─────────────────────────────────────────────────────────

// Categories that appear in data.js (display categories)
// Order matters — this determines rendering order on the page
const DISPLAY_CATEGORIES = [
  'networking',
  'security-governance',
  'compute-applications',
  'content-delivery-dns',
  'development-deployment',
  'storage-database',
  'migration',
  'analytics-operations',
];

// Map from display category to its title/icon for categoryQuickNav
// (These may differ from category-meta.json due to historical naming)
const DISPLAY_CATEGORY_META = {
  'networking':            { title: 'ネットワーキング',          icon: '🌐', navIcon: '🌐' },
  'security-governance':   { title: 'セキュリティ・ガバナンス',   icon: '🛡️', navIcon: '🔒' },
  'compute-applications':  { title: 'コンピュート・アプリケーション', icon: '⚙️', navIcon: '💻' },
  'content-delivery-dns':  { title: 'コンテンツ配信・DNS',        icon: '🌍', navIcon: '🚀' },
  'development-deployment':{ title: '開発・デプロイメント',         icon: '🚀', navIcon: '🛠️' },
  'storage-database':      { title: 'ストレージ・データベース',    icon: '💾', navIcon: '💾' },
  'migration':             { title: '移行・転送',                 icon: '🔄', navIcon: '🔄' },
  'analytics-operations':  { title: '分析・運用・クイズ',          icon: '📊', navIcon: '📊' },
};

// Default section name when no subcategory keyword matches
const DEFAULT_SECTION = 'その他';

// ─── Parse .astro frontmatter ──────────────────────────────────────────────

function parseFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;

  const fm = m[1];
  const result = {};

  // Extract simple string fields
  for (const key of ['title', 'pageTitle', 'category', 'categoryLabel', 'subcategory', 'slug']) {
    const km = fm.match(new RegExp(`${key}:\\s*["'\`](.*)["'\`]`));
    if (km) result[key] = km[1];
  }

  return result;
}

// ─── Collect all content pages ─────────────────────────────────────────────

function collectContentPages() {
  const pagesDir = join(ROOT, 'src/pages');
  const pages = [];

  const entries = readdirSync(pagesDir);
  for (const dir of entries) {
    const dirPath = join(pagesDir, dir);
    if (!statSync(dirPath).isDirectory()) continue;
    // Skip non-content directories
    if (['_components'].includes(dir)) continue;

    const files = readdirSync(dirPath).filter(f => f.endsWith('.astro'));
    for (const file of files) {
      const fm = parseFrontmatter(join(dirPath, file));
      if (!fm || !fm.pageTitle) continue;

      const slug = fm.slug || basename(file, '.astro');
      const fileCategory = fm.category || dir;
      const href = `${fileCategory}/${slug}.html`;

      pages.push({
        fileDir: dir,
        slug,
        href,
        pageTitle: fm.pageTitle,
        categoryLabel: fm.categoryLabel || '',
        subcategory: fm.subcategory || '',
        fileCategory,
      });
    }
  }

  return pages;
}

// ─── Determine section for a resource ──────────────────────────────────────

function determineSection(href, fileDir, slug, subcategory) {
  // 1. Check resource registry (existing data.js mapping)
  const reg = resourceRegistry[href];
  if (reg && reg.section) return reg.section;

  // 2. Use frontmatter subcategory if available
  if (subcategory) return subcategory;

  // 3. Keyword matching from category-meta.json
  const catMeta = categoryMeta[fileDir];
  if (catMeta && catMeta.subcategories) {
    const lowerSlug = slug.toLowerCase();
    for (const [keyword, sectionName] of Object.entries(catMeta.subcategories)) {
      if (lowerSlug.includes(keyword)) return sectionName;
    }
  }

  return DEFAULT_SECTION;
}

// ─── Build categoriesData ──────────────────────────────────────────────────

function buildCategoriesData(pages) {
  // Group resources by display category → section
  const catMap = new Map();

  for (const cat of DISPLAY_CATEGORIES) {
    catMap.set(cat, new Map());
  }

  // Add resources from .astro pages
  for (const page of pages) {
    const reg = resourceRegistry[page.href];
    const displayCat = reg?.displayCategory || page.fileDir;

    // Skip if not a display category
    if (!catMap.has(displayCat)) continue;

    const section = determineSection(page.href, page.fileDir, page.slug, page.subcategory);
    const sectionMap = catMap.get(displayCat);

    if (!sectionMap.has(section)) {
      sectionMap.set(section, []);
    }

    const resource = { title: page.pageTitle, href: page.href };
    const priority = reg?.priority;
    if (priority) resource.priority = priority;

    sectionMap.get(section).push(resource);
  }

  // Also add BlackBelt PDFs and other non-.astro resources from registry
  for (const [href, reg] of Object.entries(resourceRegistry)) {
    if (href.endsWith('.pdf') || !href.includes('/')) {
      const displayCat = reg.displayCategory;
      if (!catMap.has(displayCat)) continue;
      const sectionMap = catMap.get(displayCat);
      if (!sectionMap.has(reg.section)) {
        sectionMap.set(reg.section, []);
      }
      // Check if already added
      const existing = sectionMap.get(reg.section);
      if (!existing.find(r => r.href === href)) {
        const resource = { title: getRegistryTitle(href), href };
        if (reg.priority) resource.priority = reg.priority;
        existing.push(resource);
      }
    }
  }

  // Convert to categoriesData format
  const result = [];
  for (const cat of DISPLAY_CATEGORIES) {
    const meta = DISPLAY_CATEGORY_META[cat];
    const sectionMap = catMap.get(cat);
    const sections = [];
    let totalCount = 0;

    for (const [sectionTitle, resources] of sectionMap) {
      const iconKey = `${cat}::${sectionTitle}`;
      const icon = sectionIcons[iconKey] || '📄';

      sections.push({
        title: sectionTitle,
        icon,
        count: resources.length,
        lastUpdated: getLatestUpdateDate(cat),
        resources,
      });
      totalCount += resources.length;
    }

    result.push({
      id: cat,
      title: meta.title,
      icon: meta.icon,
      count: totalCount,
      sections,
    });
  }

  return result;
}

// ─── Helper: get title for registry-only entries (PDFs etc.) ───────────────

function getRegistryTitle(href) {
  // Read from existing data.js as fallback
  try {
    const dataJs = readFileSync(join(ROOT, 'public/data.js'), 'utf-8');
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = dataJs.match(new RegExp(`title: '([^']*)',\\s*href: '${escaped}'`));
    if (m) return m[1];
  } catch { /* ignore */ }
  return basename(href, '.pdf').replace(/_/g, ' ');
}

// ─── Helper: get latest update date for a category ─────────────────────────

function getLatestUpdateDate(catId) {
  for (const entry of updateHistory) {
    if (entry.categories.includes(catId) || entry.categories.includes('all')) {
      return entry.date;
    }
  }
  return '2026-01-01';
}

// ─── Build searchData ──────────────────────────────────────────────────────

function buildSearchData(pages) {
  const data = [];

  for (const page of pages) {
    data.push({
      title: page.pageTitle,
      category: page.categoryLabel || getCategoryLabel(page.fileDir),
      file: page.href,
    });
  }

  // Add BlackBelt PDFs from registry
  for (const [href, reg] of Object.entries(resourceRegistry)) {
    if (href.endsWith('.pdf')) {
      data.push({
        title: getRegistryTitle(href),
        category: getCategoryLabel(reg.displayCategory),
        file: href,
      });
    }
  }

  // Sort by category, then title
  data.sort((a, b) => a.category.localeCompare(b.category, 'ja') || a.title.localeCompare(b.title, 'ja'));

  return data;
}

function getCategoryLabel(catId) {
  const meta = DISPLAY_CATEGORY_META[catId];
  if (meta) return meta.title;
  const cm = categoryMeta[catId];
  if (cm) return cm.label;
  return catId;
}

// ─── Generate data.js ──────────────────────────────────────────────────────

function generateDataJs(categoriesData, pages) {
  const categoryQuickNav = categoriesData.map(cat => ({
    id: cat.id,
    icon: DISPLAY_CATEGORY_META[cat.id].navIcon,
    text: cat.title,
    count: cat.count,
  }));

  const totalResources = categoriesData.reduce((sum, c) => sum + c.count, 0);
  const totalSections = categoriesData.reduce((sum, c) => sum + c.sections.length, 0);

  // Format date
  const now = new Date();
  const lastUpdated = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  const siteStats = {
    majorCategories: categoriesData.length,
    minorCategories: totalSections,
    totalResources: `${totalResources}+`,
    offlineSupport: '100%',
    lastUpdated,
  };

  let output = '// AWS SAP学習リソース - データ定義ファイル (自動生成)\n';
  output += '// このファイルは scripts/generate-data.mjs により自動生成されます\n';
  output += '// 手動編集しないでください\n\n';

  // categoriesData
  output += `const categoriesData = ${formatJsValue(categoriesData, 0)};\n\n`;

  // categoryQuickNav
  output += `const categoryQuickNav = ${formatJsValue(categoryQuickNav, 0)};\n\n`;

  // siteStats
  output += '// 統計データ\n';
  output += `const siteStats = ${formatJsValue(siteStats, 0)};\n\n`;

  // updateHistory
  output += '// 更新履歴データ\n';
  output += '// type: \'content\'(コンテンツ追加) | \'feature\'(機能追加) | \'exam\'(試験変更対応) | \'fix\'(修正)\n';
  output += `const updateHistory = ${formatJsValue(updateHistory, 0)};\n`;

  return output;
}

// ─── Format JS value (pretty print without JSON quotes on keys) ────────────

function formatJsValue(value, indent) {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);
  const pad2 = '  '.repeat(indent + 2);
  const pad3 = '  '.repeat(indent + 3);

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    // Check if it's an array of simple objects (like resources)
    const isSimpleObjArray = value.every(v =>
      typeof v === 'object' && !Array.isArray(v) &&
      Object.keys(v).length <= 4 &&
      Object.values(v).every(vv => typeof vv === 'string' || typeof vv === 'number')
    );

    if (isSimpleObjArray && indent >= 3) {
      // Compact single-line format for resource arrays
      const items = value.map(item => {
        const fields = Object.entries(item)
          .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v.replace(/'/g, "\\'")}'` : v}`)
          .join(', ');
        return `${pad1}{ ${fields} }`;
      });
      return `[\n${items.join(',\n')}\n${pad}]`;
    }

    const items = value.map(v => `${pad1}${formatJsValue(v, indent + 1)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';

    const items = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
      return `${pad1}${key}: ${formatJsValue(v, indent + 1)}`;
    });
    return `{\n${items.join(',\n')}\n${pad}}`;
  }

  return String(value);
}

// ─── Generate searchData for index.js ──────────────────────────────────────

function generateSearchDataBlock(searchData) {
  let output = 'const searchData = [\n';
  for (const item of searchData) {
    const title = item.title.replace(/'/g, "\\'");
    const cat = item.category.replace(/'/g, "\\'");
    const file = item.file.replace(/'/g, "\\'");
    output += `  { title: '${title}', category: '${cat}', file: '${file}' },\n`;
  }
  output += '];\n';
  return output;
}

function updateIndexJs(searchData) {
  const indexJsPath = join(ROOT, 'public/index.js');
  let content = readFileSync(indexJsPath, 'utf-8');

  // Find and replace the searchData block
  const searchDataBlock = generateSearchDataBlock(searchData);

  // Match from "const searchData = [" to the closing "];"
  const startMarker = 'const searchData = [';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    console.error('ERROR: Could not find searchData in index.js');
    return false;
  }

  // Find the closing "];" after the start
  let bracketDepth = 0;
  let endIdx = startIdx + startMarker.length;
  for (; endIdx < content.length; endIdx++) {
    if (content[endIdx] === '[') bracketDepth++;
    if (content[endIdx] === ']') {
      if (bracketDepth === 0) {
        // Find the semicolon
        endIdx = content.indexOf(';', endIdx) + 1;
        break;
      }
      bracketDepth--;
    }
  }

  content = content.slice(0, startIdx) + searchDataBlock + content.slice(endIdx);
  writeFileSync(indexJsPath, content, 'utf-8');
  return true;
}

// ─── Generate resources.ts (ESM module for Astro build-time imports) ────────

function generateResourcesTs(categoriesData, pages) {
  const categoryQuickNav = categoriesData.map(cat => ({
    id: cat.id,
    icon: DISPLAY_CATEGORY_META[cat.id].navIcon,
    text: cat.title,
    count: cat.count,
  }));

  const totalResources = categoriesData.reduce((sum, c) => sum + c.count, 0);
  const totalSections = categoriesData.reduce((sum, c) => sum + c.sections.length, 0);

  const now = new Date();
  const lastUpdated = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  const siteStats = {
    majorCategories: categoriesData.length,
    minorCategories: totalSections,
    totalResources: `${totalResources}+`,
    offlineSupport: '100%',
    lastUpdated,
  };

  let output = '// Auto-generated by scripts/generate-data.mjs — DO NOT EDIT\n';
  output += '// This file provides build-time data for Astro components.\n\n';

  // TypeScript interfaces
  output += `export interface Resource {\n  title: string;\n  href: string;\n  priority?: 'high' | 'medium' | 'low';\n}\n\n`;
  output += `export interface Section {\n  title: string;\n  icon: string;\n  count: number;\n  lastUpdated: string;\n  resources: Resource[];\n}\n\n`;
  output += `export interface Category {\n  id: string;\n  title: string;\n  icon: string;\n  count: number;\n  sections: Section[];\n}\n\n`;
  output += `export interface QuickNavItem {\n  id: string;\n  icon: string;\n  text: string;\n  count: number;\n}\n\n`;
  output += `export interface SiteStats {\n  majorCategories: number;\n  minorCategories: number;\n  totalResources: string;\n  offlineSupport: string;\n  lastUpdated: string;\n}\n\n`;

  output += `export const categoriesData: Category[] = ${JSON.stringify(categoriesData, null, 2)};\n\n`;
  output += `export const categoryQuickNav: QuickNavItem[] = ${JSON.stringify(categoryQuickNav, null, 2)};\n\n`;
  output += `export const siteStats: SiteStats = ${JSON.stringify(siteStats, null, 2)};\n`;

  return output;
}

// ─── Main ──────────────────────────────────────────────────────────────────

const dryRun = process.argv.includes('--dry-run');

console.log('Collecting .astro content pages...');
const pages = collectContentPages();
console.log(`  Found ${pages.length} content pages`);

console.log('Building categoriesData...');
const categoriesData = buildCategoriesData(pages);
for (const cat of categoriesData) {
  console.log(`  ${cat.id}: ${cat.count} resources in ${cat.sections.length} sections`);
}

console.log('Building searchData...');
const searchData = buildSearchData(pages);
console.log(`  ${searchData.length} searchable entries`);

if (dryRun) {
  console.log('\n[DRY RUN] Would write:');
  console.log('  public/data.js');
  console.log('  public/index.js (searchData section)');
  console.log('  src/data/resources.ts');
  const totalResources = categoriesData.reduce((s, c) => s + c.count, 0);
  console.log(`\nTotal resources: ${totalResources}`);
} else {
  console.log('\nWriting public/data.js...');
  const dataJs = generateDataJs(categoriesData, pages);
  writeFileSync(join(ROOT, 'public/data.js'), dataJs, 'utf-8');

  console.log('Updating searchData in public/index.js...');
  const ok = updateIndexJs(searchData);
  if (!ok) process.exit(1);

  console.log('Writing src/data/resources.ts...');
  const resourcesTs = generateResourcesTs(categoriesData, pages);
  writeFileSync(join(ROOT, 'src/data/resources.ts'), resourcesTs, 'utf-8');

  console.log('Done!');
}
