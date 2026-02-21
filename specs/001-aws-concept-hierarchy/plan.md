# Implementation Plan: AWS概念マップ＋階層用語集エンジン

**Branch**: `001-aws-concept-hierarchy` | **Date**: 2026-02-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-aws-concept-hierarchy/spec.md`

---

## Summary

AWS SAP 試験学習サイトに「概念マップ＋階層用語集エンジン」を追加する。
Layer0（設計軸）〜Layer4（キーワード）の5層階層をJSONデータで管理し、
Vanilla JS エンジンがアコーディオン表示・横断検索・タグフィルタを提供する。
`concept-map.html`（ルート直下）を新規追加し、5モジュールのJSエンジン (`ConceptEngine`) と
2つの自動生成JSONインデックスで構成する。Pythonスクリプト `generate_concept_index.py` が
データ変更を検出して `concept-index.json` と `search-index.json` を再生成する。

---

## Technical Context

**Language/Version**: Vanilla JavaScript (ES6+), Python 3.11（スクリプト層）
**Primary Dependencies**: なし（外部ライブラリ・CDN・npmパッケージ一切不使用）
**Storage**: JSON静的ファイル（`concepts/` ディレクトリ）。データベース不使用
**Testing**: Python スクリプト（`scripts/ci/` パターン）+ ブラウザ手動確認。W3C自動検証
**Target Platform**: GitHub Pages (静的ファイルサーバー), Chrome/Firefox/Safari/Edge 最新版
**Project Type**: 静的Webアプリケーション（ビルドプロセスなし、既存サイトへの機能追加）
**Performance Goals**: 検索 < 300ms（SC-002）、初期ロード < 5秒（SC-004）、新サービス反映 < 1分（SC-003）
**Constraints**: `/aws_sap_studying/` パスプレフィックス必須、WCAG 2.1 AA、W3C HTML検証合格
**Scale/Scope**: MVP: 10サービス。最終: ~200サービス × ~12概念 × ~7キーワード ≒ ~3,000ノード

---

## Constitution Check

*GATE: Phase 0 research 完了後に再チェック済み*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| **I. Static-First Architecture** | ✅ PASS | Vanilla JS のみ。bundler/framework/CDN 一切不使用。fetch() + Map キャッシュはネイティブAPIのみ |
| **II. GitHub Pages Path Compliance** | ✅ PASS | 全CSSは `/aws_sap_studying/` プレフィックス必須（quickstart.md に明記）。契約仕様に記載 |
| **III. Data-View Separation** | ✅ PASS | 新エンジンは `concept-map.html` + `concepts/` JSONで完結。既存 `data.js` / `index.js` は変更しない |
| **IV. Accessibility & Standards** | ✅ PASS | SC-006 (WCAG 2.1 AA) + SC-007 (W3C検証) を Success Criteria に明記。`integrate_resource_complete.py` で自動検証 |
| **V. Semantic HTML for TOC** | ✅ PASS | `<h2>` / `<h3>` を使用。`<div class="section-title">` は禁止 |

**Complexity Tracking**: Constitution 違反なし → 複雑性追跡不要

---

## Project Structure

### Documentation (this feature)

```text
specs/001-aws-concept-hierarchy/
├── plan.md              # This file
├── research.md          # Phase 0 output ✅ 生成済み
├── data-model.md        # Phase 1 output ✅ 生成済み
├── quickstart.md        # Phase 1 output ✅ 生成済み
├── contracts/
│   └── js-engine-api.md # Phase 1 output ✅ 生成済み
├── checklists/
│   └── requirements.md  # 品質チェックリスト
├── spec.md              # 機能仕様書（Clarifications含む）
└── tasks.md             # Phase 2 output（/speckit.tasks で生成）
```

### Source Code (repository root)

```text
concepts/                                ← JSONデータ層（新規作成）
├── concept-index.json                   ← AUTO-GENERATED（ナビゲーション索引）
├── search-index.json                    ← AUTO-GENERATED（検索用フラット配列）
├── axes/
│   ├── axis-availability.json
│   ├── axis-dr.json
│   ├── axis-governance.json
│   ├── axis-security.json
│   ├── axis-cost.json
│   ├── axis-performance.json
│   ├── axis-scalability.json
│   └── axis-operational-excellence.json
├── domains/
│   ├── dom-network.json
│   ├── dom-compute.json
│   ├── dom-storage.json
│   ├── dom-database.json
│   ├── dom-data.json
│   ├── dom-ml.json
│   ├── dom-security.json
│   └── dom-management.json
└── services/                            ← MVP: 10ファイル
    ├── svc-route53.json
    ├── svc-vpc.json
    ├── svc-ec2.json
    ├── svc-s3.json
    ├── svc-rds.json
    ├── svc-lambda.json
    ├── svc-elb.json
    ├── svc-cloudfront.json
    ├── svc-iam.json
    └── svc-cloudwatch.json

