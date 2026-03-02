# Tasks: AWS概念マップ＋階層用語集エンジン

**Input**: Design documents from `/specs/001-aws-concept-hierarchy/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: テスト自動化は仕様に明記されていないため含めない。品質検証はPhase D（Python/Node CIスクリプト）で対応。

**Organization**: 4ユーザーストーリー (US1=P1, US2=P2, US3=P2, US4=P3) + Setup/Foundational/Polish フェーズ

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、未完了タスクへの依存なし）
- **[Story]**: 所属ユーザーストーリー (US1〜US4)
- 各タスクに正確なファイルパスを記載

---

## Phase 1: Setup（共有インフラ）

**Purpose**: ディレクトリ構造の作成と概念マップページの骨格構築

- [x] T001 リポジトリルート直下に `concepts/axes/`, `concepts/domains/`, `concepts/services/` ディレクトリを作成し、`concepts/concept-index.json`, `concepts/search-index.json` の空プレースホルダーを配置
- [x] T002 `js/concept-engine/` ディレクトリを作成し、`ConceptLoader.js`, `ConceptIndex.js`, `CrossLinkResolver.js`, `SearchEngine.js`, `TagSystem.js` の空ファイルを配置
- [x] T003 [P] `scripts/concept_management/` ディレクトリを作成し、`generate_concept_index.py` の空ファイルを配置
- [x] T004 [P] `concept-map.html` の骨格を作成（`<!DOCTYPE html><html lang="ja">`, 必須 CSS リンク `/aws_sap_studying/css/variables.css` 等, body 末尾の `<script>` タグ順序: ConceptLoader→ConceptIndex→CrossLinkResolver→SearchEngine→TagSystem→init）
- [x] T005 [P] `css/pages/concept-map.css` を作成し、`css/variables.css` デザイントークン継承・アコーディオン基本スタイル・`prefers-color-scheme: dark` ダークモードメディアクエリのスケルトンを記述

---

## Phase 2: Foundational（ブロッキング前提条件）

**Purpose**: 全ユーザーストーリーが依存するデータ層・インデックス生成スクリプト・コアJSモジュールの完成

**⚠️ CRITICAL**: Phase 2 が完了するまでユーザーストーリーの実装は開始できない

- [x] T006 [P] Layer0 AxisNode JSON 8ファイルを `concepts/axes/` に作成: `axis-availability.json`, `axis-dr.json`, `axis-governance.json`, `axis-security.json`, `axis-cost.json`, `axis-performance.json`, `axis-scalability.json`, `axis-operational-excellence.json`（各ファイルに `id`, `layer:0`, `type:"axis"`, `name_ja`, `name_en`, `description_ja`, `sap_domains[]`, `_meta` を含む）
- [x] T007 [P] Layer1 DomainNode JSON 8ファイルを `concepts/domains/` に作成: `dom-network.json`, `dom-compute.json`, `dom-storage.json`, `dom-database.json`, `dom-data.json`, `dom-ml.json`, `dom-security.json`, `dom-management.json`（各ファイルに `id`, `layer:1`, `type:"domain"`, `name_ja`, `name_en`, `description_ja`, `_meta` を含む）
- [x] T008 `concepts/services/svc-route53.json` を `data-model.md` の ServiceNode スキーマに準拠して作成（Layer3 `key_concepts[]` 10〜15件・Layer4 `keywords[]` インライン込み・`axis_tags`, `sap_domains`, `crosslinks[type=related]` を含む完全形）
- [x] T009 `scripts/concept_management/generate_concept_index.py` を実装: `concepts/` 配下の全 JSON を走査し `concepts/concept-index.json`（ConceptIndexEntry 配列）と `concepts/search-index.json`（SearchIndexEntry 配列）を生成。既存 `scripts/html_management/update_counts.py` と同一の Class+argparse+`Path(__file__).parent.parent.parent` パターンに準拠。`--validate` フラグでID一意性・必須フィールド・crosslinks ターゲット存在確認
- [x] T010 `python3 scripts/concept_management/generate_concept_index.py` を実行し、`concepts/concept-index.json` と `concepts/search-index.json` が正しく生成されることを確認
- [x] T011 `js/concept-engine/ConceptLoader.js` を実装: `loadConceptIndex(): Promise`, `loadSearchIndex(): Promise`, `loadServiceNode(id): Promise`。内部キャッシュ `Map<string, Promise>` でPromise共有。フェッチ失敗時は `null`/`[]` を返す（エラーをthrowしない）。`_basePath = "/aws_sap_studying/concepts/"` を設定
- [x] T012 `js/concept-engine/ConceptIndex.js` を実装: `init(manifest)`, `getById(id)`, `getByLayer(layer)`, `getByType(type)`, `getChildren(parentId)`。内部Map `_byId`, `_byLayer`, `_byType` を構築。`contracts/js-engine-api.md` §2 の仕様に準拠
- [x] T013 `concept-map.html` に `window.ConceptEngine` グローバルオブジェクト初期化コードを追加: `DOMContentLoaded` 時に `ConceptEngine.loader.loadConceptIndex()` を呼び出し → `ConceptEngine.index.init()` → 初期ツリー描画関数を呼び出すエントリーポイント

**Checkpoint**: Phase 2 完了 → concept-index.json が読み込まれ ConceptIndex が初期化できる状態。ユーザーストーリー実装を開始可能

---

## Phase 3: US1 - 階層ナビゲーション (Priority: P1) 🎯 MVP

**Goal**: Layer0設計軸を起点にLayer4キーワードまでアコーディオンで探索できる

**Independent Test**: ブラウザで `http://localhost:8080/concept-map.html` を開き、Layer0「Availability」クリック → Layer1展開 → Route53クリック → Layer3概念表示 → Layer4キーワード展開が3クリック以内で完了すること（SC-001）

