# Research: AWS概念マップ＋階層用語集エンジン

**Branch**: `001-aws-concept-hierarchy` | **Date**: 2026-02-21
**Phase**: 0 (Pre-Design Research)

---

## 1. 日本語テキスト検索アルゴリズム

**Decision**: `String.prototype.includes()` によるサブストリングマッチング（Phase 1 MVP）

**Rationale**:
- Constitution Principle I（Static-First）によりFuse.jsなどのCDNライブラリは禁止
- 日本語はレーベンシュタイン距離の恩恵が薄い（文字単位の粒度が細かい）
- `search-index.json` フラット配列を全走査しても、~30,000エントリ相当で `Array.filter()` + `String.includes()` は十分に300ms以内に収まる（ブラウザのJSエンジン最適化による）
- `name_ja + name_en + description_ja + sap_tip + tags.join()` の連結文字列を検索対象とする「フラット文字列キャッシュ」パターンで、毎回フィールドを走査するコストを削減

**Alternatives Considered**:

| 候補 | 却下理由 |
|------|---------|
| Fuse.js | 外部CDN依存 → Constitution Principle I 違反 |
| Web Worker-based search | Phase 1では過剰。P3以降の検討事項 |
| Lunr.js (static index) | ビルドプロセス必要 → Constitution Principle I 違反 |
| Trigram index (手書き) | 実装コストが高く、includes()で要件を満たせる |

---

## 2. JSON 遅延ロード戦略

**Decision**: `fetch()` + `Map` キャッシュによるPromiseベース遅延ロード

**Rationale**:
- `concept-index.json`（軽量）: `DOMContentLoaded` 時に即時フェッチ → アコーディオンUI描画に必要
- `search-index.json`（重量）: 検索バー初回フォーカス時にフェッチ → 初期ロードコスト削減（SC-004）
- 各サービスJSON（`svc-*.json`）: アコーディオン展開時にオンデマンドフェッチ → Layer3/4データは必要になるまでロードしない
- キャッシュは `Map<string, Promise<any>>` で実装。同一IDへの重複フェッチを防ぐ（Promise共有パターン）

**Alternatives Considered**:

| 候補 | 却下理由 |
|------|---------|
| Service Worker + offline cache | Assumption #5で明示的スコープ外 |
| XMLHttpRequest | fetch()より冗長。モダンブラウザでは不要 |
| 全JSON一括ロード | SC-004（初期5秒以内）に違反するリスク |
| dynamic `import()` | JSONには不適（ESモジュール専用）|

---

## 3. `concept-map.html` ファイル配置

**Decision**: リポジトリルート直下（`/concept-map.html`）

**Rationale**:
- 既存サイト構造と一致（`index.html`, `home.html`, `quiz.html` がルートに存在）
- ルート直下配置により `<script src="data.js">` のような相対パスが既存ファイルと同一に
- GitHub Pages での URL は `https://ssuzuki1063.github.io/aws_sap_studying/concept-map.html`
- Constitution Principle II：新規HTMLファイルは `/aws_sap_studying/` プレフィックスCSS必須

**Alternatives Considered**:

| 候補 | 却下理由 |
|------|---------|
| `networking/concept-map.html` | スコープが狭い印象。全AWSサービスが対象のため不適切 |
| `knowledge-base/concept-map.html` | 新ディレクトリ作成が必要。既存パターンと乖離 |
| 別ドメイン / CDN | 静的GitHubPages制約に違反 |

---

## 4. Python スクリプト配置

**Decision**: `scripts/concept_management/generate_concept_index.py`

**Rationale**:
- 既存スクリプト体系と整合（`scripts/html_management/`, `scripts/ci/`, `scripts/accessibility/` と並列）
- `generate_concept_index.py` は `concept-index.json` と `search-index.json` を同時生成する単一スクリプト
- クラスベース + argparse パターン（`update_counts.py`, `check_data_integrity.py` と同一スタイル）
- `Path(__file__).parent.parent.parent` でリポジトリルートを自動検出

**Alternatives Considered**:

| 候補 | 却下理由 |
|------|---------|
| `scripts/ci/` 内に配置 | CI/CDチェック用途と混同される |
| ルート直下 | スクリプト散乱。既存パターンと乖離 |
| 2つの別スクリプトに分割 | `concept-index.json` と `search-index.json` は同一走査で生成できるため非効率 |

---

## 5. 新エンジンのグローバル名前空間戦略

**Decision**: 単一グローバルオブジェクト `ConceptEngine` + 各モジュールをサブプロパティとして公開

```javascript
// 例
window.ConceptEngine = {
  loader:   ConceptLoader,     // フェッチ・キャッシュ管理
  index:    ConceptIndex,      // O(1) ID参照
  resolver: CrossLinkResolver, // reverseIndex構築・解決
  search:   SearchEngine,      // search-index.json検索
  tags:     TagSystem,         // タグフィルタ
};
```

**Rationale**:
- 既存コードは `categoriesData`, `searchData` などのベアグローバルを使用
- 新エンジンは5モジュール（各々が複数関数を持つ）= 名前空間なしでは衝突リスク大
- `ConceptEngine.search.query("フェイルオーバー")` のような呼び出しは可読性も高い
- 既存グローバル（`categoriesData` など）とは完全に独立して動作

**Alternatives Considered**:

| 候補 | 却下理由 |
|------|---------|
| ESモジュール (`type="module"`) | 既存HTMLがmoduleスクリプトを使用しておらず、CORS制約もあり混在が複雑 |
| 5個の独立グローバル変数 | グローバル汚染リスク、既存変数との衝突可能性 |
| IIFE + クロージャ | 外部からのテストアクセスが困難 |

---

## 6. CSS 統合戦略

**Decision**: `css/pages/concept-map.css` + 既存デザイントークン継承

**Rationale**:
- Constitution Principle I：新コンポーネントCSSは `css/components/` に配置（integration scriptが自動追加）
- `css/variables.css` のデザイントークン（色・フォント・スペーシング）をそのまま継承
- ダークモード対応は `prefers-color-scheme: dark` メディアクエリで実装（FR-009）
- アコーディオン・バッジ・検索バーは専用コンポーネントCSSに分離

---

## 研究サマリー

| 領域 | 決定事項 |
|------|---------|
| 検索アルゴリズム | `String.includes()` + フラット文字列キャッシュ |
| 遅延ロード | `fetch()` + Promiseキャッシュ Map |
| HTMLファイル配置 | ルート直下（`/concept-map.html`） |
| Pythonスクリプト | `scripts/concept_management/generate_concept_index.py` |
| JS名前空間 | `window.ConceptEngine` 単一グローバルオブジェクト |
| CSS | `css/pages/concept-map.css` + デザイントークン継承 |

**NEEDS CLARIFICATION 残存**: なし
→ Phase 1（設計・コントラクト）に進む準備完了
