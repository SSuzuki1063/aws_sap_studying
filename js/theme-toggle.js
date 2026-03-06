/**
 * Dark mode toggle — reads localStorage or prefers-color-scheme,
 * toggles data-theme on <html>, persists to localStorage.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var html = document.documentElement;

    function getPreferred() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function apply(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    // Apply on load (also in FOUC-prevention inline script)
    apply(getPreferred());

    // Toggle on button click
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.theme-toggle');
        if (!btn) return;
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
    });
})();
