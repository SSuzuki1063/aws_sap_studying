#!/usr/bin/env python3
"""
AWS SAP 学習リソース カウント検証・更新ガイド

data.jsを解析してカウントの不整合を検出し、
修正が必要な箇所をガイドします。

注意: data.jsの構造が複雑なため、自動更新は行わず、
検出結果に基づいて手動で修正してください。
"""

import re
from pathlib import Path
import argparse


class CountChecker:
    """data.jsのカウントを検証するクラス"""

    def __init__(self):
        self.repo_root = Path(__file__).parent.parent.parent
        self.data_js_path = self.repo_root / "data.js"

    def parse_data_js(self) -> str:
        """data.jsを読み込む"""
        with open(self.data_js_path, 'r', encoding='utf-8') as f:
            return f.read()

    def count_total_resources(self, content: str) -> int:
        """リソース総数をカウント"""
        # { title: '...', href: '...' } パターンをカウント（categoriesData内のみ）
        # categoriesDataの範囲を特定
        categories_start = content.find('const categoriesData = [')
        categories_end = content.find('];', categories_start)
        if categories_start == -1 or categories_end == -1:
            return 0

        categories_content = content[categories_start:categories_end]
        resources = re.findall(r"\{\s*title:\s*'[^']*',\s*href:\s*'[^']*'\s*\}", categories_content)
        return len(resources)

    def get_current_total_resources(self, content: str) -> str:
        """現在のtotalResources値を取得"""
        match = re.search(r"totalResources:\s*'([^']*)'", content)
        return match.group(1) if match else "unknown"

    def check(self) -> bool:
        """カウント検証のメイン処理"""
        print("🔍 data.js カウント検証")
        print("=" * 60)

        content = self.parse_data_js()

        # リソース総数をチェック
        actual_count = self.count_total_resources(content)
        current_value = self.get_current_total_resources(content)

        print(f"\n📊 リソース総数:")
        print(f"   現在の設定値: {current_value}")
        print(f"   実際のリソース数: {actual_count}")

        expected_value = f"{actual_count}+"

        if current_value != expected_value:
            print(f"\n⚠️  不整合検出!")
            print(f"   推奨値: '{expected_value}'")
            print(f"\n   修正方法:")
            print(f"   data.jsで以下を検索・置換:")
            print(f"   - 検索: totalResources: '{current_value}'")
            print(f"   - 置換: totalResources: '{expected_value}'")
        else:
            print(f"\n✅ totalResourcesは正しいです")

        print("\n" + "=" * 60)
        print("💡 セクション・カテゴリカウントの検証には:")
        print("   python3 scripts/ci/check_data_integrity.py")
        print("=" * 60)

        return True


def main():
    parser = argparse.ArgumentParser(
        description="data.jsのリソースカウントを検証",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # カウントを検証
  python3 update_counts.py

注意:
  data.jsの構造が複雑なため、このスクリプトは検証のみ行い、
  自動更新は行いません。検出された不整合は手動で修正してください。
        """
    )

    parser.add_argument(
        "--dry-run", "-d",
        action="store_true",
        help="（互換性のため）検証のみ実行"
    )

    args = parser.parse_args()

    checker = CountChecker()
    success = checker.check()

    return 0 if success else 1


if __name__ == "__main__":
    exit(main())
