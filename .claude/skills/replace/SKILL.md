---
name: replace
description: |
  既存のAWS学習HTMLリソースをreplace_html/ディレクトリの新バージョンで置換するスキル。
  以下の場面で使用:
  (1) 既存HTMLリソースのコンテンツ（説明文・図・表）を更新したい
  (2) 既存ファイルのHTML構造・スタイルを修正したい
  (3) 既存ファイルのW3Cエラーを解消したい
  (4) 複数の既存ファイルを一括置換したい
  ※ 新規ファイルを追加する場合は integrate スキルを使用すること。
---

# AWS SAP リソース置換スキル

## integrate との使い分け

| 操作 | 使うスキル |
|------|-----------|
| 新しいHTMLリソースを追加 | `/skill integrate` |
| 既存HTMLリソースの内容を更新 | `/skill replace` ← このスキル |

**最大の違い：** 置換は `data.js` / `index.js` / `updateHistory` の更新が**不要**。
ファイルパスが変わらないため、ナビ・検索・履歴タイムラインに影響しない。

---

## ワークフロー（3ステップ）

```bash
# Step 1: replace_html/ に更新ファイルを配置（元ファイルと同じファイル名）
# 例: networking/aws-vpc-guide.html を更新する場合
#     → replace_html/aws-vpc-guide.html に配置

# Step 2: 統合スクリプト実行（ブレッドクラム・TOC再生成・W3C検証・git stageまで自動）
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/

# Step 3: コミット＆デプロイ
git commit -m "fix(category): リソース名 — 更新内容の概要" && git push origin gh-pages
```

> **ドライランで事前確認:**
> ```bash
> python3 scripts/html_management/integrate_resource_complete.py --source replace_html/ --dry-run
> ```

---

## スクリプトが自動処理する内容

| ステップ | 処理内容 |
|----------|---------|
| 1 | ファイルをカテゴリディレクトリへ移動（既存ファイルを上書き） |
| 2 | ブレッドクラムナビゲーションを更新 |
| 3 | サイドバーTOCを再生成（`<h2>` / `<h3>` タグから自動生成） |
| 4 | 「リソース集に戻る」ボタンを更新 |
| 5 | ページ下部ナビゲーションを更新 |
| 6 | **W3C HTML検証**（失敗するとgit stageせず中断） |
| 7 | `git add` で自動ステージング |

---

## W3C検証エラー時

```bash
# エラー内容を確認
python3 scripts/ci/validate_html_w3c.py --files category/filename.html

# HTMLを修正後、再実行
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/

# 緊急時のみ: 検証をスキップ（原則禁止）
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/ --skip-validation
```

---

## ファイル配置ルール

```
replace_html/
└── aws-your-resource.html   ← ファイル名は置換先と完全一致させる

# スクリプト実行後は replace_html/ が空になる（処理済みファイルはカテゴリディレクトリへ移動）
```

**⚠️ ファイル名が一致しない場合、スクリプトは新規ファイルとして別パスに配置してしまう。**
配置前に必ず元ファイルのファイル名を確認すること。

---

## TOCが再生成されない場合

`add_sidebar_toc.py` は `<h2>` / `<h3>` タグが2個以上あるファイルのみTOCを生成する。

```html
<!-- ✅ TOC生成される -->
<h2 class="section-title">セクション名</h2>

<!-- ❌ TOCスキップされる（エラーは出ない） -->
<div class="section-title">セクション名</div>
```

ステップ3で `⚠️【要対応】` が表示された場合は `<div>` → `<h2>` に変換して再実行。

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| スクリプトがファイルを見つけない | replace_html/ にファイルがない | ファイル名とディレクトリを確認 |
| カテゴリ誤認識で別ディレクトリに移動した | ファイル内のキーワードが少ない | 手動で正しいカテゴリへ移動後、スクリプト再実行 |
| W3C検証エラーで中断 | HTML構文エラー | エラーメッセージに従い修正後、再実行 |
| TOCが消えた | `<h2>` が2個未満 | セクション見出しを `<h2>` に変換して再実行 |
| git stageされていない | W3C検証失敗 | 検証を通過させてから再実行 |
| デプロイ後も反映されない | push 忘れ | `git push origin gh-pages` を実行 |

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| [replace_workflow.md](references/replace_workflow.md) | 詳細手順・複数ファイル一括置換・チェックリスト |
