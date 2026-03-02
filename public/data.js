// AWS SAP学習リソース - データ定義ファイル (自動生成)
// このファイルは scripts/generate-data.mjs により自動生成されます
// 手動編集しないでください

const categoriesData = [
  {
    id: 'networking',
    title: 'ネットワーキング',
    icon: '🌐',
    count: 67,
    sections: [
      {
        title: 'Direct Connect & ハイブリッドネットワーク',
        icon: '🔗',
        count: 15,
        lastUpdated: '2026-02-28',
        resources: [
          { title: 'AWS Direct Connect 専用接続 vs ホスト型接続を高速道路で理解しよう', href: 'networking/aws-direct-connect-guide.html', priority: 'high' },
          { title: 'AWS VPN接続を郵便システムで理解しよう + Direct Connect比較', href: 'networking/aws-vpn-with-direct-connect-guide.html', priority: 'high' },
          { title: 'BFD完全ガイド - AWS Direct Connectのフェイルオーバー時間を劇的に短縮', href: 'networking/bfd-failover-optimization-guide.html', priority: 'low' },
          { title: 'AWS Direct Connect ルーティングポリシーと BGP コミュニティ完全ガイド', href: 'networking/direct-connect-bgp-routing-guide.html' },
          { title: 'Direct Connect CloudWatchメトリクス 完全ガイド', href: 'networking/direct-connect-cloudwatch-metrics-guide.html', priority: 'low' },
          { title: 'AWS Direct Connect 接続タイプ完全ガイド', href: 'networking/direct-connect-connection-types-guide.html', priority: 'high' },
          { title: 'AWS Direct Connect ルート制限とルート集約（サマライゼーション）完全ガイド', href: 'networking/direct-connect-route-summarization-guide.html' },
          { title: 'Direct Connect暗号化ガイド - VPNで実現するセキュアな専用線', href: 'networking/direct_connect_encryption_vpn.html' },
          { title: 'Direct Connect Gateway・VGW・VIF 完全ガイド | AWS SAP学習リソース', href: 'networking/dx-gateway-vgw-vif-guide.html', priority: 'high' },
          { title: 'Direct Connect ルーティングポリシーと BGP コミュニティ - AWS図解ガイド', href: 'networking/dx-routing-bgp-community-guide.html', priority: 'high' },
          { title: 'LAG × ハイブリッドBGP - 階層的冗長性システム完全ガイド', href: 'networking/lag_hybrid_bgp_relationship.html' },
          { title: 'Direct Connect LAG環境でのMACsec実装ガイド', href: 'networking/macsec-lag-implementation-guide.html', priority: 'low' },
          { title: 'AWS Direct Connect仮想ゲートウェイ解説', href: 'new-solutions/aws-direct-connect-vgw.html', priority: 'high' },
          { title: 'VPNピアリングとPrivatelinkの比較', href: 'new-solutions/vpn-vs-privatelink.html' },
          { title: '【Black Belt】AWS Site-to-Site VPN (2021年10月)', href: 'BlackBelt/202110_AWS_Black_Belt_Site-to-Site_VPN.pdf', priority: 'high' }
        ]
      },
      {
        title: 'VPC & ネットワーク基礎',
        icon: '🏗️',
        count: 42,
        lastUpdated: '2026-02-28',
        resources: [
          { title: 'AWS Directory Service 完全ガイド - AD/Managed AD/AD Connector/Simple AD', href: 'networking/aws-directory-service-guide.html' },
          { title: 'AWS ENI（Elastic Network Interface）初心者向け図解', href: 'networking/aws-eni-infographic.html', priority: 'low' },
          { title: 'AWSグローバルインフラストラクチャ完全ガイド | AWS初心者向けインフォグラフィック', href: 'networking/aws-global-infrastructure-guide.html', priority: 'high' },
          { title: 'AWS Hyperplane 完全ガイド - 見えないけど超重要なAWSの交通システム', href: 'networking/aws-hyperplane-guide.html', priority: 'low' },
          { title: 'AWS IPv6サポート完全ガイド - 住所体系の大革命', href: 'networking/aws-ipv6-support-guide-v2.html', priority: 'medium' },
          { title: 'AWS プレフィックスリスト完全ガイド', href: 'networking/aws-prefix-list-guide.html' },
          { title: 'AWS PrivateLink & VPC エンドポイントサービス 完全ガイド', href: 'networking/aws-privatelink-vpc-endpoint-service-guide.html', priority: 'high' },
          { title: 'AWS Site-to-Site VPN 完全ガイド', href: 'networking/aws-site-to-site-vpn-guide.html', priority: 'high' },
          { title: 'AWS Site-to-Site VPN 非対称ルーティング問題の解決方法', href: 'networking/aws-vpn-asymmetric-routing-guide.html' },
          { title: 'BGPルート選択アルゴリズム完全ガイド', href: 'networking/bgp-route-selection-guide.html', priority: 'high' },
          { title: 'AWS BYOIP 完全ガイド - 自社IPアドレスをAWSに持ち込む', href: 'networking/byoip-guide.html', priority: 'low' },
          { title: 'CIDRブロック集約と許可プレフィックスリスト完全ガイド', href: 'networking/cidr-aggregation-prefix-list-guide.html' },
          { title: 'CIDRブロックの重複とVPC接続 完全ガイド', href: 'networking/cidr-vpc-connectivity-guide.html', priority: 'high' },
          { title: 'CloudFront HTTPセキュリティヘッダー完全ガイド', href: 'networking/cloudfront-security-headers-guide.html', priority: 'low' },
          { title: 'DNS64 & NAT64 完全図解ガイド', href: 'networking/dns64-nat64-guide.html', priority: 'medium' },
          { title: '📦 EC2インスタンスのネットワークMTU完全ガイド - 宅配便で理解するパケットサイズ', href: 'networking/ec2-mtu-guide.html', priority: 'low' },
          { title: 'Amazon EKS セキュリティ完全図解ガイド', href: 'networking/eks-security-visual-guide.html' },
          { title: 'AWS Global Accelerator × VPN パフォーマンス向上ガイド', href: 'networking/global-accelerator-vpn-performance-guide.html', priority: 'low' },
          { title: 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', href: 'networking/guardduty-credential-exfiltration-guide-v2.html' },
          { title: 'Gateway Load Balancer によるディープパケットインスペクション', href: 'networking/gwlb-deep-packet-inspection-guide.html', priority: 'high' },
          { title: 'ハイブリッド DNS アーキテクチャ 完全ガイド', href: 'networking/hybrid-dns-architecture-guide.html', priority: 'high' },
          { title: 'ジャンボフレーム＆MTU問題 完全図解ガイド', href: 'networking/jumbo-frame-mtu-guide.html', priority: 'low' },
          { title: 'ネットワークACL vs セキュリティグループ 完全ガイド', href: 'networking/nacl-sg-comparison-guide.html', priority: 'high' },
          { title: 'プレフィックスリスト × AWS RAM 完全ガイド - マルチアカウントIP管理ソリューション', href: 'networking/prefix-list-ram-guide.html', priority: 'medium' },
          { title: 'S3バケットポリシー Principal要素 完全ガイド', href: 'networking/s3-bucket-policy-principal-guide.html' },
          { title: 'S3バケットポリシー × VPCエンドポイント完全ガイド', href: 'networking/s3-vpc-endpoint-policy-guide.html', priority: 'high' },
          { title: 'AWS Site-to-Site VPN + Route 53 Resolver 完全ガイド', href: 'networking/site-to-site-vpn-route53-resolver-guide.html' },
          { title: 'スプリットトンネル vs フルトンネル VPN - AWS Client VPN | AWS SAP学習リソース', href: 'networking/split-vs-full-tunnel-vpn.html', priority: 'high' },
          { title: 'Amazon VPC CNI 完全ガイド', href: 'networking/vpc-cni-guide.html', priority: 'medium' },
          { title: 'VPCとデュアルスタックネットワーキング完全ガイド | AWS学習リソース', href: 'networking/vpc-dual-stack-networking-guide.html', priority: 'medium' },
          { title: 'VPCフローログ フィールド完全ガイド', href: 'networking/vpc-flow-log-fields-guide.html', priority: 'medium' },
          { title: 'Amazon VPC Network Access Analyzer 完全図解ガイド', href: 'networking/vpc-network-access-analyzer-guide.html', priority: 'low' },
          { title: 'パケットの気持ちになって辿る Amazon VPC のルーティング | AWS学習リソース', href: 'networking/vpc-routing-packet-journey.html', priority: 'high' },
          { title: 'VPCトラフィックミラーリング vs VPC Flow Logs - 使い分けガイド', href: 'networking/vpc-traffic-mirroring-vs-flow-logs.html', priority: 'high' },
          { title: 'VPNアクセラレーション vs Global Accelerator - 関係と違いを徹底解説', href: 'networking/vpn-acceleration-vs-global-accelerator.html', priority: 'low' },
          { title: 'AWS Site-to-Site VPN IKEセッション復旧ガイド', href: 'networking/vpn-ike-dpd-recovery-guide.html', priority: 'low' },
          { title: 'AWS VPNスループットスケーリング完全ガイド - Transit Gateway + ECMP + アクセラレーション', href: 'networking/vpn-throughput-scaling-guide.html' },
          { title: 'AWS EIP &amp; NATゲートウェイ 超初心者ガイド', href: 'new-solutions/aws_eip_nat_infographic.html', priority: 'low' },
          { title: 'ネットワーク層とアプリケーション層の違い', href: 'new-solutions/vpc_privatelink_cidr_overlap.html', priority: 'high' },
          { title: 'AWS RAM VPCプレフィックスリスト共有ガイド', href: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html' },
          { title: '【Black Belt】AWS VPC (2020年10月)', href: 'BlackBelt/20201021_AWS-BlackBelt-VPC.pdf', priority: 'high' },
          { title: '【Black Belt】AWS Networking Fundamentals', href: 'BlackBelt/AWS-54_AWS_networking_Fundamentals_KMD41.pdf', priority: 'high' }
        ]
      },
      {
        title: 'Transit Gateway & ゲートウェイ',
        icon: '🚪',
        count: 10,
        lastUpdated: '2026-02-28',
        resources: [
          { title: 'AWSネットワークゲートウェイの比較', href: 'networking/aws-gateways.html', priority: 'high' },
          { title: 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド', href: 'networking/cloud-wan-attachment-policy-guide.html' },
          { title: 'Cloud WAN / TGW ルート分離設計の極意', href: 'networking/cloud-wan-tgw-route-isolation-guide.html', priority: 'high' },
          { title: 'AWS Transit Gateway Network Manager Route Analyzer 完全ガイド', href: 'networking/route-analyzer-guide.html', priority: 'high' },
          { title: 'Transit Gateway アプライアンスモード 完全ガイド', href: 'networking/tgw-appliance-mode-guide.html' },
          { title: 'Transit Gateway Connect 完全ガイド', href: 'networking/transit-gateway-connect-guide.html' },
          { title: 'AWS Transit Gateway Deep Dive 完全ガイド', href: 'networking/transit-gateway-deep-dive.html', priority: 'high' },
          { title: 'AWS Transit Gateway ピアリング完全ガイド - 空港ネットワークで理解する', href: 'networking/transit-gateway-peering-guide.html', priority: 'high' },
          { title: 'AWS Transit Gateway共有の超簡単ガイド', href: 'organizational-complexity/aws-ram-tgw-sharing.html', priority: 'high' },
          { title: '【Black Belt】AWS Transit Gateway Deep Dive (2025年1月)', href: 'BlackBelt/AWS-Black-Belt_2025_AWS-Transit-Gateway-deepdive_0122_v1.pdf' }
        ]
      }
    ]
  },
  {
    id: 'security-governance',
    title: 'セキュリティ・ガバナンス',
    icon: '🛡️',
    count: 79,
    sections: [
      {
        title: 'セキュリティ監視・脅威検知',
        icon: '🛡️',
        count: 16,
        lastUpdated: '2026-02-26',
        resources: [
          { title: 'AWS Elastic Disaster Recovery を災害対策で理解しよう', href: 'continuous-improvement/aws_edr_infographic.html' },
          { title: 'AWS Systems Manager Run Command を会社経営で理解しよう', href: 'continuous-improvement/aws_ssm_runcommand_infographic.html' },
          { title: 'AWS WAF Web ACLルールモード - 警備システムで理解する', href: 'continuous-improvement/aws_waf_infographic.html', priority: 'high' },
          { title: 'AWS CloudTrail Lake 初心者ガイド', href: 'continuous-improvement/cloudtrail-lake-infographic.html' },
          { title: 'AWS Session Manager セキュリティコントロール強化ガイド', href: 'continuous-improvement/session-manager-security-guide.html' },
          { title: 'ALB TLSセキュリティポリシー完全ガイド', href: 'security-governance/alb-tls-security-policy-guide.html', priority: 'low' },
          { title: 'EC2ボットネットC2通信からの保護ガイド - Route 53 Resolver DNS Firewall', href: 'security-governance/botnet-c2-protection-guide.html', priority: 'medium' },
          { title: 'AWS CloudTrail Lake 初心者ガイド', href: 'security-governance/cloudtrail-lake-infographic.html' },
          { title: 'ECS Exec 完全ガイド - コンテナモニタリングの決定版', href: 'security-governance/ecs-exec-monitoring-guide.html', priority: 'low' },
          { title: 'GuardDuty EKS Protection 完全ガイド', href: 'security-governance/guardduty-eks-protection-guide.html', priority: 'low' },
          { title: 'GuardDuty EKS/RDS Protection 完全ガイド', href: 'security-governance/guardduty-eks-rds-protection-guide.html', priority: 'low' },
          { title: 'GuardDuty ログソース完全ガイド - 最大カバレッジ設定', href: 'security-governance/guardduty-log-sources-guide.html', priority: 'high' },
          { title: 'GuardDutyによるトラフィックパターン分析 完全ガイド', href: 'security-governance/guardduty-traffic-analysis-guide.html', priority: 'low' },
          { title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館', href: 'security-governance/security-lake-guide.html' },
          { title: 'VPC トラフィックミラーリング完全ガイド', href: 'security-governance/vpc-traffic-mirroring-guide.html' },
          { title: '【Black Belt】AWS Network Firewall Basic (2021年6月)', href: 'BlackBelt/BlackBelt202106_AWS_Network_Firewall_Basic.pdf', priority: 'high' }
        ]
      },
      {
        title: 'IAM & 認証・認可',
        icon: '👤',
        count: 19,
        lastUpdated: '2026-02-26',
        resources: [
          { title: 'AWS IAM フェデレーション入門', href: 'continuous-improvement/iam_federation_infographic.html', priority: 'high' },
          { title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', href: 'security-governance/abac-principaltag-resourcetag-guide.html' },
          { title: 'API Gateway認証・認可方式 図解版', href: 'security-governance/api_gateway_auth_infographic.html' },
          { title: 'AWS CLI 認証情報の指定方法 完全ガイド', href: 'security-governance/aws-cli-credentials-guide.html', priority: 'low' },
          { title: 'AWS Cognito ユーザープールとIDプールの違い', href: 'security-governance/aws-cognito-infographic.html' },
          { title: 'AWS ログインユーザーの種類 - 完全ガイド', href: 'security-governance/aws-login-users-guide.html', priority: 'low' },
          { title: 'SAML障害時のブレークグラスユーザー完全ガイド', href: 'security-governance/breakglass-user-guide.html' },
          { title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', href: 'security-governance/cognito-pre-signup-trigger-guide.html', priority: 'low' },
          { title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解', href: 'security-governance/iam-access-analyzer-guide.html' },
          { title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド', href: 'security-governance/iam-access-analyzer-policy-generation-guide.html' },
          { title: 'IAM 認証情報レポート完全ガイド', href: 'security-governance/iam-credential-report-guide.html' },
          { title: 'IAM認証情報レポート - セキュリティインシデント初動調査ガイド', href: 'security-governance/iam-credential-report-incident-guide.html', priority: 'low' },
          { title: 'IAM Identity Center 完全ガイド - Organizations一括管理', href: 'security-governance/iam-identity-center-guide.html', priority: 'high' },
          { title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作', href: 'security-governance/iam-mfa-emergency-rescue-guide.html', priority: 'low' },
          { title: 'IAM パーミッションバウンダリー 完全ガイド', href: 'security-governance/iam-permission-boundary-guide.html', priority: 'high' },
          { title: 'IAM 権限評価モデル &amp; 操作経路 完全ガイド', href: 'security-governance/iam-permission-evaluation-guide.html', priority: 'high' },
          { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', href: 'security-governance/iam-role-policies-guide.html', priority: 'high' },
          { title: 'SAML証明書ローテーション完全ガイド - IAM IDプロバイダー設定更新', href: 'security-governance/saml-certificate-rotation-guide.html', priority: 'low' },
          { title: 'sts:ExternalId 完全マスターガイド', href: 'security-governance/sts-externalid-complete-guide.html', priority: 'high' }
        ]
      },
      {
        title: 'Organizations & ガバナンス',
        icon: '🏢',
        count: 38,
        lastUpdated: '2026-02-26',
        resources: [
          { title: 'AWS Organizations SCPの継承：超シンプル解説', href: 'organizational-complexity/aws-scp-simplified.html', priority: 'high' },
          { title: 'AWS Organizations &amp; Control Tower - 視覚的プロセス図解', href: 'organizational-complexity/aws_org_infographic.html' },
          { title: 'AWS Control Tower 自動展開完全ガイド', href: 'organizational-complexity/control-tower-cfct-guide.html' },
          { title: 'OSログローテーション × CloudWatch Logs エージェント 適合確認ガイド', href: 'organizational-complexity/log-rotation-cloudwatch-guide.html', priority: 'low' },
          { title: 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', href: 'security-governance/amazon-inspector-agentless-guide.html', priority: 'low' },
          { title: 'Amazon Q Business アクセス制御 &amp; ガードレール完全ガイド', href: 'security-governance/amazon-q-business-access-guardrails-guide.html', priority: 'low' },
          { title: 'Amazon Time Sync Service 完全図解ガイド', href: 'security-governance/amazon-time-sync-service-guide.html', priority: 'low' },
          { title: 'AWS Config access-keys-rotated 完全ガイド', href: 'security-governance/aws-config-access-keys-rotated-guide.html', priority: 'low' },
          { title: 'AWS Config 管理ルール＆CloudTrail修復アクション完全ガイド', href: 'security-governance/aws-config-cloudtrail-remediation-guide.html' },
          { title: 'AWS Config コンフォーマンスパック &amp; StackSets 完全ガイド', href: 'security-governance/aws-config-conformance-stacksets-guide.html' },
          { title: 'AWS Config × Organizations 完全ガイド', href: 'security-governance/aws-config-organizations-guide.html', priority: 'high' },
          { title: 'AWS Config S3配信エラー解決ガイド', href: 'security-governance/aws-config-s3-delivery-error-guide.html', priority: 'low' },
          { title: 'AWS Config - S3パブリックアクセス検出完全ガイド', href: 'security-governance/aws-config-s3-public-access-guide.html' },
          { title: 'AWS Control Tower ガードレール解説', href: 'security-governance/aws-control-tower-guardrails.html', priority: 'high' },
          { title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド', href: 'security-governance/aws-managed-vs-customer-managed-policies.html' },
          { title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', href: 'security-governance/aws-monitoring-guide.html' },
          { title: 'AWS Organization と AWS Control Tower の関係', href: 'security-governance/aws-organization-control-tower.html', priority: 'high' },
          { title: 'AWS Well-Architected フレームワーク 完全図解ガイド', href: 'security-governance/aws-well-architected-complete-guide.html', priority: 'high' },
          { title: 'CIS AWS Foundations ベンチマーク継続評価ガイド', href: 'security-governance/cis-benchmark-security-hub-config-guide.html', priority: 'low' },
          { title: 'CloudFormationドリフト検出と自動修復完全ガイド', href: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html' },
          { title: 'CloudTrail 管理イベント vs データイベント 完全ガイド', href: 'security-governance/cloudtrail-events-guide.html', priority: 'high' },
          { title: 'CloudTrail 整合性検証 &amp; ダイジェストファイル 完全ガイド', href: 'security-governance/cloudtrail-integrity-validation-guide.html' },
          { title: 'CloudTrail ログプレフィックス完全ガイド', href: 'security-governance/cloudtrail-log-prefix-guide.html', priority: 'low' },
          { title: 'AWS CloudTrail主要操作 完全図解ガイド', href: 'security-governance/cloudtrail-operations-guide.html' },
          { title: 'CloudWatch Logs 集中集約完全ガイド', href: 'security-governance/cloudwatch-logs-subscription-guide.html' },
          { title: 'AWS CodeArtifact 完全ガイド', href: 'security-governance/codeartifact-guide.html', priority: 'low' },
          { title: 'Cognito IDプールIAMロール完全ガイド', href: 'security-governance/cognito-identity-pool-roles-guide.html' },
          { title: 'EKS コントロールプレーンログ &amp; CloudTrail 監査ログ 完全図解ガイド', href: 'security-governance/eks-control-plane-logging-guide.html', priority: 'low' },
          { title: 'AWS Firewall Manager セキュリティグループポリシー 完全ガイド', href: 'security-governance/firewall-manager-sg-policy-guide.html', priority: 'high' },
          { title: 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito', href: 'security-governance/iam-identity-center-comparison-guide.html', priority: 'high' },
          { title: 'AWS IAMポリシー vs リソースポリシー - 明示的Denyの重要性 完全図解ガイド', href: 'security-governance/iam-resource-policy-deny-guide.html', priority: 'high' },
          { title: 'IAM Roles Anywhere 完全ガイド', href: 'security-governance/iam-roles-anywhere-guide.html' },
          { title: 'Amazon Inspector Lambda関数スキャン 完全図解ガイド', href: 'security-governance/inspector-lambda-scan-guide.html', priority: 'low' },
          { title: 'AWS Nitro Enclaves 完全ガイド', href: 'security-governance/nitro-enclaves-guide.html', priority: 'low' },
          { title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド', href: 'security-governance/opensearch-dashboards-guide.html', priority: 'low' },
          { title: 'AWS SCP構文 完全図解ガイド', href: 'security-governance/scp-syntax-visual-guide.html', priority: 'high' },
          { title: 'AWS Security Hub 設定ポリシー完全図解ガイド', href: 'security-governance/securityhub-configuration-policies-guide.html' },
          { title: 'Storage Gateway RefreshCache 自動化完全ガイド', href: 'security-governance/storage-gateway-refreshcache-automation-guide.html', priority: 'low' }
        ]
      },
      {
        title: '暗号化 & 証明書管理',
        icon: '🔐',
        count: 6,
        lastUpdated: '2026-02-26',
        resources: [
          { title: 'AWS KMS BYOK 完全ガイド', href: 'organizational-complexity/kms_byok_infographic.html' },
          { title: 'AWS ACMでSANを利用した複数ドメインSSL証明書取得ガイド', href: 'security-governance/acm-san-infographic.html', priority: 'low' },
          { title: 'AWS CMK（暗号化キー）を銀行の貸金庫で理解しよう', href: 'security-governance/aws_cmk_infographic.html' },
          { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', href: 'security-governance/kms-grants-guide.html', priority: 'high' },
          { title: 'AWS KMS キーの種類 完全ガイド', href: 'security-governance/kms-key-types.html', priority: 'high' },
          { title: 'AWS KMS スロットリング対策 &amp; Encryption SDK キャッシュ完全ガイド', href: 'security-governance/kms-throttling-encryption-sdk-guide.html' }
        ]
      }
    ]
  },
  {
    id: 'compute-applications',
    title: 'コンピュート・アプリケーション',
    icon: '⚙️',
    count: 57,
    sections: [
      {
        title: 'Auto Scaling & ロードバランシング',
        icon: '⚖️',
        count: 25,
        lastUpdated: '2026-02-27',
        resources: [
          { title: 'なぜALBはVPCエンドポイントサービスとして使えないのか？', href: 'compute-applications/alb-nlb-privatelink-guide.html', priority: 'high' },
          { title: 'ALB ターゲットグループ完全ガイド', href: 'compute-applications/alb-target-group-guide.html' },
          { title: 'ALBスティッキーセッション完全ガイド', href: 'compute-applications/alb_sticky_session_infographic.html' },
          { title: '大規模瞬間スケール完全図解', href: 'compute-applications/auto_scaling_infographic.html', priority: 'high' },
          { title: 'Auto Scaling インスタンスリフレッシュ完全ガイド', href: 'compute-applications/autoscaling-instance-refresh-guide.html' },
          { title: 'Auto Scaling ライフサイクル完全ガイド', href: 'compute-applications/autoscaling-lifecycle-guide.html', priority: 'high' },
          { title: 'Auto Scaling安全なOSアップデート戦略完全ガイド', href: 'compute-applications/autoscaling-safe-os-update-guide.html' },
          { title: 'AWS AutoScaling Warm Pool 完全ガイド', href: 'compute-applications/autoscaling_warmpool_infographic.html' },
          { title: 'AWSグローバルアーキテクチャ完全ガイド', href: 'compute-applications/aws-global-architecture-guide.html', priority: 'high' },
          { title: 'CloudWatch Agent Procstat 完全ガイド', href: 'compute-applications/cloudwatch-procstat-guide.html', priority: 'low' },
          { title: 'CloudWatch カスタムメトリクス &amp; PutMetricData 完全ガイド', href: 'compute-applications/cloudwatch-putmetricdata-guide.html' },
          { title: 'CodePipeline Deploy Stage と DeploymentGroup の関係', href: 'compute-applications/codepipeline-deploymentgroup-guide.html', priority: 'low' },
          { title: 'EC2 Auto Scaling SNS通知完全ガイド', href: 'compute-applications/ec2-autoscaling-notifications-guide.html', priority: 'low' },
          { title: 'EC2終了前ログ退避設計ガイド', href: 'compute-applications/ec2-log-backup-before-termination-guide.html', priority: 'low' },
          { title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド', href: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
          { title: 'AWS Elastic Load Balancing (ELB) 完全ガイド - ALB vs NLB', href: 'compute-applications/elb-types-guide.html', priority: 'high' },
          { title: 'Amazon EventBridge イベントパターン完全図解ガイド', href: 'compute-applications/eventbridge-event-patterns-guide.html' },
          { title: 'Fargate awslogsログドライバ完全ガイド', href: 'compute-applications/fargate-awslogs-complete-guide.html', priority: 'low' },
          { title: 'Gateway Load Balancer (GWLB) 完全ガイド', href: 'compute-applications/gwlb-guide.html', priority: 'high' },
          { title: 'IAM PassRole vs AssumeRole 完全ガイド', href: 'compute-applications/iam-passrole-vs-assumerole-guide.html', priority: 'high' },
          { title: 'NLB + TCPリスナー + mTLS + EKS 完全ガイド', href: 'compute-applications/nlb-mtls-eks-guide.html', priority: 'low' },
          { title: 'NLB ターゲットタイプ 完全解説', href: 'compute-applications/nlb-target-types.html', priority: 'high' },
          { title: 'VPC DHCP オプションとカスタム DNS 完全ガイド', href: 'compute-applications/vpc-dhcp-options-guide.html', priority: 'low' },
          { title: 'Auto Scaling ウォームプール運用モード完全ガイド', href: 'compute-applications/warmpool-modes-infographic.html' },
          { title: 'EC2 Auto Scaling ライフサイクルフックの図解', href: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html', priority: 'high' }
        ]
      },
      {
        title: 'コンテナ & アプリケーション統合',
        icon: '📦',
        count: 6,
        lastUpdated: '2026-02-27',
        resources: [
          { title: 'Amazon AppStream 2.0 完全ガイド', href: 'compute-applications/appstream-infographic.html', priority: 'low' },
          { title: 'AWS ECSを料理店経営で理解しよう', href: 'compute-applications/aws_ecs_infographic.html', priority: 'high' },
          { title: 'AWS SQS Dead-letter Queue &amp; Redrive Policy 完全ガイド', href: 'compute-applications/sqs-dlq-redrive-guide.html' },
          { title: 'AWS SQS DLQ &amp; Redrive Policy インフォグラフィック', href: 'compute-applications/sqs_dlq_infographic.html', priority: 'high' },
          { title: 'AWS Systems Manager 機能解説', href: 'continuous-improvement/aws_systems_manager_infographic.html' },
          { title: 'AWS SSM ドキュメントを料理レシピで理解しよう', href: 'continuous-improvement/ssm_document_guide.html' }
        ]
      },
      {
        title: 'EC2 & インスタンス管理',
        icon: '🖥️',
        count: 9,
        lastUpdated: '2026-02-27',
        resources: [
          { title: 'AWS EC2のInsufficientInstanceCapacityエラーと再起動による解決メカニズム', href: 'compute-applications/aws-ec2-capacity-infographic.html', priority: 'high' },
          { title: 'AWS クラスタプレイスメントグループ + EFA 解説', href: 'compute-applications/aws_cluster_pg_efa_infographic.html' },
          { title: 'EC2 Auto Recovery完全ガイド', href: 'compute-applications/ec2-auto-recovery-guide.html', priority: 'high' },
          { title: 'EC2ステータスチェック図解ガイド', href: 'compute-applications/ec2-status-check-guide.html' },
          { title: 'AWS Placement Group — Infographic', href: 'compute-applications/placement-group-infographic.html', priority: 'high' },
          { title: 'AWS Fault Injection Simulator 完全ガイド', href: 'continuous-improvement/aws_fis_infographic.html' },
          { title: 'Amazon CloudWatch Synthetics 完全ガイド', href: 'continuous-improvement/cloudwatch_synthetics_infographic.html' },
          { title: 'EC2ブートストラップ入門ガイド', href: 'new-solutions/ec2-bootstrap-infographic.html' },
          { title: 'Amazon EC2 Elastic Fabric Adapter (EFA) 完全ガイド', href: 'new-solutions/efa_infographic.html', priority: 'low' }
        ]
      },
      {
        title: 'Lambda & サーバーレス',
        icon: 'λ',
        count: 8,
        lastUpdated: '2026-02-27',
        resources: [
          { title: 'AWS Lambda Invocationメトリクスの完全ガイド', href: 'compute-applications/aws-lambda-metrics-perfect.html', priority: 'high' },
          { title: 'AWS Lambda Invocationメトリクスの解説', href: 'compute-applications/aws-lambda-metrics.html', priority: 'low' },
          { title: 'Amazon EventBridge 概要', href: 'compute-applications/eventbridge_infographic (1).html' },
          { title: 'Amazon EventBridge 概要', href: 'compute-applications/eventbridge_infographic.html' },
          { title: 'Amazon EventBridge 概要', href: 'continuous-improvement/eventbridge_infographic.html' },
          { title: 'AWS Lambda ベストプラクティス - レストランキッチンで理解しよう', href: 'continuous-improvement/lambda_best_practices_guide.html' },
          { title: 'Lambda 予約済み同時実行数とは？', href: 'cost-control/lambda_reserved_concurrency_infographic.html' },
          { title: 'Lambda関数のエイリアス＆カナリアリリース解説', href: 'new-solutions/lambda-alias-canary.html', priority: 'high' }
        ]
      },
      {
        title: 'システム運用 & パッチ管理',
        icon: '🔧',
        count: 9,
        lastUpdated: '2026-02-27',
        resources: [
          { title: 'AWS Patch Manager - 大規模環境での自動パッチ適用', href: 'compute-applications/aws_patch_manager_infographic.html', priority: 'high' },
          { title: 'AWS Systems Manager OpsCenter 完全ガイド', href: 'compute-applications/opscenter-guide.html' },
          { title: 'AWS障害はなぜグローバルに拡大したか？ US-EAST-1の「単一障害点」構造を徹底分析', href: 'continuous-improvement/aws-us-east-1-outage-analysis.html', priority: 'low' },
          { title: 'CloudWatch INSIGHT_RULE_METRIC 完全ガイド', href: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html', priority: 'low' },
          { title: 'CloudWatch Logs データ保護ポリシー完全ガイド', href: 'continuous-improvement/cloudwatch-logs-data-protection-guide.html', priority: 'low' },
          { title: 'EC2 Image Builder 完全ガイド', href: 'continuous-improvement/ec2-image-builder-guide.html' },
          { title: 'AWS Config ec2-managedinstance-applications-required 完全ガイド', href: 'continuous-improvement/ec2-managedinstance-applications-required-guide.html', priority: 'low' },
          { title: 'AWS ECR イメージスキャン完全ガイド', href: 'continuous-improvement/ecr-image-scanning-guide.html' },
          { title: 'AWS Systems Manager完全ガイド', href: 'continuous-improvement/systems-manager-hybrid-guide.html', priority: 'high' }
        ]
      }
    ]
  },
  {
    id: 'content-delivery-dns',
    title: 'コンテンツ配信・DNS',
    icon: '🌍',
    count: 23,
    sections: [
      {
        title: 'CloudFront & コンテンツ配信',
        icon: '⚡',
        count: 13,
        lastUpdated: '2026-02-24',
        resources: [
          { title: 'ACM + ALB + EC2 TLS証明書設定 完全ガイド', href: 'content-delivery-dns/acm-alb-ec2-tls-guide.html' },
          { title: 'ACM DNS検証 - 超かんたん図解ガイド', href: 'content-delivery-dns/acm-dns-simple-guide.html' },
          { title: 'ALB × PFS 暗号スイート完全ガイド', href: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html', priority: 'low' },
          { title: 'ALB セキュリティポリシー完全ガイド', href: 'content-delivery-dns/alb-security-policy-guide.html', priority: 'low' },
          { title: 'CloudFrontのカスタムHTTPヘッダーとCache-Control入門ガイド', href: 'content-delivery-dns/cloudfront-cache-infographic.html', priority: 'high' },
          { title: 'CloudFront HTTPSハンドシェイク完全ガイド', href: 'content-delivery-dns/cloudfront-https-guide.html' },
          { title: 'CloudFront オリジンフェイルオーバー完全ガイド | AWS学習リソース', href: 'content-delivery-dns/cloudfront-origin-failover-guide.html', priority: 'high' },
          { title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53', href: 'content-delivery-dns/dns-records-guide.html', priority: 'high' },
          { title: 'AWS Global Accelerator 完全ガイド', href: 'content-delivery-dns/global_accelerator_infographic.html', priority: 'high' },
          { title: 'Lambda@Edge Origin Response X-Frame-Options完全ガイド', href: 'content-delivery-dns/lambda-edge-x-frame-options-guide.html' },
          { title: 'OSI参照モデル × AWSサービス完全ガイド', href: 'content-delivery-dns/osi-aws-services-guide.html', priority: 'low' },
          { title: 'Amazon S3 マルチリージョンアクセスポイント', href: 'content-delivery-dns/s3-mrap-infographic.html' },
          { title: 'AWS CloudFront オリジングループ簡単解説', href: 'new-solutions/cloudfront-origin-groups.html', priority: 'high' }
        ]
      },
      {
        title: 'Route53 & DNS管理',
        icon: '🌍',
        count: 10,
        lastUpdated: '2026-02-24',
        resources: [
          { title: 'AWS条件付きフォワーダールール解説', href: 'content-delivery-dns/aws-dns-infographic.html' },
          { title: 'Route 53 Resolver DNS Firewall｜ボットネットC&amp;C対策完全ガイド', href: 'content-delivery-dns/aws-route53-dns-firewall-botnet-guide.html', priority: 'medium' },
          { title: 'Route 53 Application Recovery Controller 解説', href: 'content-delivery-dns/route53-arc-infographic (1).html' },
          { title: 'Route 53 Resolver DNS Firewall 完全ガイド - フェイルオープン＆フェイルクローズ', href: 'content-delivery-dns/route53-dns-firewall-guide.html', priority: 'high' },
          { title: 'Route 53 DNSSEC 完全ガイド', href: 'content-delivery-dns/route53-dnssec-100.html', priority: 'medium' },
          { title: 'Route 53 DNSSEC 完全ガイド - 公証役場のしくみで理解する DNS セキュリティ', href: 'content-delivery-dns/route53-dnssec-guide.html' },
          { title: 'Amazon Route 53 プライベートホストゾーン完全ガイド', href: 'content-delivery-dns/route53-private-hosted-zone-guide.html', priority: 'high' },
          { title: 'Route 53 プライベートホストゾーン クロスアカウント関連付け', href: 'content-delivery-dns/route53_cross_account_guide.html', priority: 'high' },
          { title: 'Route 53 Application Recovery Controller 解説', href: 'continuous-improvement/route53-arc-infographic.html' },
          { title: 'Route53 ホストゾーン完全ガイド', href: 'new-solutions/route53_hosted_zones_infographic.html', priority: 'high' }
        ]
      }
    ]
  },
  {
    id: 'development-deployment',
    title: '開発・デプロイメント',
    icon: '🚀',
    count: 22,
    sections: [
      {
        title: 'CI/CD & デプロイ',
        icon: '📄',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS CI/CDパイプライン - レシピ開発から出版まで', href: 'continuous-improvement/aws_pipeline_infographic.html' },
          { title: 'Elastic Beanstalk Blue/Green デプロイメント', href: 'continuous-improvement/beanstalk_blue_green_infographic.html' },
          { title: 'Elastic Beanstalk ブルー/グリーンデプロイ完全ガイド', href: 'continuous-improvement/blue_green_deploy_infographic.html' },
          { title: 'AWS CodeBuild buildspec.yaml 完全ガイド', href: 'continuous-improvement/buildspec_infographic.html' },
          { title: 'CanaryとLinearデプロイメントの違い', href: 'continuous-improvement/canary_linear_infographic.html' },
          { title: 'AWS CodeDeploy を劇場システムで理解しよう', href: 'continuous-improvement/codedeploy_infographic.html' }
        ]
      },
      {
        title: 'IaC & CloudFormation',
        icon: '📜',
        count: 12,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS CloudFormation変更セットを建築業界で理解しよう', href: 'continuous-improvement/cloudformation_changeset_infographic.html' },
          { title: 'Amazon Inspector ECRスキャン完全ガイド', href: 'development-deployment/amazon-inspector-ecr-scanning-guide.html', priority: 'low' },
          { title: 'AWS CloudFormation テンプレート作成ガイド', href: 'development-deployment/aws-cloudformation-infographic.html', priority: 'high' },
          { title: 'AWS SAM レストラン経営で理解しよう', href: 'development-deployment/aws_sam_infographic.html' },
          { title: 'AWS CDKを家づくり設計で理解しよう', href: 'development-deployment/cdk_infographic.html' },
          { title: 'CloudFormation Guard (cfn-guard) 完全ガイド', href: 'development-deployment/cfn-guard-infographic.html' },
          { title: 'CloudFormation リソース保持メカニズム', href: 'development-deployment/cloudformation-protection-guide.html', priority: 'high' },
          { title: 'CloudWatch Logs ログ保持期間 完全ガイド', href: 'development-deployment/cloudwatch-logs-retention-guide.html', priority: 'low' },
          { title: 'CodePipeline &amp; タスク概要 完全ガイド', href: 'development-deployment/codepipeline_infographic_v2.html', priority: 'high' },
          { title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド', href: 'development-deployment/guardduty-suppression-rules.html' },
          { title: 'CloudFormation StackSets 詳細図解', href: 'development-deployment/stacksets_infographic.html', priority: 'high' },
          { title: 'CloudFormationからAWS Service Catalog製品を作成する方法', href: 'organizational-complexity/cf-service-catalog-infographic.html', priority: 'high' }
        ]
      },
      {
        title: 'API & イベント駆動',
        icon: '⚡',
        count: 3,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS API Gateway をレストランで理解しよう', href: 'development-deployment/api_gateway_infographic.html', priority: 'high' },
          { title: 'AWS EventBridge API宛先と入力トランスフォーマー機能の解説', href: 'development-deployment/aws-eventbridge-infographic.html', priority: 'high' },
          { title: 'AWS AppSync - 初心者向けガイド', href: 'development-deployment/aws_appsync_infographic.html' }
        ]
      },
      {
        title: 'CI/CD & デプロイメント',
        icon: '🔄',
        count: 1,
        lastUpdated: '2026-02-19',
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
    count: 14,
    sections: [
      {
        title: 'S3 & オブジェクトストレージ',
        icon: '🪣',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS S3 ストレージクラスを家の収納で理解しよう', href: 'cost-control/s3_storage_classes_infographic.html' },
          { title: 'AWS S3 機能解説 - 初心者向けガイド', href: 'storage-database/aws_s3_infographic.html', priority: 'high' },
          { title: 'OpenSearch Service ISM ポリシー完全ガイド', href: 'storage-database/opensearch-ism-policy-guide.html', priority: 'low' },
          { title: 'QuickSight vs OpenSearch Dashboards 完全比較ガイド', href: 'storage-database/quicksight-opensearch-comparison-guide.html', priority: 'low' },
          { title: 'Amazon S3 セキュリティ機能の違い', href: 'storage-database/s3-security-infographic.html', priority: 'high' },
          { title: 'AWS S3 ストレージクラスを家の収納で理解しよう', href: 'storage-database/s3_storage_classes_infographic.html', priority: 'high' }
        ]
      },
      {
        title: 'データベース & キャッシング',
        icon: '🗄️',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'Amazon MSK をレストランの注文システムで理解しよう', href: 'storage-database/amazon_msk_infographic.html', priority: 'low' },
          { title: 'Aurora Data API &amp; IAM認証 完全ガイド', href: 'storage-database/aurora_dataapi_iam_infographic.html', priority: 'high' },
          { title: 'ElastiCache 可用性・スケーラビリティ機能 詳細ガイド', href: 'storage-database/elasticache_infographic.html', priority: 'high' },
          { title: 'Amazon OpenSearch Service 完全ガイド', href: 'storage-database/opensearch-guide.html' },
          { title: 'Redis クラスターモード完全図解', href: 'storage-database/redis_cluster_mode_infographic.html' },
          { title: 'Amazon Redshift Data Sharing 完全ガイド', href: 'storage-database/redshift-data-sharing-guide.html' }
        ]
      },
      {
        title: 'ブロック & ファイルストレージ',
        icon: '💿',
        count: 2,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'Amazon EBS高速スナップショット復元(FSR)初心者ガイド', href: 'storage-database/aws-ebs-fsr-infographic.html', priority: 'high' },
          { title: 'AWS EFS マウントターゲットの説明', href: 'storage-database/aws-efs-mount-target-infographic.html' }
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
        title: 'ディザスタリカバリ (DR)',
        icon: '🆘',
        count: 1,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS災害復旧戦略をレストランで理解しよう', href: 'migration/aws-dr-infographic.html', priority: 'high' }
        ]
      },
      {
        title: 'Migration Hub & 移行戦略',
        icon: '🚚',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS Migration Hub 超わかりやすいガイド', href: 'migration/aws-migration-hub-infographic.html', priority: 'high' },
          { title: 'AWS Migration Hubを引っ越し会社で理解しよう', href: 'migration/aws_migration_hub_infographic.html' },
          { title: 'AWS移行戦略7Rと移行サービス群', href: 'migration/aws_migration_infographic.html', priority: 'high' },
          { title: 'AWS移行サービス群 完全ガイド', href: 'migration/aws_migration_services_infographic.html' },
          { title: 'AWS Relocate（再配置）戦略 - 完全解説', href: 'migration/aws_relocate_guide.html' },
          { title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド', href: 'migration/blue-green-vs-immutable-visual-guide.html', priority: 'high' }
        ]
      },
      {
        title: 'DMS & データベース移行',
        icon: '🔁',
        count: 4,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS SCT &amp; DMS データベース移行を図書館の引っ越しで理解しよう', href: 'migration/aws_database_migration_infographic.html' },
          { title: 'AWS DMS Change Data Capture ガイド', href: 'migration/aws_dms_cdc_infographic.html', priority: 'high' },
          { title: 'AWS DMS機能詳細ガイド', href: 'migration/aws_dms_features_infographic.html', priority: 'high' },
          { title: 'AWS SCT・DMS オンラインマイグレーション完全ガイド', href: 'migration/aws_sct_dms_migration_infographic.html', priority: 'high' }
        ]
      }
    ]
  },
  {
    id: 'analytics-operations',
    title: '分析・運用・クイズ',
    icon: '📊',
    count: 15,
    sections: [
      {
        title: '分析・運用',
        icon: '📉',
        count: 5,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS コスト管理ツール比較', href: 'analytics-bigdata/aws-cost-tools.html', priority: 'high' },
          { title: 'AWS EC2ディスクメトリクスの違い', href: 'analytics-bigdata/aws-disk-metrics.html', priority: 'low' },
          { title: 'AWSエラー比較: InstanceLimitExceeded vs Insufficient Instance Capacity', href: 'analytics-bigdata/aws-errors-infographic.html' },
          { title: 'AWS可用性指標：MTTD・MTTR・MTBF完全ガイド', href: 'analytics-bigdata/aws_availability_infographic.html', priority: 'high' },
          { title: 'Amazon Kinesis Data Streamsをベルトコンベアで理解しよう', href: 'analytics-bigdata/kinesis-infographic.html', priority: 'high' }
        ]
      },
      {
        title: 'データ分析',
        icon: '📈',
        count: 3,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'Kinesis Data Firehose 高度機能完全図解', href: 'analytics-bigdata/kinesis_firehose_infographic.html', priority: 'high' },
          { title: 'Redshift スケーリング手段完全図解', href: 'analytics-bigdata/redshift_scaling_infographic.html' },
          { title: 'サーバーレスデータパイプライン完全図解', href: 'analytics-bigdata/serverless_data_pipeline_infographic.html' }
        ]
      },
      {
        title: '理解度クイズ・用語集',
        icon: '✏️',
        count: 7,
        lastUpdated: '2026-02-19',
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

const categoryQuickNav = [
  {
    id: 'networking',
    icon: '🌐',
    text: 'ネットワーキング',
    count: 67
  },
  {
    id: 'security-governance',
    icon: '🔒',
    text: 'セキュリティ・ガバナンス',
    count: 79
  },
  {
    id: 'compute-applications',
    icon: '💻',
    text: 'コンピュート・アプリケーション',
    count: 57
  },
  {
    id: 'content-delivery-dns',
    icon: '🚀',
    text: 'コンテンツ配信・DNS',
    count: 23
  },
  {
    id: 'development-deployment',
    icon: '🛠️',
    text: '開発・デプロイメント',
    count: 22
  },
  {
    id: 'storage-database',
    icon: '💾',
    text: 'ストレージ・データベース',
    count: 14
  },
  {
    id: 'migration',
    icon: '🔄',
    text: '移行・転送',
    count: 11
  },
  {
    id: 'analytics-operations',
    icon: '📊',
    text: '分析・運用・クイズ',
    count: 15
  }
];

// 統計データ
const siteStats = {
  majorCategories: 8,
  minorCategories: 27,
  totalResources: '288+',
  offlineSupport: '100%',
  lastUpdated: '2026/03/02'
};

// 更新履歴データ
// type: 'content'(コンテンツ追加) | 'feature'(機能追加) | 'exam'(試験変更対応) | 'fix'(修正)
const updateHistory = [
  {
    date: '2026-02-28',
    type: 'content',
    title: 'ネットワーキング 8リソース追加 — DX, VPC, TGW ガイド群',
    description: 'Direct Connect Gateway/VGW/VIF, BGPコミュニティ, グローバルインフラ, プレフィックスリスト×RAM, スプリット/フルトンネルVPN, VPCパケットルーティング, トラフィックミラーリング vs Flow Logs, Route Analyzerの8件を追加。',
    categories: [
      'networking'
    ],
    tags: [
      'Direct Connect',
      'VGW',
      'BGP',
      'VPN',
      'VPC',
      'Transit Gateway',
      'Route Analyzer',
      'RAM'
    ]
  },
  {
    date: '2026-02-27',
    type: 'content',
    title: 'EC2 プレイスメントグループ 完全インフォグラフィック追加',
    description: 'EC2の3種プレイスメントグループ（Cluster・Spread・Partition）を網羅したインフォグラフィックを追加。概念マップにも比較表ダイアグラムとPartitionキーワードを追加。',
    categories: [
      'compute-applications'
    ],
    tags: [
      'EC2',
      'プレイスメントグループ',
      'HPC',
      'EFA'
    ]
  },
  {
    date: '2026-02-26',
    type: 'content',
    title: 'Black Belt PDF 4件を追加 — VPC, Site-to-Site VPN, Networking Fundamentals, Network Firewall',
    description: 'AWS Black Belt Online Seminar PDF資料をナレッジベースに追加。VPC (2020年10月)、Site-to-Site VPN (2021年10月)、Networking Fundamentals、Network Firewall Basic (2021年6月)。',
    categories: [
      'networking',
      'security-governance'
    ],
    tags: [
      'Black Belt',
      'PDF'
    ]
  },
  {
    date: '2026-02-24',
    type: 'content',
    title: '6リソースを統合（ネットワーキング・セキュリティ・コンテンツ配信・コンピュート）',
    description: 'AWS IPv6サポート完全ガイド・DNS64/NAT64・Cloud WAN/TGWルート分離（networking）、Firewall Manager SGポリシー（security-governance）、CloudFrontオリジンフェイルオーバー（content-delivery-dns）、NLBターゲットタイプ（compute-applications）を統合。',
    categories: [
      'networking',
      'security-governance',
      'content-delivery-dns',
      'compute-applications'
    ],
    tags: [
      '新リソース'
    ]
  },
  {
    date: '2026-02-22',
    type: 'content',
    title: 'ネットワーキング系4リソースを統合',
    description: 'VPCフローログフィールドガイド・GWLB DPI・VPCデュアルスタック（networking新規3本）、BGPルート選択ガイド更新（networking既存1本）を統合。',
    categories: [
      'networking'
    ],
    tags: [
      '新リソース'
    ]
  },
  {
    date: '2026-02-21',
    type: 'feature',
    title: 'AWS概念マップ エンジン 初期リリース',
    description: '5階層知識エンジン（設計軸→ドメイン→サービス→概念→キーワード）・設計軸タグフィルタ・横断検索・クロスリンクバッジを追加。Route53・VPC・EC2・S3・RDS・Lambda・ELB・CloudFront・IAM・CloudWatch 10サービスを収録。',
    categories: [
      'networking',
      'new-solutions',
      'cost-optimization',
      'organizational-complexity'
    ],
    tags: [
      '新機能',
      '概念マップ',
      'SAP対策'
    ]
  },
  {
    date: '2026-02-21',
    type: 'content',
    title: 'ネットワーキング・DNS・セキュリティ系5リソースを統合',
    description: 'VPC CNI・BGPルート選択（networking）、Route53 DNSSEC・DNS Firewallボットネット対策（content-delivery-dns）、ボットネットC2保護ガイド（security-governance）を追加。BlackBelt VPC PDF資料も追加。',
    categories: [
      'networking',
      'content-delivery-dns',
      'security-governance'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-19',
    type: 'fix',
    title: 'サイドバーTOC欠落バグを修正',
    description: 'div.section-titleをh2タグに変換してTOC生成が正常動作するよう修正、integrateスクリプトに警告を追加',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-18',
    type: 'feature',
    title: 'W3C自動検証・git自動ステージング機能を追加',
    description: 'integrate_resource_complete.py にW3C Validator API連携とgit addの自動実行を統合',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-18',
    type: 'content',
    title: 'ネットワーキング・DNS系リソースを統合',
    description: 'CIDRブロック・VPC接続ガイド、AWS Hyperplaneガイド、Route 53 Resolver DNS Firewallガイドを追加',
    categories: [
      'networking',
      'content-delivery-dns'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-18',
    type: 'feature',
    title: '既存リソースにパンくずリスト・サイドバーTOC・ナビゲーションを追加',
    description: 'compute-applications/networking/security-governance の8ファイルに共通ナビゲーション要素を付与',
    categories: [
      'networking',
      'compute-applications',
      'security-governance'
    ],
    tags: []
  },
  {
    date: '2026-02-17',
    type: 'feature',
    title: '更新履歴タイムライン・コンテンツ鮮度バッジ機能を追加',
    description: 'index.htmlに更新履歴タイムラインとリソースカードへの鮮度バッジ表示機能を追加',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-16',
    type: 'feature',
    title: '優先度別リソースグルーピング機能を追加',
    description: 'カテゴリ内リソースを優先度別にグループ分け表示',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-16',
    type: 'fix',
    title: 'ACM/CloudWAN ガイドの表示修正',
    description: 'acm-alb-ec2-tls-guide にCSS link追加、cloud-wan-attachment-policy-guide のタイトル色修正',
    categories: [
      'content-delivery-dns',
      'networking'
    ],
    tags: []
  },
  {
    date: '2026-02-15',
    type: 'content',
    title: 'ネットワーキング・コンピュート・セキュリティ系8リソースを統合',
    description: 'GuardDutyトラフィック分析、ELBガイド、NLB mTLS、PrivateLinkガイド等を追加',
    categories: [
      'networking',
      'compute-applications',
      'security-governance'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-14',
    type: 'content',
    title: 'AWS ANS試験サンプル問題10問を追加',
    description: 'ネットワーキングカテゴリにANS試験対策クイズを追加',
    categories: [
      'networking'
    ],
    tags: []
  },
  {
    date: '2026-02-13',
    type: 'feature',
    title: 'レスポンシブデザイン改善・ハンバーガーメニュー追加',
    description: 'モバイル対応のハンバーガーメニュー、WCAG対応、インラインCSS整理',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-12',
    type: 'content',
    title: 'ネットワーキング・コンピュート系15リソースを統合',
    description: 'VPN/Direct Connect/GWLB等のネットワーキング系リソースを大量追加',
    categories: [
      'networking',
      'compute-applications'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-08',
    type: 'content',
    title: 'Black Belt Transit Gateway Deep Dive資料を追加',
    description: 'ナレッジベースにAWS Black Belt 2025年1月版を追加',
    categories: [
      'networking'
    ],
    tags: []
  },
  {
    date: '2026-02-05',
    type: 'feature',
    title: 'SAP-C02試験ガイドページを追加',
    description: 'ドメイン別タスク・知識・スキル・関連リソースの試験ガイドを新規作成',
    categories: [
      'analytics-operations'
    ],
    tags: [
      'AWS試験変更対応'
    ]
  },
  {
    date: '2026-02-02',
    type: 'feature',
    title: '学習ロードマップ・ブックマーク機能を追加',
    description: '経験レベル別4週間学習ロードマップ、localStorage永続化ブックマーク機能',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-01-31',
    type: 'content',
    title: '新規AWS学習リソース11件を統合',
    description: 'Transit Gateway Deep Dive、Route 53プライベートホストゾーン、Redshift Data Sharing等',
    categories: [
      'networking',
      'content-delivery-dns',
      'storage-database',
      'compute-applications'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-01-10',
    type: 'content',
    title: 'セキュリティ・ネットワーキング系20リソースを追加',
    description: 'KMS、Well-Architected、Config、CloudTrail、ACM等の完全ガイドを追加',
    categories: [
      'security-governance',
      'networking',
      'content-delivery-dns'
    ],
    tags: []
  },
  {
    date: '2026-01-03',
    type: 'content',
    title: 'セキュリティ・コンピュート系12リソースを追加',
    description: 'Inspector、CloudTrail、EKS、IAM Identity Center等の完全ガイドを追加',
    categories: [
      'security-governance',
      'compute-applications',
      'networking'
    ],
    tags: []
  }
];
