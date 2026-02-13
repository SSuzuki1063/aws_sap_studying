#!/usr/bin/env python3
"""
左サイドバー目次自動生成スクリプト

全HTMLファイルに左サイドバー形式のページ内目次（Table of Contents）を追加し、
見出しへのアンカーリンク機能を実装します。
"""

import os
import re
from pathlib import Path
from typing import List, Tuple, Dict
import argparse


class SidebarTOCGenerator:
    """左サイドバー目次生成クラス"""

    # 除外するディレクトリとファイル
    EXCLUDE_DIRS = {'new_html', '.git', '__pycache__', '.claude'}
    EXCLUDE_FILES = {'index.html', 'table-of-contents.html', 'quiz.html', 'home.html', 'knowledge-base.html'}

    # 左サイドバー目次のHTMLテンプレート
    # 共通CSSリンク（sidebar-toc.cssがない場合に追加する）
    SIDEBAR_TOC_CSS_LINK = '<link href="/aws_sap_studying/css/components/sidebar-toc.css" rel="stylesheet"/>'

    SIDEBAR_TOC_TEMPLATE = '''
<!-- 左サイドバー目次 -->
<div id="sidebar-toc" class="sidebar-toc">
    <div class="sidebar-toc-header">
        <h2>📑 目次</h2>
    </div>
    <nav class="sidebar-toc-content">
        <ul>
{toc_items}
        </ul>
    </nav>
</div>

<!-- サイドバー折りたたみボタン -->
<button id="sidebar-toc-toggle" class="sidebar-toc-toggle" onclick="toggleSidebarTOC()" aria-label="目次を開閉">
    <span id="sidebar-toc-toggle-icon">◀</span>
</button>

<script>
    function toggleSidebarTOC() {{
        const sidebar = document.getElementById('sidebar-toc');
        const body = document.body;
        const icon = document.getElementById('sidebar-toc-toggle-icon');

        // モバイルかどうか判定
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {{
            // モバイル: サイドバーにopenクラスをトグル
            sidebar.classList.toggle('open');
            icon.textContent = sidebar.classList.contains('open') ? '◀' : '▶';
        }} else {{
            // デスクトップ: bodyとサイドバーにcollapsedクラスをトグル
            body.classList.toggle('sidebar-collapsed');
            sidebar.classList.toggle('collapsed');
            icon.textContent = body.classList.contains('sidebar-collapsed') ? '▶' : '◀';
        }}

        // ローカルストレージに状態を保存
        const isCollapsed = body.classList.contains('sidebar-collapsed');
        localStorage.setItem('sidebarTOCCollapsed', isCollapsed);
    }}

    // ページロード時の処理
    document.addEventListener('DOMContentLoaded', function() {{
        const isMobile = window.innerWidth <= 768;
        const savedState = localStorage.getItem('sidebarTOCCollapsed');

        if (isMobile) {{
            // モバイル: デフォルトで折りたたみ
            const icon = document.getElementById('sidebar-toc-toggle-icon');
            icon.textContent = '▶';
        }} else {{
            // デスクトップ: 保存された状態を復元（デフォルトは展開）
            if (savedState === 'true') {{
                document.body.classList.add('sidebar-collapsed');
                document.getElementById('sidebar-toc').classList.add('collapsed');
                document.getElementById('sidebar-toc-toggle-icon').textContent = '▶';
            }}
        }}

        // リサイズ時の処理
        window.addEventListener('resize', function() {{
            const isMobile = window.innerWidth <= 768;
            const sidebar = document.getElementById('sidebar-toc');
            const body = document.body;
            const icon = document.getElementById('sidebar-toc-toggle-icon');

            if (isMobile) {{
                // モバイルに切り替わった時
                sidebar.classList.remove('collapsed');
                body.classList.remove('sidebar-collapsed');
                if (!sidebar.classList.contains('open')) {{
                    icon.textContent = '▶';
                }}
            }} else {{
                // デスクトップに切り替わった時
                sidebar.classList.remove('open');
                const isCollapsed = localStorage.getItem('sidebarTOCCollapsed') === 'true';
                if (isCollapsed) {{
                    body.classList.add('sidebar-collapsed');
                    sidebar.classList.add('collapsed');
                    icon.textContent = '▶';
                }} else {{
                    icon.textContent = '◀';
                }}
            }}
        }});
    }});
</script>
'''

    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.processed_files = 0
        self.skipped_files = 0
        self.error_files = []

    def generate_id(self, text: str, existing_ids: set) -> str:
        """見出しテキストからユニークなIDを生成"""
        # 絵文字とHTMLタグを削除
        clean_text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text)
        clean_text = re.sub(r'<[^>]+>', '', clean_text)
        clean_text = clean_text.strip()

        # 日本語文字、英数字、ハイフンのみに変換
        base_id = re.sub(r'[\s:：・/]+', '-', clean_text)
        base_id = re.sub(r'[()（）「」『』【】]', '', base_id)
        base_id = base_id.strip('-')

        # 空の場合はデフォルトID
        if not base_id:
            base_id = 'section'

        # ユニークなIDを生成
        id_candidate = base_id
        counter = 1
        while id_candidate in existing_ids:
            id_candidate = f"{base_id}-{counter}"
            counter += 1

        existing_ids.add(id_candidate)
        return id_candidate

    def extract_headings(self, html_content: str) -> List[Dict[str, str]]:
        """HTMLから見出しを正規表現で抽出"""
        headings = []

        # h2とh3タグを抽出
        pattern = r'<(h[23])(\s+[^>]*)?>(.*?)</\1>'

        for match in re.finditer(pattern, html_content, re.DOTALL | re.IGNORECASE):
            tag = match.group(1).lower()
            attrs_str = match.group(2) or ''
            content = match.group(3)

            # 属性からidを抽出
            id_match = re.search(r'id=["\']([^"\']+)["\']', attrs_str)
            existing_id = id_match.group(1) if id_match else ''

            # 見出しテキストからHTMLタグを削除
            clean_text = re.sub(r'<[^>]+>', '', content)
            clean_text = clean_text.strip()

            # テキストが空でない場合のみ追加
            if clean_text:
                headings.append({
                    'tag': tag,
                    'text': clean_text,
                    'id': existing_id,
                    'full_match': match.group(0),
                    'attrs': attrs_str.strip()
                })

        return headings

    def add_ids_to_headings(self, html_content: str, headings: List[Dict[str, str]]) -> Tuple[str, List[Dict[str, str]]]:
        """見出しにIDを追加し、更新されたHTMLと見出しリストを返す"""
        existing_ids = set()
        updated_headings = []
        result_html = html_content

        for heading in headings:
            tag = heading['tag']
            text = heading['text']
            existing_id = heading['id']
            attrs = heading['attrs']
            full_match = heading['full_match']

            # 既存のIDがあればそれを使用、なければ生成
            if existing_id:
                heading_id = existing_id
                existing_ids.add(heading_id)
                updated_headings.append({
                    'tag': tag,
                    'text': text,
                    'id': heading_id
                })
            else:
                heading_id = self.generate_id(text, existing_ids)

                # 新しいタグを構築
                if attrs:
                    new_tag = f'<{tag} id="{heading_id}" {attrs}>'
                else:
                    new_tag = f'<{tag} id="{heading_id}">'

                # 元のタグ全体を新しいタグで置換
                old_opening_tag = f'<{tag}{" " + attrs if attrs else ""}>'
                new_full_tag = full_match.replace(old_opening_tag, new_tag)

                # HTMLを更新
                result_html = result_html.replace(full_match, new_full_tag, 1)

                updated_headings.append({
                    'tag': tag,
                    'text': text,
                    'id': heading_id
                })

        return result_html, updated_headings

    def generate_toc_html(self, headings: List[Dict[str, str]]) -> str:
        """左サイドバー目次のHTMLを生成"""
        if not headings:
            return ""

        toc_items = []
        for heading in headings:
            tag = heading['tag']
            text = heading['text']
            heading_id = heading['id']

            # 絵文字を保持しつつリンクを生成
            css_class = 'toc-h2' if tag == 'h2' else 'toc-h3'
            toc_item = f'            <li class="{css_class}"><a href="#{heading_id}">{text}</a></li>'
            toc_items.append(toc_item)

        toc_html = self.SIDEBAR_TOC_TEMPLATE.format(toc_items='\n'.join(toc_items))
        return toc_html

    def remove_old_toc(self, html_content: str) -> str:
        """既存の目次（インライン形式と左サイドバー形式の両方）を削除"""
        # 既存のインライン目次を削除
        html_content = re.sub(
            r'<!-- ページ内目次 -->.*?</script>\s*\n',
            '',
            html_content,
            flags=re.DOTALL
        )

        # 既存の左サイドバー目次を削除
        html_content = re.sub(
            r'<!-- 左サイドバー目次 -->.*?</script>\s*\n',
            '',
            html_content,
            flags=re.DOTALL
        )

        return html_content

    def ensure_css_link(self, html_content: str) -> str:
        """共通 sidebar-toc.css リンクがなければ追加"""
        if 'sidebar-toc.css' in html_content:
            return html_content

        # responsive.css の後に追加
        pattern = r'(<link[^>]*responsive\.css[^>]*/>)'
        if re.search(pattern, html_content):
            return re.sub(pattern, r'\1\n' + self.SIDEBAR_TOC_CSS_LINK, html_content)

        # responsive.css がない場合は </head> の前に追加
        return html_content.replace('</head>', self.SIDEBAR_TOC_CSS_LINK + '\n</head>')

    def insert_toc(self, html_content: str, toc_html: str) -> str:
        """左サイドバー目次をHTMLに挿入（body開始タグの直後）"""
        # 共通CSSリンクを確認・追加
        html_content = self.ensure_css_link(html_content)

        # 既存の目次を削除
        html_content = self.remove_old_toc(html_content)

        # body開始タグの直後に挿入
        body_pattern = r'(<body[^>]*>)'
        match = re.search(body_pattern, html_content, re.IGNORECASE)

        if match:
            insert_pos = match.end()
            result = html_content[:insert_pos] + '\n' + toc_html + '\n' + html_content[insert_pos:]
        else:
            # bodyタグが見つからない場合はそのまま返す
            print("⚠️  警告: bodyタグが見つかりませんでした")
            result = html_content

        return result

    def process_file(self, file_path: Path) -> bool:
        """単一のHTMLファイルを処理"""
        try:
            # ファイル読み込み
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()

            # 見出しを抽出
            headings = self.extract_headings(html_content)

            # 見出しが2つ未満の場合はスキップ
            if len(headings) < 2:
                print(f"⏭️  スキップ: {file_path.name} (見出しが少ないため)")
                self.skipped_files += 1
                return False

            # 見出しにIDを追加
            html_with_ids, updated_headings = self.add_ids_to_headings(html_content, headings)

            # 目次HTMLを生成
            toc_html = self.generate_toc_html(updated_headings)

            # 目次を挿入
            final_html = self.insert_toc(html_with_ids, toc_html)

            # ファイルに書き込み
            if not self.dry_run:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(final_html)
                print(f"✅ 処理完了: {file_path.name} ({len(updated_headings)}個の見出し)")
            else:
                print(f"🔍 [DRY RUN] 処理対象: {file_path.name} ({len(updated_headings)}個の見出し)")

            self.processed_files += 1
            return True

        except Exception as e:
            print(f"❌ エラー: {file_path.name} - {str(e)}")
            self.error_files.append(str(file_path))
            return False

    def process_directory(self, root_dir: Path):
        """ディレクトリ内の全HTMLファイルを処理"""
        print(f"\n{'='*60}")
        print(f"左サイドバー目次自動生成スクリプト")
        print(f"{'='*60}\n")

        if self.dry_run:
            print("🔍 DRY RUNモード: 実際の変更は行いません\n")

        # 全HTMLファイルを検索
        html_files = []

        # ルートディレクトリ直下のHTMLファイルを追加
        for html_file in root_dir.glob('*.html'):
            if html_file.name not in self.EXCLUDE_FILES:
                html_files.append(html_file)

        # カテゴリディレクトリ内のHTMLファイルを追加
        for category_dir in root_dir.iterdir():
            if not category_dir.is_dir():
                continue
            if category_dir.name in self.EXCLUDE_DIRS:
                continue

            for html_file in category_dir.glob('*.html'):
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
        print(f"✅ 処理成功: {self.processed_files}ファイル")
        print(f"⏭️  スキップ: {self.skipped_files}ファイル")
        if self.error_files:
            print(f"❌ エラー: {len(self.error_files)}ファイル")
            for error_file in self.error_files:
                print(f"   - {error_file}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description='全HTMLファイルに左サイドバー形式のページ内目次を自動追加'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='実際の変更を行わずにプレビューのみ表示'
    )
    parser.add_argument(
        '--dir',
        type=str,
        default=None,
        help='処理対象のルートディレクトリ（デフォルト: カレントディレクトリ）'
    )

    args = parser.parse_args()

    # ディレクトリの決定
    if args.dir:
        root_dir = Path(args.dir)
    else:
        # カレントディレクトリを使用
        root_dir = Path.cwd()

    if not root_dir.exists():
        print(f"❌ エラー: ディレクトリが見つかりません: {root_dir}")
        return

    generator = SidebarTOCGenerator(dry_run=args.dry_run)
    generator.process_directory(root_dir)


if __name__ == '__main__':
    main()
