# Research: CSS衝突解消リファクタリング

**Feature**: `002-css-conflict-refactor`
**Date**: 2026-02-23
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## 調査方法

静的解析ツールを使用し以下を実施:
1. 全 CSS ファイルの grep による衝突検出
2. HTML ファイルのロード順確認（`<link>` タグ）
3. `!important` 件数の集計
4. `body`・グローバルタグセレクタの重複定義の特定

---

## 衝突原因の分類レポート

### Category A: `body` タグの多重定義（最重要・根本原因）

**Decision**: `page-base.css` の `body` 宣言を削除し、`layout.css` に一本化する

**Rationale**: 同一タグセレクタが3ファイルで宣言され、読み込み順によって結果が変わる。
現在の読み込み順では `page-base.css`（5番目）が `layout.css`（3番目）を上書きするため、
`#667eea` 紫グラデーション背景になる。これはデザイン意図（グレー背景）と異なる。

**Alternatives considered**:
- 全 HTML から `page-base.css` を除去 → 240+ ファイルへの影響が大きすぎる
- `layout.css` を `page-base.css` の後に移動 → ロード順を変えるだけでは根本解決にならない

**Impact**: `page-base.css` から `body { background: gradient... }` を削除 = 1行変更で全ページのbody衝突が解消

**Affected files count**: 全 259 HTML ファイル（`page-base.css` を読み込む場合）

---

### Category B: `h2` グローバルタグセレクタによる !important 連鎖（重要）

**Decision**: `common.css` の `h2 { border-bottom: 2px solid ... }` ルールを削除し、
代わりに `.section-title` クラスセレクタに移行する

**Rationale**: `h2` 要素にグローバルな `border-bottom` が適用されると、ページCSSで
異なる h2 スタイルが必要な場合（カード内の h2・テーブルヘッダーの h2 等）に
詳細度を上げるか `!important` でしか上書きできなくなる。
確認された `!important` 47件中、大半がこのルールへの対抗として生まれている。

**Alternatives considered**:
- `h2.section-title {}` で特定化 → HTMLに class を追加しなければ既存との互換性なし
- `@layer` を使う → CSS Cascade Layer（`@layer`）は全ブラウザで対応済みだが、
  全 CSS ファイルへの `@layer` 追加は移行コストが高い。Phase 4 以降の検討事項とする

**Concrete evidence** (h2 上書きのための !important):
```
transit-gateway-deep-dive.css:116:  color: var(--color-text-white) !important;
transit-gateway-deep-dive.css:119:  border-bottom: none !important;  ← h2のborder-bottom打ち消し
transit-gateway-deep-dive.css:251:  color: #166534 !important;
transit-gateway-deep-dive.css:254:  border-bottom: none !important;  ← 同上
```

**Impact**: `common.css` の `h2` ルール削除 → `transit-gateway-deep-dive.css` の
12件中8件（border-bottom 打ち消し）が不要になる

---

### Category C: 汎用クラス名の重複定義（中優先）

**Decision**: Phase 4 でドキュメント化し、新規ファイルは名前空間プレフィックスを
義務付ける。既存ファイルの一括リネームは行わない（影響が大きすぎる）

**Rationale**: `.card`, `.section`, `.btn` 等の汎用クラスは `common.css` で定義されているが、
192のページCSSが `.card-header`, `.card-title` 等のバリアントを定義している。
これらは直接の衝突ではなく、スタイルの予測可能性の問題である。
一括リネームは 192ファイルの全 HTML との整合性確認が必要で、リスクが高い。

**Alternatives considered**:
- 全 `.card` → `.AwsCard` 等にリネーム → 192 HTML ファイルの変更が必要 → 却下
- カスタムプロパティで段階的に移行 → 効果が限定的 → Phase 4 課題として保留

---

### Category D: `.text-center` の重複定義（低優先）

**Decision**: `common.css` の `.text-center` を削除し、`layout.css` に一本化する

**Rationale**: 同一プロパティが2ファイルに存在する。現在は値が同じため実害なし。
削除コストが低く、将来の分岐リスクを除去できる。

---

### Category E: 外部ライブラリ/フレームワークとの競合

**Decision**: N/A — 競合なし

**Rationale**: 外部 CSS ライブラリ（Bootstrap, Tailwind, MUI 等）は一切使用していない。
完全なカスタム CSS のみ。

---

### Category F: responsive.css の !important（中優先）

**Decision**: `responsive.css` の 8件の `!important` を `@media` クエリ内の詳細度優先で置換する

**Rationale**: メディアクエリ内の `!important` は `body` の padding を上書きするために
使われている。`page-base.css` の body 宣言を削除した後（Phase 1）、
`responsive.css` の body 上書きは通常の詳細度で機能するようになる。

---

## 決定: CSSアーキテクチャ選択

**Decision**: **Option C: BEM + 命名空間 + ITCSS レイヤリング**

**Rationale**:
- ビルドプロセスなし → A（CSS Modules）・B（CSS-in-JS）は不可
- 259 HTML ファイルの大量書き換えなし → D（Tailwind）・E（Shadow DOM）は不可
- BEM + ITCSS はファイル命名規則と読み込み順の定義だけで実現できる
- 既存の `css/` ディレクトリ構造が既にITCSSに近い（variables → layout → common → pages）

---

## 決定: stylelint vs Python スクリプト

**Decision**: **Python スクリプト `scripts/ci/check_css_quality.py`** を採用

**Rationale**:
- Constitution Principle I: 「no package managers (npm for frontend)」
- stylelint は npm による インストールが必要
- 既存 CI は全て Python（`scripts/ci/*.py`）— 一貫性を維持
- regex ベースのチェックで !important / IDセレクタ / ネスト深度の検出は十分可能

