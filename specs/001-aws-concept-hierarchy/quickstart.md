# Quickstart: AWS概念マップ＋階層用語集エンジン

**Branch**: `001-aws-concept-hierarchy` | **Date**: 2026-02-21

---

## 開発環境セットアップ

```bash
# 1. 既存の仮想環境を使用（一度だけ）
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests

# 2. 開発サーバー起動
python3 server.py
# → http://localhost:8080/concept-map.html でアクセス
```

---

## 新しいサービス JSON を追加する手順

### ステップ 1: サービス JSON ファイルを作成

```bash
# ファイルを作成（既存のRoute53を参考に）
cp concepts/services/svc-route53.json concepts/services/svc-{new-service}.json
```

`svc-{new-service}.json` を編集する：

```json
{
  "id": "svc-{new-service}",
  "layer": 2,
  "type": "service",
  "name_ja": "サービス名（日本語）",
  "name_en": "Amazon Service Name",
  "description_ja": "SAP試験観点での説明文。重要ポイントを含む。",
  "parent_domain_id": "dom-{appropriate-domain}",
  "resource_url": "/aws_sap_studying/{category}/{html-file}.html",
  "axis_tags": ["axis-availability"],
  "sap_domains": ["sap-d2-new-solutions"],
  "tags": ["keyword1", "keyword2"],
  "key_concepts": [
    {
      "id": "con-{new-service}-{concept-name}",
      "layer": 3,
      "type": "concept",
      "name_ja": "概念名",
      "name_en": "Concept Name",
      "description_ja": "概念の説明",
      "axis_tags": ["axis-availability"],
      "sap_tip": "SAP試験ではXXXを問われる",
      "keywords": [
        {
          "id": "kw-{new-service}-{concept-name}-{keyword-name}",
          "layer": 4,
          "type": "keyword",
          "name_ja": "キーワード名",
          "name_en": "Keyword Name",
          "description_ja": "詳細説明",
          "axis_tags": [],
          "sap_tip": "試験ポイント"
        }
      ]
    }
  ],
  "crosslinks": [
    { "target_id": "svc-related-service", "type": "related", "description_ja": "関連説明" }
  ],
  "_meta": { "created": "2026-02-21", "version": "1.0.0" }
}
```

### ステップ 2: インデックスを再生成

```bash
python3 scripts/concept_management/generate_concept_index.py
```

このスクリプトは以下を自動生成する：
- `concepts/concept-index.json` — ナビゲーション用メタデータ索引
- `concepts/search-index.json` — 検索用フラット配列

### ステップ 3: 検証

```bash
# ID重複チェック・スキーマ検証
python3 scripts/concept_management/generate_concept_index.py --validate

# 開発サーバーで動作確認
python3 server.py
# → http://localhost:8080/concept-map.html を開いて新サービスが表示されることを確認
```

### ステップ 4: コミット・デプロイ

```bash
git add concepts/services/svc-{new-service}.json \
        concepts/concept-index.json \
        concepts/search-index.json

git commit -m "feat: svc-{new-service}のJSONデータを追加"
git push origin gh-pages
```

---

## ID 命名規則クイックリファレンス

| 層 | プレフィックス | 例 |
|----|-------------|-----|
| Layer 0（設計軸） | `axis-` | `axis-availability`, `axis-dr` |
| Layer 1（ドメイン） | `dom-` | `dom-network`, `dom-compute` |
| Layer 2（サービス） | `svc-` | `svc-route53`, `svc-ec2` |
| Layer 3（重要概念） | `con-` | `con-route53-health-check` |
| Layer 4（キーワード） | `kw-` | `kw-route53-health-check-active-passive` |

**規則**: ハイフン区切り小文字英数字のみ。日本語・スペース禁止。一度付与したIDは変更しない。

---

## SAPドメインタグ クイックリファレンス

| タグID | 正式名 |
|--------|--------|
| `sap-d1-org-governance` | Domain 1: Organizational Complexity and Governance |
| `sap-d2-new-solutions` | Domain 2: New Solutions Design |
| `sap-d3-migration` | Domain 3: Migration Planning |
| `sap-d4-cost-optimization` | Domain 4: Cost Optimization |

---

## エンジン JavaScript ファイル構成

```
js/concept-engine/
├── ConceptLoader.js       # フェッチ・キャッシュ管理
├── ConceptIndex.js        # O(1) ID参照 Map
├── CrossLinkResolver.js   # reverseIndex構築・双方向解決
├── SearchEngine.js        # search-index.json 検索
└── TagSystem.js           # タグフィルタ状態管理

concept-map.html           # エントリーポイント（ルート直下）
css/pages/concept-map.css  # ページ固有スタイル
```

HTML での読み込み順序（`concept-map.html` 内）:

```html
<!-- head: CSS -->
<link href="/aws_sap_studying/css/variables.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/common.css" rel="stylesheet"/>
<link href="/aws_sap_studying/css/pages/concept-map.css" rel="stylesheet"/>

<!-- body末尾: JS (順序厳守) -->
<script src="/aws_sap_studying/js/concept-engine/ConceptLoader.js"></script>
<script src="/aws_sap_studying/js/concept-engine/ConceptIndex.js"></script>
<script src="/aws_sap_studying/js/concept-engine/CrossLinkResolver.js"></script>
<script src="/aws_sap_studying/js/concept-engine/SearchEngine.js"></script>
<script src="/aws_sap_studying/js/concept-engine/TagSystem.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    ConceptEngine.loader.loadConceptIndex().then(function(manifest) {
      ConceptEngine.index.init(manifest);
      renderConceptTree();
    });
  });
</script>
```

---

## よくある問題

| 症状 | 原因 | 対処 |
|------|------|------|
| サービスが表示されない | `concept-index.json` が古い | `generate_concept_index.py` を再実行 |
| 検索に新サービスが出ない | `search-index.json` が古い | 同上（両ファイルは同時生成） |
| CSS が404 | パスに `/aws_sap_studying/` プレフィックスがない | パスを修正 |
| アコーディオンが展開しない | JS読み込み順序の誤り | `ConceptLoader.js` を最初にロード |
| W3C検証エラー | `<h2>` の代わりに `<div>` を使用 | `<h2 class="section-title">` に変更 |
