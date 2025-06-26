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

        // Calculate the initial offset of headerSub from the top of the document.
        // This is the scroll position at which it should become sticky (top: 0).
        const headerSubOffsetTop = headerSub.offsetTop;

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            // The trigger point is now dynamic: when the scroll position
            // is greater than or equal to the initial position of headerSub.
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
        // Exclude modal triggers and links with hashes from SPA navigation
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

    // --- Scroll Animation for Cards ---
    const cards = document.querySelectorAll('.card');

    const checkIfInView = () => {
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
});
document.addEventListener('DOMContentLoaded', () => {
  // Get the root element of the component
  const root = document.getElementById('card-stack-scroll');

  // If the root element doesn't exist, the component can't initialize.
  // This is important if you're embedding this on a page where it might not always be present.
  if (!root) {
    console.warn('Card Stack Scroll component root (#card-stack-scroll) not found. Skipping initialization.');
    return;
  }

  // Select elements relative to the root to ensure scoping
  const cards = Array.from(root.querySelectorAll('.card'));
  const scrollContainer = root.querySelector('#scroll-container');

  // Basic validation for critical elements
  if (!scrollContainer) {
    console.error('Scroll container (#scroll-container) not found within #card-stack-scroll. Component cannot function.');
    return;
  }

  const numCards = cards.length;
  const vh = window.innerHeight; // Viewport height is a global property

  // Set height for scrolling. Each card transition takes one viewport height.
  scrollContainer.style.height = `${100 * numCards}vh`;

  // --- Snap Scrolling Logic ---
  let currentCardIndex = 0;
  let isAnimating = false;

  function snapToCard(index) {
    // Ensure index is within bounds and not already animating
    if (isAnimating || index < 0 || index >= numCards) return;

    isAnimating = true;
    currentCardIndex = index;

    // Programmatically scroll the entire window.
    // This is how the "snap" effect is achieved by moving the whole page.
    window.scrollTo({
      top: index * vh,
      behavior: 'smooth'
    });

    // Reset animation flag after a delay matching the smooth scroll duration
    setTimeout(() => {
      isAnimating = false;
    }, 900); // Adjust this timeout if 'behavior: smooth' takes a different amount of time
  }

  // --- Event Listeners for Interaction ---
  // To make the global scroll/wheel/keyboard events "private" to this div,
  // we use a flag `isActive` that is set when the mouse is over the component.
  let isActive = false;
  root.addEventListener('mouseenter', () => { isActive = true; });
  root.addEventListener('mouseleave', () => { isActive = false; });

  // Listen for mouse wheel to trigger snap scroll
  window.addEventListener('wheel', (event) => {
    if (!isActive) return; // Only process if mouse is over our component
    event.preventDefault(); // Prevent default browser scrolling behavior
    if (isAnimating) return; // Don't queue new animations if one is in progress

    if (event.deltaY > 0) { // Scrolling down
      snapToCard(currentCardIndex + 1);
    } else { // Scrolling up
      snapToCard(currentCardIndex - 1);
    }
  }, { passive: false }); // `passive: false` is crucial for `preventDefault()` to work

  // Listen for keyboard arrows for accessibility
  window.addEventListener('keydown', (event) => {
    if (!isActive) return; // Only process if mouse is over our component
    if (isAnimating) return; // Don't queue new animations if one is in progress

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault(); // Prevent default page scroll
      snapToCard(currentCardIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault(); // Prevent default page scroll
      snapToCard(currentCardIndex - 1);
    }
  });
  // --- End of Snap Scrolling Logic ---

  // This listener handles the visual transformation of cards based on the global scroll position.
  // It runs whenever the window scrolls, including during the programmatic 'smooth' scroll.
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY; // Current vertical scroll position of the window

    cards.forEach((card, i) => {
      // Calculate the start of the current card's "section" in the scrollable space
      const sectionStart = i * vh;
      // Calculate how far into this card's section the user has scrolled
      const scrollInSection = scrollY - sectionStart;

      // Animation parameters
      const finalSideOffset = 90; // How far off-center the card ends up (e.g., 90% of its width)
      const startHorizontalOffset = 90; // How far off-screen the card starts

      // Check if the current scroll position is relevant to this card's animation
      // A card animates over 2 viewport heights: 1st vh for entering, 2nd vh for exiting.
      if (scrollInSection >= 0 && scrollInSection < 2 * vh) {
        card.style.zIndex = i; // Ensure cards stack correctly during animation

        if (scrollInSection < vh) { // Animating IN (first viewport height)
          const progress = scrollInSection / vh; // Progress from 0 (start of section) to 1 (end of first vh)
          const scale = 0.85 + progress * 0.15; // Scale from 0.85 to 1
          const translateY = 100 - (progress * 100); // Move up from 100% to 0%
          // Calculate horizontal translation:
          // Even cards move from positive start to positive final offset
          // Odd cards move from negative start to negative final offset
          const translateX = (i % 2 === 0)
            ? startHorizontalOffset - ((startHorizontalOffset - finalSideOffset) * progress)
            : -startHorizontalOffset + ((startHorizontalOffset - finalSideOffset) * progress);

          card.style.transform = `translateX(${translateX}%) translateY(${translateY}%) scale(${scale})`;
          card.style.opacity = progress; // Fade in from 0 to 1
        } else { // Animating OUT (second viewport height)
          const progress = (scrollInSection - vh) / vh; // Progress from 0 (start of second vh) to 1
          const opacity = 1 - progress; // Fade out from 1 to 0
          // Card remains at its final side offset, but fades out
          const translateX = (i % 2 === 0) ? finalSideOffset : -finalSideOffset;

          card.style.transform = `translateX(${translateX}%) translateY(0%) scale(1)`;
          card.style.opacity = opacity;
        }
      } else if (scrollInSection < 0) { // Card is above the current view, waiting to appear
        // Set initial state: off-screen horizontally, slightly down, and transparent
        const initialTranslateX = (i % 2 === 0) ? startHorizontalOffset : -startHorizontalOffset;
        card.style.transform = `translateX(${initialTranslateX}%) translateY(100%) scale(0.85)`;
        card.style.opacity = 0;
      } else {
        // Card has finished its animation and is below the current view, ensure it's hidden.
        card.style.opacity = 0;
      }
    });
  });

  // Trigger a scroll event once on load to set the initial positions of all cards correctly.
  // This ensures the first card is visible and others are in their starting positions.
  window.dispatchEvent(new Event('scroll'));
});