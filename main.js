
// Initialize Lucide icons
lucide.createIcons();

// Dark mode functionality (Default is Dark)
let isLight = false;

function toggleDarkMode() {
    isLight = !isLight;
    document.body.classList.toggle('light', isLight);

    const themeIcon = document.getElementById('theme-icon');
    themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
    lucide.createIcons();
}

// Scroll animations
function handleScroll() {
    const scrollTop = window.pageYOffset;
    const scrollButton = document.getElementById('scrollTop');

    // Show/hide scroll to top button
    if (scrollTop > 400) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }

    // Blow up animation on scroll
    const elements = document.querySelectorAll('.blow-up');
    elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('in-view');
        }
    });
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Event listeners
window.addEventListener('scroll', handleScroll);
document.getElementById('scrollTop').addEventListener('click', scrollToTop);

// Add smooth scrolling to navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target);
    });
});

// Hover effects for cards & Spotlight
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function () {
    handleScroll();

    // Initialize Lucide icons after DOM is loaded
    lucide.createIcons();
});
