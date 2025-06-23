// wel-explore-script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Functionality ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const body = document.body;

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

    // --- Community Selection Functionality ---
    const communityCards = document.querySelectorAll('.community-card');
    const continueBtn = document.getElementById('continue-btn');
    const MIN_SELECTIONS = 3;
    const MAX_SELECTIONS = 5;
    let selectedCount = 0;

    const updateContinueButton = () => {
        if (selectedCount >= MIN_SELECTIONS && selectedCount <= MAX_SELECTIONS) {
            continueBtn.disabled = false;
        } else {
            continueBtn.disabled = true;
        }
    };

    communityCards.forEach(card => {
        card.addEventListener('click', () => {
            const isSelected = card.classList.contains('selected');

            if (isSelected) {
                card.classList.remove('selected');
                selectedCount--;
            } else {
                // Optional: Prevent selecting more than MAX_SELECTIONS
                if (selectedCount < MAX_SELECTIONS) {
                    card.classList.add('selected');
                    selectedCount++;
                } else {
                    // Optional: Provide feedback that the max limit is reached
                    alert(`You can select a maximum of ${MAX_SELECTIONS} communities.`);
                }
            }
            updateContinueButton();
        });
    });

    continueBtn.addEventListener('click', () => {
        if (!continueBtn.disabled) {
            const selectedCommunities = [];
            document.querySelectorAll('.community-card.selected').forEach(card => {
                selectedCommunities.push(card.dataset.community);
            });

            console.log('Selected communities:', selectedCommunities);
            // Here you would typically save the user's preferences
            // and navigate to the main app page.
            localStorage.setItem('gcom-communities', JSON.stringify(selectedCommunities));
            window.location.href = 'home.html'; // Navigate to the chat page
        }
    });
});