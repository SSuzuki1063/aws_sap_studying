// Scroll-to-top button + reading progress bar — externalized from inline <script>
(function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const readingProgress = document.getElementById('readingProgress');
    const readingProgressBar = document.getElementById('readingProgressBar');

    if (!scrollToTopBtn || !readingProgress || !readingProgressBar) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        if (scrollTop > 100) {
            readingProgress.classList.add('show');
            readingProgressBar.style.width = scrollPercentage + '%';
            readingProgress.setAttribute('aria-valuenow', Math.round(scrollPercentage));
        } else {
            readingProgress.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
