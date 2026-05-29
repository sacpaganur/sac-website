/**
 * Shared site navigation bar and mobile menu — injected once per page
 */
window.SAC_NAVBAR = {
  // Define menu items once here. They will automatically be mirrored to both desktop and mobile views.
  links: [
    { href: 'index.html', id: 'nav-lnk-home', i18n: 'nav.home', label: 'முகப்பு', icon: 'home' },
    { href: 'schedule.html', id: 'nav-lnk-schedule', i18n: 'nav.schedule', label: 'வழிபாடுகள்', icon: 'church' },
    { href: 'legacy.html', id: 'nav-lnk-legacy', i18n: 'nav.legacy', label: 'வரலாறு', icon: 'history_edu' },
    { href: 'notices.html', id: 'nav-lnk-notices', i18n: 'nav.notices', label: 'அறிவிப்புகள்', icon: 'campaign' },
    { href: 'liturgy.html', id: 'nav-lnk-liturgy', i18n: 'nav.liturgy', label: 'இறைவார்த்தை', icon: 'menu_book' },
    { href: 'calendar.html', id: 'nav-lnk-calendar', i18n: 'nav.calendar', label: 'நாட்காட்டி', icon: 'event' },
    { href: 'devotion.html', id: 'nav-lnk-devotion', i18n: 'nav.devotion', label: 'பக்தி', icon: 'volunteer_activism' },
    { href: 'rosary.html', id: 'nav-lnk-rosary', i18n: 'nav.rosary', label: 'செபமாலை', icon: 'all_inclusive' },
    { href: 'bible.html', id: 'nav-lnk-bible', i18n: 'nav.bible', label: 'விவிலியம் AI', icon: 'auto_awesome' },
    { href: 'gallery.html', id: 'nav-lnk-gallery', i18n: 'nav.gallery', label: 'புகைப்படங்கள்', icon: 'photo_library' },
    { href: 'contact.html', id: 'nav-lnk-contact', i18n: 'nav.contact', label: 'தொடர்பு', icon: 'support_agent' }
  ],

  inject() {
    const mount = document.getElementById('global-navbar');
    if (!mount || mount.dataset.sacEnhanced === 'true') return;
    
    // Auto-generate links for both desktop and mobile drawers to ensure they never fall out of sync
    const maxVisibleDesktop = 4; // Number of links before pushing to 'More' dropdown
    const visibleLinks = this.links.slice(0, maxVisibleDesktop);
    const dropdownLinks = this.links.slice(maxVisibleDesktop);

    const desktopVisibleHTML = visibleLinks.map(l => `
        <a href="${l.href}" class="nav-link" id="${l.id}">
            <span class="material-icons nav-icon">${l.icon}</span>
            <span data-i18n="${l.i18n}">${l.label}</span>
        </a>`).join('');
    
    let desktopDropdownHTML = '';
    if (dropdownLinks.length > 0) {
        const dropLinksHTML = dropdownLinks.map(l => `
            <a href="${l.href}" class="nav-link dropdown-link" id="${l.id}-drop">
                <span class="material-icons nav-icon">${l.icon}</span>
                <span data-i18n="${l.i18n}">${l.label}</span>
            </a>`).join('');
        desktopDropdownHTML = `
                <div class="nav-dropdown">
                    <button class="nav-link dropdown-toggle">
                        <span class="material-icons nav-icon">more_horiz</span>
                        <span data-i18n="nav.more">மேலும் ▾</span>
                    </button>
                    <div class="dropdown-menu">
                        ${dropLinksHTML}
                    </div>
                </div>`;
    }

    const mobileLinks = this.links.map(l => `
        <a href="${l.href}" class="drawer-link">
            <span class="drawer-icon-wrap"><span class="material-icons drawer-icon">${l.icon}</span></span>
            <span class="drawer-link-text" data-i18n="${l.i18n}">${l.label}</span>
            <span class="material-icons drawer-chevron">chevron_right</span>
        </a>`).join('');

    mount.outerHTML = `
    <!-- Navigation Header -->
    <header class="navbar" id="main-nav-bar">
        <div class="navbar-container">
            <a href="index.html" class="brand-logo" id="nav-brand-link">
                <span class="logo-icon" id="nav-brand-icon">⛪</span>
                <div class="brand-text">
                    <h1 class="brand-title" id="nav-brand-title">புனித அந்தோணியார் ஆலயம்</h1>
                    <span class="brand-sub" id="nav-brand-sub">வடக்கு பாகனூர்</span>
                </div>
            </a>
            
            <!-- Desktop Navigation Links -->
            <nav class="nav-menu" id="nav-links-menu">
                ${desktopVisibleHTML}${desktopDropdownHTML}
            </nav>

            <!-- Language and Mobile Menu Buttons -->
            <div class="navbar-actions" id="nav-actions-container">
                <button class="btn-lang" id="lang-toggle">ENG</button>
                <button class="btn-mobile-menu" id="mobile-menu-trigger">
                    <span class="material-icons">menu</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Mobile Drawer Overlay Menu -->
    <div class="mobile-drawer" id="mobile-drawer">
        <div class="drawer-content">
            <div class="drawer-header">
                <div class="drawer-header-title">
                    <span class="material-icons" style="color:var(--primary); font-size:1.5rem;">menu_open</span>
                    <span style="font-weight:700; color:var(--text-primary); font-size:1.1rem; letter-spacing:0.5px;">MENU</span>
                </div>
                <button class="btn-lang drawer-lang-toggle">ENG</button>
            </div>
            <div class="drawer-links-container">
                ${mobileLinks}
            </div>
        </div>
    </div>
    `;
  }
};

// Global AI Assets Injector (Loads CSS/JS for the AI Companion on every page)
(function injectAIAssets() {
  if (typeof document === 'undefined') return;
  // Don't inject on admin portal
  if (window.location.pathname.includes('admin-portal')) return;

  const head = document.getElementsByTagName('head')[0];
  
  const aiCSS = document.createElement('link');
  aiCSS.rel = 'stylesheet';
  aiCSS.href = 'css/ai-chat.css';
  head.appendChild(aiCSS);

  const aiService = document.createElement('script');
  aiService.src = 'js/ai-service.js';
  head.appendChild(aiService);

  const aiUI = document.createElement('script');
  aiUI.src = 'js/ai-chat-ui.js';
  head.appendChild(aiUI);
})();
