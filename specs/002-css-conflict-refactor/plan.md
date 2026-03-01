# Implementation Plan: CSS衝突解消リファクタリング

**Branch**: `002-css-conflict-refactor` | **Date**: 2026-02-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-css-conflict-refactor/spec.md`

---

## Summary

このプロジェクトは `body` タグの二重定義・`h1-h6` グローバルタグセレクタ起因の `!important` 連鎖（47件）・`page-base.css` の誤ロード順という3つの根本原因から生じるCSS衝突を、**ビルドツール不要のBEM + ITCSSレイヤリング戦略**で段階的に解消する。
移行は4フェーズのPR単位で行い、各フェーズでW3Cバリデーションと目視確認を実施する。CSS品質チェックはnomに依存しない `scripts/ci/check_css_quality.py` として既存のPython CIパターンに統合する。

---

## Technical Context

**Language/Version**: HTML5 / CSS3 (plain CSS, no preprocessors)
**Primary Dependencies**: なし（no build tools — 静的HTMLサイト）
**Storage**: N/A
**Testing**: Python 3 スクリプト（既存 `scripts/ci/*.py` パターンに準拠）
**Target Platform**: GitHub Pages (静的ファイルサーバー)
**Project Type**: 静的HTMLサイト（ビルドプロセス一切なし）
**Performance Goals**: CSS変更がページロード速度に影響しない（各ページのCSS総サイズは変わらない）
**Constraints**:
- ビルドプロセスなし（webpack/Vite/PostCSS 等 禁止）
- npm を frontend 依存として追加しない（stylelint の代わりに Python スクリプト）
- 全 259 HTMLファイルのW3Cバリデーション通過を維持
- 目視差分ゼロ（既存デザインを維持）
**Scale/Scope**: 207 CSS ファイル・259 HTML ファイル / 4フェーズ段階移行

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 評価 | 詳細 |
|------|------|------|
| **I. Static-First Architecture** | ⚠️ CONDITIONAL PASS | 当初 stylelint（npm）を想定したが、Constitution の「no npm for frontend」に抵触する可能性があるため **Python製 `check_css_quality.py`** に変更。npm は追加しない。CSSは既存の `css/` レイヤー構造を維持・改善する。 |
| **II. GitHub Pages Path Compliance** | ✅ PASS | CSS変更はすべて `/aws_sap_studying/` プレフィックスを保持。HTMLの `<link>` 順序変更のみ。 |
| **III. Data-View Separation** | ✅ PASS | `data.js` / `index.js` は変更しない。 |
| **IV. Accessibility & Standards** | ✅ PASS | `page-base.css` の紫グラデーション背景を除去してWCAGコントラスト改善。全変更でW3Cバリデーション維持。 |
| **V. Semantic HTML Structure** | ✅ PASS | HTMLの `<h2>/<h3>` タグは変更しない。CSSのセレクタ変更のみ。 |

**Gate Status**: ✅ PASS（stylelint → Python スクリプト に変更すれば制約なし）

### Complexity Violation Justification

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| 新規ファイル `scripts/ci/check_css_quality.py` | CSS品質を機械的に強制しないと再発する | 既存 `validate_html_w3c.py` パターンで十分; stylelintより軽量 |
| `page-base.css` の body 宣言削除 | 現状の purple 背景は WCAG 違反かつ layout.css と直接衝突 | 残すとどのページが purple になるか予測不能 |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-css-conflict-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output (衝突原因分類レポート)
├── data-model.md        # Phase 1 output (CSSレイヤー設計ドキュメント)
├── quickstart.md        # Phase 1 output (開発者向けクイックスタート)
├── contracts/           # Phase 1 output (CSS命名規則・禁止ルール)
│   ├── layer-contract.md    # 各レイヤーの責務と禁止事項
│   └── naming-contract.md   # BEMクラス名規則
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
css/
├── variables.css        # Layer 1: Tokens（変更なし — 既に正しい）
├── page-base.css        # Layer 0: Reset（body紫グラデーション削除）
├── layout.css           # Layer 2: Layout utilities（変更最小限）
├── responsive.css       # Layer 3: Responsive（!important 8件を解消）
├── common.css           # Layer 4: Shared components（h2タグ→スコープ化）
├── components/          # Layer 5: Named components（変更なし）
│   ├── sidebar-toc.css  # !important 4件を解消
│   └── ...
└── pages/               # Layer 6: Page-specific（変更なし）
    └── transit-gateway-deep-dive.css  # !important 12件を解消 (Phase 2)

scripts/
└── ci/
    ├── check_css_quality.py   # NEW: CSS品質チェック（Python）
    └── ... (既存スクリプト群)
```

**Structure Decision**: 既存の `css/` ディレクトリ構造を ITCSSレイヤーとして再定義する。新規ファイルは1つのみ（`check_css_quality.py`）。フォルダ構造の変更なし。

---

## Phase 0: Research Findings

*→ 詳細は `research.md` 参照*

### 確認済みの衝突原因（静的解析結果）

#### カテゴリ A: `body` タグの多重定義（最重要）

| ファイル | body の定義内容 | 問題 |
|---------|----------------|------|
| `layout.css` | `background-color: #F9FAFB`（ライトグレー）、`padding-top: 80px` | 通常使用の背景 |
| `page-base.css` | `background: linear-gradient(#667eea...)` (紫グラデーション)、`padding-top: 80px` | **後から読み込まれ上書き** |
| `responsive.css (@media)` | `padding-top: 70px`、`padding: 10px` | モバイル調整 |

読み込み順（実際の HTML 内 `<link>` 順）:
```
variables.css → common.css → layout.css → responsive.css → page-base.css → components/*.css → pages/*.css
```
→ `page-base.css` は5番目に読み込まれ、`layout.css` の `body` を上書きする。

**ページ-base.css の紫グラデーション背景は WCAG 違反の疑いがある** （`#667eea` 地に `#374151` 文字）。

#### カテゴリ B: `h2` グローバルタグセレクタによる `!important` 連鎖

`common.css` の `h2` に `border-bottom: 2px solid var(--color-aws-orange)` が適用される。
ページCSSで異なる `h2` スタイルが必要な場合、上書きするには詳細度を上げるか `!important` が必要。

**確認された !important 件数: 47件（8ファイル）**

| ファイル | !important 件数 | 主な原因 |
|---------|----------------|---------|
| `pages/transit-gateway-deep-dive.css` | 12件 | h2 の border-bottom 上書き |
| `responsive.css` | 8件 | body / container の上書き |
| `pages/stacksets_infographic.css` | 5件 | レイアウト上書き |
| `components/sidebar-toc.css` | 4件 | コンポーネント内部衝突 |
| `pages/iam-access-analyzer-guide.css` | 3件 | h2 上書き |
| `pages/aws-login-users-guide.css` | 3件 | h2 上書き |
| `pages/aws-dr-infographic.css` | 3件 | h2 上書き |
| その他 | 9件 | 各種 |

#### カテゴリ C: 汎用クラス名の重複定義

`common.css` に定義された汎用クラス（`.card`, `.section`, `.btn`, `.header`, `.tag` 等）が、
192のページCSSファイルで `.card-header`, `.card-title` 等のバリアントとして再定義される。
これらは親の `.card` スタイルを継承する場合と、意図せず継承する場合が混在。

#### カテゴリ D: `.text-center` の重複定義

- `common.css` 約444行: `.text-center { text-align: center; }`
- `layout.css` 約247行: `.text-center { text-align: center; }`

同一定義なので現在は実害なし。ただし将来的に片方が変更されると予期しない挙動になる。

#### カテゴリ E: ライブラリ/フレームワーク競合

**なし** — 外部CSSライブラリ（Bootstrap, Tailwind等）は使用していない。完全なカスタムCSSのみ。

---

## Phase 1: Design & Contracts

*→ 詳細は `data-model.md`, `contracts/` 参照*

### CSSアーキテクチャ決定: BEM + ITCSS (Option C 採用)

**選定理由の比較:**

| 候補 | 既存コード量 | 移行コスト | 衝突再発防止 | チーム運用 | 採用 |
|------|------------|-----------|------------|-----------|------|
| A. CSS Modules | 大量変更不要 | ビルド工程が必要 → 不可 | 高 | 複雑 | ❌ |
| B. CSS-in-JS | 全JSX化が必要 → 不可 | 極高 | 高 | 複雑 | ❌ |
| **C. BEM + ITCSS** | **最小限の変更** | **低〜中** | **高（命名規則）** | **シンプル** | **✅** |
| D. Tailwind | 全HTML書き換え | 極高 | 高 | 中 | ❌ |
| E. Shadow DOM | 全JS化が必要 | 極高 | 完全 | 複雑 | ❌ |

**BEM + ITCSS は静的HTMLサイトで唯一ビルドツールなしで実現できる衝突回避アーキテクチャ。**

### CSSレイヤリング戦略（ITCSS 5層）

```
Layer 0: base/reset      → page-base.css
Layer 1: tokens          → variables.css
Layer 2: layout          → layout.css, responsive.css
Layer 3: shared-components → common.css
Layer 4: named-components → css/components/*.css
Layer 5: page-overrides  → css/pages/*.css
```

**各レイヤーの責務と禁止事項（→ `contracts/layer-contract.md` で詳細化）:**

| レイヤー | ファイル | 許可 | 禁止 |
|---------|---------|------|------|
| base | `page-base.css` | `*` リセット、`html` スクロール設定 | アプリ固有スタイル（背景色・フォント等）、body の背景グラデーション |
| tokens | `variables.css` | `:root` CSS変数のみ | セレクタ、スタイルルール |
| layout | `layout.css`, `responsive.css` | `body` の基本設定、ユーティリティクラス | コンポーネント固有スタイル |
| shared-components | `common.css` | 名前空間付きコンポーネントクラス（`.FixedNav__*`等） | グローバルタグセレクタ（`h2` 等）、汎用単語クラス（`.section` 等） |
| named-components | `css/components/*.css` | コンポーネントスコープのスタイル | `!important`、他コンポーネントのクラス参照 |
| page-overrides | `css/pages/*.css` | ページ固有スタイル | `!important`、グローバルタグセレクタ |

### CSSロード順の正規化

**現状（問題あり）:**
```html
variables.css → common.css → layout.css → responsive.css → page-base.css → components → pages
```

**目標（正規化後）:**
```html
page-base.css → variables.css → layout.css → responsive.css → common.css → components → pages
```

変更は HTML テンプレートの `<link>` 順序のみ。全 259 HTMLファイルを Python スクリプトで一括更新。

### `h2` スコープ化戦略

`common.css` の `h2 { border-bottom: 2px solid var(--color-aws-orange); }` を削除し、
代わりに `.section-title` クラスに同スタイルを移行する。

```css
/* Before (問題のある h2 グローバルルール) */
h2 { border-bottom: 2px solid var(--color-aws-orange); }

