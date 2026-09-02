/* ============================================
   COMMUNICATION.JS
   Notices, Events, Announcements & Calendar
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Communication Features -----
        initCommunicationFeatures();

        // ----- Notices Management -----
        setupNoticesManagement();

        // ----- Events Management -----
        setupEventsManagement();

        // ----- Announcements Management -----
        setupAnnouncementsManagement();

        // ----- Calendar Management -----
        setupCalendarManagement();

        // ----- Notice Board (Public/Display) -----
        setupNoticeBoard();
    });

    /* ============================================
       INITIALIZE COMMUNICATION FEATURES
       ============================================ */

    function initCommunicationFeatures() {
        // Load saved communication data from localStorage
        loadCommunicationData();

        // Set default dates
        setDefaultCommunicationDates();

        // Initialize status badges
        initCommunicationBadges();

        // Update counts
        updateCommunicationCounts();
    }

    /* ============================================
       LOAD COMMUNICATION DATA
       ============================================ */

    function loadCommunicationData() {
        var saved = localStorage.getItem('communication_data');
        if (saved) {
            try {
                var data = JSON.parse(saved);
                console.log('Communication data loaded:', data);
                // Populate tables if data exists
                if (data.notices) {
                    populateNotices(data.notices);
                }
                if (data.events) {
                    populateEvents(data.events);
                }
                if (data.announcements) {
                    populateAnnouncements(data.announcements);
                }
            } catch (e) {
                console.log('Error loading communication data:', e);
            }
        }
    }

    /* ============================================
       SET DEFAULT COMMUNICATION DATES
       ============================================ */

    function setDefaultCommunicationDates() {
        var today = new Date().toISOString().split('T')[0];

        var dateInputs = document.querySelectorAll('.communication-date');
        dateInputs.forEach(function(input) {
            if (!input.value) {
                input.value = today;
            }
        });

        // Set default expiry dates (30 days from now)
        var expiryInputs = document.querySelectorAll('.communication-expiry');
        expiryInputs.forEach(function(input) {
            if (!input.value) {
                var date = new Date();
                date.setDate(date.getDate() + 30);
                input.value = date.toISOString().split('T')[0];
            }
        });
    }

    /* ============================================
       INIT COMMUNICATION BADGES
       ============================================ */

    function initCommunicationBadges() {
        var statusCells = document.querySelectorAll('.communication-status');
        statusCells.forEach(function(cell) {
            var status = cell.textContent.trim().toLowerCase();
            var colors = {
                active: { bg: '#d5f5e3', color: '#1e8449' },
                expired: { bg: '#fadbd8', color: '#b03a2e' },
                upcoming: { bg: '#d6eaf8', color: '#2471a3' },
                ongoing: { bg: '#fdebd0', color: '#b9770e' },
                published: { bg: '#d5f5e3', color: '#1e8449' },
                draft: { bg: '#f0f0f0', color: '#5d6d7e' }
            };

            var color = colors[status] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       UPDATE COMMUNICATION COUNTS
       ============================================ */

    function updateCommunicationCounts() {
        var noticeRows = document.querySelectorAll('#noticesTableBody tr');
        var eventRows = document.querySelectorAll('#eventsTableBody tr');
        var announcementRows = document.querySelectorAll('#announcementsTableBody tr');

        // Update notice count
        var noticeInfo = document.querySelector('.notice-count');
        if (noticeInfo) {
            noticeInfo.textContent = noticeRows.length;
        }

        // Update event count
        var eventInfo = document.querySelector('.event-count');
        if (eventInfo) {
            eventInfo.textContent = eventRows.length;
        }

        // Update announcement count
        var announceInfo = document.querySelector('.announcement-count');
        if (announceInfo) {
            announceInfo.textContent = announcementRows.length;
        }

        // Update table pagination info
        var infoEl = document.querySelector('.table-info');
        if (infoEl) {
            var strongTags = infoEl.querySelectorAll('strong');
            if (strongTags.length >= 3) {
                var totalRows = noticeRows.length + eventRows.length + announcementRows.length;
                strongTags[0].textContent = totalRows > 0 ? '1' : '0';
                strongTags[1].textContent = totalRows;
                strongTags[2].textContent = totalRows;
            }
        }
    }

    /* ============================================
       POPULATE DATA FROM STORAGE
       ============================================ */

    function populateNotices(notices) {
        var tbody = document.getElementById('noticesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        notices.forEach(function(notice) {
            var row = document.createElement('tr');
            var statusClass = notice.status === 'Published' ? 'active' : 'draft';
            row.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" /></td>
                <td>${notice.id || 'NTC-' + Math.floor(Math.random() * 9000)}</td>
                <td>${notice.title || 'Notice'}</td>
                <td>${notice.category || 'General'}</td>
                <td>${notice.publishDate || new Date().toISOString().slice(0, 10)}</td>
                <td>${notice.expiryDate || ''}</td>
                <td><span class="communication-status ${statusClass}">${notice.status || 'Draft'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" title="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="action-btn edit" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateEvents(events) {
        var tbody = document.getElementById('eventsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        events.forEach(function(event) {
            var row = document.createElement('tr');
            var statusClass = event.status === 'Upcoming' ? 'upcoming' : (event.status === 'Ongoing' ? 'ongoing' : 'completed');
            row.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" /></td>
                <td>${event.id || 'EVT-' + Math.floor(Math.random() * 9000)}</td>
                <td>${event.title || 'Event'}</td>
                <td>${event.startDate || new Date().toISOString().slice(0, 10)}</td>
                <td>${event.endDate || ''}</td>
                <td>${event.venue || 'TBD'}</td>
                <td><span class="communication-status ${statusClass}">${event.status || 'Upcoming'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" title="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="action-btn edit" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateAnnouncements(announcements) {
        var tbody = document.getElementById('announcementsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        announcements.forEach(function(announcement) {
            var row = document.createElement('tr');
            var statusClass = announcement.status === 'Published' ? 'active' : 'draft';
            row.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" /></td>
                <td>${announcement.id || 'ANN-' + Math.floor(Math.random() * 9000)}</td>
                <td>${announcement.title || 'Announcement'}</td>
                <td>${announcement.audience || 'All'}</td>
                <td>${announcement.date || new Date().toISOString().slice(0, 10)}</td>
                <td><span class="communication-status ${statusClass}">${announcement.status || 'Draft'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" title="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="action-btn edit" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /* ============================================
       NOTICES MANAGEMENT
       ============================================ */

    function setupNoticesManagement() {
        // Add notice
        var addBtn = document.getElementById('addNoticeBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('noticesTableBody');
                if (!tbody) return;

                var today = new Date().toISOString().slice(0, 10);
                var future = new Date();
                future.setDate(future.getDate() + 30);
                var futureStr = future.toISOString().slice(0, 10);

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td>NTC-${Math.floor(Math.random() * 9000)}</td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Notice title" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="General">General</option>
                            <option value="Academic">Academic</option>
                            <option value="Exam">Exam</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Important">Important</option>
                        </select>
                    </td>
                    <td><input type="date" class="form-input form-input-sm" value="${today}" /></td>
                    <td><input type="date" class="form-input form-input-sm" value="${futureStr}" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn view" title="View">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                            <button class="action-btn edit" title="Save">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                            </button>
                            <button class="action-btn delete" title="Remove">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);

                setupRowActions(row, 'notice');
                showCommunicationNotification('New notice row added (Phase 1 demo)', 'info');
                updateCommunicationCounts();
            });
        }

        // Notice search
        var searchInput = document.getElementById('noticeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#noticesTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        // Notice filters
        var categoryFilter = document.getElementById('noticeCategoryFilter');
        var statusFilter = document.getElementById('noticeStatusFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyNoticeFilters);
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', applyNoticeFilters);
        }
    }

    function applyNoticeFilters() {
        var categoryFilter = document.getElementById('noticeCategoryFilter');
        var statusFilter = document.getElementById('noticeStatusFilter');

        var categoryVal = categoryFilter ? categoryFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#noticesTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (categoryVal) {
                var catCell = row.querySelector('td:nth-child(4)');
                var rowCat = catCell ? catCell.textContent.trim() : '';
                if (rowCat !== categoryVal) show = false;
            }

            if (statusVal && show) {
                var statusCell = row.querySelector('.communication-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    /* ============================================
       EVENTS MANAGEMENT
       ============================================ */

    function setupEventsManagement() {
        // Add event
        var addBtn = document.getElementById('addEventBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('eventsTableBody');
                if (!tbody) return;

                var today = new Date().toISOString().slice(0, 10);
                var future = new Date();
                future.setDate(future.getDate() + 7);
                var futureStr = future.toISOString().slice(0, 10);

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td>EVT-${Math.floor(Math.random() * 9000)}</td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Event name" /></td>
                    <td><input type="date" class="form-input form-input-sm" value="${today}" /></td>
                    <td><input type="date" class="form-input form-input-sm" value="${futureStr}" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Venue" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn view" title="View">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                            <button class="action-btn edit" title="Save">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                            </button>
                            <button class="action-btn delete" title="Remove">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);

                setupRowActions(row, 'event');
                showCommunicationNotification('New event row added (Phase 1 demo)', 'info');
                updateCommunicationCounts();
            });
        }

        // Event search
        var searchInput = document.getElementById('eventSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#eventsTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        // Event filters
        var statusFilter = document.getElementById('eventStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', applyEventFilters);
        }
    }

    function applyEventFilters() {
        var statusFilter = document.getElementById('eventStatusFilter');
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#eventsTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (statusVal) {
                var statusCell = row.querySelector('.communication-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    /* ============================================
       ANNOUNCEMENTS MANAGEMENT
       ============================================ */

    function setupAnnouncementsManagement() {
        // Add announcement
        var addBtn = document.getElementById('addAnnouncementBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('announcementsTableBody');
                if (!tbody) return;

                var today = new Date().toISOString().slice(0, 10);

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td>ANN-${Math.floor(Math.random() * 9000)}</td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Announcement title" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="All">All</option>
                            <option value="Students">Students</option>
                            <option value="Teachers">Teachers</option>
                            <option value="Staff">Staff</option>
                            <option value="Parents">Parents</option>
                        </select>
                    </td>
                    <td><input type="date" class="form-input form-input-sm" value="${today}" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn view" title="View">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                            <button class="action-btn edit" title="Save">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                            </button>
                            <button class="action-btn delete" title="Remove">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);

                setupRowActions(row, 'announcement');
                showCommunicationNotification('New announcement row added (Phase 1 demo)', 'info');
                updateCommunicationCounts();
            });
        }

        // Announcement search
        var searchInput = document.getElementById('announcementSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#announcementsTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        // Announcement filters
        var audienceFilter = document.getElementById('announcementAudienceFilter');
        var statusFilter = document.getElementById('announcementStatusFilter');

        if (audienceFilter) {
            audienceFilter.addEventListener('change', applyAnnouncementFilters);
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', applyAnnouncementFilters);
        }
    }

    function applyAnnouncementFilters() {
        var audienceFilter = document.getElementById('announcementAudienceFilter');
        var statusFilter = document.getElementById('announcementStatusFilter');

        var audienceVal = audienceFilter ? audienceFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#announcementsTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (audienceVal) {
                var audienceCell = row.querySelector('td:nth-child(4)');
                var rowAudience = audienceCell ? audienceCell.textContent.trim() : '';
                if (rowAudience !== audienceVal) show = false;
            }

            if (statusVal && show) {
                var statusCell = row.querySelector('.communication-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    /* ============================================
       ROW ACTIONS HELPER
       ============================================ */

    function setupRowActions(row, type) {
        // Delete button
        var deleteBtn = row.querySelector('.action-btn.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Remove this ' + type + '?')) {
                    row.remove();
                    showCommunicationNotification(type.charAt(0).toUpperCase() + type.slice(1) + ' removed (Phase 1 demo)', 'info');
                    updateCommunicationCounts();
                }
            });
        }

        // Save/Edit button
        var saveBtn = row.querySelector('.action-btn.edit');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                var inputs = row.querySelectorAll('input, select');
                var data = {};
                inputs.forEach(function(input) {
                    data[input.placeholder || input.id || 'field'] = input.value;
                });
                showCommunicationNotification(type.charAt(0).toUpperCase() + type.slice(1) + ' saved: ' + JSON.stringify(data), 'success');
                saveCommunicationData(type, data);
            });
        }

        // View button
        var viewBtn = row.querySelector('.action-btn.view');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                var title = row.querySelector('td:nth-child(3) input')?.value || row.querySelector('td:nth-child(3)')?.textContent || type;
                showCommunicationNotification('Viewing: ' + title, 'info');
            });
        }
    }

    /* ============================================
       SAVE COMMUNICATION DATA
       ============================================ */

    function saveCommunicationData(type, data) {
        var saved = localStorage.getItem('communication_data');
        var allData = saved ? JSON.parse(saved) : {};

        if (!allData[type + 's']) allData[type + 's'] = [];
        allData[type + 's'].push(data);

        localStorage.setItem('communication_data', JSON.stringify(allData));
        console.log('Communication data saved:', type, data);
    }

    /* ============================================
       CALENDAR MANAGEMENT
       ============================================ */

    function setupCalendarManagement() {
        // Initialize calendar view
        var calendarContainer = document.getElementById('calendarView');
        if (calendarContainer) {
            generateCalendar(calendarContainer);

            // Month navigation
            var prevBtn = document.getElementById('calendarPrev');
            var nextBtn = document.getElementById('calendarNext');

            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    navigateCalendar(-1);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    navigateCalendar(1);
                });
            }
        }

        // Load calendar events
        loadCalendarEvents();
    }

    var currentCalendarDate = new Date();

    function generateCalendar(container) {
        var year = currentCalendarDate.getFullYear();
        var month = currentCalendarDate.getMonth();

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];

        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        // Update header
        var monthYearEl = document.getElementById('calendarMonthYear');
        if (monthYearEl) {
            monthYearEl.textContent = monthNames[month] + ' ' + year;
        }

        var html = '<table class="calendar-table"><thead><tr>';
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(function(day) {
            html += '<th>' + day + '</th>';
        });
        html += '</tr></thead><tbody><tr>';

        // Empty cells for days before first day
        for (var i = 0; i < firstDay; i++) {
            html += '<td class="calendar-empty"></td>';
        }

        // Days of the month
        var today = new Date();
        var todayDate = today.getDate();
        var todayMonth = today.getMonth();
        var todayYear = today.getFullYear();

        for (var d = 1; d <= daysInMonth; d++) {
            var isToday = (d === todayDate && month === todayMonth && year === todayYear);
            var classNames = 'calendar-day';
            if (isToday) classNames += ' calendar-today';

            // Check if day has events
            var hasEvent = checkDayHasEvent(year, month, d);
            if (hasEvent) classNames += ' calendar-has-event';

            html += '<td class="' + classNames + '" data-date="' + year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0') + '">';
            html += '<span class="calendar-day-number">' + d + '</span>';
            if (hasEvent) {
                html += '<span class="calendar-event-dot"></span>';
            }
            html += '</td>';

            if ((firstDay + d) % 7 === 0 && d < daysInMonth) {
                html += '</tr><tr>';
            }
        }

        // Fill remaining cells
        var remainingCells = (7 - ((firstDay + daysInMonth) % 7)) % 7;
        for (var i = 0; i < remainingCells; i++) {
            html += '<td class="calendar-empty"></td>';
        }

        html += '</tr></tbody></table>';
        container.innerHTML = html;

        // Add click handlers to days
        var dayCells = container.querySelectorAll('.calendar-day:not(.calendar-empty)');
        dayCells.forEach(function(cell) {
            cell.addEventListener('click', function() {
                var date = this.getAttribute('data-date');
                if (date) {
                    showEventsForDate(date);
                }
            });
        });
    }

    function navigateCalendar(direction) {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
        var container = document.getElementById('calendarView');
        if (container) {
            generateCalendar(container);
        }
        loadCalendarEvents();
    }

    function checkDayHasEvent(year, month, day) {
        var saved = localStorage.getItem('communication_data');
        if (!saved) return false;

        try {
            var data = JSON.parse(saved);
            var events = data.events || [];

            var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');

            return events.some(function(event) {
                var start = event.startDate || '';
                var end = event.endDate || '';
                return (start <= dateStr && end >= dateStr) || start === dateStr;
            });
        } catch (e) {
            return false;
        }
    }

    function showEventsForDate(date) {
        var saved = localStorage.getItem('communication_data');
        if (!saved) {
            showCommunicationNotification('No events for ' + date, 'info');
            return;
        }

        try {
            var data = JSON.parse(saved);
            var events = data.events || [];
            var eventsOnDate = events.filter(function(event) {
                return event.startDate === date || (event.startDate <= date && event.endDate >= date);
            });

            if (eventsOnDate.length === 0) {
                showCommunicationNotification('No events on ' + date, 'info');
                return;
            }

            var message = 'Events on ' + date + ':\n';
            eventsOnDate.forEach(function(event, index) {
                message += (index + 1) + '. ' + event.title + ' (' + (event.venue || 'TBD') + ')\n';
            });
            alert(message);
        } catch (e) {
            console.log('Error showing events:', e);
        }
    }

    function loadCalendarEvents() {
        var saved = localStorage.getItem('communication_data');
        if (!saved) return;

        try {
            var data = JSON.parse(saved);
            var events = data.events || [];

            // Update event list on the page
            var eventList = document.getElementById('calendarEventList');
            if (eventList) {
                if (events.length === 0) {
                    eventList.innerHTML = '<p style="color:var(--text-muted);font-size:14px;">No upcoming events</p>';
                    return;
                }

                // Sort events by start date
                events.sort(function(a, b) {
                    return (a.startDate || '').localeCompare(b.startDate || '');
                });

                // Show next 5 events
                var html = '';
                var count = 0;
                var today = new Date().toISOString().slice(0, 10);

                events.forEach(function(event) {
                    if (count >= 5) return;
                    if (event.startDate >= today || !event.startDate) {
                        html += '<div class="event-item" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light);">';
                        html += '<span>' + (event.title || 'Untitled') + '</span>';
                        html += '<span style="font-size:12px;color:var(--text-muted);">' + (event.startDate || '') + '</span>';
                        html += '</div>';
                        count++;
                    }
                });

                if (count === 0) {
                    html = '<p style="color:var(--text-muted);font-size:14px;">No upcoming events</p>';
                }

                eventList.innerHTML = html;
            }
        } catch (e) {
            console.log('Error loading calendar events:', e);
        }
    }

    /* ============================================
       NOTICE BOARD (Public/Display)
       ============================================ */

    function setupNoticeBoard() {
        var noticeBoard = document.getElementById('noticeBoard');
        if (!noticeBoard) return;

        var saved = localStorage.getItem('communication_data');
        if (!saved) {
            noticeBoard.innerHTML = '<p style="color:var(--text-muted);">No notices available</p>';
            return;
        }

        try {
            var data = JSON.parse(saved);
            var notices = data.notices || [];

            // Filter published notices
            var published = notices.filter(function(n) {
                return n.status === 'Published';
            });

            if (published.length === 0) {
                noticeBoard.innerHTML = '<p style="color:var(--text-muted);">No published notices</p>';
                return;
            }

            // Sort by publish date (most recent first)
            published.sort(function(a, b) {
                return (b.publishDate || '').localeCompare(a.publishDate || '');
            });

            // Show latest 5
            var html = '';
            var count = 0;
            published.forEach(function(notice) {
                if (count >= 5) return;
                var categoryColors = {
                    'General': '#5d6d7e',
                    'Academic': '#2471a3',
                    'Exam': '#b9770e',
                    'Holiday': '#1e8449',
                    'Important': '#b03a2e'
                };
                var color = categoryColors[notice.category] || '#5d6d7e';
                html += '<div class="notice-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-light);">';
                html += '<div><span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:500;background:' + color + ';color:#fff;margin-right:8px;">' + (notice.category || 'General') + '</span>';
                html += '<span>' + (notice.title || 'Notice') + '</span></div>';
                html += '<span style="font-size:11px;color:var(--text-muted);">' + (notice.publishDate || '') + '</span>';
                html += '</div>';
                count++;
            });

            noticeBoard.innerHTML = html;

        } catch (e) {
            console.log('Error loading notice board:', e);
            noticeBoard.innerHTML = '<p style="color:var(--text-muted);">Error loading notices</p>';
        }
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showCommunicationNotification(message, type) {
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
