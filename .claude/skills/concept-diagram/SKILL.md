---
name: concept-diagram
description: |
  概念マップのL3コンセプト・L4キーワード用にD2ベースのSVG図解を生成し、
  コンセプトマップUIに統合するスキル。コンセプトIDを受け取り、D2ファイル作成→
  SVG生成→JSON更新までを一貫して行う。
---

# 概念図生成スキル（D2 → SVG → コンセプトマップ統合）

## 最重要ルール

- SVGを直接手書きしない — 必ずD2ソースから生成する
- D2設計ルール・AWS色パレットは **`.claude/skills/d2-diagram/SKILL.md`** を参照
- `svg_diagram.src` にはプレフィックス `/aws_sap_studying/` を**含めない**（UI側で付与）

## ディレクトリ構成

| 種類 | パス | 説明 |
|------|------|------|
| D2ソース | `diagrams/concepts/{id}.d2` | バージョン管理対象 |
| 生成SVG | `public/images/concepts/{id}.svg` | ビルドで `dist/` にコピー |
| コンセプトJSON | `concepts/services/svc-*.json` | `svg_diagram` フィールドを追加 |

## ワークフロー

### Step 1: 対象コンセプトの特定

コンセプトID（`con-*` または `kw-*`）を受け取り、親サービスJSONを特定する。

```bash
# 対象IDを含むサービスファイルを検索
grep -rl '"con-vpc-subnet"' concepts/services/
```

対象ファイルを読み込み、コンセプトの以下のフィールドを確認:
- `name_ja` / `name_en` — 図のタイトルに使用
- `description_ja` — 図解すべき概念の把握
- `keywords[]` — 関連キーワード（図のノード候補）
- `axis_tags[]` — 関連する設計軸（色分けの参考）
- `sap_tip` — SAP試験での出題ポイント（強調すべき内容）

### Step 2: 図の構造設計

コンセプトの内容を分析し、最適な図の種類を選択する:

| 図の種類 | direction | 適用場面 |
|----------|-----------|----------|
| アーキテクチャ図 | `right` or `down` | AWSサービスの構成・接続関係 |
| フロー図 | `right` | データフロー・処理の流れ |
| 階層図 | `down` | ネットワーク層・権限の継承 |
| 比較図 | `right` | サービス間の違い・選択基準 |
| 判断フロー | `down` | 設計判断のディシジョンツリー |

ノード一覧と接続関係を整理してからD2ファイル作成に進む。

### Step 3: D2ファイル作成

`diagrams/concepts/{id}.d2` にD2ファイルを作成する。

**概念図向けD2テンプレート:**

```d2
direction: right

# --- スタイル定義 ---
classes: {
  aws-service: {
    style: {
      fill: "#FF9900"
      stroke: "#232F3E"
      font-color: "#232F3E"
      border-radius: 8
    }
  }
  concept: {
    style: {
      fill: "#E8F4FD"
      stroke: "#2E27AD"
      font-color: "#232F3E"
      border-radius: 4
    }
  }
  highlight: {
    style: {
      fill: "#FFF3CD"
      stroke: "#ED7100"
      font-color: "#232F3E"
      border-radius: 4
      bold: true
    }
  }
}

# --- ノード定義 ---
service: Amazon VPC { class: aws-service }
subnet: サブネット設計 { class: concept }
tip: "SAP Tip:\n出題ポイント" { class: highlight }

# --- 接続 ---
service -> subnet: 構成要素
subnet -> tip
```

**設計ガイドライン:**
- ノードラベルは短く（2行以内、`\n` で改行）
- SAP Tipや重要ポイントは `highlight` クラスで強調
- AWSサービスは `aws-service` クラス（オレンジ系）
- 概念・説明は `concept` クラス（ブルー系）
- カテゴリ別の色は `.claude/skills/d2-diagram/SKILL.md` のAWSカラーパレット参照
- グルーピング（コンテナ）で論理的な構造を表現
- ノード数は5〜15個を目安（多すぎると過密）

### Step 4: SVG生成

```bash
~/.local/bin/d2 --pad=20 diagrams/concepts/{id}.d2 public/images/concepts/{id}.svg
```

D2 CLIが見つからない場合:
```bash
which d2 || ~/.local/bin/d2 --version
# 未導入の場合:
curl -fsSL https://d2lang.com/install.sh | sh
```

### Step 5: 品質チェック

Read ツールで生成SVGを確認:
- [ ] 文字が重なっていない
- [ ] ラベルが見切れていない
- [ ] ノード間の関係が読み取りやすい
- [ ] 矢印の向きが正しい
- [ ] 図全体が過密でない

問題があれば `.d2` を修正して再生成。修正パターンは `d2-diagram` スキル参照。

### Step 6: コンセプトJSONに `svg_diagram` フィールドを追加

親 `svc-*.json` 内の対象コンセプト/キーワードオブジェクトに追加:

```json
"svg_diagram": {
  "src": "images/concepts/{id}.svg",
  "alt": "概念を説明する日本語テキスト"
}
```

**配置位置:**
- L3コンセプト: `html_resources` の前、`keywords` の前
- L4キーワード: `description_ja` の後

**フィールド仕様:**

| フィールド | 必須 | 説明 |
|----------|------|------|
| `src` | 必須 | `public/` からの相対パス（プレフィックスなし） |
| `alt` | 必須 | アクセシビリティ用の説明テキスト（WCAG 1.1.1） |

### Step 7: 報告

```
## 生成ファイル
- D2ソース: diagrams/concepts/{id}.d2
- SVG出力: public/images/concepts/{id}.svg
- 更新JSON: concepts/services/svc-{service}.json

## 図の内容
- [図の簡潔な説明]
- ノード数: N
- 接続数: N

## UI表示
- コンセプトマップで対象L3/L4を展開 → 「🖼️ 概念図 (SVG)」トグルで表示
```

---

## 既存 `concept_diagram` との共存

| 方式 | フィールド | 生成元 | レンダラー |
|------|----------|--------|-----------|
| JSON埋め込み | `concept_diagram` | 手動JSON定義 | DiagramRenderer.js（クライアントSVG） |
| D2外部SVG | `svg_diagram` | D2 CLI | `<img>` タグ（静的SVG） |

同一コンセプトに両方設定可能。UIではそれぞれ別のトグルとして表示される。

## 複数コンセプトの一括生成

複数のL3/L4に図を追加する場合:
1. 対象コンセプトIDを一覧化
2. 各コンセプトについて Step 1〜6 を繰り返す
3. 最後にまとめてバリデーション:
   ```bash
   python3 scripts/concept_management/generate_concept_index.py --validate
   ```
