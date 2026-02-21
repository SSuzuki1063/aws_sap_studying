# Data Model: AWS概念マップ＋階層用語集エンジン

**Branch**: `001-aws-concept-hierarchy` | **Date**: 2026-02-21

---

## 継承モデル概観：判別共用体（Discriminated Union）

全ノードは `ConceptNode` 基底スキーマを持ち、`type` フィールドが判別子として機能する。
GraphDB移行時は `type` フィールドが `rdf:type` に直接対応する。

```
ConceptNode (基底: id, layer, type, name_ja, name_en, description_ja, _meta)
  │
  ├── type = "axis"     → AxisNode     (Layer 0)
  ├── type = "domain"   → DomainNode   (Layer 1)
  ├── type = "service"  → ServiceNode  (Layer 2) ← 最重要・独立ファイル
  ├── type = "concept"  → KeyConcept   (Layer 3) ← ServiceNodeにインライン埋め込み
  └── type = "keyword"  → Keyword      (Layer 4) ← KeyConceptにインライン埋め込み
```

---

## エンティティ定義

### ConceptNode（基底）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| `id` | `string` | ✅ | グローバル一意ID（prefix-identifier形式, URL安全） |
| `layer` | `0\|1\|2\|3\|4` | ✅ | 階層番号 |
| `type` | `"axis"\|"domain"\|"service"\|"concept"\|"keyword"` | ✅ | 判別子。RDFの`rdf:type`に対応 |
| `name_ja` | `string` | ✅ | 日本語名（UI主表示） |
| `name_en` | `string` | ✅ | 英語名（UI副表示・検索対象） |
| `description_ja` | `string` | ✅ | 日本語説明（SAP試験観点を含む） |
| `_meta` | `MetaObject` | — | バージョン管理用メタデータ |

**MetaObject**:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `created` | `string (date)` | 作成日 YYYY-MM-DD |
| `updated` | `string (date)` | 最終更新日 |
| `version` | `string` | セマンティックバージョン（例: "1.0.0"） |
| `deprecated_id` | `string?` | ID変更時の旧ID記録（不変性原則） |

---

### AxisNode（Layer 0）

ファイル: `concepts/axes/axis-{identifier}.json`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| *ConceptNode全フィールド* | — | ✅ | — |
| `sap_domains` | `SapDomainId[]` | — | 関連するSAPドメインID（`sap-d1-*`等） |
| `tags` | `string[]` | — | 追加タグ（`resilience`, `uptime`等） |

---

### DomainNode（Layer 1）

ファイル: `concepts/domains/dom-{identifier}.json`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| *ConceptNode全フィールド* | — | ✅ | — |
| `tags` | `string[]` | — | 追加タグ |

---

### ServiceNode（Layer 2）← **最重要エンティティ**

ファイル: `concepts/services/svc-{identifier}.json`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| *ConceptNode全フィールド* | — | ✅ | — |
| `parent_domain_id` | `string (dom-*)` | ✅ | 親ドメインID。木構造の親参照 |
| `resource_url` | `string?` | — | このリポジトリ内のHTMLリソースパス |
| `axis_tags` | `AxisNodeId[]` | — | **設計軸タグの正規ソース**（タグフィルタ・検索はここを参照） |
| `sap_domains` | `SapDomainId[]` | — | SAPドメインタグの正規ソース |
| `tags` | `string[]` | — | 追加タグ（`dns`, `routing`等） |
| `key_concepts` | `KeyConceptInline[]` | — | Layer3重要概念（インライン埋め込み、10〜15件推奨） |
| `crosslinks` | `CrossLinkEntry[]` | — | サービス間関係（`related/extends/requires`のみ） |
| `_future` | `FutureExtension?` | — | Mermaid/D3拡張用予約フィールド（エンジンは無視） |

---

### KeyConcept（Layer 3、ServiceNodeにインライン埋め込み）

ServiceNodeの `key_concepts[]` 配列要素として格納。独立ファイル不可。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| `id` | `string (con-*)` | ✅ | グローバル一意ID |
| `layer` | `3` | ✅ | 固定値 |
| `type` | `"concept"` | ✅ | 判別子固定値 |
| `name_ja` | `string` | ✅ | — |
| `name_en` | `string` | ✅ | — |
| `description_ja` | `string` | ✅ | — |
| `axis_tags` | `AxisNodeId[]` | — | 設計軸タグ（親Serviceと異なる場合あり、明示宣言） |
| `sap_tip` | `string?` | — | SAP試験出題ポイント |
| `keywords` | `KeywordInline[]` | — | Layer4キーワード（インライン埋め込み、5〜10件推奨） |

---

### Keyword（Layer 4、KeyConceptにインライン埋め込み）

KeyConceptの `keywords[]` 配列要素として格納。独立ファイル不可。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| `id` | `string (kw-*)` | ✅ | グローバル一意ID |
| `layer` | `4` | ✅ | 固定値 |
| `type` | `"keyword"` | ✅ | 判別子固定値 |
| `name_ja` | `string` | ✅ | — |
| `name_en` | `string` | ✅ | — |
| `description_ja` | `string` | ✅ | — |
| `axis_tags` | `AxisNodeId[]` | — | 設計軸タグ（明示宣言制）|
| `sap_tip` | `string?` | — | SAP試験出題ポイント |

---

### CrossLinkEntry（ServiceNodeの`crosslinks[]`要素）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| `target_id` | `string` | ✅ | 参照先ノードID |
| `type` | `"related"\|"extends"\|"requires"` | ✅ | 関係種別（`axis_tag`は含まない） |
| `description_ja` | `string?` | — | 関係の説明 |

