/**
 * AWS SAP学習リソース - ロードマップ機能 レンダリング
 * データからHTMLを生成する関数群
 * SAP-C02試験ドメイン対応
 *
 * セキュリティ注: このファイルで使用するinnerHTMLは全て
 * 信頼できる内部データ（roadmap-data.js）から生成されており、
 * ユーザー入力は含まれません。
 */

// ==========================================
// ドメイン関連レンダリング関数
// ==========================================

/**
 * リソースのドメインバッジをレンダリング
 * @param {string} href - リソースのパス
 * @returns {string} HTMLバッジ文字列
 */
function renderDomainBadges(href) {
    const mapping = resourceDomainMapping[href];
    if (!mapping) return '';

    const badges = mapping.domains.map(domainId => {
        const domain = examDomains[domainId];
        if (!domain) return '';
        return `<span class="domain-badge" style="background-color: ${domain.color}20; color: ${domain.color}; border-color: ${domain.color}40;" title="${domain.title}">${domain.icon} D${domainId.slice(-1)}</span>`;
    }).join('');

    const taskBadges = mapping.tasks.slice(0, 2).map(taskId => {
        return `<span class="task-badge">${taskId}</span>`;
    }).join('');

    return `<div class="resource-domain-badges">${badges}${taskBadges}</div>`;
}

/**
 * 学習目標セクションをレンダリング
 * @param {Object} learningObjectives - 学習目標オブジェクト
 * @param {number} weekNum - 週番号
 * @returns {string} HTML文字列
 */
function renderLearningObjectives(learningObjectives, weekNum) {
    if (!learningObjectives) return '';

    const objectivesList = learningObjectives.objectives.map((obj, i) =>
        `<li><span class="objective-number">${i + 1}</span>${obj}</li>`
    ).join('');

    return `
        <details class="learning-objectives-section">
            <summary class="learning-objectives-toggle">
                <span class="learning-objectives-icon" aria-hidden="true">📚</span>
                <span>目的と到達目標</span>
                <span class="toggle-indicator" aria-hidden="true">▼</span>
            </summary>
            <div class="learning-objectives-content">
                <div class="learning-purpose">
                    <h4><span aria-hidden="true">🎯</span> 目的</h4>
                    <p>${learningObjectives.purpose}</p>
                </div>
                <div class="learning-goals">
                    <h4><span aria-hidden="true">✅</span> 到達目標</h4>
                    <ol class="objectives-list">
                        ${objectivesList}
                    </ol>
                </div>
            </div>
        </details>
    `;
}

/**
 * ドメインカバレッジチャートをレンダリング
 * @param {Object} domainFocus - ドメインフォーカス情報
 * @returns {string} HTML文字列
 */
function renderDomainCoverageChart(domainFocus) {
    if (!domainFocus || !domainFocus.coverage) return '';

    const bars = Object.entries(examDomains).map(([domainId, domain]) => {
        const percentage = domainFocus.coverage[domainId] || 0;
        const isPrimary = domainFocus.primary === domainId;
        // ドメイン名を短縮（モバイル対応）
        const shortTitle = domain.title.length > 15 ? domain.title.substring(0, 14) + '…' : domain.title;
        return `
            <div class="coverage-bar-item ${isPrimary ? 'primary' : ''}" title="${domain.title}: ${percentage}%">
                <span class="coverage-domain-icon" aria-hidden="true">${domain.icon}</span>
                <span class="coverage-domain-label">D${domainId.slice(-1)}: ${shortTitle}</span>
                <div class="coverage-bar-track">
                    <div class="coverage-bar-fill" style="width: ${percentage}%; background-color: ${domain.color};"></div>
                </div>
                <span class="coverage-percentage">${percentage}%</span>
            </div>
        `;
    }).join('');

    return `
        <div class="domain-coverage-chart">
            <div class="coverage-label">ドメインカバレッジ</div>
            <div class="coverage-bars">
                ${bars}
            </div>
        </div>
    `;
}

/**
 * ダッシュボードにドメイン別進捗サマリーをレンダリング
 * @param {string} levelId - レベルID
 * @returns {string} HTML文字列
 */
