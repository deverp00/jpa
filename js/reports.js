/* ============================================
   REPORTS.JS
   Reports Generation & Export JavaScript
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Report Features -----
        initReportFeatures();

        // ----- Generate Reports -----
        setupReportGeneration();

        // ----- Report Filters -----
        setupReportFilters();

        // ----- Export Reports -----
        setupReportExport();

        // ----- Report Charts -----
        setupReportCharts();

        // ----- Quick Report Cards -----
        setupQuickReports();
    });

    /* ============================================
       INITIALIZE REPORT FEATURES
       ============================================ */

    function initReportFeatures() {
        // Update report counts
        updateReportCounts();

        // Set default dates for reports
        setDefaultReportDates();

        // Initialize report type cards
        initReportCards();
    }

    /* ============================================
       UPDATE REPORT COUNTS
       ============================================ */

    function updateReportCounts() {
        var statValues = document.querySelectorAll('.report-stats .stat-value');
        if (statValues.length >= 3) {
            // Phase 1: Static demo values
            statValues[0].textContent = '1,247';
            statValues[1].textContent = '₹4,85,200';
            statValues[2].textContent = '92%';
        }
    }

    /* ============================================
       SET DEFAULT REPORT DATES
       ============================================ */

    function setDefaultReportDates() {
        var today = new Date().toISOString().split('T')[0];

        var fromDate = document.getElementById('reportFromDate');
        var toDate = document.getElementById('reportToDate');

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
       INIT REPORT CARDS
       ============================================ */

    function initReportCards() {
        var reportCards = document.querySelectorAll('.report-type-card');
        reportCards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                var reportName = this.querySelector('.report-name')?.textContent || 'Report';
                showReportNotification('Generating ' + reportName + '... (Phase 1 demo)', 'info');

                // Simulate loading
                setTimeout(function() {
                    showReportNotification(reportName + ' generated successfully', 'success');
                }, 1200);
            });
        });
    }

    /* ============================================
       GENERATE REPORTS
       ============================================ */

    function setupReportGeneration() {
        var generateBtn = document.getElementById('generateReportBtn');
        if (!generateBtn) return;

        generateBtn.addEventListener('click', function() {
            var reportType = document.getElementById('reportType');
            var fromDate = document.getElementById('reportFromDate');
            var toDate = document.getElementById('reportToDate');
            var classFilter = document.getElementById('reportClassFilter');

            if (!reportType || !reportType.value) {
                showReportNotification('Please select a report type', 'warning');
                return;
            }

            var originalText = this.textContent;
            this.textContent = 'Generating...';
            this.disabled = true;

            setTimeout(function() {
                // Update report table
                var tbody = document.getElementById('reportTableBody');
                if (tbody) {
                    var html = '';
                    var data = generateReportData(reportType.value);

                    data.forEach(function(row) {
                        html += '<tr>';
                        row.forEach(function(cell) {
                            html += '<td>' + cell + '</td>';
                        });
                        html += '</tr>';
                    });

                    tbody.innerHTML = html;
                }

                // Update totals
                var totalsRow = document.querySelector('.report-totals');
                if (totalsRow) {
                    var totalCells = totalsRow.querySelectorAll('td');
                    if (totalCells.length >= 2) {
                        var totalAmount = 0;
                        var rows = document.querySelectorAll('#reportTableBody tr');
                        rows.forEach(function(row) {
                            var amountCell = row.querySelector('td:last-child');
                            if (amountCell) {
                                var amount = parseFloat(amountCell.textContent.replace(/[₹,]/g, ''));
                                if (!isNaN(amount)) totalAmount += amount;
                            }
                        });
                        totalCells[totalCells.length - 1].textContent = '₹' + totalAmount.toLocaleString('en-IN');
                    }
                }

                generateBtn.textContent = 'Report Generated';
                generateBtn.disabled = false;

                setTimeout(function() {
                    generateBtn.textContent = originalText;
                }, 2000);

                showReportNotification('Report generated successfully', 'success');
            }, 1500);
        });
    }

    /* ============================================
       GENERATE REPORT DATA
       ============================================ */

    function generateReportData(type) {
        var data = [];
        var headers = ['S.No', 'Name', 'Class', 'Amount', 'Date'];

        if (type === 'student') {
            headers = ['S.No', 'Student Name', 'Class', 'Admission Date', 'Status'];
            data = [
                ['1', 'Aarav Sharma', '10-A', '2026-06-01', 'Active'],
                ['2', 'Priya Das', '8-B', '2026-06-05', 'Active'],
                ['3', 'Rohit Gogoi', '12-A', '2026-06-10', 'Active'],
                ['4', 'Sneha Borah', '5-A', '2026-06-12', 'Active'],
                ['5', 'Arjun Deka', '9-C', '2026-06-15', 'Inactive']
            ];
        } else if (type === 'fee') {
            headers = ['S.No', 'Student Name', 'Class', 'Amount', 'Status'];
            data = [
                ['1', 'Aarav Sharma', '10-A', '₹6,000', 'Paid'],
                ['2', 'Priya Das', '8-B', '₹5,000', 'Pending'],
                ['3', 'Rohit Gogoi', '12-A', '₹7,000', 'Paid'],
                ['4', 'Sneha Borah', '5-A', '₹4,500', 'Pending'],
                ['5', 'Arjun Deka', '9-C', '₹5,500', 'Overdue']
            ];
        } else if (type === 'salary') {
            headers = ['S.No', 'Staff Name', 'Department', 'Amount', 'Status'];
            data = [
                ['1', 'Dr. Anupama Sarma', 'Science', '₹45,000', 'Paid'],
                ['2', 'Mr. Rajib Bordoloi', 'Mathematics', '₹32,000', 'Pending'],
                ['3', 'Ms. Purabi Deka', 'English', '₹28,000', 'Paid'],
                ['4', 'Dr. Monika Das', 'Science', '₹38,000', 'Processed']
            ];
        } else if (type === 'attendance') {
            headers = ['S.No', 'Student Name', 'Class', 'Present', 'Total', 'Percentage'];
            data = [
                ['1', 'Aarav Sharma', '10-A', '18', '20', '90%'],
                ['2', 'Priya Das', '8-B', '16', '20', '80%'],
                ['3', 'Rohit Gogoi', '12-A', '19', '20', '95%'],
                ['4', 'Sneha Borah', '5-A', '14', '20', '70%'],
                ['5', 'Arjun Deka', '9-C', '10', '20', '50%']
            ];
        } else if (type === 'academic') {
            headers = ['S.No', 'Student Name', 'Class', 'Average', 'Grade'];
            data = [
                ['1', 'Aarav Sharma', '10-A', '87.5', 'A'],
                ['2', 'Priya Das', '8-B', '80.0', 'B'],
                ['3', 'Rohit Gogoi', '12-A', '75.0', 'B'],
                ['4', 'Sneha Borah', '5-A', '90.0', 'A'],
                ['5', 'Arjun Deka', '9-C', '60.0', 'C']
            ];
        } else {
            headers = ['S.No', 'Item', 'Value', 'Date', 'Status'];
            data = [
                ['1', 'Sample Item 1', '100', '2026-01-01', 'Active'],
                ['2', 'Sample Item 2', '200', '2026-01-02', 'Inactive']
            ];
        }

        // Update table header
        var thead = document.querySelector('#reportTable thead');
        if (thead) {
            var headerRow = thead.querySelector('tr');
            if (headerRow) {
                headerRow.innerHTML = headers.map(function(h) {
                    return '<th>' + h + '</th>';
                }).join('');
            }
        }

        return data;
    }

    /* ============================================
       REPORT FILTERS
       ============================================ */

    function setupReportFilters() {
        var filters = document.querySelectorAll('.report-filters .filter-select, .report-filters .filter-input');

        filters.forEach(function(filter) {
            filter.addEventListener('change', function() {
                // Update report data based on filters (Phase 1 demo)
                showReportNotification('Filters applied (Phase 1 demo)', 'info');
            });
        });

        // Reset filters button
        var resetBtn = document.getElementById('resetReportFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                var inputs = document.querySelectorAll('.report-filters .filter-select, .report-filters .filter-input');
                inputs.forEach(function(input) {
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else if (input.type === 'date') {
                        // Set default dates
                        if (input.id === 'reportFromDate') {
                            var firstDay = new Date();
                            firstDay.setDate(1);
                            input.value = firstDay.toISOString().split('T')[0];
                        } else if (input.id === 'reportToDate') {
                            input.value = new Date().toISOString().split('T')[0];
                        } else {
                            input.value = '';
                        }
                    } else {
                        input.value = '';
                    }
                });
                showReportNotification('Filters reset (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       EXPORT REPORTS
       ============================================ */

    function setupReportExport() {
        var exportPdf = document.getElementById('exportReportPdfBtn');
        var exportExcel = document.getElementById('exportReportExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                // Phase 1: Show export notification
                showReportNotification('PDF export initiated (Phase 1 demo)', 'info');

                // Simulate PDF generation
                var originalText = this.textContent;
                this.textContent = 'Generating PDF...';
                this.disabled = true;

                setTimeout(function() {
                    exportPdf.textContent = 'PDF Ready';
                    setTimeout(function() {
                        exportPdf.textContent = originalText;
                        exportPdf.disabled = false;
                    }, 1500);
                    showReportNotification('PDF exported successfully (Phase 1 demo)', 'success');
                }, 1200);
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showReportNotification('Excel export initiated (Phase 1 demo)', 'info');

                var originalText = this.textContent;
                this.textContent = 'Generating Excel...';
                this.disabled = true;

                setTimeout(function() {
                    exportExcel.textContent = 'Excel Ready';
                    setTimeout(function() {
                        exportExcel.textContent = originalText;
                        exportExcel.disabled = false;
                    }, 1500);
                    showReportNotification('Excel exported successfully (Phase 1 demo)', 'success');
                }, 1200);
            });
        }

        // Individual report export buttons (student, fee, salary, attendance, academic)
        var exportBtns = document.querySelectorAll('.report-export-actions .btn');
        exportBtns.forEach(function(btn) {
            if (btn.id && btn.id.startsWith('export')) {
                btn.addEventListener('click', function() {
                    var reportType = this.getAttribute('data-report') || 'report';
                    showReportNotification(reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' export initiated (Phase 1 demo)', 'info');
                });
            }
        });
    }

    /* ============================================
       REPORT CHARTS
       ============================================ */

    function setupReportCharts() {
        // Animate chart bars
        var chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(function(bar) {
            var targetHeight = bar.style.height || '60%';
            bar.style.height = '0%';

            setTimeout(function() {
                bar.style.transition = 'height 1s ease-in-out';
                bar.style.height = targetHeight;
            }, 500);
        });

        // Chart bar labels
        var barGroups = document.querySelectorAll('.chart-bar-group');
        barGroups.forEach(function(group) {
            group.addEventListener('mouseenter', function() {
                var bar = this.querySelector('.chart-bar');
                if (bar) {
                    bar.style.opacity = '0.8';
                }
            });
            group.addEventListener('mouseleave', function() {
                var bar = this.querySelector('.chart-bar');
                if (bar) {
                    bar.style.opacity = '1';
                }
            });
        });
    }

    /* ============================================
       QUICK REPORTS
       ============================================ */

    function setupQuickReports() {
        // Student quick report
        var studentReportBtn = document.getElementById('studentQuickReport');
        if (studentReportBtn) {
            studentReportBtn.addEventListener('click', function() {
                generateQuickReport('student');
            });
        }

        // Fee quick report
        var feeReportBtn = document.getElementById('feeQuickReport');
        if (feeReportBtn) {
            feeReportBtn.addEventListener('click', function() {
                generateQuickReport('fee');
            });
        }

        // Salary quick report
        var salaryReportBtn = document.getElementById('salaryQuickReport');
        if (salaryReportBtn) {
            salaryReportBtn.addEventListener('click', function() {
                generateQuickReport('salary');
            });
        }

        // Attendance quick report
        var attendanceReportBtn = document.getElementById('attendanceQuickReport');
        if (attendanceReportBtn) {
            attendanceReportBtn.addEventListener('click', function() {
                generateQuickReport('attendance');
            });
        }

        // Academic quick report
        var academicReportBtn = document.getElementById('academicQuickReport');
        if (academicReportBtn) {
            academicReportBtn.addEventListener('click', function() {
                generateQuickReport('academic');
            });
        }
    }

    function generateQuickReport(type) {
        var typeNames = {
            student: 'Student',
            fee: 'Fee',
            salary: 'Salary',
            attendance: 'Attendance',
            academic: 'Academic'
        };

        showReportNotification('Generating ' + (typeNames[type] || '') + ' quick report...', 'info');

        setTimeout(function() {
            // Generate and display quick report data
            var tbody = document.getElementById('reportTableBody');
            if (tbody) {
                var data = generateReportData(type);
                var html = '';
                data.forEach(function(row) {
                    html += '<tr>';
                    row.forEach(function(cell) {
                        html += '<td>' + cell + '</td>';
                    });
                    html += '</tr>';
                });
                tbody.innerHTML = html;
            }

            // Update totals
            var totalsRow = document.querySelector('.report-totals');
            if (totalsRow) {
                var totalCells = totalsRow.querySelectorAll('td');
                if (totalCells.length >= 2) {
                    var totalAmount = 0;
                    var rows = document.querySelectorAll('#reportTableBody tr');
                    rows.forEach(function(row) {
                        var amountCell = row.querySelector('td:last-child');
                        if (amountCell) {
                            var amount = parseFloat(amountCell.textContent.replace(/[₹,]/g, ''));
                            if (!isNaN(amount)) totalAmount += amount;
                        }
                    });
                    totalCells[totalCells.length - 1].textContent = '₹' + totalAmount.toLocaleString('en-IN');
                }
            }

            showReportNotification((typeNames[type] || '') + ' quick report generated', 'success');
        }, 800);
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showReportNotification(message, type) {
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
