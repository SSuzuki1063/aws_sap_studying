---
name: concept-map-manager
description: |
  AWS概念マップ（concept-map.html）のJSONデータ管理スキル。
  concepts/ ディレクトリのJSONファイル作成・追加・更新と、concept-index.json / search-index.json の再生成を担当する。
  以下の場面で使用:
  (1) 新しいAWSサービス（L2）JSONファイルを新規作成したい
  (2) 既存サービスにL3コンセプト・L4キーワードを追加・編集したい
  (3) crosslinks（クロスリンク）を追加・修正したい
  (4) html_resources（HTMLリソースリンク）を追加・修正したい
  (5) concept-index.json / search-index.json を再生成・バリデーションしたい
  (6) concepts/ ディレクトリ全体の整合性チェックを行いたい
  (7) AWS概念マップに表示されるデータ内容を変更したい
---

# AWS 概念マップ データ管理スキル

## システム概要

```
concepts/
├── axes/         (L0: 設計軸 8ファイル     — 変更頻度: 低)
├── domains/      (L1: ドメイン 8ファイル   — 変更頻度: 低)
├── services/     (L2+L3+L4 — 変更頻度: 高)
├── concept-index.json   ← 自動生成 (手編集禁止)
└── search-index.json    ← 自動生成 (手編集禁止)
```

**4階層と ID接頭辞:**

| Layer | Type | ID接頭辞 | ファイル場所 |
|-------|------|----------|-------------|
| L0 | axis | `axis-` | `axes/axis-{name}.json` |
| L1 | domain | `dom-` | `domains/dom-{name}.json` |
| L2 | service | `svc-` | `services/svc-{name}.json` |
| L3 | concept | `con-` | L2ファイル内 `key_concepts[]` にネスト |
| L4 | keyword | `kw-` | L3内 `keywords[]` にネスト |

> **重要:** L3・L4 は独立ファイルを持たない。必ず親サービスのJSONに内包する。

---

## ワークフロー 1: 新しい L2 サービスを追加

```bash
# 1. ファイル作成
touch concepts/services/svc-{service-name}.json

# 2. JSON 記述（スキーマ → references/json-schema.md）

# 3. バリデーション
python3 scripts/concept_management/generate_concept_index.py --validate

# 4. インデックス再生成
python3 scripts/concept_management/generate_concept_index.py

# 5. ローカル確認（サーバー起動中の場合）
# ブラウザで /concept-map.html を開き、新サービスがツリーに表示されることを確認
```

**最低限必要なフィールド:**
`id` / `layer: 2` / `type: "service"` / `name_ja` / `name_en` / `description_ja` / `sap_tip` /
`parent_domain_id` / `axis_tags[]` / `sap_domains[]` / `tags[]` / `key_concepts[]`（1個以上）

完全スキーマ → **[references/json-schema.md](references/json-schema.md)**
有効値一覧 → **[references/valid-values.md](references/valid-values.md)**

---

## ワークフロー 2: 既存サービスに L3/L4 を追加・編集

```bash
# 1. 対象ファイルを特定
ls concepts/services/svc-*.json        # 一覧
grep -l "parent_domain_id.*dom-network" concepts/services/*.json  # ドメイン絞込

# 2. 対象ファイルを編集し key_concepts[] に追加

# 3. バリデーション＆再生成
python3 scripts/concept_management/generate_concept_index.py --validate
python3 scripts/concept_management/generate_concept_index.py
```

**追加テンプレート（L3 + L4）:**
```json
{
  "id": "con-{svc}-{concept}",
  "layer": 3,
  "type": "concept",
  "name_ja": "コンセプト名",
  "name_en": "Concept Name",
  "description_ja": "詳細説明（最低50文字）",
  "sap_tip": "SAP試験での出題ポイント",
  "axis_tags": ["axis-cost"],
  "keywords": [
    {
      "id": "kw-{svc}-{concept}-{keyword}",
      "layer": 4,
      "type": "keyword",
      "name_ja": "キーワード名",
      "name_en": "Keyword Name",
      "description_ja": "キーワードの詳細"
    }
  ]
}
```

**ID命名規則:** `con-{親svc略称}-{概念略称}` / `kw-{親svc略称}-{概念略称}-{kw略称}`

---

## ワークフロー 3: クロスリンクを追加

**ルール: ソース側のみ定義。逆リンクは CrossLinkResolver が自動構築する。**

