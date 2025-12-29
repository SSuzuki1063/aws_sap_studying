// 全リソースデータ
const searchData = [
    // ネットワーキング
    { title: 'Direct Connect ガイド', category: 'ネットワーキング', file: 'networking/aws-direct-connect-guide.html' },
    { title: 'Direct Connect & VGW', category: 'ネットワーキング', file: 'new-solutions/aws-direct-connect-vgw.html' },
    { title: 'VPN with Direct Connect ガイド', category: 'ネットワーキング', file: 'networking/aws-vpn-with-direct-connect-guide.html' },
    { title: 'Direct Connect 暗号化 VPN', category: 'ネットワーキング', file: 'networking/direct_connect_encryption_vpn.html' },
    { title: 'VPN vs PrivateLink', category: 'ネットワーキング', file: 'new-solutions/vpn-vs-privatelink.html' },
    { title: 'ENI インフォグラフィック', category: 'ネットワーキング', file: 'networking/aws-eni-infographic.html' },
    { title: 'EIP & NAT インフォグラフィック', category: 'ネットワーキング', file: 'new-solutions/aws_eip_nat_infographic.html' },
    { title: 'VPC PrivateLink CIDR オーバーラップ', category: 'ネットワーキング', file: 'new-solutions/vpc_privatelink_cidr_overlap.html' },
    { title: 'RAM VPC プレフィックス', category: 'ネットワーキング', file: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html' },
    { title: 'AWS ゲートウェイ', category: 'ネットワーキング', file: 'networking/aws-gateways.html' },
    { title: 'Transit Gateway 共有', category: 'ネットワーキング', file: 'organizational-complexity/aws-ram-tgw-sharing.html' },
    { title: 'AWS Directory Service 完全ガイド', category: 'ネットワーキング', file: 'networking/aws-directory-service-guide.html' },
    { title: 'S3バケットポリシー Principal要素 完全ガイド', category: 'ネットワーキング', file: 'networking/s3-bucket-policy-principal-guide.html' },
    { title: 'ネットワークACL vs セキュリティグループ 完全ガイド', category: 'ネットワーキング', file: 'networking/nacl-sg-comparison-guide.html' },

    // セキュリティ・ガバナンス
    { title: 'AWS Cognito インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-cognito-infographic.html' },
    { title: 'IAM フェデレーション', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/iam_federation_infographic.html' },
    { title: 'API Gateway 認証・認可', category: 'セキュリティ・ガバナンス', file: 'security-governance/api_gateway_auth_infographic.html' },
    { title: 'ACM SAN インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'security-governance/acm-san-infographic.html' },
    { title: 'CMK インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws_cmk_infographic.html' },
    { title: 'CloudFormationドリフト検出と自動修復完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html' },
    { title: 'AWS Config - S3パブリックアクセス検出完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-s3-public-access-guide.html' },
    { title: 'Storage Gateway RefreshCache 自動化完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/storage-gateway-refreshcache-automation-guide.html' },
    { title: 'CloudWatch Logs 集中集約完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudwatch-logs-subscription-guide.html' },
    { title: 'Control Tower Guardrails', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-control-tower-guardrails.html' },
    { title: 'Organization & Control Tower', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-organization-control-tower.html' },
    { title: 'SCP 簡単解説', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws-scp-simplified.html' },
    { title: 'Organizations インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws_org_infographic.html' },
    { title: 'AWS Config × Organizations 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-organizations-guide.html' },
    { title: 'Control Tower 自動展開 (CfCT) ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/control-tower-cfct-guide.html' },
    { title: 'AWS WAF インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_waf_infographic.html' },
    { title: 'AWS EDR インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_edr_infographic.html' },
    { title: 'SSM RunCommand インフォグラフィック', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_ssm_runcommand_infographic.html' },
    { title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', category: 'セキュリティ・ガバナンス', file: 'security-governance/abac-principaltag-resourcetag-guide.html' },
    { title: 'SAML証明書ローテーション完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/saml-certificate-rotation-guide.html' },
    { title: 'CIS AWS Foundations ベンチマーク継続評価ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cis-benchmark-security-hub-config-guide.html' },
    { title: 'GuardDuty ログソース完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-log-sources-guide.html' },
    { title: 'VPC トラフィックミラーリング完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/vpc-traffic-mirroring-guide.html' },
    { title: 'ALB TLSセキュリティポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/alb-tls-security-policy-guide.html' },
    { title: 'AWS ログインユーザーの種類 - 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-login-users-guide.html' },
    { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-role-policies-guide.html' },
    { title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/opensearch-dashboards-guide.html' },
    { title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-access-analyzer-policy-generation-guide.html' },
    { title: 'AWS Config コンフォーマンスパック & StackSets 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-conformance-stacksets-guide.html' },
    { title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-access-analyzer-guide.html' },
    { title: 'IAM 権限評価モデル & 操作経路 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-permission-evaluation-guide.html' },
    { title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-mfa-emergency-rescue-guide.html' },
    { title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cognito-pre-signup-trigger-guide.html' },
    { title: 'AWS CLI 認証情報の指定方法 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-cli-credentials-guide.html' },
    { title: 'IAM パーミッションバウンダリー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-permission-boundary-guide.html' },
    { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-grants-guide.html' },
    { title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-managed-vs-customer-managed-policies.html' },
    { title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-monitoring-guide.html' },
    { title: 'GuardDuty EKS Protection 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-eks-protection-guide.html' },
    { title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館', category: 'セキュリティ・ガバナンス', file: 'security-governance/security-lake-guide.html' },

    // コンピュート・アプリケーション
    { title: 'EC2 キャパシティ インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-ec2-capacity-infographic.html' },
    { title: 'EC2 ブートストラップ', category: 'コンピュート・アプリケーション', file: 'new-solutions/ec2-bootstrap-infographic.html' },
    { title: 'EFA インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'new-solutions/efa_infographic.html' },
    { title: 'クラスタプレイスメントグループ + EFA', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_cluster_pg_efa_infographic.html' },
    { title: 'EC2 Auto Recovery 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-auto-recovery-guide.html' },
    { title: 'EC2 ステータスチェック図解ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-status-check-guide.html' },
    { title: 'Auto Scaling安全なOSアップデート戦略完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-safe-os-update-guide.html' },
    { title: 'EC2 Auto Scaling SNS通知完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-autoscaling-notifications-guide.html' },
    { title: 'EC2終了前ログ退避設計ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-log-backup-before-termination-guide.html' },
    { title: 'Fargate awslogsログドライバ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/fargate-awslogs-complete-guide.html' },
    { title: 'Auto Scaling ウォームプール運用モード完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/warmpool-modes-infographic.html' },
    { title: 'CloudWatch Agent Procstat 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/cloudwatch-procstat-guide.html' },
    { title: 'AWSグローバルアーキテクチャ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-global-architecture-guide.html' },
    { title: 'Auto Scaling Warm Pool', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling_warmpool_infographic.html' },
    { title: 'Auto Scaling インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/auto_scaling_infographic.html' },
    { title: 'EC2 Auto Scaling ライフサイクル', category: 'コンピュート・アプリケーション', file: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html' },
    { title: 'Auto Scaling ライフサイクル完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-lifecycle-guide.html' },
    { title: 'ALB スティッキーセッション', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb_sticky_session_infographic.html' },
    { title: 'Lambda メトリクス', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-lambda-metrics-perfect.html' },
    { title: 'Lambda メトリクス (2)', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-lambda-metrics.html' },
    { title: 'Lambda エイリアス・カナリー', category: 'コンピュート・アプリケーション', file: 'new-solutions/lambda-alias-canary.html' },
    { title: 'ECS インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_ecs_infographic.html' },
    { title: 'SQS DLQ インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/sqs_dlq_infographic.html' },
    { title: 'SQS Dead-letter Queue & Redrive 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/sqs-dlq-redrive-guide.html' },
    { title: 'AppStream インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/appstream-infographic.html' },
    { title: 'Patch Manager 自動パッチ適用', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_patch_manager_infographic.html' },
    { title: 'Systems Manager ハイブリッド環境完全ガイド', category: 'コンピュート・アプリケーション', file: 'continuous-improvement/systems-manager-hybrid-guide.html' },
    { title: 'CloudWatch カスタムメトリクス & PutMetricData 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/cloudwatch-putmetricdata-guide.html' },
    { title: 'CodePipeline Deploy Stage と DeploymentGroup の関係', category: 'コンピュート・アプリケーション', file: 'compute-applications/codepipeline-deploymentgroup-guide.html' },
    { title: 'ALB ターゲットグループ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb-target-group-guide.html' },
    { title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
    { title: 'VPC DHCP オプションとカスタム DNS 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/vpc-dhcp-options-guide.html' },

    // コンテンツ配信・DNS
    { title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/dns-records-guide.html' },
    { title: 'CloudFront キャッシュ', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-cache-infographic.html' },
    { title: 'CloudFront Origin Groups', category: 'コンテンツ配信・DNS', file: 'new-solutions/cloudfront-origin-groups.html' },
    { title: 'CloudFront HTTPS ハンドシェイク完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-https-guide.html' },
    { title: 'Global Accelerator インフォグラフィック', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/global_accelerator_infographic.html' },
    { title: 'DNS インフォグラフィック', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/aws-dns-infographic.html' },
    { title: 'Route53 ホストゾーン', category: 'コンテンツ配信・DNS', file: 'new-solutions/route53_hosted_zones_infographic.html' },
    { title: 'Route53 クロスアカウントガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53_cross_account_guide.html' },
    { title: 'Route 53 DNSSEC 完全ガイド - 公証役場のしくみで理解する DNS セキュリティ', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-dnssec-guide.html' },
    { title: 'OSI参照モデル × AWSサービス完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/osi-aws-services-guide.html' },
    { title: 'ACM DNS検証 - 超かんたん図解ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/acm-dns-simple-guide.html' },
    { title: 'ALB × PFS 暗号スイート完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html' },
    { title: 'ALB セキュリティポリシー完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/alb-security-policy-guide.html' },

    // 開発・デプロイメント
    { title: 'CloudFormation インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/aws-cloudformation-infographic.html' },
    { title: 'CloudFormation 保護ガイド', category: '開発・デプロイメント', file: 'development-deployment/cloudformation-protection-guide.html' },
    { title: 'CloudFormation Service Catalog', category: '開発・デプロイメント', file: 'organizational-complexity/cf-service-catalog-infographic.html' },
    { title: 'AWS SAM インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/aws_sam_infographic.html' },
    { title: 'CDK インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/cdk_infographic.html' },
    { title: 'CloudFormation StackSets インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/stacksets_infographic.html' },
    { title: 'API Gateway インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/api_gateway_infographic.html' },
    { title: 'EventBridge インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/aws-eventbridge-infographic.html' },
    { title: 'AppSync インフォグラフィック', category: '開発・デプロイメント', file: 'development-deployment/aws_appsync_infographic.html' },
    { title: 'CodePipeline アクションタイプ図解ガイド', category: '開発・デプロイメント', file: 'development-deployment/codepipeline-actions-guide.html' },
    { title: 'CodePipeline & タスク概要 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/codepipeline_infographic_v2.html' },
    { title: 'Amazon Inspector ECRスキャン完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/amazon-inspector-ecr-scanning-guide.html' },
    { title: 'CloudFormation Guard (cfn-guard) 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/cfn-guard-infographic.html' },
    { title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/guardduty-suppression-rules.html' },

    // ストレージ・データベース
    { title: 'S3 インフォグラフィック', category: 'ストレージ・データベース', file: 'storage-database/aws_s3_infographic.html' },
    { title: 'S3 ストレージクラス', category: 'ストレージ・データベース', file: 'storage-database/s3_storage_classes_infographic.html' },
    { title: 'S3 セキュリティ インフォグラフィック', category: 'ストレージ・データベース', file: 'storage-database/s3-security-infographic.html' },
    { title: 'EBS FSR インフォグラフィック', category: 'ストレージ・データベース', file: 'storage-database/aws-ebs-fsr-infographic.html' },
    { title: 'EFS マウントターゲット', category: 'ストレージ・データベース', file: 'storage-database/aws-efs-mount-target-infographic.html' },
    { title: 'Aurora Data API & IAM', category: 'ストレージ・データベース', file: 'storage-database/aurora_dataapi_iam_infographic.html' },
    { title: 'ElastiCache インフォグラフィック', category: 'ストレージ・データベース', file: 'storage-database/elasticache_infographic.html' },
    { title: 'Redis クラスターモード', category: 'ストレージ・データベース', file: 'storage-database/redis_cluster_mode_infographic.html' },
    { title: 'Amazon MSK インフォグラフィック', category: 'ストレージ・データベース', file: 'storage-database/amazon_msk_infographic.html' },
    { title: 'OpenSearch Service ISM ポリシー完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/opensearch-ism-policy-guide.html' },

    // 移行・転送
    { title: 'DMS CDC インフォグラフィック', category: '移行・転送', file: 'migration/aws_dms_cdc_infographic.html' },
    { title: 'DMS 機能インフォグラフィック', category: '移行・転送', file: 'migration/aws_dms_features_infographic.html' },
    { title: 'SCT & DMS Migration', category: '移行・転送', file: 'migration/aws_sct_dms_migration_infographic.html' },
    { title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド', category: '移行・転送', file: 'migration/blue-green-vs-immutable-visual-guide.html' },
    { title: 'Migration Hub インフォグラフィック', category: '移行・転送', file: 'migration/aws-migration-hub-infographic.html' },
    { title: 'Migration インフォグラフィック', category: '移行・転送', file: 'migration/aws_migration_infographic.html' },
    { title: 'Migration サービス', category: '移行・転送', file: 'migration/aws_migration_services_infographic.html' },
    { title: 'AWS リロケーション・ガイド', category: '移行・転送', file: 'migration/aws_relocate_guide.html' },
    { title: 'DR インフォグラフィック', category: '移行・転送', file: 'migration/aws-dr-infographic.html' },

    // 分析・運用・クイズ
    { title: '開発向けロードマップ', category: '分析・運用・クイズ', file: 'development-roadmap.html' },
    { title: '開発フローチャート', category: '分析・運用・クイズ', file: 'development-flowchart.html' },
    { title: '開発ユースケース', category: '分析・運用・クイズ', file: 'development-usecase.html' },
    { title: '学習リソース集', category: '分析・運用・クイズ', file: 'learning-resources.html' },
    { title: 'コストツール', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-cost-tools.html' },
    { title: 'ディスクメトリクス', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-disk-metrics.html' },
    { title: 'エラー インフォグラフィック', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-errors-infographic.html' },
    { title: '可用性インフォグラフィック', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws_availability_infographic.html' },
    { title: 'Kinesis インフォグラフィック', category: '分析・運用・クイズ', file: 'analytics-bigdata/kinesis-infographic.html' },
    { title: 'Kinesis Firehose インフォグラフィック', category: '分析・運用・クイズ', file: 'analytics-bigdata/kinesis_firehose_infographic.html' },
    { title: 'Redshift スケーリング インフォグラフィック', category: '分析・運用・クイズ', file: 'analytics-bigdata/redshift_scaling_infographic.html' },
    { title: 'サーバーレスデータパイプライン', category: '分析・運用・クイズ', file: 'analytics-bigdata/serverless_data_pipeline_infographic.html' },
    { title: 'AWS SAP ナレッジベース', category: '分析・運用・クイズ', file: 'knowledge-base.html' },
    { title: 'AWS SAP 理解度クイズ', category: '分析・運用・クイズ', file: 'quiz.html' },
    { title: 'AWS SAP 用語集', category: '分析・運用・クイズ', file: 'aws_glossary.html' }
];

// 検索機能
function performSearch(query) {
    const searchResultsList = document.getElementById('searchResultsList');
    const searchResultsCount = document.getElementById('searchResultsCount');
    const searchResults = document.getElementById('searchResults');
    const searchNoResults = document.getElementById('searchNoResults');
    const searchClear = document.getElementById('searchClear');

    // 空文字列の場合は検索結果を非表示
    if (!query || query.trim() === '') {
        searchResults.classList.remove('show');
        searchClear.classList.remove('show');
        return;
    }

    // クリアボタンを表示
    searchClear.classList.add('show');

    // 検索クエリを正規化（小文字化、空白除去）
    const normalizedQuery = query.toLowerCase().trim();

    // 検索実行（タイトルとカテゴリで検索）
    const results = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
        const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
        return titleMatch || categoryMatch;
    });

    // 結果を表示
    searchResultsList.innerHTML = '';

    if (results.length > 0) {
        searchNoResults.style.display = 'none';
        searchResultsList.style.display = 'grid';
        searchResultsCount.textContent = results.length;

        results.forEach(item => {
            const li = document.createElement('li');
            li.className = 'search-result-item';
            li.innerHTML = `
                <a href="${item.file}">
                    ${item.title}
                    <div class="search-result-category">${item.category}</div>
                </a>
            `;
            searchResultsList.appendChild(li);
        });
    } else {
        searchNoResults.style.display = 'block';
        searchResultsList.style.display = 'none';
        searchResultsCount.textContent = 0;
    }

    // 検索結果を表示
    searchResults.classList.add('show');
}

// 検索クリア機能
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchClear = document.getElementById('searchClear');

    searchInput.value = '';
    searchResults.classList.remove('show');
    searchClear.classList.remove('show');
    searchInput.focus();
}

// トップに戻る機能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// スクロールイベント処理
function handleScroll() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const readingProgress = document.getElementById('readingProgress');
    const readingProgressBar = document.getElementById('readingProgressBar');

    // スクロール位置を取得
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 300px以上スクロールしたらボタンを表示
    if (scrollTop > 300) {
        scrollToTopBtn.classList.add('show');
        readingProgress.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
        readingProgress.classList.remove('show');
    }

    // 読書進捗を計算して更新
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    readingProgressBar.style.width = scrollPercent + '%';
    readingProgress.setAttribute('aria-valuenow', Math.round(scrollPercent));
}

// 検索入力イベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // リアルタイム検索
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
    });

    // Enterキーで検索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });

    // Escapeキーでクリア
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    // トップに戻るボタンのクリックイベント
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // スクロールイベントリスナー (スロットリング付き)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });

    // 最終更新日を設定
    updateLastModifiedDate();
});

// 最終更新日を表示する関数
function updateLastModifiedDate() {
    const lastUpdatedElement = document.getElementById('last-updated-date');

    // data.jsのsiteStats.lastUpdatedから最終更新日を取得
    if (typeof siteStats !== 'undefined' && siteStats.lastUpdated) {
        // siteStats.lastUpdatedが存在する場合（推奨）
        lastUpdatedElement.textContent = siteStats.lastUpdated;
    } else {
        // フォールバック: document.lastModifiedを使用
        const lastModified = new Date(document.lastModified);
        const formattedDate = formatDate(lastModified);
        lastUpdatedElement.textContent = formattedDate;
    }
}

// 日付をフォーマットする関数
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
