# AWS Knowledge Organizer

AWS SAP試験対策のための知識・ノウハウを効率的に整理・管理するスキルです。

## 目的

このスキルは以下のタスクを支援します：
1. 新しいAWS学習リソースの追加と適切なカテゴリへの分類
2. 既存リソースの整理・更新・検索
3. クイズ問題の作成と管理
4. 学習計画の立案とナレッジベースの体系化
5. AWS SAP試験ドメインに沿った知識の構造化

## 主な機能

### 1. 新規リソースの追加

**自動統合ワークフロー（推奨）**:
```bash
# 1. new_html/ディレクトリに新しいHTMLファイルを配置
# 2. ドライラン実行で分類を確認
python3 integrate_new_html.py --dry-run

# 3. 統合実行（自動でカテゴリ分類、index.html更新）
python3 integrate_new_html.py

# 4. ローカルテスト
python3 server.py

# 5. 変更をコミット
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages
```

**手動追加の場合**:
- ファイル命名規則: `aws-[service]-[topic].html`
- 適切なカテゴリディレクトリに配置
- `index.html`のサイドバーとsearchData配列を更新
- `table-of-contents.html`を手動更新（静的参照ページ）

### 2. カテゴリ分類基準

AWS SAP試験ドメインに基づく9つのカテゴリ:

| カテゴリ | キーワード例 | ディレクトリ |
|---------|------------|-------------|
| ネットワーキング | VPC, Direct Connect, Transit Gateway, VPN, PrivateLink | `networking/` |
| セキュリティ・ガバナンス | IAM, Cognito, SCP, Organizations, KMS, WAF | `security-governance/` |
| コンピュート・アプリケーション | EC2, Lambda, ECS, Auto Scaling, ALB, SQS | `compute-applications/` |
| コンテンツ配信・DNS | CloudFront, Route53, Global Accelerator | `content-delivery-dns/` |
| 開発・デプロイメント | CloudFormation, CDK, SAM, EventBridge, API Gateway | `development-deployment/` |
| ストレージ・データベース | S3, EBS, EFS, RDS, Aurora, DynamoDB, ElastiCache | `storage-database/` |
| 移行・転送 | DMS, Migration Hub, DR戦略, Blue/Green | `migration/` |
| 分析・運用 | Kinesis, Redshift, CloudWatch, Systems Manager | `analytics-bigdata/` |
| 組織・マルチアカウント | RAM, Organizations, Service Catalog | `organizational-complexity/` |

### 3. クイズ問題の追加

`quiz-data-extended.js`を編集:

```javascript
const quizData = {
  'category-key': {
    title: 'カテゴリ名',
    icon: '絵文字',
    questions: [
      {
        id: 'unique-id',
        question: '問題文',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
        correct: 0, // 正解のインデックス (0-3)
        explanation: '詳細な解説'
      }
    ]
  }
};
```

**注意事項**:
- `id`は一意であること
- `correct`は0-3のインデックス
- `explanation`は詳細に記述（なぜ正解か、他の選択肢が不適切な理由など）

### 4. 一括操作の自動化

**パンくずナビゲーション追加/削除**:
```bash
# 追加
python3 add_breadcrumbs.py

# 削除
python3 remove_breadcrumbs.py
```

**ページ内目次（TOC）の追加**:
```bash
# ドライラン
python3 add_toc.py --dry-run

# 実行
python3 add_toc.py
```

### 5. リソース検索と管理

**検索機能の更新**:
新しいリソースを追加したら、`index.html`の`searchData`配列を更新:

```javascript
const searchData = [
  {
    title: 'リソースタイトル',
    category: 'カテゴリ名',
    file: 'path/to/resource.html'
  },
  // ... 新規エントリを追加
];
```

**リソースの検索方法**:
- タイトルやキーワードでGrep検索
- カテゴリディレクトリ内のファイル一覧確認
- `table-of-contents.html`で全体俯瞰

## ワークフロー例

### シナリオ1: 新しいAWSサービスの学習リソース追加

1. **リソース作成**:
   - HTML形式で学習コンテンツを作成
   - AWS公式ドキュメント、技術ブログ、Blackbelt資料などを参考
   - インフォグラフィック、図解、CLI例を含める

2. **統合**:
   ```bash
   # new_html/に配置
   mv new-resource.html new_html/

   # 自動統合
   python3 integrate_new_html.py
   ```

3. **検証**:
   ```bash
   # ローカルサーバー起動
   python3 server.py

   # ブラウザでhttp://localhost:8080/を開く
   # ナビゲーション、検索、表示を確認
   ```

4. **コミット**:
   ```bash
   git add .
   git commit -m "feat: [サービス名]学習リソースを追加"
   git push origin gh-pages
   ```

### シナリオ2: 既存リソースの再編成

1. **現状分析**:
   - 重複コンテンツの確認
   - カテゴリ分類の妥当性検証
   - ファイル命名規則の統一確認

2. **再編成計画**:
   - 移動・統合・削除するファイルをリストアップ
   - 新しいカテゴリ構造を設計
   - 影響範囲を特定（index.html、searchData、TOC）

3. **実行**:
   ```bash
   # ファイル移動
   git mv old-location/file.html new-location/file.html

   # index.htmlとsearchData更新
   # 手動編集またはスクリプト使用

   # テスト
   python3 server.py
   ```

4. **コミット**:
   ```bash
   git add .
   git commit -m "refactor: リソース構成を最適化"
   git push origin gh-pages
   ```

### シナリオ3: クイズ問題の拡充

