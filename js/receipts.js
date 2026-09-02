/* ============================================
   RECEIPTS.JS
   Receipt & Document Management JavaScript
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Receipt Features -----
        initReceiptFeatures();

        // ----- Receipt Generation -----
        setupReceiptGeneration();

        // ----- Receipt View -----
        setupReceiptView();

        // ----- Receipt Search & Filters -----
        setupReceiptSearch();

        // ----- Receipt Export -----
        setupReceiptExport();

        // ----- Certificate Generation -----
        setupCertificateGeneration();

        // ----- Document Generator -----
        setupDocumentGenerator();

        // ----- Receipt Settings -----
        setupReceiptSettings();
    });

    /* ============================================
       INITIALIZE RECEIPT FEATURES
       ============================================ */

    function initReceiptFeatures() {
        // Update receipt counts
        updateReceiptCounts();

        // Set default dates
        setDefaultReceiptDates();

        // Initialize receipt status badges
        initReceiptBadges();
    }

    /* ============================================
       UPDATE RECEIPT COUNTS
       ============================================ */

    function updateReceiptCounts() {
        var statValues = document.querySelectorAll('.receipt-stats .stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = '1,247';
            statValues[1].textContent = '₹4,85,200';
            statValues[2].textContent = '43';
        }

        var rows = document.querySelectorAll('#receiptsTableBody tr');
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
       SET DEFAULT RECEIPT DATES
       ============================================ */

    function setDefaultReceiptDates() {
        var today = new Date().toISOString().split('T')[0];

        var dateInput = document.getElementById('receiptDate');
        if (dateInput) dateInput.value = today;

        var fromDate = document.getElementById('receiptFromDate');
        var toDate = document.getElementById('receiptToDate');

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
       INIT RECEIPT BADGES
       ============================================ */

    function initReceiptBadges() {
        var statusCells = document.querySelectorAll('.receipt-status');
        statusCells.forEach(function(cell) {
            var status = cell.textContent.trim().toLowerCase();
            var colors = {
                paid: { bg: '#d5f5e3', color: '#1e8449' },
                pending: { bg: '#fdebd0', color: '#b9770e' },
                overdue: { bg: '#fadbd8', color: '#b03a2e' },
                cancelled: { bg: '#f0f0f0', color: '#5d6d7e' }
            };

            var color = colors[status] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       RECEIPT GENERATION
       ============================================ */

    function setupReceiptGeneration() {
        var generateBtn = document.getElementById('generateReceiptBtn');
        if (!generateBtn) return;

        generateBtn.addEventListener('click', function() {
            var student = document.getElementById('receiptStudent');
            var amount = document.getElementById('receiptAmount');
            var paymentMethod = document.getElementById('receiptPaymentMethod');

            var isValid = true;

            if (!student || !student.value) {
                showReceiptError(student, 'Please select a student');
                isValid = false;
            } else {
                clearReceiptError(student);
            }

            if (!amount || !amount.value || parseFloat(amount.value) <= 0) {
                showReceiptError(amount, 'Please enter a valid amount');
                isValid = false;
            } else {
                clearReceiptError(amount);
            }

            if (!paymentMethod || !paymentMethod.value) {
                showReceiptError(paymentMethod, 'Please select a payment method');
                isValid = false;
            } else {
                clearReceiptError(paymentMethod);
            }

            if (!isValid) return;

            var originalText = this.textContent;
            this.textContent = 'Generating...';
            this.disabled = true;

            setTimeout(function() {
                var receiptNo = 'RCP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);

                // Update receipt preview
                updateReceiptPreview(receiptNo, student.options[student.selectedIndex]?.text || 'Student', amount.value, paymentMethod.options[paymentMethod.selectedIndex]?.text || 'Cash');

                // Show success
                var successEl = document.getElementById('receiptSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                    var receiptEl = successEl.querySelector('#generatedReceiptNo');
                    if (receiptEl) receiptEl.textContent = receiptNo;
                }

                generateBtn.textContent = 'Receipt Generated';
                generateBtn.disabled = false;

                setTimeout(function() {
                    generateBtn.textContent = originalText;
                }, 2000);

                showReceiptNotification('Receipt ' + receiptNo + ' generated successfully', 'success');

                // Add to table if on receipts page
                var tbody = document.getElementById('receiptsTableBody');
                if (tbody) {
                    var row = document.createElement('tr');
                    var now = new Date();
                    var dateStr = now.toISOString().slice(0, 10);
                    var studentName = student.options[student.selectedIndex]?.text || 'Unknown';

                    row.innerHTML = `
                        <td><input type="checkbox" class="row-checkbox" /></td>
                        <td>${receiptNo}</td>
                        <td><a href="receipt-view.html" class="receipt-link">${studentName}</a></td>
                        <td>${student.value || 'N/A'}</td>
                        <td>₹${parseFloat(amount.value).toLocaleString('en-IN')}</td>
                        <td>${dateStr}</td>
                        <td><span class="receipt-status paid">Paid</span></td>
                        <td>
                            <div class="action-btns">
                                <a href="receipt-view.html" class="action-btn view" title="View">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </a>
                                <button class="action-btn print" title="Print">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 6 2 18 2 18 9"/>
                                        <path d="M18 9H6"/>
                                        <path d="M18 13H6"/>
                                        <path d="M6 17h12v4H6z"/>
                                    </svg>
                                </button>
                                <button class="action-btn download" title="Download">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.prepend(row);
                }

            }, 1200);
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

        var dateEl = preview.querySelector('.receipt-date');
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
       RECEIPT VIEW
       ============================================ */

    function setupReceiptView() {
        // Print receipt from view
        var printBtn = document.getElementById('printReceiptBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                var receipt = document.querySelector('.receipt-view');
                if (receipt) {
                    var printWindow = window.open('', '_blank', 'width=800,height=600');
                    if (printWindow) {
                        var content = receipt.cloneNode(true);
                        printWindow.document.write('<html><head><title>Receipt</title>');
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
        }

        // Download receipt
        var downloadBtn = document.getElementById('downloadReceiptBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showReceiptNotification('Receipt download will be available in Phase 2 (PDF generation)', 'info');
            });
        }

        // Back to list
        var backBtn = document.getElementById('backToReceiptsBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'receipts.html';
            });
        }
    }

    /* ============================================
       RECEIPT SEARCH & FILTERS
       ============================================ */

    function setupReceiptSearch() {
        var searchInput = document.getElementById('receiptSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#receiptsTableBody tr');

                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });

                updateReceiptVisibleCount();
            });
        }

        var filters = document.querySelectorAll('#receiptStatusFilter, #receiptClassFilter');
        filters.forEach(function(filter) {
            if (filter) {
                filter.addEventListener('change', applyReceiptFilters);
            }
        });
    }

    function applyReceiptFilters() {
        var statusFilter = document.getElementById('receiptStatusFilter');
        var classFilter = document.getElementById('receiptClassFilter');

        var statusVal = statusFilter ? statusFilter.value : '';
        var classVal = classFilter ? classFilter.value : '';

        var rows = document.querySelectorAll('#receiptsTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (statusVal) {
                var statusCell = row.querySelector('.receipt-status');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            if (classVal && show) {
                var classCell = row.querySelector('td:nth-child(3)');
                var rowClass = classCell ? classCell.textContent.trim() : '';
                if (rowClass !== classVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });

        updateReceiptVisibleCount();
    }

    function updateReceiptVisibleCount() {
        var visibleRows = document.querySelectorAll('#receiptsTableBody tr[style*="display: none"]');
        var totalRows = document.querySelectorAll('#receiptsTableBody tr');
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
       RECEIPT EXPORT
       ============================================ */

    function setupReceiptExport() {
        var exportPdf = document.getElementById('exportReceiptPdfBtn');
        var exportExcel = document.getElementById('exportReceiptExcelBtn');

        if (exportPdf) {
            exportPdf.addEventListener('click', function() {
                showReceiptNotification('PDF export initiated (Phase 1 demo)', 'info');
            });
        }

        if (exportExcel) {
            exportExcel.addEventListener('click', function() {
                showReceiptNotification('Excel export initiated (Phase 1 demo)', 'info');
            });
        }
    }

    /* ============================================
       CERTIFICATE GENERATION
       ============================================ */

    function setupCertificateGeneration() {
        var generateBtn = document.getElementById('generateCertificateBtn');
        if (!generateBtn) return;

        generateBtn.addEventListener('click', function() {
            var student = document.getElementById('certStudent');
            var certType = document.getElementById('certType');

            if (!student || !student.value) {
                showReceiptError(student, 'Please select a student');
                return;
            } else {
                clearReceiptError(student);
            }

            if (!certType || !certType.value) {
                showReceiptError(certType, 'Please select a certificate type');
                return;
            } else {
                clearReceiptError(certType);
            }

            var originalText = this.textContent;
            this.textContent = 'Generating...';
            this.disabled = true;

            setTimeout(function() {
                var certNo = 'CERT-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);

                // Update certificate preview
                var preview = document.getElementById('certificatePreview');
                if (preview) {
                    var nameEl = preview.querySelector('.cert-name');
                    var detailsEl = preview.querySelector('.cert-details');
                    var dateEl = preview.querySelector('.cert-date');

                    if (nameEl) nameEl.textContent = student.options[student.selectedIndex]?.text || 'Student';
                    if (detailsEl) detailsEl.textContent = 'Certificate Type: ' + (certType.options[certType.selectedIndex]?.text || 'General');
                    if (dateEl) {
                        var now = new Date();
                        dateEl.textContent = 'Date: ' + now.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        });
                    }

                    // Update certificate title
                    var titleEl = preview.querySelector('.certificate-title');
                    if (titleEl) {
                        var typeMap = {
                            'tc': 'TRANSFER CERTIFICATE',
                            'mc': 'MIGRATION CERTIFICATE',
                            'cc': 'CHARACTER CERTIFICATE',
                            'sc': 'STUDY CERTIFICATE',
                            'bonafide': 'BONAFIDE CERTIFICATE'
                        };
                        titleEl.textContent = typeMap[certType.value] || 'CERTIFICATE';
                    }
                }

                generateBtn.textContent = 'Certificate Generated';
                generateBtn.disabled = false;

                setTimeout(function() {
                    generateBtn.textContent = originalText;
                }, 2000);

                showReceiptNotification('Certificate ' + certNo + ' generated successfully', 'success');
            }, 1200);
        });

        // Print certificate
        var printBtn = document.getElementById('printCertificateBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                var cert = document.querySelector('.certificate-view');
                if (cert) {
                    var printWindow = window.open('', '_blank', 'width=800,height=600');
                    if (printWindow) {
                        var content = cert.cloneNode(true);
                        printWindow.document.write('<html><head><title>Certificate</title>');
                        printWindow.document.write('<style>');
                        printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
                        printWindow.document.write('.certificate-view { max-width: 800px; margin: 0 auto; border: 2px solid #2c3e50; border-radius: 6px; padding: 40px; text-align: center; }');
                        printWindow.document.write('.certificate-header .institution-name { font-size: 28px; font-weight: bold; color: #2c3e50; }');
                        printWindow.document.write('.certificate-header .institution-address { font-size: 13px; color: #95a5a6; }');
                        printWindow.document.write('.certificate-title { font-size: 26px; font-weight: bold; color: #2c3e50; margin: 20px 0; }');
                        printWindow.document.write('.cert-name { font-size: 24px; font-weight: bold; color: #2c3e50; margin: 16px 0; }');
                        printWindow.document.write('.cert-text { font-size: 16px; line-height: 2; }');
                        printWindow.document.write('.cert-details { font-size: 14px; color: #5d6d7e; }');
                        printWindow.document.write('.certificate-footer { display: flex; justify-content: space-between; margin-top: 30px; }');
                        printWindow.document.write('.signature-area { text-align: center; }');
                        printWindow.document.write('.signature-line { width: 150px; border-top: 1px solid #000; margin: 8px auto 0; }');
                        printWindow.document.write('.signature-label { font-size: 11px; color: #95a5a6; }');
                        printWindow.document.write('.cert-date { font-size: 12px; color: #95a5a6; }');
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

        // Download certificate
        var downloadBtn = document.getElementById('downloadCertificateBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showReceiptNotification('Certificate download will be available in Phase 2 (PDF generation)', 'info');
            });
        }
    }

    /* ============================================
       DOCUMENT GENERATOR
       ============================================ */

    function setupDocumentGenerator() {
        var generateBtn = document.getElementById('generateDocBtn');
        if (!generateBtn) return;

        generateBtn.addEventListener('click', function() {
            var docType = document.getElementById('docType');
            var student = document.getElementById('docStudent');
            var title = document.getElementById('docTitle');

            if (!docType || !docType.value) {
                showReceiptError(docType, 'Please select a document type');
                return;
            } else {
                clearReceiptError(docType);
            }

            if (!student || !student.value) {
                showReceiptError(student, 'Please select a student');
                return;
            } else {
                clearReceiptError(student);
            }

            if (!title || !title.value.trim()) {
                showReceiptError(title, 'Please enter a document title');
                return;
            } else {
                clearReceiptError(title);
            }

            var originalText = this.textContent;
            this.textContent = 'Generating...';
            this.disabled = true;

            setTimeout(function() {
                var docId = 'DOC-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);

                showReceiptNotification('Document ' + docId + ' generated successfully', 'success');

                generateBtn.textContent = 'Document Generated';
                generateBtn.disabled = false;

                setTimeout(function() {
                    generateBtn.textContent = originalText;
                }, 2000);
            }, 1200);
        });

        // Preview document
        var previewBtn = document.getElementById('previewDocBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                showReceiptNotification('Document preview will be available in Phase 2', 'info');
            });
        }

        // Download document
        var downloadBtn = document.getElementById('downloadDocBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showReceiptNotification('Document download will be available in Phase 2 (PDF generation)', 'info');
            });
        }
    }

    /* ============================================
       RECEIPT SETTINGS
       ============================================ */

    function setupReceiptSettings() {
        var saveBtn = document.getElementById('saveReceiptSettingsBtn');
        if (!saveBtn) return;

        saveBtn.addEventListener('click', function() {
            // Collect all settings
            var settings = {};
            var inputs = document.querySelectorAll('.receipt-settings .settings-input, .receipt-settings .settings-checkbox input');

            inputs.forEach(function(input) {
                var id = input.id;
                if (id) {
                    if (input.type === 'checkbox') {
                        settings[id] = input.checked;
                    } else {
                        settings[id] = input.value;
                    }
                }
            });

            var originalText = this.textContent;
            this.textContent = 'Saving...';
            this.disabled = true;

            setTimeout(function() {
                // Save to localStorage (Phase 1 demo)
                localStorage.setItem('receipt_settings', JSON.stringify(settings));

                saveBtn.textContent = 'Settings Saved';
                saveBtn.disabled = false;

                setTimeout(function() {
                    saveBtn.textContent = originalText;
                }, 2000);

                showReceiptNotification('Receipt settings saved successfully', 'success');
                console.log('Settings saved:', settings);
            }, 1000);
        });

        // Reset settings
        var resetBtn = document.getElementById('resetReceiptSettingsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('Reset all receipt settings to defaults?')) {
                    var inputs = document.querySelectorAll('.receipt-settings .settings-input');
                    inputs.forEach(function(input) {
                        if (input.placeholder) {
                            input.value = input.placeholder;
                        } else {
                            input.value = '';
                        }
                    });

                    var checkboxes = document.querySelectorAll('.receipt-settings .settings-checkbox input');
                    checkboxes.forEach(function(cb) {
                        cb.checked = cb.defaultChecked || false;
                    });

                    showReceiptNotification('Settings reset to defaults', 'info');
                }
            });
        }

        // Load saved settings
        loadReceiptSettings();
    }

    function loadReceiptSettings() {
        var saved = localStorage.getItem('receipt_settings');
        if (saved) {
            try {
                var settings = JSON.parse(saved);
                for (var key in settings) {
                    var input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = settings[key];
                        } else {
                            input.value = settings[key];
                        }
                    }
                }
                console.log('Settings loaded:', settings);
            } catch (e) {
                console.log('Error loading settings:', e);
            }
        }
    }

    /* ============================================
       ERROR HELPERS
       ============================================ */

    function showReceiptError(input, message) {
        var errorEl = input.parentElement?.querySelector('.form-error') || input.closest('.form-group')?.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        input.style.borderColor = 'var(--danger-color)';
    }

    function clearReceiptError(input) {
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

    function showReceiptNotification(message, type) {
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
