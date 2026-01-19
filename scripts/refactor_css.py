#!/usr/bin/env python3
"""
CSS リファクタリング自動化スクリプト
AWS SAP学習リソースのHTMLファイルから<style>タグとinline styleを抽出し、
外部CSSファイルに分離します。
"""

import os
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup


class CSSRefactorer:
    def __init__(self, html_path, dry_run=False):
        self.html_path = Path(html_path)
        self.dry_run = dry_run
        self.repo_root = Path("/home/meme1/aws_sap_studying")
        self.css_pages_dir = self.repo_root / "css" / "pages"

        # ページ固有CSSファイル名
        self.css_filename = self.html_path.stem + ".css"
        self.css_filepath = self.css_pages_dir / self.css_filename

        # 統計情報
        self.stats = {
            "style_tags_found": 0,
            "style_tags_removed": 0,
            "inline_styles_found": 0,
            "inline_styles_removed": 0,
            "css_lines_extracted": 0,
        }

    def extract_style_tags(self, soup):
        """<style>タグからCSSを抽出"""
        style_tags = soup.find_all('style')
        self.stats['style_tags_found'] = len(style_tags)

        css_content = []

        for style_tag in style_tags:
            css = style_tag.string
            if css:
                # サイドバー目次のCSSは除外（既に sidebar-toc.css に共通化済み）
                if 'sidebar-toc' in css or 'ページ全体のレイアウト調整' in css:
                    print(f"  ⏭️  サイドバー目次CSS検出（スキップ）")
                    continue

                # 空のメディアクエリやコメントのみの場合はスキップ
                cleaned_css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
                cleaned_css = re.sub(r'@media[^{]*\{\s*\}', '', cleaned_css)
                cleaned_css = cleaned_css.strip()

                if cleaned_css and len(cleaned_css) > 50:  # 最低限の内容がある場合のみ
                    css_content.append(css.strip())
                    self.stats['css_lines_extracted'] += len(css.split('\n'))

        return '\n\n'.join(css_content) if css_content else None

    def detect_inline_styles(self, soup):
        """inline style属性を検出"""
        elements_with_style = soup.find_all(style=True)
        self.stats['inline_styles_found'] = len(elements_with_style)

        inline_styles_info = []
        for elem in elements_with_style:
            inline_styles_info.append({
                'tag': elem.name,
                'style': elem.get('style'),
                'element': elem
            })

        return inline_styles_info

    def generate_page_css(self, extracted_css):
        """ページ固有CSSファイルを生成"""
        css_header = f"""/*
 * AWS SAP学習リソース - {self.html_path.stem} 専用CSS
 * ページ固有のレイアウト・セクション・コンポーネントスタイル
 *
 * 自動生成日: {self.__get_timestamp()}
 */

"""
        return css_header + extracted_css

    def add_css_links(self, soup, has_extracted_css=True):
        """HTMLに新規CSSファイルのlink要素を追加"""
        head = soup.find('head')
        if not head:
            print("  ⚠️  <head>タグが見つかりません")
            return False

        # 既存のCSS linkを探す
        existing_links = head.find_all('link', rel='stylesheet')

        # 既に共通CSSが追加されているかチェック
        has_common_css = any('variables.css' in link.get('href', '') for link in existing_links)

        if has_common_css and not has_extracted_css:
            print(f"  ℹ️  共通CSSは既に追加済み（ページ固有CSSなし）")
            return True

        # ページ固有CSSが既にあるかチェック（has_extracted_cssがTrueの場合のみ）
        page_css_link = f"/aws_sap_studying/css/pages/{self.css_filename}"
        if has_extracted_css:
            for link in existing_links:
                if link.get('href') == page_css_link:
                    print(f"  ℹ️  ページ固有CSSは既に追加済み")
                    return True

        # 新規link要素を作成（common.css の後に挿入）
        last_common_css = None
        for link in existing_links:
            href = link.get('href', '')
            if 'responsive.css' in href or 'common.css' in href or 'layout.css' in href:
                last_common_css = link

        if last_common_css:
            # ページ固有CSSコメント
            comment = soup.new_string("\n  <!-- ページ固有CSSファイル -->\n  ")
            last_common_css.insert_after(comment)

            # page-base.css
            page_base_link = soup.new_tag('link', href="/aws_sap_studying/css/page-base.css", rel="stylesheet")
            comment.insert_after(page_base_link)

            # sidebar-toc.css（サイドバーがある場合）
            sidebar_toc_link = soup.new_tag('link', href="/aws_sap_studying/css/components/sidebar-toc.css", rel="stylesheet")
            page_base_link.insert_after(soup.new_string("\n  "))
            page_base_link.insert_after(sidebar_toc_link)

            # ページ固有CSS（抽出したCSSがある場合のみ）
            if has_extracted_css:
                page_css_link_tag = soup.new_tag('link', href=page_css_link, rel="stylesheet")
                sidebar_toc_link.insert_after(soup.new_string("\n  "))
                sidebar_toc_link.insert_after(page_css_link_tag)

            return True
        else:
            # 共通CSSのlinkがない場合は、<head>の最後に全てのCSSリンクを追加
            print("  ℹ️  共通CSSなし → すべてのCSSリンクを追加します")

            # title要素を探す
            title = head.find('title')
            insert_point = title if title else head

            # 共通CSSコメント
            common_comment = soup.new_string("\n  <!-- 共通CSSファイル（データ駆動アーキテクチャ） -->\n  ")
            insert_point.insert_after(common_comment)

            # 共通CSS群
            variables_link = soup.new_tag('link', href="/aws_sap_studying/css/variables.css", rel="stylesheet")
            common_comment.insert_after(variables_link)

            common_link = soup.new_tag('link', href="/aws_sap_studying/css/common.css", rel="stylesheet")
            variables_link.insert_after(soup.new_string("\n  "))
            variables_link.insert_after(common_link)

            layout_link = soup.new_tag('link', href="/aws_sap_studying/css/layout.css", rel="stylesheet")
            common_link.insert_after(soup.new_string("\n  "))
            common_link.insert_after(layout_link)

            responsive_link = soup.new_tag('link', href="/aws_sap_studying/css/responsive.css", rel="stylesheet")
            layout_link.insert_after(soup.new_string("\n  "))
            layout_link.insert_after(responsive_link)

            # ページ固有CSSコメント
            page_comment = soup.new_string("\n  <!-- ページ固有CSSファイル -->\n  ")
            responsive_link.insert_after(page_comment)

            # page-base.css
            page_base_link = soup.new_tag('link', href="/aws_sap_studying/css/page-base.css", rel="stylesheet")
            page_comment.insert_after(page_base_link)

            # sidebar-toc.css
            sidebar_toc_link = soup.new_tag('link', href="/aws_sap_studying/css/components/sidebar-toc.css", rel="stylesheet")
            page_base_link.insert_after(soup.new_string("\n  "))
            page_base_link.insert_after(sidebar_toc_link)

            # ページ固有CSS（抽出したCSSがある場合のみ）
            if has_extracted_css:
                page_css_link_tag = soup.new_tag('link', href=page_css_link, rel="stylesheet")
                sidebar_toc_link.insert_after(soup.new_string("\n  "))
                sidebar_toc_link.insert_after(page_css_link_tag)

            return True

    def remove_style_tags(self, soup):
        """<style>タグを削除"""
        style_tags = soup.find_all('style')
        removed_count = 0

        for style_tag in style_tags:
            style_tag.decompose()
            removed_count += 1

        self.stats['style_tags_removed'] = removed_count
        return removed_count

    def remove_inline_styles(self, soup, inline_styles_info):
        """inline style属性を削除（警告のみ、classは手動対応）"""
        # inline styleは複雑なので、この段階では警告のみ
        if inline_styles_info:
            print(f"  ⚠️  inline style属性が{len(inline_styles_info)}件見つかりました（手動対応が必要）")
            for i, info in enumerate(inline_styles_info[:3]):  # 最初の3件のみ表示
                print(f"     - <{info['tag']}> style=\"{info['style'][:60]}...\"")

        return 0

    def refactor(self):
        """リファクタリング実行"""
        print(f"\n{'='*60}")
        print(f"📄 処理中: {self.html_path.name}")
        print(f"{'='*60}")

        # HTMLファイル読み込み
        try:
            with open(self.html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
        except Exception as e:
            print(f"  ❌ ファイル読み込みエラー: {e}")
            return False

        soup = BeautifulSoup(html_content, 'html.parser')

        # 1. <style>タグからCSSを抽出
        print("\n[1] <style>タグからCSS抽出中...")
        extracted_css = self.extract_style_tags(soup)

        if extracted_css:
            print(f"  ✅ {self.stats['css_lines_extracted']}行のCSSを抽出")
        else:
            print(f"  ℹ️  抽出可能なCSSなし（サイドバー目次CSSのみ、または空）")

        # 2. inline style検出
        print("\n[2] inline style属性を検出中...")
        inline_styles_info = self.detect_inline_styles(soup)

        # 3. ページ固有CSSファイル生成
        if extracted_css and not self.dry_run:
            print(f"\n[3] ページ固有CSSファイル生成中...")
            self.css_pages_dir.mkdir(parents=True, exist_ok=True)

            page_css_content = self.generate_page_css(extracted_css)

            with open(self.css_filepath, 'w', encoding='utf-8') as f:
                f.write(page_css_content)

            print(f"  ✅ 生成完了: {self.css_filepath.relative_to(self.repo_root)}")

        # 4. HTMLにCSS linkを追加
        print(f"\n[4] HTMLにlink要素を追加中...")
        # extracted_cssの有無に関わらず、共通CSSリンクは追加する
        if self.add_css_links(soup, has_extracted_css=extracted_css is not None):
            print(f"  ✅ link要素を追加")

        # 5. <style>タグを削除
        print(f"\n[5] <style>タグを削除中...")
        removed = self.remove_style_tags(soup)
        if removed > 0:
            print(f"  ✅ {removed}個の<style>タグを削除")

        # 6. inline styleの警告
        print(f"\n[6] inline style属性をチェック中...")
        self.remove_inline_styles(soup, inline_styles_info)

        # 7. HTML書き込み
        if not self.dry_run:
            print(f"\n[7] HTMLファイルを更新中...")
            with open(self.html_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            print(f"  ✅ 更新完了")
        else:
            print(f"\n[7] DRY-RUN モード: ファイル更新をスキップ")

        # 統計表示
        self.print_stats()

        return True

    def print_stats(self):
        """統計情報を表示"""
        print(f"\n{'─'*60}")
        print(f"📊 統計情報")
        print(f"{'─'*60}")
        print(f"  <style>タグ検出:     {self.stats['style_tags_found']}個")
        print(f"  <style>タグ削除:     {self.stats['style_tags_removed']}個")
        print(f"  抽出CSS行数:         {self.stats['css_lines_extracted']}行")
        print(f"  inline style検出:    {self.stats['inline_styles_found']}個")
        print(f"{'─'*60}\n")

    @staticmethod
    def __get_timestamp():
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main():
    import argparse

    parser = argparse.ArgumentParser(description='HTMLファイルのCSS自動リファクタリング')
    parser.add_argument('html_file', help='対象HTMLファイルのパス')
    parser.add_argument('--dry-run', action='store_true', help='実際の変更を行わず、シミュレーションのみ')

    args = parser.parse_args()

    refactorer = CSSRefactorer(args.html_file, dry_run=args.dry_run)
    success = refactorer.refactor()

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
