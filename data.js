// AWS SAP学習リソース - データ定義ファイル
// このファイルは純粋なデータのみを含み、HTMLタグは含みません

// 全カテゴリデータ
const categoriesData = [
  {
    id: 'networking',
    title: 'ネットワーキング',
    icon: '🌐',
    count: 20,
    sections: [
      {
        title: 'Direct Connect & ハイブリッドネットワーク',
        icon: '🔗',
        count: 5,
        resources: [
          { title: 'Direct Connect ガイド', href: 'networking/aws-direct-connect-guide.html' },
          { title: 'Direct Connect & VGW', href: 'new-solutions/aws-direct-connect-vgw.html' },
          { title: 'VPN with Direct Connect ガイド', href: 'networking/aws-vpn-with-direct-connect-guide.html' },
          { title: 'Direct Connect 暗号化 VPN', href: 'networking/direct_connect_encryption_vpn.html' },
          { title: 'VPN vs PrivateLink', href: 'new-solutions/vpn-vs-privatelink.html' }
        ]
      },
      {
        title: 'VPC & ネットワーク基礎',
        icon: '🏗️',
        count: 11,
        resources: [
          { title: 'ENI インフォグラフィック', href: 'networking/aws-eni-infographic.html' },
          { title: 'EIP & NAT インフォグラフィック', href: 'new-solutions/aws_eip_nat_infographic.html' },
          { title: 'VPC PrivateLink CIDR オーバーラップ', href: 'new-solutions/vpc_privatelink_cidr_overlap.html' },
          { title: 'RAM VPC プレフィックス', href: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html' },
          { title: 'AWS Directory Service 完全ガイド', href: 'networking/aws-directory-service-guide.html' },
          { title: 'S3バケットポリシー Principal要素 完全ガイド', href: 'networking/s3-bucket-policy-principal-guide.html' },
          { title: 'ネットワークACL vs セキュリティグループ 完全ガイド', href: 'networking/nacl-sg-comparison-guide.html' },
          { title: 'Amazon EKS セキュリティ完全図解ガイド', href: 'networking/eks-security-visual-guide.html' },
          { title: 'CloudFront HTTPセキュリティヘッダー完全ガイド', href: 'networking/cloudfront-security-headers-guide.html' },
          { title: 'S3バケットポリシー × VPCエンドポイント完全ガイド', href: 'networking/s3-vpc-endpoint-policy-guide.html' },
          { title: 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', href: 'networking/guardduty-credential-exfiltration-guide-v2.html' }
        ]
      },
      {
        title: 'Transit Gateway & ゲートウェイ',
        icon: '🚪',
        count: 3,
        resources: [
          { title: 'AWS ゲートウェイ', href: 'networking/aws-gateways.html' },
          { title: 'Transit Gateway 共有', href: 'organizational-complexity/aws-ram-tgw-sharing.html' }
        ]
      }
    ]
  },
  {
    id: 'security-governance',
    title: 'セキュリティ・ガバナンス',
    icon: '🔒',
    count: 68,
    sections: [
      {
        title: 'IAM & 認証・認可',
        icon: '👤',
        count: 20,
        resources: [
          { title: 'AWS Cognito インフォグラフィック', href: 'security-governance/aws-cognito-infographic.html' },
          { title: 'IAM フェデレーション', href: 'continuous-improvement/iam_federation_infographic.html' },
          { title: 'API Gateway 認証・認可', href: 'security-governance/api_gateway_auth_infographic.html' },
          { title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', href: 'security-governance/abac-principaltag-resourcetag-guide.html' },
          { title: 'SAML証明書ローテーション完全ガイド', href: 'security-governance/saml-certificate-rotation-guide.html' },
          { title: 'AWS ログインユーザーの種類 - 完全ガイド', href: 'security-governance/aws-login-users-guide.html' },
          { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', href: 'security-governance/iam-role-policies-guide.html' },
          { title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド', href: 'security-governance/iam-access-analyzer-policy-generation-guide.html' },
          { title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解', href: 'security-governance/iam-access-analyzer-guide.html' },
          { title: 'IAM 権限評価モデル & 操作経路 完全ガイド', href: 'security-governance/iam-permission-evaluation-guide.html' },
          { title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作', href: 'security-governance/iam-mfa-emergency-rescue-guide.html' },
          { title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', href: 'security-governance/cognito-pre-signup-trigger-guide.html' },
          { title: 'AWS CLI 認証情報の指定方法 完全ガイド', href: 'security-governance/aws-cli-credentials-guide.html' },
          { title: 'IAM パーミッションバウンダリー 完全ガイド', href: 'security-governance/iam-permission-boundary-guide.html' },
          { title: 'SAML障害時のブレークグラスユーザー完全ガイド', href: 'security-governance/breakglass-user-guide.html' },
          { title: 'IAM 認証情報レポート完全ガイド', href: 'security-governance/iam-credential-report-guide.html' },
          { title: 'IAM認証情報レポート - セキュリティインシデント初動調査ガイド', href: 'security-governance/iam-credential-report-incident-guide.html' },
          { title: 'sts:ExternalId 完全マスターガイド', href: 'security-governance/sts-externalid-complete-guide.html' },
          { title: 'IAM Identity Center 完全ガイド - Organizations一括管理', href: 'security-governance/iam-identity-center-guide.html' }
        ]
      },
      {
        title: '暗号化 & 証明書管理',
        icon: '🔐',
        count: 6,
        resources: [
          { title: 'ACM SAN インフォグラフィック', href: 'security-governance/acm-san-infographic.html' },
          { title: 'CMK インフォグラフィック', href: 'security-governance/aws_cmk_infographic.html' },
          { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', href: 'security-governance/kms-grants-guide.html' },
          { title: 'AWS KMS キーの種類 完全ガイド', href: 'security-governance/kms-key-types.html' },
          { title: 'AWS KMS スロットリング対策 & Encryption SDK キャッシュ完全ガイド', href: 'security-governance/kms-throttling-encryption-sdk-guide.html' }
        ]
      },
      {
        title: 'Organizations & ガバナンス',
        icon: '🏢',
        count: 32,
        resources: [
          { title: 'AWS CodeArtifact 完全ガイド', href: 'security-governance/codeartifact-guide.html' },
          { title: 'Cognito IDプールIAMロール完全ガイド', href: 'security-governance/cognito-identity-pool-roles-guide.html' },
          { title: 'IAM Roles Anywhere 完全ガイド', href: 'security-governance/iam-roles-anywhere-guide.html' },
          { title: 'CloudFormationドリフト検出と自動修復完全ガイド', href: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html' },
          { title: 'AWS Config - S3パブリックアクセス検出完全ガイド', href: 'security-governance/aws-config-s3-public-access-guide.html' },
          { title: 'Storage Gateway RefreshCache 自動化完全ガイド', href: 'security-governance/storage-gateway-refreshcache-automation-guide.html' },
          { title: 'CloudWatch Logs 集中集約完全ガイド', href: 'security-governance/cloudwatch-logs-subscription-guide.html' },
          { title: 'Control Tower Guardrails', href: 'security-governance/aws-control-tower-guardrails.html' },
          { title: 'Organization & Control Tower', href: 'security-governance/aws-organization-control-tower.html' },
          { title: 'SCP 簡単解説', href: 'organizational-complexity/aws-scp-simplified.html' },
          { title: 'Organizations インフォグラフィック', href: 'organizational-complexity/aws_org_infographic.html' },
          { title: 'AWS Config × Organizations 完全ガイド', href: 'security-governance/aws-config-organizations-guide.html' },
          { title: 'Control Tower 自動展開 (CfCT) ガイド', href: 'organizational-complexity/control-tower-cfct-guide.html' },
          { title: 'CIS AWS Foundations ベンチマーク継続評価ガイド', href: 'security-governance/cis-benchmark-security-hub-config-guide.html' },
          { title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド', href: 'security-governance/opensearch-dashboards-guide.html' },
          { title: 'AWS Config コンフォーマンスパック & StackSets 完全ガイド', href: 'security-governance/aws-config-conformance-stacksets-guide.html' },
          { title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド', href: 'security-governance/aws-managed-vs-customer-managed-policies.html' },
          { title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', href: 'security-governance/aws-monitoring-guide.html' },
          { title: 'AWS Nitro Enclaves 完全ガイド', href: 'security-governance/nitro-enclaves-guide.html' },
          { title: 'CloudTrail 整合性検証 & ダイジェストファイル 完全ガイド', href: 'security-governance/cloudtrail-integrity-validation-guide.html' },
          { title: 'CloudTrail ログプレフィックス完全ガイド', href: 'security-governance/cloudtrail-log-prefix-guide.html' },
          { title: 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito', href: 'security-governance/iam-identity-center-comparison-guide.html' },
          { title: 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', href: 'security-governance/amazon-inspector-agentless-guide.html' },
          { title: 'EKS コントロールプレーンログ & CloudTrail 監査ログ 完全図解ガイド', href: 'security-governance/eks-control-plane-logging-guide.html' },
          { title: 'CloudTrail 管理イベント vs データイベント 完全ガイド', href: 'security-governance/cloudtrail-events-guide.html' },
          { title: 'Amazon Q Business アクセス制御 & ガードレール完全ガイド', href: 'security-governance/amazon-q-business-access-guardrails-guide.html' },
          { title: 'AWS Well-Architected フレームワーク 完全図解ガイド', href: 'security-governance/aws-well-architected-complete-guide.html' },
          { title: 'AWS Config S3配信エラー解決ガイド', href: 'security-governance/aws-config-s3-delivery-error-guide.html' },
          { title: 'AWS Config access-keys-rotated 完全ガイド', href: 'security-governance/aws-config-access-keys-rotated-guide.html' },
          { title: 'AWS Config 管理ルール＆CloudTrail修復アクション完全ガイド', href: 'security-governance/aws-config-cloudtrail-remediation-guide.html' },
          { title: 'AWS SCP構文 完全図解ガイド', href: 'security-governance/scp-syntax-visual-guide.html' }
        ]
      },
      {
        title: 'セキュリティ監視・脅威検知',
        icon: '🛡️',
        count: 10,
        resources: [
          { title: 'AWS WAF インフォグラフィック', href: 'continuous-improvement/aws_waf_infographic.html' },
          { title: 'AWS EDR インフォグラフィック', href: 'continuous-improvement/aws_edr_infographic.html' },
          { title: 'SSM RunCommand インフォグラフィック', href: 'continuous-improvement/aws_ssm_runcommand_infographic.html' },
          { title: 'GuardDuty ログソース完全ガイド', href: 'security-governance/guardduty-log-sources-guide.html' },
          { title: 'VPC トラフィックミラーリング完全ガイド', href: 'security-governance/vpc-traffic-mirroring-guide.html' },
          { title: 'ALB TLSセキュリティポリシー完全ガイド', href: 'security-governance/alb-tls-security-policy-guide.html' },
          { title: 'GuardDuty EKS Protection 完全ガイド', href: 'security-governance/guardduty-eks-protection-guide.html' },
          { title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館', href: 'security-governance/security-lake-guide.html' },
          { title: 'GuardDuty EKS/RDS Protection 完全ガイド', href: 'security-governance/guardduty-eks-rds-protection-guide.html' },
          { title: 'ECS Exec 完全ガイド - コンテナモニタリングの決定版', href: 'security-governance/ecs-exec-monitoring-guide.html' }
        ]
      }
    ]
  },
  {
    id: 'compute-applications',
    title: 'コンピュート・アプリケーション',
    icon: '💻',
    count: 40,
    sections: [
      {
        title: 'EC2 & インスタンス管理',
        icon: '🖥️',
        count: 7,
        resources: [
          { title: 'EC2 キャパシティ インフォグラフィック', href: 'compute-applications/aws-ec2-capacity-infographic.html' },
          { title: 'EC2 ブートストラップ', href: 'new-solutions/ec2-bootstrap-infographic.html' },
          { title: 'EFA インフォグラフィック', href: 'new-solutions/efa_infographic.html' },
          { title: 'クラスタプレイスメントグループ + EFA', href: 'compute-applications/aws_cluster_pg_efa_infographic.html' },
          { title: 'EC2 Auto Recovery 完全ガイド', href: 'compute-applications/ec2-auto-recovery-guide.html' },
          { title: 'EC2 ステータスチェック図解ガイド', href: 'compute-applications/ec2-status-check-guide.html' }
        ]
      },
      {
        title: 'Auto Scaling & ロードバランシング',
        icon: '⚖️',
        count: 19,
        resources: [
          { title: 'IAM PassRole vs AssumeRole 完全ガイド', href: 'compute-applications/iam-passrole-vs-assumerole-guide.html' },
          { title: 'Auto Scaling安全なOSアップデート戦略完全ガイド', href: 'compute-applications/autoscaling-safe-os-update-guide.html' },
          { title: 'EC2 Auto Scaling SNS通知完全ガイド', href: 'compute-applications/ec2-autoscaling-notifications-guide.html' },
          { title: 'EC2終了前ログ退避設計ガイド', href: 'compute-applications/ec2-log-backup-before-termination-guide.html' },
          { title: 'Fargate awslogsログドライバ完全ガイド', href: 'compute-applications/fargate-awslogs-complete-guide.html' },
          { title: 'Auto Scaling ウォームプール運用モード完全ガイド', href: 'compute-applications/warmpool-modes-infographic.html' },
          { title: 'CloudWatch Agent Procstat 完全ガイド', href: 'compute-applications/cloudwatch-procstat-guide.html' },
          { title: 'CloudWatch カスタムメトリクス & PutMetricData 完全ガイド', href: 'compute-applications/cloudwatch-putmetricdata-guide.html' },
          { title: 'AWSグローバルアーキテクチャ完全ガイド', href: 'compute-applications/aws-global-architecture-guide.html' },
          { title: 'Auto Scaling Warm Pool', href: 'compute-applications/autoscaling_warmpool_infographic.html' },
          { title: 'Auto Scaling インフォグラフィック', href: 'compute-applications/auto_scaling_infographic.html' },
          { title: 'EC2 Auto Scaling ライフサイクル', href: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html' },
          { title: 'Auto Scaling ライフサイクル完全ガイド', href: 'compute-applications/autoscaling-lifecycle-guide.html' },
          { title: 'ALB スティッキーセッション', href: 'compute-applications/alb_sticky_session_infographic.html' },
          { title: 'CodePipeline Deploy Stage と DeploymentGroup の関係', href: 'compute-applications/codepipeline-deploymentgroup-guide.html' },
          { title: 'ALB ターゲットグループ完全ガイド', href: 'compute-applications/alb-target-group-guide.html' },
          { title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド', href: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
          { title: 'VPC DHCP オプションとカスタム DNS 完全ガイド', href: 'compute-applications/vpc-dhcp-options-guide.html' },
          { title: 'Auto Scaling インスタンスリフレッシュ完全ガイド', href: 'compute-applications/autoscaling-instance-refresh-guide.html' }
        ]
      },
      {
        title: 'Lambda & サーバーレス',
        icon: 'λ',
        count: 3,
        resources: [
          { title: 'Lambda メトリクス', href: 'compute-applications/aws-lambda-metrics-perfect.html' },
          { title: 'Lambda メトリクス (2)', href: 'compute-applications/aws-lambda-metrics.html' },
          { title: 'Lambda エイリアス・カナリー', href: 'new-solutions/lambda-alias-canary.html' }
        ]
      },
      {
        title: 'コンテナ & アプリケーション統合',
        icon: '📦',
        count: 5,
        resources: [
          { title: 'ECS インフォグラフィック', href: 'compute-applications/aws_ecs_infographic.html' },
          { title: 'SQS DLQ インフォグラフィック', href: 'compute-applications/sqs_dlq_infographic.html' },
          { title: 'SQS Dead-letter Queue & Redrive 完全ガイド', href: 'compute-applications/sqs-dlq-redrive-guide.html' },
          { title: 'AppStream インフォグラフィック', href: 'compute-applications/appstream-infographic.html' }
        ]
      },
      {
        title: 'システム運用 & パッチ管理',
        icon: '🔧',
        count: 8,
        resources: [
          { title: 'AWS ECR イメージスキャン完全ガイド', href: 'continuous-improvement/ecr-image-scanning-guide.html' },
          { title: 'CloudWatch INSIGHT_RULE_METRIC 完全ガイド', href: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html' },
          { title: 'Patch Manager 自動パッチ適用', href: 'compute-applications/aws_patch_manager_infographic.html' },
          { title: 'Systems Manager ハイブリッド環境完全ガイド', href: 'continuous-improvement/systems-manager-hybrid-guide.html' },
          { title: 'EC2 Image Builder 完全ガイド', href: 'continuous-improvement/ec2-image-builder-guide.html' },
          { title: 'CloudWatch Logs データ保護ポリシー完全ガイド', href: 'continuous-improvement/cloudwatch-logs-data-protection-guide.html' },
          { title: 'AWS Systems Manager OpsCenter 完全ガイド', href: 'compute-applications/opscenter-guide.html' },
          { title: 'AWS Config ec2-managedinstance-applications-required 完全ガイド', href: 'continuous-improvement/ec2-managedinstance-applications-required-guide.html' }
        ]
      }
    ]
  },
  {
    id: 'content-delivery-dns',
    title: 'コンテンツ配信・DNS',
    icon: '🚀',
    count: 16,
    sections: [
      {
        title: 'CloudFront & コンテンツ配信',
        icon: '⚡',
        count: 11,
        resources: [
          { title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53', href: 'content-delivery-dns/dns-records-guide.html' },
          { title: 'CloudFront キャッシュ', href: 'content-delivery-dns/cloudfront-cache-infographic.html' },
          { title: 'CloudFront Origin Groups', href: 'new-solutions/cloudfront-origin-groups.html' },
          { title: 'CloudFront HTTPS ハンドシェイク完全ガイド', href: 'content-delivery-dns/cloudfront-https-guide.html' },
          { title: 'Global Accelerator インフォグラフィック', href: 'content-delivery-dns/global_accelerator_infographic.html' },
          { title: 'OSI参照モデル × AWSサービス完全ガイド', href: 'content-delivery-dns/osi-aws-services-guide.html' },
          { title: 'ACM DNS検証 - 超かんたん図解ガイド', href: 'content-delivery-dns/acm-dns-simple-guide.html' },
          { title: 'ALB × PFS 暗号スイート完全ガイド', href: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html' },
          { title: 'ALB セキュリティポリシー完全ガイド', href: 'content-delivery-dns/alb-security-policy-guide.html' },
          { title: 'ACM + ALB + EC2 TLS証明書設定 完全ガイド', href: 'content-delivery-dns/acm-alb-ec2-tls-guide.html' },
          { title: 'Lambda@Edge Origin Response X-Frame-Options完全ガイド', href: 'content-delivery-dns/lambda-edge-x-frame-options-guide.html' }
        ]
      },
      {
        title: 'Route53 & DNS管理',
        icon: '🌍',
        count: 5,
        resources: [
          { title: 'DNS インフォグラフィック', href: 'content-delivery-dns/aws-dns-infographic.html' },
          { title: 'Route53 ホストゾーン', href: 'new-solutions/route53_hosted_zones_infographic.html' },
          { title: 'Route53 クロスアカウントガイド', href: 'content-delivery-dns/route53_cross_account_guide.html' },
          { title: 'Route 53 DNSSEC 完全ガイド - 公証役場のしくみで理解する DNS セキュリティ', href: 'content-delivery-dns/route53-dnssec-guide.html' }
        ]
      }
    ]
  },
  {
    id: 'development-deployment',
    title: '開発・デプロイメント',
    icon: '🛠️',
    count: 15,
    sections: [
      {
        title: 'IaC & CloudFormation',
        icon: '📜',
        count: 11,
        resources: [
          { title: 'CloudFormation インフォグラフィック', href: 'development-deployment/aws-cloudformation-infographic.html' },
          { title: 'CloudFormation 保護ガイド', href: 'development-deployment/cloudformation-protection-guide.html' },
          { title: 'CloudFormation Service Catalog', href: 'organizational-complexity/cf-service-catalog-infographic.html' },
          { title: 'AWS SAM インフォグラフィック', href: 'development-deployment/aws_sam_infographic.html' },
          { title: 'CDK インフォグラフィック', href: 'development-deployment/cdk_infographic.html' },
          { title: 'CloudFormation StackSets インフォグラフィック', href: 'development-deployment/stacksets_infographic.html' },
          { title: 'Amazon Inspector ECRスキャン完全ガイド', href: 'development-deployment/amazon-inspector-ecr-scanning-guide.html' },
          { title: 'CloudFormation Guard (cfn-guard) 完全ガイド', href: 'development-deployment/cfn-guard-infographic.html' },
          { title: 'CodePipeline & タスク概要 完全ガイド', href: 'development-deployment/codepipeline_infographic_v2.html' },
          { title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド', href: 'development-deployment/guardduty-suppression-rules.html' },
          { title: 'CloudWatch Logs ログ保持期間 完全ガイド', href: 'development-deployment/cloudwatch-logs-retention-guide.html' }
        ]
      },
      {
        title: 'API & イベント駆動',
        icon: '⚡',
        count: 3,
        resources: [
          { title: 'API Gateway インフォグラフィック', href: 'development-deployment/api_gateway_infographic.html' },
          { title: 'EventBridge インフォグラフィック', href: 'development-deployment/aws-eventbridge-infographic.html' },
          { title: 'AppSync インフォグラフィック', href: 'development-deployment/aws_appsync_infographic.html' }
        ]
      },
      {
        title: 'CI/CD & デプロイメント',
        icon: '🔄',
        count: 1,
        resources: [
          { title: 'CodePipeline アクションタイプ図解ガイド', href: 'development-deployment/codepipeline-actions-guide.html' }
        ]
      }
    ]
  },
  {
    id: 'storage-database',
    title: 'ストレージ・データベース',
    icon: '💾',
    count: 11,
    sections: [
      {
        title: 'S3 & オブジェクトストレージ',
        icon: '🪣',
        count: 5,
        resources: [
          { title: 'S3 インフォグラフィック', href: 'storage-database/aws_s3_infographic.html' },
          { title: 'S3 ストレージクラス', href: 'storage-database/s3_storage_classes_infographic.html' },
          { title: 'S3 セキュリティ インフォグラフィック', href: 'storage-database/s3-security-infographic.html' },
          { title: 'OpenSearch Service ISM ポリシー完全ガイド', href: 'storage-database/opensearch-ism-policy-guide.html' },
          { title: 'QuickSight vs OpenSearch Dashboards 完全比較ガイド', href: 'storage-database/quicksight-opensearch-comparison-guide.html' }
        ]
      },
      {
        title: 'ブロック & ファイルストレージ',
        icon: '💿',
        count: 2,
        resources: [
          { title: 'EBS FSR インフォグラフィック', href: 'storage-database/aws-ebs-fsr-infographic.html' },
          { title: 'EFS マウントターゲット', href: 'storage-database/aws-efs-mount-target-infographic.html' }
        ]
      },
      {
        title: 'データベース & キャッシング',
        icon: '🗄️',
        count: 4,
        resources: [
          { title: 'Aurora Data API & IAM', href: 'storage-database/aurora_dataapi_iam_infographic.html' },
          { title: 'ElastiCache インフォグラフィック', href: 'storage-database/elasticache_infographic.html' },
          { title: 'Redis クラスターモード', href: 'storage-database/redis_cluster_mode_infographic.html' },
          { title: 'Amazon MSK インフォグラフィック', href: 'storage-database/amazon_msk_infographic.html' }
        ]
      }
    ]
  },
  {
    id: 'migration',
    title: '移行・転送',
    icon: '🔄',
    count: 11,
    sections: [
      {
        title: 'DMS & データベース移行',
        icon: '🔁',
        count: 3,
        resources: [
          { title: 'DMS CDC インフォグラフィック', href: 'migration/aws_dms_cdc_infographic.html' },
          { title: 'DMS 機能インフォグラフィック', href: 'migration/aws_dms_features_infographic.html' },
          { title: 'SCT & DMS Migration', href: 'migration/aws_sct_dms_migration_infographic.html' }
        ]
      },
      {
        title: 'Migration Hub & 移行戦略',
        icon: '🚚',
        count: 8,
        resources: [
          { title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド', href: 'migration/blue-green-vs-immutable-visual-guide.html' },
          { title: 'Migration Hub インフォグラフィック', href: 'migration/aws-migration-hub-infographic.html' },
          { title: 'Migration インフォグラフィック', href: 'migration/aws_migration_infographic.html' },
          { title: 'Migration サービス', href: 'migration/aws_migration_services_infographic.html' },
          { title: 'AWS リロケーション・ガイド', href: 'migration/aws_relocate_guide.html' }
        ]
      },
      {
        title: 'ディザスタリカバリ (DR)',
        icon: '🆘',
        count: 2,
        resources: [
          { title: 'DR インフォグラフィック', href: 'migration/aws-dr-infographic.html' }
        ]
      }
    ]
  },
  {
    id: 'analytics-operations',
    title: '分析・運用・クイズ',
    icon: '📊',
    count: 14,
    sections: [
      {
        title: '分析・運用',
        icon: '📉',
        count: 5,
        resources: [
          { title: 'コストツール', href: 'analytics-bigdata/aws-cost-tools.html' },
          { title: 'ディスクメトリクス', href: 'analytics-bigdata/aws-disk-metrics.html' },
          { title: 'エラー インフォグラフィック', href: 'analytics-bigdata/aws-errors-infographic.html' },
          { title: '可用性インフォグラフィック', href: 'analytics-bigdata/aws_availability_infographic.html' },
          { title: 'Kinesis インフォグラフィック', href: 'analytics-bigdata/kinesis-infographic.html' }
        ]
      },
      {
        title: 'データ分析',
        icon: '📈',
        count: 3,
        resources: [
          { title: 'Kinesis Firehose インフォグラフィック', href: 'analytics-bigdata/kinesis_firehose_infographic.html' },
          { title: 'Redshift スケーリング インフォグラフィック', href: 'analytics-bigdata/redshift_scaling_infographic.html' },
          { title: 'サーバーレスデータパイプライン', href: 'analytics-bigdata/serverless_data_pipeline_infographic.html' }
        ]
      },
      {
        title: '理解度クイズ・用語集',
        icon: '✏️',
        count: 7,
        resources: [
          { title: '🗺️ 開発向けロードマップ', href: 'development-roadmap.html' },
          { title: '📊 開発フローチャート', href: 'development-flowchart.html' },
          { title: '💡 開発ユースケース', href: 'development-usecase.html' },
          { title: '📚 学習リソース集', href: 'learning-resources.html' },
          { title: 'AWS SAP ナレッジベース', href: 'knowledge-base.html' },
          { title: 'AWS SAP 理解度クイズ', href: 'quiz.html' },
          { title: 'AWS SAP 用語集', href: 'aws_glossary.html' }
        ]
      }
    ]
  }
];

// カテゴリクイックナビゲーション用データ
const categoryQuickNav = [
  { id: 'networking', icon: '🌐', text: 'ネットワーキング', count: 19 },
  { id: 'security-governance', icon: '🔒', text: 'セキュリティ・ガバナンス', count: 60 },
  { id: 'compute-applications', icon: '💻', text: 'コンピュート・アプリケーション', count: 40 },
  { id: 'content-delivery-dns', icon: '🚀', text: 'コンテンツ配信・DNS', count: 16 },
  { id: 'development-deployment', icon: '🛠️', text: '開発・デプロイメント', count: 15 },
  { id: 'storage-database', icon: '💾', text: 'ストレージ・データベース', count: 11 },
  { id: 'migration', icon: '🔄', text: '移行・転送', count: 11 },
  { id: 'analytics-operations', icon: '📊', text: '分析・運用・クイズ', count: 14 }
];

// 統計データ
const siteStats = {
  majorCategories: 8,
  minorCategories: 26,
  totalResources: '180+',
  offlineSupport: '100%',
  // メタデータ（自動更新スクリプトで管理）
  lastUpdated: '2026/01/19'  // GIT_LAST_COMMIT_DATE - このコメントは自動更新スクリプトのマーカーです
};
