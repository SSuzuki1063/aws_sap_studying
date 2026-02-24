#!/usr/bin/env python3
"""
CSS Quality Checker for AWS SAP Study Resources

CSSファイルの品質問題を検出します:
- !important の使用（@media print / @media prefers-reduced-motion を除く）
- IDセレクタ (#id) の使用
- 4段以上のセレクタネスト（警告）
- Layer 1-5 でのグローバルタグセレクタ単独使用 (h2 {}, a {} 等)
- css/page-base.css 以外での body {} 宣言

Usage:
    python3 scripts/ci/check_css_quality.py               # 全 css/ をチェック
    python3 scripts/ci/check_css_quality.py --pr-mode     # exit 1 if violations
    python3 scripts/ci/check_css_quality.py --file css/pages/foo.css
    python3 scripts/ci/check_css_quality.py --output violations.txt

Exit codes:
    0: No violations (or only warnings)
    1: Violations found (--pr-mode時)
"""

import re
import sys
import os
from pathlib import Path
from typing import List, Tuple


class Colors:
    """ターミナル出力用のカラーコード"""
    GREEN  = '\033[92m'
    RED    = '\033[91m'
    YELLOW = '\033[93m'
    BLUE   = '\033[94m'
    BOLD   = '\033[1m'
    END    = '\033[0m'


# ========================================================================
# 設定: グローバルHTMLタグセレクタの許可リスト
# ========================================================================

# 以下のファイルでは body {} が許可される
# NOTE: css/pages/*.css も page固有のbodyスタイルを許容（Phase 4 課題）
BODY_ALLOWED_FILES = {
    'page-base.css',
    'layout.css',       # body の基本設定（フォント・背景色）
    'responsive.css',   # @media 内の body 調整
    'sidebar-toc.css',  # サイドバー幅分の body padding-left を制御（アーキテクチャ要件）
}

# 以下のファイルでは !important が特定用途で許可される
# （@media print/prefers-reduced-motion 以外の正当な例外）
IMPORTANT_EXEMPT_FILES = {
    'mindmap.css',  # .mm-filtered { display: none !important } — JS フィルタリング制御
}

# css/pages/ ディレクトリのファイルは body 宣言を許容（Phase 4 以降で段階移行）
PAGES_DIR_PATTERN = re.compile(r'[/\\]pages[/\\]')

# 以下のファイルでは h1-h6 等のグローバルタグが許可される (base/layout 層)
GLOBAL_TAG_ALLOWED_FILES = {
    'page-base.css',
    'layout.css',
    'responsive.css',  # @media 内でのレスポンシブ調整は許可
    'common.css',      # アクセシビリティ目的の a:focus, button:focus は許可
}

# グローバルタグセレクタのパターン（単独使用のみ禁止）
GLOBAL_TAG_PATTERN = re.compile(
    r'^(h[1-6]|body|html|ul|ol|li|table|tr|td|th|form|input|select|textarea|p)\s*[{,]',
    re.MULTILINE
)

# @media ブロックの開始パターン
MEDIA_QUERY_PATTERN = re.compile(r'@media\s+([^{]+)\{')

# !important パターン
IMPORTANT_PATTERN = re.compile(r'!important', re.IGNORECASE)

# IDセレクタパターン
# 除外条件: # の後が16進数文字 (0-9a-fA-F) のみで構成される → カラー値 (#fff, #a7f3d0, #rrggbbaa 等)
# IDセレクタは必ず英字 [a-zA-Z_] で始まり、ハイフンやアンダースコアも含む
# 例: #my-id{}, #header {} → IDセレクタ
# 例: #fff, #A0A0A0, #A0A0A06fe → 除外（全て16進数文字のみ）
ID_SELECTOR_PATTERN = re.compile(
    r'(?<![a-zA-Z0-9_-])'              # 前が英数字でない
    r'#'
    r'(?![0-9a-fA-F]+(?:[^a-zA-Z_-]|$))'  # 後ろが hex のみ → カラー値のため除外
    r'[a-zA-Z_][a-zA-Z0-9_-]*'         # IDセレクタ名（文字またはアンダースコアで始まる）
    r'\s*[{,\s]'                        # セレクタの終わり
)

# セレクタネスト深度検出（疑似クラスを除く子孫セレクタの深さ）
SELECTOR_DEPTH_PATTERN = re.compile(
    r'^([^{@/\n][^{@/\n]*)\s*\{',
    re.MULTILINE
)


# ========================================================================
# コア解析関数
# ========================================================================

def strip_comments(css_text: str) -> str:
    """CSS コメントを除去する"""
    return re.sub(r'/\*.*?\*/', '', css_text, flags=re.DOTALL)


