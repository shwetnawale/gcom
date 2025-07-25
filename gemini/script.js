document.addEventListener('DOMContentLoaded', () => {

    // --- Global Helper Functions ---
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);
    const querySelectorAll = (selector) => document.querySelectorAll(selector);

    // --- Close All Modals Helper ---
    // This is a new helper function to gracefully close any open modals.
    const closeAllModals = () => {
        const profileModal = getElement('profile-modal');
        const profileOverlay = getElement('modal-overlay');
        if (profileModal?.classList.contains('visible')) {
            profileModal.classList.remove('visible');
            profileOverlay.classList.remove('visible');
        }
        const authModal = getElement('auth-modal');
        if (authModal?.style.display === 'flex') {
            authModal.style.display = 'none';
        }
    };

    // --- Theme Toggle Logic ---
    const themeToggle = getElement('theme-toggle') || getElement('theme-toggle-btn');
    const sunIcon = getElement('sun-icon');
    const moonIcon = getElement('moon-icon');

    const setTheme = (isDark) => {
        document.body.classList.toggle('dark-theme', isDark);
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'block' : 'none';
            moonIcon.style.display = isDark ? 'none' : 'block';
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
        setTheme(isDark);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTheme(!document.body.classList.contains('dark-theme'));
            });
        }
    };

    // --- Sticky Header Logic ---
    const initializeStickyHeader = () => {
        const headerSub = querySelector('.header-sub');
        if (!headerSub) return;

        const navbar = headerSub.querySelector('.navbar');
        const gradientOverlay = headerSub.querySelector('.gradient-overlay');
        const headerSubOffsetTop = headerSub.offsetTop;

        window.addEventListener('scroll', () => {
            if (window.scrollY >= headerSubOffsetTop) {
                gradientOverlay.style.opacity = '1';
                navbar.classList.add('text-on-gradient');
            } else {
                gradientOverlay.style.opacity = '0';
                navbar.classList.remove('text-on-gradient');
            }
        }, { passive: true });
    };

    // --- Single-Page Application (SPA) Navigation Logic ---
    const pageContent = getElement('page-content');
    let isTransitioning = false;

    const fetchPage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Page not found: ${response.statusText}`);
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
        if (!doc || !pageContent) {
            isTransitioning = false;
            document.body.classList.remove('page-transitioning');
            return;
        }

        document.title = doc.title;
        const newContent = doc.getElementById('page-content');

        if (newContent) {
            pageContent.innerHTML = newContent.innerHTML;
            reinitializeDynamicComponents();
            pageContent.style.opacity = '1';
        }

        setTimeout(() => {
            isTransitioning = false;
            document.body.classList.remove('page-transitioning');
        }, 50);
    };

    const handleNav = async (url, pushState = true) => {
        if (isTransitioning) return;
        isTransitioning = true;
        document.body.classList.add('page-transitioning');

        // *** KEY IMPROVEMENT IS HERE ***
        // Close any open modals before starting the page transition.
        closeAllModals();

        pageContent.style.opacity = '0';

        pageContent.addEventListener('transitionend', async () => {
            const doc = await fetchPage(url);
            if (doc) {
                if (pushState && window.location.href !== url) {
                    history.pushState({ path: url }, '', url);
                }
                updatePage(doc);
            } else {
                 isTransitioning = false;
                 document.body.classList.remove('page-transitioning');
            }
        }, { once: true });
    };

    const initializeSPA = () => {
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || isTransitioning) return;
            
            if (link.host !== window.location.host || link.target === '_blank' || link.classList.contains('no-spa')) {
                return;
            }
            
            if (link.hash || link.getAttribute('href') === '#') {
                return;
            }

            e.preventDefault();
            handleNav(link.href);
        });
        
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                handleNav(e.state.path, false);
            } else {
                handleNav(location.pathname + location.search, false);
            }
        });
    };
    
    // --- Modal Logic (Authentication, Profile, Settings) ---
    const initializeModals = () => {
        // Auth Modal
        const authModal = getElement('auth-modal');
        const openAuthModalBtns = querySelectorAll('.open-auth-modal');

        if (authModal && openAuthModalBtns.length > 0) {
            const closeModalBtn = authModal.querySelector('.close-button');
            const showLoginLink = getElement('show-login');
            const showSignupLink = getElement('show-signup');
            const signupView = getElement('signup-view');
            const loginView = getElement('login-view');
            
            const openModal = (e) => {
                if (e) e.preventDefault();
                authModal.style.display = 'flex';
                if (signupView) signupView.style.display = 'block';
                if (loginView) loginView.style.display = 'none';
            };

            const closeModal = () => { authModal.style.display = 'none'; };

            openAuthModalBtns.forEach(btn => btn.addEventListener('click', openModal));
            if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

            authModal.addEventListener('click', e => (e.target === authModal) && closeModal());
            if(showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); signupView.style.display = 'none'; loginView.style.display = 'block'; });
            if(showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); loginView.style.display = 'none'; signupView.style.display = 'block'; });
        }

        // Profile Modal (from home.html)
        const openProfileModalBtn = getElement('open-profile-modal');
        const profileModal = getElement('profile-modal');
        const profileOverlay = getElement('modal-overlay');

        if(openProfileModalBtn && profileModal && profileOverlay) {
            const open = (e) => {
                e.preventDefault();
                profileOverlay.classList.add('visible');
                profileModal.classList.add('visible');
            };
            const close = () => {
                profileOverlay.classList.remove('visible');
                profileModal.classList.remove('visible');
            };
            openProfileModalBtn.addEventListener('click', open);
            profileOverlay.addEventListener('click', close);
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals(); // Use the helper here as well
            }
        });
    };
    
    // --- Hamburger Menu Logic ---
    const initializeHamburger = () => {
        const hamburgerMenu = querySelector('.hamburger-menu');
        const navContainer = querySelector('.join-now-header-btn-container');

        if (hamburgerMenu && navContainer) {
            hamburgerMenu.addEventListener('click', () => {
                const isActive = navContainer.classList.toggle('active');
                hamburgerMenu.classList.toggle('active');
                document.body.style.overflow = isActive ? 'hidden' : '';
            });

            navContainer.addEventListener('click', (e) => {
                if (e.target.closest('a')) {
                    navContainer.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    };

    // --- Scroll Reveal Animation Logic ---
    const initializeScrollReveal = () => {
        const revealElements = querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(el => observer.observe(el));
    };
    
    // --- Master Initializer ---
    const initializePage = () => {
        initializeTheme();
        initializeSPA();
        reinitializeDynamicComponents();
    };
    
    // --- Re-initializer for SPA Navigation ---
    const reinitializeDynamicComponents = () => {
        initializeStickyHeader();
        initializeModals();
        initializeHamburger();
        initializeScrollReveal();
    };

    // Let's go!
    initializePage();
});