> **注意**: `axis_tags`/`sap_domains` への参照は `crosslinks` に含めない。
> `axis_tags` フィールドが設計軸帰属の**唯一の正規ソース**。

---

### ConceptIndexEntry（`concept-index.json`の`nodes[]`要素）

`generate_concept_index.py` が自動生成。ナビゲーション・ID参照用。

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | グローバル一意ID |
| `layer` | `0\|1\|2\|3\|4` | 階層番号 |
| `type` | `string` | ノードタイプ |
| `name_ja` | `string` | 日本語名 |
| `name_en` | `string` | 英語名 |
| `file` | `string?` | ServiceNodeの場合のみ: JSONファイルパス（相対） |
| `axis_tags` | `string[]` | 設計軸タグ（タグフィルタ用） |
| `sap_domains` | `string[]` | SAPドメインタグ |
| `tags` | `string[]` | その他タグ |

---

### SearchIndexEntry（`search-index.json`の配列要素）

`generate_concept_index.py` が自動生成。検索用フラット構造。

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | グローバル一意ID |
| `layer` | `0\|1\|2\|3\|4` | 階層番号 |
| `type` | `string` | ノードタイプ |
| `name_ja` | `string` | — |
| `name_en` | `string` | — |
| `description_ja` | `string` | — |
| `sap_tip` | `string?` | SAP試験ポイント（Layer3/4のみ） |
| `axis_tags` | `string[]` | タグ |
| `sap_domains` | `string[]` | SAPドメイン |
| `tags` | `string[]` | その他タグ |
| `_flat` | `string` | **ランタイム生成**: 上記全文字列フィールドの連結キャッシュ。JSONには含めない。SearchEngineが初期化時に付与 |

---

### ReverseIndex（CrossLinkResolver ランタイムデータ構造）

JSONには存在しない。CrossLinkResolver が全ServiceNode ロード完了後に構築。

```
Map<targetId: string, entries: ReverseEntry[]>

ReverseEntry:
  from_id:        string   // 参照元ノードID
  type:           string   // CrossLinkEntry.type と同値
  description_ja: string?  // CrossLinkEntry.description_ja と同値
```

**構築アルゴリズム**:
1. 全 ServiceNode の `crosslinks[]` を走査
2. 各エントリ `{ target_id, type, description_ja }` に対して:
   - `reverseIndex.get(target_id)` が存在しなければ `[]` で初期化
   - `{ from_id: serviceNode.id, type, description_ja }` を push
3. `target_id` が concept-index に存在しないエントリは除外（コンソール警告のみ）

---

## タイプエイリアス定義

```javascript
// ID Types (convention, not enforced at runtime)
AxisNodeId    = string  // "axis-*"
DomainNodeId  = string  // "dom-*"
ServiceNodeId = string  // "svc-*"
ConceptId     = string  // "con-*"
KeywordId     = string  // "kw-*"

// SAP Domain IDs (exhaustive enum)
SapDomainId =
  | "sap-d1-org-governance"
  | "sap-d2-new-solutions"
  | "sap-d3-migration"
  | "sap-d4-cost-optimization"
```

---

## ファイルシステムマッピング

```
concepts/                             ← リポジトリルート直下
├── concept-index.json                ← AUTO-GENERATED（ナビゲーション用）
├── search-index.json                 ← AUTO-GENERATED（検索用フラット配列）
├── axes/
│   ├── axis-availability.json        ← AxisNode
│   ├── axis-dr.json
│   ├── axis-governance.json
│   └── ...（8〜12件）
├── domains/
│   ├── dom-network.json              ← DomainNode
│   ├── dom-compute.json
│   └── ...（10〜15件）
└── services/
    ├── svc-route53.json              ← ServiceNode（Layer3/4インライン含む）
    ├── svc-vpc.json
    ├── svc-ec2.json
    └── ...（最終的に100〜200件）
```

---

## JSON ↔ Graph 構造マッピング

| JSON 表現 | グラフ表現 | RDF 将来形 |
|-----------|-----------|-----------|
| `ServiceNode.id` | グラフノード ID | `<https://aws-concepts.example/svc-route53>` |
| `ServiceNode.parent_domain_id` | 有向辺 IS_IN（child → parent） | `aws:inDomain` トリプル |
| `crosslinks[].target_id` | 有向辺（labeled edge） | `aws:related` / `aws:extends` / `aws:requires` トリプル |
| `crosslinks[]` (reverseIndex) | 逆有向辺（ランタイム解決） | SPARQL `?target ?pred <source>` |
| `axis_tags[]` | 有向辺 TAGGED_BY | `aws:axisTag` トリプル |
| `sap_domains[]` | 有向辺 BELONGS_TO | `aws:sapDomain` トリプル |
| `type` フィールド | ノードラベル（グラフDB） | `rdf:type aws:Service` |

---

## データ量見積もり

| 区分 | 件数 | 概算ファイルサイズ |
|------|------|-----------------|
| AxisNode | 8〜12 | 各 ~1KB |
| DomainNode | 10〜15 | 各 ~1KB |
| ServiceNode（MVP 10件） | 10 | 各 ~10KB（Layer3/4込み） |
| ServiceNode（フル 200件） | 200 | 各 ~10KB |
| concept-index.json（フル） | ~2,500 nodes | ~500KB |
| search-index.json（フル） | ~5,000 entries | ~1.5MB |

> **初期ページロード**: concept-index.json（軽量）のみ。search-index.json は遅延フェッチ。
> サービスJSON は展開操作時にオンデマンド取得。
