/* ============================================
   STUDENTS.JS
   Student Management JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Student Features -----
        initStudentFeatures();

        // ----- Add Student Form -----
        setupAddStudentForm();

        // ----- Edit Student Form -----
        setupEditStudentForm();

        // ----- Student Search -----
        setupStudentSearch();

        // ----- Student Filters -----
        setupStudentFilters();

        // ----- Delete Student -----
        setupDeleteStudent();

        // ----- Bulk Actions -----
        setupBulkActions();

        // ----- Promotion Functions -----
        setupPromotionFeatures();

        // ----- Transfer Functions -----
        setupTransferFeatures();

        // ----- ID Card Functions -----
        setupIdCardFeatures();

        // ----- Document Functions -----
        setupDocumentFeatures();

        // ----- Student Profile Actions -----
        setupProfileActions();
    });

    /* ============================================
       INITIALIZE STUDENT FEATURES
       ============================================ */

    function initStudentFeatures() {
        // Update student counts if on students page
        updateStudentCounts();

        // Set default dates for forms
        setDefaultDates();
    }

    /* ============================================
       UPDATE STUDENT COUNTS
       ============================================ */

    function updateStudentCounts() {
        // Phase 1: Static counts from table data
        var rows = document.querySelectorAll('#studentsTableBody tr');
        var totalStudents = rows.length;

        // Update pagination info
        var infoEl = document.querySelector('.table-info');
        if (infoEl) {
            var strongTags = infoEl.querySelectorAll('strong');
            if (strongTags.length >= 3) {
                strongTags[0].textContent = '1';
                strongTags[1].textContent = totalStudents > 0 ? totalStudents : '0';
                strongTags[2].textContent = totalStudents;
            }
        }
    }

    /* ============================================
       SET DEFAULT DATES
       ============================================ */

    function setDefaultDates() {
        // Set today's date for admission date
        var admissionDate = document.getElementById('admissionDate');
        if (admissionDate) {
            var today = new Date().toISOString().split('T')[0];
            admissionDate.value = today;
        }

        // Set today's date for transfer date
        var transferDate = document.getElementById('transferDate');
        if (transferDate) {
            var today = new Date().toISOString().split('T')[0];
            transferDate.value = today;
        }
    }

    /* ============================================
       ADD STUDENT FORM
       ============================================ */

    function setupAddStudentForm() {
        var form = document.getElementById('addStudentForm');
        if (!form) return;

        var submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            var isValid = validateStudentForm(form);

            if (!isValid) {
                // Scroll to first error
                var firstError = form.querySelector('.form-error.visible');
                if (firstError) {
                    firstError.closest('.form-group').querySelector('input, select, textarea')?.focus();
                }
                return;
            }

            // Show loading state
            var btnText = submitBtn.querySelector('.btn-text');
            var spinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
            submitBtn.disabled = true;

            // Phase 1: Simulate saving
            setTimeout(function() {
                // Generate admission number
                var admissionNo = generateAdmissionNumber();

                // Show success message
                form.style.display = 'none';
                var successEl = document.getElementById('formSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                    var generatedNo = successEl.querySelector('#generatedAdmissionNo');
                    if (generatedNo) generatedNo.textContent = admissionNo;
                }

                // Reset button state
                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;

                // Log the data (Phase 1 demo)
                console.log('Student added with data:', getFormData(form));
            }, 1200);
        });
    }

    /* ============================================
       EDIT STUDENT FORM
       ============================================ */

    function setupEditStudentForm() {
        var form = document.getElementById('editStudentForm');
        if (!form) return;

        var submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            var isValid = validateStudentForm(form);

            if (!isValid) {
                var firstError = form.querySelector('.form-error.visible');
                if (firstError) {
                    firstError.closest('.form-group').querySelector('input, select, textarea')?.focus();
                }
                return;
            }

            // Show loading state
            var btnText = submitBtn.querySelector('.btn-text');
            var spinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
            submitBtn.disabled = true;

            // Phase 1: Simulate updating
            setTimeout(function() {
                // Show success message
                form.style.display = 'none';
                var successEl = document.getElementById('formSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                }

                // Reset button state
                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;

                console.log('Student updated with data:', getFormData(form));
            }, 1200);
        });
    }

    /* ============================================
       VALIDATE STUDENT FORM
       ============================================ */

    function validateStudentForm(form) {
        var isValid = true;
        var requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(function(field) {
            var errorEl = field.parentElement.querySelector('.form-error');
            var value = field.value.trim();

            if (!value) {
                if (errorEl) {
                    errorEl.textContent = 'This field is required';
                    errorEl.classList.add('visible');
                }
                field.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else {
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.classList.remove('visible');
                }
                field.style.borderColor = '';
            }

            // Email validation
            if (field.type === 'email' && value) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    if (errorEl) {
                        errorEl.textContent = 'Please enter a valid email address';
                        errorEl.classList.add('visible');
                    }
                    field.style.borderColor = 'var(--danger-color)';
                    isValid = false;
                }
            }

            // Phone validation
            if (field.id === 'parentContact' && value) {
                var phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value.replace(/[^0-9]/g, ''))) {
                    if (errorEl) {
                        errorEl.textContent = 'Please enter a valid 10-digit phone number';
                        errorEl.classList.add('visible');
                    }
                    field.style.borderColor = 'var(--danger-color)';
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    /* ============================================
       GET FORM DATA
       ============================================ */

    function getFormData(form) {
        var data = {};
        var inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(function(input) {
            var id = input.id;
            if (id) {
                data[id] = input.value;
            }
        });

        return data;
    }

    /* ============================================
       GENERATE ADMISSION NUMBER
       ============================================ */

    function generateAdmissionNumber() {
        var now = new Date();
        var year = now.getFullYear();
        var random = String(Math.floor(Math.random() * 9000) + 1000);
        return 'JPA-' + year + '-' + random;
    }

    /* ============================================
       STUDENT SEARCH
       ============================================ */

    function setupStudentSearch() {
        var searchInput = document.getElementById('studentSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var rows = document.querySelectorAll('#studentsTableBody tr');

            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });

            updateVisibleCount();
        });
    }

    /* ============================================
       STUDENT FILTERS
       ============================================ */

    function setupStudentFilters() {
        var classFilter = document.getElementById('classFilter');
        var statusFilter = document.getElementById('statusFilter');

        if (!classFilter && !statusFilter) return;

        var filters = [classFilter, statusFilter].filter(Boolean);

        filters.forEach(function(filter) {
            filter.addEventListener('change', function() {
                applyFilters();
            });
        });
    }

    function applyFilters() {
        var classFilter = document.getElementById('classFilter');
        var statusFilter = document.getElementById('statusFilter');

        var classVal = classFilter ? classFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#studentsTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            // Class filter
            if (classVal) {
                var classCell = row.querySelector('td:nth-child(4)');
                var rowClass = classCell ? classCell.textContent.trim() : '';
                if (rowClass !== classVal) show = false;
            }

            // Status filter
            if (statusVal && show) {
                var statusCell = row.querySelector('.status-badge');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });

        updateVisibleCount();
    }

    /* ============================================
       UPDATE VISIBLE COUNT
       ============================================ */

    function updateVisibleCount() {
        var visibleRows = document.querySelectorAll('#studentsTableBody tr[style*="display: none"]');
        var totalRows = document.querySelectorAll('#studentsTableBody tr');
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
       DELETE STUDENT
       ============================================ */

    function setupDeleteStudent() {
        var deleteBtns = document.querySelectorAll('.action-btn.delete');
        var modal = document.getElementById('deleteModal');

        if (!modal) return;

        var confirmBtn = document.getElementById('deleteModalConfirm');
        var cancelBtn = document.getElementById('deleteModalCancel');
        var closeBtn = document.getElementById('deleteModalClose');
        var deleteIdEl = document.getElementById('deleteStudentId');

        var currentId = null;

        deleteBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var id = this.getAttribute('data-id');
                if (id && deleteIdEl) {
                    deleteIdEl.textContent = id;
                    currentId = id;
                }
                modal.classList.remove('hidden');
            });
        });

        // Confirm delete
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                if (currentId) {
                    // Find and remove the row
                    var rows = document.querySelectorAll('#studentsTableBody tr');
                    rows.forEach(function(row) {
                        var idCell = row.querySelector('td:nth-child(2)');
                        if (idCell && idCell.textContent.trim() === currentId) {
                            row.remove();
                        }
                    });

                    // Close modal
                    modal.classList.add('hidden');

                    // Show notification
                    showStudentNotification('Student ' + currentId + ' deleted successfully', 'success');

                    // Update counts
                    updateStudentCounts();
                    updateVisibleCount();

                    currentId = null;
                }
            });
        }

        // Cancel/Close
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                modal.classList.add('hidden');
                currentId = null;
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.add('hidden');
                currentId = null;
            });
        }

        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                currentId = null;
            }
        });
    }

    /* ============================================
       BULK ACTIONS
       ============================================ */

    function setupBulkActions() {
        var selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        selectAll.addEventListener('change', function() {
            var checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(function(cb) {
                cb.checked = selectAll.checked;
            });
            updateSelectedCount();
        });

        // Individual checkboxes
        var rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(function(cb) {
            cb.addEventListener('change', updateSelectedCount);
        });
    }

    function updateSelectedCount() {
        var selected = document.querySelectorAll('.row-checkbox:checked');
        var countEl = document.getElementById('selectedCount');
        if (countEl) {
            countEl.textContent = selected.length;
        }
    }

    /* ============================================
       PROMOTION FEATURES
       ============================================ */

    function setupPromotionFeatures() {
        // Load students button
        var loadBtn = document.getElementById('loadStudentsBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', function() {
                var fromClass = document.getElementById('fromClass');
                var toClass = document.getElementById('toClass');

                if (!fromClass || !toClass) return;

                if (!fromClass.value || !toClass.value) {
                    showStudentNotification('Please select both "From Class" and "To Class"', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;

                setTimeout(function() {
                    var count = Math.floor(Math.random() * 30) + 5;
                    var infoEl = document.querySelector('.table-info');
                    if (infoEl) {
                        var strongTags = infoEl.querySelectorAll('strong');
                        if (strongTags.length >= 3) {
                            strongTags[0].textContent = '1';
                            strongTags[1].textContent = count;
                            strongTags[2].textContent = count;
                        }
                    }
                    loadBtn.textContent = 'Loaded ' + count + ' students';
                    loadBtn.disabled = false;

                    setTimeout(function() {
                        loadBtn.textContent = originalText;
                    }, 2000);

                    // Update summary
                    updatePromotionSummary(count);
                }, 800);
            });
        }

        // Promote selected button
        var promoteBtn = document.getElementById('promoteSelectedBtn');
        if (promoteBtn) {
            promoteBtn.addEventListener('click', function() {
                var selected = document.querySelectorAll('.row-checkbox:checked');
                if (selected.length === 0) {
                    showStudentNotification('Please select at least one student to promote', 'warning');
                    return;
                }

                // Show promote modal
                var modal = document.getElementById('promoteModal');
                if (modal) {
                    var countEl = document.getElementById('promoteCount');
                    if (countEl) countEl.textContent = selected.length;

                    // Get class info
                    var fromClass = document.getElementById('fromClass');
                    var toClass = document.getElementById('toClass');
                    var toSession = document.getElementById('toSession');

                    var fromClassEl = document.getElementById('promoteFromClass');
                    var toClassEl = document.getElementById('promoteToClass');
                    var sessionEl = document.getElementById('promoteSession');

                    if (fromClassEl && fromClass) {
                        fromClassEl.textContent = fromClass.options[fromClass.selectedIndex]?.text || 'N/A';
                    }
                    if (toClassEl && toClass) {
                        toClassEl.textContent = toClass.options[toClass.selectedIndex]?.text || 'N/A';
                    }
                    if (sessionEl && toSession) {
                        sessionEl.textContent = toSession.options[toSession.selectedIndex]?.text || 'N/A';
                    }

                    modal.classList.remove('hidden');

                    // Reset checkboxes
                    var check1 = document.getElementById('confirmEligibility');
                    var check2 = document.getElementById('confirmBackup');
                    if (check1) check1.checked = false;
                    if (check2) check2.checked = false;

                    var confirmBtn = document.getElementById('promoteModalConfirm');
                    if (confirmBtn) confirmBtn.disabled = true;
                }
            });
        }

        // Modal checkboxes validation
        var check1 = document.getElementById('confirmEligibility');
        var check2 = document.getElementById('confirmBackup');
        var confirmBtn = document.getElementById('promoteModalConfirm');

        if (check1 && check2 && confirmBtn) {
            function validateChecklist() {
                confirmBtn.disabled = !(check1.checked && check2.checked);
            }
            check1.addEventListener('change', validateChecklist);
            check2.addEventListener('change', validateChecklist);
        }

        // Confirm promotion
        var confirmPromote = document.getElementById('promoteModalConfirm');
        if (confirmPromote) {
            confirmPromote.addEventListener('click', function() {
                var modal = document.getElementById('promoteModal');
                if (modal) modal.classList.add('hidden');

                // Update statuses
                var selected = document.querySelectorAll('.row-checkbox:checked');
                selected.forEach(function(cb) {
                    var row = cb.closest('tr');
                    if (row) {
                        var statusCell = row.querySelector('.status-badge.pending');
                        if (statusCell) {
                            statusCell.textContent = 'Promoted';
                            statusCell.className = 'status-badge promoted';
                        }
                    }
                });

                showStudentNotification('Students promoted successfully', 'success');
                updatePromotionSummary();
            });
        }

        // Modal close/cancel
        var modal = document.getElementById('promoteModal');
        if (modal) {
            var closeBtn = document.getElementById('promoteModalClose');
            var cancelBtn = document.getElementById('promoteModalCancel');

            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.classList.add('hidden');
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    modal.classList.add('hidden');
                });
            }

            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.add('hidden');
                }
            });
        }
    }

    function updatePromotionSummary(totalCount) {
        var summaryItems = document.querySelectorAll('.summary-item .summary-value');
        if (summaryItems.length >= 4) {
            var eligible = Math.floor(Math.random() * (totalCount || 100));
            var notEligible = Math.floor(Math.random() * 10);
            var promoted = Math.floor(Math.random() * 5);

            summaryItems[0].textContent = totalCount || 124;
            summaryItems[1].textContent = eligible;
            summaryItems[2].textContent = notEligible;
            summaryItems[3].textContent = promoted;
        }
    }

    /* ============================================
       TRANSFER FEATURES
       ============================================ */

    function setupTransferFeatures() {
        // Transfer type toggle
        var transferType = document.getElementById('transferType');
        if (transferType) {
            transferType.addEventListener('change', function() {
                var isInternal = this.value === 'internal';
                var targetClassSelects = document.querySelectorAll('.target-class-select');
                var targetSectionSelects = document.querySelectorAll('.target-section-select');
                var externalInputs = document.querySelectorAll('.target-class-select[type="text"], .target-section-select[type="text"]');

                if (isInternal) {
                    targetClassSelects.forEach(function(el) {
                        el.style.display = '';
                        if (el.tagName === 'SELECT') {
                            el.type = 'select-one';
                            var newEl = document.createElement('select');
                            newEl.className = el.className;
                            newEl.id = el.id;
                            newEl.innerHTML = el.innerHTML;
                            el.parentNode.replaceChild(newEl, el);
                        }
                    });
                    targetSectionSelects.forEach(function(el) {
                        el.style.display = '';
                    });
                } else {
                    targetClassSelects.forEach(function(el) {
                        if (el.tagName === 'SELECT') {
                            var input = document.createElement('input');
                            input.type = 'text';
                            input.className = el.className;
                            input.placeholder = 'Enter institution name';
                            el.parentNode.replaceChild(input, el);
                        }
                    });
                    targetSectionSelects.forEach(function(el) {
                        if (el.tagName === 'SELECT') {
                            var input = document.createElement('input');
                            input.type = 'text';
                            input.className = el.className;
                            input.placeholder = 'Enter new class';
                            el.parentNode.replaceChild(input, el);
                        }
                    });
                }
            });
        }

        // Load students button
        var loadBtn = document.getElementById('loadStudentsBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', function() {
                var fromClass = document.getElementById('fromClass');
                if (!fromClass || !fromClass.value) {
                    showStudentNotification('Please select "From Class"', 'warning');
                    return;
                }

                var originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;

                setTimeout(function() {
                    var count = Math.floor(Math.random() * 25) + 3;
                    var infoEl = document.querySelector('.table-info');
                    if (infoEl) {
                        var strongTags = infoEl.querySelectorAll('strong');
                        if (strongTags.length >= 3) {
                            strongTags[0].textContent = '1';
                            strongTags[1].textContent = count;
                            strongTags[2].textContent = count;
                        }
                    }
                    loadBtn.textContent = 'Loaded ' + count + ' students';
                    loadBtn.disabled = false;

                    setTimeout(function() {
                        loadBtn.textContent = originalText;
                    }, 2000);

                    updateTransferSummary(count);
                }, 800);
            });
        }

        // Transfer selected button
        var transferBtn = document.getElementById('transferSelectedBtn');
        if (transferBtn) {
            transferBtn.addEventListener('click', function() {
                var selected = document.querySelectorAll('.row-checkbox:checked');
                if (selected.length === 0) {
                    showStudentNotification('Please select at least one student to transfer', 'warning');
                    return;
                }

                var modal = document.getElementById('transferModal');
                if (modal) {
                    var countEl = document.getElementById('transferCount');
                    if (countEl) countEl.textContent = selected.length;

                    // Build transfer details
                    var detailsEl = document.getElementById('transferDetails');
                    if (detailsEl) {
                        var html = '<table><thead><tr><th>Student</th><th>From</th><th>To</th></tr></thead><tbody>';
                        selected.forEach(function(cb, index) {
                            var row = cb.closest('tr');
                            if (row) {
                                var cells = row.querySelectorAll('td');
                                var name = cells[2]?.textContent?.trim() || 'Student ' + (index + 1);
                                var fromClass = cells[3]?.textContent?.trim() || 'N/A';
                                var targetClass = row.querySelector('.target-class-select, input[type="text"]');
                                var targetVal = targetClass ? targetClass.value || 'N/A' : 'N/A';
                                html += '<tr><td>' + name + '</td><td>' + fromClass + '</td><td>' + targetVal + '</td></tr>';
                            }
                        });
                        html += '</tbody></table>';
                        detailsEl.innerHTML = html;
                    }

                    modal.classList.remove('hidden');

                    var check1 = document.getElementById('confirmTransfer');
                    var check2 = document.getElementById('confirmBackup');
                    var confirmBtn = document.getElementById('transferModalConfirm');

                    if (check1) check1.checked = false;
                    if (check2) check2.checked = false;
                    if (confirmBtn) confirmBtn.disabled = true;

                    // Validation
                    if (check1 && check2 && confirmBtn) {
                        function validateChecklist() {
                            confirmBtn.disabled = !(check1.checked && check2.checked);
                        }
                        check1.addEventListener('change', validateChecklist);
                        check2.addEventListener('change', validateChecklist);
                    }

                    // Confirm
                    var confirmTransfer = document.getElementById('transferModalConfirm');
                    if (confirmTransfer) {
                        confirmTransfer.addEventListener('click', function() {
                            modal.classList.add('hidden');
                            selected.forEach(function(cb) {
                                var row = cb.closest('tr');
                                if (row) {
                                    var statusCell = row.querySelector('.status-badge.active, .status-badge.pending');
                                    if (statusCell) {
                                        statusCell.textContent = 'Transferred';
                                        statusCell.className = 'status-badge transferred';
                                    }
                                }
                            });
                            showStudentNotification('Students transferred successfully', 'success');
                            updateTransferSummary();
                        });
                    }

                    // Close
                    var closeBtn = document.getElementById('transferModalClose');
                    var cancelBtn = document.getElementById('transferModalCancel');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', function() {
                            modal.classList.add('hidden');
                        });
                    }
                    if (cancelBtn) {
                        cancelBtn.addEventListener('click', function() {
                            modal.classList.add('hidden');
                        });
                    }
                    modal.addEventListener('click', function(e) {
                        if (e.target === this) {
                            this.classList.add('hidden');
                        }
                    });
                }
            });
        }
    }

    function updateTransferSummary(totalCount) {
        var summaryItems = document.querySelectorAll('.transfer-summary .summary-value');
        if (summaryItems.length >= 4) {
            var internal = Math.floor(Math.random() * (totalCount || 96));
            var external = Math.floor(Math.random() * (totalCount - internal || 10));
            var pending = Math.floor(Math.random() * 10);

            summaryItems[0].textContent = totalCount || 96;
            summaryItems[1].textContent = internal;
            summaryItems[2].textContent = external;
            summaryItems[3].textContent = pending;
        }
    }

    /* ============================================
       ID CARD FEATURES
       ============================================ */

    function setupIdCardFeatures() {
        // Generate selected ID cards
        var generateBtn = document.getElementById('generateSelectedBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                var selected = document.querySelectorAll('.row-checkbox:checked');
                if (selected.length === 0) {
                    showStudentNotification('Please select at least one student', 'warning');
                    return;
                }

                selected.forEach(function(cb) {
                    var row = cb.closest('tr');
                    if (row) {
                        var statusCell = row.querySelector('.status-badge.pending');
                        if (statusCell) {
                            statusCell.textContent = 'Generated';
                            statusCell.className = 'status-badge generated';
                        }
                        var cardIdCell = row.querySelector('td:nth-child(6)');
                        if (cardIdCell && cardIdCell.textContent === '—') {
                            var admissionNo = row.querySelector('td:nth-child(2)')?.textContent?.trim() || '000';
                            cardIdCell.textContent = 'JPA-ID-' + admissionNo;
                        }
                        var dateCell = row.querySelector('td:nth-child(7)');
                        if (dateCell && dateCell.textContent === '—') {
                            dateCell.textContent = new Date().toISOString().slice(0, 10);
                        }
                    }
                });

                updateIdCardStats();
                showStudentNotification(selected.length + ' ID card(s) generated', 'success');
            });
        }

        // Preview ID card on row hover
        var viewBtns = document.querySelectorAll('.action-btn.view');
        viewBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var row = this.closest('tr');
                if (row) {
                    var name = row.querySelector('td:nth-child(3) a')?.textContent || 'Student';
                    var admissionNo = row.querySelector('td:nth-child(2)')?.textContent || 'N/A';
                    var classVal = row.querySelector('td:nth-child(4)')?.textContent || 'N/A';
                    var section = row.querySelector('td:nth-child(5)')?.textContent || 'N/A';
                    var cardId = row.querySelector('td:nth-child(6)')?.textContent || 'N/A';
                    var dob = '15 May 2010'; // Default demo value
                    var bloodGroup = 'O+'; // Default demo value

                    // Update preview
                    updateIdCardPreview(name, admissionNo, classVal + '-' + section, cardId, dob, bloodGroup);
                }
            });
        });

        // Preview card button
        var previewBtn = document.getElementById('previewCardBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                var firstRow = document.querySelector('#idCardTableBody tr');
                if (firstRow) {
                    var name = firstRow.querySelector('td:nth-child(3) a')?.textContent || 'Aarav Sharma';
                    var admissionNo = firstRow.querySelector('td:nth-child(2)')?.textContent || 'JPA-2026-001';
                    var classVal = firstRow.querySelector('td:nth-child(4)')?.textContent || '10';
                    var section = firstRow.querySelector('td:nth-child(5)')?.textContent || 'A';
                    var cardId = firstRow.querySelector('td:nth-child(6)')?.textContent || 'JPA-ID-2026-001';

                    updateIdCardPreview(name, admissionNo, classVal + '-' + section, cardId, '15 May 2010', 'O+');
                } else {
                    showStudentNotification('No student data available for preview', 'warning');
                }
            });
        }
    }

    function updateIdCardPreview(name, admissionNo, classVal, cardId, dob, bloodGroup) {
        var preview = document.getElementById('idCardPreview');
        if (!preview) return;

        var nameEl = preview.querySelector('.id-card-name');
        var admissionEl = preview.querySelector('.id-card-field .field-value');
        var classEl = preview.querySelectorAll('.id-card-field .field-value')[1];
        var dobEl = preview.querySelectorAll('.id-card-field .field-value')[2];
        var bloodEl = preview.querySelectorAll('.id-card-field .field-value')[3];
        var cardIdEl = preview.querySelector('.id-card-id');
        var avatar = preview.querySelector('.id-card-avatar');

        if (nameEl) nameEl.textContent = name;
        if (admissionEl) admissionEl.textContent = admissionNo;
        if (classEl) classEl.textContent = classVal;
        if (dobEl) dobEl.textContent = dob;
        if (bloodEl) bloodEl.textContent = bloodGroup;
        if (cardIdEl) cardIdEl.textContent = 'ID: ' + cardId;

        // Update avatar initials
        if (avatar) {
            var initials = name.split(' ').map(function(word) { return word[0]; }).join('').toUpperCase().slice(0, 2);
            avatar.innerHTML = '<span style="font-size:24px;font-weight:bold;color:var(--text-muted);">' + initials + '</span>';
        }
    }

    function updateIdCardStats() {
        var generated = document.querySelectorAll('.status-badge.generated, .status-badge.printed');
        var total = document.querySelectorAll('.row-checkbox');

        var genCountEl = document.querySelector('.stat-card.generated .stat-value');
        var pendingCountEl = document.querySelector('.stat-card.pending .stat-value');

        if (genCountEl) {
            genCountEl.textContent = generated.length;
        }
        if (pendingCountEl && total) {
            var pending = total.length - generated.length;
            pendingCountEl.textContent = pending > 0 ? pending : 0;
        }
    }

    /* ============================================
       DOCUMENT FEATURES
       ============================================ */

    function setupDocumentFeatures() {
        // Upload document button
        var uploadBtn = document.getElementById('uploadDocumentBtn');
        var modal = document.getElementById('uploadModal');

        if (uploadBtn && modal) {
            uploadBtn.addEventListener('click', function() {
                modal.classList.remove('hidden');
                var form = document.getElementById('uploadForm');
                if (form) form.reset();
                // Clear errors
                var errors = form.querySelectorAll('.form-error');
                errors.forEach(function(el) {
                    el.textContent = '';
                    el.classList.remove('visible');
                });
            });

            // Modal close
            var closeBtn = document.getElementById('uploadModalClose');
            var cancelBtn = document.getElementById('uploadModalCancel');
            var confirmBtn = document.getElementById('uploadModalConfirm');

            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.classList.add('hidden');
                });
            }
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    modal.classList.add('hidden');
                });
            }
            if (confirmBtn) {
                confirmBtn.addEventListener('click', function() {
                    var form = document.getElementById('uploadForm');
                    if (!form) return;

                    var student = document.getElementById('docStudent');
                    var docName = document.getElementById('docName');
                    var category = document.getElementById('docCategory');
                    var file = document.getElementById('docFile');

                    var isValid = true;

                    if (!student.value) {
                        showError(student, 'Please select a student');
                        isValid = false;
                    } else {
                        clearError(student);
                    }

                    if (!docName.value.trim()) {
                        showError(docName, 'Document name is required');
                        isValid = false;
                    } else {
                        clearError(docName);
                    }

                    if (!category.value) {
                        showError(category, 'Please select a category');
                        isValid = false;
                    } else {
                        clearError(category);
                    }

                    if (!file.files || file.files.length === 0) {
                        showError(file, 'Please select a file');
                        isValid = false;
                    } else {
                        clearError(file);
                        var fileSize = file.files[0].size / (1024 * 1024);
                        if (fileSize > 10) {
                            showError(file, 'File size must be less than 10 MB');
                            isValid = false;
                        }
                    }

                    if (!isValid) return;

                    confirmBtn.textContent = 'Uploading...';
                    confirmBtn.disabled = true;

                    setTimeout(function() {
                        modal.classList.add('hidden');
                        confirmBtn.textContent = 'Upload Document';
                        confirmBtn.disabled = false;
                        showStudentNotification('Document uploaded successfully', 'success');

                        // Add to table
                        var tbody = document.getElementById('documentsTableBody');
                        if (tbody) {
                            var row = document.createElement('tr');
                            var docId = 'DOC-2026-' + String(Math.floor(Math.random() * 900) + 100);
                            var studentName = student.options[student.selectedIndex]?.text || 'Unknown';
                            var admissionNo = student.value || 'N/A';
                            var catName = category.options[category.selectedIndex]?.text || 'Other';
                            var catClass = 'category-badge ' + category.value;
                            var date = new Date().toISOString().slice(0, 10);

                            row.innerHTML = `
                                <td><input type="checkbox" class="row-checkbox" /></td>
                                <td>${docId}</td>
                                <td>${docName.value.trim()}</td>
                                <td><a href="student-profile.html" class="student-link">${studentName}</a></td>
                                <td>${admissionNo}</td>
                                <td><span class="${catClass}">${catName}</span></td>
                                <td>${date}</td>
                                <td>${(file.files[0]?.size / (1024 * 1024)).toFixed(1)} MB</td>
                                <td><span class="status-badge pending">Pending</span></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view" title="View Document">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        </button>
                                        <button class="action-btn download" title="Download">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                        </button>
                                        <button class="action-btn delete" title="Delete" data-id="${docId}">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            `;
                            tbody.prepend(row);
                            setupDeleteStudent();
                            setupBulkActions();
                        }
                    }, 1200);
                });
            }
        }

        // Category filters
        var categories = document.querySelectorAll('.category-badge');
        var filterSelect = document.getElementById('docCategoryFilter');

        if (categories.length && filterSelect) {
            categories.forEach(function(cat) {
                cat.style.cursor = 'pointer';
                cat.addEventListener('click', function() {
                    var category = this.textContent.trim().toLowerCase();
                    var options = filterSelect.options;
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].text.toLowerCase() === category) {
                            filterSelect.selectedIndex = i;
                            filterSelect.dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                });
            });
        }

        // Bulk upload button
        var bulkBtn = document.getElementById('bulkUploadBtn');
        if (bulkBtn) {
            bulkBtn.addEventListener('click', function() {
                showStudentNotification('Bulk upload feature coming in Phase 2', 'info');
            });
        }
    }

    /* ============================================
       PROFILE ACTIONS
       ============================================ */

    function setupProfileActions() {
        // Print profile button (if exists)
        var printBtn = document.querySelector('.print-profile-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }

        // Download profile button (if exists)
        var downloadBtn = document.querySelector('.download-profile-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showStudentNotification('Profile download will be available in Phase 2', 'info');
            });
        }

        // Edit button is handled by navigation
    }

    /* ============================================
       ERROR HELPERS
       ============================================ */

    function showError(input, message) {
        var errorEl = input.parentElement?.querySelector('.form-error') || input.closest('.form-group')?.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        input.style.borderColor = 'var(--danger-color)';
    }

    function clearError(input) {
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

    function showStudentNotification(message, type) {
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
