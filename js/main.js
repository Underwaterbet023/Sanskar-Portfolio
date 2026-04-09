// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    // Custom cursor (only for non-touch devices)
    if (!isTouchDevice) {
        initCustomCursor();
    } else {
        // Hide cursor elements on touch devices
        const cursorElements = document.querySelectorAll('.cursor, .cursor-follower');
        cursorElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
    }
    
    // Initialize theme toggle
    initThemeToggle();
    // Move theme toggle into mobile menu when needed
    relocateThemeToggle();
    
    // Navigation and scroll effects
    initNavigation(isTouchDevice);
    
    // Initialize animations
    initAnimations();
    
    // Initialize premium canvas background in Home/Hero
    initHeroCanvas();
    
    // Initialize project filters
    initProjectFilters();
    
    // Initialize blog modals
    initBlogModals();
    
    // Initialize contact form
    initContactForm();
    
    // Add touch-specific enhancements
    if (isTouchDevice) {
        initTouchEnhancements();
    }
});

// Custom cursor functionality
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', function(e) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });
    
    // Cursor effects on hover
    const links = document.querySelectorAll('a, button, .btn, .project-card, .social-icon');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-active');
            cursorFollower.classList.add('cursor-active');
            gsap.to(cursor, {
                scale: 1.5,
                duration: 0.3
            });
            gsap.to(cursorFollower, {
                scale: 1.5,
                duration: 0.3
            });
        });
        
        link.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-active');
            cursorFollower.classList.remove('cursor-active');
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3
            });
            gsap.to(cursorFollower, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// Navigation functionality
function initNavigation(isTouchDevice) {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener(isTouchDevice ? 'touchstart' : 'click', function(e) {
            if (isTouchDevice) e.preventDefault();
            
            // Toggle navigation
            nav.classList.toggle('active');
            
            // Toggle burger animation
            burger.classList.toggle('active');
            
            // Animate links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
    
    // Close menu when clicking outside on touch devices
    if (isTouchDevice) {
        document.addEventListener('touchstart', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !burger.contains(e.target)) {
                nav.classList.remove('active');
                burger.classList.remove('active');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener(isTouchDevice ? 'touchend' : 'click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('active');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add a small delay for touch devices to allow menu closing animation to complete
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Adjust for navbar height
                        behavior: 'smooth'
                    });
                }, isTouchDevice ? 300 : 0);
            }
        });
    });
    
    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.querySelector('a').classList.remove('active');
            if (link.querySelector(`a[href="#${current}"]`)) {
                link.querySelector(`a[href="#${current}"]`).classList.add('active');
            }
        });
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

// Initialize GSAP animations
function initAnimations() {
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    // Hero section animations are handled by CSS for initial load
    
    // About section animations
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Projects section animations
    gsap.from('.projects-filter', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Project cards animation removed to prevent slideshow effect
    /* 
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    */
    
    // Skills section animations
    gsap.from('.skills-text', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.skill-category', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Animate skill bars
    gsap.from('.skill-level', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 60%',
            toggleActions: 'play none none none'
        },
        width: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    // Resume section animations
    gsap.from('.resume-download', {
        scrollTrigger: {
            trigger: '#resume',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.timeline-item', {
        scrollTrigger: {
            trigger: '#resume',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Contact section animations
    gsap.from('.contact-card', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // 3D tilt effect for project cards (only for non-touch devices)
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!isTouchDevice) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Calculate rotation values based on mouse position
                const rotateY = mouseX / 10;
                const rotateX = -mouseY / 10;
                
                // Apply the 3D rotation
                gsap.to(card, {
                    rotationY: rotateY,
                    rotationX: rotateX,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                // Reset the rotation when mouse leaves
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    } else {
        // Add subtle hover effect for touch devices
        projectCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                gsap.to(card, {
                    scale: 0.98,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('touchend', function() {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// Project filtering functionality
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects instantly
            projectCards.forEach(card => {
                // Reset any GSAP properties that might interfere
                gsap.set(card, { clearProps: 'all' });
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Re-trigger ScrollTrigger to update layout positions
            ScrollTrigger.refresh();
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Form will submit normally to the mailto: action
            // Just perform client-side validation before submission
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic form validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                e.preventDefault();
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                e.preventDefault();
                return;
            }
            
            // If validation passes, the form will submit normally
            // and open the user's email client
            
            // Reset form
            contactForm.reset();
        });
        
        // Improve form field focus on mobile
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                // Add a class to highlight the active input field
                this.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('input-focused');
            });
        });
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use default light theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load
    if (savedTheme === 'dark') {
        htmlElement.classList.add('theme-dark');
    }
    
    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle dark class on html element
            htmlElement.classList.toggle('theme-dark');
            
            // Save preference to localStorage
            const currentTheme = htmlElement.classList.contains('theme-dark') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }
}

// Touch-specific enhancements for mobile devices
function initTouchEnhancements() {
    // Improve button tap response
    const allButtons = document.querySelectorAll('.btn, button, .filter-btn, .social-icon');
    allButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Add active states for better touch feedback
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        link.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        }, { passive: true });
    });
    
    // Optimize scroll performance on mobile
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('mobile-optimized');
    });
    

}

