/**
 * AWS SAP学習リソース - ロードマップ進捗管理
 * localStorageを使用して進捗状態を永続化
 */

const RoadmapProgressManager = {
    STORAGE_KEY: 'aws_sap_roadmap_progress',

    /**
     * デフォルトの進捗データ構造
     */
    getDefaultProgress() {
        return {
            selectedLevel: null,
            startDate: null,
            completedResources: [], // [{href: string, completedAt: string}]
            lastUpdated: null
        };
    },

    /**
     * 進捗データを取得
     * @returns {Object} 進捗データ
     */
    getProgress() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return { ...this.getDefaultProgress(), ...JSON.parse(data) };
            }
            return this.getDefaultProgress();
        } catch (e) {
            console.error('進捗データの読み込みに失敗しました:', e);
            return this.getDefaultProgress();
        }
    },

    /**
     * 進捗データを保存
     * @param {Object} progress - 進捗データ
     * @returns {boolean} 保存に成功した場合true
     */
    saveProgress(progress) {
        try {
            progress.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
            return true;
        } catch (e) {
            console.error('進捗データの保存に失敗しました:', e);
            return false;
        }
    },

    /**
     * 経験レベルを設定
     * @param {string} levelId - レベルID（beginner/intermediate/advanced）
     * @returns {boolean} 設定に成功した場合true
     */
    setLevel(levelId) {
        const progress = this.getProgress();
        progress.selectedLevel = levelId;
        progress.startDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        progress.completedResources = []; // レベル変更時はリセット
        return this.saveProgress(progress);
    },

    /**
     * 選択中のレベルを取得
     * @returns {string|null} レベルID
     */
    getLevel() {
        return this.getProgress().selectedLevel;
    },

    /**
     * 開始日を取得
     * @returns {string|null} 開始日（YYYY-MM-DD）
     */
    getStartDate() {
        return this.getProgress().startDate;
    },

    /**
     * リソースを完了済みとしてマーク
     * @param {string} href - リソースのパス
     * @returns {boolean} 追加に成功した場合true
     */
    markComplete(href) {
        try {
            const progress = this.getProgress();
            const existing = progress.completedResources.find(r => r.href === href);

            if (!existing) {
                progress.completedResources.push({
                    href: href,
                    completedAt: new Date().toISOString()
                });
                return this.saveProgress(progress);
            }
            return false;
        } catch (e) {
            console.error('リソース完了マークに失敗しました:', e);
            return false;
        }
    },

    /**
     * リソースの完了を解除
     * @param {string} href - リソースのパス
     * @returns {boolean} 解除に成功した場合true
     */
    unmarkComplete(href) {
        try {
            const progress = this.getProgress();
            const index = progress.completedResources.findIndex(r => r.href === href);

            if (index > -1) {
                progress.completedResources.splice(index, 1);
                return this.saveProgress(progress);
            }
            return false;
        } catch (e) {
            console.error('リソース完了解除に失敗しました:', e);
            return false;
        }
    },

    /**
     * リソースが完了済みかどうかを確認
     * @param {string} href - リソースのパス
     * @returns {boolean} 完了済みの場合true
     */
    isCompleted(href) {
        const progress = this.getProgress();
        return progress.completedResources.some(r => r.href === href);
    },

    /**
     * 完了リソースの一覧を取得
     * @returns {Array<{href: string, completedAt: string}>}
     */
    getCompletedResources() {
        return this.getProgress().completedResources;
    },

    /**
     * 完了リソース数を取得
     * @returns {number}
     */
    getCompletedCount() {
        return this.getProgress().completedResources.length;
    },

    /**
     * 週別の進捗を計算
     * @param {Array} weeklyPlan - 週別プラン（roadmap-data.jsから）
     * @returns {Array<{week: number, total: number, completed: number, percentage: number}>}
     */
    calculateWeeklyProgress(weeklyPlan) {
        const completedHrefs = new Set(
            this.getCompletedResources().map(r => r.href)
        );

        return weeklyPlan.map((week, index) => {
            const total = week.resources.length;
            const completed = week.resources.filter(href => completedHrefs.has(href)).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                week: index + 1,
                total,
                completed,
                percentage
            };
        });
    },

    /**
     * 全体の進捗率を計算
     * @param {Array} weeklyPlan - 週別プラン
     * @returns {{total: number, completed: number, percentage: number}}
     */
    calculateOverallProgress(weeklyPlan) {
        const completedHrefs = new Set(
            this.getCompletedResources().map(r => r.href)
        );

        let total = 0;
        let completed = 0;

        weeklyPlan.forEach(week => {
            total += week.resources.length;
            completed += week.resources.filter(href => completedHrefs.has(href)).length;
        });

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, percentage };
    },

    /**
     * 現在の週を計算（開始日から）
     * @returns {number} 現在の週番号（1〜4、5以上は完了後）
     */
    getCurrentWeek() {
        const startDate = this.getStartDate();
        if (!startDate) return 1;

        const start = new Date(startDate);
        const now = new Date();
        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weekNumber = Math.floor(diffDays / 7) + 1;

        return Math.min(weekNumber, 5); // 最大5（4週完了後）
    },

    /**
     * 進捗をリセット
     * @returns {boolean} リセットに成功した場合true
     */
    reset() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('進捗リセットに失敗しました:', e);
            return false;
        }
    },

    /**
     * リソース完了状態をトグル
     * @param {string} href - リソースのパス
     * @returns {boolean} トグル後の状態（true=完了済み）
     */
    toggleComplete(href) {
        if (this.isCompleted(href)) {
            this.unmarkComplete(href);
            return false;
        } else {
            this.markComplete(href);
            return true;
        }
    }
};

