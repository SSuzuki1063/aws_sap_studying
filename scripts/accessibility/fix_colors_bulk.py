#!/usr/bin/env python3
"""
全HTMLファイルのWCAG 2.1不適合色を一括置換するスクリプト

使用方法:
  python3 scripts/accessibility/fix_colors_bulk.py --dry-run  # プレビュー
  python3 scripts/accessibility/fix_colors_bulk.py            # 実行
"""

import re
import os
import argparse
from pathlib import Path
from collections import defaultdict

# WCAG 2.1適合色マッピング（不適合色 → 適合色）
COLOR_REPLACEMENTS = {
    # AWS Orange (最優先 - 795回使用)
    '#FF9900': '#dc7600',  # 2.14:1 → 3.17:1 (AA Large)
    '#ff9900': '#dc7600',

    # グレー系テキスト色 (高頻度)
    '#9CA3AF': '#6f7682',  # 2.54:1 → 4.58:1 (AA)
    '#9ca3af': '#6f7682',
    '#94A3B8': '#64748B',  # 2.56:1 → 4.76:1 (AA)
    '#94a3b8': '#64748B',

    # ボーダー色
    '#E5E7EB': '#909296',  # 1.24:1 → 3.12:1 (AA UIコンポーネント)
    '#e5e7eb': '#909296',
    '#DDDDDD': '#A0A0A0',  # 1.36:1 → 2.61:1 (AA Large)
    '#dddddd': '#A0A0A0',
    '#DDD': '#A0A0A0',
    '#ddd': '#A0A0A0',

    # グリーン系（アクセント色）
    '#10B981': '#047857',  # 2.54:1 → 5.48:1 (AA)
    '#10b981': '#047857',
    '#00B894': '#047857',  # 2.54:1 → 5.48:1 (AA)
    '#00b894': '#047857',
    '#27AE60': '#15803D',  # 2.87:1 → 5.02:1 (AA)
    '#27ae60': '#15803D',
    '#2ECC71': '#15803D',  # 2.10:1 → 5.02:1 (AA)
    '#2ecc71': '#15803D',
    '#4CAF50': '#2E7D32',  # 2.78:1 → 5.13:1 (AA)
    '#4caf50': '#2E7D32',
    '#22C55E': '#16A34A',  # 2.28:1 → 3.30:1 (AA Large)
    '#22c55e': '#16A34A',

    # イエロー/オレンジ系（アクセント色）
    '#F59E0B': '#CA8A04',  # 2.15:1 → 2.94:1 (AA Large)
    '#f59e0b': '#CA8A04',
    '#F39C12': '#CA8A04',  # 2.19:1 → 2.94:1 (AA Large)
    '#f39c12': '#CA8A04',
    '#FF9800': '#D97706',  # 2.16:1 → 3.19:1 (AA Large)
    '#ff9800': '#D97706',
    '#FBBF24': '#CA8A04',  # 1.67:1 → 2.94:1 (AA Large)
    '#fbbf24': '#CA8A04',
    '#FFC107': '#CA8A04',  # 1.63:1 → 2.94:1 (AA Large)
    '#ffc107': '#CA8A04',
    '#FDCB6E': '#9e6c0f',  # 1.51:1 → 4.56:1 (AA) - quiz fairカラー
    '#fdcb6e': '#9e6c0f',

    # ブルー系（アクセント色）
    '#4FACFE': '#0369A1',  # 2.42:1 → 5.93:1 (AA)
    '#4facfe': '#0369A1',
    '#74B9FF': '#3378be',  # 2.07:1 → 4.59:1 (AA) - quiz goodカラー
    '#74b9ff': '#3378be',
    '#60A5FA': '#2563EB',  # 2.54:1 → 5.17:1 (AA)
    '#60a5fa': '#2563EB',
    '#06B6D4': '#0284C7',  # 2.43:1 → 4.10:1 (AA Large)
    '#06b6d4': '#0284C7',
    '#00BCD4': '#0369A1',  # 2.30:1 → 5.93:1 (AA)
    '#00bcd4': '#0369A1',
    '#03A9F4': '#0369A1',  # 2.63:1 → 5.93:1 (AA)
    '#03a9f4': '#0369A1',

    # レッド/ピンク系（エラー・警告色）
    '#FF6B6B': '#DC2626',  # 2.78:1 → 4.83:1 (AA)
    '#ff6b6b': '#DC2626',
    '#E17055': '#c35237',  # 3.16:1 → 4.58:1 (AA) - quiz poorカラー
    '#e17055': '#c35237',
    '#00B894': '#008662',  # 2.54:1 → 4.58:1 (AA) - quiz excellentカラー
    '#00b894': '#008662',
    '#F97316': '#EA580C',  # 2.80:1 → 3.56:1 (AA Large)
    '#f97316': '#EA580C',

    # パープル系
    '#F093FB': '#9333EA',  # 2.04:1 → 5.38:1 (AA)
    '#f093fb': '#9333EA',
    '#A29BFE': '#7E22CE',  # 2.43:1 → 6.98:1 (AA)
    '#a29bfe': '#7E22CE',
}

