#!/usr/bin/env python3
"""
HTMLファイル一括変換フレームワーク

プロジェクト全体のHTMLリソースファイルに対して、任意の変換関数を
一括適用するための再利用可能なフレームワーク。

主な機能:
1. プロジェクト内の全HTMLリソースファイルをスキャン
2. 引数で渡された変換関数を各ファイルに適用
3. 変換後に必須要素（固定ヘッダー、サイドバーTOC、common.css、ナビリンク）を検証
4. 変換前後のサマリーレポートを出力
5. 変換前にバックアップを自動作成

使用例:
    python3 scripts/bulk_html_transform.py --list-transforms
    python3 scripts/bulk_html_transform.py --transform add_css_link --dry-run
    python3 scripts/bulk_html_transform.py --transform fix_header_links
"""

import os
import re
import shutil
import argparse
from datetime import datetime
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple


# ============================================================
# プロジェクト定数
# ============================================================

PROJECT_ROOT = Path(__file__).parent.parent

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

# 除外するディレクトリ
EXCLUDED_DIRS = {
    '.git', '.claude', 'node_modules', '__pycache__',
    'new_html', 'scripts', 'docs', 'css', 'assets', 'trouble_image',
}

# 除外するファイル（ナビゲーション・シェルページなど）
EXCLUDED_FILES = {
    'index.html', 'table-of-contents.html', 'quiz.html',
    'home.html', 'knowledge-base.html', 'profile.html',
    'learning-resources.html',
}

# バックアップディレクトリ
BACKUP_DIR = PROJECT_ROOT / 'backups'


# ============================================================
# ファイルスキャン
# ============================================================

def discover_html_files(root: Optional[Path] = None) -> List[Path]:
    """プロジェクト内の全HTMLリソースファイルを検出する。

    コンテンツディレクトリ内のHTMLファイルを走査し、
    除外対象のディレクトリ・ファイルを除いたリストを返す。

    Args:
        root: プロジェクトルートパス。省略時はPROJECT_ROOTを使用。

    Returns:
        対象HTMLファイルのPathリスト（ソート済み）。
    """
    if root is None:
        root = PROJECT_ROOT

    html_files = []
    for content_dir in CONTENT_DIRS:
        dir_path = root / content_dir
        if not dir_path.is_dir():
            continue
        for html_file in sorted(dir_path.glob('*.html')):
            if html_file.name not in EXCLUDED_FILES:
                html_files.append(html_file)

    return sorted(html_files)


# ============================================================
# バックアップ
# ============================================================

