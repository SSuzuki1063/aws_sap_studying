# Feature Specification: CSS衝突解消リファクタリング

**Feature Branch**: `002-css-conflict-refactor`
**Created**: 2026-02-23
**Status**: Draft
**Input**: User description: "CSSの衝突性（スタイルの意図しない上書き、グローバル漏れ、詳細度競合、ライブラリ競合）を根本から解消する。コンポーネント間CSS干渉解消・UI崩れ最小化移行・再発防止CIチェック導入。"

---

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE.
-->

### User Story 1 - 新リソース追加時にCSSが壊れない (Priority: P1)

開発者が新しいAWS学習リソースのHTMLファイルを追加したとき、既存ページや新ページのレイアウト・デザインが崩れない。
現状は `common.css` や `layout.css` のグローバルスタイルが新ページのコンポーネントに意図せず適用されるため、追加のたびにデバッグが必要な状態になっている。

**Why this priority**: サイトに259以上のHTMLリソースを継続追加する開発ワークフローの中核。CSSの予測可能性がなければ、すべての新規追加がリグレッションリスクを持つ。

**Independent Test**: 新規HTMLファイルを1つ `networking/` ディレクトリに追加し、共有CSS（common.css, layout.css）からの意図しないスタイル適用がないことをブラウザで確認できる。

**Acceptance Scenarios**:

1. **Given** 共通CSSが読み込まれた状態で、**When** 新しいHTMLリソースファイルを追加したとき、**Then** 新ページ固有のスタイルが他ページに影響を与えず、他ページのスタイルが新ページを意図しない形で上書きしない
2. **Given** `css/components/sidebar-toc.css` が変更されたとき、**When** サイドバーを持つ任意のページを開いたとき、**Then** ページ固有コンテンツのスタイルは変わらない
3. **Given** グローバルCSSにセレクタが追加されたとき、**When** 全HTMLをlintしたとき、**Then** 影響範囲チェックのCIが通過する（想定外のセレクタ追加を検知する）

---

### User Story 2 - 詳細度競合なしでスタイル変更が予測可能 (Priority: P2)

開発者がボタンやカードなどの共通コンポーネントのスタイルを修正したとき、意図した全ページに変更が反映され、予期しない上書き（詳細度競合）が発生しない。

**Why this priority**: 現状では `.button` や `.container` などの汎用クラス名が複数のCSSファイルに散在しており、どのルールが勝つか予測困難。P1の「追加が壊れない」を補強する上流問題。

**Independent Test**: `css/components/` 内のボタンスタイルを変更し、全ページのボタン表示をビジュアルリグレッションテストで確認できる。

**Acceptance Scenarios**:

1. **Given** 既存のコンポーネントCSSクラスが定義されているとき、**When** 同名クラスを別ファイルで宣言しようとしたとき、**Then** stylelintが衝突候補を警告する
2. **Given** CSSのレイヤー構造（base → tokens → components → utilities）が定義されているとき、**When** 開発者がスタイルを追加するとき、**Then** どのレイヤーに書くべきかを示す設計ドキュメントに従うだけで詳細度競合が起きない

---

### User Story 3 - UIを壊さずに段階的に移行できる (Priority: P3)

開発者が移行作業をPR単位で安全に進められ、各PRがロールバック可能で、視覚的なレグレッションを早期検知できる。

**Why this priority**: 207 CSSファイル・259 HTMLファイルへの一括変更は高リスク。段階的移行の枠組みがなければプロジェクトが止まる。

**Independent Test**: 1段階のPR（例: base層の整理のみ）をマージし、GitHub Pages のビジュアルを目視確認してロールバックなしで完了できる。

**Acceptance Scenarios**:

1. **Given** 移行のフェーズ計画（PR単位）が存在するとき、**When** 1フェーズのPRをマージしたとき、**Then** 変更対象外のページで視覚的な差分が発生しない
2. **Given** CSSの変更が行われたとき、**When** CIが実行されるとき、**Then** stylelintのルール違反（!important 使用・深いネスト・IDセレクタ等）は自動的に検出される

---

### User Story 4 - 再発防止ルールが CI で守られる (Priority: P4)

新しい開発者や自動生成コードがCSSのアンチパターン（!important 乱用・IDセレクタ・深いネスト）を追加しようとしたとき、CIが自動的にブロックする。

**Why this priority**: ツールによる強制なしでは、リファクタリング後もCSSの品質は徐々に劣化する。P1～P3の成果を維持する持続可能性の問題。

**Independent Test**: `!important` を含む新規CSSファイルをコミットしたとき、CIのstylelintジョブが失敗することを確認できる。

**Acceptance Scenarios**:

1. **Given** stylelintが設定されているとき、**When** `!important` を含むCSSをコミットしたとき、**Then** CIが失敗し、エラー箇所がファイル名と行番号で報告される
2. **Given** stylelintが設定されているとき、**When** 4段以上のネストを持つCSSをコミットしたとき、**Then** CIが警告または失敗を返す
3. **Given** 禁止ルールが文書化されているとき、**When** 開発者がルール一覧を参照したとき、**Then** 各ルールの「なぜ禁止か」が1文で理解できる

