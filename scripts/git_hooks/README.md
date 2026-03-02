# Git Hooks - 最終更新日自動管理システム

## 概要

このディレクトリには、**data.jsの最終更新日を自動的に更新するGit Hook**が含まれています。

## 仕組み

### Data-Driven原則に準拠した設計

```
┌─────────────┐
│  data.js    │  ← メタデータの単一の真実の源泉
│  siteStats  │     lastUpdated: '2025/12/28'
│  .lastUpdated│
└──────┬──────┘
       │
       │ 参照
       ▼
┌─────────────┐
│  index.js   │  ← UIロジック（データを表示するだけ）
│  function   │     siteStats.lastUpdatedを読み取り
│  update...  │
└─────────────┘
```

### 自動更新フロー

```
1. git commit を実行
   ↓
2. pre-commit hookが自動実行
   ↓
3. update_last_modified.py が実行される
   ↓
4. 最新のGitコミット日時を取得
   ↓
5. data.jsのlastUpdatedプロパティを更新
   ↓
6. 更新されたdata.jsをステージングエリアに追加
   ↓
7. コミットが完了（更新後のdata.jsが含まれる）
```

## ファイル構成

- **`update_last_modified.py`** - 最終更新日を自動更新するPythonスクリプト
- **`.git/hooks/pre-commit`** - コミット前に自動実行されるGit Hook
- **`data.js`** - メタデータを保持する純粋なデータファイル
- **`index.js`** - data.jsのメタデータを参照してUIに表示

## 使い方

### 通常の使用（自動）

**何もする必要はありません！** 通常通りgit commitを実行するだけで、自動的に最終更新日が更新されます。

```bash
# 通常のコミット操作
git add .
git commit -m "feat: 新機能を追加"

# → pre-commit hookが自動実行され、data.jsの日付が更新される
```

### 手動実行（任意）

必要に応じて、スクリプトを直接実行することもできます：

```bash
python3 scripts/git_hooks/update_last_modified.py
```

### 動作確認

1. **data.jsの確認**
   ```bash
   grep -A 2 "lastUpdated" data.js
   ```

   期待される出力：
   ```javascript
   lastUpdated: '2025/12/28'  // GIT_LAST_COMMIT_DATE - このコメントは自動更新スクリプトのマーカーです
   ```

2. **ブラウザで確認**
   ```bash
   python3 server.py
   # http://localhost:8080/ を開く
   # 「サイト情報」セクションの「最終更新日」が正しく表示されることを確認
   ```

## トラブルシューティング

### pre-commit hookが実行されない

**原因:** hookファイルに実行権限がない

**解決策:**
```bash
chmod +x .git/hooks/pre-commit
```

### スクリプトが見つからないエラー

**原因:** リポジトリ構造が想定と異なる

**解決策:**
```bash
# スクリプトが正しい場所にあるか確認
ls -la scripts/git_hooks/update_last_modified.py

# 必要に応じて移動
mv update_last_modified.py scripts/git_hooks/
```

### 日付が更新されない

**原因1:** コミット履歴が存在しない（新規リポジトリ）

**解決策:** 初回コミット後に自動的に更新されます

**原因2:** data.jsのマーカーコメントが削除されている

**解決策:** data.jsのlastUpdatedプロパティに以下のコメントを追加：
```javascript
lastUpdated: '2025/12/28'  // GIT_LAST_COMMIT_DATE - このコメントは自動更新スクリプトのマーカーです
```

## 技術的な詳細

### 更新対象

`data.js`ファイルの以下のパターンに一致する行：

```javascript
lastUpdated: 'YYYY/MM/DD'  // GIT_LAST_COMMIT_DATE
```

### 正規表現パターン

```python
pattern = r"(lastUpdated:\s*')[^']+('.*?//\s*GIT_LAST_COMMIT_DATE)"
```

### 日付フォーマット

- **取得形式:** `git log -1 --format=%cd --date=format:%Y/%m/%d`
- **出力形式:** `YYYY/MM/DD` （例: 2025/12/28）

## 開発者向け情報

### スクリプトのカスタマイズ

日付フォーマットを変更したい場合：

```python
# update_last_modified.py の get_last_commit_date() 関数を編集
['git', 'log', '-1', '--format=%cd', '--date=format:%Y/%m/%d']
                                                    ^^^^^^^^^^
                                                    ここを変更
```

### Hook の無効化（一時的）

```bash
# コミット時にhookをスキップ
git commit --no-verify -m "メッセージ"
```

**注意:** 通常は使用しないでください。自動更新が重要です。

## Data-Driven原則の利点

✅ **単一の真実の源泉** - メタデータはdata.jsに集約
✅ **保守性** - データとロジックの分離
✅ **一貫性** - 手動更新のミスを防止
✅ **拡張性** - 他のメタデータも同様に管理可能
✅ **オフライン動作** - ビルドプロセス不要の静的サイト

## 関連ドキュメント

- [@docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - Data-driven architecture の詳細
- [@docs/CODING_STANDARDS.md](../../docs/CODING_STANDARDS.md) - Data-driven development principles
- [@CLAUDE.md](../../CLAUDE.md) - プロジェクト全体のガイド

## 更新履歴

- **2025-12-28** - 初版作成（Data-driven原則に準拠した自動更新システム）
