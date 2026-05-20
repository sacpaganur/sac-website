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
      "nav.gallery": "புகைப்படங்கள்",
      "nav.portal": "உறுப்பினர் பகுதி",
      "nav.admin": "நிர்வாகி",
      
      "footer.tagline": "அமைதியும் அருள்மரியும் பெருகும் புண்ணியத்தலம்",
      "footer.quickLinks": "விரைவு இணைப்புகள்",
      "footer.resources": "வளங்கள்",
      "footer.copyText": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      
      "home.patronBadge": "நமது பாதுகாவலர் | Our Patron Saint",
      "home.patronTitle": "பதுவை நகர் புனித அந்தோணியார்",
      "home.patronDesc": "நமது ஆலயத்தின் பாதுகாவலரான புனித அந்தோணியார், இறைவனின் பேரன்பையும் வல்லமையையும் மக்கள் மத்தியில் பகிர்ந்து வரும் அற்புதங்கள் நிறைந்த அருளாளர் ஆவார். ஏழைகள் மற்றும் தொலைந்த பொருட்களின் பாதுகாவலரான இவரின் பரிந்துரையால் எண்ணற்ற மக்கள் ஆறுதலும் ஆசீரும் பெற்று வருகிறார்கள்.",
      "home.learnPatronBtn": "ஆலயப் பாரம்பரியம்",

      "home.sacramentsTag": "திருவருட்சாதனங்கள் | Sacraments",
      "home.sacramentsTitle": "ஆலய அருட்பணிகள்",
      "home.sacramentsSub": "பங்கு மக்களின் ஆன்மீக வளர்ச்சிக்காகவும் இறையருளைப் பெற்றுக்கொள்ளவும் வழங்கப்படும் அருட்சாதனங்கள்.",
      "home.sacMassTitle": "திருப்பலி கருத்துக்கள்",
      "home.sacMassDesc": "நமது குடும்பத்தின் நன்றியறிதல், நினைவு நாட்கள் மற்றும் விசேஷத் தேவைகளுக்காக திருப்பலி கருத்துக்களைப் பதிவு செய்திட பங்குத் தந்தையை அணுகவும்.",
      "home.sacConfTitle": "ஒப்புரவு அருட்சாதனம்",
      "home.sacConfDesc": "ஒவ்வொரு சனிக்கிழமை மாலை மற்றும் திருப்பலிக்கு முந்தைய நேரங்களில் ஒப்புரவு அருட்சாதனம் (பாவசங்கீர்த்தனம்) ஆலயத்தில் வழங்கப்படும்.",
      "home.sacPrayTitle": "தனிப்பட்ட செபங்கள்",
      "home.sacPrayDesc": "உங்களது செபத் தேவைகளை இணையதளம் வழியாகவோ அல்லது ஆலயத்தின் செபப் பெட்டியிலோ சமர்ப்பித்து கூட்டுப் பிரார்த்தனைகளில் இணையுங்கள்.",

      "sched.devotionTag": "சிறப்பு வழிபாடுகள் | Special Devotions",
      "sched.devotionTitle": "மாதாந்திர மற்றும் சிறப்பு வழிபாட்டு விவரங்கள்",
      "sched.novenaBadge": "செவ்வாய் நவநாள்",
      "sched.novenaTitle": "புனித அந்தோணியார் நவநாள்",
      "sched.novenaDesc": "ஒவ்வொரு செவ்வாய்க்கிழமையும் காலை 6:00 மணி மற்றும் மாலை 6:00 மணிக்கு புனித அந்தோணியாரின் சிறப்பு நவநாள் திருப்பலியும், எண்ணெய் அபிஷேகமும், தேர்ப்பவனியும் நடைபெறும்.",
      "sched.fridayBadge": "முதல் வெள்ளி",
      "sched.fridayTitle": "இயேசுவின் திருஇருதய வழிபாடு",
      "sched.fridayDesc": "மாதத்தின் முதல் வெள்ளிக்கிழமை மாலை 5:30 மணிக்கு நற்கருணை ஆராதனையும், அதைத் தொடர்ந்து திருஇருதய சிறப்புத் திருப்பலியும், நற்கருணை ஆசீரும் வழங்கப்படும்.",

      "notices.infoTitle": "அறிவிப்பு பலகை விபரம்",
      "notices.infoDesc": "பங்குப் பேரவை மற்றும் ஆன்மீகச் சபைகளின் கூட்ட முடிவுகள், திருப்பலி நேர மாற்றங்கள் மற்றும் திருவிழா விபரங்கள் உடனுக்குடன் இங்கு புதுப்பிக்கப்படும். புதிய அறிவிப்புகள் பெற அவ்வப்போது சரிபார்க்கவும்.",
      
      "hero.scripture": "\"அன்பே உருவான இறைவனிடம் கேளுங்கள், உங்களுக்குத் தரப்படும்; தேடுங்கள், நீங்கள் கண்டடைவீர்கள்.\" - மத்தேயு 7:7",
      "hero.sunMass": "ஞாயிறு திருப்பலி: காலை 8:30 மணி",
      "hero.tueNovena": "செவ்வாய் நவநாள்: மாலை 6:00 மணி",
      "home.ministriesTag": "ஆலய இயக்கங்கள் | Parish Ministries",
      "home.ministriesTitle": "பங்குப் பேரவை மற்றும் இயக்கங்கள்",
      "home.ministriesSub": "ஆலயத்தின் ஆன்மீகப் பணிகள் மற்றும் சமுதாய நற்பணிகளில் செயலாற்றி வரும் முக்கியப் பிரிவுகள்.",
      "home.minCatTitle": "மறைக்கல்வி மன்றம்",
      "home.minCatDesc": "ஒவ்வொரு ஞாயிற்றுக்கிழமையும் திருப்பலிக்கு முன்னதாக பங்கு சிறுவர்களுக்கு விவிலிய போதனைகளும் கிறிஸ்தவ நம்பிக்கைப் பயிற்சிகளும் வழங்கப்படுகிறது.",
      "home.minYouthTitle": "இளைஞர் இயக்கம்",
      "home.minYouthDesc": "பங்கின் ஆற்றல்மிக்க இளைஞர்களை ஒருங்கிணைத்து ஆலயப் பெருவிழாக்கள், இரத்ததான முகாம்கள் மற்றும் சமூக சேவைப்பணிகளில் ஈடுபடுத்துகிறது.",
      "home.minLitTitle": "வழிபாட்டுக் குழு",
      "home.minLitDesc": "வழிபாடுகளில் ஒழுங்கு, வாசகர் பயிற்சி, திருப்பலி பீடப் பணி மற்றும் ஆராதனை செபங்களை தயாரித்து வழிநடத்தும் ஆன்மீகப் பிரிவு.",
      "sched.officeTag": "அலுவலக தகவல்கள் | Parish Administration",
      "sched.officeTitle": "பங்கு அலுவலக வேலை நேரங்கள் & பதிவுகள்",
      "sched.offTimeTitle": "அலுவலக வேலை நேரம்",
      "sched.offTimeDesc": "திங்கள் முதல் சனி வரை: காலை 9:00 - மதியம் 12:30, மாலை 4:00 - 6:30 மணி. (ஞாயிறு விடுமுறை)",
      "sched.baptTitle": "திருமுழுக்கு (Baptism) பதிவுகள்",
      "sched.baptDesc": "மாதத்தின் முதல் மற்றும் மூன்றாம் ஞாயிற்றுக்கிழமைகளில் ஞாயிறு திருப்பலியைத் தொடர்ந்து குழந்தைகளுக்கு திருமுழுக்கு வழங்கப்படும். ஒரு வாரத்திற்கு முன்பே பதிவு செய்யவும்.",
      "legacy.milestoneTag": "வரலாற்று மைல்கற்கள் | Historical Milestones",
      "legacy.milestoneTitle": "ஆலயத்தின் முக்கிய வரலாற்றுத் தருணங்கள்",
      "legacy.ms85Title": "அடித்தளம் & தொடக்கம்",
      "legacy.ms85Desc": "வடக்கு பாகனூரில் புனித அந்தோணியாரின் சிறு ஆலயமாக வழிபாடுகள் ஆரம்பிக்கப்பட்டு பங்குப் பணியாளர் நியமிக்கப்பட்ட ஆண்டாகும்.",
      "legacy.ms10Title": "வெள்ளி விழா கொண்டாட்டம்",
      "legacy.ms10Desc": "பங்கின் வெள்ளி விழா நிறைவை ஒட்டி நற்கருணை ஆராதனைக் கூடம் மற்றும் புனித அந்தோணியார் திருக்குளம் புனரமைக்கப்பட்ட ஆண்டு.",
      "legacy.ms21Title": "புதிய ஆலய அர்ச்சிப்பு விழா",
      "legacy.ms21Desc": "பங்கு மக்களின் கூட்டு முயற்சியால் கட்டப்பட்ட அழகிய புதிய எழில்மிகு பேராலயம் அர்ச்சிக்கப்பட்டு புனித அந்தோணியார் திருத்தலமாக அறிவிக்கப்பட்டது."
    },
    en: {
      "nav.home": "Home",
      "nav.schedule": "Mass Schedules",
      "nav.legacy": "History",
      "nav.notices": "Announcements",
      "nav.contact": "Contact",
      "nav.gallery": "Gallery",
      "nav.portal": "Member Portal",
      "nav.admin": "Admin",
      
      "footer.tagline": "A Sanctuary of Peace, Grace, and Divine Blessings",
      "footer.quickLinks": "Quick Links",
      "footer.resources": "Resources",
      "footer.copyText": "All rights reserved.",
      
      "home.patronBadge": "Our Patron Saint",
      "home.patronTitle": "St. Antony of Padua",
      "home.patronDesc": "Our patron St. Antony of Padua is a miracle worker who manifests God's love and power in our community. As the patron saint of the poor and lost things, his intercession brings comfort, healing, and endless blessings to all.",
      "home.learnPatronBtn": "Parish Heritage",

      "home.sacramentsTag": "Sacraments & Services",
      "home.sacramentsTitle": "Parish Sacraments & Services",
      "home.sacramentsSub": "Divine services and sacraments offered for the spiritual growth and nourishment of our community.",
      "home.sacMassTitle": "Mass Intentions",
      "home.sacMassDesc": "Offer Holy Mass for birthdays, anniversaries, departed loved ones, or special thanksgiving. Kindly contact the Parish Priest.",
      "home.sacConfTitle": "Sacrament of Reconciliation",
      "home.sacConfDesc": "Experience God's healing mercy through Confession, available every Saturday evening and before daily Masses.",
      "home.sacPrayTitle": "Personal Prayer Intentions",
      "home.sacPrayDesc": "Submit your special prayer requests online or place them in the physical prayer box to join in our community prayers.",

      "sched.devotionTag": "Parish Devotions",
      "sched.devotionTitle": "Monthly Devotions & Special Services",
      "sched.novenaBadge": "Tuesday Novena",
      "sched.novenaTitle": "Novena of St. Antony of Padua",
      "sched.novenaDesc": "Every Tuesday, special Novena Mass for St. Antony is held at 6:00 AM and 6:00 PM, followed by oil anointing and a car procession.",
      "sched.fridayBadge": "First Friday",
      "sched.fridayTitle": "Sacred Heart Devotion",
      "sched.fridayDesc": "On the first Friday of each month, Adoration of the Blessed Sacrament starts at 5:30 PM, followed by the Holy Mass and Benediction.",

      "notices.infoTitle": "Parish Notice Board Details",
      "notices.infoDesc": "Parish council decisions, special feast schedules, holy Mass timing changes, and announcements are instantly updated here. Check back regularly.",
      
      "hero.scripture": "\"Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.\" - Matthew 7:7",
      "hero.sunMass": "Sunday Mass: 8:30 AM",
      "hero.tueNovena": "Tuesday Novena: 6:00 PM",
      "home.ministriesTag": "Parish Ministries & Commissions",
      "home.ministriesTitle": "Parish Council & Associations",
      "home.ministriesSub": "Socio-spiritual groups actively contributing to the community welfare and pastoral services.",
      "home.minCatTitle": "Sunday Catechism Association",
      "home.minCatDesc": "Biblical faith formation classes held every Sunday before holy Mass to nurture children in Christian values.",
      "home.minYouthTitle": "St. Antony's Youth Movement",
      "home.minYouthDesc": "Empowering young minds to participate in community development, charity, and liturgical celebrations.",
      "home.minLitTitle": "Liturgical Commission",
      "home.minLitDesc": "Organizing holy services, practicing readers, altar servers, and preparing devotional community prayers.",
      "sched.officeTag": "Parish Administration",
      "sched.officeTitle": "Parish Office Timings & Registrations",
      "sched.offTimeTitle": "Office Working Hours",
      "sched.offTimeDesc": "Monday to Saturday: 9:00 AM - 12:30 PM, 4:00 PM - 6:30 PM. (Closed on Sundays)",
      "sched.baptTitle": "Holy Baptism Registrations",
      "sched.baptDesc": "Baptisms are celebrated on the 1st and 3rd Sundays of the month after Sunday Mass. Register one week prior.",
      "legacy.milestoneTag": "Historical Milestones",
      "legacy.milestoneTitle": "Key Historical Parish Moments",
      "legacy.ms85Title": "Foundation & Birth",
      "legacy.ms85Desc": "Established as a devotional mission chapel and dedicated with a resident priest in Vadakku Paganur in 1985.",
      "legacy.ms10Title": "Silver Jubilee Jubilee Celebrations",
      "legacy.ms10Desc": "Celebrating 25 years of grace with major renovations to the adoration chapel and holy saint ponds in 2010.",
      "legacy.ms21Title": "Grand Sanctuary Consecration",
      "legacy.ms21Desc": "Inauguration and blessing of the newly constructed majestic sanctuary and declared as a pilgrimage shrine."
    }
  },

  // Initialize shared scripts across pages
  async init(pageName) {
    this.pageName = pageName;
    this.currentLang = localStorage.getItem('sac_public_lang') || 'ta';
    document.documentElement.setAttribute('lang', this.currentLang);
    
    // Inject programmatic high-definition SVG favicon
    this._injectFavicon();

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

  _injectFavicon() {
    if (!document.querySelector("link[rel*='icon']")) {
      const link = document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛪</text></svg>';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
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

    // 3. Dynamic bilingual page tab title translation
    const titlePrefixes = {
      ta: {
        home: "முகப்பு",
        schedule: "வழிபாட்டு நேரங்கள்",
        legacy: "ஆலய வரலாறு",
        gallery: "ஆலய புகைப்படங்கள்",
        notices: "அறிவிப்புகள்",
        contact: "தொடர்பு கொள்ள",
        admin: "நிர்வாகி பகுதி"
      },
      en: {
        home: "Home",
        schedule: "Schedules",
        legacy: "Our History",
        gallery: "Photo Gallery",
        notices: "Notice Board",
        contact: "Contact Us",
        admin: "Admin Portal"
      }
    };
    const prefixMap = titlePrefixes[this.currentLang];
    if (prefixMap && prefixMap[this.pageName]) {
      document.title = `${prefixMap[this.pageName]} | ${churchName} – ${location}`;
    }

    // Translate page button text
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.innerText = this.currentLang === 'ta' ? 'ENG' : 'தமிழ்';
    }
  }
};
