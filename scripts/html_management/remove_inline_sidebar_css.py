#!/usr/bin/env python3
"""
インラインサイドバーTOC CSSを削除するスクリプト

共通 sidebar-toc.css が存在するファイルから、重複しているインライン <style> ブロックを削除します。
remove_inline_toc.py (旧TOC用) をベースに、サイドバーTOC版として作成。

使用方法:
    python3 scripts/html_management/remove_inline_sidebar_css.py --dry-run  # プレビューのみ
    python3 scripts/html_management/remove_inline_sidebar_css.py            # 実際に実行
"""

import os
import re
import argparse
from pathlib import Path


CATEGORY_DIRS = [
    'networking',
    'security-governance',
    'compute-applications',
    'content-delivery-dns',
    'development-deployment',
    'storage-database',
    'migration',
    'analytics-bigdata',
    'organizational-complexity',
    'continuous-improvement',
    'cost-control',
    'new-solutions'
]

# ルートレベルのHTMLも対象
ROOT_HTML_FILES = [
    'learning-resources.html',
    'profile.html',
    'aws_glossary.html',
    'development-usecase.html',
    'development-roadmap.html',
    'development-flowchart.html',
]


def has_shared_css_link(content):
    """共通 sidebar-toc.css リンクが存在するか"""
    return 'sidebar-toc.css' in content


def has_inline_sidebar_css(content):
    """インラインの .sidebar-toc CSS があるか"""
    return bool(re.search(r'<style[^>]*>.*?\.sidebar-toc\s*\{', content, re.DOTALL))


def remove_inline_sidebar_css(content):
    """
    <style> ブロック内に .sidebar-toc { を含むものを削除。

    削除対象のパターン:
    - <style> ... .sidebar-toc { ... } ... </style> ブロック全体
    """
    original_length = len(content)

    # <style>...</style> ブロックのうち .sidebar-toc { を含むものを削除
    # 注意: 複数の <style> ブロックがある場合、.sidebar-toc を含むもののみ削除
    def remove_sidebar_style_block(match):
        style_content = match.group(0)
        if '.sidebar-toc' in style_content:
            return ''
        return style_content

    content = re.sub(
        r'<style[^>]*>.*?</style>\s*\n?',
        remove_sidebar_style_block,
        content,
        flags=re.DOTALL
    )

    # 余分な空行を整理（4行以上の連続空行を2行に）
    content = re.sub(r'\n{4,}', '\n\n\n', content)

    removed_bytes = original_length - len(content)
    return content, removed_bytes


def find_html_files(base_dir):
    """対象HTMLファイルを検索"""
    html_files = []

    # ルートHTMLファイル
    for fname in ROOT_HTML_FILES:
        fpath = Path(base_dir) / fname
        if fpath.exists():
            html_files.append(fpath)

    # カテゴリディレクトリ
    for cat_dir in CATEGORY_DIRS:
        dir_path = Path(base_dir) / cat_dir
        if dir_path.exists():
            for f in dir_path.glob('*.html'):
                html_files.append(f)

    return sorted(html_files)


def process_file(file_path, dry_run=False):
    """1つのHTMLファイルを処理"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except (UnicodeDecodeError, IOError) as e:
        return ('error', f'Read error: {e}', 0)

    # インラインCSSがない → スキップ
    if not has_inline_sidebar_css(content):
        return ('skipped', 'インライン sidebar CSS なし', 0)

    # 共通CSSリンクがない → 安全のため削除しない
    if not has_shared_css_link(content):
        return ('warning', 'sidebar-toc.css リンクなし - 削除をスキップ', 0)

    modified, removed_bytes = remove_inline_sidebar_css(content)

    if modified == content:
        return ('unchanged', 'パターン不一致', 0)

    if not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)
        return ('updated', f'インラインCSS削除 ({removed_bytes} bytes)', removed_bytes)
    else:
        return ('would_update', f'削除予定 ({removed_bytes} bytes)', removed_bytes)


def main():
    parser = argparse.ArgumentParser(description='インラインサイドバーTOC CSSを削除')
    parser.add_argument('--dry-run', action='store_true', help='変更を実行しない')
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent.parent.parent
    html_files = find_html_files(base_dir)

    print(f"{'[DRY RUN] ' if args.dry_run else ''}インラインサイドバーCSS削除スクリプト")
    print("=" * 60)
    print(f"対象ファイル数: {len(html_files)}")

    stats = {'updated': 0, 'skipped': 0, 'warnings': 0, 'errors': 0, 'total_bytes': 0}

    for fpath in html_files:
        rel_path = fpath.relative_to(base_dir)
        status, msg, removed = process_file(fpath, dry_run=args.dry_run)

        if status in ('updated', 'would_update'):
            stats['updated'] += 1
            stats['total_bytes'] += removed
            print(f"  {rel_path} - {msg}")
        elif status == 'warning':
            stats['warnings'] += 1
            print(f"  WARNING: {rel_path} - {msg}")
        elif status == 'error':
            stats['errors'] += 1
            print(f"  ERROR: {rel_path} - {msg}")

    print("=" * 60)
    print(f"削除: {stats['updated']} files ({stats['total_bytes']:,} bytes / {stats['total_bytes'] / 1024:.1f} KB)")
    print(f"警告: {stats['warnings']}, エラー: {stats['errors']}")


if __name__ == '__main__':
    main()