js/concept-engine/                       ← JSエンジン（新規作成）
├── ConceptLoader.js
├── ConceptIndex.js
├── CrossLinkResolver.js
├── SearchEngine.js
└── TagSystem.js

css/pages/
└── concept-map.css                      ← ページ固有CSS（新規作成）

scripts/concept_management/             ← Python自動化スクリプト（新規作成）
└── generate_concept_index.py

concept-map.html                        ← エントリーポイント（ルート直下・新規作成）
```

**Structure Decision**: 単一プロジェクト（既存サイトへの機能追加）。
`concepts/` はデータ層として分離。`js/concept-engine/` は既存 `js/` ディレクトリに並置。
`concept-map.html` はルート直下（`index.html`・`home.html` と同列）。

---

## Implementation Phases

### Phase A: データ基盤（JSONスキーマ + MVPデータ + スクリプト）

**目標**: MVPデータ（10サービス）が正しく構造化され、生成スクリプトが機能する状態

**タスク**:

1. **`concepts/` ディレクトリ構造を作成**
   - `axes/`, `domains/`, `services/` サブディレクトリ
   - 空の `concept-index.json`, `search-index.json` プレースホルダー

2. **Layer0: 設計軸JSON 8ファイル作成**
   - `axis-availability.json`, `axis-dr.json`, `axis-governance.json`, `axis-security.json`
   - `axis-cost.json`, `axis-performance.json`, `axis-scalability.json`, `axis-operational-excellence.json`

3. **Layer1: ドメインJSON 8ファイル作成**
   - `dom-network.json`, `dom-compute.json`, `dom-storage.json`, `dom-database.json`
   - `dom-data.json`, `dom-ml.json`, `dom-security.json`, `dom-management.json`

4. **Layer2+: MVP サービスJSON 10ファイル作成**（Layer3/4インライン込み）
   - Route53, VPC, EC2, S3, RDS, Lambda, ELB, CloudFront, IAM, CloudWatch
   - 各ファイルに crosslinks, axis_tags, sap_domains を含む

5. **`generate_concept_index.py` を実装**
   - `concepts/` を走査して `concept-index.json` と `search-index.json` を生成
   - `--validate` フラグ: IDユニーク性・スキーマ必須フィールドのチェック
   - 既存 `update_counts.py` パターン（Class + argparse + Path(__file__).parent.parent.parent）に準拠

6. **スクリプト実行・索引ファイル生成**
   - `python3 scripts/concept_management/generate_concept_index.py`
   - 生成結果の内容を目視確認

---

### Phase B: JSエンジン実装

**目標**: 5モジュールの `ConceptEngine` が `contracts/js-engine-api.md` のAPI仕様通りに動作する

**タスク**（依存関係順）:

7. **`ConceptLoader.js` 実装**
   - `fetch()` + `Map` Promiseキャッシュ
   - `loadConceptIndex()`, `loadSearchIndex()`, `loadServiceNode(id)`
   - フェッチ失敗時: `null` / `[]` を返す（エラーをthrowしない）

8. **`ConceptIndex.js` 実装**
   - `init(manifest)`, `getById(id)`, `getByLayer(layer)`, `getByType(type)`, `getChildren(parentId)`
   - 内部Map: `_byId`, `_byLayer`, `_byType`

9. **`CrossLinkResolver.js` 実装**
   - `build(serviceNodes)`: reverseIndex構築
   - `getOutbound(nodeId)`, `getInbound(nodeId)`, `isBuilt()`
   - 存在しないtarget_id: 除外 + `console.warn()`

10. **`SearchEngine.js` 実装**
    - `init(entries)`: `_flat` プロパティ付与
    - `search(query)`: `String.includes()` マッチング、3文字未満は `[]`
    - 結果ソート: layer昇順、最大100件

11. **`TagSystem.js` 実装**
    - `toggleAxisTag`, `toggleSapDomain`, `clearAll`
    - `matchesNode(entry)`: OR+ANDフィルタロジック
    - `onChange(callback)`: リスナー管理

12. **`window.ConceptEngine` 統合オブジェクト**
    - 全5モジュールを単一グローバルに公開
    - 初期化シーケンスのオーケストレーション（`DOMContentLoaded` フック）

---

### Phase C: UI実装（`concept-map.html` + CSS）

**目標**: アコーディオン・検索・タグフィルタが動作するページ

**タスク**:

13. **`css/pages/concept-map.css` 作成**
    - `css/variables.css` デザイントークン継承
    - アコーディオンアニメーション（`max-height` トランジション）
    - `prefers-color-scheme: dark` ダークモード対応（FR-009）
    - 320px〜1920px レスポンシブ（FR-010）
    - WCAG 2.1 AA カラーコントラスト（`#374151`, `#dc7600` 等 Constitution Principle IV）

