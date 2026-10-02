#!/usr/bin/env python3
"""
ページ内目次自動生成スクリプト

全HTMLファイルにページ内目次（Table of Contents）を追加し、
見出しへのアンカーリンク機能を実装します。
"""

import argparse
import re
from pathlib import Path
from typing import ClassVar


class TOCGenerator:
    """ページ内目次生成クラス"""

    # 除外するディレクトリとファイル
    EXCLUDE_DIRS: ClassVar[set[str]] = {"new_html", ".git", "__pycache__"}
    EXCLUDE_FILES: ClassVar[set[str]] = {
        "index.html",
        "table-of-contents.html",
        "quiz.html",
        "home.html",
    }

    # 目次のHTMLテンプレート
    TOC_TEMPLATE = """
<!-- ページ内目次 -->
<div id="toc-container" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 20px 25px; margin: 30px 0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: pointer;" onclick="toggleTOC()">
        <h2 style="color: #1e40af; margin: 0; font-size: 1.3em; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📑</span>
            <span>目次</span>
        </h2>
        <button id="toc-toggle-btn" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9em; transition: all 0.3s;">
            <span id="toc-toggle-icon">▶</span> <span id="toc-toggle-text">展開する</span>
        </button>
    </div>
    <nav id="toc-content" class="collapsed" style="transition: all 0.3s ease;">
        <ul style="list-style: none; padding: 0; margin: 0;">
{toc_items}
        </ul>
    </nav>
</div>

<style>
    #toc-container a {{
        color: #1e40af;
        text-decoration: none;
        transition: all 0.2s;
        display: block;
        padding: 8px 12px;
        border-radius: 6px;
        margin: 4px 0;
    }}

    #toc-container a:hover {{
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
        transform: translateX(5px);
    }}

    #toc-container .toc-h2 {{
        font-weight: 600;
        font-size: 1.05em;
        margin-top: 10px;
    }}

    #toc-container .toc-h3 {{
        font-size: 0.95em;
        padding-left: 30px;
        color: #4b5563;
    }}

    #toc-content.collapsed {{
        max-height: 0;
        overflow: hidden;
        opacity: 0;
    }}

    html {{
        scroll-behavior: smooth;
    }}

    @media (max-width: 768px) {{
        #toc-container {{
            padding: 15px;
        }}

        #toc-container h2 {{
            font-size: 1.1em;
        }}
    }}
</style>

<script>
    function toggleTOC() {{
        const content = document.getElementById('toc-content');
        const icon = document.getElementById('toc-toggle-icon');
        const text = document.getElementById('toc-toggle-text');

        if (content.classList.contains('collapsed')) {{
            // 展開
            content.style.maxHeight = content.scrollHeight + 'px';
            content.classList.remove('collapsed');
            icon.textContent = '▼';
            text.textContent = '折りたたむ';
        }} else {{
            // 折りたたみ
            content.style.maxHeight = '';  // インラインスタイルをクリア
            content.classList.add('collapsed');
            icon.textContent = '▶';
            text.textContent = '展開する';
        }}
    }}

    // ページロード時の処理（デフォルトは折りたたみ状態）
    document.addEventListener('DOMContentLoaded', function() {{
        const tocContent = document.getElementById('toc-content');
        if (tocContent) {{
            // 展開時のアニメーション用にmax-heightを保存
            tocContent.dataset.maxHeight = tocContent.scrollHeight + 'px';
        }}
    }});
</script>
"""

    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.processed_files = 0
        self.skipped_files = 0
        self.error_files = []

    def generate_id(self, text: str, existing_ids: set) -> str:
        """見出しテキストからユニークなIDを生成"""
        # 絵文字とHTMLタグを削除
        clean_text = re.sub(r"[\U0001F300-\U0001F9FF]", "", text)
        clean_text = re.sub(r"<[^>]+>", "", clean_text)
        clean_text = clean_text.strip()

        # 日本語文字、英数字、ハイフンのみに変換
        # 日本語はそのまま保持し、スペースと一部の記号のみ変換
        base_id = re.sub(r"[\s:：・/]+", "-", clean_text)
        base_id = re.sub(r"[()（）「」『』【】]", "", base_id)
        base_id = base_id.strip("-")

        # 空の場合はデフォルトID
        if not base_id:
            base_id = "section"

        # ユニークなIDを生成
        id_candidate = base_id
        counter = 1
        while id_candidate in existing_ids:
            id_candidate = f"{base_id}-{counter}"
            counter += 1

        existing_ids.add(id_candidate)
        return id_candidate

    def extract_headings(self, html_content: str) -> list[dict[str, str]]:
        """HTMLから見出しを正規表現で抽出"""
        headings = []

        # h2とh3タグを抽出（属性とテキストを含む）
        # <h2 ...>テキスト</h2> の形式にマッチ
        pattern = r"<(h[23])(\s+[^>]*)?>(.*?)</\1>"

        for match in re.finditer(pattern, html_content, re.DOTALL | re.IGNORECASE):
            tag = match.group(1).lower()
            attrs_str = match.group(2) or ""
            content = match.group(3)

            # 属性からidとclassを抽出
            id_match = re.search(r'id=["\']([^"\']+)["\']', attrs_str)
            class_match = re.search(r'class=["\']([^"\']+)["\']', attrs_str)

            existing_id = id_match.group(1) if id_match else ""
            class_attr = class_match.group(1) if class_match else ""

            # 見出しテキストからHTMLタグを削除（spanなどのインライン要素対応）
            clean_text = re.sub(r"<[^>]+>", "", content)
            clean_text = clean_text.strip()

            # テキストが空でない場合のみ追加
            if clean_text:
                headings.append(
                    {
                        "tag": tag,
                        "text": clean_text,
                        "id": existing_id,
                        "class": class_attr,
                        "full_match": match.group(0),
                        "attrs": attrs_str.strip(),
                    }
                )

        return headings

    def add_ids_to_headings(
        self, html_content: str, headings: list[dict[str, str]]
    ) -> tuple[str, list[dict[str, str]]]:
        """見出しにIDを追加し、更新されたHTMLと見出しリストを返す"""
        existing_ids = set()
        updated_headings = []
        result_html = html_content

        for heading in headings:
            tag = heading["tag"]
            text = heading["text"]
            existing_id = heading["id"]
            attrs = heading["attrs"]
            full_match = heading["full_match"]

            # 既存のIDがあればそれを使用、なければ生成
            if existing_id:
                heading_id = existing_id
                existing_ids.add(heading_id)
                updated_headings.append({"tag": tag, "text": text, "id": heading_id})
            else:
                heading_id = self.generate_id(text, existing_ids)

                # 新しいタグを構築
                if attrs:
                    # 既存の属性がある場合、id属性を追加
                    new_tag = f'<{tag} id="{heading_id}" {attrs}>'
                else:
                    # 属性がない場合、idのみ追加
                    new_tag = f'<{tag} id="{heading_id}">'

                # 元のタグ全体を新しいタグで置換
                old_opening_tag = f"<{tag}{' ' + attrs if attrs else ''}>"
                new_full_tag = full_match.replace(old_opening_tag, new_tag)

                # HTMLを更新（最初の出現のみ）
                result_html = result_html.replace(full_match, new_full_tag, 1)

                updated_headings.append({"tag": tag, "text": text, "id": heading_id})

        return result_html, updated_headings

    def generate_toc_html(self, headings: list[dict[str, str]]) -> str:
        """目次のHTMLを生成"""
        if not headings:
            return ""

        toc_items = []
        for heading in headings:
            tag = heading["tag"]
            text = heading["text"]
            heading_id = heading["id"]

            # 絵文字を保持しつつリンクを生成
            css_class = "toc-h2" if tag == "h2" else "toc-h3"
            toc_item = f'            <li class="{css_class}"><a href="#{heading_id}">{text}</a></li>'
            toc_items.append(toc_item)

        toc_html = self.TOC_TEMPLATE.format(toc_items="\n".join(toc_items))
        return toc_html

    def insert_toc(self, html_content: str, toc_html: str) -> str:
        """目次をHTMLに挿入（既存の目次があれば置換）"""
        # 既存の目次を削除
        html_content = re.sub(
            r"<!-- ページ内目次 -->.*?</script>\s*\n", "", html_content, flags=re.DOTALL
        )

        # パンくずリストの後に挿入
        breadcrumb_pattern = r"(<!-- Breadcrumb Navigation -->.*?</nav>)"
        match = re.search(breadcrumb_pattern, html_content, re.DOTALL)

        if match:
            # パンくずリストの後に挿入
            insert_pos = match.end()
            result = (
                html_content[:insert_pos]
                + "\n"
                + toc_html
                + "\n"
                + html_content[insert_pos:]
            )
        else:
            # パンくずリストがない場合、最初のh1タグの後に挿入
            h1_pattern = r"(</h1>)"
            h1_matches = list(re.finditer(h1_pattern, html_content))

            if h1_matches:
                # 最初のh1タグの後に挿入
                insert_pos = h1_matches[0].end()
                result = (
                    html_content[:insert_pos]
                    + "\n"
                    + toc_html
                    + "\n"
                    + html_content[insert_pos:]
                )
            else:
                # h1タグもない場合、bodyタグの直後のコンテナ内に挿入
                body_pattern = (
                    r'(<body[^>]*>.*?<div[^>]*class="[^"]*container[^"]*"[^>]*>)'
                )
                match = re.search(body_pattern, html_content, re.DOTALL)
                if match:
                    insert_pos = match.end()
                    result = (
                        html_content[:insert_pos]
                        + "\n"
                        + toc_html
                        + "\n"
                        + html_content[insert_pos:]
                    )
                else:
                    # それでも見つからない場合はそのまま返す
                    result = html_content

        return result

    def process_file(self, file_path: Path) -> bool:
        """単一のHTMLファイルを処理"""
        try:
            # ファイル読み込み
            with open(file_path, "r", encoding="utf-8") as f:
                html_content = f.read()

            # 見出しを抽出
            headings = self.extract_headings(html_content)

            # 見出しが2つ未満の場合はスキップ
            if len(headings) < 2:
                print(f"⏭️  スキップ: {file_path.name} (見出しが少ないため)")
                self.skipped_files += 1
                return False

            # 見出しにIDを追加
            html_with_ids, updated_headings = self.add_ids_to_headings(
                html_content, headings
            )

            # 目次HTMLを生成
            toc_html = self.generate_toc_html(updated_headings)

            # 目次を挿入
            final_html = self.insert_toc(html_with_ids, toc_html)

            # ファイルに書き込み
            if not self.dry_run:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(final_html)
                print(
                    f"✅ 処理完了: {file_path.name} ({len(updated_headings)}個の見出し)"
                )
            else:
                print(
                    f"🔍 [DRY RUN] 処理対象: {file_path.name} ({len(updated_headings)}個の見出し)"
                )

            self.processed_files += 1
            return True

        except Exception as e:  # noqa: BLE001  想定外の例外も報告して続行する
            print(f"❌ エラー: {file_path.name} - {e!s}")
            self.error_files.append(str(file_path))
            return False

    def process_directory(self, root_dir: Path):
        """ディレクトリ内の全HTMLファイルを処理"""
        print(f"\n{'=' * 60}")
        print("ページ内目次自動生成スクリプト")
        print(f"{'=' * 60}\n")

        if self.dry_run:
            print("🔍 DRY RUNモード: 実際の変更は行いません\n")

        # 全HTMLファイルを検索
        html_files = []
        for category_dir in root_dir.iterdir():
            if not category_dir.is_dir():
                continue
            if category_dir.name in self.EXCLUDE_DIRS:
                continue

            for html_file in category_dir.glob("*.html"):
                if html_file.name not in self.EXCLUDE_FILES:
                    html_files.append(html_file)

        print(f"📁 処理対象: {len(html_files)}個のHTMLファイル\n")

        # 各ファイルを処理
        for html_file in sorted(html_files):
            self.process_file(html_file)

        # 結果サマリー
        print(f"\n{'=' * 60}")
        print("処理完了")
        print(f"{'=' * 60}")
        print(f"✅ 処理成功: {self.processed_files}ファイル")
        print(f"⏭️  スキップ: {self.skipped_files}ファイル")
        if self.error_files:
            print(f"❌ エラー: {len(self.error_files)}ファイル")
            for error_file in self.error_files:
                print(f"   - {error_file}")
        print(f"{'=' * 60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="全HTMLファイルにページ内目次を自動追加"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="実際の変更を行わずにプレビューのみ表示"
    )
    parser.add_argument(
        "--dir",
        type=str,
        default="/home/suzuki100603/aws_sap",
        help="処理対象のルートディレクトリ（デフォルト: /home/suzuki100603/aws_sap）",
    )

    args = parser.parse_args()

    root_dir = Path(args.dir)
    if not root_dir.exists():
        print(f"❌ エラー: ディレクトリが見つかりません: {root_dir}")
        return

    generator = TOCGenerator(dry_run=args.dry_run)
    generator.process_directory(root_dir)


if __name__ == "__main__":
    main()
