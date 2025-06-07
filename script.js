document.getElementById('alertButton').addEventListener('click', function() {
    alert('Hello! You just clicked the button.');
});

const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 20;
for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    // Random position in percent within container
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    // Random animation delay between 0-4 seconds
    particle.style.animationDelay = `${Math.random() * 4}s`;
    // Random animation duration between 4-8 seconds
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    particlesContainer.appendChild(particle);
  }