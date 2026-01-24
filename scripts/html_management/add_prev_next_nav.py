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
    前後ナビゲーションのHTMLを生成（折りたたみ可能）

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

    # ナビゲーションHTML（折りたたみ可能、デフォルトは折りたたみ状態）
    nav_html = f'''<!-- 前後ナビゲーション（折りたたみ可能） -->
<div class="prev-next-nav-container" id="prevNextNavContainer">
    <style>
        .prev-next-nav-container {{
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }}
        .prev-next-toggle {{
            background: linear-gradient(135deg, #232F3E, #374151);
            color: white;
            border: none;
            padding: 10px 14px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }}
        .prev-next-toggle:hover {{
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }}
        .prev-next-toggle .toggle-icon {{
            transition: transform 0.3s ease;
        }}
        .prev-next-toggle.expanded .toggle-icon {{
            transform: rotate(180deg);
        }}
        .prev-next-nav-expanded {{
            position: absolute;
            bottom: 50px;
            right: 0;
            background: linear-gradient(135deg, #232F3E, #374151);
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            gap: 12px;
            min-width: 200px;
        }}
        .prev-next-nav-expanded.show {{
            display: flex;
        }}
        .prev-next-nav-expanded .nav-btn {{
            background-color: #dc7600;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.95em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }}
        .prev-next-nav-expanded .nav-btn:hover:not(.disabled) {{
            background-color: #E68900;
            transform: scale(1.02);
        }}
        .prev-next-nav-expanded .nav-btn.disabled {{
            background-color: #6B7280;
            cursor: not-allowed;
        }}
        .prev-next-nav-expanded .nav-counter {{
            color: white;
            font-size: 0.9em;
            text-align: center;
            padding: 5px 0;
            border-top: 1px solid rgba(255,255,255,0.2);
            margin-top: 5px;
        }}
        @media (max-width: 768px) {{
            .prev-next-nav-container {{
                right: 15px;
                bottom: 90px;
            }}
            .prev-next-nav-expanded {{
                min-width: 180px;
            }}
        }}
    </style>
    <button class="prev-next-toggle" id="prevNextToggle" onclick="togglePrevNextNav()" aria-label="前後ナビゲーションを開く" aria-expanded="false">
        <span class="toggle-icon">▲</span>
        <span>{current_index}/{total_count}</span>
    </button>
    <div class="prev-next-nav-expanded" id="prevNextExpanded" role="navigation" aria-label="前後ページナビゲーション">
        <button class="nav-btn prev-btn {prev_disabled}" onclick="{prev_onclick}" {'disabled' if not prev_path else ''} aria-label="前のページへ">← 前へ</button>
        <button class="nav-btn next-btn {next_disabled}" onclick="{next_onclick}" {'disabled' if not next_path else ''} aria-label="次のページへ">次へ →</button>
        <div class="nav-counter">{current_index} / {total_count} ページ</div>
    </div>
</div>
<script>
function togglePrevNextNav() {{
    const toggle = document.getElementById('prevNextToggle');
    const expanded = document.getElementById('prevNextExpanded');
    const isExpanded = expanded.classList.contains('show');

    if (isExpanded) {{
        expanded.classList.remove('show');
        toggle.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '前後ナビゲーションを開く');
        localStorage.setItem('prevNextNavExpanded', 'false');
    }} else {{
        expanded.classList.add('show');
        toggle.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', '前後ナビゲーションを閉じる');
        localStorage.setItem('prevNextNavExpanded', 'true');
    }}
}}

// ページ読み込み時にlocalStorageから状態を復元
document.addEventListener('DOMContentLoaded', function() {{
    const savedState = localStorage.getItem('prevNextNavExpanded');
    if (savedState === 'true') {{
        const toggle = document.getElementById('prevNextToggle');
        const expanded = document.getElementById('prevNextExpanded');
        expanded.classList.add('show');
        toggle.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
    }}
}});

// クリック外で閉じる
document.addEventListener('click', function(e) {{
    const container = document.getElementById('prevNextNavContainer');
    const expanded = document.getElementById('prevNextExpanded');
    if (container && !container.contains(e.target) && expanded.classList.contains('show')) {{
        togglePrevNextNav();
    }}
}});
</script>
'''
    return nav_html


