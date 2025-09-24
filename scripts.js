
const cards = document.querySelectorAll('.project-carousel .card');
const carouselNav = document.querySelector('.carousel-nav');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
let currentCard = 0;

function generateNavButtons() {
    carouselNav.innerHTML = '';
    cards.forEach((_, index) => {
        const button = document.createElement('button');
        if (index === 0) button.classList.add('active');
        carouselNav.appendChild(button);
    });
}

generateNavButtons();
const navButtons = document.querySelectorAll('.carousel-nav button');

function updateCarousel(index) {
    index = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
    navButtons.forEach((button, i) => button.classList.toggle('active', i === index));
    arrowLeft.classList.toggle('arrow-hidden', index === 0);
    arrowRight.classList.toggle('arrow-hidden', index === cards.length - 1);
    currentCard = index;
}

navButtons.forEach((button, index) => button.addEventListener('click', () => updateCarousel(index)));
arrowLeft.addEventListener('click', () => { if (currentCard > 0) updateCarousel(currentCard - 1); });
arrowRight.addEventListener('click', () => { if (currentCard < cards.length - 1) updateCarousel(currentCard + 1); });
updateCarousel(0);

// Hamburger toggle sederhana (tanpa GSAP)
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
hamburger.addEventListener('click', () => {
    const isActive = nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.textContent = isActive ? '✕' : '☰';
});

