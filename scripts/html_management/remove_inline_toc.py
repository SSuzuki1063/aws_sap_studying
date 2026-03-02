#!/usr/bin/env python3
"""
古いインラインTOC（折り畳み式目次）を削除するスクリプト

左サイドバーTOCへの移行後、重複している古いインラインTOCを削除します。

使用方法:
    python3 scripts/html_management/remove_inline_toc.py --dry-run  # プレビューのみ
    python3 scripts/html_management/remove_inline_toc.py            # 実際に実行
"""

import os
import re
import glob
import argparse
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


def has_inline_toc(content):
    """HTMLコンテンツに古いインラインTOCがあるかチェック"""
    return 'id="toc-container"' in content


def has_sidebar_toc(content):
    """HTMLコンテンツに左サイドバーTOCがあるかチェック"""
    return 'class="sidebar-toc"' in content or 'id="sidebar-toc"' in content


def remove_inline_toc(content):
    """
    古いインラインTOCを削除

    削除対象:
    1. <!-- ページ内目次 --> コメント
    2. <div id="toc-container" ...>...</div> ブロック
    3. <style>#toc-container {...}</style> ブロック
    4. <script>function toggleTOC(){...}</script> ブロック
    """
    original_length = len(content)

    # 1. <!-- ページ内目次 --> コメントを削除
    content = re.sub(r'<!-- ページ内目次 -->\s*\n?', '', content)

    # 2. <div id="toc-container" ...>...</div> ブロックを削除
    # 複数行にわたる可能性があるため、DOTALLフラグを使用
    content = re.sub(
        r'<div\s+id="toc-container"[^>]*>.*?</div>\s*\n?',
        '',
        content,
        flags=re.DOTALL
    )

    # 3. <style>#toc-container {...}</style> ブロックを削除
    # インラインスタイルブロック全体を削除（#toc-containerを含むもの）
    content = re.sub(
        r'<style>\s*#toc-container[^<]*</style>\s*\n?',
        '',
        content,
        flags=re.DOTALL
    )

    # より広範囲のスタイルブロックも削除（#toc-container関連のスタイル）
    content = re.sub(
        r'<style>\s*\n?\s*#toc-container\s+a\s*\{[^}]*\}[^<]*</style>\s*\n?',
        '',
        content,
        flags=re.DOTALL
    )

    # 4. <script>function toggleTOC(){...}</script> ブロックを削除
    content = re.sub(
        r'<script>\s*\n?\s*function\s+toggleTOC\s*\(\)[^<]*</script>\s*\n?',
        '',
        content,
        flags=re.DOTALL
    )

    # 余分な空行を整理（3行以上の連続空行を2行に）
    content = re.sub(r'\n{4,}', '\n\n\n', content)

    removed_bytes = original_length - len(content)
    return content, removed_bytes


def process_html_file(file_path, dry_run=False):
    """
    HTMLファイルから古いインラインTOCを削除

    Args:
        file_path: HTMLファイルのパス
        dry_run: Trueの場合は実際の変更を行わない

    Returns:
        (status, message, removed_bytes): 処理結果
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # インラインTOCがない場合はスキップ
        if not has_inline_toc(content):
            return ('skipped', "インラインTOCなし - スキップ", 0)

        # サイドバーTOCがない場合は警告（削除すると目次がなくなる）
        if not has_sidebar_toc(content):
            return ('warning', "⚠️ サイドバーTOCなし - 削除するとTOCがなくなります", 0)

        # インラインTOCを削除
        updated_content, removed_bytes = remove_inline_toc(content)

        # 変更がない場合
        if content == updated_content:
            return ('unchanged', "削除パターンにマッチせず - スキップ", 0)

        # dry-runでない場合のみファイルを更新
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            return ('updated', f"インラインTOCを削除しました ({removed_bytes} bytes)", removed_bytes)
        else:
            return ('would_update', f"インラインTOCを削除予定 ({removed_bytes} bytes)", removed_bytes)

    except Exception as e:
        return ('error', f"エラー: {str(e)}", 0)


def find_html_files(base_dir):
    """カテゴリディレクトリ内の全HTMLファイルを検索"""
    html_files = []

    for category in CATEGORY_DIRS:
        category_path = os.path.join(base_dir, category)
        if not os.path.exists(category_path):
            continue

        for file in os.listdir(category_path):
            if file.endswith('.html'):
                html_files.append(os.path.join(category_path, file))

    return sorted(html_files)


def main():
    parser = argparse.ArgumentParser(
        description='古いインラインTOC（折り畳み式目次）を削除'
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
        'warnings': 0,
        'errors': 0,
        'total_bytes_removed': 0
    }

    warning_files = []

    # 各HTMLファイルを処理
    for file_path in html_files:
        rel_path = os.path.relpath(file_path, base_dir)

        status, message, removed_bytes = process_html_file(file_path, dry_run=args.dry_run)

        if status in ('updated', 'would_update'):
            stats['updated'] += 1
            stats['total_bytes_removed'] += removed_bytes
            print(f"✅ {rel_path}")
            print(f"   → {message}")
        elif status == 'warning':
            stats['warnings'] += 1
            warning_files.append(rel_path)
            print(f"⚠️  {rel_path}")
            print(f"   → {message}")
        elif status == 'error':
            stats['errors'] += 1
            print(f"❌ {rel_path}")
            print(f"   → {message}")
        # skipped と unchanged は表示しない（大量になるため）

    # 結果サマリー
    print()
    print("=" * 70)
    print("処理結果サマリー")
    print("=" * 70)
    print(f"合計ファイル数: {stats['total']}")
    print(f"インラインTOC削除: {stats['updated']} ファイル")
    print(f"削除バイト数: {stats['total_bytes_removed']:,} bytes ({stats['total_bytes_removed'] / 1024:.1f} KB)")
    print(f"警告: {stats['warnings']} ファイル")
    print(f"エラー: {stats['errors']} ファイル")
    print()

    if warning_files:
        print("⚠️  警告ファイル（サイドバーTOCなし）:")
        for f in warning_files:
            print(f"   - {f}")
        print()

    if args.dry_run:
        print("DRY RUN完了 - 実際の変更を行うには --dry-run フラグを外して再実行してください")
    else:
        print("処理完了！")
        print()
        print("次のステップ:")
        print("1. python3 server.py でローカルサーバーを起動してテスト")
        print("2. git add . && git commit -m 'refactor: 古いインラインTOCを削除し左サイドバーTOCに統一'")
        print("3. git push origin gh-pages")


if __name__ == '__main__':
    main()
