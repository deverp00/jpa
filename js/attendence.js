/* ============================================
   ATTENDANCE.JS
   Attendance Management JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Attendance Features -----
        initAttendanceFeatures();

        // ----- Student Attendance -----
        setupStudentAttendance();

        // ----- Staff Attendance -----
        setupStaffAttendance();

        // ----- Attendance Report -----
        setupAttendanceReport();

        // ----- Attendance Filters -----
        setupAttendanceFilters();

        // ----- Export Attendance -----
        setupAttendanceExport();
    });

    /* ============================================
       INITIALIZE ATTENDANCE FEATURES
       ============================================ */

    function initAttendanceFeatures() {
        // Update attendance counts
        updateAttendanceCounts();

        // Set default date for attendance
        setDefaultAttendanceDate();

        // Initialize attendance status badges
        initAttendanceBadges();
    }

    /* ============================================
       UPDATE ATTENDANCE COUNTS
       ============================================ */

    function updateAttendanceCounts() {
        var statValues = document.querySelectorAll('.attendance-stats .stat-value');
        if (statValues.length >= 3) {
            // Phase 1: Static demo values
            // In Phase 2, these will come from Firebase
            statValues[0].textContent = '92%';
            statValues[1].textContent = '138';
            statValues[2].textContent = '12';
        }

        // Update table pagination info
        var rows = document.querySelectorAll('#attendanceTableBody tr, #attendanceReportTableBody tr');
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
       SET DEFAULT ATTENDANCE DATE
       ============================================ */

    function setDefaultAttendanceDate() {
        var today = new Date().toISOString().split('T')[0];

        var dateInput = document.getElementById('attendanceDate');
        if (dateInput) dateInput.value = today;

        var fromDate = document.getElementById('fromDate');
        var toDate = document.getElementById('toDate');

        if (fromDate) {
            var firstDay = new Date();
            firstDay.setDate(1);
            fromDate.value = firstDay.toISOString().split('T')[0];
        }
        if (toDate) {
            toDate.value = today;
        }
    }

    /* ============================================
       INIT ATTENDANCE BADGES
       ============================================ */

    function initAttendanceBadges() {
        var statusCells = document.querySelectorAll('.attendance-status');
        statusCells.forEach(function(cell) {
            var status = cell.textContent.trim().toLowerCase();
            var colors = {
                present: { bg: '#d5f5e3', color: '#1e8449' },
                absent: { bg: '#fadbd8', color: '#b03a2e' },
                leave: { bg: '#fdebd0', color: '#b9770e' },
                holiday: { bg: '#d6eaf8', color: '#2471a3' }
            };

            var color = colors[status] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       STUDENT ATTENDANCE
       ============================================ */

    function setupStudentAttendance() {
        // Load students button
        var loadBtn = document.getElementById('loadStudentsBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', function() {
                var classSelect = document.getElementById('classSelect');
                var sectionSelect = document.getElementById('sectionSelect');

                if (!classSelect || !classSelect.value) {
                    showAttendanceNotification('Please select a class', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;

                setTimeout(function() {
                    var count = Math.floor(Math.random() * 30) + 5;
                    var grid = document.getElementById('attendanceGrid');
                    if (grid) {
                        var html = '';
                        html += '<div class="attendance-grid-header">';
                        html += '<span>Student Name</span>';
                        html += '<span>Class</span>';
                        html += '<span>Roll No</span>';
                        html += '<span>Status</span>';
                        html += '<span></span>';
                        html += '</div>';

                        var names = ['Aarav Sharma', 'Priya Das', 'Rohit Gogoi', 'Sneha Borah', 'Arjun Deka',
                                     'Ananya Bora', 'Rahul Talukdar', 'Maya Chetia', 'Krishna Saikia', 'Deepak Phukan',
                                     'Ravi Kumar', 'Sita Verma', 'Gopal Das', 'Lakshmi Nair', 'Suresh Reddy',
                                     'Meena Patel', 'Raj Singh', 'Pooja Gupta', 'Vikram Shah', 'Divya Menon'];

                        for (var i = 0; i < Math.min(count, names.length); i++) {
                            var roll = String(100 + i + 1);
                            var statuses = ['present', 'present', 'present', 'absent', 'present', 'leave', 'present'];
                            var defaultStatus = statuses[i % statuses.length];
                            var checked = defaultStatus === 'present' ? 'checked' : '';

                            html += '<div class="attendance-grid-row">';
                            html += '<span class="student-name">' + names[i] + '</span>';
                            html += '<span class="student-class">' + classSelect.value + (sectionSelect ? '-' + sectionSelect.value : '') + '</span>';
                            html += '<span>' + roll + '</span>';
                            html += '<div class="attendance-radio-group">';
                            html += '<label class="present"><input type="radio" name="attendance_' + i + '" value="present" ' + (defaultStatus === 'present' ? 'checked' : '') + '> P</label>';
                            html += '<label class="absent"><input type="radio" name="attendance_' + i + '" value="absent" ' + (defaultStatus === 'absent' ? 'checked' : '') + '> A</label>';
                            html += '<label class="leave"><input type="radio" name="attendance_' + i + '" value="leave" ' + (defaultStatus === 'leave' ? 'checked' : '') + '> L</label>';
                            html += '</div>';
                            html += '<span></span>';
                            html += '</div>';
                        }

                        grid.innerHTML = html;
                    }

                    loadBtn.textContent = 'Loaded ' + count + ' students';
                    loadBtn.disabled = false;

                    setTimeout(function() {
                        loadBtn.textContent = originalText;
                    }, 2000);

                    updateAttendanceStats(count);
                }, 800);
            });
        }

        // Save attendance button
        var saveBtn = document.getElementById('saveAttendanceBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                var rows = document.querySelectorAll('.attendance-grid-row');
                if (rows.length === 0) {
                    showAttendanceNotification('No attendance data to save. Please load students first.', 'warning');
                    return;
                }

                var present = 0;
                var absent = 0;
                var leave = 0;

                rows.forEach(function(row) {
                    var selected = row.querySelector('input[type="radio"]:checked');
                    if (selected) {
                        if (selected.value === 'present') present++;
                        else if (selected.value === 'absent') absent++;
                        else if (selected.value === 'leave') leave++;
                    }
                });

                var total = present + absent + leave;

                var originalText = this.textContent;
                this.textContent = 'Saving...';
                this.disabled = true;

                setTimeout(function() {
                    showAttendanceNotification('Attendance saved: ' + present + ' Present, ' + absent + ' Absent, ' + leave + ' Leave', 'success');
                    saveBtn.textContent = originalText;
                    saveBtn.disabled = false;

                    // Update stats
                    updateAttendanceStats(total, present, absent, leave);
                }, 1000);
            });
        }

        // Date change - update display
        var dateInput = document.getElementById('attendanceDate');
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                showAttendanceNotification('Date changed to ' + this.value + ' (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       UPDATE ATTENDANCE STATS
       ============================================ */

    function updateAttendanceStats(total, present, absent, leave) {
        if (!total) {
            total = Math.floor(Math.random() * 30) + 5;
            present = Math.floor(Math.random() * (total - 5));
            absent = Math.floor(Math.random() * 5);
            leave = total - present - absent;
        }

        var statValues = document.querySelectorAll('.attendance-stats .stat-value');
        if (statValues.length >= 3) {
            var percent = Math.round((present / total) * 100);
            statValues[0].textContent = percent + '%';
            statValues[1].textContent = present;
            statValues[2].textContent = absent;

            // Update progress bar
            var progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = percent + '%';
            }
        }
    }

    /* ============================================
       STAFF ATTENDANCE
       ============================================ */

    function setupStaffAttendance() {
        // Load staff button
        var loadBtn = document.getElementById('loadStaffBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', function() {
                var deptSelect = document.getElementById('staffDeptSelect');

                var originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;

                setTimeout(function() {
                    var count = Math.floor(Math.random() * 15) + 5;
                    var grid = document.getElementById('staffAttendanceGrid');
                    if (grid) {
                        var html = '';
                        html += '<div class="attendance-grid-header staff-attendance-grid">';
                        html += '<span>Staff Name</span>';
                        html += '<span>Department</span>';
                        html += '<span>Status</span>';
                        html += '<span></span>';
                        html += '</div>';

                        var names = ['Dr. Anupama Sarma', 'Mr. Rajib Bordoloi', 'Ms. Purabi Deka',
                                     'Dr. Monika Das', 'Mr. Sanjay Pathak', 'Ms. Ritu Baruah',
                                     'Dr. Anil Kumar', 'Mr. Bikash Gogoi', 'Ms. Swapna Saikia'];

                        var depts = ['Science', 'Mathematics', 'English', 'Social Studies', 'Computer Science',
                                     'Science', 'Mathematics', 'Social Studies', 'English'];

                        for (var i = 0; i < Math.min(count, names.length); i++) {
                            var statuses = ['present', 'present', 'present', 'absent', 'present', 'leave'];
                            var defaultStatus = statuses[i % statuses.length];

                            html += '<div class="attendance-grid-row">';
                            html += '<span class="student-name">' + names[i] + '</span>';
                            html += '<span>' + (depts[i % depts.length]) + '</span>';
                            html += '<div class="attendance-radio-group">';
                            html += '<label class="present"><input type="radio" name="staff_attendance_' + i + '" value="present" ' + (defaultStatus === 'present' ? 'checked' : '') + '> P</label>';
                            html += '<label class="absent"><input type="radio" name="staff_attendance_' + i + '" value="absent" ' + (defaultStatus === 'absent' ? 'checked' : '') + '> A</label>';
                            html += '<label class="leave"><input type="radio" name="staff_attendance_' + i + '" value="leave" ' + (defaultStatus === 'leave' ? 'checked' : '') + '> L</label>';
                            html += '</div>';
                            html += '<span></span>';
                            html += '</div>';
                        }

                        grid.innerHTML = html;
                    }

                    loadBtn.textContent = 'Loaded ' + count + ' staff members';
                    loadBtn.disabled = false;

                    setTimeout(function() {
                        loadBtn.textContent = originalText;
                    }, 2000);
                }, 800);
            });
        }

        // Save staff attendance
        var saveBtn = document.getElementById('saveStaffAttendanceBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                var rows = document.querySelectorAll('.staff-attendance-grid .attendance-grid-row');
                if (rows.length === 0) {
                    showAttendanceNotification('No attendance data to save. Please load staff first.', 'warning');
                    return;
                }

                var present = 0;
                var absent = 0;
                var leave = 0;

                rows.forEach(function(row) {
                    var selected = row.querySelector('input[type="radio"]:checked');
                    if (selected) {
                        if (selected.value === 'present') present++;
                        else if (selected.value === 'absent') absent++;
                        else if (selected.value === 'leave') leave++;
                    }
                });

                var originalText = this.textContent;
                this.textContent = 'Saving...';
                this.disabled = true;

                setTimeout(function() {
                    showAttendanceNotification('Staff attendance saved: ' + present + ' Present, ' + absent + ' Absent, ' + leave + ' Leave', 'success');
                    saveBtn.textContent = originalText;
                    saveBtn.disabled = false;

                    // Update stats
                    var total = present + absent + leave;
                    var statValues = document.querySelectorAll('.attendance-stats .stat-value');
                    if (statValues.length >= 3) {
                        var percent = Math.round((present / total) * 100);
                        statValues[0].textContent = percent + '%';
                    }
                }, 1000);
            });
        }
    }

    /* ============================================
       ATTENDANCE REPORT
       ============================================ */

    function setupAttendanceReport() {
        // Generate report button
        var generateBtn = document.getElementById('generateReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                var classFilter = document.getElementById('reportClassFilter');
                var monthFilter = document.getElementById('reportMonthFilter');

                if (!classFilter || !classFilter.value) {
                    showAttendanceNotification('Please select a class to generate report', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Generating...';
                this.disabled = true;

                setTimeout(function() {
                    var tbody = document.getElementById('attendanceReportTableBody');
                    if (tbody) {
                        var html = '';
                        var names = ['Aarav Sharma', 'Priya Das', 'Rohit Gogoi', 'Sneha Borah', 'Arjun Deka',
                                     'Ananya Bora', 'Rahul Talukdar', 'Maya Chetia'];

                        for (var i = 0; i < names.length; i++) {
                            var present = Math.floor(Math.random() * 20) + 10;
                            var total = 22;
                            var percent = Math.round((present / total) * 100);
                            var status = percent >= 75 ? 'high' : (percent >= 50 ? 'medium' : 'low');

                            html += '<tr>';
                            html += '<td>' + names[i] + '</td>';
                            html += '<td>' + classFilter.value + '</td>';
                            html += '<td>' + present + '</td>';
                            html += '<td>' + (total - present) + '</td>';
                            html += '<td><span class="att-percent ' + status + '">' + percent + '%</span></td>';
                            html += '<td>';
                            html += '<div class="attendance-bar"><div class="bar-fill ' + status + '" style="width:' + percent + '%;"></div><span class="bar-label">' + percent + '%</span></div>';
                            html += '</td>';
                            html += '</tr>';
                        }

                        tbody.innerHTML = html;
                    }

                    generateBtn.textContent = 'Report Generated';
                    generateBtn.disabled = false;

                    setTimeout(function() {
                        generateBtn.textContent = originalText;
                    }, 2000);

                    showAttendanceNotification('Attendance report generated successfully', 'success');
                }, 1200);
            });
        }

        // Export report buttons
        var exportPdf = document.getElementById('exportReportPdfBtn');
        var exportExcel = document.getElementById('exportReportExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                showAttendanceNotification('PDF export initiated (Phase 1 demo)', 'info');
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showAttendanceNotification('Excel export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       ATTENDANCE FILTERS
       ============================================ */

    function setupAttendanceFilters() {
        var classFilter = document.getElementById('attendanceClassFilter');
        var statusFilter = document.getElementById('attendanceStatusFilter');

        if (!classFilter && !statusFilter) return;

        var filters = [classFilter, statusFilter].filter(Boolean);

        filters.forEach(function(filter) {
            filter.addEventListener('change', applyAttendanceFilters);
        });
    }

    function applyAttendanceFilters() {
        var classFilter = document.getElementById('attendanceClassFilter');
        var statusFilter = document.getElementById('attendanceStatusFilter');

        var classVal = classFilter ? classFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#attendanceTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (classVal) {
                var classCell = row.querySelector('td:nth-child(3)');
                var rowClass = classCell ? classCell.textContent.trim() : '';
                if (rowClass !== classVal) show = false;
            }

            if (statusVal && show) {
                var statusCell = row.querySelector('.attendance-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    /* ============================================
       ATTENDANCE EXPORT
       ============================================ */

    function setupAttendanceExport() {
        var exportPdf = document.getElementById('exportAttendancePdfBtn');
        var exportExcel = document.getElementById('exportAttendanceExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                showAttendanceNotification('Attendance PDF export initiated (Phase 1 demo)', 'info');
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showAttendanceNotification('Attendance Excel export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showAttendanceNotification(message, type) {
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
