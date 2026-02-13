/**
 * AWS SAP学習リソース - モバイルナビゲーション
 * ハンバーガーメニューのトグル、Escキー対応、リサイズ時の自動閉じ
 */
(function () {
    'use strict';

    var btn = document.getElementById('hamburgerBtn');
    var nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    function openMenu() {
        nav.classList.add('mobile-open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'メニューを閉じる');
    }

    function closeMenu() {
        nav.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'メニューを開く');
    }

    function isOpen() {
        return nav.classList.contains('mobile-open');
    }

    // トグル
    btn.addEventListener('click', function () {
        if (isOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // リンククリック時に閉じる
    nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Escキーで閉じる
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) {
            closeMenu();
            btn.focus();
        }
    });

    // リサイズ時に閉じる（768px超はデスクトップ表示に戻る）
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && isOpen()) {
            closeMenu();
        }
    });
})();
