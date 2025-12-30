#!/usr/bin/env python3
"""
固定ナビゲーションヘッダーを全HTMLファイルに一括適用するスクリプト

このスクリプトは、index.htmlに実装された固定ナビゲーションヘッダーを
リポジトリ内の全HTMLファイルに適用します。

主な機能:
1. 固定ヘッダーHTML要素の挿入
2. 固定ヘッダー用CSSスタイルの追加
3. スクロール制御JavaScriptの追加
4. 既存ページのbodyパディング調整
"""

import os
import re
from pathlib import Path

# リポジトリのルートディレクトリ
REPO_ROOT = Path(__file__).parent.parent.parent

# 除外するファイル（既に実装済みまたは適用不要）
EXCLUDED_FILES = {
    'index.html',  # 既に実装済み
}

# 除外するディレクトリ
EXCLUDED_DIRS = {
    '.git',
    '.claude',
    'node_modules',
    '__pycache__',
}


# ========================================
# 固定ヘッダーのCSS
# ========================================
FIXED_HEADER_CSS = '''
        /* ========================================
           固定ナビゲーションヘッダー
           ======================================== */
        .fixed-nav-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(135deg, #232F3E 0%, #374151 100%);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 1002;
            display: flex;
            align-items: center;
        }

        .fixed-nav-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .fixed-nav-logo {
            font-size: 1.3em;
            font-weight: 700;
            color: #FF9900;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: color 0.3s ease;
        }

        .fixed-nav-logo:hover {
            color: #dc7600;
        }

        .fixed-nav-links {
            display: flex;
            gap: 25px;
            align-items: center;
        }

        .fixed-nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95em;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .fixed-nav-links a:hover,
        .fixed-nav-links a:focus {
            background-color: rgba(255, 153, 0, 0.2);
            color: #FF9900;
        }

        /* 読書進捗インジケーター */
        .reading-progress {
            position: fixed;
            top: 60px; /* 固定ヘッダーの下に配置 */
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #909296; /* WCAG 2.1適合: 3.12:1 */
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .reading-progress.show {
            opacity: 1;
        }

        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #FF9900 0%, #EC7211 100%);
            width: 0%;
            transition: width 0.1s ease;
        }

        /* トップに戻るボタン */
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FF9900 0%, #EC7211 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5em;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 153, 0, 0.4);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .scroll-to-top.show {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(255, 153, 0, 0.6);
        }

        .scroll-to-top:active {
            transform: translateY(-2px);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .fixed-nav-container {
                padding: 0 15px;
            }

            .fixed-nav-logo {
                font-size: 1.1em;
            }

            .fixed-nav-links {
                gap: 10px;
            }

            .fixed-nav-links a {
                font-size: 0.85em;
                padding: 6px 12px;
            }

            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 1.3em;
            }
        }
'''


# ========================================
# 固定ヘッダーのHTML
# ========================================
FIXED_HEADER_HTML = '''    <!-- 固定ナビゲーションヘッダー -->
    <div class="fixed-nav-header">
        <div class="fixed-nav-container">
            <a href="/index.html" class="fixed-nav-logo">
                📚 AWS SAP
            </a>
            <nav class="fixed-nav-links" role="navigation" aria-label="メインナビゲーション">
                <a href="/learning-resources.html">学習リソース集</a>
                <a href="/knowledge-base.html">ナレッジベース</a>
                <a href="/quiz.html">クイズ</a>
            </nav>
        </div>
    </div>

    <!-- 読書進捗インジケーター -->
    <div class="reading-progress" id="readingProgress" role="progressbar" aria-label="ページ読書進捗" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="reading-progress-bar" id="readingProgressBar"></div>
    </div>

    <!-- トップに戻るボタン -->
    <button class="scroll-to-top" id="scrollToTop" aria-label="ページトップに戻る" title="トップに戻る">
        ↑
    </button>

'''


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
    </script>
