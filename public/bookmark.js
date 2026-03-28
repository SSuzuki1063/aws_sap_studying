/**
 * AWS SAP学習リソース - ブックマーク機能
 * localStorageを使用してブックマーク状態を永続化
 */

const BookmarkManager = {
    STORAGE_KEY: 'aws_sap_bookmarks',

    /**
     * 全ブックマークを取得
     * @returns {string[]} ブックマークされたリソースのhref配列
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('ブックマークの読み込みに失敗しました:', e);
            return [];
        }
    },

    /**
     * ブックマークを追加
     * @param {string} href - リソースのパス
     * @returns {boolean} 追加に成功した場合true
     */
    add(href) {
        try {
            const bookmarks = this.getAll();
            if (!bookmarks.includes(href)) {
                bookmarks.push(href);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
                return true;
            }
            return false;
        } catch (e) {
            console.error('ブックマークの追加に失敗しました:', e);
            return false;
        }
    },

    /**
     * ブックマークを削除
     * @param {string} href - リソースのパス
     * @returns {boolean} 削除に成功した場合true
     */
    remove(href) {
        try {
            const bookmarks = this.getAll();
            const index = bookmarks.indexOf(href);
            if (index > -1) {
                bookmarks.splice(index, 1);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
                return true;
            }
            return false;
        } catch (e) {
            console.error('ブックマークの削除に失敗しました:', e);
            return false;
        }
    },

    /**
     * ブックマーク状態をトグル
     * @param {string} href - リソースのパス
     * @returns {boolean} トグル後の状態（true=ブックマーク済み）
     */
    toggle(href) {
        if (this.isBookmarked(href)) {
            this.remove(href);
            return false;
        } else {
            this.add(href);
            return true;
        }
    },

    /**
     * ブックマーク済みかどうかを確認
     * @param {string} href - リソースのパス
     * @returns {boolean} ブックマーク済みの場合true
     */
    isBookmarked(href) {
        return this.getAll().includes(href);
    },

    /**
     * ブックマーク数を取得
     * @returns {number} ブックマーク数
     */
    count() {
        return this.getAll().length;
    },

    /**
     * 全ブックマークをクリア
     * @returns {boolean} クリアに成功した場合true
     */
    clearAll() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
            return true;
        } catch (e) {
            console.error('ブックマークのクリアに失敗しました:', e);
            return false;
        }
    }
};

/**
 * ブックマークアイコンのクリックハンドラ
 * @param {Event} event - クリックイベント
 * @param {string} href - リソースのパス
 */
function handleBookmarkClick(event, href) {
    event.preventDefault();
    event.stopPropagation();

    const isBookmarked = BookmarkManager.toggle(href);
    updateBookmarkIcon(href, isBookmarked);

    // フィードバックアニメーション
    const button = event.currentTarget;
    button.classList.add('bookmark-animate');
    setTimeout(() => {
        button.classList.remove('bookmark-animate');
    }, 300);
}

/**
 * ブックマークアイコンのUI状態を更新
 * @param {string} href - リソースのパス
 * @param {boolean} isBookmarked - ブックマーク状態
 */
function updateBookmarkIcon(href, isBookmarked) {
    const buttons = document.querySelectorAll(`.bookmark-icon[data-href="${href}"]`);
    buttons.forEach(button => {
        if (isBookmarked) {
            button.classList.add('bookmarked');
            button.textContent = '★';
            button.setAttribute('aria-label', 'ブックマークを解除');
            button.setAttribute('title', 'ブックマークを解除');
        } else {
            button.classList.remove('bookmarked');
            button.textContent = '☆';
            button.setAttribute('aria-label', 'ブックマークに追加');
            button.setAttribute('title', 'ブックマークに追加');
        }
    });
}

/**
 * ページ読み込み時にブックマークアイコンを初期化
 */
function initializeBookmarkIcons() {
    const bookmarks = BookmarkManager.getAll();
    const buttons = document.querySelectorAll('.bookmark-icon');

    buttons.forEach(button => {
        const href = button.getAttribute('data-href');
        if (href && bookmarks.includes(href)) {
            button.classList.add('bookmarked');
            button.textContent = '★';
            button.setAttribute('aria-label', 'ブックマークを解除');
            button.setAttribute('title', 'ブックマークを解除');
        }
    });
}

/**
 * イベント委譲によるブックマークボタンのクリック処理
 * Astroビルド時レンダリングのボタン（onclick属性なし）にも対応
 */
document.addEventListener('click', function(event) {
    const button = event.target.closest('.bookmark-icon');
    if (!button) return;
    const href = button.getAttribute('data-href');
    if (!href) return;
    // onclick属性が設定されている場合はそちらに任せる
    if (button.hasAttribute('onclick')) return;

    event.preventDefault();
    event.stopPropagation();

    const isBookmarked = BookmarkManager.toggle(href);
    updateBookmarkIcon(href, isBookmarked);

    button.classList.add('bookmark-animate');
    setTimeout(function() {
        button.classList.remove('bookmark-animate');
    }, 300);
});

/**
 * ヘッダーのブックマーク数バッジを更新
 */
function updateBookmarkBadge() {
    const badge = document.getElementById('bookmark-count-badge');
    if (badge) {
        const count = BookmarkManager.count();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}