/* After (スコープ化されたルール) */
.section-title { border-bottom: 2px solid var(--color-aws-orange); }
```

`add_sidebar_toc.py` が `<h2 class="section-title">` を認識しているため、この変更は
セマンティック上の問題がない（既存HTMLは `<h2 class="section-title">` を使用済み）。

### Python CSS品質チェックスクリプト設計

`scripts/ci/check_css_quality.py` が以下をチェック:

1. `!important` の使用（page-base / variables 以外で禁止）
2. IDセレクタ（`#id`）の使用（全ファイルで禁止）
3. 4段以上のセレクタネスト（警告）
4. Layer 1-4 でのグローバルタグセレクタ（h2, body 等）使用（禁止）
5. `page-base.css` 以外での `body` 宣言（禁止）

**なぜ stylelint でなく Python スクリプトか:**
- npm を追加しない（Constitution Principle I 遵守）
- 既存 `scripts/ci/*.py` パターンと一致（CI 設定変更なし）
- regex ベースで十分（ASTパーサー不要）
- 入力: `css/` 下の全 `.css` ファイル / 出力: ファイル名・行番号・違反内容

---

## Migration Phases (PR分割計画)

### Phase 1 — CSSロード順修正 + page-base.css 浄化

**何をやるか:**
- `page-base.css` から `body` の purple 背景グラデーションを削除（body はlayout.css側に統一）
- 全 259 HTML ファイルの `<link>` 順序を正規化（page-base.css → variables → layout → responsive → common → components → pages）

