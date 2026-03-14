# 有効値一覧

## axis_tags（L0: 設計軸）

L2 service、L3 concept、L4 keyword の `axis_tags[]` に使用できる値。

| 値 | 日本語名 | 用途 |
|----|--------|------|
| `axis-availability` | 可用性 | Multi-AZ、フェイルオーバー、冗長化 |
| `axis-cost` | コスト最適化 | 料金モデル、ライフサイクル、予約インスタンス |
| `axis-dr` | 災害対策 | RTO/RPO、バックアップ、リージョン間複製 |
| `axis-governance` | ガバナンス | コンプライアンス、監査、ポリシー管理 |
| `axis-operational-excellence` | 運用効率 | 自動化、モニタリング、Infrastructure as Code |
| `axis-performance` | パフォーマンス | スループット、レイテンシ、キャッシュ |
| `axis-scalability` | スケーラビリティ | Auto Scaling、水平スケール、エラスティック |
| `axis-security` | セキュリティ | IAM、暗号化、KMS、ゼロトラスト |

---

## sap_domains（SAP試験ドメイン）

`sap_domains[]` に使用できる値。

| 値 | SAP試験ドメイン名 |
|----|-----------------|
| `sap-d1-org-governance` | Domain 1: Organizational Complexity のデザイン |
| `sap-d2-new-solutions` | Domain 2: 新しいソリューションのデザイン |
| `sap-d3-migration` | Domain 3: 移行の計画 |
| `sap-d4-cost-optimization` | Domain 4: コスト管理 |

---

## parent_domain_id（L1ドメイン）

L2 service の `parent_domain_id` に使用できる値。

| 値 | 日本語名 | 主なサービス |
|----|--------|------------|
| `dom-network` | ネットワーキング | VPC, Route 53, CloudFront, Direct Connect |
| `dom-compute` | コンピュート | EC2, Lambda, ECS, EKS, Fargate |
| `dom-storage` | ストレージ | S3, EBS, EFS, FSx, Storage Gateway |
| `dom-database` | データベース | RDS, DynamoDB, Aurora, ElastiCache, Redshift |
| `dom-security` | セキュリティ & アイデンティティ | IAM, KMS, WAF, Shield, GuardDuty, Cognito |
| `dom-analytics` | アナリティクス & ML | Kinesis, Glue, Athena, SageMaker, EMR |
| `dom-management` | 管理 & 運用 | CloudWatch, CloudTrail, Systems Manager, Config |
| `dom-integration` | アプリケーション統合 | SQS, SNS, EventBridge, Step Functions, API Gateway |

---

## crosslinks type

`crosslinks[].type` に使用できる値。

| 値 | 意味 | 使用例 |
|----|------|--------|
| `"related"` | 技術的に関連する | S3 ↔ CloudFront（一緒に使う） |
| `"prerequisite"` | 前提条件（先に学ぶべき） | Security Group → VPC（VPCがなければSGは使えない） |
| `"comparison"` | 比較・トレードオフ | Security Group vs NACL |

**禁止値:** `"axis_tag"`, `"sap_tag"`, その他任意の文字列

---

## 参考: 既存サービスID一覧（crosslinks の target_id として使用可）

```
svc-vpc
svc-s3
svc-ec2        (存在する場合)
svc-lambda     (存在する場合)
svc-rds        (存在する場合)
svc-dynamodb   (存在する場合)
svc-iam        (存在する場合)
svc-cloudfront (存在する場合)
```

> **注意:** target_id に使用する前に `concepts/services/` ディレクトリを確認し、
> 実際に存在するファイル名（`svc-{name}.json`）から ID を特定すること。
> 存在しないIDを指定するとバリデーション警告が発生する。

実際のファイル一覧を確認:
```bash
ls concepts/services/ | sed 's/\.json//'
```
