---
name: replace
description: |
  既存の学習 HTML リソースを、replace_html/ に置いた新しい版で置き換えるスキル。
  以下の場面で使用:
  (1) 既存リソースの説明文・図・表を更新したい
  (2) 既存ページの HTML 構造やスタイルを直したい
  (3) 既存ページの W3C エラーを解消した版がある
  (4) 複数の既存ページをまとめて置き換えたい
  ※ 新しいページの追加は resource スキル(→ ship の Step 1b)、削除は delete スキルを使う。
---

# replace — 既存リソースの置き換え

置き換えではページの URL は変わらないので、`src/data/resource-registry.json` のエントリはそのまま使う。変えるのは `.astro` の本文・目次と、ページ固有の CSS だけ。

## 手順

### Step 1: 置き換え先のページを特定する

`replace_html/<name>.html` は、既存ページと同じファイル名で置く。対応する `.astro` を探す。

```bash
ls src/pages/*/<name>.astro
```

見つからなければ新規ページなので、`resource` スキルの新規追加の手順に切り替える。

### Step 2: `.astro` を作り直す

ship スキルの Step 1b(i〜iii, v)と同じ方法で変換し、既存の `.astro` を上書きする。

- **作り直すもの**: `rawContent`(`<body>` の中身、`<script>` は除く)、`tocItems`(`<h2>` / `<h3>` から)
- **既存の値をそのまま残すもの**: `title`(内容に合わせて変える場合を除く)、`category`、`pageCss`、`prevPage` / `nextPage`、`pageNum` / `pageTotal`。前後ナビやページ番号は、ほかのページとの並びで決まっているため
- `tocItems` は、既存ファイルと同じ書き方(`level: 'h2'` など)にそろえる

### Step 3: CSS を置き換える

新しい版の `<style>` を `css/pages/<name>.css` に上書きする。ダークモードのメディアクエリも含めて、そのまま移す。

### Step 4: 履歴を残す(任意)

内容が大きく変わったときは、`src/data/update-history.json` の先頭に `"type": "content"` で更新内容を足す。誤字の修正などでは不要。

### Step 5: 仕上げ

`resource` スキルの「仕上げ」を行う(generate-data → build → `--base-dir dist` 付きの W3C 検証 → 作業ブランチに commit → デプロイはユーザーに頼まれたときだけ)。

処理し終えたら `replace_html/` の元ファイルは消してよい(git 管理外のステージング置き場のため)。

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| 目次が古いまま | `tocItems` を作り直していない | 新しい `<h2>` / `<h3>` の `id` と文言から作り直す |
| 目次のリンクが効かない | 見出しに `id` が無い、または `tocItems` の `id` と一致しない | 見出しに `id` を付け、`tocItems` と合わせる |
| 前後ナビが消えた | `prevPage` / `nextPage` を上書きした | 置き換え前の値に戻す(`git diff` で確認できる) |
| ビルドが `{` `}` で落ちる | 本文を `rawContent` に入れていない、またはエスケープ漏れ | ship の Step 1b-v のエスケープ規則に従う |

→ 詳しい例: [replace_workflow.md](references/replace_workflow.md)
