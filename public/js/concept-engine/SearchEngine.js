/**
 * SearchEngine.js — search-index.json を使った全文横断検索
 * contracts/js-engine-api.md §4 に準拠
 *
 * 検索アルゴリズム: String.includes() + フラット文字列キャッシュ (_flat)
 * 3文字未満のクエリは [] を返す（ノイズ抑制）。
 * 結果は layer 昇順ソート・最大100件。
 */

(function (global) {
  'use strict';

  var _entries = []; // SearchIndexEntry[] + _flat プロパティ付き
  var _ready   = false;

  /**
   * search-index.json エントリ配列で初期化する。
   * 各エントリに _flat プロパティを付与してキャッシュ。
   * @param {Array} entries
   */
  function init(entries) {
    _entries = [];
    _ready   = false;

    if (!Array.isArray(entries)) {
      console.warn('[SearchEngine] init: entries is not an array');
      return;
    }

    _entries = entries.map(function (entry) {
      var flat = [
        entry.name_ja        || '',
        entry.name_en        || '',
        entry.description_ja || '',
        entry.sap_tip        || '',
        (entry.axis_tags     || []).join(' '),
        (entry.sap_domains   || []).join(' '),
        (entry.tags          || []).join(' '),
      ].join(' ').toLowerCase();

      return Object.assign({}, entry, { _flat: flat });
    });

    _ready = true;
  }

  /**
   * クエリ文字列で全文検索する。
   * @param {string} query
   * @returns {Array} SearchResult[] (最大100件, layer昇順)
   */
  function search(query) {
    if (!_ready || !query || query.length < 3) return [];

    var q = query.toLowerCase();

    var results = _entries.filter(function (e) {
      return e._flat.indexOf(q) !== -1;
    });

    // layer 昇順ソート
    results.sort(function (a, b) { return a.layer - b.layer; });

    // 最大100件
    if (results.length > 100) results = results.slice(0, 100);

    // _flat を除いた clean なオブジェクトを返す
    return results.map(function (e) {
      return {
        id:             e.id,
        layer:          e.layer,
        type:           e.type,
        name_ja:        e.name_ja,
        name_en:        e.name_en,
        description_ja: e.description_ja,
        sap_tip:        e.sap_tip,
        axis_tags:      e.axis_tags,
        sap_domains:    e.sap_domains,
        tags:           e.tags,
      };
    });
  }

  /** 初期化済みかどうか。 */
  function isReady() { return _ready; }

  global.ConceptEngine = global.ConceptEngine || {};
  global.ConceptEngine.search = {
    init:    init,
    search:  search,
    isReady: isReady,
  };

}(window));
