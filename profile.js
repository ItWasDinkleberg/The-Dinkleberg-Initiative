// Profile Page JavaScript Functionality

let isEditMode = false;
let originalUserData = {};

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    setupTabNavigation();
    setupFormHandlers();
    loadWaitlistItems();
    checkAuthStatus();
});

// Check if user is authenticated
function checkAuthStatus() {
    const user = getUserData();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    loadUserProfile(user);
}

// Get user data from storage
function getUserData() {
    const userData = localStorage.getItem('trailGuardianUser') || sessionStorage.getItem('trailGuardianUser');
    return userData ? JSON.parse(userData) : null;
}

// Load user profile data
function loadUserProfile(user) {
    // Update profile header
    document.getElementById('profileName').textContent = user.name || 'Trail Explorer';
    document.getElementById('profileEmail').textContent = user.email || 'explorer@trailguardian.com';
    
    // Update experience badge
    const experienceBadge = document.getElementById('experienceBadge');
    if (user.experience) {
        experienceBadge.textContent = user.experience.charAt(0).toUpperCase() + user.experience.slice(1);
    }
    
    // Update member since date
    const memberSince = document.getElementById('memberSince');
    if (user.createdAt) {
        const joinDate = new Date(user.createdAt);
        memberSince.textContent = joinDate.getFullYear();
    }
    
    // Update avatar
    updateAvatar(user);
    
    // Update form fields
    updateFormFields(user);
    
    // Update welcome time
    updateWelcomeTime(user);
    
    // Store original data for edit mode
    originalUserData = { ...user };
}

// Update avatar display
function updateAvatar(user) {
    const avatar = document.getElementById('profileAvatar');
    
    if (user.avatar && user.avatar.type === 'initials') {
        avatar.innerHTML = user.avatar.initials;
        avatar.style.background = user.avatar.backgroundColor;
        avatar.classList.add('has-initials');
    } else if (user.firstName && user.lastName) {
        const initials = user.firstName.charAt(0) + user.lastName.charAt(0);
        avatar.innerHTML = initials.toUpperCase();
        avatar.classList.add('has-initials');
    }
}

// Update form fields with user data
function updateFormFields(user) {
    if (user.firstName) document.getElementById('editFirstName').value = user.firstName;
    if (user.lastName) document.getElementById('editLastName').value = user.lastName;
    if (user.email) document.getElementById('editEmail').value = user.email;
    if (user.experience) document.getElementById('editExperience').value = user.experience;
    
    // Update preferences
    const preferences = user.preferences || {};
    document.getElementById('emailNotifications').checked = preferences.emailNotifications !== false;
    document.getElementById('safetyAlerts').checked = preferences.safetyAlerts !== false;
    document.getElementById('communityUpdates').checked = preferences.communityUpdates || false;
    document.getElementById('profileVisibility').checked = preferences.profileVisibility !== false;
    document.getElementById('activityTracking').checked = preferences.activityTracking !== false;
}

// Update welcome time
function updateWelcomeTime(user) {
    const welcomeTime = document.getElementById('welcomeTime');
    const joinTime = document.getElementById('joinTime');
    
    if (user.createdAt) {
        const timeDiff = getTimeAgo(user.createdAt);
        welcomeTime.textContent = timeDiff;
        joinTime.textContent = timeDiff;
    }
}

// Get time ago string
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}

