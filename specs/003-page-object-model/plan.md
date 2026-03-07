# Implementation Plan: Page Object Model（POM）パターン採用

**Branch**: `003-page-object-model` | **Date**: 2026-03-07 | **Spec**: `specs/003-page-object-model/spec.md`
**Input**: POMパターンを全ターゲットページに拡張し、回帰テストの保守性を向上させる

## Summary

既存の `ConceptMapPage.ts` を基に、全ターゲットページ（index, concept-map, learning-resources）用のPage Objectクラスを作成する。共通機能を `BasePage` 基底クラスに抽出し、各ページ固有のセレクタ・操作メソッドをサブクラスで定義する。既存60+テストの後方互換を完全に維持する。

## Technical Context

**Language/Version**: TypeScript 5.4.5 (existing)
**Primary Dependencies**: `@playwright/test` 1.44.0 (existing)
**Testing**: Playwright Test runner (existing)
**Target Platform**: GitHub Actions CI + local dev
**Project Type**: Test infrastructure
**Constraints**: 既存60+テストの後方互換必須、既存ConceptMapPageのpublicインターフェース変更禁止

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Architecture | PASS | テストコードのみ — サイトコード変更なし |
| II. GitHub Pages Path Compliance | N/A | HTML変更なし |
| III. Data-View Separation | N/A | data.js/render.js変更なし |
| IV. Accessibility & Standards | PASS | テストがアクセシビリティを検証する基盤 |
| V. Semantic HTML Structure | N/A | HTML変更なし |

**Gate Result**: ALL PASS

## Project Structure

### Source Code

```text
tests/e2e/helpers/
├── BasePage.ts              # NEW — 共通基底クラス
├── IndexPage.ts             # NEW — index.html Page Object
├── ConceptMapPage.ts        # MODIFY — BasePage継承に変更（後方互換維持）
└── LearningResourcesPage.ts # NEW — learning-resources.html Page Object
```

**Structure Decision**: 全Page Objectを既存の `tests/e2e/helpers/` ディレクトリに集約。既存の `ConceptMapPage.ts` と同じディレクトリに置くことで import パスの一貫性を保つ。

## Design Decisions

### D1: 継承 vs Composition

**Decision**: クラス継承（`extends BasePage`）
**Rationale**: 既存`ConceptMapPage`のパターン（constructorでPage受け取り、readonlyプロパティでLocator定義）と自然に合致する。Compositionだと既存コードとスタイルが乖離する。

### D2: BasePage の共通メソッド

**Decision**: `goto()`, `waitForReady()`, `getAllLinks()`, `getPageTitle()` + 共通ロケータ（header, nav, theme toggle, search）
**Rationale**: HTML構造分析の結果、index と learning-resources は header/nav/search/footer が完全に同一。これらを BasePage に配置すると各サブクラスはページ固有部分のみに集中できる。

### D3: ConceptMapPage の移行戦略

**Decision**: ConceptMapPage を BasePage の extends に変更するが、既存の全publicメソッド・プロパティのシグネチャは維持
**Rationale**: 60+テストが `cm.goto()`, `cm.clickL1()`, `cm.filterStatus` などを直接使用。これらの名前・引数・戻り値を変更するとテストが壊れる。`goto()` は BasePage の抽象メソッドを override する形にする。

### D4: goto() のパス管理

**Decision**: 各サブクラスの `pagePath` プロパティで定義し、BasePage.goto() がそれを使用
**Rationale**: `/aws_sap_studying/` プレフィックスを基底クラスで一元管理すると、パスプレフィックスの変更が1箇所で済む。

---

## BasePage 共通インターフェース設計

### 共通ロケータ（全ページ共有）

```text
header             → .fixed-nav-header
hamburgerBtn       → #hamburgerBtn
mainNav            → #mainNav
themeToggle        → .theme-toggle
searchInput        → #searchInput
searchClear        → #searchClear
searchResults      → #searchResults
searchResultsCount → #searchResultsCount
scrollToTop        → #scrollToTop
mainContent        → #main-content
```

### 共通メソッド

```text
goto()             → this.page.goto(pagePath) + waitForReady()
waitForReady()     → ページ固有のロード完了待機（サブクラスで override）
getAllLinks()       → page.$$eval('a[href]') で全リンクを収集 → { href, text }[]
getPageTitle()     → page.title()
toggleTheme()      → themeToggle.click()
getTheme()         → documentElement.dataset.theme を取得
isNavOpen()        → mainNav の visibility/display を判定
toggleNav()        → hamburgerBtn.click()
```

---

## ページ固有インターフェース設計

### IndexPage 固有

```text
# ロケータ
heroTitle          → .hero-title
heroCta            → .hero-cta
heroCards          → .hero-card
statItems          → .stat-item
updateHistory      → #update-history-container

# メソッド
clickConceptMapLink()     → hero CTA primary button クリック
clickLearningResources()  → hero CTA secondary button クリック
getHeroCards()            → { title, badge, href }[] を返す
getNavLinks()             → fixed-nav-links 内の全リンク { text, href }[]
searchFor(query)          → searchInput に入力 + 結果待機
clearSearch()             → searchClear クリック
getSearchResultCount()    → searchResultsCount テキスト取得
```

### ConceptMapPage 固有（既存メソッド維持 + 追加）

```text
# 既存メソッド（変更なし）
goto(), clickL1(), clickL2(), clickL3(), navigateTo()
applyAxisFilter(), applySapFilter(), clearFilters(), isServiceFilteredOut()
getBreadcrumbItems(), getCrosslinkBadges(), getHtmlResourceLinks()
switchToMapTab(), switchToDetailTab()

# 既存ロケータ（変更なし）
loadingMsg, filterStatus, filterClear, detailPanel, detailTitle
detailPlaceholder, breadcrumb, progressPct, progressFill, tabMap, tabDetail

# 追加メソッド（回帰テスト用）
waitForReady()  → override: loadingMsg の hidden 待機（既存goto()から抽出）
```

### LearningResourcesPage 固有

```text
# ロケータ
categoryNav        → .category-nav
categoryLinks      → .category-link
resourceList       → .resource-list
sidebarToc         → #sidebar-toc
tocToggle          → #sidebar-toc-toggle
container          → .container
statsGrid          → .stats-grid

# メソッド
getCategories()           → { name, count, href }[] を返す
getResourceItems()        → { text, href }[] を返す
getCategoryCount()        → categoryLinks の count
toggleSidebarToc()        → tocToggle クリック
searchFor(query)          → searchInput に入力 + 結果待機（BasePage継承）
```
