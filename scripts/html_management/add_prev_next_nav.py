#!/usr/bin/env python3
"""
AWSリソースページに前後ナビゲーション（← 前へ / 次へ →）ボタンを追加するスクリプト

カテゴリ内のリソース間を移動できる固定ボトムバーを追加します。

使用方法:
    python3 scripts/html_management/add_prev_next_nav.py --dry-run  # プレビューのみ
    python3 scripts/html_management/add_prev_next_nav.py            # 実際に実行
"""

import os
import sys
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional


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


def parse_data_js(repo_root: Path) -> Dict[str, List[str]]:
    """
    data.jsを解析してカテゴリごとのリソースパスリストを取得

    行ベースの解析を行い、カテゴリIDを検出したらそのカテゴリに属する
    リソース（href）を次のカテゴリIDが出現するまで収集します。

    Returns:
        Dict[str, List[str]]: カテゴリID -> リソースパスのリスト（順序保持）
    """
    data_js_path = repo_root / "data.js"

    if not data_js_path.exists():
        print(f"❌ エラー: data.js が見つかりません: {data_js_path}")
        return {}

    with open(data_js_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # カテゴリごとのリソースを抽出
    category_resources: Dict[str, List[str]] = {}

    current_category = None
    category_id_pattern = re.compile(r"id:\s*['\"]([a-zA-Z0-9-]+)['\"]")
    href_pattern = re.compile(r"href:\s*['\"]([^'\"]+\.html)['\"]")

    for line in lines:
        # カテゴリIDを検出
        id_match = category_id_pattern.search(line)
        if id_match:
            category_id = id_match.group(1)
            # 有効なカテゴリIDかチェック（メインカテゴリのみ対象）
            main_categories = [
                'networking', 'security-governance', 'compute-applications',
                'content-delivery-dns', 'development-deployment', 'storage-database',
                'migration', 'analytics-operations'
            ]
            if category_id in main_categories:
                current_category = category_id
                if current_category not in category_resources:
                    category_resources[current_category] = []

        # hrefを検出（現在のカテゴリに追加）
        if current_category:
            href_match = href_pattern.search(line)
            if href_match:
                href = href_match.group(1)
                # 相対パスを正規化（先頭の./や../を除去して純粋なパスに）
                normalized_href = href.lstrip('./')
                category_resources[current_category].append(normalized_href)

    return category_resources


def get_category_for_file(file_path: str, category_resources: Dict[str, List[str]]) -> Optional[str]:
    """
    ファイルパスが属するカテゴリIDを取得

    Args:
        file_path: ファイルの相対パス（例: 'networking/aws-direct-connect-guide.html'）
        category_resources: カテゴリID -> リソースパスのマッピング

    Returns:
        カテゴリID、見つからない場合はNone
    """
    for category_id, resources in category_resources.items():
        if file_path in resources:
            return category_id
    return None


def get_prev_next_resources(
    file_path: str,
    category_resources: Dict[str, List[str]]
) -> Tuple[Optional[str], Optional[str], int, int]:
    """
    指定ファイルの前後のリソースパスを取得

    Args:
        file_path: 現在のファイルパス
        category_resources: カテゴリ -> リソースパスのマッピング

    Returns:
        (prev_path, next_path, current_index, total_count)
        パスは相対パス、存在しない場合はNone
    """
    category_id = get_category_for_file(file_path, category_resources)

    if not category_id:
        return None, None, 0, 0

    resources = category_resources[category_id]

    try:
        current_index = resources.index(file_path)
    except ValueError:
        return None, None, 0, 0

    total_count = len(resources)

    # 前のリソース
    prev_path = resources[current_index - 1] if current_index > 0 else None

    # 次のリソース
    next_path = resources[current_index + 1] if current_index < total_count - 1 else None

    return prev_path, next_path, current_index + 1, total_count


def calculate_relative_path(from_file: str, to_file: str) -> str:
    """
    from_fileからto_fileへの相対パスを計算

    Args:
        from_file: 起点ファイルパス（例: 'networking/file1.html'）
        to_file: 目標ファイルパス（例: 'new-solutions/file2.html'）

    Returns:
        相対パス（例: '../new-solutions/file2.html'）
    """
    from_parts = Path(from_file).parts
    to_parts = Path(to_file).parts

    # 同じディレクトリの場合
    if len(from_parts) == len(to_parts) == 2 and from_parts[0] == to_parts[0]:
        return to_parts[1]

    # 異なるディレクトリの場合
    if len(from_parts) >= 2 and len(to_parts) >= 2:
        return f"../{to_file}"

    return to_file


def generate_prev_next_nav_html(
    prev_path: Optional[str],
    next_path: Optional[str],
    current_index: int,
    total_count: int,
    from_file: str
) -> str:
    """
    前後ナビゲーションのHTMLを生成

    Args:
        prev_path: 前のリソースパス（Noneの場合はdisabled）
        next_path: 次のリソースパス（Noneの場合はdisabled）
        current_index: 現在のリソース番号（1始まり）
        total_count: カテゴリ内の総リソース数
        from_file: 現在のファイルパス（相対パス計算用）

    Returns:
        ナビゲーションHTML文字列
    """
    # 相対パスを計算
    prev_href = calculate_relative_path(from_file, prev_path) if prev_path else "#"
    next_href = calculate_relative_path(from_file, next_path) if next_path else "#"

    # disabledクラスとスタイル
    prev_disabled = 'disabled' if not prev_path else ''
    next_disabled = 'disabled' if not next_path else ''

    prev_onclick = f"window.location.href='{prev_href}'" if prev_path else "return false"
    next_onclick = f"window.location.href='{next_href}'" if next_path else "return false"

    # ナビゲーションHTML（インラインスタイル）
    nav_html = f'''<!-- 前後ナビゲーション -->
<nav class="prev-next-nav" style="position: fixed; bottom: 100px; left: 0; right: 0; background: linear-gradient(135deg, #232F3E, #374151); padding: 12px 20px; z-index: 999; box-shadow: 0 -2px 10px rgba(0,0,0,0.2); display: flex; justify-content: center; align-items: center; gap: 20px;">
    <style>
        @media (min-width: 1025px) {{
            .prev-next-nav {{
                left: 360px !important;
            }}
        }}
        @media (min-width: 769px) and (max-width: 1024px) {{
            .prev-next-nav {{
                left: 310px !important;
            }}
        }}
        @media (max-width: 768px) {{
            .prev-next-nav {{
                left: 0 !important;
                flex-direction: column !important;
                gap: 8px !important;
                padding: 10px 15px !important;
            }}
            .prev-next-nav .nav-buttons {{
                display: flex !important;
                width: 100% !important;
                gap: 10px !important;
            }}
            .prev-next-nav .nav-btn {{
                flex: 1 !important;
            }}
        }}
    </style>
    <div class="nav-buttons" style="display: flex; gap: 15px; align-items: center;">
        <button class="nav-btn prev-btn {prev_disabled}" onclick="{prev_onclick}" style="background-color: {('#dc7600' if prev_path else '#6B7280')}; color: white; border: none; padding: 10px 20px; border-radius: 25px; font-size: 1em; font-weight: bold; cursor: {'pointer' if prev_path else 'not-allowed'}; transition: all 0.3s ease; min-width: 100px;" {'onmouseover="this.style.backgroundColor=\'#E68900\'; this.style.transform=\'scale(1.05)\';" onmouseout="this.style.backgroundColor=\'#dc7600\'; this.style.transform=\'scale(1)\';"' if prev_path else ''}>← 前へ</button>
        <span class="nav-counter" style="color: white; font-size: 0.95em; font-weight: 500; min-width: 60px; text-align: center;">{current_index} / {total_count}</span>
        <button class="nav-btn next-btn {next_disabled}" onclick="{next_onclick}" style="background-color: {('#dc7600' if next_path else '#6B7280')}; color: white; border: none; padding: 10px 20px; border-radius: 25px; font-size: 1em; font-weight: bold; cursor: {'pointer' if next_path else 'not-allowed'}; transition: all 0.3s ease; min-width: 100px;" {'onmouseover="this.style.backgroundColor=\'#E68900\'; this.style.transform=\'scale(1.05)\';" onmouseout="this.style.backgroundColor=\'#dc7600\'; this.style.transform=\'scale(1)\';"' if next_path else ''}>次へ →</button>
    </div>
</nav>
'''
    return nav_html


def has_prev_next_nav(content: str) -> bool:
    """HTMLコンテンツに既に前後ナビゲーションがあるかチェック"""
    return 'prev-next-nav' in content or '前後ナビゲーション' in content


def add_prev_next_nav_to_html(content: str, nav_html: str) -> Optional[str]:
    """HTMLコンテンツに前後ナビゲーションを追加"""
    # </body>タグの直前にナビゲーションを挿入
    if '</body>' in content:
        content = content.replace('</body>', f'{nav_html}\n</body>')
        return content
    else:
        print("  WARNING: </body> タグが見つかりませんでした")
        return None


def process_html_file(
    file_path: Path,
    repo_root: Path,
    category_resources: Dict[str, List[str]],
    dry_run: bool = False
) -> Tuple[str, str]:
    """
    HTMLファイルに前後ナビゲーションを追加

    Args:
        file_path: HTMLファイルの絶対パス
        repo_root: リポジトリルート
        category_resources: カテゴリ -> リソースマッピング
        dry_run: Trueの場合は実際の変更を行わない

    Returns:
        (status, message): 処理結果
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 相対パスを計算
        rel_path = str(file_path.relative_to(repo_root))

        # 既にナビゲーションがある場合はスキップ
        if has_prev_next_nav(content):
            return ('skipped', "既に前後ナビゲーションあり - スキップ")

        # data.jsに登録されているかチェック
        category_id = get_category_for_file(rel_path, category_resources)
        if not category_id:
            return ('skipped', "data.js未登録 - スキップ")

        # 前後のリソースを取得
        prev_path, next_path, current_idx, total = get_prev_next_resources(
            rel_path, category_resources
        )

        if total == 0:
            return ('skipped', "カテゴリ内リソースなし - スキップ")

        # ナビゲーションHTMLを生成
        nav_html = generate_prev_next_nav_html(
            prev_path, next_path, current_idx, total, rel_path
        )

        # ナビゲーションを追加
        updated_content = add_prev_next_nav_to_html(content, nav_html)

        if updated_content is None:
            return ('error', "エラー: </body>タグが見つかりません")

        # dry-runでない場合のみファイルを更新
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            return ('updated', f"前後ナビゲーション追加 ({current_idx}/{total})")
        else:
            return ('updated', f"前後ナビゲーション追加予定 ({current_idx}/{total}, dry-run)")

    except Exception as e:
        return ('error', f"エラー: {str(e)}")


def find_html_files(repo_root: Path) -> List[Path]:
    """
    カテゴリディレクトリ内の全HTMLファイルを検索

    Args:
        repo_root: リポジトリのルートディレクトリ

    Returns:
        HTMLファイルパスのリスト
    """
    html_files = []

    for category in CATEGORY_DIRS:
        category_path = repo_root / category
        if not category_path.exists():
            continue

        # カテゴリディレクトリ内の全HTMLファイルを取得
        for file in category_path.iterdir():
            if file.suffix == '.html':
                html_files.append(file)

    return sorted(html_files)


def main():
    parser = argparse.ArgumentParser(
        description='AWS学習リソースHTMLファイルに前後ナビゲーションを追加'
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
    repo_root = Path(args.dir).resolve()

    if args.dry_run:
        print("=" * 70)
        print("DRY RUN MODE - 実際の変更は行いません")
        print("=" * 70)
        print()

    # data.jsを解析
    print("📋 data.js を解析中...")
    category_resources = parse_data_js(repo_root)

    if not category_resources:
        print("❌ カテゴリリソースの解析に失敗しました")
        return 1

    total_resources = sum(len(r) for r in category_resources.values())
    print(f"✅ {len(category_resources)} カテゴリ、{total_resources} リソースを検出")
    print()

    # HTMLファイルを検索
    html_files = find_html_files(repo_root)

    if not html_files:
        print("HTMLファイルが見つかりませんでした")
        return 1

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
        rel_path = file_path.relative_to(repo_root)
        print(f"処理中: {rel_path}")

        status, message = process_html_file(
            file_path, repo_root, category_resources, dry_run=args.dry_run
        )

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
    print(f"ナビゲーション追加: {stats['updated']} ファイル")
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
        print("3. 前後ナビゲーションの動作確認（最初/最後のリソースでdisabled状態確認）")
        print("4. モバイル表示確認（DevToolsでレスポンシブテスト）")

    return 0


if __name__ == '__main__':
    sys.exit(main())
