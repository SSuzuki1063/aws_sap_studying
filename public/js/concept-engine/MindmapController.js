/**
 * MindmapController.js — 横向きマインドマップ + 右詳細パネル コントローラー
 * concept-map.html 専用の IIFE。ConceptEngine 名前空間は使用しない。
 * 依存: ConceptLoader, ConceptIndex, CrossLinkResolver, SearchEngine（事前ロード済み）
 */
(function () {
  'use strict';

  /* ============================================================
   * 状態管理
   * ============================================================ */
  var _loadedSvcs = {};   // { [svcId: string]: Promise<ServiceNode|null> } 共有キャッシュ
  var _selectedId  = null; // 現在選択中のノードID
  var _isMobile    = false; // ≤900px かどうか
  var _activeTab   = 'map'; // 'map' | 'detail'
  var _diagLoaded  = false; // DiagramRenderer.js 遅延ロード済みフラグ

  /* ── アニメーション: prefers-reduced-motion 検出 ── */
  var _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', function (e) { _prefersReducedMotion = e.matches; });

  /* ── プログレス・フィルタ・パンくず用 ── */
  var _visitedSvcs      = {};   // { [svcId]: true } 訪問済みL2サービス
  var _totalSvcCount    = 0;    // L2サービス総数
  var _activeAxisTags   = {};   // 有効な設計軸フィルタ
  var _activeSapDomains = {};   // 有効なSAPドメインフィルタ
  var _currentDomain    = null; // パンくず用: 現在のL1ドメイン IndexEntry
  var _currentService   = null; // パンくず用: 現在のL2サービス IndexEntry

  /* DiagramRenderer.js が生成する SVGノードのクリックから呼ばれる */
  window._scrollToNode = navigateToNode;

  /* ============================================================
   * DOM ヘルパー
   * ============================================================ */
  function _el(tag, opts) {
    var el = document.createElement(tag);
    if (opts) {
      if (opts.cls)    { el.className = opts.cls; }
      if (opts.text)   { el.textContent = opts.text; }
      if (opts.role)   { el.setAttribute('role', opts.role); }
      if (opts.hidden) { el.hidden = true; }
      if (opts.id)     { el.id = opts.id; }
    }
    return el;
  }

  function _badge(layerNum, label) {
    return _el('span', {
      cls: 'layer-badge l' + layerNum + '-badge',
      text: label || ('L' + layerNum)
    });
  }

  /* ============================================================
   * アニメーション ヘルパー (アコーディオン開閉)
   * ============================================================ */

  /**
   * アコーディオン展開: hidden 解除 → mm-enter-from → reflow → クラス除去
   * @param {HTMLElement} el - .mm-node-children 要素
   * @param {Function} [cb] - トランジション完了後のコールバック
   */
  function _animateOpen(el, cb) {
    el.hidden = false;
    if (_prefersReducedMotion) {
      el.classList.remove('mm-enter-from', 'mm-leave-to');
      if (cb) { cb(); }
      return;
    }
    el.classList.remove('mm-leave-to');
    el.classList.add('mm-enter-from');
    /* reflow 強制 */
    void el.offsetHeight;
    el.classList.remove('mm-enter-from');
    if (cb) {
      var done = false;
      var finish = function () {
        if (done) { return; }
        done = true;
        el.removeEventListener('transitionend', onEnd);
        cb();
      };
      var onEnd = function (e) {
        if (e.target === el) { finish(); }
      };
      el.addEventListener('transitionend', onEnd);
      setTimeout(finish, 300); /* fallback */
    }
  }

  /**
   * アコーディオン閉鎖: mm-leave-to 追加 → transitionend → hidden = true
   * @param {HTMLElement} el - .mm-node-children 要素
   * @param {Function} [cb] - トランジション完了後のコールバック
   */
  function _animateClose(el, cb) {
    if (_prefersReducedMotion) {
      el.hidden = true;
      el.classList.remove('mm-enter-from', 'mm-leave-to');
      if (cb) { cb(); }
      return;
    }
    el.classList.remove('mm-enter-from');
    el.classList.add('mm-leave-to');
    var done = false;
    var finish = function () {
      if (done) { return; }
      done = true;
      el.removeEventListener('transitionend', onEnd);
      el.classList.remove('mm-leave-to');
      el.hidden = true;
      if (cb) { cb(); }
    };
    var onEnd = function (e) {
      if (e.target === el) { finish(); }
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, 300); /* fallback */
  }

  /* ============================================================
   * エントリポイント
   * ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    _initProgress(); /* localStorage から進捗復元 */

    ConceptEngine.loader.loadConceptIndex().then(function (manifest) {
      if (!manifest) {
        var msg = document.getElementById('loading-msg');
        if (msg) { msg.textContent = 'データの読み込みに失敗しました。'; }
        return;
      }
      ConceptEngine.index.init(manifest);

      var msg = document.getElementById('loading-msg');
      if (msg) { msg.remove(); }

      _renderMindmap();
      _totalSvcCount = ConceptEngine.index.getByLayer(2).length;
      _updateProgress();  /* 総数確定後に再計算 */
      _initSearch();
      _initMobileTabs();
      _initResizeWatcher();
      _initResizableHandle();
      _initFilters();     /* タグフィルタ初期化 */
      _updateBreadcrumb(0, null); /* 初期パンくず（ルートのみ） */
    });
  });

  /* ============================================================
   * マインドマップツリー描画
   * ============================================================ */

  /** L1ドメインを mm-tree に全展開でレンダー */
  function _renderMindmap() {
    var treeEl = document.getElementById('mm-tree');
    if (!treeEl) { return; }
    while (treeEl.firstChild) { treeEl.removeChild(treeEl.firstChild); }

    var domains = ConceptEngine.index.getByLayer(1);
    if (!domains.length) {
      var li = _el('li');
      li.textContent = 'ドメインデータが見つかりませんでした。';
      treeEl.appendChild(li);
      return;
    }
    domains.forEach(function (domain) {
      treeEl.appendChild(_makeL1Item(domain));
    });
  }

  /** L1 li 要素（デフォルト展開・L2を即時レンダー） */
  function _makeL1Item(domain) {
    var li = document.createElement('li');

    /* L1 ボタン */
    var btn = _el('button', { cls: 'mm-node-btn mm-l1-btn' });
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'true');
    btn.dataset.nodeId = domain.id;

    var arrow = _el('span', { cls: 'mm-arrow', text: '▶' });
    arrow.setAttribute('aria-hidden', 'true');
    btn.appendChild(arrow);
    btn.appendChild(_badge(1));
    btn.appendChild(_el('span', { cls: 'node-name-ja', text: domain.name_ja }));

    /* L2 子コンテナ（デフォルト展開） */
    var childrenId = 'mm-children-' + domain.id;
    var children = _el('div', { cls: 'mm-node-children' });
    children.id = childrenId;
    btn.setAttribute('aria-controls', childrenId);
    btn.setAttribute('aria-expanded', 'true');

    /* L2サービス一覧を即時レンダー */
    var l2ul = document.createElement('ul');
    var services = ConceptEngine.index.getByLayer(2).filter(function (s) {
      return s.parent_domain_id === domain.id;
    });
    if (services.length) {
      services.forEach(function (svc) {
        l2ul.appendChild(_makeL2Item(svc));
      });
    }
    children.appendChild(l2ul);

    /* L1クリック: 展開トグル + 選択 */
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var nowOpen = !isOpen;
      btn.setAttribute('aria-expanded', String(nowOpen));
      if (nowOpen) { _animateOpen(children); }
      else         { _animateClose(children); }
      _selectNode(domain.id, 1, domain);
    });

    li.appendChild(btn);
    li.appendChild(children);
    return li;
  }

  /** L2 li 要素（デフォルト折りたたみ・L3は遅延ロード） */
  function _makeL2Item(svc) {
    var li = document.createElement('li');
    li.className = 'mm-l2-item'; /* フィルタリング対象クラス */
    li.dataset.axisTags   = (svc.axis_tags    || []).join(',');
    li.dataset.sapDomains = (svc.sap_domains  || []).join(',');

    /* L2 ボタン */
    var btn = _el('button', { cls: 'mm-node-btn mm-l2-btn' });
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.dataset.nodeId = svc.id;

    var arrow = _el('span', { cls: 'mm-arrow', text: '▶' });
    arrow.setAttribute('aria-hidden', 'true');
    btn.appendChild(arrow);
    btn.appendChild(_badge(2));
    btn.appendChild(_el('span', { cls: 'node-name-ja', text: svc.name_ja }));
    if (svc.name_en && svc.name_en !== svc.name_ja) {
      btn.appendChild(_el('span', { cls: 'node-name-en', text: svc.name_en }));
    }

    /* L3 子コンテナ（デフォルト hidden） */
    var childrenId = 'mm-children-' + svc.id;
    var children = _el('div', { cls: 'mm-node-children' });
    children.id = childrenId;
    children.hidden = true;
    btn.setAttribute('aria-controls', childrenId);

    var l3ul = document.createElement('ul');
    l3ul.className = 'mm-l3-list';
    /* ローディングプレースホルダー */
    var loadingLi = _el('li', { cls: 'mm-l3-loading', text: '読み込み中…' });
    l3ul.appendChild(loadingLi);
    children.appendChild(l3ul);

    var l3Rendered = false;

    /* L2クリック: 展開トグル + 選択（同一ボタン） */
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var nowOpen = !isOpen;
      btn.setAttribute('aria-expanded', String(nowOpen));
      if (nowOpen) { _animateOpen(children); }
      else         { _animateClose(children); }

      /* 選択ハイライト + 詳細パネル（常に呼ぶ） */
      _selectNode(svc.id, 2, svc);

      /* L3 遅延ロード（初回展開時のみ） */
      if (nowOpen && !l3Rendered) {
        l3Rendered = true;
        _loadAndRenderL3(svc.id, l3ul, loadingLi);
      }
    });

    li.appendChild(btn);
    li.appendChild(children);
    return li;
  }

  /**
   * ラジアルバースト角度計算
   * @param {number} i - インデックス
   * @param {number} total - 総数
   * @returns {{ x: number, y: number }}
   */
  function _burstOffset(i, total) {
    if (total <= 1) { return { x: 0, y: -12 }; }
    var angle = -Math.PI / 2 + (Math.PI * i / (total - 1));
    return {
      x: Math.round(Math.cos(angle) * 18),
      y: Math.round(Math.sin(angle) * 18)
    };
  }

  /** L3 概念リストを遅延ロードしてレンダー（ラジアルバースト付き） */
  function _loadAndRenderL3(svcId, ul, loadingLi) {
    _ensureLoaded(svcId).then(function (node) {
      /* ローディング表示を削除 */
      if (loadingLi && loadingLi.parentNode === ul) {
        ul.removeChild(loadingLi);
      }
      if (!node || !node.key_concepts) { return; }

      var items = [];
      var total = node.key_concepts.length;
      node.key_concepts.forEach(function (concept, i) {
        var li = _makeL3Item(concept);
        /* バースト初期状態を設定 */
        if (!_prefersReducedMotion) {
          var offset = _burstOffset(i, total);
          li.style.setProperty('--burst-x', offset.x + 'px');
          li.style.setProperty('--burst-y', offset.y + 'px');
          li.style.setProperty('--burst-delay', (i * 0.04) + 's');
          li.classList.add('mm-burst-from');
        }
        ul.appendChild(li);
        items.push(li);
      });

      /* reflow 強制 → mm-burst-from 除去でトランジション発火 */
      if (!_prefersReducedMotion && items.length) {
        void ul.offsetHeight;
        items.forEach(function (li) {
          li.classList.remove('mm-burst-from');
        });
      }

      /* 現在 L2 が選択中なら詳細パネルを完全再描画 */
      if (_selectedId === svcId) {
        _renderDetailL2(ConceptEngine.index.getById(svcId), node);
      }
    });
  }

  /** L3 li 要素（リーフ: クリックで selectNode のみ） */
  function _makeL3Item(concept) {
    var li = document.createElement('li');

    var btn = _el('button', { cls: 'mm-node-btn mm-l3-btn' });
    btn.type = 'button';
    btn.dataset.nodeId = concept.id;
    btn.appendChild(_badge(3));
    btn.appendChild(_el('span', { cls: 'node-name-ja', text: concept.name_ja }));

    btn.addEventListener('click', function () {
      _selectNode(concept.id, 3, concept);
    });

    li.appendChild(btn);
    return li;
  }

  /* ============================================================
   * サービスJSONキャッシュ管理
   * ============================================================ */

  /**
   * svcId の ServiceNode を返す Promise（共有キャッシュ）。
   * 初回ロード時のみ fetch + resolver.build() を実行。
   */
  function _ensureLoaded(svcId) {
    if (!_loadedSvcs[svcId]) {
      _loadedSvcs[svcId] = ConceptEngine.loader.loadServiceNode(svcId).then(function (node) {
        if (node) {
          ConceptEngine.resolver.build([node]);
        }
        return node;
      });
    }
    return _loadedSvcs[svcId];
  }

  /* ============================================================
   * 選択処理
   * ============================================================ */

  /**
   * ノードを選択: ハイライト更新 + 詳細パネル更新 + モバイルタブ切替
   * @param {string} id - ノードID
   * @param {number} layer - 1=domain, 2=service, 3=concept
   * @param {object} data - IndexEntry または ConceptNode
   */
  function _selectNode(id, layer, data) {
    /* 前の選択をクリア */
    document.querySelectorAll('.mm-node-btn.mm-selected').forEach(function (el) {
      el.classList.remove('mm-selected');
    });

    _selectedId = id;

    /* 新しい選択をハイライト */
    var btn = document.querySelector('[data-node-id="' + id + '"]');
    if (btn) { btn.classList.add('mm-selected'); }

    /* パンくず・進捗用の状態更新 */
    if (layer === 1) {
      _currentDomain  = data;
      _currentService = null;
    } else if (layer === 2) {
      _currentService = data;
      /* parent_domain_id から L1 エントリを取得 */
      if (data.parent_domain_id) {
        _currentDomain = ConceptEngine.index.getById(data.parent_domain_id) || _currentDomain;
      }
      _markVisited(id);
    }
    /* L3 の場合は _currentDomain / _currentService は変更しない（L2展開済み） */

    /* パンくず更新・アナウンス */
    _updateBreadcrumb(layer, data);
    _announce((data.name_ja || id) + 'を選択しました');

    /* 詳細パネル更新 */
    if (layer === 1) {
      _renderDetailL1(data);
    } else if (layer === 2) {
      /* キャッシュ済みなら即時完全表示、未ロードなら部分表示→ロード後に再描画 */
      if (_loadedSvcs[id]) {
        _loadedSvcs[id].then(function (node) {
          _renderDetailL2(data, node);
        });
      } else {
        _renderDetailL2(data, null); /* 部分表示 */
        _ensureLoaded(id).then(function (node) {
          if (_selectedId === id) { _renderDetailL2(data, node); }
        });
      }
    } else if (layer === 3) {
      _renderDetailL3(data);
    }

    /* モバイル: L3選択時は詳細タブへ自動遷移 */
    if (_isMobile && layer === 3) {
      _switchTab('detail');
    }
  }

  /* ============================================================
   * 詳細パネル描画
   * ============================================================ */

  function _clearDetailPanel() {
    var panel = document.getElementById('mm-detail-panel');
    if (panel) { while (panel.firstChild) { panel.removeChild(panel.firstChild); } }
    return panel;
  }

  /** L1 ドメイン詳細 */
  function _renderDetailL1(domain) {
    var panel = _clearDetailPanel();
    if (!panel) { return; }

    var header = _el('div', { cls: 'mm-detail-header' });
    var nameJa = _el('h2', { cls: 'mm-detail-name-ja', text: domain.name_ja });
    nameJa.setAttribute('role', 'heading');
    header.appendChild(nameJa);
    if (domain.name_en) {
      header.appendChild(_el('p', { cls: 'mm-detail-name-en', text: domain.name_en }));
    }
    panel.appendChild(header);

    /* 設計軸タグ */
    if (domain.axis_tags && domain.axis_tags.length) {
      panel.appendChild(_makeAxisTags(domain.axis_tags));
    }

    /* ドメイン説明 */
    if (domain.description_ja) {
      panel.appendChild(_el('p', { cls: 'mm-detail-desc', text: domain.description_ja }));
    } else {
      var hint = _el('p', { cls: 'mm-detail-placeholder', text: 'このドメインのサービスを選択してください' });
      panel.appendChild(hint);
    }
  }

  /** L2 サービス詳細（svcNode=null時は部分表示） */
  function _renderDetailL2(entry, svcNode) {
    var panel = _clearDetailPanel();
    if (!panel) { return; }

    var displayNode = svcNode || entry;

    var header = _el('div', { cls: 'mm-detail-header' });
    var nameJa = _el('h2', { cls: 'mm-detail-name-ja', text: displayNode.name_ja });
    nameJa.setAttribute('role', 'heading');
    header.appendChild(nameJa);
    if (displayNode.name_en) {
      header.appendChild(_el('p', { cls: 'mm-detail-name-en', text: displayNode.name_en }));
    }
    panel.appendChild(header);

    /* 設計軸タグ */
    var axisTags = (svcNode || entry).axis_tags;
    if (axisTags && axisTags.length) {
      panel.appendChild(_makeAxisTags(axisTags));
    }

    /* SAP Tip */
    var sapTip = svcNode ? svcNode.sap_tip : (entry ? entry.sap_tip : null);
    if (sapTip) {
      var tip = _el('p', { cls: 'sap-tip' });
      tip.appendChild(_el('span', { cls: 'sap-tip-label', text: 'SAP Tip' }));
      tip.appendChild(document.createTextNode(' ' + sapTip));
      panel.appendChild(tip);
    }

    /* 説明文 */
    var desc = svcNode ? svcNode.description_ja : (entry ? entry.description_ja : null);
    if (desc) {
      panel.appendChild(_el('p', { cls: 'mm-detail-desc', text: desc }));
    }

    /* ロード中の場合はスピナーを表示 */
    if (!svcNode) {
      panel.appendChild(_el('p', { cls: 'mm-l3-loading', text: '詳細を読み込み中…' }));
      return;
    }

    /* クロスリンク */
    var outbound = ConceptEngine.resolver.getOutbound(entry ? entry.id : svcNode.id);
    if (outbound.length) {
      panel.appendChild(_makeCrossLinks(outbound));
    }

    /* 関連HTMLリソース（L2レベル） */
    var svcHtmlRes = svcNode.html_resources;
    if (svcHtmlRes && svcHtmlRes.length) {
      panel.appendChild(_makeHtmlResources(svcHtmlRes));
    }

    /* key_concepts リスト（概念名のみ） */
    if (svcNode.key_concepts && svcNode.key_concepts.length) {
      var khEl = _el('h3', { cls: 'mm-keywords-heading', text: '主要概念' });
      panel.appendChild(khEl);
      var ul = _el('ul');
      ul.style.cssText = 'list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.25rem;';
      svcNode.key_concepts.forEach(function (c) {
        var li = _el('li');
        var cBtn = _el('button', { cls: 'mm-node-btn mm-l3-btn' });
        cBtn.type = 'button';
        cBtn.dataset.nodeId = c.id;
        cBtn.appendChild(_badge(3));
        cBtn.appendChild(_el('span', { cls: 'node-name-ja', text: c.name_ja }));
        cBtn.addEventListener('click', function () {
          /* ツリー上のL3ボタンもクリックして同期 */
          var treeBtn = document.querySelector('[data-node-id="' + c.id + '"]');
          if (treeBtn && treeBtn !== cBtn) { treeBtn.click(); } else { _selectNode(c.id, 3, c); }
        });
        li.appendChild(cBtn);
        ul.appendChild(li);
      });
      panel.appendChild(ul);
    }
  }

  /** L3 概念詳細（ヘッダー・説明・SAPTip・説明トグル×2・Visual Language 3セクション・L4キーワード） */
  function _renderDetailL3(concept) {
    var panel = _clearDetailPanel();
    if (!panel) { return; }

    var header = _el('div', { cls: 'mm-detail-header' });
    var nameJa = _el('h2', { cls: 'mm-detail-name-ja', text: concept.name_ja });
    nameJa.setAttribute('role', 'heading');
    header.appendChild(nameJa);
    if (concept.name_en) {
      header.appendChild(_el('p', { cls: 'mm-detail-name-en', text: concept.name_en }));
    }
    panel.appendChild(header);

    /* 説明文 */
    if (concept.description_ja) {
      panel.appendChild(_el('p', { cls: 'mm-detail-desc', text: concept.description_ja }));
    }

    /* SAP Tip */
    if (concept.sap_tip) {
      var tip = _el('p', { cls: 'sap-tip' });
      tip.appendChild(_el('span', { cls: 'sap-tip-label', text: 'SAP Tip' }));
      tip.appendChild(document.createTextNode(' ' + concept.sap_tip));
      panel.appendChild(tip);
    }

    /* わかりやすい説明トグル */
    if (concept.explanation_basic) {
      panel.appendChild(_makeDetailToggle('📘', 'わかりやすい説明', concept.explanation_basic, concept.id + '-basic'));
    }

    /* 設計視点トグル */
    if (concept.explanation_arch) {
      panel.appendChild(_makeDetailToggle('🧠', '設計視点', concept.explanation_arch, concept.id + '-arch'));
    }

    /* 🏷️ 設計軸チップ（Visual Language） */
    if (concept.axis_tags && concept.axis_tags.length) {
      panel.appendChild(_makeVisToggle('🏷️', '設計軸', _makeAxisChipsContent(concept.axis_tags), concept.id + '-axis'));
    }

    /* 🧭 判断ステップ（Visual Language） */
    if (concept.decision_steps && concept.decision_steps.length) {
      panel.appendChild(_makeVisToggle('🧭', '判断ステップ', _makeDecisionStepsContent(concept.decision_steps), concept.id + '-steps'));
    }

    /* ⚖️ トレードオフカード（Visual Language） */
    if (concept.options && concept.options.length) {
      panel.appendChild(_makeVisToggle('⚖️', 'トレードオフ', _makeTradeoffCardsContent(concept.options), concept.id + '-tradeoff'));
    }

    /* L4 キーワード */
    if (concept.keywords && concept.keywords.length) {
      var kh = _el('h3', { cls: 'mm-keywords-heading', text: 'キーワード (L4)' });
      panel.appendChild(kh);
      concept.keywords.forEach(function (kw) {
        panel.appendChild(_makeKeywordItem(kw));
      });
    }

    /* 関連HTMLリソース（L3レベル） */
    if (concept.html_resources && concept.html_resources.length) {
      panel.appendChild(_makeHtmlResources(concept.html_resources));
    }
  }

  /* ============================================================
   * 詳細パネル部品
   * ============================================================ */

  /** 設計軸タグ群 */
  function _makeAxisTags(axisTags) {
    var wrap = _el('div', { cls: 'mm-axis-tags' });
    axisTags.forEach(function (t) {
      var label = t.replace('axis-', '');
      wrap.appendChild(_el('span', { cls: 'mm-axis-tag', text: label }));
    });
    return wrap;
  }

  /* ============================================================
   * Visual Language System（Section 7: 絵文字 + CSS ビジュアル）
   * ============================================================ */

  var AXIS_META = {
    'security':     { emoji: '🔒', cls: 'mm-vis-axis-chip--security' },
    'cost':         { emoji: '💰', cls: 'mm-vis-axis-chip--cost' },
    'availability': { emoji: '♻️', cls: 'mm-vis-axis-chip--availability' },
    'performance':  { emoji: '⚡', cls: 'mm-vis-axis-chip--performance' },
    'governance':   { emoji: '🏛️', cls: 'mm-vis-axis-chip--governance' },
    'scalability':  { emoji: '📈', cls: 'mm-vis-axis-chip--scalability' },
  };

  /* フィルタUIに表示するタグ一覧（JS定数） */
  var AXIS_TAG_LIST = [
    { id: 'axis-security',     label: '🔒 Security' },
    { id: 'axis-cost',         label: '💰 Cost' },
    { id: 'axis-availability', label: '♻️ Availability' },
    { id: 'axis-performance',  label: '⚡ Performance' },
    { id: 'axis-governance',   label: '🏛️ Governance' },
    { id: 'axis-scalability',  label: '📈 Scalability' },
  ];

  var SAP_DOMAIN_LIST = [
    { id: 'sap-design',    label: '設計' },
    { id: 'sap-migration', label: '移行' },
    { id: 'sap-cost',      label: 'コスト' },
    { id: 'sap-ci',        label: '継続的改善' },
  ];

  /** default-open トグルラッパー */
  function _makeVisToggle(icon, label, contentEl, uid) {
    var wrapper = _el('div', { cls: 'mm-vis-section' });
    var btnId = 'vsbtn-' + uid;
    var panId = 'vspan-' + uid;

    var btn = _el('button', { cls: 'mm-vis-toggle-btn' });
    btn.type = 'button';
    btn.id = btnId;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', panId);
    btn.textContent = icon + ' ' + label + ' ▲';

    var panel = _el('div', { cls: 'mm-vis-toggle-panel' });
    panel.id = panId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', btnId);
    panel.appendChild(contentEl);

    btn.addEventListener('click', function () {
      var nowOpen = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(nowOpen));
      btn.textContent = icon + ' ' + label + (nowOpen ? ' ▲' : ' ▼');
      panel.hidden = !nowOpen;
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(panel);
    return wrapper;
  }

  /** 設計軸チップコンテンツ（AXIS_META参照） */
  function _makeAxisChipsContent(axisTags) {
    var wrap = _el('div', { cls: 'mm-vis-axis-chips' });
    (axisTags || []).forEach(function (t) {
      var label = t.replace('axis-', '');
      var meta = AXIS_META[label] || { emoji: '', cls: 'mm-vis-axis-chip--default' };
      var chip = _el('span', { cls: 'mm-vis-axis-chip ' + meta.cls });
      chip.textContent = meta.emoji + ' ' + label;
      wrap.appendChild(chip);
    });
    return wrap;
  }

  /** 判断ステップコンテンツ（text / branch の2形式） */
  function _makeDecisionStepsContent(steps) {
    var ol = _el('ol', { cls: 'mm-vis-steps' });
    (steps || []).forEach(function (step, i) {
      var li = _el('li', { cls: 'mm-vis-step-item' });
      li.appendChild(_el('span', { cls: 'mm-vis-step-num', text: String(i + 1) }));
      if (step.text) {
        li.appendChild(_el('span', { cls: 'mm-vis-step-text', text: step.text }));
      } else if (step.q) {
        var branch = _el('div', { cls: 'mm-vis-step-branch' });
        branch.appendChild(_el('p', { cls: 'mm-vis-step-q', text: '❓ ' + step.q }));
        var branches = _el('div', { cls: 'mm-vis-step-branches' });
        if (step.yes) {
          branches.appendChild(_el('span', { cls: 'mm-vis-branch-yes', text: '✅ Yes → ' + step.yes }));
        }
        if (step.no) {
          branches.appendChild(_el('span', { cls: 'mm-vis-branch-no', text: '❌ No → ' + step.no }));
        }
        branch.appendChild(branches);
        li.appendChild(branch);
      }
      ol.appendChild(li);
    });
    return ol;
  }

  /** トレードオフカードコンテンツ */
  function _makeTradeoffCardsContent(options) {
    var wrap = _el('div', { cls: 'mm-vis-options' });
    (options || []).forEach(function (opt) {
      var card = _el('div', { cls: 'mm-vis-option-card' });

      var nameDiv = _el('div', { cls: 'mm-vis-option-name' });
      if (opt.emoji) {
        nameDiv.appendChild(_el('span', { cls: 'mm-vis-option-emoji', text: opt.emoji }));
      }
      var strong = document.createElement('strong');
      strong.textContent = opt.name || '';
      nameDiv.appendChild(strong);
      card.appendChild(nameDiv);

      var proscons = _el('div', { cls: 'mm-vis-pros-cons' });
      var prosList = _el('ul', { cls: 'mm-vis-pros' });
      (opt.pros || []).forEach(function (p) {
        prosList.appendChild(_el('li', { text: p }));
      });
      var consList = _el('ul', { cls: 'mm-vis-cons' });
      (opt.cons || []).forEach(function (c) {
        consList.appendChild(_el('li', { text: c }));
      });
      proscons.appendChild(prosList);
      proscons.appendChild(consList);
      card.appendChild(proscons);

      if (opt.tags && opt.tags.length) {
        var tagsDiv = _el('div', { cls: 'mm-vis-option-tags' });
        opt.tags.forEach(function (t) {
          tagsDiv.appendChild(_el('span', { cls: 'mm-vis-option-tag', text: t }));
        });
        card.appendChild(tagsDiv);
      }

      wrap.appendChild(card);
    });
    return wrap;
  }

  /** クロスリンクセクション（詳細パネル内） */
  function _makeCrossLinks(outbound) {
    var section = _el('div', { cls: 'mm-crosslink-section' });
    section.appendChild(_el('p', { cls: 'mm-crosslink-label', text: '関連サービス' }));
    var badges = _el('div', { cls: 'mm-crosslink-badges' });
    outbound.forEach(function (cl) {
      var badge = _el('button', { cls: 'crosslink-badge crosslink-type-' + cl.type });
      badge.type = 'button';
      badge.title = cl.description_ja || '';
      badge.textContent = cl.target_id.replace('svc-', '').toUpperCase() + ' (' + cl.type + ')';
      badge.addEventListener('click', function () { navigateToNode(cl.target_id); });
      badges.appendChild(badge);
    });
    section.appendChild(badges);
    return section;
  }

  /** HTMLリソースリンクセクション（L2/L3共用） */
  function _makeHtmlResources(resources) {
    var section = _el('div', { cls: 'mm-html-resources' });
    var label = _el('p', { cls: 'mm-html-resources-label', text: '関連リソース' });
    section.appendChild(label);
    var list = _el('ul', { cls: 'mm-html-resources-list' });
    resources.forEach(function (res) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.setAttribute('href', '/aws_sap_studying/' + res.href);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.className = 'mm-html-resource-link';
      a.textContent = res.title;
      li.appendChild(a);
      list.appendChild(li);
    });
    section.appendChild(list);
    return section;
  }

  /** テキストトグルパネル（わかりやすい説明・設計視点） */
  function _makeDetailToggle(icon, label, bodyText, uid) {
    var wrapper = _el('div', { cls: 'detail-toggle' });
    var btnId = 'dtbtn-' + uid;
    var panId = 'dtpan-' + uid;

    var btn = _el('button', { cls: 'detail-toggle-btn' });
    btn.type = 'button';
    btn.id = btnId;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', panId);
    btn.textContent = icon + ' ' + label + ' ▼';

    var panel = _el('div', { cls: 'detail-toggle-panel' });
    panel.id = panId;
    panel.hidden = true;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', btnId);

    var body = _el('p', { cls: 'detail-body', text: bodyText });
    panel.appendChild(body);

    btn.addEventListener('click', function () {
      var nowOpen = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(nowOpen));
      btn.textContent = icon + ' ' + label + (nowOpen ? ' ▲' : ' ▼');
      panel.hidden = !nowOpen;
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(panel);
    return wrapper;
  }

  /** SVG図トグルパネル（DiagramRenderer 遅延ロード） */
  function _makeDiagramToggle(diagramData, uid) {
    var wrapper = _el('div', { cls: 'detail-toggle' });
    var btnId = 'dgbtn-' + uid;
    var panId = 'dgpan-' + uid;

    var btn = _el('button', { cls: 'detail-toggle-btn' });
    btn.type = 'button';
    btn.id = btnId;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', panId);
    btn.textContent = '📊 概念図 ▼';

    var panel = _el('div', { cls: 'detail-toggle-panel diagram-panel' });
    panel.id = panId;
    panel.hidden = true;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', btnId);

    var rendered = false;
    btn.addEventListener('click', function () {
      var nowOpen = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(nowOpen));
      btn.textContent = '📊 概念図' + (nowOpen ? ' ▲' : ' ▼');
      panel.hidden = !nowOpen;
      if (nowOpen && !rendered) {
        rendered = true;
        _lazyLoadDiagramRenderer(function () {
          if (window.ConceptEngine && window.ConceptEngine.diagram) {
            var svgEl = ConceptEngine.diagram.render(diagramData);
            if (svgEl) {
              panel.appendChild(svgEl);
            } else {
              panel.appendChild(_el('p', { text: '図データの読み込みに失敗しました' }));
            }
          } else {
            panel.appendChild(_el('p', { text: '図データの読み込みに失敗しました' }));
          }
        });
      }
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(panel);
    return wrapper;
  }

  /** DiagramRenderer.js 動的遅延ロード */
  function _lazyLoadDiagramRenderer(cb) {
    if (_diagLoaded || (window.ConceptEngine && window.ConceptEngine.diagram)) {
      _diagLoaded = true;
      cb();
      return;
    }
    var s = document.createElement('script');
    s.src = '/aws_sap_studying/js/concept-engine/DiagramRenderer.js';
    s.onload = function () { _diagLoaded = true; cb(); };
    s.onerror = function () { cb(); };
    document.head.appendChild(s);
  }

  /** L4 キーワードアイテム */
  function _makeKeywordItem(kw) {
    var hasExtended = kw.explanation_basic || kw.explanation_arch || kw.concept_diagram;
    var item = _el('div', { cls: 'tree-item keyword-item layer4-item' });
    item.dataset.id = kw.id;
    item.setAttribute('role', 'treeitem');

    if (hasExtended) {
      item.classList.add('keyword-expandable');
      item.setAttribute('aria-expanded', 'false');

      var header = _el('div', { cls: 'keyword-header' });
      header.appendChild(_badge(4));
      header.appendChild(_el('span', { cls: 'node-name-ja', text: kw.name_ja }));
      header.appendChild(_el('span', { cls: 'node-name-en', text: kw.name_en }));
      var indicator = _el('span', { cls: 'kw-expand-indicator', text: '▶' });
      indicator.setAttribute('aria-hidden', 'true');
      header.appendChild(indicator);

      var children = _el('div', { cls: 'tree-children' });
      children.hidden = true;

      if (kw.description_ja) {
        children.appendChild(_el('p', { cls: 'keyword-desc', text: kw.description_ja }));
      }
      if (kw.explanation_basic) {
        children.appendChild(_makeDetailToggle('📘', 'わかりやすい説明', kw.explanation_basic, kw.id + '-basic'));
      }
      if (kw.explanation_arch) {
        children.appendChild(_makeDetailToggle('🧠', '設計視点', kw.explanation_arch, kw.id + '-arch'));
      }
      if (kw.concept_diagram) {
        children.appendChild(_makeDiagramToggle(kw.concept_diagram, kw.id));
      }

      header.addEventListener('click', function () {
        var nowOpen = item.getAttribute('aria-expanded') !== 'true';
        item.setAttribute('aria-expanded', String(nowOpen));
        indicator.textContent = nowOpen ? '▼' : '▶';
        children.hidden = !nowOpen;
      });
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
      });

      item.appendChild(header);
      item.appendChild(children);
    } else {
      var content = _el('div', { cls: 'keyword-content' });
      content.appendChild(_badge(4));
      content.appendChild(_el('span', { cls: 'node-name-ja', text: kw.name_ja }));
      content.appendChild(_el('span', { cls: 'node-name-en', text: kw.name_en }));
      if (kw.description_ja) {
        content.appendChild(_el('p', { cls: 'keyword-desc', text: kw.description_ja }));
      }
      item.appendChild(content);
    }

    return item;
  }

  /* ============================================================
   * ナビゲーション（外部呼出し・検索・クロスリンク）
   * ============================================================ */

  /**
   * IDで指定したノードに移動する。
   * ConceptIndex でレイヤーを確認し、適切な展開処理を行う。
   */
  function navigateToNode(id) {
    var entry = ConceptEngine.index.getById(id);
    if (!entry) {
      /* L3/L4 は ConceptIndex に入っていないため全サービスを検索 */
      _navigateToUnrenderedL3(id);
      return;
    }

    var layer = entry.layer;
    if (layer === 1) {
      _scrollAndSelect(id, layer, entry);
    } else if (layer === 2) {
      /* L2ボタンをクリックして展開 */
      var btn = document.querySelector('[data-node-id="' + id + '"]');
      if (btn) {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        if (!isOpen) { btn.click(); }
        else { _selectNode(id, 2, entry); }
        _scrollToBtn(btn);
      }
    } else {
      _scrollAndSelect(id, layer, entry);
    }
  }

  /** ボタン要素にスクロール + 祖先展開 + 選択 */
  function _scrollAndSelect(id, layer, data) {
    var btn = document.querySelector('[data-node-id="' + id + '"]');
    if (!btn) { return; }
    _expandAncestorsOf(btn);
    _scrollToBtn(btn);
    _selectNode(id, layer, data);
  }

  /** ボタン要素を中央にスクロール */
  function _scrollToBtn(btn) {
    var navCol = document.getElementById('mm-nav-col');
    if (navCol) {
      /* navCol スクロール領域内でスクロール */
      navCol.scrollTo({
        top: btn.offsetTop - navCol.offsetTop - 100,
        behavior: 'smooth'
      });
    }
    btn.classList.add('mm-highlight');
    setTimeout(function () { btn.classList.remove('mm-highlight'); }, 2000);
  }

  /** DOM上位を辿り hidden な mm-node-children を展開 */
  function _expandAncestorsOf(el) {
    var cur = el.parentElement;
    while (cur) {
      if (cur.classList && cur.classList.contains('mm-node-children') && cur.hidden) {
        cur.hidden = false;
        /* アニメーションクラスをクリーンアップ（即座に表示） */
        cur.classList.remove('mm-enter-from', 'mm-leave-to');
        /* 親ボタンの aria-expanded を更新 */
        var parentLi = cur.parentElement;
        if (parentLi) {
          var parentBtn = parentLi.querySelector('.mm-node-btn');
          if (parentBtn) {
            parentBtn.setAttribute('aria-expanded', 'true');
          }
        }
      }
      cur = cur.parentElement;
    }
  }

  /**
   * ConceptIndex に存在しないL3/L4 ID に対して:
   * 全サービスJSONを順次ロードして概念を検索し、見つかったら展開。
   */
  function _navigateToUnrenderedL3(conceptId) {
    var services = ConceptEngine.index.getByLayer(2);
    var found = false;

    /* まずキャッシュ済みを検索（同期） */
    var i;
    for (i = 0; i < services.length; i++) {
      var svcId = services[i].id;
      if (_loadedSvcs[svcId]) {
        /* キャッシュ済みPromiseが完了しているかチェック */
        _loadedSvcs[svcId].then(function (node) {
          if (found || !node) { return; }
          var concepts = node.key_concepts || [];
          for (var j = 0; j < concepts.length; j++) {
            if (concepts[j].id === conceptId) {
              found = true;
              _expandL2ThenNavigate(svcId, conceptId, concepts[j]);
              return;
            }
          }
        });
      }
    }

    /* キャッシュになければ全サービスをロードして検索 */
    if (!found) {
      var promises = services.map(function (svc) {
        return _ensureLoaded(svc.id).then(function (node) {
          if (found || !node) { return; }
          var concepts = node.key_concepts || [];
          for (var j = 0; j < concepts.length; j++) {
            if (concepts[j].id === conceptId) {
              found = true;
              _expandL2ThenNavigate(svc.id, conceptId, concepts[j]);
            }
          }
        });
      });
      Promise.all(promises); /* 並列ロード */
    }
  }

  /** L2を展開してからL3に移動 */
  function _expandL2ThenNavigate(svcId, conceptId, conceptData) {
    var l2Btn = document.querySelector('[data-node-id="' + svcId + '"]');
    if (l2Btn) {
      var isOpen = l2Btn.getAttribute('aria-expanded') === 'true';
      if (!isOpen) {
        l2Btn.click(); /* L2展開 + L3ロード開始 */
      }
      /* L3がレンダーされてから移動（アニメーション時間考慮） */
      setTimeout(function () {
        var l3Btn = document.querySelector('[data-node-id="' + conceptId + '"]');
        if (l3Btn) {
          _scrollToBtn(l3Btn);
          _selectNode(conceptId, 3, conceptData);
        }
      }, _prefersReducedMotion ? 100 : 500);
    }
  }

  /* ============================================================
   * 検索バー
   * ============================================================ */
  var _searchIndexLoaded = false;
  var _searchDebounce = null;

  function _initSearch() {
    var input     = document.getElementById('concept-search');
    var resultsEl = document.getElementById('search-results');
    var emptyEl   = document.getElementById('search-empty');
    if (!input) { return; }

    /* 初回フォーカスで遅延ロード（L1-L3のみにフィルタ） */
    input.addEventListener('focus', function onFirstFocus() {
      input.removeEventListener('focus', onFirstFocus);
      if (!_searchIndexLoaded) {
        _searchIndexLoaded = true;
        ConceptEngine.loader.loadSearchIndex().then(function (entries) {
          /* L4キーワードはマップナビ対象外 */
          var filtered = entries.filter(function (e) { return e.layer <= 3; });
          ConceptEngine.search.init(filtered);
        });
      }
    });

    /* 300ms デバウンス */
    input.addEventListener('input', function () {
      clearTimeout(_searchDebounce);
      var q = input.value.trim();
      if (!q || q.length < 3) {
        if (resultsEl) { resultsEl.hidden = true; }
        if (emptyEl)   { emptyEl.hidden = true; }
        return;
      }
      _searchDebounce = setTimeout(function () {
        if (!ConceptEngine.search.isReady()) { return; }
        _renderSearchResults(ConceptEngine.search.search(q), resultsEl, emptyEl);
      }, 300);
    });

    /* 外側クリックで閉じる */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.mm-search-section') && !e.target.closest('.search-section')) {
        if (resultsEl) { resultsEl.hidden = true; }
        if (emptyEl)   { emptyEl.hidden = true; }
      }
    });

    /* Escape キー */
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (resultsEl) { resultsEl.hidden = true; }
        if (emptyEl)   { emptyEl.hidden = true; }
        input.value = '';
      }
    });
  }

  function _renderSearchResults(results, resultsEl, emptyEl) {
    if (!resultsEl) { return; }
    while (resultsEl.firstChild) { resultsEl.removeChild(resultsEl.firstChild); }

    if (!results.length) {
      resultsEl.hidden = true;
      if (emptyEl) { emptyEl.hidden = false; }
      return;
    }

    if (emptyEl) { emptyEl.hidden = true; }
    results.slice(0, 20).forEach(function (r) {
      var item = _el('div', { cls: 'search-result-item', role: 'option' });
      item.setAttribute('tabindex', '0');
      item.appendChild(_badge(r.layer));
      item.appendChild(_el('span', { cls: 'result-name-ja', text: r.name_ja }));
      if (r.name_en && r.name_en !== r.name_ja) {
        item.appendChild(_el('span', { cls: 'result-name-en', text: r.name_en }));
      }
      item.addEventListener('click', function () {
        resultsEl.hidden = true;
        if (emptyEl) { emptyEl.hidden = true; }
        var inp = document.getElementById('concept-search');
        if (inp) { inp.value = ''; }
        navigateToNode(r.id);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
      });
      resultsEl.appendChild(item);
    });

    resultsEl.hidden = false;
  }

  /* ============================================================
   * モバイルタブ
   * ============================================================ */
  function _initMobileTabs() {
    var mapTab    = document.getElementById('mm-tab-map');
    var detailTab = document.getElementById('mm-tab-detail');
    if (!mapTab || !detailTab) { return; }

    mapTab.addEventListener('click', function () { _switchTab('map'); });
    detailTab.addEventListener('click', function () { _switchTab('detail'); });
  }

  function _switchTab(tab) {
    _activeTab = tab;
    var navCol    = document.getElementById('mm-nav-col');
    var detailCol = document.getElementById('mm-detail-col');
    var mapTab    = document.getElementById('mm-tab-map');
    var detailTab = document.getElementById('mm-tab-detail');

    if (!navCol || !detailCol) { return; }

    if (tab === 'map') {
      navCol.classList.remove('mm-col--hidden');
      detailCol.classList.add('mm-col--hidden');
      if (mapTab)    { mapTab.setAttribute('aria-selected', 'true');  mapTab.classList.add('mm-tab--active'); }
      if (detailTab) { detailTab.setAttribute('aria-selected', 'false'); detailTab.classList.remove('mm-tab--active'); }
    } else {
      navCol.classList.add('mm-col--hidden');
      detailCol.classList.remove('mm-col--hidden');
      if (mapTab)    { mapTab.setAttribute('aria-selected', 'false'); mapTab.classList.remove('mm-tab--active'); }
      if (detailTab) { detailTab.setAttribute('aria-selected', 'true'); detailTab.classList.add('mm-tab--active'); }
    }
  }

  /* ============================================================
   * レスポンシブ監視
   * ============================================================ */
  function _initResizeWatcher() {
    _isMobile = window.innerWidth <= 900;
    if (typeof ResizeObserver === 'undefined') { return; }
    var ro = new ResizeObserver(function (entries) {
      var width = entries[0].contentRect.width;
      var wasMobile = _isMobile;
      _isMobile = width <= 900;
      if (!wasMobile && _isMobile) {
        /* デスクトップ→モバイル: 両列を表示状態にリセット、インライン幅をクリア */
        var navCol    = document.getElementById('mm-nav-col');
        var detailCol = document.getElementById('mm-detail-col');
        if (navCol)    { navCol.classList.remove('mm-col--hidden'); navCol.style.width = ''; }
        if (detailCol) { detailCol.classList.remove('mm-col--hidden'); }
        _activeTab = 'map';
        _switchTab('map');
      } else if (wasMobile && !_isMobile) {
        /* モバイル→デスクトップ: hidden クラスを除去、保存済み幅を復元 */
        var navCol    = document.getElementById('mm-nav-col');
        var detailCol = document.getElementById('mm-detail-col');
        if (navCol)    { navCol.classList.remove('mm-col--hidden'); }
        if (detailCol) { detailCol.classList.remove('mm-col--hidden'); }
        if (navCol) {
          var saved = localStorage.getItem('mm-nav-col-width');
          if (saved) { navCol.style.width = parseFloat(saved) + 'px'; }
        }
      }
    });
    ro.observe(document.body);
  }

  /* ============================================================
   * リサイズハンドル（左右カラム幅の手動調整）
   * ============================================================ */
  function _initResizableHandle() {
    var handle = document.getElementById('mm-resize-handle');
    var navCol = document.getElementById('mm-nav-col');
    var layout = document.querySelector('.mm-layout');
    if (!handle || !navCol || !layout) { return; }

    var LS_KEY = 'mm-nav-col-width';

    /* 保存済み幅を復元（デスクトップのみ） */
    if (!_isMobile) {
      var saved = localStorage.getItem(LS_KEY);
      if (saved) {
        var px = parseFloat(saved);
        var layoutW = layout.getBoundingClientRect().width;
        if (px >= 280 && px <= layoutW * 0.80) {
          navCol.style.width = px + 'px';
        }
      }
    }

    var startX, startWidth;

    handle.addEventListener('mousedown', function (e) {
      if (_isMobile) { return; }
      e.preventDefault();
      startX     = e.clientX;
      startWidth = navCol.getBoundingClientRect().width;
      handle.classList.add('mm-resize-handle--dragging');
      document.body.style.cursor     = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
    });

    function onMove(e) {
      var dx      = e.clientX - startX;
      var newW    = startWidth + dx;
      var layoutW = layout.getBoundingClientRect().width;
      newW = Math.max(280, Math.min(newW, layoutW * 0.75));
      navCol.style.width = newW + 'px';
    }

    function onUp() {
      handle.classList.remove('mm-resize-handle--dragging');
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      /* 幅を px で保存 */
      localStorage.setItem(LS_KEY, navCol.getBoundingClientRect().width.toFixed(0));
    }
  }

  /* ============================================================
   * スクリーンリーダー向けアナウンス
   * ============================================================ */
  function _announce(msg) {
    var el = document.getElementById('mm-sr-announce');
    if (!el) { return; }
    el.textContent = '';
    requestAnimationFrame(function () { el.textContent = msg; });
  }

  /* ============================================================
   * 学習進捗トラッキング
   * ============================================================ */
  function _initProgress() {
    try {
      var stored = localStorage.getItem('mm-visited-svcs');
      if (stored) { _visitedSvcs = JSON.parse(stored); }
    } catch (e) {}
  }

  function _markVisited(id) {
    if (_visitedSvcs[id]) { return; }
    _visitedSvcs[id] = true;
    try { localStorage.setItem('mm-visited-svcs', JSON.stringify(_visitedSvcs)); } catch (e) {}
    _updateProgress();
  }

  function _updateProgress() {
    if (!_totalSvcCount) { return; }
    var pct = Math.min(Math.round(Object.keys(_visitedSvcs).length / _totalSvcCount * 100), 100);
    var label = document.getElementById('mm-progress-pct');
    var fill  = document.getElementById('mm-progress-fill');
    if (label) { label.textContent = pct + '%'; }
    if (fill) {
      fill.style.width = pct + '%';
      fill.setAttribute('aria-valuenow', String(pct));
    }
  }

  /* ============================================================
   * パンくずナビゲーション
   * layer: 0=ルートのみ, 1=Domain, 2=Service, 3=Concept
   * ============================================================ */
  function _updateBreadcrumb(layer, data) {
    var ol = document.getElementById('mm-breadcrumb');
    if (!ol) { return; }
    while (ol.firstChild) { ol.removeChild(ol.firstChild); }

    /* ルート */
    ol.appendChild(_makeBreadcrumbItem('概念マップ', layer === 0, _clearSelection));

    /* L1 ドメイン */
    if (layer >= 1 && _currentDomain) {
      var domain = _currentDomain;
      ol.appendChild(_makeBreadcrumbItem(
        domain.name_ja,
        layer === 1,
        function () { _selectNode(domain.id, 1, domain); }
      ));
    }

    /* L2 サービス */
    if (layer >= 2 && _currentService) {
      var svc = _currentService;
      ol.appendChild(_makeBreadcrumbItem(
        svc.name_ja,
        layer === 2,
        function () { navigateToNode(svc.id); }
      ));
    }

    /* L3 概念（現在地: クリック不可） */
    if (layer === 3 && data) {
      ol.appendChild(_makeBreadcrumbItem(data.name_ja, true, null));
    }
  }

  function _makeBreadcrumbItem(label, isCurrent, onclick) {
    var li  = document.createElement('li');
    li.className = 'mm-breadcrumb-item';
    var btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'mm-breadcrumb-btn';
    btn.textContent = label;
    if (isCurrent) {
      btn.setAttribute('aria-current', 'page');
    } else if (onclick) {
      btn.addEventListener('click', onclick);
    }
    li.appendChild(btn);
    return li;
  }

  function _clearSelection() {
    document.querySelectorAll('.mm-node-btn.mm-selected').forEach(function (el) {
      el.classList.remove('mm-selected');
    });
    _selectedId     = null;
    _currentDomain  = null;
    _currentService = null;
    var panel = document.getElementById('mm-detail-panel');
    if (panel) {
      while (panel.firstChild) { panel.removeChild(panel.firstChild); }
      var wrap = _el('div', { cls: 'mm-detail-placeholder-wrap' });
      var icon = _el('div', { cls: 'mm-detail-placeholder-icon' });
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '←';
      var text = _el('p', { cls: 'mm-detail-placeholder', text: '左からノードを選択してください' });
      var hint = _el('p', { cls: 'mm-detail-placeholder-hint', text: 'ドメイン → サービス → 概念の順に選択できます' });
      wrap.appendChild(icon);
      wrap.appendChild(text);
      wrap.appendChild(hint);
      panel.appendChild(wrap);
    }
    _updateBreadcrumb(0, null);
  }

  /* ============================================================
   * タグフィルタ
   * ============================================================ */
  function _initFilters() {
    var axisContainer = document.getElementById('mm-axis-filter-tags');
    var sapContainer  = document.getElementById('mm-sap-filter-tags');
    var clearBtn      = document.getElementById('mm-filter-clear');
    var statusEl      = document.getElementById('mm-filter-status');
    if (!axisContainer || !sapContainer) { return; }

    AXIS_TAG_LIST.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type        = 'button';
      btn.className   = 'mm-tag-btn';
      btn.textContent = t.label;
      btn.dataset.tagId = t.id;
      btn.addEventListener('click', function () {
        if (_activeAxisTags[t.id]) { delete _activeAxisTags[t.id]; btn.classList.remove('mm-tag-active'); }
        else { _activeAxisTags[t.id] = true; btn.classList.add('mm-tag-active'); }
        _applyFilters(clearBtn, statusEl);
      });
      axisContainer.appendChild(btn);
    });

    SAP_DOMAIN_LIST.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type        = 'button';
      btn.className   = 'mm-tag-btn';
      btn.textContent = t.label;
      btn.dataset.tagId = t.id;
      btn.addEventListener('click', function () {
        if (_activeSapDomains[t.id]) { delete _activeSapDomains[t.id]; btn.classList.remove('mm-tag-active'); }
        else { _activeSapDomains[t.id] = true; btn.classList.add('mm-tag-active'); }
        _applyFilters(clearBtn, statusEl);
      });
      sapContainer.appendChild(btn);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        _activeAxisTags   = {};
        _activeSapDomains = {};
        document.querySelectorAll('.mm-tag-btn.mm-tag-active').forEach(function (b) {
          b.classList.remove('mm-tag-active');
        });
        _applyFilters(clearBtn, statusEl);
      });
    }
  }

  function _applyFilters(clearBtn, statusEl) {
    var axisKeys = Object.keys(_activeAxisTags);
    var sapKeys  = Object.keys(_activeSapDomains);
    var count    = axisKeys.length + sapKeys.length;

    if (clearBtn) { clearBtn.hidden = count === 0; }
    if (statusEl) { statusEl.textContent = count > 0 ? (count + '個のフィルタ適用中') : ''; }

    document.querySelectorAll('.mm-l2-item').forEach(function (li) {
      if (count === 0) { li.classList.remove('mm-filtered'); return; }
      var itemAxis = (li.dataset.axisTags   || '').split(',').filter(Boolean);
      var itemSap  = (li.dataset.sapDomains || '').split(',').filter(Boolean);
      var axisMatch = axisKeys.length === 0 || axisKeys.some(function (k) { return itemAxis.indexOf(k) !== -1; });
      var sapMatch  = sapKeys.length === 0  || sapKeys.some(function (k) { return itemSap.indexOf(k) !== -1; });
      li.classList.toggle('mm-filtered', !(axisMatch && sapMatch));
    });

    _announce(count > 0 ? count + '個のフィルタを適用中' : 'フィルタをクリアしました');
  }

}());
