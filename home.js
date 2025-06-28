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

        const headerSubOffsetTop = headerSub.offsetTop;

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition >= headerSubOffsetTop) {
                gradientOverlay.style.opacity = '1';
                navbar.classList.add('text-on-gradient');
            } else {
                gradientOverlay.style.opacity = '0';
                navbar.classList.remove('text-on-gradient');
            }
        });
    }

    // --- Single-Page Application (SPA) Navigation Logic ---
    // Note: This logic is designed to load only the #page-content div from other HTML files.
    // Pages like 'spaces.html' have their full HTML structure, so for 'spaces.html'
    // we explicitly use `no-spa` class on its link to force a full page reload.
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
        // Find the specific content div from the fetched document
        const newContent = doc.getElementById('page-content');

        if (newContent) {
            pageContent.style.opacity = '0';
            pageContent.style.transition = 'opacity 0.3s ease-out';
            pageContent.addEventListener('transitionend', () => {
                // Replace the content of the current #page-content
                pageContent.innerHTML = newContent.innerHTML;
                // Re-apply the current theme class after content replacement
                setTheme(document.body.classList.contains('dark-theme'));
                // Make content visible again
                pageContent.style.opacity = '1';
                // Re-run any scripts specific to the newly loaded content if necessary.
                // For this example, if there were new .card elements, checkIfInView would re-run.
                checkIfInView(); // Re-check card visibility after content update
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
        // Exclude modal triggers and links with hashes from SPA navigation
        // Also exclude links with 'no-spa' class for full page reload
        if (link && link.origin === window.location.origin && !link.hash && !link.classList.contains('no-spa') && link.id !== 'join-now-btn' && !link.id.includes('show-')) {
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

    // --- Authentication Modal Logic ---
    const joinNowBtn = document.getElementById('join-now-btn');
    const authModal = document.getElementById('auth-modal');
    
    if (authModal && joinNowBtn) {
        const closeModalBtn = authModal.querySelector('.close-button');
        const showLoginLink = document.getElementById('show-login');
        const showSignupLink = document.getElementById('show-signup');
        const signupView = document.getElementById('signup-view');
        const loginView = document.getElementById('login-view');

        const openModal = () => {
            authModal.style.display = 'flex';
            // Reset to signup view every time it opens
            if (signupView) signupView.style.display = 'block';
            if (loginView) loginView.style.display = 'none';
        };

        const closeModal = () => {
            authModal.style.display = 'none';
        };

        // Event Listeners for opening and closing the modal
        joinNowBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent anchor link from jumping
            openModal();
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Close modal if user clicks on the background overlay
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeModal();
            }
        });

        // Close modal with the Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && authModal.style.display === 'flex') {
                closeModal();
            }
        });

        // Event listeners for switching between signup and login views
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                signupView.style.display = 'none';
                loginView.style.display = 'block';
            });
        }

        if (showSignupLink) {
            showSignupLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginView.style.display = 'none';
                signupView.style.display = 'block';
            });
        }
    }

    // --- Scroll Animation for Cards (reused for .card in index.html and .space-card if applicable) ---
    // This function will select all elements with class 'card' OR 'space-card'
    const checkIfInView = () => {
        const cards = document.querySelectorAll('.card, .space-card'); // Select both types of cards
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;

            // If the top of the card is within 80% of the viewport height
            if (cardTop < viewportHeight * 0.8) {
                card.classList.add('show');
            } else {
                card.classList.remove('show'); // Optional: hide if scrolled out of view upwards
            }
        });
    };

    // Initial check on page load
    checkIfInView();

    // Check on scroll
    window.addEventListener('scroll', checkIfInView);


    // --- Specific logic for Card Stack Scroll component (from scroll.html) ---
    // This logic is for the *specific* interactive scroll component, distinct from the
    // simpler .card.show animation. It should only run if the 'card-stack-scroll'
    // element is present on the page.
    const cardStackRoot = document.getElementById('card-stack-scroll');
    if (cardStackRoot) {
        const cards = Array.from(cardStackRoot.querySelectorAll('.card'));
        const scrollContainer = cardStackRoot.querySelector('#scroll-container');
        const numCards = cards.length;
        const vh = window.innerHeight;

        // Set height for scrolling. Each card transition takes one viewport height.
        if (scrollContainer) { // Ensure scrollContainer exists
            scrollContainer.style.height = `${100 * numCards}vh`;
        } else {
            console.warn('Scroll container (#scroll-container) not found within #card-stack-scroll.');
        }


        // --- Snap Scrolling Logic ---
        let currentCardIndex = 0;
        let isAnimating = false;

        function snapToCard(index) {
            if (isAnimating || index < 0 || index >= numCards) return; // Corrected: >= numCards
            isAnimating = true;
            currentCardIndex = index;

            window.scrollTo({
                top: index * vh,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isAnimating = false;
            }, 900);
        }

        let isActive = false;
        cardStackRoot.addEventListener('mouseenter', () => { isActive = true; });
        cardStackRoot.addEventListener('mouseleave', () => { isActive = false; });

        window.addEventListener('wheel', (event) => {
            if (!isActive) return;
            event.preventDefault();
            if (isAnimating) return;

            if (event.deltaY > 0) {
                snapToCard(currentCardIndex + 1);
            } else {
                snapToCard(currentCardIndex - 1);
            }
        }, { passive: false });

        window.addEventListener('keydown', (event) => {
            if (!isActive) return;
            if (isAnimating) return;

            if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                event.preventDefault();
                snapToCard(currentCardIndex + 1);
            } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
                event.preventDefault();
                snapToCard(currentCardIndex - 1);
            }
        });

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            cards.forEach((card, i) => {
                const sectionStart = i * vh;
                const scrollInSection = scrollY - sectionStart;
                const finalSideOffset = 90;
                const startHorizontalOffset = 90;

                if (scrollInSection >= 0 && scrollInSection < 2 * vh) {
                    card.style.zIndex = i;
                    if (scrollInSection < vh) {
                        const progress = scrollInSection / vh;
                        const scale = 0.85 + progress * 0.15;
                        const translateY = 100 - (progress * 100);
                        const translateX = (i % 2 === 0)
                            ? startHorizontalOffset - ((startHorizontalOffset - finalSideOffset) * progress)
                            : -startHorizontalOffset + ((startHorizontalOffset - finalSideOffset) * progress);
                        card.style.transform = `translateX(${translateX}%) translateY(${translateY}%) scale(${scale})`;
                        card.style.opacity = progress;
                    } else {
                        const progress = (scrollInSection - vh) / vh;
                        const opacity = 1 - progress;
                        const translateX = (i % 2 === 0) ? finalSideOffset : -finalSideOffset;
                        card.style.transform = `translateX(${translateX}%) translateY(0%) scale(1)`;
                        card.style.opacity = opacity;
                    }
                } else if (scrollInSection < 0) {
                    const initialTranslateX = (i % 2 === 0) ? startHorizontalOffset : -startHorizontalOffset;
                    card.style.transform = `translateX(${initialTranslateX}%) translateY(100%) scale(0.85)`;
                    card.style.opacity = 0;
                } else {
                    card.style.opacity = 0;
                }
            });
        });

        // Trigger a scroll event once on load to set the initial positions of all cards correctly.
        window.dispatchEvent(new Event('scroll'));
    }
});
