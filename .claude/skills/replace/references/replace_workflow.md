# replace スキル — 例

## 例: `networking/aws-direct-connect-guide` を更新する

```bash
# 1. 新しい版を置く(既存と同じファイル名)
cp ~/Downloads/aws-direct-connect-guide.html replace_html/

# 2. 置き換え先を確かめる
ls src/pages/*/aws-direct-connect-guide.astro
# → src/pages/networking/aws-direct-connect-guide.astro
```

3. `src/pages/networking/aws-direct-connect-guide.astro` を開き、次だけを差し替える。
   - `tocItems`: 新しい版の `<h2>` / `<h3>` から作り直す
   - `rawContent`: 新しい版の `<body>` の中身(`<script>` は除く)。`` ` `` → `` \` ``、`\` → `\\`、`${` → `\${` にエスケープする
   - `title` / `category` / `pageCss` / `prevPage` / `nextPage` / `pageNum` / `pageTotal` は変えない
4. 新しい版の `<style>` の中身で `css/pages/aws-direct-connect-guide.css` を上書きする
5. 仕上げ

```bash
node scripts/generate-data.mjs
npm run build
python3 scripts/ci/validate_html_w3c.py --pr-mode --base-dir dist
git switch -c content/update-direct-connect-guide
git add src/pages/networking/aws-direct-connect-guide.astro css/pages/aws-direct-connect-guide.css public/data.js public/index.js src/data/resources.ts
git commit -m "fix(networking): Direct Connect ガイド — 料金表を更新"
rm replace_html/aws-direct-connect-guide.html
```

デプロイ(`/deploy` または PR のマージ)は、ユーザーに頼まれたときだけ行う。

## 複数ページをまとめて置き換える

ページごとに Step 1〜4 を繰り返し、仕上げ(generate-data・build・W3C 検証・commit)は最後に 1 回だけ行う。W3C 検証の `--pr-mode` は、変更したページだけをまとめて検証する。
