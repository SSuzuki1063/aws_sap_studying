# Feature Specification: AWS概念マップ＋階層用語集エンジン

**Feature Branch**: `001-aws-concept-hierarchy`
**Created**: 2026-02-21
**Status**: Draft
**Input**: User description: "AWS概念マップ＋階層用語集エンジン — AWSの概念構造(Concept Hierarchy)を表現する拡張可能な知識エンジン"

---

## 概念エンジン・アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────────────┐
│               AWS Concept Hierarchy Engine                          │
│                    (知識エンジン全体像)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  DATA LAYER（データ層）                                       │  │
│  │                                                              │  │
│  │  concept-index.json          ← 全ノードのメタデータ索引       │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │ concepts/                                              │ │  │
│  │  │   axes/          ← Layer0: 設計軸 (axis-*.json)        │ │  │
│  │  │   domains/       ← Layer1: ドメイン (domain-*.json)    │ │  │
│  │  │   services/      ← Layer2: サービス (svc-*.json)       │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                          ↓ fetch & parse                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ENGINE LAYER（エンジン層）— Vanilla JS                      │  │
│  │                                                              │  │
│  │  ConceptLoader   — JSONフェッチ・キャッシュ・遅延ロード       │  │
│  │  ConceptIndex    — 全ノードをIDでO(1)参照可能なMap構造        │  │
│  │  CrossLinkResolver — クロスリンクをグラフエッジとして解決     │  │
│  │  SearchEngine    — 全文検索 + タグフィルタリング              │  │
│  │  TagSystem       — 設計軸タグ・SAPドメインタグの統合管理      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                          ↓ render                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  UI LAYER（表示層）                                           │  │
│  │                                                              │  │
│  │  AccordionTree   — 階層アコーディオン (L0→L1→L2→L3→L4)       │  │
│  │  SearchBar       — リアルタイム横断検索                       │  │
│  │  TagFilter       — 設計軸・SAPドメイン タグフィルタ           │  │
│  │  CrossLinkBadge  — 他ノードへの参照バッジ表示                 │  │
│  │  [拡張] MermaidViewer  — グラフ可視化                        │  │
│  │  [拡張] D3GraphViewer  — インタラクティブグラフ               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Clarifications

### Session 2026-02-21

- Q: クロスリンクの双方向解決ストラテジーは？ → A: ランタイム自動生成（Option A）：JSONロード完了後にCrossLinkResolverが`reverseIndex`マップを構築し、A→Bの定義からBへの逆参照エントリを自動生成する
- Q: ConceptNodeの継承モデルは？ → A: 判別共用体（Option B）：`type`フィールドを判別子とした単一ConceptNodeスキーマ。`if/then`条件で型別フィールドを追加し、RDF `rdf:type`と1:1対応させる
- Q: `concept-index.json`の生成・保守ストラテジーは？ → A: Pythonスクリプト自動生成（Option A）：`generate_concept_index.py`がソースJSONを走査して索引を再生成。既存`update_counts.py`と同パターン
- Q: 検索用フラットインデックスの設計は？ → A: 専用`search-index.json`（Option A）：`name_ja/en`, `description_ja`, `sap_tip`, `tags`を全ノード分フラット化した別ファイル。`concept-index.json`は軽量ナビゲーション用途に保ち、検索バー初回使用時に遅延フェッチする
- Q: `axis_tags`フィールドと`crosslinks[type=axis_tag]`の二重表現をどう解消するか？ → A: `axis_tags`を正規ソースに統一（Option A）：`crosslinks`から`type:"axis_tag"`エントリを削除。`crosslinks`はサービス間関係（`related/extends/requires`）のみに限定する

---

## 階層モデル定義書

### レイヤー構造

| Layer | 名称 | 説明 | 例 | ノード数目安 |
|-------|------|------|----|-------------|
| **Layer0** | 設計軸 (Design Axis) | AWSアーキテクチャ設計の横断的な軸。複数ドメインを貫く関心事 | Availability, DR, Governance, Security, Cost, Performance, Scalability | 8〜12 |
| **Layer1** | ドメイン (Domain) | AWSサービスの機能カテゴリ | Network, Compute, Storage, Database, Data, ML, Security, Management | 10〜15 |
| **Layer2** | サービス (Service) | 具体的なAWSサービス | Route53, VPC, EC2, S3, RDS, Lambda | 100〜200 |
| **Layer3** | 重要概念 (Key Concept) | サービスを理解するための中核概念 | ヘルスチェック, フェイルオーバー, ルーティングポリシー | 10〜15 per service |
| **Layer4** | キーワード (Keyword) | 概念の詳細説明・用語定義 | Weighted Routing, Latency-based Routing | 5〜10 per concept |

