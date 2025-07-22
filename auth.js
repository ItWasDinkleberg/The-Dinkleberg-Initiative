// Authentication JavaScript Functionality

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Initialize authentication functionality
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form handler
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        
        // Password strength checker
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
        
        // Password confirmation checker
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        }
    }

    // Check if user is already logged in
    checkExistingAuth();
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate inputs
        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        // Simulate API call (replace with actual authentication)
        await simulateApiCall(1500);
        
        // Create user session
        const user = {
            id: generateUserId(),
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString(),
            remember: remember === 'on'
        };
        
        // Store user data
        if (remember === 'on') {
            localStorage.setItem('trailGuardianUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('trailGuardianUser', JSON.stringify(user));
        }
        
        // Show success message
        showAuthSuccess('Welcome back! Redirecting to your dashboard...');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        showAuthError(error.message);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const experience = formData.get('experience');
    const newsletter = formData.get('newsletter');
    const terms = formData.get('terms');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate inputs
        if (!firstName.trim() || !lastName.trim()) {
            throw new Error('Please enter your first and last name');
        }
        
        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (!experience) {
            throw new Error('Please select your experience level');
        }
        
        if (!terms) {
            throw new Error('Please accept the Terms of Service and Privacy Policy');
        }
        
        // Check password strength
        const strength = getPasswordStrength(password);
        if (strength < 3) {
            throw new Error('Please choose a stronger password');
        }
        
        // Simulate API call
        await simulateApiCall(2000);
        
        // Create user account
        const user = {
            id: generateUserId(),
            firstName: firstName,
            lastName: lastName,
            name: `${firstName} ${lastName}`,
            email: email,
            experience: experience,
            newsletter: newsletter === 'on',
            createdAt: new Date().toISOString(),
            avatar: generateAvatar(firstName, lastName)
        };
        
        // Store user data
        localStorage.setItem('trailGuardianUser', JSON.stringify(user));
        
        // Show success message
        showAuthSuccess('Account created successfully! Welcome to Trail Guardian!');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500);
        
    } catch (error) {
        showAuthError(error.message);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Password visibility toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthBar = strengthIndicator.querySelector('.strength-fill');
    const strengthText = strengthIndicator.querySelector('.strength-text');
    
    const strength = getPasswordStrength(password);
    
    // Remove all strength classes
    strengthBar.className = 'strength-fill';
    
    if (password.length === 0) {
        strengthText.textContent = 'Enter a password';
        return;
    }
    
    switch (strength) {
        case 1:
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
            break;
        case 2:
            strengthBar.classList.add('fair');
            strengthText.textContent = 'Fair password';
            break;
        case 3:
            strengthBar.classList.add('good');
            strengthText.textContent = 'Good password';
            break;
        case 4:
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
            break;
        default:
            strengthText.textContent = 'Very weak password';
    }
}

// Get password strength score
function getPasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Return simplified score (1-4)
    if (score <= 2) return 1;
    if (score <= 3) return 2;
    if (score <= 4) return 3;
    return 4;
}

// Check password confirmation match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    // Remove existing validation classes
    confirmInput.style.borderColor = '';
    
    if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
            confirmInput.style.borderColor = 'var(--success-color)';
            removeFieldError('confirmPassword');
        } else {
            confirmInput.style.borderColor = '#dc3545';
            showFieldError('confirmPassword', 'Passwords do not match');
        }
    }
}

// Social login handlers
function loginWithGoogle() {
    showComingSoon('Google Sign-In', 'Google authentication integration coming soon!');
}

function loginWithApple() {
    showComingSoon('Apple Sign-In', 'Apple authentication integration coming soon!');
}

function signupWithGoogle() {
    showComingSoon('Google Sign-Up', 'Google registration integration coming soon!');
}

function signupWithApple() {
    showComingSoon('Apple Sign-Up', 'Apple registration integration coming soon!');
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function generateAvatar(firstName, lastName) {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const colors = ['#2D5016', '#8B4513', '#FF6B35', '#228B22'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
        type: 'initials',
        initials: initials,
        backgroundColor: bgColor,
        textColor: '#ffffff'
    };
}

function simulateApiCall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

// Error and Success Handling
function showAuthError(message) {
    const existingError = document.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #f5c6cb;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showAuthSuccess(message) {
    const existingSuccess = document.querySelector('.auth-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'auth-success';
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #c3e6cb;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `;
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(successDiv, form.firstChild);
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.form-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.form-error');
    
    if (existingError) {
        existingError.remove();
    }
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.auth-error, .form-error');
    errors.forEach(error => error.remove());
}

// Check for existing authentication
function checkExistingAuth() {
    const user = localStorage.getItem('trailGuardianUser') || sessionStorage.getItem('trailGuardianUser');
    
    if (user) {
        // User is already logged in, redirect to dashboard
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            window.location.href = 'index.html';
        }
    }
}

// Coming Soon Modal (reused from main script)
function showComingSoon(toolName, description) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        margin: 1rem;
        text-align: center;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        position: relative;
    `;

    modal.innerHTML = `
        <div style="color: #FF6B35; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-tools"></i>
        </div>
        <h2 style="color: #2D5016; margin-bottom: 1rem;">${toolName}</h2>
        <p style="color: #555; margin-bottom: 2rem; font-size: 1.1rem;">${description}</p>
        <button onclick="closeModal()" style="
            background: linear-gradient(135deg, #2D5016, #1a3c0a);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        ">
            Got it!
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Add CSS animation for slide in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);