def get_media_context(css_text: str, position: int) -> str:
    """指定位置が含まれる @media コンテキストを返す（なければ空文字）"""
    media_stack = []
    i = 0
    brace_depth = 0
    media_start_depths = []

    while i < min(position, len(css_text)):
        c = css_text[i]
        # @media の開始を検出
        m = MEDIA_QUERY_PATTERN.match(css_text, i)
        if m:
            media_stack.append(m.group(1).strip())
            i += len(m.group(0)) - 1  # { まで進む
            c = css_text[i]           # c を { に更新してブレース深度を正確に追跡
            media_start_depths.append(brace_depth + 1)

        if c == '{':
            brace_depth += 1
        elif c == '}':
            brace_depth -= 1
            # メディアクエリのスコープが終わった
            if media_start_depths and brace_depth < media_start_depths[-1]:
                media_stack.pop()
                media_start_depths.pop()
        i += 1

    return ' '.join(media_stack) if media_stack else ''


def count_selector_depth(selector: str) -> int:
    """セレクタの深さ（スペース区切りの子孫セレクタ数）を返す"""
    # 疑似クラス・疑似要素を削除
    clean = re.sub(r'::[a-zA-Z-]+|:[a-zA-Z-]+(\([^)]*\))?', '', selector)
    # 属性セレクタを削除
    clean = re.sub(r'\[[^\]]*\]', '[]', clean)
    # コンマで分割して各セレクタをチェック
    parts = [s.strip() for s in clean.split(',')]
    max_depth = 0
    for part in parts:
        tokens = [t for t in re.split(r'\s+|>|\+|~', part) if t.strip() and t.strip() != '[]']
        max_depth = max(max_depth, len(tokens))
    return max_depth


# ========================================================================
# ファイルチェック
# ========================================================================

class Violation:
    def __init__(self, file_path: str, line_no: int, rule: str, message: str, severity: str = 'error'):
        self.file_path = file_path
        self.line_no = line_no
        self.rule = rule
        self.message = message
        self.severity = severity  # 'error' or 'warning'


def check_css_file(file_path: Path) -> List[Violation]:
    """単一 CSS ファイルの違反を検出する"""
    violations = []
    fname = file_path.name

    try:
        text = file_path.read_text(encoding='utf-8')
    except Exception as e:
        return [Violation(str(file_path), 0, 'read-error', f'ファイル読み込みエラー: {e}')]

    clean = strip_comments(text)
    lines = text.split('\n')

    def get_line_no(pos: int) -> int:
        return text[:pos].count('\n') + 1

    # ----------------------------------------------------------------
    # Rule 1: !important の使用
    # 例外: @media print または @media prefers-reduced-motion 内
    # 例外: IMPORTANT_EXEMPT_FILES に登録されたファイル（JS制御など正当な用途）
    # ----------------------------------------------------------------
    if fname in IMPORTANT_EXEMPT_FILES:
        pass  # ファイル単位で !important を全て許可（登録済み正当ファイル）
    else:
      for m in IMPORTANT_PATTERN.finditer(clean):
        media_ctx = get_media_context(clean, m.start())
        # print と accessibility メディアクエリは除外
        if 'print' in media_ctx or 'prefers-reduced-motion' in media_ctx:
            continue
        line_no = get_line_no(m.start())
        violations.append(Violation(
            str(file_path), line_no,
            'no-important',
            f'!important の使用を禁止しています（@media print/prefers-reduced-motion 以外）',
            'error'
        ))

    # ----------------------------------------------------------------
    # Rule 2: IDセレクタ (#id) の使用
    # ----------------------------------------------------------------
    for m in ID_SELECTOR_PATTERN.finditer(clean):
        line_no = get_line_no(m.start())
        violations.append(Violation(
            str(file_path), line_no,
            'no-id-selector',
            f'IDセレクタ ({m.group().strip()}) の使用を禁止しています',
            'error'
        ))

    # ----------------------------------------------------------------
    # Rule 3: 4段以上のセレクタネスト（警告）
    # ----------------------------------------------------------------
    for m in SELECTOR_DEPTH_PATTERN.finditer(clean):
        selector = m.group(1).strip()
        if not selector or selector.startswith('@') or selector.startswith('}'):
            continue
        depth = count_selector_depth(selector)
        if depth >= 4:
            line_no = get_line_no(m.start())
            violations.append(Violation(
                str(file_path), line_no,
                'max-nesting-depth',
                f'セレクタネストが {depth} 段になっています（推奨: 3段以下）: `{selector[:60]}`',
                'warning'
            ))

    # ----------------------------------------------------------------
    # Rule 4: body {} の宣言（許可ファイル・pages/ 以外）
    # pages/ は Phase 4 までの移行期間として許容
    # components/ での body 宣言は問題（sidebar-toc.css 等）
    # ----------------------------------------------------------------
    is_pages_file = bool(PAGES_DIR_PATTERN.search(str(file_path)))
    if fname not in BODY_ALLOWED_FILES and not is_pages_file:
        body_pattern = re.compile(r'(?<![.#\w])body\s*\{')
        for m in body_pattern.finditer(clean):
            line_no = get_line_no(m.start())
            violations.append(Violation(
                str(file_path), line_no,
                'no-body-outside-layout',
                f'`body {{}}` は layout.css / page-base.css / pages/*.css 以外では禁止です',
                'error'
            ))

    # ----------------------------------------------------------------
    # Rule 5: グローバルタグセレクタ単独使用（許可ファイル以外）
    # ----------------------------------------------------------------
    if fname not in GLOBAL_TAG_ALLOWED_FILES:
        # ページ CSS (css/pages/) は .container h2 {} 等は OK
        # グローバルタグ単独 (h2 {}) のみ禁止
        standalone_tag_pattern = re.compile(
            r'^[\s}]*(h[1-6]|ul|ol|table|form)\s*\{',
            re.MULTILINE
        )
        for m in standalone_tag_pattern.finditer(clean):
            line_no = get_line_no(m.start())
            tag = m.group(1) if m.lastindex else m.group(0).strip().rstrip('{').strip()
            violations.append(Violation(
                str(file_path), line_no,
                'no-global-tag-selector',
                f'グローバルタグセレクタ `{tag} {{}}` の単独使用は禁止です（親クラスでスコープ化してください）',
                'warning'
            ))

    return violations


