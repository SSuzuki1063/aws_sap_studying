#!/usr/bin/env python3
"""
見出し階層スキップ問題を修正するスクリプト

WCAG 2.1では見出しは1段階ずつ深くなる必要がある:
- h1 → h2 → h3 → h4 (正しい)
- h2 → h4 (間違い - h3をスキップ)

このスクリプトは、見出しのスキップを検出し、適切なレベルに修正する。
"""

import os
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

def get_html_files(base_dir: str) -> list:
    """HTMLファイルのリストを取得"""
    html_files = []
    exclude_dirs = {'node_modules', '.git', 'venv', '.venv', 'scripts'}

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

    return html_files

def analyze_heading_structure(soup: BeautifulSoup) -> list:
    """見出し構造を分析し、問題を検出"""
    headings = soup.find_all(re.compile(r'^h[1-6]$'))
    issues = []
    last_level = 0

    for heading in headings:
        tag_name = heading.name
        current_level = int(tag_name[1])

        # 最初の見出し以外で、2段階以上スキップしている場合
        if last_level > 0 and current_level > last_level + 1:
            expected_level = last_level + 1
            issues.append({
                'element': heading,
                'current_level': current_level,
                'expected_level': expected_level,
                'text': heading.get_text(strip=True)[:50]
            })

        last_level = current_level

    return issues

def fix_heading_hierarchy(html_content: str) -> tuple:
    """
    見出し階層を修正

    Returns:
        tuple: (修正後のHTML, 修正件数)
    """
    soup = BeautifulSoup(html_content, 'html.parser')

    # 全体を複数パスで修正（依存関係があるため）
    total_fixes = 0
    max_passes = 5

    for pass_num in range(max_passes):
        issues = analyze_heading_structure(soup)
        if not issues:
            break

        for issue in issues:
            element = issue['element']
            expected_level = issue['expected_level']
            new_tag = f'h{expected_level}'

            # 新しいタグを作成して属性とコンテンツをコピー
            new_element = soup.new_tag(new_tag)
            new_element.attrs = element.attrs.copy()

            # 子要素をコピー
            for child in list(element.children):
                if hasattr(child, 'extract'):
                    new_element.append(child.extract())
                else:
                    new_element.append(str(child))

            element.replace_with(new_element)
            total_fixes += 1

    return str(soup), total_fixes

def process_file(filepath: str, dry_run: bool = True) -> dict:
    """単一ファイルを処理"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()

        fixed_content, fix_count = fix_heading_hierarchy(original_content)

        if fix_count > 0 and not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)

        return {
            'filepath': filepath,
            'fixes': fix_count,
            'success': True
        }

    except Exception as e:
        return {
            'filepath': filepath,
            'fixes': 0,
            'success': False,
            'error': str(e)
        }

def main():
    import argparse

    parser = argparse.ArgumentParser(description='見出し階層スキップを修正')
    parser.add_argument('--apply', action='store_true', help='実際に修正を適用（デフォルトはドライラン）')
    parser.add_argument('--file', type=str, help='特定のファイルのみ処理')
    args = parser.parse_args()

    dry_run = not args.apply
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    print("=" * 70)
    print("見出し階層修正スクリプト")
    print("=" * 70)
    print(f"モード: {'ドライラン（プレビュー）' if dry_run else '適用モード'}")
    print()

    if args.file:
        files = [args.file]
    else:
        files = get_html_files(base_dir)

    total_fixes = 0
    fixed_files = 0

    for filepath in files:
        result = process_file(filepath, dry_run)

        if result['fixes'] > 0:
            rel_path = os.path.relpath(filepath, base_dir)
            print(f"  📄 {rel_path}: {result['fixes']}件の修正")
            total_fixes += result['fixes']
            fixed_files += 1

    print()
    print("=" * 70)
    print(f"結果: {fixed_files}ファイル、{total_fixes}件の修正")

    if dry_run and total_fixes > 0:
        print()
        print("💡 実際に修正を適用するには --apply オプションを使用してください:")
        print("   python3 scripts/accessibility/fix_heading_hierarchy.py --apply")

    print("=" * 70)

if __name__ == '__main__':
    main()
