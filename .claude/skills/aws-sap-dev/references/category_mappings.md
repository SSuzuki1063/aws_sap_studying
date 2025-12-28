# AWS Service Category Mappings

## Category Overview

This document maps AWS services to their appropriate categories in the repository structure. Use this reference when deciding where to place new HTML learning resources.

## Category Mappings

### 1. networking (ネットワーキング)

**Primary Services:**
- VPC (Virtual Private Cloud)
- Direct Connect
- Transit Gateway
- VPN (Site-to-Site VPN, Client VPN)
- PrivateLink (VPC Endpoints)
- Elastic Network Interface (ENI)
- Elastic IP (EIP)
- NAT Gateway
- Internet Gateway
- VPC Peering

**Keywords for Auto-categorization:**
- VPC, サブネット, ルートテーブル
- Direct Connect, 専用線
- Transit Gateway, TGW
- VPN, プライベート接続
- PrivateLink, VPCエンドポイント
- ENI, EIP, NAT

**Typical Topics:**
- Network architecture and design
- Hybrid connectivity (on-premises to AWS)
- Network isolation and segmentation
- Inter-VPC communication
- Network performance optimization

---

### 2. security-governance (セキュリティ・ガバナンス)

**Primary Services:**
- IAM (Identity and Access Management)
- AWS Organizations
- Service Control Policies (SCP)
- AWS KMS (Key Management Service)
- AWS WAF (Web Application Firewall)
- AWS Shield
- Amazon Cognito
- AWS Secrets Manager
- AWS Certificate Manager (ACM)
- AWS CloudHSM
- Tag Policies
- AWS Control Tower

**Keywords for Auto-categorization:**
- IAM, ポリシー, ロール, ユーザー
- SCP, Organizations, 組織
- KMS, CMK, 暗号化, キー
- WAF, Shield, DDoS
- Cognito, 認証, 認可
- Secrets Manager, シークレット
- タグポリシー, ガバナンス

**Typical Topics:**
- Access control and permissions
- Multi-account strategy
- Encryption and key management
- Security policies and compliance
- Identity federation
- Threat protection

---

### 3. compute-applications (コンピュート・アプリケーション)

**Primary Services:**
- Amazon EC2
- AWS Lambda
- Amazon ECS (Elastic Container Service)
- Amazon EKS (Elastic Kubernetes Service)
- AWS Fargate
- Elastic Fabric Adapter (EFA)
- Auto Scaling
- Application Load Balancer (ALB)
- Network Load Balancer (NLB)
- Amazon SQS
- Amazon SNS
- AWS Batch
- AWS Elastic Beanstalk
- Systems Manager (Patch Manager)

**Keywords for Auto-categorization:**
- EC2, インスタンス, AMI
- Lambda, サーバーレス, 関数
- ECS, EKS, コンテナ, Docker, Kubernetes
- EFA, HPC, 高性能コンピューティング
- Auto Scaling, ASG, スケーリング
- ALB, NLB, ロードバランサー
- SQS, SNS, キュー, メッセージング

**Typical Topics:**
- Compute capacity planning
- Serverless architectures
- Container orchestration
- Load balancing strategies
- Application scaling
- Message queuing and pub/sub

---

### 4. content-delivery-dns (コンテンツ配信・DNS)

**Primary Services:**
- Amazon CloudFront
- Amazon Route 53
- AWS Global Accelerator

**Keywords for Auto-categorization:**
- CloudFront, CDN, エッジ
- Route 53, DNS, ドメイン, ルーティング
- Global Accelerator, グローバル

**Typical Topics:**
- Content distribution strategies
- DNS routing policies
- Edge computing and caching
- Global application delivery
- Traffic management
- Latency optimization

---

### 5. development-deployment (開発・デプロイメント)

**Primary Services:**
- AWS CloudFormation
- AWS CDK (Cloud Development Kit)
- AWS SAM (Serverless Application Model)
- AWS CodePipeline
- AWS CodeBuild
- AWS CodeDeploy
- AWS CodeCommit
- Amazon EventBridge
- Amazon API Gateway
- AWS Step Functions
- AWS AppSync

