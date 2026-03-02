# CSS Quickstart: どこに何を書くか

**Feature**: `002-css-conflict-refactor`
**Date**: 2026-02-23

このガイドは、新規 CSS を追加する際に「どのファイルに書くか」を5分以内に判断できるようにするためのものです。

---

## フローチャート: 新規 CSS の置き場所

```
Q1. 全ページで共有するコンポーネントか？
    YES → Q2 へ
    NO  → css/pages/[ページ名].css に書く（Layer 6）

Q2. 既存の css/components/ に該当ファイルがあるか？
    YES → そのファイルに追記する（Layer 5）
    NO  → Q3 へ

Q3. レイアウト・スペーシング・Flex・Grid の汎用ユーティリティか？
    YES → css/layout.css に追記する（Layer 2）
    NO  → css/common.css に新コンポーネントとして追記する（Layer 4）

Q4. @media クエリ内での調整か？
    YES → css/responsive.css に追記する（Layer 3）

Q5. CSS 変数（カスタムプロパティ）の追加か？
    YES → css/variables.css の :root に追加する（Layer 1）
```

---

## クイックリファレンス

| やりたいこと | 書くファイル |
|------------|------------|
| 全ページの配色を変えたい | `css/variables.css` |
| 全ページの body 背景を変えたい | `css/layout.css` |
| ナビゲーションを修正したい | `css/common.css` |
| サイドバー TOC を修正したい | `css/components/sidebar-toc.css` |
| このページだけのスタイルを変えたい | `css/pages/[ページ名].css` |
| モバイル表示を調整したい | `css/responsive.css` |

---

## よくある間違い

### ❌ `h2 { border-bottom: none; }` をページ CSS に書く

```css
/* ❌ 禁止: グローバルタグセレクタ */
h2 { border-bottom: none; }

/* ✅ 正解: ページスコープで限定 */
.my-page h2 { border-bottom: none; }
```

### ❌ `!important` で無理やり上書きする

```css
/* ❌ 禁止: 根本解決になっていない */
.my-card h2 { color: white !important; }

/* ✅ 正解: 親クラスを追加して詳細度を上げる */
.my-page .my-card h2 { color: white; }
```

### ❌ 汎用クラス名を再定義する

```css
/* ❌ 禁止: .section は common.css で既に定義済み */
.section { padding: 10px; }

/* ✅ 正解: 名前空間付きで新規定義 */
.MyFeature__section { padding: 10px; }
```

---

## CSS ロード順（確認用）

HTML の `<head>` 内の `<link>` タグは以下の順序であること:

```html
<link href="/aws_sap_studying/css/page-base.css" rel="stylesheet"/>   <!-- 1: Reset -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>   <!-- 2: Tokens -->
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>      <!-- 3: Layout -->
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>  <!-- 4: Responsive -->
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>      <!-- 5: Shared -->
<!-- 使用するコンポーネントのみ: -->
<link href="/aws_sap_studying/css/components/sidebar-toc.css" rel="stylesheet"/>
<!-- ページ固有: -->
<link href="/aws_sap_studying/css/pages/[your-page].css" rel="stylesheet"/>
<!-- フッターナビ: -->
<link href="/aws_sap_studying/css/components/page-bottom-nav.css" rel="stylesheet"/>
```

---

## CI チェック

コミット前に以下を実行:

```bash
# CSS 品質チェック（!important / ID セレクタ / グローバルタグ / ネスト深度）
python3 scripts/ci/check_css_quality.py

# HTML バリデーション
python3 scripts/ci/validate_html_w3c.py --pr-mode

# データ整合性
python3 scripts/ci/check_data_integrity.py
```

エラーが出た場合は `specs/002-css-conflict-refactor/contracts/layer-contract.md` を参照。
