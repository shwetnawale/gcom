
window.addEventListener('scroll', function() {
  const headerSub = document.querySelector('.header-sub');
  const scrollPosition = window.scrollY;

  if (scrollPosition > 950) { 
    headerSub.style.background = 'linear-gradient(to right, #ff0d0d, #2339ff)';
    // For solid text color, use a single color:
    headerSub.style.color = '#fff';
  } else {
    headerSub.style.background = '#e9e9e9';
    headerSub.style.color = '#222';
  }
});