**Keywords for Auto-categorization:**
- CloudFormation, CFn, スタック, テンプレート
- CDK, Infrastructure as Code, IaC
- SAM, サーバーレス
- CodePipeline, CodeBuild, CodeDeploy, CI/CD
- EventBridge, イベント, ルール
- API Gateway, REST API, WebSocket
- Step Functions, ステートマシン

**Typical Topics:**
- Infrastructure as Code (IaC)
- CI/CD pipelines
- Serverless application deployment
- Event-driven architectures
- API management
- Workflow orchestration

---

### 6. storage-database (ストレージ・データベース)

**Primary Services:**
- Amazon S3
- Amazon EBS (Elastic Block Store)
- Amazon EFS (Elastic File System)
- Amazon FSx
- Amazon RDS
- Amazon Aurora
- Amazon DynamoDB
- Amazon ElastiCache (Redis, Memcached)
- Amazon Redshift
- Amazon MSK (Managed Streaming for Kafka)
- AWS Backup
- AWS Storage Gateway

**Keywords for Auto-categorization:**
- S3, バケット, オブジェクトストレージ
- EBS, ボリューム, スナップショット
- EFS, FSx, ファイルシステム
- RDS, Aurora, データベース, リレーショナル
- DynamoDB, NoSQL, テーブル
- ElastiCache, Redis, Memcached, キャッシュ
- Redshift, データウェアハウス
- MSK, Kafka, ストリーミング

**Typical Topics:**
- Storage architecture and design
- Database selection and optimization
- Data persistence strategies
- Caching strategies
- Backup and recovery
- Data security and encryption

---

### 7. migration (移行・転送)

**Primary Services:**
- AWS Database Migration Service (DMS)
- AWS Migration Hub
- AWS Application Discovery Service
- AWS Server Migration Service (SMS)
- AWS DataSync
- AWS Transfer Family
- AWS Snow Family

**Keywords for Auto-categorization:**
- DMS, データベース移行, マイグレーション
- Migration Hub, 移行計画
- DR, ディザスタリカバリ
- Blue/Green, ブルーグリーン
- DataSync, データ転送
- Snowball, Snow Family

**Typical Topics:**
- Migration strategies (rehost, replatform, refactor)
- Database migration workflows
- Disaster recovery planning
- Blue/Green deployment
- Data transfer methods
- Migration assessment

---

### 8. analytics-bigdata (分析・運用・クイズ)

**Primary Services:**
- Amazon Kinesis (Data Streams, Firehose, Analytics)
- Amazon Redshift
- AWS Glue
- Amazon Athena
- Amazon QuickSight
- AWS Cost Explorer
- AWS Budgets
- AWS Trusted Advisor
- Amazon CloudWatch
- AWS X-Ray
- AWS Data Pipeline

**Keywords for Auto-categorization:**
- Kinesis, ストリーミング, データストリーム
- Firehose, データ配信
- Redshift, データウェアハウス, 分析
- Glue, ETL, データカタログ
- Athena, クエリ, S3分析
- Cost Explorer, コスト, 予算
- CloudWatch, メトリクス, ログ, モニタリング
- X-Ray, トレース, 分散トレーシング

**Typical Topics:**
- Real-time data processing
- Data analytics and visualization
- Cost optimization strategies
- Performance monitoring
- Log aggregation and analysis
- Operational metrics

---

### 9. organizational-complexity (組織・複雑性)

**Primary Services:**
- AWS Resource Access Manager (RAM)
- AWS Organizations (multi-account aspects)
- AWS Service Catalog
- AWS Control Tower
- Tag Policies
- Cross-account resource sharing

**Keywords for Auto-categorization:**
- RAM, リソース共有
- Organizations, 複数アカウント, マルチアカウント
- Service Catalog, カタログ, ポートフォリオ
- Control Tower, ランディングゾーン
- クロスアカウント, 組織構造

