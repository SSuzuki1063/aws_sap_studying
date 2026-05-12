/**
 * ConceptIndex.js — O(1) ID参照・レイヤー別・タイプ別ノード取得
 * contracts/js-engine-api.md §2 に準拠
 */

(function (global) {
  'use strict';

  var _byId    = {}; // { [id: string]: ConceptIndexEntry }
  var _byLayer = {}; // { [layer: number]: ConceptIndexEntry[] }
  var _byType  = {}; // { [type: string]: ConceptIndexEntry[] }
  var _ready   = false;

  /** concept-index.json のマニフェストで内部Mapを初期化する。 */
  function init(manifest) {
    _byId = {}; _byLayer = {}; _byType = {}; _ready = false;

    if (!manifest || !Array.isArray(manifest.nodes)) {
      console.warn('[ConceptIndex] init: invalid manifest');
      return;
    }

    manifest.nodes.forEach(function (entry) {
      _byId[entry.id] = entry;

      if (!_byLayer[entry.layer]) _byLayer[entry.layer] = [];
      _byLayer[entry.layer].push(entry);

      if (!_byType[entry.type]) _byType[entry.type] = [];
      _byType[entry.type].push(entry);
    });

    _ready = true;
  }

  /** IDでノードをO(1)で取得する。存在しなければ null。 */
  function getById(id) { return _byId[id] || null; }

  /** 指定レイヤーの全エントリを返す。 */
  function getByLayer(layer) { return _byLayer[layer] || []; }

  /** 指定タイプの全エントリを返す。 */
  function getByType(type) { return _byType[type] || []; }

  /**
   * 指定 domainId に属するサービスエントリを返す。
   * concept-index.json には parent_domain_id が含まれないため、
   * axis_tags / sap_domains で近似せず、ServiceNode.parent_domain_id は
   * loadServiceNode() で取得した ServiceNode 側で解決する。
   * このメソッドは layer=2 の全エントリを返す簡易版として機能する。
   */
  function getChildren(parentId) {
    // UI 側で parentId を使ってフィルタする想定
    // concept-index.json レベルでは parent 情報を保持しないため全サービスを返す
    return getByLayer(2);
  }

  /** 初期化済みかどうか。 */
  function isReady() { return _ready; }

  global.ConceptEngine = global.ConceptEngine || {};
  global.ConceptEngine.index = {
    init:        init,
    getById:     getById,
    getByLayer:  getByLayer,
    getByType:   getByType,
    getChildren: getChildren,
    isReady:     isReady,
  };

}(window));
