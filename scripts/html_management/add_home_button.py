#!/usr/bin/env python3
"""
全てのAWS学習リソースHTMLファイルに「リソース集に戻る」ボタンを追加するスクリプト

使用方法:
    python3 scripts/html_management/add_home_button.py --dry-run  # プレビューのみ
    python3 scripts/html_management/add_home_button.py            # 実際に実行
"""

import os
import sys
import argparse
from pathlib import Path

# リソース集に戻るボタンのHTML（右下固定のフローティングボタン）
# WCAG 2.1 AA準拠: #dc7600 (アクセシブルなAWSオレンジ)
RESOURCE_BUTTON_HTML = '''<button style="position: fixed; bottom: 30px; right: 30px; background-color: #dc7600; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-size: 1.1em; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3); transition: all 0.3s ease; z-index: 1000;" onclick="window.location.href='../learning-resources.html'" onmouseover="this.style.backgroundColor='#E68900'; this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(255, 153, 0, 0.4)';" onmouseout="this.style.backgroundColor='#dc7600'; this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(255, 153, 0, 0.3)';">🏠 リソース集に戻る</button>
'''

# 後方互換性のためのエイリアス
HOME_BUTTON_HTML = RESOURCE_BUTTON_HTML

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

def has_home_button(content):
    """HTMLコンテンツに既にリソースボタンがあるかチェック（旧形式も含む）"""
    return 'ホームに戻る' in content or 'リソース集に戻る' in content

def add_home_button_to_html(content):
    """HTMLコンテンツにリソース集に戻るボタンを追加"""
    # </body>タグの直前にボタンを挿入
    if '</body>' in content:
        # </body>の直前に改行とボタンを挿入
        content = content.replace('</body>', f'{RESOURCE_BUTTON_HTML}\n</body>')
        return content
    else:
        print("  WARNING: </body> タグが見つかりませんでした")
        return None

def process_html_file(file_path, dry_run=False):
    """
    HTMLファイルにホームボタンを追加

    Args:
        file_path: HTMLファイルのパス
        dry_run: Trueの場合は実際の変更を行わない

    Returns:
        (success, message): 処理結果
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 既にボタンがある場合はスキップ
        if has_home_button(content):
            return ('skipped', "既にリソースボタンあり - スキップ")

        # リソース集に戻るボタンを追加
        updated_content = add_home_button_to_html(content)

        if updated_content is None:
            return ('error', "エラー: </body>タグが見つかりません")

        # dry-runでない場合のみファイルを更新
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            return ('updated', "リソース集に戻るボタンを追加しました")
        else:
            return ('updated', "リソース集に戻るボタンを追加予定（dry-run）")

    except Exception as e:
        return ('error', f"エラー: {str(e)}")

def find_html_files(base_dir):
    """
    カテゴリディレクトリ内の全HTMLファイルを検索

    Args:
        base_dir: リポジトリのルートディレクトリ

    Returns:
        HTMLファイルパスのリスト
    """
    html_files = []

    for category in CATEGORY_DIRS:
        category_path = os.path.join(base_dir, category)
        if not os.path.exists(category_path):
            continue

        # カテゴリディレクトリ内の全HTMLファイルを取得
        for file in os.listdir(category_path):
            if file.endswith('.html'):
                html_files.append(os.path.join(category_path, file))

    return sorted(html_files)

def main():
    parser = argparse.ArgumentParser(
        description='全てのAWS学習リソースHTMLファイルに「リソース集に戻る」ボタンを追加'
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
        print()

    # 結果サマリー
    print("=" * 70)
    print("処理結果サマリー")
    print("=" * 70)
    print(f"合計ファイル数: {stats['total']}")
    print(f"リソースボタン追加: {stats['updated']} ファイル")
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
        print("2. W3C Validator (https://validator.w3.org/) で修正したHTMLファイルを検証")
        print("3. git add . && git commit -m 'feat: 全AWS学習リソースにリソース集に戻るボタンを追加'")
        print("4. git push origin gh-pages")

if __name__ == '__main__':
    main()
