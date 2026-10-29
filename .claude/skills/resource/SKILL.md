---
name: resource
description: |
  学習リソース(HTML ページと BlackBelt PDF)の追加・更新・削除の入口になるスキル。
  依頼内容とステージングディレクトリを見て、正しい手順に振り分ける。
  以下の場面で使用:
  (1) 新しい HTML リソースを追加したい(new_html/ にファイルがある)
  (2) 既存リソースの内容を更新したい(replace_html/ にファイルがある)
  (3) リソースをサイトから削除したい
  (4) BlackBelt PDF を登録したい
  (5) 何をすればよいか分からない、または複数の操作をまとめて行いたい
  ※ 追加・更新からデプロイまで一気に進めるときは /ship を使う。
---

# resource — 学習リソース管理の入口

このサイトは Astro 5 の静的サイト。ページは `src/pages/<category>/<name>.astro`、ページ固有の CSS は `css/pages/<name>.css`、一覧・検索・統計のデータは `src/data/resource-registry.json` から `node scripts/generate-data.mjs` で生成する。`public/data.js` / `public/index.js` / `src/data/resources.ts` は生成物なので手で編集しない(次の生成で上書きされるため)。

## 振り分け

| やりたいこと | 手順 |
|---|---|
| 新しい HTML を追加(`new_html/` に置いた) | `ship` スキルの Step 1b(HTML → Astro 変換と registry 登録)→ 下の「仕上げ」 |
| 既存 HTML の内容を更新(`replace_html/` に置いた) | `replace` スキル |
| リソースを削除 | `delete` スキル(実行前に必ずユーザーに確認) |
| BlackBelt PDF を登録 | `blackbelt` スキル |
| 追加・更新からデプロイまで一気に進める | `/ship`(検証の自動修正ループ・commit・デプロイまで行う) |

依頼から判断できないときは、次を確認してから振り分ける。

```bash
ls new_html/ replace_html/        # ステージングにファイルがあるか
git status --short src/ css/pages/ # 作業途中の変更がないか
```

どれにも当てはまらなければ、「追加・更新・削除のどれですか」とユーザーに聞く。

## 新規追加の手順

`.claude/skills/ship/SKILL.md` の **Step 1b** に従って変換する。要点は次のとおり(詳細とカテゴリ表は ship 側が正)。

1. `<style>` を `css/pages/<name>.css` に切り出す
2. `<body>` の中身(`<script>` を除く)を `rawContent` にし、`<Fragment set:html={rawContent} />` で埋め込む。Astro が `{}` を式として解釈しないようにするため
3. `<h2>` / `<h3>` から `tocItems` を作る(目次は見出しから作られる)
4. カテゴリとセクションを ship のカテゴリ表で決め、`src/pages/<category>/<name>.astro` を作る
5. `src/data/resource-registry.json` にエントリを追加し、`src/data/update-history.json` の先頭に履歴を足す

そのあと「仕上げ」へ進む。

## 仕上げ(追加・更新・削除・PDF 登録で共通)

1. `node scripts/generate-data.mjs` — 一覧・検索・統計のデータを作り直す。`orphaned?` の警告が出たら、registry と `.astro` の対応がずれている
2. `npm run build` — ビルドが通れば、データとページの整合性も確認できる
3. `python3 scripts/ci/validate_html_w3c.py --pr-mode --base-dir dist` — ページを変えたときだけ。CI と同じく、ビルド後の `dist/` を検証する。エラーはすべて直す
4. 作業ブランチを切って commit する(例: `feat: 新規リソース追加 — <タイトル>`)。生成物の `public/data.js` / `public/index.js` / `src/data/resources.ts` も一緒に commit する
5. デプロイはユーザーに頼まれたときだけ行う(`/deploy`、または PR を作って master にマージ)。master へのマージでサイトが公開されるため

`gh-pages` ブランチは CI がビルド結果を置く場所なので、手で commit や push をしない。

## 複数の操作をまとめて行うとき

次の順で処理し、「仕上げ」は最後に 1 回だけ行う。

1. 削除(参照を先に外しておくと、追加・更新で前後ナビを付け直しやすい)
2. 更新(`replace_html/`)
3. 追加(`new_html/`)と PDF 登録

→ 判断に迷うケースとトラブルシューティング: [resource_workflow.md](references/resource_workflow.md)
