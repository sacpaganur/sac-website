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
    { href: 'prayers.html', id: 'nav-lnk-prayers', i18n: 'nav.prayers', label: 'செபங்கள்', icon: 'menu_book' },
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
                <span class="logo-icon" id="nav-brand-icon"><img src="images/church_logo.webp" alt="St. Antony's Church" class="dynamic-logo-img" loading="lazy"></span>
                <div class="brand-text">
                    <h1 class="brand-title" id="nav-brand-title">புனித அந்தோணியார் ஆலயம்</h1>
                    <span class="brand-sub" id="nav-brand-sub">வடக்கு பாகனூர்</span>
                </div>
            </a>
            
            <!-- Desktop Navigation Links -->
            <nav class="nav-menu" id="nav-links-menu">
                ${desktopVisibleHTML}${desktopDropdownHTML}
            </nav>

            <!-- Language, Theme, Search, and Mobile Menu Buttons -->
            <div class="navbar-actions" id="nav-actions-container">
                <button class="btn-search material-icons" id="nav-search-trigger" onclick="openGlobalSearch()" style="background:none; border:none; cursor:pointer; color:var(--text-primary); font-size:1.4rem; display:flex; align-items:center; transition: transform 0.3s ease;">search</button>
                <button class="btn-lang" id="lang-toggle">ENG</button>
                <button class="btn-theme theme-toggle-icon material-icons" style="background:none; border:none; cursor:pointer; color:var(--text-primary); font-size:1.3rem; display:flex; align-items:center; transition: transform 0.3s ease;">dark_mode</button>
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
                <div style="display:flex; align-items:center;">
                    <button class="btn-search material-icons" onclick="openGlobalSearch(); document.getElementById('mobile-drawer').classList.remove('active');" style="background:none; border:none; cursor:pointer; color:var(--text-primary); font-size:1.5rem; display:flex; align-items:center; transition: transform 0.3s ease; margin-right:12px;" aria-label="Search">search</button>
                    <button class="btn-lang drawer-lang-toggle">ENG</button>
                    <button class="btn-theme theme-toggle-icon material-icons" style="background:none; border:none; cursor:pointer; color:var(--text-primary); font-size:1.5rem; display:flex; align-items:center; transition: transform 0.3s ease; margin-left:12px;">dark_mode</button>
                </div>
            </div>
            <div class="drawer-links-container">
                ${mobileLinks}
            </div>
        </div>
    </div>

    <!-- Global Search Modal Overlay -->
    <div class="global-search-overlay" id="global-search-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(10px); z-index:999999; justify-content:center; align-items:flex-start; padding-top:10vh;">
        <div class="global-search-modal" style="background:var(--bg-card); width:90%; max-width:600px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column; max-height:80vh; border:1px solid var(--border-glass);">
            <div class="search-header" style="display:flex; align-items:center; padding:15px 20px; border-bottom:1px solid var(--border-glass); background:var(--bg-glass);">
                <span class="material-icons" style="color:var(--primary); font-size:1.5rem; margin-right:12px;">search</span>
                <input type="text" id="global-search-input" placeholder="Search prayers, notices, events..." autocomplete="off" style="flex:1; background:transparent; border:none; outline:none; font-size:1.1rem; color:var(--text-primary); font-family:var(--font-base);">
                <button onclick="closeGlobalSearch()" class="material-icons" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.5rem; margin-left:12px; transition:color 0.2s;">close</button>
            </div>
            <div class="search-results-container" id="global-search-results" style="padding:10px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px;">
                <!-- Results dynamically injected here -->
                <div id="search-placeholder" style="padding:30px; text-align:center; color:var(--text-secondary); font-size:0.95rem;">
                    <span class="material-icons" style="font-size:3rem; opacity:0.2; display:block; margin-bottom:10px;">youtube_searched_for</span>
                    Type to instantly search across the entire website...
                </div>
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

// Global Search Engine Logic
window.openGlobalSearch = function() {
    const overlay = document.getElementById('global-search-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const input = document.getElementById('global-search-input');
            if(input) input.focus();
        }, 100);
    }
};

