#!/usr/bin/env python3
"""
Fixed Header Checker for AWS SAP Study Resources

コンテンツHTMLファイルに固定ナビゲーションヘッダーが正しく適用されているかを検証します。

チェック項目:
- class="fixed-nav-header" 要素の存在
- /aws_sap_studying/css/common.css のCSSリンクの存在

Usage:
    python3 scripts/check_fixed_headers.py               # 全コンテンツHTMLをチェック
    python3 scripts/check_fixed_headers.py --staged      # git stageされたHTMLのみチェック

Exit codes:
    0: 全ファイルに固定ヘッダーが適用済み
    1: 1件以上のファイルで固定ヘッダーが欠落
"""

import sys
import subprocess
from pathlib import Path


# ========================================================================
# 設定 (add_fixed_header.py と同期すること)
# ========================================================================

REPO_ROOT = Path(__file__).parent.parent

CONTENT_DIRS = [
    'networking',
    'security-governance',
    'compute-applications',
    'storage-database',
    'migration',
    'analytics-bigdata',
    'development-deployment',
    'content-delivery-dns',
    'organizational-complexity',
    'continuous-improvement',
    'cost-control',
    'new-solutions',
]

EXCLUDED_FILES = {
    'index.html',
    'quiz.html',
    'profile.html',
    'learning-resources.html',
    'knowledge-base.html',
    'home.html',
    'table-of-contents.html',
    'aws_glossary.html',
    'development-flowchart.html',
    'development-roadmap.html',
    'development-usecase.html',
}


class Colors:
    GREEN  = '\033[92m'
    RED    = '\033[91m'
    YELLOW = '\033[93m'
    BOLD   = '\033[1m'
    END    = '\033[0m'


# ========================================================================
# 検出ロジック (add_fixed_header.py の has_* 関数と同一の判定基準)
# ========================================================================

def has_fixed_header(content: str) -> bool:
    return 'fixed-nav-header' in content


def has_shared_css(content: str) -> bool:
    return '/aws_sap_studying/css/common.css' in content


# ========================================================================
# ファイル収集
# ========================================================================

def get_all_content_files() -> list[Path]:
    files = []
    for dir_name in CONTENT_DIRS:
        dir_path = REPO_ROOT / dir_name
        if dir_path.exists():
            for html_file in sorted(dir_path.glob('*.html')):
                if html_file.name not in EXCLUDED_FILES:
                    files.append(html_file)
    return files


def get_staged_html_files() -> list[Path]:
    """git stageされたHTMLファイルのうちコンテンツディレクトリのものを返す"""
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        staged = []
        for line in result.stdout.splitlines():
            path = REPO_ROOT / line
            if (path.suffix == '.html'
                    and path.parent.name in CONTENT_DIRS
                    and path.name not in EXCLUDED_FILES):
                staged.append(path)
        return staged
    except Exception:
        return []


# ========================================================================
# チェック実行
# ========================================================================

def check_file(path: Path) -> tuple[bool, list[str]]:
    """ファイルをチェックし (passed, [issues]) を返す"""
    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        return False, [f"読み込みエラー: {e}"]

    issues = []
    if not has_fixed_header(content):
        issues.append('fixed-nav-header 要素が見つかりません')
    if not has_shared_css(content):
        issues.append('/aws_sap_studying/css/common.css リンクが見つかりません')

    return len(issues) == 0, issues


def run_checks(files: list[Path]) -> int:
    """チェックを実行し、失敗件数を返す"""
    if not files:
        print(f"{Colors.YELLOW}⚠️  チェック対象ファイルなし{Colors.END}")
        return 0

    fail_count = 0
    pass_count = 0

    print('=' * 72)
    print('固定ヘッダー検証レポート')
    print('=' * 72)

    for path in files:
        rel = path.relative_to(REPO_ROOT)
        passed, issues = check_file(path)
        if passed:
            pass_count += 1
        else:
            fail_count += 1
            print(f"\n{Colors.RED}❌ {rel}{Colors.END}")
            for issue in issues:
                print(f"   • {issue}")

    print()
    print('=' * 72)
    print(f"検証サマリー: 対象 {len(files)} 件  "
          f"{Colors.GREEN}✅ {pass_count} 件合格{Colors.END}  "
          f"{Colors.RED}❌ {fail_count} 件不合格{Colors.END}")
    print('=' * 72)

    if fail_count == 0:
        print(f"\n{Colors.GREEN}✅ 全ファイルに固定ヘッダーが適用されています{Colors.END}\n")
    else:
        print(f"\n{Colors.RED}❌ {fail_count} 件のファイルに固定ヘッダーが未適用です{Colors.END}")
        print(f"   修正方法: python3 scripts/html_management/add_fixed_header.py\n")

    return fail_count


def main():
    import argparse
    parser = argparse.ArgumentParser(
        description='固定ナビゲーションヘッダーの適用状況を検証'
    )
    parser.add_argument('--staged', action='store_true',
                        help='git stageされたHTMLファイルのみチェック')
    args = parser.parse_args()

    if args.staged:
        files = get_staged_html_files()
        print(f"📋 チェック対象: git staged HTMLファイル ({len(files)} 件)\n")
    else:
        files = get_all_content_files()
        print(f"📋 チェック対象: 全コンテンツHTMLファイル ({len(files)} 件)\n")

    fail_count = run_checks(files)
    sys.exit(1 if fail_count > 0 else 0)


if __name__ == '__main__':
    main()
