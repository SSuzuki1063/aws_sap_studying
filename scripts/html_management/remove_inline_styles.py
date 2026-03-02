#!/usr/bin/env python3
"""
HTMLファイルの<body>内にある<style>タグを削除するスクリプト
W3C HTML5準拠のため、<style>は<head>内にのみ配置する必要がある
"""

import os
import re
import sys
from pathlib import Path

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent.parent

# 対象ディレクトリ
TARGET_DIRS = [
    'networking',
    'security-governance',
    'compute-applications',
    'storage-database',
    'migration',
    'analytics-bigdata',
    'development-deployment',
    'content-delivery-dns',
    'organizational-complexity',
    'continuous-improvement',
    'cost-control',
    'new-solutions',
]

# ルートレベルのHTMLファイルも対象
ROOT_HTML_FILES = [
    'development-roadmap.html',
    'development-flowchart.html',
    'development-usecase.html',
    'profile.html',
    'quiz.html',
]


def remove_style_from_body(html_content: str) -> tuple[str, int]:
    """
    <body>タグ以降にある<style>...</style>ブロックを削除する

    Returns:
        tuple: (修正後のHTML, 削除したスタイルブロック数)
    """
    # <body>タグの位置を見つける
    body_match = re.search(r'<body[^>]*>', html_content, re.IGNORECASE)
    if not body_match:
        return html_content, 0

    body_start = body_match.end()

    # <body>以降の部分を取得
    before_body = html_content[:body_start]
    after_body = html_content[body_start:]

    # <style>...</style>ブロックを削除（複数行対応）
    # 注意: <!-- --> コメント内のスタイルは保持
    style_pattern = r'\s*<style[^>]*>[\s\S]*?</style>\s*'

    # 削除前のスタイルブロック数をカウント
    style_count = len(re.findall(style_pattern, after_body, re.IGNORECASE))

    # スタイルブロックを削除
    cleaned_after_body = re.sub(style_pattern, '\n', after_body, flags=re.IGNORECASE)

    return before_body + cleaned_after_body, style_count


def process_file(filepath: Path, dry_run: bool = False) -> dict:
    """
    単一のHTMLファイルを処理する

    Args:
        filepath: 処理対象のファイルパス
        dry_run: Trueの場合、実際の変更は行わない

    Returns:
        dict: 処理結果 {'file': str, 'styles_removed': int, 'success': bool, 'error': str}
    """
    result = {
        'file': str(filepath.relative_to(PROJECT_ROOT)),
        'styles_removed': 0,
        'success': False,
        'error': None
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()

        modified_content, styles_removed = remove_style_from_body(original_content)
        result['styles_removed'] = styles_removed

        if styles_removed > 0:
            if not dry_run:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(modified_content)
            result['success'] = True
        else:
            result['success'] = True  # スタイルがなくても成功

    except Exception as e:
        result['error'] = str(e)

    return result


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='HTMLファイルの<body>内にある<style>タグを削除'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='変更を実行せず、影響を確認するのみ'
    )
    parser.add_argument(
        'files',
        nargs='*',
        help='処理対象ファイル（指定しない場合は全ファイル）'
    )

    args = parser.parse_args()

    # 処理対象ファイルの収集
    files_to_process = []

    if args.files:
        # 引数で指定されたファイル
        for f in args.files:
            filepath = Path(f)
            if not filepath.is_absolute():
                filepath = PROJECT_ROOT / filepath
            if filepath.exists() and filepath.suffix == '.html':
                files_to_process.append(filepath)
    else:
        # 全ディレクトリのHTMLファイル
        for dir_name in TARGET_DIRS:
            dir_path = PROJECT_ROOT / dir_name
            if dir_path.exists():
                files_to_process.extend(dir_path.glob('*.html'))

        # ルートレベルのHTMLファイル
        for filename in ROOT_HTML_FILES:
            filepath = PROJECT_ROOT / filename
            if filepath.exists():
                files_to_process.append(filepath)

    if not files_to_process:
        print("処理対象ファイルがありません")
        return

    print(f"{'[DRY RUN] ' if args.dry_run else ''}処理開始...")
    print(f"対象ファイル数: {len(files_to_process)}")
    print("=" * 60)

    total_modified = 0
    total_styles_removed = 0
    errors = []

    for filepath in sorted(files_to_process):
        result = process_file(filepath, dry_run=args.dry_run)

        if result['error']:
            errors.append(result)
            print(f"❌ {result['file']}: {result['error']}")
        elif result['styles_removed'] > 0:
            total_modified += 1
            total_styles_removed += result['styles_removed']
            print(f"✅ {result['file']}: {result['styles_removed']}個のスタイルブロック削除")
        # スタイルがないファイルは表示しない

    print("=" * 60)
    print(f"完了: {total_modified}ファイル修正, {total_styles_removed}スタイルブロック削除")

    if errors:
        print(f"\nエラー: {len(errors)}件")
        for err in errors:
            print(f"  - {err['file']}: {err['error']}")
        sys.exit(1)


if __name__ == '__main__':
    main()
