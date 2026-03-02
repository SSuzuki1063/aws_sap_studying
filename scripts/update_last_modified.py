#!/usr/bin/env python3
"""
index.htmlに最終更新日（Gitの最終コミット日時）を自動的に埋め込むスクリプト

使用方法:
    python3 scripts/update_last_modified.py

実行すると:
    - Gitの最終コミット日時を取得
    - index.htmlのプレースホルダー<!-- GIT_LAST_COMMIT_DATE -->を置換
    - 日付フォーマット: YYYY/MM/DD
"""

import subprocess
import re
import os
from datetime import datetime

def get_git_last_commit_date():
    """
    Gitリポジトリの最終コミット日時を取得

    Returns:
        str: YYYY/MM/DD形式の日付文字列
    """
    try:
        # Gitの最終コミット日時を取得（ISO 8601形式）
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%cI'],
            capture_output=True,
            text=True,
            check=True
        )

        # ISO 8601形式の日付文字列をパース
        commit_date_str = result.stdout.strip()
        commit_date = datetime.fromisoformat(commit_date_str.replace('Z', '+00:00'))

        # YYYY/MM/DD形式にフォーマット
        formatted_date = commit_date.strftime('%Y/%m/%d')

        return formatted_date
    except subprocess.CalledProcessError as e:
        print(f"Error: Gitコマンドの実行に失敗しました: {e}")
        return None
    except Exception as e:
        print(f"Error: 日付の取得に失敗しました: {e}")
        return None

def update_index_html(last_commit_date):
    """
    index.htmlのプレースホルダーを最終コミット日時で置換

    Args:
        last_commit_date (str): YYYY/MM/DD形式の日付文字列

    Returns:
        bool: 成功した場合True、失敗した場合False
    """
    index_html_path = 'index.html'

    if not os.path.exists(index_html_path):
        print(f"Error: {index_html_path}が見つかりません")
        return False

    try:
        # index.htmlを読み込み
        with open(index_html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # プレースホルダーを置換
        placeholder = "const gitLastCommitDate = '<!-- GIT_LAST_COMMIT_DATE -->';"
        replacement = f"const gitLastCommitDate = '{last_commit_date}';"

        if placeholder not in content:
            print(f"Warning: プレースホルダー '{placeholder}' が見つかりません")
            print("既に日付が埋め込まれている可能性があります")

            # 既存の日付パターンを検索して置換
            pattern = r"const gitLastCommitDate = '\d{4}/\d{2}/\d{2}';"
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                print(f"既存の日付を更新しました: {last_commit_date}")
            else:
                return False
        else:
            content = content.replace(placeholder, replacement)
            print(f"プレースホルダーを置換しました: {last_commit_date}")

        # index.htmlに書き込み
        with open(index_html_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f"Error: ファイルの更新に失敗しました: {e}")
        return False

def main():
    """メイン処理"""
    print("=" * 60)
    print("index.html 最終更新日自動更新スクリプト")
    print("=" * 60)

    # リポジトリのルートディレクトリに移動
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    os.chdir(repo_root)

    print(f"\n作業ディレクトリ: {os.getcwd()}\n")

    # Gitの最終コミット日時を取得
    last_commit_date = get_git_last_commit_date()

    if last_commit_date is None:
        print("\nエラー: 最終コミット日時の取得に失敗しました")
        return 1

    print(f"最終コミット日時: {last_commit_date}")

    # index.htmlを更新
    if update_index_html(last_commit_date):
        print("\n✅ 成功: index.htmlを更新しました")
        print(f"   最終更新日: {last_commit_date}")
        return 0
    else:
        print("\n❌ エラー: index.htmlの更新に失敗しました")
        return 1

if __name__ == '__main__':
    exit(main())
