# JSON スキーマ完全仕様

## 目次
1. [L2 Service（最頻出・最複雑）](#l2-service)
2. [L3 Concept（L2内にネスト）](#l3-concept)
3. [L4 Keyword（L3内にネスト）](#l4-keyword)
4. [L1 Domain（変更頻度: 低）](#l1-domain)
5. [L0 Axis（変更頻度: 低）](#l0-axis)
6. [フィールド共通仕様](#フィールド共通仕様)

---

## L2 Service

**ファイル:** `concepts/services/svc-{name}.json`

```json
{
  "id": "svc-example",                 // [必須] "svc-" で始まる一意ID
  "layer": 2,                          // [必須] 固定値: 2
  "type": "service",                   // [必須] 固定値: "service"
  "name_ja": "サービス日本語名",       // [必須] 空不可
  "name_en": "Service English Name",   // [必須] 空不可
  "description_ja": "サービスの概要。最低100文字推奨。", // [必須]
  "sap_tip": "SAP試験での出題傾向。重要ポイントを記述。", // [必須]
  "parent_domain_id": "dom-network",   // [必須] 有効値 → valid-values.md
  "axis_tags": [                       // [必須] 空配列可、有効値 → valid-values.md
    "axis-security",
    "axis-availability"
  ],
  "sap_domains": [                     // [必須] 空配列可、有効値 → valid-values.md
    "sap-d1-org-governance",
    "sap-d2-new-solutions"
  ],
  "tags": [                            // [必須] 検索用キーワード配列（3〜10個推奨）
    "example", "aws-service", "keyword"
  ],
  "crosslinks": [                      // [任意] 省略時は空配列として扱われる
    {
      "target_id": "svc-vpc",          // [必須] 存在するノードのID
      "type": "related",               // [必須] "related"|"prerequisite"|"comparison"
      "description_ja": "リンクの説明文。" // [必須]
    }
  ],
  "html_resources": [                  // [任意] 対応するHTMLリソースへのリンク
    {
      "title": "Auto Scaling インフォグラフィック", // [必須] data.js の title と合わせる
      "href": "compute-applications/auto_scaling_infographic.html" // [必須] data.js の href と同じ相対パス
    }
  ],
  "_meta": {                           // [推奨]
    "created": "2026-02-23",
    "version": "1.0.0"
  },
  "key_concepts": [                    // [必須] L3コンセプト配列（1個以上）
    // → L3 Concept スキーマ参照
  ]
}
```

---

## L3 Concept

**格納場所:** 親サービスJSONの `key_concepts[]` 配列内

```json
{
  "id": "con-example-concept",         // [必須] "con-{親svc略称}-{概念略称}"
  "layer": 3,                          // [必須] 固定値: 3
  "type": "concept",                   // [必須] 固定値: "concept"
  "name_ja": "コンセプト名",           // [必須]
  "name_en": "Concept Name",           // [必須]
  "description_ja": "このコンセプトの説明。", // [必須]
  "sap_tip": "SAP試験での重要ポイント。",    // [任意] 省略可
  "axis_tags": ["axis-cost"],          // [任意] このコンセプト固有の軸（省略時は親継承）
  "sap_domains": [],                   // [任意] 省略時は親サービスから継承
  "html_resources": [                  // [任意] このコンセプトに対応するHTMLリソース
    {
      "title": "Auto Scaling インフォグラフィック", // [必須] リソース名
      "href": "compute-applications/auto_scaling_infographic.html" // [必須] data.js の href と同じ相対パス
    }
  ],
  "keywords": [                        // [必須] L4キーワード配列（1個以上）
    // → L4 Keyword スキーマ参照
  ]
}
```

---

## L4 Keyword

**格納場所:** 親L3 Conceptの `keywords[]` 配列内

```json
{
  "id": "kw-example-concept-keyword",  // [必須] "kw-{親svc略称}-{概念略称}-{kw略称}"
  "layer": 4,                          // [必須] 固定値: 4
  "type": "keyword",                   // [必須] 固定値: "keyword"
  "name_ja": "キーワード名",           // [必須]
  "name_en": "Keyword Name",           // [必須]
  "description_ja": "キーワードの詳細説明。", // [必須]
  "axis_tags": ["axis-availability"],  // [任意]
  "sap_tip": ""                        // [任意] 省略可
}
```

---

## L1 Domain

**ファイル:** `concepts/domains/dom-{name}.json`
**変更頻度: 低（8個固定が基本）**

```json
{
  "id": "dom-network",
  "layer": 1,
  "type": "domain",
  "name_ja": "ネットワーキング",
  "name_en": "Networking",
  "description_ja": "ドメインの概要説明。",
  "sap_domains": [],                   // ドメインレベルでは空配列
  "axis_tags": [],
  "tags": ["vpc", "dns", "load-balancing"],
  "_meta": { "created": "2026-02-21", "version": "1.0.0" }
}
```

---

## L0 Axis

**ファイル:** `concepts/axes/axis-{name}.json`
**変更頻度: 低（8個固定が基本）**

```json
{
  "id": "axis-security",
  "layer": 0,
  "type": "axis",
  "name_ja": "セキュリティ",
  "name_en": "Security",
  "description_ja": "認証・認可・暗号化に関するAWSのアプローチ。",
  "sap_tip": "SAP試験での頻出パターン。",
  "sap_domains": ["sap-d1-org-governance", "sap-d2-new-solutions"],
  "tags": ["iam", "encryption", "kms", "zero-trust"],
  "axis_tags": [],                     // 軸レベルでは空配列
  "_meta": { "created": "2026-02-21", "version": "1.0.0" }
}
```

---

## フィールド共通仕様

### ID命名規則

| Layer | 接頭辞 | パターン | 例 |
|-------|--------|----------|----|
| L0 | `axis-` | `axis-{概念名}` | `axis-security` |
| L1 | `dom-` | `dom-{ドメイン名}` | `dom-network` |
| L2 | `svc-` | `svc-{サービス名略称}` | `svc-vpc` |
| L3 | `con-` | `con-{親svc略称}-{概念略称}` | `con-vpc-subnet` |
| L4 | `kw-` | `kw-{親svc略称}-{概念略称}-{kw略称}` | `kw-vpc-subnet-public` |

**命名ルール:**
- すべて小文字、単語区切りはハイフン `-`
- ASCII英数字とハイフンのみ（日本語・スペース禁止）
- 一意性必須（concept-index.json 全体で重複禁止）

### crosslinks type

| type | 用途 |
|------|------|
| `"related"` | 技術的に関連する（一緒に使う、一緒に学ぶ） |
| `"prerequisite"` | 前提知識・先に学ぶべき |
| `"comparison"` | 比較・トレードオフ関係 |

**禁止値:** `"axis_tag"`, `"sap_tag"`, その他の値

### description_ja の品質基準

- L2 service: 50文字以上推奨、概要・特徴・ユースケースを含む
- L3 concept: 30文字以上推奨
- L4 keyword: 20文字以上推奨、具体的な数値・仕様があれば記載