### Implementation for User Story 1

- [x] T014 [P] [US1] MVP サービスJSON 5ファイルを `concepts/services/` に作成: `svc-vpc.json`, `svc-ec2.json`, `svc-s3.json`, `svc-rds.json`, `svc-lambda.json`（T008 と同形式、各サービスの特性に合わせた axis_tags + sap_domains + key_concepts）
- [x] T015 [P] [US1] MVP サービスJSON 4ファイルを `concepts/services/` に作成: `svc-elb.json`, `svc-cloudfront.json`, `svc-iam.json`, `svc-cloudwatch.json`（svc-elb には Route53との `crosslinks[related]` を含む）
- [x] T016 [US1] `concept-map.html` にアコーディオンツリー描画関数を実装: `ConceptEngine.index.getByLayer(0)` でLayer0ノード取得 → Layer0ボタン一覧を DOM に描画。Layer0クリック時: 関連 Layer1 ノード（`getByLayer(1)` + axis_tags フィルタ）を展開（T014, T015 に依存）
- [x] T017 [US1] `concept-map.html` に Layer1→Layer2 展開ロジックを実装: Layer1クリック時に `getChildren(domainId)` でLayer2ノード取得 → `ConceptEngine.loader.loadServiceNode(id)` でオンデマンドフェッチ → Layer2ボタン一覧を展開
- [x] T018 [US1] `concept-map.html` に Layer2→Layer3→Layer4 展開ロジックを実装: Layer2クリック時にロード済みServiceNodeの `key_concepts[]` からLayer3一覧を描画 → Layer3クリックで `keywords[]` のLayer4一覧を展開（T017 に依存）
- [x] T019 [US1] `css/pages/concept-map.css` にアコーディオンアニメーション CSS を実装: `max-height` トランジション（0 → auto）、Layer0〜4の視覚的インデント・アイコン・色分け、WCAG 2.1 AA カラーコントラスト（`#374151` テキスト・`#dc7600` アクセント）
- [x] T020 [US1] `generate_concept_index.py` を再実行して全10サービスを `concept-index.json` / `search-index.json` に反映。ブラウザでLayer0→Layer4ナビゲーションが動作することを手動確認

**Checkpoint**: US1 完了 → アコーディオンナビゲーションが単独で動作。MVP デモ可能

