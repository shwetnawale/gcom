document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    const setTheme = (isDark) => {
        document.body.classList.toggle('dark-theme', isDark);
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'block' : 'none';
            moonIcon.style.display = isDark ? 'none' : 'block';
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    setTheme(isDark);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(!document.body.classList.contains('dark-theme'));
        });
    }

    // --- Sticky Header Logic ---
    const headerSub = document.querySelector('.header-sub');
    if (headerSub) {
        const navbar = headerSub.querySelector('.navbar');
        const gradientOverlay = headerSub.querySelector('.gradient-overlay');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const triggerPoint = 200; // Example: activate after scrolling 200px

            if (scrollPosition > triggerPoint) {
                gradientOverlay.style.opacity = '1';
                navbar.classList.add('text-on-gradient');
            } else {
                gradientOverlay.style.opacity = '0';
                navbar.classList.remove('text-on-gradient');
            }
        });
    }

    // --- Single-Page Application (SPA) Navigation Logic ---
    const pageContent = document.getElementById('page-content');

    const fetchPage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page not found');
            const text = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(text, 'text/html');
        } catch (error) {
            console.error('Failed to fetch page:', error);
            window.location.assign(url); // Fallback to full reload on error
            return null;
        }
    };

    const updatePage = (doc) => {
        if (!doc || !pageContent) return;

        document.title = doc.title;
        const newContent = doc.getElementById('page-content');

        if (newContent) {
            pageContent.style.opacity = '0';
            pageContent.style.transition = 'opacity 0.3s ease-out';
            pageContent.addEventListener('transitionend', () => {
                pageContent.innerHTML = newContent.innerHTML;
                pageContent.style.opacity = '1';
            }, { once: true });
        }
    };

    const handleNav = async (url) => {
        const doc = await fetchPage(url);
        if (doc) {
            history.pushState({ path: url }, '', url);
            updatePage(doc);
        }
    };

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.origin === window.location.origin && !link.hash) {
            e.preventDefault();
            if (link.href !== window.location.href) {
                handleNav(link.href);
            }
        }
    });

    window.addEventListener('popstate', async (e) => {
        const path = e.state?.path || window.location.pathname;
        const doc = await fetchPage(path);
        if (doc) updatePage(doc);
    });
});