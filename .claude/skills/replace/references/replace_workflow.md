# リソース置換 詳細ワークフロー

## 事前チェックリスト

置換前に以下を確認する:

- [ ] 置換対象ファイルの**正確なファイル名**を確認（例: `aws-vpc-routing-guide.html`）
- [ ] 置換対象ファイルが存在するカテゴリを確認（`networking/`, `security-governance/` など）
- [ ] 更新版HTMLが `<!DOCTYPE html>` / `<html lang="ja">` で始まっているか確認
- [ ] SVG図がある場合は `role="img"` と `aria-label` があるか確認
- [ ] `replace_html/` ディレクトリが存在しているか確認（なければ `mkdir replace_html/`）

---

## Step 1: ファイルを replace_html/ に配置

```bash
# 例: networking/aws-vpc-routing-guide.html を置換する場合
cp /path/to/updated-file.html replace_html/aws-vpc-routing-guide.html

# または直接編集して保存
```

**ファイル名は必ず置換先と完全一致させる。**

```
replace_html/
└── aws-vpc-routing-guide.html   ✅ 元ファイルと同名
└── aws-vpc-routing-guide-v2.html ❌ 違う名前 → 別ファイルとして新規追加されてしまう
```

---

## Step 2: ドライランで確認（推奨）

```bash
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/ --dry-run
```

確認ポイント:
- 正しいカテゴリディレクトリへ移動されるか
- TOC生成がスキップされていないか（`⚠️【要対応】` が出ていないか）

---

## Step 3: 本実行

```bash
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/
```

実行後の出力例:
```
✅ ブレッドクラム追加: networking/aws-vpc-routing-guide.html
✅ サイドバーTOC生成: networking/aws-vpc-routing-guide.html
✅ W3C検証: OK
✅ git add: networking/aws-vpc-routing-guide.html
```

---

## Step 4: ローカル確認（推奨）

```bash
python3 server.py  # → http://localhost:8080/
```

ブラウザで対象ページを開き、以下を確認:
- [ ] コンテンツが正しく更新されているか
- [ ] サイドバーTOCが正しく生成されているか
- [ ] ブレッドクラムナビが正しいか
- [ ] モバイル表示で崩れがないか

---

## Step 5: コミット＆デプロイ

```bash
# git stage は Step 3 で自動実行済み。コミットのみ。
git commit -m "fix(category): リソース名 — 更新内容の概要"
git push origin gh-pages
```

コミットメッセージの例:
```
fix(networking): aws-vpc-routing-guide — NAT Gateway フロー図を更新
fix(security-governance): aws-iam-policy-guide — 誤記修正・例文追加
style(compute-applications): aws-lambda-guide — コードサンプルの整形
```

---

## 複数ファイルの一括置換

```bash
# replace_html/ に複数ファイルを配置してから一括実行
ls replace_html/   # 置換対象を確認
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/ --dry-run
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/

# まとめてコミット（既にgit stageされている）
git commit -m "fix: 複数リソースを更新 — xxx, yyy, zzz"
git push origin gh-pages
```

---

## 置換後チェックリスト

- [ ] `replace_html/` が空になっているか（処理済みファイルはカテゴリへ移動）
- [ ] `git status` でステージ状態を確認
- [ ] `python3 scripts/ci/post_integration_check.py` で統合後検証（任意）
- [ ] デプロイ後1〜2分でサイトに反映されているか確認

---

## integrate との差分まとめ

| 項目 | replace | integrate（新規） |
|------|---------|-----------------|
| `data.js` 更新 | **不要** | 必須 |
| `index.js` 更新 | **不要** | 必須 |
| `updateHistory` 追加 | **不要** | 必須 |
| カウント同期 (`update_counts.py`) | **不要** | 必須 |
| スクリプト実行 | `--source replace_html/` | デフォルト（`--source new_html/`） |
| W3C検証 | 自動実行 | 自動実行 |
| git stage | 自動実行 | 自動実行 |
