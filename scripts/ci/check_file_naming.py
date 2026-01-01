#!/usr/bin/env python3
"""
File Naming Convention Checker for AWS SAP Study Resources

このスクリプトはHTMLファイルの命名規則をチェックします。

推奨命名規則:
  - aws-[service]-[topic].html (例: aws-lambda-metrics.html)
  - [service]_[topic]_infographic.html (例: ecs_infographic.html)

Usage:
    python3 scripts/ci/check_file_naming.py

Exit codes:
    0: All files follow conventions (or warnings only)
"""

import re
import sys
from pathlib import Path


class Colors:
    """ターミナル出力用のカラーコード"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'


# 推奨命名パターン
RECOMMENDED_PATTERNS = [
    r'^aws-[a-z0-9-]+-[a-z0-9-]+\.html$',       # aws-service-topic.html
    r'^[a-z0-9_]+_infographic\.html$',          # service_infographic.html
    r'^[a-z0-9-]+-guide\.html$',                 # topic-guide.html
]

# 許可される特殊ファイル
ALLOWED_SPECIAL_FILES = [
    'index.html',
    'quiz.html',
    'home.html',
    'knowledge-base.html',
    'table-of-contents.html',
    'profile.html',
]


def check_naming_convention(file_path):
    """
    ファイル命名規則をチェック
    Returns: (is_valid, message)
    """
    filename = file_path.name

    # 特殊ファイルは許可
    if filename in ALLOWED_SPECIAL_FILES:
        return True, "Special file (allowed)"

    # 推奨パターンにマッチするかチェック
    for pattern in RECOMMENDED_PATTERNS:
        if re.match(pattern, filename):
            return True, "Follows recommended convention"

    # パターンにマッチしない場合は警告
    return False, "Does not follow recommended naming convention"


def suggest_better_name(filename):
    """
    より良いファイル名を提案
    """
    # 基本的な提案ロジック
    if '_' in filename and not filename.endswith('_infographic.html'):
        # アンダースコアをハイフンに変更を提案
        suggested = filename.replace('_', '-')
        return f"Consider: {suggested}"

    if not filename.startswith('aws-') and not filename.endswith('_infographic.html'):
        # aws- プレフィックスを追加を提案
        suggested = f"aws-{filename}"
        return f"Consider: {suggested}"

    return "Follow pattern: aws-[service]-[topic].html"


def main():
    """メイン処理"""
    # リポジトリルートに移動
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent

    print(f"\n{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}📝 File Naming Convention Check{Colors.END}")
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")

    print(f"{Colors.BLUE}Recommended patterns:{Colors.END}")
    print(f"  • aws-[service]-[topic].html")
    print(f"  • [service]_infographic.html")
    print(f"  • [topic]-guide.html\n")

    # HTMLファイルを取得（content categoriesのみ）
    category_dirs = [
        'networking',
        'security-governance',
        'compute-applications',
        'content-delivery-dns',
        'development-deployment',
        'storage-database',
        'migration',
        'analytics-bigdata',
        'organizational-complexity',
        'continuous-improvement',
        'cost-control',
        'new-solutions',
    ]

    html_files = []
    for category in category_dirs:
        category_path = repo_root / category
        if category_path.exists():
            html_files.extend(category_path.glob('*.html'))

    print(f"Checking {len(html_files)} HTML files in content directories...\n")

    non_compliant = []

    for html_file in html_files:
        is_valid, message = check_naming_convention(html_file)

        if not is_valid:
            non_compliant.append({
                'file': html_file.relative_to(repo_root),
                'message': message,
                'suggestion': suggest_better_name(html_file.name)
            })

    # 結果サマリー
    print(f"{Colors.BOLD}{'=' * 70}{Colors.END}")

    if not non_compliant:
        print(f"{Colors.GREEN}{Colors.BOLD}✅ NAMING CONVENTION CHECK PASSED{Colors.END}")
        print(f"{Colors.GREEN}All files follow recommended naming conventions{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")
        sys.exit(0)
    else:
        print(f"{Colors.YELLOW}{Colors.BOLD}⚠ NAMING CONVENTION WARNINGS{Colors.END}")
        print(f"{Colors.YELLOW}Found {len(non_compliant)} files with non-standard names:{Colors.END}\n")

        for item in non_compliant[:10]:  # Show first 10
            print(f"{Colors.YELLOW}File: {item['file']}{Colors.END}")
            print(f"  Reason: {item['message']}")
            print(f"  {item['suggestion']}")
            print()

        if len(non_compliant) > 10:
            print(f"{Colors.YELLOW}... and {len(non_compliant) - 10} more files{Colors.END}\n")

        print(f"{Colors.YELLOW}💡 Note: This is a warning only. Consider renaming files for consistency.{Colors.END}")
        print(f"{Colors.BOLD}{'=' * 70}{Colors.END}\n")

        # Warning only - don't fail the build
        sys.exit(0)


if __name__ == '__main__':
    main()
