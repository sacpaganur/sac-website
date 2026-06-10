/** Prism hero — no JS required; hook reserved for future use */
// (function () {
//   window.SAC_HERO_MOTION = { init() {} };
// })();

// Hero Cinema Initialization with Mouse Parallax
function initHeroCinema() {
    const hero = document.getElementById('hero-banner');
    const portal = document.getElementById('hero-portal');
    if (!hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger entrance animations by adding 'hero-cinema--ready' class
    requestAnimationFrame(() => {
        requestAnimationFrame(() => hero.classList.add('hero-cinema--ready'));
    });

    // Exit if portal doesn't exist or user prefers reduced motion
    if (!portal || reducedMotion) return;

    // Mouse move parallax effect on portal image
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        portal.style.setProperty('--portal-tilt-x', `${y * -10}deg`);
        portal.style.setProperty('--portal-tilt-y', `${x * 10}deg`);
    }, { passive: true });

    // Reset rotation on mouse leave
    hero.addEventListener('mouseleave', () => {
        portal.style.setProperty('--portal-tilt-x', '0deg');
        portal.style.setProperty('--portal-tilt-y', '0deg');
    });

    // --- Phase 2.1 Enhancements ---
    
    // Scroll Parallax for Hero Background
    const parallaxBg = document.getElementById('hero-parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.12)`;
        }, { passive: true });
    }

    // 3D Tilt Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}
