#!/usr/bin/env python3
"""
extract_to_astro.py — Convert existing HTML resource pages to Astro .astro files.

Usage:
    python3 scripts/migration/extract_to_astro.py networking/aws-direct-connect-guide.html
    python3 scripts/migration/extract_to_astro.py --category networking
    python3 scripts/migration/extract_to_astro.py --all
    python3 scripts/migration/extract_to_astro.py --all --dry-run
"""

import argparse
import html as html_mod
import json
import os
import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

CONTENT_DIRS = [
    'networking', 'security-governance', 'compute-applications',
    'content-delivery-dns', 'development-deployment', 'storage-database',
    'migration-transfer', 'analytics-bigdata', 'new-solutions',
    'organizational-complexity', 'continuous-improvement', 'cost-control',
    'migration', 'exam_guide',
]

CATEGORY_META_PATH = PROJECT_ROOT / 'src' / 'data' / 'category-meta.json'


def load_category_meta():
    if CATEGORY_META_PATH.exists():
        with open(CATEGORY_META_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def extract_title(src: str) -> str:
    m = re.search(r'<title>\s*(.*?)\s*</title>', src, re.DOTALL)
    return m.group(1).strip() if m else ''


def extract_toc_items(src: str) -> list:
    items = []
    pattern = r'<li\s+class="toc-(h[23])">\s*<a\s+href="#([^"]*)"[^>]*>(.*?)</a>\s*</li>'
    for m in re.finditer(pattern, src, re.DOTALL):
        text = re.sub(r'\s+', ' ', m.group(3).strip())
        items.append({'level': m.group(1), 'id': m.group(2), 'text': text})
    return items


def extract_breadcrumb_info(src: str) -> dict:
    info = {'categoryLabel': '', 'subcategory': '', 'currentTitle': ''}
    body_start = src.find('<body')
    if body_start < 0:
        body_start = 0
    body = src[body_start:]

    bc_match = re.search(r'<nav\s+class="breadcrumb-nav">(.*?)</nav>', body, re.DOTALL)
    if not bc_match:
        return info

    bc = bc_match.group(1)
    items = re.findall(r'<span\s+class="breadcrumb-item">\s*(.*?)\s*</span>', bc, re.DOTALL)
    if len(items) >= 1:
        info['categoryLabel'] = html_mod.unescape(items[0].strip())
    if len(items) >= 2:
        info['subcategory'] = html_mod.unescape(items[1].strip())

    current = re.search(r'<span\s+class="breadcrumb-current">\s*(.*?)\s*</span>', bc, re.DOTALL)
    if current:
        info['currentTitle'] = html_mod.unescape(current.group(1).strip())
    return info


def extract_page_nav(src: str) -> dict:
    nav = {'prevPage': None, 'nextPage': None, 'pageNum': 1, 'pageTotal': 1}
    nav_match = re.search(r'<nav\s+class="page-bottom-nav"[^>]*>(.*?)</nav>', src, re.DOTALL)
    if not nav_match:
        return nav

    nh = nav_match.group(1)

    prev_m = re.search(r'<a\s+href="([^"]*)"[^>]*class="page-bottom-nav-link\s+prev(?:\s+disabled)?"', nh)
    if prev_m:
        href = prev_m.group(1)
        if href != '#' and 'disabled' not in prev_m.group(0):
            nav['prevPage'] = href

    next_m = re.search(r'<a\s+href="([^"]*)"[^>]*class="page-bottom-nav-link\s+next(?:\s+disabled)?"', nh)
    if next_m:
        href = next_m.group(1)
        if href != '#' and 'disabled' not in next_m.group(0):
            nav['nextPage'] = href

    cur = re.search(r'<span\s+class="current">(\d+)</span>', nh)
    tot = re.search(r'<span\s+class="total">(\d+)</span>', nh)
    if cur:
        nav['pageNum'] = int(cur.group(1))
    if tot:
        nav['pageTotal'] = int(tot.group(1))
    return nav


def extract_page_css(src: str, slug: str):
    m = re.search(r'<link\s+href="(/aws_sap_studying/css/pages/[^"]+)"[^>]*rel="stylesheet"', src)
    return m.group(1) if m else None


def extract_inline_styles(src: str) -> str:
    head_match = re.search(r'<head>(.*?)</head>', src, re.DOTALL)
    if not head_match:
        return ''
    styles = []
    for m in re.finditer(r'<style[^>]*>(.*?)</style>', head_match.group(1), re.DOTALL):
        c = m.group(1).strip()
        if c:
            styles.append(c)
    return '\n'.join(styles) if styles else ''


def extract_content(src: str) -> str:
    """Extract main content. Uses home button / footer as end marker (not page-bottom-nav)."""
    body_start = src.find('<body')
    if body_start < 0:
        body_start = 0
    body = src[body_start:]

    # Start: after breadcrumb-nav
    bc = re.search(r'<nav\s+class="breadcrumb-nav">', body)
    if bc:
        bc_end = body.find('</nav>', bc.start())
        if bc_end >= 0:
            start = body_start + bc_end + len('</nav>')
        else:
            start = body_start + bc.end()
    else:
        cont = re.search(r'<(?:div|main)\s+class="container">', body)
        if cont:
            start = body_start + cont.end()
        else:
            # Fallback: content starts after the scroll-to-top button
            # (injected by integration scripts for files without breadcrumbs)
            scroll_btn = re.search(r'<button[^>]*class="scroll-to-top"[^>]*>.*?</button>', body, re.DOTALL)
            if scroll_btn:
                start = body_start + scroll_btn.end()
            else:
                # Last resort: look for <header class="hero"> or bare <main>
                hero = re.search(r'<header\s+class="hero">', body)
                if hero:
                    start = body_start + hero.start()
                else:
                    main_tag = re.search(r'<main\b[^>]*>', body)
                    if main_tag:
                        start = body_start + main_tag.start()
                    else:
                        return '<!-- CONTENT EXTRACTION FAILED -->'

    remaining = src[start:]

    # End: home button → footer → common script → </body>
    home = re.search(r'<button[^>]*onclick="window\.location\.href=\'[^\']*learning-resources', remaining)
    if home:
        end = start + home.start()
    else:
        footer = re.search(r'<div\s+style="text-align:\s*center;\s*padding:\s*20px', remaining)
        if footer:
            end = start + footer.start()
        else:
            script = re.search(r'<!-- 固定ヘッダー機能のJavaScript -->', remaining)
            if script:
                end = start + script.start()
            else:
                end_body = src.find('</body>', start)
                end = end_body if end_body > 0 else len(src)

    content = src[start:end].strip()

    # Remove page-bottom-nav from content (layout handles it)
    content = re.sub(
        r'<!-- ページ下部ナビゲーション -->\s*<nav\s+class="page-bottom-nav"[^>]*>.*?</nav>',
        '', content, flags=re.DOTALL
    )
    content = re.sub(
        r'<nav\s+class="page-bottom-nav"[^>]*>.*?</nav>',
        '', content, flags=re.DOTALL
    )

    return content.strip()


def extract_page_scripts(src: str) -> str:
    """Extract page-specific scripts (after container, before footer)."""
    scripts = []
    # Find scripts between closing container and home button/footer
    # These are typically after </div>\n\n and before the home button
    body_end_region = src[src.rfind('</div>', 0, src.find('</body>')):]
    for m in re.finditer(r'<script(?:\s[^>]*)?>(.+?)</script>', body_end_region, re.DOTALL):
        sc = m.group(1).strip()
        if 'toggleSidebarTOC' in sc:
            continue
        if 'scrollToTopBtn' in sc and 'readingProgressBar' in sc:
            continue
        if 'src=' in m.group(0):
            continue
        if sc:
            scripts.append(f'<script>{sc}</script>')
    return '\n'.join(scripts)


def determine_category(fp: str) -> str:
    for part in Path(fp).parts:
        if part in CONTENT_DIRS:
            return part
    return ''


def convert(html_path: str, cat_meta: dict):
    html_path = Path(html_path)
    with open(html_path, 'r', encoding='utf-8') as f:
        src = f.read()

    slug = html_path.stem
    cat = determine_category(str(html_path))

    title = extract_title(src)
    toc = extract_toc_items(src)
    bc = extract_breadcrumb_info(src)
    pnav = extract_page_nav(src)
    pcss = extract_page_css(src, slug)
    istyles = extract_inline_styles(src)
    content = extract_content(src)
    pscripts = extract_page_scripts(src)


    cat_info = cat_meta.get(cat, {})
    cat_label = bc.get('categoryLabel') or cat_info.get('label', cat)
    subcat = bc.get('subcategory', '')

    def esc(s):
        return s.replace('\\', '\\\\').replace("'", "\\'") if s else ''

    css_line = f"  pageCss: '{pcss}'," if pcss else '  pageCss: undefined,'

    toc_items = []
    for item in toc:
        t = item['text'].replace("'", "\\'").replace('\n', ' ')
        i = item['id'].replace("'", "\\'")
        toc_items.append(f"    {{ level: '{item['level']}', id: '{i}', text: '{t}' }}")
    toc_js = '[\n' + ',\n'.join(toc_items) + '\n  ]' if toc_items else '[]'

    prev_p = f"'{pnav['prevPage']}'" if pnav['prevPage'] else 'undefined'
    next_p = f"'{pnav['nextPage']}'" if pnav['nextPage'] else 'undefined'

    style_block = f'<style>{istyles}</style>\n' if istyles else ''
    raw = style_block + content
    if pscripts:
        raw += '\n' + pscripts

    raw_esc = raw.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

    out = f"""---
import ResourceLayout from '../../layouts/ResourceLayout.astro';

const frontmatter = {{
  title: '{esc(bc.get("currentTitle", slug))}',
  pageTitle: '{esc(title)}',
  category: '{cat}',
  categoryLabel: '{esc(cat_label)}',
  subcategory: '{esc(subcat)}',
  slug: '{slug}',
{css_line}
  tocItems: {toc_js},
  prevPage: {prev_p},
  nextPage: {next_p},
  pageNum: {pnav['pageNum']},
  pageTotal: {pnav['pageTotal']},
}};

const rawContent = `{raw_esc}`;
---

<ResourceLayout {{...frontmatter}}>
  <Fragment set:html={{rawContent}} />
</ResourceLayout>
"""

    out_path = PROJECT_ROOT / 'src' / 'pages' / cat / f'{slug}.astro'
    return str(out_path), out


def find_files(category=None, files=None):
    if files:
        return [str(PROJECT_ROOT / f) for f in files]
    dirs = [category] if category else CONTENT_DIRS
    result = []
    for d in dirs:
        dp = PROJECT_ROOT / d
        if dp.exists():
            result.extend(str(f) for f in sorted(dp.glob('*.html')))
    return result


def main():
    parser = argparse.ArgumentParser(description='Convert HTML to Astro')
    parser.add_argument('files', nargs='*')
    parser.add_argument('--category', '-c')
    parser.add_argument('--all', '-a', action='store_true')
    parser.add_argument('--dry-run', '-n', action='store_true')
    parser.add_argument('--verbose', '-v', action='store_true')
    args = parser.parse_args()

    if not args.files and not args.category and not args.all:
        parser.print_help()
        sys.exit(1)

    cat_meta = load_category_meta()

    if args.all:
        html_files = find_files()
    elif args.category:
        html_files = find_files(category=args.category)
    else:
        html_files = find_files(files=args.files)

    print(f"Found {len(html_files)} HTML files to convert")

    ok = 0
    err = 0

    for hf in html_files:
        try:
            op, content = convert(hf, cat_meta)
            if args.dry_run:
                print(f"  {os.path.relpath(hf, PROJECT_ROOT)} → {os.path.relpath(op, PROJECT_ROOT)}")
            else:
                os.makedirs(os.path.dirname(op), exist_ok=True)
                with open(op, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ {os.path.relpath(op, PROJECT_ROOT)}")
            ok += 1
        except Exception as e:
            print(f"  ✗ {os.path.relpath(hf, PROJECT_ROOT)}: {e}", file=sys.stderr)
            if args.verbose:
                import traceback
                traceback.print_exc()
            err += 1

    print(f"\nConverted: {ok}, Errors: {err}")
    return 0 if err == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
