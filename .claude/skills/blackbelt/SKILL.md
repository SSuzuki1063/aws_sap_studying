---
name: blackbelt
description: |
  AWS Black Belt Online Seminar PDF資料を学習リソースとして登録するスキル。
  以下の場面で使用:
  (1) BlackBelt/ ディレクトリに追加した PDF をナビ・検索に載せたい
  (2) BlackBelt/ 内で未登録の PDF を一括登録したい
  (3) BlackBelt PDF のタイトル・カテゴリを整理したい
  ※ BlackBelt PDF は HTML変換・W3C検証・TOC生成は不要。データ登録のみ。
  ※ 通常のHTMLリソース追加は integrate スキルを使用すること。
---

# AWS Black Belt PDF 登録スキル

## integrate との使い分け

| ファイル種別 | 使うスキル |
|------------|-----------|
| 新しい HTML 学習ガイド | `/skill integrate` |
| Black Belt PDF | `/skill blackbelt` ← このスキル |
| 既存リソースの更新 | `/skill replace` |

**最大の違い:** Black Belt PDF は HTML 変換・W3C 検証・TOC 生成が不要。
`data.js` と `index.js` へのデータ登録だけで完了する。

---

## 前提条件

- PDF ファイルが **`BlackBelt/` ディレクトリに存在する**こと
- まだ `data.js` の `resources[]` に登録されていないこと

---

## 未登録 PDF の確認

```bash
# BlackBelt/ にある PDF 一覧
ls BlackBelt/*.pdf

# data.js に登録済みの BlackBelt PDF 一覧
grep "BlackBelt/" data.js

# 差分（未登録ファイルを特定）
diff <(ls BlackBelt/*.pdf | xargs -I{} basename {}) \
     <(grep "BlackBelt/" data.js | grep -oP "BlackBelt/\K[^'\"]+")
```

---

## 登録ワークフロー（3ステップ）

### Step 1: タイトル・カテゴリ・セクションを決定

**タイトルフォーマット:** `【Black Belt】{サービス名} ({YYYY年M月})`

ファイル名から日付・サービス名を読み取る:

| ファイル名パターン | 日付抽出 | 例 |
|----------------|---------|-----|
| `YYYYMMDD_...` | 先頭8桁 → `YYYY年M月` | `20201021_...` → `2020年10月` |
| `YYYYMM_...` | 先頭6桁 → `YYYY年M月` | `202110_...` → `2021年10月` |
| `BlackBeltYYYYMM_...` | `BlackBelt` 直後6桁 | `BlackBelt202106_...` → `2021年6月` |
| `..._YYYY_..._MMDD_...` | `_YYYY_` と末尾 `_MMDD` | `_2025_..._0122_` → `2025年1月` |
| 日付なし | 日付を省略 | `(日付なし)` → 括弧ごと省略 |

カテゴリ・セクションは → **[references/blackbelt_workflow.md](references/blackbelt_workflow.md)** の対応表を参照。

---

### Step 2: data.js を編集

**2-A: 対象セクションの `resources[]` にエントリを追加**

```javascript
// 既存エントリの後に追加する例
{ title: '【Black Belt】AWS VPC (2020年10月)', href: 'BlackBelt/20201021_AWS-BlackBelt-VPC.pdf', priority: 'high' },
```

- `priority: 'high'` 推奨（Black Belt は一次資料として最高品質）
- セクションの `count` を +1
- カテゴリの `count` を +1

**2-B: updateHistory に追加（先頭に追記）**

```javascript
{
  date: 'YYYY-MM-DD',
  type: 'content',
  title: '【Black Belt】{サービス名} PDF資料を追加',
  description: '{サービス名}のBlack Belt資料（{YYYY年M月}版）をナレッジベースに追加。',
  categories: ['networking'],  // 対象カテゴリID
  tags: ['Black Belt', 'PDF']
},
```

---

### Step 3: index.js を編集

`searchData[]` にエントリを追加:

```javascript
{ title: '【Black Belt】AWS VPC (2020年10月)', category: 'ネットワーキング', file: 'BlackBelt/20201021_AWS-BlackBelt-VPC.pdf' },
```

`category` には日本語カテゴリ名を使用（下表参照）:

| カテゴリ ID | searchData の category |
|-----------|----------------------|
| `networking` | `'ネットワーキング'` |
| `security-governance` | `'セキュリティ・ガバナンス'` |
| `compute-applications` | `'コンピュート・アプリケーション'` |
| `content-delivery-dns` | `'コンテンツ配信・DNS'` |
| `development-deployment` | `'開発・デプロイメント'` |
| `storage-database` | `'ストレージ・データベース'` |
| `migration` | `'移行・転送'` |
| `analytics-operations` | `'分析・運用・クイズ'` |

---

### Step 4: カウント同期・整合性確認

```bash
python3 scripts/html_management/update_counts.py
python3 scripts/ci/check_data_integrity.py
```

---

### Step 5: コミット＆デプロイ

```bash
git add BlackBelt/filename.pdf data.js index.js
git commit -m "feat(blackbelt): 【Black Belt】{サービス名} ({年月}) を追加"
git push origin gh-pages
```

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| PDFがナビに表示されない | `data.js` の登録忘れ or count未更新 | `check_data_integrity.py` で確認 |
| 検索にヒットしない | `index.js` の登録忘れ | `searchData[]` にエントリを追加 |
| PDF が 404 になる | `BlackBelt/` にファイルが存在しない | `ls BlackBelt/*.pdf` で確認 |
| カウントが合わない | 手動修正ミス | `update_counts.py` で自動補正 |
| PDF が開かない | ファイルが破損 / パーミッション問題 | `file BlackBelt/xxx.pdf` で確認 |

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| [references/blackbelt_workflow.md](references/blackbelt_workflow.md) | カテゴリ・セクション対応表・複数PDF一括登録手順 |
