---
name: blackbelt
description: |
  AWS Black Belt Online Seminar の PDF を学習リソースとして登録するスキル。
  以下の場面で使用:
  (1) BlackBelt/ に追加した PDF を一覧・検索に載せたい
  (2) BlackBelt/ の中で未登録の PDF をまとめて登録したい
  (3) 登録済み PDF のタイトル・カテゴリ・セクションを直したい
  ※ PDF は HTML への変換・W3C 検証・目次の生成が要らない。registry への登録だけで済む。
  ※ HTML リソースの追加は resource スキルを使う。
---

# blackbelt — BlackBelt PDF の登録

PDF は `BlackBelt/` に置くと、ビルド時に `public/BlackBelt/` へコピーされて配信される。一覧と検索に載せるには、`src/data/resource-registry.json` に `BlackBelt/<file>.pdf` のエントリを足し、`node scripts/generate-data.mjs` を実行する。

## 未登録の PDF を探す

```bash
comm -23 \
  <(ls BlackBelt | grep '\.pdf$' | sed 's#^#BlackBelt/#' | sort) \
  <(grep -o '"BlackBelt/[^"]*\.pdf"' src/data/resource-registry.json | tr -d '"' | sort)
```

`*:Zone.Identifier` は Windows がダウンロード時に付ける情報ファイルで、gitignore 済み。登録の対象にしない。

## 登録の手順

### Step 1: カテゴリとセクションを決める

PDF の内容から、ship スキルの Step 1b-iv のカテゴリ表で `displayCategory` と `section` を決める。`section` は既存の名前を使う(新しい名前にすると、そのカテゴリに新しいセクションが増える)。既存の名前は次で確かめられる。

```bash
python3 -c "import json;d=json.load(open('src/data/resource-registry.json'));print(sorted({(v['displayCategory'],v['section']) for v in d.values()}))"
```

### Step 2: registry に足す

```json
"BlackBelt/<file>.pdf": {
  "displayCategory": "networking",
  "section": "Direct Connect & ハイブリッドネットワーク",
  "priority": "high",
  "exam_domains": [1, 2],
  "difficulty": "intermediate",
  "estimated_minutes": 30
}
```

`exam_domains` / `difficulty` / `estimated_minutes` は、既存の PDF のエントリに合わせて付ける(ほぼすべてのエントリに入っているため)。

### Step 3: データを作り、タイトルを整える

```bash
node scripts/generate-data.mjs
```

PDF のタイトルは registry には書かない。最初はファイル名から作られる(`_` が空白になる)。読みやすいタイトルにしたいときは、`public/data.js` の該当エントリの `title` を書き換えてから、もう一度 `node scripts/generate-data.mjs` を実行する。generate-data は既存の `public/data.js` のタイトルを読み直すので、書き換えた値が残り、検索データにも反映される。既存のタイトルは `【Black Belt】<サービス名> (<年>年<月>月)` の形にそろっている。

### Step 4: 仕上げ

`resource` スキルの「仕上げ」を行う(build → 作業ブランチに commit → デプロイはユーザーに頼まれたときだけ)。PDF だけの変更なら W3C 検証は要らない。

commit に含めるもの: `BlackBelt/<file>.pdf`、`src/data/resource-registry.json`、`public/data.js`、`public/index.js`、`src/data/resources.ts`

## 登録を外すとき

registry からエントリを削除して generate-data を実行し、PDF も配信しないなら `git rm BlackBelt/<file>.pdf` する。

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| 一覧に出てこない | registry のキーが `BlackBelt/` から始まっていない、または `.pdf` で終わっていない | キーを `BlackBelt/<file>.pdf` にする |
| リンクが 404 | `BlackBelt/` に PDF が無い、またはファイル名がキーと違う | ファイル名とキーを完全に一致させる(大文字・小文字も) |
| タイトルがファイル名のまま | `public/data.js` のタイトルを書き換えていない | Step 3 のとおり書き換えて generate-data をやり直す |
| 書き換えたタイトルが戻った | `public/data.js` を書き換える前の版に戻した | もう一度書き換え、`public/data.js` を commit する |

→ 例: [blackbelt_workflow.md](references/blackbelt_workflow.md)
