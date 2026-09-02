/* ============================================
   TOGGLE.JS
   Hamburger / Mobile Navigation & Toggle Functions
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Hamburger Menu Toggle -----
        setupHamburgerMenu();

        // ----- Navigation Sub-menu Toggle (Sidebar) -----
        setupNavToggle();

        // ----- Sidebar Close on Outside Click (Mobile) -----
        setupSidebarOutsideClick();
    });

    /* ============================================
       HAMBURGER MENU
       ============================================ */

    function setupHamburgerMenu() {
        var hamburgerBtn = document.getElementById('hamburgerBtn');
        var sidebar = document.getElementById('sidebar');
        var body = document.body;

        if (!hamburgerBtn || !sidebar) return;

        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            sidebar.classList.toggle('open');

            // Toggle body class to prevent scrolling when sidebar is open
            body.classList.toggle('sidebar-open');
        });

        // Close sidebar when a nav link is clicked (on mobile)
        var navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    // Don't close if it's a toggle link (has data-target)
                    if (!this.hasAttribute('data-target')) {
                        closeSidebar();
                    }
                }
            });
        });

        // Also close when clicking a sub-menu link
        var subLinks = sidebar.querySelectorAll('.nav-sub a');
        subLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    closeSidebar();
                }
            });
        });

        // Close sidebar on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                closeSidebar();
            }
        });
    }

    function closeSidebar() {
        var hamburgerBtn = document.getElementById('hamburgerBtn');
        var sidebar = document.getElementById('sidebar');
        var body = document.body;

        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        if (sidebar) sidebar.classList.remove('open');
        if (body) body.classList.remove('sidebar-open');
    }

    /* ============================================
       SIDEBAR OUTSIDE CLICK (MOBILE)
       ============================================ */

    function setupSidebarOutsideClick() {
        var sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        document.addEventListener('click', function(e) {
            // Check if sidebar is open and click is outside
            if (sidebar.classList.contains('open')) {
                var isClickInside = sidebar.contains(e.target);
                var isHamburger = document.getElementById('hamburgerBtn')?.contains(e.target);

                if (!isClickInside && !isHamburger) {
                    closeSidebar();
                }
            }
        });
    }

    /* ============================================
       NAVIGATION SUB-MENU TOGGLE
       ============================================ */

    function setupNavToggle() {
        var toggleLinks = document.querySelectorAll('.nav-toggle');

        toggleLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                var targetId = this.getAttribute('data-target');
                if (!targetId) return;

                var targetMenu = document.getElementById(targetId);
                if (!targetMenu) return;

                // Toggle the menu
                targetMenu.classList.toggle('open');

                // Toggle arrow
                var arrow = this.querySelector('.nav-arrow');
                if (arrow) {
                    arrow.classList.toggle('open');
                }

                // If we want to close other open menus? 
                // For better UX, we could close sibling menus, but we'll let the user control.

                // Toggle open class on parent nav-item
                var parentItem = this.closest('.nav-item');
                if (parentItem) {
                    parentItem.classList.toggle('open');
                }
            });
        });

        // Auto-open sub-menus based on active state
        // Find any active parent and open its sub-menu
        var activeParents = document.querySelectorAll('.nav-item.active.nav-parent');
        activeParents.forEach(function(item) {
            var toggle = item.querySelector('.nav-toggle');
            var targetId = toggle?.getAttribute('data-target');
            if (targetId) {
                var sub = document.getElementById(targetId);
                if (sub) {
                    sub.classList.add('open');
                    var arrow = toggle.querySelector('.nav-arrow');
                    if (arrow) arrow.classList.add('open');
                }
            }
        });
    }

})();
