#!/usr/bin/env python3
"""
最終更新日自動更新スクリプト

このスクリプトは、data.jsファイル内の最終更新日（lastUpdated）を
最新のGitコミット日時で自動的に更新します。

使い方:
    python3 scripts/git_hooks/update_last_modified.py

実行タイミング:
    - pre-commit hookから自動実行
    - 手動実行も可能
"""

import os
import sys
import subprocess
import re
from datetime import datetime
from pathlib import Path


def get_git_root():
    """Gitリポジトリのルートディレクトリを取得"""
    try:
        result = subprocess.run(
            ['git', 'rev-parse', '--show-toplevel'],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        print("エラー: Gitリポジトリではありません", file=sys.stderr)
        sys.exit(1)


def get_last_commit_date():
    """最新のGitコミット日時を取得（YYYY/MM/DD形式）"""
    try:
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%cd', '--date=format:%Y/%m/%d'],
            capture_output=True,
            text=True,
            check=True
        )
        commit_date = result.stdout.strip()

        # コミットが存在しない場合は今日の日付を使用
        if not commit_date:
            today = datetime.now()
            commit_date = today.strftime('%Y/%m/%d')
            print(f"警告: コミット履歴が見つかりません。今日の日付を使用します: {commit_date}")

        return commit_date
    except subprocess.CalledProcessError as e:
        print(f"エラー: Gitコミット日時の取得に失敗しました: {e}", file=sys.stderr)
        # フォールバック: 今日の日付を返す
        today = datetime.now()
        return today.strftime('%Y/%m/%d')


def update_data_js(git_root, last_commit_date):
    """data.jsの最終更新日を更新"""
    data_js_path = Path(git_root) / 'data.js'

    if not data_js_path.exists():
        print(f"エラー: data.jsが見つかりません: {data_js_path}", file=sys.stderr)
        sys.exit(1)

    # data.jsを読み込み
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 正規表現パターン: lastUpdatedプロパティを検索
    # lastUpdated: '2025/12/28'  // GIT_LAST_COMMIT_DATE - このコメントは自動更新スクリプトのマーカーです
    pattern = r"(lastUpdated:\s*')[^']+('.*?//\s*GIT_LAST_COMMIT_DATE)"

    # 置換
    new_content = re.sub(
        pattern,
        rf"\g<1>{last_commit_date}\g<2>",
        content
    )

    # 変更があった場合のみファイルを更新
    if new_content != content:
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ data.jsの最終更新日を更新しました: {last_commit_date}")

        # Gitステージングエリアに追加（pre-commit hookから呼ばれた場合）
        try:
            subprocess.run(['git', 'add', str(data_js_path)], check=True)
            print(f"✅ data.jsをステージングエリアに追加しました")
        except subprocess.CalledProcessError:
            # ステージング失敗は警告のみ（手動実行時など）
            print("警告: data.jsのステージングに失敗しました（手動実行時は正常）")

        return True
    else:
        print(f"ℹ️  最終更新日は既に最新です: {last_commit_date}")
        return False


def main():
    """メイン処理"""
    print("=" * 60)
    print("最終更新日自動更新スクリプト")
    print("=" * 60)

    # Gitリポジトリのルートを取得
    git_root = get_git_root()
    print(f"📁 Gitリポジトリルート: {git_root}")

    # 最新のコミット日時を取得
    last_commit_date = get_last_commit_date()
    print(f"📅 最新コミット日時: {last_commit_date}")

    # data.jsを更新
    updated = update_data_js(git_root, last_commit_date)

    print("=" * 60)
    if updated:
        print("✅ 更新完了")
    else:
        print("✅ 更新不要（既に最新）")
    print("=" * 60)

    return 0


if __name__ == '__main__':
    sys.exit(main())
