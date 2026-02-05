/**
 * AWS SAP-C02 試験ガイドページ レンダリング関数
 * データからHTMLを生成
 *
 * セキュリティ注: examGuideDataは信頼できる内部定義データであり、
 * escapeHtml関数でテキストをエスケープしています。
 */

/**
 * 試験概要セクションをレンダリング
 * @param {Object} examInfo - 試験情報
 * @param {Array} domains - ドメイン配列
 * @returns {string} HTML文字列
 */
function renderExamOverview(examInfo, domains) {
    const statsHtml = `
        <div class="exam-stat-card">
            <div class="exam-stat-icon" aria-hidden="true">📝</div>
            <div class="exam-stat-value">${examInfo.questions}</div>
            <div class="exam-stat-label">問題数</div>
        </div>
        <div class="exam-stat-card">
            <div class="exam-stat-icon" aria-hidden="true">⏱️</div>
            <div class="exam-stat-value">${examInfo.duration}分</div>
            <div class="exam-stat-label">試験時間</div>
        </div>
        <div class="exam-stat-card">
            <div class="exam-stat-icon" aria-hidden="true">🎯</div>
            <div class="exam-stat-value">${examInfo.passingScore}</div>
            <div class="exam-stat-label">合格点 (${examInfo.maxScore}満点)</div>
        </div>
        <div class="exam-stat-card">
            <div class="exam-stat-icon" aria-hidden="true">📅</div>
            <div class="exam-stat-value">${examInfo.validityPeriod}年</div>
            <div class="exam-stat-label">有効期間</div>
        </div>
    `;

    const domainBarsHtml = domains.map(domain => `
        <div class="domain-weight-item">
            <div class="domain-weight-icon" aria-hidden="true">${domain.icon}</div>
            <div class="domain-weight-label">${domain.title}</div>
            <div class="domain-weight-bar-track" role="progressbar" aria-valuenow="${domain.weight}" aria-valuemin="0" aria-valuemax="100" aria-label="${domain.title}: ${domain.weight}%">
                <div class="domain-weight-bar-fill" style="width: ${domain.weight}%; background: ${domain.color};">
                    <span>${domain.weight}%</span>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <section class="exam-overview" aria-labelledby="exam-overview-heading">
            <div class="exam-overview-header">
                <h2 id="exam-overview-heading"><span aria-hidden="true">📋</span> 試験概要</h2>
                <p>${examInfo.name} (${examInfo.code})</p>
            </div>
            <div class="exam-stats-grid" role="group" aria-label="試験基本情報">
                ${statsHtml}
            </div>
            <div class="domain-weight-chart">
                <div class="domain-weight-title">
                    <span aria-hidden="true">📊</span> ドメイン別配点
                </div>
                <div class="domain-weight-bars">
                    ${domainBarsHtml}
                </div>
            </div>
        </section>
    `;
}

/**
 * タスクの知識・スキル・関連リソースをレンダリング
 * @param {Object} task - タスクオブジェクト
 * @returns {string} HTML文字列
 */
function renderTaskDetails(task) {
    const knowledgeItems = task.knowledge.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const skillsItems = task.skills.map(item => `<li>${escapeHtml(item)}</li>`).join('');

    const resourcesHtml = task.relatedResources.length > 0
        ? task.relatedResources.map(resource => `
            <li>
                <a href="${resource.href}">${escapeHtml(resource.title)}</a>
            </li>
        `).join('')
        : '<li>関連リソースはまだ登録されていません</li>';

    return `
        <div class="knowledge-skills-grid">
            <div class="knowledge-section">
                <div class="section-header">
                    <span class="section-icon" aria-hidden="true">📚</span>
                    <span>対象知識</span>
                </div>
                <ul class="knowledge-list">
                    ${knowledgeItems}
                </ul>
            </div>
            <div class="skills-section">
                <div class="section-header">
                    <span class="section-icon" aria-hidden="true">✅</span>
                    <span>対象スキル</span>
                </div>
                <ul class="skills-list">
                    ${skillsItems}
                </ul>
            </div>
        </div>
        <div class="related-resources-section">
            <div class="related-resources-header">
                <span aria-hidden="true">🔗</span>
                <span>関連リソース</span>
            </div>
            <ul class="related-resources-list">
                ${resourcesHtml}
            </ul>
        </div>
    `;
}

/**
 * 単一タスクをレンダリング
 * @param {Object} task - タスクオブジェクト
 * @returns {string} HTML文字列
 */
function renderTask(task) {
    return `
        <div class="exam-task-item" data-task="${task.id}">
            <div class="exam-task-header"
                 role="button"
                 tabindex="0"
                 aria-expanded="false"
                 aria-controls="task-content-${task.id.replace('.', '-')}"
                 onclick="toggleTask(this)"
                 onkeydown="handleTaskKeydown(event, this)">
                <div class="exam-task-header-left">
                    <span class="exam-task-id">タスク ${task.id}</span>
                    <span class="exam-task-title">${escapeHtml(task.title)}</span>
                </div>
                <span class="exam-task-toggle" aria-hidden="true">▼</span>
            </div>
            <div class="exam-task-content" id="task-content-${task.id.replace('.', '-')}">
                ${renderTaskDetails(task)}
            </div>
        </div>
    `;
}

/**
 * 単一ドメインをレンダリング
 * @param {Object} domain - ドメインオブジェクト
 * @returns {string} HTML文字列
 */
function renderDomain(domain) {
    const tasksHtml = domain.tasks.map(task => renderTask(task)).join('');

    return `
        <div class="exam-domain-card" data-domain="${domain.id}">
            <div class="exam-domain-header"
                 role="button"
                 tabindex="0"
                 aria-expanded="false"
                 aria-controls="domain-content-${domain.id}"
                 onclick="toggleDomain(this)"
                 onkeydown="handleDomainKeydown(event, this)">
                <div class="exam-domain-header-left">
                    <span class="exam-domain-icon" aria-hidden="true">${domain.icon}</span>
                    <div class="exam-domain-info">
                        <div class="exam-domain-title">
                            ${escapeHtml(domain.title)}
                            <span class="domain-id">${domain.id.replace('domain', 'ドメイン ')}</span>
                        </div>
                        <div class="exam-domain-meta">
                            <span class="exam-domain-weight">${domain.weight}%</span>
                            <span class="exam-domain-task-count">
                                <span aria-hidden="true">📋</span> ${domain.tasks.length} タスク
                            </span>
                        </div>
                    </div>
                </div>
                <div class="exam-domain-header-right">
                    <span class="exam-domain-toggle" aria-hidden="true">▼</span>
                </div>
            </div>
            <div class="exam-domain-content" id="domain-content-${domain.id}">
                <div class="exam-tasks-list">
                    ${tasksHtml}
                </div>
            </div>
        </div>
    `;
}

/**
 * 全ドメインセクションをレンダリング
 * @param {Array} domains - ドメイン配列
 * @returns {string} HTML文字列
 */
function renderDomainsSection(domains) {
    const domainsHtml = domains.map(domain => renderDomain(domain)).join('');

    return `
        <section class="exam-domains-section" aria-labelledby="exam-domains-heading">
            <h2 id="exam-domains-heading" class="exam-domains-title">
                <span aria-hidden="true">📖</span> 試験ドメイン詳細
            </h2>
            <div class="expand-collapse-controls">
                <button class="expand-collapse-btn" onclick="expandAllDomains()" aria-label="すべてのドメインを展開">
                    <span aria-hidden="true">⬇️</span> すべて展開
                </button>
                <button class="expand-collapse-btn" onclick="collapseAllDomains()" aria-label="すべてのドメインを折りたたむ">
                    <span aria-hidden="true">⬆️</span> すべて折りたたむ
                </button>
            </div>
            <div class="exam-domains-list">
                ${domainsHtml}
            </div>
        </section>
    `;
}

/**
 * ロードマップへのリンクをレンダリング
 * @returns {string} HTML文字列
 */
function renderRoadmapLink() {
    return `
        <a href="roadmap.html" class="exam-roadmap-link">
            <span class="exam-roadmap-link-icon" aria-hidden="true">🗺️</span>
            <div class="exam-roadmap-link-content">
                <div class="exam-roadmap-link-title">学習ロードマップへ</div>
                <div class="exam-roadmap-link-desc">試験ドメインに対応した4週間の学習プランで効率的に対策しましょう</div>
            </div>
            <span class="exam-roadmap-link-arrow" aria-hidden="true">→</span>
        </a>
    `;
}

/**
 * 試験ガイドページ全体をレンダリング
 * @param {Object} data - examGuideData
 * @returns {string} HTML文字列
 */
function renderExamGuidePage(data) {
    return `
        ${renderExamOverview(data.examInfo, data.domains)}
        ${renderDomainsSection(data.domains)}
        ${renderRoadmapLink()}
    `;
}

/**
 * HTMLエスケープ関数
 * @param {string} text - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// インタラクション関数
// ========================================

/**
 * ドメインの展開/折りたたみを切り替え
 * @param {HTMLElement} headerElement - クリックされたヘッダー要素
 */
function toggleDomain(headerElement) {
    const card = headerElement.closest('.exam-domain-card');
    const isExpanded = card.classList.contains('expanded');

    card.classList.toggle('expanded');
    headerElement.setAttribute('aria-expanded', !isExpanded);
}

/**
 * タスクの展開/折りたたみを切り替え
 * @param {HTMLElement} headerElement - クリックされたヘッダー要素
 */
function toggleTask(headerElement) {
    const item = headerElement.closest('.exam-task-item');
    const isExpanded = item.classList.contains('expanded');

    item.classList.toggle('expanded');
    headerElement.setAttribute('aria-expanded', !isExpanded);
}

/**
 * ドメインヘッダーのキーボード操作
 * @param {KeyboardEvent} event - キーボードイベント
 * @param {HTMLElement} headerElement - ヘッダー要素
 */
function handleDomainKeydown(event, headerElement) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDomain(headerElement);
    }
}