'''


def find_html_files():
    """HTMLファイルを検索"""
    html_files = []
    for root, dirs, files in os.walk(REPO_ROOT):
        # 除外ディレクトリをスキップ
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

        for file in files:
            if file.endswith('.html') and file not in EXCLUDED_FILES:
                html_files.append(os.path.join(root, file))

    return sorted(html_files)


def has_fixed_header(content):
    """既に固定ヘッダーが存在するかチェック"""
    return 'class="fixed-nav-header"' in content


def insert_css(content):
    """CSSを</style>タグの直前に挿入"""
    if FIXED_HEADER_CSS.strip() in content:
        return content  # 既に存在する場合はスキップ

    # </style>の直前に挿入
    pattern = r'(\s*)(</style>)'
    replacement = r'\1' + FIXED_HEADER_CSS + r'\1\2'
    return re.sub(pattern, replacement, content, count=1)


def adjust_body_padding(content):
    """bodyのpaddingを調整して固定ヘッダー分のスペースを確保"""
    # 既にpadding-topが設定されているか確認
    body_style_pattern = r'body\s*\{[^}]*\}'

    def add_padding(match):
        body_style = match.group(0)
        # 既にpadding-topが存在するか確認
        if 'padding-top:' in body_style or 'padding: ' in body_style:
            # 既存のpaddingを80pxに更新
            body_style = re.sub(r'padding-top:\s*\d+px;', 'padding-top: 80px;', body_style)
            # padding: 20px; のような形式も対応
            if 'padding:' in body_style and 'padding-top:' not in body_style:
                body_style = re.sub(r'padding:\s*\d+px;', 'padding: 20px;\\n            padding-top: 80px; /* 固定ヘッダー分のスペース確保 */', body_style)
        else:
            # padding-topを追加
            body_style = body_style.rstrip('}')
            body_style += '\n            padding-top: 80px; /* 固定ヘッダー分のスペース確保 */\n        }'
        return body_style

    return re.sub(body_style_pattern, add_padding, content, count=1)


def insert_html(content):
    """HTMLを<body>タグの直後に挿入"""
    if 'class="fixed-nav-header"' in content:
        return content  # 既に存在する場合はスキップ

    # <body>または<body ...>の直後に挿入
    pattern = r'(<body[^>]*>)'
    replacement = r'\1\n' + FIXED_HEADER_HTML
    return re.sub(pattern, replacement, content, count=1)


def insert_javascript(content):
    """JavaScriptを</body>タグの直前に挿入"""
    if 'scrollToTopBtn' in content:
        return content  # 既に存在する場合はスキップ

    # </body>の直前に挿入
    pattern = r'(\s*)(</body>)'
    replacement = FIXED_HEADER_JS + r'\1\2'
    return re.sub(pattern, replacement, content, count=1)


def process_html_file(file_path, dry_run=False):
    """HTMLファイルを処理"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 既に固定ヘッダーが存在する場合はスキップ
        if has_fixed_header(content):
            print(f"⏭️  スキップ（既に実装済み）: {os.path.relpath(file_path, REPO_ROOT)}")
            return False

        # CSSを挿入
        content = insert_css(content)

        # bodyのpaddingを調整
        content = adjust_body_padding(content)

        # HTMLを挿入
        content = insert_html(content)

        # JavaScriptを挿入
        content = insert_javascript(content)

        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 完了: {os.path.relpath(file_path, REPO_ROOT)}")
        else:
            print(f"🔍 処理対象: {os.path.relpath(file_path, REPO_ROOT)}")

        return True

    except Exception as e:
        print(f"❌ エラー: {os.path.relpath(file_path, REPO_ROOT)} - {e}")
        return False


def main():
    """メイン処理"""
    import argparse

    parser = argparse.ArgumentParser(description='固定ナビゲーションヘッダーを全HTMLファイルに適用')
    parser.add_argument('--dry-run', action='store_true', help='実際にはファイルを変更せず、処理対象を表示')
    args = parser.parse_args()

    print("=" * 60)
    print("固定ナビゲーションヘッダー一括適用スクリプト")
    print("=" * 60)
    print()

    if args.dry_run:
        print("🔍 DRY RUN モード: ファイルは変更されません\n")

    # HTMLファイルを検索
    html_files = find_html_files()
    print(f"📁 検出されたHTMLファイル: {len(html_files)}件\n")

    # 各ファイルを処理
    processed = 0
    skipped = 0
    errors = 0

    for file_path in html_files:
        result = process_html_file(file_path, dry_run=args.dry_run)
        if result:
            processed += 1
        elif result is False:
            errors += 1
        else:
            skipped += 1

    # サマリー表示
    print()
    print("=" * 60)
    print("処理完了")
    print("=" * 60)
    print(f"✅ 処理済み: {processed}件")
    print(f"⏭️  スキップ: {len(html_files) - processed}件")
    if errors > 0:
        print(f"❌ エラー: {errors}件")
    print()

    if args.dry_run:
        print("📝 --dry-run フラグを外して実行すると、実際にファイルが更新されます")
    else:
        print("🎉 全ファイルへの固定ヘッダー適用が完了しました！")
        print()
        print("次のステップ:")
        print("1. ローカルでテスト: python3 server.py")
        print("2. W3C検証: https://validator.w3.org/")
        print("3. コミット＆プッシュ: git add . && git commit -m 'feat: 全ページに固定ナビゲーションヘッダーを適用'")


if __name__ == '__main__':
    main()