// Initialize blog modals
function initBlogModals() {
    const blogCards = document.querySelectorAll('.blog-card');
    const blogModals = document.querySelectorAll('.blog-modal');
    const closeButtons = document.querySelectorAll('.blog-modal-close');
    
    // Open modal when Read More is clicked
    blogCards.forEach(card => {
        const blogId = card.getAttribute('data-blog-id');
        const readMoreBtn = card.querySelector('.blog-link');
        
        if (readMoreBtn && blogId) {
            readMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = document.getElementById(`blogModal${blogId}`);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                }
            });
        }
    });
    
    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.blog-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });
    
    // Close modal when clicking outside the content
    blogModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            blogModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Re-enable scrolling
                }
            });
        }
    });
}

// Add CSS class for animation when elements come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
}

// Call the animation function on scroll
window.addEventListener('scroll', animateOnScroll);

// Call it once on load to check for elements already in view
window.addEventListener('load', animateOnScroll);

// Add keyframe animations for text typing effect
function initTypingEffect() {
    const textElement = document.querySelector('.typing-text');
    
    if (textElement) {
        const text = textElement.textContent;
        textElement.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                textElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
    }
}

// Initialize parallax effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(window.scrollY * speed);
            
            gsap.to(element, {
                y: yPos,
                ease: 'none',
                duration: 0.1
            });
        });
    });
}

// Call additional initialization functions
window.addEventListener('load', function() {
    initTypingEffect();
    initParallaxEffect();
    
    // Add a class to body when page is loaded
    document.body.classList.add('loaded');
});

// Responsive relocation of theme toggle for mobile/tablet
function relocateThemeToggle() {
    const mq = window.matchMedia('(max-width: 768px)');
    const themeToggle = document.getElementById('theme-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.burger');
    if (!themeToggle || !navLinks || !navbar) return;
    
    function moveToggle(e) {
        if (mq.matches) {
            if (themeToggle.parentElement !== navLinks) {
                navLinks.insertBefore(themeToggle, navLinks.firstChild);
            }
        } else {
            if (themeToggle.parentElement !== navbar) {
                // Place before burger for right-side positioning
                navbar.insertBefore(themeToggle, burger);
            }
        }
    }
    moveToggle();
    mq.addEventListener('change', moveToggle);
}

// Lightweight canvas particles for Home/Hero
function initHeroCanvas() {
    const section = document.getElementById('home');
    const canvas = document.getElementById('heroCanvas');
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ffffff';
    const baseColor = 'rgba(255,255,255,0.9)';
    
    function resize() {
        w = section.clientWidth;
        h = section.clientHeight;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles();
    }
    
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function initParticles() {
        const area = w * h;
        const count = Math.max(60, Math.min(140, Math.floor(area / 15000)));
        particles = [];
        for (let i = 0; i < count; i++) {
            const r = rand(0.8, 2.2);
            const speed = rand(0.05, 0.25);
            const angle = rand(0, Math.PI * 2);
            const useAccent = Math.random() < 0.25;
            particles.push({
                x: rand(0, w),
                y: rand(0, h),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r,
                color: useAccent ? primary : baseColor,
                glow: useAccent ? 8 : 6
            });
        }
    }
    
    function step() {
        ctx.clearRect(0, 0, w, h);
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            // gentle drift
            p.vx += rand(-0.005, 0.005);
            p.vy += rand(-0.005, 0.005);
            // bounds bounce
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            // draw
            ctx.beginPath();
            ctx.shadowBlur = p.glow;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(step);
    }
    
    // Observe section size changes
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    window.addEventListener('resize', resize);
    resize();
    step();
}
