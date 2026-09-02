/* ============================================
   DASHBOARD.JS
   Dashboard-Specific JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Dashboard Widgets -----
        initDashboardWidgets();

        // ----- Quick Action Handlers -----
        setupQuickActions();

        // ----- Refresh Dashboard Data -----
        setupRefreshData();

        // ----- Widget Click Handlers -----
        setupWidgetClicks();

        // ----- Recent Items Hover Effects -----
        setupRecentItems();

        // ----- Auto-refresh every 5 minutes (Phase 1 demo) -----
        setupAutoRefresh();
    });

    /* ============================================
       INITIALIZE DASHBOARD WIDGETS
       ============================================ */

    function initDashboardWidgets() {
        // In Phase 1, widgets display static demo data
        // In Phase 2, this will fetch from Firebase

        // Animate widget values with a counting effect
        animateWidgetValues();

        // Set up attendance progress bar
        setupAttendanceProgress();

        // Set up alerts
        setupAlerts();
    }

    /* ============================================
       ANIMATE WIDGET VALUES
       ============================================ */

    function animateWidgetValues() {
        var widgets = document.querySelectorAll('.widget-value');

        widgets.forEach(function(widget) {
            var text = widget.textContent.trim();
            var isNumber = /^[\d,]+$/.test(text.replace(/,/g, ''));
            var isCurrency = /^[₹]?[\d,]+$/.test(text.replace(/,/g, '').replace(/₹/g, ''));

            if (isNumber || isCurrency) {
                var targetValue = parseInt(text.replace(/[,₹]/g, ''), 10);
                if (!isNaN(targetValue)) {
                    var currentValue = 0;
                    var steps = 30;
                    var duration = 1000;
                    var stepTime = duration / steps;
                    var increment = targetValue / steps;

                    // Store original prefix/suffix
                    var prefix = '';
                    var suffix = '';
                    if (text.startsWith('₹')) prefix = '₹';
                    if (text.endsWith('%')) suffix = '%';
                    if (text.endsWith('+')) suffix = '+';

                    var interval = setInterval(function() {
                        currentValue += increment;
                        if (currentValue >= targetValue) {
                            currentValue = targetValue;
                            clearInterval(interval);
                        }

                        // Format with commas
                        var displayValue = Math.round(currentValue).toLocaleString('en-IN');
                        widget.textContent = prefix + displayValue + suffix;
                    }, stepTime);
                }
            }
        });
    }

    /* ============================================
       ATTENDANCE PROGRESS
       ============================================ */

    function setupAttendanceProgress() {
        var progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;

        // Animate progress bar
        var targetWidth = progressBar.style.width || '92%';
        progressBar.style.width = '0%';

        setTimeout(function() {
            progressBar.style.transition = 'width 1.5s ease-in-out';
            progressBar.style.width = targetWidth;
        }, 500);
    }

    /* ============================================
       ALERTS
       ============================================ */

    function setupAlerts() {
        var alerts = document.querySelectorAll('.alert-banner');

        alerts.forEach(function(alert) {
            // Add close button to alerts
            var closeBtn = document.createElement('button');
            closeBtn.className = 'alert-close';
            closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;margin-left:auto;flex-shrink:0;';
            closeBtn.addEventListener('click', function() {
                alert.style.transition = 'opacity 0.3s ease';
                alert.style.opacity = '0';
                setTimeout(function() {
                    alert.style.display = 'none';
                }, 300);
            });

            // Only add if there's room
            if (!alert.querySelector('.alert-close')) {
                alert.appendChild(closeBtn);
            }
        });
    }

    /* ============================================
       QUICK ACTION HANDLERS
       ============================================ */

    function setupQuickActions() {
        var quickBtns = document.querySelectorAll('.quick-action-btn');

        quickBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                // Allow navigation, just track click
                var href = this.getAttribute('href');
                if (href) {
                    // Track click for analytics (Phase 1 demo)
                    console.log('Quick action clicked:', href);
                }
            });
        });
    }

    /* ============================================
       REFRESH DATA
       ============================================ */

    function setupRefreshData() {
        // Add refresh button to page actions if not present
        var pageActions = document.querySelector('.page-actions');
        if (pageActions) {
            var refreshBtn = document.createElement('button');
            refreshBtn.className = 'btn btn-outline';
            refreshBtn.id = 'refreshDataBtn';
            refreshBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Refresh';
            refreshBtn.addEventListener('click', function() {
                var originalText = this.innerHTML;
                this.innerHTML = '<span class="btn-spinner"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg></span> Refreshing...';
                this.disabled = true;

                setTimeout(function() {
                    refreshBtn.innerHTML = originalText;
                    refreshBtn.disabled = false;
                    showNotification('Dashboard data refreshed (Phase 1 demo)', 'success');
                }, 1500);
            });

            // Only add if not already present
            if (!document.getElementById('refreshDataBtn')) {
                pageActions.appendChild(refreshBtn);
            }
        }
    }

    /* ============================================
       WIDGET CLICK HANDLERS
       ============================================ */

    function setupWidgetClicks() {
        var widgets = document.querySelectorAll('.widget-card');

        widgets.forEach(function(widget) {
            widget.style.cursor = 'pointer';
            widget.addEventListener('click', function() {
                var label = this.querySelector('.widget-label')?.textContent || 'Widget';
                showNotification('Navigating to ' + label + ' details (Phase 1 demo)', 'info');
            });
        });
    }

    /* ============================================
       RECENT ITEMS HOVER EFFECTS
       ============================================ */

    function setupRecentItems() {
        var rows = document.querySelectorAll('.table-mini tbody tr, .notice-list li, .event-list li');

        rows.forEach(function(row) {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--bg-light)';
                this.style.transition = 'background-color 0.2s ease';
            });

            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });

        // Make notice items clickable
        var noticeItems = document.querySelectorAll('.notice-list li');
        noticeItems.forEach(function(item) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                var text = this.querySelector('.notice-text')?.textContent || 'Notice';
                showNotification('Viewing: ' + text, 'info');
            });
        });

        // Make event items clickable
        var eventItems = document.querySelectorAll('.event-list li');
        eventItems.forEach(function(item) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                var text = this.querySelector('.event-text')?.textContent || 'Event';
                showNotification('Viewing: ' + text, 'info');
            });
        });
    }

    /* ============================================
       AUTO REFRESH
       ============================================ */

    function setupAutoRefresh() {
        // Auto-refresh dashboard data every 5 minutes (Phase 1 demo)
        // In Phase 2, this could fetch real-time updates

        setInterval(function() {
            // Only if the page is visible
            if (!document.hidden) {
                console.log('Auto-refresh triggered (Phase 1 demo)');
                // Could update a timestamp or show a notification
                var dateEl = document.getElementById('currentDate');
                if (dateEl) {
                    var now = new Date();
                    var options = {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    };
                    dateEl.textContent = now.toLocaleDateString('en-IN', options);
                }
            }
        }, 300000); // 5 minutes
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showNotification(message, type) {
        var colors = {
            success: { bg: '#27ae60', color: '#fff' },
            info: { bg: '#3498db', color: '#fff' },
            warning: { bg: '#f39c12', color: '#fff' },
            error: { bg: '#e74c3c', color: '#fff' }
        };

        var style = colors[type] || colors.info;

        var msg = document.createElement('div');
        msg.style.cssText = 'position:fixed;bottom:20px;right:20px;background:' + style.bg + ';color:' + style.color + ';padding:12px 24px;border-radius:6px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:400px;';
        msg.textContent = message;
        document.body.appendChild(msg);

        setTimeout(function() {
            msg.style.transition = 'opacity 0.5s ease';
            msg.style.opacity = '0';
            setTimeout(function() {
                msg.remove();
            }, 500);
        }, 3000);
    }

})();
