#!/usr/bin/env python3
"""
AWS SAP学習リソースの各HTMLファイルにブレッドクラムを追加するスクリプト
"""

import os
import re
from pathlib import Path

# カテゴリマッピング（ファイルパスから大カテゴリ・小カテゴリを判定）
CATEGORY_MAPPING = {
    'networking/': {
        'major': 'ネットワーキング',
        'sub': {
            'direct-connect': 'Direct Connect & ハイブリッドネットワーク',
            'vpn': 'Direct Connect & ハイブリッドネットワーク',
            'eni': 'VPC & ネットワーク基礎',
            'eip': 'VPC & ネットワーク基礎',
            'nat': 'VPC & ネットワーク基礎',
            'gateway': 'Transit Gateway & ゲートウェイ',
        }
    },
    'security-governance/': {
        'major': 'セキュリティ・ガバナンス',
        'sub': {
            'cognito': 'IAM & 認証・認可',
            'iam': 'IAM & 認証・認可',
            'acm': '暗号化 & 証明書管理',
            'cmk': '暗号化 & 証明書管理',
            'control-tower': 'Organizations & ガバナンス',
            'organization': 'Organizations & ガバナンス',
            'scp': 'Organizations & ガバナンス',
            'waf': 'セキュリティ監視・脅威検知',
        }
    },
    'compute-applications/': {
        'major': 'コンピュート・アプリケーション',
        'sub': {
            'ec2': 'EC2 & インスタンス管理',
            'auto-scaling': 'Auto Scaling & ロードバランシング',
            'alb': 'Auto Scaling & ロードバランシング',
            'lambda': 'Lambda & サーバーレス',
            'ecs': 'コンテナ & アプリケーション統合',
            'efa': 'コンテナ & アプリケーション統合',
            'patch': 'システム運用 & パッチ管理',
        }
    },
    'content-delivery-dns/': {
        'major': 'コンテンツ配信・DNS',
        'sub': {
            'cloudfront': 'CloudFront & コンテンツ配信',
            'route53': 'Route53 & DNS管理',
            'global-accelerator': 'Route53 & DNS管理',
        }
    },
    'development-deployment/': {
        'major': '開発・デプロイメント',
        'sub': {
            'cloudformation': 'IaC & CloudFormation',
            'cdk': 'IaC & CloudFormation',
            'sam': 'IaC & CloudFormation',
            'api-gateway': 'API & イベント駆動',
            'eventbridge': 'API & イベント駆動',
            'codedeploy': 'CI/CD & デプロイメント',
        }
    },
    'storage-database/': {
        'major': 'ストレージ・データベース',
        'sub': {
            's3': 'S3 & オブジェクトストレージ',
            'ebs': 'ブロック & ファイルストレージ',
            'efs': 'ブロック & ファイルストレージ',
            'rds': 'データベース & キャッシング',
            'aurora': 'データベース & キャッシング',
            'elasticache': 'データベース & キャッシング',
            'msk': 'データベース & キャッシング',
        }
    },
    'migration-transfer/': {
        'major': '移行・転送',
        'sub': {
            'dms': 'DMS & データベース移行',
            'migration': 'Migration Hub & 移行戦略',
            'dr': 'ディザスタリカバリ (DR)',
        }
    },
    'analytics-bigdata/': {
        'major': '分析・運用・クイズ',
        'sub': {
            'default': '分析・運用',
        }
    },
    'data-analytics/': {
        'major': '分析・運用・クイズ',
        'sub': {
            'default': 'データ分析',
        }
    },
}

# new-solutions/ と organizational-complexity/ の追加マッピング
SPECIAL_MAPPINGS = {
    'new-solutions/': 'auto',  # ファイル名から自動判定
    'organizational-complexity/': {
        'major': 'セキュリティ・ガバナンス',
        'sub': {
            'ram': 'Organizations & ガバナンス',
            'scp': 'Organizations & ガバナンス',
            'tag': 'Organizations & ガバナンス',
            'org': 'Organizations & ガバナンス',
            'tgw': 'ネットワーキング',
        }
    },
    'continuous-improvement/': {
        'major': 'セキュリティ・ガバナンス',
        'sub': {
            'waf': 'セキュリティ監視・脅威検知',
            'edr': 'セキュリティ監視・脅威検知',
            'ssm': 'セキュリティ監視・脅威検知',
            'iam': 'IAM & 認証・認可',
            'codedeploy': 'CI/CD & デプロイメント',
        }
    },
}

# ブレッドクラムHTMLテンプレート
BREADCRUMB_TEMPLATE = """
    <!-- ブレッドクラムナビゲーション -->
    <nav class="breadcrumb-nav">
        <a href="../index.html" class="breadcrumb-home">🏠 ホーム</a>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-item">{major}</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-item">{sub}</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{title}</span>
    </nav>
"""

# ブレッドクラムCSSスタイル
BREADCRUMB_CSS = """
        /* ブレッドクラムナビゲーション */
        .breadcrumb-nav {
            background-color: rgba(255, 255, 255, 0.95);
            padding: 15px 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-size: 0.95em;
        }

        .breadcrumb-home {
            color: #FF9900;
            text-decoration: none;
            font-weight: 600;
            transition: opacity 0.3s ease;
        }

        .breadcrumb-home:hover {
            opacity: 0.7;
        }

        .breadcrumb-separator {
            color: #9CA3AF;
            user-select: none;
        }

        .breadcrumb-item {
            color: #374151;
            font-weight: 500;
        }

        .breadcrumb-current {
            color: #FF9900;
            font-weight: 700;
        }

        @media (max-width: 768px) {
            .breadcrumb-nav {
                font-size: 0.85em;
                padding: 12px 18px;
            }
        }
"""


