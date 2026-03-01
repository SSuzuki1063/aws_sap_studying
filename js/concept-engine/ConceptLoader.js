/**
 * ConceptLoader.js — JSONフェッチ・Promiseキャッシュ管理・遅延ロード制御
 * contracts/js-engine-api.md §1 に準拠
 */

(function (global) {
  'use strict';

  var _basePath = '/aws_sap_studying/concepts/';
  var _cache    = {}; // { [path: string]: Promise<any> }

  function _fetch(path) {
    if (!_cache[path]) {
      _cache[path] = fetch(path)
        .then(function (res) {
          if (!res.ok) {
            console.warn('[ConceptLoader] fetch failed: ' + path + ' (' + res.status + ')');
            return null;
          }
          return res.json();
        })
        .catch(function (e) {
          console.warn('[ConceptLoader] fetch error: ' + path, e);
          return null;
        });
    }
    return _cache[path];
  }

  /** concept-index.json をフェッチして返す。DOMContentLoaded 時に即時呼び出し。 */
  function loadConceptIndex() {
    return _fetch(_basePath + 'concept-index.json');
  }

  /** search-index.json をフェッチして返す。検索バー初回フォーカス時の遅延ロード用。 */
  function loadSearchIndex() {
    return _fetch(_basePath + 'search-index.json').then(function (data) {
      return Array.isArray(data) ? data : [];
    });
  }

  /** 個別サービス JSON をフェッチして返す。Layer2 展開時のオンデマンドロード用。 */
  function loadServiceNode(serviceId) {
    if (!serviceId || typeof serviceId !== 'string') {
      return Promise.resolve(null);
    }
    return _fetch(_basePath + 'services/' + serviceId + '.json');
  }

  /** キャッシュをクリアする（デバッグ用）。 */
  function clearCache() { _cache = {}; }

  global.ConceptEngine = global.ConceptEngine || {};
  global.ConceptEngine.loader = {
    loadConceptIndex: loadConceptIndex,
    loadSearchIndex:  loadSearchIndex,
    loadServiceNode:  loadServiceNode,
    clearCache:       clearCache,
  };

}(window));
