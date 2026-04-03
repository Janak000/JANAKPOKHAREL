// DOM Elements
const mobileMenu = document.querySelector('.mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.mobile-close');
const userLinks = document.querySelectorAll('.mobile-menu a');

// Toggle Mobile Menu
function toggleMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (menuClose) menuClose.addEventListener('click', toggleMenu);

// Close menu when clicking a link and Set Active State
userLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
        setActive(link, userLinks);
    });
});

// Select Desktop Nav Links
const desktopLinks = document.querySelectorAll('.nav-links a');

desktopLinks.forEach(link => {
    link.addEventListener('click', () => {
        setActive(link, desktopLinks);
    });
});

// Helper to set active class
function setActive(targetElement, allElements) {
    allElements.forEach(el => el.classList.remove('active'));
    targetElement.classList.add('active');
}

// Smooth Scroll for Anchor Links (Backup for older browsers, though CSS scroll-behavior usually handles it)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Offset for fixed header
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .hero-content > *, .section-title').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
