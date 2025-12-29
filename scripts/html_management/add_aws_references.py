#!/usr/bin/env python3
"""
AWS公式ドキュメント参照リンク自動追加スクリプト

全てのHTML学習リソースファイルに、AWS公式ドキュメントへの
参照リンクセクションを自動的に追加します。

使用方法:
    # Dry-run（プレビューのみ）
    python3 add_aws_references.py --dry-run

    # 特定ディレクトリのみ処理
    python3 add_aws_references.py --target-dir networking/

    # 詳細ログ出力
    python3 add_aws_references.py --verbose
"""

import os
import re
import json
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse
from datetime import datetime


class AWSServiceDetector:
    """AWS サービス検出クラス"""

    # サービスエイリアス（ファイル名のバリエーション → 正規化キー）
    SERVICE_ALIASES = {
        'direct-connect': 'directconnect',
        'auto-scaling': 'autoscaling',
        'autoscaling': 'autoscaling',
        'api-gateway': 'apigateway',
        'transit-gateway': 'transitgateway',
        'global-accelerator': 'globalaccelerator',
        'systems-manager': 'systemsmanager',
        'elastic-cache': 'elasticache',
        'elastic-load-balancing': 'elb',
        'application-load-balancer': 'alb',
    }

    def __init__(self, services_db: Dict):
        self.services_db = services_db

    def detect_service_from_filename(self, filename: str) -> Optional[str]:
        """
        ファイル名パターンからAWSサービスを検出

        パターン:
        - aws-{service}-*.html → service
        - amazon_{service}_infographic.html → service
        - {service}_infographic.html → service
        - {service}-guide.html → service

        Args:
            filename: ファイル名（パスを含まない）

        Returns:
            検出されたサービスキー、または None
        """
        # パターン1: aws-{service}-*.html
        match = re.search(r'aws-([a-z0-9-]+)-', filename)
        if match:
            service = match.group(1)
            return self._normalize_service_key(service)

        # パターン2: amazon_{service}_infographic.html または aws_{service}_infographic.html
        match = re.search(r'(?:amazon|aws)_([a-z0-9-]+)_infographic', filename)
        if match:
            service = match.group(1)
            return self._normalize_service_key(service)

        # パターン3: {service}_infographic.html
        match = re.search(r'^([a-z0-9-]+)_infographic', filename)
        if match:
            service = match.group(1)
            return self._normalize_service_key(service)

        # パターン4: {service}-guide.html
        match = re.search(r'^([a-z0-9-]+)-guide\.html', filename)
        if match:
            service = match.group(1)
            return self._normalize_service_key(service)

        # パターン5: {service}.html
        match = re.search(r'^([a-z0-9-]+)\.html', filename)
        if match:
            service = match.group(1)
            # 短いサービス名のみ（3文字以上）
            if len(service) >= 3:
                return self._normalize_service_key(service)

        return None

    def _normalize_service_key(self, service: str) -> Optional[str]:
        """
        サービスキーを正規化してデータベースキーと照合

        Args:
            service: 生のサービス名

        Returns:
            正規化されたサービスキー、または None
        """
        # エイリアス変換
        if service in self.SERVICE_ALIASES:
            normalized = self.SERVICE_ALIASES[service]
        else:
            # ハイフンを除去
            normalized = service.replace('-', '')

        # データベースに存在するか確認
        if normalized in self.services_db:
            return normalized

        # 元のキーも試す
        if service in self.services_db:
            return service

        return None


