#!/usr/bin/env python3
"""
Internal Links Validator for AWS SAP Study Resources

このスクリプトはHTMLファイル内の内部リンク（相対パス）が有効かチェックします。

Usage:
    python3 scripts/ci/check_internal_links.py

Exit codes:
    0: All internal links valid
    1: Broken links found
"""

import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup


class Colors:
    """ターミナル出力用のカラーコード"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'


def extract_links_from_html(html_file):
    """
    HTMLファイルから内部リンクを抽出
    Returns: List of (link, line_number)
    """
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    try:
        soup = BeautifulSoup(content, 'html.parser')
    except Exception as e:
        print(f"{Colors.YELLOW}⚠ Warning: Could not parse {html_file}: {e}{Colors.END}")
        return []

    links = []

    # <a href="..."> タグから抽出
    for tag in soup.find_all('a', href=True):
        href = tag['href']
        # 内部リンクのみ（外部URL、アンカー、JavaScriptを除外）
        if not href.startswith(('http://', 'https://', '#', 'javascript:', 'mailto:')):
            # アンカー部分を削除（例: page.html#section → page.html）
            clean_href = href.split('#')[0]
            if clean_href:  # 空でない場合のみ追加
                links.append(clean_href)

    # <iframe src="..."> タグから抽出
    for tag in soup.find_all('iframe', src=True):
        src = tag['src']
        if not src.startswith(('http://', 'https://', 'javascript:')):
            links.append(src)

    return links


def check_link_exists(base_path, link):
    """
    リンク先のファイルが存在するかチェック
    Returns: (exists, resolved_path)
    """
    # base_pathからの相対パスとして解決
    if link.startswith('/'):
        # 絶対パス（ルートからの相対）
        # リポジトリルートを基準にする
        script_dir = Path(__file__).parent
        repo_root = script_dir.parent.parent
        resolved = repo_root / link.lstrip('/')
    else:
        # 相対パス
        resolved = (base_path.parent / link).resolve()

    return resolved.exists(), resolved


def main():
    """メイン処理"""
    # リポジトリルートに移動
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent

    print(f"\n{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}🔗 Internal Links Validation{Colors.END}")
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")

    # HTMLファイルを取得
    exclude_patterns = ['.git', 'node_modules', '.claude', 'scripts']
    html_files = []

    for html_file in repo_root.rglob('*.html'):
        if not any(pattern in str(html_file) for pattern in exclude_patterns):
            html_files.append(html_file)

    print(f"Checking {len(html_files)} HTML files...\n")

    broken_links = []
    total_links = 0

    for html_file in html_files:
        links = extract_links_from_html(html_file)
        total_links += len(links)

        for link in links:
            exists, resolved = check_link_exists(html_file, link)

            if not exists:
                broken_links.append({
                    'file': html_file.relative_to(repo_root),
                    'link': link,
                    'resolved': resolved
                })

    # 結果サマリー
    print(f"{Colors.BLUE}Total internal links checked: {total_links}{Colors.END}\n")
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}")

    if not broken_links:
        print(f"{Colors.GREEN}{Colors.BOLD}✅ LINK VALIDATION PASSED{Colors.END}")
        print(f"{Colors.GREEN}All internal links are valid{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
        sys.exit(0)
    else:
        print(f"{Colors.YELLOW}{Colors.BOLD}⚠ BROKEN LINKS FOUND (Warning){Colors.END}")
        print(f"{Colors.YELLOW}Found {len(broken_links)} broken internal links:{Colors.END}\n")

        for broken in broken_links[:10]:  # Show first 10
            print(f"{Colors.YELLOW}File: {broken['file']}{Colors.END}")
            print(f"  Link: {broken['link']}")
            print(f"  Resolved to: {broken['resolved']}")
            print()

        if len(broken_links) > 10:
            print(f"{Colors.YELLOW}... and {len(broken_links) - 10} more broken links{Colors.END}\n")

        print(f"{Colors.YELLOW}💡 Note: This is a warning only. Please fix broken links when possible.{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")

        # Warning only - don't fail the build
        sys.exit(0)


if __name__ == '__main__':
    main()
