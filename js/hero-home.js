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
}