class ReferencesSectionGenerator:
    """参照セクションHTML生成クラス"""

    def __init__(self, services_db: Dict):
        self.services_db = services_db

    def generate_references_section(self, service_key: str) -> str:
        """
        完全な参照セクションHTMLを生成（インラインCSS含む）

        Args:
            service_key: サービスキー（例: 'lambda', 'ec2'）

        Returns:
            完全なHTMLセクション文字列
        """
        service_data = self.services_db.get(service_key, self.services_db['generic'])
        service_name = service_data['service_name_ja']

        # re:Invent検索URL生成
        reinvent_url = f"https://www.youtube.com/results?search_query=AWS+re:Invent+{service_name}"

        html = f'''
    <!-- AWS 公式ドキュメント参考リンク -->
    <div class="aws-references-section" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 20px; padding: 50px; margin: 50px 0 30px 0; border-left: 8px solid #dc7600; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #232F3E; font-size: 2.2em; margin-bottom: 15px; font-weight: bold;">📚 AWS 公式ドキュメント参考リンク</h2>
            <p style="color: #374151; font-size: 1.1em; opacity: 0.9;">さらに詳しい情報は、AWS公式ドキュメントをご覧ください</p>
        </div>

        <div class="references-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px;">
            <!-- カード1: ユーザーガイド -->
            <div class="reference-card" style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border-top: 4px solid #dc7600;">
                <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">📖</div>
                <h3 style="color: #232F3E; font-size: 1.3em; font-weight: bold; margin-bottom: 15px; text-align: center;">{service_name} ユーザーガイド</h3>
                <p style="color: #6B7280; line-height: 1.7; margin-bottom: 20px; text-align: center; font-size: 0.95em;">{service_name}の完全なドキュメント、ベストプラクティス、チュートリアル</p>
                <a href="{service_data['user_guide']}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #dc7600 0%, #ff9900 100%); color: white; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: 600; transition: all 0.3s ease; width: 100%;">
                    ドキュメントを見る <span style="font-size: 1.1em;">↗</span>
                </a>
            </div>

            <!-- カード2: APIリファレンス -->
            <div class="reference-card" style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border-top: 4px solid #dc7600;">
                <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">⚙️</div>
                <h3 style="color: #232F3E; font-size: 1.3em; font-weight: bold; margin-bottom: 15px; text-align: center;">{service_name} API リファレンス</h3>
                <p style="color: #6B7280; line-height: 1.7; margin-bottom: 20px; text-align: center; font-size: 0.95em;">APIの詳細仕様、パラメータ、レスポンス形式</p>
                <a href="{service_data['api_reference']}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #dc7600 0%, #ff9900 100%); color: white; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: 600; transition: all 0.3s ease; width: 100%;">
                    APIリファレンスを見る <span style="font-size: 1.1em;">↗</span>
                </a>
            </div>

            <!-- カード3: FAQ -->
            <div class="reference-card" style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border-top: 4px solid #dc7600;">
                <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">💡</div>
                <h3 style="color: #232F3E; font-size: 1.3em; font-weight: bold; margin-bottom: 15px; text-align: center;">よくある質問（FAQ）</h3>
                <p style="color: #6B7280; line-height: 1.7; margin-bottom: 20px; text-align: center; font-size: 0.95em;">サービスに関するよくある質問と回答</p>
                <a href="{service_data['faq']}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #dc7600 0%, #ff9900 100%); color: white; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: 600; transition: all 0.3s ease; width: 100%;">
                    FAQを見る <span style="font-size: 1.1em;">↗</span>
                </a>
            </div>

            <!-- カード4: re:Invent動画 -->
            <div class="reference-card" style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border-top: 4px solid #dc7600;">
                <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">🎥</div>
                <h3 style="color: #232F3E; font-size: 1.3em; font-weight: bold; margin-bottom: 15px; text-align: center;">AWS re:Invent セッション</h3>
                <p style="color: #6B7280; line-height: 1.7; margin-bottom: 20px; text-align: center; font-size: 0.95em;">最新のイノベーションと実践的なユースケース</p>
                <a href="{reinvent_url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #dc7600 0%, #ff9900 100%); color: white; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: 600; transition: all 0.3s ease; width: 100%;">
                    動画を見る <span style="font-size: 1.1em;">↗</span>
                </a>
            </div>
        </div>

        <style>
            .reference-card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(220, 118, 0, 0.3);
            }}

            @media (max-width: 768px) {{
                .aws-references-section {{
                    padding: 30px 20px !important;
                    margin: 30px 0 20px 0 !important;
                }}

                .references-grid {{
                    grid-template-columns: 1fr !important;
                    gap: 20px !important;
                }}

                .reference-card {{
                    padding: 25px !important;
                }}
            }}
        </style>
    </div>
    <!-- End AWS References -->
'''
        return html


