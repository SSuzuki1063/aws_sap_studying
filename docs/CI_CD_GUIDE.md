# CI/CD Pipeline Guide

このドキュメントでは、AWS SAP学習リソースリポジトリのCI/CDパイプラインについて説明します。

## 概要

このリポジトリは**Phase 1: 品質チェック自動化**を実装しており、Pull Request時に以下のチェックを自動実行します：

- ✅ **Data Integrity Check** - data.js と index.js の整合性検証
- ✅ **W3C HTML Validation** - 変更されたHTMLファイルのW3C検証
- ✅ **Accessibility Checks** - WCAG 2.1 AA準拠チェック（色コントラスト、見出し階層）
- ✅ **JavaScript Syntax Check** - JSファイルの構文チェック
- ⚠️ **Internal Links Validation** - 内部リンク切れチェック（警告のみ）
- ⚠️ **File Naming Convention** - ファイル命名規則チェック（警告のみ）

## CI/CDアーキテクチャ

```
Developer → git push → GitHub Actions → Quality Checks → Code Review → Merge
                            ↓
                    ✓ Data Integrity
                    ✓ W3C Validation
                    ✓ Accessibility
                    ✓ JS Syntax
                    ⚠ Link Check
                    ⚠ Naming Check
```

## GitHub Actions Workflow

### トリガー条件

PR作成・更新時に以下のファイル変更がある場合に実行：
- `**.html` - HTMLファイル
- `data.js` - データ定義ファイル
- `index.js` - UI event handlers
- `quiz-data-extended.js` - クイズデータ
- `**.css` - CSSファイル
- `**.py` - Pythonスクリプト

### Workflow ファイル

`.github/workflows/pr-quality-check.yml`

## ローカルでのテスト

CI/CDパイプラインをローカルで実行して、PR前に問題を検出できます：

### 環境準備

```bash
# uvで仮想環境を作成
uv venv

# 仮想環境をアクティベート
source .venv/bin/activate

# 依存関係をインストール
uv pip install beautifulsoup4 lxml html5lib requests
```

### 各チェックの実行

```bash
# 1. Data Integrity Check (最重要！)
python3 scripts/ci/check_data_integrity.py

# 2. W3C HTML Validation (PR mode - 変更ファイルのみ)
python3 scripts/ci/validate_html_w3c.py --pr-mode

# 3. W3C HTML Validation (Full - 全ファイル)
python3 scripts/ci/validate_html_w3c.py

# 4. Accessibility - Color Contrast
python3 scripts/accessibility/check_contrast_ratio.py

# 5. Accessibility - Heading Hierarchy
python3 scripts/accessibility/check_heading_hierarchy.py

# 6. JavaScript Syntax Check
node -c quiz-data-extended.js
node -c data.js
node -c render.js
node -c index.js

# 7. Internal Links Validation
python3 scripts/ci/check_internal_links.py

# 8. File Naming Convention
python3 scripts/ci/check_file_naming.py
```

### 全チェックを一括実行

```bash
# 仮想環境内で実行
source .venv/bin/activate

# Critical checks (これらが失敗するとPRがブロックされる)
python3 scripts/ci/check_data_integrity.py && \
python3 scripts/ci/validate_html_w3c.py --pr-mode && \
python3 scripts/accessibility/check_contrast_ratio.py && \
node -c quiz-data-extended.js && \
node -c data.js && \
echo "✅ All critical checks passed!"
```

## チェック詳細

### 1. Data Integrity Check (Critical ❌)

**目的:** data.js と index.js の同期を検証

**検証内容:**
- data.js のリソースが全て index.js の searchData に存在するか
- タイトルとパスの一致

**失敗時の対処:**
```javascript
// index.js の searchData に追加
const searchData = [
  // ... 既存エントリ ...
  {
    title: 'リソースのタイトル',
    category: 'カテゴリ名',
    file: 'category/resource.html'
  }
];
```

### 2. W3C HTML Validation (Critical ❌)

**目的:** HTML標準準拠とアクセシビリティの基礎

**検証内容:**
- W3C Validator API を使用した完全検証
- エラーと警告の検出

**PR mode:** 変更されたHTMLファイルのみ検証（高速）

**失敗時の対処:**
1. https://validator.w3.org/ でエラー詳細を確認
2. HTMLを修正
3. 再検証

### 3. Accessibility Checks (Critical ❌)

**Color Contrast Check:**
- WCAG 2.1 AA準拠（4.5:1以上）
- 全色組み合わせの検証

**Heading Hierarchy Check (Warning ⚠️):**
- h1 → h2 → h3 の階層構造
- スキップレベルの検出

### 4. JavaScript Syntax Check (Critical ❌)

**目的:** JavaScript構文エラーの検出

