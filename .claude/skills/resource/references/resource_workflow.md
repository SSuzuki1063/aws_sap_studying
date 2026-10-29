# resource スキル — 判断に迷うケースとトラブルシューティング

## 判断に迷うケース

| 状況 | 判断 |
|---|---|
| 同じページを作り直したい(URL は変えない) | `replace`。registry のエントリはそのまま使える |
| ファイル名(URL)を変えたい | `delete` で古いページを外し、新しい名前で追加する。古い URL へのリンク(前後ナビ・目次・概念マップ)も付け直す |
| カテゴリやセクションだけ変えたい | `src/data/resource-registry.json` の `displayCategory` / `section` を直して「仕上げ」を行う。ページを動かす必要はない |
| W3C エラーを直した版がある | `replace` |
| BlackBelt PDF を追加したい | `blackbelt` |
| HTML の中身を少しだけ直したい | `src/pages/<category>/<name>.astro` の `rawContent` を直接直してよい。そのあと「仕上げ」の 2〜3 を行う |

## よくある失敗

### 一覧や検索に出てこない
- **原因**: registry にエントリが無い、または `node scripts/generate-data.mjs` を実行していない
- **対処**: registry のキーが `<category>/<name>.html`(拡張子は `.astro` ではなく `.html`)になっているか確かめ、generate-data を実行し直す

### `Registry entry "..." has no matching .astro file — orphaned?` と出る
- **原因**: registry のキーと `src/pages/` のファイルの場所が合っていない(削除し忘れ、またはディレクトリ違い)
- **対処**: キーのパスと `.astro` の置き場所を合わせる。削除したページなら registry からも消す

### ビルドが `{` や `}` で落ちる
- **原因**: 本文を `rawContent` に入れずに、Astro のテンプレートへ直接書いた
- **対処**: ship の Step 1b-v のとおり、本文は `rawContent` のテンプレートリテラルに入れ、`` ` `` `\` `${` をエスケープする

### W3C 検証が何も検証せずに通る
- **原因**: `--base-dir dist` を付けずに実行した(付けないと、変更した `.astro` がビルド後のページに対応付けられない)
- **対処**: `npm run build` のあとに `--pr-mode --base-dir dist` で実行する

### サイトに反映されない
- **原因**: master にまだ入っていない(デプロイは master への push / マージで CI が行う)
- **対処**: ユーザーに確認したうえで `/deploy` を使うか、PR をマージする。`gh-pages` には直接 push しない
