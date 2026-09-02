/* ============================================
   AUTH.JS
   Authentication Functions (Login, Logout, Session)
   ============================================ */

(function() {
    'use strict';

    // ----- DOM Ready -----
    document.addEventListener('DOMContentLoaded', function() {

        // ----- Check Authentication Status -----
        checkAuthStatus();

        // ----- Login Form Handler -----
        setupLoginForm();

        // ----- Forgot Password Form Handler -----
        setupForgotPasswordForm();

        // ----- Logout Handler -----
        setupLogout();

        // ----- Password Toggle Visibility -----
        setupPasswordToggle();

        // ----- Remember Me Checkbox -----
        setupRememberMe();
    });

    /* ============================================
       AUTH STATUS CHECK
       ============================================ */

    function checkAuthStatus() {
        // Check if user is logged in (Phase 1 uses localStorage)
        var isLoggedIn = localStorage.getItem('erp_logged_in') === 'true';
        var currentPage = window.location.pathname.split('/').pop();

        // Pages that don't require authentication
        var publicPages = ['index.html', 'login.html', 'forgot-password.html'];

        // If logged in and on a public page, redirect to dashboard
        if (isLoggedIn && publicPages.includes(currentPage)) {
            window.location.href = 'dashboard.html';
            return;
        }

        // If not logged in and on a protected page, redirect to index
        if (!isLoggedIn && !publicPages.includes(currentPage)) {
            // Check if we're on a page that requires auth (all except public pages)
            // Also exclude root path and empty string
            if (currentPage && currentPage !== '' && !publicPages.includes(currentPage)) {
                window.location.href = 'index.html';
                return;
            }
        }

        // If on index.html and logged in, redirect to dashboard
        if (isLoggedIn && currentPage === 'index.html') {
            window.location.href = 'dashboard.html';
            return;
        }
    }

    /* ============================================
       LOGIN FORM
       ============================================ */

    function setupLoginForm() {
        var form = document.getElementById('loginForm');
        if (!form) return;

        var emailInput = document.getElementById('loginEmail');
        var passwordInput = document.getElementById('loginPassword');
        var submitBtn = document.getElementById('loginBtn');

        // Pre-fill remember me if saved
        var savedEmail = localStorage.getItem('erp_remember_email');
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
            var rememberCheck = document.getElementById('rememberMe');
            if (rememberCheck) rememberCheck.checked = true;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate inputs
            var isValid = true;

            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email address is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }

            if (!passwordInput.value.trim()) {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (passwordInput.value.trim().length < 6) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearError(passwordInput);
            }

            if (!isValid) return;

            // Show loading state
            setButtonLoading(submitBtn, true);

            // Phase 1: Simulate authentication
            // In Phase 2, this will be replaced with Firebase Auth
            setTimeout(function() {
                // Demo credentials check
                var email = emailInput.value.trim();
                var password = passwordInput.value.trim();

                // Simple demo validation (Phase 1 only)
                if (email === 'admin@janakipa.edu.in' && password === 'admin123') {
                    // Success - store session
                    localStorage.setItem('erp_logged_in', 'true');
                    localStorage.setItem('erp_user_name', 'Admin');
                    localStorage.setItem('erp_user_email', email);

                    // Handle remember me
                    var rememberCheck = document.getElementById('rememberMe');
                    if (rememberCheck && rememberCheck.checked) {
                        localStorage.setItem('erp_remember_email', email);
                    } else {
                        localStorage.removeItem('erp_remember_email');
                    }

                    // Redirect to dashboard
                    setButtonLoading(submitBtn, false);
                    window.location.href = 'dashboard.html';
                } else {
                    // Failed login
                    setButtonLoading(submitBtn, false);
                    showError(passwordInput, 'Invalid email or password. Demo: admin@janakipa.edu.in / admin123');
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            }, 1000);
        });
    }

    /* ============================================
       FORGOT PASSWORD FORM
       ============================================ */

    function setupForgotPasswordForm() {
        var form = document.getElementById('forgotForm');
        if (!form) return;

        var emailInput = document.getElementById('resetEmail');
        var submitBtn = document.getElementById('resetBtn');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email address is required');
                return;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address');
                return;
            } else {
                clearError(emailInput);
            }

            // Show loading state
            setButtonLoading(submitBtn, true);

            // Phase 1: Simulate password reset
            // In Phase 2, this will use Firebase Auth sendPasswordResetEmail
            setTimeout(function() {
                setButtonLoading(submitBtn, false);

                // Hide form and show success
                form.style.display = 'none';
                var successEl = document.getElementById('resetSuccess');
                if (successEl) {
                    successEl.classList.remove('hidden');
                }

                // Log the reset request (Phase 1 demo)
                console.log('Password reset requested for:', emailInput.value.trim());
            }, 1200);
        });
    }

    /* ============================================
       LOGOUT HANDLER
       ============================================ */

    function setupLogout() {
        var logoutBtn = document.getElementById('logoutBtn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Prevent duplicate clicks
            if (this.disabled) return;
            this.disabled = true;

            // Show loading state
            var originalHtml = this.innerHTML;
            this.innerHTML = '<span class="btn-spinner"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg></span> Logging out...';

            // Phase 1: Simulate logout
            // In Phase 2, this will use Firebase Auth signOut
            setTimeout(function() {
                // Clear session
                localStorage.removeItem('erp_logged_in');
                localStorage.removeItem('erp_user_name');
                localStorage.removeItem('erp_user_email');

                // Redirect to index
                window.location.href = 'index.html';
            }, 800);
        });
    }

    /* ============================================
       PASSWORD TOGGLE
       ============================================ */

    function setupPasswordToggle() {
        var toggleBtn = document.getElementById('togglePasswordBtn');
        if (!toggleBtn) return;

        var passwordInput = document.getElementById('loginPassword');
        if (!passwordInput) return;

        toggleBtn.addEventListener('click', function() {
            var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Update icon
            if (type === 'password') {
                this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
            } else {
                this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
            }
        });
    }

    /* ============================================
       REMEMBER ME
       ============================================ */

    function setupRememberMe() {
        var rememberCheck = document.getElementById('rememberMe');
        if (!rememberCheck) return;

        // If there's a saved email, check the box
        var savedEmail = localStorage.getItem('erp_remember_email');
        if (savedEmail) {
            rememberCheck.checked = true;
        }
    }

    /* ============================================
       HELPER FUNCTIONS
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

    function setButtonLoading(btn, loading) {
        if (!btn) return;

        var btnText = btn.querySelector('.btn-text');
        var spinner = btn.querySelector('.btn-spinner');

        if (loading) {
            btn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
        } else {
            btn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (spinner) spinner.classList.add('hidden');
        }
    }

})();
