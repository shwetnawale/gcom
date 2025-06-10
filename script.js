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
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            body.classList.remove('dark-theme');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
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
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('gcom-theme', newTheme);
        });
    }

    // --- Sticky Header Scroll Effect ---
    const headerSub = document.querySelector('.header-sub');
    const gradientOverlay = document.querySelector('.header-sub .gradient-overlay');
    const navbarInHeaderSub = document.querySelector('.header-sub .navbar');

    function handleScroll() {
        if (!headerSub || !gradientOverlay || !navbarInHeaderSub) return;

        if (headerSub.getBoundingClientRect().top <= 0) {
            gradientOverlay.style.opacity = '1';
            navbarInHeaderSub.classList.add('text-on-gradient');
        } else {
            gradientOverlay.style.opacity = '0';
            navbarInHeaderSub.classList.remove('text-on-gradient');
        }
    }

    if (headerSub && gradientOverlay && navbarInHeaderSub) {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check on page load
    }
});
