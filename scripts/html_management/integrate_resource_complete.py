#!/usr/bin/env python3
"""
完全統合スクリプト - AWS SAP学習リソースの自動統合ワークフロー

新規HTMLファイルを統合し、ブレッドクラムと左サイドバーTOCを自動追加する
統合スクリプト（integrate_new_html.py + add_breadcrumbs.py + add_sidebar_toc.py）
"""

import subprocess
import sys
from pathlib import Path
import argparse


class IntegrationOrchestrator:
    """統合ワークフローのオーケストレーター"""

    def __init__(self, source_dir: str = "new_html", dry_run: bool = False, verbose: bool = False, skip_validation: bool = False):
        self.source_dir = source_dir
        self.dry_run = dry_run
        self.verbose = verbose
        self.skip_validation = skip_validation
        self.repo_root = Path(__file__).parent.parent.parent
        self.scripts_dir = self.repo_root / "scripts" / "html_management"

    def validate_environment(self) -> bool:
        """必要なスクリプトの存在を確認"""
        required_scripts = [
            "integrate_new_html.py",
            "add_breadcrumbs.py",
            "add_sidebar_toc.py",
            "add_home_button.py",
            "add_prev_next_nav.py"
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

    def get_source_filenames(self):
        """統合前にソースディレクトリのHTMLファイル名を収集"""
        source_path = self.repo_root / self.source_dir
        if not source_path.exists():
            return []
        return [f.name for f in source_path.glob('*.html') if f.is_file()]

    def find_integrated_files(self, original_names):
        """git statusから統合後のファイルパスを特定（untracked HTMLのうち元ファイル名と一致するもの）"""
        if not original_names:
            return []
        try:
            result = subprocess.run(
                ['git', 'status', '--short'],
                capture_output=True, text=True, check=True,
                cwd=str(self.repo_root)
            )
            integrated = []
            for line in result.stdout.strip().split('\n'):
                if not line.startswith('??'):
                    continue
                path = line[3:].strip().strip('"')
                if path.endswith('.html') and any(path.endswith('/' + name) or path == name for name in original_names):
                    integrated.append(path)
            return integrated
        except subprocess.CalledProcessError:
            return []

    def run_w3c_validation(self, files):
        """指定ファイルのW3C検証を実行。戻り値: True=全通過 / False=エラーあり"""
        validate_script = self.repo_root / "scripts" / "ci" / "validate_html_w3c.py"
        if not validate_script.exists():
            print("⚠️  W3C検証スクリプトが見つかりません。スキップします。")
            return True

        cmd = [sys.executable, str(validate_script), '--files'] + files
        result = subprocess.run(cmd, cwd=str(self.repo_root))
        return result.returncode == 0

    def stage_files(self, files):
        """ファイルをgit stageに追加。戻り値: True=成功 / False=失敗"""
        try:
            subprocess.run(['git', 'add'] + files, check=True, cwd=str(self.repo_root))
            return True
        except subprocess.CalledProcessError:
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
   - 🔴🟡🔵 priority フィールドを適切に設定:
     high = SAP試験頻出 / medium = 標準(デフォルト) / low = 補助的
   - section.count と category.count をインクリメント
   - 詳細: .claude/skills/integrate/references/data_structure_guide.md

2. 🔍 index.js を更新
   - searchData 配列に新しいエントリを追加
   - タイトルとファイルパスが完全一致することを確認
   - 詳細: .claude/skills/integrate/references/data_structure_guide.md

3. 🧪 ローカルテスト
   - python3 server.py を実行
   - http://localhost:8080/ で確認
   - ナビゲーション、検索、ファイル読み込みを検証

4. 📤 Git操作 ※HTMLファイルは自動でgit stageに追加済み
   - git add data.js index.js  （data.js・index.js を手動でステージング）
   - git commit -m "feat: 新規リソース統合"
   - git push origin gh-pages

5. 🌐 デプロイメント確認
   - 1〜2分待つ
   - https://ssuzuki1063.github.io/aws_sap_studying/ にアクセス
   - リソースが表示され、正しく機能することを確認

詳細なチェックリスト: .claude/skills/integrate/references/validation_checklist.md
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

        # 統合前: ソースファイル名を収集（後でgit statusと照合するため）
        original_names = self.get_source_filenames()
        if not self.dry_run and original_names:
            print(f"📁 統合対象: {', '.join(original_names)}")

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

        # ステップ4: 左サイドバーTOC追加
        print("\n📋 ステップ4: 左サイドバー目次を追加中...")
        args = ["--dir", str(self.repo_root)]
        if not self.run_script("add_sidebar_toc.py", args):
            print("⚠️  左サイドバー目次の追加に失敗しました（続行します）")

        # ステップ5: リソース集に戻るボタン追加
        print("\n📋 ステップ5: リソース集に戻るボタンを追加中...")
        if not self.run_script("add_home_button.py"):
            print("⚠️  リソース集に戻るボタンの追加に失敗しました（続行します）")

        # ステップ6: ページ下部ナビゲーション追加
        print("\n📋 ステップ6: ページ下部ナビゲーションを追加中...")
        args = ["--bottom-nav-only"]
        if not self.run_script("add_prev_next_nav.py", args):
            print("⚠️  ページ下部ナビゲーションの追加に失敗しました（続行します）")

        # 統合後: git statusから対象ファイルを特定
        integrated_files = self.find_integrated_files(original_names)

        # ステップ7: W3C HTMLバリデーション
        if self.skip_validation:
            print("\n⚠️  ステップ7: W3C検証をスキップしました（--skip-validationフラグ）")
        elif not integrated_files:
            print("\n⚠️  ステップ7: 検証対象の新規HTMLファイルが見つかりません。W3Cバリデーションをスキップします。")
        else:
            print(f"\n📋 ステップ7: W3C HTMLバリデーション中... ({len(integrated_files)}件)")
            validation_passed = self.run_w3c_validation(integrated_files)

            if not validation_passed:
                print("\n" + "="*80)
                print("❌ W3C検証に失敗しました。ステージングを中断します。")
                print("="*80)
                print("\n💡 エラーを修正後、以下のコマンドで再検証できます:")
                print(f"   python3 scripts/ci/validate_html_w3c.py --files {' '.join(integrated_files)}")
                print("\n💡 修正後に手動でステージングしてください:")
                print(f"   git add {' '.join(integrated_files)}")
                print("="*80 + "\n")
                return False

            # ステップ8: 検証通過ファイルをgit stageに追加
            print(f"\n📋 ステップ8: 統合ファイルをgit stageに追加中...")
            if self.stage_files(integrated_files):
                print(f"✅ {len(integrated_files)}件のファイルをgit stageに追加しました:")
                for f in integrated_files:
                    print(f"   • {f}")
            else:
                print("⚠️  git stageへの追加に失敗しました。手動で実行してください:")
                print(f"   git add {' '.join(integrated_files)}")

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

    parser.add_argument(
        "--skip-validation",
        action="store_true",
        help="W3C検証をスキップ（オフライン環境や高速テスト用）"
    )

    args = parser.parse_args()

    orchestrator = IntegrationOrchestrator(
        source_dir=args.source,
        dry_run=args.dry_run,
        verbose=args.verbose,
        skip_validation=args.skip_validation,
    )

    success = orchestrator.run_complete_workflow()

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
