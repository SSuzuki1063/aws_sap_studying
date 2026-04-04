---
name: d2-diagram
description: AWS学習サイト用のSVG図版をD2 diagram languageで生成するスキル。以下の場面で使用：(1) AWS構成図・アーキテクチャ図の作成、(2) ネットワーク構成図の作成、(3) サービス連携図の作成、(4) 既存SVG図の更新・修正。SVGを直接手書きせず、必ずD2ソースから生成する。
---

# D2 Diagram Generation Skill

## 最重要ルール

- **SVGを直接生成・編集しない**
- まず `.d2` ファイルを作る → 次に D2 CLI で `.svg` を生成する
- レイアウトは D2 に任せる。座標を手打ちしない
- 文字の重なり・見切れを避けるため、ノードラベルは短くし、必要なら改行する

## ディレクトリ構成

| 種類 | パス | 説明 |
|------|------|------|
| D2ソース | `diagrams/` | `.d2` ファイル（バージョン管理対象） |
| 生成SVG | `public/images/` | `.svg` ファイル（ビルドで `dist/` にコピーされる） |

## 作業手順

### Step 1: 図の構造を整理する

要求された図の内容を分析し、以下を列挙する:

```
## ノード一覧
- ノードA: 説明
- ノードB: 説明

## 接続関係
- ノードA → ノードB: ラベル
- ノードB → ノードC: ラベル
```

### Step 2: D2 ファイルを作成する

`diagrams/<name>.d2` に D2 diagram language で記述する。

**D2 設計ルール:**

- `direction` は図の性質に応じて選ぶ:
  - フロー図・データパイプライン → `right`
  - 階層・スタック図 → `down`
- ノード名は簡潔にする（英数字推奨、日本語も可）
- 長いドメイン名や説明は 2 行以内に収める（`\n` で改行）
- 接続線には必要に応じてラベルを付ける
- AWS 構成図として読みやすいグルーピング（コンテナ）を意識する
- 過剰な装飾は不要。レイアウトの正しさを優先する

**D2 基本構文リファレンス:**

```d2
# 方向指定
direction: right

# ノード定義
vpc: VPC (10.0.0.0/16)

# コンテナ（グルーピング）
vpc: {
  public-subnet: Public Subnet {
    nat: NAT Gateway
  }
  private-subnet: Private Subnet {
    app: App Server
  }
}

# 接続
vpc.public-subnet.nat -> vpc.private-subnet.app: route

# スタイル
node.style: {
  fill: "#FF9900"
  stroke: "#232F3E"
  font-color: "#232F3E"
}

# 複数行ラベル
long-name: |
  Amazon CloudFront
  Distribution
|
```

**AWS カラーパレット（任意使用）:**

| 用途 | カラーコード |
|------|-------------|
| AWS Orange | `#FF9900` |
| AWS Dark | `#232F3E` |
| Compute | `#ED7100` |
| Storage | `#3F8624` |
| Database | `#2E27AD` |
| Networking | `#8C4FFF` |
| Security | `#DD344C` |

### Step 3: SVG を生成する

```bash
# 基本形
d2 diagrams/<name>.d2 public/images/<name>.svg

# テーマ指定（オプション）
d2 --theme=0 diagrams/<name>.d2 public/images/<name>.svg

# パディング指定（余白が足りない場合）
d2 --pad=20 diagrams/<name>.d2 public/images/<name>.svg
```

D2 CLI パス: `~/.local/bin/d2`（PATH に入っていない場合はフルパスを使う）

### Step 4: 品質チェック

生成された SVG を Read ツールで確認し、以下をチェック:

- [ ] 文字が重なっていない
- [ ] ラベルが見切れていない
- [ ] ノード間の関係が読み取りやすい
- [ ] 矢印の向きが正しい
- [ ] 図全体が過密でない

問題があれば `.d2` ファイルを修正して再生成する。

**よくある修正パターン:**

| 問題 | 対処法 |
|------|--------|
| 文字重なり | ラベルを短くする / 改行を入れる |
| 見切れ | `--pad` を増やす |
| 過密 | グルーピングを分割する / direction を変える |
| 矢印が見づらい | 接続順序を変える |

### Step 5: 報告

生成完了後、以下を報告する:

```
## 生成ファイル
- D2ソース: diagrams/<name>.d2
- SVG出力: public/images/<name>.svg

## 図の内容
- [図の簡潔な説明]
- ノード数: N
- 接続数: N
```

## Astro ページでの使用方法

生成した SVG を Astro ページに埋め込む場合:

```astro
<!-- 方法1: img タグ（推奨） -->
<img src="/aws_sap_studying/images/<name>.svg" alt="図の説明" />

<!-- 方法2: Fragment でインライン埋め込み -->
---
import { readFileSync } from 'fs';
const svg = readFileSync('public/images/<name>.svg', 'utf-8');
---
<Fragment set:html={svg} />
```

**注意:** `src` パスには必ず `/aws_sap_studying/` プレフィックスを付ける。

## D2 CLI が利用できない場合

1. D2 がインストール済みか確認: `which d2 || ~/.local/bin/d2 --version`
2. 未導入の場合: `curl -fsSL https://d2lang.com/install.sh | sh`
3. **SVG を直接書いて代替しない** — 必ず D2 を導入してから作業する

## 既存 SVG の更新

既存の SVG を更新する場合:

1. 対応する `.d2` ファイルが `diagrams/` にあるか確認する
2. あれば `.d2` を編集して再生成する
3. なければ、既存 SVG の構造を読み取って `.d2` を新規作成し、再生成で置換する
