# CSS Layer Contract

**Feature**: `002-css-conflict-refactor`
**Version**: 1.0
**Date**: 2026-02-23

このドキュメントは各 CSS レイヤーの責務・許可事項・禁止事項を定義する。
新規 CSS を書く際は、まず「どのレイヤーか」を確認してから該当ファイルに追記する。

---

## レイヤー一覧と読み込み順

```
1. page-base.css    Layer 0: Reset（*リセット、html スクロール）
2. variables.css    Layer 1: Tokens（CSS 変数のみ）
3. layout.css       Layer 2: Layout（body・コンテナ・ユーティリティ）
4. responsive.css   Layer 3: Responsive（@media クエリによる調整）
5. common.css       Layer 4: Shared Components（名前空間付きコンポーネント）
6. components/*.css Layer 5: Named Components（個別コンポーネント）
7. pages/*.css      Layer 6: Page Overrides（ページ固有スタイル）
```

---

## Layer 0: Reset — `page-base.css`

### 責務
ブラウザデフォルトスタイルのリセット。全ページ共通のゼロ地点を確立する。

### 許可
- `*` ユニバーサルセレクタ（margin/padding/box-sizing リセット）
- `html` セレクタ（scroll-behavior 設定）

### 禁止
- `body` スタイル（フォント・背景は Layer 2 で定義）
- アプリケーション固有スタイル（グラデーション背景等）
- CSS 変数の定義（Layer 1 へ）
- `!important`

---

## Layer 1: Tokens — `variables.css`

### 責務
すべての CSS カスタムプロパティの単一の真実のソース。
このファイルを変更するだけで全体の色・サイズを変更できる状態を維持する。

### 許可
- `:root` セレクタ内の `--variable-name: value;` のみ

### 禁止
- スタイルルール（クラス・タグに対するプロパティ定義）
- `@media` 内での変数再定義
- `!important`

---

## Layer 2: Layout — `layout.css`

### 責務
`body` の基本設定（背景色・フォント・パディング）と全ページ共通のレイアウトユーティリティを提供する。

### 許可
- `body` セレクタ（**1度だけ**）
- コンテナ系クラス（`.container`, `.container-narrow`, `.container-fluid`）
- グリッド系クラス（`.grid`, `.grid-2`, `.grid-3`, `.grid-4`）
- Flex ユーティリティ（`.flex`, `.flex-center` 等）
- スペーシングユーティリティ（`.m-*`, `.p-*` 等）
- テキスト・表示・位置ユーティリティ

### 禁止
- `body` 以外のタグセレクタ（`h1`, `h2`, `a`, `button` 等の単独使用）
- コンポーネント固有の外観定義（`.btn` の色・見た目等）
- `!important`

---

## Layer 3: Responsive — `responsive.css`

### 責務
`@media` クエリ内で Layer 2-4 のクラスを調整する。
新規コンポーネントスタイルは定義しない。

### 許可
- `@media (max-width: ...)` 内でのクラス上書き
- Layer 2-4 で定義済みクラスの値変更

### 禁止
- `@media` 外でのスタイル定義
- `!important`（`@media` の詳細度で十分）
- 新規クラスの定義（既存クラスの調整のみ）

---

## Layer 4: Shared Components — `common.css`

### 責務
全ページで共有される UI コンポーネント（ナビゲーション・ブレッドクラム・ボタン・カード等）の定義。

### 許可
- **名前空間付きコンポーネントクラス**:
  - 例: `.FixedNav__container`, `.Breadcrumb__item`, `.ScrollTop`
  - 例: `.btn`, `.btn-primary`（既存の `.btn` は Phase 4 まで維持）
- アクセシビリティ目的の疑似クラス: `a:focus`, `button:focus`
- コンポーネント内の子孫セレクタ: `.fixed-nav-links a { }`（コンポーネント外の `a` には影響しない）

### 禁止
- **グローバルタグセレクタの単独使用**: `h1 {}`, `h2 {}`, `a {}` など
  - 例外: アクセシビリティ目的の疑似クラス（`a:focus {}` は可）
  - ✅ **実施済み (US2)**: `h2 { border-bottom: 2px solid ... }` を削除し `.section-title {}` クラスに移行
    - `<h2 class="section-title">` を使うページは視覚的に変化なし（104 ファイル対応済み）
    - ページ CSS で `h2` をスタイルする場合は `.page-wrapper h2 {}` のようにスコープ化すること
- 汎用単語クラス名（将来的に名前空間化する）:
  - ⚠️ 段階移行対象: `.section`, `.header`, `.card`（既存は残すが新規追加禁止）
- `!important`
- ID セレクタ（`#id`）

---

## Layer 5: Named Components — `css/components/*.css`

### 責務
各コンポーネント（SidebarTOC・Bookmark・ExamGuide 等）の内部スタイル定義。
コンポーネントの外側には影響を与えない。

### 許可
- コンポーネントルートクラス（`.sidebar-toc`）
- コンポーネント内の子孫セレクタ（`.sidebar-toc .item`）

### 禁止
- `!important`
- 他コンポーネントのクラスへの参照（`.bookmark` 内で `.sidebar-toc` を参照しない）
- グローバルタグセレクタ
- ID セレクタ

### 例外（事前承認済み）
- `sidebar-toc.css` の `body { padding-left: ... }`: サイドバー展開時にコンテンツ本体を右にオフセットするための
  アーキテクチャ要件。`responsive.css`（Layer 3）より後にロードされるため cascade が機能し、`!important` は不要。
  この例外は `check_css_quality.py` の `BODY_ALLOWED_FILES` に登録されている。

---

## Layer 6: Page Overrides — `css/pages/*.css`

### 責務
各ページ固有のレイアウト・色・コンポーネントカスタマイズ。

### 許可
- ページ固有クラス
- ページルートクラスを親とした子孫セレクタ（`.my-page h2 { }` のようなスコープ内タグセレクタは可）
- CSS カスタムプロパティの `@media` 内上書き

### 禁止
- `!important`（ページスコープで詳細度を上げることで解決できる）
- グローバルタグセレクタ（スコープなしの `h2 {}` 等）
- ID セレクタ
- `body` の再定義

---

## 違反時の対応手順

1. `scripts/ci/check_css_quality.py` が違反を検出したとき:
   1. 報告されたファイル・行番号を確認する
   2. このドキュメントの「禁止」セクションを参照する
   3. 移行先レイヤーを決める（迷ったら `quickstart.md` 参照）
   4. `!important` 違反 → 詳細度を上げるか親セレクタを追加して解決
   5. グローバルタグ違反 → 親クラスを追加してスコープ化
2. 「overrides」が本当に必要な場合（例外処理）:
   1. PRコメントに理由を書く
   2. `check_css_quality.py` の `ALLOWED_EXCEPTIONS` リストに追加する（追加には承認が必要）
