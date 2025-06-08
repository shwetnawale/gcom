window.addEventListener('scroll', function() {
  const headerSub = document.querySelector('.header-sub');
  const scrollPosition = window.scrollY;

  // You can adjust the scroll threshold as needed
  if (scrollPosition > 1000) { 
    headerSub.style.backgroundColor = '#0278ff'; // Change to white
    headerSub.style.color = '#0278ff'; // Change text color if needed
  } else {
    headerSub.style.backgroundColor = '#222'; // Revert to original gray
    headerSub.style.color = '#222'; // Revert text color to original (if any)
  }
});
