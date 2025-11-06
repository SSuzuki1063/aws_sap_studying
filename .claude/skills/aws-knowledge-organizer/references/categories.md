# AWS SAP Category Classification Reference

This reference defines the category classification system for AWS learning resources aligned with AWS Solutions Architect Professional exam domains.

## Category Structure

The repository organizes content into 9 main categories:

| Directory | Category Name | Exam Domain Alignment |
|-----------|--------------|----------------------|
| `networking/` | ネットワーキング | Design for Organizational Complexity, Network Architecture |
| `security-governance/` | セキュリティ・ガバナンス | Security, Governance, Compliance |
| `compute-applications/` | コンピュート・アプリケーション | Application Services, Compute Solutions |
| `content-delivery-dns/` | コンテンツ配信・DNS | Content Delivery, Global Infrastructure |
| `development-deployment/` | 開発・デプロイメント | Continuous Improvement, Deployment Strategies |
| `storage-database/` | ストレージ・データベース | Storage Solutions, Database Architecture |
| `migration/` | 移行・転送 | Migration Planning, Data Transfer |
| `analytics-bigdata/` | 分析・運用・クイズ | Analytics, Operational Excellence |
| `organizational-complexity/` | 組織・マルチアカウント | Multi-Account Strategy, Resource Sharing |

## AWS Service to Category Mapping

This mapping is used by `integrate_new_html.py` for automatic categorization:

### networking
**Keywords:** VPC, Direct Connect, VPN, Transit Gateway, PrivateLink, ENI, EIP, NAT Gateway, Internet Gateway, Virtual Private Gateway, Customer Gateway, VPC Peering, Endpoint, Network ACL, Security Group, Route Table, Elastic IP, NAT Instance

**Services:**
- Amazon VPC
- AWS Direct Connect
- AWS Transit Gateway
- AWS VPN
- AWS PrivateLink
- Elastic Network Interface (ENI)
- Elastic IP (EIP)
- NAT Gateway

### security-governance
**Keywords:** IAM, Cognito, SCP, Organizations, KMS, CMK, WAF, Shield, GuardDuty, Security Hub, Macie, Inspector, Secrets Manager, Certificate Manager, ACM, CloudHSM, Tag Policy, Service Control Policy, Identity Federation, SAML, SSO, Directory Service

**Services:**
- AWS IAM
- Amazon Cognito
- AWS Organizations
- AWS KMS
- AWS WAF
- AWS Shield
- Amazon GuardDuty
- AWS Security Hub
- Amazon Macie
- Amazon Inspector
- AWS Secrets Manager
- AWS Certificate Manager (ACM)
- AWS CloudHSM

### compute-applications
**Keywords:** EC2, Lambda, ECS, EKS, Fargate, Auto Scaling, Elastic Load Balancing, ALB, NLB, SQS, SNS, Step Functions, EventBridge, App Runner, Batch, EFA, Placement Groups, Instance Types, AMI, Systems Manager, Patch Manager

**Services:**
- Amazon EC2
- AWS Lambda
- Amazon ECS
- Amazon EKS
- AWS Fargate
- Auto Scaling
- Elastic Load Balancing
- Amazon SQS
- Amazon SNS
- AWS Step Functions
- Amazon EventBridge
- AWS Systems Manager

### content-delivery-dns
**Keywords:** CloudFront, Route53, Global Accelerator, Origin Shield, Lambda@Edge, CloudFront Functions, Geo Restriction, Signed URLs, OAI, Route Policy, Health Check, DNSSEC

**Services:**
- Amazon CloudFront
- Amazon Route 53
- AWS Global Accelerator

### development-deployment
**Keywords:** CloudFormation, CDK, SAM, CodePipeline, CodeBuild, CodeDeploy, CodeCommit, API Gateway, EventBridge, AppSync, Amplify, CloudWatch Events, StackSets, Nested Stacks, Change Sets, Service Catalog

**Services:**
- AWS CloudFormation
- AWS CDK
- AWS SAM
- AWS CodePipeline
- AWS CodeBuild
- AWS CodeDeploy
- Amazon API Gateway
- Amazon EventBridge
- AWS AppSync
- AWS Service Catalog

### storage-database
**Keywords:** S3, EBS, EFS, FSx, Storage Gateway, RDS, Aurora, DynamoDB, ElastiCache, Neptune, QLDB, DocumentDB, Timestream, Keyspaces, MSK, Glacier, S3 Glacier, Storage Classes, Lifecycle Policy, Replication, Encryption

**Services:**
- Amazon S3
- Amazon EBS
- Amazon EFS
- Amazon FSx
- AWS Storage Gateway
- Amazon RDS
- Amazon Aurora
- Amazon DynamoDB
- Amazon ElastiCache
- Amazon Neptune
- Amazon MSK (Managed Streaming for Kafka)

### migration
**Keywords:** DMS, Migration Hub, Application Discovery Service, Server Migration Service, DataSync, Transfer Family, Snowball, Snowmobile, Database Migration, Schema Conversion Tool, DR Strategy, Pilot Light, Warm Standby, Multi-Site, Backup and Restore, Blue Green Deployment

**Services:**
- AWS Database Migration Service (DMS)
- AWS Migration Hub
- AWS Application Discovery Service
- AWS DataSync
- AWS Transfer Family
- AWS Snow Family
- AWS Backup

### analytics-bigdata
**Keywords:** Kinesis, Kinesis Data Firehose, Kinesis Data Analytics, Redshift, Athena, EMR, Glue, Lake Formation, QuickSight, Data Pipeline, CloudWatch, CloudTrail, X-Ray, Cost Explorer, Budgets, Trusted Advisor, Metrics, Logs, Alarms

**Services:**
- Amazon Kinesis
- Amazon Redshift
- Amazon Athena
- Amazon EMR
- AWS Glue
- AWS Lake Formation
- Amazon QuickSight
- AWS Data Pipeline
- Amazon CloudWatch
- AWS CloudTrail
- AWS X-Ray
- AWS Cost Explorer

### organizational-complexity
**Keywords:** RAM, Resource Access Manager, Organizations, Control Tower, Service Catalog, Landing Zone, OU, Multi-Account, Cross-Account, Resource Sharing, Consolidated Billing

**Services:**
- AWS Resource Access Manager (RAM)
- AWS Organizations
- AWS Control Tower
- AWS Service Catalog

## Categorization Algorithm

The `integrate_new_html.py` script uses keyword matching to determine categories:

1. **Extract keywords** from HTML title and H1 tags
2. **Score each category** based on keyword matches (case-insensitive)
3. **Select the best-fit category** with highest score
4. **Default to `compute-applications`** if no strong match

## Adding New Categories

When adding a new category:

1. Create the directory: `mkdir category-name/`
2. Update this reference with keywords and services
3. Update `integrate_new_html.py` CATEGORY_KEYWORDS
4. Update `index.html` sidebar with new category section
5. Update category quick navigation links
6. Test with sample HTML files

## Category Naming Conventions

- Use lowercase with hyphens: `category-name/`
- Match directory name in `index.html` category IDs
- Use descriptive Japanese names in UI: `カテゴリ名`
- Align with AWS SAP exam domains where possible
