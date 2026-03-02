# HTML Learning Resource Integration — Full Workflow

詳細な統合手順リファレンス。概要は [SKILL.md](../SKILL.md) を参照。

---

## Option A: 完全自動統合（推奨）

**いつ使うか:** `new_html/` に配置済みのHTMLファイルを統合するとき

### ステップ 1 — ファイルを配置

```bash
# HTMLファイルを new_html/ に置く
# ファイル名規則: aws-[service]-[topic].html
```

### ステップ 2 — ドライラン（確認）

```bash
python3 scripts/html_management/integrate_resource_complete.py --dry-run
```

カテゴリ分類が正しいか確認する。誤っている場合は手動でファイルを移動してから実行。

### ステップ 3 — 実行

```bash
python3 scripts/html_management/integrate_resource_complete.py
```

スクリプトが自動的に以下を順番に実行:

| ステップ | スクリプト | 処理内容 |
|---------|-----------|---------|
| 1 | `integrate_new_html.py` | カテゴリ判定・移動・共通CSS追加・固定ヘッダー追加・スニペット出力 |
| 2 | `add_breadcrumbs.py` | パンくずナビゲーション追加 |
| 3 | `add_sidebar_toc.py` | 左サイドバーTOC追加（**⚠️ `<h2>`タグ必須** — `<div>`では生成されない） |
| 4 | `add_home_button.py` | 「リソース集に戻る」ボタン追加（右下固定） |
| 5 | `add_prev_next_nav.py` | ページ下部ナビゲーション追加 |
| 6 | W3C自動検証 | W3C Validator APIで全ファイル検証（エラー時は中断） |
| 7 | git自動ステージング | `git add` を検証済みファイルに実行 |

**オプション:**
```bash
# W3C検証をスキップ（オフライン・高速イテレーション時）
python3 scripts/html_management/integrate_resource_complete.py --skip-validation

# カスタムソースディレクトリ
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/

# 詳細出力
python3 scripts/html_management/integrate_resource_complete.py --verbose
```

### ステップ 4 — data.js と index.js を更新

スクリプトがコピペ用スニペットを出力する。それを使って:

#### a. data.js — resources 配列に追加

```javascript
// 該当セクションの resources 配列に追加
{
  title: "リソースタイトル",
  href: "category/filename.html",
  priority: 'high'  // 'high' | 'medium' | 'low'
}
```

`priority` の選び方:
- `'high'` — SAP試験頻出・必須知識（🔴 赤サブヘッダー表示）
- `'medium'` — 標準（🟡 黄サブヘッダー表示）— スニペットのデフォルト
- `'low'` — 補助的・応用的（🔵 青サブヘッダー表示）

カウント更新の自動化:
```bash
python3 scripts/html_management/update_counts.py
```

#### b. index.js — searchData 配列に追加

```javascript
{
  title: 'リソースタイトル',  // data.js と完全一致
  category: 'カテゴリ名',
  file: 'category/filename.html'  // data.js の href と完全一致
}
```

#### c. ⚠️ updateHistory を更新（必須）

`data.js` の `updateHistory` 配列の**先頭**に追加:

```javascript
{
  date: 'YYYY-MM-DD',          // 今日の日付
  type: 'content',             // 'content' | 'feature' | 'fix'
  title: '追加したリソースの概要',
  description: '追加したリソースの詳細説明',
  categories: ['networking'],   // 該当カテゴリ（複数可）
  tags: ['新サービス']           // オプション: '新サービス' | 'AWS試験変更対応' | []
},
```

**これを忘れると index.html の更新履歴タイムラインが古くなります。**

→ 詳細構造: [data_structure_guide.md](data_structure_guide.md)

### ステップ 5 — W3C検証（自動実行済み）

スクリプトのステップ6で自動実行される。エラーが出た場合:
```bash
# 特定ファイルを再検証
python3 scripts/ci/validate_html_w3c.py --files category/filename.html
# エラーを修正してから再実行
python3 scripts/html_management/integrate_resource_complete.py --skip-validation
```

→ 詳細: [validation_checklist.md](validation_checklist.md)

### ステップ 6 — ローカルテスト

```bash
python3 server.py
# → http://localhost:8080/
```

確認事項:
- [ ] ナビゲーションにリソースが表示される
- [ ] 検索でリソースが見つかる
- [ ] ファイルが正常にロードされる

### ステップ 7 — コミット＆デプロイ

HTMLファイルはステップ3で自動ステージング済み。

```bash
git add data.js index.js
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages   # GitHub Pagesが1-2分で自動デプロイ
```

### ステップ 8 — デプロイ確認

- 1-2分待つ
- https://ssuzuki1063.github.io/aws_sap_studying/ を確認
- リソースが正常に表示・ロードされることを確認

---

## Option B: 個別スクリプト実行（上級者向け）

**いつ使うか:** デバッグ時、または細かい制御が必要なとき

```bash
# 1. カテゴリ分類・移動
python3 scripts/html_management/integrate_new_html.py --dry-run
python3 scripts/html_management/integrate_new_html.py

# 2. パンくず追加
python3 scripts/html_management/add_breadcrumbs.py

# 3. サイドバーTOC追加
python3 scripts/html_management/add_sidebar_toc.py --dry-run
python3 scripts/html_management/add_sidebar_toc.py

# 4. ホームボタン追加
python3 scripts/html_management/add_home_button.py

# 5. 前後ナビゲーション追加
python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only

# 6. W3C検証
python3 scripts/ci/validate_html_w3c.py --files category/filename.html

# 7. データ更新 (ステップ4以降はOption Aと同じ)
```

→ 自動化の詳細: [automation_workflow.md](automation_workflow.md)

---

## Option C: 手動作成（スクラッチから新規作成）

**いつ使うか:** HTMLファイルをゼロから作成するとき

1. **テンプレートをコピー:** `assets/html_resource_template.html`
2. **ファイル命名:** `aws-[service]-[topic].html`
3. **AWS ブランドカラー使用:** `#232F3E`, `#FF9900`
4. **オフライン対応:** CDN・外部依存禁止、SVGはインライン
5. **正しいディレクトリに配置:** [category_mappings.md](category_mappings.md) を参照
6. **以降はOption A のステップ5〜8と同じ**

---

## TOC生成トラブルシュート

サイドバーTOCが生成されない場合:

```
⚠️【要対応】TOCがスキップされました
```

**原因:** `<div class="section-title">` を使用している

**修正:**
```html
<!-- ❌ 修正前 -->
<div class="section-title">セクション名</div>

<!-- ✅ 修正後 -->
<h2 class="section-title">セクション名</h2>
```

修正後、再実行:
```bash
python3 scripts/html_management/add_sidebar_toc.py
```