function renderDomainProgressSummary(levelId) {
    const plan = weeklyPlans[levelId];
    if (!plan) return '';

    // 各ドメインの完了リソース数をカウント
    const domainStats = {};
    Object.keys(examDomains).forEach(domainId => {
        domainStats[domainId] = { completed: 0, total: 0 };
    });

    // 全リソースをスキャンしてドメインごとにカウント
    plan.forEach(week => {
        week.resources.forEach(href => {
            const mapping = resourceDomainMapping[href];
            if (mapping) {
                mapping.domains.forEach(domainId => {
                    if (domainStats[domainId]) {
                        domainStats[domainId].total++;
                        if (RoadmapProgressManager.isCompleted(href)) {
                            domainStats[domainId].completed++;
                        }
                    }
                });
            }
        });
    });

    const cards = Object.entries(examDomains).map(([domainId, domain]) => {
        const stats = domainStats[domainId];
        const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        return `
            <div class="domain-progress-card" title="${domain.title}">
                <div class="domain-card-header">
                    <span class="domain-card-icon" aria-hidden="true">${domain.icon}</span>
                    <span class="domain-card-label">D${domainId.slice(-1)} (${domain.weight}%)</span>
                </div>
                <div class="domain-card-title">${domain.title}</div>
                <div class="domain-card-bar">
                    <div class="domain-card-bar-fill" style="width: ${percentage}%; background-color: ${domain.color};"></div>
                </div>
                <div class="domain-card-stats">
                    <span class="domain-card-percent">${percentage}%</span>
                    <span class="domain-card-count">${stats.completed}/${stats.total}</span>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="domain-progress-summary">
            <h3 class="domain-summary-title">
                <span aria-hidden="true">📊</span>
                試験ドメイン別カバレッジ
            </h3>
            <div class="domain-progress-grid">
                ${cards}
            </div>
        </div>
    `;
}

/**
 * レベル選択カードをレンダリング
 * @param {string} containerId - コンテナ要素のID
 * @param {Array} levels - roadmapLevels配列
 */
function renderLevelSelection(containerId, levels) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const selectedLevel = RoadmapProgressManager.getLevel();

    const cardsHTML = levels.map(level => {
        const isSelected = level.id === selectedLevel;
        return `
            <div class="level-card ${isSelected ? 'selected' : ''}"
                 data-level-id="${level.id}"
                 tabindex="0"
                 role="button"
                 aria-pressed="${isSelected}"
                 onclick="selectLevel('${level.id}')"
                 onkeydown="handleLevelKeydown(event, '${level.id}')">
                <div class="level-card-icon">${level.icon}</div>
                <h3 class="level-card-title">${level.title}</h3>
                <p class="level-card-desc">${level.description}</p>
                <div class="level-card-hours">週${level.weeklyHours}時間の学習</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="roadmap-level-selection">
            <h2><span aria-hidden="true">🎯</span>経験レベルを選択</h2>
            <p>あなたのAWS経験に合わせた4週間の学習プランを生成します</p>
            <div class="level-cards-grid">
                ${cardsHTML}
            </div>
        </div>
    `;
}

/**
 * 進捗ダッシュボードをレンダリング
 * @param {string} containerId - コンテナ要素のID
 *
 * セキュリティ注: innerHTMLは信頼できる内部データ（roadmap-data.js）から
 * 生成されたHTMLのみを使用。ユーザー入力は含まれません。
 */
function renderDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const levelId = RoadmapProgressManager.getLevel();
    if (!levelId) {
        container.innerHTML = '';
        return;
    }

    const level = roadmapLevels.find(l => l.id === levelId);
    const plan = weeklyPlans[levelId];
    if (!level || !plan) return;

    const overall = RoadmapProgressManager.calculateOverallProgress(plan);
    const currentWeek = RoadmapProgressManager.getCurrentWeek();
    const startDate = RoadmapProgressManager.getStartDate();

    // 開始日をフォーマット
    const startDateFormatted = startDate
        ? new Date(startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
        : '-';

    // ドメイン別進捗サマリーを生成（信頼できる内部データから）
    const domainSummaryHTML = renderDomainProgressSummary(levelId);

    container.innerHTML = `
        <div class="roadmap-dashboard">
            <div class="roadmap-dashboard-header">
                <h2 class="roadmap-dashboard-title">
                    <span aria-hidden="true">📊</span>学習ダッシュボード
                </h2>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="roadmap-level-badge">
                        <span>${level.icon}</span>
                        <span>${level.title}</span>
                    </div>
                    <button class="roadmap-change-level-btn" onclick="showChangeLevelModal()">
                        レベル変更
                    </button>
                </div>
            </div>

            <div class="overall-progress">
                <div class="overall-progress-header">
                    <span class="overall-progress-label">全体の進捗</span>
                    <div class="overall-progress-stats">
                        <span class="overall-progress-percent"><span id="overall-progress-percent">${overall.percentage}</span>%</span>
                        <span class="overall-progress-count">
                            <span id="completed-count">${overall.completed}</span>/<span id="total-count">${overall.total}</span>リソース完了
                        </span>
                    </div>
                </div>
                <div class="overall-progress-bar-container" role="progressbar" aria-valuenow="${overall.percentage}" aria-valuemin="0" aria-valuemax="100">
                    <div class="overall-progress-bar" id="overall-progress-bar" style="width: ${overall.percentage}%"></div>
                </div>
            </div>

            <div class="roadmap-stats-grid">
                <div class="roadmap-stat-item">
                    <div class="roadmap-stat-number">${currentWeek > 4 ? '完了' : `${currentWeek}週目`}</div>
                    <div class="roadmap-stat-label">現在の週</div>
                </div>
                <div class="roadmap-stat-item">
                    <div class="roadmap-stat-number">${level.weeklyHours}h</div>
                    <div class="roadmap-stat-label">週あたり学習時間</div>
                </div>
                <div class="roadmap-stat-item">
                    <div class="roadmap-stat-number">${startDateFormatted}</div>
                    <div class="roadmap-stat-label">学習開始日</div>
                </div>
            </div>

            ${domainSummaryHTML}
        </div>
    `;
}

/**
 * 週別プランをレンダリング
 * @param {string} containerId - コンテナ要素のID
 *
 * セキュリティ注: innerHTMLは信頼できる内部データ（roadmap-data.js）から
 * 生成されたHTMLのみを使用。ユーザー入力は含まれません。
 */
function renderWeeklyPlans(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const levelId = RoadmapProgressManager.getLevel();
    if (!levelId) {
        container.innerHTML = `
            <div class="roadmap-empty">
                <div class="roadmap-empty-icon" aria-hidden="true">📚</div>
                <h3 class="roadmap-empty-title">レベルを選択してください</h3>
                <p class="roadmap-empty-desc">
                    上のカードからあなたのAWS経験レベルを選択すると、<br>
                    パーソナライズされた4週間の学習プランが表示されます。
                </p>
            </div>
        `;
        return;
    }

    const plan = weeklyPlans[levelId];
    if (!plan) return;

    const currentWeek = RoadmapProgressManager.getCurrentWeek();
    const weeklyProgress = RoadmapProgressManager.calculateWeeklyProgress(plan);

    const weeksHTML = plan.map((week, index) => {
        const weekNum = index + 1;
        const isCurrent = weekNum === currentWeek;
        const progress = weeklyProgress[index];

        // 学習目標セクションを生成（信頼できる内部データから）
        const learningObjectivesHTML = renderLearningObjectives(week.learningObjectives, weekNum);

        // ドメインカバレッジチャートを生成（信頼できる内部データから）
        const domainCoverageHTML = renderDomainCoverageChart(week.domainFocus);

        // リソースリストを生成（信頼できる内部データから）
        const resourcesHTML = week.resources.map(href => {
            const isCompleted = RoadmapProgressManager.isCompleted(href);
            // hrefからタイトルを抽出（ファイル名をタイトル化）
            const title = getResourceTitleFromHref(href);
            const estimatedTime = classifyResourceDifficulty(href).estimatedMinutes;
            // ドメインバッジを生成（信頼できる内部データから）
            const domainBadgesHTML = renderDomainBadges(href);

            return `
                <li class="roadmap-resource-item ${isCompleted ? 'completed' : ''}">
                    <input type="checkbox"
                           class="progress-checkbox"
                           data-href="${href}"
                           ${isCompleted ? 'checked' : ''}
                           aria-label="${title}を完了済みとしてマーク"
                           onchange="handleProgressCheckboxClick(event, '${href}')">
                    <div class="roadmap-resource-info">
                        <div class="roadmap-resource-title">
                            <a href="${href}" target="_blank">${title}</a>
                        </div>
                        ${domainBadgesHTML}
                    </div>
                    <span class="roadmap-resource-time">${estimatedTime}分</span>
                </li>
            `;
        }).join('');

        // クイズリンク
        const quizLinkHTML = week.quizCategory
            ? `<a href="quiz.html?category=${week.quizCategory}" class="week-quiz-link" target="_blank">
                   <span aria-hidden="true">✏️</span>
                   週末クイズに挑戦
               </a>`
            : '';

        return `
            <div class="week-section ${isCurrent ? 'current-week' : ''}" data-week="${weekNum}">
                <div class="week-header" onclick="toggleWeekSection(${weekNum})"
                     role="button"
                     aria-expanded="false"
                     aria-controls="week-${weekNum}-content"
                     tabindex="0"
                     onkeydown="handleWeekHeaderKeydown(event, ${weekNum})">
                    <div class="week-header-left">
                        <div class="week-number">${weekNum}</div>
                        <div class="week-info">
                            <h3 class="week-title">${week.title}</h3>
                            <p class="week-theme">${week.theme}</p>
                        </div>
                    </div>
                    <div class="week-header-right">
                        <div class="week-progress-mini">
                            <div class="week-progress-bar-mini">
                                <div class="week-progress-fill-mini"
                                     id="week-${weekNum}-progress-bar"
                                     style="width: ${progress.percentage}%"></div>
                            </div>
                            <span class="week-progress-text" id="week-${weekNum}-completed">
                                ${progress.completed}/${progress.total}
                            </span>
                        </div>
                        <span class="week-toggle-icon" aria-hidden="true">▼</span>
                    </div>
                </div>
                <div class="week-content" id="week-${weekNum}-content">
                    ${learningObjectivesHTML}
                    ${domainCoverageHTML}
                    <p class="week-description">${week.description}</p>
                    <ul class="roadmap-resource-list">
                        ${resourcesHTML}
                    </ul>
                    ${quizLinkHTML}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="roadmap-weekly-plans">
            <h2><span aria-hidden="true">📅</span>週別学習プラン</h2>
            ${weeksHTML}
        </div>
    `;

    // 現在の週を自動展開
    if (currentWeek <= 4) {
        toggleWeekSection(currentWeek);
    }
}

/**
 * hrefからリソースタイトルを取得
 * searchDataから検索、なければファイル名をタイトル化
 * @param {string} href - リソースのパス
 * @returns {string} タイトル
 */
function getResourceTitleFromHref(href) {
    // searchDataが存在すればそこから検索
    if (typeof searchData !== 'undefined') {
        const found = searchData.find(item => item.file === href);
        if (found) return found.title;
    }

    // ファイル名からタイトル生成
    const filename = href.split('/').pop().replace('.html', '');
    return filename
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * 週セクションの開閉をトグル
 * @param {number} weekNum - 週番号
 */
function toggleWeekSection(weekNum) {
    const section = document.querySelector(`.week-section[data-week="${weekNum}"]`);
    if (!section) return;

    const isExpanded = section.classList.contains('expanded');
    const header = section.querySelector('.week-header');

    if (isExpanded) {
        section.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
    } else {
        section.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
    }
}

/**
 * キーボードで週ヘッダー操作
 * @param {KeyboardEvent} event
 * @param {number} weekNum
 */
function handleWeekHeaderKeydown(event, weekNum) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleWeekSection(weekNum);
    }
}

/**
 * レベル選択
 * @param {string} levelId - レベルID
 */
function selectLevel(levelId) {
    const currentLevel = RoadmapProgressManager.getLevel();

    // 既に進捗がある場合は確認
    if (currentLevel && currentLevel !== levelId) {
        const completedCount = RoadmapProgressManager.getCompletedCount();
        if (completedCount > 0) {
            showChangeLevelModal(levelId);
            return;
        }
    }

    RoadmapProgressManager.setLevel(levelId);
    renderRoadmapPage();
}

/**
 * キーボードでレベル選択
 * @param {KeyboardEvent} event
 * @param {string} levelId
 */
function handleLevelKeydown(event, levelId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectLevel(levelId);
    }
}

/**
 * レベル変更確認モーダルを表示
 * @param {string} newLevelId - 新しいレベルID（省略時は選択用）
 */
function showChangeLevelModal(newLevelId = null) {
    const modal = document.getElementById('change-level-modal');
    if (modal) {
        modal.dataset.newLevel = newLevelId || '';
        modal.classList.add('show');
        // モーダル内の最初のボタンにフォーカス
        const firstButton = modal.querySelector('button');
        if (firstButton) firstButton.focus();
    }
}

/**
 * モーダルを閉じる
 */
function hideChangeLevelModal() {
    const modal = document.getElementById('change-level-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * レベル変更を確定
 */
function confirmLevelChange() {
    const modal = document.getElementById('change-level-modal');
    const newLevelId = modal?.dataset.newLevel;

    if (newLevelId) {
        RoadmapProgressManager.setLevel(newLevelId);
    } else {
        RoadmapProgressManager.reset();
    }

    hideChangeLevelModal();
    renderRoadmapPage();
}

/**
 * ロードマップページ全体をレンダリング
 */
function renderRoadmapPage() {
    renderLevelSelection('level-selection-container', roadmapLevels);
    renderDashboard('dashboard-container');
    renderWeeklyPlans('weekly-plans-container');

    // レベル選択済みの場合、選択カードを非表示
    const levelId = RoadmapProgressManager.getLevel();
    const levelSelectionEl = document.getElementById('level-selection-container');
    if (levelSelectionEl) {
        levelSelectionEl.style.display = levelId ? 'none' : 'block';
    }
}

/**
 * ページ初期化
 */
function initRoadmapPage() {
    renderRoadmapPage();

    // モーダルの外側クリックで閉じる
    const modal = document.getElementById('change-level-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideChangeLevelModal();
            }
        });
    }

    // Escキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideChangeLevelModal();
        }
    });
}