14. **`concept-map.html` 作成（骨格）**
    - `<!DOCTYPE html><html lang="ja">` 必須（CLAUDE.md HTMLオーサリング要件）
    - `/aws_sap_studying/` プレフィックスCSS読み込み（Constitution Principle II）
    - 検索バー・タグフィルタパネル・ツリーコンテナのHTMLスケルトン
    - `<h2>` / `<h3>` でセクション見出し（Constitution Principle V）

15. **アコーディオンツリー描画**（Layer0→1→2 は初期展開、Layer3→4はオンデマンド）
    - `ConceptEngine.index.getByLayer(0)` でLayer0ノード取得
    - Layer2クリック時: `ConceptEngine.loader.loadServiceNode(id)` → Layer3/4描画
    - 展開状態管理: 同時展開数制限なし（spec通り）

16. **検索バー UI 実装**
    - デバウンス 300ms（`setTimeout` + `clearTimeout`）
    - 初回フォーカス: `ConceptEngine.loader.loadSearchIndex()` 遅延トリガー
    - 結果リスト表示 + クリックで対象ノードへスクロール＆展開（US-2 AC-2）

17. **タグフィルタパネル UI 実装**
    - 設計軸タグ・SAPドメインタグの選択ボタン群
    - `ConceptEngine.tags.toggleAxisTag()` / `toggleSapDomain()` 呼び出し
    - クリアボタン（US-3 AC-3）
    - `onChange` コールバックでツリーを再フィルタ

18. **クロスリンクバッジ実装**（P2 フェーズ）
    - Layer2展開時に `ConceptEngine.resolver.getOutbound(id)` でバッジ表示
    - バッジクリック → 対象ノードへスクロール＆展開

---

### Phase D: 品質保証・統合

**目標**: Constitution 全 Quality Gates 通過 + 既存サイトへの統合

**タスク**:

19. **W3C HTML 検証**
    - `python3 scripts/ci/validate_html_w3c.py --files concept-map.html`

20. **WCAG コントラスト検証**
    - `python3 scripts/accessibility/check_contrast_ratio.py`

21. **JavaScript 構文チェック**
    - `node -c js/concept-engine/*.js`

22. **データ整合性検証**
    - `python3 scripts/concept_management/generate_concept_index.py --validate`
    - 全 crosslinks の target_id が concept-index に存在することを確認

23. **既存サイトへの統合**
    - `data.js` の `updateHistory[]` に概念マップ追加エントリを prepend（CLAUDE.md Three-Place Update Rule）
    - `index.js` の `searchData[]` に `concept-map.html` エントリを追加
    - `data.js` のカウント更新 (`update_counts.py` 実行)

24. **Performance 確認**
    - 開発サーバーで初期ロード < 5秒 (SC-004)
    - 検索レスポンス < 300ms (SC-002) を DevTools Network で目視確認

25. **コミット＆デプロイ**
    - `git add` + `git commit` + `git push origin gh-pages` (Constitution Deployment Standard)

---

## 拡張フェーズ（P2以降・スコープ外）

| フェーズ | 内容 | 前提条件 |
|---------|------|---------|
| P3 | Mermaid ダイアグラム統合（`_future.mermaid_diagram` フィールド活用） | Phase A〜D完了 |
| P4 | D3.js インタラクティブグラフ（`_future.d3_nodes` / `graph_position`） | P3完了 |
| P5 | GraphDB/SPARQL 移行（既存 JSON ID を RDF URI に変換） | P4完了 |
| — | 全 200+ サービス データ入力 | Phase A〜D完了後、継続的 |

---

## リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| `search-index.json` が大きすぎて初期ロードに影響 | SC-004 違反 | 遅延フェッチ（検索バーフォーカス時）で緩和。フル200サービス時に再測定 |
| 日本語検索の精度不足 | SC-002 ユーザー体験低下 | Phase 1 は `includes()` で十分。精度不足が確認されれば P3 以降でインデックス強化 |
| クロスリンクの循環参照 | reverseIndex 無限ループ | `generate_concept_index.py --validate` で循環検出チェックを実装 |
| 既存サイトのグローバル変数との衝突 | JS エラー | `window.ConceptEngine` 単一名前空間で衝突リスク最小化 |
