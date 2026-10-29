# blackbelt スキル — 例

## 例: Transit Gateway の PDF を登録する

```bash
# 1. PDF を置く
cp ~/Downloads/AWS-Black-Belt_2026_Transit-Gateway_0301_v1.pdf BlackBelt/
```

2. `src/data/resource-registry.json` に足す

```json
"BlackBelt/AWS-Black-Belt_2026_Transit-Gateway_0301_v1.pdf": {
  "displayCategory": "networking",
  "section": "Transit Gateway & ゲートウェイ",
  "priority": "high",
  "exam_domains": [1, 2],
  "difficulty": "advanced",
  "estimated_minutes": 40
}
```

3. データを作り、タイトルを整える

```bash
node scripts/generate-data.mjs
grep -n -B1 "href: 'BlackBelt/AWS-Black-Belt_2026_Transit-Gateway_0301_v1.pdf'" public/data.js
# → title: 'AWS-Black-Belt 2026 Transit-Gateway 0301 v1',
```

`public/data.js` のその `title` を `【Black Belt】AWS Transit Gateway (2026年3月)` に書き換え、もう一度実行する。

```bash
node scripts/generate-data.mjs
grep -c '【Black Belt】AWS Transit Gateway (2026年3月)' public/data.js public/index.js   # 両方 1 以上ならよい
```

4. 仕上げ

```bash
npm run build
git switch -c content/blackbelt-transit-gateway
git add BlackBelt/AWS-Black-Belt_2026_Transit-Gateway_0301_v1.pdf src/data/resource-registry.json public/data.js public/index.js src/data/resources.ts
git commit -m "feat(networking): BlackBelt PDF 追加 — AWS Transit Gateway (2026年3月)"
```

デプロイ(`/deploy` または PR のマージ)は、ユーザーに頼まれたときだけ行う。

## まとめて登録する

すべての PDF の registry エントリを足してから generate-data を 1 回実行し、タイトルをまとめて書き換えて、もう 1 回実行する。
