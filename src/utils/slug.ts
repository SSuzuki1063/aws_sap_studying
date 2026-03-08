/**
 * Generate a URL-safe slug ID from a section title.
 * Single source of truth — used by Astro components and TOC generation.
 * Must match the logic in public/render.js generateSectionSlug().
 */
export function generateSectionSlug(title: string): string {
  return 'section-' + title
    .replace(/[\s&・／/]+/g, '-')
    .replace(/[^\w\u3000-\u9FFF\u30A0-\u30FF\u3040-\u309F-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