**影響範囲:** 全 259 HTMLファイル・page-base.css（1ファイル削除のみ）

**検証方法:**
1. `python3 scripts/ci/validate_html_w3c.py --pr-mode` 通過
2. `python3 scripts/ci/check_data_integrity.py` 通過
3. ローカルサーバーで代表ページ5件を目視確認（layout.css の grey 背景が表示されること）

**ロールバック方法:** `git revert HEAD` → Python スクリプトで `<link>` 順序を元に戻す

---

### Phase 2 — h2 グローバルセレクタのスコープ化 + !important 除去

**何をやるか:**
- `common.css` の `h2 { ... border-bottom ... }` を `.section-title { ... }` に変更
- `sidebar-toc.css` の `body { padding-left: 360px !important }` を廃止し、`.container` への `margin-left` 適用に変更（body を直接操作しない設計に修正）
- `transit-gateway-deep-dive.css`（12件）・その他ページ CSS の !important 計 40件を除去
- `responsive.css` の 4件（display制御系）を除去（print/accessibility の 7件は正当なため維持）
- スコープ化で解決できるものを修正し、詳細度競合を `@layer` なしで解消

**影響範囲:** `common.css`・`responsive.css`・`sidebar-toc.css`・`pages/` の 7ファイル + sidebar-toc を使う全 HTML（padding-left の変更確認が必要）