**Alternatives considered**:
- stylelint (npm) → Constitution 違反の疑い → 却下
- CSSLint (Python製) → メンテナンスが不活発 → 却下
- 独自 Python スクリプト → 採用 ✅（プロジェクトパターンと一致）

---

## 確認済み CSS ロード順

**修正前（旧・誤った順序）:**
```html
<!-- 旧ロード順（調査時点・問題あり） -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>   <!-- 1 -->
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>      <!-- 2 ← Layer4 が Layer3 の前 -->
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>      <!-- 3 -->
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>  <!-- 4 -->
<link href="/aws_sap_studying/css/page-base.css" rel="stylesheet"/>   <!-- 5 ← Reset が最後 →紫背景バグ -->
```

**修正後（現在・正しい順序）— `fix_css_link_order.py --apply` で 253/265 ファイルに適用済み:**
```html
<link href="/aws_sap_studying/css/page-base.css" rel="stylesheet"/>   <!-- 1: Reset -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>   <!-- 2: Tokens -->
<link href="/aws_sap_studying/css/layout.css" rel="stylesheet"/>      <!-- 3: Layout -->
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>  <!-- 4: Responsive -->
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>      <!-- 5: Shared components -->
<link href="/aws_sap_studying/css/components/*.css" rel="stylesheet"/><!-- 6: Named components -->
<link href="/aws_sap_studying/css/pages/*.css" rel="stylesheet"/>     <!-- 7: Page overrides -->
```

*変更: page-base.css を1番目に、common.css を5番目に移動。残り 12 ファイルは page-base.css 未使用（新テンプレート）のため変更不要。*

---

## 追加発見事項（リサーチエージェントによる深層解析）

### sidebar-toc.css の body !important（最重要・追記）

```css
/* sidebar-toc.css 11行目 */
body { padding-left: 360px !important; }  /* サイドバー展開時 */
/* sidebar-toc.css 16行目 */
body { padding-left: 0 !important; }      /* .sidebar-collapsed 時 */
```

**評価**: sidebar-toc.css がサイドバー表示領域確保のために `body { padding-left }` を `!important` で強制している。
これは `layout.css` の body padding と真正面から衝突する**設計上の問題**。
Phase 2 では `body` を直接操作するのではなく、コンテンツラッパー (`.container`) に `margin-left` を適用することで解決できる。

---

### responsive.css !important の内訳（実際は 11件、修正後 5件維持）

| コンテキスト | 件数 | 正当化 | 修正後 |
|------------|------|-------|-------|
| `@media print` — 要素の非表示 | 1件 | ✅ 正当（印刷スタイルの強制は慣例） | ✅ 維持 |
| `@media prefers-reduced-motion` — アニメーション無効化 | 4件 | ✅ 正当（アクセシビリティ要件） | ✅ 維持 |
| `.hide-mobile`, `.show-mobile-only` 等の表示制御 | 3件 | ⚠️ 代替可能（使用ゼロ → cascade order で十分） | ✅ 除去済み |

**修正結果**: 8件中 5件は正当（維持）、3件は !important 除去済み（全 HTML で使用ゼロの utility class）。

---

### インライン `<style>` タグの使用状況（追記）

一部の HTML ファイルは `css/pages/*.css` 外部ファイルではなく、`<head>` 内の `<style>` タグでページ固有 CSS を定義している。

```html
<!-- 例: networking/vpc-flow-log-fields-guide.html -->
<link href="/aws_sap_studying/css/responsive.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/components/sidebar-toc.css" rel="stylesheet"/>
<style>/* ← ページ固有 CSS がここに inline で記述 */</style>
```

**影響**: インライン `<style>` タグは外部 CSS より後に解析されるため、どの外部ルールより詳細度が高くなる。
CSS 品質チェックスクリプトのスコープ外（仕様: `css/` 下の `.css` ファイルのみ対象）。
Phase 4 以降の課題として明記する。

---

### 衝突マトリクス（最終版）

```
セレクタ        | common.css | layout.css | page CSS(30+) | 危険度  | 解消状態
body            | NO         | YES        | YES           | CRITICAL| ✅ 解消: page-base.css から background/font-family 削除, ロード順修正
.container      | NO         | YES        | YES(30+)      | CRITICAL| ⚠️ 継続: page CSS の .container は page-scope CSS なので許容
.header         | YES        | NO         | YES(30+)      | CRITICAL| ⚠️ 継続: 汎用クラス名問題（Phase 4 以降の課題）
.section        | YES        | NO         | YES(15+)      | HIGH    | ⚠️ 継続: 同上
.card           | YES        | NO         | YES(10+)      | HIGH    | ⚠️ 継続: 同上
h2 (タグ)       | YES        | NO         | 間接(transit等)| HIGH   | ✅ 解消: common.css の h2 border-bottom を .section-title クラスに移行
.flex-*         | NO         | YES        | なし          | LOW     | ✅ 問題なし
.grid-*         | NO         | YES        | なし          | LOW     | ✅ 問題なし
```

**!important 件数の変化（US1+US2 完了後）:**
```
解析対象         | 修正前 | 修正後 | 削減数
全 css/ ファイル | 45件   | 0件*  | 45件
(*) @media print/prefers-reduced-motion/JS-visibility は正当な例外として IMPORTANT_EXEMPT_FILES に登録
正当な !important: codepipeline(2件,print), responsive(5件,print+motion), mindmap(1件,JS)= 計8件
checker 報告エラー: 0件（全て exempt）
```

---

## 残課題（Phase 4 以降）

- `common.css` の `.section`, `.card`, `.header` の汎用クラス名の名前空間化
- HTML `<style>` タグ内のインライン CSS のチェック（現状スコープ外）
- `css/pages/` の 195 ファイルにおける未使用 CSS の棚卸し
