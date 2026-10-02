#!/usr/bin/env python3
"""
HTMLファイルから既存のブレッドクラムを削除するスクリプト
"""

import re
from pathlib import Path


def remove_breadcrumb_from_file(file_path):
    """HTMLファイルからブレッドクラムを削除"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # ブレッドクラムがない場合はスキップ
        if "breadcrumb-nav" not in content:
            return False

        # ブレッドクラムHTMLを削除
        content = re.sub(
            r"<!-- ブレッドクラムナビゲーション -->.*?</nav>\s*",
            "",
            content,
            flags=re.DOTALL,
        )

        # ブレッドクラムCSSを削除
        content = re.sub(
            r"/\* ブレッドクラムナビゲーション \*/.*?@media \(max-width: 768px\) \{.*?\}\s*\}",
            "",
            content,
            flags=re.DOTALL,
        )

        # ファイルに書き込み
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"  ✅ 削除完了: {file_path}")
        return True

    except Exception as e:  # noqa: BLE001  想定外の例外も報告して続行する
        print(f"  ❌ エラー: {file_path} - {e!s}")
        return False


def main():
    """メイン処理"""
    base_dir = Path("/home/suzuki100603/aws_sap")

    # 対象ディレクトリ
    target_dirs = [
        "networking",
        "security-governance",
        "compute-applications",
        "content-delivery-dns",
        "development-deployment",
        "storage-database",
        "migration-transfer",
        "analytics-bigdata",
        "data-analytics",
        "new-solutions",
        "organizational-complexity",
        "continuous-improvement",
        "migration",
        "migration-planning",
        "storage",
        "cost-control",
    ]

    total_removed = 0

    print("\n🗑️  ブレッドクラム削除スクリプト開始\n")

    for dir_name in target_dirs:
        dir_path = base_dir / dir_name
        if not dir_path.exists():
            continue

        print(f"📁 {dir_name}/ を処理中...")

        # HTMLファイルを検索
        html_files = list(dir_path.glob("*.html"))

        for html_file in html_files:
            if remove_breadcrumb_from_file(html_file):
                total_removed += 1

    print(f"\n✨ 完了！{total_removed} ファイルからブレッドクラムを削除しました\n")


if __name__ == "__main__":
    main()
