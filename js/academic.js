/* ============================================
   ACADEMIC.JS
   Academic Management JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Academic Features -----
        initAcademicFeatures();

        // ----- Class Management -----
        setupClassManagement();

        // ----- Section Management -----
        setupSectionManagement();

        // ----- Subject Management -----
        setupSubjectManagement();

        // ----- Academic Session -----
        setupAcademicSession();

        // ----- Timetable Management -----
        setupTimetableManagement();

        // ----- Examination Management -----
        setupExaminationManagement();

        // ----- Results Management -----
        setupResultsManagement();

        // ----- Report Card Management -----
        setupReportCardManagement();
    });

    /* ============================================
       INITIALIZE ACADEMIC FEATURES
       ============================================ */

    function initAcademicFeatures() {
        // Update academic counts
        updateAcademicCounts();

        // Set default dates
        setDefaultAcademicDates();

        // Initialize academic status badges
        initAcademicBadges();

        // Load saved academic data from localStorage (Phase 1 demo)
        loadAcademicData();
    }

    /* ============================================
       UPDATE ACADEMIC COUNTS
       ============================================ */

    function updateAcademicCounts() {
        var statValues = document.querySelectorAll('.academic-stats .stat-value');
        if (statValues.length >= 3) {
            // Phase 1: Static demo values
            statValues[0].textContent = '12';
            statValues[1].textContent = '36';
            statValues[2].textContent = '8';
        }

        // Update table pagination info
        var rows = document.querySelectorAll('#classesTableBody tr, #subjectsTableBody tr, #examsTableBody tr, #resultsTableBody tr');
        var totalRows = rows.length;

        var infoEl = document.querySelector('.table-info');
        if (infoEl) {
            var strongTags = infoEl.querySelectorAll('strong');
            if (strongTags.length >= 3) {
                strongTags[0].textContent = totalRows > 0 ? '1' : '0';
                strongTags[1].textContent = totalRows;
                strongTags[2].textContent = totalRows;
            }
        }
    }

    /* ============================================
       SET DEFAULT ACADEMIC DATES
       ============================================ */

    function setDefaultAcademicDates() {
        var today = new Date().toISOString().split('T')[0];

        // Session dates
        var sessionStart = document.getElementById('sessionStart');
        var sessionEnd = document.getElementById('sessionEnd');

        if (sessionStart) {
            var startDate = new Date();
            startDate.setMonth(3); // April
            startDate.setDate(1);
            sessionStart.value = startDate.toISOString().split('T')[0];
        }
        if (sessionEnd) {
            var endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 1);
            endDate.setMonth(2); // March
            endDate.setDate(31);
            sessionEnd.value = endDate.toISOString().split('T')[0];
        }

        // Exam dates
        var examStart = document.getElementById('examStartDate');
        var examEnd = document.getElementById('examEndDate');

        if (examStart) {
            var start = new Date();
            start.setDate(start.getDate() + 14);
            examStart.value = start.toISOString().split('T')[0];
        }
        if (examEnd) {
            var end = new Date();
            end.setDate(end.getDate() + 21);
            examEnd.value = end.toISOString().split('T')[0];
        }
    }

    /* ============================================
       INIT ACADEMIC BADGES
       ============================================ */

    function initAcademicBadges() {
        var statusCells = document.querySelectorAll('.academic-status');
        statusCells.forEach(function(cell) {
            var status = cell.textContent.trim().toLowerCase();
            var colors = {
                active: { bg: '#d5f5e3', color: '#1e8449' },
                completed: { bg: '#d6eaf8', color: '#2471a3' },
                upcoming: { bg: '#fdebd0', color: '#b9770e' },
                ongoing: { bg: '#e8daef', color: '#7d3c98' }
            };

            var color = colors[status] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       LOAD ACADEMIC DATA
       ============================================ */

    function loadAcademicData() {
        var saved = localStorage.getItem('academic_data');
        if (saved) {
            try {
                var data = JSON.parse(saved);
                console.log('Academic data loaded from localStorage:', data);
            } catch (e) {
                console.log('Error loading academic data:', e);
            }
        }
    }

    /* ============================================
       CLASS MANAGEMENT
       ============================================ */

    function setupClassManagement() {
        // Add class
        var addBtn = document.getElementById('addClassBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('classesTableBody');
                if (!tbody) return;

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Class name (e.g., 10)" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </td>
                    <td><input type="number" class="form-input form-input-sm" placeholder="Max students" value="40" /></td>
                    <td><span class="status-badge active">Active</span></td>
                    <td>
                        <div class="action-btns">
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

                var deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Remove this class?')) {
                        row.remove();
                        showAcademicNotification('Class removed (Phase 1 demo)', 'info');
                        updateAcademicCounts();
                    }
                });

                var saveBtn = row.querySelector('.action-btn.edit');
                saveBtn.addEventListener('click', function() {
                    var inputs = row.querySelectorAll('input, select');
                    var classData = {};
                    inputs.forEach(function(input) {
                        classData[input.placeholder || input.id || 'field'] = input.value;
                    });
                    showAcademicNotification('Class saved: ' + JSON.stringify(classData), 'success');
                    // Save to localStorage
                    saveAcademicData('classes', classData);
                });

                showAcademicNotification('New class row added (Phase 1 demo)', 'info');
                updateAcademicCounts();
            });
        }

        // Delete selected classes
        var deleteSelectedBtn = document.getElementById('deleteSelectedClassesBtn');
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', function() {
                var selected = document.querySelectorAll('#classesTableBody .row-checkbox:checked');
                if (selected.length === 0) {
                    showAcademicNotification('Please select classes to delete', 'warning');
                    return;
                }

                if (confirm('Delete ' + selected.length + ' selected class(es)?')) {
                    selected.forEach(function(cb) {
                        var row = cb.closest('tr');
                        if (row) row.remove();
                    });
                    showAcademicNotification(selected.length + ' class(es) deleted (Phase 1 demo)', 'success');
                    updateAcademicCounts();
                }
            });
        }

        // Class search
        var searchInput = document.getElementById('classSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#classesTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    }

    /* ============================================
       SECTION MANAGEMENT
       ============================================ */

    function setupSectionManagement() {
        // Add section
        var addBtn = document.getElementById('addSectionBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('sectionsTableBody');
                if (!tbody) return;

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Section name (e.g., A)" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                        </select>
                    </td>
                    <td><input type="number" class="form-input form-input-sm" placeholder="Max students" value="40" /></td>
                    <td><span class="status-badge active">Active</span></td>
                    <td>
                        <div class="action-btns">
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

                var deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Remove this section?')) {
                        row.remove();
                        showAcademicNotification('Section removed (Phase 1 demo)', 'info');
                        updateAcademicCounts();
                    }
                });

                var saveBtn = row.querySelector('.action-btn.edit');
                saveBtn.addEventListener('click', function() {
                    var inputs = row.querySelectorAll('input, select');
                    var sectionData = {};
                    inputs.forEach(function(input) {
                        sectionData[input.placeholder || input.id || 'field'] = input.value;
                    });
                    showAcademicNotification('Section saved: ' + JSON.stringify(sectionData), 'success');
                    saveAcademicData('sections', sectionData);
                });

                showAcademicNotification('New section row added (Phase 1 demo)', 'info');
                updateAcademicCounts();
            });
        }

        // Section search
        var searchInput = document.getElementById('sectionSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#sectionsTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    }

    /* ============================================
       SUBJECT MANAGEMENT
       ============================================ */

    function setupSubjectManagement() {
        // Add subject
        var addBtn = document.getElementById('addSubjectBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('subjectsTableBody');
                if (!tbody) return;

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Subject name" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Subject code" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="science">Science</option>
                            <option value="math">Mathematics</option>
                            <option value="english">English</option>
                            <option value="social">Social Studies</option>
                            <option value="computer">Computer Science</option>
                            <option value="other">Other</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-btns">
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

                var deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Remove this subject?')) {
                        row.remove();
                        showAcademicNotification('Subject removed (Phase 1 demo)', 'info');
                        updateAcademicCounts();
                    }
                });

                var saveBtn = row.querySelector('.action-btn.edit');
                saveBtn.addEventListener('click', function() {
                    var inputs = row.querySelectorAll('input, select');
                    var subjectData = {};
                    inputs.forEach(function(input) {
                        subjectData[input.placeholder || input.id || 'field'] = input.value;
                    });
                    showAcademicNotification('Subject saved: ' + JSON.stringify(subjectData), 'success');
                    saveAcademicData('subjects', subjectData);
                });

                showAcademicNotification('New subject row added (Phase 1 demo)', 'info');
                updateAcademicCounts();
            });
        }

        // Subject search
        var searchInput = document.getElementById('subjectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#subjectsTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    }

    /* ============================================
       ACADEMIC SESSION
       ============================================ */

    function setupAcademicSession() {
        var form = document.getElementById('sessionForm');
        if (!form) return;

        var saveBtn = form.querySelector('[type="submit"]');

        // Load session data
        var savedSession = localStorage.getItem('academic_session');
        if (savedSession) {
            try {
                var session = JSON.parse(savedSession);
                for (var key in session) {
                    var input = document.getElementById(key);
                    if (input) {
                        input.value = session[key];
                    }
                }
            } catch (e) {
                console.log('Error loading session:', e);
            }
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var sessionData = {};
            var inputs = form.querySelectorAll('input');
            inputs.forEach(function(input) {
                var id = input.id;
                if (id) {
                    sessionData[id] = input.value;
                }
            });

            localStorage.setItem('academic_session', JSON.stringify(sessionData));

            var originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;

            setTimeout(function() {
                saveBtn.textContent = 'Saved!';
                saveBtn.disabled = false;
                showAcademicNotification('Academic session saved successfully', 'success');

                // Update header session display
                var sessionEl = document.getElementById('academicSession');
                if (sessionEl && sessionData.sessionName) {
                    sessionEl.textContent = sessionData.sessionName;
                }

                setTimeout(function() {
                    saveBtn.textContent = originalText;
                }, 1500);
            }, 800);
        });

        // Set current session button
        var setCurrentBtn = document.getElementById('setCurrentSessionBtn');
        if (setCurrentBtn) {
            setCurrentBtn.addEventListener('click', function() {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth();
                var startYear = (month >= 3) ? year : year - 1;
                var endYear = startYear + 1;

                var sessionName = document.getElementById('sessionName');
                var sessionStart = document.getElementById('sessionStart');
                var sessionEnd = document.getElementById('sessionEnd');

                if (sessionName) sessionName.value = startYear + '-' + endYear;
                if (sessionStart) {
                    var start = new Date(startYear, 3, 1);
                    sessionStart.value = start.toISOString().split('T')[0];
                }
                if (sessionEnd) {
                    var end = new Date(endYear, 2, 31);
                    sessionEnd.value = end.toISOString().split('T')[0];
                }

                showAcademicNotification('Current session set: ' + startYear + '-' + endYear, 'info');
            });
        }
    }

    /* ============================================
       TIMETABLE MANAGEMENT
       ============================================ */

    function setupTimetableManagement() {
        // Load timetable data
        var loadBtn = document.getElementById('loadTimetableBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', function() {
                var classSelect = document.getElementById('timetableClass');
                if (!classSelect || !classSelect.value) {
                    showAcademicNotification('Please select a class', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;

                setTimeout(function() {
                    var table = document.getElementById('timetableTable');
                    if (table) {
                        var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var periods = ['09:00-09:45', '09:45-10:30', '10:30-11:15', '11:15-12:00', '12:00-01:00', '01:00-01:45', '01:45-02:30', '02:30-03:15'];
                        var subjects = ['Physics', 'Chemistry', 'Mathematics', 'English', 'Biology', 'Computer Science', 'History', 'Geography'];

                        var html = '<thead><tr><th>Day / Period</th>';
                        periods.forEach(function(p) {
                            html += '<th>' + p + '</th>';
                        });
                        html += '</tr></thead><tbody>';

                        days.forEach(function(day, dayIndex) {
                            html += '<tr><td><strong>' + day + '</strong></td>';
                            for (var i = 0; i < periods.length; i++) {
                                var subjectIndex = (dayIndex * periods.length + i) % subjects.length;
                                var teacher = ['Dr. Sarma', 'Mr. Bordoloi', 'Ms. Deka', 'Dr. Das', 'Mr. Pathak', 'Ms. Baruah'][subjectIndex % 6];
                                html += '<td>';
                                html += '<span class="period-subject">' + subjects[subjectIndex] + '</span><br>';
                                html += '<span class="period-teacher">' + teacher + '</span>';
                                html += '</td>';
                            }
                            html += '</tr>';
                        });

                        html += '</tbody>';
                        table.innerHTML = html;

                        // Show timetable summary
                        var infoEl = document.getElementById('timetableInfo');
                        if (infoEl) {
                            infoEl.textContent = 'Showing timetable for Class ' + classSelect.value + ' | Total Periods: ' + (days.length * periods.length);
                        }
                    }

                    loadBtn.textContent = 'Timetable Loaded';
                    loadBtn.disabled = false;

                    setTimeout(function() {
                        loadBtn.textContent = originalText;
                    }, 2000);

                    showAcademicNotification('Timetable loaded for Class ' + classSelect.value, 'success');
                }, 800);
            });
        }

        // Export timetable
        var exportBtn = document.getElementById('exportTimetableBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                var table = document.getElementById('timetableTable');
                if (table) {
                    exportToPdf(table, 'Timetable');
                } else {
                    showAcademicNotification('No timetable data to export', 'warning');
                }
            });
        }
    }

    /* ============================================
       EXAMINATION MANAGEMENT
       ============================================ */

    function setupExaminationManagement() {
        // Add exam
        var addBtn = document.getElementById('addExamBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.getElementById('examsTableBody');
                if (!tbody) return;

                var row = document.createElement('tr');
                var today = new Date().toISOString().slice(0, 10);
                var future = new Date();
                future.setDate(future.getDate() + 30);
                var futureStr = future.toISOString().slice(0, 10);

                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Exam name" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                        </select>
                    </td>
                    <td><input type="date" class="form-input form-input-sm" value="${today}" /></td>
                    <td><input type="date" class="form-input form-input-sm" value="${futureStr}" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-btns">
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

                var deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Remove this exam?')) {
                        row.remove();
                        showAcademicNotification('Exam removed (Phase 1 demo)', 'info');
                        updateAcademicCounts();
                    }
                });

                var saveBtn = row.querySelector('.action-btn.edit');
                saveBtn.addEventListener('click', function() {
                    var inputs = row.querySelectorAll('input, select');
                    var examData = {};
                    inputs.forEach(function(input) {
                        examData[input.placeholder || input.id || 'field'] = input.value;
                    });
                    showAcademicNotification('Exam saved: ' + JSON.stringify(examData), 'success');
                    saveAcademicData('exams', examData);
                });

                showAcademicNotification('New exam row added (Phase 1 demo)', 'info');
                updateAcademicCounts();
            });
        }

        // Exam search
        var searchInput = document.getElementById('examSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#examsTableBody tr');
                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        // Export exam schedule
        var exportBtn = document.getElementById('exportExamScheduleBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                showAcademicNotification('Exam schedule export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       RESULTS MANAGEMENT
       ============================================ */

    function setupResultsManagement() {
        // Generate results
        var generateBtn = document.getElementById('generateResultsBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                var examSelect = document.getElementById('resultExam');
                var classSelect = document.getElementById('resultClass');

                if (!examSelect || !examSelect.value) {
                    showAcademicNotification('Please select an exam', 'warning');
                    return;
                }
                if (!classSelect || !classSelect.value) {
                    showAcademicNotification('Please select a class', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Generating...';
                this.disabled = true;

                setTimeout(function() {
                    var tbody = document.getElementById('resultsTableBody');
                    if (tbody) {
                        var html = '';
                        var names = ['Aarav Sharma', 'Priya Das', 'Rohit Gogoi', 'Sneha Borah', 'Arjun Deka',
                                     'Ananya Bora', 'Rahul Talukdar', 'Maya Chetia', 'Krishna Saikia', 'Deepak Phukan'];

                        names.forEach(function(name, index) {
                            var total = Math.floor(Math.random() * 100) + 300;
                            var percent = Math.round((total / 500) * 100);
                            var grade = percent >= 90 ? 'A' : (percent >= 75 ? 'B' : (percent >= 60 ? 'C' : (percent >= 45 ? 'D' : 'F')));
                            var rank = index + 1;
                            var status = percent >= 45 ? 'Pass' : 'Fail';

                            html += '<tr>';
                            html += '<td>' + rank + '</td>';
                            html += '<td>' + name + '</td>';
                            html += '<td>' + classSelect.value + '</td>';
                            html += '<td>' + total + '</td>';
                            html += '<td><span class="result-percent ' + (percent >= 75 ? 'excellent' : (percent >= 60 ? 'good' : (percent >= 45 ? 'average' : 'poor'))) + '">' + percent + '%</span></td>';
                            html += '<td><span class="grade-badge ' + grade + '">' + grade + '</span></td>';
                            html += '<td><span class="status-badge ' + (status === 'Pass' ? 'active' : 'inactive') + '">' + status + '</span></td>';
                            html += '</tr>';
                        });

                        tbody.innerHTML = html;
                    }

                    generateBtn.textContent = 'Results Generated';
                    generateBtn.disabled = false;

                    setTimeout(function() {
                        generateBtn.textContent = originalText;
                    }, 2000);

                    showAcademicNotification('Results generated successfully', 'success');
                }, 1200);
            });
        }

        // Export results
        var exportPdf = document.getElementById('exportResultsPdfBtn');
        var exportExcel = document.getElementById('exportResultsExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                var table = document.getElementById('resultsTable');
                if (table) {
                    exportToPdf(table, 'Results Report');
                } else {
                    showAcademicNotification('No results data to export', 'warning');
                }
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                var table = document.getElementById('resultsTable');
                if (table) {
                    exportToExcel(table, 'Results Report');
                } else {
                    showAcademicNotification('No results data to export', 'warning');
                }
            });
        }
    }

    /* ============================================
       REPORT CARD MANAGEMENT
       ============================================ */

    function setupReportCardManagement() {
        // Generate report card
        var generateBtn = document.getElementById('generateReportCardBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                var studentSelect = document.getElementById('reportCardStudent');
                var examSelect = document.getElementById('reportCardExam');

                if (!studentSelect || !studentSelect.value) {
                    showAcademicNotification('Please select a student', 'warning');
                    return;
                }

                if (!examSelect || !examSelect.value) {
                    showAcademicNotification('Please select an exam', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Generating...';
                this.disabled = true;

                setTimeout(function() {
                    var report = document.getElementById('reportCardPreview');
                    if (report) {
                        var studentName = studentSelect.options[studentSelect.selectedIndex]?.text || 'Student';
                        var examName = examSelect.options[examSelect.selectedIndex]?.text || 'Exam';

                        // Update student info
                        var nameEl = report.querySelector('.info-value');
                        if (nameEl) {
                            var infoItems = report.querySelectorAll('.info-item');
                            if (infoItems.length >= 3) {
                                infoItems[0].querySelector('.info-value').textContent = studentName;
                                infoItems[1].querySelector('.info-value').textContent = 'Class 10-A';
                                infoItems[2].querySelector('.info-value').textContent = examName;
                            }
                        }

                        // Generate random marks
                        var subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Hindi'];
                        var marksBody = report.querySelector('.report-body table tbody');
                        if (marksBody) {
                            var html = '';
                            var totalMarks = 0;
                            subjects.forEach(function(subject) {
                                var marks = Math.floor(Math.random() * 50) + 50;
                                var grade = marks >= 90 ? 'A' : (marks >= 75 ? 'B' : (marks >= 60 ? 'C' : (marks >= 45 ? 'D' : 'F')));
                                totalMarks += marks;
                                html += '<tr><td>' + subject + '</td><td>100</td><td>' + marks + '</td><td><span class="grade-badge ' + grade + '">' + grade + '</span></td></tr>';
                            });
                            marksBody.innerHTML = html;

                            // Update summary
                            var summaryItems = report.querySelectorAll('.summary-value');
                            if (summaryItems.length >= 3) {
                                var percent = Math.round((totalMarks / 600) * 100);
                                summaryItems[0].textContent = totalMarks + '/600';
                                summaryItems[1].textContent = percent + '%';
                                summaryItems[2].textContent = percent >= 75 ? 'A' : (percent >= 60 ? 'B' : (percent >= 45 ? 'C' : 'D'));
                            }
                        }

                        // Update report card title
                        var titleEl = report.querySelector('.report-title');
                        if (titleEl) {
                            titleEl.textContent = examName + ' - Report Card';
                        }

                        // Show the report card section
                        var previewContainer = document.getElementById('reportCardPreviewContainer');
                        if (previewContainer) {
                            previewContainer.style.display = 'block';
                        }
                    }

                    generateBtn.textContent = 'Report Card Generated';
                    generateBtn.disabled = false;

                    setTimeout(function() {
                        generateBtn.textContent = originalText;
                    }, 2000);

                    showAcademicNotification('Report card generated successfully', 'success');
                }, 1200);
            });
        }

        // Print report card
        var printBtn = document.getElementById('printReportCardBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                var report = document.getElementById('reportCardPreview');
                if (report) {
                    var printWindow = window.open('', '_blank', 'width=900,height=700');
                    if (printWindow) {
                        var content = report.cloneNode(true);
                        printWindow.document.write('<html><head><title>Report Card</title>');
                        printWindow.document.write('<style>');
                        printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
                        printWindow.document.write('.report-card { max-width: 900px; margin: 0 auto; border: 1px solid #000; border-radius: 6px; padding: 24px; }');
                        printWindow.document.write('.report-header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid #2c3e50; }');
                        printWindow.document.write('.institution-name { font-size: 24px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.institution-address { font-size: 13px; color: #95a5a6; }');
                        printWindow.document.write('.report-title { font-size: 20px; font-weight: bold; margin-top: 8px; }');
                        printWindow.document.write('.report-student-info { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 12px; background: #f8f9fa; border-radius: 4px; margin: 12px 0; }');
                        printWindow.document.write('.info-item { font-size: 13px; }');
                        printWindow.document.write('.info-label { color: #95a5a6; }');
                        printWindow.document.write('.info-value { font-weight: 500; }');
                        printWindow.document.write('table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }');
                        printWindow.document.write('table thead th { background: #f8f9fa; padding: 8px 10px; text-align: left; border: 1px solid #e5e8e8; }');
                        printWindow.document.write('table tbody td { padding: 6px 10px; border: 1px solid #e5e8e8; }');
                        printWindow.document.write('.report-summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 12px; background: #f8f9fa; border-radius: 4px; margin: 12px 0; }');
                        printWindow.document.write('.summary-item { text-align: center; }');
                        printWindow.document.write('.summary-value { display: block; font-size: 18px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.summary-label { font-size: 11px; color: #95a5a6; }');
                        printWindow.document.write('.report-footer { text-align: center; padding-top: 16px; border-top: 1px solid #e5e8e8; margin-top: 16px; }');
                        printWindow.document.write('.signature-line { width: 150px; border-top: 1px solid #000; margin: 8px auto 0; }');
                        printWindow.document.write('.signature-label { font-size: 11px; color: #95a5a6; }');
                        printWindow.document.write('.grade-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; }');
                        printWindow.document.write('.grade-badge.A { background: #d5f5e3; color: #1e8449; }');
                        printWindow.document.write('.grade-badge.B { background: #d6eaf8; color: #2471a3; }');
                        printWindow.document.write('.grade-badge.C { background: #fdebd0; color: #b9770e; }');
                        printWindow.document.write('.grade-badge.D { background: #fadbd8; color: #b03a2e; }');
                        printWindow.document.write('.grade-badge.F { background: #f0f0f0; color: #5d6d7e; }');
                        printWindow.document.write('</style>');
                        printWindow.document.write('</head><body>');
                        printWindow.document.write(content.innerHTML);
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();

                        setTimeout(function() {
                            printWindow.print();
                        }, 500);
                    }
                }
            });
        }

        // Download report card
        var downloadBtn = document.getElementById('downloadReportCardBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showAcademicNotification('Report card download will be available in Phase 2 (PDF generation)', 'info');
            });
        }

        // Hide preview initially
        var previewContainer = document.getElementById('reportCardPreviewContainer');
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
    }

    /* ============================================
       SAVE ACADEMIC DATA
       ============================================ */

    function saveAcademicData(type, data) {
        var saved = localStorage.getItem('academic_data');
        var allData = saved ? JSON.parse(saved) : {};

        if (!allData[type]) allData[type] = [];
        allData[type].push(data);

        localStorage.setItem('academic_data', JSON.stringify(allData));
        console.log('Academic data saved:', type, data);
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showAcademicNotification(message, type) {
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
