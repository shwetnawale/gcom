// G-COM Universal Script
// This script is designed to run on all pages.
// It checks for the existence of elements before adding event listeners.

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- Theme Toggle Functionality (Global) ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

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
        // Apply theme on initial load
        applyTheme(savedTheme || 'light');

        // Event listener for theme toggle button
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('gcom-theme', newTheme);
        });
    }

    // --- Index Page: Sticky Header Scroll Effect ---
    const headerSub = document.querySelector('.header-sub');
    if (headerSub) {
        const gradientOverlay = document.querySelector('.header-sub .gradient-overlay');
        const navbarInHeaderSub = document.querySelector('.header-sub .navbar');

        const handleScroll = () => {
            // The elements are guaranteed to exist if headerSub exists
            if (headerSub.getBoundingClientRect().top <= 0) {
                gradientOverlay.style.opacity = '1';
                navbarInHeaderSub.classList.add('text-on-gradient');
            } else {
                gradientOverlay.style.opacity = '0';
                navbarInHeaderSub.classList.remove('text-on-gradient');
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for performance
        handleScroll(); // Initial check on page load
    }

    // --- Index Page: Home Button Navigation ---
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = 'yuvraj.html';
        });
    }
});