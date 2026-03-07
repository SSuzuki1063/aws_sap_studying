# Feature Specification: Page Object Model（POM）パターン採用

**Feature Branch**: `003-page-object-model`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "Page Object Model（POM）をパターンを採用してください"

---

## 背景

現在のリポジトリには `ConceptMapPage.ts` という1つのPage Objectが存在し、concept-map.html のセレクタと操作を集約している。しかし、回帰テスト計画（001-playwright-regression-tests）では4つの新しいテストスイート（visual, navigation, links, interaction）が3つのターゲットページ（index, concept-map, learning-resources）を対象とする。POMパターンを全ページに拡張することで、セレクタの重複を排除し、テストの可読性・保守性を向上させる。

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 共通ページオブジェクトの導入 (Priority: P1)

テスト開発者が新しい回帰テストを書く際、各ページ専用のPage Objectを使用してセレクタの直接記述なしにテストを作成できる。これによりCSSセレクタの変更が1箇所の修正で済み、テストの保守コストが劇的に下がる。

**Why this priority**: POMは全テストスイートの基盤となる。POMなしでは4つのスイート×3ページでセレクタが散在し、CSSの変更1つで複数ファイルの修正が必要になる。

**Independent Test**: 既存の7つのconcept-map specファイルが新しいPage Objectを使用して全テストが引き続きパスすることを確認する。

**Acceptance Scenarios**:

1. **Given** テスト開発者がindex.htmlのテストを書く、**When** `IndexPage`オブジェクトを使用する、**Then** CSSセレクタを直接記述せずにナビゲーション操作・要素検証ができる
2. **Given** テスト開発者がlearning-resources.htmlのテストを書く、**When** `LearningResourcesPage`オブジェクトを使用する、**Then** リソース一覧の検証・リンク取得がメソッド呼び出しで完了する
3. **Given** 既存の`ConceptMapPage`を拡張する、**When** 回帰テスト用の新しいメソッド（スクリーンショット待機、全リンク取得など）を追加する、**Then** 既存の60+テストが変更なしでパスし続ける
4. **Given** UIのCSSクラス名が変更される、**When** 対応するPage Objectのセレクタ定義のみを修正する、**Then** そのPage Objectを使用する全テストが修正なしで動作する

---

### User Story 2 - 回帰テストスイートでのPOM活用 (Priority: P1)

テスト開発者が4つの回帰テストスイート（visual, navigation, links, interaction）を実装する際、Page Objectの高レベルAPIを使用してテストコードをユーザーストーリーのように読める形で記述できる。

**Why this priority**: POMの価値はそれを使用するテストコードの品質に直結する。テストがPage Objectを正しく活用して初めて保守性の向上が実現される。

**Independent Test**: 4つの回帰テストスイートそれぞれが、Page Objectメソッドのみを使用してセレクタ直書きなしで実装されていることをコードレビューで確認する。

**Acceptance Scenarios**:

1. **Given** visual regression specを実装する、**When** 各ページのPage Objectの`goto()`と`waitForReady()`を使用する、**Then** ページ読み込み完了後にスクリーンショットが撮影される
2. **Given** navigation specを実装する、**When** `IndexPage`のナビゲーションリンクメソッドを使用する、**Then** `page.locator('a[href*=...]')` のようなセレクタ直書きがゼロになる
3. **Given** link validation specを実装する、**When** 各Page Objectの`getAllLinks()`メソッドを使用する、**Then** リンク収集ロジックがテスト側に漏れない
4. **Given** interaction specを実装する、**When** `ConceptMapPage`の既存メソッド（`clickL1`, `clickL2`, `applyAxisFilter`等）を使用する、**Then** テストコードがユーザー操作の言語で記述される

---

### User Story 3 - 共通基底クラスによる横断機能の提供 (Priority: P2)

全Page Objectが共有する機能（ページ遷移、ロード待機、全リンク取得、スクリーンショット対応）を基底クラスまたは共通ミックスインで提供し、各ページ固有のPage Objectは差分のみを定義する。

**Why this priority**: 共通機能の抽出はコードの重複を減らすが、P1のPage Object個別実装が先に完了していれば後から安全にリファクタできる。

**Independent Test**: 基底クラスの`getAllLinks()`を全Page Objectが継承し、link validation specが3ページ分のリンクを共通インターフェースで取得できることを確認する。

