#!/usr/bin/env python3
"""
全HTMLファイルから使用されている色を抽出し、コントラスト比を分析するスクリプト
"""

import math
import re
from collections import Counter, defaultdict
from pathlib import Path


def hex_to_rgb(hex_color):
    """16進数カラーコードをRGBに変換"""
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join([c * 2 for c in hex_color])
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def relative_luminance(rgb):
    """相対輝度を計算（WCAG 2.1基準）"""

    def adjust(c):
        c = c / 255.0
        if c <= 0.03928:
            return c / 12.92
        else:
            return math.pow((c + 0.055) / 1.055, 2.4)

    r, g, b = [adjust(c) for c in rgb]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(color1, color2):
    """2色間のコントラスト比を計算"""
    l1 = relative_luminance(hex_to_rgb(color1))
    l2 = relative_luminance(hex_to_rgb(color2))

    lighter = max(l1, l2)
    darker = min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)


def extract_colors_from_file(filepath):
    """HTMLファイルから色コードを抽出"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # 色コードを抽出（#XXXXXXまたは#XXX形式）
        color_pattern = r"#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}(?![0-9A-Fa-f])"
        colors = re.findall(color_pattern, content)

        # 正規化（小文字、6桁に統一）
        normalized_colors = []
        for color in colors:
            color = color.upper()
            if len(color) == 4:  # #RGB形式
                color = "#" + "".join([c * 2 for c in color[1:]])
            normalized_colors.append(color)

        return normalized_colors

    except Exception as e:  # noqa: BLE001  想定外の例外も報告して続行する
        print(f"エラー: {filepath} - {e}")
        return []


def categorize_by_contrast(color, bg_white="#FFFFFF"):
    """色のコントラスト比カテゴリを判定"""
    ratio = contrast_ratio(color, bg_white)

    if ratio >= 7.0:
        return "AAA (7.0:1+)", ratio
    elif ratio >= 4.5:
        return "AA (4.5:1+)", ratio
    elif ratio >= 3.0:
        return "AA Large (3.0:1+)", ratio
    else:
        return "不適合 (<3.0:1)", ratio


def main():
    """メイン処理"""
    print("=" * 80)
    print("AWS学習リソース カラーコントラスト比分析")
    print("=" * 80)
    print()

    # ルートディレクトリ
    root_dir = Path("/home/meme1/aws_sap_studying")

    # 除外するディレクトリとファイル
    exclude_dirs = {".git", "scripts", "node_modules", ".claude"}
    exclude_files = {
        "index.html",
        "quiz.html",
        "knowledge-base.html",
        "table-of-contents.html",
        "home.html",
    }

    # 全HTMLファイルから色を抽出
    all_colors = []
    file_count = 0

    for html_file in root_dir.rglob("*.html"):
        # 除外チェック
        if any(excluded in html_file.parts for excluded in exclude_dirs):
            continue
        if html_file.name in exclude_files:
            continue

        colors = extract_colors_from_file(html_file)
        if colors:
            all_colors.extend(colors)
            file_count += 1

    print(f"📊 検証対象: {file_count}ファイル")
    print()

    # 色の使用頻度を集計
    color_counter = Counter(all_colors)

    print(f"🎨 検出された色の種類: {len(color_counter)}色")
    print()

    # コントラスト比でカテゴリ分け
    category_stats = defaultdict(list)

    for color, count in color_counter.most_common():
        category, ratio = categorize_by_contrast(color)
        category_stats[category].append((color, count, ratio))

    # 結果表示
    print("=" * 80)
    print("カテゴリ別色分布")
    print("=" * 80)
    print()

    for category in [
        "AAA (7.0:1+)",
        "AA (4.5:1+)",
        "AA Large (3.0:1+)",
        "不適合 (<3.0:1)",
    ]:
        if category in category_stats:
            colors = category_stats[category]
            print(f"【{category}】 - {len(colors)}色")
            print("-" * 80)

            for color, count, ratio in sorted(colors, key=lambda x: x[1], reverse=True):
                status = "✅" if category != "不適合 (<3.0:1)" else "❌"
                print(f"  {status} {color:8s} - {ratio:5.2f}:1  (使用回数: {count:4d})")

            print()

    # 不適合色の詳細分析
    if "不適合 (<3.0:1)" in category_stats:
        problematic_colors = category_stats["不適合 (<3.0:1)"]

        print("=" * 80)
        print(f"⚠️ 修正が必要な色: {len(problematic_colors)}色")
        print("=" * 80)
        print()

        total_usage = sum(count for _, count, _ in problematic_colors)
        print(f"総使用回数: {total_usage}回")
        print()

        print("修正推奨順（使用頻度順）:")
        print("-" * 80)

        for i, (color, count, ratio) in enumerate(
            sorted(problematic_colors, key=lambda x: x[1], reverse=True), 1
        ):
            print(f"{i:2d}. {color} - {ratio:.2f}:1 (使用{count}回)")

        print()

    # サマリー
    print("=" * 80)
    print("📊 検証結果サマリー")
    print("=" * 80)
    print()

    total_colors = len(color_counter)
    compliant_colors = sum(
        len(category_stats[cat])
        for cat in ["AAA (7.0:1+)", "AA (4.5:1+)", "AA Large (3.0:1+)"]
    )
    non_compliant = len(category_stats.get("不適合 (<3.0:1)", []))

    compliance_rate = (compliant_colors / total_colors * 100) if total_colors > 0 else 0

    print(f"総色数: {total_colors}色")
    print(f"適合色: {compliant_colors}色 ({compliance_rate:.1f}%)")
    print(f"不適合色: {non_compliant}色 ({100 - compliance_rate:.1f}%)")
    print()

    if non_compliant > 0:
        print("🔧 次のステップ:")
        print(
            "  1. scripts/accessibility/suggest_color_fixes.py を実行して代替色を取得"
        )
        print("  2. scripts/accessibility/fix_colors_bulk.py で一括置換を実行")
        print()
    else:
        print("✅ 全ての色がWCAG 2.1基準を満たしています！")
        print()


if __name__ == "__main__":
    main()