def check_css_directory(css_dir: Path) -> List[Violation]:
    """css/ ディレクトリ以下の全 CSS ファイルをチェックする"""
    all_violations = []
    for css_file in sorted(css_dir.rglob('*.css')):
        violations = check_css_file(css_file)
        all_violations.extend(violations)
    return all_violations


# ========================================================================
# レポート出力
# ========================================================================

def report_violations(violations: List[Violation], repo_root: Path) -> Tuple[int, int]:
    """違反をレポートして (error_count, warning_count) を返す"""
    errors = [v for v in violations if v.severity == 'error']
    warnings = [v for v in violations if v.severity == 'warning']

    if not violations:
        print(f"{Colors.GREEN}✓ CSS品質チェック: 違反なし{Colors.END}")
        return 0, 0

    # ファイル別にグループ化
    by_file: dict = {}
    for v in violations:
        rel = str(Path(v.file_path).relative_to(repo_root))
        if rel not in by_file:
            by_file[rel] = []
        by_file[rel].append(v)

    for rel_path, file_violations in sorted(by_file.items()):
        print(f"\n{Colors.BOLD}{rel_path}{Colors.END}")
        for v in sorted(file_violations, key=lambda x: x.line_no):
            icon = f"{Colors.RED}✗{Colors.END}" if v.severity == 'error' else f"{Colors.YELLOW}⚠{Colors.END}"
            print(f"  {icon} L{v.line_no:4d}  [{v.rule}] {v.message}")

    print()
    print(f"{'='*60}")
    if errors:
        print(f"{Colors.RED}{Colors.BOLD}エラー: {len(errors)} 件{Colors.END}", end='  ')
    if warnings:
        print(f"{Colors.YELLOW}警告: {len(warnings)} 件{Colors.END}", end='')
    print()

    return len(errors), len(warnings)


# ========================================================================
# エントリーポイント
# ========================================================================

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='CSS品質チェッカー — !important / IDセレクタ / ネスト深度 / グローバルタグ'
    )
    parser.add_argument('--pr-mode', action='store_true',
                        help='違反があれば exit 1 を返す（CIモード）')
    parser.add_argument('--file', type=str,
                        help='単一ファイルのみチェック')
    parser.add_argument('--output', type=str,
                        help='違反一覧をファイルに出力')
    args = parser.parse_args()

    # リポジトリルートを検出
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    css_dir = repo_root / 'css'

    print(f"{Colors.BOLD}CSS品質チェック{Colors.END} — {repo_root.name}")
    print(f"{'='*60}")

    if args.file:
        target = Path(args.file) if Path(args.file).is_absolute() else repo_root / args.file
        if not target.exists():
            print(f"{Colors.RED}ファイルが見つかりません: {target}{Colors.END}")
            sys.exit(1)
        violations = check_css_file(target)
    else:
        if not css_dir.exists():
            print(f"{Colors.RED}css/ ディレクトリが見つかりません: {css_dir}{Colors.END}")
            sys.exit(1)
        violations = check_css_directory(css_dir)

    error_count, warning_count = report_violations(violations, repo_root)

    # オプション: ファイルに出力
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"CSS品質チェック ベースラインレポート\n")
            f.write(f"{'='*60}\n")
            f.write(f"エラー: {error_count} 件 / 警告: {warning_count} 件\n\n")
            for v in sorted(violations, key=lambda x: (x.file_path, x.line_no)):
                rel = str(Path(v.file_path).relative_to(repo_root))
                f.write(f"[{v.severity.upper()}] {rel}:{v.line_no} [{v.rule}] {v.message}\n")
        print(f"\n{Colors.BLUE}レポートを保存しました: {args.output}{Colors.END}")

    if args.pr_mode and error_count > 0:
        print(f"\n{Colors.RED}PR モード: {error_count} 件のエラーがあるため失敗します。{Colors.END}")
        sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()
