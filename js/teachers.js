/* ============================================
   TEACHERS.JS
   Teacher & Staff Management JavaScript
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Initialize Teacher Features -----
        initTeacherFeatures();

        // ----- Add Teacher Form -----
        setupAddTeacherForm();

        // ----- Edit Teacher Form -----
        setupEditTeacherForm();

        // ----- Teacher Search -----
        setupTeacherSearch();

        // ----- Teacher Filters -----
        setupTeacherFilters();

        // ----- Delete Teacher -----
        setupDeleteTeacher();

        // ----- Bulk Actions -----
        setupBulkActions();

        // ----- Staff Management -----
        setupStaffFeatures();

        // ----- Staff Profile Actions -----
        setupStaffProfileActions();
    });

    /* ============================================
       INITIALIZE TEACHER FEATURES
       ============================================ */

    function initTeacherFeatures() {
        // Update teacher counts if on teachers page
        updateTeacherCounts();

        // Set default dates for forms
        setDefaultDates();

        // Initialize department badges
        initDepartmentBadges();
    }

    /* ============================================
       UPDATE TEACHER COUNTS
       ============================================ */

    function updateTeacherCounts() {
        var rows = document.querySelectorAll('#teachersTableBody tr');
        var totalTeachers = rows.length;

        var infoEl = document.querySelector('.table-info');
        if (infoEl) {
            var strongTags = infoEl.querySelectorAll('strong');
            if (strongTags.length >= 3) {
                strongTags[0].textContent = totalTeachers > 0 ? '1' : '0';
                strongTags[1].textContent = totalTeachers;
                strongTags[2].textContent = totalTeachers;
            }
        }

        // Update stats cards if present
        var statValues = document.querySelectorAll('.teacher-stats .stat-value');
        if (statValues.length >= 3) {
            var active = document.querySelectorAll('.status-badge.active').length;
            var onLeave = document.querySelectorAll('.status-badge.on-leave').length;
            var inactive = document.querySelectorAll('.status-badge.inactive').length;

            statValues[0].textContent = totalTeachers;
            statValues[1].textContent = active || totalTeachers - (onLeave + inactive);
            statValues[2].textContent = onLeave || 0;
        }
    }

    /* ============================================
       SET DEFAULT DATES
       ============================================ */

    function setDefaultDates() {
        var joiningDate = document.getElementById('joiningDate');
        if (joiningDate) {
            var today = new Date().toISOString().split('T')[0];
            joiningDate.value = today;
        }

        var dobDate = document.getElementById('dob');
        if (dobDate) {
            // Set a default date 30 years ago
            var date = new Date();
            date.setFullYear(date.getFullYear() - 30);
            dobDate.value = date.toISOString().split('T')[0];
        }
    }

    /* ============================================
       INIT DEPARTMENT BADGES
       ============================================ */

    function initDepartmentBadges() {
        var deptCells = document.querySelectorAll('#teachersTableBody td:nth-child(4)');
        deptCells.forEach(function(cell) {
            var dept = cell.textContent.trim().toLowerCase();
            var colors = {
                science: { bg: '#d6eaf8', color: '#2471a3' },
                mathematics: { bg: '#fdebd0', color: '#b9770e' },
                english: { bg: '#d5f5e3', color: '#1e8449' },
                'social studies': { bg: '#fadbd8', color: '#b03a2e' },
                'computer science': { bg: '#e8daef', color: '#7d3c98' }
            };

            var color = colors[dept] || { bg: '#f0f0f0', color: '#5d6d7e' };
            cell.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;background:' + color.bg + ';color:' + color.color + ';font-size:11px;font-weight:500;';
        });
    }

    /* ============================================
       ADD TEACHER FORM
       ============================================ */

    function setupAddTeacherForm() {
        var form = document.getElementById('addTeacherForm');
        if (!form) return;

        var submitBtn = form.querySelector('[type="submit"]');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var isValid = validateTeacherForm(form);

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

            // Phase 1: Simulate saving
            setTimeout(function() {
                var teacherId = generateTeacherId();

                // Show success
                form.style.display = 'none';
                var successEl = document.getElementById('formSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                    var generatedId = successEl.querySelector('#generatedTeacherId');
                    if (generatedId) generatedId.textContent = teacherId;
                }

                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;

                console.log('Teacher added with data:', getFormData(form));
            }, 1200);
        });
    }

    /* ============================================
       EDIT TEACHER FORM
       ============================================ */

    function setupEditTeacherForm() {
        var form = document.getElementById('editTeacherForm');
        if (!form) return;

        var submitBtn = form.querySelector('[type="submit"]');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var isValid = validateTeacherForm(form);

            if (!isValid) {
                var firstError = form.querySelector('.form-error.visible');
                if (firstError) {
                    firstError.closest('.form-group').querySelector('input, select, textarea')?.focus();
                }
                return;
            }

            var btnText = submitBtn.querySelector('.btn-text');
            var spinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
            submitBtn.disabled = true;

            setTimeout(function() {
                form.style.display = 'none';
                var successEl = document.getElementById('formSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                }

                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;

                console.log('Teacher updated with data:', getFormData(form));
            }, 1200);
        });
    }

    /* ============================================
       VALIDATE TEACHER FORM
       ============================================ */

    function validateTeacherForm(form) {
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
            if (field.id === 'contactNumber' && value) {
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
       GENERATE TEACHER ID
       ============================================ */

    function generateTeacherId() {
        var now = new Date();
        var year = now.getFullYear();
        var random = String(Math.floor(Math.random() * 9000) + 1000);
        return 'TCH-' + year + '-' + random;
    }

    /* ============================================
       TEACHER SEARCH
       ============================================ */

    function setupTeacherSearch() {
        var searchInput = document.getElementById('teacherSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var rows = document.querySelectorAll('#teachersTableBody tr');

            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });

            updateTeacherVisibleCount();
        });
    }

    /* ============================================
       TEACHER FILTERS
       ============================================ */

    function setupTeacherFilters() {
        var deptFilter = document.getElementById('deptFilter');
        var statusFilter = document.getElementById('statusFilter');

        if (!deptFilter && !statusFilter) return;

        var filters = [deptFilter, statusFilter].filter(Boolean);

        filters.forEach(function(filter) {
            filter.addEventListener('change', applyTeacherFilters);
        });
    }

    function applyTeacherFilters() {
        var deptFilter = document.getElementById('deptFilter');
        var statusFilter = document.getElementById('statusFilter');

        var deptVal = deptFilter ? deptFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#teachersTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            // Department filter
            if (deptVal) {
                var deptCell = row.querySelector('td:nth-child(4)');
                var rowDept = deptCell ? deptCell.textContent.trim().toLowerCase() : '';
                if (rowDept !== deptVal) show = false;
            }

            // Status filter
            if (statusVal && show) {
                var statusCell = row.querySelector('.status-badge');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });

        updateTeacherVisibleCount();
    }

    function updateTeacherVisibleCount() {
        var visibleRows = document.querySelectorAll('#teachersTableBody tr[style*="display: none"]');
        var totalRows = document.querySelectorAll('#teachersTableBody tr');
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
       DELETE TEACHER
       ============================================ */

    function setupDeleteTeacher() {
        var deleteBtns = document.querySelectorAll('.action-btn.delete');
        var modal = document.getElementById('deleteModal');

        if (!modal) return;

        var confirmBtn = document.getElementById('deleteModalConfirm');
        var cancelBtn = document.getElementById('deleteModalCancel');
        var closeBtn = document.getElementById('deleteModalClose');
        var deleteIdEl = document.getElementById('deleteTeacherId');

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

        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                if (currentId) {
                    var rows = document.querySelectorAll('#teachersTableBody tr');
                    rows.forEach(function(row) {
                        var idCell = row.querySelector('td:nth-child(2)');
                        if (idCell && idCell.textContent.trim() === currentId) {
                            row.remove();
                        }
                    });

                    modal.classList.add('hidden');
                    showTeacherNotification('Teacher ' + currentId + ' deleted successfully', 'success');
                    updateTeacherCounts();
                    currentId = null;
                }
            });
        }

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
            updateTeacherSelectedCount();
        });

        var rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(function(cb) {
            cb.addEventListener('change', updateTeacherSelectedCount);
        });
    }

    function updateTeacherSelectedCount() {
        var selected = document.querySelectorAll('.row-checkbox:checked');
        var countEl = document.getElementById('selectedCount');
        if (countEl) {
            countEl.textContent = selected.length;
        }
    }

    /* ============================================
       STAFF MANAGEMENT
       ============================================ */

    function setupStaffFeatures() {
        // Staff search
        var staffSearch = document.getElementById('staffSearch');
        if (staffSearch) {
            staffSearch.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var rows = document.querySelectorAll('#staffTableBody tr');

                rows.forEach(function(row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });

                updateStaffCounts();
            });
        }

        // Staff filters
        var deptFilter = document.getElementById('staffDeptFilter');
        var statusFilter = document.getElementById('staffStatusFilter');

        if (deptFilter || statusFilter) {
            var filters = [deptFilter, statusFilter].filter(Boolean);
            filters.forEach(function(filter) {
                filter.addEventListener('change', applyStaffFilters);
            });
        }

        // Staff stats
        updateStaffStats();
    }

    function applyStaffFilters() {
        var deptFilter = document.getElementById('staffDeptFilter');
        var statusFilter = document.getElementById('staffStatusFilter');

        var deptVal = deptFilter ? deptFilter.value : '';
        var statusVal = statusFilter ? statusFilter.value : '';

        var rows = document.querySelectorAll('#staffTableBody tr');

        rows.forEach(function(row) {
            var show = true;

            if (deptVal) {
                var deptCell = row.querySelector('td:nth-child(4)');
                var rowDept = deptCell ? deptCell.textContent.trim().toLowerCase() : '';
                if (rowDept !== deptVal) show = false;
            }

            if (statusVal && show) {
                var statusCell = row.querySelector('.status-badge');
                var rowStatus = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
                if (rowStatus !== statusVal) show = false;
            }

            row.style.display = show ? '' : 'none';
        });

        updateStaffCounts();
    }

    function updateStaffCounts() {
        var visibleRows = document.querySelectorAll('#staffTableBody tr[style*="display: none"]');
        var totalRows = document.querySelectorAll('#staffTableBody tr');
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

    function updateStaffStats() {
        var rows = document.querySelectorAll('#staffTableBody tr');
        var total = rows.length;

        var active = document.querySelectorAll('#staffTableBody .status-badge.active').length;
        var onLeave = document.querySelectorAll('#staffTableBody .status-badge.on-leave').length;
        var inactive = document.querySelectorAll('#staffTableBody .status-badge.inactive').length;

        var statValues = document.querySelectorAll('.staff-stats .stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = total;
            statValues[1].textContent = active || total - (onLeave + inactive);
            statValues[2].textContent = onLeave || 0;
        }
    }

    /* ============================================
       STAFF PROFILE ACTIONS
       ============================================ */

    function setupStaffProfileActions() {
        // Print profile
        var printBtn = document.querySelector('.print-staff-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }

        // Download profile
        var downloadBtn = document.querySelector('.download-staff-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showTeacherNotification('Staff profile download will be available in Phase 2', 'info');
            });
        }

        // Staff ID card generation
        var idCardBtn = document.querySelector('.generate-staff-id-btn');
        if (idCardBtn) {
            idCardBtn.addEventListener('click', function() {
                showTeacherNotification('Staff ID card generation will be available in Phase 2', 'info');
            });
        }
    }

    /* ============================================
       NOTIFICATION HELPER
       ============================================ */

    function showTeacherNotification(message, type) {
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
