# delete スキル — 例

## 例: `networking/old-vpc-guide` を削除する

前提: ユーザーから削除の確認を取っている。

```bash
# 1. 対象と参照を確認
ls src/pages/*/old-vpc-guide.astro
grep -rln 'networking/old-vpc-guide.html' src concepts --exclude=resources.ts
grep -rn "Page: '[^']*old-vpc-guide.html'" src/pages
```

`old-vpc-guide.astro` の前後ナビが次のようになっていたとする。

```js
prevPage: 'vpc-basics.html',
nextPage: 'vpc-endpoints.html',
```

2. つなぎ直す
   - `src/pages/networking/vpc-basics.astro` の `nextPage` を `'vpc-endpoints.html'` にする
   - `src/pages/networking/vpc-endpoints.astro` の `prevPage` を `'vpc-basics.html'` にする
3. registry・要約・カテゴリ説明・目次・概念マップから `networking/old-vpc-guide.html` を外す(概念マップを直したらインデックスを作り直す)
4. 削除と仕上げ

```bash
git switch -c remove/old-vpc-guide
git rm src/pages/networking/old-vpc-guide.astro css/pages/old-vpc-guide.css
node scripts/generate-data.mjs
npm run build
python3 scripts/ci/validate_html_w3c.py --pr-mode --base-dir dist   # 前後のページを書き換えたため
grep -rn 'old-vpc-guide.html' src concepts --exclude=resources.ts     # 何も出なければよい
git add -u src css/pages concepts public/data.js public/index.js
git commit -m "remove(networking): 旧 VPC ガイドを削除 — vpc-basics に統合済み"
```

デプロイ(`/deploy` または PR のマージ)は、ユーザーに頼まれたときだけ行う。

## 複数ページをまとめて削除する

前後ナビは、連続したページを消すときに間違えやすい。消すページをすべて決めてから、残るページどうしを直接つなぎ直す。仕上げは最後に 1 回だけ行う。
