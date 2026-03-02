# resource スキル — 詳細ワークフロー

## 意図検出の詳細決定木

```
ユーザーの依頼を受けたら...

① ステージングディレクトリを確認
│
├── new_html/ にファイルあり？
│     └── YES → integrate ワークフローへ
│
├── replace_html/ にファイルあり？
│     └── YES → replace ワークフローへ
│
├── 削除対象のファイルパス/タイトルを明示？
│     └── YES → delete ワークフローへ（実行前に最終確認必須）
│
└── 上記いずれにも当てはまらない
      └── 以下の質問でユーザーの意図を確認:
          Q: HTMLファイルの「新規追加」「更新」「削除」のどれですか？
          → 回答に応じて適切なサブスキルへ誘導
```

---

## バッチ操作シーケンス図

### ケース A: 新規追加のみ（n ファイル）

```
new_html/
├── file-a.html
├── file-b.html
└── file-c.html
        ↓
python3 scripts/html_management/integrate_resource_complete.py
        ↓（W3C検証・git stage 自動）
data.js を n 件分更新（resources[] + updateHistory）
index.js を n 件分更新（searchData[]）
        ↓
update_counts.py  # 1回だけ
check_data_integrity.py  # 1回だけ
        ↓
git commit -m "feat: n件追加 — A, B, C"
git push origin gh-pages
```

### ケース B: 置換のみ（n ファイル）

```
replace_html/
├── file-x.html
└── file-y.html
        ↓
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/
        ↓（W3C検証・git stage 自動）
# data.js / index.js の更新は不要
        ↓
git commit -m "fix: n件更新 — X, Y"
git push origin gh-pages
```

### ケース C: 追加 + 削除 が混在

```
操作順序:
1. integrate/replace を先に処理する（スクリプト自動化で効率的）
2. delete を後から処理する（手動編集が必要なため）

Step 1: new_html/ / replace_html/ を処理
   python3 scripts/html_management/integrate_resource_complete.py [--source replace_html/]

Step 2: 削除対象の data.js / index.js エントリを削除
   → delete スキルの Step 3 を実行

Step 3: HTMLファイルを削除
   git rm category/filename.html

Step 4: ページ下部ナビの再生成（削除ファイルが前後ページに参照されている場合）
   python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only
   git add -u

Step 5: 一括で整合性チェック
   python3 scripts/html_management/update_counts.py
   python3 scripts/ci/check_data_integrity.py

Step 6: まとめてコミット
   git add data.js index.js
   git commit -m "feat/remove: 複数リソース処理 — 追加: A, B / 削除: X"
   git push origin gh-pages
```

---

## よくあるミスとトラブルシューティング

### ミス 1: integrate すべきところを replace した（またはその逆）

**症状:** リソースがナビに表示されない / 検索でヒットしない

**原因:** 新規ファイルなのに `--source replace_html/` を使い、`data.js` / `index.js` を更新しなかった

**対処:**
```bash
# data.js に resources[] エントリを手動追加
# index.js に searchData[] エントリを手動追加
python3 scripts/html_management/update_counts.py
python3 scripts/ci/check_data_integrity.py
```

---

### ミス 2: バッチ処理中に count が合わなくなった

**症状:** `check_data_integrity.py` でカウントエラー

**対処:**
```bash
# 自動補正（手動修正より確実）
python3 scripts/html_management/update_counts.py
python3 scripts/ci/check_data_integrity.py  # 再実行して exit 0 を確認
```

---

### ミス 3: 削除後に前後ページのナビが壊れた

**症状:** 削除したページの前後にあるページで「前のページ」「次のページ」リンクが 404

**対処:**
```bash
python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only
git diff --name-only  # 修正されたファイルを確認
git add -u
git commit -m "fix: page-bottom-nav を再生成 — 削除後の前後ナビ修正"
git push origin gh-pages
```

---

### ミス 4: W3C検証エラーでスクリプトが中断した

**症状:** `integrate_resource_complete.py` 実行時に `W3C validation FAILED` と表示されて中断

**対処:**
```bash
# エラー詳細を確認
python3 scripts/ci/validate_html_w3c.py --files category/filename.html

# HTMLを修正後、再実行
python3 scripts/html_management/integrate_resource_complete.py [--source replace_html/]

# 緊急時のみ（原則禁止）
python3 scripts/html_management/integrate_resource_complete.py --skip-validation
```

---

### ミス 5: push を忘れてデプロイされない

**症状:** commit したのにサイトが更新されない

**対処:**
```bash
git push origin gh-pages
```

コミットだけではデプロイされない。必ず push まで完了させること。

---

## 各サブスキルの責務範囲まとめ

| 責務 | integrate | replace | delete | resource |
|------|-----------|---------|--------|---------|
| W3C検証 | ✅ 自動 | ✅ 自動 | — | 委譲 |
| ブレッドクラム生成 | ✅ 自動 | ✅ 自動 | — | 委譲 |
| サイドバーTOC生成 | ✅ 自動 | ✅ 自動 | — | 委譲 |
| data.js 更新 | ✅ 必須 | ❌ 不要 | ✅ 必須 | 委譲 |
| index.js 更新 | ✅ 必須 | ❌ 不要 | ✅ 必須 | 委譲 |
| update_counts.py | ✅ | — | ✅ | 委譲 |
| check_data_integrity.py | ✅ | — | ✅ | 委譲 |
| 概念マップ参照削除 | — | — | 任意 | 委譲 |
| ページ下部ナビ再生成 | — | — | 条件付き | 委譲 |
| 意図検出・ルーティング | — | — | — | **担当** |
| バッチ操作のシーケンス管理 | — | — | — | **担当** |
