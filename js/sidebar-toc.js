// Sidebar TOC toggle + scroll spy
function toggleSidebarTOC() {
    const sidebar = document.getElementById('sidebar-toc');
    const icon = document.getElementById('sidebar-toc-toggle-icon');
    if (!sidebar || !icon) return;

    const body = document.body;
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        sidebar.classList.toggle('open');
        icon.textContent = sidebar.classList.contains('open') ? '◀' : '▶';
    } else {
        body.classList.toggle('sidebar-collapsed');
        sidebar.classList.toggle('collapsed');
        icon.textContent = body.classList.contains('sidebar-collapsed') ? '▶' : '◀';
    }

    const isCollapsed = body.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebarTOCCollapsed', isCollapsed);
}

document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    const savedState = localStorage.getItem('sidebarTOCCollapsed');

    if (isMobile) {
        const icon = document.getElementById('sidebar-toc-toggle-icon');
        if (icon) icon.textContent = '▶';
    } else {
        if (savedState === 'true') {
            document.body.classList.add('sidebar-collapsed');
            const sidebar = document.getElementById('sidebar-toc');
            if (sidebar) sidebar.classList.add('collapsed');
            const icon = document.getElementById('sidebar-toc-toggle-icon');
            if (icon) icon.textContent = '▶';
        }
    }

    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        const sidebar = document.getElementById('sidebar-toc');
        const body = document.body;
        const icon = document.getElementById('sidebar-toc-toggle-icon');

        if (!sidebar || !icon) return;

        if (isMobile) {
            sidebar.classList.remove('collapsed');
            body.classList.remove('sidebar-collapsed');
            if (!sidebar.classList.contains('open')) {
                icon.textContent = '▶';
            }
        } else {
            sidebar.classList.remove('open');
            const isCollapsed = localStorage.getItem('sidebarTOCCollapsed') === 'true';
            if (isCollapsed) {
                body.classList.add('sidebar-collapsed');
                sidebar.classList.add('collapsed');
                icon.textContent = '▶';
            } else {
                icon.textContent = '◀';
            }
        }
    });

    // Scroll spy — highlight active TOC link based on scroll position
    initScrollSpy();
});

function initScrollSpy() {
    const tocLinks = document.querySelectorAll('.sidebar-toc-content a[href^="#"]');
    if (tocLinks.length === 0) return;

    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
    const threshold = headerOffset + 40;

    function updateActiveLink() {
        const sections = [];
        tocLinks.forEach(function(link) {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) sections.push({ el: el, link: link });
        });

        let activeLink = null;
        for (let i = sections.length - 1; i >= 0; i--) {
            const rect = sections[i].el.getBoundingClientRect();
            if (rect.top <= threshold) {
                activeLink = sections[i].link;
                break;
            }
        }

        // If at top of page, activate first link
        if (!activeLink && sections.length > 0 && window.scrollY < 100) {
            activeLink = sections[0].link;
        }

        tocLinks.forEach(function(link) { link.classList.remove('active'); });
        if (activeLink) {
            activeLink.classList.add('active');
            // Scroll the active link into view within the sidebar
            const sidebar = document.getElementById('sidebar-toc');
            if (sidebar && activeLink.offsetParent) {
                const linkRect = activeLink.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                if (linkRect.bottom > sidebarRect.bottom || linkRect.top < sidebarRect.top) {
                    activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial highlight
    updateActiveLink();
}
