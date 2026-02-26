---
name: resource
description: |
  学習HTMLリソースの統合管理スキル（integrate / replace / delete のオーケストレーター）。
  以下の場面で使用:
  (1) 新規HTMLリソースを追加したい（→ integrate）
  (2) 既存リソースのコンテンツを更新したい（→ replace）
  (3) リソースをサイトから削除したい（→ delete）
  (4) 何をすべきか不明な時（→ 自動診断）
  (5) 複数ファイルを一括処理したい（→ バッチ操作）
  ※ BlackBelt PDFの登録は blackbelt スキルを使用すること。
  ※ このスキルはHTMLリソース専用。PDFの登録・クイズ追加・概念マップ管理には対応しない。
---

# resource — HTMLリソース統合管理オーケストレーター

## サブスキルの使い分け早見表

| やりたいこと | 使うスキル |
|------------|-----------|
| 新しいHTMLリソースを追加 | `integrate` |
| 既存HTMLリソースの内容を更新 | `replace` |
| HTMLリソースをサイトから削除 | `delete` |
| 複数ファイルを一括処理 | 下記「バッチ操作」セクション参照 |
| BlackBelt PDF を登録 | `blackbelt`（このスキルの対象外） |

---

## Step 1: 自動診断（意図が不明な場合）

ユーザーが「何をすべきか」を明示していない場合、以下を実行して状況を把握する。

```bash
# ステージングディレクトリを確認
ls new_html/        # ← ファイルがある → integrate
ls replace_html/    # ← ファイルがある → replace

# data.js との整合性ベースラインを確認
python3 scripts/ci/check_data_integrity.py
```

### 診断フロー

```
new_html/ にファイルあり？
  → YES: integrate スキルのワークフローに従う
replace_html/ にファイルあり？
  → YES: replace スキルのワークフローに従う
削除したいリソースが特定されている？
  → YES: delete スキルのワークフローに従う
上記いずれにも当てはまらない？
  → ユーザーに意図を確認して適切なサブスキルへ誘導する
```

---

## Step 2: サブスキルへの委譲

各操作の詳細手順はサブスキルに委譲する。このスキルはフローを複製しない。

### 新規追加 → integrate

`.claude/skills/integrate/SKILL.md` の「Workflow 1: HTML リソース追加」に従う。

要点:
1. `new_html/` にファイルを配置
2. `python3 scripts/html_management/integrate_resource_complete.py` を実行
3. `data.js` の `resources[]` + `updateHistory` を更新
4. `index.js` の `searchData[]` を更新
5. `update_counts.py` → `check_data_integrity.py` を実行
6. コミット＆プッシュ

### コンテンツ更新 → replace

`.claude/skills/replace/SKILL.md` のワークフローに従う。

要点:
1. `replace_html/` に更新ファイルを配置（**元ファイルと同じファイル名**）
2. `python3 scripts/html_management/integrate_resource_complete.py --source replace_html/` を実行
3. `data.js` / `index.js` の更新は**不要**
4. コミット＆プッシュ

### 削除 → delete

`.claude/skills/delete/SKILL.md` のワークフローに従う。

⚠️ **削除は不可逆操作。実行前に必ずユーザーへ最終確認を行うこと。**

要点:
1. `data.js` の `resources[]` からエントリ削除、count を -1
2. `index.js` の `searchData[]` からエントリ削除
3. `git rm category/filename.html`
4. 概念マップ参照・ページ下部ナビを必要に応じて更新
5. `update_counts.py` → `check_data_integrity.py` を実行
6. コミット＆プッシュ

---

## バッチ操作（複数ファイルの一括処理）

integrate / replace / delete が混在するケースの処理順序:

```
1. 全ファイルのオペレーション種別を確定
   - new_html/     → integrate
   - replace_html/ → replace
   - 削除対象リスト → delete

2. 処理の実行順序
   a. integrate/replace: integrate_resource_complete.py を実行（W3C検証・git stage 自動化）
   b. delete: data.js / index.js 編集 → git rm → ページ下部ナビ再生成（必要時）

3. 一括で整合性チェック
   python3 scripts/html_management/update_counts.py
   python3 scripts/ci/check_data_integrity.py

4. まとめてコミット
   git commit -m "feat/fix/remove: 複数リソース処理 — 概要"
   git push origin gh-pages
```

→ 詳細なシーケンス図・トラブルシューティング: **[resource_workflow.md](references/resource_workflow.md)**

---

## 事後チェックリスト（全操作共通）

- [ ] `python3 scripts/ci/check_data_integrity.py` が exit 0 で完了
- [ ] `data.js` の section/category count が正しい（`update_counts.py` で自動補正可）
- [ ] サイトのナビ・検索で期待通りに表示される
- [ ] `git push origin gh-pages` が完了している（push しないとデプロイされない）

---

## よくある迷いケース

| 状況 | 判断 |
|------|------|
| 同じファイルを「削除して新規追加」したい | `replace` を使う（ファイルパスが変わらないなら） |
| ファイルパスを変更したい | `delete` + `integrate` の2ステップ |
| BlackBelt PDF を追加したい | `/skill blackbelt`（このスキルの対象外） |
| W3Cエラーを直した更新版がある | `replace`（内容更新と同じ扱い） |
| 複数カテゴリにまたがる一括追加 | バッチ操作を使う |

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| [resource_workflow.md](references/resource_workflow.md) | 意図検出の詳細決定木・バッチ操作シーケンス・トラブルシューティング |
| [integrate/SKILL.md](../integrate/SKILL.md) | 新規追加の詳細手順 |
| [replace/SKILL.md](../replace/SKILL.md) | 置換の詳細手順 |
| [delete/SKILL.md](../delete/SKILL.md) | 削除の詳細手順 |
