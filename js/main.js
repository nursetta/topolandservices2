/**
 * Topo II Land Services - Main JavaScript
 * Handles navigation, animations, and form interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
});

/**
 * Mobile Navigation
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    function openMenu() {
        navMenu.classList.add('show-menu');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('show-menu');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    // Close menu
    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            closeMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('show-menu')) {
            closeMenu();
        }
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    function updateHeader() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    // Initial check
    updateHeader();

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.getElementById('header').offsetHeight;

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        return;
    }

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .about__content, .about__visual, .contact__info, .contact__form-wrapper, .stat'
    );

    // Add initial styles
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on sibling index
                const siblings = Array.from(entry.target.parentElement.children);
                const siblingIndex = siblings.indexOf(entry.target);
                const delay = siblingIndex * 0.1;

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay * 1000);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Form Validation and Enhancement
 */
function initFormValidation() {
    const form = document.querySelector('.contact__form');

    if (!form) return;

    // Add focus effects to form groups
    const formInputs = form.querySelectorAll('.form__input');

    formInputs.forEach(input => {
        const formGroup = input.closest('.form__group');

        input.addEventListener('focus', () => {
            formGroup.classList.add('form__group--focused');
        });

        input.addEventListener('blur', () => {
            formGroup.classList.remove('form__group--focused');

            // Add filled class if input has value
            if (input.value.trim()) {
                formGroup.classList.add('form__group--filled');
            } else {
                formGroup.classList.remove('form__group--filled');
            }
        });
    });

    // Form submission handling
    form.addEventListener('submit', (e) => {
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('form__input--error');

                // Remove error class on input
                field.addEventListener('input', () => {
                    field.classList.remove('form__input--error');
                }, { once: true });
            }
        });

        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('form__input--error');
            }
        }

        if (!isValid) {
            e.preventDefault();

            // Focus first invalid field
            const firstError = form.querySelector('.form__input--error');
            if (firstError) {
                firstError.focus();
            }
        }
    });
}

/**
 * Utility: Debounce function
 */
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

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
