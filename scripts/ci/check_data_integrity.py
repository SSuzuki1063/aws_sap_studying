#!/usr/bin/env python3
"""
Data Integrity Checker for AWS SAP Study Resources

このスクリプトは data.js と index.js の整合性をチェックします。
data.js に定義されたリソースが index.js の searchData に存在するかを検証します。

Usage:
    python3 scripts/ci/check_data_integrity.py

Exit codes:
    0: All checks passed
    1: Integrity issues found
"""

import re
import sys
import os
from pathlib import Path


class Colors:
    """ターミナル出力用のカラーコード"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'


def extract_resources_from_data_js(file_path):
    """
    data.js からリソース情報を抽出
    Returns: List of dict with {title, href}
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    resources = []

    # resources配列内のオブジェクトを抽出
    # { title: 'タイトル', href: 'パス' } のパターンを検索
    pattern = r"\{\s*title:\s*['\"]([^'\"]+)['\"]\s*,\s*href:\s*['\"]([^'\"]+)['\"](?:\s*,\s*priority:\s*['\"][^'\"]+['\"])?\s*\}"
    matches = re.findall(pattern, content)

    for title, href in matches:
        resources.append({
            'title': title,
            'href': href,
            'source': 'data.js'
        })

    return resources


def extract_search_data_from_index_js(file_path):
    """
    index.js から searchData を抽出
    Returns: List of dict with {title, category, file}
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    search_entries = []

    # searchData配列の内容を抽出
    # { title: 'タイトル', category: 'カテゴリ', file: 'パス' } のパターン
    pattern = r"\{\s*title:\s*['\"]([^'\"]+)['\"]\s*,\s*category:\s*['\"]([^'\"]+)['\"]\s*,\s*file:\s*['\"]([^'\"]+)['\"]\s*\}"
    matches = re.findall(pattern, content)

    for title, category, file_path in matches:
        search_entries.append({
            'title': title,
            'category': category,
            'file': file_path,
            'source': 'index.js'
        })

    return search_entries


def check_integrity(data_resources, search_entries):
    """
    data.js と index.js の整合性をチェック
    """
    print(f"\n{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}📊 Data Integrity Check (data.js ⟷ index.js){Colors.END}")
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")

    # data.js のリソース一覧を作成（hrefベース）
    data_hrefs = {r['href']: r for r in data_resources}

    # index.js の検索データ一覧を作成（fileベース）
    search_files = {s['file']: s for s in search_entries}

    print(f"📄 data.js resources: {len(data_hrefs)}")
    print(f"🔍 index.js searchData entries: {len(search_entries)}\n")

    issues = []

    # data.js にあるが index.js にないリソースをチェック
    print(f"{Colors.BLUE}Checking: data.js resources exist in index.js searchData...{Colors.END}")
    missing_in_search = []

    for href, resource in data_hrefs.items():
        if href not in search_files:
            missing_in_search.append(resource)
            issues.append(f"❌ Missing in index.js: {resource['title']} ({href})")

    if missing_in_search:
        print(f"{Colors.RED}✗ Found {len(missing_in_search)} resources in data.js NOT in index.js:{Colors.END}")
        for resource in missing_in_search:
            print(f"  • {resource['title']} → {resource['href']}")
    else:
        print(f"{Colors.GREEN}✓ All data.js resources found in index.js{Colors.END}")

    print()

    # index.js にあるが data.js にないリソースをチェック（警告のみ）
    print(f"{Colors.BLUE}Checking: index.js searchData exists in data.js...{Colors.END}")
    missing_in_data = []

    for file_path, entry in search_files.items():
        if file_path not in data_hrefs:
            missing_in_data.append(entry)

    if missing_in_data:
        print(f"{Colors.YELLOW}⚠ Found {len(missing_in_data)} entries in index.js NOT in data.js (warning only):{Colors.END}")
        for entry in missing_in_data[:5]:  # Show first 5
            print(f"  • {entry['title']} → {entry['file']}")
        if len(missing_in_data) > 5:
            print(f"  ... and {len(missing_in_data) - 5} more")
    else:
        print(f"{Colors.GREEN}✓ All index.js entries found in data.js{Colors.END}")

    print()

    # 結果サマリー
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}")
    if issues:
        print(f"{Colors.RED}{Colors.BOLD}❌ INTEGRITY CHECK FAILED{Colors.END}")
        print(f"\n{Colors.RED}Critical issues found:{Colors.END}")
        for issue in issues:
            print(f"  {issue}")
        print(f"\n{Colors.YELLOW}💡 Fix: Add missing resources to index.js searchData array{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
        return False
    else:
        print(f"{Colors.GREEN}{Colors.BOLD}✅ INTEGRITY CHECK PASSED{Colors.END}")
        print(f"{Colors.GREEN}All resources are properly synchronized{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
        return True


def main():
    """メイン処理"""
    # リポジトリルートに移動
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    os.chdir(repo_root)

    data_js_path = repo_root / 'data.js'
    index_js_path = repo_root / 'index.js'

    # ファイル存在チェック
    if not data_js_path.exists():
        print(f"{Colors.RED}❌ Error: data.js not found{Colors.END}")
        sys.exit(1)

    if not index_js_path.exists():
        print(f"{Colors.RED}❌ Error: index.js not found{Colors.END}")
        sys.exit(1)

    # データ抽出
    print(f"{Colors.BLUE}📖 Reading data.js...{Colors.END}")
    data_resources = extract_resources_from_data_js(data_js_path)

    print(f"{Colors.BLUE}📖 Reading index.js...{Colors.END}")
    search_entries = extract_search_data_from_index_js(index_js_path)

    # 整合性チェック
    success = check_integrity(data_resources, search_entries)

    # 終了
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