**検証方法:**
1. `grep -rn "!important" css/` で残件ゼロを確認
2. 変更したページを目視確認（h2 スタイルの差分なし）
3. W3Cバリデーション通過

**ロールバック方法:** `git revert HEAD` (1コミット)

---

### Phase 3 — Python CSS品質チェック導入

**何をやるか:**
- `scripts/ci/check_css_quality.py` を新規作成
- 既存 pre-commit checklist（CLAUDE.md記載）にコマンドを追加
- Phase 1/2 で除去した違反が再発しないことを自動検知

**影響範囲:** `scripts/ci/` の新規ファイル1件・CLAUDE.md の pre-commit セクション

**検証方法:**
1. 意図的に `!important` を含む CSS で `check_css_quality.py` が失敗することを確認
2. クリーン状態で全件 PASS することを確認

**ロールバック方法:** `check_css_quality.py` を削除するだけ（CSSに変更なし）

---

### Phase 4 — 命名規則ドキュメント化 + common.css 汎用クラス名の棚卸し

**何をやるか:**
- `contracts/layer-contract.md`・`contracts/naming-contract.md` を確定・配置
- `common.css` の汎用クラス名（`.section`, `.card`, `.header`）をレビューし、名前空間付きに移行すべきものを特定
- `quickstart.md` を作成（新規開発者向け「どこに何を書くか」ガイド）

**影響範囲:** ドキュメントのみ（CSS/HTML の変更は最小限）

**検証方法:** `quickstart.md` を参照した開発者が新規CSSを5分以内にどのファイルに書くか判断できる

**ロールバック方法:** ドキュメントのみなので不要

---

## Agent Context Update

Run after Phase 1 design completion:
```bash
bash .specify/scripts/bash/update-agent-context.sh claude
```
