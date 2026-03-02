# JavaScript Engine API Contracts

**Feature**: AWS概念マップ＋階層用語集エンジン
**Namespace**: `window.ConceptEngine`
**Date**: 2026-02-21

---

## 概要

エンジンは5つのモジュールで構成される。全モジュールは `window.ConceptEngine` オブジェクトのサブプロパティとして公開される。

```javascript
window.ConceptEngine = {
  loader:   ConceptLoader,
  index:    ConceptIndex,
  resolver: CrossLinkResolver,
  search:   SearchEngine,
  tags:     TagSystem,
};
```

---

## 1. ConceptLoader

**責務**: JSONファイルのフェッチ・Promiseキャッシュ管理・遅延ロード制御

### API

```javascript
ConceptLoader.loadConceptIndex(): Promise<ConceptIndexManifest>
```
- `concept-index.json` をフェッチして返す
- 2回目以降はキャッシュから返す（Promiseを共有）
- **呼び出しタイミング**: `DOMContentLoaded`

```javascript
ConceptLoader.loadSearchIndex(): Promise<SearchIndexEntry[]>
```
- `search-index.json` をフェッチして返す
- **呼び出しタイミング**: 検索バー初回フォーカス時（遅延）

```javascript
ConceptLoader.loadServiceNode(serviceId: string): Promise<ServiceNode>
```
- `concepts/services/{serviceId}.json` をフェッチして返す
- **呼び出しタイミング**: 対応するLayer2アコーディオン展開時
- 存在しないIDの場合: `null` を返す（エラーをthrowしない）

### 内部状態
```javascript
// キャッシュ: Promiseを共有して重複フェッチを防ぐ
_cache: Map<string, Promise<any>>
_basePath: "/aws_sap_studying/concepts/"
```

---

## 2. ConceptIndex

**責務**: O(1) ID参照・レイヤー別・タイプ別ノード取得

### 初期化
```javascript
ConceptIndex.init(manifest: ConceptIndexManifest): void
```
- `ConceptLoader.loadConceptIndex()` の結果を受けて初期化
- 内部Mapを構築する

### API

```javascript
ConceptIndex.getById(id: string): ConceptIndexEntry | null
```
- O(1) ID直接参照
- 存在しない場合は `null`

```javascript
ConceptIndex.getByLayer(layer: 0|1|2|3|4): ConceptIndexEntry[]
```
- 指定レイヤーの全エントリを返す

```javascript
ConceptIndex.getByType(type: string): ConceptIndexEntry[]
```
- 指定タイプ（"axis", "domain", "service"等）の全エントリを返す

```javascript
ConceptIndex.getChildren(parentId: string): ConceptIndexEntry[]
```
- 指定IDを `parent_domain_id` または `parent_service_id` として持つエントリを返す
- 木構造ナビゲーション用

### 内部状態
```javascript
_byId:    Map<string, ConceptIndexEntry>
_byLayer: Map<number, ConceptIndexEntry[]>
_byType:  Map<string, ConceptIndexEntry[]>
```

---

## 3. CrossLinkResolver

**責務**: クロスリンクの双方向解決。ServiceNodeの`crosslinks[]`から`reverseIndex`を自動構築

### 初期化
```javascript
CrossLinkResolver.build(serviceNodes: ServiceNode[]): void
```
- 全ServiceNodeの `crosslinks[]` を走査して `reverseIndex` を構築
- `target_id` が ConceptIndex に存在しない場合: エントリを除外 + `console.warn()`
- **呼び出しタイミング**: 全ServiceNodeが揃ったタイミング（遅延可）

### API

```javascript
CrossLinkResolver.getOutbound(nodeId: string): CrossLinkEntry[]
```
- 指定ノードから出るクロスリンク（`crosslinks[]` から直接取得）
- ServiceNodeをロード済みである必要あり。未ロードの場合は `[]`

```javascript
CrossLinkResolver.getInbound(nodeId: string): ReverseEntry[]
```
- 指定ノードへ入る逆リンク（`reverseIndex` から取得）
- 構造: `[{ from_id, type, description_ja? }, ...]`

```javascript
CrossLinkResolver.isBuilt(): boolean
```
- `build()` が完了済みかどうかを返す

