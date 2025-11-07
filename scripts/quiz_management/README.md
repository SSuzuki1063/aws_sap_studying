# クイズ管理スクリプト

AWS SAP クイズデータベースの管理・分析ツール集

## 📊 analyze_quiz.py

クイズデータベースの統計情報を表示するスクリプト

### 使い方

```bash
# リポジトリルートから実行
python3 scripts/quiz_management/analyze_quiz.py
```

### 出力内容

```
======================================================================
AWS SAP クイズデータベース 現状分析
======================================================================

カテゴリ別問題数:
----------------------------------------------------------------------
✓  1. ネットワーキング                         (networking                  ):  11問
✓  2. セキュリティ・ガバナンス                     (security-governance         ):  11問
✓  3. コンピュート・アプリケーション                  (compute-applications        ):  11問
...
----------------------------------------------------------------------
合計カテゴリ数: 13
合計問題数: 194問
平均問題数/カテゴリ: 14.9問

最多問題数: 移行・モダナイゼーション (26問)
最少問題数: ネットワーキング (11問)
```

### 動作原理

1. `quiz-data-extended.js` を読み込み
2. JavaScript オブジェクトを正規表現でパース
3. 各カテゴリの問題数をカウント
4. 統計情報を集計・表示

### 注意事項

- **実行場所**: 必ずリポジトリルートから実行してください
- **依存関係**: Python 3.6+ （標準ライブラリのみ使用）
- **quiz-data-extended.js のパス**: `../../quiz-data-extended.js` を参照

## 🎯 クイズ問題の追加方法

### 1. quiz-data-extended.js を編集

```javascript
"category-key": {
    title: "カテゴリ名",
    icon: "📚",
    questions: [
        // 既存の問題...
        {
            id: 11,  // 次のID番号
            question: "新しい質問文をここに記述",
            options: [
                "選択肢1",
                "選択肢2",
                "選択肢3",
                "選択肢4"
            ],
            correct: 1,  // 正解のインデックス (0-3)
            explanation: "詳細な解説文。正解の理由、不正解の選択肢がなぜ間違っているか、実務での活用方法などを記述します。"
        }
    ]
}
```

### 2. 問題作成のガイドライン

#### 必須要素
- ✅ `id`: カテゴリ内で一意な番号（通常は連番）
- ✅ `question`: 明確で具体的な質問文
- ✅ `options`: 4つの選択肢（配列）
- ✅ `correct`: 正解のインデックス（0-3の整数）
- ✅ `explanation`: 100-200文字程度の詳細な解説

#### 問題の品質基準
- 🎯 **AWS SAP試験レベルの難易度**
- 🎯 **実践的なシナリオ**または最新ベストプラクティス
- 🎯 **明確な正解が1つ**、他の選択肢は明確に誤り
- 🎯 **説明は技術的に正確**で、なぜその選択肢が正解/不正解かを明示

#### 例：良い問題

```javascript
{
    id: 15,
    question: "Amazon S3 Intelligent-Tiering のアーカイブ設定オプションの活用方法は？",
    options: [
        "すべてのオブジェクトを即座にアーカイブ",
        "90日以上/180日以上アクセスのないオブジェクトを自動的にArchive/Deep Archiveに移行して大幅コスト削減",
        "アーカイブ機能は使用不可",
        "手動でのみアーカイブ可能"
    ],
    correct: 1,
    explanation: "S3 Intelligent-Tiering のオプション機能として、90日または180日以上アクセスのないオブジェクトを自動的にArchive Access TierまたはDeep Archive Access Tierに移行できます。これにより、Glacier並みの低コスト（GB/月 $0.00099〜）を実現しつつ、アクセス時の自動復元も可能です。"
}
```

### 3. 構文チェック

```bash
# JavaScriptの構文エラーをチェック
node -c quiz-data-extended.js

# ✅ 成功時は何も表示されない
# ❌ エラー時はエラー箇所が表示される
```

### 4. 統計確認

```bash
# 問題数が正しく増えたか確認
python3 scripts/quiz_management/analyze_quiz.py
```

### 5. 動作確認

```bash
# ローカルサーバーで実際にクイズを試す
python3 server.py
# ブラウザで http://localhost:8080/quiz.html を開く
```

## 📋 カテゴリ一覧

| カテゴリキー | 日本語名 | 現在の問題数 |
|-------------|---------|------------|
| `networking` | ネットワーキング | 11問 |
| `security-governance` | セキュリティ・ガバナンス | 11問 |
| `compute-applications` | コンピュート・アプリケーション | 11問 |
| `content-delivery-dns` | コンテンツ配信・DNS | 15問 |
| `development-deployment` | 開発・デプロイメント | 15問 |
| `transit-gateway` | Transit Gateway 共有 | 15問 |
| `organizational-complexity` | 組織の複雑性・ガバナンス | 15問 |
| `cost-optimization` | コスト最適化 | 15問 |
| `migration-modernization` | 移行・モダナイゼーション | 26問 |
| `storage-database` | ストレージ・データベース | 15問 |
| `analytics-bigdata` | 分析・ビッグデータ | 15問 |
| `monitoring-logging` | 監視・ログギング | 15問 |
| `ai-machine-learning` | AI・機械学習 | 15問 |

**合計**: 194問

## 🔍 トラブルシューティング

### エラー: `quiz-data-extended.js` が見つからない

```bash
# 実行場所を確認
pwd
# /home/suzuki100603/aws_sap であることを確認

# ファイルの存在確認
ls -la quiz-data-extended.js
```

### エラー: JavaScript構文エラー

```bash
# 詳細なエラー箇所を確認
node -c quiz-data-extended.js
```

よくあるエラー:
- カンマの付け忘れ/余分なカンマ
- 引用符の閉じ忘れ
- 括弧の対応が取れていない
- `correct` の値が 0-3 の範囲外

### クイズアプリで問題が表示されない

1. ブラウザの開発者ツールを開く (F12)
2. Console タブでエラーを確認
3. `quiz-data-extended.js` の読み込みエラーがないか確認

## 🚀 今後の拡張案

- [ ] カテゴリ別のバランスチェック（各カテゴリ15問推奨）
- [ ] AWS SAP-C02試験ドメインとの整合性分析
- [ ] 問題の難易度レベル（初級/中級/上級）の追加
- [ ] 正答率トラッキング機能
- [ ] 間違えた問題の復習機能

## 📝 参考資料

- [AWS SAP-C02 試験ガイド](https://aws.amazon.com/jp/certification/certified-solutions-architect-professional/)
- [AWS Well-Architected Framework](https://aws.amazon.com/jp/architecture/well-architected/)
- [AWS ホワイトペーパー](https://aws.amazon.com/jp/whitepapers/)

---

**最終更新**: 2025-11-07
**問題数**: 194問
