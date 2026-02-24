# CSS Naming Contract

**Feature**: `002-css-conflict-refactor`
**Version**: 1.0
**Date**: 2026-02-23

---

## 命名規則: BEM

新規クラスは **BEM 記法** を使用する。

```
.BlockName__element--modifier
```

| 部分 | 記法 | 例 |
|------|------|-----|
| Block（コンポーネント） | PascalCase | `.FixedNav`, `.Breadcrumb` |
| Element（部品） | `__` + camelCase | `.FixedNav__container`, `.FixedNav__link` |
| Modifier（状態） | `--` + kebab-case | `.FixedNav__link--active` |

---

## 禁止クラス名パターン

以下のパターンを新規に追加してはならない:

| パターン | 理由 | 代替 |
|---------|------|------|
| `#anything` | ID セレクタは詳細度が高すぎる | `.UniqueComponent` クラスを使う |
| `.section` | 汎用すぎて衝突リスクが高い | `.ContentSection`, `.PageSection` |
| `.header` | 汎用すぎる | `.PageHeader`, `.SectionHeader` |
| `.card` | 汎用すぎる | `.ContentCard`, `.InfoCard` |
| `.btn` 新規定義 | 既存の `.btn` があり重複になる | 既存の `.btn`, `.btn-primary` を使う |

---

## 既存クラス（変更しない）

以下のクラスは既存 HTML で使用中のため、Phase 4 まで変更しない:

```
.fixed-nav-header, .fixed-nav-container, .fixed-nav-logo, .fixed-nav-links
.breadcrumb-nav, .breadcrumb-home, .breadcrumb-item, .breadcrumb-current
.reading-progress, .reading-progress-bar
.scroll-to-top
.card, .card-feature, .card-section
.btn, .btn-primary, .btn-secondary
.section, .flex-container
.highlight, .text-secondary, .text-tertiary, .text-small, .text-large
.tag, .badge, .badge-success, .badge-warning, .badge-error, .badge-info
```

---

## CSS ファイル命名規則

| レイヤー | 命名パターン | 例 |
|---------|------------|-----|
| pages/ | `aws-[service]-[topic].html` に対応する `.css` | `aws-direct-connect-guide.css` |
| components/ | コンポーネント名 (kebab-case) | `sidebar-toc.css`, `page-bottom-nav.css` |
| 共通ファイル | 既存名を維持 | `common.css`, `layout.css` |
