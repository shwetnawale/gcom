// script.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const body = document.body;

    // --- Theme Toggle Functionality ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            body.classList.remove('dark-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('gcom-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light'); // Default to light theme
    }

    // Event listener for theme toggle button
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('gcom-theme', newTheme);
    });

    // --- Sticky Header Scroll Effect ---
    // This logic is specific to index.html which has the sticky header
    const headerSub = document.querySelector('.header-sub');
    const gradientOverlay = document.querySelector('.header-sub .gradient-overlay');
    const navbarInHeaderSub = document.querySelector('.header-sub .navbar');

    function handleScroll() {
        // The elements are guaranteed to exist on index.html
        if (headerSub.getBoundingClientRect().top <= 0) {
            gradientOverlay.style.opacity = '1';
            navbarInHeaderSub.classList.add('text-on-gradient');
        } else {
            gradientOverlay.style.opacity = '0';
            navbarInHeaderSub.classList.remove('text-on-gradient');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on page load

    // --- Home Button Navigation ---
    const homeButton = document.getElementById('wel-explore-btn');
    homeButton.addEventListener('click', function() {
        window.location.href = 'wel-explore.html';
    });

    // --- Animated Home Button Navigation ---
    const animationButton = document.getElementById('wel-explore-animation-btn');
    animationButton.addEventListener('click', function() {
        window.location.href = 'wel-explore - Copy.html';
    });

     const animationButtonn = document.getElementById('home3-animation-btn');
    animationButtonn.addEventListener('click', function() {
        window.location.href = 'home3.html';
    });
});