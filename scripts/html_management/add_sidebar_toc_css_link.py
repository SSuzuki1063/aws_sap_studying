#!/usr/bin/env python3
"""
サイドバーTOCのHTML構造があるがCSSリンクがないHTMLファイルに
sidebar-toc.cssのリンクを追加するスクリプト
"""

import os
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent

# 追加するCSSリンク
SIDEBAR_TOC_CSS_LINK = '<link href="/aws_sap_studying/css/components/sidebar-toc.css" rel="stylesheet"/>'


def needs_sidebar_toc_css(filepath: Path) -> bool:
    """サイドバーTOC HTMLがあるがCSSリンクがないファイルかどうか"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        has_sidebar_html = 'class="sidebar-toc"' in content
        has_sidebar_css = 'sidebar-toc.css' in content

        return has_sidebar_html and not has_sidebar_css
    except Exception:
        return False


def add_sidebar_toc_css(filepath: Path, dry_run: bool = False) -> bool:
    """
    ファイルにsidebar-toc.cssリンクを追加する
    responsive.cssの後に追加する
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # responsive.cssリンクの後に追加
        # パターン: <link href="...responsive.css" rel="stylesheet"/>
        pattern = r'(<link[^>]*responsive\.css[^>]*/>)'

        if re.search(pattern, content):
            # responsive.cssの後に追加
            new_content = re.sub(
                pattern,
                r'\1\n' + SIDEBAR_TOC_CSS_LINK,
                content
            )
        else:
            # responsive.cssがない場合、</head>の前に追加
            new_content = content.replace(
                '</head>',
                SIDEBAR_TOC_CSS_LINK + '\n</head>'
            )

        if new_content != content:
            if not dry_run:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
            return True
        return False

    except Exception as e:
        print(f"エラー: {filepath}: {e}")
        return False


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='サイドバーTOC CSSリンクを追加'
    )
    parser.add_argument('--dry-run', action='store_true', help='変更を実行しない')
    args = parser.parse_args()

    print(f"{'[DRY RUN] ' if args.dry_run else ''}サイドバーTOC CSSリンク追加スクリプト")
    print("=" * 60)

    # 対象ファイルを検索
    html_files = list(PROJECT_ROOT.glob('**/*.html'))
    html_files = [f for f in html_files if '.git' not in str(f) and '.claude' not in str(f)]

    modified = 0
    for filepath in sorted(html_files):
        if needs_sidebar_toc_css(filepath):
            rel_path = filepath.relative_to(PROJECT_ROOT)
            if add_sidebar_toc_css(filepath, dry_run=args.dry_run):
                print(f"✅ {rel_path}")
                modified += 1

    print("=" * 60)
    print(f"完了: {modified}ファイル修正")


if __name__ == '__main__':
    main()
