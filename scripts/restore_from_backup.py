#!/usr/bin/env python3
"""
AWS公式ドキュメントリンクを削除するために、
バックアップファイルから元のファイルを復元するスクリプト

Usage:
    python3 scripts/restore_from_backup.py [--dry-run]
"""

import os
import shutil
import argparse
from pathlib import Path

def find_backup_files(root_dir='.'):
    """バックアップファイルを検索"""
    backup_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # 隠しディレクトリとscriptsディレクトリはスキップ
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d != 'scripts']

        for filename in filenames:
            if filename.endswith('.backup_20251229_160726.html') or \
               filename.endswith('.backup_20251229_160717.html') or \
               filename.endswith('.backup_20251229_160713.html') or \
               filename.endswith('.backup_20251229_160704.html') or \
               filename.endswith('.backup_20251229_160636.html') or \
               filename.endswith('.backup_20251229_160559.html') or \
               filename.endswith('.backup_20251229_160549.html') or \
               filename.endswith('.backup_20251229_160435.html'):
                backup_path = os.path.join(dirpath, filename)
                backup_files.append(backup_path)

    return sorted(backup_files)

def restore_from_backup(backup_path, dry_run=False):
    """バックアップファイルから元のファイルを復元"""
    # 元のファイル名を取得（.backup_YYYYMMDD_HHMMSS.htmlを削除）
    original_path = backup_path
    # すべてのバックアップパターンを試す
    for pattern in ['.backup_20251229_160726', '.backup_20251229_160717',
                    '.backup_20251229_160713', '.backup_20251229_160704',
                    '.backup_20251229_160636', '.backup_20251229_160559',
                    '.backup_20251229_160549', '.backup_20251229_160435']:
        if pattern in original_path:
            original_path = original_path.replace(pattern, '')
            break

    if dry_run:
        print(f"[DRY RUN] Would restore: {backup_path} -> {original_path}")
        return original_path
    else:
        print(f"Restoring: {backup_path} -> {original_path}")
        shutil.copy2(backup_path, original_path)
        return original_path

def remove_backup_files(backup_files, dry_run=False):
    """バックアップファイルを削除"""
    for backup_path in backup_files:
        if dry_run:
            print(f"[DRY RUN] Would remove: {backup_path}")
        else:
            print(f"Removing backup: {backup_path}")
            os.remove(backup_path)

def main():
    parser = argparse.ArgumentParser(
        description='AWS公式ドキュメントリンクを削除するために、バックアップから復元'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='実際には変更せず、何が行われるかを表示'
    )
    args = parser.parse_args()

    print("=" * 70)
    print("AWS公式ドキュメントリンク削除ツール - バックアップから復元")
    print("=" * 70)
    print()

    # カレントディレクトリをプロジェクトルートに変更
    script_dir = Path(__file__).parent.parent
    os.chdir(script_dir)

    # バックアップファイルを検索
    print("📂 バックアップファイルを検索中...")
    backup_files = find_backup_files()

    if not backup_files:
        print("⚠️  バックアップファイルが見つかりませんでした")
        return

    print(f"✅ {len(backup_files)}個のバックアップファイルが見つかりました")
    print()

    if args.dry_run:
        print("🔍 DRY RUNモード: 実際の変更は行いません")
        print()

    # バックアップから復元
    print("📋 バックアップから復元中...")
    print()
    restored_files = []
    for backup_path in backup_files:
        original_path = restore_from_backup(backup_path, dry_run=args.dry_run)
        restored_files.append(original_path)

    print()
    print(f"✅ {len(restored_files)}個のファイルを復元しました")
    print()

    # バックアップファイルを削除
    print("🗑️  バックアップファイルを削除中...")
    print()
    remove_backup_files(backup_files, dry_run=args.dry_run)

    print()
    print("=" * 70)
    if args.dry_run:
        print("✅ DRY RUN完了")
        print()
        print("実際に復元するには、--dry-runオプションなしで実行してください:")
        print("    python3 scripts/restore_from_backup.py")
    else:
        print("✅ 復元完了")
        print()
        print(f"📊 統計:")
        print(f"  - 復元されたファイル: {len(restored_files)}個")
        print(f"  - 削除されたバックアップ: {len(backup_files)}個")
        print()
        print("次のステップ:")
        print("  1. ローカルテスト: python3 server.py")
        print("  2. ブラウザで確認: http://localhost:8080/")
        print("  3. コミット: git add . && git commit -m 'feat: AWS公式ドキュメント参照リンクを削除'")
        print("  4. プッシュ: git push origin gh-pages")
    print("=" * 70)

if __name__ == '__main__':
    main()
