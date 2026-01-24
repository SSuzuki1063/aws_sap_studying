#!/usr/bin/env python3
"""
HTMLファイルの問題修正スクリプト

1. HTMLエンティティエスケープ問題を修正（&lt; → <, &gt; → >）
2. サイドバーTOCのスタイルを更新（z-index、top位置）
"""

import os
import re
from pathlib import Path


class HTMLFixer:
    """HTML問題修正クラス"""

    EXCLUDE_DIRS = {'new_html', '.git', '__pycache__', '.claude', 'scripts', 'docs', 'css', 'trouble_image'}
    EXCLUDE_FILES = {'index.html', 'table-of-contents.html', 'quiz.html', 'home.html', 'knowledge-base.html'}

    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.fixed_count = 0
        self.error_files = []

    def fix_html_entity(self, content: str) -> str:
        """HTMLエンティティエスケープ問題を修正"""
        # &lt;!-- ページ固有CSSファイル --&gt; を <!-- ページ固有CSSファイル --> に変換
        content = content.replace('&lt;!-- ページ固有CSSファイル --&gt;', '<!-- ページ固有CSSファイル -->')
        return content

    def fix_sidebar_toc_style(self, content: str) -> str:
        """サイドバーTOCのスタイルを更新（直接的な文字列置換）"""

        # 1. サイドバーのtop: 0 を top: 60px に変更
        # 左サイドバー目次のスタイルブロック内
        old_sidebar_style = """    /* 左サイドバー目次 */
    .sidebar-toc {
        position: fixed;
        left: 0;
        top: 0;
        width: 340px;
        height: 100vh;"""

        new_sidebar_style = """    /* 左サイドバー目次 */
    .sidebar-toc {
        position: fixed;
        left: 0;
        top: 60px;  /* ヘッダーの高さ分下げる */
        width: 340px;
        height: calc(100vh - 60px);  /* ヘッダー分を引く */"""

        content = content.replace(old_sidebar_style, new_sidebar_style)

        # 2. 折りたたみボタンのtopとz-indexを修正
        old_toggle_style = """    /* 折りたたみボタン */
    .sidebar-toc-toggle {
        position: fixed;
        left: 340px;
        top: 20px;
        background: #3b82f6;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        font-size: 1.2em;
        transition: all 0.3s ease;
        z-index: 1001;"""

        new_toggle_style = """    /* 折りたたみボタン */
    .sidebar-toc-toggle {
        position: fixed;
        left: 340px;
        top: 80px;  /* ヘッダーの下に配置 */
        background: #3b82f6;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        font-size: 1.2em;
        transition: all 0.3s ease;
        z-index: 1003;  /* ヘッダー(1002)より上に */"""

        content = content.replace(old_toggle_style, new_toggle_style)

        # 3. モバイル対応部分を修正
        old_mobile_sidebar = """        .sidebar-toc {
            width: 280px;
            transform: translateX(-100%);
        }"""

        new_mobile_sidebar = """        .sidebar-toc {
            width: 280px;
            top: 60px;  /* ヘッダーの下 */
            height: calc(100vh - 60px);
            transform: translateX(-100%);
        }"""

        content = content.replace(old_mobile_sidebar, new_mobile_sidebar)

        old_mobile_toggle = """        .sidebar-toc-toggle {
            left: 0;
            border-radius: 0 8px 8px 0;
        }"""

        new_mobile_toggle = """        .sidebar-toc-toggle {
            left: 0;
            top: 80px;  /* ヘッダーの下に配置 */
            border-radius: 0 8px 8px 0;
        }"""

        content = content.replace(old_mobile_toggle, new_mobile_toggle)

        # 4. タブレット対応部分を修正
        old_tablet_sidebar = """        .sidebar-toc {
            width: 290px;
        }"""

        new_tablet_sidebar = """        .sidebar-toc {
            width: 290px;
            top: 60px;  /* ヘッダーの下 */
            height: calc(100vh - 60px);
        }"""

        content = content.replace(old_tablet_sidebar, new_tablet_sidebar)

        old_tablet_toggle = """        .sidebar-toc-toggle {
            left: 290px;
        }"""

        new_tablet_toggle = """        .sidebar-toc-toggle {
            left: 290px;
            top: 80px;  /* ヘッダーの下に配置 */
        }"""

        content = content.replace(old_tablet_toggle, new_tablet_toggle)

        return content

    def process_file(self, file_path: Path) -> bool:
        """単一のHTMLファイルを処理"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()

            # 修正を適用
            content = self.fix_html_entity(original_content)
            content = self.fix_sidebar_toc_style(content)

            # 変更があった場合のみ書き込み
            if content != original_content:
                if not self.dry_run:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ 修正完了: {file_path.name}")
                else:
                    print(f"🔍 [DRY RUN] 修正対象: {file_path.name}")
                self.fixed_count += 1
                return True
            else:
                return False

        except Exception as e:
            print(f"❌ エラー: {file_path.name} - {str(e)}")
            self.error_files.append(str(file_path))
            return False

    def process_directory(self, root_dir: Path):
        """ディレクトリ内の全HTMLファイルを処理"""
        print(f"\n{'='*60}")
        print(f"HTML問題修正スクリプト")
        print(f"{'='*60}\n")

        if self.dry_run:
            print("🔍 DRY RUNモード: 実際の変更は行いません\n")

        # 全HTMLファイルを検索
        html_files = []

        # ルートディレクトリ直下のHTMLファイル
        for html_file in root_dir.glob('*.html'):
            if html_file.name not in self.EXCLUDE_FILES:
                html_files.append(html_file)

        # サブディレクトリ内のHTMLファイル
        for item in root_dir.iterdir():
            if not item.is_dir():
                continue
            if item.name in self.EXCLUDE_DIRS:
                continue

            for html_file in item.glob('*.html'):
                if html_file.name not in self.EXCLUDE_FILES:
                    html_files.append(html_file)

        print(f"📁 処理対象: {len(html_files)}個のHTMLファイル\n")

        # 各ファイルを処理
        for html_file in sorted(html_files):
            self.process_file(html_file)

        # 結果サマリー
        print(f"\n{'='*60}")
        print(f"処理完了")
        print(f"{'='*60}")
        print(f"✅ 修正済み: {self.fixed_count}ファイル")
        if self.error_files:
            print(f"❌ エラー: {len(self.error_files)}ファイル")
            for error_file in self.error_files:
                print(f"   - {error_file}")
        print(f"{'='*60}\n")


def main():
    import argparse

    parser = argparse.ArgumentParser(description='HTMLファイルの問題を修正')
    parser.add_argument('--dry-run', action='store_true', help='実際の変更を行わずにプレビュー')
    parser.add_argument('--dir', type=str, default=None, help='処理対象ディレクトリ')

    args = parser.parse_args()

    if args.dir:
        root_dir = Path(args.dir)
    else:
        # スクリプトの2階層上（プロジェクトルート）
        root_dir = Path(__file__).parent.parent.parent

    if not root_dir.exists():
        print(f"❌ エラー: ディレクトリが見つかりません: {root_dir}")
        return

    fixer = HTMLFixer(dry_run=args.dry_run)
    fixer.process_directory(root_dir)


if __name__ == '__main__':
    main()