### 内部状態
```javascript
_reverseIndex: Map<string, ReverseEntry[]>
_built: boolean
```

---

## 4. SearchEngine

**責務**: `search-index.json` を使った全文横断検索

### 初期化
```javascript
SearchEngine.init(entries: SearchIndexEntry[]): void
```
- エントリ配列を受け取り、各エントリに `_flat` プロパティを付与する
- `_flat = [name_ja, name_en, description_ja, sap_tip, ...tags].join(" ").toLowerCase()`
- **呼び出しタイミング**: `ConceptLoader.loadSearchIndex()` 完了後

### API

```javascript
SearchEngine.search(query: string): SearchResult[]
```
- `query` を小文字化して `_flat` に対して `String.includes()` 検索
- 3文字未満のクエリは `[]` を返す（ノイズ抑制）
- 結果は `layer` 昇順でソート（Layer0→4）
- 最大100件を返す

```javascript
SearchEngine.isReady(): boolean
```
- `init()` が完了済みかどうか

### SearchResult 構造
```javascript
{
  id:           string,
  layer:        number,
  type:         string,
  name_ja:      string,
  name_en:      string,
  description_ja: string,
  sap_tip:      string | undefined,
  axis_tags:    string[],
  sap_domains:  string[],
}
```

### 内部状態
```javascript
_entries: SearchIndexEntry[]  // _flatプロパティ付き
_ready: boolean
```

---

## 5. TagSystem

**責務**: 設計軸タグ・SAPドメインタグによるノードフィルタリング状態管理

### API

```javascript
TagSystem.toggleAxisTag(tagId: string): void
```
- 設計軸タグの選択状態をトグル

```javascript
TagSystem.toggleSapDomain(domainId: string): void
```
- SAPドメインタグの選択状態をトグル

```javascript
TagSystem.clearAll(): void
```
- 全フィルタをクリア

```javascript
TagSystem.getActiveFilters(): { axisTags: string[], sapDomains: string[] }
```
- 現在アクティブなフィルタ一覧を返す

```javascript
TagSystem.matchesNode(entry: ConceptIndexEntry): boolean
```
- 指定ノードが現在のフィルタ条件を満たすかどうかを返す
- フィルタなし（`axisTags=[]` かつ `sapDomains=[]`）の場合は常に `true`
- フィルタあり: `axisTags` OR条件 AND `sapDomains` OR条件
  - `entry.axis_tags` に選択中のaxisTagのいずれかが含まれる
  - かつ `entry.sap_domains` に選択中のsapDomainのいずれかが含まれる
  - どちらかのフィルタグループが空の場合はそのグループを無視（有効なグループのみ評価）

```javascript
TagSystem.onChange(callback: (filters: ActiveFilters) => void): void
```
- フィルタ変更イベントのリスナー登録

### 内部状態
```javascript
_activeAxisTags:    Set<string>
_activeSapDomains:  Set<string>
_listeners:         Function[]
```

---

## 初期化シーケンス

```
DOMContentLoaded
  └─→ ConceptLoader.loadConceptIndex()
        └─→ ConceptIndex.init(manifest)
              └─→ UIが初期ツリーを描画（Layer0〜1展開可能状態）

ユーザーがLayer2アコーディオンを展開
  └─→ ConceptLoader.loadServiceNode(serviceId)
        └─→ UIがLayer3/4を描画
        └─→ CrossLinkResolver.build() (全ロード済みノードで再構築 or 差分追加)

ユーザーが検索バーにフォーカス（初回のみ）
  └─→ ConceptLoader.loadSearchIndex()
        └─→ SearchEngine.init(entries)
              └─→ 検索バーが利用可能になる
```

---

## エラーハンドリング規約

| シナリオ | 挙動 |
|---------|------|
| JSONフェッチ失敗 | `null` または `[]` を返す。UIに「データ取得失敗」メッセージ表示 |
| 存在しないID参照 | `null` を返す。`console.warn()` のみ（エラーをthrowしない） |
| クロスリンク先ID不存在 | reverseIndex構築時に除外 + `console.warn()` |
| 3文字未満の検索クエリ | `[]` を返す（ノイズ抑制） |
| 50文字超の概念名 | UIが省略表示（エンジン層ではノーオペレーション） |