### 構造設計判断：ハイブリッド木＋グラフ

**基本構造**: 木構造（親子関係）

各ノードは `parentId` で一意の親を持つ。UI表示・ナビゲーションは木構造をベースとする。

**拡張構造**: クロスリンク（グラフエッジ）

木構造では表現できない多対多の関係を `crosslinks` フィールドで表現する。

```
クロスリンクの種類（サービス間関係のみ）:
  related      ← 同レイヤー間の関連 (例: Route53 ↔ ELB)
  extends      ← 概念の拡張関係 (例: Multi-AZ extends Availability)
  requires     ← 依存関係 (例: PrivateLink requires VPC)

※ axis_tag / sap_tag は crosslinks では管理しない。
   設計軸への帰属は axis_tags フィールド（正規ソース）で一元管理する。
   SAPドメイン帰属は sap_domains フィールドで一元管理する。
```

**設計判断理由**:
- 純粋グラフ構造はUI実装が複雑になり、静的サイトに不向き
- 純粋木構造はAWSサービスの横断的性質を表現できない
- ハイブリッド方式により「木でナビゲート、グラフで関連探索」を両立
- `crosslinks` を分離フィールドにすることで木構造データを汚染しない

---

## ID命名規則仕様

### 命名パターン

```
{prefix}-{identifier}
```

| Layer | prefix | identifier | 例 | 完全ID |
|-------|--------|------------|----|-------|
| Layer0 (設計軸) | `axis` | 設計軸名（snake_case, 英語） | `availability` | `axis-availability` |
| Layer1 (ドメイン) | `dom` | ドメイン名（snake_case, 英語） | `network` | `dom-network` |
| Layer2 (サービス) | `svc` | AWSサービス名（小文字, ハイフン区切り） | `route53` | `svc-route53` |
| Layer3 (重要概念) | `con` | サービスID + 概念名 | `route53-health-check` | `con-route53-health-check` |
| Layer4 (キーワード) | `kw` | 概念ID + キーワード名 | `route53-health-check-active-passive` | `kw-route53-health-check-active-passive` |
| クロスリンク | `cl` | ソースID + ターゲットID + タイプ | `svc-route53-axis-availability-axis_tag` | `cl-svc-route53-axis-availability-axis_tag` |

### ID設計原則

1. **グローバル一意性**: リポジトリ全体で重複しない
2. **予測可能性**: IDからレイヤーと帰属が一目でわかる
3. **GraphDB互換**: RDFトリプルの主語・述語・目的語として直接使用可能
4. **URL安全**: ハイフン・英数字のみ（日本語・スペース禁止）
5. **不変性**: 一度付与したIDは変更しない（変更時は `deprecated_id` フィールドで追跡）

### GraphDB移行パス

```
現在 (JSON): "id": "svc-route53"
将来 (RDF):  <https://aws-concepts.example/svc-route53>
SPARQL:      ?s ?p <https://aws-concepts.example/svc-route53>
```

---

## JSONスキーマ完全定義

### ConceptNode 基底スキーマ（判別共用体ベース）

