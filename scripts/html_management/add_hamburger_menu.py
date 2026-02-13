#!/usr/bin/env python3
"""
全てのAWS学習リソースHTMLファイルにハンバーガーメニューを追加するスクリプト

対象: class="fixed-nav-links" を含む全HTMLファイル

処理内容:
  1. <nav class="fixed-nav-links"> に id="mainNav" を追加
  2. <nav> の直前にハンバーガーボタンHTMLを挿入
  3. </body> 前に mobile-nav.js の <script> タグを追加

使用方法:
    python3 scripts/html_management/add_hamburger_menu.py --dry-run  # プレビューのみ
    python3 scripts/html_management/add_hamburger_menu.py            # 実際に実行
"""

import os
import re
import argparse
from pathlib import Path


HAMBURGER_BUTTON_HTML = '<button class="hamburger-btn" id="hamburgerBtn" aria-label="\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f" aria-expanded="false" aria-controls="mainNav"><span class="hamburger-icon">\u2630</span></button>\n'

MOBILE_NAV_SCRIPT = '<script src="/aws_sap_studying/js/mobile-nav.js"></script>\n'

# 学習リソースが配置されているカテゴリディレクトリ + ルートHTMLファイル
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


def find_html_files(base_dir):
    """fixed-nav-linksを含む全HTMLファイルを検索"""
    html_files = []

    # ルートディレクトリのHTMLファイル
    for f in Path(base_dir).glob('*.html'):
        html_files.append(f)

    # カテゴリディレクトリのHTMLファイル
    for cat_dir in CATEGORY_DIRS:
        dir_path = Path(base_dir) / cat_dir
        if dir_path.exists():
            for f in dir_path.glob('*.html'):
                html_files.append(f)

    return sorted(html_files)


def needs_hamburger_menu(content):
    """ハンバーガーメニューが未追加かチェック"""
    return 'fixed-nav-links' in content and 'hamburgerBtn' not in content


def add_hamburger_menu(content):
    """HTMLコンテンツにハンバーガーメニューを追加"""
    modified = content

    # 1. <nav> に id="mainNav" を追加（既にあれば追加しない）
    # パターン: <nav ... class="fixed-nav-links" ...>
    if 'id="mainNav"' not in modified:
        modified = re.sub(
            r'(<nav\b[^>]*class="fixed-nav-links"[^>]*)>',
            r'\1 id="mainNav">',
            modified,
            count=1
        )

    # 2. <nav ... class="fixed-nav-links" ...> の直前にハンバーガーボタンを挿入
    nav_pattern = r'(<nav\b[^>]*class="fixed-nav-links"[^>]*>)'
    match = re.search(nav_pattern, modified)
    if match:
        insert_pos = match.start()
        modified = modified[:insert_pos] + HAMBURGER_BUTTON_HTML + modified[insert_pos:]

    # 3. </body> 前に mobile-nav.js を追加（既にあれば追加しない）
    if 'mobile-nav.js' not in modified:
        modified = modified.replace('</body>', MOBILE_NAV_SCRIPT + '</body>')

    return modified


def process_file(file_path, dry_run=False):
    """1つのHTMLファイルを処理"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except (UnicodeDecodeError, IOError) as e:
        print(f"  SKIP (read error): {file_path} - {e}")
        return False

    if not needs_hamburger_menu(content):
        return False

    modified = add_hamburger_menu(content)

    if modified == content:
        return False

    if not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)

    return True


def main():
    parser = argparse.ArgumentParser(description='ハンバーガーメニューを全HTMLファイルに追加')
    parser.add_argument('--dry-run', action='store_true', help='プレビューのみ（実際の変更なし）')
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent.parent.parent
    html_files = find_html_files(base_dir)

    print(f"検出されたHTMLファイル: {len(html_files)}")
    if args.dry_run:
        print("--- DRY RUN モード ---")

    modified_count = 0
    skipped_count = 0

    for file_path in html_files:
        rel_path = file_path.relative_to(base_dir)
        result = process_file(file_path, dry_run=args.dry_run)
        if result:
            modified_count += 1
            print(f"  {'[DRY] ' if args.dry_run else ''}修正: {rel_path}")
        else:
            skipped_count += 1

    print(f"\n完了: {modified_count} ファイル修正, {skipped_count} ファイルスキップ")


if __name__ == '__main__':
    main()