window.closeGlobalSearch = function() {
    const overlay = document.getElementById('global-search-overlay');
    if(overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset search field and results
        const input = document.getElementById('global-search-input');
        if (input) input.value = '';
        
        const resultsContainer = document.getElementById('global-search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div id="search-placeholder" style="padding:30px; text-align:center; color:var(--text-secondary); font-size:0.95rem;">
                    <span class="material-icons" style="font-size:3rem; opacity:0.2; display:block; margin-bottom:10px;">youtube_searched_for</span>
                    Type to instantly search across the entire website...
                </div>
            `;
        }
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeGlobalSearch();
});

let sacGlobalSearchTimeout;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const input = document.getElementById('global-search-input');
        if(input) {
            input.addEventListener('input', (e) => {
                clearTimeout(sacGlobalSearchTimeout);
                const query = e.target.value.trim().toLowerCase();
                if(query.length < 2) {
                    renderGlobalSearchResults([], query);
                    return;
                }
                sacGlobalSearchTimeout = setTimeout(() => performGlobalSearch(query), 300);
            });
        }
    }, 500);
});

async function performGlobalSearch(query) {
    const resultsContainer = document.getElementById('global-search-results');
    if(!resultsContainer) return;
    
    resultsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:var(--primary);"><span class="material-icons" style="animation:sacSpin 1s infinite linear;">sync</span> Searching...</div>';
    
    let allResults = [];
    
    try {
        if (typeof SAC_DATABASE === 'undefined') throw new Error("Database not initialized");

        let prayers = await SAC_DATABASE.get("catholic_prayers") || [];
        let notices = await SAC_DATABASE.get("announcements") || [];
        
        // Ensure data structures are Arrays (Firebase sometimes returns Objects for missing indices)
        if(!Array.isArray(prayers)) prayers = Object.values(prayers);
        if(!Array.isArray(notices)) notices = Object.values(notices);
        
        prayers.forEach((item, index) => {
            if (!item) return; // Skip deleted items (null in Firebase arrays)
            const titleEn = (item.titleEn || '').toLowerCase();
            const titleTa = (item.titleTa || '').toLowerCase();
            const contentEn = (item.contentEn || '').toLowerCase();
            const contentTa = (item.contentTa || '').toLowerCase();
            
            if(titleEn.includes(query) || titleTa.includes(query) || contentEn.includes(query) || contentTa.includes(query)) {
                allResults.push({
                    type: 'Prayer',
                    icon: 'menu_book',
                    title: (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta') ? (item.titleTa || item.titleEn) : (item.titleEn || item.titleTa),
                    subtitle: 'Spiritual Treasury / செபங்கள்',
                    link: `prayers.html?id=${index}`,
                    score: titleEn.includes(query) || titleTa.includes(query) ? 10 : 5
                });
            }
        });
        
        notices.forEach((item, index) => {
            if (!item) return; // Skip deleted items
            const titleEn = (item.titleEn || '').toLowerCase();
            const titleTa = (item.titleTa || '').toLowerCase();
            const contentEn = (item.contentEn || '').toLowerCase();
            const contentTa = (item.contentTa || '').toLowerCase();
            
            if(titleEn.includes(query) || titleTa.includes(query) || contentEn.includes(query) || contentTa.includes(query)) {
                allResults.push({
                    type: 'Notice',
                    icon: 'campaign',
                    title: (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta') ? (item.titleTa || item.titleEn) : (item.titleEn || item.titleTa),
                    subtitle: 'Announcements / அறிவிப்புகள்',
                    link: `notices.html?id=${item.id || index}`,
                    score: titleEn.includes(query) || titleTa.includes(query) ? 10 : 5
                });
            }
        });
        
        allResults.sort((a, b) => b.score - a.score);
        renderGlobalSearchResults(allResults, query);
    } catch(e) {
        console.error("Search error:", e);
        resultsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#ef4444;">An error occurred while searching.</div>';
    }
}

function renderGlobalSearchResults(results, query) {
    const container = document.getElementById('global-search-results');
    if(!container) return;
    
    if(!query || query.length < 2) {
        container.innerHTML = `
            <div id="search-placeholder" style="padding:30px; text-align:center; color:var(--text-secondary); font-size:0.95rem;">
                <span class="material-icons" style="font-size:3rem; opacity:0.2; display:block; margin-bottom:10px;">youtube_searched_for</span>
                Type to instantly search across the entire website...
            </div>
        `;
        return;
    }
    
    if(results.length === 0) {
        container.innerHTML = `
            <div style="padding:30px; text-align:center; color:var(--text-secondary); font-size:0.95rem;">
                <span class="material-icons" style="font-size:3rem; opacity:0.2; display:block; margin-bottom:10px;">search_off</span>
                No results found for "<b>${query}</b>"
            </div>
        `;
        return;
    }
    
    let html = '';
    results.forEach(res => {
        html += `
            <a href="${res.link}" class="search-result-card" style="display:flex; align-items:center; padding:12px 15px; background:var(--bg-glass); border:1px solid var(--border-glass); border-radius:12px; text-decoration:none; color:inherit; transition:transform 0.2s, background 0.2s;">
                <div style="background:var(--primary); color:#fff; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-right:15px; flex-shrink:0;">
                    <span class="material-icons">${res.icon}</span>
                </div>
                <div style="flex:1; overflow:hidden;">
                    <div style="font-weight:600; font-size:1rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${res.title}</div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">${res.subtitle}</div>
                </div>
                <span class="material-icons" style="color:var(--text-secondary); opacity:0.5;">chevron_right</span>
            </a>
        `;
    });
    
    container.innerHTML = html;
}