**Acceptance Scenarios**:

1. **Given** `BasePage`基底クラスが存在する、**When** 新しいページのテストを追加する、**Then** `goto()`, `waitForReady()`, `getAllLinks()` が自動的に利用可能になる
2. **Given** `BasePage`にスクリーンショット待機ロジックがある、**When** visual regressionテストが実行される、**Then** アニメーション停止・フォント読み込み待機が自動的に適用される
3. **Given** 3つのPage Object（`IndexPage`, `ConceptMapPage`, `LearningResourcesPage`）が`BasePage`を継承する、**When** 各ページ固有のメソッドのみを定義する、**Then** 共通機能のコード重複がゼロになる

---

### Edge Cases

- `ConceptMapPage`は既に60+テストで使用されているため、後方互換性が必須。既存のpublicメソッド・プロパティのシグネチャを変更してはならない
- ページが完全に読み込まれる前にPage Objectのメソッドを呼ぶ場合、適切なエラーメッセージまたは自動待機が提供される
- learning-resources.htmlのDOM構造が変更された場合、`LearningResourcesPage`のセレクタのみを修正すればテストは動作し続ける
- 将来新しいページ（例：quiz.html）のテストを追加する場合、`BasePage`を継承して最小限のコードで新Page Objectを作成できる

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 各ターゲットページ（index, concept-map, learning-resources）に対応する専用のPage Objectクラスが存在しなければならない
- **FR-002**: 既存の`ConceptMapPage`は後方互換を保ちながら拡張されなければならない。既存の7つのspecファイルは変更なしでパスし続けること
- **FR-003**: 全Page Objectは共通インターフェース（`goto()`, `waitForReady()`, `getAllLinks()`）を提供しなければならない
- **FR-004**: 回帰テストスイートのspecファイルはPage Objectメソッドのみを使用し、CSSセレクタの直接記述を含んではならない
- **FR-005**: Page Objectのメソッドは意味のある名前（例：`clickConceptMapLink()`）で、操作の意図が明確でなければならない
- **FR-006**: Page Objectファイルは `tests/e2e/helpers/` ディレクトリに集約して配置されなければならない
- **FR-007**: 全Page Objectが共有する機能は基底クラスまたはミックスインで提供し、コード重複を最小化しなければならない

### Key Entities

- **BasePage**: 全ページ共通の機能を提供する基底クラス。ページ遷移、ロード待機、リンク収集、スクリーンショット準備を担当
- **IndexPage**: index.html（ホームページ）固有の操作。ナビゲーションメニュー、カード要素、ヒーローセクションへのアクセスを提供
- **ConceptMapPage**: concept-map.html固有の操作。既存クラスを拡張し、既存60+テストとの後方互換を維持
- **LearningResourcesPage**: learning-resources.html固有の操作。リソース一覧、カテゴリフィルタ、リンク群へのアクセスを提供

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 回帰テストスイートの4つのspecファイル（visual, navigation, links, interaction）にCSSセレクタの直接記述が0件であること
- **SC-002**: 既存のconcept-map 60+テストが全てパスし続けること（後方互換100%）
- **SC-003**: UIのCSSクラス変更時、修正が必要なファイルが1つ（該当Page Objectのみ）であること
- **SC-004**: 新しいページのテスト追加時、Page Object作成が30分以内で完了できること（テンプレートに従うだけ）
- **SC-005**: 全Page Objectが共通インターフェース（`goto`, `waitForReady`, `getAllLinks`）を持ち、回帰テストが統一的にページを操作できること

---

## Assumptions

1. 既存の`ConceptMapPage`のpublicインターフェース（メソッド名・引数型・戻り値型）は変更しない。追加のみ許容
2. Page Objectは `tests/e2e/helpers/` に集約する（既存の`ConceptMapPage.ts`と同じディレクトリ）
3. 基底クラスの導入は `ConceptMapPage` を壊さない形で行う（extends による継承、または既存コードへの影響がないcomposition）
4. 回帰テストスイート（visual/navigation/links/interaction）のディレクトリは `tests/e2e/` 配下に作成される（001-playwright-regression-tests プランに準拠）
5. 各Page Objectのセレクタ定義はreadonlyプロパティとして公開し、テストコードから直接参照可能にする（既存パターン踏襲）