def create_backup(files: List[Path], label: str = '') -> Path:
    """変換対象ファイルのバックアップを作成する。

    タイムスタンプ付きのバックアップディレクトリを作成し、
    対象ファイルをディレクトリ構造を保持してコピーする。

    Args:
        files: バックアップ対象のファイルリスト。
        label: バックアップディレクトリに付与するラベル。

    Returns:
        作成されたバックアップディレクトリのPath。
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    suffix = f'_{label}' if label else ''
    backup_path = BACKUP_DIR / f'backup_{timestamp}{suffix}'
    backup_path.mkdir(parents=True, exist_ok=True)

    for filepath in files:
        rel_path = filepath.relative_to(PROJECT_ROOT)
        dest = backup_path / rel_path
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(filepath, dest)

    return backup_path


def restore_backup(backup_path: Path) -> int:
    """バックアップからファイルを復元する。

    Args:
        backup_path: 復元元のバックアップディレクトリ。

    Returns:
        復元されたファイル数。
    """
    restored = 0
    for root, _dirs, filenames in os.walk(backup_path):
        for filename in filenames:
            if not filename.endswith('.html'):
                continue
            src = Path(root) / filename
            rel_path = src.relative_to(backup_path)
            dest = PROJECT_ROOT / rel_path
            shutil.copy2(src, dest)
            restored += 1
    return restored


# ============================================================
# バリデーション
# ============================================================

class ValidationResult:
    """1ファイルのバリデーション結果を保持するクラス。"""

    def __init__(self, filepath: Path):
        self.filepath = filepath
        self.missing: List[str] = []

    @property
    def is_valid(self) -> bool:
        return len(self.missing) == 0

    def __str__(self) -> str:
        if self.is_valid:
            return f"  ✅ {self.filepath.relative_to(PROJECT_ROOT)}"
        items = ', '.join(self.missing)
        return f"  ❌ {self.filepath.relative_to(PROJECT_ROOT)} — 不足: {items}"


def validate_html(filepath: Path) -> ValidationResult:
    """HTMLファイルの必須要素を検証する。

    以下の要素が存在するかチェックする:
    - 固定ヘッダー (fixed-nav-header)
    - サイドバーTOCスクリプト (toggleSidebarTOC)
    - common.css リンク
    - ナビゲーションリンク（学習リソース集、ナレッジベース、クイズ）

    Args:
        filepath: 検証対象のHTMLファイルパス。

    Returns:
        ValidationResult オブジェクト。
    """
    result = ValidationResult(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception:
        result.missing.append('ファイル読み取り不可')
        return result

    # 1. 固定ヘッダー
    if 'class="fixed-nav-header"' not in content:
        result.missing.append('固定ヘッダー')

    # 2. サイドバーTOCスクリプト
    if 'toggleSidebarTOC' not in content:
        result.missing.append('サイドバーTOCスクリプト')

    # 3. common.css リンク
    if '/aws_sap_studying/css/common.css' not in content:
        result.missing.append('common.css リンク')

    # 4. ナビゲーションリンク
    nav_targets = [
        ('knowledge-base.html', 'ナレッジベースリンク'),
        ('quiz.html', 'クイズリンク'),
    ]
    for href, label in nav_targets:
        if href not in content:
            result.missing.append(label)

    return result


# ============================================================
# 変換エンジン
# ============================================================

class TransformResult:
    """一括変換の結果サマリーを保持するクラス。"""

    def __init__(self):
        self.total_files: int = 0
        self.modified_files: int = 0
        self.skipped_files: int = 0
        self.error_files: List[Tuple[Path, str]] = []
        self.validation_failures: List[ValidationResult] = []
        self.backup_path: Optional[Path] = None

    def print_summary(self) -> None:
        """変換結果のサマリーを出力する。"""
        print('\n' + '=' * 60)
        print('変換結果サマリー')
        print('=' * 60)
        print(f'  対象ファイル数:     {self.total_files}')
        print(f'  変更済みファイル数: {self.modified_files}')
        print(f'  スキップ数:         {self.skipped_files}')
        print(f'  エラー数:           {len(self.error_files)}')
        print(f'  バリデーション失敗: {len(self.validation_failures)}')

        if self.backup_path:
            print(f'  バックアップ:       {self.backup_path}')

        if self.error_files:
            print('\nエラー詳細:')
            for filepath, error_msg in self.error_files:
                rel = filepath.relative_to(PROJECT_ROOT)
                print(f'  ❌ {rel}: {error_msg}')

        if self.validation_failures:
            print('\nバリデーション失敗:')
            for vr in self.validation_failures:
                print(str(vr))

        print('=' * 60)


# 変換関数の型: (content: str, filepath: Path) -> str
TransformFunc = Callable[[str, Path], str]


def apply_transform(
    transform_fn: TransformFunc,
    *,
    dry_run: bool = False,
    skip_backup: bool = False,
    skip_validation: bool = False,
    label: str = '',
) -> TransformResult:
    """全HTMLファイルに対して変換関数を適用する。

    Args:
        transform_fn: 変換関数。(content, filepath) -> new_content。
            内容が変更されない場合は元のcontentをそのまま返すこと。
        dry_run: Trueの場合、ファイルへの書き込みを行わない。
        skip_backup: Trueの場合、バックアップを作成しない。
        skip_validation: Trueの場合、変換後のバリデーションをスキップ。
        label: バックアップディレクトリのラベル。

    Returns:
        TransformResult オブジェクト。
    """
    result = TransformResult()
    files = discover_html_files()
    result.total_files = len(files)

    if dry_run:
        print('[DRY RUN] ファイルへの書き込みは行いません')
    print(f'対象ファイル数: {result.total_files}')
    print('-' * 60)

    # バックアップ作成
    if not dry_run and not skip_backup and files:
        result.backup_path = create_backup(files, label=label)
        print(f'バックアップ作成: {result.backup_path}')
        print('-' * 60)

    # 各ファイルに変換を適用
    for filepath in files:
        rel_path = filepath.relative_to(PROJECT_ROOT)
        try:
            original = filepath.read_text(encoding='utf-8')
            transformed = transform_fn(original, filepath)

            if transformed == original:
                result.skipped_files += 1
                continue

            result.modified_files += 1
            print(f'  変更: {rel_path}')

            if not dry_run:
                filepath.write_text(transformed, encoding='utf-8')

            # バリデーション（変換後の内容をチェック）
            if not skip_validation:
                # dry-run時はメモリ上の変換後内容を検証
                if dry_run:
                    # 一時的にファイルに書き込まず内容を検証
                    vr = _validate_content(transformed, filepath)
                else:
                    vr = validate_html(filepath)
                if not vr.is_valid:
                    result.validation_failures.append(vr)

        except Exception as e:
            result.error_files.append((filepath, str(e)))
            print(f'  エラー: {rel_path}: {e}')

    result.print_summary()
    return result


def _validate_content(content: str, filepath: Path) -> ValidationResult:
    """メモリ上のHTML内容を検証する（dry-run時に使用）。"""
    result = ValidationResult(filepath)

    if 'class="fixed-nav-header"' not in content:
        result.missing.append('固定ヘッダー')
    if 'toggleSidebarTOC' not in content:
        result.missing.append('サイドバーTOCスクリプト')
    if '/aws_sap_studying/css/common.css' not in content:
        result.missing.append('common.css リンク')
    if 'knowledge-base.html' not in content:
        result.missing.append('ナレッジベースリンク')
    if 'quiz.html' not in content:
        result.missing.append('クイズリンク')

    return result


# ============================================================
# 組み込み変換関数（サンプル）
# ============================================================

def add_css_link(content: str, filepath: Path) -> str:
    """CSSリンクを追加する変換関数（サンプル）。

    page-bottom-nav.css が未追加のファイルに追加する。
    </head> の直前に挿入する。

    使用例:
        python3 scripts/bulk_html_transform.py --transform add_css_link
    """
    css_link = '<link href="/aws_sap_studying/css/components/page-bottom-nav.css" rel="stylesheet"/>'

    # 既に存在する場合はスキップ（冪等性保証）
    if 'page-bottom-nav.css' in content:
        return content

    # </head> の前に挿入
    return content.replace('</head>', css_link + '\n</head>')


def fix_header_links(content: str, filepath: Path) -> str:
    """固定ヘッダーのナビリンクを正規化する変換関数（サンプル）。

    ヘッダー内のリンクパスが /aws_sap_studying/ プレフィックスを
    持っていない場合に修正する。

    使用例:
        python3 scripts/bulk_html_transform.py --transform fix_header_links
    """
    # 既に正しいプレフィックスの場合はスキップ
    if 'fixed-nav-header' not in content:
        return content

    replacements = [
        ('href="index.html"', 'href="/aws_sap_studying/index.html"'),
        ('href="quiz.html"', 'href="/aws_sap_studying/quiz.html"'),
        ('href="knowledge-base.html"', 'href="/aws_sap_studying/knowledge-base.html"'),
        ('href="profile.html"', 'href="/aws_sap_studying/profile.html"'),
        ('href="learning-resources.html"', 'href="/aws_sap_studying/learning-resources.html"'),
    ]

    modified = content
    for old, new in replacements:
        modified = modified.replace(old, new)

    return modified


def add_viewport_meta(content: str, filepath: Path) -> str:
    """viewport メタタグを追加する変換関数（サンプル）。

    viewport メタタグが存在しないファイルに追加する。

    使用例:
        python3 scripts/bulk_html_transform.py --transform add_viewport_meta
    """
    if 'name="viewport"' in content:
        return content

    meta_tag = '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>'

    # <meta charset> の後に挿入
    charset_pattern = r'(<meta\s+charset="utf-8"\s*/>)'
    match = re.search(charset_pattern, content, re.IGNORECASE)
    if match:
        insert_pos = match.end()
        return content[:insert_pos] + '\n' + meta_tag + content[insert_pos:]

    # charset がない場合は <head> の後に挿入
    return content.replace('<head>', '<head>\n' + meta_tag, 1)


# 利用可能な変換関数のレジストリ
TRANSFORMS: Dict[str, TransformFunc] = {
    'add_css_link': add_css_link,
    'fix_header_links': fix_header_links,
    'add_viewport_meta': add_viewport_meta,
}


# ============================================================
# CLI
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description='HTMLファイル一括変換フレームワーク',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  %(prog)s --list-transforms              利用可能な変換を一覧表示
  %(prog)s --transform add_css_link --dry-run   変換をプレビュー
  %(prog)s --transform fix_header_links         変換を実行
  %(prog)s --scan                          対象ファイルを一覧表示
  %(prog)s --validate                      全ファイルのバリデーション
  %(prog)s --restore backups/backup_20260215_120000   バックアップから復元
        """,
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        '--transform', '-t',
        choices=list(TRANSFORMS.keys()),
        help='適用する変換関数の名前',
    )
    group.add_argument(
        '--list-transforms', '-l',
        action='store_true',
        help='利用可能な変換関数を一覧表示',
    )
    group.add_argument(
        '--scan', '-s',
        action='store_true',
        help='対象HTMLファイルを一覧表示',
    )
    group.add_argument(
        '--validate', '-v',
        action='store_true',
        help='全HTMLファイルのバリデーションを実行',
    )
    group.add_argument(
        '--restore', '-r',
        type=str,
        metavar='BACKUP_DIR',
        help='バックアップディレクトリからファイルを復元',
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='変更をプレビューのみ（ファイルに書き込まない）',
    )
    parser.add_argument(
        '--skip-backup',
        action='store_true',
        help='バックアップ作成をスキップ',
    )
    parser.add_argument(
        '--skip-validation',
        action='store_true',
        help='変換後のバリデーションをスキップ',
    )

    args = parser.parse_args()

    # --- 変換一覧 ---
    if args.list_transforms:
        print('利用可能な変換関数:')
        print('=' * 60)
        for name, fn in TRANSFORMS.items():
            doc = (fn.__doc__ or '').strip().split('\n')[0]
            print(f'  {name:25s} {doc}')
        print('\n使用方法: python3 scripts/bulk_html_transform.py --transform <名前>')
        return

    # --- ファイルスキャン ---
    if args.scan:
        files = discover_html_files()
        print(f'対象HTMLファイル: {len(files)} 件')
        print('=' * 60)

        # カテゴリ別に表示
        by_category: Dict[str, List[Path]] = {}
        for f in files:
            category = f.parent.name
            by_category.setdefault(category, []).append(f)

        for category in sorted(by_category):
            cat_files = by_category[category]
            print(f'\n📁 {category}/ ({len(cat_files)} 件)')
            for f in cat_files:
                print(f'    {f.name}')
        return

    # --- バリデーション ---
    if args.validate:
        files = discover_html_files()
        print(f'バリデーション対象: {len(files)} 件')
        print('=' * 60)

        valid_count = 0
        invalid_count = 0

        for filepath in files:
            vr = validate_html(filepath)
            if vr.is_valid:
                valid_count += 1
            else:
                invalid_count += 1
                print(str(vr))

        print('\n' + '-' * 60)
        print(f'  合格: {valid_count} 件')
        print(f'  不合格: {invalid_count} 件')
        print(f'  合計: {len(files)} 件')
        return

    # --- バックアップ復元 ---
    if args.restore:
        backup_path = Path(args.restore)
        if not backup_path.is_absolute():
            backup_path = PROJECT_ROOT / backup_path
        if not backup_path.is_dir():
            print(f'エラー: バックアップディレクトリが見つかりません: {backup_path}')
            return
        count = restore_backup(backup_path)
        print(f'復元完了: {count} ファイル（{backup_path} から）')
        return

    # --- 変換実行 ---
    if args.transform:
        transform_fn = TRANSFORMS[args.transform]
        print(f'変換関数: {args.transform}')
        doc = (transform_fn.__doc__ or '').strip().split('\n')[0]
        print(f'説明: {doc}')
        print('=' * 60)

        apply_transform(
            transform_fn,
            dry_run=args.dry_run,
            skip_backup=args.skip_backup,
            skip_validation=args.skip_validation,
            label=args.transform,
        )


if __name__ == '__main__':
    main()
