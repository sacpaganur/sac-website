/* St. Antony's Church Public Website Shared Core JavaScript */

const SAC_COMMON = {
  currentLang: 'ta',
  pageName: 'home',

  // Static UI translation dictionaries
  staticTranslations: {
    ta: {
      "nav.home": "முகப்பு",
      "nav.schedule": "வழிபாடுகள்",
      "nav.legacy": "வரலாறு",
      "nav.notices": "அறிவிப்புகள்",
      "nav.contact": "தொடர்பு",
      "nav.portal": "உறுப்பினர் பகுதி",
      "nav.admin": "நிர்வாகி",
      
      "footer.tagline": "அமைதியும் அருள்மரியும் பெருகும் புண்ணியத்தலம்",
      "footer.quickLinks": "விரைவு இணைப்புகள்",
      "footer.resources": "வளங்கள்",
      "footer.copyText": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
    },
    en: {
      "nav.home": "Home",
      "nav.schedule": "Mass Schedules",
      "nav.legacy": "History",
      "nav.notices": "Announcements",
      "nav.contact": "Contact",
      "nav.portal": "Member Portal",
      "nav.admin": "Admin",
      
      "footer.tagline": "A Sanctuary of Peace, Grace, and Divine Blessings",
      "footer.quickLinks": "Quick Links",
      "footer.resources": "Resources",
      "footer.copyText": "All rights reserved."
    }
  },

  // Initialize shared scripts across pages
  async init(pageName) {
    this.pageName = pageName;
    this.currentLang = localStorage.getItem('sac_public_lang') || 'ta';
    document.documentElement.setAttribute('lang', this.currentLang);
    
    // Inject background particles container
    this._injectParticlesContainer();
    this._generateParticles();

    // Attach core event listeners
    this._setupNavbarListeners();

    // Translate page content
    await this.translatePage();
    
    // Set active nav styling
    this._highlightActiveNav();
  },

  _injectParticlesContainer() {
    if (!document.getElementById('particles')) {
      const container = document.createElement('div');
      container.className = 'particle-container';
      container.id = 'particles';
      document.body.insertBefore(container, document.body.firstChild);
    }
  },

  // Premium particle & color background orbs setup
  _generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    
    // Ambient glowing light circles
    const orb1 = document.createElement('div');
    orb1.className = 'glow-orb orb-primary';
    const orb2 = document.createElement('div');
    orb2.className = 'glow-orb orb-accent';
    container.appendChild(orb1);
    container.appendChild(orb2);

    // 15 floating gold particles
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.width = Math.random() * 8 + 4 + 'px';
      p.style.height = p.style.width;
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = Math.random() * 20 + '%';
      p.style.animationDelay = Math.random() * 20 + 's';
      p.style.animationDuration = Math.random() * 15 + 15 + 's';
      container.appendChild(p);
    }
  },

  _setupNavbarListeners() {
    // Add mobile toggle click trigger
    const mobBtn = document.querySelector('.btn-mobile-menu');
    if (mobBtn) {
      mobBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Add language toggle click trigger
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => this.toggleLanguage());
    }
  },

  // Highlights current page on navigation bars
  _highlightActiveNav() {
    const page = this.pageName;
    
    document.querySelectorAll('.nav-link, .drawer-link').forEach(el => {
      let href = el.getAttribute('href');
      if (!href) return;
      
      // Clean up href for comparison
      href = href.replace('.html', '').replace(/^\//, '');
      
      const isHomeMatch = (page === 'home' && (href === '' || href === 'index' || href === './'));
      const isPageMatch = (href === page);
      
      if (isHomeMatch || isPageMatch) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  },

  toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const icon = document.querySelector('.btn-mobile-menu span');
    if (!drawer) return;

    if (drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (icon) icon.innerText = 'menu';
    } else {
      drawer.classList.add('open');
      if (icon) icon.innerText = 'close';
    }
  },

  closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const icon = document.querySelector('.btn-mobile-menu span');
    if (drawer) drawer.classList.remove('open');
    if (icon) icon.innerText = 'menu';
  },

  // Toggle Language between English and Tamil
  async toggleLanguage() {
    this.currentLang = this.currentLang === 'ta' ? 'en' : 'ta';
    localStorage.setItem('sac_public_lang', this.currentLang);
    document.documentElement.setAttribute('lang', this.currentLang);
    
    // Update language toggle button label
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.innerText = this.currentLang === 'ta' ? 'ENG' : 'தமிழ்';
    }

    await this.translatePage();
    
    // Trigger custom translation events on specific pages if they need it (like Home countdown or Admin lists)
    window.dispatchEvent(new CustomEvent('sacLanguageChanged', { detail: { lang: this.currentLang } }));
  },

  // Translate all DOM elements on current page
  async translatePage() {
    const settings = await SAC_DATABASE.get("settings");
    const isTa = this.currentLang === 'ta';

    // 1. Dynamic church settings translation
    const churchName = isTa ? settings.churchNameTa : settings.churchNameEn;
    const location = isTa ? settings.locationTa : settings.locationEn;
    const address = isTa ? settings.addressTa : settings.addressEn;

    document.querySelectorAll('.brand-title, .footer-info h3').forEach(el => el.innerText = churchName);
    document.querySelectorAll('.brand-sub').forEach(el => el.innerText = location);
    document.querySelectorAll('.footer-address-label').forEach(el => el.innerText = address);

    // 2. Static standard translations
    const dict = this.staticTranslations[this.currentLang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      
      // Check local dynamic data settings overrides first
      if (key === 'hero.headline') {
        el.innerText = isTa ? settings.heroHeadlineTa : settings.heroHeadlineEn;
      } else if (key === 'hero.tag') {
        el.innerText = isTa ? settings.heroTagTa : settings.heroTagEn;
      } else if (key === 'hero.lead') {
        el.innerText = isTa ? settings.heroLeadTa : settings.heroLeadEn;
      } else if (key === 'contact.addressVal') {
        el.innerText = address;
      }
      
      // Fallback to static dictionaries
      else if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', dict[key]);
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    // Translate page button text
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.innerText = this.currentLang === 'ta' ? 'ENG' : 'தமிழ்';
    }
  }
};
