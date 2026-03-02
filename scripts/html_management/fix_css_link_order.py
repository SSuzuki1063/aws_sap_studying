#!/usr/bin/env python3
"""
CSS Link Order Fixer for AWS SAP Study Resources

HTML ファイル内の CSS <link> タグを正規化された順序に並べ替えます。

目標のロード順:
  1. page-base.css       (Layer 0: Reset)
  2. variables.css       (Layer 1: Tokens)
  3. layout.css          (Layer 2: Layout)
  4. responsive.css      (Layer 3: Responsive)
  5. common.css          (Layer 4: Shared Components)
  6. components/*.css    (Layer 5: Named Components, sidebar-toc 優先)
  7. pages/*.css         (Layer 6: Page Overrides)
  8. page-bottom-nav.css (フッターナビ — 最後)

Usage:
    python3 scripts/html_management/fix_css_link_order.py --dry-run          # 変更プレビュー
    python3 scripts/html_management/fix_css_link_order.py --apply            # 全HTMLに適用
    python3 scripts/html_management/fix_css_link_order.py --dry-run --files networking/foo.html security/bar.html
    python3 scripts/html_management/fix_css_link_order.py --apply --files networking/foo.html

Exit codes:
    0: 処理完了（変更あり・なし問わず）
    1: エラー発生
"""

import sys
import re
import os
import argparse
from pathlib import Path
from typing import List, Tuple, Optional

# ========================================================================
# 設定: 正規化後の CSS ロード順
# ========================================================================

# CSS ファイルの「種別」を判定する優先度マップ
# 数値が小さいほど先に読み込む
CSS_PRIORITY_MAP = [
    (0,  re.compile(r'css/page-base\.css',          re.IGNORECASE)),
    (1,  re.compile(r'css/variables\.css',           re.IGNORECASE)),
    (2,  re.compile(r'css/layout\.css',              re.IGNORECASE)),
    (3,  re.compile(r'css/responsive\.css',          re.IGNORECASE)),
    (4,  re.compile(r'css/common\.css',              re.IGNORECASE)),
    # sidebar-toc は他コンポーネントより先（body padding を設定するため）
    (50, re.compile(r'css/components/sidebar-toc\.css', re.IGNORECASE)),
    # その他コンポーネント (page-bottom-nav を除く)
    (51, re.compile(r'css/components/(?!page-bottom-nav)[\w-]+\.css', re.IGNORECASE)),
    # ページ固有 CSS
    (60, re.compile(r'css/pages/',                   re.IGNORECASE)),
    # page-bottom-nav は最後
    (99, re.compile(r'css/components/page-bottom-nav\.css', re.IGNORECASE)),
]


class Colors:
    GREEN  = '\033[92m'
    RED    = '\033[91m'
    YELLOW = '\033[93m'
    BLUE   = '\033[94m'
    BOLD   = '\033[1m'
    END    = '\033[0m'


def get_css_priority(href: str) -> int:
    """href からロード優先度を返す。マッチしない場合は 70（pages の後・nav の前）"""
    for priority, pattern in CSS_PRIORITY_MAP:
        if pattern.search(href):
            return priority
    return 70


def extract_link_tags(html_content: str) -> List[Tuple[int, int, str]]:
    """
    HTML から css <link> タグを抽出する。
    Returns: [(start_pos, end_pos, full_tag_string), ...]
    """
    # rel="stylesheet" を持つ link タグを抽出
    pattern = re.compile(
        r'<link\b[^>]*\brel=["\']stylesheet["\'][^>]*>',
        re.IGNORECASE | re.DOTALL
    )
    results = []
    for m in pattern.finditer(html_content):
        results.append((m.start(), m.end(), m.group(0)))
    return results


def get_href_from_tag(tag: str) -> Optional[str]:
    """<link> タグから href 属性値を抽出する"""
    m = re.search(r'\bhref=["\']([^"\']+)["\']', tag, re.IGNORECASE)
    return m.group(1) if m else None


def reorder_css_links(html_content: str) -> Tuple[str, bool, str]:
    """
    HTML の CSS <link> タグを目標順序に並べ替える。
    Returns: (new_html, was_changed, diff_description)
    """
    links = extract_link_tags(html_content)
    if not links:
        return html_content, False, "CSS <link> タグなし"

    # href でフィルタ（css/ パスを含むもののみ対象）
    css_links = [(s, e, t) for s, e, t in links
                 if get_href_from_tag(t) and 'css/' in (get_href_from_tag(t) or '')]
    non_css_links = [(s, e, t) for s, e, t in links
                     if not (get_href_from_tag(t) and 'css/' in (get_href_from_tag(t) or ''))]

    if len(css_links) <= 1:
        return html_content, False, "CSS リンクが1件以下のため並べ替え不要"

    # 元の順序を記録
    original_order = [get_href_from_tag(t) for _, _, t in css_links]

    # 優先度でソート（同一優先度の場合は元の順序を維持）
    sorted_links = sorted(enumerate(css_links), key=lambda x: (get_css_priority(
        get_href_from_tag(x[1][2]) or ''
    ), x[0]))
    new_order = [get_href_from_tag(t) for _, (_, _, t) in sorted_links]

    if original_order == new_order:
        return html_content, False, "既に正規化済み"

    # 変更差分の説明
    diff_lines = []
    for i, (orig, new) in enumerate(zip(original_order, new_order)):
        if orig != new:
            diff_lines.append(f"  位置{i+1}: {orig!r} → {new!r}")
    diff_desc = '\n'.join(diff_lines[:5])  # 最大5件表示
    if len(diff_lines) > 5:
        diff_desc += f"\n  ... 他 {len(diff_lines)-5} 件"

    # HTML を再構築: 元の link タグ群を新しい順序のものに置換
    # 戦略: 最初の CSS link の位置から最後の CSS link の位置まで一括置換

    # CSS link タグ群が存在する範囲を特定
    all_start = css_links[0][0]
    all_end   = css_links[-1][1]

    # 元のブロック（CSS links の間のテキスト含む）を取得
    original_block = html_content[all_start:all_end]

    # 新しい順序でタグを並べ替え
    # 元の link タグ間のインデント・改行を保持するため、
    # 各 link の前にあった空白を再利用する

    # link タグの前の空白を収集
    tag_with_preceding_whitespace = []
    pos = all_start
    for s, e, tag in css_links:
        # この link の前にある空白（改行・インデント）
        between = html_content[pos:s]
        tag_with_preceding_whitespace.append((between, tag))
        pos = e

    # ソート後の順序で再構築
    sorted_tags = [css_links[orig_idx][2] for orig_idx, _ in sorted_links]

    new_block_parts = []
    for i, new_tag in enumerate(sorted_tags):
        whitespace = tag_with_preceding_whitespace[i][0]
        new_block_parts.append(whitespace + new_tag)

    new_block = ''.join(new_block_parts)
    new_html = html_content[:all_start] + new_block + html_content[all_end:]

    return new_html, True, diff_desc


