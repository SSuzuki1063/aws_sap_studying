# AWS SAP (Solutions Architect Professional) 学習リソース

AWS Solutions Architect Professional 試験の学習用リソースを集約したWebサイトです。視覚的なインフォグラフィック、技術解説、練習問題を通じて、効率的な学習をサポートします。

## 🌐 公開サイト

GitHub Pages で公開中: https://ssuzuki1063.github.io/aws_sap_studying/

## 📚 コンテンツ

### 学習リソース（120+ HTML）
- **ネットワーキング**: Direct Connect, Transit Gateway, VPN, PrivateLink, EIP/NAT
- **セキュリティ・ガバナンス**: SCP, IAM, WAF, Tag Policies, Cognito, KMS
- **コンピュート・アプリケーション**: EC2, Lambda, ECS, EFA, Auto Scaling, ALB
- **コンテンツ配信・DNS**: CloudFront, Route53, Global Accelerator
- **開発・デプロイメント**: CloudFormation, CDK, SAM, EventBridge, API Gateway
- **ストレージ・データベース**: S3, EBS, EFS, RDS Aurora, ElastiCache, MSK
- **移行・モダナイゼーション**: DMS, Migration Hub, DR戦略, Blue/Green
- **分析・ビッグデータ**: Kinesis, Redshift, Glue, QuickSight, Lake Formation
- **組織管理**: AWS Organizations, Control Tower, Service Catalog, RAM
- **コスト最適化**: Savings Plans, Compute Optimizer, Cost Anomaly Detection

### インタラクティブクイズ（194問）
13カテゴリにわたる詳細な解説付き練習問題で理解度チェック

## 🚀 クイックスタート

### ローカルでの実行
```bash
# リポジトリをクローン
git clone https://github.com/SSuzuki1063/aws_sap_studying.git
cd aws_sap_studying

# 開発サーバーを起動
python3 server.py

# ブラウザで開く
# http://localhost:8080/
```

### 新しい学習リソースの追加
```bash
# 1. HTMLファイルを new_html/ に配置

# 2. 自動統合スクリプトを実行（プレビュー）
python3 scripts/html_management/integrate_new_html.py --dry-run

# 3. 統合を実行
python3 scripts/html_management/integrate_new_html.py

# 4. ローカルテスト
python3 server.py

# 5. コミット＆デプロイ
git add .
git commit -m "feat: 新規リソースを追加"
git push origin gh-pages
```

## 📂 ディレクトリ構成

```
aws_sap/
├── 📄 index.html                    # メインナビゲーション
├── 📄 quiz.html                     # クイズアプリ
├── 📄 quiz-data-extended.js         # クイズデータ（194問）
├── 📄 server.py                     # 開発サーバー
├── 📄 CLAUDE.md                     # Claude Code用指示書
├── 📁 docs/                         # ドキュメント
│   ├── QUIZ_UPDATE_SUMMARY.md
│   ├── UPDATE_COMPLETED.md
│   └── quiz_improvement_report.md
├── 📁 scripts/                      # 自動化スクリプト
│   ├── html_management/             # HTML管理スクリプト
│   │   ├── add_breadcrumbs.py       # パンくず追加
│   │   ├── remove_breadcrumbs.py    # パンくず削除
│   │   ├── add_toc.py               # 目次追加
│   │   └── integrate_new_html.py    # 新規HTML統合
│   └── quiz_management/             # クイズ管理スクリプト
│       ├── analyze_quiz.py          # クイズ統計分析
│       └── README.md                # スクリプト使用方法
├── 📁 archive/                      # 旧バージョン（削除候補）
├── 📁 networking/                   # 学習コンテンツ
├── 📁 security-governance/
├── 📁 compute-applications/
├── 📁 storage-database/
├── 📁 migration/
├── 📁 analytics-bigdata/
└── ... (その他のカテゴリ)
```

## 🛠️ 開発ツール

### HTML管理スクリプト
```bash
# パンくずナビゲーション追加
python3 scripts/html_management/add_breadcrumbs.py

# ページ内目次追加（プレビュー）
python3 scripts/html_management/add_toc.py --dry-run

# 新規HTMLファイル統合
python3 scripts/html_management/integrate_new_html.py
```

### クイズ管理
```bash
# クイズ統計を表示
python3 scripts/quiz_management/analyze_quiz.py
```

詳細は `scripts/quiz_management/README.md` を参照してください。

## 🎯 AWS SAP-C02 試験対応

### クイズカバレッジ
- **合計問題数**: 194問
- **カテゴリ数**: 13
- **試験ドメイン整合性**:
  - ドメイン1（組織の複雑性 26%）: ✅ 30.9%
  - ドメイン2（新しいソリューション 29%）: ✅ 39.6%
  - ドメイン3（移行・モダナイゼーション 20%）: ✅ 17.4%
  - ドメイン4（継続的改善 25%）: ⚠️ 20.1%

### 学習リソース
- **120+ HTMLページ**: 詳細な技術解説とインフォグラフィック
- **インラインSVG図解**: オフラインでも閲覧可能
- **実践的なシナリオ**: 実務で使える知識を重視

## 📖 特徴

- ✅ **完全静的サイト**: ビルドプロセス不要、GitHub Pages で即デプロイ
- ✅ **オフライン対応**: すべてのコンテンツをローカルで利用可能
- ✅ **レスポンシブデザイン**: PC・タブレット・スマホで最適表示
- ✅ **検索機能**: 全リソースを瞬時に検索
- ✅ **自動化ツール**: コンテンツ追加・更新を効率化

## 🤝 コントリビューション

### 学習リソースの追加
1. `new_html/` にHTMLファイルを配置
2. `integrate_new_html.py` で自動カテゴリ分類＆統合
3. プルリクエストを作成

### クイズ問題の追加
1. `quiz-data-extended.js` を編集
2. 各問題は以下の形式:
   ```javascript
   {
       id: 11,
       question: "質問文",
       options: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
       correct: 1,  // 正解のインデックス (0-3)
       explanation: "詳細な解説文"
   }
   ```
3. 構文チェック: `node -c quiz-data-extended.js`
4. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは学習目的で作成されています。
AWSサービスの商標・著作権はAmazon Web Services, Inc.に帰属します。

## 📬 お問い合わせ

質問・提案・バグ報告は [GitHub Issues](https://github.com/SSuzuki1063/aws_sap_studying/issues) へお願いします。

---

**更新履歴**:
- 2025-11-07: ディレクトリ構成を整理（194問）
- 2025-11-07: クイズを194問に拡充（全13カテゴリ）
- 2025-11-06: クイズを149問に拡充（移行分野強化）
- 2024-10: 初版リリース（130問）
