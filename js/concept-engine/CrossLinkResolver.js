/**
 * CrossLinkResolver.js — クロスリンクの双方向解決
 * contracts/js-engine-api.md §3 に準拠
 *
 * ServiceNode の crosslinks[] はソース側のみ宣言する。
 * build() が全 ServiceNode を走査して reverseIndex を自動構築する。
 */

(function (global) {
  'use strict';

  var _reverseIndex = {}; // { [targetId: string]: ReverseEntry[] }
  var _outbound     = {}; // { [nodeId: string]: CrossLinkEntry[] }
  var _built        = false;

  /**
   * 全 ServiceNode を走査して reverseIndex を構築する。
   * @param {Array} serviceNodes - loadServiceNode() で取得した ServiceNode の配列
   */
  function build(serviceNodes) {
    _reverseIndex = {};
    _outbound     = {};

    if (!Array.isArray(serviceNodes)) return;

    serviceNodes.forEach(function (svc) {
      if (!svc || !svc.id) return;
      var links = svc.crosslinks;
      if (!Array.isArray(links)) return;

      _outbound[svc.id] = links;

      links.forEach(function (cl) {
        var tid = cl.target_id;
        if (!tid) return;

        // target_id が ConceptIndex に存在しない場合は警告して除外
        if (global.ConceptEngine.index.isReady() && !global.ConceptEngine.index.getById(tid)) {
          console.warn('[CrossLinkResolver] target_id not found: ' + tid + ' (from ' + svc.id + ')');
          return;
        }

        if (!_reverseIndex[tid]) _reverseIndex[tid] = [];
        _reverseIndex[tid].push({
          from_id:        svc.id,
          type:           cl.type,
          description_ja: cl.description_ja || '',
        });
      });
    });

    _built = true;
  }

  /** 指定ノードから出るクロスリンクを返す。 */
  function getOutbound(nodeId) {
    return _outbound[nodeId] || [];
  }

  /** 指定ノードへ入る逆リンクを返す。 */
  function getInbound(nodeId) {
    return _reverseIndex[nodeId] || [];
  }

  /** build() が完了済みかどうか。 */
  function isBuilt() { return _built; }

  global.ConceptEngine = global.ConceptEngine || {};
  global.ConceptEngine.resolver = {
    build:      build,
    getOutbound: getOutbound,
    getInbound:  getInbound,
    isBuilt:    isBuilt,
  };

}(window));
