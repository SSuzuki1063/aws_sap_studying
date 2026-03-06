// Sidebar TOC toggle — externalized from inline <script> in every page
function toggleSidebarTOC() {
    const sidebar = document.getElementById('sidebar-toc');
    const body = document.body;
    const icon = document.getElementById('sidebar-toc-toggle-icon');

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
});
