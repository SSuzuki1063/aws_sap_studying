#!/usr/bin/env python3
"""
convert_special_pages.py — Convert top-level HTML pages to Astro .astro files.

These pages (index, quiz, roadmap, etc.) are self-contained apps with their own
CSS/JS. We wrap them in BaseLayout.astro using set:html to avoid JSX parsing issues.

Usage:
    python3 scripts/migration/convert_special_pages.py --all --dry-run
    python3 scripts/migration/convert_special_pages.py index.html quiz.html
    python3 scripts/migration/convert_special_pages.py --all
"""

import argparse
import os
import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# All top-level HTML pages to convert
SPECIAL_PAGES = [
    'index.html',
    'learning-resources.html',
    'quiz.html',
    'roadmap.html',
    'exam_guide.html',
    'concept-map.html',
    'bookmark.html',
    'profile.html',
    'knowledge-base.html',
    'table-of-contents.html',
    'home.html',
    'aws_glossary.html',
    'development-flowchart.html',
    'development-roadmap.html',
    'development-usecase.html',
]


def extract_title(src: str) -> str:
    m = re.search(r'<title>\s*(.*?)\s*</title>', src, re.DOTALL)
    return m.group(1).strip() if m else 'AWS SAP'


def extract_head_content(src: str) -> str:
    """Extract everything inside <head> except <meta charset>, <meta viewport>, and <title>."""
    head_m = re.search(r'<head>(.*?)</head>', src, re.DOTALL)
    if not head_m:
        return ''
    head = head_m.group(1)

    # Remove meta charset, viewport, and title (BaseLayout provides these)
    head = re.sub(r'<meta\s+charset="[^"]*"\s*/?\s*>', '', head)
    head = re.sub(r'<meta\s+content="[^"]*"\s+name="viewport"\s*/?\s*>', '', head)
    head = re.sub(r'<meta\s+name="viewport"\s+content="[^"]*"\s*/?\s*>', '', head)
    head = re.sub(r'<title>.*?</title>', '', head, flags=re.DOTALL)

    return head.strip()


def extract_body_content(src: str) -> str:
    """Extract everything inside <body>."""
    # Match body with optional attributes
    m = re.search(r'<body[^>]*>(.*)</body>', src, re.DOTALL)
    if not m:
        return '<!-- BODY EXTRACTION FAILED -->'
    return m.group(1).strip()


def fix_script_paths(content: str) -> str:
    """Fix relative script paths to use base prefix.

    index.html references scripts like <script src="data.js"> without path prefix.
    In Astro, these need the base path: /aws_sap_studying/data.js
    """
    def fix_src(m):
        src_val = m.group(1)
        # Already has absolute path or base path
        if src_val.startswith('/') or src_val.startswith('http'):
            return m.group(0)
        # Relative path — add base prefix
        return m.group(0).replace(f'src="{src_val}"', f'src="/aws_sap_studying/{src_val}"')

    return re.sub(r'<script\s+src="([^"]+)"', fix_src, content)


def add_is_inline(content: str) -> str:
    """Add is:inline to all <script> tags (prevents Astro bundling)."""
    return re.sub(r'<script(?!\s+is:inline)(\s|>)', r'<script is:inline\1', content)


def convert(html_path: Path) -> tuple:
    """Convert a single HTML file to .astro format.

    Returns (output_path, content) tuple.
    """
    with open(html_path, 'r', encoding='utf-8') as f:
        src = f.read()

    slug = html_path.stem
    title = extract_title(src)
    head_content = extract_head_content(src)
    body_content = extract_body_content(src)

    # Fix script paths (no is:inline needed — content is injected via set:html)
    body_content = fix_script_paths(body_content)

    # Escape template literal characters
    def esc_tpl(s):
        return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

    head_esc = esc_tpl(head_content)
    body_esc = esc_tpl(body_content)

    # For pages with underscores in name, convert to valid filename
    out_name = f'{slug}.astro'

    out = f"""---
import BaseLayout from '../layouts/BaseLayout.astro';

const pageTitle = `{esc_tpl(title)}`;
const headContent = `{head_esc}`;
const bodyContent = `{body_esc}`;
---

<BaseLayout pageTitle={{pageTitle}}>
  <Fragment slot="head" set:html={{headContent}} />
  <Fragment set:html={{bodyContent}} />
</BaseLayout>
"""

    out_path = PROJECT_ROOT / 'src' / 'pages' / out_name
    return str(out_path), out


def main():
    parser = argparse.ArgumentParser(description='Convert special HTML pages to Astro')
    parser.add_argument('files', nargs='*', help='HTML files to convert')
    parser.add_argument('--all', '-a', action='store_true', help='Convert all special pages')
    parser.add_argument('--dry-run', '-n', action='store_true', help='Preview without writing')
    parser.add_argument('--verbose', '-v', action='store_true')
    args = parser.parse_args()

    if not args.files and not args.all:
        parser.print_help()
        sys.exit(1)

    files = SPECIAL_PAGES if args.all else args.files

    ok = 0
    err = 0
    missing = 0

    for fname in files:
        html_path = PROJECT_ROOT / fname
        if not html_path.exists():
            print(f"  ⚠ {fname}: not found, skipping", file=sys.stderr)
            missing += 1
            continue

        try:
            op, content = convert(html_path)
            if args.dry_run:
                print(f"  {fname} → {os.path.relpath(op, PROJECT_ROOT)}")
                if args.verbose:
                    print(f"    ({len(content)} chars)")
            else:
                os.makedirs(os.path.dirname(op), exist_ok=True)
                with open(op, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ {os.path.relpath(op, PROJECT_ROOT)}")
            ok += 1
        except Exception as e:
            print(f"  ✗ {fname}: {e}", file=sys.stderr)
            if args.verbose:
                import traceback
                traceback.print_exc()
            err += 1

    print(f"\nConverted: {ok}, Errors: {err}, Missing: {missing}")
    return 0 if err == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