**Typical Topics:**
- Multi-account architecture
- Resource sharing strategies
- Organizational governance
- Landing zone design
- Service catalog management

---

### 10. continuous-improvement (継続的改善)

**Primary Services:**
- AWS Systems Manager
- AWS CodeDeploy
- AWS CloudTrail
- AWS Config
- AWS WAF (logging aspects)
- AWS CDK (advanced patterns)

**Keywords for Auto-categorization:**
- Systems Manager, SSM, パッチ, インベントリ
- CodeDeploy, デプロイ戦略
- CloudTrail, 監査, ログ
- Config, 構成管理, コンプライアンス
- 継続的改善, ベストプラクティス

**Typical Topics:**
- Operational excellence
- Deployment best practices
- Audit and compliance
- Configuration management
- Continuous optimization

---

### 11. cost-control (コスト管理)

**Primary Services:**
- S3 Storage Classes (optimization)
- Lambda Concurrency (cost management)
- AWS Cost Explorer (detailed)
- Reserved Instances
- Savings Plans
- AWS Compute Optimizer

**Keywords for Auto-categorization:**
- コスト最適化, 料金
- Storage Class, ストレージクラス, ライフサイクル
- Lambda同時実行数, 予約済み同時実行
- Reserved Instance, RI, Savings Plans
- Cost Optimizer, コスト削減

**Typical Topics:**
- Cost optimization strategies
- Storage lifecycle management
- Compute cost reduction
- Reserved capacity planning
- Billing optimization

---

### 12. new-solutions (新規ソリューション)

**Use for:**
- Newly added architecture patterns
- Cross-service solution architectures
- Reference architectures
- Multi-service integration patterns
- Solutions that don't fit cleanly into a single category

**Keywords for Auto-categorization:**
- アーキテクチャ, ソリューション, 統合
- リファレンス, パターン
- 新規, 最新

**Typical Topics:**
- End-to-end solution architectures
- Multi-service integration examples
- AWS Well-Architected patterns
- Industry-specific solutions

---

## Decision Flowchart

When categorizing a new resource, follow this decision process:

1. **Identify primary AWS service** mentioned in the resource
2. **Look up service** in category mappings above
3. **Check keywords** - Does the content match category keywords?
4. **Consider topic focus** - What is the main learning objective?
5. **Choose best fit** - Select category that aligns most closely
6. **Default to new-solutions** - If resource spans multiple categories or is primarily about architecture patterns

## Multi-Service Resources

Some resources cover multiple AWS services. Use these rules:

- **Primary service dominates** - Categorize based on the main service being taught
- **Architecture-focused** - Use `new-solutions` if focus is on how services integrate
- **Example:** A resource about "S3 + CloudFront CDN Architecture" should go in:
  - `content-delivery-dns` if focus is on CloudFront configuration
  - `storage-database` if focus is on S3 optimization
  - `new-solutions` if focus is on the integrated architecture pattern

## Integration with Scripts

The `integrate_new_html.py` script uses these keyword mappings for automatic categorization. When the script categorizes incorrectly:

1. Check if keywords are present in HTML title/h1 tags
2. Manually move the file to the correct category directory
3. Manually update data.js and index.js

## Japanese Category Names (for searchData)

Use these exact names when adding to `searchData` in index.js:

- `ネットワーキング` - networking
- `セキュリティ・ガバナンス` - security-governance
- `コンピュート・アプリケーション` - compute-applications
- `コンテンツ配信・DNS` - content-delivery-dns
- `開発・デプロイメント` - development-deployment
- `ストレージ・データベース` - storage-database
- `移行・転送` - migration
- `分析・運用・クイズ` - analytics-bigdata
- `組織・複雑性` - organizational-complexity
- `継続的改善` - continuous-improvement
- `コスト管理` - cost-control
- `新規ソリューション` - new-solutions
