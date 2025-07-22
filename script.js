// Trail Guardian - Interactive JavaScript Functionality

// Global Variables
let currentSlide = 0;
const safetyTips = [
    {
        icon: 'fas fa-first-aid',
        title: 'First Aid Basics',
        description: 'Always carry a well-stocked first aid kit and know how to treat common injuries like cuts, sprains, and hypothermia.'
    },
    {
        icon: 'fas fa-route',
        title: 'Leave No Trace',
        description: 'Plan ahead, stay on trails, dispose of waste properly, and leave what you find to preserve nature for others.'
    },
    {
        icon: 'fas fa-satellite-dish',
        title: 'Emergency Communication',
        description: 'Inform someone of your plans, carry emergency communication devices, and know how to signal for help.'
    },
    {
        icon: 'fas fa-thermometer-half',
        title: 'Weather Awareness',
        description: 'Check forecasts before heading out, dress in layers, and be prepared for sudden weather changes.'
    },
    {
        icon: 'fas fa-water',
        title: 'Water Safety',
        description: 'Carry more water than you think you need, know purification methods, and identify safe water sources.'
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeNavigation();
    initializeAnimations();
    checkUserAuth();
});

// Navigation Functions
function openProfile() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('trailGuardianUser');
    if (isLoggedIn) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function scrollToTools() {
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
        toolsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Tool Navigation Functions
function openPhotoScanner() {
    showComingSoon('Photo Scanner', 'AI-powered plant and animal track identification coming soon!');
    // window.location.href = 'photo-scanner.html';
}

function openSurvivalBot() {
    showComingSoon('Survival Assistant', 'AI survival chatbot with expert wilderness knowledge coming soon!');
    // window.location.href = 'survival-bot.html';
}

function openPlanningStation() {
    showComingSoon('Planning Station', 'Route planning and supply management tools coming soon!');
    // window.location.href = 'planning-station.html';
}

function openMaps() {
    showComingSoon('Interactive Maps', 'Topographic maps with offline capabilities coming soon!');
    // window.location.href = 'maps.html';
}

function openRadio() {
    showComingSoon('Radio Tools', 'Emergency communication and frequency management coming soon!');
    // window.location.href = 'radio.html';
}

function openCommunity() {
    showComingSoon('Community Forums', 'Connect with fellow adventurers coming soon!');
    // window.location.href = 'community.html';
}

// Carousel Functions
function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || !dotsContainer) return;

    // Create dots for navigation
    safetyTips.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Auto-advance carousel
    setInterval(nextSlide, 5000);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % safetyTips.length;
    updateCarousel();
}

function previousSlide() {
    currentSlide = currentSlide === 0 ? safetyTips.length - 1 : currentSlide - 1;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    const cards = document.querySelectorAll('.safety-card');
    
    if (!track) return;

    // Update track position
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active states
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentSlide);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Navigation Enhancement
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = ['home', 'tools'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe tool cards and safety cards
    document.querySelectorAll('.tool-card, .safety-card').forEach(card => {
        observer.observe(card);
    });
}

// User Authentication Check
function checkUserAuth() {
    const user = localStorage.getItem('trailGuardianUser');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (user && profileBtn) {
        profileBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        profileBtn.setAttribute('title', 'View Profile');
    }
}

// Utility Functions
function showComingSoon(toolName, description) {
    // Create modal overlay
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

    // Create modal content
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
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="joinWaitlist('${toolName}')" style="
                background: linear-gradient(135deg, #2D5016, #1a3c0a);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-bell"></i> Notify Me
            </button>
            <button onclick="closeModal()" style="
                background: transparent;
                color: #2D5016;
                border: 2px solid #2D5016;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                Close
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
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

function joinWaitlist(toolName) {
    // Store waitlist preference
    let waitlist = JSON.parse(localStorage.getItem('trailGuardianWaitlist') || '[]');
    if (!waitlist.includes(toolName)) {
        waitlist.push(toolName);
        localStorage.setItem('trailGuardianWaitlist', JSON.stringify(waitlist));
    }

    // Show success message
    const modal = document.querySelector('.modal-content');
    if (modal) {
        modal.innerHTML = `
            <div style="color: #228B22; font-size: 3rem; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: #2D5016; margin-bottom: 1rem;">You're on the list!</h2>
            <p style="color: #555; margin-bottom: 2rem;">
                We'll notify you as soon as ${toolName} is available. 
                Thank you for your interest in Trail Guardian!
            </p>
            <button onclick="closeModal()" style="
                background: linear-gradient(135deg, #228B22, #1a6b1a);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            ">
                Awesome!
            </button>
        `;
    }
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Arrow key navigation for carousel
    if (e.key === 'ArrowLeft') {
        previousSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Mobile Touch Gestures for Carousel
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(updateActiveNavLink, 100);
window.addEventListener('scroll', debouncedScrollHandler);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Trail Guardian Error:', e.error);
    // Could send error reports to analytics service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}