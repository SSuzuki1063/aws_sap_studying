#!/usr/bin/env python3
"""
サイドバー目次（TOC）の位置を修正するスクリプト

固定ナビゲーションヘッダーとの重なりを解消するため、
サイドバー目次のtop位置を60px下げ、高さを調整します。

修正内容:
- .sidebar-toc の top: 0 → top: 60px
- .sidebar-toc の height: 100vh → height: calc(100vh - 60px)
"""

import os
import re
from pathlib import Path


def fix_toc_position_in_file(file_path):
    """
    HTMLファイル内のサイドバーTOCの位置を修正

    Args:
        file_path: 修正対象のHTMLファイルパス

    Returns:
        bool: 修正が行われた場合True、されなかった場合False
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 元のコンテンツを保存
        original_content = content

        # パターン1: .sidebar-toc の top: 0; を top: 60px; に変更
        # 複数のスペースやタブに対応
        pattern1 = r'(\.sidebar-toc\s*{[^}]*?position:\s*fixed;[^}]*?)top:\s*0;'
        replacement1 = r'\1top: 60px; /* 固定ヘッダー分下げる */'
        content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)

        # パターン2: height: 100vh; を height: calc(100vh - 60px); に変更
        pattern2 = r'(\.sidebar-toc\s*{[^}]*?)height:\s*100vh;'
        replacement2 = r'\1height: calc(100vh - 60px); /* 固定ヘッダー分引く */'
        content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

        # 変更があった場合のみファイルを書き込む
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        else:
            return False

    except Exception as e:
        print(f"エラー: {file_path} の処理中に問題が発生しました: {e}")
        return False


def main():
    """
    全HTMLファイルのサイドバーTOC位置を修正
    """
    # リポジトリのルートディレクトリ
    repo_root = Path(__file__).parent.parent.parent

    # 除外するファイル
    excluded_files = {'index.html', 'table-of-contents.html', 'quiz.html', 'home.html',
                      'knowledge-base.html', 'learning-resources.html'}

    # カテゴリディレクトリ
    category_dirs = [
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

    modified_count = 0
    total_count = 0

    print("=" * 70)
    print("サイドバー目次（TOC）位置修正スクリプト")
    print("=" * 70)
    print()

    # 各カテゴリディレクトリ内のHTMLファイルを処理
    for category_dir in category_dirs:
        category_path = repo_root / category_dir

        if not category_path.exists():
            continue

        html_files = list(category_path.glob('*.html'))

        if html_files:
            print(f"\n📁 {category_dir}/ を処理中...")

            for html_file in html_files:
                if html_file.name not in excluded_files:
                    total_count += 1
                    if fix_toc_position_in_file(html_file):
                        modified_count += 1
                        print(f"  ✅ 修正: {html_file.name}")
                    else:
                        print(f"  ⏭️  スキップ: {html_file.name} (変更なし)")

    # ルートディレクトリの特定ファイルも確認
    root_files = ['aws_glossary.html', 'development-flowchart.html',
                  'development-roadmap.html', 'development-usecase.html']

    print(f"\n📁 ルートディレクトリを処理中...")
    for filename in root_files:
        file_path = repo_root / filename
        if file_path.exists():
            total_count += 1
            if fix_toc_position_in_file(file_path):
                modified_count += 1
                print(f"  ✅ 修正: {filename}")
            else:
                print(f"  ⏭️  スキップ: {filename} (変更なし)")

    # 結果サマリー
    print()
    print("=" * 70)
    print("修正完了")
    print("=" * 70)
    print(f"処理したファイル数: {total_count}")
    print(f"修正したファイル数: {modified_count}")
    print(f"スキップしたファイル数: {total_count - modified_count}")
    print()

    if modified_count > 0:
        print("✅ サイドバー目次の位置が修正されました。")
        print("   固定ヘッダーと目次が重ならなくなりました。")
    else:
        print("⚠️  修正が必要なファイルが見つかりませんでした。")

    print()


if __name__ == "__main__":
    main()
