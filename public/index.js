// 全リソースデータ
const searchData = [
  { title: 'AWS S3 ストレージクラスを家の収納で理解しよう', category: 'コスト最適化', file: 'cost-control/s3_storage_classes_infographic.html', service: 'S3', tags: 'storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'Lambda 予約済み同時実行数とは？', category: 'コスト最適化', file: 'cost-control/lambda_reserved_concurrency_infographic.html', service: 'Lambda', tags: 'serverless', domains: [2,3], difficulty: 'beginner' },
  { title: 'ACM + ALB + EC2 TLS証明書設定 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/acm-alb-ec2-tls-guide.html', service: 'ACM', tags: 'security', domains: [2,3], difficulty: 'intermediate' },
  { title: 'ACM DNS検証 - 超かんたん図解ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/acm-dns-simple-guide.html', service: 'ACM', tags: 'dns', domains: [2,3], difficulty: 'beginner' },
  { title: 'ALB × PFS 暗号スイート完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html', service: 'ACM', tags: '', domains: [2,3], difficulty: 'advanced' },
  { title: 'ALB セキュリティポリシー完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/alb-security-policy-guide.html', service: 'ALB', tags: 'security', domains: [2,3], difficulty: 'advanced' },
  { title: 'Amazon Route 53 プライベートホストゾーン完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-private-hosted-zone-guide.html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Amazon S3 マルチリージョンアクセスポイント', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/s3-mrap-infographic.html', service: 'CloudFront', tags: 'storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Global Accelerator × IoT デバイス接続 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/aws-global-accelerator-iot-guide.html', service: 'Global Accelerator', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Global Accelerator 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/global_accelerator_infographic.html', service: 'Global Accelerator', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS条件付きフォワーダールール解説', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/aws-dns-infographic.html', service: '', tags: 'dns', domains: [2,3], difficulty: 'beginner' },
  { title: 'CloudFront HTTPSハンドシェイク完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-https-guide.html', service: 'CloudFront', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'CloudFront オリジンフェイルオーバー完全ガイド | AWS学習リソース', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-origin-failover-guide.html', service: 'CloudFront', tags: 'ha', domains: [2,3], difficulty: 'intermediate' },
  { title: 'CloudFrontのカスタムHTTPヘッダーとCache-Control入門ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/cloudfront-cache-infographic.html', service: 'CloudFront', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'DNSサービスのダウンタイムなし移行プロセス - Route 53完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/dns-migration-guide.html', service: 'Route 53', tags: '', domains: [], difficulty: '' },
  { title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/dns-records-guide.html', service: 'Route 53', tags: 'dns database', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Lambda@Edge Origin Response X-Frame-Options完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/lambda-edge-x-frame-options-guide.html', service: 'CloudFront', tags: 'serverless', domains: [2,3], difficulty: 'intermediate' },
  { title: 'OSI参照モデル × AWSサービス完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/osi-aws-services-guide.html', service: '', tags: '', domains: [2,3], difficulty: 'advanced' },
  { title: 'Route 53 Application Recovery Controller 解説', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-arc-infographic (1).html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'beginner' },
  { title: 'Route 53 DNSSEC 完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-dnssec-100.html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Route 53 Resolver DNS Firewall 完全ガイド - フェイルオープン＆フェイルクローズ', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53-dns-firewall-guide.html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Route 53 Resolver DNS Firewall｜ボットネットC&amp;C対策完全ガイド', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/aws-route53-dns-firewall-botnet-guide.html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Route 53 プライベートホストゾーン クロスアカウント関連付け', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/route53_cross_account_guide.html', service: 'Route 53', tags: 'dns multi-account', domains: [1,2], difficulty: 'intermediate' },
  { title: 'サブドメイン委任（Subdomain Delegation）完全ガイド - Route 53', category: 'コンテンツ配信・DNS', file: 'content-delivery-dns/subdomain-delegation-guide.html', service: 'Route 53', tags: '', domains: [], difficulty: '' },
  { title: 'ALB ターゲットグループ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb-target-group-guide.html', service: 'ALB', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'ALBスティッキーセッション完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb_sticky_session_infographic.html', service: 'ALB', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon AppStream 2.0 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/appstream-infographic.html', service: 'AppStream', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon EventBridge イベントパターン完全図解ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/eventbridge-event-patterns-guide.html', service: 'EventBridge', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Amazon EventBridge 概要', category: 'コンピュート・アプリケーション', file: 'compute-applications/eventbridge_infographic (1).html', service: 'EventBridge', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon EventBridge 概要', category: 'コンピュート・アプリケーション', file: 'compute-applications/eventbridge_infographic.html', service: 'EventBridge', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Auto Scaling インスタンスリフレッシュ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-instance-refresh-guide.html', service: 'Auto Scaling', tags: 'scaling', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Auto Scaling ウォームプール運用モード完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/warmpool-modes-infographic.html', service: 'Auto Scaling', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Auto Scaling ライフサイクル完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-lifecycle-guide.html', service: 'Auto Scaling', tags: 'scaling', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Auto Scaling安全なOSアップデート戦略完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling-safe-os-update-guide.html', service: 'Auto Scaling', tags: 'scaling', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS AutoScaling Warm Pool 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/autoscaling_warmpool_infographic.html', service: 'Auto Scaling', tags: 'scaling', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS EC2のInsufficientInstanceCapacityエラーと再起動による解決メカニズム', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-ec2-capacity-infographic.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS ECSを料理店経営で理解しよう', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_ecs_infographic.html', service: 'ECS', tags: 'containers', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Elastic Load Balancing (ELB) 完全ガイド - ALB vs NLB', category: 'コンピュート・アプリケーション', file: 'compute-applications/elb-types-guide.html', service: 'ELB', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Lambda Invocationメトリクスの解説', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-lambda-metrics.html', service: 'Lambda', tags: 'monitoring serverless', domains: [2,3], difficulty: 'advanced' },
  { title: 'AWS Lambda Invocationメトリクスの完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-lambda-metrics-perfect.html', service: 'Lambda', tags: 'monitoring serverless', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Patch Manager - 大規模環境での自動パッチ適用', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_patch_manager_infographic.html', service: 'Systems Manager', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Placement Group — Infographic', category: 'コンピュート・アプリケーション', file: 'compute-applications/placement-group-infographic.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS SQS Dead-letter Queue &amp; Redrive Policy 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/sqs-dlq-redrive-guide.html', service: 'SQS', tags: 'ha', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS SQS DLQ &amp; Redrive Policy インフォグラフィック', category: 'コンピュート・アプリケーション', file: 'compute-applications/sqs_dlq_infographic.html', service: 'SQS', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Systems Manager OpsCenter 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/opscenter-guide.html', service: 'OpsCenter', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS クラスタプレイスメントグループ + EFA 解説', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws_cluster_pg_efa_infographic.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWSグローバルアーキテクチャ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/aws-global-architecture-guide.html', service: '', tags: 'ha', domains: [2], difficulty: 'intermediate' },
  { title: 'CloudWatch Agent Procstat 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/cloudwatch-procstat-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'CloudWatch カスタムメトリクス &amp; PutMetricData 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/cloudwatch-putmetricdata-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'intermediate' },
  { title: 'CodePipeline Deploy Stage と DeploymentGroup の関係', category: 'コンピュート・アプリケーション', file: 'compute-applications/codepipeline-deploymentgroup-guide.html', service: 'CodePipeline', tags: 'deployment', domains: [2,3], difficulty: 'advanced' },
  { title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html', service: 'ECS', tags: 'deployment serverless containers', domains: [2,3], difficulty: 'intermediate' },
  { title: 'EC2 Auto Recovery完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-auto-recovery-guide.html', service: 'EC2', tags: 'ha', domains: [2,3], difficulty: 'intermediate' },
  { title: 'EC2 Auto Scaling SNS通知完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-autoscaling-notifications-guide.html', service: 'EC2', tags: 'scaling', domains: [2,3], difficulty: 'advanced' },
  { title: 'EC2ステータスチェック図解ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-status-check-guide.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'EC2終了前ログ退避設計ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/ec2-log-backup-before-termination-guide.html', service: 'EC2', tags: 'monitoring', domains: [2,3], difficulty: 'advanced' },
  { title: 'Fargate awslogsログドライバ完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/fargate-awslogs-complete-guide.html', service: 'ECS', tags: 'monitoring serverless', domains: [2,3], difficulty: 'advanced' },
  { title: 'Gateway Load Balancer (GWLB) 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/gwlb-guide.html', service: 'Gateway Load Balancer', tags: 'security networking', domains: [2,3], difficulty: 'intermediate' },
  { title: 'IAM PassRole vs AssumeRole 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/iam-passrole-vs-assumerole-guide.html', service: 'IAM', tags: 'comparison security', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Lambda関数のエイリアス＆カナリアリリース解説', category: 'コンピュート・アプリケーション', file: 'new-solutions/lambda-alias-canary.html', service: 'Lambda', tags: 'serverless', domains: [2,3], difficulty: 'intermediate' },
  { title: 'NLB + TCPリスナー + mTLS + EKS 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/nlb-mtls-eks-guide.html', service: 'NLB', tags: 'security containers', domains: [2,3], difficulty: 'advanced' },
  { title: 'NLB ターゲットタイプ 完全解説', category: 'コンピュート・アプリケーション', file: 'compute-applications/nlb-target-types.html', service: 'NLB', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'VPC DHCP オプションとカスタム DNS 完全ガイド', category: 'コンピュート・アプリケーション', file: 'compute-applications/vpc-dhcp-options-guide.html', service: 'VPC', tags: 'networking', domains: [2,3], difficulty: 'advanced' },
  { title: 'なぜALBはVPCエンドポイントサービスとして使えないのか？', category: 'コンピュート・アプリケーション', file: 'compute-applications/alb-nlb-privatelink-guide.html', service: 'VPC PrivateLink', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: '大規模瞬間スケール完全図解', category: 'コンピュート・アプリケーション', file: 'compute-applications/auto_scaling_infographic.html', service: 'Auto Scaling', tags: 'scaling', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon EBS高速スナップショット復元(FSR)初心者ガイド', category: 'ストレージ・データベース', file: 'storage-database/aws-ebs-fsr-infographic.html', service: 'EBS', tags: 'storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon MSK をレストランの注文システムで理解しよう', category: 'ストレージ・データベース', file: 'storage-database/amazon_msk_infographic.html', service: 'MSK', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon OpenSearch Service 完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/opensearch-guide.html', service: 'OpenSearch', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Amazon Redshift Data Sharing 完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/redshift-data-sharing-guide.html', service: 'Redshift', tags: 'ha', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Amazon S3 セキュリティ機能の違い', category: 'ストレージ・データベース', file: 'storage-database/s3-security-infographic.html', service: 'S3', tags: 'security storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'Aurora Data API &amp; IAM認証 完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/aurora_dataapi_iam_infographic.html', service: 'IAM', tags: 'security database', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS EFS マウントターゲットの説明', category: 'ストレージ・データベース', file: 'storage-database/aws-efs-mount-target-infographic.html', service: 'EFS', tags: 'storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS S3 ストレージクラスを家の収納で理解しよう', category: 'ストレージ・データベース', file: 'storage-database/s3_storage_classes_infographic.html', service: 'S3', tags: 'storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS S3 機能解説 - 初心者向けガイド', category: 'ストレージ・データベース', file: 'storage-database/aws_s3_infographic.html', service: 'S3', tags: 'storage', domains: [2,3], difficulty: 'beginner' },
  { title: 'ElastiCache 可用性・スケーラビリティ機能 詳細ガイド', category: 'ストレージ・データベース', file: 'storage-database/elasticache_infographic.html', service: 'ElastiCache', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'OpenSearch Service ISM ポリシー完全ガイド', category: 'ストレージ・データベース', file: 'storage-database/opensearch-ism-policy-guide.html', service: 'OpenSearch', tags: '', domains: [2,3], difficulty: 'advanced' },
  { title: 'QuickSight vs OpenSearch Dashboards 完全比較ガイド', category: 'ストレージ・データベース', file: 'storage-database/quicksight-opensearch-comparison-guide.html', service: 'OpenSearch', tags: 'comparison', domains: [2,3], difficulty: 'advanced' },
  { title: 'Redis クラスターモード完全図解', category: 'ストレージ・データベース', file: 'storage-database/redis_cluster_mode_infographic.html', service: 'ElastiCache', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: '【Black Belt】AWS Network Firewall Basic (2021年6月)', category: 'セキュリティ・ガバナンス', file: 'BlackBelt/BlackBelt202106_AWS_Network_Firewall_Basic.pdf', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'ALB TLSセキュリティポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/alb-tls-security-policy-guide.html', service: 'ACM', tags: 'security', domains: [1,2], difficulty: 'advanced' },
  { title: 'Amazon CloudWatch Synthetics 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudwatch_synthetics_infographic.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'beginner' },
  { title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cognito-pre-signup-trigger-guide.html', service: 'Cognito', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'Amazon EventBridge 概要', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/eventbridge_infographic.html', service: 'EventBridge', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Amazon Inspector Lambda関数スキャン 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/inspector-lambda-scan-guide.html', service: 'Amazon Inspector', tags: 'serverless', domains: [3], difficulty: 'advanced' },
  { title: 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/amazon-inspector-agentless-guide.html', service: 'Amazon Inspector', tags: '', domains: [3], difficulty: 'advanced' },
  { title: 'Amazon Q Business アクセス制御 &amp; ガードレール完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/amazon-q-business-access-guardrails-guide.html', service: '', tags: 'ha', domains: [1,2], difficulty: 'advanced' },
  { title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館', category: 'セキュリティ・ガバナンス', file: 'security-governance/security-lake-guide.html', service: 'Security Lake', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Amazon Time Sync Service 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/amazon-time-sync-service-guide.html', service: '', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'API Gateway認証・認可方式 図解版', category: 'セキュリティ・ガバナンス', file: 'security-governance/api_gateway_auth_infographic.html', service: 'API Gateway', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag', category: 'セキュリティ・ガバナンス', file: 'security-governance/abac-principaltag-resourcetag-guide.html', service: 'IAM', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS ACMでSANを利用した複数ドメインSSL証明書取得ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/acm-san-infographic.html', service: 'ACM', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS CI/CDパイプライン - レシピ開発から出版まで', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_pipeline_infographic.html', service: 'CI/CD Pipeline', tags: 'deployment', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS CLI 認証情報の指定方法 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-cli-credentials-guide.html', service: '', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS CloudFormation変更セットを建築業界で理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudformation_changeset_infographic.html', service: 'CloudFormation', tags: 'ha', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-monitoring-guide.html', service: 'CloudTrail', tags: 'monitoring', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS CloudTrail Lake 初心者ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudtrail-lake-infographic.html', service: 'CloudTrail', tags: '', domains: [3], difficulty: 'beginner' },
  { title: 'AWS CloudTrail Lake 初心者ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-lake-infographic.html', service: 'CloudTrail', tags: '', domains: [3], difficulty: 'beginner' },
  { title: 'AWS CloudTrail主要操作 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-operations-guide.html', service: 'CloudTrail', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS CMK（暗号化キー）を銀行の貸金庫で理解しよう', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws_cmk_infographic.html', service: 'KMS', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS CodeArtifact 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/codeartifact-guide.html', service: 'CodeArtifact', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS CodeBuild buildspec.yaml 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/buildspec_infographic.html', service: 'CodeBuild', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS CodeDeploy を劇場システムで理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/codedeploy_infographic.html', service: 'CodeDeploy', tags: 'deployment', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Cognito ユーザープールとIDプールの違い', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-cognito-infographic.html', service: 'Cognito', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS Config - S3パブリックアクセス検出完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-s3-public-access-guide.html', service: 'AWS Config', tags: 'storage', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS Config × Organizations 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-organizations-guide.html', service: 'AWS Config', tags: 'multi-account', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS Config access-keys-rotated 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-access-keys-rotated-guide.html', service: 'AWS Config', tags: '', domains: [3], difficulty: 'advanced' },
  { title: 'AWS Config ec2-managedinstance-applications-required 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ec2-managedinstance-applications-required-guide.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'advanced' },
  { title: 'AWS Config S3配信エラー解決ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-s3-delivery-error-guide.html', service: 'AWS Config', tags: 'storage', domains: [3], difficulty: 'advanced' },
  { title: 'AWS Config コンフォーマンスパック &amp; StackSets 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-conformance-stacksets-guide.html', service: 'AWS Config', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS Config 管理ルール＆CloudTrail修復アクション完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-config-cloudtrail-remediation-guide.html', service: 'CloudTrail', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS Control Tower ガードレール解説', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-control-tower-guardrails.html', service: 'Control Tower', tags: 'multi-account', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS Control Tower 自動展開完全ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/control-tower-cfct-guide.html', service: 'Control Tower', tags: '', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS ECR イメージスキャン完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ecr-image-scanning-guide.html', service: 'ECR', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Elastic Disaster Recovery を災害対策で理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_edr_infographic.html', service: 'Disaster Recovery', tags: 'ha', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS Fault Injection Simulator 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_fis_infographic.html', service: 'FIS', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Firewall Manager セキュリティグループポリシー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/firewall-manager-sg-policy-guide.html', service: 'Firewall Manager', tags: 'security multi-account', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS IAM フェデレーション入門', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/iam_federation_infographic.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS IAMポリシー vs リソースポリシー - 明示的Denyの重要性 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-resource-policy-deny-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS KMS BYOK 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/kms_byok_infographic.html', service: 'KMS', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS KMS キーの種類 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-key-types.html', service: 'KMS', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-grants-guide.html', service: 'KMS', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS KMS スロットリング対策 &amp; Encryption SDK キャッシュ完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/kms-throttling-encryption-sdk-guide.html', service: 'KMS', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Lambda ベストプラクティス - レストランキッチンで理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/lambda_best_practices_guide.html', service: 'Lambda', tags: 'serverless', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Nitro Enclaves 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/nitro-enclaves-guide.html', service: 'Nitro Enclaves', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Organization と AWS Control Tower の関係', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-organization-control-tower.html', service: 'Control Tower', tags: '', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS Organizations &amp; Control Tower - 視覚的プロセス図解', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws_org_infographic.html', service: 'Organizations', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS Organizations SCPの継承：超シンプル解説', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws-scp-simplified.html', service: 'Organizations', tags: '', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS RAM VPCプレフィックスリスト共有ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html', service: 'VPC', tags: 'networking', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS SCP構文 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/scp-syntax-visual-guide.html', service: 'Organizations', tags: '', domains: [1], difficulty: 'intermediate' },
  { title: 'AWS Security Hub 設定ポリシー完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/securityhub-configuration-policies-guide.html', service: 'Security Hub', tags: 'security', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS Session Manager セキュリティコントロール強化ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/session-manager-security-guide.html', service: 'Systems Manager', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS SSM ドキュメントを料理レシピで理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ssm_document_guide.html', service: 'Systems Manager', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Systems Manager Run Command を会社経営で理解しよう', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_ssm_runcommand_infographic.html', service: 'Systems Manager', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS Systems Manager 機能解説', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_systems_manager_infographic.html', service: 'Systems Manager', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS Systems Manager完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/systems-manager-hybrid-guide.html', service: 'Systems Manager', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'AWS Transit Gateway共有の超簡単ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/aws-ram-tgw-sharing.html', service: 'Transit Gateway', tags: 'ha', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS WAF Web ACLルールモード - 警備システムで理解する', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws_waf_infographic.html', service: 'WAF', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS Well-Architected フレームワーク 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-well-architected-complete-guide.html', service: 'Well-Architected', tags: '', domains: [1,2,3], difficulty: 'intermediate' },
  { title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-managed-vs-customer-managed-policies.html', service: '', tags: 'comparison', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS ログインユーザーの種類 - 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/aws-login-users-guide.html', service: '', tags: 'monitoring', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS障害はなぜグローバルに拡大したか？ US-EAST-1の「単一障害点」構造を徹底分析', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/aws-us-east-1-outage-analysis.html', service: '', tags: '', domains: [2,3], difficulty: 'advanced' },
  { title: 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-identity-center-comparison-guide.html', service: 'Cognito', tags: 'comparison security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'CanaryとLinearデプロイメントの違い', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/canary_linear_infographic.html', service: 'CodeDeploy', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'CIS AWS Foundations ベンチマーク継続評価ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cis-benchmark-security-hub-config-guide.html', service: 'Security Hub', tags: 'security', domains: [3], difficulty: 'advanced' },
  { title: 'CloudFormationからAWS Service Catalog製品を作成する方法', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/cf-service-catalog-infographic.html', service: 'CloudFormation', tags: 'monitoring', domains: [2,3], difficulty: 'beginner' },
  { title: 'CloudFormationドリフト検出と自動修復完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html', service: 'CloudFormation', tags: 'ha monitoring', domains: [3], difficulty: 'intermediate' },
  { title: 'CloudTrail ログプレフィックス完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-log-prefix-guide.html', service: 'CloudTrail', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'CloudTrail 管理イベント vs データイベント 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-events-guide.html', service: 'CloudTrail', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'CloudTrail 整合性検証 &amp; ダイジェストファイル 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudtrail-integrity-validation-guide.html', service: 'CloudTrail', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'CloudWatch INSIGHT_RULE_METRIC 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'CloudWatch Logs データ保護ポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/cloudwatch-logs-data-protection-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'CloudWatch Logs 集中集約完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cloudwatch-logs-subscription-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'intermediate' },
  { title: 'Cognito IDプールIAMロール完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cognito-identity-pool-roles-guide.html', service: 'Cognito', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'EC2 Image Builder 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/ec2-image-builder-guide.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'EC2ボットネットC2通信からの保護ガイド - Route 53 Resolver DNS Firewall', category: 'セキュリティ・ガバナンス', file: 'security-governance/botnet-c2-protection-guide.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'ECS Exec 完全ガイド - コンテナモニタリングの決定版', category: 'セキュリティ・ガバナンス', file: 'security-governance/ecs-exec-monitoring-guide.html', service: 'ECS', tags: 'monitoring containers', domains: [3], difficulty: 'advanced' },
  { title: 'EKS コントロールプレーンログ &amp; CloudTrail 監査ログ 完全図解ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/eks-control-plane-logging-guide.html', service: 'CloudTrail', tags: 'monitoring containers', domains: [1,2], difficulty: 'advanced' },
  { title: 'Elastic Beanstalk Blue/Green デプロイメント', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/beanstalk_blue_green_infographic.html', service: '', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Elastic Beanstalk ブルー/グリーンデプロイ完全ガイド', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/blue_green_deploy_infographic.html', service: 'CodeDeploy', tags: 'deployment', domains: [2,3], difficulty: 'beginner' },
  { title: 'GuardDuty EKS Protection 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-eks-protection-guide.html', service: 'GuardDuty', tags: 'containers', domains: [3], difficulty: 'advanced' },
  { title: 'GuardDuty EKS/RDS Protection 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-eks-rds-protection-guide.html', service: 'GuardDuty', tags: 'containers database', domains: [3], difficulty: 'advanced' },
  { title: 'GuardDuty ログソース完全ガイド - 最大カバレッジ設定', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-log-sources-guide.html', service: 'GuardDuty', tags: 'monitoring', domains: [3], difficulty: 'intermediate' },
  { title: 'GuardDutyによるトラフィックパターン分析 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/guardduty-traffic-analysis-guide.html', service: 'GuardDuty', tags: '', domains: [3], difficulty: 'advanced' },
  { title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-access-analyzer-policy-generation-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-access-analyzer-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'IAM Identity Center 完全ガイド - Organizations一括管理', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-identity-center-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-mfa-emergency-rescue-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'advanced' },
  { title: 'IAM Roles Anywhere 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-roles-anywhere-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'IAM パーミッションバウンダリー 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-permission-boundary-guide.html', service: 'IAM', tags: 'security', domains: [1], difficulty: 'intermediate' },
  { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-role-policies-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'IAM 権限評価モデル &amp; 操作経路 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-permission-evaluation-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'advanced' },
  { title: 'IAM 認証情報レポート完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-credential-report-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'IAM認証情報レポート - セキュリティインシデント初動調査ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/iam-credential-report-incident-guide.html', service: 'IAM', tags: 'security', domains: [1,2], difficulty: 'advanced' },
  { title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/opensearch-dashboards-guide.html', service: 'RDS', tags: 'database', domains: [1,2], difficulty: 'advanced' },
  { title: 'OSログローテーション × CloudWatch Logs エージェント 適合確認ガイド', category: 'セキュリティ・ガバナンス', file: 'organizational-complexity/log-rotation-cloudwatch-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'Route 53 Application Recovery Controller 解説', category: 'セキュリティ・ガバナンス', file: 'continuous-improvement/route53-arc-infographic.html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'beginner' },
  { title: 'SAML証明書ローテーション完全ガイド - IAM IDプロバイダー設定更新', category: 'セキュリティ・ガバナンス', file: 'security-governance/saml-certificate-rotation-guide.html', service: 'SAML Federation', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'SAML障害時のブレークグラスユーザー完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/breakglass-user-guide.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Storage Gateway RefreshCache 自動化完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/storage-gateway-refreshcache-automation-guide.html', service: 'Storage Gateway', tags: 'storage', domains: [1,2], difficulty: 'advanced' },
  { title: 'sts:ExternalId 完全マスターガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/sts-externalid-complete-guide.html', service: 'STS', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'VPC トラフィックミラーリング完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/vpc-traffic-mirroring-guide.html', service: 'VPC', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'エンドツーエンド暗号化 完全ガイド - CloudFront → ALB → EC2', category: 'セキュリティ・ガバナンス', file: 'security-governance/e2e-encryption-guide.html', service: 'CloudFront', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: '証明書ベースVPN認証 & ACM完全ガイド', category: 'セキュリティ・ガバナンス', file: 'security-governance/cert-vpn-acm-guide.html', service: 'VPN', tags: 'security networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Amazon EC2 Elastic Fabric Adapter (EFA) 完全ガイド', category: 'その他', file: 'new-solutions/efa_infographic.html', service: 'EFA', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS CloudFront オリジングループ簡単解説', category: 'その他', file: 'new-solutions/cloudfront-origin-groups.html', service: 'CloudFront', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'EC2 Auto Scaling ライフサイクルフックの図解', category: 'その他', file: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html', service: 'EC2', tags: 'scaling', domains: [2,3], difficulty: 'intermediate' },
  { title: 'EC2ブートストラップ入門ガイド', category: 'その他', file: 'new-solutions/ec2-bootstrap-infographic.html', service: 'EC2', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'Route53 ホストゾーン完全ガイド', category: 'その他', file: 'new-solutions/route53_hosted_zones_infographic.html', service: 'Route 53', tags: 'dns', domains: [2,3], difficulty: 'beginner' },
  { title: '【Black Belt】AWS Networking Fundamentals', category: 'ネットワーキング', file: 'BlackBelt/AWS-54_AWS_networking_Fundamentals_KMD41.pdf', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: '【Black Belt】AWS Site-to-Site VPN (2021年10月)', category: 'ネットワーキング', file: 'BlackBelt/202110_AWS_Black_Belt_Site-to-Site_VPN.pdf', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: '【Black Belt】AWS Transit Gateway Deep Dive (2025年1月)', category: 'ネットワーキング', file: 'BlackBelt/AWS-Black-Belt_2025_AWS-Transit-Gateway-deepdive_0122_v1.pdf', service: 'Transit Gateway', tags: '', domains: [1,2], difficulty: '' },
  { title: '【Black Belt】AWS VPC (2020年10月)', category: 'ネットワーキング', file: 'BlackBelt/20201021_AWS-BlackBelt-VPC.pdf', service: '', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: '📦 EC2インスタンスのネットワークMTU完全ガイド - 宅配便で理解するパケットサイズ', category: 'ネットワーキング', file: 'networking/ec2-mtu-guide.html', service: 'EC2', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'Amazon EKS セキュリティ完全図解ガイド', category: 'ネットワーキング', file: 'networking/eks-security-visual-guide.html', service: 'EKS', tags: 'security containers', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Amazon VPC CNI 完全ガイド', category: 'ネットワーキング', file: 'networking/vpc-cni-guide.html', service: 'VPC', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Amazon VPC Network Access Analyzer 完全図解ガイド', category: 'ネットワーキング', file: 'networking/vpc-network-access-analyzer-guide.html', service: 'VPC', tags: 'networking', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS BYOIP 完全ガイド - 自社IPアドレスをAWSに持ち込む', category: 'ネットワーキング', file: 'networking/byoip-guide.html', service: 'VPC', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド', category: 'ネットワーキング', file: 'networking/cloud-wan-attachment-policy-guide.html', service: 'Cloud WAN', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Cloud WAN スタティックルーティングとセグメント共有 完全ガイド', category: 'ネットワーキング', file: 'networking/cloudwan-static-routing-segment-sharing-v2.html', service: '', tags: 'ha networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Cloud WAN ポリシールールと評価順序・タグベースセグメントマッピング完全ガイド', category: 'ネットワーキング', file: 'networking/cloud-wan-policy-rules.html', service: 'Cloud WAN', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Direct Connect BGPルーティング（2つのVIF構成）完全ガイド', category: 'ネットワーキング', file: 'networking/dx-bgp-routing-2vifs.html', service: '', tags: 'networking ha', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Direct Connect SiteLink 完全ガイド | データセンター間接続', category: 'ネットワーキング', file: 'networking/direct-connect-sitelink-guide.html', service: 'Direct Connect', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Direct Connect ゲートウェイ 許可プレフィックスリスト完全ガイド - Transit Gateway構成', category: 'ネットワーキング', file: 'networking/dx-gw-allowed-prefix.html', service: '', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Direct Connect ルーティングポリシーと BGP コミュニティ完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-bgp-routing-guide.html', service: 'Direct Connect', tags: 'networking ha', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Direct Connect ルート制限とルート集約（サマライゼーション）完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-route-summarization-guide.html', service: 'Direct Connect', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Direct Connect 接続タイプ完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-connection-types-guide.html', service: 'Direct Connect', tags: 'comparison', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Direct Connect 専用接続 vs ホスト型接続を高速道路で理解しよう', category: 'ネットワーキング', file: 'networking/aws-direct-connect-guide.html', service: 'Direct Connect', tags: 'comparison', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Direct Connect仮想ゲートウェイ解説', category: 'ネットワーキング', file: 'new-solutions/aws-direct-connect-vgw.html', service: 'Direct Connect', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Directory Service 完全ガイド - AD/Managed AD/AD Connector/Simple AD', category: 'ネットワーキング', file: 'networking/aws-directory-service-guide.html', service: 'Directory Service', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS EIP &amp; NATゲートウェイ 超初心者ガイド', category: 'ネットワーキング', file: 'new-solutions/aws_eip_nat_infographic.html', service: 'NAT Gateway', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS ENI（Elastic Network Interface）初心者向け図解', category: 'ネットワーキング', file: 'networking/aws-eni-infographic.html', service: 'ENI', tags: '', domains: [1,2], difficulty: 'beginner' },
  { title: 'AWS Global Accelerator × VPN パフォーマンス向上ガイド', category: 'ネットワーキング', file: 'networking/global-accelerator-vpn-performance-guide.html', service: 'VPN', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Hyperplane 完全ガイド - 見えないけど超重要なAWSの交通システム', category: 'ネットワーキング', file: 'networking/aws-hyperplane-guide.html', service: 'Hyperplane', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS IPv6サポート完全ガイド - 住所体系の大革命', category: 'ネットワーキング', file: 'networking/aws-ipv6-support-guide-v2.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Local Zones 完全ガイド - 都市のユーザーに最も近い場所でAWSを動かす', category: 'ネットワーキング', file: 'networking/aws-local-zones-guide.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Network Firewall デプロイモデル完全ガイド - 分散型・集中型・複合型', category: 'ネットワーキング', file: 'networking/aws-network-firewall-deploy-models.html', service: '', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS PrivateLink & VPC エンドポイントサービス 完全ガイド', category: 'ネットワーキング', file: 'networking/aws-privatelink-vpc-endpoint-service-guide.html', service: 'VPC PrivateLink', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Site-to-Site VPN + Route 53 Resolver 完全ガイド', category: 'ネットワーキング', file: 'networking/site-to-site-vpn-route53-resolver-guide.html', service: 'VPN', tags: 'dns', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Site-to-Site VPN IKEセッション復旧ガイド', category: 'ネットワーキング', file: 'networking/vpn-ike-dpd-recovery-guide.html', service: 'VPN', tags: 'ha', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Site-to-Site VPN 完全ガイド', category: 'ネットワーキング', file: 'networking/aws-site-to-site-vpn-guide.html', service: 'VPN', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Site-to-Site VPN 非対称ルーティング問題の解決方法', category: 'ネットワーキング', file: 'networking/aws-vpn-asymmetric-routing-guide.html', service: 'VPN', tags: 'networking monitoring', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Transit Gateway Deep Dive 完全ガイド', category: 'ネットワーキング', file: 'networking/transit-gateway-deep-dive.html', service: 'Transit Gateway', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Transit Gateway Network Manager Route Analyzer 完全ガイド', category: 'ネットワーキング', file: 'networking/route-analyzer-guide.html', service: 'Transit Gateway Route Analyzer', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Transit Gateway Network Manager 完全ガイド', category: 'ネットワーキング', file: 'networking/tgw-network-manager-guide.html', service: 'Transit Gateway', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS Transit Gateway クロスアカウント共有 完全ガイド', category: 'ネットワーキング', file: 'networking/tgw-cross-account-sharing.html', service: 'Transit Gateway', tags: 'networking multi-account', domains: [1,2,3], difficulty: 'intermediate' },
  { title: 'AWS Transit Gateway ピアリング完全ガイド - 空港ネットワークで理解する', category: 'ネットワーキング', file: 'networking/transit-gateway-peering-guide.html', service: 'Transit Gateway', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS Transit Gateway マルチキャスト完全ガイド - ケーブルTV局で理解するマルチキャスト配信', category: 'ネットワーキング', file: 'networking/tgw-multicast-guide.html', service: 'Transit Gateway', tags: '', domains: [], difficulty: '' },
  { title: 'AWS Transit Gateway 完全図解 - 共有サービスによる分離VPCパターン', category: 'ネットワーキング', file: 'networking/tgw-isolated-shared-services.html', service: 'Transit Gateway', tags: '', domains: [], difficulty: '' },
  { title: 'AWS VPNスループットスケーリング完全ガイド - Transit Gateway + ECMP + アクセラレーション', category: 'ネットワーキング', file: 'networking/vpn-throughput-scaling-guide.html', service: 'VPN', tags: 'scaling', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS VPN接続を郵便システムで理解しよう + Direct Connect比較', category: 'ネットワーキング', file: 'networking/aws-vpn-with-direct-connect-guide.html', service: 'Direct Connect', tags: 'ha', domains: [1,2], difficulty: 'advanced' },
  { title: 'AWS ファイアウォール デプロイメントモデル完全ガイド - シングルアーム vs デュアルアーム', category: 'ネットワーキング', file: 'networking/firewall-deployment-models.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS プレフィックスリスト完全ガイド', category: 'ネットワーキング', file: 'networking/aws-prefix-list-guide.html', service: 'Prefix List', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWSグローバルインフラストラクチャ完全ガイド | AWS初心者向けインフォグラフィック', category: 'ネットワーキング', file: 'networking/aws-global-infrastructure-guide.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWSネットワークゲートウェイの比較', category: 'ネットワーキング', file: 'networking/aws-gateways.html', service: '', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'BFD完全ガイド - AWS Direct Connectのフェイルオーバー時間を劇的に短縮', category: 'ネットワーキング', file: 'networking/bfd-failover-optimization-guide.html', service: 'Direct Connect', tags: 'ha', domains: [1,2,3], difficulty: 'advanced' },
  { title: 'BGPルート選択アルゴリズム完全ガイド', category: 'ネットワーキング', file: 'networking/bgp-route-selection-guide.html', service: '', tags: 'networking', domains: [1,2], difficulty: 'advanced' },
  { title: 'CIDRブロックの重複とVPC接続 完全ガイド', category: 'ネットワーキング', file: 'networking/cidr-vpc-connectivity-guide.html', service: 'VPC', tags: 'ha networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'CIDRブロック集約と許可プレフィックスリスト完全ガイド', category: 'ネットワーキング', file: 'networking/cidr-aggregation-prefix-list-guide.html', service: 'VPC', tags: 'ha', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Cloud WAN / TGW ルート分離設計の極意', category: 'ネットワーキング', file: 'networking/cloud-wan-tgw-route-isolation-guide.html', service: 'Transit Gateway', tags: 'comparison', domains: [1,2], difficulty: 'advanced' },
  { title: 'CloudFront HTTPセキュリティヘッダー完全ガイド', category: 'ネットワーキング', file: 'networking/cloudfront-security-headers-guide.html', service: 'CloudFront', tags: 'security', domains: [1,2], difficulty: 'advanced' },
  { title: 'Direct Connect CloudWatchメトリクス 完全ガイド', category: 'ネットワーキング', file: 'networking/direct-connect-cloudwatch-metrics-guide.html', service: 'Direct Connect', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'Direct Connect Gateway・VGW・VIF 完全ガイド | AWS SAP学習リソース', category: 'ネットワーキング', file: 'networking/dx-gateway-vgw-vif-guide.html', service: 'Direct Connect', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'Direct Connect LAG環境でのMACsec実装ガイド', category: 'ネットワーキング', file: 'networking/macsec-lag-implementation-guide.html', service: 'Direct Connect', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'Direct Connect ルーティングポリシーと BGP コミュニティ - AWS図解ガイド', category: 'ネットワーキング', file: 'networking/dx-routing-bgp-community-guide.html', service: 'Direct Connect', tags: 'networking', domains: [1,2], difficulty: 'advanced' },
  { title: 'Direct Connect暗号化ガイド - VPNで実現するセキュアな専用線', category: 'ネットワーキング', file: 'networking/direct_connect_encryption_vpn.html', service: 'Direct Connect', tags: 'security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'DNS64 & NAT64 完全図解ガイド', category: 'ネットワーキング', file: 'networking/dns64-nat64-guide.html', service: 'NAT Gateway', tags: 'dns', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Gateway Load Balancer によるディープパケットインスペクション', category: 'ネットワーキング', file: 'networking/gwlb-deep-packet-inspection-guide.html', service: 'Gateway Load Balancer', tags: 'security', domains: [1,2], difficulty: 'advanced' },
  { title: 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド', category: 'ネットワーキング', file: 'networking/guardduty-credential-exfiltration-guide-v2.html', service: 'GuardDuty', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'LAG × ハイブリッドBGP - 階層的冗長性システム完全ガイド', category: 'ネットワーキング', file: 'networking/lag_hybrid_bgp_relationship.html', service: '', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'NAT ゲートウェイのタイムアウト動作 完全ガイド', category: 'ネットワーキング', file: 'networking/nat-gateway-timeout-guide.html', service: 'NAT Gateway', tags: '', domains: [], difficulty: '' },
  { title: 'S3バケットポリシー × VPCエンドポイント完全ガイド', category: 'ネットワーキング', file: 'networking/s3-vpc-endpoint-policy-guide.html', service: 'VPC PrivateLink', tags: 'networking storage', domains: [1,2], difficulty: 'intermediate' },
  { title: 'S3バケットポリシー Principal要素 完全ガイド', category: 'ネットワーキング', file: 'networking/s3-bucket-policy-principal-guide.html', service: 'S3', tags: 'storage', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Transit Gateway Connect 完全ガイド', category: 'ネットワーキング', file: 'networking/transit-gateway-connect-guide.html', service: 'Transit Gateway', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Transit Gateway アプライアンスモード 完全ガイド', category: 'ネットワーキング', file: 'networking/tgw-appliance-mode-guide.html', service: 'Transit Gateway', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'Transit Gateway ルーティング完全ガイド - クロスリージョン・クロスアカウントVPC接続', category: 'ネットワーキング', file: 'networking/tgw-routing-guide.html', service: 'Transit Gateway', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'VPC DNS設定 完全ガイド — enableDnsSupport & enableDnsHostnames', category: 'ネットワーキング', file: 'networking/vpc-dns-settings-guide.html', service: 'VPC', tags: 'networking dns', domains: [1,2], difficulty: 'intermediate' },
  { title: 'VPC Traffic Mirroring × UDP トラフィックキャプチャ完全ガイド', category: 'ネットワーキング', file: 'networking/traffic-mirroring-udp-guide.html', service: 'VPC Traffic Mirroring', tags: '', domains: [], difficulty: '' },
  { title: 'VPCとデュアルスタックネットワーキング完全ガイド | AWS学習リソース', category: 'ネットワーキング', file: 'networking/vpc-dual-stack-networking-guide.html', service: 'VPC', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'VPCトラフィックミラーリング vs VPC Flow Logs - 使い分けガイド', category: 'ネットワーキング', file: 'networking/vpc-traffic-mirroring-vs-flow-logs.html', service: 'VPC', tags: 'comparison networking monitoring', domains: [1,2], difficulty: 'intermediate' },
  { title: 'VPCトラフィックミラーリング完全ガイド - 4つの構成要素を徹底図解', category: 'ネットワーキング', file: 'networking/vpc-traffic-mirroring-deep-guide.html', service: 'VPC', tags: '', domains: [], difficulty: '' },
  { title: 'VPCフローログ フィールド完全ガイド', category: 'ネットワーキング', file: 'networking/vpc-flow-log-fields-guide.html', service: 'VPC', tags: 'networking monitoring', domains: [1,2,3], difficulty: 'intermediate' },
  { title: 'VPNアクセラレーション vs Global Accelerator - 関係と違いを徹底解説', category: 'ネットワーキング', file: 'networking/vpn-acceleration-vs-global-accelerator.html', service: 'VPN', tags: 'comparison', domains: [1,2], difficulty: 'advanced' },
  { title: 'VPNピアリングとPrivatelinkの比較', category: 'ネットワーキング', file: 'new-solutions/vpn-vs-privatelink.html', service: 'VPC PrivateLink', tags: 'comparison', domains: [1,2], difficulty: 'intermediate' },
  { title: 'WAN・SD-WAN・AWS Transit Gateway 完全図解ガイド', category: 'ネットワーキング', file: 'networking/wan-sdwan-transit-gateway-guide.html', service: 'Transit Gateway', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'インターフェースVPCエンドポイントのDNS動作 完全ガイド', category: 'ネットワーキング', file: 'networking/vpc-endpoint-dns-behavior-guide.html', service: 'VPC PrivateLink', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'クロスリージョンEC2通信アーキテクチャ &amp; トラブルシューティング完全ガイド', category: 'ネットワーキング', file: 'networking/cross-region-ec2-communication.html', service: 'EC2', tags: '', domains: [], difficulty: '' },
  { title: 'ジャンボフレーム＆MTU問題 完全図解ガイド', category: 'ネットワーキング', file: 'networking/jumbo-frame-mtu-guide.html', service: 'EC2', tags: '', domains: [1,2], difficulty: 'advanced' },
  { title: 'スプリットトンネル vs フルトンネル VPN - AWS Client VPN | AWS SAP学習リソース', category: 'ネットワーキング', file: 'networking/split-vs-full-tunnel-vpn.html', service: 'VPN', tags: 'comparison', domains: [1,2], difficulty: 'intermediate' },
  { title: 'ネットワークACL vs セキュリティグループ 完全ガイド', category: 'ネットワーキング', file: 'networking/nacl-sg-comparison-guide.html', service: 'VPC', tags: 'comparison security', domains: [1,2], difficulty: 'intermediate' },
  { title: 'ネットワーク層とアプリケーション層の違い', category: 'ネットワーキング', file: 'new-solutions/vpc_privatelink_cidr_overlap.html', service: 'VPC PrivateLink', tags: 'ha networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'ハイブリッド DNS アーキテクチャ 完全ガイド', category: 'ネットワーキング', file: 'networking/hybrid-dns-architecture-guide.html', service: 'Route 53', tags: 'dns', domains: [1,2], difficulty: 'advanced' },
  { title: 'パケットの気持ちになって辿る Amazon VPC のルーティング | AWS学習リソース', category: 'ネットワーキング', file: 'networking/vpc-routing-packet-journey.html', service: 'VPC', tags: 'networking', domains: [1,2], difficulty: 'intermediate' },
  { title: 'プレフィックスリスト × AWS RAM 完全ガイド - マルチアカウントIP管理ソリューション', category: 'ネットワーキング', file: 'networking/prefix-list-ram-guide.html', service: 'Prefix List', tags: '', domains: [1,2], difficulty: 'intermediate' },
  { title: 'AWS DMS Change Data Capture ガイド', category: '移行・転送', file: 'migration/aws_dms_cdc_infographic.html', service: 'DMS', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS DMS機能詳細ガイド', category: '移行・転送', file: 'migration/aws_dms_features_infographic.html', service: 'DMS', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS Migration Hub 超わかりやすいガイド', category: '移行・転送', file: 'migration/aws-migration-hub-infographic.html', service: 'Migration Hub', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS Migration Hubを引っ越し会社で理解しよう', category: '移行・転送', file: 'migration/aws_migration_hub_infographic.html', service: 'Migration Hub', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS Relocate（再配置）戦略 - 完全解説', category: '移行・転送', file: 'migration/aws_relocate_guide.html', service: '', tags: '', domains: [2,4], difficulty: 'intermediate' },
  { title: 'AWS SCT &amp; DMS データベース移行を図書館の引っ越しで理解しよう', category: '移行・転送', file: 'migration/aws_database_migration_infographic.html', service: 'DMS', tags: 'database', domains: [4], difficulty: 'beginner' },
  { title: 'AWS SCT・DMS オンラインマイグレーション完全ガイド', category: '移行・転送', file: 'migration/aws_sct_dms_migration_infographic.html', service: 'DMS', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS移行サービス群 完全ガイド', category: '移行・転送', file: 'migration/aws_migration_services_infographic.html', service: 'Migration Hub', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS移行戦略7Rと移行サービス群', category: '移行・転送', file: 'migration/aws_migration_infographic.html', service: 'Migration Hub', tags: '', domains: [4], difficulty: 'beginner' },
  { title: 'AWS災害復旧戦略をレストランで理解しよう', category: '移行・転送', file: 'migration/aws-dr-infographic.html', service: 'Disaster Recovery', tags: 'ha', domains: [2,4], difficulty: 'beginner' },
  { title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド', category: '移行・転送', file: 'migration/blue-green-vs-immutable-visual-guide.html', service: 'CodeDeploy', tags: 'comparison', domains: [2,4], difficulty: 'intermediate' },
  { title: 'Amazon Inspector ECRスキャン完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/amazon-inspector-ecr-scanning-guide.html', service: 'Amazon Inspector', tags: '', domains: [3], difficulty: 'advanced' },
  { title: 'AWS API Gateway をレストランで理解しよう', category: '開発・デプロイメント', file: 'development-deployment/api_gateway_infographic.html', service: 'API Gateway', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS AppSync - 初心者向けガイド', category: '開発・デプロイメント', file: 'development-deployment/aws_appsync_infographic.html', service: 'AppSync', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS CDKを家づくり設計で理解しよう', category: '開発・デプロイメント', file: 'development-deployment/cdk_infographic.html', service: 'CDK', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS CloudFormation テンプレート作成ガイド', category: '開発・デプロイメント', file: 'development-deployment/aws-cloudformation-infographic.html', service: 'CloudFormation', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS EventBridge API宛先と入力トランスフォーマー機能の解説', category: '開発・デプロイメント', file: 'development-deployment/aws-eventbridge-infographic.html', service: 'EventBridge', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/guardduty-suppression-rules.html', service: 'GuardDuty', tags: '', domains: [3], difficulty: 'intermediate' },
  { title: 'AWS SAM レストラン経営で理解しよう', category: '開発・デプロイメント', file: 'development-deployment/aws_sam_infographic.html', service: 'SAM', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'CloudFormation Guard (cfn-guard) 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/cfn-guard-infographic.html', service: 'CloudFormation', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'CloudFormation StackSets 詳細図解', category: '開発・デプロイメント', file: 'development-deployment/stacksets_infographic.html', service: 'CloudFormation', tags: '', domains: [2,3], difficulty: 'beginner' },
  { title: 'CloudFormation リソース保持メカニズム', category: '開発・デプロイメント', file: 'development-deployment/cloudformation-protection-guide.html', service: 'CloudFormation', tags: '', domains: [2,3], difficulty: 'intermediate' },
  { title: 'CloudWatch Logs ログ保持期間 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/cloudwatch-logs-retention-guide.html', service: 'CloudWatch', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'CodePipeline &amp; タスク概要 完全ガイド', category: '開発・デプロイメント', file: 'development-deployment/codepipeline_infographic_v2.html', service: 'CodePipeline', tags: 'deployment', domains: [2,3], difficulty: 'beginner' },
  { title: 'CodePipeline アクションタイプ図解ガイド', category: '開発・デプロイメント', file: 'development-deployment/codepipeline-actions-guide.html', service: 'CodePipeline', tags: 'deployment', domains: [2,3], difficulty: 'intermediate' },
  { title: 'Amazon Kinesis Data Streamsをベルトコンベアで理解しよう', category: '分析・運用・クイズ', file: 'analytics-bigdata/kinesis-infographic.html', service: 'Kinesis', tags: '', domains: [3], difficulty: 'beginner' },
  { title: 'AWS EC2ディスクメトリクスの違い', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-disk-metrics.html', service: '', tags: 'monitoring', domains: [3], difficulty: 'advanced' },
  { title: 'AWS コスト管理ツール比較', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-cost-tools.html', service: 'Cost Explorer', tags: '', domains: [1,3], difficulty: 'intermediate' },
  { title: 'AWSエラー比較: InstanceLimitExceeded vs Insufficient Instance Capacity', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws-errors-infographic.html', service: '', tags: '', domains: [3], difficulty: 'beginner' },
  { title: 'AWS可用性指標：MTTD・MTTR・MTBF完全ガイド', category: '分析・運用・クイズ', file: 'analytics-bigdata/aws_availability_infographic.html', service: '', tags: '', domains: [3], difficulty: 'beginner' },
  { title: 'Kinesis Data Firehose 高度機能完全図解', category: '分析・運用・クイズ', file: 'analytics-bigdata/kinesis_firehose_infographic.html', service: 'Kinesis', tags: '', domains: [3], difficulty: 'beginner' },
  { title: 'Redshift スケーリング手段完全図解', category: '分析・運用・クイズ', file: 'analytics-bigdata/redshift_scaling_infographic.html', service: 'Redshift', tags: 'scaling', domains: [3], difficulty: 'beginner' },
  { title: 'サーバーレスデータパイプライン完全図解', category: '分析・運用・クイズ', file: 'analytics-bigdata/serverless_data_pipeline_infographic.html', service: 'CI/CD Pipeline', tags: 'deployment serverless', domains: [3], difficulty: 'beginner' },
];































































































// ─── フィルター機能 ───────────────────────────────────────────────────────

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const serviceFilter = document.getElementById('serviceFilter');
    const domainFilter = document.getElementById('domainFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const timeFilter = document.getElementById('timeFilter');
    const filterClear = document.getElementById('filterClear');
    const filterStatus = document.getElementById('filterStatus');

    if (!categoryFilter || !serviceFilter) return;

    const selectedCategory = categoryFilter.value;
    const selectedService = serviceFilter.value;
    const selectedDomain = domainFilter ? domainFilter.value : '';
    const selectedDifficulty = difficultyFilter ? difficultyFilter.value : '';
    const selectedTime = timeFilter ? timeFilter.value : '';
    const isFiltering = selectedCategory || selectedService || selectedDomain || selectedDifficulty || selectedTime;

    // Show/hide clear button
    filterClear.style.display = isFiltering ? '' : 'none';

    // Update service dropdown options based on selected category
    updateServiceOptions(selectedCategory);

    // Parse time range
    var timeMin = 0, timeMax = Infinity;
    if (selectedTime === '0-15') { timeMin = 0; timeMax = 15; }
    else if (selectedTime === '15-30') { timeMin = 15; timeMax = 30; }
    else if (selectedTime === '30-60') { timeMin = 30; timeMax = 60; }
    else if (selectedTime === '60+') { timeMin = 60; timeMax = Infinity; }

    // Apply to DOM elements
    const categories = document.querySelectorAll('.major-category[data-category]');
    let visibleResources = 0;
    let totalResources = 0;

    categories.forEach(function(catEl) {
        const catId = catEl.getAttribute('data-category');
        const categoryHidden = selectedCategory && catId !== selectedCategory;

        // Check all resource items within this category
        const resourceItems = catEl.querySelectorAll('.resource-list li[data-service]');
        let catHasVisible = false;

        resourceItems.forEach(function(li) {
            totalResources++;
            var hidden = categoryHidden;

            // Service filter
            if (!hidden && selectedService) {
                var svc = li.getAttribute('data-service');
                if (svc !== selectedService) hidden = true;
            }

            // Domain filter
            if (!hidden && selectedDomain) {
                var domains = li.getAttribute('data-domains') || '';
                var domainList = domains ? domains.split(',') : [];
                if (!domainList.includes(selectedDomain)) hidden = true;
            }

            // Difficulty filter
            if (!hidden && selectedDifficulty) {
                var diff = li.getAttribute('data-difficulty') || '';
                if (diff !== selectedDifficulty) hidden = true;
            }

            // Time filter
            if (!hidden && selectedTime) {
                var mins = parseInt(li.getAttribute('data-minutes') || '0', 10);
                if (mins < timeMin || mins > timeMax) hidden = true;
            }

            if (hidden) {
                li.classList.add('filter-hidden');
            } else {
                li.classList.remove('filter-hidden');
                visibleResources++;
                catHasVisible = true;
            }
        });

        // Hide sections that have no visible resources
        const sections = catEl.querySelectorAll('.toc-section');
        sections.forEach(function(sec) {
            const items = sec.querySelectorAll('.resource-list li[data-service]');
            let sectionHasVisible = false;
            items.forEach(function(li) {
                if (!li.classList.contains('filter-hidden')) {
                    sectionHasVisible = true;
                }
            });
            if (sectionHasVisible) {
                sec.classList.remove('filter-hidden');
            } else {
                sec.classList.add('filter-hidden');
            }
        });

        // Hide whole category if no visible resources
        if (categoryHidden || !catHasVisible) {
            catEl.classList.add('filter-hidden');
        } else {
            catEl.classList.remove('filter-hidden');
        }
    });

    // Deactivate learning mode card if filters no longer match the mode preset
    var activeModeBtn = document.querySelector('.learning-mode-card[aria-pressed="true"]');
    if (activeModeBtn) {
        var modeFilters = {};
        try { modeFilters = JSON.parse(activeModeBtn.getAttribute('data-mode-filters') || '{}'); } catch(e) { /* ignore */ }
        var currentMatchesMode = true;
        if (modeFilters.category && selectedCategory !== modeFilters.category) currentMatchesMode = false;
        if (!modeFilters.category && selectedCategory) currentMatchesMode = false;
        if (modeFilters.difficulty && modeFilters.difficulty.length === 1 && selectedDifficulty !== modeFilters.difficulty[0]) currentMatchesMode = false;
        if (!modeFilters.difficulty && selectedDifficulty) currentMatchesMode = false;
        if (!currentMatchesMode) {
            activeModeBtn.setAttribute('aria-pressed', 'false');
        }
    }

    // Build condition summary
    var conditions = [];
    if (selectedCategory) conditions.push('カテゴリ: ' + getCategoryFilterLabel(selectedCategory));
    if (selectedService) conditions.push('サービス: ' + selectedService);
    if (selectedDomain) conditions.push('ドメイン: D' + selectedDomain);
    if (selectedDifficulty) conditions.push('難易度: ' + getDifficultyFilterLabel(selectedDifficulty));
    if (selectedTime) conditions.push('時間: ' + getTimeFilterLabel(selectedTime));

    // Update status
    if (isFiltering) {
        filterStatus.style.display = '';
        var statusText = conditions.length > 0 ? conditions.join(' | ') + ' — ' : '';
        filterStatus.textContent = statusText + visibleResources + ' / ' + totalResources + ' リソース';
    } else {
        filterStatus.style.display = 'none';
    }

    // Show/hide no-results message
    var noResultsEl = document.getElementById('filterNoResults');
    if (noResultsEl) {
        noResultsEl.style.display = (isFiltering && visibleResources === 0) ? '' : 'none';
    }
}

// ─── フィルターラベルヘルパー ──────────────────────────────────────────

function getCategoryFilterLabel(catId) {
    var el = document.getElementById('categoryFilter');
    if (el) {
        var opt = el.querySelector('option[value="' + catId + '"]');
        if (opt) return opt.textContent.replace(/[（(]\d+[）)]/, '').trim();
    }
    return catId;
}

function getDifficultyFilterLabel(diff) {
    var labels = { beginner: '初級', intermediate: '中級', advanced: '上級' };
    return labels[diff] || diff;
}

function getTimeFilterLabel(time) {
    var labels = { '0-15': '〜15分', '15-30': '15〜30分', '30-60': '30〜60分', '60+': '60分〜' };
    return labels[time] || time;
}

// ─── 学習モード機能 ─────────────────────────────────────────────────────

function applyLearningMode(modeId) {
    var buttons = document.querySelectorAll('.learning-mode-card');
    var clickedBtn = null;

    buttons.forEach(function(btn) {
        if (btn.getAttribute('data-mode-id') === modeId) {
            clickedBtn = btn;
        }
    });

    if (!clickedBtn) return;

    var wasActive = clickedBtn.getAttribute('aria-pressed') === 'true';

    // Deactivate all mode buttons
    buttons.forEach(function(btn) {
        btn.setAttribute('aria-pressed', 'false');
    });

    // Deactivate all domain cards
    var domainCards = document.querySelectorAll('.domain-card');
    domainCards.forEach(function(card) {
        card.setAttribute('aria-pressed', 'false');
    });

    if (wasActive) {
        // Toggle off — clear all filters
        clearFilters();
        return;
    }

    // Activate clicked mode
    clickedBtn.setAttribute('aria-pressed', 'true');

    // Parse and apply filters
    var filtersJson = clickedBtn.getAttribute('data-mode-filters');
    var filters = {};
    try { filters = JSON.parse(filtersJson); } catch(e) { /* ignore */ }

    // Set category filter
    var categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = filters.category || '';
    }

    // Set domain filter (from filters.domains if present — unused by current modes but extensible)
    var domainFilter = document.getElementById('domainFilter');
    if (domainFilter) {
        domainFilter.value = '';
    }

    // Set difficulty filter
    var difficultyFilter = document.getElementById('difficultyFilter');
    if (difficultyFilter) {
        difficultyFilter.value = filters.difficulty && filters.difficulty.length === 1 ? filters.difficulty[0] : '';
    }

    // Set time filter
    var timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        timeFilter.value = '';
    }

    // Reset service filter
    var serviceFilter = document.getElementById('serviceFilter');
    if (serviceFilter) {
        serviceFilter.value = '';
    }

    applyFilters();

    // Announce mode activation
    var filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.style.display = '';
        var desc = clickedBtn.querySelector('.learning-mode-desc');
        filterStatus.textContent = '学習モード: ' + clickedBtn.querySelector('.learning-mode-title').textContent + ' — ' + (desc ? desc.textContent : '');
    }
}

function updateServiceOptions(selectedCategory) {
    var serviceFilter = document.getElementById('serviceFilter');
    if (!serviceFilter || typeof serviceIndex === 'undefined') return;

    var currentService = serviceFilter.value;
    var options = serviceFilter.querySelectorAll('option');

    options.forEach(function(opt) {
        if (!opt.value) return; // Skip "すべて" option
        var cats = opt.getAttribute('data-categories');
        if (!selectedCategory || !cats) {
            opt.style.display = '';
        } else {
            var catList = cats.split(',');
            opt.style.display = catList.includes(selectedCategory) ? '' : 'none';
        }
    });

    // If current service not available in filtered category, reset
    if (currentService) {
        var selectedOpt = serviceFilter.querySelector('option[value="' + CSS.escape(currentService) + '"]');
        if (selectedOpt && selectedOpt.style.display === 'none') {
            serviceFilter.value = '';
        }
    }
}

function clearFilters() {
    var categoryFilter = document.getElementById('categoryFilter');
    var serviceFilter = document.getElementById('serviceFilter');
    var domainFilter = document.getElementById('domainFilter');
    var difficultyFilter = document.getElementById('difficultyFilter');
    var timeFilter = document.getElementById('timeFilter');
    if (categoryFilter) categoryFilter.value = '';
    if (serviceFilter) serviceFilter.value = '';
    if (domainFilter) domainFilter.value = '';
    if (difficultyFilter) difficultyFilter.value = '';
    if (timeFilter) timeFilter.value = '';

    // Deactivate mode buttons
    var modeButtons = document.querySelectorAll('.learning-mode-card');
    modeButtons.forEach(function(btn) { btn.setAttribute('aria-pressed', 'false'); });

    // Deactivate domain cards
    var domainCards = document.querySelectorAll('.domain-card');
    domainCards.forEach(function(card) { card.setAttribute('aria-pressed', 'false'); });

    applyFilters();
}

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

    // アクティブフィルター取得
    const categoryFilterEl = document.getElementById('categoryFilter');
    const serviceFilterEl = document.getElementById('serviceFilter');
    const selectedCategory = categoryFilterEl ? categoryFilterEl.value : '';
    const selectedService = serviceFilterEl ? serviceFilterEl.value : '';

    // 検索実行（タイトル、カテゴリ、サービス、タグで検索 + フィルター適用）
    const selectedDomain = document.getElementById('domainFilter') ? document.getElementById('domainFilter').value : '';
    const selectedDifficulty = document.getElementById('difficultyFilter') ? document.getElementById('difficultyFilter').value : '';

    const results = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
        const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
        const serviceMatch = (item.service || '').toLowerCase().includes(normalizedQuery);
        const tagsMatch = (item.tags || '').toLowerCase().includes(normalizedQuery);
        const textMatch = titleMatch || categoryMatch || serviceMatch || tagsMatch;
        if (!textMatch) return false;

        // Apply active filters
        if (selectedCategory) {
            const fileParts = item.file.split('/');
            const fileCategory = fileParts.length > 1 ? fileParts[0] : '';
            if (fileCategory !== selectedCategory) return false;
        }
        if (selectedService && item.service !== selectedService) return false;
        if (selectedDomain && !(item.domains || []).includes(parseInt(selectedDomain, 10))) return false;
        if (selectedDifficulty && item.difficulty !== selectedDifficulty) return false;

        return true;
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

            const a = document.createElement('a');
            a.href = item.file;
            a.textContent = item.title;

            const catDiv = document.createElement('div');
            catDiv.className = 'search-result-category';
            catDiv.textContent = item.category;
            a.appendChild(catDiv);

            if (item.service) {
                const svcSpan = document.createElement('span');
                svcSpan.className = 'search-result-service';
                svcSpan.textContent = item.service;
                a.appendChild(svcSpan);
            }

            li.appendChild(a);
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

    // フィルターイベントリスナー
    const categoryFilter = document.getElementById('categoryFilter');
    const serviceFilter = document.getElementById('serviceFilter');
    const filterClearBtn = document.getElementById('filterClear');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            applyFilters();
            // Re-run search if active
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }
    if (serviceFilter) {
        serviceFilter.addEventListener('change', function() {
            applyFilters();
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }
    if (filterClearBtn) {
        filterClearBtn.addEventListener('click', function() {
            clearFilters();
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }

    // New filter event listeners (domain, difficulty, time)
    var domainFilterEl = document.getElementById('domainFilter');
    var difficultyFilterEl = document.getElementById('difficultyFilter');
    var timeFilterEl = document.getElementById('timeFilter');

    [domainFilterEl, difficultyFilterEl, timeFilterEl].forEach(function(el) {
        if (el) {
            el.addEventListener('change', function() {
                applyFilters();
                if (searchInput.value.trim()) {
                    performSearch(searchInput.value);
                }
            });
        }
    });

    // Learning mode card click handlers
    var modeCards = document.querySelectorAll('.learning-mode-card');
    modeCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var modeId = this.getAttribute('data-mode-id');
            applyLearningMode(modeId);
        });
    });

    // Domain card click handlers
    var domainCards = document.querySelectorAll('.domain-card');
    domainCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var domainId = this.getAttribute('data-domain-id');
            var wasActive = this.getAttribute('aria-pressed') === 'true';

            // Deactivate all domain cards
            domainCards.forEach(function(c) { c.setAttribute('aria-pressed', 'false'); });

            // Deactivate all mode buttons
            var modeButtons = document.querySelectorAll('.learning-mode-card');
            modeButtons.forEach(function(btn) { btn.setAttribute('aria-pressed', 'false'); });

            if (wasActive) {
                // Toggle off
                if (domainFilterEl) domainFilterEl.value = '';
            } else {
                // Activate
                this.setAttribute('aria-pressed', 'true');
                if (domainFilterEl) domainFilterEl.value = domainId;
            }

            applyFilters();
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
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
