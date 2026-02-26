# リソース削除 詳細ワークフロー

## 事前チェックリスト

削除前に以下を必ず確認する:

- [ ] 削除対象ファイルの**正確な href パス**を確認（例: `networking/aws-direct-connect-guide.html`）
- [ ] `data.js` で対象エントリが存在することを確認
- [ ] `index.js` で対象エントリが存在することを確認
- [ ] 概念マップ（`concepts/services/svc-*.json`）に参照がないか確認
- [ ] page-bottom-nav に参照がないか確認（前後ページへの影響）
- [ ] **ユーザーへ最終確認** — 削除は `git push` 後に取り消せない

---

## Step 1: 対象リソースの完全特定

```bash
# href パスで data.js / index.js の行番号を特定
grep -n "networking/aws-direct-connect-guide.html" data.js index.js
```

出力例:
```
data.js:23:          { title: 'Direct Connect ガイド', href: 'networking/aws-direct-connect-guide.html', priority: 'high' },
index.js:8:  { title: 'Direct Connect ガイド', category: 'ネットワーキング', file: 'networking/aws-direct-connect-guide.html' },
```

---

## Step 2: 全参照チェック

```bash
# 概念マップからの参照
grep -rl "aws-direct-connect-guide.html" concepts/services/

# page-bottom-nav からの参照（前後ページに影響）
grep -rl "aws-direct-connect-guide.html" \
    networking/ security-governance/ compute-applications/ storage-database/ \
    content-delivery-dns/ development-deployment/ migration/ analytics-bigdata/ \
    organizational-complexity/ continuous-improvement/ cost-control/ new-solutions/
```

---

## Step 3: data.js を編集

### 3-1: resources[] からエントリを削除

Read ツールで対象行を確認し、Edit ツールで該当行を削除する。

```javascript
// 削除前（data.js の resources[] 内）
          { title: 'Direct Connect ガイド', href: 'networking/aws-direct-connect-guide.html', priority: 'high' },
// ↑ この1行を削除する（前後のカンマにも注意）
```

### 3-2: section count を -1 する

対象 section（例: `'Direct Connect & ハイブリッドネットワーク'`）の `count:` を探して -1 する。

### 3-3: category count を -1 する

対象カテゴリ（例: `id: 'networking'`）の `count:` を -1 する。

### 3-4: updateHistory のクリーンアップ（任意・推奨）

```javascript
// updateHistory[] から削除リソースに関連するエントリを除去
// 例:
{ date: '2026-01-20', type: 'content', title: 'Direct Connect ガイド追加', ... }
// ↑ この行を削除する
```

---

## Step 4: index.js を編集

```javascript
// 削除前（index.js の searchData[] 内）
  { title: 'Direct Connect ガイド', category: 'ネットワーキング', file: 'networking/aws-direct-connect-guide.html' },
// ↑ この1行を削除する
```

---

## Step 5: 概念マップ参照を削除（Step 2 で参照があった場合のみ）

```bash
# 参照しているファイルを Read で確認
# 例: concepts/services/svc-vpc.json

# Edit で html_resources[] の対象エントリを削除
# 削除前:
#   { "title": "Direct Connect ガイド", "href": "networking/aws-direct-connect-guide.html" },
# ↑ この行を削除する

# インデックス再生成
python3 scripts/concept_management/generate_concept_index.py --validate
python3 scripts/concept_management/generate_concept_index.py
```

---

## Step 6: HTMLファイルを削除

```bash
# git 管理下から削除
git rm networking/aws-direct-connect-guide.html

# 削除確認
git status
```

---

## Step 7: page-bottom-nav を再生成（Step 2 で参照があった場合のみ）

`data.js` から削除済みなので、スクリプトが自動的に正しい前後関係を計算する。

```bash
# 下部ナビのみ再生成（全カテゴリ対象）
python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only

# 変更されたファイルを確認
git diff --name-only

# 変更ファイルをステージング
git add -u
```

---

## Step 8: カウント同期・整合性確認

```bash
# カウントの自動補正
python3 scripts/html_management/update_counts.py

# 整合性チェック（CI必須）
python3 scripts/ci/check_data_integrity.py
```

`check_data_integrity.py` がエラーを出した場合は内容に従い修正する。

---

## Step 9: コミット＆デプロイ

```bash
# ステータス確認
git status

# コミット（data.js, index.js を含める）
git add data.js index.js
git commit -m "remove(networking): aws-direct-connect-guide — 内容が古いため削除"
git push origin gh-pages
```

---

## 複数ファイルの一括削除

```bash
# 削除するファイルをリストアップ
TARGETS=(
    "networking/old-resource-1.html"
    "compute-applications/old-resource-2.html"
)

# 各ファイルについて Step 1-6 を実行した後、一括で以下を実行
python3 scripts/html_management/update_counts.py
python3 scripts/ci/check_data_integrity.py

# 必要であれば page-bottom-nav を再生成
python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only

# まとめてコミット
git add data.js index.js
git commit -m "remove: 複数リソースを削除 — old-resource-1, old-resource-2（整理のため）"
git push origin gh-pages
```

---

## 削除後チェックリスト

- [ ] `data.js` の resources[] に対象エントリが残っていないか
- [ ] `data.js` の section/category count が正しいか（`update_counts.py` で確認）
- [ ] `index.js` の searchData[] に対象エントリが残っていないか
- [ ] `check_data_integrity.py` が exit 0 で完了するか
- [ ] 概念マップで参照が残っていないか（Step 2 で確認済みなら不要）
- [ ] デプロイ後1〜2分でサイトのナビと検索から消えているか
- [ ] 前後ページのページ下部ナビが正しいリンクを指しているか

---

## integrate / replace との差分まとめ

| 項目 | delete | replace | integrate（新規） |
|------|--------|---------|-----------------|
| `data.js` 更新 | **削除** | 不要 | 追加 |
| `index.js` 更新 | **削除** | 不要 | 追加 |
| `updateHistory` | **削除**（任意） | 不要 | 追加 |
| カウント同期 | **必須**（-1） | 不要 | 必須（+1） |
| HTMLファイル操作 | **`git rm`** | 上書き | 新規作成 |
| page-bottom-nav | **再生成**（影響ページあり） | スクリプトで自動 | スクリプトで自動 |
| 概念マップ | **削除**（参照があれば） | 手動追加 | 手動追加 |
| W3C検証 | 不要 | 自動実行 | 自動実行 |
