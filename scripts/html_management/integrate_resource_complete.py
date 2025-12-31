#!/usr/bin/env python3
"""
完全統合スクリプト - AWS SAP学習リソースの自動統合ワークフロー

新規HTMLファイルを統合し、ブレッドクラムとTOCを自動追加する
統合スクリプト（integrate_new_html.py + add_breadcrumbs.py + add_toc.py）
"""

import subprocess
import sys
from pathlib import Path
import argparse


class IntegrationOrchestrator:
    """統合ワークフローのオーケストレーター"""

    def __init__(self, source_dir: str = "new_html", dry_run: bool = False, verbose: bool = False):
        self.source_dir = source_dir
        self.dry_run = dry_run
        self.verbose = verbose
        self.repo_root = Path(__file__).parent.parent.parent
        self.scripts_dir = self.repo_root / "scripts" / "html_management"

    def validate_environment(self) -> bool:
        """必要なスクリプトの存在を確認"""
        required_scripts = [
            "integrate_new_html.py",
            "add_breadcrumbs.py",
            "add_toc.py"
        ]

        for script in required_scripts:
            script_path = self.scripts_dir / script
            if not script_path.exists():
                print(f"❌ エラー: 必須スクリプトが見つかりません: {script}")
                return False

        return True

    def run_script(self, script_name: str, args: list = None) -> bool:
        """スクリプトを実行してエラーハンドリング"""
        script_path = self.scripts_dir / script_name
        cmd = [sys.executable, str(script_path)]

        if args:
            cmd.extend(args)

        if self.dry_run and script_name == "integrate_new_html.py":
            cmd.append("--dry-run")

        try:
            if self.verbose:
                print(f"\n🔧 実行中: {' '.join(cmd)}\n")

            result = subprocess.run(cmd, check=True, capture_output=not self.verbose)

            if not self.verbose and result.stdout:
                print(result.stdout.decode('utf-8'))

            return True

        except subprocess.CalledProcessError as e:
            print(f"❌ エラー: {script_name} の実行に失敗しました")
            if e.stderr:
                print(e.stderr.decode('utf-8'))
            return False

    def display_manual_steps_reminder(self):
        """手動ステップのリマインダーを表示"""
        print("\n" + "="*80)
        print("⚠️  重要: 自動化後の手動ステップ")
        print("="*80)
        print("""
次のステップを実行してください:

1. 📝 data.js を更新
   - 適切なカテゴリとセクションを見つける
   - section.resources 配列にリソースオブジェクトを追加
   - section.count と category.count をインクリメント
   - 詳細: .claude/skills/aws-sap-dev/references/data_structure_guide.md

2. 🔍 index.js を更新
   - searchData 配列に新しいエントリを追加
   - タイトルとファイルパスが完全一致することを確認
   - 詳細: .claude/skills/aws-sap-dev/references/data_structure_guide.md

3. ✅ W3C検証
   - https://validator.w3.org/ にアクセス
   - すべての変更されたHTMLファイルをアップロード
   - すべてのエラーと警告を修正

4. 🧪 ローカルテスト
   - python3 server.py を実行
   - http://localhost:8080/ で確認
   - ナビゲーション、検索、ファイル読み込みを検証

5. 📤 Git操作
   - git add .
   - git commit -m "feat: 新規リソース統合"
   - git push origin gh-pages

6. 🌐 デプロイメント確認
   - 1〜2分待つ
   - https://ssuzuki1063.github.io/aws_sap_studying/ にアクセス
   - リソースが表示され、正しく機能することを確認

詳細なチェックリスト: .claude/skills/aws-sap-dev/references/validation_checklist.md
        """)
        print("="*80 + "\n")

    def run_complete_workflow(self) -> bool:
        """完全な統合ワークフローを実行"""
        print("\n🤖 AWS SAP 学習リソース完全統合ワークフロー")
        print("="*80)

        if self.dry_run:
            print("⚠️  ドライランモード: integrate_new_html.pyのみプレビュー\n")

        # ステップ1: 環境検証
        print("\n📋 ステップ1: 環境検証中...")
        if not self.validate_environment():
            return False
        print("✅ すべての必須スクリプトが見つかりました")

        # ステップ2: HTMLファイル統合
        print("\n📋 ステップ2: HTMLファイルを統合中...")
        args = ["--source", self.source_dir]
        if not self.run_script("integrate_new_html.py", args):
            print("❌ HTMLファイル統合に失敗しました")
            return False

        if self.dry_run:
            print("\n💡 ドライランが完了しました。--dry-runフラグなしで再実行してください。")
            return True

        # ステップ3: ブレッドクラム追加
        print("\n📋 ステップ3: ブレッドクラムナビゲーションを追加中...")
        if not self.run_script("add_breadcrumbs.py"):
            print("⚠️  ブレッドクラムの追加に失敗しました（続行します）")

        # ステップ4: TOC追加
        print("\n📋 ステップ4: ページ内目次を追加中...")
        args = ["--dir", str(self.repo_root)]
        if not self.run_script("add_toc.py", args):
            print("⚠️  目次の追加に失敗しました（続行します）")

        # 完了とリマインダー
        print("\n✅ 自動化ステップが完了しました！")
        self.display_manual_steps_reminder()

        return True


def main():
    parser = argparse.ArgumentParser(
        description="AWS SAP学習リソースの完全統合ワークフロー",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # プレビュー（ドライラン）
  python3 integrate_resource_complete.py --dry-run

  # 完全統合を実行
  python3 integrate_resource_complete.py

  # カスタムソースディレクトリを指定
  python3 integrate_resource_complete.py --source custom_html/

  # 詳細出力
  python3 integrate_resource_complete.py --verbose
        """
    )

    parser.add_argument(
        "--source", "-s",
        default="new_html",
        help="統合元のディレクトリ（デフォルト: new_html）"
    )

    parser.add_argument(
        "--dry-run", "-d",
        action="store_true",
        help="ドライラン: integrate_new_html.pyのみプレビュー"
    )

    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="詳細出力モード"
    )

    args = parser.parse_args()

    orchestrator = IntegrationOrchestrator(
        source_dir=args.source,
        dry_run=args.dry_run,
        verbose=args.verbose
    )

    success = orchestrator.run_complete_workflow()

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
