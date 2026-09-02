/* ============================================
   SALARY.JS
   Salary Management JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Salary Features -----
        initSalaryFeatures();

        // ----- Salary Search -----
        setupSalarySearch();

        // ----- Salary Filters -----
        setupSalaryFilters();

        // ----- Salary Payment Form -----
        setupSalaryPaymentForm();

        // ----- Salary Structure -----
        setupSalaryStructure();

        // ----- Salary Slip Generation -----
        setupSalarySlip();

        // ----- Salary History -----
        setupSalaryHistory();
    });

    /* ============================================
       INITIALIZE SALARY FEATURES
       ============================================ */

    function initSalaryFeatures() {
        // Update salary counts
        updateSalaryCounts();

        // Set default dates for salary forms
        setDefaultSalaryDates();

        // Initialize salary status badges
        initSalaryBadges();
    }

    /* ============================================
       UPDATE SALARY COUNTS
       ============================================ */

    function updateSalaryCounts() {
        // Update stats cards if present
        var statValues = document.querySelectorAll('.salary-stats .stat-value');
        if (statValues.length >= 3) {
            // Phase 1: Static demo values
            statValues[0].textContent = '₹3,62,000';
            statValues[1].textContent = '₹2,83,000';
            statValues[2].textContent = '12';
        }

        // Update table pagination info
        var rows = document.querySelectorAll('#salaryTableBody tr, #salaryHistoryTableBody tr');
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
       SET DEFAULT SALARY DATES
       ============================================ */

    function setDefaultSalaryDates() {
        var today = new Date().toISOString().split('T')[0];

        // Salary payment date
        var paymentDate = document.getElementById('paymentDate');
        if (paymentDate) paymentDate.value = today;

        // Month selector - default to current month
        var monthSelect = document.getElementById('salaryMonth');
        if (monthSelect) {
            var currentMonth = new Date().getMonth();
            var options = monthSelect.options;
            for (var i = 0; i < options.length; i++) {
                if (parseInt(options[i].value) === currentMonth + 1) {
                    monthSelect.selectedIndex = i;
                    break;
                }
            }
        }

        // Year selector - default to current year
        var yearSelect = document.getElementById('salaryYear');
        if (yearSelect) {
            var currentYear = new Date().getFullYear();
            var options = yearSelect.options;
            for (var i = 0; i < options.length; i++) {
                if (parseInt(options[i].value) === currentYear) {
                    yearSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    /* ============================================
       INIT SALARY BADGES
       ============================================ */

    function initSalaryBadges() {
        var statusCells = document.querySelectorAll('.salary-status');
        statusCells.forEach(function(cell) {
            var status = cell.textContent.trim().toLowerCase();
            var colors = {
                paid: { bg: '#d5f5e3', color: '#1e8449' },
                pending: { bg: '#fdebd0', color: '#b9770e' },
                overdue: { bg: '#fadbd8', color: '#b03a2e' },
                processed: { bg: '#d6eaf8', color: '#2471a3' }
            };

            var color = colors[status] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       SALARY SEARCH
       ============================================ */

    function setupSalarySearch() {
        var searchInput = document.getElementById('salarySearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var rows = document.querySelectorAll('#salaryTableBody tr, #salaryHistoryTableBody tr');

            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });

            updateSalaryVisibleCount();
        });
    }

    /* ============================================
       SALARY FILTERS
       ============================================ */

    function setupSalaryFilters() {
        var statusFilter = document.getElementById('salaryStatusFilter');
        var monthFilter = document.getElementById('salaryMonthFilter');

        if (!statusFilter && !monthFilter) return;

        var filters = [statusFilter, monthFilter].filter(Boolean);

        filters.forEach(function(filter) {
            filter.addEventListener('change', applySalaryFilters);
        });
    }

    function applySalaryFilters() {
        var statusFilter = document.getElementById('salaryStatusFilter');
        var monthFilter = document.getElementById('salaryMonthFilter');

        var statusVal = statusFilter ? statusFilter.value : '';
        var monthVal = monthFilter ? monthFilter.value : '';

        var rows = document.querySelectorAll('#salaryTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (statusVal) {
                var statusCell = row.querySelector('.salary-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            if (monthVal && show) {
                var monthCell = row.querySelector('td:nth-child(4)');
                var rowMonth = monthCell ? monthCell.textContent.trim() : '';
                if (rowMonth !== monthVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });

        updateSalaryVisibleCount();
    }

    function updateSalaryVisibleCount() {
        var visibleRows = document.querySelectorAll('#salaryTableBody tr[style*="display: none"]');
        var totalRows = document.querySelectorAll('#salaryTableBody tr');
        var visibleCount = totalRows.length - visibleRows.length;

        var infoEl = document.querySelector('.table-info');
        if (infoEl) {
            var strongTags = infoEl.querySelectorAll('strong');
            if (strongTags.length >= 3) {
                strongTags[0].textContent = visibleCount > 0 ? '1' : '0';
                strongTags[1].textContent = visibleCount;
                strongTags[2].textContent = totalRows.length;
            }
        }
    }

    /* ============================================
       SALARY PAYMENT FORM
       ============================================ */

    function setupSalaryPaymentForm() {
        var form = document.getElementById('salaryPaymentForm');
        if (!form) return;

        var submitBtn = form.querySelector('[type="submit"]');

        // Auto-calculate total with deductions
        var basicInput = document.getElementById('basicSalary');
        var allowancesInput = document.getElementById('allowances');
        var deductionsInput = document.getElementById('deductions');
        var totalInput = document.getElementById('totalSalary');

        if (basicInput && allowancesInput && deductionsInput && totalInput) {
            function calculateTotal() {
                var basic = parseFloat(basicInput.value) || 0;
                var allowances = parseFloat(allowancesInput.value) || 0;
                var deductions = parseFloat(deductionsInput.value) || 0;
                var total = basic + allowances - deductions;
                totalInput.value = total.toFixed(2);
            }

            basicInput.addEventListener('input', calculateTotal);
            allowancesInput.addEventListener('input', calculateTotal);
            deductionsInput.addEventListener('input', calculateTotal);
        }

        // Staff selection - auto-fill basic salary
        var staffSelect = document.getElementById('staffSelect');
        if (staffSelect) {
            staffSelect.addEventListener('change', function() {
                if (basicInput) {
                    // Phase 1: Set a random salary based on selection
                    var salaries = [25000, 32000, 28000, 45000, 38000, 42000];
                    var randomSalary = salaries[Math.floor(Math.random() * salaries.length)];
                    basicInput.value = randomSalary;
                    calculateTotal();
                }
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate
            var staff = document.getElementById('staffSelect');
            var month = document.getElementById('salaryMonth');
            var year = document.getElementById('salaryYear');
            var total = document.getElementById('totalSalary');

            var isValid = true;

            if (!staff.value) {
                showSalaryError(staff, 'Please select a staff member');
                isValid = false;
            } else {
                clearSalaryError(staff);
            }

            if (!month.value) {
                showSalaryError(month, 'Please select a month');
                isValid = false;
            } else {
                clearSalaryError(month);
            }

            if (!year.value) {
                showSalaryError(year, 'Please select a year');
                isValid = false;
            } else {
                clearSalaryError(year);
            }

            if (!total || parseFloat(total.value) <= 0) {
                showSalaryError(total, 'Please enter a valid salary amount');
                isValid = false;
            } else {
                clearSalaryError(total);
            }

            if (!isValid) return;

            // Show loading
            var btnText = submitBtn.querySelector('.btn-text');
            var spinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
            submitBtn.disabled = true;

            // Phase 1: Simulate payment
            setTimeout(function() {
                var slipNo = 'SLP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);

                // Show success
                var successEl = document.getElementById('paymentSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                    var slipEl = successEl.querySelector('#generatedSlipNo');
                    if (slipEl) slipEl.textContent = slipNo;

                    // Update salary slip preview
                    updateSalarySlipPreview(slipNo, staff.options[staff.selectedIndex]?.text || 'Staff', total.value, month.options[month.selectedIndex]?.text || 'Jan', year.value);
                }

                // Hide form
                form.style.display = 'none';

                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;

                console.log('Salary paid:', {
                    staff: staff.value,
                    month: month.value,
                    year: year.value,
                    total: total.value,
                    slip: slipNo
                });
            }, 1500);
        });
    }

    /* ============================================
       UPDATE SALARY SLIP PREVIEW
       ============================================ */

    function updateSalarySlipPreview(slipNo, staffName, amount, month, year) {
        var slip = document.getElementById('salarySlipPreview');
        if (!slip) return;

        var slipNumber = slip.querySelector('.slip-number');
        var nameEl = slip.querySelector('.slip-row .slip-value');
        var amountEl = slip.querySelector('.slip-value.amount');
        var monthEl = slip.querySelectorAll('.slip-row .slip-value')[2];
        var yearEl = slip.querySelectorAll('.slip-row .slip-value')[3];

        if (slipNumber) slipNumber.textContent = slipNo;
        if (nameEl) nameEl.textContent = staffName;
        if (amountEl) amountEl.textContent = '₹' + parseFloat(amount).toLocaleString('en-IN');
        if (monthEl) monthEl.textContent = month;
        if (yearEl) yearEl.textContent = year;

        // Update date
        var dateEl = slip.querySelector('.slip-date');
        if (dateEl) {
            var now = new Date();
            dateEl.textContent = now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
    }

    /* ============================================
       SALARY STRUCTURE
       ============================================ */

    function setupSalaryStructure() {
        // Add salary structure item
        var addBtn = document.getElementById('addSalaryStructureBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.querySelector('.salary-structure-table tbody');
                if (!tbody) return;

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" class="form-input form-input-sm" placeholder="Staff name" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Designation" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Department" /></td>
                    <td><input type="number" class="form-input form-input-sm" placeholder="Basic salary" /></td>
                    <td><input type="number" class="form-input form-input-sm" placeholder="Allowances" /></td>
                    <td><input type="number" class="form-input form-input-sm" placeholder="Deductions" /></td>
                    <td>
                        <button class="action-btn delete" title="Remove">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;

                tbody.appendChild(row);

                var deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', function() {
                    row.remove();
                });

                showSalaryNotification('New salary structure row added (Phase 1 demo)', 'success');
            });
        }

        // Save salary structure
        var saveBtn = document.getElementById('saveSalaryStructureBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                showSalaryNotification('Salary structure saved successfully (Phase 1 demo)', 'success');
            });
        }

        // Calculate totals for each row
        var rows = document.querySelectorAll('.salary-structure-table tbody tr');
        rows.forEach(function(row) {
            var inputs = row.querySelectorAll('input[type="number"]');
            if (inputs.length >= 3) {
                var basic = inputs[0];
                var allowances = inputs[1];
                var deductions = inputs[2];

                function calculateRowTotal() {
                    var total = (parseFloat(basic.value) || 0) + (parseFloat(allowances.value) || 0) - (parseFloat(deductions.value) || 0);
                    var totalCell = row.querySelector('td:last-child');
                    if (totalCell) {
                        totalCell.textContent = '₹' + total.toLocaleString('en-IN');
                    }
                }

                basic.addEventListener('input', calculateRowTotal);
                allowances.addEventListener('input', calculateRowTotal);
                deductions.addEventListener('input', calculateRowTotal);
            }
        });
    }

    /* ============================================
       SALARY SLIP GENERATION
       ============================================ */

    function setupSalarySlip() {
        // Print salary slip
        var printBtns = document.querySelectorAll('.print-slip-btn');
        printBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var slip = this.closest('.salary-slip') || document.querySelector('.salary-slip');
                if (slip) {
                    var printWindow = window.open('', '_blank', 'width=800,height=600');
                    if (printWindow) {
                        var content = slip.cloneNode(true);
                        printWindow.document.write('<html><head><title>Salary Slip</title>');
                        printWindow.document.write('<style>');
                        printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
                        printWindow.document.write('.salary-slip { max-width: 800px; margin: 0 auto; border: 1px solid #000; border-radius: 6px; padding: 24px; }');
                        printWindow.document.write('.slip-header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid #2c3e50; }');
                        printWindow.document.write('.slip-title { font-size: 24px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.slip-sub { font-size: 13px; color: #95a5a6; }');
                        printWindow.document.write('.slip-body { padding: 16px 0; }');
                        printWindow.document.write('.slip-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e8e8; }');
                        printWindow.document.write('.slip-label { color: #95a5a6; }');
                        printWindow.document.write('.slip-value { color: #2c3e50; }');
                        printWindow.document.write('.slip-value.amount { font-size: 20px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.slip-total { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #2c3e50; font-weight: bold; font-size: 18px; }');
                        printWindow.document.write('.slip-footer { padding-top: 16px; border-top: 1px solid #e5e8e8; text-align: center; }');
                        printWindow.document.write('.slip-signature { font-size: 11px; color: #95a5a6; }');
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
        });

        // Download salary slip
        var downloadBtns = document.querySelectorAll('.download-slip-btn');
        downloadBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                showSalaryNotification('Salary slip download will be available in Phase 2 (PDF generation)', 'info');
            });
        });
    }

    /* ============================================
       SALARY HISTORY
       ============================================ */

    function setupSalaryHistory() {
        // History filters
        var statusFilter = document.getElementById('historyStatusFilter');
        var monthFilter = document.getElementById('historyMonthFilter');

        if (statusFilter || monthFilter) {
            var filters = [statusFilter, monthFilter].filter(Boolean);
            filters.forEach(function(filter) {
                filter.addEventListener('change', applyHistorySalaryFilters);
            });
        }

        // Date range filters
        var fromDate = document.getElementById('fromDate');
        var toDate = document.getElementById('toDate');

        if (fromDate) {
            fromDate.addEventListener('change', applyHistorySalaryFilters);
        }
        if (toDate) {
            toDate.addEventListener('change', applyHistorySalaryFilters);
        }

        // Export buttons
        var exportPdf = document.getElementById('exportPdfBtn');
        var exportExcel = document.getElementById('exportExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                showSalaryNotification('PDF export initiated (Phase 1 demo)', 'info');
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showSalaryNotification('Excel export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    function applyHistorySalaryFilters() {
        var statusFilter = document.getElementById('historyStatusFilter');
        var monthFilter = document.getElementById('historyMonthFilter');
        var fromDate = document.getElementById('fromDate');
        var toDate = document.getElementById('toDate');

        var statusVal = statusFilter ? statusFilter.value : '';
        var monthVal = monthFilter ? monthFilter.value : '';
        var fromVal = fromDate ? fromDate.value : '';
        var toVal = toDate ? toDate.value : '';

        var rows = document.querySelectorAll('#salaryHistoryTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (statusVal) {
                var statusCell = row.querySelector('.salary-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            if (monthVal && show) {
                var monthCell = row.querySelector('td:nth-child(3)');
                var rowMonth = monthCell ? monthCell.textContent.trim() : '';
                if (rowMonth !== monthVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    /* ============================================
       ERROR HELPERS
       ============================================ */

    function showSalaryError(input, message) {
        var errorEl = input.parentElement?.querySelector('.form-error') || input.closest('.form-group')?.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        input.style.borderColor = 'var(--danger-color)';
    }

    function clearSalaryError(input) {
        var errorEl = input.parentElement?.querySelector('.form-error') || input.closest('.form-group')?.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
        input.style.borderColor = '';
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showSalaryNotification(message, type) {
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