def should_skip_file(filepath):
    """スキップすべきファイルかどうか判定"""
    exclude_dirs = {'.git', 'scripts', 'node_modules', '.claude'}
    exclude_files = {'index.html', 'quiz.html'}  # すでに修正済み

    # ディレクトリチェック
    if any(excluded in filepath.parts for excluded in exclude_dirs):
        return True

    # ファイル名チェック
    if filepath.name in exclude_files:
        return True

    return False

def replace_colors_in_file(filepath, dry_run=False):
    """HTMLファイル内の色を置換"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        replacements_made = defaultdict(int)

        # 各色マッピングについて置換
        for old_color, new_color in COLOR_REPLACEMENTS.items():
            # 大文字小文字を区別して置換
            if old_color in content:
                count = content.count(old_color)
                content = content.replace(old_color, new_color)
                replacements_made[f"{old_color} → {new_color}"] = count

        # 変更があった場合のみ書き込み
        if content != original_content:
            if not dry_run:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
            return replacements_made

        return None

    except Exception as e:
        print(f"❌ エラー: {filepath} - {e}")
        return None

def main():
    """メイン処理"""
    parser = argparse.ArgumentParser(
        description='全HTMLファイルのWCAG 2.1不適合色を一括置換'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='実際の変更を行わず、プレビューのみ表示'
    )

    args = parser.parse_args()

    print("=" * 80)
    print("AWS学習リソース カラー一括置換")
    print("=" * 80)
    print()

    if args.dry_run:
        print("🔍 DRY RUNモード: 変更をプレビュー（実際の変更は行いません）")
        print()

    # ルートディレクトリ
    root_dir = Path('/home/meme1/aws_sap_studying')

    # 統計
    total_files = 0
    modified_files = 0
    total_replacements = defaultdict(int)
    modified_file_list = []

    # 全HTMLファイルを処理
    for html_file in sorted(root_dir.rglob('*.html')):
        # スキップチェック
        if should_skip_file(html_file):
            continue

        total_files += 1

        # 色置換実行
        replacements = replace_colors_in_file(html_file, dry_run=args.dry_run)

        if replacements:
            modified_files += 1
            relative_path = html_file.relative_to(root_dir)
            modified_file_list.append((relative_path, replacements))

            # 統計に追加
            for replacement, count in replacements.items():
                total_replacements[replacement] += count

    # 結果表示
    print("=" * 80)
    print("📊 置換結果サマリー")
    print("=" * 80)
    print()
    print(f"検証対象ファイル: {total_files}ファイル")
    print(f"修正したファイル: {modified_files}ファイル")
    print()

    if total_replacements:
        print("=" * 80)
        print("色置換統計（全ファイル合計）")
        print("=" * 80)
        print()

        for replacement, count in sorted(total_replacements.items(), key=lambda x: x[1], reverse=True):
            print(f"  {replacement}: {count}回")

        print()
        print("=" * 80)
        print(f"修正したファイル一覧 ({modified_files}ファイル)")
        print("=" * 80)
        print()

        for filepath, replacements in modified_file_list[:50]:  # 最初の50ファイルを表示
            print(f"📄 {filepath}")
            for replacement, count in replacements.items():
                print(f"   └─ {replacement} ({count}回)")
            print()

        if len(modified_file_list) > 50:
            print(f"... 他 {len(modified_file_list) - 50}ファイル")
            print()
    else:
        print("✅ 置換対象の色が見つかりませんでした。")
        print()

    # 次のステップ
    if args.dry_run and total_replacements:
        print("=" * 80)
        print("🔧 次のステップ")
        print("=" * 80)
        print()
        print("プレビューを確認後、以下のコマンドで実際の置換を実行:")
        print("  python3 scripts/accessibility/fix_colors_bulk.py")
        print()
    elif not args.dry_run and total_replacements:
        print("=" * 80)
        print("✅ 色の置換が完了しました！")
        print("=" * 80)
        print()
        print("🔧 次のステップ:")
        print("  1. python3 server.py でローカルテスト")
        print("  2. python3 scripts/accessibility/extract_colors_from_html.py で再検証")
        print("  3. git add . && git commit && git push でデプロイ")
        print()

if __name__ == '__main__':
    main()