1. **問題作成**:
   - AWS SAP試験の出題傾向を分析
   - 既存問題とのバランスを考慮
   - 実務経験に基づく実践的な問題を作成

2. **quiz-data-extended.js編集**:
   ```javascript
   // 適切なカテゴリに追加
   'storage-database': {
     title: 'ストレージ・データベース',
     icon: '💾',
     questions: [
       // ... 既存問題
       {
         id: 's3-glacier-retrieval-2024',
         question: 'S3 Glacier Deep Archiveから大量データを復元する際、最もコスト効率が良い方法は？',
         options: [
           'Expedited取得を使用',
           'Standard取得を使用',
           'Bulk取得を使用し、取得期間を48時間に設定',
           'S3 Intelligent-Tieringに自動移行させてから取得'
         ],
         correct: 2,
         explanation: 'Bulk取得は最も低コストで、Deep Archiveでは12-48時間で復元可能。大量データの場合、コスト削減効果が大きい。'
       }
     ]
   }
   ```

3. **テスト**:
   - quiz.htmlを開いて動作確認
   - 問題文、選択肢、解説の表示確認
   - 正解判定の動作確認

4. **コミット**:
   ```bash
   git add quiz-data-extended.js
   git commit -m "feat: S3 Glacier関連のクイズ問題を追加"
   git push origin gh-pages
   ```

## ベストプラクティス

### コンテンツ作成

1. **オフライン対応**:
   - すべてのCSS/JavaScriptはインライン記述
   - SVG画像もHTML内に埋め込み
   - 外部CDNやAPIは使用しない

2. **日本語最適化**:
   - 技術用語は英語併記
   - 図解やインフォグラフィックを多用
   - 実務での使い方を具体的に説明

3. **AWS SAP試験対策**:
   - 試験ドメインに沿った分類
   - ベストプラクティスとアンチパターンの明示
   - 複数サービスの組み合わせ例を提示

### ファイル管理

1. **命名規則**:
   - `aws-[service]-[topic].html` (推奨)
   - 小文字とハイフン使用
   - 説明的で検索しやすい名前

2. **Git運用**:
   - 機能追加・変更は必ずコミット＆プッシュ
   - コミットメッセージは`feat:`, `fix:`, `refactor:`などのプレフィックス使用
   - 大きな変更前はブランチ作成を検討

3. **検索可能性**:
   - `searchData`配列の更新を忘れない
   - タイトルはわかりやすく具体的に
   - カテゴリバッジで視認性向上

## トラブルシューティング

### 問題: 新規リソースが表示されない

**チェック項目**:
1. ファイルパスが正しいか確認
2. `index.html`のsidebarに追加されているか
3. `searchData`配列に含まれているか
4. ブラウザのキャッシュをクリア
5. コンソールで404エラーを確認

### 問題: 検索結果に表示されない

**解決方法**:
1. `index.html`の`searchData`配列を確認
2. `title`, `category`, `file`プロパティが正しいか検証
3. ファイルパスが実際の場所と一致しているか確認

### 問題: クイズ問題が表示されない

**解決方法**:
1. `quiz-data-extended.js`の構文エラー確認
2. `id`の重複がないか確認
3. `correct`インデックスが0-3の範囲内か確認
4. ブラウザコンソールでJavaScriptエラーを確認

## 拡張アイデア

### 今後追加したい機能

1. **学習進捗管理**:
   - LocalStorageで閲覧履歴を保存
   - 未読/既読マーカー
   - 学習計画と進捗トラッキング

2. **クイズ機能強化**:
   - 間違えた問題の復習モード
   - カテゴリ別の正答率表示
   - 模擬試験モード（時間制限付き）

3. **コンテンツ拡充**:
   - 実際の試験問題分析
   - ハンズオンラボのガイド
   - アーキテクチャパターン集

4. **検索機能強化**:
   - タグベース検索
   - 全文検索（HTML内容も対象）
   - フィルタリング機能（カテゴリ、難易度、更新日）

## 使用例

### 例1: "AWS Systems Managerのパッチ管理についての学習リソースを追加したい"

1. HTMLファイルを`new_html/aws-systems-manager-patch-management.html`として作成
2. `python3 integrate_new_html.py --dry-run`で分類を確認
3. `python3 integrate_new_html.py`で統合実行
4. `python3 server.py`でローカルテスト
5. gitコミット＆プッシュ

### 例2: "Route53の学習リソースが複数のカテゴリに分散しているので整理したい"

1. `grep -r "Route53" .`で全ファイルを検索
2. 重複や分散を確認
3. 統合先を決定（例: `content-delivery-dns/`）
4. `git mv`でファイル移動
5. `index.html`とsearchDataを更新
6. テストしてコミット

### 例3: "S3に関するクイズ問題を10問追加したい"

1. S3のドキュメントとベストプラクティスを確認
2. 試験頻出トピックをリストアップ
3. `quiz-data-extended.js`の`storage-database`セクションに追加
4. 各問題にユニークなidを付与
5. ブラウザでクイズ動作確認
6. gitコミット

## まとめ

このスキルを使用することで、AWS SAP試験対策の学習リソースを効率的に管理・拡充できます。

**重要なポイント**:
- 自動化スクリプト（`integrate_new_html.py`など）を活用
- AWS SAP試験ドメインに沿ったカテゴリ分類を維持
- オフライン対応の静的サイト設計を遵守
- すべての変更をGitでトラッキング
- 検索機能とナビゲーションの一貫性を保つ

このスキルを使って、体系的なAWS学習プラットフォームを構築していきましょう！