全ノード型の共通フィールドを定義する基底スキーマ。`type` フィールドが判別子として機能し、各サブタイプのスキーマは `if/then` 条件で型別フィールドを追加する。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12",
  "type": "object",
  "required": ["id", "layer", "type", "name_ja", "name_en", "description_ja"],
  "properties": {
    "id":             { "type": "string", "description": "グローバル一意ID（prefix-identifier形式）" },
    "layer":          { "type": "integer", "enum": [0, 1, 2, 3, 4] },
    "type":           { "type": "string", "enum": ["axis", "domain", "service", "concept", "keyword"] },
    "name_ja":        { "type": "string" },
    "name_en":        { "type": "string" },
    "description_ja": { "type": "string" },
    "_meta": {
      "type": "object",
      "properties": {
        "created":       { "type": "string", "format": "date" },
        "updated":       { "type": "string", "format": "date" },
        "version":       { "type": "string" },
        "deprecated_id": { "type": "string", "description": "旧IDを記録（ID変更時のみ）" }
      }
    }
  }
}
```

### Layer0: 設計軸スキーマ (`axis-*.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12",
  "type": "object",
  "required": ["id", "layer", "type", "name_ja", "name_en", "description_ja"],
  "properties": {
    "id":           { "type": "string", "pattern": "^axis-[a-z0-9_-]+$" },
    "layer":        { "type": "integer", "const": 0 },
    "type":         { "type": "string", "const": "axis" },
    "name_ja":      { "type": "string" },
    "name_en":      { "type": "string" },
    "description_ja": { "type": "string" },
    "sap_domains":  { "type": "array", "items": { "type": "string" } },
    "tags":         { "type": "array", "items": { "type": "string" } },
    "_meta": {
      "type": "object",
      "properties": {
        "created":  { "type": "string", "format": "date" },
        "updated":  { "type": "string", "format": "date" },
        "version":  { "type": "string" },
        "deprecated_id": { "type": "string" }
      }
    }
  }
}
```

**具体例**:
```json
{
  "id": "axis-availability",
  "layer": 0,
  "type": "axis",
  "name_ja": "可用性",
  "name_en": "Availability",
  "description_ja": "システムが要求された時に正常に動作し続ける能力。Multi-AZ、フェイルオーバー、ヘルスチェックが代表的なAWSパターン。",
  "sap_domains": ["sap-d1-org-governance", "sap-d2-new-solutions"],
  "tags": ["resilience", "uptime"],
  "_meta": { "created": "2026-02-21", "version": "1.0.0" }
}
```

---

### Layer2: サービススキーマ (`svc-*.json`) ← 最重要

```json
{
  "required": ["id", "layer", "type", "name_ja", "name_en", "description_ja", "parent_domain_id"],
  "properties": {
    "id":              { "type": "string", "pattern": "^svc-[a-z0-9-]+$" },
    "layer":           { "type": "integer", "const": 2 },
    "type":            { "type": "string", "const": "service" },
    "name_ja":         { "type": "string" },
    "name_en":         { "type": "string" },
    "description_ja":  { "type": "string", "description": "SAP試験観点での重要ポイントを含む" },
    "parent_domain_id": { "type": "string", "pattern": "^dom-[a-z0-9_-]+$" },
    "resource_url":    { "type": "string", "description": "省略可: このリポジトリ内のHTMLリソースパス" },
    "axis_tags":       { "type": "array", "items": { "type": "string" }, "description": "Layer0設計軸IDのリスト" },
    "sap_domains":     {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "sap-d1-org-governance",
          "sap-d2-new-solutions",
          "sap-d3-migration",
          "sap-d4-cost-optimization"
        ]
      }
    },
    "tags":            { "type": "array", "items": { "type": "string" } },
    "key_concepts":    {
      "type": "array",
      "minItems": 10,
      "maxItems": 15,
      "items": { "description": "Layer3重要概念をインライン埋め込み" }
    },
    "crosslinks":      { "type": "array" },
    "_meta":           { "description": "作成日・バージョン・deprecated_idを管理" }
  }
}
```

#### Layer3 KeyConcept / Layer4 Keyword 拡張フィールド（すべて optional）

```json
{
  "explanation_basic": "初心者向け説明（比喩・日常語）",
  "explanation_arch":  "設計観点での説明（SAP 試験視点）",
  "concept_diagram": {
    "type":    "decision_tree | comparison | flow",
    "title":   "図タイトル",
    "nodes":   [...],
    "edges":   [...],
    "columns": [...],
    "rows":    [...]
  }
}
```

`concept_diagram` が省略された場合 → 📊 トグルを非表示にする（後方互換）。

##### concept_diagram ノード定義（decision_tree / flow 共通）

```json
{
  "id":              "文字列（図内ユニーク）",
  "label":           "表示テキスト（\\n で改行）",
  "shape":           "rect | diamond | pill",
  "style":           "default | highlight | muted",
  "link_service_id": "svc-xxx（任意、クリック遷移用）"
}
```

##### エッジ定義

```json
{ "from": "node-id", "to": "node-id", "label": "ラベル（任意）" }
```

##### comparison 型（nodes/edges 不要）

```json
{
  "type":    "comparison",
  "title":   "購入オプション比較",
  "columns": ["購入タイプ", "割引率", "柔軟性", "適用範囲"],
  "rows": [
    { "cells": ["Reserved Instances", "最大72%", "低", "EC2 特化"],  "style": "highlight" },
    { "cells": ["Savings Plans",       "最大66%", "中", "EC2+Lambda+Fargate"], "style": "default" }
  ]
}
```

```json
// 旧 _future フィールド（削除済み — concept_diagram に統合）
```

**具体例 (Route53)**:
```json
{
  "id": "svc-route53",
  "layer": 2,
  "type": "service",
  "name_ja": "Amazon Route 53",
  "name_en": "Amazon Route 53",
  "description_ja": "AWSのDNSサービス。ヘルスチェックとフェイルオーバーによる高可用性DNS、レイテンシー・地理的・加重ルーティングでDR設計の要となる。SAP試験では複合ルーティングポリシーの組み合わせが頻出。",
  "parent_domain_id": "dom-network",
  "resource_url": "/aws_sap_studying/networking/route53-comprehensive-guide.html",
  "axis_tags": ["axis-availability", "axis-dr", "axis-performance"],
  "sap_domains": ["sap-d1-org-governance", "sap-d2-new-solutions"],
  "tags": ["dns", "routing", "failover"],
  "key_concepts": [
    {
      "id": "con-route53-health-check",
      "layer": 3,
      "type": "concept",
      "name_ja": "ヘルスチェック",
      "name_en": "Health Check",
      "description_ja": "エンドポイントの死活監視。HTTP/HTTPS/TCPプロトコル対応。フェイルオーバールーティングと連携。",
      "axis_tags": ["axis-availability", "axis-dr"],
      "sap_tip": "SAP試験ではRPO/RTOとフェイルオーバーモード選択の根拠を問われる",
      "keywords": [
        {
          "id": "kw-route53-health-check-active-passive",
          "layer": 4,
          "type": "keyword",
          "name_ja": "Active-Passive フェイルオーバー",
          "name_en": "Active-Passive Failover",
          "description_ja": "プライマリリソースが正常な間はプライマリにルーティング。障害時にセカンダリへ自動切り替え。RPO≒0が求められるDR設計で使用。",
          "axis_tags": ["axis-availability", "axis-dr"],
          "sap_tip": "Active-Passive vs Active-Active選択の根拠を問われる"
        }
      ]
    }
  ],
  "crosslinks": [
    { "target_id": "svc-elb", "type": "related", "description_ja": "ELBとRoute53を組み合わせたフェイルオーバー設計" }
  ],
  "_meta": { "created": "2026-02-21", "version": "1.0.0" }
}
```

---

### concept-index.json（全ノード索引）

```json
{
  "version": "1.0.0",
  "generated": "2026-02-21",
  "total_nodes": 0,
  "nodes": [
    {
      "id": "svc-route53",
      "layer": 2,
      "type": "service",
      "name_ja": "Amazon Route 53",
      "name_en": "Amazon Route 53",
      "file": "concepts/services/svc-route53.json",
      "axis_tags": ["axis-availability", "axis-dr"],
      "sap_domains": ["sap-d1-org-governance"],
      "tags": ["dns", "routing"]
    }
  ]
}
```

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 階層ナビゲーション (Priority: P1)

SAP受験者が試験勉強中に「Availability（可用性）」という設計軸を起点として、関連するAWSサービスと重要概念を階層的に探索できる。

**Why this priority**: 階層ナビゲーションはエンジンの核心機能。これなしでは他の機能（検索・タグフィルタ）の存在意義がない。

**Independent Test**: Layer0のAvailability軸をクリックしたとき、Route53・ELB・Auto ScalingなどのLayer2サービスが展開され、さらに各サービスのLayer3概念・Layer4キーワードまでアコーディオン展開できる。

**Acceptance Scenarios**:

1. **Given** 概念マップページを開いている、**When** Layer0「Availability」軸をクリックする、**Then** Availabilityに関連するLayer1ドメイン一覧がアコーディオン展開される
2. **Given** Layer1「Network」ドメインが展開されている、**When** Layer2「Route53」をクリックする、**Then** Route53のLayer3重要概念（10〜15個）が表示される
3. **Given** Layer3「ヘルスチェック」が表示されている、**When** クリックする、**Then** Layer4キーワード（5〜10個）と各説明文が表示される
4. **Given** Layer4まで展開されている、**When** 別のLayer3概念をクリックする、**Then** 前の展開が閉じ、新しい概念が展開される

---

### User Story 2 - 横断検索 (Priority: P2)

SAP受験者が「Weighted Routing」という用語を知っているが、どのレイヤー・サービスに属するかわからない状態でも、検索ボックスから全階層を横断して即座に発見できる。

**Why this priority**: 階層ナビゲーションは「知っている構造から辿る」機能。横断検索は「用語から逆引きする」機能。両方あって初めて知識エンジンとして機能する。

**Independent Test**: 検索ボックスに「Weighted」と入力したとき、Route53のWeighted Routingキーワード（Layer4）が検索結果として表示され、クリックすると該当箇所に移動できる。

**Acceptance Scenarios**:

1. **Given** 概念マップページを開いている、**When** 検索ボックスに「フェイルオーバー」と入力する、**Then** フェイルオーバーを含む全レイヤーのノードがリアルタイムにフィルタリングされて表示される
2. **Given** 検索結果が表示されている、**When** 結果アイテムをクリックする、**Then** 該当ノードまで自動スクロールし、親階層が自動展開される
3. **Given** 検索ボックスに入力中、**When** 3文字以上入力する、**Then** 検索結果が300ms以内に更新される（デバウンス付き）
4. **Given** 検索結果が0件、**When** 結果エリアを見る、**Then** 「一致する概念が見つかりませんでした」と表示される

---

### User Story 3 - タグフィルタリング (Priority: P2)

SAP受験者がSAP試験の特定ドメイン（例：「Domain 2: New Solutions Design」）を集中して勉強したいとき、そのドメインに関連するサービス・概念のみに絞り込んで学習できる。

**Why this priority**: SAP試験は4つのドメインで構成されており、ドメイン別学習は受験戦略の基本。タグフィルタはこの学習スタイルを直接サポートする。

**Independent Test**: 「sap-d2-new-solutions」タグを選択したとき、そのSAPドメインに関連するサービスのみが表示され、関係ないサービスは非表示になる。

**Acceptance Scenarios**:

1. **Given** タグフィルタパネルが表示されている、**When** 設計軸「DR（障害復旧）」タグを選択する、**Then** DR設計に関連するサービス・概念のみが表示される
2. **Given** 複数タグを選択している、**When** タグフィルタはOR条件で動作する、**Then** いずれかのタグを持つノードが全て表示される
3. **Given** タグフィルタが適用されている、**When** 「クリア」ボタンをクリックする、**Then** 全ノードが再表示される
4. **Given** タグフィルタと検索を同時に使用している、**When** 検索とフィルタを組み合わせる、**Then** 両条件を満たすノードのみが表示される（AND条件）

---

### User Story 4 - クロスリンク探索 (Priority: P3)

SAP受験者がRoute53のサービスページを見ているとき、「関連サービス」バッジからELB・CloudFrontなど横断的な関連サービスへ移動できる。

**Why this priority**: クロスリンクはグラフ的知識探索の入口。P1・P2が完成してから追加することで段階的実装が可能。

**Independent Test**: Route53サービスノードに「関連: ELB」バッジが表示され、クリックするとELBノードに移動できる。

**Acceptance Scenarios**:

1. **Given** Route53のLayer2ノードが展開されている、**When** 「関連サービス」セクションを見る、**Then** クロスリンク定義に基づいた関連サービスのバッジが表示される
2. **Given** クロスリンクバッジが表示されている、**When** 「ELB」バッジをクリックする、**Then** ELBのノードまで移動し、該当階層が自動展開される

---

### Edge Cases

- Layer2サービスのJSONファイルが存在しない場合：スケルトン表示（「準備中」）で他の機能は継続動作
- 検索クエリに正規表現特殊文字が含まれる場合：エスケープ処理してクラッシュを防ぐ
- クロスリンクの参照先IDが存在しない場合：バッジ表示はスキップし、コンソール警告のみ（エラー表示しない）。`reverseIndex`構築時も該当エントリは除外する
- ネットワーク未接続でJSONフェッチ失敗の場合：キャッシュ済みデータがあれば表示、なければエラーメッセージを表示
- 非常に長い概念名（50文字超）：省略表示（...）とツールチップで全文表示
- スマートフォン縦向き（320px幅）でのアコーディオン：タッチ操作に対応し、横スクロールが発生しない

---

## Requirements *(mandatory)*

### Functional Requirements

**データ管理**

- **FR-001**: システムは全概念ノードを `concept-index.json` で索引管理し、O(1)のID参照を提供しなければならない。`concept-index.json`は`generate_concept_index.py`スクリプト（既存`update_counts.py`と同パターン）によって自動生成され、新しいサービスJSONを追加した後にスクリプトを実行することで索引が最新化される
- **FR-002**: Layer2（サービス）のデータは個別JSONファイル（`svc-*.json`）として分離管理できなければならない
- **FR-003**: 全ノードはグローバル一意IDを持ち、ID命名規則（prefix + 識別子）に従わなければならない
- **FR-004**: クロスリンクはソースノードの `crosslinks` 配列で定義し、ターゲットIDで参照しなければならない。CrossLinkResolverは全JSONロード完了後に`reverseIndex: Map<targetId, CrossLinkEntry[]>`を自動構築し、B側からA→Bの被参照情報をO(1)で取得可能にしなければならない

**UI機能**

- **FR-005**: Layer0→Layer1→Layer2→Layer3→Layer4の順でアコーディオン展開しなければならない
- **FR-006**: 検索ボックスは名前（日本語・英語）・説明文・タグ・SAP Tipを横断検索しなければならない。検索データソースは専用の`search-index.json`（全ノードのフラット配列：`id`, `layer`, `type`, `name_ja`, `name_en`, `description_ja`, `sap_tip`, `tags`フィールドを含む）を使用し、検索バー初回フォーカス時に遅延フェッチする
- **FR-006a**: `search-index.json`は`generate_concept_index.py`と同一スクリプトまたは同時実行スクリプトによって自動生成されなければならない
- **FR-007**: タグフィルタは設計軸タグとSAPドメインタグを独立して選択できなければならない。設計軸タグのデータソースは各ノードの`axis_tags`フィールド（正規ソース）とし、`crosslinks`配列は参照しない
- **FR-008**: 検索とタグフィルタを同時適用した場合、AND条件で動作しなければならない
- **FR-009**: UIはダークモード（CSS `prefers-color-scheme: dark` メディアクエリ）に対応しなければならない
- **FR-010**: UIは320px〜1920px幅でレスポンシブに表示されなければならない

**拡張性**

- **FR-011**: `_future` フィールドにMermaid/D3用データを格納でき、エンジンはこれを無視して正常動作しなければならない
- **FR-012**: 新サービスのJSONファイルを追加するだけで、ページ再構築なしに反映されなければならない

### SAPドメインタグ仕様

| タグID | 正式名 |
|--------|--------|
| `sap-d1-org-governance` | Domain 1: Organizational Complexity and Governance |
| `sap-d2-new-solutions` | Domain 2: New Solutions Design |
| `sap-d3-migration` | Domain 3: Migration Planning |
| `sap-d4-cost-optimization` | Domain 4: Cost Optimization |

### Key Entities *(include if feature involves data)*

**継承モデル: 判別共用体（Discriminated Union）**

全ノードは `ConceptNode` を基底スキーマとし、`type` フィールドを判別子として型別フィールドを条件付きで追加する。RDF の `rdf:type` と 1:1 対応し、GraphDB 移行時に型情報をそのまま変換可能。

```
ConceptNode (基底: id, layer, type, name_ja, name_en, description_ja, _meta)
  ├── type="axis"     → AxisNode    (+ sap_domains, tags)
  ├── type="domain"   → DomainNode  (+ parent なし, service_ids)
  ├── type="service"  → ServiceNode (+ parent_domain_id, resource_url, axis_tags, sap_domains, key_concepts[], crosslinks[])
  ├── type="concept"  → KeyConcept  (+ parent_service_id, axis_tags, sap_tip, keywords[])
  └── type="keyword"  → Keyword     (+ parent_concept_id, axis_tags, sap_tip)