---

### Edge Cases

- 一部のページCSSが `common.css` のスタイルを意図的に上書きしている場合（override が設計上必要なケース）、そのページは移行対象外として明示できるか？
- 195のページ固有CSSに同名クラスが多数存在する場合、一括置換ツールが使えない箇所でどう対処するか？
- HTML内に `<style>` タグでインラインCSSが書かれているリソースが存在した場合、stylelintの対象範囲に含めるか？
- `replace_html/` ディレクトリに置かれた置換用HTMLが古いクラス名を使用している場合、移行後の整合性をどう保つか？

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: CSSのレイヤー構造（base / tokens / components / utilities / overrides）を定義し、各レイヤーの責務と禁止事項を文書化しなければならない
- **FR-002**: グローバルタグセレクタ（`body`, `a`, `button`, `h1`-`h6` 等）の宣言を `base` レイヤー1箇所に集約し、他ファイルからのグローバルタグ上書きを排除しなければならない
- **FR-003**: コンポーネントCSSのクラス名は名前空間プレフィックスを持たなければならない（例: `.SidebarToc__item` ではなく汎用 `.item`）
- **FR-004**: 移行は複数のフェーズに分割され、各フェーズがPR単位で独立してマージ・ロールバック可能でなければならない
- **FR-005**: stylelintの設定ファイルが `css/` ディレクトリ下のすべての `.css` ファイルに適用されなければならない
- **FR-006**: stylelintは最低限以下のルールを禁止しなければならない: `!important` の使用、IDセレクタ（`#id`）の使用、4段以上のセレクタネスト
- **FR-007**: CIパイプライン（GitHub Actions または既存のプリコミットスクリプト）にstylelintチェックが追加されなければならない
- **FR-008**: 移行後も全HTMLファイルがW3Cバリデーションを通過しなければならない
- **FR-009**: 既存のビジュアルデザイン（色・フォント・レイアウト）は移行前後で目視確認可能な差分があってはならない
- **FR-010**: CSS読み込み順を安定化するため、各HTMLテンプレートの `<head>` 内のCSS `<link>` タグの順序を統一したドキュメントが存在しなければならない

### Key Entities

- **CSSレイヤー**: base, tokens, components, utilities, overrides の5層。各層の読み込み順と責務範囲を定義する
- **コンポーネントCSS**: `css/components/` 内の共有UIパーツ（sidebar-toc, bookmark, exam-guide 等）のスタイル定義
- **ページCSSファイル**: `css/pages/` 内の195ファイル。各HTMLリソースに1対1で対応する
- **stylelint設定**: `.stylelintrc.json` とCIスクリプト。禁止ルールを機械的に強制する
- **移行フェーズ計画**: PR分割案。各フェーズの変更範囲・影響範囲・検証方法・ロールバック手順を含む

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 移行完了後、既存259HTMLファイルのいずれも、移行前と比べてブラウザ上での視覚的差分がゼロである（目視確認またはスクリーンショット比較）
- **SC-002**: 新しいHTMLリソースを1ファイル追加したとき、既存のどのページにも視覚的変化が起きない（回帰ゼロ）
- **SC-003**: stylelintが設定されており、`!important` / IDセレクタ / 4段以上ネストを含むCSSコミットを100%ブロックできる
- **SC-004**: CSSのレイヤー構造ドキュメント（運用ルール）を参照した開発者が、新規CSSをどのファイルに書くべきかを5分以内に判断できる
- **SC-005**: 移行フェーズ1（base層整理）のPRが、既存テストやW3Cバリデーションを全て通過した状態でマージできる
- **SC-006**: グローバルタグセレクタの重複宣言が、移行後に `css/common.css` および `css/variables.css` 以外で発見されないこと（自動チェック可能）

---

## Assumptions *(include when relevant)*

- このプロジェクトはビルドプロセスを持たない静的HTMLサイトのため、CSS Modules・CSS-in-JS・PostCSSは使用しない
- CSSアーキテクチャはBEM命名規則 + ITCSSレイヤリング（Option C）を採用する。理由: 追加ツール不要・既存HTMLの構造変更最小・段階移行に最適
- `css/pages/` の195ファイルは原則ページスコープが保たれているため、移行の優先度は `css/common.css`・`css/components/` の共有スタイルに置く
- stylelintはnpm経由でインストールするが、ビルドプロセスに組み込まず、CIスクリプト（`scripts/ci/`）の一部として実行する
- HTML内の `<style>` タグはstylelintのスコープ外とする（初期フェーズでは対象外）
- 移行は全4フェーズ（base整理 → tokens整理 → components名前空間化 → CI導入）に分割する

---

## Out of Scope

- React/Vue/JSX コンポーネントへの移行（このプロジェクトはVanilla HTML）
- Tailwind CSS や他のユーティリティフレームワークの導入
- ビジュアルリグレッションテストの自動化（初期フェーズでは目視確認）
- `css/pages/` 内の195ページ固有CSSの完全リネーム（影響が大きすぎる; 共有CSSのみ対象）
- HTMLの `<style>` タグ内のインラインCSSのstylelint適用（Phase 2以降の検討事項）
