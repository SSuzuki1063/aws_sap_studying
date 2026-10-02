#!/usr/bin/env python3
"""
W3C HTML Validation Automation for AWS SAP Study Resources

このスクリプトはW3C Validation APIを使用してHTMLファイルを自動検証します。
PR modeでは変更されたHTMLファイルのみを検証します。

Usage:
    python3 scripts/ci/validate_html_w3c.py              # 全HTMLファイル
    python3 scripts/ci/validate_html_w3c.py --pr-mode    # 変更されたファイルのみ
    python3 scripts/ci/validate_html_w3c.py --pr-mode --base-dir dist
                                                         # 変更されたページのビルド出力

Requirements:
    pip install requests beautifulsoup4

Exit codes:
    0: All files valid
    1: Validation errors found
"""

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

import requests


class Colors:
    """ターミナル出力用のカラーコード"""

    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    BOLD = "\033[1m"
    END = "\033[0m"


ASTRO_PAGES_PREFIX = "src/pages/"


def get_changed_files() -> list[str]:
    """
    Gitで変更されたファイルのリストを取得（PR mode用）

    GitHub Actions の PR では GITHUB_BASE_REF (マージ先ブランチ) との差分を使う。
    """
    base_ref = os.environ.get("GITHUB_BASE_REF") or "gh-pages"
    try:
        # Get changed files between current branch and base branch
        result = subprocess.run(
            ["git", "diff", "--name-only", f"origin/{base_ref}...HEAD"],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError:
        # Fallback: get all modified files in working directory
        try:
            result = subprocess.run(
                ["git", "diff", "--name-only", "HEAD"],
                capture_output=True,
                text=True,
                check=True,
            )
        except (OSError, subprocess.CalledProcessError):
            return []
    return [f for f in result.stdout.strip().split("\n") if f]


def to_built_html(changed_file: str) -> str | None:
    """
    変更されたファイルを、ビルド出力内のHTMLパスに対応付ける

    src/pages/networking/foo.astro → networking/foo.html (astro の build.format は 'file')
    """
    if changed_file.endswith(".html"):
        return changed_file
    if changed_file.startswith(ASTRO_PAGES_PREFIX) and changed_file.endswith(".astro"):
        return changed_file[len(ASTRO_PAGES_PREFIX) : -len(".astro")] + ".html"
    return None


def get_modified_html_files(base_dir: Path, map_astro_pages: bool) -> list[str]:
    """
    変更されたファイルのうち、base_dir 配下に存在するHTMLを返す（PR mode用）

    map_astro_pages が真なら、変更された .astro ページをビルド出力のHTMLに対応付ける。
    """
    html_files = []
    for changed_file in get_changed_files():
        if map_astro_pages:
            candidate = to_built_html(changed_file)
        else:
            candidate = changed_file if changed_file.endswith(".html") else None
        if (
            candidate
            and (base_dir / candidate).exists()
            and candidate not in html_files
        ):
            html_files.append(candidate)
    return html_files


def get_all_html_files(repo_root):
    """
    リポジトリ内の全HTMLファイルを取得
    """
    exclude_patterns = [".git", "node_modules", ".claude", "scripts"]

    html_files = []
    for html_file in repo_root.rglob("*.html"):
        # 除外パターンに一致しないファイルのみ追加
        if not any(pattern in str(html_file) for pattern in exclude_patterns):
            html_files.append(str(html_file.relative_to(repo_root)))

    return html_files


def validate_html_w3c(file_path):
    """
    W3C Validation APIを使用してHTMLファイルを検証
    Returns: (is_valid, errors, warnings)
    """
    url = "https://validator.w3.org/nu/"

    with open(file_path, "rb") as f:
        html_content = f.read()

    headers = {
        "Content-Type": "text/html; charset=utf-8",
        "User-Agent": "AWS-SAP-Study-Resources-CI/1.0",
    }

    params = {"out": "json"}

    try:
        response = requests.post(
            url, params=params, headers=headers, data=html_content, timeout=30
        )

        if response.status_code != 200:
            return False, [f"API Error: HTTP {response.status_code}"], []

        result = response.json()
        messages = result.get("messages", [])

        errors = [msg for msg in messages if msg.get("type") == "error"]
        warnings = [msg for msg in messages if msg.get("type") in ["warning", "info"]]

        return len(errors) == 0, errors, warnings

    except requests.exceptions.Timeout:
        return False, ["Validation timeout (30s)"], []
    except requests.exceptions.RequestException as e:
        return False, [f"Network error: {e!s}"], []
    except Exception as e:  # noqa: BLE001  想定外の例外も報告して続行する
        return False, [f"Unexpected error: {e!s}"], []


def format_message(msg):
    """
    W3Cエラーメッセージをフォーマット
    """
    # 文字列が直接渡された場合の処理
    if isinstance(msg, str):
        return f"  {msg}"

    line = msg.get("lastLine", "?")
    col = msg.get("lastColumn", "?")
    message = msg.get("message", "Unknown error")
    extract = msg.get("extract", "")

    formatted = f"  Line {line}:{col} - {message}"
    if extract:
        formatted += f"\n    Extract: {extract.strip()}"

    return formatted


def main():
    """メイン処理"""
    parser = argparse.ArgumentParser(description="W3C HTML Validation")
    parser.add_argument(
        "--pr-mode", action="store_true", help="Validate only modified files (PR mode)"
    )
    parser.add_argument(
        "--files",
        nargs="+",
        metavar="FILE",
        help="Validate specific files by path (space-separated)",
    )
    parser.add_argument(
        "--base-dir",
        metavar="DIR",
        help="Directory containing the HTML to validate, e.g. dist (default: repo root)",
    )
    args = parser.parse_args()

    # リポジトリルートに移動
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    # 検証対象のHTMLを探すディレクトリ（--base-dir dist ならビルド出力）
    base_dir = (repo_root / args.base_dir).resolve() if args.base_dir else repo_root

    print(f"\n{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}🔍 W3C HTML Validation{Colors.END}")
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")

    # 検証対象ファイルを取得
    if args.files:
        print(
            f"{Colors.BLUE}Mode: Specific files ({len(args.files)} files){Colors.END}"
        )
        html_files = [
            f for f in args.files if Path(base_dir / f).exists() or Path(f).exists()
        ]
        if not html_files:
            print(
                f"{Colors.YELLOW}⚠ None of the specified files exist. Skipping validation.{Colors.END}"
            )
            print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
            sys.exit(1)
    elif args.pr_mode:
        print(f"{Colors.BLUE}Mode: PR (modified files only){Colors.END}")
        html_files = get_modified_html_files(
            base_dir, map_astro_pages=bool(args.base_dir)
        )
        if not html_files:
            print(
                f"{Colors.YELLOW}⚠ No modified HTML files found. Skipping validation.{Colors.END}"
            )
            print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
            sys.exit(0)
    else:
        print(f"{Colors.BLUE}Mode: Full (all HTML files){Colors.END}")
        html_files = get_all_html_files(base_dir)

    print(f"Files to validate: {len(html_files)}\n")

    if not html_files:
        print(f"{Colors.YELLOW}⚠ No HTML files to validate{Colors.END}")
        sys.exit(0)

    # 検証実行
    total_files = len(html_files)
    valid_count = 0
    error_count = 0
    failed_files = []

    for i, file_path in enumerate(html_files, 1):
        print(f"[{i}/{total_files}] Validating: {file_path}...", end=" ")

        is_valid, errors, warnings = validate_html_w3c(base_dir / file_path)

        if is_valid:
            print(f"{Colors.GREEN}✓{Colors.END}")
            valid_count += 1
        else:
            print(f"{Colors.RED}✗{Colors.END}")
            error_count += 1
            failed_files.append(
                {"file": file_path, "errors": errors, "warnings": warnings}
            )

        # Rate limiting: W3C APIのレート制限を考慮
        if i < total_files:
            time.sleep(1)  # 1秒待機

    # 結果サマリー
    print(f"\n{Colors.BOLD}{'=' * 70}{Colors.END}")

    if error_count == 0:
        print(f"{Colors.GREEN}{Colors.BOLD}✅ W3C VALIDATION PASSED{Colors.END}")
        print(f"{Colors.GREEN}All {valid_count} files are valid HTML{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
        sys.exit(0)
    else:
        print(f"{Colors.RED}{Colors.BOLD}❌ W3C VALIDATION FAILED{Colors.END}")
        print(
            f"{Colors.RED}Valid: {valid_count} | Invalid: {error_count}{Colors.END}\n"
        )

        # エラー詳細を表示
        for failed in failed_files:
            print(f"{Colors.RED}File: {failed['file']}{Colors.END}")
            print(f"{Colors.RED}Errors ({len(failed['errors'])}):  {Colors.END}")
            for error in failed["errors"][:5]:  # Show first 5 errors
                print(format_message(error))
            if len(failed["errors"]) > 5:
                print(f"  ... and {len(failed['errors']) - 5} more errors")

            if failed["warnings"]:
                print(
                    f"{Colors.YELLOW}Warnings ({len(failed['warnings'])}): {Colors.END}"
                )
                for warning in failed["warnings"][:3]:  # Show first 3 warnings
                    print(format_message(warning))
            print()

        print(
            f"{Colors.YELLOW}💡 Fix: Visit https://validator.w3.org/ to see full error details{Colors.END}"
        )
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
