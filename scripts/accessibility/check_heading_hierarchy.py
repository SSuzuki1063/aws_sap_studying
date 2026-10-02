#!/usr/bin/env python3
"""
WCAG 2.1 見出し階層検証スクリプト

このスクリプトは、全てのHTMLファイルの見出し階層を検証し、
見出しレベルのスキップ（h1 → h3など）を検出します。

WCAG 2.1 達成基準:
- 1.3.1 情報及び関係性 (レベルA)
- 2.4.6 見出し及びラベル (レベルAA)
"""

import re
import sys
from pathlib import Path


def extract_headings(html_content):
    """HTMLコンテンツから見出しタグを抽出"""
    # h1-h6タグを抽出（タグの内容も取得）
    heading_pattern = r"<h([1-6])[^>]*>(.*?)</h\1>"
    headings = re.findall(heading_pattern, html_content, re.IGNORECASE | re.DOTALL)

    # (レベル, テキスト内容) のリストを返す
    return [(int(level), text.strip()[:50]) for level, text in headings]


def check_heading_hierarchy(headings):
    """
    見出し階層の問題を検出

    返り値:
    - errors: エラーのリスト
    - warnings: 警告のリスト
    """
    if not headings:
        return [], []

    errors = []
    warnings = []

    # h1が複数ある場合
    h1_count = sum(1 for level, _ in headings if level == 1)
    if h1_count == 0:
        errors.append("❌ h1タグが見つかりません（ページには1つのh1が必要）")
    elif h1_count > 1:
        warnings.append(f"⚠️  h1タグが{h1_count}個あります（通常は1つ推奨）")

    # 見出しレベルのスキップを検出
    for i in range(len(headings) - 1):
        current_level, current_text = headings[i]
        next_level, next_text = headings[i + 1]

        # レベルが2以上スキップ（例: h1 → h3, h2 → h5）
        if next_level > current_level + 1:
            errors.append(
                f"❌ 見出しレベルスキップ: h{current_level} → h{next_level}\n"
                f"   位置: ...{current_text}... → ...{next_text}..."
            )

    return errors, warnings


def scan_directory(directory):
    """ディレクトリ内の全HTMLファイルをスキャン"""
    html_files = list(Path(directory).rglob("*.html"))

    # 除外するファイル
    exclude_files = {
        "index.html",
        "quiz.html",
        "table-of-contents.html",
        "home.html",
        "knowledge-base.html",
    }

    results = []

    for file_path in html_files:
        # 除外ファイルをスキップ
        if file_path.name in exclude_files:
            continue

        # HTMLコンテンツを読み込み
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except (OSError, UnicodeDecodeError) as e:
            print(f"⚠️  読み込みエラー: {file_path} - {e}")
            continue

        # 見出しを抽出
        headings = extract_headings(content)

        # 階層を検証
        errors, warnings = check_heading_hierarchy(headings)

        # 結果を記録
        if errors or warnings:
            results.append(
                {
                    "file": str(file_path),
                    "headings": headings,
                    "errors": errors,
                    "warnings": warnings,
                }
            )

    return results


def print_results(results):
    """検証結果を表示"""
    print("=" * 80)
    print("WCAG 2.1 見出し階層検証レポート")
    print("=" * 80)

    if not results:
        print(
            "\n✅ 問題は見つかりませんでした。全てのHTMLファイルの見出し階層は正しいです。"
        )
        return

    # エラーと警告をカウント
    total_errors = sum(len(r["errors"]) for r in results)
    total_warnings = sum(len(r["warnings"]) for r in results)

    print("\n検証結果サマリー:")
    print(f"  問題のあるファイル: {len(results)}")
    print(f"  エラー総数: {total_errors}")
    print(f"  警告総数: {total_warnings}")

    # 各ファイルの詳細を表示
    for result in results:
        print("\n" + "=" * 80)
        print(f"ファイル: {result['file']}")
        print("=" * 80)

        # 見出し構造を表示
        print("\n見出し構造:")
        for level, text in result["headings"]:
            indent = "  " * (level - 1)
            print(f"{indent}h{level}: {text}")

        # エラーを表示
        if result["errors"]:
            print(f"\n🔴 エラー ({len(result['errors'])}件):")
            for error in result["errors"]:
                print(f"  {error}")

        # 警告を表示
        if result["warnings"]:
            print(f"\n🟡 警告 ({len(result['warnings'])}件):")
            for warning in result["warnings"]:
                print(f"  {warning}")

    # 推奨アクション
    print("\n" + "=" * 80)
    print("推奨アクション")
    print("=" * 80)
    print("""
1. エラーのあるファイルを修正:
   - 見出しレベルをスキップせず、順番に使用（h1 → h2 → h3）
   - h1は1ページに1つのみ

2. 見出し階層の例:
   ✅ 正しい:
   <h1>メインタイトル</h1>
   <h2>セクション1</h2>
   <h3>サブセクション1.1</h3>
   <h3>サブセクション1.2</h3>
   <h2>セクション2</h2>

   ❌ 誤り:
   <h1>メインタイトル</h1>
   <h3>サブセクション</h3>  <!-- h2をスキップ -->

3. 検証ツール:
   - HeadingsMap (ブラウザ拡張機能) で見出しツリーを可視化
   - WAVE, axe DevTools で自動検証

WCAG 2.1 関連基準:
- 1.3.1 情報及び関係性 (レベルA)
- 2.4.6 見出し及びラベル (レベルAA)
""")


def main():
    """メイン処理"""
    # リポジトリルートから実行されることを想定
    repo_root = Path(__file__).parent.parent.parent

    # 検証対象ディレクトリ
    directories = [
        "networking",
        "security-governance",
        "compute-applications",
        "content-delivery-dns",
        "development-deployment",
        "storage-database",
        "migration",
        "analytics-bigdata",
        "organizational-complexity",
        "continuous-improvement",
        "cost-control",
        "new-solutions",
    ]

    all_results = []

    for directory in directories:
        dir_path = repo_root / directory
        if dir_path.exists():
            results = scan_directory(dir_path)
            all_results.extend(results)

    print_results(all_results)

    # 終了コード
    if any(r["errors"] for r in all_results):
        sys.exit(1)  # エラーがある場合は1で終了
    else:
        sys.exit(0)  # 問題がない場合は0で終了


if __name__ == "__main__":
    main()