---

## Phase 4: US2 - 横断検索 (Priority: P2)

**Goal**: 検索ボックスから全レイヤーを横断して300ms以内に検索結果を表示できる

**Independent Test**: 検索バーに「フェイルオーバー」と入力して300ms以内に結果が現れ、結果クリックで該当ノードへスクロール・展開されること（US2 AC-1, AC-2, AC-3, SC-002）

### Implementation for User Story 2

- [x] T021 [US2] `js/concept-engine/SearchEngine.js` を実装: `init(entries)` で `_flat` プロパティ付与（`[name_ja, name_en, description_ja, sap_tip, ...tags].join(" ").toLowerCase()`）、`search(query)` で `String.includes()` マッチング（3文字未満は `[]`）、結果を layer 昇順ソート・最大100件。`contracts/js-engine-api.md` §4 仕様に準拠
- [x] T022 [US2] `concept-map.html` に検索バー HTML を追加: `<input type="search">` + 結果コンテナ `<ul>` の構造。初回フォーカス時に `ConceptEngine.loader.loadSearchIndex()` を遅延トリガーし `ConceptEngine.search.init()` を呼び出す
- [x] T023 [US2] `concept-map.html` に検索デバウンスと結果表示ロジックを実装: `setTimeout`(300ms) + `clearTimeout` パターン。入力値を `ConceptEngine.search.search(query)` に渡し、結果リストを DOM に描画。0件時は「一致する概念が見つかりませんでした」を表示（US2 AC-4）
- [x] T024 [US2] `concept-map.html` に検索結果クリックハンドラを実装: クリック時に対象ノードの `id` でツリーの親階層を自動展開 → 該当ノードまで `scrollIntoView()` （US2 AC-2）
- [x] T025 [US2] `css/pages/concept-map.css` に検索バーと結果リストのスタイルを追加: フォーカス状態・結果ドロップダウン・ハイライト表示・ダークモード対応

**Checkpoint**: US2 完了 → 階層ナビゲーション + 横断検索が独立して動作

---

## Phase 5: US3 - タグフィルタリング (Priority: P2)

**Goal**: 設計軸タグ・SAPドメインタグで関連サービス・概念を絞り込み表示できる

**Independent Test**: 「sap-d2-new-solutions」タグを選択したとき、そのSAPドメインに関連するサービスのみが表示され、クリアボタンで全ノードが再表示されること（US3 AC-1, AC-2, AC-3, SC-008）

### Implementation for User Story 3

- [x] T026 [US3] `js/concept-engine/TagSystem.js` を実装: `toggleAxisTag(tagId)`, `toggleSapDomain(domainId)`, `clearAll()`, `getActiveFilters()`, `matchesNode(entry)`, `onChange(callback)`。OR+AND フィルタロジック（axis_tags OR条件 かつ sap_domains OR条件）、空フィルタグループは無視。`contracts/js-engine-api.md` §5 仕様に準拠
- [x] T027 [US3] `concept-map.html` にタグフィルタパネル HTML を追加: 設計軸タグボタン8個（axis-* から動的生成）+ SAPドメインタグボタン4個 + 「クリア」ボタン。タグ選択状態の視覚フィードバック（active クラス）
- [x] T028 [US3] `concept-map.html` にタグフィルタとツリーの連動ロジックを実装: `ConceptEngine.tags.onChange()` コールバックで `matchesNode()` を全ノードに適用 → 非マッチノードを `display:none`、マッチノードを表示（US3 AC-1, AC-2）
- [x] T029 [US3] `concept-map.html` に検索+タグフィルタのAND複合ロジックを実装: 検索クエリ AND タグフィルタ条件を同時評価。両方の条件を満たすノードのみ表示（FR-008, US3 AC-4）
- [x] T030 [US3] `css/pages/concept-map.css` にタグフィルタパネルのスタイルを追加: タグボタン（通常・選択・ホバー状態）・レスポンシブ折り返し・ダークモード対応

**Checkpoint**: US3 完了 → ナビゲーション + 検索 + タグフィルタが独立して動作。P1 MVP + P2 Feature 完成