/**
 * チェックボックスのクリックハンドラ
 * @param {Event} event - クリックイベント
 * @param {string} href - リソースのパス
 */
function handleProgressCheckboxClick(event, href) {
    const isCompleted = RoadmapProgressManager.toggleComplete(href);
    updateProgressCheckbox(href, isCompleted);
    updateProgressDisplay();
}

/**
 * チェックボックスのUI状態を更新
 * @param {string} href - リソースのパス
 * @param {boolean} isCompleted - 完了状態
 */
function updateProgressCheckbox(href, isCompleted) {
    const checkboxes = document.querySelectorAll(`.progress-checkbox[data-href="${href}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = isCompleted;
        checkbox.setAttribute('aria-checked', isCompleted);

        // 親リストアイテムのスタイル更新
        const listItem = checkbox.closest('.roadmap-resource-item');
        if (listItem) {
            listItem.classList.toggle('completed', isCompleted);
        }
    });
}

/**
 * 進捗表示を更新（ダッシュボード・週別バー）
 */
function updateProgressDisplay() {
    const levelId = RoadmapProgressManager.getLevel();
    if (!levelId || typeof weeklyPlans === 'undefined') return;

    const plan = weeklyPlans[levelId];
    if (!plan) return;

    // 全体進捗の更新
    const overall = RoadmapProgressManager.calculateOverallProgress(plan);
    const overallPercentEl = document.getElementById('overall-progress-percent');
    const overallBarEl = document.getElementById('overall-progress-bar');
    const completedCountEl = document.getElementById('completed-count');
    const totalCountEl = document.getElementById('total-count');

    if (overallPercentEl) overallPercentEl.textContent = overall.percentage;
    if (overallBarEl) overallBarEl.style.width = overall.percentage + '%';
    if (completedCountEl) completedCountEl.textContent = overall.completed;
    if (totalCountEl) totalCountEl.textContent = overall.total;

    // 週別進捗の更新
    const weeklyProgress = RoadmapProgressManager.calculateWeeklyProgress(plan);
    weeklyProgress.forEach(wp => {
        const weekBarEl = document.getElementById(`week-${wp.week}-progress-bar`);
        const weekPercentEl = document.getElementById(`week-${wp.week}-progress-percent`);
        const weekCompletedEl = document.getElementById(`week-${wp.week}-completed`);

        if (weekBarEl) weekBarEl.style.width = wp.percentage + '%';
        if (weekPercentEl) weekPercentEl.textContent = wp.percentage;
        if (weekCompletedEl) weekCompletedEl.textContent = `${wp.completed}/${wp.total}`;
    });
}

/**
 * ページ読み込み時に進捗チェックボックスを初期化
 */
function initializeProgressCheckboxes() {
    const completedResources = RoadmapProgressManager.getCompletedResources();
    const completedHrefs = new Set(completedResources.map(r => r.href));

    const checkboxes = document.querySelectorAll('.progress-checkbox');
    checkboxes.forEach(checkbox => {
        const href = checkbox.getAttribute('data-href');
        if (href && completedHrefs.has(href)) {
            checkbox.checked = true;
            checkbox.setAttribute('aria-checked', 'true');

            const listItem = checkbox.closest('.roadmap-resource-item');
            if (listItem) {
                listItem.classList.add('completed');
            }
        }
    });

    // 進捗表示も更新
    updateProgressDisplay();
}
