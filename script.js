document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitBtn = document.getElementById('submitBtn');
    const demoBtn = document.getElementById('demoBtn');

    // Forgot Password Modal elements
    const forgotLink = document.querySelector('.forgot-password');
    const forgotModal = document.getElementById('forgotModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const sendResetBtn = document.getElementById('sendResetBtn');
    const resetEmail = document.getElementById('resetEmail');

    // Sign Up Modal elements
    const signupLink = document.getElementById('signupLink');
    const signupModal = document.getElementById('signupModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regPass = document.getElementById('regPass');

    // Simple email validation regex
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const showError = (input, errorElement, message) => {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    };

    const clearError = (input, errorElement) => {
        input.classList.remove('error');
        errorElement.classList.remove('visible');
    };

    // Clear errors on input
    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));

    function executeLogin(email) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Store active session
        sessionStorage.setItem('thermal_user', JSON.stringify({
            email: email || 'researcher@neuralcoder.org',
            loggedInAt: new Date().toISOString()
        }));

        // Visual transition & redirect to main dashboard
        setTimeout(() => {
            const card = document.querySelector('.login-card');
            if (card) {
                card.style.transition = 'all 0.35s ease';
                card.style.transform = 'scale(0.98)';
                card.style.opacity = '0';
            }
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 300);
        }, 500);
    }

    // 1-Click Quick Demo Access
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            emailInput.value = 'architect@neuralcoder.org';
            passwordInput.value = 'sih2026demo';
            executeLogin('architect@neuralcoder.org');
        });
    }

    // Standard Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const emailVal = emailInput.value.trim();
        const passVal = passwordInput.value.trim();
        
        // Validate Email
        if (!emailVal) {
            showError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailVal)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Password
        if (!passVal) {
            showError(passwordInput, passwordError, 'Password is required');
            isValid = false;
        } else if (passVal.length < 4) {
            showError(passwordInput, passwordError, 'Password must be at least 4 characters');
            isValid = false;
        }

        if (isValid) {
            executeLogin(emailVal);
        } else {
            // Shake animation for invalid form
            const card = document.querySelector('.login-card');
            if (card) {
                card.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-8px)' },
                    { transform: 'translateX(8px)' },
                    { transform: 'translateX(-8px)' },
                    { transform: 'translateX(8px)' },
                    { transform: 'translateX(0)' }
                ], {
                    duration: 350,
                    easing: 'ease-in-out'
                });
            }
        }
    });

    // Forgot Password Interactions
    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.add('open');
            resetEmail.value = emailInput.value || '';
        });
    }

    if (closeForgotModal && forgotModal) {
        closeForgotModal.addEventListener('click', () => {
            forgotModal.classList.remove('open');
        });
    }

    if (sendResetBtn) {
        sendResetBtn.addEventListener('click', () => {
            const val = resetEmail.value.trim();
            if (!val || !isValidEmail(val)) {
                alert('Please enter a valid email address.');
                return;
            }
            alert(`Password reset instructions have been sent to ${val}.`);
            forgotModal.classList.remove('open');
        });
    }

    // Sign Up Interactions
    if (signupLink && signupModal) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.add('open');
        });
    }

    if (closeSignupModal && signupModal) {
        closeSignupModal.addEventListener('click', () => {
            signupModal.classList.remove('open');
        });
    }

    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', () => {
            const name = regName.value.trim();
            const email = regEmail.value.trim();
            const pass = regPass.value.trim();

            if (!name) {
                alert('Please enter your full name.');
                return;
            }
            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!pass || pass.length < 6) {
                alert('Password must be at least 6 characters.');
                return;
            }

            signupModal.classList.remove('open');
            executeLogin(email);
        });
    }

    // Close modals on clicking backdrop
    window.addEventListener('click', (e) => {
        if (e.target === forgotModal) forgotModal.classList.remove('open');
        if (e.target === signupModal) signupModal.classList.remove('open');
    });
});
