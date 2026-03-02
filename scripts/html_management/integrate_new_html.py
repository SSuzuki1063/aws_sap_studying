#!/usr/bin/env python3
"""
AWS SAP 学習リソース自動統合スクリプト

new_html/ ディレクトリ内のHTMLファイルを自動的に分析し、
適切なカテゴリディレクトリに配置してindex.htmlを更新します。
"""

import os
import re
import json
import shutil
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from html.parser import HTMLParser
import argparse


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
    CATEGORY_MAPPINGS = {
        "security-governance": {
            "keywords": [
                "iam", "cognito", "scp", "organizations", "config", "control tower",
                "guardrails", "cmk", "kms", "暗号", "認証", "認可", "セキュリティ",
                "ガバナンス", "waf", "shield", "セキュリティ監視", "脅威検知"
            ],
            "section": "Organizations & ガバナンス",
            "icon": "🏢"
        },
        "compute-applications": {
            "keywords": [
                "ec2", "auto scaling", "autoscaling", "lambda", "ecs", "fargate",
                "alb", "elb", "sqs", "sns", "インスタンス", "コンピュート",
                "アプリケーション", "ロードバランシング", "スケーリング", "lifecycle",
                "warm pool", "patch manager", "systems manager"
            ],
            "section": "Auto Scaling & ロードバランシング",
            "icon": "⚖️"
        },
        "content-delivery-dns": {
            "keywords": [
                "cloudfront", "route53", "dns", "global accelerator", "cdn",
                "コンテンツ配信", "キャッシュ", "https", "ssl", "tls", "証明書"
            ],
            "section": "CloudFront & コンテンツ配信",
            "icon": "⚡"
        },
        "networking": {
            "keywords": [
                "vpc", "direct connect", "vpn", "transit gateway", "tgw",
                "privatelink", "eni", "eip", "nat", "ネットワーク", "接続"
            ],
            "section": "VPC & ネットワーク基礎",
            "icon": "🏗️"
        },
        "storage-database": {
            "keywords": [
                "s3", "ebs", "efs", "fsx", "rds", "aurora", "dynamodb", "redshift",
                "elasticache", "ストレージ", "データベース", "キャッシング"
            ],
            "section": "S3 & オブジェクトストレージ",
            "icon": "🪣"
        },
        "development-deployment": {
            "keywords": [
                "cloudformation", "cdk", "sam", "codepipeline", "codedeploy",
                "eventbridge", "api gateway", "appsync", "開発", "デプロイ",
                "iac", "ci/cd"
            ],
            "section": "IaC & CloudFormation",
            "icon": "📜"
        },
        "migration-transfer": {
            "keywords": [
                "dms", "migration hub", "sct", "移行", "マイグレーション",
                "dr", "ディザスタリカバリ", "disaster recovery"
            ],
            "section": "DMS & データ移行",
            "icon": "🔄"
        },
        "organizational-complexity": {
            "keywords": [
                "ram", "resource access manager", "service catalog", "stacksets",
                "cfct", "組織", "マルチアカウント", "共有"
            ],
            "section": "Organizations & ガバナンス",
            "icon": "🏢"
        },
        "continuous-improvement": {
            "keywords": [
                "cloudwatch", "cloudtrail", "systems manager", "ssm", "x-ray",
                "運用", "監視", "改善", "パッチ", "ハイブリッド"
            ],
            "section": "システム運用 & パッチ管理",
            "icon": "🔧"
        }
    }

    # 共有CSSリンク（GitHub Pages対応パス）
    SHARED_CSS_LINKS = '''<!-- 共通CSSファイル（データ駆動アーキテクチャ） -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>'''

    # 固定ヘッダーHTML（共有CSSのスタイルを使用）
    FIXED_HEADER_HTML = '''<!-- 固定ナビゲーションヘッダー -->
<div class="fixed-nav-header">
<div class="fixed-nav-container">
<a class="fixed-nav-logo" href="/aws_sap_studying/index.html">
     📚 AWS SAP
    </a>
<button class="hamburger-btn" id="hamburgerBtn" aria-label="メニューを開く" aria-expanded="false" aria-controls="mainNav"><span class="hamburger-icon">☰</span></button>
<nav aria-label="メインナビゲーション" class="fixed-nav-links" role="navigation" id="mainNav">
<a href="/aws_sap_studying/profile.html">自己紹介</a>
<a href="/aws_sap_studying/learning-resources.html">学習リソース集</a>
<a href="/aws_sap_studying/roadmap.html">🗺️ロードマップ</a>
<a href="/aws_sap_studying/exam_guide.html">試験ガイド</a>
<a href="/aws_sap_studying/knowledge-base.html">ナレッジベース</a>
<a href="/aws_sap_studying/quiz.html">クイズ</a>
<a href="/aws_sap_studying/bookmark.html">⭐ブックマーク</a>
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

    # 固定ヘッダー機能のJavaScript
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
</script>
<script src="/aws_sap_studying/js/mobile-nav.js"></script>'''

    def __init__(self, source_dir: str = "new_html", dry_run: bool = False):
        self.source_dir = Path(source_dir)
        self.dry_run = dry_run
        # リポジトリルートを正しく設定（スクリプトディレクトリの2階層上）
        self.repo_root = Path(__file__).parent.parent.parent
        self.index_html = self.repo_root / "index.html"
        self.moved_files: List[Dict] = []
        self.generated_snippets: Dict[str, List[str]] = {
            "data_js": [],
            "index_js": []
        }

    def analyze_html_file(self, file_path: Path) -> Dict:
        """HTMLファイルを分析してメタデータを抽出"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
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
                "lines": len(content.splitlines())
            }
        except Exception as e:
            print(f"⚠️  ファイル分析エラー {file_path.name}: {e}")
            return None

    def _extract_keywords(self, text: str) -> List[str]:
        """テキストからAWS関連キーワードを抽出"""
        keywords = []
        all_keywords = set()

        for category_keywords in self.CATEGORY_MAPPINGS.values():
            all_keywords.update(kw.lower() for kw in category_keywords["keywords"])

        for keyword in all_keywords:
            if keyword in text:
                keywords.append(keyword)

        return keywords

    def determine_category(self, metadata: Dict) -> Tuple[str, str, str]:
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

    def add_shared_css(self, file_path: Path) -> bool:
        """HTMLファイルに共有CSSリンクを追加"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 既に共有CSSが含まれているかチェック
            if '/aws_sap_studying/css/' in content:
                return False  # 既に追加済み

            # </title>の後に共有CSSリンクを挿入
            if '</title>' in content:
                content = content.replace('</title>', f'</title>\n{self.SHARED_CSS_LINKS}', 1)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
            return False
        except Exception as e:
            print(f"   ⚠️  CSS追加エラー: {e}")
            return False

    def add_fixed_header(self, file_path: Path) -> bool:
        """HTMLファイルに固定ヘッダーを追加"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 既に固定ヘッダーが含まれているかチェック
            if 'fixed-nav-header' in content:
                return False  # 既に追加済み

            original_content = content

            # <body>タグの直後に固定ヘッダーHTMLを挿入
            body_pattern = r'(<body[^>]*>)'
            content = re.sub(body_pattern, r'\1\n' + self.FIXED_HEADER_HTML, content, count=1)

            # bodyにpadding-topを追加（インラインスタイルがある場合）
            body_style_pattern = r'(body\s*\{[^}]*)'
            def add_padding(match):
                body_style = match.group(1)
                if 'padding-top:' in body_style:
                    body_style = re.sub(r'padding-top:\s*\d+px', 'padding-top: 70px', body_style)
                elif 'padding:' in body_style:
                    body_style = body_style.rstrip() + '\n            padding-top: 70px;'
                else:
                    body_style = body_style.rstrip() + '\n            padding-top: 70px;'
                return body_style
            content = re.sub(body_style_pattern, add_padding, content)

            # JavaScriptを</body>の直前に挿入
            if 'scrollToTopBtn' not in content:
                content = content.replace('</body>', f'{self.FIXED_HEADER_JS}\n</body>', 1)

            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
            return False
        except Exception as e:
            print(f"   ⚠️  固定ヘッダー追加エラー: {e}")
            return False

    def generate_snippets(self, title: str, category: str, filename: str, section: str) -> None:
        """data.jsとindex.js用のコードスニペットを生成"""
        # カテゴリからdata.js用のパスを生成
        href = f"{category}/{filename}"

        # カテゴリ名をマッピング
        category_names = {
            "networking": "ネットワーキング",
            "security-governance": "セキュリティ・ガバナンス",
            "compute-applications": "コンピュート・アプリケーション",
            "content-delivery-dns": "コンテンツ配信・DNS",
            "development-deployment": "開発・デプロイメント",
            "storage-database": "ストレージ・データベース",
            "migration": "移行・転送",
            "migration-transfer": "移行・転送",
            "organizational-complexity": "セキュリティ・ガバナンス",  # 実際のdata.jsカテゴリにマップ
            "continuous-improvement": "コンピュート・アプリケーション",
            "analytics-operations": "分析・運用・クイズ"
        }

        category_display = category_names.get(category, "セキュリティ・ガバナンス")

        # data.js用スニペット（priority: 'medium' はデフォルト。適宜 'high' / 'low' に変更）
        data_js_snippet = f"          {{ title: '{title}', href: '{href}', priority: 'medium' }}"
        self.generated_snippets["data_js"].append(data_js_snippet)

        # index.js用スニペット
        index_js_snippet = f"    {{ title: '{title}', category: '{category_display}', file: '{href}' }}"
        self.generated_snippets["index_js"].append(index_js_snippet)

    def move_file(self, source: Path, category: str) -> Optional[Path]:
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

            # 共有CSSリンクを追加
            if self.add_shared_css(dest_file):
                print(f"   🎨 共有CSS追加完了")

            # 固定ヘッダーを追加
            if self.add_fixed_header(dest_file):
                print(f"   📌 固定ヘッダー追加完了")
        else:
            print(f"   [DRY RUN] 移動: {source.name} → {category}/")

        return dest_file

    def update_index_html(self, files_info: List[Dict]) -> bool:
        """index.htmlを更新して新しいリソースを追加"""
        if not self.index_html.exists():
            print("❌ index.html が見つかりません")
            return False

        try:
            with open(self.index_html, 'r', encoding='utf-8') as f:
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

                def replace_section(match):
                    current_count = int(match.group(2))
                    new_count = current_count + len(files)

                    # 新しいリソース項目を追加
                    new_items = ""
                    for file_info in files:
                        rel_path = f'{file_info["category"]}/{file_info["filename"]}'
                        new_items += f'\n                        <li><a href="{rel_path}">{file_info["title"]}</a></li>'

                    return match.group(1) + str(new_count) + match.group(3) + new_items

                content = re.sub(pattern, replace_section, content)

                # 大カテゴリのリソースカウントも更新
                major_category_pattern = rf'(<div id="[^"]*{category}[^"]*" class="major-category">.*?<span class="resource-count">)(\d+)(</span>)'

                def update_major_count(match):
                    current_count = int(match.group(2))
                    new_count = current_count + len(files)
                    return match.group(1) + str(new_count) + match.group(3)

                content = re.sub(major_category_pattern, update_major_count, content, flags=re.DOTALL)

            if content != original_content:
                if not self.dry_run:
                    with open(self.index_html, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ index.html 更新完了")
                else:
                    print(f"[DRY RUN] index.html を更新")
                return True
            else:
                print("⚠️  index.html の更新箇所が見つかりませんでした")
                return False

        except Exception as e:
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

            # スニペット生成
            self.generate_snippets(metadata["title"], category, html_file.name, section)

            files_info.append({
                "filename": html_file.name,
                "title": metadata["title"],
                "category": category,
                "section": section,
                "icon": icon,
                "dest": str(dest_file) if dest_file else None
            })

        print("\n" + "=" * 80)
        print(f"\n📋 統合サマリー:")
        print(f"   ✅ 処理ファイル数: {len(files_info)}")

        category_counts = {}
        for info in files_info:
            cat = info["category"]
            category_counts[cat] = category_counts.get(cat, 0) + 1

        for category, count in sorted(category_counts.items()):
            print(f"   • {category}: {count}個")

        # index.html更新
        print(f"\n📝 index.html を更新中...")
        if self.update_index_html(files_info):
            print("✅ 統合完了！")
        else:
            print("⚠️  index.html の更新に問題がありました")

        # 空のディレクトリを削除
        if not self.dry_run and self.source_dir.exists() and not any(self.source_dir.iterdir()):
            self.source_dir.rmdir()
            print(f"\n🗑️  空のディレクトリを削除: {self.source_dir}")

        # コピペ可能なスニペットを出力
        self._print_snippets()

        return True

    def _print_snippets(self) -> None:
        """data.jsとindex.js用のコピペ可能なスニペットを出力"""
        if not self.generated_snippets["data_js"]:
            return

        print("\n" + "=" * 80)
        print("📋 コピペ可能なコードスニペット")
        print("=" * 80)

        print("\n┌─────────────────────────────────────────────────────────────┐")
        print("│ 📝 data.js に追加（適切なセクションのresources配列内に）   │")
        print("└─────────────────────────────────────────────────────────────┘")
        for snippet in self.generated_snippets["data_js"]:
            print(snippet + ",")

        print("\n┌─────────────────────────────────────────────────────────────┐")
        print("│ 🔍 index.js に追加（searchData配列の末尾に）               │")
        print("└─────────────────────────────────────────────────────────────┘")
        for snippet in self.generated_snippets["index_js"]:
            print(snippet + ",")

        print("\n" + "─" * 80)
        print("⚠️  重要: 上記スニペットを追加後、以下も対応してください")
        print("")
        print("   🔴🟡🔵 優先度を調整:")
        print("   • デフォルトは priority: 'medium'（優先度: 中）")
        print("   • SAP試験で頻出のリソース → priority: 'high'（優先度: 高）")
        print("   • 補助的・応用的なリソース → priority: 'low'（優先度: 低）")
        print("   • 未設定の場合も自動的に 'medium' として扱われます")
        print("")
        print("   📊 カウントを更新:")
        print("   • data.js: section.count と category.count をインクリメント")
        print("   • data.js: categoryQuickNav の count をインクリメント")
        print("   • data.js: siteStats.totalResources を更新")
        print("")
        print("💡 ヒント: python3 scripts/html_management/update_counts.py で自動更新可能")
        print("─" * 80)


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
        help="ドライラン: 実際の変更を行わず、処理内容を表示"
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
    exit(main())
