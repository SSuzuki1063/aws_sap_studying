// AWS SAP学習リソース - レンダリング関数
// このファイルはテンプレート関数のみを含み、データからHTMLを生成します

/**
 * カテゴリクイックナビゲーションをレンダリング
 * @param {Array} navData - カテゴリクイックナビゲーションデータ
 * @returns {string} HTML文字列
 */
function renderCategoryQuickNav(navData) {
  const navItems = navData.map(cat => `
    <a href="#${cat.id}" class="category-link" aria-label="${cat.text}カテゴリ、${cat.count}個のリソース">
      <span class="category-link-icon" aria-hidden="true">${cat.icon}</span>
      <span class="category-link-text">${cat.text}</span>
      <span class="category-link-count">${cat.count}</span>
    </a>
  `).join('');

  return `
    <nav class="category-nav" aria-label="カテゴリナビゲーション">
      <h3><span>🗂️</span>カテゴリから探す</h3>
      <div class="category-links">
        ${navItems}
      </div>
    </nav>
  `;
}

/**
 * リソースリストをレンダリング
 * @param {Array} resources - リソースデータ配列
 * @returns {string} HTML文字列
 */
function renderResourceList(resources) {
  const resourceItems = resources.map(resource => `
    <li>
      <a href="${resource.href}">${resource.title}</a>
      <button class="bookmark-icon" data-href="${resource.href}" onclick="handleBookmarkClick(event, '${resource.href}')" aria-label="ブックマークに追加" title="ブックマークに追加">☆</button>
    </li>
  `).join('');

  return `
    <ul class="resource-list">
      ${resourceItems}
    </ul>
  `;
}

/**
 * 優先度設定
 */
const PRIORITY_CONFIG = {
  high:   { label: '優先度: 高', icon: '🔴', order: 0 },
  medium: { label: '優先度: 中', icon: '🟡', order: 1 },
  low:    { label: '優先度: 低', icon: '🔵', order: 2 }
};

/**
 * リソースを優先度別にグループ分けしてレンダリング
 * - 使われている優先度が1種類のみ → サブヘッダーなしで従来通り表示
 * - 複数の優先度がある → 各グループに h3 サブヘッダー + リソースリストを描画
 * @param {Array} resources - リソースデータ配列
 * @returns {string} HTML文字列
 */
function renderPriorityGroupedResources(resources) {
  // 優先度別にグループ分け（未設定は medium）
  const groups = { high: [], medium: [], low: [] };
  resources.forEach(function(r) {
    var p = r.priority || 'medium';
    if (groups[p]) {
      groups[p].push(r);
    } else {
      groups.medium.push(r);
    }
  });

  // 使われている優先度レベルを収集
  var usedLevels = Object.keys(groups).filter(function(key) {
    return groups[key].length > 0;
  });

  // 1種類のみ → サブヘッダーなしで従来通り表示
  if (usedLevels.length <= 1) {
    return renderResourceList(resources);
  }

  // 複数の優先度 → グループ別に h3 サブヘッダー付きで表示
  var sortedLevels = usedLevels.sort(function(a, b) {
    return PRIORITY_CONFIG[a].order - PRIORITY_CONFIG[b].order;
  });

  return sortedLevels.map(function(level) {
    var config = PRIORITY_CONFIG[level];
    var groupResources = groups[level];
    return '<div class="priority-group">' +
      '<h3 class="priority-sub-header priority-' + level + '">' +
        '<span aria-hidden="true">' + config.icon + '</span>' +
        config.label +
        '<span class="priority-count">' + groupResources.length + '</span>' +
      '</h3>' +
      renderResourceList(groupResources) +
    '</div>';
  }).join('');
}

/**
 * 更新日付をフォーマット
 * 今年なら MM/DD、それ以外は YYYY/MM/DD
 * @param {string} dateStr - 'YYYY-MM-DD' 形式の日付文字列
 * @returns {string} フォーマットされた日付文字列
 */
function formatUpdateDate(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  var year = parts[0];
  var month = parts[1];
  var day = parts[2];
  var currentYear = new Date().getFullYear().toString();
  if (year === currentYear) {
    return month + '/' + day;
  }
  return year + '/' + month + '/' + day;
}

/**
 * セクション鮮度バッジをレンダリング
 * 14日以内: 最近更新（緑）、60日以内: 更新済み（黄）、60日超: 表示なし
 * @param {string} dateStr - 'YYYY-MM-DD' 形式の日付文字列
 * @returns {string} HTML文字列（バッジ or 空文字列）
 */
function renderFreshnessBadge(dateStr) {
  if (!dateStr) return '';
  var now = new Date();
  var updated = new Date(dateStr + 'T00:00:00');
  var diffDays = Math.floor((now - updated) / (1000 * 60 * 60 * 24));

  if (diffDays <= 14) {
    return '<span class="freshness-badge freshness-recent">最近更新</span>';
  } else if (diffDays <= 60) {
    return '<span class="freshness-badge freshness-moderate">更新済み</span>';
  }
  return '';
}

/**
 * 更新タイプのラベルを返す
 * @param {string} type - 更新タイプ
 * @returns {string} 表示ラベル
 */
function getUpdateTypeLabel(type) {
  var labels = {
    content: 'コンテンツ追加',
    feature: '機能追加',
    exam: '試験変更対応',
    fix: '修正'
  };
  return labels[type] || type;
}