```

- **ConceptNode**: 全ノード共通の基底スキーマ。`type`判別子により各サブタイプに分岐。フィールド：`id`, `layer`, `type`, `name_ja`, `name_en`, `description_ja`, `_meta`
- **AxisNode (Layer0)**: 設計軸。複数のドメイン・サービスに横断的に帰属される。`sap_domains` で試験ドメインと紐付く
- **DomainNode (Layer1)**: AWSサービスの機能カテゴリ。`service_ids` で配下サービスを列挙
- **ServiceNode (Layer2)**: AWSサービス。`key_concepts` 配列でLayer3をインライン埋め込み保持。最も情報が豊富なノード
- **KeyConcept (Layer3)**: サービス内の重要概念。`keywords` 配列でLayer4を保持。`sap_tip` で試験観点を記録
- **Keyword (Layer4)**: 最小粒度の知識単位。`sap_tip` フィールドで試験観点を記録
- **CrossLink**: サービス間の関係エッジ。`type`（`related` / `extends` / `requires`）で関係種別を表現。JSONにはソース側のみ宣言し、CrossLinkResolverがランタイムに`reverseIndex`を構築して双方向解決を提供する。設計軸帰属は`axis_tags`フィールド、SAPドメイン帰属は`sap_domains`フィールドで管理するため、`crosslinks`には含めない
- **ConceptIndex**: 全ノードの軽量メタデータ索引（`concept-index.json`）。ナビゲーション・ID参照用途。フル詳細はservice JSONに委譲。`generate_concept_index.py`によって`concepts/`ディレクトリを走査して自動生成される
- **SearchIndex**: 全ノードの検索用フラット配列（`search-index.json`）。`name_ja`, `name_en`, `description_ja`, `sap_tip`, `tags`を含む。`concept-index.json`生成と同時に自動生成される。検索バー初回フォーカス時に遅延フェッチされる

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 学習者がLayer0設計軸を起点にLayer4キーワードまで辿り着くのに3クリック以内で完了できる
- **SC-002**: 検索クエリ入力から結果表示まで300ms以内（200サービスノード規模）。`search-index.json`は検索バー初回フォーカス時に遅延フェッチ済みの状態を前提とし、フェッチ完了後の検索レイテンシを計測する
- **SC-003**: 新サービスJSONファイル追加時、`generate_concept_index.py`実行 → `git push`のワークフローで1分以内にサイトへ反映される（ビルドプロセス不要）
- **SC-004**: 全200+サービスのJSONデータが存在する状態でも、初期ページロードが5秒以内に完了する（遅延ロード活用）
- **SC-005**: モバイル端末（スマートフォン）での全機能（ナビゲーション・検索・フィルタ）が操作可能であること
- **SC-006**: WCAG 2.1 AA コントラスト基準を全UIコンポーネントが満たすこと
- **SC-007**: W3C HTML Validation に全HTMLファイルが合格すること
- **SC-008**: SAP試験の4ドメイン全てに対して、ドメインタグでフィルタリングしたとき関連サービスが10件以上表示される

---

## 拡張方針ドキュメント

### フェーズ別実装ロードマップ

| フェーズ | 内容 | 前提条件 |
|---------|------|---------|
| **P1 MVP** | 階層ナビゲーション + 検索 + タグフィルタ | FR-001〜FR-012 |
| **P2** | クロスリンクバッジ・ジャンプナビゲーション | P1完了 |
| **P3** | Mermaid統合（サービス詳細パネル） | `_future.mermaid_diagram` フィールド活用 |
| **P4** | D3インタラクティブグラフ | `_future.d3_nodes` / `graph_position` 活用 |
| **P5** | GraphDB/SPARQL移行 | 現JSONをRDF URIとして変換 |

### GraphDB移行設計

現在のIDシステムは将来のGraphDB移行を見据えてRDF-ready設計：

```sparql
# 将来のSPARQLクエリ例
SELECT ?service WHERE {
  ?service rdf:type aws:Service .
  ?service aws:axis_tag aws:axis-availability .
  ?service aws:sap_domain aws:sap-d2-new-solutions .
}
```

---

## Assumptions

1. **Vanilla JS前提**: フレームワーク（React/Vue等）は使用しない。既存サイトアーキテクチャとの一貫性を保つ
2. **インライン埋め込み方式**: Layer3/Layer4はLayer2 JSONにインライン埋め込みとする（HTTPリクエスト数削減のため）
3. **初期データ規模**: 最初はRoute53・VPC・EC2・S3・RDSなど主要10サービスのみをMVPとしてデータ作成
4. **日本語メイン**: UI表示は日本語を主、英語名を副として表示する
5. **オフライン非対応**: Service Workerによるオフラインキャッシュはフェーズ外（静的サイトのCDNキャッシュで対応）
6. **認証不要**: 全コンテンツはパブリックアクセス可能（認証機能は実装しない）
7. **既存CSSシステムとの統合**: `/aws_sap_studying/css/variables.css` のデザイントークンを継承する
8. **クロスブラウザ**: Chrome/Firefox/Safari/Edge最新版を対象とする（IE非対応）
