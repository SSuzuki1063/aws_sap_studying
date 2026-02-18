// AWS SAP学習リソース - データ定義ファイル
// このファイルは純粋なデータのみを含み、HTMLタグは含みません

// 全カテゴリデータ
const categoriesData = [
  {
    id: 'networking',
    title: 'ネットワーキング',
    icon: '🌐',
    count: 47,
    sections: [
      {
        title: 'Direct Connect & ハイブリッドネットワーク',
        icon: '🔗',
        count: 11,
        lastUpdated: '2026-02-15',
        resources: [
          { title: 'Direct Connect ガイド', href: 'networking/aws-direct-connect-guide.html', priority: 'high' },
          { title: 'Direct Connect & VGW', href: 'new-solutions/aws-direct-connect-vgw.html', priority: 'high' },
          { title: 'VPN with Direct Connect ガイド', href: 'networking/aws-vpn-with-direct-connect-guide.html', priority: 'high' },
          { title: 'Direct Connect 暗号化 VPN', href: 'networking/direct_connect_encryption_vpn.html' },
          { title: 'VPN vs PrivateLink', href: 'new-solutions/vpn-vs-privatelink.html' },
          { title: 'AWS Direct Connect ルーティングポリシーと BGP コミュニティ完全ガイド', href: 'networking/direct-connect-bgp-routing-guide.html' },
          { title: 'BFD完全ガイド - AWS Direct Connectのフェイルオーバー時間を劇的に短縮', href: 'networking/bfd-failover-optimization-guide.html', priority: 'low' },
          { title: 'Direct Connect LAG環境でのMACsec実装ガイド', href: 'networking/macsec-lag-implementation-guide.html', priority: 'low' },
          { title: 'Direct Connect CloudWatchメトリクス 完全ガイド', href: 'networking/direct-connect-cloudwatch-metrics-guide.html', priority: 'low' },
          { title: 'AWS Direct Connect ルート制限とルート集約（サマライゼーション）完全ガイド', href: 'networking/direct-connect-route-summarization-guide.html' },
          { title: 'AWS Direct Connect 接続タイプ完全ガイド', href: 'networking/direct-connect-connection-types-guide.html', priority: 'high' }
        ]
      },
      {
        title: 'VPC & ネットワーク基礎',
        icon: '🏗️',
        count: 28,
        lastUpdated: '2026-02-15',
        resources: [
          { title: 'ENI インフォグラフィック', href: 'networking/aws-eni-infographic.html', priority: 'low' },
          { title: 'EIP & NAT インフォグラフィック', href: 'new-solutions/aws_eip_nat_infographic.html', priority: 'low' },
          { title: 'VPC PrivateLink CIDR オーバーラップ', href: 'new-solutions/vpc_privatelink_cidr_overlap.html', priority: 'high' },
          { title: 'RAM VPC プレフィックス', href: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html' },
          { title: 'AWS Directory Service 完全ガイド', href: 'networking/aws-directory-service-guide.html' },
          { title: 'S3バケットポリシー Principal要素 完全ガイド', href: 'networking/s3-bucket-policy-principal-guide.html' },
          { title: 'ネットワークACL vs セキュリティグループ 完全ガイド', href: 'networking/nacl-sg-comparison-guide.html', priority: 'high' },
          { title: 'Amazon EKS セキュリティ完全図解ガイド', href: 'networking/eks-security-visual-guide.html' },
          { title: 'CloudFront HTTPセキュリティヘッダー完全ガイド', href: 'networking/cloudfront-security-headers-guide.html', priority: 'low' },
          { title: 'S3バケットポリシー × VPCエンドポイント完全ガイド', href: 'networking/s3-vpc-endpoint-policy-guide.html', priority: 'high' },
          { title: 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', href: 'networking/guardduty-credential-exfiltration-guide-v2.html' },
          { title: 'Amazon VPC Network Access Analyzer 完全図解ガイド', href: 'networking/vpc-network-access-analyzer-guide.html', priority: 'low' },
          { title: 'ジャンボフレーム＆MTU問題 完全図解ガイド', href: 'networking/jumbo-frame-mtu-guide.html', priority: 'low' },
          { title: 'EC2インスタンスのネットワークMTU完全ガイド', href: 'networking/ec2-mtu-guide.html', priority: 'low' },
          { title: 'CIDRブロック集約と許可プレフィックスリスト完全ガイド', href: 'networking/cidr-aggregation-prefix-list-guide.html' },
          { title: 'AWS プレフィックスリスト完全ガイド', href: 'networking/aws-prefix-list-guide.html' },
          { title: 'AWS BYOIP 完全ガイド - 自社IPアドレスをAWSに持ち込む', href: 'networking/byoip-guide.html', priority: 'low' },
          { title: 'AWS Site-to-Site VPN 完全ガイド', href: 'networking/aws-site-to-site-vpn-guide.html', priority: 'high' },
          { title: 'AWS Site-to-Site VPN IKEセッション復旧ガイド', href: 'networking/vpn-ike-dpd-recovery-guide.html', priority: 'low' },
          { title: 'AWS Site-to-Site VPN 非対称ルーティング問題の解決方法', href: 'networking/aws-vpn-asymmetric-routing-guide.html' },
          { title: 'AWS Site-to-Site VPN + Route 53 Resolver 完全ガイド', href: 'networking/site-to-site-vpn-route53-resolver-guide.html' },
          { title: 'AWS VPNスループットスケーリング完全ガイド - Transit Gateway + ECMP + アクセラレーション', href: 'networking/vpn-throughput-scaling-guide.html' },
          { title: 'VPNアクセラレーション vs Global Accelerator - 関係と違いを徹底解説', href: 'networking/vpn-acceleration-vs-global-accelerator.html', priority: 'low' },
          { title: 'AWS Global Accelerator × VPN パフォーマンス向上ガイド', href: 'networking/global-accelerator-vpn-performance-guide.html', priority: 'low' },
          { title: 'ハイブリッド DNS アーキテクチャ 完全ガイド', href: 'networking/hybrid-dns-architecture-guide.html', priority: 'high' },
          { title: 'AWS PrivateLink & VPC エンドポイントサービス 完全ガイド', href: 'networking/aws-privatelink-vpc-endpoint-service-guide.html', priority: 'high' },
          { title: 'CIDRブロックの重複とVPC接続 完全ガイド', href: 'networking/cidr-vpc-connectivity-guide.html', priority: 'high' },
          { title: 'AWS Hyperplane 完全ガイド - 見えないけど超重要なAWSの交通システム', href: 'networking/aws-hyperplane-guide.html', priority: 'low' }
        ]
      },
      {
        title: 'Transit Gateway & ゲートウェイ',
        icon: '🚪',
        count: 10,
        lastUpdated: '2026-02-12',
        resources: [
          { title: 'AWS ゲートウェイ', href: 'networking/aws-gateways.html', priority: 'high' },
          { title: 'Transit Gateway 共有', href: 'organizational-complexity/aws-ram-tgw-sharing.html', priority: 'high' },
          { title: 'AWS Transit Gateway Deep Dive 完全ガイド', href: 'networking/transit-gateway-deep-dive.html', priority: 'high' },
          { title: 'AWS Transit Gateway ピアリング完全ガイド', href: 'networking/transit-gateway-peering-guide.html', priority: 'high' },
          { title: 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド', href: 'networking/cloud-wan-attachment-policy-guide.html' },
          { title: '【Black Belt】AWS Transit Gateway Deep Dive (2025年1月)', href: 'BlackBelt/AWS-Black-Belt_2025_AWS-Transit-Gateway-deepdive_0122_v1.pdf' },
          { title: 'Transit Gateway アプライアンスモード 完全ガイド', href: 'networking/tgw-appliance-mode-guide.html' },
          { title: 'Transit Gateway Connect 完全ガイド', href: 'networking/transit-gateway-connect-guide.html' }
        ]
      }
    ]
  },
  {
    id: 'security-governance',
    title: 'セキュリティ・ガバナンス',
    icon: '🔒',
    count: 75,
    sections: [
      {
        title: 'IAM & 認証・認可',
        icon: '👤',
        count: 20,
        lastUpdated: '2026-01-10',
        resources: [
          { title: 'AWS Cognito インフォグラフィック', href: 'security-governance/aws-cognito-infographic.html' },
          { title: 'IAM フェデレーション', href: 'continuous-improvement/iam_federation_infographic.html', priority: 'high' },
          { title: 'API Gateway 認証・認可', href: 'security-governance/api_gateway_auth_infographic.html' },
          { title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', href: 'security-governance/abac-principaltag-resourcetag-guide.html' },
          { title: 'SAML証明書ローテーション完全ガイド', href: 'security-governance/saml-certificate-rotation-guide.html', priority: 'low' },
          { title: 'AWS ログインユーザーの種類 - 完全ガイド', href: 'security-governance/aws-login-users-guide.html', priority: 'low' },
          { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', href: 'security-governance/iam-role-policies-guide.html', priority: 'high' },
          { title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド', href: 'security-governance/iam-access-analyzer-policy-generation-guide.html' },
          { title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解', href: 'security-governance/iam-access-analyzer-guide.html' },
          { title: 'IAM 権限評価モデル & 操作経路 完全ガイド', href: 'security-governance/iam-permission-evaluation-guide.html', priority: 'high' },
          { title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作', href: 'security-governance/iam-mfa-emergency-rescue-guide.html', priority: 'low' },
          { title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', href: 'security-governance/cognito-pre-signup-trigger-guide.html', priority: 'low' },
          { title: 'AWS CLI 認証情報の指定方法 完全ガイド', href: 'security-governance/aws-cli-credentials-guide.html', priority: 'low' },
          { title: 'IAM パーミッションバウンダリー 完全ガイド', href: 'security-governance/iam-permission-boundary-guide.html', priority: 'high' },
          { title: 'SAML障害時のブレークグラスユーザー完全ガイド', href: 'security-governance/breakglass-user-guide.html' },
          { title: 'IAM 認証情報レポート完全ガイド', href: 'security-governance/iam-credential-report-guide.html' },
          { title: 'IAM認証情報レポート - セキュリティインシデント初動調査ガイド', href: 'security-governance/iam-credential-report-incident-guide.html', priority: 'low' },
          { title: 'sts:ExternalId 完全マスターガイド', href: 'security-governance/sts-externalid-complete-guide.html', priority: 'high' },
          { title: 'IAM Identity Center 完全ガイド - Organizations一括管理', href: 'security-governance/iam-identity-center-guide.html', priority: 'high' }
        ]
      },
      {
        title: '暗号化 & 証明書管理',
        icon: '🔐',
        count: 6,
        lastUpdated: '2026-01-10',
        resources: [
          { title: 'ACM SAN インフォグラフィック', href: 'security-governance/acm-san-infographic.html', priority: 'low' },
          { title: 'CMK インフォグラフィック', href: 'security-governance/aws_cmk_infographic.html' },
          { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', href: 'security-governance/kms-grants-guide.html', priority: 'high' },
          { title: 'AWS KMS キーの種類 完全ガイド', href: 'security-governance/kms-key-types.html', priority: 'high' },
          { title: 'AWS KMS スロットリング対策 & Encryption SDK キャッシュ完全ガイド', href: 'security-governance/kms-throttling-encryption-sdk-guide.html' }
        ]
      },
      {
        title: 'Organizations & ガバナンス',
        icon: '🏢',
        count: 38,
        lastUpdated: '2026-02-15',
        resources: [
          { title: 'AWS CodeArtifact 完全ガイド', href: 'security-governance/codeartifact-guide.html', priority: 'low' },
          { title: 'Cognito IDプールIAMロール完全ガイド', href: 'security-governance/cognito-identity-pool-roles-guide.html' },
          { title: 'IAM Roles Anywhere 完全ガイド', href: 'security-governance/iam-roles-anywhere-guide.html' },
          { title: 'CloudFormationドリフト検出と自動修復完全ガイド', href: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html' },
          { title: 'AWS Config - S3パブリックアクセス検出完全ガイド', href: 'security-governance/aws-config-s3-public-access-guide.html' },
          { title: 'Storage Gateway RefreshCache 自動化完全ガイド', href: 'security-governance/storage-gateway-refreshcache-automation-guide.html', priority: 'low' },
          { title: 'CloudWatch Logs 集中集約完全ガイド', href: 'security-governance/cloudwatch-logs-subscription-guide.html' },
          { title: 'Control Tower Guardrails', href: 'security-governance/aws-control-tower-guardrails.html', priority: 'high' },
          { title: 'Organization & Control Tower', href: 'security-governance/aws-organization-control-tower.html', priority: 'high' },
          { title: 'SCP 簡単解説', href: 'organizational-complexity/aws-scp-simplified.html', priority: 'high' },
          { title: 'Organizations インフォグラフィック', href: 'organizational-complexity/aws_org_infographic.html' },
          { title: 'AWS Config × Organizations 完全ガイド', href: 'security-governance/aws-config-organizations-guide.html', priority: 'high' },
          { title: 'Control Tower 自動展開 (CfCT) ガイド', href: 'organizational-complexity/control-tower-cfct-guide.html' },
          { title: 'CIS AWS Foundations ベンチマーク継続評価ガイド', href: 'security-governance/cis-benchmark-security-hub-config-guide.html', priority: 'low' },
          { title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド', href: 'security-governance/opensearch-dashboards-guide.html', priority: 'low' },
          { title: 'AWS Config コンフォーマンスパック & StackSets 完全ガイド', href: 'security-governance/aws-config-conformance-stacksets-guide.html' },
          { title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド', href: 'security-governance/aws-managed-vs-customer-managed-policies.html' },
          { title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', href: 'security-governance/aws-monitoring-guide.html' },
          { title: 'AWS Nitro Enclaves 完全ガイド', href: 'security-governance/nitro-enclaves-guide.html', priority: 'low' },
          { title: 'CloudTrail 整合性検証 & ダイジェストファイル 完全ガイド', href: 'security-governance/cloudtrail-integrity-validation-guide.html' },
          { title: 'CloudTrail ログプレフィックス完全ガイド', href: 'security-governance/cloudtrail-log-prefix-guide.html', priority: 'low' },
          { title: 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito', href: 'security-governance/iam-identity-center-comparison-guide.html', priority: 'high' },
          { title: 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', href: 'security-governance/amazon-inspector-agentless-guide.html', priority: 'low' },
          { title: 'EKS コントロールプレーンログ & CloudTrail 監査ログ 完全図解ガイド', href: 'security-governance/eks-control-plane-logging-guide.html', priority: 'low' },
          { title: 'CloudTrail 管理イベント vs データイベント 完全ガイド', href: 'security-governance/cloudtrail-events-guide.html', priority: 'high' },
          { title: 'Amazon Q Business アクセス制御 & ガードレール完全ガイド', href: 'security-governance/amazon-q-business-access-guardrails-guide.html', priority: 'low' },
          { title: 'AWS Well-Architected フレームワーク 完全図解ガイド', href: 'security-governance/aws-well-architected-complete-guide.html', priority: 'high' },
          { title: 'AWS Config S3配信エラー解決ガイド', href: 'security-governance/aws-config-s3-delivery-error-guide.html', priority: 'low' },
          { title: 'AWS Config access-keys-rotated 完全ガイド', href: 'security-governance/aws-config-access-keys-rotated-guide.html', priority: 'low' },
          { title: 'AWS Config 管理ルール＆CloudTrail修復アクション完全ガイド', href: 'security-governance/aws-config-cloudtrail-remediation-guide.html' },
          { title: 'AWS SCP構文 完全図解ガイド', href: 'security-governance/scp-syntax-visual-guide.html', priority: 'high' },
          { title: 'Amazon Time Sync Service 完全図解ガイド', href: 'security-governance/amazon-time-sync-service-guide.html', priority: 'low' },
          { title: 'AWS CloudTrail主要操作 完全図解ガイド', href: 'security-governance/cloudtrail-operations-guide.html' },
          { title: 'AWS IAMポリシー vs リソースポリシー - 明示的Denyの重要性 完全図解ガイド', href: 'security-governance/iam-resource-policy-deny-guide.html', priority: 'high' },
          { title: 'Amazon Inspector Lambda関数スキャン 完全図解ガイド', href: 'security-governance/inspector-lambda-scan-guide.html', priority: 'low' },
          { title: 'AWS Security Hub 設定ポリシー完全図解ガイド', href: 'security-governance/securityhub-configuration-policies-guide.html' },
          { title: 'OSログローテーション × CloudWatch Logs エージェント 適合確認ガイド', href: 'organizational-complexity/log-rotation-cloudwatch-guide.html', priority: 'low' }
        ]
      },
      {
        title: 'セキュリティ監視・脅威検知',
        icon: '🛡️',
        count: 11,
        lastUpdated: '2026-02-15',
        resources: [
          { title: 'AWS WAF インフォグラフィック', href: 'continuous-improvement/aws_waf_infographic.html', priority: 'high' },
          { title: 'AWS EDR インフォグラフィック', href: 'continuous-improvement/aws_edr_infographic.html' },
          { title: 'SSM RunCommand インフォグラフィック', href: 'continuous-improvement/aws_ssm_runcommand_infographic.html' },
          { title: 'GuardDuty ログソース完全ガイド', href: 'security-governance/guardduty-log-sources-guide.html', priority: 'high' },
          { title: 'VPC トラフィックミラーリング完全ガイド', href: 'security-governance/vpc-traffic-mirroring-guide.html' },
          { title: 'ALB TLSセキュリティポリシー完全ガイド', href: 'security-governance/alb-tls-security-policy-guide.html', priority: 'low' },
          { title: 'GuardDuty EKS Protection 完全ガイド', href: 'security-governance/guardduty-eks-protection-guide.html', priority: 'low' },
          { title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館', href: 'security-governance/security-lake-guide.html' },
          { title: 'GuardDuty EKS/RDS Protection 完全ガイド', href: 'security-governance/guardduty-eks-rds-protection-guide.html', priority: 'low' },
          { title: 'ECS Exec 完全ガイド - コンテナモニタリングの決定版', href: 'security-governance/ecs-exec-monitoring-guide.html', priority: 'low' },
          { title: 'GuardDutyによるトラフィックパターン分析 完全ガイド', href: 'security-governance/guardduty-traffic-analysis-guide.html', priority: 'low' }
        ]
      }
    ]
  },
  {
    id: 'compute-applications',
    title: 'コンピュート・アプリケーション',
    icon: '💻',
    count: 46,
    sections: [
      {
        title: 'EC2 & インスタンス管理',
        icon: '🖥️',
        count: 7,
        lastUpdated: '2026-01-03',
        resources: [
          { title: 'EC2 キャパシティ インフォグラフィック', href: 'compute-applications/aws-ec2-capacity-infographic.html', priority: 'high' },
          { title: 'EC2 ブートストラップ', href: 'new-solutions/ec2-bootstrap-infographic.html' },
          { title: 'EFA インフォグラフィック', href: 'new-solutions/efa_infographic.html', priority: 'low' },
          { title: 'クラスタプレイスメントグループ + EFA', href: 'compute-applications/aws_cluster_pg_efa_infographic.html' },
          { title: 'EC2 Auto Recovery 完全ガイド', href: 'compute-applications/ec2-auto-recovery-guide.html', priority: 'high' },
          { title: 'EC2 ステータスチェック図解ガイド', href: 'compute-applications/ec2-status-check-guide.html' }
        ]
      },
      {
        title: 'Auto Scaling & ロードバランシング',
        icon: '⚖️',
        count: 24,
        lastUpdated: '2026-02-15',
        resources: [
          { title: 'IAM PassRole vs AssumeRole 完全ガイド', href: 'compute-applications/iam-passrole-vs-assumerole-guide.html', priority: 'high' },
          { title: 'Auto Scaling安全なOSアップデート戦略完全ガイド', href: 'compute-applications/autoscaling-safe-os-update-guide.html' },
          { title: 'EC2 Auto Scaling SNS通知完全ガイド', href: 'compute-applications/ec2-autoscaling-notifications-guide.html', priority: 'low' },
          { title: 'EC2終了前ログ退避設計ガイド', href: 'compute-applications/ec2-log-backup-before-termination-guide.html', priority: 'low' },
          { title: 'Fargate awslogsログドライバ完全ガイド', href: 'compute-applications/fargate-awslogs-complete-guide.html', priority: 'low' },
          { title: 'Auto Scaling ウォームプール運用モード完全ガイド', href: 'compute-applications/warmpool-modes-infographic.html' },
          { title: 'CloudWatch Agent Procstat 完全ガイド', href: 'compute-applications/cloudwatch-procstat-guide.html', priority: 'low' },
          { title: 'CloudWatch カスタムメトリクス & PutMetricData 完全ガイド', href: 'compute-applications/cloudwatch-putmetricdata-guide.html' },
          { title: 'AWSグローバルアーキテクチャ完全ガイド', href: 'compute-applications/aws-global-architecture-guide.html', priority: 'high' },
          { title: 'Auto Scaling Warm Pool', href: 'compute-applications/autoscaling_warmpool_infographic.html' },
          { title: 'Auto Scaling インフォグラフィック', href: 'compute-applications/auto_scaling_infographic.html', priority: 'high' },
          { title: 'EC2 Auto Scaling ライフサイクル', href: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html', priority: 'high' },
          { title: 'Auto Scaling ライフサイクル完全ガイド', href: 'compute-applications/autoscaling-lifecycle-guide.html', priority: 'high' },
          { title: 'ALB スティッキーセッション', href: 'compute-applications/alb_sticky_session_infographic.html' },
          { title: 'CodePipeline Deploy Stage と DeploymentGroup の関係', href: 'compute-applications/codepipeline-deploymentgroup-guide.html', priority: 'low' },
          { title: 'ALB ターゲットグループ完全ガイド', href: 'compute-applications/alb-target-group-guide.html' },
          { title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド', href: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
          { title: 'VPC DHCP オプションとカスタム DNS 完全ガイド', href: 'compute-applications/vpc-dhcp-options-guide.html', priority: 'low' },
          { title: 'Auto Scaling インスタンスリフレッシュ完全ガイド', href: 'compute-applications/autoscaling-instance-refresh-guide.html' },
          { title: 'Amazon EventBridge イベントパターン完全図解ガイド', href: 'compute-applications/eventbridge-event-patterns-guide.html' },
          { title: 'Gateway Load Balancer (GWLB) 完全ガイド', href: 'compute-applications/gwlb-guide.html', priority: 'high' },
          { title: 'AWS Elastic Load Balancing (ELB) 完全ガイド - ALB vs NLB', href: 'compute-applications/elb-types-guide.html', priority: 'high' },
          { title: 'なぜALBはVPCエンドポイントサービスとして使えないのか？', href: 'compute-applications/alb-nlb-privatelink-guide.html', priority: 'high' },
          { title: 'NLB + TCPリスナー + mTLS + EKS 完全ガイド', href: 'compute-applications/nlb-mtls-eks-guide.html', priority: 'low' }
        ]
      },
      {
        title: 'Lambda & サーバーレス',
        icon: 'λ',
        count: 3,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'Lambda メトリクス', href: 'compute-applications/aws-lambda-metrics-perfect.html', priority: 'high' },
          { title: 'Lambda メトリクス (2)', href: 'compute-applications/aws-lambda-metrics.html', priority: 'low' },
          { title: 'Lambda エイリアス・カナリー', href: 'new-solutions/lambda-alias-canary.html', priority: 'high' }
        ]
      },
      {
        title: 'コンテナ & アプリケーション統合',
        icon: '📦',
        count: 5,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'ECS インフォグラフィック', href: 'compute-applications/aws_ecs_infographic.html', priority: 'high' },
          { title: 'SQS DLQ インフォグラフィック', href: 'compute-applications/sqs_dlq_infographic.html', priority: 'high' },
          { title: 'SQS Dead-letter Queue & Redrive 完全ガイド', href: 'compute-applications/sqs-dlq-redrive-guide.html' },
          { title: 'AppStream インフォグラフィック', href: 'compute-applications/appstream-infographic.html', priority: 'low' }
        ]
      },
      {
        title: 'システム運用 & パッチ管理',
        icon: '🔧',
        count: 9,
        lastUpdated: '2026-01-10',
        resources: [
          { title: 'AWS ECR イメージスキャン完全ガイド', href: 'continuous-improvement/ecr-image-scanning-guide.html' },
          { title: 'CloudWatch INSIGHT_RULE_METRIC 完全ガイド', href: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html', priority: 'low' },
          { title: 'Patch Manager 自動パッチ適用', href: 'compute-applications/aws_patch_manager_infographic.html', priority: 'high' },
          { title: 'Systems Manager ハイブリッド環境完全ガイド', href: 'continuous-improvement/systems-manager-hybrid-guide.html', priority: 'high' },
          { title: 'EC2 Image Builder 完全ガイド', href: 'continuous-improvement/ec2-image-builder-guide.html' },
          { title: 'CloudWatch Logs データ保護ポリシー完全ガイド', href: 'continuous-improvement/cloudwatch-logs-data-protection-guide.html', priority: 'low' },
          { title: 'AWS Systems Manager OpsCenter 完全ガイド', href: 'compute-applications/opscenter-guide.html' },
          { title: 'AWS Config ec2-managedinstance-applications-required 完全ガイド', href: 'continuous-improvement/ec2-managedinstance-applications-required-guide.html', priority: 'low' },
          { title: 'AWS障害はなぜグローバルに拡大したか？ US-EAST-1の「単一障害点」構造を徹底分析', href: 'continuous-improvement/aws-us-east-1-outage-analysis.html', priority: 'low' }
        ]
      }
    ]
  },
  {
    id: 'content-delivery-dns',
    title: 'コンテンツ配信・DNS',
    icon: '🚀',
    count: 17,
    sections: [
      {
        title: 'CloudFront & コンテンツ配信',
        icon: '⚡',
        count: 11,
        lastUpdated: '2026-02-16',
        resources: [
          { title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53', href: 'content-delivery-dns/dns-records-guide.html', priority: 'high' },
          { title: 'CloudFront キャッシュ', href: 'content-delivery-dns/cloudfront-cache-infographic.html', priority: 'high' },
          { title: 'CloudFront Origin Groups', href: 'new-solutions/cloudfront-origin-groups.html', priority: 'high' },
          { title: 'CloudFront HTTPS ハンドシェイク完全ガイド', href: 'content-delivery-dns/cloudfront-https-guide.html' },
          { title: 'Global Accelerator インフォグラフィック', href: 'content-delivery-dns/global_accelerator_infographic.html', priority: 'high' },
          { title: 'OSI参照モデル × AWSサービス完全ガイド', href: 'content-delivery-dns/osi-aws-services-guide.html', priority: 'low' },
          { title: 'ACM DNS検証 - 超かんたん図解ガイド', href: 'content-delivery-dns/acm-dns-simple-guide.html' },
          { title: 'ALB × PFS 暗号スイート完全ガイド', href: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html', priority: 'low' },
          { title: 'ALB セキュリティポリシー完全ガイド', href: 'content-delivery-dns/alb-security-policy-guide.html', priority: 'low' },
          { title: 'ACM + ALB + EC2 TLS証明書設定 完全ガイド', href: 'content-delivery-dns/acm-alb-ec2-tls-guide.html' },
          { title: 'Lambda@Edge Origin Response X-Frame-Options完全ガイド', href: 'content-delivery-dns/lambda-edge-x-frame-options-guide.html' }
        ]
      },
      {
        title: 'Route53 & DNS管理',
        icon: '🌍',
        count: 7,
        lastUpdated: '2026-01-31',
        resources: [
          { title: 'DNS インフォグラフィック', href: 'content-delivery-dns/aws-dns-infographic.html' },
          { title: 'Route53 ホストゾーン', href: 'new-solutions/route53_hosted_zones_infographic.html', priority: 'high' },
          { title: 'Route53 クロスアカウントガイド', href: 'content-delivery-dns/route53_cross_account_guide.html', priority: 'high' },
          { title: 'Route 53 DNSSEC 完全ガイド - 公証役場のしくみで理解する DNS セキュリティ', href: 'content-delivery-dns/route53-dnssec-guide.html' },
          { title: 'Amazon Route 53 プライベートホストゾーン完全ガイド', href: 'content-delivery-dns/route53-private-hosted-zone-guide.html', priority: 'high' },
          { title: 'Route 53 Resolver DNS Firewall 完全ガイド - フェイルオープン＆フェイルクローズ', href: 'content-delivery-dns/route53-dns-firewall-guide.html', priority: 'high' }
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
        lastUpdated: '2026-01-10',
        resources: [
          { title: 'CloudFormation インフォグラフィック', href: 'development-deployment/aws-cloudformation-infographic.html', priority: 'high' },
          { title: 'CloudFormation 保護ガイド', href: 'development-deployment/cloudformation-protection-guide.html', priority: 'high' },
          { title: 'CloudFormation Service Catalog', href: 'organizational-complexity/cf-service-catalog-infographic.html', priority: 'high' },
          { title: 'AWS SAM インフォグラフィック', href: 'development-deployment/aws_sam_infographic.html' },
          { title: 'CDK インフォグラフィック', href: 'development-deployment/cdk_infographic.html' },
          { title: 'CloudFormation StackSets インフォグラフィック', href: 'development-deployment/stacksets_infographic.html', priority: 'high' },
          { title: 'Amazon Inspector ECRスキャン完全ガイド', href: 'development-deployment/amazon-inspector-ecr-scanning-guide.html', priority: 'low' },
          { title: 'CloudFormation Guard (cfn-guard) 完全ガイド', href: 'development-deployment/cfn-guard-infographic.html' },
          { title: 'CodePipeline & タスク概要 完全ガイド', href: 'development-deployment/codepipeline_infographic_v2.html', priority: 'high' },
          { title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド', href: 'development-deployment/guardduty-suppression-rules.html' },
          { title: 'CloudWatch Logs ログ保持期間 完全ガイド', href: 'development-deployment/cloudwatch-logs-retention-guide.html', priority: 'low' }
        ]
      },
      {
        title: 'API & イベント駆動',
        icon: '⚡',
        count: 3,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'API Gateway インフォグラフィック', href: 'development-deployment/api_gateway_infographic.html', priority: 'high' },
          { title: 'EventBridge インフォグラフィック', href: 'development-deployment/aws-eventbridge-infographic.html', priority: 'high' },
          { title: 'AppSync インフォグラフィック', href: 'development-deployment/aws_appsync_infographic.html' }
        ]
      },
      {
        title: 'CI/CD & デプロイメント',
        icon: '🔄',
        count: 1,
        lastUpdated: '2025-12-15',
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
    count: 13,
    sections: [
      {
        title: 'S3 & オブジェクトストレージ',
        icon: '🪣',
        count: 5,
        lastUpdated: '2026-01-31',
        resources: [
          { title: 'S3 インフォグラフィック', href: 'storage-database/aws_s3_infographic.html', priority: 'high' },
          { title: 'S3 ストレージクラス', href: 'storage-database/s3_storage_classes_infographic.html', priority: 'high' },
          { title: 'S3 セキュリティ インフォグラフィック', href: 'storage-database/s3-security-infographic.html', priority: 'high' },
          { title: 'OpenSearch Service ISM ポリシー完全ガイド', href: 'storage-database/opensearch-ism-policy-guide.html', priority: 'low' },
          { title: 'QuickSight vs OpenSearch Dashboards 完全比較ガイド', href: 'storage-database/quicksight-opensearch-comparison-guide.html', priority: 'low' }
        ]
      },
      {
        title: 'ブロック & ファイルストレージ',
        icon: '💿',
        count: 2,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'EBS FSR インフォグラフィック', href: 'storage-database/aws-ebs-fsr-infographic.html', priority: 'high' },
          { title: 'EFS マウントターゲット', href: 'storage-database/aws-efs-mount-target-infographic.html' }
        ]
      },
      {
        title: 'データベース & キャッシング',
        icon: '🗄️',
        count: 6,
        lastUpdated: '2026-01-31',
        resources: [
          { title: 'Aurora Data API & IAM', href: 'storage-database/aurora_dataapi_iam_infographic.html', priority: 'high' },
          { title: 'ElastiCache インフォグラフィック', href: 'storage-database/elasticache_infographic.html', priority: 'high' },
          { title: 'Redis クラスターモード', href: 'storage-database/redis_cluster_mode_infographic.html' },
          { title: 'Amazon MSK インフォグラフィック', href: 'storage-database/amazon_msk_infographic.html', priority: 'low' },
          { title: 'Amazon Redshift Data Sharing 完全ガイド', href: 'storage-database/redshift-data-sharing-guide.html' },
          { title: 'Amazon OpenSearch Service 完全ガイド', href: 'storage-database/opensearch-guide.html' }
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
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'DMS CDC インフォグラフィック', href: 'migration/aws_dms_cdc_infographic.html', priority: 'high' },
          { title: 'DMS 機能インフォグラフィック', href: 'migration/aws_dms_features_infographic.html', priority: 'high' },
          { title: 'SCT & DMS Migration', href: 'migration/aws_sct_dms_migration_infographic.html', priority: 'high' }
        ]
      },
      {
        title: 'Migration Hub & 移行戦略',
        icon: '🚚',
        count: 8,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド', href: 'migration/blue-green-vs-immutable-visual-guide.html', priority: 'high' },
          { title: 'Migration Hub インフォグラフィック', href: 'migration/aws-migration-hub-infographic.html', priority: 'high' },
          { title: 'Migration インフォグラフィック', href: 'migration/aws_migration_infographic.html', priority: 'high' },
          { title: 'Migration サービス', href: 'migration/aws_migration_services_infographic.html' },
          { title: 'AWS リロケーション・ガイド', href: 'migration/aws_relocate_guide.html' }
        ]
      },
      {
        title: 'ディザスタリカバリ (DR)',
        icon: '🆘',
        count: 2,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'DR インフォグラフィック', href: 'migration/aws-dr-infographic.html', priority: 'high' }
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
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'コストツール', href: 'analytics-bigdata/aws-cost-tools.html', priority: 'high' },
          { title: 'ディスクメトリクス', href: 'analytics-bigdata/aws-disk-metrics.html', priority: 'low' },
          { title: 'エラー インフォグラフィック', href: 'analytics-bigdata/aws-errors-infographic.html' },
          { title: '可用性インフォグラフィック', href: 'analytics-bigdata/aws_availability_infographic.html', priority: 'high' },
          { title: 'Kinesis インフォグラフィック', href: 'analytics-bigdata/kinesis-infographic.html', priority: 'high' }
        ]
      },
      {
        title: 'データ分析',
        icon: '📈',
        count: 3,
        lastUpdated: '2025-12-15',
        resources: [
          { title: 'Kinesis Firehose インフォグラフィック', href: 'analytics-bigdata/kinesis_firehose_infographic.html', priority: 'high' },
          { title: 'Redshift スケーリング インフォグラフィック', href: 'analytics-bigdata/redshift_scaling_infographic.html' },
          { title: 'サーバーレスデータパイプライン', href: 'analytics-bigdata/serverless_data_pipeline_infographic.html' }
        ]
      },
      {
        title: '理解度クイズ・用語集',
        icon: '✏️',
        count: 7,
        lastUpdated: '2026-02-05',
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
  { id: 'networking', icon: '🌐', text: 'ネットワーキング', count: 47 },
  { id: 'security-governance', icon: '🔒', text: 'セキュリティ・ガバナンス', count: 75 },
  { id: 'compute-applications', icon: '💻', text: 'コンピュート・アプリケーション', count: 46 },
  { id: 'content-delivery-dns', icon: '🚀', text: 'コンテンツ配信・DNS', count: 17 },
  { id: 'development-deployment', icon: '🛠️', text: '開発・デプロイメント', count: 15 },
  { id: 'storage-database', icon: '💾', text: 'ストレージ・データベース', count: 13 },
  { id: 'migration', icon: '🔄', text: '移行・転送', count: 11 },
  { id: 'analytics-operations', icon: '📊', text: '分析・運用・クイズ', count: 14 }
];

// 統計データ
const siteStats = {
  majorCategories: 8,
  minorCategories: 26,
  totalResources: '234+',
  offlineSupport: '100%',
  // メタデータ（自動更新スクリプトで管理）
  lastUpdated: '2026/02/18'  // GIT_LAST_COMMIT_DATE - このコメントは自動更新スクリプトのマーカーです
};

// 更新履歴データ
// type: 'content'(コンテンツ追加) | 'feature'(機能追加) | 'exam'(試験変更対応) | 'fix'(修正)
const updateHistory = [
  {
    date: '2026-02-16',
    type: 'feature',
    title: '優先度別リソースグルーピング機能を追加',
    description: 'カテゴリ内リソースを優先度別にグループ分け表示',
    categories: ['all'],
    tags: []
  },
  {
    date: '2026-02-16',
    type: 'fix',
    title: 'ACM/CloudWAN ガイドの表示修正',
    description: 'acm-alb-ec2-tls-guide にCSS link追加、cloud-wan-attachment-policy-guide のタイトル色修正',
    categories: ['content-delivery-dns', 'networking'],
    tags: []
  },
  {
    date: '2026-02-15',
    type: 'content',
    title: 'ネットワーキング・コンピュート・セキュリティ系8リソースを統合',
    description: 'GuardDutyトラフィック分析、ELBガイド、NLB mTLS、PrivateLinkガイド等を追加',
    categories: ['networking', 'compute-applications', 'security-governance'],
    tags: ['新サービス']
  },
  {
    date: '2026-02-14',
    type: 'content',
    title: 'AWS ANS試験サンプル問題10問を追加',
    description: 'ネットワーキングカテゴリにANS試験対策クイズを追加',
    categories: ['networking'],
    tags: []
  },
  {
    date: '2026-02-13',
    type: 'feature',
    title: 'レスポンシブデザイン改善・ハンバーガーメニュー追加',
    description: 'モバイル対応のハンバーガーメニュー、WCAG対応、インラインCSS整理',
    categories: ['all'],
    tags: []
  },
  {
    date: '2026-02-12',
    type: 'content',
    title: 'ネットワーキング・コンピュート系15リソースを統合',
    description: 'VPN/Direct Connect/GWLB等のネットワーキング系リソースを大量追加',
    categories: ['networking', 'compute-applications'],
    tags: ['新サービス']
  },
  {
    date: '2026-02-08',
    type: 'content',
    title: 'Black Belt Transit Gateway Deep Dive資料を追加',
    description: 'ナレッジベースにAWS Black Belt 2025年1月版を追加',
    categories: ['networking'],
    tags: []
  },
  {
    date: '2026-02-05',
    type: 'feature',
    title: 'SAP-C02試験ガイドページを追加',
    description: 'ドメイン別タスク・知識・スキル・関連リソースの試験ガイドを新規作成',
    categories: ['analytics-operations'],
    tags: ['AWS試験変更対応']
  },
  {
    date: '2026-02-02',
    type: 'feature',
    title: '学習ロードマップ・ブックマーク機能を追加',
    description: '経験レベル別4週間学習ロードマップ、localStorage永続化ブックマーク機能',
    categories: ['all'],
    tags: []
  },
  {
    date: '2026-01-31',
    type: 'content',
    title: '新規AWS学習リソース11件を統合',
    description: 'Transit Gateway Deep Dive、Route 53プライベートホストゾーン、Redshift Data Sharing等',
    categories: ['networking', 'content-delivery-dns', 'storage-database', 'compute-applications'],
    tags: ['新サービス']
  },
  {
    date: '2026-01-10',
    type: 'content',
    title: 'セキュリティ・ネットワーキング系20リソースを追加',
    description: 'KMS、Well-Architected、Config、CloudTrail、ACM等の完全ガイドを追加',
    categories: ['security-governance', 'networking', 'content-delivery-dns'],
    tags: []
  },
  {
    date: '2026-01-03',
    type: 'content',
    title: 'セキュリティ・コンピュート系12リソースを追加',
    description: 'Inspector、CloudTrail、EKS、IAM Identity Center等の完全ガイドを追加',
    categories: ['security-governance', 'compute-applications', 'networking'],
    tags: []
  }
];