def process_html_file(file_path: Path, dry_run: bool, repo_root: Path) -> Tuple[bool, str]:
    """
    単一 HTML ファイルを処理する。
    Returns: (was_changed, status_message)
    """
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"読み込みエラー: {e}"

    new_content, changed, diff_desc = reorder_css_links(content)

    if not changed:
        return False, f"変更なし ({diff_desc})"

    if not dry_run:
        try:
            file_path.write_text(new_content, encoding='utf-8')
        except Exception as e:
            return False, f"書き込みエラー: {e}"

    rel_path = str(file_path.relative_to(repo_root))
    mode = "[DRY-RUN]" if dry_run else "[適用済み]"
    return True, f"{mode} CSS リンク順を変更:\n{diff_desc}"


def find_html_files(repo_root: Path) -> List[Path]:
    """
    リポジトリ内の対象 HTML ファイルを返す（index.html, quiz.html 等は除外）
    """
    exclude_files = {'index.html', 'quiz.html', 'home.html', 'table-of-contents.html',
                     'bookmark.html', 'quiz-selection.html', 'concept-map.html',
                     'knowledge-base.html'}
    exclude_dirs = {'.git', '__pycache__', '.venv', 'venv', 'new_html', 'replace_html',
                    'demo_sample', 'specs', 'scripts', 'BlackBelt'}

    html_files = []
    for html_file in repo_root.rglob('*.html'):
        # 除外ディレクトリ配下は無視
        parts = set(html_file.relative_to(repo_root).parts[:-1])
        if parts & exclude_dirs:
            continue
        if html_file.name in exclude_files:
            continue
        html_files.append(html_file)

    return sorted(html_files)


def main():
    parser = argparse.ArgumentParser(
        description='CSS <link> タグ順序の正規化スクリプト'
    )
    parser.add_argument('--dry-run', action='store_true',
                        help='変更を適用せずにプレビューのみ表示')
    parser.add_argument('--apply', action='store_true',
                        help='変更を実際のファイルに適用する')
    parser.add_argument('--files', nargs='+', metavar='FILE',
                        help='処理対象ファイルを指定（省略時は全 HTML）')
    args = parser.parse_args()

    if not args.dry_run and not args.apply:
        print(f"{Colors.YELLOW}--dry-run または --apply を指定してください{Colors.END}")
        print("  --dry-run : 変更内容をプレビュー")
        print("  --apply   : 変更を適用")
        sys.exit(1)

    dry_run = args.dry_run

    # リポジトリルートを検出
    repo_root = Path(__file__).parent.parent.parent

    print(f"{Colors.BOLD}CSS リンク順正規化スクリプト{Colors.END}")
    print(f"モード: {'DRY-RUN (変更しない)' if dry_run else '適用 (変更を書き込む)'}")
    print(f"{'='*60}")

    # 対象ファイルを決定
    if args.files:
        html_files = []
        for f in args.files:
            p = Path(f) if Path(f).is_absolute() else repo_root / f
            if p.exists():
                html_files.append(p)
            else:
                print(f"{Colors.RED}ファイルが見つかりません: {p}{Colors.END}")
    else:
        html_files = find_html_files(repo_root)

    print(f"対象ファイル: {len(html_files)} 件")
    print()

    changed_count = 0
    error_count = 0

    for html_file in html_files:
        rel = str(html_file.relative_to(repo_root))
        changed, msg = process_html_file(html_file, dry_run, repo_root)
        if changed:
            changed_count += 1
            print(f"{Colors.GREEN}✓{Colors.END} {rel}")
            for line in msg.split('\n'):
                if line.strip():
                    print(f"    {line.strip()}")
        elif 'エラー' in msg:
            error_count += 1
            print(f"{Colors.RED}✗{Colors.END} {rel}: {msg}")

    print()
    print(f"{'='*60}")
    print(f"変更{'予定' if dry_run else '済み'}: {changed_count} 件 / 全 {len(html_files)} ファイル")
    if error_count:
        print(f"{Colors.RED}エラー: {error_count} 件{Colors.END}")
    if dry_run:
        print(f"\n{Colors.YELLOW}実際に適用するには --apply を使用してください{Colors.END}")


if __name__ == '__main__':
    main()
