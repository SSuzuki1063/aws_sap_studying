// 全リソースデータ
const searchData = [
  { title: 'AWS S3 ストレージクラスを家の収納で理解しよう', category: 'コスト最適化', file: 'cost-control/s3_storage_classes_infographic.html' },
  { title: 'Lambda 予約済み同時実行数とは？', category: 'コスト最適化', file: 'cost-control/lambda_reserved_concurrency_infographic.html' },
  { title: 'ACM + ALB + EC2 TLS証明書設定 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/acm-alb-ec2-tls-guide.html' },
  { title: 'ACM DNS検証 - 超かんたん図解ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/acm-dns-simple-guide.html' },
  { title: 'ALB × PFS 暗号スイート完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html' },
  { title: 'ALB セキュリティポリシー完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/alb-security-policy-guide.html' },
  { title: 'Amazon Route 53 プライベートホストゾーン完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-private-hosted-zone-guide.html' },
  { title: 'Amazon S3 マルチリージョンアクセスポイント', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/s3-mrap-infographic.html' },
  { title: 'AWS Global Accelerator 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/global_accelerator_infographic.html' },
  { title: 'AWS条件付きフォワーダールール解説', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/aws-dns-infographic.html' },
  { title: 'CloudFront HTTPSハンドシェイク完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-https-guide.html' },
  { title: 'CloudFront オリジンフェイルオーバー完全ガイド | AWS学習リソース', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-origin-failover-guide.html' },
  { title: 'CloudFrontのカスタムHTTPヘッダーとCache-Control入門ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-cache-infographic.html' },
  { title: 'DNSサービスのダウンタイムなし移行プロセス - Route 53完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/dns-migration-guide.html' },
  { title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/dns-records-guide.html' },
  { title: 'Lambda@Edge Origin Response X-Frame-Options完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/lambda-edge-x-frame-options-guide.html' },
  { title: 'OSI参照モデル × AWSサービス完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/osi-aws-services-guide.html' },
  { title: 'Route 53 Application Recovery Controller 解説', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-arc-infographic (1).html' },
  { title: 'Route 53 DNSSEC 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-dnssec-100.html' },
  { title: 'Route 53 Resolver DNS Firewall 完全ガイド - フェイルオープン＆フェイルクローズ', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-dns-firewall-guide.html' },
  { title: 'Route 53 Resolver DNS Firewall｜ボットネットC&amp;C対策完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/aws-route53-dns-firewall-botnet-guide.html' },
  { title: 'Route 53 プライベートホストゾーン クロスアカウント関連付け', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53_cross_account_guide.html' },
  { title: 'サブドメイン委任（Subdomain Delegation）完全ガイド - Route 53', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/subdomain-delegation-guide.html' },
  { title: 'ALB ターゲットグループ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb-target-group-guide.html' },
  { title: 'ALBスティッキーセッション完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb_sticky_session_infographic.html' },
  { title: 'Amazon AppStream 2.0 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/appstream-infographic.html' },
  { title: 'Amazon EventBridge イベントパターン完全図解ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/eventbridge-event-patterns-guide.html' },
  { title: 'Amazon EventBridge 概要', category: 'コンピュート・アプリケーション', file: 'compute-applications/eventbridge_infographic (1).html' },
  { title: 'Amazon EventBridge 概要', category: 'コンピュート・アプリケーション', file: 'compute-applications/eventbridge_infographic.html' },
  { title: 'Auto Scaling インスタンスリフレッシュ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-instance-refresh-guide.html' },
  { title: 'Auto Scaling ウォームプール運用モード完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/warmpool-modes-infographic.html' },
  { title: 'Auto Scaling ライフサイクル完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-lifecycle-guide.html' },
  { title: 'Auto Scaling安全なOSアップデート戦略完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-safe-os-update-guide.html' },
  { title: 'AWS AutoScaling Warm Pool 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling_warmpool_infographic.html' },
  { title: 'AWS EC2のInsufficientInstanceCapacityエラーと再起動による解決メカニズム', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-ec2-capacity-infographic.html' },
  { title: 'AWS ECSを料理店経営で理解しよう', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_ecs_infographic.html' },
  { title: 'AWS Elastic Load Balancing (ELB) 完全ガイド - ALB vs NLB', category: 'コンピュート・アプリケーション', file: 'compute-applications/elb-types-guide.html' },
  { title: 'AWS Lambda Invocationメトリクスの解説', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-lambda-metrics.html' },
  { title: 'AWS Lambda Invocationメトリクスの完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-lambda-metrics-perfect.html' },
  { title: 'AWS Patch Manager - 大規模環境での自動パッチ適用', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_patch_manager_infographic.html' },
  { title: 'AWS Placement Group — Infographic', category: 'コンピュート・アプリケーション', file: 'compute-applications/placement-group-infographic.html' },
  { title: 'AWS SQS Dead-letter Queue &amp; Redrive Policy 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/sqs-dlq-redrive-guide.html' },
  { title: 'AWS SQS DLQ &amp; Redrive Policy インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/sqs_dlq_infographic.html' },
  { title: 'AWS Systems Manager OpsCenter 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/opscenter-guide.html' },
  { title: 'AWS クラスタプレイスメントグループ + EFA 解説', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_cluster_pg_efa_infographic.html' },
  { title: 'AWSグローバルアーキテクチャ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-global-architecture-guide.html' },
  { title: 'CloudWatch Agent Procstat 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/cloudwatch-procstat-guide.html' },
  { title: 'CloudWatch カスタムメトリクス &amp; PutMetricData 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/cloudwatch-putmetricdata-guide.html' },
  { title: 'CodePipeline Deploy Stage と DeploymentGroup の関係', category: 'コンピュート・アプリケーション', file: 'compute-applications/codepipeline-deploymentgroup-guide.html' },
  { title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
  { title: 'EC2 Auto Recovery完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-auto-recovery-guide.html' },
  { title: 'EC2 Auto Scaling SNS通知完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-autoscaling-notifications-guide.html' },
  { title: 'EC2ステータスチェック図解ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-status-check-guide.html' },
  { title: 'EC2終了前ログ退避設計ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-log-backup-before-termination-guide.html' },
  { title: 'Fargate awslogsログドライバ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/fargate-awslogs-complete-guide.html' },
  { title: 'Gateway Load Balancer (GWLB) 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/gwlb-guide.html' },
  { title: 'IAM PassRole vs AssumeRole 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/iam-passrole-vs-assumerole-guide.html' },
  { title: 'Lambda関数のエイリアス＆カナリアリリース解説', category: 'コンピュート・アプリケーション', file: 'new-solutions/lambda-alias-canary.html' },
  { title: 'NLB + TCPリスナー + mTLS + EKS 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/nlb-mtls-eks-guide.html' },
  { title: 'NLB ターゲットタイプ 完全解説', category: 'コンピュート・アプリケーション', file: 'compute-applications/nlb-target-types.html' },
  { title: 'VPC DHCP オプションとカスタム DNS 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/vpc-dhcp-options-guide.html' },
  { title: 'なぜALBはVPCエンドポイントサービスとして使えないのか？', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb-nlb-privatelink-guide.html' },
  { title: '大規模瞬間スケール完全図解', category: 'コンピュート・アプリケーション', file: 'compute-applications/auto_scaling_infographic.html' },
  { title: 'Amazon EBS高速スナップショット復元(FSR)初心者ガイド', category: 'ストレージ・データベース', file: 'storage-database/aws-ebs-fsr-infographic.html' },
  { title: 'Amazon MSK をレストランの注文システムで理解しよう', category: 'ストレージ・データベース', file: 'storage-database/amazon_msk_infographic.html' },
  { title: 'Amazon OpenSearch Service 完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/opensearch-guide.html' },
  { title: 'Amazon Redshift Data Sharing 完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/redshift-data-sharing-guide.html' },
  { title: 'Amazon S3 セキュリティ機能の違い', category: 'ストレージ・データベース', file: 'storage-database/s3-security-infographic.html' },
  { title: 'Aurora Data API &amp; IAM認証 完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/aurora_dataapi_iam_infographic.html' },
  { title: 'AWS EFS マウントターゲットの説明', category: 'ストレージ・データベース', file: 'storage-database/aws-efs-mount-target-infographic.html' },
  { title: 'AWS S3 ストレージクラスを家の収納で理解しよう', category: 'ストレージ・データベース', file: 'storage-database/s3_storage_classes_infographic.html' },
  { title: 'AWS S3 機能解説 - 初心者向けガイド', category: 'ストレージ・データベース', file: 'storage-database/aws_s3_infographic.html' },
  { title: 'ElastiCache 可用性・スケーラビリティ機能 詳細ガイド', category: 'ストレージ・データベース', file: 'storage-database/elasticache_infographic.html' },
  { title: 'OpenSearch Service ISM ポリシー完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/opensearch-ism-policy-guide.html' },
  { title: 'QuickSight vs OpenSearch Dashboards 完全比較ガイド', category: 'ストレージ・データベース', file: 'storage-database/quicksight-opensearch-comparison-guide.html' },
  { title: 'Redis クラスターモード完全図解', category: 'ストレージ・データベース', file: 'storage-database/redis_cluster_mode_infographic.html' },
  { title: '【Black Belt】AWS Network Firewall Basic (2021年6月)', category: 'セキュリティ・ガバナンス', file: 'BlackBelt/BlackBelt202106_AWS_Network_Firewall_Basic.pdf' },
  { title: 'ALB TLSセキュリティポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/alb-tls-security-policy-guide.html' },
  { title: 'Amazon CloudWatch Synthetics 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudwatch_synthetics_infographic.html' },
  { title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cognito-pre-signup-trigger-guide.html' },
  { title: 'Amazon EventBridge 概要', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/eventbridge_infographic.html' },
  { title: 'Amazon Inspector Lambda関数スキャン 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/inspector-lambda-scan-guide.html' },
  { title: 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/amazon-inspector-agentless-guide.html' },
  { title: 'Amazon Q Business アクセス制御 &amp; ガードレール完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/amazon-q-business-access-guardrails-guide.html' },
  { title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館', category: 'セキュリティ・ガバナンス', file: 'security-governance/security-lake-guide.html' },
  { title: 'Amazon Time Sync Service 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/amazon-time-sync-service-guide.html' },
  { title: 'API Gateway認証・認可方式 図解版', category: 'セキュリティ・ガバナンス', file: 'security-governance/api_gateway_auth_infographic.html' },
  { title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', category: 'セキュリティ・ガバナンス', file: 'security-governance/abac-principaltag-resourcetag-guide.html' },
  { title: 'AWS ACMでSANを利用した複数ドメインSSL証明書取得ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/acm-san-infographic.html' },
  { title: 'AWS CI/CDパイプライン - レシピ開発から出版まで', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_pipeline_infographic.html' },
  { title: 'AWS CLI 認証情報の指定方法 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-cli-credentials-guide.html' },
  { title: 'AWS CloudFormation変更セットを建築業界で理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudformation_changeset_infographic.html' },
  { title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-monitoring-guide.html' },
  { title: 'AWS CloudTrail Lake 初心者ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudtrail-lake-infographic.html' },
  { title: 'AWS CloudTrail Lake 初心者ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-lake-infographic.html' },
  { title: 'AWS CloudTrail主要操作 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-operations-guide.html' },
  { title: 'AWS CMK（暗号化キー）を銀行の貸金庫で理解しよう', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws_cmk_infographic.html' },
  { title: 'AWS CodeArtifact 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/codeartifact-guide.html' },
  { title: 'AWS CodeBuild buildspec.yaml 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/buildspec_infographic.html' },
  { title: 'AWS CodeDeploy を劇場システムで理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/codedeploy_infographic.html' },
  { title: 'AWS Cognito ユーザープールとIDプールの違い', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-cognito-infographic.html' },
  { title: 'AWS Config - S3パブリックアクセス検出完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-s3-public-access-guide.html' },
  { title: 'AWS Config × Organizations 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-organizations-guide.html' },
  { title: 'AWS Config access-keys-rotated 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-access-keys-rotated-guide.html' },
  { title: 'AWS Config ec2-managedinstance-applications-required 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ec2-managedinstance-applications-required-guide.html' },
  { title: 'AWS Config S3配信エラー解決ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-s3-delivery-error-guide.html' },
  { title: 'AWS Config コンフォーマンスパック &amp; StackSets 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-conformance-stacksets-guide.html' },
  { title: 'AWS Config 管理ルール＆CloudTrail修復アクション完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-cloudtrail-remediation-guide.html' },
  { title: 'AWS Control Tower ガードレール解説', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-control-tower-guardrails.html' },
  { title: 'AWS Control Tower 自動展開完全ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/control-tower-cfct-guide.html' },
  { title: 'AWS ECR イメージスキャン完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ecr-image-scanning-guide.html' },
  { title: 'AWS Elastic Disaster Recovery を災害対策で理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_edr_infographic.html' },
  { title: 'AWS Fault Injection Simulator 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_fis_infographic.html' },
  { title: 'AWS Firewall Manager セキュリティグループポリシー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/firewall-manager-sg-policy-guide.html' },
  { title: 'AWS IAM フェデレーション入門', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/iam_federation_infographic.html' },
  { title: 'AWS IAMポリシー vs リソースポリシー - 明示的Denyの重要性 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-resource-policy-deny-guide.html' },
  { title: 'AWS KMS BYOK 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/kms_byok_infographic.html' },
  { title: 'AWS KMS キーの種類 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-key-types.html' },
  { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-grants-guide.html' },
  { title: 'AWS KMS スロットリング対策 &amp; Encryption SDK キャッシュ完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-throttling-encryption-sdk-guide.html' },
  { title: 'AWS Lambda ベストプラクティス - レストランキッチンで理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/lambda_best_practices_guide.html' },
  { title: 'AWS Nitro Enclaves 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/nitro-enclaves-guide.html' },
  { title: 'AWS Organization と AWS Control Tower の関係', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-organization-control-tower.html' },
  { title: 'AWS Organizations &amp; Control Tower - 視覚的プロセス図解', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws_org_infographic.html' },
  { title: 'AWS Organizations SCPの継承：超シンプル解説', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws-scp-simplified.html' },
  { title: 'AWS RAM VPCプレフィックスリスト共有ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html' },
  { title: 'AWS SCP構文 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/scp-syntax-visual-guide.html' },
  { title: 'AWS Security Hub 設定ポリシー完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/securityhub-configuration-policies-guide.html' },
  { title: 'AWS Session Manager セキュリティコントロール強化ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/session-manager-security-guide.html' },
  { title: 'AWS SSM ドキュメントを料理レシピで理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ssm_document_guide.html' },
  { title: 'AWS Systems Manager Run Command を会社経営で理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_ssm_runcommand_infographic.html' },
  { title: 'AWS Systems Manager 機能解説', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_systems_manager_infographic.html' },
  { title: 'AWS Systems Manager完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/systems-manager-hybrid-guide.html' },
  { title: 'AWS Transit Gateway共有の超簡単ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws-ram-tgw-sharing.html' },
  { title: 'AWS WAF Web ACLルールモード - 警備システムで理解する', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_waf_infographic.html' },
  { title: 'AWS Well-Architected フレームワーク 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-well-architected-complete-guide.html' },
  { title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-managed-vs-customer-managed-policies.html' },
  { title: 'AWS ログインユーザーの種類 - 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-login-users-guide.html' },
  { title: 'AWS障害はなぜグローバルに拡大したか？ US-EAST-1の「単一障害点」構造を徹底分析', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws-us-east-1-outage-analysis.html' },
  { title: 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-identity-center-comparison-guide.html' },
  { title: 'CanaryとLinearデプロイメントの違い', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/canary_linear_infographic.html' },
  { title: 'CIS AWS Foundations ベンチマーク継続評価ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cis-benchmark-security-hub-config-guide.html' },
  { title: 'CloudFormationからAWS Service Catalog製品を作成する方法', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/cf-service-catalog-infographic.html' },
  { title: 'CloudFormationドリフト検出と自動修復完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html' },
  { title: 'CloudTrail ログプレフィックス完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-log-prefix-guide.html' },
  { title: 'CloudTrail 管理イベント vs データイベント 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-events-guide.html' },
  { title: 'CloudTrail 整合性検証 &amp; ダイジェストファイル 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-integrity-validation-guide.html' },
  { title: 'CloudWatch INSIGHT_RULE_METRIC 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html' },
  { title: 'CloudWatch Logs データ保護ポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudwatch-logs-data-protection-guide.html' },
  { title: 'CloudWatch Logs 集中集約完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudwatch-logs-subscription-guide.html' },
  { title: 'Cognito IDプールIAMロール完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cognito-identity-pool-roles-guide.html' },
  { title: 'EC2 Image Builder 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ec2-image-builder-guide.html' },
  { title: 'EC2ボットネットC2通信からの保護ガイド - Route 53 Resolver DNS Firewall', category: 'セキュリティ・ガバナンス', file: 'security-governance/botnet-c2-protection-guide.html' },
  { title: 'ECS Exec 完全ガイド - コンテナモニタリングの決定版', category: 'セキュリティ・ガバナンス', file: 'security-governance/ecs-exec-monitoring-guide.html' },
  { title: 'EKS コントロールプレーンログ &amp; CloudTrail 監査ログ 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/eks-control-plane-logging-guide.html' },
  { title: 'Elastic Beanstalk Blue/Green デプロイメント', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/beanstalk_blue_green_infographic.html' },
  { title: 'Elastic Beanstalk ブルー/グリーンデプロイ完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/blue_green_deploy_infographic.html' },
  { title: 'GuardDuty EKS Protection 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-eks-protection-guide.html' },
  { title: 'GuardDuty EKS/RDS Protection 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-eks-rds-protection-guide.html' },
  { title: 'GuardDuty ログソース完全ガイド - 最大カバレッジ設定', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-log-sources-guide.html' },
  { title: 'GuardDutyによるトラフィックパターン分析 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-traffic-analysis-guide.html' },
  { title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-access-analyzer-policy-generation-guide.html' },
  { title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-access-analyzer-guide.html' },
  { title: 'IAM Identity Center 完全ガイド - Organizations一括管理', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-identity-center-guide.html' },
  { title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-mfa-emergency-rescue-guide.html' },
  { title: 'IAM Roles Anywhere 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-roles-anywhere-guide.html' },
  { title: 'IAM パーミッションバウンダリー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-permission-boundary-guide.html' },
  { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-role-policies-guide.html' },
  { title: 'IAM 権限評価モデル &amp; 操作経路 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-permission-evaluation-guide.html' },
  { title: 'IAM 認証情報レポート完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-credential-report-guide.html' },
  { title: 'IAM認証情報レポート - セキュリティインシデント初動調査ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-credential-report-incident-guide.html' },
  { title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/opensearch-dashboards-guide.html' },
  { title: 'OSログローテーション × CloudWatch Logs エージェント 適合確認ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/log-rotation-cloudwatch-guide.html' },
  { title: 'Route 53 Application Recovery Controller 解説', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/route53-arc-infographic.html' },
  { title: 'SAML証明書ローテーション完全ガイド - IAM IDプロバイダー設定更新', category: 'セキュリティ・ガバナンス', file: 'security-governance/saml-certificate-rotation-guide.html' },
  { title: 'SAML障害時のブレークグラスユーザー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/breakglass-user-guide.html' },
  { title: 'Storage Gateway RefreshCache 自動化完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/storage-gateway-refreshcache-automation-guide.html' },
  { title: 'sts:ExternalId 完全マスターガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/sts-externalid-complete-guide.html' },
  { title: 'VPC トラフィックミラーリング完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/vpc-traffic-mirroring-guide.html' },
  { title: 'Amazon EC2 Elastic Fabric Adapter (EFA) 完全ガイド', category: 'その他', file: 'new-solutions/efa_infographic.html' },
  { title: 'AWS CloudFront オリジングループ簡単解説', category: 'その他', file: 'new-solutions/cloudfront-origin-groups.html' },
  { title: 'EC2 Auto Scaling ライフサイクルフックの図解', category: 'その他', file: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html' },
  { title: 'EC2ブートストラップ入門ガイド', category: 'その他', file: 'new-solutions/ec2-bootstrap-infographic.html' },
  { title: 'Route53 ホストゾーン完全ガイド', category: 'その他', file: 'new-solutions/route53_hosted_zones_infographic.html' },
  { title: '【Black Belt】AWS Networking Fundamentals', category: 'ネットワーキング', file: 'BlackBelt/AWS-54_AWS_networking_Fundamentals_KMD41.pdf' },
  { title: '【Black Belt】AWS Site-to-Site VPN (2021年10月)', category: 'ネットワーキング', file: 'BlackBelt/202110_AWS_Black_Belt_Site-to-Site_VPN.pdf' },
  { title: '【Black Belt】AWS Transit Gateway Deep Dive (2025年1月)', category: 'ネットワーキング', file: 'BlackBelt/AWS-Black-Belt_2025_AWS-Transit-Gateway-deepdive_0122_v1.pdf' },
  { title: '【Black Belt】AWS VPC (2020年10月)', category: 'ネットワーキング', file: 'BlackBelt/20201021_AWS-BlackBelt-VPC.pdf' },
  { title: '📦 EC2インスタンスのネットワークMTU完全ガイド - 宅配便で理解するパケットサイズ', category: 'ネットワーキング', file: 'networking/ec2-mtu-guide.html' },
  { title: 'Amazon EKS セキュリティ完全図解ガイド', category: 'ネットワーキング', file: 'networking/eks-security-visual-guide.html' },
  { title: 'Amazon VPC CNI 完全ガイド', category: 'ネットワーキング', file: 'networking/vpc-cni-guide.html' },
  { title: 'Amazon VPC Network Access Analyzer 完全図解ガイド', category: 'ネットワーキング', file: 'networking/vpc-network-access-analyzer-guide.html' },
  { title: 'AWS BYOIP 完全ガイド - 自社IPアドレスをAWSに持ち込む', category: 'ネットワーキング', file: 'networking/byoip-guide.html' },
  { title: 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド', category: 'ネットワーキング', file: 'networking/cloud-wan-attachment-policy-guide.html' },
  { title: 'AWS Direct Connect ルーティングポリシーと BGP コミュニティ完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-bgp-routing-guide.html' },
  { title: 'AWS Direct Connect ルート制限とルート集約（サマライゼーション）完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-route-summarization-guide.html' },
  { title: 'AWS Direct Connect 接続タイプ完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-connection-types-guide.html' },
  { title: 'AWS Direct Connect 専用接続 vs ホスト型接続を高速道路で理解しよう', category: 'ネットワーキング', file: 'networking/aws-direct-connect-guide.html' },
  { title: 'AWS Direct Connect仮想ゲートウェイ解説', category: 'ネットワーキング', file: 'new-solutions/aws-direct-connect-vgw.html' },
  { title: 'AWS Directory Service 完全ガイド - AD/Managed AD/AD Connector/Simple AD', category: 'ネットワーキング', file: 'networking/aws-directory-service-guide.html' },
  { title: 'AWS EIP &amp; NATゲートウェイ 超初心者ガイド', category: 'ネットワーキング', file: 'new-solutions/aws_eip_nat_infographic.html' },
  { title: 'AWS ENI（Elastic Network Interface）初心者向け図解', category: 'ネットワーキング', file: 'networking/aws-eni-infographic.html' },
  { title: 'AWS Global Accelerator × VPN パフォーマンス向上ガイド', category: 'ネットワーキング', file: 'networking/global-accelerator-vpn-performance-guide.html' },
  { title: 'AWS Hyperplane 完全ガイド - 見えないけど超重要なAWSの交通システム', category: 'ネットワーキング', file: 'networking/aws-hyperplane-guide.html' },
  { title: 'AWS IPv6サポート完全ガイド - 住所体系の大革命', category: 'ネットワーキング', file: 'networking/aws-ipv6-support-guide-v2.html' },
  { title: 'AWS PrivateLink & VPC エンドポイントサービス 完全ガイド', category: 'ネットワーキング', file: 'networking/aws-privatelink-vpc-endpoint-service-guide.html' },
  { title: 'AWS Site-to-Site VPN + Route 53 Resolver 完全ガイド', category: 'ネットワーキング', file: 'networking/site-to-site-vpn-route53-resolver-guide.html' },
  { title: 'AWS Site-to-Site VPN IKEセッション復旧ガイド', category: 'ネットワーキング', file: 'networking/vpn-ike-dpd-recovery-guide.html' },
  { title: 'AWS Site-to-Site VPN 完全ガイド', category: 'ネットワーキング', file: 'networking/aws-site-to-site-vpn-guide.html' },
  { title: 'AWS Site-to-Site VPN 非対称ルーティング問題の解決方法', category: 'ネットワーキング', file: 'networking/aws-vpn-asymmetric-routing-guide.html' },
  { title: 'AWS Transit Gateway Deep Dive 完全ガイド', category: 'ネットワーキング', file: 'networking/transit-gateway-deep-dive.html' },
  { title: 'AWS Transit Gateway Network Manager Route Analyzer 完全ガイド', category: 'ネットワーキング', file: 'networking/route-analyzer-guide.html' },
  { title: 'AWS Transit Gateway ピアリング完全ガイド - 空港ネットワークで理解する', category: 'ネットワーキング', file: 'networking/transit-gateway-peering-guide.html' },
  { title: 'AWS Transit Gateway マルチキャスト完全ガイド - ケーブルTV局で理解するマルチキャスト配信', category: 'ネットワーキング', file: 'networking/tgw-multicast-guide.html' },
  { title: 'AWS Transit Gateway 完全図解 - 共有サービスによる分離VPCパターン', category: 'ネットワーキング', file: 'networking/tgw-isolated-shared-services.html' },
  { title: 'AWS VPNスループットスケーリング完全ガイド - Transit Gateway + ECMP + アクセラレーション', category: 'ネットワーキング', file: 'networking/vpn-throughput-scaling-guide.html' },
  { title: 'AWS VPN接続を郵便システムで理解しよう + Direct Connect比較', category: 'ネットワーキング', file: 'networking/aws-vpn-with-direct-connect-guide.html' },
  { title: 'AWS プレフィックスリスト完全ガイド', category: 'ネットワーキング', file: 'networking/aws-prefix-list-guide.html' },
  { title: 'AWSグローバルインフラストラクチャ完全ガイド | AWS初心者向けインフォグラフィック', category: 'ネットワーキング', file: 'networking/aws-global-infrastructure-guide.html' },
  { title: 'AWSネットワークゲートウェイの比較', category: 'ネットワーキング', file: 'networking/aws-gateways.html' },
  { title: 'BFD完全ガイド - AWS Direct Connectのフェイルオーバー時間を劇的に短縮', category: 'ネットワーキング', file: 'networking/bfd-failover-optimization-guide.html' },
  { title: 'BGPルート選択アルゴリズム完全ガイド', category: 'ネットワーキング', file: 'networking/bgp-route-selection-guide.html' },
  { title: 'CIDRブロックの重複とVPC接続 完全ガイド', category: 'ネットワーキング', file: 'networking/cidr-vpc-connectivity-guide.html' },
  { title: 'CIDRブロック集約と許可プレフィックスリスト完全ガイド', category: 'ネットワーキング', file: 'networking/cidr-aggregation-prefix-list-guide.html' },
  { title: 'Cloud WAN / TGW ルート分離設計の極意', category: 'ネットワーキング', file: 'networking/cloud-wan-tgw-route-isolation-guide.html' },
  { title: 'CloudFront HTTPセキュリティヘッダー完全ガイド', category: 'ネットワーキング', file: 'networking/cloudfront-security-headers-guide.html' },
  { title: 'Direct Connect CloudWatchメトリクス 完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-cloudwatch-metrics-guide.html' },
  { title: 'Direct Connect Gateway・VGW・VIF 完全ガイド | AWS SAP学習リソース', category: 'ネットワーキング', file: 'networking/dx-gateway-vgw-vif-guide.html' },
  { title: 'Direct Connect LAG環境でのMACsec実装ガイド', category: 'ネットワーキング', file: 'networking/macsec-lag-implementation-guide.html' },
  { title: 'Direct Connect ルーティングポリシーと BGP コミュニティ - AWS図解ガイド', category: 'ネットワーキング', file: 'networking/dx-routing-bgp-community-guide.html' },
  { title: 'Direct Connect暗号化ガイド - VPNで実現するセキュアな専用線', category: 'ネットワーキング', file: 'networking/direct_connect_encryption_vpn.html' },
  { title: 'DNS64 & NAT64 完全図解ガイド', category: 'ネットワーキング', file: 'networking/dns64-nat64-guide.html' },
  { title: 'Gateway Load Balancer によるディープパケットインスペクション', category: 'ネットワーキング', file: 'networking/gwlb-deep-packet-inspection-guide.html' },
  { title: 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', category: 'ネットワーキング', file: 'networking/guardduty-credential-exfiltration-guide-v2.html' },
  { title: 'LAG × ハイブリッドBGP - 階層的冗長性システム完全ガイド', category: 'ネットワーキング', file: 'networking/lag_hybrid_bgp_relationship.html' },
  { title: 'NAT ゲートウェイのタイムアウト動作 完全ガイド', category: 'ネットワーキング', file: 'networking/nat-gateway-timeout-guide.html' },
  { title: 'S3バケットポリシー × VPCエンドポイント完全ガイド', category: 'ネットワーキング', file: 'networking/s3-vpc-endpoint-policy-guide.html' },
  { title: 'S3バケットポリシー Principal要素 完全ガイド', category: 'ネットワーキング', file: 'networking/s3-bucket-policy-principal-guide.html' },
  { title: 'Transit Gateway Connect 完全ガイド', category: 'ネットワーキング', file: 'networking/transit-gateway-connect-guide.html' },
  { title: 'Transit Gateway アプライアンスモード 完全ガイド', category: 'ネットワーキング', file: 'networking/tgw-appliance-mode-guide.html' },
  { title: 'VPC Traffic Mirroring × UDP トラフィックキャプチャ完全ガイド', category: 'ネットワーキング', file: 'networking/traffic-mirroring-udp-guide.html' },
  { title: 'VPCとデュアルスタックネットワーキング完全ガイド | AWS学習リソース', category: 'ネットワーキング', file: 'networking/vpc-dual-stack-networking-guide.html' },
  { title: 'VPCトラフィックミラーリング vs VPC Flow Logs - 使い分けガイド', category: 'ネットワーキング', file: 'networking/vpc-traffic-mirroring-vs-flow-logs.html' },
  { title: 'VPCトラフィックミラーリング完全ガイド - 4つの構成要素を徹底図解', category: 'ネットワーキング', file: 'networking/vpc-traffic-mirroring-deep-guide.html' },
  { title: 'VPCフローログ フィールド完全ガイド', category: 'ネットワーキング', file: 'networking/vpc-flow-log-fields-guide.html' },
  { title: 'VPNアクセラレーション vs Global Accelerator - 関係と違いを徹底解説', category: 'ネットワーキング', file: 'networking/vpn-acceleration-vs-global-accelerator.html' },
  { title: 'VPNピアリングとPrivatelinkの比較', category: 'ネットワーキング', file: 'new-solutions/vpn-vs-privatelink.html' },
  { title: 'クロスリージョンEC2通信アーキテクチャ &amp; トラブルシューティング完全ガイド', category: 'ネットワーキング', file: 'networking/cross-region-ec2-communication.html' },
  { title: 'ジャンボフレーム＆MTU問題 完全図解ガイド', category: 'ネットワーキング', file: 'networking/jumbo-frame-mtu-guide.html' },
  { title: 'スプリットトンネル vs フルトンネル VPN - AWS Client VPN | AWS SAP学習リソース', category: 'ネットワーキング', file: 'networking/split-vs-full-tunnel-vpn.html' },
  { title: 'ネットワークACL vs セキュリティグループ 完全ガイド', category: 'ネットワーキング', file: 'networking/nacl-sg-comparison-guide.html' },
  { title: 'ネットワーク層とアプリケーション層の違い', category: 'ネットワーキング', file: 'new-solutions/vpc_privatelink_cidr_overlap.html' },
  { title: 'ハイブリッド DNS アーキテクチャ 完全ガイド', category: 'ネットワーキング', file: 'networking/hybrid-dns-architecture-guide.html' },
  { title: 'パケットの気持ちになって辿る Amazon VPC のルーティング | AWS学習リソース', category: 'ネットワーキング', file: 'networking/vpc-routing-packet-journey.html' },
  { title: 'プレフィックスリスト × AWS RAM 完全ガイド - マルチアカウントIP管理ソリューション', category: 'ネットワーキング', file: 'networking/prefix-list-ram-guide.html' },
  { title: 'AWS DMS Change Data Capture ガイド', category: '移行・転送', file: 'migration/aws_dms_cdc_infographic.html' },
  { title: 'AWS DMS機能詳細ガイド', category: '移行・転送', file: 'migration/aws_dms_features_infographic.html' },
  { title: 'AWS Migration Hub 超わかりやすいガイド', category: '移行・転送', file: 'migration/aws-migration-hub-infographic.html' },
  { title: 'AWS Migration Hubを引っ越し会社で理解しよう', category: '移行・転送', file: 'migration/aws_migration_hub_infographic.html' },
  { title: 'AWS Relocate（再配置）戦略 - 完全解説', category: '移行・転送', file: 'migration/aws_relocate_guide.html' },
  { title: 'AWS SCT &amp; DMS データベース移行を図書館の引っ越しで理解しよう', category: '移行・転送', file: 'migration/aws_database_migration_infographic.html' },
  { title: 'AWS SCT・DMS オンラインマイグレーション完全ガイド', category: '移行・転送', file: 'migration/aws_sct_dms_migration_infographic.html' },
  { title: 'AWS移行サービス群 完全ガイド', category: '移行・転送', file: 'migration/aws_migration_services_infographic.html' },
  { title: 'AWS移行戦略7Rと移行サービス群', category: '移行・転送', file: 'migration/aws_migration_infographic.html' },
  { title: 'AWS災害復旧戦略をレストランで理解しよう', category: '移行・転送', file: 'migration/aws-dr-infographic.html' },
  { title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド', category: '移行・転送', file: 'migration/blue-green-vs-immutable-visual-guide.html' },
  { title: 'Amazon Inspector ECRスキャン完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/amazon-inspector-ecr-scanning-guide.html' },
  { title: 'AWS API Gateway をレストランで理解しよう', category: '開発・デプロイメント', file: 'development-deployment/api_gateway_infographic.html' },
  { title: 'AWS AppSync - 初心者向けガイド', category: '開発・デプロイメント', file: 'development-deployment/aws_appsync_infographic.html' },
  { title: 'AWS CDKを家づくり設計で理解しよう', category: '開発・デプロイメント', file: 'development-deployment/cdk_infographic.html' },
  { title: 'AWS CloudFormation テンプレート作成ガイド', category: '開発・デプロイメント', file: 'development-deployment/aws-cloudformation-infographic.html' },
  { title: 'AWS EventBridge API宛先と入力トランスフォーマー機能の解説', category: '開発・デプロイメント', file: 'development-deployment/aws-eventbridge-infographic.html' },
  { title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/guardduty-suppression-rules.html' },
  { title: 'AWS SAM レストラン経営で理解しよう', category: '開発・デプロイメント', file: 'development-deployment/aws_sam_infographic.html' },
  { title: 'CloudFormation Guard (cfn-guard) 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/cfn-guard-infographic.html' },
  { title: 'CloudFormation StackSets 詳細図解', category: '開発・デプロイメント', file: 'development-deployment/stacksets_infographic.html' },
  { title: 'CloudFormation リソース保持メカニズム', category: '開発・デプロイメント', file: 'development-deployment/cloudformation-protection-guide.html' },
  { title: 'CloudWatch Logs ログ保持期間 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/cloudwatch-logs-retention-guide.html' },
  { title: 'CodePipeline &amp; タスク概要 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/codepipeline_infographic_v2.html' },
  { title: 'CodePipeline アクションタイプ図解ガイド', category: '開発・デプロイメント', file: 'development-deployment/codepipeline-actions-guide.html' },
  { title: 'Amazon Kinesis Data Streamsをベルトコンベアで理解しよう', category: '分析・運用・クイズ', file: 'analytics-bigdata/kinesis-infographic.html' },
  { title: 'AWS EC2ディスクメトリクスの違い', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-disk-metrics.html' },
  { title: 'AWS コスト管理ツール比較', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-cost-tools.html' },
  { title: 'AWSエラー比較: InstanceLimitExceeded vs Insufficient Instance Capacity', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-errors-infographic.html' },
  { title: 'AWS可用性指標：MTTD・MTTR・MTBF完全ガイド', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws_availability_infographic.html' },
  { title: 'Kinesis Data Firehose 高度機能完全図解', category: '分析・運用・クイズ', file: 'analytics-bigdata/kinesis_firehose_infographic.html' },
  { title: 'Redshift スケーリング手段完全図解', category: '分析・運用・クイズ', file: 'analytics-bigdata/redshift_scaling_infographic.html' },
  { title: 'サーバーレスデータパイプライン完全図解', category: '分析・運用・クイズ', file: 'analytics-bigdata/serverless_data_pipeline_infographic.html' },
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

    // 更新履歴「もっと見る/折りたたむ」ボタンのdelegated click handler
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.update-expand-btn');
        if (!btn) return;

        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        var container = btn.previousElementSibling;
        if (!container) return;

        var items = container.querySelectorAll('.update-timeline-item');
        var maxItems = parseInt(btn.getAttribute('data-max-items'), 10);
        var totalItems = parseInt(btn.getAttribute('data-total-items'), 10);

        if (isExpanded) {
            // 折りたたむ
            items.forEach(function(item, index) {
                if (index >= maxItems) {
                    item.classList.add('hidden');
                }
            });
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'もっと見る（残り' + (totalItems - maxItems) + '件）';
        } else {
            // 展開する
            items.forEach(function(item) {
                item.classList.remove('hidden');
            });
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = '折りたたむ';
        }
    });
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
