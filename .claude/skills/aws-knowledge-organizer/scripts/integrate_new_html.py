#!/usr/bin/env python3
"""
AWS SAP 学習リソース自動統合スクリプト

new_html/ ディレクトリ内のHTMLファイルを自動的に分析し、
適切なカテゴリディレクトリに配置してindex.htmlを更新します。
"""

import argparse
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import ClassVar


class HTMLTitleParser(HTMLParser):
    """HTMLファイルからタイトルとメタ情報を抽出するパーサー"""

    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.h1_text = ""
        self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "h1":
            self.in_h1 = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data.strip()
        elif self.in_h1 and not self.h1_text:
            self.h1_text = data.strip()


class HTMLIntegrator:
    """HTMLファイル統合の自動化クラス"""

    # カテゴリマッピング（キーワード → カテゴリディレクトリ）
    CATEGORY_MAPPINGS: ClassVar[dict[str, dict]] = {
        "security-governance": {
            "keywords": [
                "iam",
                "cognito",
                "scp",
                "organizations",
                "config",
                "control tower",
                "guardrails",
                "cmk",
                "kms",
                "暗号",
                "認証",
                "認可",
                "セキュリティ",
                "ガバナンス",
                "waf",
                "shield",
                "セキュリティ監視",
                "脅威検知",
            ],
            "section": "Organizations & ガバナンス",
            "icon": "🏢",
        },
        "compute-applications": {
            "keywords": [
                "ec2",
                "auto scaling",
                "autoscaling",
                "lambda",
                "ecs",
                "fargate",
                "alb",
                "elb",
                "sqs",
                "sns",
                "インスタンス",
                "コンピュート",
                "アプリケーション",
                "ロードバランシング",
                "スケーリング",
                "lifecycle",
                "warm pool",
                "patch manager",
                "systems manager",
            ],
            "section": "Auto Scaling & ロードバランシング",
            "icon": "⚖️",
        },
        "content-delivery-dns": {
            "keywords": [
                "cloudfront",
                "route53",
                "dns",
                "global accelerator",
                "cdn",
                "コンテンツ配信",
                "キャッシュ",
                "https",
                "ssl",
                "tls",
                "証明書",
            ],
            "section": "CloudFront & コンテンツ配信",
            "icon": "⚡",
        },
        "networking": {
            "keywords": [
                "vpc",
                "direct connect",
                "vpn",
                "transit gateway",
                "tgw",
                "privatelink",
                "eni",
                "eip",
                "nat",
                "ネットワーク",
                "接続",
            ],
            "section": "VPC & ネットワーク基礎",
            "icon": "🏗️",
        },
        "storage-database": {
            "keywords": [
                "s3",
                "ebs",
                "efs",
                "fsx",
                "rds",
                "aurora",
                "dynamodb",
                "redshift",
                "elasticache",
                "ストレージ",
                "データベース",
                "キャッシング",
            ],
            "section": "S3 & オブジェクトストレージ",
            "icon": "🪣",
        },
        "development-deployment": {
            "keywords": [
                "cloudformation",
                "cdk",
                "sam",
                "codepipeline",
                "codedeploy",
                "eventbridge",
                "api gateway",
                "appsync",
                "開発",
                "デプロイ",
                "iac",
                "ci/cd",
            ],
            "section": "IaC & CloudFormation",
            "icon": "📜",
        },
        "migration-transfer": {
            "keywords": [
                "dms",
                "migration hub",
                "sct",
                "移行",
                "マイグレーション",
                "dr",
                "ディザスタリカバリ",
                "disaster recovery",
            ],
            "section": "DMS & データ移行",
            "icon": "🔄",
        },
        "organizational-complexity": {
            "keywords": [
                "ram",
                "resource access manager",
                "service catalog",
                "stacksets",
                "cfct",
                "組織",
                "マルチアカウント",
                "共有",
            ],
            "section": "Organizations & ガバナンス",
            "icon": "🏢",
        },
        "continuous-improvement": {
            "keywords": [
                "cloudwatch",
                "cloudtrail",
                "systems manager",
                "ssm",
                "x-ray",
                "運用",
                "監視",
                "改善",
                "パッチ",
                "ハイブリッド",
            ],
            "section": "システム運用 & パッチ管理",
            "icon": "🔧",
        },
    }

    def __init__(self, source_dir: str = "new_html", dry_run: bool = False):
        self.source_dir = Path(source_dir)
        self.dry_run = dry_run
        self.repo_root = Path(__file__).parent
        self.index_html = self.repo_root / "index.html"
        self.moved_files: list[dict] = []

    def analyze_html_file(self, file_path: Path) -> dict:
        """HTMLファイルを分析してメタデータを抽出"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            parser = HTMLTitleParser()
            parser.feed(content)

            # タイトルからキーワード抽出
            title = parser.title or parser.h1_text or file_path.stem
            keywords = self._extract_keywords(title.lower() + " " + content.lower())

            return {
                "filename": file_path.name,
                "title": title,
                "h1": parser.h1_text,
                "keywords": keywords,
                "size": file_path.stat().st_size,
                "lines": len(content.splitlines()),
            }
        except Exception as e:  # noqa: BLE001  想定外の例外も報告して続行する
            print(f"⚠️  ファイル分析エラー {file_path.name}: {e}")
            return None

    def _extract_keywords(self, text: str) -> list[str]:
        """テキストからAWS関連キーワードを抽出"""
        keywords = []
        all_keywords = set()

        for category_keywords in self.CATEGORY_MAPPINGS.values():
            all_keywords.update(kw.lower() for kw in category_keywords["keywords"])

        for keyword in all_keywords:
            if keyword in text:
                keywords.append(keyword)

        return keywords

    def determine_category(self, metadata: dict) -> tuple[str, str, str]:
        """
        メタデータからカテゴリを判定
        Returns: (category_dir, section_name, icon)
        """
        keyword_scores = {}

        # 各カテゴリのスコアを計算
        for category, config in self.CATEGORY_MAPPINGS.items():
            score = 0
            for keyword in metadata["keywords"]:
                if keyword.lower() in [kw.lower() for kw in config["keywords"]]:
                    score += 1
            keyword_scores[category] = score

        # 最高スコアのカテゴリを選択
        if keyword_scores:
            best_category = max(keyword_scores, key=keyword_scores.get)
            if keyword_scores[best_category] > 0:
                config = self.CATEGORY_MAPPINGS[best_category]
                return best_category, config["section"], config["icon"]

        # デフォルト: compute-applications
        return "compute-applications", "コンテナ & アプリケーション統合", "📦"

    def move_file(self, source: Path, category: str) -> Path | None:
        """ファイルを適切なカテゴリディレクトリに移動"""
        dest_dir = self.repo_root / category
        dest_file = dest_dir / source.name

        if not self.dry_run:
            # Zone.Identifierファイルを削除
            zone_file = Path(str(source) + ":Zone.Identifier")
            if zone_file.exists():
                zone_file.unlink()
                print(f"   🗑️  Zone.Identifier削除: {zone_file.name}")

            # ディレクトリが存在しない場合は作成
            dest_dir.mkdir(parents=True, exist_ok=True)

            # ファイル移動
            shutil.move(str(source), str(dest_file))
            print(f"   ✅ 移動完了: {source.name} → {category}/")
        else:
            print(f"   [DRY RUN] 移動: {source.name} → {category}/")

        return dest_file

    def update_index_html(self, files_info: list[dict]) -> bool:
        """index.htmlを更新して新しいリソースを追加"""
        if not self.index_html.exists():
            print("❌ index.html が見つかりません")
            return False

        try:
            with open(self.index_html, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content

            # カテゴリごとにグループ化
            category_groups = {}
            for info in files_info:
                category = info["category"]
                if category not in category_groups:
                    category_groups[category] = []
                category_groups[category].append(info)

            # 各カテゴリのセクションを更新
            for category, files in category_groups.items():
                section_name = files[0]["section"]

                # セクションを見つけて更新
                pattern = rf'(<h2><span class="section-icon">[^<]+</span>{re.escape(section_name)}<span class="resource-count">)(\d+)(</span></h2>\s*<ul class="resource-list">)'

                def replace_section(match, files=files):
                    current_count = int(match.group(2))
                    new_count = current_count + len(files)

                    # 新しいリソース項目を追加
                    new_items = ""
                    for file_info in files:
                        rel_path = f"{file_info['category']}/{file_info['filename']}"
                        new_items += f'\n                        <li><a href="{rel_path}">{file_info["title"]}</a></li>'

                    return match.group(1) + str(new_count) + match.group(3) + new_items

                content = re.sub(pattern, replace_section, content)

                # 大カテゴリのリソースカウントも更新
                major_category_pattern = rf'(<div id="[^"]*{category}[^"]*" class="major-category">.*?<span class="resource-count">)(\d+)(</span>)'

                def update_major_count(match, files=files):
                    current_count = int(match.group(2))
                    new_count = current_count + len(files)
                    return match.group(1) + str(new_count) + match.group(3)

                content = re.sub(
                    major_category_pattern, update_major_count, content, flags=re.DOTALL
                )

            if content != original_content:
                if not self.dry_run:
                    with open(self.index_html, "w", encoding="utf-8") as f:
                        f.write(content)
                    print("✅ index.html 更新完了")
                else:
                    print("[DRY RUN] index.html を更新")
                return True
            else:
                print("⚠️  index.html の更新箇所が見つかりませんでした")
                return False

        except Exception as e:  # noqa: BLE001  想定外の例外も報告して続行する
            print(f"❌ index.html 更新エラー: {e}")
            return False

    def integrate(self) -> bool:
        """統合処理のメイン"""
        if not self.source_dir.exists():
            print(f"❌ ソースディレクトリが見つかりません: {self.source_dir}")
            return False

        # HTMLファイルを検索
        html_files = list(self.source_dir.glob("*.html"))

        if not html_files:
            print(f"⚠️  {self.source_dir} にHTMLファイルが見つかりません")
            return False

        print(f"\n📂 {len(html_files)}個のHTMLファイルを発見\n")
        print("=" * 80)

        files_info = []

        # 各ファイルを分析して移動
        for html_file in html_files:
            print(f"\n📄 分析中: {html_file.name}")

            metadata = self.analyze_html_file(html_file)
            if not metadata:
                continue

            print(f"   📝 タイトル: {metadata['title']}")
            print(f"   📊 サイズ: {metadata['lines']:,} 行")

            # カテゴリ判定
            category, section, icon = self.determine_category(metadata)
            print(f"   {icon} カテゴリ: {category}/{section}")

            # ファイル移動
            dest_file = self.move_file(html_file, category)

            files_info.append(
                {
                    "filename": html_file.name,
                    "title": metadata["title"],
                    "category": category,
                    "section": section,
                    "icon": icon,
                    "dest": str(dest_file) if dest_file else None,
                }
            )

        print("\n" + "=" * 80)
        print("\n📋 統合サマリー:")
        print(f"   ✅ 処理ファイル数: {len(files_info)}")

        category_counts = {}
        for info in files_info:
            cat = info["category"]
            category_counts[cat] = category_counts.get(cat, 0) + 1

        for category, count in sorted(category_counts.items()):
            print(f"   • {category}: {count}個")

        # index.html更新
        print("\n📝 index.html を更新中...")
        if self.update_index_html(files_info):
            print("✅ 統合完了！")
        else:
            print("⚠️  index.html の更新に問題がありました")

        # 空のディレクトリを削除
        if not self.dry_run and not any(self.source_dir.iterdir()):
            self.source_dir.rmdir()
            print(f"\n🗑️  空のディレクトリを削除: {self.source_dir}")

        return True


def main():
    parser = argparse.ArgumentParser(
        description="AWS SAP学習リソースの自動統合スクリプト",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # new_html/ ディレクトリのファイルを統合
  python3 integrate_new_html.py

  # ドライラン（実際の変更なし）
  python3 integrate_new_html.py --dry-run

  # カスタムソースディレクトリを指定
  python3 integrate_new_html.py --source custom_html/
        """,
    )

    parser.add_argument(
        "--source",
        "-s",
        default="new_html",
        help="統合元のディレクトリ（デフォルト: new_html）",
    )

    parser.add_argument(
        "--dry-run",
        "-d",
        action="store_true",
        help="ドライラン: 実際の変更を行わず、処理内容を表示",
    )

    args = parser.parse_args()

    print("🤖 AWS SAP 学習リソース自動統合スクリプト")
    print("=" * 80)

    if args.dry_run:
        print("⚠️  ドライランモード: 実際の変更は行いません\n")

    integrator = HTMLIntegrator(source_dir=args.source, dry_run=args.dry_run)
    success = integrator.integrate()

    if success and not args.dry_run:
        print("\n" + "=" * 80)
        print("🎉 統合が完了しました！")
        print("\n次のステップ:")
        print("  1. ローカルサーバーで確認: python3 server.py")
        print("  2. Gitにコミット: git add . && git commit -m 'feat: 新規リソース統合'")
        print("  3. リモートにプッシュ: git push origin gh-pages")

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