---

## Phase 6: US4 - クロスリンク探索 (Priority: P3)

**Goal**: Route53 等のサービスから関連サービスのバッジへ移動できる

**Independent Test**: Route53 Layer2ノード展開時に「関連: ELB」バッジが表示され、クリックでELBノードに移動・展開されること（US4 AC-1, AC-2）

### Implementation for User Story 4

- [x] T031 [US4] `js/concept-engine/CrossLinkResolver.js` を実装: `build(serviceNodes)` で `_reverseIndex: Map<targetId, ReverseEntry[]>` を構築（target_id 不存在時は除外 + `console.warn()`）、`getOutbound(nodeId)`, `getInbound(nodeId)`, `isBuilt()`。`contracts/js-engine-api.md` §3 仕様に準拠
- [x] T032 [US4] `concept-map.html` の Layer2 展開ハンドラに CrossLinkResolver 統合を追加: ServiceNodeロード後に `CrossLinkResolver.build()` を差分更新 → `getOutbound(serviceId)` でバッジデータ取得 → 「関連サービス」セクションに `<span class="crosslink-badge">` を描画（US4 AC-1）
- [x] T033 [US4] `concept-map.html` にクロスリンクバッジのクリックハンドラを実装: バッジクリック時にターゲットノードまでツリーを展開 + `scrollIntoView()`（US4 AC-2）
- [x] T034 [US4] `css/pages/concept-map.css` にクロスリンクバッジのスタイルを追加: バッジデザイン（タイプ別色分け: related/extends/requires）・ホバー効果・ダークモード対応

**Checkpoint**: US4 完了 → 全4ユーザーストーリーが動作。フル機能完成

---

## Phase 7: Polish & 品質保証・統合

**Purpose**: Constitution Quality Gates の全通過 + 既存サイトへの統合 + デプロイ

- [x] T035 [P] `python3 scripts/ci/validate_html_w3c.py --files concept-map.html` を実行し、W3C HTML 検証に合格すること（SC-007, Constitution Principle IV）
- [x] T036 [P] `python3 scripts/accessibility/check_contrast_ratio.py` を実行し、WCAG 2.1 AA コントラスト基準を全UIコンポーネントが満たすこと（SC-006, Constitution Principle IV）
- [x] T037 [P] `node -c js/concept-engine/ConceptLoader.js js/concept-engine/ConceptIndex.js js/concept-engine/CrossLinkResolver.js js/concept-engine/SearchEngine.js js/concept-engine/TagSystem.js` で JavaScript 構文チェックを実行
- [x] T038 `python3 scripts/concept_management/generate_concept_index.py --validate` を実行し、全10サービスのID一意性・必須フィールド・crosslinks ターゲット存在確認が通ること
- [x] T039 [P] `data.js` の `updateHistory[]` 配列の先頭に概念マップ追加エントリを prepend（`type: 'feature'`, `title: 'AWS概念マップ エンジン'`, `description: '5階層知識エンジン・横断検索・タグフィルタを追加'`）（CLAUDE.md Three-Place Update Rule）
- [x] T040 [P] `index.js` の `searchData[]` 配列に `concept-map.html` のエントリを追加（CLAUDE.md Three-Place Update Rule）
- [x] T041 `python3 scripts/ci/check_data_integrity.py` で `data.js` ↔ `index.js` の整合性を確認
- [ ] T042 ブラウザで 320px・768px・1280px・1920px 幅のレスポンシブ表示を手動確認（SC-005, FR-010）
- [ ] T043 ブラウザの OS ダークモード設定で `prefers-color-scheme: dark` が正しく適用されることを確認（FR-009）
- [ ] T044 `git add concepts/ js/concept-engine/ css/pages/concept-map.css concept-map.html scripts/concept_management/ data.js index.js` → `git commit` → `git push origin gh-pages`（Constitution Deployment Standard: コミット直後にプッシュ必須）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし → 即時開始可能
- **Foundational (Phase 2)**: Phase 1 完了後 → **全ユーザーストーリーをブロック**
- **US1 (Phase 3)**: Phase 2 完了後 → MVP デモ可能
- **US2 (Phase 4)**: Phase 2 完了後 → US1 と独立して開始可能（ただし US1 後を推奨）
- **US3 (Phase 5)**: Phase 2 完了後 → US2 の完了を待たずに開始可能
- **US4 (Phase 6)**: Phase 2 完了後 → US1〜US3 と独立して開始可能
- **Polish (Phase 7)**: 実装したいユーザーストーリーが完了後

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に開始。他ストーリーへの依存なし
- **US2 (P2)**: Phase 2 完了後に開始。US1 コンポーネントを再利用するが独立テスト可能
- **US3 (P2)**: Phase 2 完了後に開始。US2 と並列開始可能
- **US4 (P3)**: Phase 2 完了後に開始。US1 の ServiceNode ロード機構を再利用

