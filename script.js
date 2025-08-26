// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormValidation();
    initializeFileUpload();
    initializeSmoothScrolling();
    initializeScrollEffects();
    initializeAnimations();
});

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');

    // Scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Navigation links and hero buttons
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');

    // Validation rules
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Name must be at least 2 characters and contain only letters and spaces'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10 and 1000 characters'
        }
    };

    // Real-time validation
    function validateField(field, rules) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        // Clear previous error state
        field.classList.remove('error');
        errorElement.classList.remove('show');
        errorElement.textContent = '';

        // Required validation
        if (rules.required && !value) {
            showFieldError(field, errorElement, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }

        // Length validation
        if (value && rules.minLength && value.length < rules.minLength) {
            showFieldError(field, errorElement, rules.message);
            return false;
        }

        if (value && rules.maxLength && value.length > rules.maxLength) {
            showFieldError(field, errorElement, rules.message);
            return false;
        }

        // Pattern validation
        if (value && rules.pattern && !rules.pattern.test(value)) {
            showFieldError(field, errorElement, rules.message);
            return false;
        }

        return true;
    }

    function showFieldError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Add event listeners for real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, validators.name));
    emailInput.addEventListener('blur', () => validateField(emailInput, validators.email));
    messageInput.addEventListener('blur', () => validateField(messageInput, validators.message));

    // Character counter for message
    messageInput.addEventListener('input', function() {
        const maxLength = validators.message.maxLength;
        const currentLength = this.value.length;
        const remaining = maxLength - currentLength;
        
        // Create or update character counter
        let counter = this.parentNode.querySelector('.char-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem; text-align: right;';
            this.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        if (remaining < 50) {
            counter.style.color = 'var(--error-color)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField(nameInput, validators.name);
        const isEmailValid = validateField(emailInput, validators.email);
        const isMessageValid = validateField(messageInput, validators.message);
        
        if (isNameValid && isEmailValid && isMessageValid) {
            submitForm();
        } else {
            showFormMessage('Please fix the errors above', 'error');
        }
    });

    function submitForm() {
        // Show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset loading state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;

            // Show success message
            showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Remove character counter if it exists
            const counter = messageInput.parentNode.querySelector('.char-counter');
            if (counter) {
                counter.remove();
            }
        }, 2000);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('success', 'error');
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// File Upload Functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const fileInfo = document.querySelector('.file-info');
    
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            
            if (files.length === 0) {
                fileInfo.textContent = 'No files selected';
                return;
            }
            
            if (files.length === 1) {
                fileInfo.textContent = `Selected: ${files[0].name}`;
            } else {
                fileInfo.textContent = `Selected: ${files.length} files`;
            }
            
            // Validate file types (optional)
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ];
            
            const invalidFiles = Array.from(files).filter(file => 
                !allowedTypes.includes(file.type)
            );
            
            if (invalidFiles.length > 0) {
                fileInfo.textContent = 'Some files have invalid formats. Please select PDF, Word, PowerPoint, or text files.';
                fileInfo.style.color = 'var(--error-color)';
                return;
            }
            
            fileInfo.style.color = 'var(--success-color)';
        });
    }
}

// Scroll Effects and Animations
function initializeScrollEffects() {
    // Intersection Observer for animations
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.about-item, .material-category, .contact-form-container, .contact-info'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Additional Animations
function initializeAnimations() {
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .about-item,
        .material-category,
        .contact-form-container,
        .contact-info {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .material-category:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .material-category:nth-child(3) {
            transition-delay: 0.2s;
        }
        
        .about-item:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .about-item:nth-child(3) {
            transition-delay: 0.2s;
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero background (optional, performance-friendly version)
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground && scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Only enable parallax on desktop for performance
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestParallaxUpdate);
    }
}

// Material link functionality
document.addEventListener('click', function(e) {
    if (e.target.matches('.material-link') || e.target.closest('.material-link')) {
        e.preventDefault();
        
        // Show a message since these are placeholder links
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: fadeInUp 0.3s ease-out;
        `;
        message.textContent = 'This is a placeholder link. Replace with your actual study material links.';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }
});

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// Utility functions
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

// Performance optimization: debounce scroll events
const debouncedScrollHandler = debounce(() => {
    // Any additional scroll handling can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // In a production environment, you might want to send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Prevent the default browser behavior
    e.preventDefault();
});
