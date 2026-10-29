---
name: delete
description: |
  学習 HTML リソースをサイトから削除するスキル。
  以下の場面で使用:
  (1) 内容が古くなったリソースを削除したい
  (2) 誤って追加したリソースを取り消したい
  (3) カテゴリの整理でリソースを統廃合したい
  ※ 内容の更新は replace スキル、新規追加は resource スキル、BlackBelt PDF の登録解除は blackbelt スキルを使う。
---

# delete — リソースの削除

## 最初に: ユーザーの確認を取る

削除するとページの URL が消え、外部からのリンクやブックマークが切れる。作業を始める前に、削除するページ(パスとタイトル)をユーザーに示して、確認を取る。git で戻せるのは commit 前、または revert できる範囲だけ。

## 削除で触るところ

| 場所 | 作業 | 必須 |
|---|---|---|
| `src/pages/<category>/<name>.astro` | `git rm` | 必須 |
| `css/pages/<name>.css` | `git rm` | 必須 |
| `src/data/resource-registry.json` | エントリを削除 | 必須(残すと `orphaned?` の警告になる) |
| 前後のページの `prevPage` / `nextPage` | 削除するページを飛ばして、前と次をつなぎ直す | 該当すれば必須(残すとリンク切れ) |
| `src/data/resource-summaries.json` | エントリを削除 | 該当すれば必須 |
| `src/data/category-descriptions.json` | `recommended_first` などから外す | 該当すれば必須 |
| `src/pages/table-of-contents.astro` などの手書きリンク | リンクを外す | 該当すれば必須 |
| `concepts/**/*.json` の `html_resources` | エントリを削除し、インデックスを作り直す | 該当すれば必須 |
| `src/data/update-history.json` | 削除の履歴を足す | 任意 |

## 手順

### Step 1: 対象を特定する

```bash
ls src/pages/*/<name>.astro
grep -n '"<category>/<name>.html"' src/data/resource-registry.json
```

### Step 2: 参照を洗い出す(削除の前に必ず)

```bash
# パス付きの参照(registry・要約・カテゴリ説明・目次・概念マップなど)
grep -rln '<category>/<name>.html' src concepts --exclude=resources.ts
# 前後ナビ(同じディレクトリ内は 'name.html'、別ディレクトリは '../dir/name.html' で書かれている)
grep -rn "Page: '[^']*<name>.html'" src/pages
```

結果をユーザーに見せ、削除と一緒に直す範囲を確認する。

### Step 3: 参照を外す

- **前後ナビ**: 削除するページの `prevPage` / `nextPage` の値を見て、前のページの `nextPage` を次のページに、次のページの `prevPage` を前のページにつなぎ直す。削除するページが端なら、隣の値を `undefined` にする
- **registry・要約・カテゴリ説明**: 該当するキーやエントリを JSON から削除する(JSON として壊れていないか、最後のカンマに注意)
- **手書きのリンク**(`table-of-contents.astro` など): `<li>` ごと外す
- **概念マップ**: `html_resources` から該当エントリを削除し、インデックスを作り直す

```bash
python3 scripts/concept_management/generate_concept_index.py --validate
python3 scripts/concept_management/generate_concept_index.py
```

### Step 4: ファイルを削除する

```bash
git rm src/pages/<category>/<name>.astro css/pages/<name>.css
```

### Step 5: 仕上げ

`resource` スキルの「仕上げ」を行う(generate-data → build → 作業ブランチに commit → デプロイはユーザーに頼まれたときだけ)。W3C 検証は、前後ナビなどでほかのページを書き換えたときに行う。

最後に、消したパスが残っていないことを確かめる。

```bash
grep -rn '<name>.html' src concepts --exclude=resources.ts
```

commit メッセージの例: `remove(networking): <タイトル> を削除 — <理由>`

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| `orphaned?` の警告が出る | registry にエントリが残っている | registry から削除する |
| 前後のページで 404 | `prevPage` / `nextPage` のつなぎ直し漏れ | Step 2 の grep をやり直して直す |
| 概念マップから 404 のリンクが出る | `html_resources` の削除漏れ | 削除してインデックスを作り直す |
| ビルドで JSON の読み込みエラー | JSON の編集でカンマが崩れた | `python3 -m json.tool <file>` で壊れた行を探す |

→ 例: [delete_workflow.md](references/delete_workflow.md)