def has_prev_next_nav(content: str) -> bool:
    """HTMLコンテンツに既に前後ナビゲーションがあるかチェック"""
    return 'prev-next-nav' in content or '前後ナビゲーション' in content


def remove_old_prev_next_nav(content: str) -> str:
    """
    古い前後ナビゲーションをHTMLコンテンツから削除

    2種類のナビゲーションを検出・削除:
    1. 古い固定バー形式: <nav class="prev-next-nav"...>...</nav>
    2. 新しい折りたたみ形式: <div class="prev-next-nav-container"...>...</div>
    """
    # 古い固定バー形式を削除
    # <!-- 前後ナビゲーション --> から </nav> まで
    old_nav_pattern = r'<!-- 前後ナビゲーション -->\s*<nav class="prev-next-nav".*?</nav>\s*'
    content = re.sub(old_nav_pattern, '', content, flags=re.DOTALL)

    # 新しい折りたたみ形式を削除
    # <!-- 前後ナビゲーション（折りたたみ可能） --> から </script> まで
    new_nav_pattern = r'<!-- 前後ナビゲーション（折りたたみ可能） -->\s*<div class="prev-next-nav-container".*?</script>\s*'
    content = re.sub(new_nav_pattern, '', content, flags=re.DOTALL)

    return content


def add_prev_next_nav_to_html(content: str, nav_html: str, force_update: bool = False) -> Optional[str]:
    """
    HTMLコンテンツに前後ナビゲーションを追加

    Args:
        content: HTMLコンテンツ
        nav_html: 追加するナビゲーションHTML
        force_update: Trueの場合、既存のナビゲーションを削除して新しいものに置き換え
    """
    # force_updateの場合は既存のナビゲーションを削除
    if force_update and has_prev_next_nav(content):
        content = remove_old_prev_next_nav(content)

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
    dry_run: bool = False,
    force_update: bool = False
) -> Tuple[str, str]:
    """
    HTMLファイルに前後ナビゲーションを追加

    Args:
        file_path: HTMLファイルの絶対パス
        repo_root: リポジトリルート
        category_resources: カテゴリ -> リソースマッピング
        dry_run: Trueの場合は実際の変更を行わない
        force_update: Trueの場合は既存のナビゲーションを置き換え

    Returns:
        (status, message): 処理結果
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 相対パスを計算
        rel_path = str(file_path.relative_to(repo_root))

        # 既にナビゲーションがある場合
        if has_prev_next_nav(content):
            if not force_update:
                return ('skipped', "既に前後ナビゲーションあり - スキップ（--force-updateで上書き可能）")
            # force_updateの場合は続行（後で古いものを削除）

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

        # ナビゲーションを追加（force_updateの場合は古いものを削除して置き換え）
        updated_content = add_prev_next_nav_to_html(content, nav_html, force_update=force_update)

        if updated_content is None:
            return ('error', "エラー: </body>タグが見つかりません")

        # dry-runでない場合のみファイルを更新
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            action = "更新" if force_update and has_prev_next_nav(content) else "追加"
            return ('updated', f"前後ナビゲーション{action} ({current_idx}/{total})")
        else:
            action = "更新予定" if force_update else "追加予定"
            return ('updated', f"前後ナビゲーション{action} ({current_idx}/{total}, dry-run)")

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
        '--force-update',
        action='store_true',
        help='既存のナビゲーションを新しいバージョンに置き換え'
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

    if args.force_update:
        print("=" * 70)
        print("FORCE UPDATE MODE - 既存のナビゲーションを新しいバージョンに置き換えます")
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
            file_path, repo_root, category_resources,
            dry_run=args.dry_run, force_update=args.force_update
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
