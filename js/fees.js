/* ============================================
   FEES.JS
   Fee Management JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Fee Features -----
        initFeeFeatures();

        // ----- Fee Search -----
        setupFeeSearch();

        // ----- Fee Filters -----
        setupFeeFilters();

        // ----- Collect Fee Form -----
        setupCollectFeeForm();

        // ----- Fee Structure -----
        setupFeeStructure();

        // ----- Fee Receipt Generation -----
        setupReceiptGeneration();

        // ----- Fee History -----
        setupFeeHistory();

        // ----- Fee Due List -----
        setupFeeDue();
    });

    /* ============================================
       INITIALIZE FEE FEATURES
       ============================================ */

    function initFeeFeatures() {
        // Update fee counts
        updateFeeCounts();

        // Set default dates for fee forms
        setDefaultFeeDates();

        // Initialize payment method badges
        initPaymentBadges();
    }

    /* ============================================
       UPDATE FEE COUNTS
       ============================================ */

    function updateFeeCounts() {
        // Update stats cards if present
        var statValues = document.querySelectorAll('.fee-stats .stat-value');
        if (statValues.length >= 3) {
            // Phase 1: Static demo values
            // In Phase 2, these will come from Firebase
            statValues[0].textContent = '₹4,85,200';
            statValues[1].textContent = '₹2,31,500';
            statValues[2].textContent = '43';
        }

        // Update table pagination info
        var rows = document.querySelectorAll('#feesTableBody tr, #feeHistoryTableBody tr');
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
       SET DEFAULT FEE DATES
       ============================================ */

    function setDefaultFeeDates() {
        var today = new Date().toISOString().split('T')[0];

        // Fee collection date
        var feeDate = document.getElementById('feeDate');
        if (feeDate) feeDate.value = today;

        // Due date (30 days from now)
        var dueDate = document.getElementById('dueDate');
        if (dueDate) {
            var date = new Date();
            date.setDate(date.getDate() + 30);
            dueDate.value = date.toISOString().split('T')[0];
        }

        // History date range
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
       INIT PAYMENT BADGES
       ============================================ */

    function initPaymentBadges() {
        var methodCells = document.querySelectorAll('.payment-method');
        methodCells.forEach(function(cell) {
            var method = cell.textContent.trim().toLowerCase();
            var colors = {
                cash: { bg: '#d5f5e3', color: '#1e8449' },
                card: { bg: '#d6eaf8', color: '#2471a3' },
                online: { bg: '#e8daef', color: '#7d3c98' },
                cheque: { bg: '#fdebd0', color: '#b9770e' }
            };

            var color = colors[method] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       FEE SEARCH
       ============================================ */

    function setupFeeSearch() {
        var searchInput = document.getElementById('feeSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var rows = document.querySelectorAll('#feesTableBody tr, #feeHistoryTableBody tr');

            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });

            updateFeeVisibleCount();
        });
    }

    /* ============================================
       FEE FILTERS
       ============================================ */

    function setupFeeFilters() {
        var classFilter = document.getElementById('feeClassFilter');
        var statusFilter = document.getElementById('feeStatusFilter');

        if (!classFilter && !statusFilter) return;

        var filters = [classFilter, statusFilter].filter(Boolean);

        filters.forEach(function(filter) {
            filter.addEventListener('change', applyFeeFilters);
        });
    }

    function applyFeeFilters() {
        var classFilter = document.getElementById('feeClassFilter');
        var statusFilter = document.getElementById('feeStatusFilter');

        var classVal = classFilter ? classFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#feesTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (classVal) {
                var classCell = row.querySelector('td:nth-child(4)');
                var rowClass = classCell ? classCell.textContent.trim() : '';
                if (rowClass !== classVal) show = false;
            }

            if (statusVal && show) {
                var statusCell = row.querySelector('.status-badge');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });

        updateFeeVisibleCount();
    }

    function updateFeeVisibleCount() {
        var visibleRows = document.querySelectorAll('#feesTableBody tr[style*="display: none"]');
        var totalRows = document.querySelectorAll('#feesTableBody tr');
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
       COLLECT FEE FORM
       ============================================ */

    function setupCollectFeeForm() {
        var form = document.getElementById('collectFeeForm');
        if (!form) return;

        var submitBtn = form.querySelector('[type="submit"]');

        // Auto-calculate total
        var amountInput = document.getElementById('amount');
        var discountInput = document.getElementById('discount');
        var totalInput = document.getElementById('totalAmount');

        if (amountInput && discountInput && totalInput) {
            function calculateTotal() {
                var amount = parseFloat(amountInput.value) || 0;
                var discount = parseFloat(discountInput.value) || 0;
                var total = amount - discount;
                totalInput.value = total.toFixed(2);
            }

            amountInput.addEventListener('input', calculateTotal);
            discountInput.addEventListener('input', calculateTotal);
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate
            var student = document.getElementById('feeStudent');
            var amount = document.getElementById('amount');
            var paymentMethod = document.getElementById('paymentMethod');

            var isValid = true;

            if (!student.value) {
                showFeeError(student, 'Please select a student');
                isValid = false;
            } else {
                clearFeeError(student);
            }

            if (!amount.value || parseFloat(amount.value) <= 0) {
                showFeeError(amount, 'Please enter a valid amount');
                isValid = false;
            } else {
                clearFeeError(amount);
            }

            if (!paymentMethod.value) {
                showFeeError(paymentMethod, 'Please select a payment method');
                isValid = false;
            } else {
                clearFeeError(paymentMethod);
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
                // Generate receipt number
                var receiptNo = 'RCP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);

                // Show success
                var successEl = document.getElementById('paymentSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                    var receiptEl = successEl.querySelector('#generatedReceiptNo');
                    if (receiptEl) receiptEl.textContent = receiptNo;

                    // Update receipt preview
                    updateReceiptPreview(receiptNo, student.options[student.selectedIndex]?.text || 'Student', amount.value, paymentMethod.options[paymentMethod.selectedIndex]?.text || 'Cash');
                }

                // Hide form
                form.style.display = 'none';

                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;

                console.log('Fee collected:', {
                    student: student.value,
                    amount: amount.value,
                    method: paymentMethod.value,
                    receipt: receiptNo
                });
            }, 1500);
        });
    }

    /* ============================================
       UPDATE RECEIPT PREVIEW
       ============================================ */

    function updateReceiptPreview(receiptNo, studentName, amount, method) {
        var preview = document.getElementById('receiptPreview');
        if (!preview) return;

        var receiptNumber = preview.querySelector('.receipt-number');
        var studentEl = preview.querySelector('.receipt-row .receipt-value');
        var amountEl = preview.querySelector('.receipt-value.amount');
        var methodEl = preview.querySelectorAll('.receipt-row .receipt-value')[3];

        if (receiptNumber) receiptNumber.textContent = receiptNo;
        if (studentEl) studentEl.textContent = studentName;
        if (amountEl) amountEl.textContent = '₹' + parseFloat(amount).toLocaleString('en-IN');
        if (methodEl) methodEl.textContent = method;

        // Update date
        var dateEl = preview.querySelector('.receipt-date');
        if (dateEl) {
            var now = new Date();
            dateEl.textContent = now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }

        // Update signature
        var signatureEl = preview.querySelector('.receipt-signature');
        if (signatureEl) {
            signatureEl.textContent = 'Authorized Signature';
        }
    }

    /* ============================================
       FEE STRUCTURE
       ============================================ */

    function setupFeeStructure() {
        // Add fee structure item
        var addBtn = document.getElementById('addFeeStructureBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var tbody = document.querySelector('.fee-structure-table tbody');
                if (!tbody) return;

                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" class="form-input form-input-sm" placeholder="Fee name" /></td>
                    <td><input type="text" class="form-input form-input-sm" placeholder="Class" /></td>
                    <td><input type="number" class="form-input form-input-sm" placeholder="Amount" /></td>
                    <td>
                        <select class="form-input form-input-sm">
                            <option value="annual">Annual</option>
                            <option value="monthly">Monthly</option>
                            <option value="one-time">One-time</option>
                        </select>
                    </td>
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

                // Add delete handler
                var deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', function() {
                    row.remove();
                });

                showFeeNotification('New fee structure row added (Phase 1 demo)', 'success');
            });
        }

        // Save fee structure
        var saveBtn = document.getElementById('saveFeeStructureBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                showFeeNotification('Fee structure saved successfully (Phase 1 demo)', 'success');
            });
        }
    }

    /* ============================================
       RECEIPT GENERATION
       ============================================ */

    function setupReceiptGeneration() {
        // Print receipt
        var printBtns = document.querySelectorAll('.print-receipt-btn');
        printBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var receipt = this.closest('.receipt-view') || document.querySelector('.receipt-view');
                if (receipt) {
                    var printWindow = window.open('', '_blank', 'width=800,height=600');
                    if (printWindow) {
                        var content = receipt.cloneNode(true);
                        printWindow.document.write('<html><head><title>Fee Receipt</title>');
                        printWindow.document.write('<style>');
                        printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
                        printWindow.document.write('.receipt-view { max-width: 800px; margin: 0 auto; border: 1px solid #000; border-radius: 6px; padding: 24px; }');
                        printWindow.document.write('.receipt-header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid #2c3e50; }');
                        printWindow.document.write('.institution-name { font-size: 24px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.institution-address { font-size: 13px; color: #95a5a6; }');
                        printWindow.document.write('.receipt-title { font-size: 20px; font-weight: bold; margin-top: 8px; }');
                        printWindow.document.write('.receipt-number { font-size: 14px; color: #5d6d7e; }');
                        printWindow.document.write('.receipt-body { padding: 16px 0; }');
                        printWindow.document.write('.receipt-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e8e8; }');
                        printWindow.document.write('.receipt-label { color: #95a5a6; }');
                        printWindow.document.write('.receipt-value { color: #2c3e50; }');
                        printWindow.document.write('.receipt-value.amount { font-size: 20px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.receipt-footer { padding-top: 16px; border-top: 1px solid #e5e8e8; display: flex; justify-content: space-between; }');
                        printWindow.document.write('.signature-area { text-align: center; }');
                        printWindow.document.write('.signature-line { width: 150px; border-top: 1px solid #000; margin: 8px auto 0; }');
                        printWindow.document.write('.signature-label { font-size: 11px; color: #95a5a6; }');
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

        // Download receipt
        var downloadBtns = document.querySelectorAll('.download-receipt-btn');
        downloadBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                showFeeNotification('Receipt download will be available in Phase 2 (PDF generation)', 'info');
            });
        });
    }

    /* ============================================
       FEE HISTORY
       ============================================ */

    function setupFeeHistory() {
        // History filters
        var classFilter = document.getElementById('historyClassFilter');
        var statusFilter = document.getElementById('historyStatusFilter');

        if (classFilter || statusFilter) {
            var filters = [classFilter, statusFilter].filter(Boolean);
            filters.forEach(function(filter) {
                filter.addEventListener('change', applyHistoryFilters);
            });
        }

        // Date range filters
        var fromDate = document.getElementById('fromDate');
        var toDate = document.getElementById('toDate');

        if (fromDate) {
            fromDate.addEventListener('change', applyHistoryFilters);
        }
        if (toDate) {
            toDate.addEventListener('change', applyHistoryFilters);
        }

        // Export buttons
        var exportPdf = document.getElementById('exportPdfBtn');
        var exportExcel = document.getElementById('exportExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                showFeeNotification('PDF export initiated (Phase 1 demo)', 'info');
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showFeeNotification('Excel export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    function applyHistoryFilters() {
        var classFilter = document.getElementById('historyClassFilter');
        var statusFilter = document.getElementById('historyStatusFilter');
        var fromDate = document.getElementById('fromDate');
        var toDate = document.getElementById('toDate');

        var classVal = classFilter ? classFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';
        var fromVal = fromDate ? fromDate.value : '';
        var toVal = toDate ? toDate.value : '';

        var rows = document.querySelectorAll('#feeHistoryTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (classVal) {
                var classCell = row.querySelector('td:nth-child(3)');
                var rowClass = classCell ? classCell.textContent.trim() : '';
                if (rowClass !== classVal) show = false;
            }

            if (statusVal && show) {
                var statusCell = row.querySelector('.status-badge');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    /* ============================================
       FEE DUE LIST
       ============================================ */

    function setupFeeDue() {
        // Send reminder button
        var reminderBtns = document.querySelectorAll('.send-reminder-btn');
        reminderBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var student = this.closest('.due-item')?.querySelector('.due-student')?.textContent || 'Student';
                showFeeNotification('Reminder sent to ' + student + ' (Phase 1 demo)', 'success');
            });
        });

        // Mark as paid button
        var paidBtns = document.querySelectorAll('.mark-paid-btn');
        paidBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var item = this.closest('.due-item');
                if (item) {
                    var statusBadge = item.querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.textContent = 'Paid';
                        statusBadge.className = 'status-badge paid';
                    }
                    var amount = item.querySelector('.due-amount');
                    if (amount) {
                        amount.style.color = 'var(--success-color)';
                    }
                    this.remove();
                    showFeeNotification('Fee marked as paid (Phase 1 demo)', 'success');
                }
            });
        });

        // Export due list
        var exportPdf = document.getElementById('exportDuePdfBtn');
        var exportExcel = document.getElementById('exportDueExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                showFeeNotification('Due list PDF export initiated (Phase 1 demo)', 'info');
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showFeeNotification('Due list Excel export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       ERROR HELPERS
       ============================================ */

    function showFeeError(input, message) {
        var errorEl = input.parentElement?.querySelector('.form-error') || input.closest('.form-group')?.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        input.style.borderColor = 'var(--danger-color)';
    }

    function clearFeeError(input) {
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

    function showFeeNotification(message, type) {
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
