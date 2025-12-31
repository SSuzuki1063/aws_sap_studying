#!/usr/bin/env python3
"""
全てのAWS学習リソースHTMLファイルの「リソース集に戻る」ボタンのリンク先を
index.htmlからlearning-resources.htmlに変更するスクリプト

使用方法:
    python3 scripts/html_management/update_home_button_link.py --dry-run  # プレビューのみ
    python3 scripts/html_management/update_home_button_link.py            # 実際に実行
"""

import os
import sys
import argparse
import re
from pathlib import Path

# 学習リソースが配置されているカテゴリディレクトリ
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

# その他のHTMLファイル（リポジトリルートにある）
OTHER_HTML_FILES = [
    'table-of-contents.html',
    'knowledge-base.html',
    'learning-resources.html',
    'development-usecase.html',
    'development-roadmap.html',
    'development-flowchart.html'
]

def update_button_link(content):
    """
    HTMLコンテンツ内のボタンのonclickハンドラーを
    '../index.html' から '../learning-resources.html' に置換

    Args:
        content: HTMLファイルの内容

    Returns:
        (updated_content, count): 更新後の内容と置換回数のタプル
    """
    # onclick="window.location.href='../index.html'" を
    # onclick="window.location.href='../learning-resources.html'" に置換
    updated_content, count = re.subn(
        r"onclick=\"window\.location\.href='\.\.\/index\.html'\"",
        "onclick=\"window.location.href='../learning-resources.html'\"",
        content
    )

    return updated_content, count

def process_html_file(file_path, dry_run=False):
    """
    HTMLファイルのボタンリンクを更新

    Args:
        file_path: HTMLファイルのパス
        dry_run: Trueの場合は実際の変更を行わない

    Returns:
        (success, message): 処理結果
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # '../index.html' が含まれているかチェック
        if "window.location.href='../index.html'" not in content:
            return ('skipped', "対象のボタンリンクが見つかりません - スキップ")

        # ボタンリンクを更新
        updated_content, count = update_button_link(content)

        if count == 0:
            return ('skipped', "置換対象が見つかりません - スキップ")

        # dry-runでない場合のみファイルを更新
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            return ('updated', f"{count}箇所のリンクをlearning-resources.htmlに更新しました")
        else:
            return ('updated', f"{count}箇所のリンクをlearning-resources.htmlに更新予定（dry-run）")

    except Exception as e:
        return ('error', f"エラー: {str(e)}")

def find_html_files(base_dir):
    """
    カテゴリディレクトリとルートディレクトリ内の全HTMLファイルを検索

    Args:
        base_dir: リポジトリのルートディレクトリ

    Returns:
        HTMLファイルパスのリスト
    """
    html_files = []

    # カテゴリディレクトリ内のHTMLファイル
    for category in CATEGORY_DIRS:
        category_path = os.path.join(base_dir, category)
        if not os.path.exists(category_path):
            continue

        # カテゴリディレクトリ内の全HTMLファイルを取得
        for file in os.listdir(category_path):
            if file.endswith('.html'):
                html_files.append(os.path.join(category_path, file))

    # ルートディレクトリのその他のHTMLファイル
    for file in OTHER_HTML_FILES:
        file_path = os.path.join(base_dir, file)
        if os.path.exists(file_path):
            html_files.append(file_path)

    return sorted(html_files)

def main():
    parser = argparse.ArgumentParser(
        description='全てのAWS学習リソースHTMLファイルの「リソース集に戻る」ボタンのリンク先をlearning-resources.htmlに変更'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='実際の変更を行わずにプレビューのみ表示'
    )
    parser.add_argument(
        '--dir',
        type=str,
        default='.',
        help='リポジトリのルートディレクトリ（デフォルト: カレントディレクトリ）'
    )

    args = parser.parse_args()

    # リポジトリのルートディレクトリを取得
    base_dir = os.path.abspath(args.dir)

    if args.dry_run:
        print("=" * 70)
        print("DRY RUN MODE - 実際の変更は行いません")
        print("=" * 70)
        print()

    # HTMLファイルを検索
    html_files = find_html_files(base_dir)

    if not html_files:
        print("HTMLファイルが見つかりませんでした")
        return

    print(f"対象ファイル数: {len(html_files)}")
    print()

    # 統計情報
    stats = {
        'total': len(html_files),
        'updated': 0,
        'skipped': 0,
        'errors': 0
    }

    # 各HTMLファイルを処理
    for file_path in html_files:
        rel_path = os.path.relpath(file_path, base_dir)
        print(f"処理中: {rel_path}")

        status, message = process_html_file(file_path, dry_run=args.dry_run)

        if status == 'updated':
            stats['updated'] += 1
        elif status == 'skipped':
            stats['skipped'] += 1
        elif status == 'error':
            stats['errors'] += 1

        print(f"  → {message}")

    # 結果サマリー
    print()
    print("=" * 70)
    print("処理結果サマリー")
    print("=" * 70)
    print(f"合計ファイル数: {stats['total']}")
    print(f"ボタンリンク更新: {stats['updated']} ファイル")
    print(f"スキップ: {stats['skipped']} ファイル")
    print(f"エラー: {stats['errors']} ファイル")
    print()

    if args.dry_run:
        print("DRY RUN完了 - 実際の変更を行うには --dry-run フラグを外して再実行してください")
    else:
        print("処理完了！")
        print()
        print("次のステップ:")
        print("1. python3 server.py でローカルサーバーを起動してテスト")
        print("2. git add . && git commit -m 'fix: リソース集に戻るボタンのリンク先をlearning-resources.htmlに変更'")
        print("3. git push origin gh-pages")

if __name__ == '__main__':
    main()
