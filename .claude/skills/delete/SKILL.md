---
name: delete
description: |
  AWS学習HTMLリソースをWebサイトから完全削除するスキル。
  以下の場面で使用:
  (1) 内容が古くなったHTMLリソースを削除したい
  (2) 誤って追加したリソースを取り消したい
  (3) カテゴリの整理でリソースを統廃合したい
  ※ ファイルの更新は replace スキル、新規追加は integrate スキルを使用すること。
---

# AWS SAP リソース削除スキル

## integrate / replace との使い分け

| 操作 | 使うスキル |
|------|-----------|
| 新しいHTMLリソースを追加 | `/skill integrate` |
| 既存HTMLリソースの内容を更新 | `/skill replace` |
| HTMLリソースをサイトから削除 | `/skill delete` ← このスキル |

---

## ⚠️ 警告: 不可逆操作

HTMLファイルの `git rm` & `push` は **元に戻せない**。
**削除実行前に必ずユーザーへ最終確認を行うこと。**

---

## 削除時の更新箇所（3箇所必須 + 2箇所任意）

| 場所 | 操作 | 必須/任意 |
|------|------|---------|
| `data.js` | `resources[]` からエントリ削除、section/category `count` を各 -1 | **必須** |
| `index.js` | `searchData[]` からエントリを削除 | **必須** |
| HTMLファイル | `git rm category/filename.html` で削除 | **必須** |
| 概念マップ `svc-*.json` | `html_resources[]` から参照を削除 → インデックス再生成 | 参照がある場合のみ |
| `data.js` updateHistory | 削除リソースに関連するエントリを除去 | 任意（推奨） |

---

## ワークフロー（5ステップ）

### Step 1: 対象リソースを特定

```bash
# href（ファイルパス）で検索
grep -n "category/filename.html" data.js index.js

# タイトルで検索（部分一致）
grep -n "リソース名" data.js index.js
```

出力例:
```
data.js:42:  { title: 'Direct Connect ガイド', href: 'networking/aws-direct-connect-guide.html', priority: 'high' },
index.js:15:  { title: 'Direct Connect ガイド', category: 'ネットワーキング', file: 'networking/aws-direct-connect-guide.html' },
```

---

### Step 2: 参照チェック（削除前に必ず実行）

削除するファイルへの参照が他箇所に残っていないか確認する。

```bash
# ① 概念マップからの参照確認
grep -rl "filename.html" concepts/services/

# ② page-bottom-nav での参照確認（前後ページの「前のページ」「次のページ」リンク）
grep -rl "filename.html" networking/ security-governance/ compute-applications/ \
    storage-database/ content-delivery-dns/ development-deployment/ \
    migration/ analytics-bigdata/ organizational-complexity/ \
    continuous-improvement/ cost-control/ new-solutions/
```

**① に該当がある場合:** Step 4-B を実行する（概念マップ参照の削除）
**② に該当がある場合:** Step 5 でページ下部ナビを再生成する

---

### Step 3: data.js / index.js を編集

**3-A: data.js を編集（Edit ツール使用）**

削除するリソースのエントリを `resources[]` から1行削除する:
```javascript
// 削除前
{ title: 'リソース名', href: 'networking/filename.html', priority: 'high' },

// この行を削除する
```

同じファイル内で section と category の `count` を各 -1 する。

（任意）関連する `updateHistory` エントリも削除:
```javascript
// 例: 削除するリソースに関するエントリを除去
{ date: '2026-01-15', type: 'content', title: 'リソース名追加', ... }
```

**3-B: index.js を編集（Edit ツール使用）**

`searchData[]` から対象エントリを1行削除する:
```javascript
// 削除前
{ title: 'リソース名', category: 'ネットワーキング', file: 'networking/filename.html' },

// この行を削除する
```

---

### Step 4-B: 概念マップ参照を削除（Step 2 ① に該当した場合のみ）

```bash
# 参照しているファイルを編集し html_resources[] から該当エントリを削除
# 例: concepts/services/svc-vpc.json の html_resources 内の対象行を削除

# 編集後、インデックス再生成
python3 scripts/concept_management/generate_concept_index.py --validate
python3 scripts/concept_management/generate_concept_index.py
```

---

### Step 5: HTMLファイルを削除

```bash
# git 管理下のファイルを削除（git add -u 相当）
git rm category/filename.html
```

**ページ下部ナビを再生成する（Step 2 ② に該当した場合）:**

`data.js` からすでに削除済みのため、スクリプトが正しい前後関係を自動計算する。

```bash
python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only
# 変更されたファイルを確認
git diff --name-only
# ステージング
git add -u
```

---

### Step 6: カウント同期・整合性確認

```bash
# カウントを自動補正（section/category の count が data.js と一致するか）
python3 scripts/html_management/update_counts.py

# data.js と index.js の整合性を検証（CI必須チェック）
python3 scripts/ci/check_data_integrity.py
```

`check_data_integrity.py` がエラーを出した場合は内容に従い data.js / index.js を修正する。

---

### Step 7: コミット＆デプロイ

```bash
git add data.js index.js
git commit -m "remove(category): リソース名 — 削除理由"
git push origin gh-pages
```

---

## コミットメッセージ規則

```
remove(networking): aws-direct-connect-guide — 内容が古いため削除
remove(compute-applications): ec2-guide — 別リソースに統合済み
remove(security-governance): old-iam-guide — 最新版に置き換えで不要
```

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| リソースがまだナビに表示される | `data.js` 削除忘れ or `count` 未更新 | `check_data_integrity.py` で差分確認 |
| 検索にまだヒットする | `index.js` の削除忘れ | `searchData` から該当行を削除 |
| 前後ページのナビが壊れる | `page-bottom-nav` が旧ファイルを参照している | `add_prev_next_nav.py --bottom-nav-only` を再実行 |
| 概念マップにリンクが残る | `html_resources` 削除忘れ | 該当 `svc-*.json` を編集後、インデックス再生成 |
| `git rm` でエラー | ファイルが未コミット状態 | `git status` 確認後、`rm` + `git add -u` で対処 |
| `check_data_integrity.py` でカウントエラー | count の手動修正ミス | `update_counts.py` を再実行して自動補正 |

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| [delete_workflow.md](references/delete_workflow.md) | 詳細手順・複数ファイル一括削除・チェックリスト |
