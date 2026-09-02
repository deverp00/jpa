/* ============================================
   EXPORT.JS
   Export Functionality (PDF, Excel, Print)
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Export Features -----
        initExportFeatures();

        // ----- PDF Export -----
        setupPdfExport();

        // ----- Excel Export -----
        setupExcelExport();

        // ----- Print Export -----
        setupPrintExport();

        // ----- CSV Export -----
        setupCsvExport();

        // ----- JSON Export -----
        setupJsonExport();
    });

    /* ============================================
       INITIALIZE EXPORT FEATURES
       ============================================ */

    function initExportFeatures() {
        // Add export buttons to any table if they don't exist
        addExportButtons();

        // Set up export button click handlers
        setupExportButtonHandlers();
    }

    /* ============================================
       ADD EXPORT BUTTONS
       ============================================ */

    function addExportButtons() {
        // Check if toolbar already has export buttons
        var toolbars = document.querySelectorAll('.data-toolbar .toolbar-right');
        toolbars.forEach(function(toolbar) {
            if (!toolbar.querySelector('.export-group')) {
                var exportGroup = document.createElement('div');
                exportGroup.className = 'export-group';
                exportGroup.innerHTML = `
                    <button class="btn btn-outline export-pdf-btn" title="Export as PDF">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="12" y1="18" x2="12" y2="12"/>
                            <line x1="9" y1="15" x2="12" y2="18"/>
                            <line x1="15" y1="15" x2="12" y2="18"/>
                        </svg>
                        PDF
                    </button>
                    <button class="btn btn-outline export-excel-btn" title="Export as Excel">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="8" y1="16" x2="16" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                            <line x1="8" y1="8" x2="10" y2="8"/>
                        </svg>
                        Excel
                    </button>
                    <button class="btn btn-outline export-print-btn" title="Print">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"/>
                            <path d="M18 9H6"/>
                            <path d="M18 13H6"/>
                            <path d="M6 17h12v4H6z"/>
                        </svg>
                        Print
                    </button>
                `;
                toolbar.appendChild(exportGroup);
            }
        });
    }

    /* ============================================
       SETUP EXPORT BUTTON HANDLERS
       ============================================ */

    function setupExportButtonHandlers() {
        // PDF Export
        var pdfBtns = document.querySelectorAll('.export-pdf-btn, #exportPdfBtn');
        pdfBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    exportToPdf(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to export', 'warning');
                }
            });
        });

        // Excel Export
        var excelBtns = document.querySelectorAll('.export-excel-btn, #exportExcelBtn');
        excelBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    exportToExcel(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to export', 'warning');
                }
            });
        });

        // Print Export
        var printBtns = document.querySelectorAll('.export-print-btn, #exportPrintBtn');
        printBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    printTable(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to print', 'warning');
                }
            });
        });

        // CSV Export (hidden feature)
        var csvBtns = document.querySelectorAll('.export-csv-btn');
        csvBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    exportToCsv(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to export', 'warning');
                }
            });
        });

        // JSON Export (hidden feature)
        var jsonBtns = document.querySelectorAll('.export-json-btn');
        jsonBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    exportToJson(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to export', 'warning');
                }
            });
        });
    }

    /* ============================================
       FIND TABLE
       ============================================ */

    function findTable(element) {
        // Try to find the closest table
        var table = element.closest('.table-responsive')?.querySelector('table');
        if (table) return table;

        // Try parent container
        var container = element.closest('.panel-body, .main-content, .data-toolbar');
        if (container) {
            table = container.querySelector('table');
            if (table) return table;
        }

        // Try document-wide search
        table = document.querySelector('.data-table, .table-responsive table, .panel-body table');
        return table || null;
    }

    /* ============================================
       GET TABLE TITLE
       ============================================ */

    function getTableTitle(table) {
        // Try to find a title from the page
        var title = document.querySelector('.page-title')?.textContent?.trim() || 'Export';

        // Check for panel title
        var panel = table.closest('.panel');
        if (panel) {
            var panelTitle = panel.querySelector('.panel-title')?.textContent?.trim();
            if (panelTitle) title = panelTitle;
        }

        return title;
    }

    /* ============================================
       PDF EXPORT
       ============================================ */

    function exportToPdf(table, title) {
        showExportNotification('Generating PDF...', 'info');

        // In Phase 1, we simulate PDF generation
        // In Phase 2, this will use a proper PDF library

        setTimeout(function() {
            var html = generatePdfHtml(table, title);
            var blob = new Blob([html], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = title.replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showExportNotification('PDF exported successfully (Phase 1 demo)', 'success');
        }, 800);
    }

    function generatePdfHtml(table, title) {
        var institutionName = document.querySelector('.brand-name')?.textContent || 'Janaki Professional Academy';
        var institutionAddress = 'Dikhlem, Dayangmukh West, Karbi Anglong, Assam, India – 782448';
        var institutionPhone = '7896579939';
        var institutionEmail = 'janakipa@gmail.com';

        var now = new Date();
        var dateStr = now.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        var timeStr = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        var tableHtml = table.outerHTML;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>${title}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        padding: 40px 30px;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #2c3e50;
                    }
                    .pdf-container {
                        max-width: 1000px;
                        margin: 0 auto;
                    }
                    .pdf-header {
                        text-align: center;
                        padding-bottom: 16px;
                        border-bottom: 2px solid #2c3e50;
                        margin-bottom: 16px;
                    }
                    .pdf-header .school-name {
                        font-size: 22px;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .pdf-header .school-address {
                        font-size: 11px;
                        color: #95a5a6;
                        margin-top: 4px;
                    }
                    .pdf-header .school-contact {
                        font-size: 11px;
                        color: #95a5a6;
                    }
                    .pdf-title {
                        font-size: 18px;
                        font-weight: bold;
                        text-align: center;
                        margin: 16px 0;
                        color: #2c3e50;
                    }
                    .pdf-meta {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        color: #95a5a6;
                        margin-bottom: 12px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11px;
                        margin: 12px 0;
                    }
                    table thead th {
                        background: #f8f9fa;
                        padding: 8px 10px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                        border: 1px solid #e5e8e8;
                        color: #5d6d7e;
                    }
                    table tbody td {
                        padding: 6px 10px;
                        border: 1px solid #e5e8e8;
                    }
                    table tbody tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .pdf-footer {
                        text-align: center;
                        padding-top: 16px;
                        border-top: 1px solid #e5e8e8;
                        margin-top: 16px;
                        font-size: 10px;
                        color: #95a5a6;
                    }
                    .pdf-footer .signature {
                        margin-top: 20px;
                    }
                    .pdf-footer .signature-line {
                        width: 150px;
                        border-top: 1px solid #2c3e50;
                        margin: 8px auto 0;
                    }
                    .pdf-footer .signature-label {
                        font-size: 10px;
                        color: #95a5a6;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="pdf-container">
                    <div class="pdf-header">
                        <div class="school-name">${institutionName}</div>
                        <div class="school-address">${institutionAddress}</div>
                        <div class="school-contact">Phone: ${institutionPhone} | Email: ${institutionEmail}</div>
                    </div>

                    <div class="pdf-title">${title}</div>

                    <div class="pdf-meta">
                        <span>Generated: ${dateStr} at ${timeStr}</span>
                        <span>Academic Session: ${document.getElementById('academicSession')?.textContent || '2026-2027'}</span>
                    </div>

                    ${tableHtml}

                    <div class="pdf-footer">
                        <p>This is a system-generated document. For any queries, please contact the administration.</p>
                        <div class="signature">
                            <div class="signature-line"></div>
                            <div class="signature-label">Authorized Signature</div>
                        </div>
                        <p style="margin-top:8px;">&copy; ${now.getFullYear()} ${institutionName}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /* ============================================
       EXCEL EXPORT
       ============================================ */

    function exportToExcel(table, title) {
        showExportNotification('Generating Excel...', 'info');

        setTimeout(function() {
            var csv = tableToCsv(table);
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = title.replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showExportNotification('Excel exported successfully (Phase 1 demo)', 'success');
        }, 800);
    }

    function tableToCsv(table) {
        var rows = table.querySelectorAll('tr');
        var csv = [];

        rows.forEach(function(row) {
            var cells = row.querySelectorAll('th, td');
            var rowData = [];
            cells.forEach(function(cell) {
                var text = cell.textContent.trim();
                // Remove action buttons and checkboxes from data
                if (cell.querySelector('.action-btns')) {
                    return;
                }
                if (cell.querySelector('input[type="checkbox"]')) {
                    return;
                }
                // Escape commas and quotes
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                    text = '"' + text.replace(/"/g, '""') + '"';
                }
                rowData.push(text);
            });
            if (rowData.length > 0) {
                csv.push(rowData.join(','));
            }
        });

        return csv.join('\n');
    }

    /* ============================================
       PRINT EXPORT
       ============================================ */

    function printTable(table, title) {
        var printWindow = window.open('', '_blank', 'width=1000,height=800');
        if (!printWindow) {
            showExportNotification('Please allow popups for printing', 'warning');
            return;
        }

        var html = generatePdfHtml(table, title);
        printWindow.document.write(html);
        printWindow.document.close();

        // Wait for content to load then print
        setTimeout(function() {
            printWindow.print();
        }, 500);
    }

    /* ============================================
       CSV EXPORT
       ============================================ */

    function setupCsvExport() {
        var csvBtns = document.querySelectorAll('.export-csv-btn');
        csvBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    exportToCsv(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to export', 'warning');
                }
            });
        });
    }

    function exportToCsv(table, title) {
        var csv = tableToCsv(table);
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = title.replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showExportNotification('CSV exported successfully (Phase 1 demo)', 'success');
    }

    /* ============================================
       JSON EXPORT
       ============================================ */

    function setupJsonExport() {
        var jsonBtns = document.querySelectorAll('.export-json-btn');
        jsonBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var table = findTable(this);
                if (table) {
                    exportToJson(table, getTableTitle(table));
                } else {
                    showExportNotification('No table found to export', 'warning');
                }
            });
        });
    }

    function exportToJson(table, title) {
        var data = [];
        var headers = [];
        var headerRow = table.querySelector('thead tr');
        if (headerRow) {
            var headerCells = headerRow.querySelectorAll('th');
            headerCells.forEach(function(th) {
                headers.push(th.textContent.trim());
            });
        }

        var bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(function(row) {
            var rowData = {};
            var cells = row.querySelectorAll('td');
            cells.forEach(function(cell, index) {
                if (index < headers.length) {
                    var text = cell.textContent.trim();
                    // Skip checkbox cells and action cells
                    if (cell.querySelector('input[type="checkbox"]')) return;
                    if (cell.querySelector('.action-btns')) return;
                    rowData[headers[index] || 'column_' + index] = text;
                }
            });
            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        });

        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = title.replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showExportNotification('JSON exported successfully (Phase 1 demo)', 'success');
    }

    /* ============================================
       EXPORT NOTIFICATION
       ============================================ */

    function showExportNotification(message, type) {
        var colors = {
            success: { bg: '#27ae60', color: '#fff' },
            info: { bg: '#3498db', color: '#fff' },
            warning: { bg: '#f39c12', color: '#fff' },
            error: { bg: '#e74c3c', color: '#fff' }
        };

        var style = colors[type] || colors.info;

        // Remove existing notifications
        var existing = document.querySelectorAll('.export-notification');
        existing.forEach(function(el) { el.remove(); });

        var msg = document.createElement('div');
        msg.className = 'export-notification';
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