/**
 * 更新履歴タイムラインHTMLを生成
 * NOTE: innerHTMLへの代入はrenderUpdateHistoryToDOMで行うが、
 * データソースはdata.js内部定義のみ（外部入力なし）のため安全。
 * 既存のrenderCategoriesToDOM等と同一パターン。
 * @param {Array} history - 更新履歴データ配列
 * @param {Object} options - オプション（maxItems: 初期表示件数、デフォルト5）
 * @returns {string} HTML文字列
 */
function renderUpdateHistory(history, options) {
  if (!history || history.length === 0) return '';
  var maxItems = (options && options.maxItems) || 5;
  var hasMore = history.length > maxItems;

  var items = history.map(function(entry, index) {
    var hiddenClass = index >= maxItems ? ' hidden' : '';
    var tags = '';
    if (entry.tags && entry.tags.length > 0) {
      tags = entry.tags.map(function(tag) {
        return '<span class="update-tag">' + tag + '</span>';
      }).join(' ');
    }

    return '<li class="update-timeline-item' + hiddenClass + '" data-index="' + index + '">' +
      '<div class="update-timeline-dot dot-' + entry.type + '"></div>' +
      '<div class="update-timeline-content">' +
        '<div class="update-timeline-header">' +
          '<span class="update-timeline-date">' + formatUpdateDate(entry.date) + '</span>' +
          '<span class="update-type-badge update-type-' + entry.type + '">' + getUpdateTypeLabel(entry.type) + '</span>' +
          tags +
        '</div>' +
        '<div class="update-timeline-title">' + entry.title + '</div>' +
        (entry.description ? '<div class="update-timeline-desc">' + entry.description + '</div>' : '') +
      '</div>' +
    '</li>';
  }).join('');

  var expandBtn = '';
  if (hasMore) {
    expandBtn = '<button class="update-expand-btn" aria-expanded="false" data-max-items="' + maxItems + '" data-total-items="' + history.length + '">' +
      'もっと見る（残り' + (history.length - maxItems) + '件）' +
    '</button>';
  }

  return '<h3 style="color: #232F3E; font-size: 1.1em; margin-bottom: 12px;">更新履歴</h3>' +
    '<ol class="update-timeline" aria-label="サイト更新履歴">' +
      items +
    '</ol>' +
    expandBtn;
}

/**
 * 更新履歴タイムラインをDOMに描画
 * NOTE: データソースはdata.js内部定義のみ（外部入力なし）のため
 * innerHTML使用は安全。既存のrenderCategoriesToDOM等と同一パターン。
 * @param {string} containerId - コンテナ要素のID
 * @param {Array} historyData - 更新履歴データ配列
 */
function renderUpdateHistoryToDOM(containerId, historyData) {
  var container = document.getElementById(containerId);
  if (!container) {
    console.error('Container with id "' + containerId + '" not found');
    return;
  }
  container.innerHTML = renderUpdateHistory(historyData, { maxItems: 5 });
}

/**
 * タイトル文字列からURL安全なスラッグIDを生成
 * @param {string} title - セクションタイトル
 * @returns {string} スラッグ化されたID
 */
function generateSectionSlug(title) {
  return 'section-' + title
    .replace(/[\s&・／/]+/g, '-')
    .replace(/[^\w\u3000-\u9FFF\u30A0-\u30FF\u3040-\u309F-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * セクション（小カテゴリ）をレンダリング
 * @param {Object} section - セクションデータ
 * @returns {string} HTML文字列
 */
function renderSection(section) {
  const sectionId = generateSectionSlug(section.title);
  return `
    <div class="toc-section">
      <h2 id="${sectionId}">
        <span class="section-icon">${section.icon}</span>
        ${section.title}
        <span class="resource-count">${section.count}</span>
        ${renderFreshnessBadge(section.lastUpdated)}
      </h2>
      ${renderPriorityGroupedResources(section.resources)}
    </div>
  `;
}

/**
 * 大カテゴリをレンダリング
 * @param {Object} category - カテゴリデータ
 * @returns {string} HTML文字列
 */
function renderMajorCategory(category) {
  const sections = category.sections.map(section => renderSection(section)).join('');

  const elementType = category.id === 'networking' || category.id === 'security-governance' ? 'section' : 'div';
  const ariaAttributes = category.id === 'networking' || category.id === 'security-governance'
    ? `aria-labelledby="${category.id}-heading"`
    : '';
  const headingId = category.id === 'networking' || category.id === 'security-governance'
    ? `id="${category.id}-heading"`
    : '';

  return `
    <${elementType} id="${category.id}" class="major-category" ${ariaAttributes}>
      <h2 ${headingId} class="major-category-header">
        <span class="major-category-icon" aria-hidden="true">${category.icon}</span>
        ${category.title}
        <span class="resource-count">${category.count}</span>
      </h2>
      ${sections}
    </${elementType}>
  `;
}

/**
 * すべてのカテゴリをレンダリング
 * @param {Array} categoriesData - 全カテゴリデータ
 * @returns {string} HTML文字列
 */
function renderAllCategories(categoriesData) {
  return categoriesData.map(category => renderMajorCategory(category)).join('');
}

/**
 * DOMにカテゴリをレンダリング
 * @param {string} containerId - コンテナ要素のID
 * @param {Array} categoriesData - 全カテゴリデータ
 */
function renderCategoriesToDOM(containerId, categoriesData) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = renderAllCategories(categoriesData);
}

/**
 * カテゴリクイックナビゲーションをDOMにレンダリング
 * @param {string} containerId - コンテナ要素のID
 * @param {Array} navData - カテゴリクイックナビゲーションデータ
 */
function renderQuickNavToDOM(containerId, navData) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = renderCategoryQuickNav(navData);
}