class HTMLInjector:
    """HTMLファイルへの挿入クラス"""

    # 除外ファイルリスト
    EXCLUDED_FILES = [
        'index.html',
        'quiz.html',
        'home.html',
        'table-of-contents.html',
        'knowledge-base.html'
    ]

    def should_process_file(self, filepath: Path) -> Tuple[bool, str]:
        """
        処理対象ファイルかどうか判定

        Args:
            filepath: ファイルパス

        Returns:
            (処理対象かどうか, 理由メッセージ)
        """
        # 除外ファイルチェック
        if filepath.name in self.EXCLUDED_FILES:
            return False, f"除外ファイル: {filepath.name}"

        # HTMLファイルかチェック
        if not filepath.suffix == '.html':
            return False, "HTMLファイルではない"

        # ファイルが存在するかチェック
        if not filepath.exists():
            return False, "ファイルが存在しない"

        return True, "処理対象"

    def has_existing_references(self, html_content: str) -> bool:
        """
        既存の参照セクションを検出

        Args:
            html_content: HTML内容

        Returns:
            True = 既存セクションあり（スキップ）、False = なし（処理対象）
        """
        # 検出パターン
        patterns = [
            r'aws-references-section',  # クラス名
            r'AWS 公式ドキュメント参考リンク',  # セクションタイトル
            r'参考資料',  # 一般的なタイトル
            r'参考文献',
            r'公式ドキュメント'
        ]

        for pattern in patterns:
            if re.search(pattern, html_content):
                return True

        return False

    def find_insertion_point(self, html_content: str) -> Optional[int]:
        """
        挿入ポイントを特定

        優先順位:
        1. </div>の後、<script>の前（最も一般的）
        2. </body>タグの前（フォールバック）

        Args:
            html_content: HTML内容

        Returns:
            挿入位置のインデックス、または None
        """
        # パターン1: </div>の後、<script>の前を探す
        # 最後の</div>と最初の<script>の間を見つける
        script_match = re.search(r'<script', html_content, re.IGNORECASE)
        if script_match:
            # <script>より前の部分で最後の</div>を探す
            before_script = html_content[:script_match.start()]
            div_matches = list(re.finditer(r'</div>', before_script, re.IGNORECASE))
            if div_matches:
                last_div_match = div_matches[-1]
                # </div>の直後（改行を含む）
                insertion_point = last_div_match.end()
                # 改行を含めて次の行頭に挿入
                next_newline = html_content.find('\n', insertion_point)
                if next_newline != -1:
                    return next_newline + 1
                return insertion_point

        # パターン2: </body>タグの前（フォールバック）
        body_match = re.search(r'</body>', html_content, re.IGNORECASE)
        if body_match:
            return body_match.start()

        return None

    def inject_references_section(self, html_content: str, references_html: str) -> str:
        """
        参照セクションをHTMLに挿入

        Args:
            html_content: 元のHTML内容
            references_html: 挿入する参照セクションHTML

        Returns:
            挿入後のHTML内容
        """
        insertion_point = self.find_insertion_point(html_content)
        if insertion_point is None:
            raise ValueError("挿入ポイントが見つかりません")

        # 挿入
        new_content = (
            html_content[:insertion_point] +
            references_html +
            html_content[insertion_point:]
        )

        return new_content

    def backup_file(self, filepath: Path) -> Path:
        """
        ファイルのバックアップを作成

        Args:
            filepath: バックアップ対象ファイル

        Returns:
            バックアップファイルのパス
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = filepath.with_suffix(f'.backup_{timestamp}.html')
        shutil.copy2(filepath, backup_path)
        return backup_path

    def validate_html_structure(self, html_content: str) -> bool:
        """
        基本的なHTMLタグバランスチェック

        Args:
            html_content: HTML内容

        Returns:
            True = 構造が正しい、False = 問題あり
        """
        # <div>と</div>の数をチェック
        div_open = len(re.findall(r'<div', html_content, re.IGNORECASE))
        div_close = len(re.findall(r'</div>', html_content, re.IGNORECASE))

        if div_open != div_close:
            return False

        # <body>と</body>の存在チェック
        if not re.search(r'<body', html_content, re.IGNORECASE):
            return False
        if not re.search(r'</body>', html_content, re.IGNORECASE):
            return False

        # <html>と</html>の存在チェック
        if not re.search(r'<html', html_content, re.IGNORECASE):
            return False
        if not re.search(r'</html>', html_content, re.IGNORECASE):
            return False

        return True


class AWSReferencesAdder:
    """メインクラス: 参照リンク追加処理の統括"""

    def __init__(self, dry_run: bool = False,
                 target_dir: str = ".",
                 services_db_path: str = "scripts/html_management/aws_services_urls.json",
                 verbose: bool = False):
        self.dry_run = dry_run
        self.target_dir = Path(target_dir)
        self.verbose = verbose
        self.processed_files = []
        self.skipped_files = []
        self.failed_files = []

        # サービスデータベース読み込み
        with open(services_db_path, 'r', encoding='utf-8') as f:
            self.services_db = json.load(f)

        # コンポーネント初期化
        self.detector = AWSServiceDetector(self.services_db)
        self.generator = ReferencesSectionGenerator(self.services_db)
        self.injector = HTMLInjector()

    def process_file(self, filepath: Path) -> bool:
        """
        単一ファイルを処理

        Args:
            filepath: 処理対象ファイルパス

        Returns:
            True = 成功、False = 失敗
        """
        # 処理対象かチェック
        should_process, reason = self.injector.should_process_file(filepath)
        if not should_process:
            self.skipped_files.append((filepath, reason))
            if self.verbose:
                print(f"⊘ スキップ: {filepath.name} - {reason}")
            return False

        # ファイル読み込み
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
        except Exception as e:
            self.failed_files.append((filepath, f"読み込みエラー: {e}"))
            print(f"✗ エラー: {filepath.name} - 読み込み失敗: {e}")
            return False

        # 既存参照セクションチェック
        if self.injector.has_existing_references(html_content):
            self.skipped_files.append((filepath, "既存の参照セクションあり"))
            if self.verbose:
                print(f"⊘ スキップ: {filepath.name} - 既存の参照セクションあり")
            return False

        # サービス検出
        service_key = self.detector.detect_service_from_filename(filepath.name)
        if not service_key:
            service_key = 'generic'  # フォールバック
            if self.verbose:
                print(f"⚠ {filepath.name} - サービス検出失敗、汎用リンクを使用")

        service_name = self.services_db[service_key]['service_name_ja']

        # 参照セクション生成
        references_html = self.generator.generate_references_section(service_key)

        # 挿入ポイント検出
        try:
            insertion_point = self.injector.find_insertion_point(html_content)
            if insertion_point is None:
                self.failed_files.append((filepath, "挿入ポイントが見つからない"))
                print(f"✗ エラー: {filepath.name} - 挿入ポイントが見つかりません")
                return False
        except Exception as e:
            self.failed_files.append((filepath, f"挿入ポイント検出エラー: {e}"))
            print(f"✗ エラー: {filepath.name} - {e}")
            return False

        # HTML挿入
        try:
            new_content = self.injector.inject_references_section(html_content, references_html)
        except Exception as e:
            self.failed_files.append((filepath, f"挿入エラー: {e}"))
            print(f"✗ エラー: {filepath.name} - 挿入失敗: {e}")
            return False

        # HTML構造検証
        if not self.injector.validate_html_structure(new_content):
            self.failed_files.append((filepath, "HTML構造が不正"))
            print(f"✗ エラー: {filepath.name} - HTML構造検証失敗")
            return False

        # Dry-runモード
        if self.dry_run:
            print(f"✓ [DRY-RUN] {filepath.name} - サービス: {service_name}")
            self.processed_files.append((filepath, service_key))
            return True

        # バックアップ作成
        try:
            backup_path = self.injector.backup_file(filepath)
            if self.verbose:
                print(f"  💾 バックアップ: {backup_path.name}")
        except Exception as e:
            print(f"⚠ 警告: {filepath.name} - バックアップ失敗: {e}")

        # ファイル書き込み
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ 完了: {filepath.name} - サービス: {service_name}")
            self.processed_files.append((filepath, service_key))
            return True
        except Exception as e:
            self.failed_files.append((filepath, f"書き込みエラー: {e}"))
            print(f"✗ エラー: {filepath.name} - 書き込み失敗: {e}")
            return False

    def process_all_files(self) -> None:
        """全てのHTMLファイルを処理"""
        # ファイル収集
        if self.target_dir.is_file():
            # 単一ファイル指定
            files_to_process = [self.target_dir]
        else:
            # ディレクトリ内の全HTMLファイル
            files_to_process = list(self.target_dir.rglob('*.html'))

        print(f"\n{'='*60}")
        print(f"AWS公式ドキュメント参照リンク追加スクリプト")
        print(f"{'='*60}")
        print(f"モード: {'DRY-RUN（プレビューのみ）' if self.dry_run else '実行モード'}")
        print(f"対象ディレクトリ: {self.target_dir}")
        print(f"対象ファイル数: {len(files_to_process)}")
        print(f"{'='*60}\n")

        # 処理実行
        for filepath in files_to_process:
            self.process_file(filepath)

        # レポート出力
        print(self.generate_report())

    def generate_report(self) -> str:
        """処理結果レポートを生成"""
        total = len(self.processed_files) + len(self.skipped_files) + len(self.failed_files)

        report = f"\n{'='*60}\n"
        report += f"処理結果レポート\n"
        report += f"{'='*60}\n"
        report += f"合計ファイル数: {total}\n"
        report += f"✓ 処理成功: {len(self.processed_files)}\n"
        report += f"⊘ スキップ: {len(self.skipped_files)}\n"
        report += f"✗ 失敗: {len(self.failed_files)}\n"
        report += f"{'='*60}\n"

        if self.processed_files:
            report += f"\n【処理成功ファイル】\n"
            service_counts = {}
            for filepath, service_key in self.processed_files:
                service_name = self.services_db[service_key]['service_name_ja']
                service_counts[service_name] = service_counts.get(service_name, 0) + 1

            for service_name, count in sorted(service_counts.items(), key=lambda x: x[1], reverse=True):
                report += f"  - {service_name}: {count}ファイル\n"

        if self.skipped_files and self.verbose:
            report += f"\n【スキップファイル】\n"
            skip_reasons = {}
            for filepath, reason in self.skipped_files:
                skip_reasons[reason] = skip_reasons.get(reason, 0) + 1

            for reason, count in sorted(skip_reasons.items(), key=lambda x: x[1], reverse=True):
                report += f"  - {reason}: {count}ファイル\n"

        if self.failed_files:
            report += f"\n【失敗ファイル】\n"
            for filepath, reason in self.failed_files:
                report += f"  - {filepath.name}: {reason}\n"

        report += f"{'='*60}\n"

        return report


def main():
    parser = argparse.ArgumentParser(
        description='AWS公式ドキュメント参照リンクを全HTMLファイルに追加',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
使用例:
  # Dry-run（プレビューのみ）
  python3 add_aws_references.py --dry-run

  # 特定ディレクトリのみ処理
  python3 add_aws_references.py --target-dir networking/

  # 詳細ログ出力
  python3 add_aws_references.py --verbose

  # サービスDB指定
  python3 add_aws_references.py --services-db custom_services.json
        '''
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='実際の変更を行わず、処理内容をプレビュー'
    )
    parser.add_argument(
        '--target-dir',
        default='.',
        help='処理対象ディレクトリ（デフォルト: カレントディレクトリ）'
    )
    parser.add_argument(
        '--services-db',
        default='scripts/html_management/aws_services_urls.json',
        help='サービスURLマッピングJSONファイルのパス'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='詳細なログ出力'
    )

    args = parser.parse_args()

    # スクリプト実行
    adder = AWSReferencesAdder(
        dry_run=args.dry_run,
        target_dir=args.target_dir,
        services_db_path=args.services_db,
        verbose=args.verbose
    )

    adder.process_all_files()


if __name__ == '__main__':
    main()
