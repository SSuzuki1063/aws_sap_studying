# Resource Categorization Skill

Enforce correct AWS resource categorization when adding or modifying entries in `src/data/resource-registry.json`.

## The 8 Display Categories

Each resource's `displayCategory` must be one of these 8 values. Use the AWS service and section mapping below to determine the correct category.

### networking
VPC, Subnet, Security Group, NACL, ENI, IPv6, Flow Logs, Transit Gateway, VPN, Direct Connect, VGW, DGW, PrivateLink, VPC Endpoint, VPC Peering, Network Firewall, Cloud WAN, Prefix List

**Sections:** VPC & ネットワーク基礎 / Direct Connect & ハイブリッドネットワーク / Transit Gateway & ゲートウェイ

**Common misclassification:** Route 53, CloudFront are NOT networking — see `content-delivery-dns`.

### security-governance
IAM, STS, SSO (Identity Center), Organizations, SCP, AWS Config, CloudTrail, GuardDuty, Security Hub, Inspector, Macie, KMS, ACM, Secrets Manager, WAF, Shield, Firewall Manager, Control Tower

**Sections:** IAM & 認証・認可 / Organizations & ガバナンス / セキュリティ監視・脅威検知 / 暗号化 & 証明書管理

### compute-applications
EC2, Placement Groups, AMI, Auto Scaling, ELB (ALB/NLB/CLB), Lambda, ECS, EKS, Fargate, App Runner, Elastic Beanstalk, SSM (Systems Manager), Patch Manager

**Sections:** EC2 & インスタンス管理 / Auto Scaling & ロードバランシング / Lambda & サーバーレス / コンテナ & アプリケーション統合 / システム運用 & パッチ管理

### content-delivery-dns
CloudFront, Route 53, Global Accelerator, WAF (when CloudFront-specific)

**Sections:** CloudFront & コンテンツ配信 / Route53 & DNS管理

### development-deployment
CodePipeline, CodeBuild, CodeDeploy, CodeCommit, CloudFormation, CDK, SAM, API Gateway, EventBridge, SNS, SQS, Step Functions

**Sections:** CI/CD & デプロイ / CI/CD & デプロイメント / IaC & CloudFormation / API & イベント駆動

### storage-database
S3, EBS, EFS, FSx, Storage Gateway, RDS, Aurora, DynamoDB, ElastiCache, Redshift, DocumentDB

**Sections:** S3 & オブジェクトストレージ / ブロック & ファイルストレージ / データベース & キャッシング

### migration
DMS, SCT, Migration Hub, Application Discovery Service, MGN, DataSync, Transfer Family, Backup (DR context)

**Sections:** DMS & データベース移行 / Migration Hub & 移行戦略 / ディザスタリカバリ (DR)

### analytics-operations
Athena, Glue, EMR, Kinesis, QuickSight, Lake Formation, CloudWatch, X-Ray, OpenSearch

**Sections:** データ分析 / 分析・運用 / 理解度クイズ・用語集

## Ambiguous Services — Decision Rules

| Service | Category | Reason |
|---------|----------|--------|
| Route 53 | `content-delivery-dns` | DNS is content delivery, not networking infrastructure |
| CloudFront | `content-delivery-dns` | CDN, not networking |
| WAF | `security-governance` (default) or `content-delivery-dns` (when CloudFront-specific) | Depends on context |
| Global Accelerator | `content-delivery-dns` | Edge/acceleration service |
| VPN | `networking` | Network connectivity, not security |
| PrivateLink | `networking` | Network connectivity |
| Systems Manager | `compute-applications` | Manages compute instances |
| Backup | `migration` (DR context) or `storage-database` (storage context) | Depends on context |

## Page Directory vs Display Category

A resource's file may live in a different directory than its `displayCategory`:
- `new-solutions/*.html` -> mapped via `displayCategory` to one of the 8 categories
- `continuous-improvement/*.html` -> mapped via `displayCategory`
- `cost-control/*.html` -> mapped via `displayCategory`
- `organizational-complexity/*.html` -> mapped via `displayCategory`

The `displayCategory` in `resource-registry.json` is what determines navigation placement, NOT the file path.

## Verification Checklist

Before committing any resource-registry.json change:

1. Check `displayCategory` matches the service mapping above
2. Check `section` matches one of the listed sections for that category
3. If the service is in the "Ambiguous Services" table, follow the decision rule
4. Run `node scripts/generate-data.mjs` to regenerate derived files
5. Verify the resource appears in the correct category on the learning-resources page
