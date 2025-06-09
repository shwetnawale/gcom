window.addEventListener('scroll', function() {
  const headerSub = document.querySelector('.header-sub');
  const gradientOverlay = document.querySelector('.gradient-overlay');
  const scrollPosition = window.scrollY;

  if (headerSub && gradientOverlay) {
    if (headerSub.getBoundingClientRect().top <= 0) {
      // When header-sub touches the top, fade in the gradient
      gradientOverlay.style.opacity = '1';
      headerSub.style.color = '#fff';
    } else {
      // Otherwise, fade out the gradient
      gradientOverlay.style.opacity = '0';
      headerSub.style.color = '#222';
    }
  }
});