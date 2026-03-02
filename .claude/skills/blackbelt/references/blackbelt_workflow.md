# Black Belt PDF 登録 詳細ワークフロー

## カテゴリ・セクション対応表

Black Belt 資料を登録する際、テーマに最も近いセクションを選ぶ。

### networking（ネットワーキング）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `Direct Connect & ハイブリッドネットワーク` | Direct Connect, VPN, ハイブリッド |
| `VPC & ネットワーク基礎` | VPC, NACL, SG, EIP, ENI, IPv6, BGP |
| `Transit Gateway & ゲートウェイ` | Transit Gateway, Cloud WAN, ゲートウェイ一般 |

### security-governance（セキュリティ・ガバナンス）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `IAM & 認証・認可` | IAM, SSO, Identity Center, STS |
| `暗号化 & 証明書管理` | KMS, ACM, CloudHSM, Secrets Manager |
| `Organizations & ガバナンス` | Organizations, Control Tower, SCP |
| `セキュリティ監視・脅威検知` | GuardDuty, Security Hub, WAF, Shield, Network Firewall, Inspector |

### compute-applications（コンピュート・アプリケーション）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `EC2 & インスタンス管理` | EC2, EBS, Placement Group, EFA |
| `Auto Scaling & ロードバランシング` | Auto Scaling, ALB, NLB, GWLB, ELB |
| `Lambda & サーバーレス` | Lambda, Step Functions, SAM |
| `コンテナ & アプリケーション統合` | ECS, EKS, Fargate, SQS, SNS, EventBridge |
| `システム運用 & パッチ管理` | Systems Manager, CloudWatch, CloudTrail |

### content-delivery-dns（コンテンツ配信・DNS）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `CloudFront & コンテンツ配信` | CloudFront, Global Accelerator, Lambda@Edge |
| `Route53 & DNS管理` | Route 53, DNS, Hosted Zone |

### development-deployment（開発・デプロイメント）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `IaC & CloudFormation` | CloudFormation, CDK, SAM, Terraform |
| `API & イベント駆動` | API Gateway, EventBridge, AppSync |
| `CI/CD & デプロイメント` | CodePipeline, CodeBuild, CodeDeploy |

### storage-database（ストレージ・データベース）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `S3 & オブジェクトストレージ` | S3, S3 Glacier, Storage Lens |
| `ブロック & ファイルストレージ` | EBS, EFS, FSx, Storage Gateway |
| `データベース & キャッシング` | RDS, Aurora, DynamoDB, ElastiCache, Redshift |

### migration（移行・転送）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `DMS & データベース移行` | DMS, SCT, データ移行 |
| `Migration Hub & 移行戦略` | Migration Hub, Application Migration Service |
| `ディザスタリカバリ (DR)` | DR戦略, Backup, Pilot Light, Warm Standby |

### analytics-operations（分析・運用）

| セクションタイトル | 対象サービス・テーマ |
|----------------|------------------|
| `分析・運用` | CloudWatch, X-Ray, Config, Trusted Advisor |
| `データ分析` | Athena, Glue, Kinesis, EMR, OpenSearch |

---

## 未登録 PDF の特定と登録手順

### 1. 未登録 PDF を特定する

```bash
# BlackBelt/ 内の全 PDF
ls BlackBelt/*.pdf | xargs -I{} basename {}

# data.js に登録済みの BlackBelt PDF
grep "BlackBelt/" data.js | grep -oP "BlackBelt/\K[^'\"]+"

# 上記2つを比較して未登録を特定
```

### 2. 各 PDF のタイトルを決定する

**日付パターン一覧:**

```
YYYYMMDD_...           → 先頭8桁を YYYY年M月 に変換
  例: 20201021_...     → 2020年10月

YYYYMM_...             → 先頭6桁を YYYY年M月 に変換
  例: 202110_...       → 2021年10月

BlackBeltYYYYMM_...    → "BlackBelt" 直後6桁
  例: BlackBelt202106_ → 2021年6月

..._YYYY_..._MMDD_...  → YYYY を年、MM を月に変換
  例: _2025_..._0122_  → 2025年1月

日付なし                → 括弧ごと省略
  例: KMD41_...        → 日付なし
```

**タイトル生成例:**

| ファイル名 | タイトル |
|---------|--------|
| `20201021_AWS-BlackBelt-VPC.pdf` | `【Black Belt】AWS VPC (2020年10月)` |
| `202110_AWS_Black_Belt_Site-to-Site_VPN.pdf` | `【Black Belt】AWS Site-to-Site VPN (2021年10月)` |
| `AWS-54_AWS_networking_Fundamentals_KMD41.pdf` | `【Black Belt】AWS Networking Fundamentals` |
| `BlackBelt202106_AWS_Network_Firewall_Basic.pdf` | `【Black Belt】AWS Network Firewall Basic (2021年6月)` |
| `AWS-Black-Belt_2025_AWS-Transit-Gateway-deepdive_0122_v1.pdf` | `【Black Belt】AWS Transit Gateway Deep Dive (2025年1月)` |

---

## 複数 PDF の一括登録

```bash
# 登録対象のファイルを確認
ls BlackBelt/*.pdf

# data.js に一括編集（Editツール使用）
# 各 PDF について以下を data.js に追加:
# - 対象セクションの resources[] にエントリ
# - 対象セクションの count +N
# - 対象カテゴリの count +N
# - updateHistory に1エントリ（複数PDFはまとめて1エントリでもよい）

# index.js に一括編集（Editツール使用）
# searchData[] に各PDFのエントリを追加

# カウント同期
python3 scripts/html_management/update_counts.py

# 整合性確認
python3 scripts/ci/check_data_integrity.py

# コミット
git add BlackBelt/*.pdf data.js index.js
git commit -m "feat(blackbelt): Black Belt PDF 4件を追加 — VPC, Site-to-Site VPN, Networking, Network Firewall"
git push origin gh-pages
```

---

## integrate との完全比較

| 項目 | blackbelt (PDF) | integrate (HTML) |
|------|----------------|-----------------|
| ファイル変換 | 不要 | HTML変換・整形 |
| W3C 検証 | **不要** | 必須 |
| ブレッドクラム追加 | **不要** | 自動生成 |
| サイドバー TOC | **不要** | 自動生成 |
| `data.js` 更新 | **必須** | 必須 |
| `index.js` 更新 | **必須** | 必須 |
| `updateHistory` 追加 | **必須** | 必須 |
| カウント同期 | **必須** | 必須 |
| スクリプト実行 | `update_counts.py` | `integrate_resource_complete.py` |
| ファイル格納先 | `BlackBelt/` | カテゴリディレクトリ（`networking/` 等） |
| `git add` 対象 | `BlackBelt/*.pdf` + `data.js` + `index.js` | スクリプトが自動ステージング |

---

## 登録後チェックリスト

- [ ] `data.js` の対象セクション `resources[]` にエントリが追加されているか
- [ ] `data.js` の section `count` と category `count` が正しいか
- [ ] `data.js` の `updateHistory` に追加されているか
- [ ] `index.js` の `searchData[]` にエントリが追加されているか
- [ ] `check_data_integrity.py` が exit 0 で完了するか
- [ ] デプロイ後に対象カテゴリのナビにリンクが表示されるか
- [ ] サイト検索で PDF タイトルがヒットするか
- [ ] リンクをクリックして PDF が正常に開くか
