/* ============================================
   SCRIPT.JS
   Global/Universal JavaScript Functionality
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Set Current Date -----
        setCurrentDate();

        // ----- Set Academic Session -----
        setAcademicSession();

        // ----- Set User Name -----
        setUserName();

        // ----- Logout Handler -----
        setupLogout();

        // ----- Toggle Password Visibility (Login) -----
        setupPasswordToggle();

        // ----- Login Form Handler -----
        setupLoginForm();

        // ----- Forgot Password Form Handler -----
        setupForgotPasswordForm();

        // ----- Prevent Duplicate Form Submissions -----
        setupFormPrevention();

        // ----- Modal Close Handlers -----
        setupModalClose();

        // ----- Select All Checkbox -----
        setupSelectAll();

        // ----- Delete Modal Handlers -----
        setupDeleteModal();

        // ----- Export Buttons -----
        setupExportButtons();

        // ----- Load Students Button (Promotion/Transfer) -----
        setupLoadStudentsBtn();

        // ----- Promote Selected Button -----
        setupPromoteSelectedBtn();

        // ----- Transfer Selected Button -----
        setupTransferSelectedBtn();

        // ----- Generate Selected ID Cards -----
        setupGenerateSelectedBtn();

        // ----- Upload Document Button -----
        setupUploadDocumentBtn();

        // ----- Filter Category Clicks (Documents) -----
        setupCategoryFilters();

        // ----- Print Preview Button (ID Card) -----
        setupPrintPreviewBtn();

        // ----- Download Preview Button (ID Card) -----
        setupDownloadPreviewBtn();

        // ----- Cancel Buttons -----
        setupCancelButtons();

        // ----- Bulk Upload Button -----
        setupBulkUploadBtn();
    });

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */

    // ----- Set Current Date -----
    function setCurrentDate() {
        var dateEl = document.getElementById('currentDate');
        if (!dateEl) return;

        var now = new Date();
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        dateEl.textContent = now.toLocaleDateString('en-IN', options);
    }

    // ----- Set Academic Session -----
    function setAcademicSession() {
        var sessionEl = document.getElementById('academicSession');
        if (!sessionEl) return;

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();

        // Academic session runs from April to March
        var startYear = (month >= 3) ? year : year - 1;
        var endYear = startYear + 1;

        sessionEl.textContent = startYear + '-' + endYear;
    }

    // ----- Set User Name -----
    function setUserName() {
        var nameEl = document.getElementById('userName');
        if (!nameEl) return;

        // In Phase 1, use static name. Phase 2 will pull from Firebase Auth.
        var savedName = localStorage.getItem('erp_user_name');
        if (savedName) {
            nameEl.textContent = savedName;
        } else {
            nameEl.textContent = 'Admin';
        }
    }

    /* ============================================
       AUTHENTICATION FUNCTIONS
       ============================================ */

    // ----- Setup Logout -----
    function setupLogout() {
        var logoutBtn = document.getElementById('logoutBtn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Prevent duplicate clicks
            if (this.disabled) return;
            this.disabled = true;

            // Show loading state
            var originalText = this.innerHTML;
            this.innerHTML = '<span class="btn-spinner"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg></span> Logging out...';

            // Phase 1: Simulate logout delay
            setTimeout(function() {
                // Clear any stored user data
                localStorage.removeItem('erp_user_name');
                localStorage.removeItem('erp_user_email');
                localStorage.removeItem('erp_logged_in');

                // Redirect to index.html
                window.location.href = 'index.html';
            }, 800);
        });
    }

    // ----- Setup Password Toggle -----
    function setupPasswordToggle() {
        var toggleBtn = document.getElementById('togglePasswordBtn');
        if (!toggleBtn) return;

        var passwordInput = document.getElementById('loginPassword');
        if (!passwordInput) return;

        toggleBtn.addEventListener('click', function() {
            var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Update icon
            this.innerHTML = type === 'password'
                ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
                : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
        });
    }

    // ----- Setup Login Form -----
    function setupLoginForm() {
        var form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var email = document.getElementById('loginEmail');
            var password = document.getElementById('loginPassword');
            var submitBtn = document.getElementById('loginBtn');

            // Basic validation
            var isValid = true;

            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(email);
            }

            if (!password.value.trim()) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.trim().length < 6) {
                showError(password, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearError(password);
            }

            if (!isValid) return;

            // Show loading state
            var btnText = submitBtn.querySelector('.btn-text');
            var spinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
            submitBtn.disabled = true;

            // Phase 1: Simulate login
            setTimeout(function() {
                // Store user info
                localStorage.setItem('erp_user_name', 'Admin');
                localStorage.setItem('erp_user_email', email.value.trim());
                localStorage.setItem('erp_logged_in', 'true');

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    // ----- Setup Forgot Password Form -----
    function setupForgotPasswordForm() {
        var form = document.getElementById('forgotForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var email = document.getElementById('resetEmail');
            var submitBtn = document.getElementById('resetBtn');

            // Basic validation
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                return;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                return;
            } else {
                clearError(email);
            }

            // Show loading state
            var btnText = submitBtn.querySelector('.btn-text');
            var spinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
            submitBtn.disabled = true;

            // Phase 1: Simulate sending reset link
            setTimeout(function() {
                // Hide form, show success
                form.style.display = 'none';
                var successEl = document.getElementById('resetSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                }

                // Reset button state
                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.classList.add('hidden');
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    /* ============================================
       VALIDATION HELPERS
       ============================================ */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        var errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        input.style.borderColor = 'var(--danger-color)';
    }

    function clearError(input) {
        var errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
        input.style.borderColor = '';
    }

    /* ============================================
       FORM SUBMISSION PREVENTION
       ============================================ */

    function setupFormPrevention() {
        var forms = document.querySelectorAll('form[novalidate]');
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                var submitBtn = this.querySelector('[type="submit"]');
                if (submitBtn && submitBtn.disabled) {
                    e.preventDefault();
                    return;
                }

                // Disable submit button to prevent double submission
                if (submitBtn) {
                    // Only disable if not already processing
                    if (!submitBtn.classList.contains('processing')) {
                        submitBtn.classList.add('processing');
                        submitBtn.disabled = true;

                        var btnText = submitBtn.querySelector('.btn-text');
                        var spinner = submitBtn.querySelector('.btn-spinner');
                        if (btnText) btnText.style.display = 'none';
                        if (spinner) spinner.classList.remove('hidden');

                        // Re-enable after timeout if not redirected
                        setTimeout(function() {
                            if (submitBtn) {
                                submitBtn.classList.remove('processing');
                                submitBtn.disabled = false;
                                if (btnText) btnText.style.display = 'inline';
                                if (spinner) spinner.classList.add('hidden');
                            }
                        }, 5000);
                    } else {
                        e.preventDefault();
                    }
                }
            });
        });
    }

    /* ============================================
       MODAL FUNCTIONS
       ============================================ */

    function setupModalClose() {
        // Close modals when clicking the close button
        var closeBtns = document.querySelectorAll('.modal-close');
        closeBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var modal = this.closest('.modal-overlay');
                if (modal) modal.classList.add('hidden');
            });
        });

        // Close modals when clicking outside
        var overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(function(overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.add('hidden');
                }
            });
        });

        // Close modals with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
                openModals.forEach(function(modal) {
                    modal.classList.add('hidden');
                });
            }
        });
    }

    /* ============================================
       SELECT ALL CHECKBOX
       ============================================ */

    function setupSelectAll() {
        var selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        selectAll.addEventListener('change', function() {
            var checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(function(cb) {
                cb.checked = selectAll.checked;
            });
            updateSelectedCount();
        });

        // Update individual checkboxes
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
       DELETE MODAL
       ============================================ */

    function setupDeleteModal() {
        var deleteBtns = document.querySelectorAll('.action-btn.delete');
        var modal = document.getElementById('deleteModal');
        if (!modal) return;

        var closeBtn = document.getElementById('deleteModalClose');
        var cancelBtn = document.getElementById('deleteModalCancel');
        var confirmBtn = document.getElementById('deleteModalConfirm');
        var deleteIdEl = document.getElementById('deleteStudentId');
        var currentDeleteId = null;

        deleteBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var id = this.getAttribute('data-id');
                if (id && deleteIdEl) {
                    deleteIdEl.textContent = id;
                    currentDeleteId = id;
                }
                modal.classList.remove('hidden');
            });
        });

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
                // Phase 1: Simulate deletion
                var row = document.querySelector('[data-id="' + currentDeleteId + '"]');
                if (row) {
                    row.closest('tr').style.opacity = '0.5';
                    row.closest('tr').style.pointerEvents = 'none';
                }
                modal.classList.add('hidden');

                // Show feedback (Phase 1)
                var msg = document.createElement('div');
                msg.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#27ae60;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
                msg.textContent = 'Record ' + currentDeleteId + ' deleted successfully (Phase 1 demo)';
                document.body.appendChild(msg);
                setTimeout(function() { msg.remove(); }, 3000);
            });
        }
    }

    /* ============================================
       EXPORT BUTTONS
       ============================================ */

    function setupExportButtons() {
        var pdfBtns = document.querySelectorAll('#exportPdfBtn');
        var excelBtns = document.querySelectorAll('#exportExcelBtn');

        pdfBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Phase 1: Show export notification
                showExportNotification('PDF export initiated (Phase 1 demo)');
            });
        });

        excelBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Phase 1: Show export notification
                showExportNotification('Excel export initiated (Phase 1 demo)');
            });
        });
    }

    function showExportNotification(message) {
        var msg = document.createElement('div');
        msg.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#2c3e50;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        msg.textContent = message;
        document.body.appendChild(msg);
        setTimeout(function() { msg.remove(); }, 3000);
    }

    /* ============================================
       LOAD STUDENTS BUTTON (Promotion/Transfer)
       ============================================ */

    function setupLoadStudentsBtn() {
        var btn = document.getElementById('loadStudentsBtn');
        if (!btn) return;

        btn.addEventListener('click', function() {
            // Phase 1: Simulate loading
            var originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;

            setTimeout(function() {
                btn.textContent = 'Loaded ' + (Math.floor(Math.random() * 50) + 10) + ' students';
                btn.disabled = false;
                setTimeout(function() {
                    btn.textContent = originalText;
                }, 2000);
            }, 800);
        });
    }

    /* ============================================
       PROMOTE SELECTED BUTTON
       ============================================ */

    function setupPromoteSelectedBtn() {
        var btn = document.getElementById('promoteSelectedBtn');
        if (!btn) return;

        var modal = document.getElementById('promoteModal');
        if (!modal) return;

        btn.addEventListener('click', function() {
            var selected = document.querySelectorAll('.row-checkbox:checked');
            var count = selected.length;

            if (count === 0) {
                showExportNotification('Please select at least one student to promote');
                return;
            }

            var countEl = document.getElementById('promoteCount');
            if (countEl) countEl.textContent = count;

            // Get class info from config
            var fromClass = document.getElementById('fromClass');
            var toClass = document.getElementById('toClass');
            var fromSession = document.getElementById('fromSession');
            var toSession = document.getElementById('toSession');

            var fromClassEl = document.getElementById('promoteFromClass');
            var toClassEl = document.getElementById('promoteToClass');
            var sessionEl = document.getElementById('promoteSession');

            if (fromClassEl && fromClass) fromClassEl.textContent = fromClass.options[fromClass.selectedIndex]?.text || 'N/A';
            if (toClassEl && toClass) toClassEl.textContent = toClass.options[toClass.selectedIndex]?.text || 'N/A';
            if (sessionEl && toSession) sessionEl.textContent = toSession.options[toSession.selectedIndex]?.text || 'N/A';

            modal.classList.remove('hidden');

            // Reset checkboxes
            document.getElementById('confirmEligibility').checked = false;
            document.getElementById('confirmBackup').checked = false;
            document.getElementById('promoteModalConfirm').disabled = true;
        });

        // Checklist validation
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
                var modalOverlay = document.getElementById('promoteModal');
                if (modalOverlay) modalOverlay.classList.add('hidden');
                showExportNotification('Students promoted successfully (Phase 1 demo)');
            });
        }

        // Modal close/cancel
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
    }

    /* ============================================
       TRANSFER SELECTED BUTTON
       ============================================ */

    function setupTransferSelectedBtn() {
        var btn = document.getElementById('transferSelectedBtn');
        if (!btn) return;

        var modal = document.getElementById('transferModal');
        if (!modal) return;

        btn.addEventListener('click', function() {
            var selected = document.querySelectorAll('.row-checkbox:checked');
            var count = selected.length;

            if (count === 0) {
                showExportNotification('Please select at least one student to transfer');
                return;
            }

            var countEl = document.getElementById('transferCount');
            if (countEl) countEl.textContent = count;

            // Build transfer details table
            var detailsEl = document.getElementById('transferDetails');
            if (detailsEl) {
                var html = '<table><thead><tr><th>Student</th><th>From</th><th>To</th></tr></thead><tbody>';
                selected.forEach(function(cb, index) {
                    var row = cb.closest('tr');
                    if (row) {
                        var cells = row.querySelectorAll('td');
                        var name = cells[2]?.textContent?.trim() || 'Student ' + (index + 1);
                        var fromClass = cells[3]?.textContent?.trim() || 'N/A';
                        var targetClass = row.querySelector('.target-class-select');
                        var targetVal = targetClass ? targetClass.options[targetClass.selectedIndex]?.text || 'N/A' : 'N/A';
                        html += '<tr><td>' + name + '</td><td>' + fromClass + '</td><td>' + targetVal + '</td></tr>';
                    }
                });
                html += '</tbody></table>';
                detailsEl.innerHTML = html;
            }

            modal.classList.remove('hidden');

            // Reset checkboxes
            document.getElementById('confirmTransfer').checked = false;
            document.getElementById('confirmBackup').checked = false;
            document.getElementById('transferModalConfirm').disabled = true;
        });

        // Checklist validation
        var check1 = document.getElementById('confirmTransfer');
        var check2 = document.getElementById('confirmBackup');
        var confirmBtn = document.getElementById('transferModalConfirm');

        if (check1 && check2 && confirmBtn) {
            function validateChecklist() {
                confirmBtn.disabled = !(check1.checked && check2.checked);
            }
            check1.addEventListener('change', validateChecklist);
            check2.addEventListener('change', validateChecklist);
        }

        // Confirm transfer
        var confirmTransfer = document.getElementById('transferModalConfirm');
        if (confirmTransfer) {
            confirmTransfer.addEventListener('click', function() {
                var modalOverlay = document.getElementById('transferModal');
                if (modalOverlay) modalOverlay.classList.add('hidden');
                showExportNotification('Students transferred successfully (Phase 1 demo)');
            });
        }

        // Modal close/cancel
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
    }

    /* ============================================
       GENERATE SELECTED ID CARDS
       ============================================ */

    function setupGenerateSelectedBtn() {
        var btn = document.getElementById('generateSelectedBtn');
        if (!btn) return;

        btn.addEventListener('click', function() {
            var selected = document.querySelectorAll('.row-checkbox:checked');
            var count = selected.length;

            if (count === 0) {
                showExportNotification('Please select at least one student to generate ID cards');
                return;
            }

            showExportNotification('Generating ' + count + ' ID card(s)... (Phase 1 demo)');

            // Update status for selected rows
            selected.forEach(function(cb) {
                var row = cb.closest('tr');
                if (row) {
                    var statusCell = row.querySelector('.status-badge.pending');
                    if (statusCell) {
                        statusCell.textContent = 'Generated';
                        statusCell.className = 'status-badge generated';
                    }
                    // Update card ID if empty
                    var cardIdCell = row.querySelector('td:nth-child(6)');
                    if (cardIdCell && cardIdCell.textContent === '—') {
                        var admissionNo = row.querySelector('td:nth-child(2)')?.textContent?.trim() || '000';
                        cardIdCell.textContent = 'JPA-ID-' + admissionNo;
                    }
                }
            });

            // Update stats
            updateStats();
        });
    }

    function updateStats() {
        // Simple stats update for ID cards page
        var generated = document.querySelectorAll('.status-badge.generated, .status-badge.printed');
        var total = document.querySelectorAll('.row-checkbox');

        var genCountEl = document.querySelector('.stat-card.generated .stat-value');
        var pendingCountEl = document.querySelector('.stat-card.pending .stat-value');

        if (genCountEl) {
            genCountEl.textContent = generated.length;
        }

        if (pendingCountEl && total) {
            var pending = total.length - generated.length;
            pendingCountEl.textContent = pending;
        }
    }

    /* ============================================
       UPLOAD DOCUMENT BUTTON
       ============================================ */

    function setupUploadDocumentBtn() {
        var btn = document.getElementById('uploadDocumentBtn');
        if (!btn) return;

        var modal = document.getElementById('uploadModal');
        if (!modal) return;

        btn.addEventListener('click', function() {
            modal.classList.remove('hidden');

            // Reset form
            var form = document.getElementById('uploadForm');
            if (form) form.reset();

            // Clear errors
            var errors = form.querySelectorAll('.form-error');
            errors.forEach(function(el) {
                el.textContent = '';
                el.classList.remove('visible');
            });
        });

        // Modal close/cancel
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
                var student = document.getElementById('docStudent');
                var docName = document.getElementById('docName');
                var category = document.getElementById('docCategory');
                var file = document.getElementById('docFile');

                // Basic validation
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

                // Phase 1: Simulate upload
                confirmBtn.textContent = 'Uploading...';
                confirmBtn.disabled = true;

                setTimeout(function() {
                    modal.classList.add('hidden');
                    confirmBtn.textContent = 'Upload Document';
                    confirmBtn.disabled = false;
                    showExportNotification('Document uploaded successfully (Phase 1 demo)');

                    // Add to table (demo)
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

                        // Re-initialize delete buttons
                        setupDeleteModal();
                        setupSelectAll();
                    }
                }, 1200);
            });
        }
    }

    /* ============================================
       CATEGORY FILTERS (Documents)
       ============================================ */

    function setupCategoryFilters() {
        var categories = document.querySelectorAll('.category-badge');
        var filterSelect = document.getElementById('docCategoryFilter');

        if (!filterSelect || !categories.length) return;

        categories.forEach(function(cat) {
            cat.style.cursor = 'pointer';
            cat.addEventListener('click', function() {
                var category = this.textContent.trim().toLowerCase();
                if (filterSelect) {
                    // Find matching option
                    var options = filterSelect.options;
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].text.toLowerCase() === category) {
                            filterSelect.selectedIndex = i;
                            filterSelect.dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                }
            });
        });
    }

    /* ============================================
       PRINT PREVIEW BUTTON (ID Card)
       ============================================ */

    function setupPrintPreviewBtn() {
        var btn = document.getElementById('printPreviewBtn');
        if (!btn) return;

        btn.addEventListener('click', function() {
            var preview = document.getElementById('idCardPreview');
            if (!preview) return;

            var printWindow = window.open('', '_blank', 'width=400,height=600');
            if (printWindow) {
                var content = preview.cloneNode(true);
                printWindow.document.write('<html><head><title>ID Card Preview</title>');
                printWindow.document.write('<style>');
                printWindow.document.write('body { margin: 20px; font-family: Arial, sans-serif; }');
                printWindow.document.write('.id-card-front { border: 2px solid #2c3e50; border-radius: 8px; padding: 16px; max-width: 400px; margin: 0 auto; }');
                printWindow.document.write('.id-card-header { text-align: center; padding-bottom: 8px; border-bottom: 2px solid #2c3e50; }');
                printWindow.document.write('.id-card-school-name { font-size: 18px; font-weight: bold; color: #2c3e50; }');
                printWindow.document.write('.id-card-school-address { font-size: 11px; color: #95a5a6; }');
                printWindow.document.write('.id-card-divider { height: 2px; background: #2c3e50; margin-top: 8px; }');
                printWindow.document.write('.id-card-body { display: flex; gap: 16px; padding: 12px 0; align-items: center; }');
                printWindow.document.write('.id-card-avatar { width: 80px; height: 80px; border: 2px solid #e5e8e8; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f8f9fa; flex-shrink: 0; }');
                printWindow.document.write('.id-card-details { flex: 1; }');
                printWindow.document.write('.id-card-name { font-size: 16px; font-weight: bold; margin-bottom: 4px; }');
                printWindow.document.write('.id-card-field { display: flex; gap: 4px; font-size: 12px; }');
                printWindow.document.write('.field-label { color: #95a5a6; min-width: 80px; }');
                printWindow.document.write('.field-value { color: #2c3e50; font-weight: 500; }');
                printWindow.document.write('.id-card-footer { display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e8e8; font-size: 11px; color: #95a5a6; }');
                printWindow.document.write('</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(content.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();

                setTimeout(function() {
                    printWindow.print();
                }, 500);
            }
        });
    }

    /* ============================================
       DOWNLOAD PREVIEW BUTTON (ID Card)
       ============================================ */

    function setupDownloadPreviewBtn() {
        var btn = document.getElementById('downloadPreviewBtn');
        if (!btn) return;

        btn.addEventListener('click', function() {
            var preview = document.getElementById('idCardPreview');
            if (!preview) return;

            var html = '<html><head><title>ID Card</title>';
            html += '<style>';
            html += 'body { margin: 20px; font-family: Arial, sans-serif; }';
            html += '.id-card-front { border: 2px solid #2c3e50; border-radius: 8px; padding: 16px; max-width: 400px; margin: 0 auto; }';
            html += '.id-card-header { text-align: center; padding-bottom: 8px; border-bottom: 2px solid #2c3e50; }';
            html += '.id-card-school-name { font-size: 18px; font-weight: bold; color: #2c3e50; }';
            html += '.id-card-school-address { font-size: 11px; color: #95a5a6; }';
            html += '.id-card-divider { height: 2px; background: #2c3e50; margin-top: 8px; }';
            html += '.id-card-body { display: flex; gap: 16px; padding: 12px 0; align-items: center; }';
            html += '.id-card-avatar { width: 80px; height: 80px; border: 2px solid #e5e8e8; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f8f9fa; flex-shrink: 0; }';
            html += '.id-card-details { flex: 1; }';
            html += '.id-card-name { font-size: 16px; font-weight: bold; margin-bottom: 4px; }';
            html += '.id-card-field { display: flex; gap: 4px; font-size: 12px; }';
            html += '.field-label { color: #95a5a6; min-width: 80px; }';
            html += '.field-value { color: #2c3e50; font-weight: 500; }';
            html += '.id-card-footer { display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e8e8; font-size: 11px; color: #95a5a6; }';
            html += '</style>';
            html += '</head><body>';
            html += preview.innerHTML;
            html += '</body></html>';

            var blob = new Blob([html], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'id-card-' + Date.now() + '.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showExportNotification('ID Card downloaded (Phase 1 demo)');
        });
    }

    /* ============================================
       CANCEL BUTTONS
       ============================================ */

    function setupCancelButtons() {
        var cancelBtns = document.querySelectorAll('#cancelBtn');
        cancelBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var href = this.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                } else {
                    window.history.back();
                }
            });
        });
    }

    /* ============================================
       BULK UPLOAD BUTTON
       ============================================ */

    function setupBulkUploadBtn() {
        var btn = document.getElementById('bulkUploadBtn');
        if (!btn) return;

        btn.addEventListener('click', function() {
            showExportNotification('Bulk upload feature coming in Phase 2');
        });
    }

})();
