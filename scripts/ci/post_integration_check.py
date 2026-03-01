#!/usr/bin/env python3
"""
AWS SAP 学習リソース 統合後検証スクリプト

新しいHTMLファイルが正しく統合されているかを検証します。
- 共有CSSリンクの存在確認
- ブレッドクラムの存在確認
- TOCの存在確認
- data.js/index.jsの同期確認
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple


class PostIntegrationChecker:
    """統合後検証クラス"""

    SHARED_CSS_PATTERN = r'href="/aws_sap_studying/css/'
    BREADCRUMB_PATTERN = r'class="breadcrumb'
    TOC_PATTERN = r'class="(sidebar-toc|page-toc|toc-list)'

    # チェック対象ディレクトリ
    CATEGORY_DIRS = [
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
        'new-solutions'
    ]

    def __init__(self, verbose: bool = False):
        self.repo_root = Path(__file__).parent.parent.parent
        self.verbose = verbose
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.passed = 0
        self.failed = 0

    def check_shared_css(self, file_path: Path) -> bool:
        """共有CSSリンクの存在確認"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return bool(re.search(self.SHARED_CSS_PATTERN, content))
        except Exception:
            return False

    def check_breadcrumb(self, file_path: Path) -> bool:
        """ブレッドクラムの存在確認"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return bool(re.search(self.BREADCRUMB_PATTERN, content))
        except Exception:
            return False

    def check_toc(self, file_path: Path) -> bool:
        """TOCの存在確認"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return bool(re.search(self.TOC_PATTERN, content))
        except Exception:
            return False

    def get_html_title(self, file_path: Path) -> str:
        """HTMLファイルからタイトルを取得"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            match = re.search(r'<title>([^<]+)</title>', content)
            return match.group(1) if match else file_path.stem
        except Exception:
            return file_path.stem

    def check_data_js_entry(self, rel_path: str) -> bool:
        """data.jsにリソースが登録されているか確認"""
        data_js_path = self.repo_root / "data.js"
        try:
            with open(data_js_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return rel_path in content
        except Exception:
            return False

    def check_index_js_entry(self, rel_path: str) -> bool:
        """index.jsのsearchDataにリソースが登録されているか確認"""
        index_js_path = self.repo_root / "index.js"
        try:
            with open(index_js_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return rel_path in content
        except Exception:
            return False

    def check_file(self, file_path: Path, category: str) -> Dict:
        """単一ファイルの検証"""
        rel_path = f"{category}/{file_path.name}"
        title = self.get_html_title(file_path)

        results = {
            'file': rel_path,
            'title': title,
            'shared_css': self.check_shared_css(file_path),
            'breadcrumb': self.check_breadcrumb(file_path),
            'toc': self.check_toc(file_path),
            'data_js': self.check_data_js_entry(rel_path),
            'index_js': self.check_index_js_entry(rel_path)
        }

        return results

    def run(self) -> bool:
        """検証実行"""
        print("🔍 統合後検証を実行中...")
        print("=" * 70)

        all_results = []
        missing_css = []
        missing_breadcrumb = []
        missing_toc = []
        missing_data_js = []
        missing_index_js = []

        # 各カテゴリディレクトリをチェック
        for category in self.CATEGORY_DIRS:
            category_path = self.repo_root / category
            if not category_path.exists():
                continue

            html_files = list(category_path.glob("*.html"))
            for html_file in html_files:
                results = self.check_file(html_file, category)
                all_results.append(results)

                if not results['shared_css']:
                    missing_css.append(results['file'])
                if not results['breadcrumb']:
                    missing_breadcrumb.append(results['file'])
                if not results['toc']:
                    missing_toc.append(results['file'])
                if not results['data_js']:
                    missing_data_js.append(results['file'])
                if not results['index_js']:
                    missing_index_js.append(results['file'])

        # 結果表示
        total_files = len(all_results)
        print(f"\n📊 検証対象: {total_files} ファイル\n")

        # 共有CSS
        print("┌─ 共有CSSリンク ─────────────────────────────────────────────┐")
        if missing_css:
            print(f"│ ❌ 欠落: {len(missing_css)} ファイル")
            if self.verbose:
                for f in missing_css[:10]:
                    print(f"│    - {f}")
                if len(missing_css) > 10:
                    print(f"│    ... 他 {len(missing_css) - 10} ファイル")
            self.errors.append(f"共有CSSリンク欠落: {len(missing_css)} ファイル")
        else:
            print(f"│ ✅ すべてのファイルに共有CSSリンクあり")
        print("└─────────────────────────────────────────────────────────────┘")

        # ブレッドクラム
        print("\n┌─ ブレッドクラム ────────────────────────────────────────────┐")
        if missing_breadcrumb:
            print(f"│ ⚠️  欠落: {len(missing_breadcrumb)} ファイル")
            if self.verbose:
                for f in missing_breadcrumb[:10]:
                    print(f"│    - {f}")
            self.warnings.append(f"ブレッドクラム欠落: {len(missing_breadcrumb)} ファイル")
        else:
            print(f"│ ✅ すべてのファイルにブレッドクラムあり")
        print("└─────────────────────────────────────────────────────────────┘")

        # TOC
        print("\n┌─ 目次(TOC) ─────────────────────────────────────────────────┐")
        if missing_toc:
            print(f"│ ⚠️  欠落: {len(missing_toc)} ファイル")
            if self.verbose:
                for f in missing_toc[:10]:
                    print(f"│    - {f}")
            self.warnings.append(f"TOC欠落: {len(missing_toc)} ファイル")
        else:
            print(f"│ ✅ すべてのファイルにTOCあり")
        print("└─────────────────────────────────────────────────────────────┘")

        # data.js
        print("\n┌─ data.js 登録 ──────────────────────────────────────────────┐")
        if missing_data_js:
            print(f"│ ❌ 未登録: {len(missing_data_js)} ファイル")
            if self.verbose or len(missing_data_js) <= 20:
                for f in missing_data_js[:20]:
                    print(f"│    - {f}")
                if len(missing_data_js) > 20:
                    print(f"│    ... 他 {len(missing_data_js) - 20} ファイル")
            self.errors.append(f"data.js未登録: {len(missing_data_js)} ファイル")
        else:
            print(f"│ ✅ すべてのファイルがdata.jsに登録済み")
        print("└─────────────────────────────────────────────────────────────┘")

        # index.js
        print("\n┌─ index.js searchData 登録 ──────────────────────────────────┐")
        if missing_index_js:
            print(f"│ ❌ 未登録: {len(missing_index_js)} ファイル")
            if self.verbose or len(missing_index_js) <= 20:
                for f in missing_index_js[:20]:
                    print(f"│    - {f}")
                if len(missing_index_js) > 20:
                    print(f"│    ... 他 {len(missing_index_js) - 20} ファイル")
            self.errors.append(f"index.js未登録: {len(missing_index_js)} ファイル")
        else:
            print(f"│ ✅ すべてのファイルがindex.js searchDataに登録済み")
        print("└─────────────────────────────────────────────────────────────┘")

        # サマリー
        print("\n" + "=" * 70)
        if self.errors:
            print("❌ 検証失敗")
            for error in self.errors:
                print(f"   • {error}")
            return False
        elif self.warnings:
            print("⚠️  検証成功（警告あり）")
            for warning in self.warnings:
                print(f"   • {warning}")
            return True
        else:
            print("✅ 検証成功")
            return True


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="統合後のHTMLファイル検証",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # 基本検証
  python3 post_integration_check.py

  # 詳細表示
  python3 post_integration_check.py --verbose
        """
    )

    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="詳細な出力を表示"
    )

    args = parser.parse_args()

    checker = PostIntegrationChecker(verbose=args.verbose)
    success = checker.run()

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