def get_category_info(file_path):
    """ファイルパスからカテゴリ情報を取得"""
    path_str = str(file_path)
    filename = os.path.basename(path_str).lower()

    # ディレクトリベースの判定
    for dir_prefix, mapping in CATEGORY_MAPPING.items():
        if dir_prefix in path_str:
            major = mapping['major']
            # ファイル名からサブカテゴリを推定
            sub = None
            for key, value in mapping['sub'].items():
                if key in filename:
                    sub = value
                    break
            if not sub and 'default' in mapping['sub']:
                sub = mapping['sub']['default']
            return major, sub

    # special mappings
    for dir_prefix, mapping in SPECIAL_MAPPINGS.items():
        if dir_prefix in path_str:
            if mapping == 'auto':
                # new-solutions/ は複数のカテゴリにまたがるため、ファイル名から推定
                if 'direct-connect' in filename or 'vpn' in filename or 'eip' in filename or 'nat' in filename or 'vpc' in filename or 'privatelink' in filename:
                    return 'ネットワーキング', 'VPC & ネットワーク基礎'
                elif 's3' in filename or 'storage' in filename:
                    return 'ストレージ・データベース', 'S3 & オブジェクトストレージ'
                elif 'lambda' in filename:
                    return 'コンピュート・アプリケーション', 'Lambda & サーバーレス'
                # デフォルト
                return 'その他', 'その他'
            else:
                major = mapping['major']
                sub = None
                for key, value in mapping['sub'].items():
                    if key in filename:
                        if isinstance(value, dict):
                            # organizational-complexity の tgw の場合
                            if value == 'ネットワーキング':
                                return 'ネットワーキング', 'Transit Gateway & ゲートウェイ'
                        sub = value
                        break
                if not sub:
                    sub = 'その他'
                return major, sub

    return None, None


def add_breadcrumb_to_file(file_path, major, sub, title):
    """HTMLファイルにブレッドクラムを追加"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 既にブレッドクラムがある場合はスキップ
        if 'breadcrumb-nav' in content:
            print(f"  ⏭️  スキップ (既にブレッドクラムあり): {file_path}")
            return False

        # ブレッドクラムHTMLを生成
        # 相対パスを調整（サブディレクトリは1階層のみ）
        home_path = '../index.html'

        breadcrumb_html = f"""
    <!-- ブレッドクラムナビゲーション -->
    <nav class="breadcrumb-nav">
        <a href="{home_path}" class="breadcrumb-home">🏠 ホーム</a>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-item">{major}</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-item">{sub}</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{title}</span>
    </nav>
"""

        # CSSを追加（</style>の前に挿入）
        if BREADCRUMB_CSS not in content:
            content = content.replace('</style>', BREADCRUMB_CSS + '\n    </style>')

        # HTMLを追加（.containerの直後に挿入）
        # パターン1: <div class="container">の直後
        pattern1 = r'(<div class="container">\s*)'
        if re.search(pattern1, content):
            content = re.sub(pattern1, r'\1' + breadcrumb_html, content, count=1)
        # パターン2: <body>の直後にcontainerがない場合
        elif '<body>' in content:
            content = content.replace('<body>', '<body>\n' + breadcrumb_html, 1)

        # ファイルに書き込み
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"  ✅ 追加完了: {file_path}")
        return True

    except Exception as e:
        print(f"  ❌ エラー: {file_path} - {str(e)}")
        return False


def main():
    """メイン処理"""
    base_dir = Path('/home/meme1/aws_sap_studying')

    # 対象ディレクトリ
    target_dirs = [
        'networking',
        'security-governance',
        'compute-applications',
        'content-delivery-dns',
        'development-deployment',
        'storage-database',
        'migration-transfer',
        'analytics-bigdata',
        'data-analytics',
        'new-solutions',
        'organizational-complexity',
        'continuous-improvement',
        'migration',
        'migration-planning',
        'storage',
        'cost-control',
    ]

    total_files = 0
    updated_files = 0

    print("\n🚀 ブレッドクラム追加スクリプト開始\n")

    for dir_name in target_dirs:
        dir_path = base_dir / dir_name
        if not dir_path.exists():
            continue

        print(f"📁 {dir_name}/ を処理中...")

        # HTMLファイルを検索
        html_files = list(dir_path.glob('*.html'))

        for html_file in html_files:
            total_files += 1

            # タイトルを取得（ファイル名から）
            title = html_file.stem.replace('_', ' ').replace('-', ' ').title()

            # カテゴリ情報を取得
            major, sub = get_category_info(html_file)

            if not major or not sub:
                print(f"  ⚠️  カテゴリ不明: {html_file}")
                continue

            # ブレッドクラムを追加
            if add_breadcrumb_to_file(html_file, major, sub, title):
                updated_files += 1

    print(f"\n✨ 完了！")
    print(f"📊 処理結果: {updated_files}/{total_files} ファイルを更新しました\n")


if __name__ == '__main__':
    main()
