/**
 * TagSystem.js — 設計軸タグ・SAPドメインタグによるノードフィルタリング状態管理
 * contracts/js-engine-api.md §5 に準拠
 *
 * フィルタロジック:
 *   - フィルタなし: 常に true
 *   - フィルタあり: axisTags OR条件 AND sapDomains OR条件
 *     - どちらかのグループが空の場合はそのグループを無視
 */

(function (global) {
  'use strict';

  var _activeAxisTags   = {}; // Set相当: { [tagId: string]: true }
  var _activeSapDomains = {}; // Set相当: { [domainId: string]: true }
  var _listeners        = [];

  /** フィルタ変更を全リスナーに通知する。 */
  function _notify() {
    var filters = getActiveFilters();
    _listeners.forEach(function (cb) {
      try { cb(filters); } catch (e) { console.warn('[TagSystem] listener error', e); }
    });
  }

  /**
   * 設計軸タグの選択状態をトグルする。
   * @param {string} tagId
   */
  function toggleAxisTag(tagId) {
    if (!tagId) return;
    if (_activeAxisTags[tagId]) {
      delete _activeAxisTags[tagId];
    } else {
      _activeAxisTags[tagId] = true;
    }
    _notify();
  }

  /**
   * SAPドメインタグの選択状態をトグルする。
   * @param {string} domainId
   */
  function toggleSapDomain(domainId) {
    if (!domainId) return;
    if (_activeSapDomains[domainId]) {
      delete _activeSapDomains[domainId];
    } else {
      _activeSapDomains[domainId] = true;
    }
    _notify();
  }

  /** 全フィルタをクリアする。 */
  function clearAll() {
    _activeAxisTags   = {};
    _activeSapDomains = {};
    _notify();
  }

  /**
   * 現在アクティブなフィルタ一覧を返す。
   * @returns {{ axisTags: string[], sapDomains: string[] }}
   */
  function getActiveFilters() {
    return {
      axisTags:   Object.keys(_activeAxisTags),
      sapDomains: Object.keys(_activeSapDomains),
    };
  }

  /**
   * 指定ノードが現在のフィルタ条件を満たすかどうかを返す。
   *
   * ロジック:
   *   - フィルタなし (axisTags=[] かつ sapDomains=[]) → 常に true
   *   - axisTags あり: entry.axis_tags のいずれかが選択中に含まれるか
   *   - sapDomains あり: entry.sap_domains のいずれかが選択中に含まれるか
   *   - 両グループが有効な場合: 両方を AND で評価
   *   - 片方のグループが空の場合: 有効なグループのみ評価
   *
   * @param {Object} entry - ConceptIndexEntry
   * @returns {boolean}
   */
  function matchesNode(entry) {
    var axisKeys = Object.keys(_activeAxisTags);
    var sapKeys  = Object.keys(_activeSapDomains);

    // フィルタなし → 全件表示
    if (axisKeys.length === 0 && sapKeys.length === 0) return true;

    var entryAxisTags   = entry.axis_tags   || [];
    var entrySapDomains = entry.sap_domains || [];

    var axisMatch = true;
    var sapMatch  = true;

    if (axisKeys.length > 0) {
      axisMatch = axisKeys.some(function (tagId) {
        return entryAxisTags.indexOf(tagId) !== -1;
      });
    }

    if (sapKeys.length > 0) {
      sapMatch = sapKeys.some(function (domainId) {
        return entrySapDomains.indexOf(domainId) !== -1;
      });
    }

    return axisMatch && sapMatch;
  }

  /**
   * フィルタ変更イベントのリスナーを登録する。
   * @param {Function} callback - (filters: ActiveFilters) => void
   */
  function onChange(callback) {
    if (typeof callback === 'function') {
      _listeners.push(callback);
    }
  }

  global.ConceptEngine = global.ConceptEngine || {};
  global.ConceptEngine.tags = {
    toggleAxisTag:   toggleAxisTag,
    toggleSapDomain: toggleSapDomain,
    clearAll:        clearAll,
    getActiveFilters: getActiveFilters,
    matchesNode:     matchesNode,
    onChange:        onChange,
  };

}(window));
