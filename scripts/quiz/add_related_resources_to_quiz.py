#!/usr/bin/env python3
"""
quiz-data-extended.js に relatedResources フィールドを追加するスクリプト
"""

import re
import json
from pathlib import Path
from typing import Dict, List, Tuple

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent.parent

# キーワード → リソースのマッピング定義（改良版）
KEYWORD_RESOURCE_MAP = {
    # ネットワーキング系
    r'VPC\s*Peering|ピアリング': [
        {'title': 'AWS Transit Gateway ピアリング完全ガイド', 'path': 'networking/transit-gateway-peering-guide.html', 'type': 'internal'},
        {'title': 'AWS VPC Documentation', 'url': 'https://docs.aws.amazon.com/vpc/latest/userguide/', 'type': 'external'},
    ],
    r'Direct\s*Connect(?!.*Gateway)|専用線|DX': [
        {'title': 'Direct Connect ガイド', 'path': 'networking/aws-direct-connect-guide.html', 'type': 'internal'},
        {'title': 'AWS Direct Connect BGP ルーティング完全ガイド', 'path': 'networking/direct-connect-bgp-routing-guide.html', 'type': 'internal'},
        {'title': 'AWS Direct Connect Documentation', 'url': 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/', 'type': 'external'},
    ],
    r'PrivateLink|VPC\s*Endpoint(?!.*Service)|エンドポイント': [
        {'title': 'VPN vs PrivateLink', 'path': 'new-solutions/vpn-vs-privatelink.html', 'type': 'internal'},
        {'title': 'S3バケットポリシー × VPCエンドポイント完全ガイド', 'path': 'networking/s3-vpc-endpoint-policy-guide.html', 'type': 'internal'},
    ],
    r'Endpoint\s*Service|VPC\s*Endpoint\s*Service': [
        {'title': 'VPN vs PrivateLink', 'path': 'new-solutions/vpn-vs-privatelink.html', 'type': 'internal'},
    ],
    r'Transit\s*Gateway|TGW': [
        {'title': 'AWS Transit Gateway Deep Dive 完全ガイド', 'path': 'networking/transit-gateway-deep-dive.html', 'type': 'internal'},
        {'title': 'AWS Transit Gateway ピアリング完全ガイド', 'path': 'networking/transit-gateway-peering-guide.html', 'type': 'internal'},
        {'title': 'AWS Transit Gateway Documentation', 'url': 'https://docs.aws.amazon.com/vpc/latest/tgw/', 'type': 'external'},
    ],
    r'Site-to-Site\s*VPN|VPN接続|Customer\s*Gateway': [
        {'title': 'VPN with Direct Connect ガイド', 'path': 'networking/aws-vpn-with-direct-connect-guide.html', 'type': 'internal'},
        {'title': 'Direct Connect 暗号化 VPN', 'path': 'networking/direct_connect_encryption_vpn.html', 'type': 'internal'},
    ],
    r'NAT\s*Gateway|NAT(?!ive)': [
        {'title': 'EIP & NAT インフォグラフィック', 'path': 'new-solutions/aws_eip_nat_infographic.html', 'type': 'internal'},
    ],
    r'Elastic\s*IP|EIP': [
        {'title': 'EIP & NAT インフォグラフィック', 'path': 'new-solutions/aws_eip_nat_infographic.html', 'type': 'internal'},
    ],
    r'ENI|Elastic\s*Network\s*Interface|ネットワークインターフェース': [
        {'title': 'ENI インフォグラフィック', 'path': 'networking/aws-eni-infographic.html', 'type': 'internal'},
    ],
    r'Flow\s*Logs|フローログ': [
        {'title': 'Amazon VPC Network Access Analyzer 完全図解ガイド', 'path': 'networking/vpc-network-access-analyzer-guide.html', 'type': 'internal'},
    ],
    r'NLB|Network\s*Load\s*Balancer': [
        {'title': 'AWS ゲートウェイ', 'path': 'networking/aws-gateways.html', 'type': 'internal'},
    ],
    r'ALB|Application\s*Load\s*Balancer': [
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
    ],
    r'CIDR|プレフィックス': [
        {'title': 'CIDRブロック集約と許可プレフィックスリスト完全ガイド', 'path': 'networking/cidr-aggregation-prefix-list-guide.html', 'type': 'internal'},
    ],
    r'Cloud\s*WAN': [
        {'title': 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド', 'path': 'networking/cloud-wan-attachment-policy-guide.html', 'type': 'internal'},
    ],

    # セキュリティ・ガバナンス系
    r'IAM\s*Role|一時的な認証|AssumeRole': [
        {'title': 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', 'path': 'security-governance/iam-role-policies-guide.html', 'type': 'internal'},
        {'title': 'IAM 権限評価モデル & 操作経路 完全ガイド', 'path': 'security-governance/iam-permission-evaluation-guide.html', 'type': 'internal'},
        {'title': 'AWS IAM Documentation', 'url': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/', 'type': 'external'},
    ],
    r'SCP|Service\s*Control\s*Policy': [
        {'title': 'SCP 簡単解説', 'path': 'organizational-complexity/aws-scp-simplified.html', 'type': 'internal'},
        {'title': 'AWS SCP構文 完全図解ガイド', 'path': 'security-governance/scp-syntax-visual-guide.html', 'type': 'internal'},
        {'title': 'AWS Organizations Documentation', 'url': 'https://docs.aws.amazon.com/organizations/latest/userguide/', 'type': 'external'},
    ],
    r'Organizations': [
        {'title': 'Organizations インフォグラフィック', 'path': 'organizational-complexity/aws_org_infographic.html', 'type': 'internal'},
        {'title': 'Organization & Control Tower', 'path': 'security-governance/aws-organization-control-tower.html', 'type': 'internal'},
    ],
    r'WAF|Web\s*Application\s*Firewall': [
        {'title': 'CloudFront HTTPセキュリティヘッダー完全ガイド', 'path': 'networking/cloudfront-security-headers-guide.html', 'type': 'internal'},
        {'title': 'AWS WAF Documentation', 'url': 'https://docs.aws.amazon.com/waf/latest/developerguide/', 'type': 'external'},
    ],
    r'CloudTrail': [
        {'title': 'CloudTrail 管理イベント vs データイベント 完全ガイド', 'path': 'security-governance/cloudtrail-events-guide.html', 'type': 'internal'},
        {'title': 'AWS CloudTrail主要操作 完全図解ガイド', 'path': 'security-governance/cloudtrail-operations-guide.html', 'type': 'internal'},
        {'title': 'AWS CloudTrail Documentation', 'url': 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/', 'type': 'external'},
    ],
    r'Config(?!\s*ur)': [
        {'title': 'AWS Config × Organizations 完全ガイド', 'path': 'security-governance/aws-config-organizations-guide.html', 'type': 'internal'},
        {'title': 'AWS Config コンフォーマンスパック & StackSets 完全ガイド', 'path': 'security-governance/aws-config-conformance-stacksets-guide.html', 'type': 'internal'},
        {'title': 'AWS Config Documentation', 'url': 'https://docs.aws.amazon.com/config/latest/developerguide/', 'type': 'external'},
    ],
    r'GuardDuty': [
        {'title': 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', 'path': 'networking/guardduty-credential-exfiltration-guide-v2.html', 'type': 'internal'},
        {'title': 'AWS GuardDuty Documentation', 'url': 'https://docs.aws.amazon.com/guardduty/latest/ug/', 'type': 'external'},
    ],
    r'Parameter\s*Store|Secrets\s*Manager': [
        {'title': 'AWS KMS グラント（Grants）完全ガイド', 'path': 'security-governance/kms-grants-guide.html', 'type': 'internal'},
    ],
    r'Macie|機密データ|PII': [
        {'title': 'AWS Config - S3パブリックアクセス検出完全ガイド', 'path': 'security-governance/aws-config-s3-public-access-guide.html', 'type': 'internal'},
    ],
    r'KMS|暗号化|CMK|カスタマーマスターキー': [
        {'title': 'AWS KMS キーの種類 完全ガイド', 'path': 'security-governance/kms-key-types.html', 'type': 'internal'},
        {'title': 'CMK インフォグラフィック', 'path': 'security-governance/aws_cmk_infographic.html', 'type': 'internal'},
        {'title': 'AWS KMS Documentation', 'url': 'https://docs.aws.amazon.com/kms/latest/developerguide/', 'type': 'external'},
    ],
    r'Cognito': [
        {'title': 'AWS Cognito インフォグラフィック', 'path': 'security-governance/aws-cognito-infographic.html', 'type': 'internal'},
        {'title': 'Cognito IDプールIAMロール完全ガイド', 'path': 'security-governance/cognito-identity-pool-roles-guide.html', 'type': 'internal'},
        {'title': 'Amazon Cognito Documentation', 'url': 'https://docs.aws.amazon.com/cognito/latest/developerguide/', 'type': 'external'},
    ],
    r'SAML|IdP|フェデレーション': [
        {'title': 'IAM フェデレーション', 'path': 'continuous-improvement/iam_federation_infographic.html', 'type': 'internal'},
        {'title': 'SAML証明書ローテーション完全ガイド', 'path': 'security-governance/saml-certificate-rotation-guide.html', 'type': 'internal'},
    ],
    r'Control\s*Tower': [
        {'title': 'Control Tower Guardrails', 'path': 'security-governance/aws-control-tower-guardrails.html', 'type': 'internal'},
        {'title': 'Control Tower 自動展開 (CfCT) ガイド', 'path': 'organizational-complexity/control-tower-cfct-guide.html', 'type': 'internal'},
    ],
    r'ACM|証明書': [
        {'title': 'ACM SAN インフォグラフィック', 'path': 'security-governance/acm-san-infographic.html', 'type': 'internal'},
    ],
    r'API\s*Gateway': [
        {'title': 'API Gateway 認証・認可', 'path': 'security-governance/api_gateway_auth_infographic.html', 'type': 'internal'},
    ],
    r'Inspector': [
        {'title': 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', 'path': 'security-governance/amazon-inspector-agentless-guide.html', 'type': 'internal'},
    ],
    r'Security\s*Hub': [
        {'title': 'AWS Security Hub 設定ポリシー完全図解ガイド', 'path': 'security-governance/securityhub-configuration-policies-guide.html', 'type': 'internal'},
    ],
    r'MFA|多要素認証': [
        {'title': 'IAM MFA緊急時の救済ガイド', 'path': 'security-governance/iam-mfa-emergency-rescue-guide.html', 'type': 'internal'},
    ],
    r'IAM\s*Identity\s*Center|SSO': [
        {'title': 'IAM Identity Center 完全ガイド', 'path': 'security-governance/iam-identity-center-guide.html', 'type': 'internal'},
    ],
    r'Permission\s*Boundary|パーミッションバウンダリ': [
        {'title': 'IAM パーミッションバウンダリー 完全ガイド', 'path': 'security-governance/iam-permission-boundary-guide.html', 'type': 'internal'},
    ],
    r'Access\s*Analyzer': [
        {'title': 'IAM Access Analyzer 完全ガイド', 'path': 'security-governance/iam-access-analyzer-guide.html', 'type': 'internal'},
    ],
    r'ABAC|タグベース': [
        {'title': 'AWS ABAC完全ガイド', 'path': 'security-governance/abac-principaltag-resourcetag-guide.html', 'type': 'internal'},
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
        {'title': 'Lambda VPC接続完全ガイド', 'path': 'compute-applications/lambda-vpc-connection-guide.html', 'type': 'internal'},
        {'title': 'AWS Lambda Documentation', 'url': 'https://docs.aws.amazon.com/lambda/latest/dg/', 'type': 'external'},
    ],
    r'ECS|Fargate': [
        {'title': 'ECS 高可用性パターン完全ガイド', 'path': 'compute-applications/ecs-high-availability-guide.html', 'type': 'internal'},
        {'title': 'Amazon ECS Documentation', 'url': 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/', 'type': 'external'},
    ],
    r'EKS|Kubernetes': [
        {'title': 'Amazon EKS セキュリティ完全図解ガイド', 'path': 'networking/eks-security-visual-guide.html', 'type': 'internal'},
        {'title': 'EKS コントロールプレーンログ完全図解ガイド', 'path': 'security-governance/eks-control-plane-logging-guide.html', 'type': 'internal'},
    ],
    r'EC2|インスタンス': [
        {'title': 'EC2インスタンスのネットワークMTU完全ガイド', 'path': 'networking/ec2-mtu-guide.html', 'type': 'internal'},
    ],
    r'Step\s*Functions': [
        {'title': 'Step Functions 完全ガイド', 'path': 'compute-applications/step-functions-guide.html', 'type': 'internal'},
    ],
    r'EventBridge': [
        {'title': 'EventBridge vs SNS/SQS 完全比較ガイド', 'path': 'compute-applications/eventbridge-comparison-guide.html', 'type': 'internal'},
    ],

    # ストレージ・データベース系
    r'S3|オブジェクトストレージ|バケット': [
        {'title': 'S3バケットポリシー Principal要素 完全ガイド', 'path': 'networking/s3-bucket-policy-principal-guide.html', 'type': 'internal'},
        {'title': 'Amazon S3 Documentation', 'url': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/', 'type': 'external'},
    ],
    r'Aurora': [
        {'title': 'Aurora グローバルデータベース完全ガイド', 'path': 'storage-database/aurora-global-database-guide.html', 'type': 'internal'},
        {'title': 'Amazon RDS Documentation', 'url': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/', 'type': 'external'},
    ],
    r'RDS|データベース(?!移行)': [
        {'title': 'Amazon RDS Documentation', 'url': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/', 'type': 'external'},
    ],
    r'DynamoDB': [
        {'title': 'DynamoDB グローバルテーブル完全ガイド', 'path': 'storage-database/dynamodb-global-tables-guide.html', 'type': 'internal'},
        {'title': 'Amazon DynamoDB Documentation', 'url': 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/', 'type': 'external'},
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
    r'DR|災害復旧|Disaster\s*Recovery|フェイルオーバー': [
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
    r'CloudFormation|IaC': [
        {'title': 'CloudFormationドリフト検出と自動修復完全ガイド', 'path': 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html', 'type': 'internal'},
    ],
    r'CodeDeploy': [
        {'title': 'CodeDeploy 完全ガイド', 'path': 'development-deployment/codedeploy-guide.html', 'type': 'internal'},
    ],
    r'CodePipeline|CI/CD': [
        {'title': 'CodePipeline 完全ガイド', 'path': 'development-deployment/codepipeline-guide.html', 'type': 'internal'},
    ],
    r'CodeArtifact': [
        {'title': 'AWS CodeArtifact 完全ガイド', 'path': 'security-governance/codeartifact-guide.html', 'type': 'internal'},
    ],

    # コンテンツ配信・DNS系
    r'CloudFront|CDN': [
        {'title': 'CloudFront HTTPセキュリティヘッダー完全ガイド', 'path': 'networking/cloudfront-security-headers-guide.html', 'type': 'internal'},
        {'title': 'Amazon CloudFront Documentation', 'url': 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/', 'type': 'external'},
    ],
    r'Route\s*53|DNS': [
        {'title': 'Route 53 完全ガイド', 'path': 'content-delivery-dns/route53-guide.html', 'type': 'internal'},
        {'title': 'Amazon Route 53 Documentation', 'url': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/', 'type': 'external'},
    ],
    r'Global\s*Accelerator': [
        {'title': 'Global Accelerator 完全ガイド', 'path': 'content-delivery-dns/global-accelerator-guide.html', 'type': 'internal'},
    ],

    # コスト管理系
    r'Savings\s*Plans': [
        {'title': 'Savings Plans 完全ガイド', 'path': 'cost-control/savings-plans-guide.html', 'type': 'internal'},
    ],
    r'Reserved\s*Instance|RI|予約': [
        {'title': 'Reserved Instances 完全ガイド', 'path': 'cost-control/reserved-instances-guide.html', 'type': 'internal'},
    ],
    r'Spot|スポット': [
        {'title': 'Fargate Spot 完全ガイド', 'path': 'compute-applications/fargate-spot-guide.html', 'type': 'internal'},
    ],
    r'コスト|Cost\s*Explorer|Budget': [
        {'title': 'Savings Plans 完全ガイド', 'path': 'cost-control/savings-plans-guide.html', 'type': 'internal'},
    ],

    # RAM・共有系
    r'RAM|Resource\s*Access\s*Manager|リソース共有': [
        {'title': 'RAM VPC プレフィックス', 'path': 'organizational-complexity/aws_ram_vpc_prefix_infographic.html', 'type': 'internal'},
        {'title': 'Transit Gateway 共有', 'path': 'organizational-complexity/aws-ram-tgw-sharing.html', 'type': 'internal'},
    ],

    # ログ・モニタリング系
    r'CloudWatch(?!\s*Logs)': [
        {'title': 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', 'path': 'security-governance/aws-monitoring-guide.html', 'type': 'internal'},
    ],
    r'CloudWatch\s*Logs': [
        {'title': 'CloudWatch Logs 集中集約完全ガイド', 'path': 'security-governance/cloudwatch-logs-subscription-guide.html', 'type': 'internal'},
    ],
    r'Systems\s*Manager|SSM': [
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
    r'Roles\s*Anywhere': [
        {'title': 'IAM Roles Anywhere 完全ガイド', 'path': 'security-governance/iam-roles-anywhere-guide.html', 'type': 'internal'},
    ],

    # Q Business
    r'Amazon\s*Q': [
        {'title': 'Amazon Q Business アクセス制御 & ガードレール完全ガイド', 'path': 'security-governance/amazon-q-business-access-guardrails-guide.html', 'type': 'internal'},
    ],

    # Application Recovery Controller
    r'Application\s*Recovery\s*Controller|ARC': [
        {'title': 'DR戦略完全ガイド', 'path': 'migration/dr-strategy-guide.html', 'type': 'internal'},
    ],

    # マルチテナント
    r'マルチテナント|SaaS': [
        {'title': 'VPN vs PrivateLink', 'path': 'new-solutions/vpn-vs-privatelink.html', 'type': 'internal'},
    ],
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
                    matched.append(resource.copy())
                    seen_paths.add(path_or_url)

                    # 最大3つまで
                    if len(matched) >= 3:
                        return matched

    return matched


def format_resources_js(resources: List[Dict]) -> str:
    """リソースをJavaScript形式の文字列にフォーマット"""
    if not resources:
        return ""

    items = []
    for r in resources:
        if r['type'] == 'internal':
            items.append(f"{{ title: \"{r['title']}\", path: \"{r['path']}\", type: \"internal\" }}")
        else:
            items.append(f"{{ title: \"{r['title']}\", url: \"{r['url']}\", type: \"external\" }}")

    return ",\n                    ".join(items)


def process_quiz_file(content: str) -> str:
    """quiz-data-extended.js の内容を処理してrelatedResourcesを追加"""

    # 各問題のブロックを見つけて処理
    # パターン: { id: N, question: "...", options: [...], correct: N, explanation: "..." }

    def replace_question(match):
        full_match = match.group(0)

        # 既にrelatedResourcesがある場合はスキップ
        if 'relatedResources' in full_match:
            return full_match

        # 問題文と解説を抽出
        question_match = re.search(r'question:\s*"([^"]*)"', full_match)
        explanation_match = re.search(r'explanation:\s*"([^"]*)"', full_match)

        if not question_match or not explanation_match:
            return full_match

        question_text = question_match.group(1)
        explanation_text = explanation_match.group(1)
        combined_text = f"{question_text} {explanation_text}"

        # マッチするリソースを検索
        resources = find_matching_resources(combined_text)

        if not resources:
            return full_match

        # relatedResourcesを追加
        resources_js = format_resources_js(resources)

        # explanationの後にrelatedResourcesを挿入
        # explanation: "..." の後に追加
        new_content = re.sub(
            r'(explanation:\s*"[^"]*")',
            rf'\1,\n                relatedResources: [\n                    {resources_js}\n                ]',
            full_match
        )

        return new_content

    # 各問題ブロックを処理
    # パターン: { id: N, ... } でブレースのバランスを考慮
    pattern = r'\{\s*id:\s*\d+,\s*question:[^}]+explanation:\s*"[^"]*"\s*\}'

    result = re.sub(pattern, replace_question, content)

    return result


def main():
    """メイン処理"""
    quiz_file = PROJECT_ROOT / 'quiz-data-extended.js'
    backup_file = PROJECT_ROOT / 'quiz-data-extended.js.backup'

    print("quiz-data-extended.js に relatedResources を追加しています...")

    # バックアップを作成
    content = quiz_file.read_text(encoding='utf-8')
    backup_file.write_text(content, encoding='utf-8')
    print(f"バックアップ作成: {backup_file}")

    # 処理を実行
    new_content = process_quiz_file(content)

    # 結果を書き込み
    quiz_file.write_text(new_content, encoding='utf-8')

    # 統計を表示
    added_count = new_content.count('relatedResources')
    print(f"\n処理完了!")
    print(f"relatedResources追加数: {added_count}")


if __name__ == '__main__':
    main()
