#!/usr/bin/env python3
"""
Quiz問題に関連リソースをマッピングするスクリプト
各問題のキーワードを抽出し、既存HTMLリソースとマッチングする
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
from collections import defaultdict

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent.parent

# キーワード → リソースのマッピング定義
# キーワードは正規表現パターンとして扱う
KEYWORD_RESOURCE_MAP = {
    # ネットワーキング系
    r'VPC\s*Peering|ピアリング': [
        {'title': 'AWS Transit Gateway ピアリング完全ガイド', 'path': 'networking/transit-gateway-peering-guide.html', 'type': 'internal'},
    ],
    r'Direct\s*Connect|専用線|DX': [
        {'title': 'Direct Connect ガイド', 'path': 'networking/aws-direct-connect-guide.html', 'type': 'internal'},
        {'title': 'Direct Connect & VGW', 'path': 'new-solutions/aws-direct-connect-vgw.html', 'type': 'internal'},
        {'title': 'AWS Direct Connect BGP ルーティング完全ガイド', 'path': 'networking/direct-connect-bgp-routing-guide.html', 'type': 'internal'},
    ],
    r'PrivateLink|VPC\s*Endpoint|エンドポイント': [
        {'title': 'VPN vs PrivateLink', 'path': 'new-solutions/vpn-vs-privatelink.html', 'type': 'internal'},
        {'title': 'VPC PrivateLink CIDR オーバーラップ', 'path': 'new-solutions/vpc_privatelink_cidr_overlap.html', 'type': 'internal'},
        {'title': 'S3バケットポリシー × VPCエンドポイント完全ガイド', 'path': 'networking/s3-vpc-endpoint-policy-guide.html', 'type': 'internal'},
    ],
    r'Transit\s*Gateway|TGW': [
        {'title': 'AWS Transit Gateway Deep Dive 完全ガイド', 'path': 'networking/transit-gateway-deep-dive.html', 'type': 'internal'},
        {'title': 'AWS Transit Gateway ピアリング完全ガイド', 'path': 'networking/transit-gateway-peering-guide.html', 'type': 'internal'},
        {'title': 'Transit Gateway 共有', 'path': 'organizational-complexity/aws-ram-tgw-sharing.html', 'type': 'internal'},
    ],
    r'Site-to-Site\s*VPN|VPN接続|Customer\s*Gateway': [
        {'title': 'VPN with Direct Connect ガイド', 'path': 'networking/aws-vpn-with-direct-connect-guide.html', 'type': 'internal'},
        {'title': 'Direct Connect 暗号化 VPN', 'path': 'networking/direct_connect_encryption_vpn.html', 'type': 'internal'},
    ],
    r'NAT\s*Gateway|NAT|EIP|Elastic\s*IP': [
        {'title': 'EIP & NAT インフォグラフィック', 'path': 'new-solutions/aws_eip_nat_infographic.html', 'type': 'internal'},
    ],
    r'ENI|Elastic\s*Network\s*Interface|ネットワークインターフェース': [
        {'title': 'ENI インフォグラフィック', 'path': 'networking/aws-eni-infographic.html', 'type': 'internal'},
    ],
    r'Flow\s*Logs|フローログ': [
        {'title': 'Amazon VPC Network Access Analyzer 完全図解ガイド', 'path': 'networking/vpc-network-access-analyzer-guide.html', 'type': 'internal'},
    ],
    r'NLB|ALB|ELB|Load\s*Balancer|ロードバランサ': [
        {'title': 'AWS ゲートウェイ', 'path': 'networking/aws-gateways.html', 'type': 'internal'},
    ],
    r'VPC\s*Lattice|サービスメッシュ': [
        {'title': 'AWS ゲートウェイ', 'path': 'networking/aws-gateways.html', 'type': 'internal'},
    ],
    r'NACL|ネットワークACL|セキュリティグループ': [
        {'title': 'ネットワークACL vs セキュリティグループ 完全ガイド', 'path': 'networking/nacl-sg-comparison-guide.html', 'type': 'internal'},
    ],
    r'MTU|ジャンボフレーム': [
        {'title': 'ジャンボフレーム＆MTU問題 完全図解ガイド', 'path': 'networking/jumbo-frame-mtu-guide.html', 'type': 'internal'},
        {'title': 'EC2インスタンスのネットワークMTU完全ガイド', 'path': 'networking/ec2-mtu-guide.html', 'type': 'internal'},
    ],
    r'CIDR|プレフィックス': [
        {'title': 'CIDRブロック集約と許可プレフィックスリスト完全ガイド', 'path': 'networking/cidr-aggregation-prefix-list-guide.html', 'type': 'internal'},
    ],
    r'Cloud\s*WAN': [
        {'title': 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド', 'path': 'networking/cloud-wan-attachment-policy-guide.html', 'type': 'internal'},
    ],

    # セキュリティ・ガバナンス系
    r'IAM\s*Role|一時的な認証|AssumeRole|ロール': [
        {'title': 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', 'path': 'security-governance/iam-role-policies-guide.html', 'type': 'internal'},
        {'title': 'IAM 権限評価モデル & 操作経路 完全ガイド', 'path': 'security-governance/iam-permission-evaluation-guide.html', 'type': 'internal'},
    ],
    r'SCP|Service\s*Control\s*Policy|Organizations': [
        {'title': 'SCP 簡単解説', 'path': 'organizational-complexity/aws-scp-simplified.html', 'type': 'internal'},
        {'title': 'AWS SCP構文 完全図解ガイド', 'path': 'security-governance/scp-syntax-visual-guide.html', 'type': 'internal'},
        {'title': 'Organizations インフォグラフィック', 'path': 'organizational-complexity/aws_org_infographic.html', 'type': 'internal'},
    ],
    r'WAF|Web\s*Application\s*Firewall': [
        {'title': 'CloudFront HTTPセキュリティヘッダー完全ガイド', 'path': 'networking/cloudfront-security-headers-guide.html', 'type': 'internal'},
    ],
    r'CloudTrail|監査ログ': [
        {'title': 'CloudTrail 整合性検証 & ダイジェストファイル 完全ガイド', 'path': 'security-governance/cloudtrail-integrity-validation-guide.html', 'type': 'internal'},
        {'title': 'CloudTrail ログプレフィックス完全ガイド', 'path': 'security-governance/cloudtrail-log-prefix-guide.html', 'type': 'internal'},
        {'title': 'CloudTrail 管理イベント vs データイベント 完全ガイド', 'path': 'security-governance/cloudtrail-events-guide.html', 'type': 'internal'},
        {'title': 'AWS CloudTrail主要操作 完全図解ガイド', 'path': 'security-governance/cloudtrail-operations-guide.html', 'type': 'internal'},
    ],
    r'Config|コンフィグ': [
        {'title': 'AWS Config × Organizations 完全ガイド', 'path': 'security-governance/aws-config-organizations-guide.html', 'type': 'internal'},
        {'title': 'AWS Config コンフォーマンスパック & StackSets 完全ガイド', 'path': 'security-governance/aws-config-conformance-stacksets-guide.html', 'type': 'internal'},
        {'title': 'AWS Config - S3パブリックアクセス検出完全ガイド', 'path': 'security-governance/aws-config-s3-public-access-guide.html', 'type': 'internal'},
    ],
    r'GuardDuty|脅威検出': [
        {'title': 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', 'path': 'networking/guardduty-credential-exfiltration-guide-v2.html', 'type': 'internal'},
    ],
    r'Parameter\s*Store|Secrets\s*Manager|秘密管理': [
        {'title': 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', 'path': 'security-governance/kms-grants-guide.html', 'type': 'internal'},
    ],
    r'Macie|機密データ|PII': [
        {'title': 'AWS Config - S3パブリックアクセス検出完全ガイド', 'path': 'security-governance/aws-config-s3-public-access-guide.html', 'type': 'internal'},
    ],
    r'KMS|暗号化|CMK|キー管理': [
        {'title': 'CMK インフォグラフィック', 'path': 'security-governance/aws_cmk_infographic.html', 'type': 'internal'},
        {'title': 'AWS KMS キーの種類 完全ガイド', 'path': 'security-governance/kms-key-types.html', 'type': 'internal'},
        {'title': 'AWS KMS グラント（Grants）完全ガイド', 'path': 'security-governance/kms-grants-guide.html', 'type': 'internal'},
        {'title': 'AWS KMS スロットリング対策 & Encryption SDK キャッシュ完全ガイド', 'path': 'security-governance/kms-throttling-encryption-sdk-guide.html', 'type': 'internal'},
    ],
    r'Cognito|認証|フェデレーション': [
        {'title': 'AWS Cognito インフォグラフィック', 'path': 'security-governance/aws-cognito-infographic.html', 'type': 'internal'},
        {'title': 'Cognito IDプールIAMロール完全ガイド', 'path': 'security-governance/cognito-identity-pool-roles-guide.html', 'type': 'internal'},
        {'title': 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', 'path': 'security-governance/cognito-pre-signup-trigger-guide.html', 'type': 'internal'},
    ],
    r'SAML|IdP|フェデレーション': [
        {'title': 'IAM フェデレーション', 'path': 'continuous-improvement/iam_federation_infographic.html', 'type': 'internal'},
        {'title': 'SAML証明書ローテーション完全ガイド', 'path': 'security-governance/saml-certificate-rotation-guide.html', 'type': 'internal'},
        {'title': 'SAML障害時のブレークグラスユーザー完全ガイド', 'path': 'security-governance/breakglass-user-guide.html', 'type': 'internal'},
    ],
    r'Control\s*Tower|ガードレール': [
        {'title': 'Control Tower Guardrails', 'path': 'security-governance/aws-control-tower-guardrails.html', 'type': 'internal'},
        {'title': 'Organization & Control Tower', 'path': 'security-governance/aws-organization-control-tower.html', 'type': 'internal'},
        {'title': 'Control Tower 自動展開 (CfCT) ガイド', 'path': 'organizational-complexity/control-tower-cfct-guide.html', 'type': 'internal'},
    ],
    r'ACM|証明書|SSL|TLS': [
        {'title': 'ACM SAN インフォグラフィック', 'path': 'security-governance/acm-san-infographic.html', 'type': 'internal'},
    ],
    r'API\s*Gateway': [
        {'title': 'API Gateway 認証・認可', 'path': 'security-governance/api_gateway_auth_infographic.html', 'type': 'internal'},
    ],
    r'Inspector|脆弱性': [
        {'title': 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', 'path': 'security-governance/amazon-inspector-agentless-guide.html', 'type': 'internal'},
        {'title': 'Amazon Inspector Lambda関数スキャン 完全図解ガイド', 'path': 'security-governance/inspector-lambda-scan-guide.html', 'type': 'internal'},
    ],
    r'Security\s*Hub': [
        {'title': 'AWS Security Hub 設定ポリシー完全図解ガイド', 'path': 'security-governance/securityhub-configuration-policies-guide.html', 'type': 'internal'},
        {'title': 'CIS AWS Foundations ベンチマーク継続評価ガイド', 'path': 'security-governance/cis-benchmark-security-hub-config-guide.html', 'type': 'internal'},
    ],
    r'MFA|多要素認証': [
        {'title': 'IAM MFA緊急時の救済ガイド', 'path': 'security-governance/iam-mfa-emergency-rescue-guide.html', 'type': 'internal'},
    ],
    r'IAM\s*Identity\s*Center|SSO': [
        {'title': 'IAM Identity Center 完全ガイド - Organizations一括管理', 'path': 'security-governance/iam-identity-center-guide.html', 'type': 'internal'},
        {'title': 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito', 'path': 'security-governance/iam-identity-center-comparison-guide.html', 'type': 'internal'},
    ],
    r'Permission\s*Boundary|パーミッションバウンダリ': [
        {'title': 'IAM パーミッションバウンダリー 完全ガイド', 'path': 'security-governance/iam-permission-boundary-guide.html', 'type': 'internal'},
    ],
    r'Access\s*Analyzer': [
        {'title': 'IAM Access Analyzer 完全ガイド', 'path': 'security-governance/iam-access-analyzer-guide.html', 'type': 'internal'},
        {'title': 'IAM Access Analyzer ポリシー生成機能 完全ガイド', 'path': 'security-governance/iam-access-analyzer-policy-generation-guide.html', 'type': 'internal'},
    ],
    r'ABAC|タグベース': [
        {'title': 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', 'path': 'security-governance/abac-principaltag-resourcetag-guide.html', 'type': 'internal'},
    ],
    r'Nitro\s*Enclave': [
        {'title': 'AWS Nitro Enclaves 完全ガイド', 'path': 'security-governance/nitro-enclaves-guide.html', 'type': 'internal'},
    ],
    r'Well-?Architected': [
        {'title': 'AWS Well-Architected フレームワーク 完全図解ガイド', 'path': 'security-governance/aws-well-architected-complete-guide.html', 'type': 'internal'},
    ],

    # コンピュート・アプリケーション系
    r'Auto\s*Scaling|スケーリング': [
        {'title': 'EC2 Auto Scaling ターゲット追跡ガイド', 'path': 'compute-applications/ec2-auto-scaling-target-tracking-guide.html', 'type': 'internal'},
        {'title': 'ASG スケーリングポリシー完全ガイド', 'path': 'compute-applications/asg-scaling-policies-guide.html', 'type': 'internal'},
    ],
    r'Lambda|サーバーレス': [
        {'title': 'Lambda エフェメラルストレージ完全ガイド', 'path': 'compute-applications/lambda-ephemeral-storage-guide.html', 'type': 'internal'},
        {'title': 'Lambda レイヤー完全ガイド', 'path': 'compute-applications/lambda-layers-guide.html', 'type': 'internal'},
        {'title': 'Lambda VPC接続完全ガイド', 'path': 'compute-applications/lambda-vpc-connection-guide.html', 'type': 'internal'},
    ],
    r'ECS|Fargate|コンテナ': [
        {'title': 'ECS 高可用性パターン完全ガイド', 'path': 'compute-applications/ecs-high-availability-guide.html', 'type': 'internal'},
        {'title': 'Fargate Spot 完全ガイド', 'path': 'compute-applications/fargate-spot-guide.html', 'type': 'internal'},
    ],
    r'EKS|Kubernetes': [
        {'title': 'Amazon EKS セキュリティ完全図解ガイド', 'path': 'networking/eks-security-visual-guide.html', 'type': 'internal'},
        {'title': 'EKS コントロールプレーンログ & CloudTrail 監査ログ 完全図解ガイド', 'path': 'security-governance/eks-control-plane-logging-guide.html', 'type': 'internal'},
    ],
    r'EC2|インスタンス': [
        {'title': 'EC2インスタンスのネットワークMTU完全ガイド', 'path': 'networking/ec2-mtu-guide.html', 'type': 'internal'},
    ],
    r'Step\s*Functions|ステートマシン': [
        {'title': 'Step Functions 完全ガイド', 'path': 'compute-applications/step-functions-guide.html', 'type': 'internal'},
    ],
    r'EventBridge|イベント': [
        {'title': 'EventBridge vs SNS/SQS 完全比較ガイド', 'path': 'compute-applications/eventbridge-comparison-guide.html', 'type': 'internal'},
    ],

    # ストレージ・データベース系
    r'S3|オブジェクトストレージ': [
        {'title': 'S3バケットポリシー Principal要素 完全ガイド', 'path': 'networking/s3-bucket-policy-principal-guide.html', 'type': 'internal'},
        {'title': 'S3バケットポリシー × VPCエンドポイント完全ガイド', 'path': 'networking/s3-vpc-endpoint-policy-guide.html', 'type': 'internal'},
    ],
    r'Aurora|RDS|データベース': [
        {'title': 'Aurora グローバルデータベース完全ガイド', 'path': 'storage-database/aurora-global-database-guide.html', 'type': 'internal'},
    ],
    r'DynamoDB': [
        {'title': 'DynamoDB グローバルテーブル完全ガイド', 'path': 'storage-database/dynamodb-global-tables-guide.html', 'type': 'internal'},
    ],
    r'ElastiCache|Redis|キャッシュ': [
        {'title': 'ElastiCache 完全ガイド', 'path': 'storage-database/elasticache-guide.html', 'type': 'internal'},
    ],
    r'EBS|ブロックストレージ': [
        {'title': 'EBS ボリューム種類完全ガイド', 'path': 'storage-database/ebs-volume-types-guide.html', 'type': 'internal'},
    ],
    r'EFS|ファイルシステム': [
        {'title': 'EFS 完全ガイド', 'path': 'storage-database/efs-guide.html', 'type': 'internal'},
    ],
    r'Storage\s*Gateway': [
        {'title': 'Storage Gateway RefreshCache 自動化完全ガイド', 'path': 'security-governance/storage-gateway-refreshcache-automation-guide.html', 'type': 'internal'},
    ],

    # 移行・モダナイゼーション系
    r'DMS|Database\s*Migration|データベース移行': [
        {'title': 'AWS DMS 完全ガイド', 'path': 'migration/dms-guide.html', 'type': 'internal'},
    ],
    r'Migration\s*Hub|移行': [
        {'title': 'Migration Hub 完全ガイド', 'path': 'migration/migration-hub-guide.html', 'type': 'internal'},
    ],
    r'DR|災害復旧|Disaster\s*Recovery': [
        {'title': 'DR戦略完全ガイド', 'path': 'migration/dr-strategy-guide.html', 'type': 'internal'},
    ],

    # 分析・ビッグデータ系
    r'Kinesis|ストリーミング': [
        {'title': 'Kinesis 完全ガイド', 'path': 'analytics-bigdata/kinesis-guide.html', 'type': 'internal'},
    ],
    r'Redshift|データウェアハウス': [
        {'title': 'Redshift 完全ガイド', 'path': 'analytics-bigdata/redshift-guide.html', 'type': 'internal'},
    ],
    r'Athena': [
        {'title': 'Athena 完全ガイド', 'path': 'analytics-bigdata/athena-guide.html', 'type': 'internal'},
    ],
    r'Glue|ETL': [
        {'title': 'Glue 完全ガイド', 'path': 'analytics-bigdata/glue-guide.html', 'type': 'internal'},
    ],
    r'QuickSight|BI': [
        {'title': 'QuickSight 完全ガイド', 'path': 'analytics-bigdata/quicksight-guide.html', 'type': 'internal'},
    ],
    r'OpenSearch|Elasticsearch': [
        {'title': 'OpenSearch Dashboards によるログデータの可視化 完全ガイド', 'path': 'security-governance/opensearch-dashboards-guide.html', 'type': 'internal'},
    ],

    # 開発・デプロイ系
    r'CloudFormation|IaC|インフラコード': [
        {'title': 'CloudFormationドリフト検出と自動修復完全ガイド', 'path': 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html', 'type': 'internal'},
    ],
    r'CodeDeploy|CI/CD|デプロイ': [
        {'title': 'CodeDeploy 完全ガイド', 'path': 'development-deployment/codedeploy-guide.html', 'type': 'internal'},
    ],
    r'CodePipeline|パイプライン': [
        {'title': 'CodePipeline 完全ガイド', 'path': 'development-deployment/codepipeline-guide.html', 'type': 'internal'},
    ],
    r'CodeArtifact|アーティファクト': [
        {'title': 'AWS CodeArtifact 完全ガイド', 'path': 'security-governance/codeartifact-guide.html', 'type': 'internal'},
    ],

    # コンテンツ配信・DNS系
    r'CloudFront|CDN': [
        {'title': 'CloudFront HTTPセキュリティヘッダー完全ガイド', 'path': 'networking/cloudfront-security-headers-guide.html', 'type': 'internal'},
    ],
    r'Route\s*53|DNS': [
        {'title': 'Route 53 完全ガイド', 'path': 'content-delivery-dns/route53-guide.html', 'type': 'internal'},
    ],
    r'Global\s*Accelerator': [
        {'title': 'Global Accelerator 完全ガイド', 'path': 'content-delivery-dns/global-accelerator-guide.html', 'type': 'internal'},
    ],

    # コスト管理系
    r'Savings\s*Plans|コスト|料金': [
        {'title': 'Savings Plans 完全ガイド', 'path': 'cost-control/savings-plans-guide.html', 'type': 'internal'},
    ],
    r'Reserved|予約|RI': [
        {'title': 'Reserved Instances 完全ガイド', 'path': 'cost-control/reserved-instances-guide.html', 'type': 'internal'},
    ],
    r'Spot|スポット': [
        {'title': 'Fargate Spot 完全ガイド', 'path': 'compute-applications/fargate-spot-guide.html', 'type': 'internal'},
    ],

    # RAM・共有系
    r'RAM|Resource\s*Access\s*Manager|リソース共有': [
        {'title': 'RAM VPC プレフィックス', 'path': 'organizational-complexity/aws_ram_vpc_prefix_infographic.html', 'type': 'internal'},
        {'title': 'Transit Gateway 共有', 'path': 'organizational-complexity/aws-ram-tgw-sharing.html', 'type': 'internal'},
    ],

    # ログ・モニタリング系
    r'CloudWatch|監視|メトリクス': [
        {'title': 'CloudWatch Logs 集中集約完全ガイド', 'path': 'security-governance/cloudwatch-logs-subscription-guide.html', 'type': 'internal'},
        {'title': 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', 'path': 'security-governance/aws-monitoring-guide.html', 'type': 'internal'},
    ],
    r'Systems\s*Manager|SSM|パッチ': [
        {'title': 'Systems Manager 完全ガイド', 'path': 'continuous-improvement/systems-manager-guide.html', 'type': 'internal'},
    ],

    # Directory系
    r'Directory|AD|Active\s*Directory': [
        {'title': 'AWS Directory Service 完全ガイド', 'path': 'networking/aws-directory-service-guide.html', 'type': 'internal'},
    ],

    # CLI・SDK系
    r'CLI|SDK': [
        {'title': 'AWS CLI 認証情報の指定方法 完全ガイド', 'path': 'security-governance/aws-cli-credentials-guide.html', 'type': 'internal'},
    ],

    # IAM Roles Anywhere
    r'Roles\s*Anywhere|オンプレミス.*IAM': [
        {'title': 'IAM Roles Anywhere 完全ガイド', 'path': 'security-governance/iam-roles-anywhere-guide.html', 'type': 'internal'},
    ],

    # Q Business
    r'Amazon\s*Q|生成AI': [
        {'title': 'Amazon Q Business アクセス制御 & ガードレール完全ガイド', 'path': 'security-governance/amazon-q-business-access-guardrails-guide.html', 'type': 'internal'},
    ],

    # Time Sync
    r'NTP|時刻同期': [
        {'title': 'Amazon Time Sync Service 完全図解ガイド', 'path': 'security-governance/amazon-time-sync-service-guide.html', 'type': 'internal'},
    ],
}

# AWS公式ドキュメントリンク（カテゴリー別）
AWS_DOCS = {
    'vpc': {'title': 'AWS VPC Documentation', 'url': 'https://docs.aws.amazon.com/vpc/latest/userguide/', 'type': 'external'},
    'direct-connect': {'title': 'AWS Direct Connect Documentation', 'url': 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/', 'type': 'external'},
    'transit-gateway': {'title': 'AWS Transit Gateway Documentation', 'url': 'https://docs.aws.amazon.com/vpc/latest/tgw/', 'type': 'external'},
    'iam': {'title': 'AWS IAM Documentation', 'url': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/', 'type': 'external'},
    'organizations': {'title': 'AWS Organizations Documentation', 'url': 'https://docs.aws.amazon.com/organizations/latest/userguide/', 'type': 'external'},
    'kms': {'title': 'AWS KMS Documentation', 'url': 'https://docs.aws.amazon.com/kms/latest/developerguide/', 'type': 'external'},
    'cloudtrail': {'title': 'AWS CloudTrail Documentation', 'url': 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/', 'type': 'external'},
    'config': {'title': 'AWS Config Documentation', 'url': 'https://docs.aws.amazon.com/config/latest/developerguide/', 'type': 'external'},
    'guardduty': {'title': 'AWS GuardDuty Documentation', 'url': 'https://docs.aws.amazon.com/guardduty/latest/ug/', 'type': 'external'},
    'lambda': {'title': 'AWS Lambda Documentation', 'url': 'https://docs.aws.amazon.com/lambda/latest/dg/', 'type': 'external'},
    'ecs': {'title': 'Amazon ECS Documentation', 'url': 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/', 'type': 'external'},
    's3': {'title': 'Amazon S3 Documentation', 'url': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/', 'type': 'external'},
    'rds': {'title': 'Amazon RDS Documentation', 'url': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/', 'type': 'external'},
    'dynamodb': {'title': 'Amazon DynamoDB Documentation', 'url': 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/', 'type': 'external'},
    'cloudfront': {'title': 'Amazon CloudFront Documentation', 'url': 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/', 'type': 'external'},
    'route53': {'title': 'Amazon Route 53 Documentation', 'url': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/', 'type': 'external'},
    'cognito': {'title': 'Amazon Cognito Documentation', 'url': 'https://docs.aws.amazon.com/cognito/latest/developerguide/', 'type': 'external'},
    'waf': {'title': 'AWS WAF Documentation', 'url': 'https://docs.aws.amazon.com/waf/latest/developerguide/', 'type': 'external'},
}


def find_matching_resources(text: str) -> List[Dict]:
    """テキストからキーワードをマッチングしてリソースを返す"""
    matched = []
    seen_paths = set()

    for pattern, resources in KEYWORD_RESOURCE_MAP.items():
        if re.search(pattern, text, re.IGNORECASE):
            for resource in resources:
                # 重複を避ける
                path_or_url = resource.get('path', resource.get('url', ''))
                if path_or_url not in seen_paths:
                    matched.append(resource)
                    seen_paths.add(path_or_url)

    # 最大3つまでに制限
    return matched[:3]


def add_external_doc_link(text: str, existing_resources: List[Dict]) -> List[Dict]:
    """AWS公式ドキュメントリンクを追加（必要に応じて）"""
    result = existing_resources.copy()

    # 既に3つ以上ある場合は追加しない
    if len(result) >= 3:
        return result

    # キーワードとドキュメントのマッピング
    doc_keywords = {
        'vpc': [r'VPC', r'Peering', r'PrivateLink', r'Endpoint'],
        'direct-connect': [r'Direct\s*Connect', r'DX'],
        'transit-gateway': [r'Transit\s*Gateway', r'TGW'],
        'iam': [r'IAM', r'ロール', r'ポリシー', r'認証'],
        'organizations': [r'Organizations', r'SCP', r'OU'],
        'kms': [r'KMS', r'CMK', r'暗号化'],
        'cloudtrail': [r'CloudTrail', r'監査'],
        'config': [r'Config', r'コンフィグ'],
        'guardduty': [r'GuardDuty'],
        'lambda': [r'Lambda'],
        'ecs': [r'ECS', r'Fargate'],
        's3': [r'S3', r'バケット'],
        'rds': [r'RDS', r'Aurora', r'データベース'],
        'dynamodb': [r'DynamoDB'],
        'cloudfront': [r'CloudFront', r'CDN'],
        'route53': [r'Route\s*53', r'DNS'],
        'cognito': [r'Cognito'],
        'waf': [r'WAF'],
    }

    seen_urls = {r.get('url', '') for r in result}

    for doc_key, patterns in doc_keywords.items():
        if len(result) >= 3:
            break

        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                doc = AWS_DOCS.get(doc_key)
                if doc and doc['url'] not in seen_urls:
                    result.append(doc)
                    seen_urls.add(doc['url'])
                    break

    return result[:3]


def main():
    """メイン処理"""
    quiz_file = PROJECT_ROOT / 'quiz-data-extended.js'

    print("Quiz問題に関連リソースをマッピングしています...")
    print(f"対象ファイル: {quiz_file}")

    # quiz-data-extended.js を読み込み
    content = quiz_file.read_text(encoding='utf-8')

    # 各問題を解析してマッピング
    # 問題ごとに解析（簡易的なアプローチ）
    question_pattern = re.compile(
        r'\{\s*id:\s*(\d+),\s*question:\s*"([^"]+)".*?explanation:\s*"([^"]+)"',
        re.DOTALL
    )

    results = []
    for match in question_pattern.finditer(content):
        question_id = int(match.group(1))
        question_text = match.group(2)
        explanation_text = match.group(3)

        combined_text = f"{question_text} {explanation_text}"
        resources = find_matching_resources(combined_text)
        resources = add_external_doc_link(combined_text, resources)

        if resources:
            results.append({
                'id': question_id,
                'question_preview': question_text[:50] + '...',
                'resources': resources
            })

    # 結果をJSONで出力
    output_file = PROJECT_ROOT / 'scripts' / 'quiz' / 'resource_mappings.json'
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nマッピング完了!")
    print(f"総問題数: {len(results)}")
    print(f"出力ファイル: {output_file}")

    # サマリー表示
    internal_count = sum(1 for r in results for res in r['resources'] if res.get('type') == 'internal')
    external_count = sum(1 for r in results for res in r['resources'] if res.get('type') == 'external')
    print(f"内部リンク総数: {internal_count}")
    print(f"外部リンク総数: {external_count}")


if __name__ == '__main__':
    main()
