gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll('section');
const container = document.querySelector('.container');
let currentSection = 0;
let isScrolling = false;
let scrollTween = null;

// Smooth scroll setup
gsap.set(container, { y: 0 });

// Parallax effect for each section
sections.forEach((section) => {
    try {
        gsap.to(section, {
            backgroundPositionY: '50%',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                scrub: true,
                start: 'top bottom',
                end: 'bottom top'
            }
        });
    } catch (error) {
        console.error('Error in parallax setup:', error);
    }
});

// Scroll indicator animation
gsap.to('.scroll-dot', {
    y: 68,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'power1.inOut'
});

// Carousel for projects
const cards = document.querySelectorAll('.project-carousel .card');
const carouselNav = document.querySelector('.carousel-nav');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
let currentCard = 0;

// Generate navigation buttons dynamically
function generateNavButtons() {
    carouselNav.innerHTML = '';
    cards.forEach((_, index) => {
        const button = document.createElement('button');
        if (index === 0) button.classList.add('active');
        carouselNav.appendChild(button);
    });
}

// Initialize navigation buttons
generateNavButtons();
const navButtons = document.querySelectorAll('.carousel-nav button');

function updateCarousel(index) {
    index = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    navButtons.forEach((button, i) => {
        button.classList.toggle('active', i === index);
    });
    arrowLeft.classList.toggle('arrow-hidden', index === 0);
    arrowRight.classList.toggle('arrow-hidden', index === cards.length - 1);
    currentCard = index;
}

navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        updateCarousel(index);
    });
});

arrowLeft.addEventListener('click', () => {
    if (currentCard > 0) updateCarousel(currentCard - 1);
});

arrowRight.addEventListener('click', () => {
    if (currentCard < cards.length - 1) updateCarousel(currentCard + 1);
});

// Initial carousel setup
updateCarousel(0);

// Scroll to specific section
function scrollToSection(index, direction) {
    try {
        index = Math.max(0, Math.min(index, sections.length - 1));
        if (index === currentSection || isScrolling) return;

        isScrolling = true;
        currentSection = index;

        if (scrollTween) scrollTween.kill();

        scrollTween = gsap.to(container, {
            y: -index * window.innerHeight,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                isScrolling = false;
                scrollTween = null;
            }
        });
    } catch (error) {
        console.error('Error in scrollToSection:', error);
        isScrolling = false;
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    if (e.key === 'ArrowDown') {
        scrollToSection(currentSection + 1, 'down');
    } else if (e.key === 'ArrowUp') {
        scrollToSection(currentSection - 1, 'up');
    }
});

// Debounce function to prevent rapid scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle wheel events with debounce
const handleWheel = debounce((e) => {
    if (isScrolling) return;
    const delta = e.deltaY > 0 ? 1 : -1;
    scrollToSection(currentSection + delta, delta > 0 ? 'down' : 'up');
}, 200);

window.addEventListener('wheel', handleWheel, { passive: true });

// Handle touch events for mobile
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', debounce((e) => {
    if (isScrolling) return;
    const touchEndY = e.touches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (Math.abs(delta) > 50) {
        scrollToSection(currentSection + (delta > 0 ? 1 : -1), delta > 0 ? 'down' : 'up');
    }
}, 200), { passive: true });

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const targetIndex = Array.from(sections).findIndex(section => section.id === targetId);
        scrollToSection(targetIndex, targetIndex > currentSection ? 'down' : 'up');
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.textContent = '☰';
    });
});

// Hamburger menu toggle with animation
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
hamburger.addEventListener('click', () => {
    try {
        const isActive = nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.textContent = isActive ? '✕' : '☰';

        const links = document.querySelectorAll('nav a');
        if (isActive) {
            links.forEach(link => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(50px)';
            });
            gsap.fromTo(
                links,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        } else {
            gsap.to(links, {
                opacity: 0,
                x: 50,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    links.forEach(link => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateX(0)';
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error in hamburger toggle:', error);
    }
});