```json
// concepts/services/svc-{source}.json の "crosslinks" に追加
"crosslinks": [
  {
    "target_id": "svc-cloudfront",
    "type": "related",
    "description_ja": "CloudFrontがS3オリジンのコンテンツをキャッシュ配信する"
  }
]
```

**type の選択基準:**
| type | 意味 | 例 |
|------|------|----|
| `"related"` | 関連技術（一緒に学ぶべき） | S3 ↔ CloudFront |
| `"prerequisite"` | 前提条件（先に学ぶべき） | Security Group → VPC |
| `"comparison"` | 比較対象（トレードオフ） | SG vs NACL |

**禁止パターン:**
```json
// ❌ type に "axis_tag" / "sap_tag" は使用禁止
// ✅ 軸は "axis_tags": ["axis-security"] で記述
```

---

## ワークフロー 4: HTMLリソースリンクを追加

**対応するHTMLリソースを概念に関連付ける。L2（サービス全体）とL3（コンセプト単位）の両方に設定可能。**

```json
// L2: svc-*.json の "crosslinks" の後に追加（サービス全体のリソース）
"html_resources": [
  { "title": "Auto Scaling インフォグラフィック", "href": "compute-applications/auto_scaling_infographic.html" }
],

// L3: key_concepts[] 内のコンセプトに追加（概念固有のリソース）
{
  "id": "con-ec2-auto-scaling",
  "html_resources": [
    { "title": "Auto Scaling インフォグラフィック", "href": "compute-applications/auto_scaling_infographic.html" },
    { "title": "Auto Scaling Warm Pool", "href": "compute-applications/autoscaling_warmpool_infographic.html" }
  ],
  "keywords": [...]
}
```

**フィールド仕様:**
| フィールド | 必須/任意 | 説明 |
|----------|---------|------|
| `title` | 必須 | リソース名（data.js の title と合わせる推奨） |
| `href` | 必須 | `data.js` の `href` 値と同じ相対パス |

**注意:** `html_resources` は `concept-index.json` に伝播しない（インデックス再生成は不要）。UIはサービスJSON全体のロード後に表示する。

---

## インデックス再生成・バリデーション

```bash
# バリデーションのみ（ファイル変更なし）
python3 scripts/concept_management/generate_concept_index.py --validate

# 再生成（concept-index.json と search-index.json を更新）
python3 scripts/concept_management/generate_concept_index.py

# ドライラン（出力確認のみ、書き込まない）
python3 scripts/concept_management/generate_concept_index.py --dry-run
```

**バリデーション項目:** 必須フィールド / ID接頭辞 / crosslinks の target_id 存在確認 / 重複ID検出

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| サービスがマップに表示されない | concept-index.json が未更新 | `generate_concept_index.py` 実行 |
| 検索にヒットしない | search-index.json が未更新 | 同上 |
| クロスリンクが片方向しか表示されない | 正常動作（UI は双方向を自動表示） | CrossLinkResolver の仕様 |
| `target_id not found` 警告 | crosslinks の参照先IDが存在しない | IDのスペルを確認後、再生成 |
| 重複ID エラー | 同一IDが複数ファイルに存在 | IDを変更して一意にする |
| L3/L4 がUI上でロードされない | 親 svc-*.json の JSON 構文エラー | `python3 -m json.tool concepts/services/svc-{name}.json` で構文確認 |
| parent_domain_id が無効 | 存在しないドメインIDを指定 | `references/valid-values.md` で有効値確認 |
| html_resources リンクが表示されない | フルJSONがロードされていない | L2クリック後にサービスを展開してから確認 |
| リンク先が404 | href パスが data.js と不一致 | data.js の href 値をコピーして確認 |

---

## 参照ファイル

- **JSONスキーマ完全仕様:** [references/json-schema.md](references/json-schema.md)
  L0〜L4 全レイヤーのフィールド定義と必須/任意の区分
- **有効値一覧:** [references/valid-values.md](references/valid-values.md)
  axis_tags / sap_domains / crosslink type / parent_domain_id の全有効値

## 関連ファイル

- UIスタイル: `css/pages/mindmap.css`
- UIロジック: `js/concept-engine/MindmapController.js`
- インデックス生成: `scripts/concept_management/generate_concept_index.py`
- 既存データ例: `concepts/services/svc-vpc.json`, `concepts/services/svc-s3.json`
