# Data Model: CSSレイヤー設計ドキュメント

**Feature**: `002-css-conflict-refactor`
**Date**: 2026-02-23

---

## CSSエンティティ定義

このプロジェクトの「エンティティ」はCSSレイヤーと命名エンティティです。

---

## Layer エンティティ

### Layer 0: base（リセット層）

**ファイル**: `css/page-base.css`
**責務**: ブラウザのデフォルトスタイルをリセットし、HTML/scroll のベース設定を行う
**許可されるセレクタ**: `*`, `html`, `:root`（変数は Layer 1 へ）
**禁止**:
- アプリケーション固有のスタイル（背景色、グラデーション等）
- `body` の `background` プロパティ（背景はページ固有か layout で定義）
- フォント指定（`body { font-family }` は Layer 2 layout.css で）

**フィールド（定義すべき内容）**:
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
```

---

### Layer 1: tokens（デザイントークン層）

**ファイル**: `css/variables.css`
**責務**: 全 CSS カスタムプロパティの単一の真実のソース
**許可されるセレクタ**: `:root` のみ
**禁止**:
- スタイルルール（セレクタに対するプロパティ定義）
- `@media` クエリ内での変数上書き（ブレークポイントは変数で定義済み）

**現状**: ✅ 適切に実装済み（変更不要）

---

### Layer 2: layout（レイアウト・ユーティリティ層）

**ファイル**: `css/layout.css`
**責務**: `body` の基本設定、コンテナシステム、グリッド/Flex ユーティリティ、スペーシング/タイポグラフィユーティリティ
**許可されるセレクタ**: `body`（1回のみ）、ユーティリティクラス（`.container`, `.grid-*`, `.flex-*` 等）
**禁止**:
- コンポーネント固有スタイル（`.btn`, `.card` 等の外観定義）
- `body` 以外のタグセレクタ（`a`, `h2` 等）

---

### Layer 3: responsive（レスポンシブ調整層）

**ファイル**: `css/responsive.css`
**責務**: `@media` クエリ内での layout/共通コンポーネントの調整のみ
**許可されるセレクタ**: Layer 2-4 で定義済みのクラスに限定（`@media` 内）
**禁止**:
- `!important`（Phase 1 後には不要）
- 新規コンポーネントスタイルの定義

---

### Layer 4: shared-components（共有コンポーネント層）

**ファイル**: `css/common.css`
**責務**: 全ページで共有されるUIコンポーネントのスタイル定義
**許可されるセレクタ**: コンポーネント固有クラス（`.FixedNav__*`, `.Breadcrumb__*` 等）、
            アクセシビリティ目的の `a:focus`, `button:focus` (疑似クラスは許可)
**禁止**:
- グローバルタグセレクタ（`h1`, `h2`, `body`, `a`）— **単独**使用
  - 子孫結合子の場合は可: `.SomeComponent h2 { }` は可
  - タグ単独: `h2 { }` は禁止
- 汎用単語クラス名（`.section`, `.header`, `.card` 等） — 名前空間が必要

---

### Layer 5: named-components（固有コンポーネント層）

**ファイル**: `css/components/sidebar-toc.css`, `bookmark.css`, `exam-guide.css`, 等
**責務**: 各コンポーネントの内部スタイルのみ
**許可されるセレクタ**: コンポーネント内の子孫セレクタ（`.sidebar-toc .item` 等）
**禁止**:
- `!important`
- 他コンポーネントのクラスへの参照
- グローバルタグセレクタ

---

### Layer 6: page-overrides（ページ固有スタイル層）

**ファイル**: `css/pages/*.css`（195 ファイル）
**責務**: 各ページ固有のレイアウト・カラースキーム・コンポーネントのカスタマイズ
**許可されるセレクタ**: ページ固有クラス（できれば `.PageName__*` 形式）
**禁止**:
- `!important`（Phase 2 で除去済み）
- グローバルタグセレクタ（`h2 {}` 等）
  - ページスコープ限定なら可: `.my-page h2 {}` は可

---

## 命名エンティティ（クラス命名規則）

### BEM命名規則（新規クラス用）

```
.BlockName__element--modifier
```

**Block**: 独立したコンポーネント名（PascalCase）
**Element**: `__` で区切られたコンポーネントの部品（camelCase）
**Modifier**: `--` で区切られた状態・バリエーション（kebab-case）

**例**:
```css
.FixedNav {}              /* Block */
.FixedNav__container {}   /* Element */
.FixedNav__link {}        /* Element */
.FixedNav__link--active {} /* Modifier */
```

### 既存クラスの移行方針

**即時移行が必要（Phase 2）**:
- `h2` → `.section-title`（common.css の global tag rule を削除）

**Phase 4 以降に段階移行（既存 HTML との整合性確認が必要）**:
- `.card` → `.ContentCard`
- `.section` → `.ContentSection`
- `.header` → `.PageHeader`
- `.btn` → `.ActionBtn`

**変更しない（影響が大きすぎる）**:
- `css/pages/` 内の既存クラス名

---

## 状態遷移: !important 件数

```
現状: 47件 (!important)
    ↓ Phase 1 (page-base.css body 削除)
〜35件 (responsive.css の body 上書き不要化で -8件)
    ↓ Phase 2 (h2 ルール削除)
〜5件 (transit-gateway 等の h2 border-bottom 打ち消しが不要化)
    ↓ Phase 2 残り対応
0件 (目標)
```

---

## バリデーションルール

| ルール | チェック方法 | 違反時の対応 |
|-------|------------|------------|
| `page-base.css` 以外で `body { background }` 禁止 | `check_css_quality.py` | 該当プロパティを削除し Layer 2 か 6 に移動 |
| Layer 1-4 でのグローバルタグセレクタ禁止 | `check_css_quality.py` | 親セレクタを追加してスコープ化 |
| 全 CSS で `!important` 禁止 | `check_css_quality.py` | 詳細度を上げるか親クラスを追加 |
| 全 CSS で ID セレクタ禁止 | `check_css_quality.py` | クラスセレクタに変更 |
| 4段以上ネスト警告 | `check_css_quality.py` | セレクタを分解・フラット化 |
