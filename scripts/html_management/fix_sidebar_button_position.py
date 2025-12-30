#!/usr/bin/env python3
"""
左サイドバー目次の折りたたみボタン位置修正スクリプト

ボタンが固定ヘッダーの下に隠れている問題を修正します。
top: 20px → top: 70px に変更（固定ヘッダー60px + マージン10px）
"""

import os
import re
from pathlib import Path
import argparse


class SidebarButtonFixer:
    """サイドバーボタン位置修正クラス"""

    # 除外するディレクトリとファイル
    EXCLUDE_DIRS = {'new_html', '.git', '__pycache__', '.claude', 'scripts'}
    EXCLUDE_FILES = {'index.html', 'table-of-contents.html', 'quiz.html', 'home.html'}

    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.processed_files = 0
        self.skipped_files = 0
        self.error_files = []

    def fix_button_position(self, html_content: str) -> tuple[str, bool]:
        """ボタン位置を修正"""
        # sidebar-toc-toggleのtop: 20px;をtop: 70px;に変更
        pattern = r'(\.sidebar-toc-toggle\s*{[^}]*?top:\s*)20px;'
        replacement = r'\g<1>70px;'

        new_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)

        # 変更があったかチェック
        modified = new_content != html_content

        return new_content, modified

    def process_file(self, file_path: Path) -> bool:
        """単一のHTMLファイルを処理"""
        try:
            # ファイル読み込み
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()

            # sidebar-toc-toggleが存在しない場合はスキップ
            if 'sidebar-toc-toggle' not in html_content:
                return False

            # ボタン位置を修正
            new_content, modified = self.fix_button_position(html_content)

            if not modified:
                print(f"⏭️  スキップ: {file_path.name} (既に修正済みまたは変更不要)")
                self.skipped_files += 1
                return False

            # ファイルに書き込み
            if not self.dry_run:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ 修正完了: {file_path.name}")
            else:
                print(f"🔍 [DRY RUN] 修正対象: {file_path.name}")

            self.processed_files += 1
            return True

        except Exception as e:
            print(f"❌ エラー: {file_path.name} - {str(e)}")
            self.error_files.append(str(file_path))
            return False

    def process_directory(self, root_dir: Path):
        """ディレクトリ内の全HTMLファイルを処理"""
        print(f"\n{'='*60}")
        print(f"左サイドバー目次ボタン位置修正スクリプト")
        print(f"{'='*60}\n")

        if self.dry_run:
            print("🔍 DRY RUNモード: 実際の変更は行いません\n")

        # 全HTMLファイルを検索
        html_files = []
        for category_dir in root_dir.iterdir():
            if not category_dir.is_dir():
                continue
            if category_dir.name in self.EXCLUDE_DIRS:
                continue

            for html_file in category_dir.glob('*.html'):
                if html_file.name not in self.EXCLUDE_FILES:
                    html_files.append(html_file)

        print(f"📁 検索対象: {len(html_files)}個のHTMLファイル\n")

        # 各ファイルを処理
        for html_file in sorted(html_files):
            self.process_file(html_file)

        # 結果サマリー
        print(f"\n{'='*60}")
        print(f"処理完了")
        print(f"{'='*60}")
        print(f"✅ 修正成功: {self.processed_files}ファイル")
        print(f"⏭️  スキップ: {self.skipped_files}ファイル")
        if self.error_files:
            print(f"❌ エラー: {len(self.error_files)}ファイル")
            for error_file in self.error_files:
                print(f"   - {error_file}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description='左サイドバー目次ボタンの位置を修正（top: 20px → top: 70px）'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='実際の変更を行わずにプレビューのみ表示'
    )
    parser.add_argument(
        '--dir',
        type=str,
        default='/home/meme1/aws_sap_studying',
        help='処理対象のルートディレクトリ（デフォルト: /home/meme1/aws_sap_studying）'
    )

    args = parser.parse_args()

    root_dir = Path(args.dir)
    if not root_dir.exists():
        print(f"❌ エラー: ディレクトリが見つかりません: {root_dir}")
        return

    fixer = SidebarButtonFixer(dry_run=args.dry_run)
    fixer.process_directory(root_dir)


if __name__ == '__main__':
    main()