/**
 * タスクヘッダーのキーボード操作
 * @param {KeyboardEvent} event - キーボードイベント
 * @param {HTMLElement} headerElement - ヘッダー要素
 */
function handleTaskKeydown(event, headerElement) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleTask(headerElement);
    }
}

/**
 * すべてのドメインを展開
 */
function expandAllDomains() {
    document.querySelectorAll('.exam-domain-card').forEach(card => {
        card.classList.add('expanded');
        const header = card.querySelector('.exam-domain-header');
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }
    });
}

/**
 * すべてのドメインを折りたたむ
 */
function collapseAllDomains() {
    document.querySelectorAll('.exam-domain-card').forEach(card => {
        card.classList.remove('expanded');
        const header = card.querySelector('.exam-domain-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });
    // タスクも折りたたむ
    document.querySelectorAll('.exam-task-item').forEach(item => {
        item.classList.remove('expanded');
        const header = item.querySelector('.exam-task-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * DOMにレンダリング
 * 注: examGuideDataは信頼できる内部定義データであり、
 * escapeHtml関数でテキストをエスケープしています。
 * @param {string} containerId - コンテナ要素のID
 * @param {Object} data - examGuideData
 */
function renderExamGuideToDOM(containerId, data) {
    const container = document.getElementById(containerId);
    if (container) {
        // 信頼できる内部データからのレンダリング
        container.innerHTML = renderExamGuidePage(data);
    }
}

/**
 * ページ初期化
 */
function initExamGuidePage() {
    renderExamGuideToDOM('exam-guide-container', examGuideData);

    // 最初のドメインを自動展開
    const firstDomain = document.querySelector('.exam-domain-card');
    if (firstDomain) {
        firstDomain.classList.add('expanded');
        const header = firstDomain.querySelector('.exam-domain-header');
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }
    }
}