### 各ユーザーストーリー内の依存関係

```
Phase 3 (US1):
  T014, T015 [P] ← 並列実行可能（異なるサービスファイル）
  T016 ← T013, T014, T015 に依存
  T017 ← T016 に依存
  T018 ← T017 に依存
  T019 [P] ← T016〜T018 と並列（CSS）
  T020 ← T018 に依存

Phase 4 (US2):
  T021 ← 独立（SearchEngine モジュール）
  T022 ← T021 に依存
  T023 ← T022 に依存
  T024 ← T023 に依存
  T025 [P] ← T023〜T024 と並列（CSS）
```

---

## Parallel Opportunities

### Phase 1 並列実行例

```bash
# 同時実行可能（全て異なるファイル）:
T002 concept-map.html 骨格作成
T003 generate_concept_index.py ファイル作成
T004 概念マップ骨格
T005 concept-map.css スタイル骨格
```

### Phase 2 並列実行例

```bash
# T006 + T007 は同時実行可能（axes/ と domains/ は独立）:
T006 8 AxisNode JSON ファイル作成
T007 8 DomainNode JSON ファイル作成

# T011 + T012 も並列可能（ConceptLoader と ConceptIndex は独立モジュール）:
T011 ConceptLoader.js 実装
T012 ConceptIndex.js 実装
```

### Phase 3 (US1) 並列実行例

```bash
# T014 + T015 + T019 は同時実行可能:
T014 VPC, EC2, S3, RDS, Lambda JSON 作成
T015 ELB, CloudFront, IAM, CloudWatch JSON 作成
T019 アコーディオン CSS 実装
```

---

## Implementation Strategy

### MVP First（US1 のみ）

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了（**必須**: 全ストーリーをブロック）
3. Phase 3: US1 完了
4. **STOP & VALIDATE**: `http://localhost:8080/concept-map.html` でLayer0→Layer4ナビゲーション確認
5. W3C検証・WCAG確認（T035, T036）→ `git push` でデプロイ

### Incremental Delivery

1. Phase 1 + Phase 2 → 基盤完成
2. Phase 3 (US1) → 階層ナビゲーション **MVP デプロイ**
3. Phase 4 (US2) → 横断検索追加 **デプロイ**
4. Phase 5 (US3) → タグフィルタ追加 **デプロイ**
5. Phase 6 (US4) → クロスリンク探索追加 **デプロイ**
6. Phase 7 → 品質保証 + 既存サイト統合 + 最終デプロイ

---

## Notes

- `[P]` タスク = 異なるファイル操作、依存関係なし → 並列実行可
- `[USn]` ラベル = spec.md のユーザーストーリーとのトレーサビリティ
- Constitution 制約: `/aws_sap_studying/` パスプレフィックス・`<h2>/<h3>` セマンティクス・W3C検証・WCAG2.1AA
- `generate_concept_index.py` はデータ変更のたびに再実行する（`concept-index.json` / `search-index.json` は手動編集禁止）
- `svc-*.json` の `crosslinks[]` には `type:"axis_tag"` を含めない（`axis_tags[]` が正規ソース）
- 新サービスJSON追加の詳細手順は `quickstart.md` を参照
