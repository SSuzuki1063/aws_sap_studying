#!/usr/bin/env python3
"""
固定ナビゲーションヘッダーを全HTMLファイルに一括適用するスクリプト

このスクリプトは、共有CSS（common.css）を使用して固定ナビゲーションヘッダーを
リポジトリ内の全HTMLファイルに適用します。

主な機能:
1. 共有CSSリンクの追加（variables.css, common.css, layout.css, responsive.css）
2. 固定ヘッダーHTML要素の挿入（自己紹介、学習リソース集、ナレッジベース、クイズ）
3. スクロール制御JavaScriptの追加
4. 既存ページのbodyパディング調整

固定ヘッダーリンク:
- 自己紹介 (/aws_sap_studying/profile.html)
- 学習リソース集 (/aws_sap_studying/learning-resources.html)
- ナレッジベース (/aws_sap_studying/knowledge-base.html)
- クイズ (/aws_sap_studying/quiz.html)
"""

import os
import re
from pathlib import Path
from typing import List, Tuple

# リポジトリのルートディレクトリ
REPO_ROOT = Path(__file__).parent.parent.parent

# 除外するファイル（既に実装済みまたは適用不要）
EXCLUDED_FILES = {
    'index.html',  # 既に実装済み
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

# 除外するディレクトリ
EXCLUDED_DIRS = {
    '.git',
    '.claude',
    'node_modules',
    '__pycache__',
    'new_html',
    'scripts',
    'docs',
    'css',
    'assets',
}

# コンテンツディレクトリ（学習リソースが格納されている）
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


# ========================================
# 共有CSSリンク（GitHub Pages対応パス）
# ========================================
SHARED_CSS_LINKS = '''<!-- 共通CSSファイル（データ駆動アーキテクチャ） -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>'''


# ========================================
# 固定ヘッダーのHTML（共有CSSのスタイルを使用）
# ========================================
FIXED_HEADER_HTML = '''<!-- 固定ナビゲーションヘッダー -->
<div class="fixed-nav-header">
<div class="fixed-nav-container">
<a class="fixed-nav-logo" href="/aws_sap_studying/index.html">
     📚 AWS SAP
    </a>
<nav aria-label="メインナビゲーション" class="fixed-nav-links" role="navigation">
<a href="/aws_sap_studying/profile.html">
      自己紹介
     </a>
<a href="/aws_sap_studying/learning-resources.html">
      学習リソース集
     </a>
<a href="/aws_sap_studying/knowledge-base.html">
      ナレッジベース
     </a>
<a href="/aws_sap_studying/quiz.html">
      クイズ
     </a>
</nav>
</div>
</div>
<!-- 読書進捗インジケーター -->
<div aria-label="ページ読書進捗" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="reading-progress" id="readingProgress" role="progressbar">
<div class="reading-progress-bar" id="readingProgressBar">
</div>
</div>
<!-- トップに戻るボタン -->
<button aria-label="ページトップに戻る" class="scroll-to-top" id="scrollToTop" title="トップに戻る">
   ↑
  </button>'''


# ========================================
# 固定ヘッダーのJavaScript
# ========================================
FIXED_HEADER_JS = '''
<!-- 固定ヘッダー機能のJavaScript -->
<script>
    // トップに戻るボタンの表示/非表示
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const readingProgress = document.getElementById('readingProgress');
    const readingProgressBar = document.getElementById('readingProgressBar');

    if (scrollToTopBtn && readingProgress && readingProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;

            // トップに戻るボタンの表示制御
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }

            // 読書進捗バーの表示制御と更新
            if (scrollTop > 100) {
                readingProgress.classList.add('show');
                readingProgressBar.style.width = scrollPercentage + '%';
                readingProgress.setAttribute('aria-valuenow', Math.round(scrollPercentage));
            } else {
                readingProgress.classList.remove('show');
            }
        });

        // トップに戻る機能
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
</script>'''


# ========================================
# body用のpadding-top追加CSS（インラインスタイル用）
# ========================================
BODY_PADDING_CSS = '''
        /* 固定ヘッダー用のスペース確保 */
        body {
            padding-top: 70px !important;
        }
'''


def find_html_files() -> List[Path]:
    """コンテンツディレクトリ内のHTMLファイルを検索"""
    html_files = []

    for content_dir in CONTENT_DIRS:
        dir_path = REPO_ROOT / content_dir
        if dir_path.exists():
            for html_file in dir_path.glob("*.html"):
                if html_file.name not in EXCLUDED_FILES:
                    html_files.append(html_file)

    return sorted(html_files)


def has_shared_css(content: str) -> bool:
    """共有CSSが存在するかチェック"""
    return '/aws_sap_studying/css/common.css' in content


def has_fixed_header(content: str) -> bool:
    """既に固定ヘッダーが存在するかチェック"""
    return 'class="fixed-nav-header"' in content or 'fixed-nav-header' in content


def add_shared_css(content: str) -> str:
    """共有CSSリンクを追加"""
    if has_shared_css(content):
        return content  # 既に存在する場合はスキップ

    # </title>の後に追加
    if '</title>' in content:
        content = content.replace(
            '</title>',
            f'</title>\n{SHARED_CSS_LINKS}',
            1
        )
    return content


def add_body_padding_style(content: str) -> str:
    """bodyにpadding-topを追加（インラインスタイルがある場合）"""
    # 既にpadding-topが十分に設定されているか確認
    if 'padding-top: 70px' in content or 'padding-top: 80px' in content:
        return content

    # <style>タグがあるかチェック
    if '<style>' in content and '</style>' in content:
        # 既存の<style>の最後にpadding追加
        # bodyスタイルを探して調整
        body_pattern = r'(body\s*\{[^}]*)'

        def add_padding(match):
            body_style = match.group(1)
            # 既にpadding-topがある場合は値を更新
            if 'padding-top:' in body_style:
                body_style = re.sub(r'padding-top:\s*\d+px', 'padding-top: 70px', body_style)
            elif 'padding:' in body_style:
                # padding: XXpx; がある場合、その後にpadding-topを追加
                body_style = body_style.rstrip()
                body_style += '\n            padding-top: 70px;'
            else:
                # paddingがない場合は追加
                body_style = body_style.rstrip()
                body_style += '\n            padding-top: 70px;'
            return body_style

        content = re.sub(body_pattern, add_padding, content)

    return content


def add_fixed_header_html(content: str) -> str:
    """固定ヘッダーHTMLを追加"""
    if has_fixed_header(content):
        return content  # 既に存在する場合はスキップ

    # <body>タグの直後に挿入
    pattern = r'(<body[^>]*>)'

    def insert_header(match):
        return match.group(1) + '\n' + FIXED_HEADER_HTML

    return re.sub(pattern, insert_header, content, count=1)


def add_javascript(content: str) -> str:
    """JavaScriptを</body>タグの直前に挿入"""
    if 'scrollToTopBtn' in content and 'addEventListener' in content:
        return content  # 既に存在する場合はスキップ

    # </body>の直前に挿入
    if '</body>' in content:
        content = content.replace(
            '</body>',
            f'{FIXED_HEADER_JS}\n</body>',
            1
        )
    return content


def process_html_file(file_path: Path, dry_run: bool = False) -> Tuple[bool, str]:
    """HTMLファイルを処理"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes = []

        # 共有CSSリンクを追加
        if not has_shared_css(content):
            content = add_shared_css(content)
            changes.append("共有CSS追加")

        # 固定ヘッダーHTMLを追加
        if not has_fixed_header(content):
            content = add_fixed_header_html(content)
            content = add_body_padding_style(content)
            content = add_javascript(content)
            changes.append("固定ヘッダー追加")

        if content != original_content:
            if not dry_run:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

            change_desc = ", ".join(changes)
            return True, change_desc
        else:
            return False, "変更なし（既に対応済み）"

    except Exception as e:
        return False, f"エラー: {e}"


def main():
    """メイン処理"""
    import argparse

    parser = argparse.ArgumentParser(
        description='固定ナビゲーションヘッダーを全HTMLファイルに適用',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # ドライラン（確認のみ）
  python3 add_fixed_header.py --dry-run

  # 実行
  python3 add_fixed_header.py

  # 詳細表示
  python3 add_fixed_header.py --verbose
        """
    )
    parser.add_argument('--dry-run', '-d', action='store_true',
                        help='実際にはファイルを変更せず、処理対象を表示')
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='スキップしたファイルも表示')
    args = parser.parse_args()

    print("=" * 60)
    print("固定ナビゲーションヘッダー一括適用スクリプト")
    print("（共有CSS方式）")
    print("=" * 60)
    print()

    if args.dry_run:
        print("🔍 DRY RUN モード: ファイルは変更されません\n")

    # HTMLファイルを検索
    html_files = find_html_files()
    print(f"📁 検出されたHTMLファイル: {len(html_files)}件\n")

    # 各ファイルを処理
    modified_count = 0
    skipped_count = 0
    error_count = 0

    for file_path in html_files:
        success, message = process_html_file(file_path, dry_run=args.dry_run)
        rel_path = file_path.relative_to(REPO_ROOT)

        if success:
            prefix = "[DRY RUN] " if args.dry_run else ""
            print(f"✅ {prefix}{rel_path}: {message}")
            modified_count += 1
        elif "エラー" in message:
            print(f"❌ {rel_path}: {message}")
            error_count += 1
        else:
            if args.verbose:
                print(f"⏭️  {rel_path}: {message}")
            skipped_count += 1

    # サマリー表示
    print()
    print("=" * 60)
    print("処理完了")
    print("=" * 60)
    print(f"✅ 修正対象: {modified_count}件")
    print(f"⏭️  スキップ（既に対応済み）: {skipped_count}件")
    if error_count > 0:
        print(f"❌ エラー: {error_count}件")
    print()

    if args.dry_run:
        print("📝 --dry-run フラグを外して実行すると、実際にファイルが更新されます")
    elif modified_count > 0:
        print("🎉 全ファイルへの固定ヘッダー適用が完了しました！")
        print()
        print("次のステップ:")
        print("1. ローカルでテスト: python3 server.py")
        print("2. W3C検証: python3 scripts/ci/validate_html_w3c.py --pr-mode")
        print("3. コミット＆プッシュ: git add . && git commit -m 'fix: 固定ヘッダーを追加' && git push origin gh-pages")


if __name__ == '__main__':
    main()