**対象ファイル:**
- quiz-data-extended.js
- data.js
- render.js
- index.js
- quiz-app.js

### 5. Internal Links Validation (Warning ⚠️)

**目的:** 内部リンク切れの検出

**警告のみ:** ビルドは失敗しないが、リンク切れを修正推奨

### 6. File Naming Convention (Warning ⚠️)

**推奨パターン:**
- `aws-[service]-[topic].html`
- `[service]_infographic.html`
- `[topic]-guide.html`

**警告のみ:** 既存ファイルへの影響を避けるため

## トラブルシューティング

### Data Integrity Check が失敗する

**症状:** `❌ Missing in index.js: リソース名 (path/to/file.html)`

**原因:** 新しいリソースを data.js に追加したが index.js を更新していない

**解決策:**
```bash
# 1. 不足しているリソースを確認
python3 scripts/ci/check_data_integrity.py

# 2. index.js の searchData に追加
# 3. 再チェック
python3 scripts/ci/check_data_integrity.py
```

### W3C Validation が失敗する

**症状:** `❌ W3C VALIDATION FAILED`

**原因:** HTML構文エラー

**解決策:**
```bash
# 1. 詳細エラーを確認
python3 scripts/ci/validate_html_w3c.py --pr-mode

# 2. https://validator.w3.org/ で該当ファイルを検証
# 3. エラーを修正
# 4. 再検証
```

### GitHub Actions でタイムアウト

**症状:** W3C validation が30秒でタイムアウト

**原因:** W3C Validator APIの応答遅延

**解決策:**
- PR modeを使用（変更ファイルのみ検証）
- ファイルを小さく分割

### Rate Limiting エラー

**症状:** `API Error: HTTP 429`

**原因:** W3C Validator APIのレート制限

**解決策:**
- スクリプトは既に1秒間隔を空けている
- 大量のHTMLファイルを一度にPRしない

## CI/CD パイプライン拡張

### 今後の拡張候補（Phase 2, 3）

**Phase 2: デプロイメント検証**
- Smoke test（主要ページの200 OKチェック）
- Lighthouse CI（パフォーマンス監視）
- デプロイ通知（Slack/Email）

**Phase 3: 定期ジョブ**
- External link check（AWS公式ドキュメントリンク）
- 週次アクセシビリティ監査レポート
- 月次クイズ問題レビュー

### カスタムチェックの追加

新しいチェックを追加する場合：

1. **スクリプト作成:** `scripts/ci/check_xxx.py`
2. **Workflow更新:** `.github/workflows/pr-quality-check.yml`
3. **ドキュメント更新:** このファイル

## ベストプラクティス

### PR作成前のチェックリスト

```bash
# ✅ ローカルで critical checks を実行
source .venv/bin/activate
python3 scripts/ci/check_data_integrity.py
python3 scripts/ci/validate_html_w3c.py --pr-mode

# ✅ ローカルサーバーでテスト
python3 server.py

# ✅ PRを作成
git push origin feature/xxx
```

### data.js + index.js 更新ワークフロー

新しいリソースを追加する際：

```bash
# 1. HTMLファイルを配置
# 2. data.js を更新（resources配列 + count）
# 3. index.js を更新（searchData配列）
# 4. Integrity checkで検証
python3 scripts/ci/check_data_integrity.py
# 5. コミット
```

### W3C Validation ワークフロー

```bash
# 1. HTMLファイルを作成・修正
# 2. ローカルでW3C検証
python3 scripts/ci/validate_html_w3c.py --pr-mode
# 3. エラーがあれば https://validator.w3.org/ で詳細確認
# 4. 修正して再検証
# 5. コミット
```

## メンテナンス

### 依存関係の更新

```bash
# 仮想環境を再作成
rm -rf .venv
uv venv
source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests
```

### スクリプトの修正

CI/CDスクリプトを修正した場合：

```bash
# ローカルでテスト
python3 scripts/ci/check_xxx.py

# PRを作成してCI/CDで検証
git push origin fix/ci-script
```

## FAQ

**Q: CI/CDチェックをスキップできますか？**
A: 推奨しません。品質保証のため全てのチェックを通過してください。

**Q: Warning のみのチェックは無視していいですか？**
A: 可能であれば修正を推奨しますが、ビルドはブロックしません。

**Q: ローカルとCI/CDで結果が異なります**
A: 仮想環境の依存関係バージョンを確認してください。

**Q: W3C validation が遅すぎます**
A: `--pr-mode` オプションを使用して変更ファイルのみ検証してください。

## 関連ドキュメント

- [@docs/DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - 開発ワークフロー
- [@docs/CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
- [@docs/WCAG21_GUIDELINES.md](WCAG21_GUIDELINES.md) - アクセシビリティガイド
- [@CLAUDE.md](../CLAUDE.md) - Claude Code向けガイド
