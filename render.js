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
    <li><a href="${resource.href}">${resource.title}</a></li>
  `).join('');

  return `
    <ul class="resource-list">
      ${resourceItems}
    </ul>
  `;
}

/**
 * セクション（小カテゴリ）をレンダリング
 * @param {Object} section - セクションデータ
 * @returns {string} HTML文字列
 */
function renderSection(section) {
  return `
    <div class="toc-section">
      <h2>
        <span class="section-icon">${section.icon}</span>
        ${section.title}
        <span class="resource-count">${section.count}</span>
      </h2>
      ${renderResourceList(section.resources)}
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
