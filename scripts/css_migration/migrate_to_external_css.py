#!/usr/bin/env python3
"""
AWS SAP学習リソース - 共通CSS移行スクリプト
データ駆動アーキテクチャに基づき、既存HTMLファイルを共通CSS化

206個のHTMLファイルから重複CSSを削除し、外部CSSファイルへのリンクに置き換えます。

使用方法:
    # ドライラン（変更なし、プレビューのみ）
    python3 scripts/css_migration/migrate_to_external_css.py --dry-run

    # 10ファイルでパイロットテスト
    python3 scripts/css_migration/migrate_to_external_css.py --test

    # 全ファイルに適用
    python3 scripts/css_migration/migrate_to_external_css.py --all
"""

import os
import re
import sys
import argparse
from pathlib import Path
from typing import List, Tuple
from bs4 import BeautifulSoup, NavigableString, Comment


class CSSMigrator:
    """HTMLファイルを共通CSS化するクラス"""

    def __init__(self, repo_root: Path, dry_run: bool = False):
        self.repo_root = repo_root
        self.dry_run = dry_run
        self.stats = {
            'processed': 0,
            'modified': 0,
            'skipped': 0,
            'errors': 0,
            'lines_removed': 0
        }

        # 削除対象のCSSパターン（正規表現）
        self.css_patterns_to_remove = [
            # 固定ナビゲーションヘッダー
            r'\.fixed-nav-header\s*\{[^}]+\}',
            r'\.fixed-nav-container\s*\{[^}]+\}',
            r'\.fixed-nav-logo\s*\{[^}]+\}',
            r'\.fixed-nav-logo:hover\s*\{[^}]+\}',
            r'\.fixed-nav-links\s*\{[^}]+\}',
            r'\.fixed-nav-links\s+a\s*\{[^}]+\}',
            r'\.fixed-nav-links\s+a:hover[^}]+\}',
            r'\.fixed-nav-links\s+a:focus[^}]+\}',

            # ブレッドクラム
            r'\.breadcrumb-nav\s*\{[^}]+\}',
            r'\.breadcrumb-home\s*\{[^}]+\}',
            r'\.breadcrumb-home:hover\s*\{[^}]+\}',
            r'\.breadcrumb-separator\s*\{[^}]+\}',
            r'\.breadcrumb-item\s*\{[^}]+\}',
            r'\.breadcrumb-current\s*\{[^}]+\}',

            # 読書進捗インジケーター
            r'\.reading-progress\s*\{[^}]+\}',
            r'\.reading-progress\.show\s*\{[^}]+\}',
            r'\.reading-progress-bar\s*\{[^}]+\}',

            # トップに戻るボタン
            r'\.scroll-to-top\s*\{[^}]+\}',
            r'\.scroll-to-top\.show\s*\{[^}]+\}',
            r'\.scroll-to-top:hover\s*\{[^}]+\}',
            r'\.scroll-to-top:active\s*\{[^}]+\}',

            # レスポンシブ（共通部分のみ）
            r'@media\s*\(max-width:\s*768px\)\s*\{[^}]*\.fixed-nav[^}]+\}[^}]*\}',
            r'@media\s*\(max-width:\s*768px\)\s*\{[^}]*\.breadcrumb-nav[^}]+\}[^}]*\}',
            r'@media\s*\(max-width:\s*768px\)\s*\{[^}]*\.scroll-to-top[^}]+\}[^}]*\}'
        ]

        # 共通CSSリンクのテンプレート
        self.css_links = '''    <!-- 共通CSSファイル（データ駆動アーキテクチャ） -->
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/common.css">
    <link rel="stylesheet" href="/css/layout.css">
    <link rel="stylesheet" href="/css/responsive.css">
'''

    def find_html_files(self, limit: int = None) -> List[Path]:
        """HTMLファイルを検索"""
        html_files = []

        # 主要カテゴリディレクトリ
        categories = [
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
            'new-solutions',
            'cost-control'
        ]

        for category in categories:
            category_path = self.repo_root / category
            if category_path.exists():
                for html_file in category_path.glob('*.html'):
                    html_files.append(html_file)
                    if limit and len(html_files) >= limit:
                        return html_files

        return html_files

    def remove_common_css(self, css_content: str) -> Tuple[str, int]:
        """共通CSS部分を削除"""
        original_lines = css_content.count('\n')
        modified_content = css_content

        # パターンマッチで削除
        for pattern in self.css_patterns_to_remove:
            # 複数行にまたがるCSSルールを削除
            modified_content = re.sub(
                pattern,
                '',
                modified_content,
                flags=re.DOTALL | re.MULTILINE
            )

        # コメント内の共通CSS説明も削除
        modified_content = re.sub(
            r'/\*\s*={40,}\s*固定ナビゲーション.*?={40,}\s*\*/',
            '',
            modified_content,
            flags=re.DOTALL
        )
        modified_content = re.sub(
            r'/\*\s*ブレッドクラム.*?\*/',
            '',
            modified_content,
            flags=re.DOTALL
        )

        # 空行を整理
        modified_content = re.sub(r'\n{3,}', '\n\n', modified_content)

        removed_lines = original_lines - modified_content.count('\n')
        return modified_content.strip(), removed_lines

    def migrate_html_file(self, html_file: Path) -> bool:
        """HTMLファイルを共通CSS化"""
        try:
            # HTMLファイルを読み込み
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()

            # BeautifulSoupでパース
            soup = BeautifulSoup(html_content, 'html.parser')

            # <head>タグを取得
            head = soup.find('head')
            if not head:
                print(f"⚠️  <head>タグが見つかりません: {html_file.name}")
                self.stats['skipped'] += 1
                return False

            # 既に共通CSSリンクがある場合はスキップ
            if soup.find('link', href='/css/variables.css'):
                print(f"⏭️  既に共通CSS化済み: {html_file.name}")
                self.stats['skipped'] += 1
                return False

            # <style>タグを処理
            style_tags = soup.find_all('style')
            modified = False
            total_removed_lines = 0

            for style_tag in style_tags:
                if style_tag.string:
                    original_css = style_tag.string
                    cleaned_css, removed_lines = self.remove_common_css(original_css)

                    if removed_lines > 0:
                        style_tag.string = '\n' + cleaned_css + '\n    '
                        total_removed_lines += removed_lines
                        modified = True

            # 共通CSSリンクを追加
            if modified:
                # <title>タグの後に挿入（存在する場合）
                title_tag = head.find('title')
                if title_tag:
                    # NavigableStringとして挿入
                    css_links_tag = BeautifulSoup(self.css_links, 'html.parser')
                    for tag in reversed(list(css_links_tag)):
                        title_tag.insert_after(tag)
                else:
                    # <head>の最初に挿入
                    css_links_tag = BeautifulSoup(self.css_links, 'html.parser')
                    for tag in list(css_links_tag):
                        head.insert(0, tag)

            # ドライランでない場合のみファイル保存
            if not self.dry_run and modified:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify()))

                self.stats['modified'] += 1
                self.stats['lines_removed'] += total_removed_lines
                print(f"✅ {html_file.name}: {total_removed_lines}行削減")
            elif self.dry_run and modified:
                print(f"[DRY RUN] {html_file.name}: {total_removed_lines}行削減予定")

            self.stats['processed'] += 1
            return modified

        except Exception as e:
            print(f"❌ エラー: {html_file.name} - {str(e)}")
            self.stats['errors'] += 1
            return False

    def run(self, limit: int = None):
        """移行処理を実行"""
        print("=" * 80)
        print("📦 AWS SAP学習リソース - 共通CSS移行スクリプト")
        print("=" * 80)

        if self.dry_run:
            print("⚠️  ドライランモード: 実際の変更は行いません\n")

        # HTMLファイルを検索
        html_files = self.find_html_files(limit=limit)
        print(f"📂 {len(html_files)}個のHTMLファイルを発見\n")

        if limit:
            print(f"⚙️  パイロットモード: 最初の{limit}ファイルのみ処理\n")

        print("=" * 80)
        print()

        # 各ファイルを処理
        for html_file in html_files:
            self.migrate_html_file(html_file)

        # 統計表示
        print()
        print("=" * 80)
        print("📊 処理結果サマリー")
        print("=" * 80)
        print(f"✅ 処理済みファイル数: {self.stats['processed']}")
        print(f"📝 変更されたファイル数: {self.stats['modified']}")
        print(f"⏭️  スキップされたファイル数: {self.stats['skipped']}")
        print(f"❌ エラー発生ファイル数: {self.stats['errors']}")
        print(f"🗑️  削減されたCSS行数: {self.stats['lines_removed']}")
        print("=" * 80)

        if not self.dry_run and self.stats['modified'] > 0:
            print("\n✅ 移行完了！")
            print("\n次のステップ:")
            print("1. ローカルサーバーで動作確認: python3 server.py")
            print("2. W3C Validation実行: python3 scripts/ci/validate_html_w3c.py --pr-mode")
            print("3. Git commit & push")
        elif self.dry_run:
            print("\n📋 ドライラン完了（変更なし）")
            print("実際に変更を適用するには、--dry-runオプションを外して再実行してください。")


def main():
    parser = argparse.ArgumentParser(
        description='既存HTMLファイルを共通CSS化するスクリプト',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
使用例:
  # ドライラン（プレビューのみ）
  %(prog)s --dry-run

  # 10ファイルでパイロットテスト
  %(prog)s --test

  # 全ファイルに適用
  %(prog)s --all
        '''
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='ドライランモード（変更なし、プレビューのみ）'
    )

    parser.add_argument(
        '--test',
        action='store_true',
        help='パイロットモード（最初の10ファイルのみ処理）'
    )

    parser.add_argument(
        '--all',
        action='store_true',
        help='全ファイルに適用'
    )

    args = parser.parse_args()

    # リポジトリルートを取得
    repo_root = Path(__file__).resolve().parent.parent.parent

    # モード判定
    if args.test:
        limit = 10
    elif args.all:
        limit = None
    else:
        # デフォルトはドライラン
        args.dry_run = True
        limit = 10

    # 移行実行
    migrator = CSSMigrator(repo_root, dry_run=args.dry_run)
    migrator.run(limit=limit)


if __name__ == '__main__':
    main()
