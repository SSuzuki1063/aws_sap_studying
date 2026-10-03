/**
 * DiagramRenderer.js — ネイティブ SVG 生成エンジン
 * ConceptEngine.diagram として公開。外部ライブラリ不使用。
 * WCAG 2.1 AA: COLOR_TEXT #374151 on #f3f4f6 = 7.5:1 ✓
 *              COLOR_EDGE_TEXT #6b7280 on #fff = 4.5:1 ✓
 */

(function (global) {
  'use strict';

  var SVG_NS    = 'http://www.w3.org/2000/svg';
  var NODE_W    = 120;
  var NODE_H    = 48;
  var DIAMOND_W = 100;
  var DIAMOND_H = 60;
  var V_GAP     = 80;
  var H_GAP     = 40;
  var PADDING   = 24;
  var ROW_H     = 36;
  var HEADER_H  = 40;

  var COLOR_DEFAULT   = '#f3f4f6';
  var COLOR_HIGHLIGHT = '#fff7e6';
  var COLOR_MUTED     = '#f9fafb';
  var COLOR_STROKE    = '#d1d5db';
  var COLOR_ARROW     = '#6b7280';
  var COLOR_TEXT      = '#374151';
  var COLOR_EDGE_TEXT = '#6b7280';
  var FONT            = 'Noto Sans JP, sans-serif';

  /* ── SVG 要素生成ヘルパー ── */
  function _svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    }
    return el;
  }

  /* ── 矢印マーカー定義 ── */
  function _addDefs(svg) {
    var defs   = _svgEl('defs');
    var marker = _svgEl('marker', {
      id: 'cm-arrow', markerWidth: '8', markerHeight: '6',
      refX: '7', refY: '3', orient: 'auto'
    });
    var poly = _svgEl('polygon', { points: '0 0, 8 3, 0 6', fill: COLOR_ARROW });
    marker.appendChild(poly);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }

  /* ── 複数行テキスト（innerHTML 不使用・XSS-safe） ── */
  function _textNode(parent, cx, cy, label, fontSize) {
    var lines  = label.split('\n');
    var lineH  = fontSize * 1.4;
    var totalH = lines.length * lineH;
    var startY = cy - totalH / 2 + lineH * 0.85;
    var text   = _svgEl('text', {
      'text-anchor': 'middle',
      'font-family': FONT,
      'font-size':   fontSize,
      'fill':        COLOR_TEXT
    });
    lines.forEach(function (line, i) {
      var tspan = _svgEl('tspan', { x: cx, y: startY + i * lineH });
      tspan.textContent = line;
      text.appendChild(tspan);
    });
    parent.appendChild(text);
  }

  /* ── ノードの有効幅・高さ取得 ── */
  function _nodeSize(shape) {
    if (shape === 'diamond') { return { w: DIAMOND_W, h: DIAMOND_H }; }
    return { w: NODE_W, h: NODE_H };
  }

  /* ── 形状描画（SVGグループ要素に追加） ── */
  function _drawShape(parent, cx, cy, shape, style) {
    var bgColor = style === 'highlight' ? COLOR_HIGHLIGHT
                : style === 'muted'     ? COLOR_MUTED
                : COLOR_DEFAULT;
    var el;
    if (shape === 'diamond') {
      var hw  = DIAMOND_W / 2;
      var hh  = DIAMOND_H / 2;
      var pts = cx + ',' + (cy - hh) + ' ' +
                (cx + hw) + ',' + cy + ' ' +
                cx + ',' + (cy + hh) + ' ' +
                (cx - hw) + ',' + cy;
      el = _svgEl('polygon', {
        points: pts, fill: bgColor,
        stroke: COLOR_STROKE, 'stroke-width': '1.5'
      });
    } else if (shape === 'pill') {
      el = _svgEl('rect', {
        x: cx - NODE_W / 2, y: cy - NODE_H / 2,
        width: NODE_W, height: NODE_H,
        rx: NODE_H / 2,
        fill: bgColor, stroke: COLOR_STROKE, 'stroke-width': '1.5'
      });
    } else {
      /* rect（デフォルト） */
      el = _svgEl('rect', {
        x: cx - NODE_W / 2, y: cy - NODE_H / 2,
        width: NODE_W, height: NODE_H, rx: '6',
        fill: bgColor, stroke: COLOR_STROKE, 'stroke-width': '1.5'
      });
    }
    parent.appendChild(el);
  }

  /* ── エッジ描画（ノード下端→上端、矢印付き） ── */
  function _drawEdge(parent, x1, y1, x2, y2, h1, h2, label) {
    var startY = y1 + h1 / 2;
    var endY   = y2 - h2 / 2;
    var line   = _svgEl('line', {
      x1: x1, y1: startY,
      x2: x2, y2: endY,
      stroke: COLOR_ARROW,
      'stroke-width': '1.5',
      'marker-end': 'url(#cm-arrow)'
    });
    parent.appendChild(line);
    if (label) {
      var midX = (x1 + x2) / 2;
      var midY = (startY + endY) / 2;
      var text = _svgEl('text', {
        x: midX + 4, y: midY,
        'text-anchor': 'start',
        'font-family': FONT,
        'font-size': '10',
        'fill': COLOR_EDGE_TEXT
      });
      text.textContent = label;
      parent.appendChild(text);
    }
  }

  /* ── decision_tree / flow 共通レイアウト（BFS） ── */
  function renderTree(data) {
    var nodes = data.nodes || [];
    var edges = data.edges || [];
    if (!nodes.length) { return null; }

    /* 隣接リストと入次数テーブル構築 */
    var children = {};
    var indegree  = {};
    nodes.forEach(function (n) {
      children[n.id] = [];
      indegree[n.id] = 0;
    });
    edges.forEach(function (e) {
      if (children[e.from]) { children[e.from].push(e.to); }
      if (indegree[e.to] !== undefined) { indegree[e.to]++; }
    });

    /* 根ノード（入次数=0）を特定 */
    var roots = nodes.filter(function (n) { return indegree[n.id] === 0; });
    if (!roots.length) { roots = [nodes[0]]; }

    /* BFS でレベル割り当て */
    var level = {};
    var queue = [];
    roots.forEach(function (r) { level[r.id] = 0; queue.push(r.id); });
    var qi = 0;
    while (qi < queue.length) {
      var cur = queue[qi++];
      (children[cur] || []).forEach(function (childId) {
        if (level[childId] === undefined) {
          level[childId] = level[cur] + 1;
          queue.push(childId);
        }
      });
    }
    /* 孤立ノードはレベル 0 に */
    nodes.forEach(function (n) {
      if (level[n.id] === undefined) { level[n.id] = 0; }
    });

    /* レベルごとのノードリスト */
    var maxLevel = 0;
    nodes.forEach(function (n) {
      if (level[n.id] > maxLevel) { maxLevel = level[n.id]; }
    });
    var perLevel = [];
    for (var i = 0; i <= maxLevel; i++) { perLevel[i] = []; }
    nodes.forEach(function (n) { perLevel[level[n.id]].push(n); });

    /* SVG サイズ計算 */
    var maxPerLevel = 0;
    perLevel.forEach(function (lvl) {
      if (lvl.length > maxPerLevel) { maxPerLevel = lvl.length; }
    });
    var svgW = maxPerLevel * (NODE_W + H_GAP) + 2 * PADDING;
    var svgH = (maxLevel + 1) * (NODE_H + V_GAP) + 2 * PADDING;

    var svg = _svgEl('svg', {
      width:   svgW,
      height:  svgH,
      viewBox: '0 0 ' + svgW + ' ' + svgH,
      role:    'img',
      'aria-label': data.title || '概念図'
    });
    _addDefs(svg);

    /* ノード座標算出 */
    var coords = {};
    perLevel.forEach(function (lvl, lvlIdx) {
      var totalW = lvl.length * NODE_W + (lvl.length - 1) * H_GAP;
      var startX = (svgW - totalW) / 2 + NODE_W / 2;
      var cy     = lvlIdx * (NODE_H + V_GAP) + PADDING + NODE_H / 2;
      lvl.forEach(function (n, ni) {
        coords[n.id] = { cx: startX + ni * (NODE_W + H_GAP), cy: cy };
      });
    });

    /* ノードマップ（id → node）*/
    var nodeMap = {};
    nodes.forEach(function (n) { nodeMap[n.id] = n; });

    /* エッジをノード前に描画（重ならないよう）*/
    var edgeGroup = _svgEl('g');
    edges.forEach(function (e) {
      var fc = coords[e.from];
      var tc = coords[e.to];
      if (!fc || !tc) { return; }
      var fn = nodeMap[e.from];
      var tn = nodeMap[e.to];
      var fSz = _nodeSize(fn ? fn.shape : 'rect');
      var tSz = _nodeSize(tn ? tn.shape : 'rect');
      _drawEdge(edgeGroup, fc.cx, fc.cy, tc.cx, tc.cy, fSz.h, tSz.h, e.label || '');
    });
    svg.appendChild(edgeGroup);

    /* ノード描画 */
    nodes.forEach(function (n) {
      var c = coords[n.id];
      if (!c) { return; }
      var shape     = n.shape || 'rect';
      var nodeGroup = _svgEl('g');
      _drawShape(nodeGroup, c.cx, c.cy, shape, n.style || 'default');
      _textNode(nodeGroup, c.cx, c.cy, n.label || n.id, 11);

      /* クリック可能ノード（link_service_id がある場合）*/
      if (n.link_service_id) {
        nodeGroup.setAttribute('tabindex', '0');
        nodeGroup.setAttribute('role', 'button');
        nodeGroup.setAttribute('data-link-id', n.link_service_id);
        nodeGroup.style.cursor = 'pointer';
        nodeGroup.addEventListener('click', function () {
          if (window._scrollToNode) { window._scrollToNode(n.link_service_id); }
        });
        nodeGroup.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (window._scrollToNode) { window._scrollToNode(n.link_service_id); }
          }
        });
      }
      svg.appendChild(nodeGroup);
    });

    return svg;
  }

  /* ── comparison レイアウト（表形式） ── */
  function renderComparison(data) {
    var columns = data.columns || [];
    var rows    = data.rows    || [];
    if (!columns.length || !rows.length) { return null; }

    var SVG_W = 600;
    var colW  = (SVG_W - 2 * PADDING) / columns.length;
    var svgH  = HEADER_H + rows.length * ROW_H + 2 * PADDING;

    var svg = _svgEl('svg', {
      width:   SVG_W,
      height:  svgH,
      viewBox: '0 0 ' + SVG_W + ' ' + svgH,
      role:    'img',
      'aria-label': data.title || '比較表'
    });

    /* ヘッダー行 */
    var headerY  = PADDING;
    var headerBg = _svgEl('rect', {
      x: PADDING, y: headerY,
      width: SVG_W - 2 * PADDING, height: HEADER_H,
      fill: '#232f3e', rx: '4'
    });
    svg.appendChild(headerBg);

    columns.forEach(function (col, ci) {
      var cx   = PADDING + ci * colW + colW / 2;
      var cy   = headerY + HEADER_H / 2 + 4;
      var text = _svgEl('text', {
        x: cx, y: cy,
        'text-anchor': 'middle',
        'font-family': FONT,
        'font-size':   '11',
        'font-weight': '700',
        fill: '#fff'
      });
      text.textContent = col;
      svg.appendChild(text);
    });

    /* データ行 */
    rows.forEach(function (row, ri) {
      var rowY        = PADDING + HEADER_H + ri * ROW_H;
      var isHighlight = row.style === 'highlight';
      var evenRowBg   = ri % 2 === 0 ? '#f9fafb' : '#fff';
      var bg          = _svgEl('rect', {
        x: PADDING, y: rowY,
        width: SVG_W - 2 * PADDING, height: ROW_H,
        fill: isHighlight ? '#fffbf5' : evenRowBg
      });
      svg.appendChild(bg);

      /* highlight 行: 左ボーダー（#FF9900 3px）*/
      if (isHighlight) {
        var leftBorder = _svgEl('rect', {
          x: PADDING, y: rowY,
          width: '3', height: ROW_H,
          fill: '#FF9900'
        });
        svg.appendChild(leftBorder);
      }

      /* セルテキスト */
      (row.cells || []).forEach(function (cell, ci) {
        var cx   = PADDING + ci * colW + colW / 2;
        var cy   = rowY + ROW_H / 2 + 4;
        var text = _svgEl('text', {
          x: cx, y: cy,
          'text-anchor': 'middle',
          'font-family': FONT,
          'font-size':   '11',
          fill: COLOR_TEXT
        });
        text.textContent = cell;
        svg.appendChild(text);
      });
    });

    /* 外枠 */
    var outerBorder = _svgEl('rect', {
      x: PADDING, y: PADDING,
      width:  SVG_W - 2 * PADDING,
      height: HEADER_H + rows.length * ROW_H,
      fill: 'none',
      stroke: COLOR_STROKE, 'stroke-width': '1',
      rx: '4'
    });
    svg.appendChild(outerBorder);

    return svg;
  }

  /* ── 公開 API ── */
  global.ConceptEngine = global.ConceptEngine || {};
  global.ConceptEngine.diagram = {
    render: function (diagramData) {
      if (!diagramData || !diagramData.type) { return null; }
      switch (diagramData.type) {
        case 'decision_tree': return renderTree(diagramData);
        case 'flow':          return renderTree(diagramData);
        case 'comparison':    return renderComparison(diagramData);
        default: return null;
      }
    }
  };

}(window));