// Setup tab navigation
function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.profile-nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and links
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked link and corresponding tab
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Update URL hash
            window.location.hash = targetTab;
        });
    });
    
    // Handle direct hash navigation
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        const targetLink = document.querySelector(`[data-tab="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// Setup form handlers
function setupFormHandlers() {
    // Account form
    const accountForm = document.getElementById('accountForm');
    accountForm.addEventListener('submit', handleAccountUpdate);
    
    // Preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    preferencesForm.addEventListener('submit', handlePreferencesUpdate);
    
    // Activity filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterActivity(this.getAttribute('data-filter'));
        });
    });
}

// Toggle edit mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    const editBtn = document.querySelector('.edit-profile-btn');
    const formInputs = document.querySelectorAll('#account input, #account select');
    const formActions = document.getElementById('accountFormActions');
    
    if (isEditMode) {
        editBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
        editBtn.classList.add('btn-secondary');
        editBtn.classList.remove('btn-outline');
        
        formInputs.forEach(input => {
            if (input.name !== 'email') { // Don't allow email editing
                input.disabled = false;
            }
        });
        
        formActions.style.display = 'flex';
        
        // Switch to account tab
        document.querySelector('[data-tab="account"]').click();
    } else {
        cancelEdit();
    }
}

// Cancel edit mode
function cancelEdit() {
    isEditMode = false;
    const editBtn = document.querySelector('.edit-profile-btn');
    const formInputs = document.querySelectorAll('#account input, #account select');
    const formActions = document.getElementById('accountFormActions');
    
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
    editBtn.classList.remove('btn-secondary');
    editBtn.classList.add('btn-outline');
    
    formInputs.forEach(input => {
        input.disabled = true;
    });
    
    formActions.style.display = 'none';
    
    // Restore original values
    updateFormFields(originalUserData);
}

// Handle account update
async function handleAccountUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const experience = formData.get('experience');
    
    try {
        // Validate inputs
        if (!firstName.trim() || !lastName.trim()) {
            throw new Error('First and last name are required');
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update user data
        const currentUser = getUserData();
        const updatedUser = {
            ...currentUser,
            firstName: firstName,
            lastName: lastName,
            name: `${firstName} ${lastName}`,
            experience: experience,
            updatedAt: new Date().toISOString()
        };
        
        // Update avatar if name changed
        if (firstName !== currentUser.firstName || lastName !== currentUser.lastName) {
            updatedUser.avatar = {
                type: 'initials',
                initials: (firstName.charAt(0) + lastName.charAt(0)).toUpperCase(),
                backgroundColor: currentUser.avatar?.backgroundColor || '#2D5016',
                textColor: '#ffffff'
            };
        }
        
        // Save to storage
        if (localStorage.getItem('trailGuardianUser')) {
            localStorage.setItem('trailGuardianUser', JSON.stringify(updatedUser));
        } else {
            sessionStorage.setItem('trailGuardianUser', JSON.stringify(updatedUser));
        }
        
        // Update UI
        loadUserProfile(updatedUser);
        
        // Exit edit mode
        cancelEdit();
        
        // Show success message
        showSuccessMessage('Profile updated successfully!');
        
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Handle preferences update
async function handlePreferencesUpdate(e) {
    e.preventDefault();
    
    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get preference values
        const preferences = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            safetyAlerts: document.getElementById('safetyAlerts').checked,
            communityUpdates: document.getElementById('communityUpdates').checked,
            profileVisibility: document.getElementById('profileVisibility').checked,
            activityTracking: document.getElementById('activityTracking').checked
        };
        
        // Update user data
        const currentUser = getUserData();
        const updatedUser = {
            ...currentUser,
            preferences: preferences,
            updatedAt: new Date().toISOString()
        };
        
        // Save to storage
        if (localStorage.getItem('trailGuardianUser')) {
            localStorage.setItem('trailGuardianUser', JSON.stringify(updatedUser));
        } else {
            sessionStorage.setItem('trailGuardianUser', JSON.stringify(updatedUser));
        }
        
        showSuccessMessage('Preferences saved successfully!');
        
    } catch (error) {
        showErrorMessage('Failed to save preferences. Please try again.');
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Load waitlist items
function loadWaitlistItems() {
    const waitlist = JSON.parse(localStorage.getItem('trailGuardianWaitlist') || '[]');
    const waitlistContainer = document.getElementById('waitlistItems');
    const waitlistCount = document.getElementById('waitlistCount');
    
    waitlistCount.textContent = waitlist.length;
    
    if (waitlist.length === 0) {
        waitlistContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>No waitlist items</h3>
                <p>You haven't joined any feature waitlists yet. Check out our tools to see what's coming soon!</p>
                <a href="index.html#tools" class="btn btn-primary">Explore Tools</a>
            </div>
        `;
    } else {
        waitlistContainer.innerHTML = waitlist.map(item => `
            <div class="waitlist-item">
                <div class="waitlist-info">
                    <h4>${item}</h4>
                    <p>You'll be notified when this feature becomes available.</p>
                </div>
                <div class="waitlist-status">Waitlisted</div>
            </div>
        `).join('');
    }
}

// Filter activity
function filterActivity(filter) {
    // This would filter activity items based on the selected filter
    // For now, we'll just show the current welcome message
    console.log('Filtering activity by:', filter);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('trailGuardianUser');
        sessionStorage.removeItem('trailGuardianUser');
        window.location.href = 'index.html';
    }
}

// Initialize profile (called from DOMContentLoaded)
function initializeProfile() {
    // Add any additional initialization logic here
    console.log('Profile page initialized');
}

// Show success message
function showSuccessMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid #c3e6cb;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;
    
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;
    
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);