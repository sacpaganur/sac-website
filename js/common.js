// --- GLOBAL PAGE LOADER INJECTION ---
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const loaderHTML = `
    <style id="sac-loader-scroll">body { overflow: hidden !important; }</style>\n    <div id="sac-global-loader" style="position:fixed; top:0; left:0; width:100%; height:100%; background:var(--bg-glass, rgba(255,255,255,0.95)); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center; transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;">
      <div style="position:relative; width:70px; height:70px;">
        <div style="position:absolute; width:100%; height:100%; border:3px solid var(--border-glass, #f3f4f6); border-top-color:var(--primary, #8b5cf6); border-radius:50%; animation:sacSpin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:1.6rem; opacity:0.8;">⛪</div>
      </div>
      <div style="margin-top:20px; font-weight:800; color:var(--primary, #8b5cf6); letter-spacing:2px; font-size: 0.9rem; font-family:'Inter', sans-serif; animation:sacPulse 1.5s ease-in-out infinite;">LOADING</div>
      <style>
        @keyframes sacSpin { to { transform: rotate(360deg); } }
        @keyframes sacPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      </style>
    </div>
  `;

  // Inject if body exists, else wait for DOMContentLoaded
  // Expose hideLoader globally so revealPage can call it
  window.hideSACLoader = () => {
    document.body.style.overflow = ''; // Restore scrolling
    const loaders = document.querySelectorAll('#sac-global-loader');
    loaders.forEach(loader => {
      if (loader.style.opacity !== '0') {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => {
          loader.remove();
          const scrollLock = document.getElementById('sac-loader-scroll');
          if (scrollLock) scrollLock.remove();
        }, 800);
      }
    });

    // CRITICAL FIX: Also remove the body opacity=0 style so the page becomes visible!
    // If Firebase hangs, this 1.5s fallback guarantees the UI reveals anyway.
    const futcStyle = document.getElementById('sac-futc-style');
    if (futcStyle) {
      document.body.style.opacity = '1';
      futcStyle.remove();
    }
  };

  // Ultimate fallback: forcefully hide after 1500ms no matter what
  // Keep this short so pages never appear blank for more than 1.5 seconds.
  setTimeout(window.hideSACLoader, 1500);



  // Intercept navigation links to show loader
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Only intercept internal standard links
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && target !== '_blank' && !link.hasAttribute('download')) {
      e.preventDefault();

      let loader = document.getElementById('sac-global-loader');
      if (!loader) {
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        loader = document.getElementById('sac-global-loader');
      }

      // Start hidden to avoid harsh flash
      document.body.style.overflow = 'hidden'; // Disable scrolling
      loader.style.transition = 'none';
      loader.style.opacity = '0';
      loader.style.visibility = 'visible';

      // Force reflow
      void loader.offsetWidth;
      loader.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
      loader.style.opacity = '1';

      window.location.href = href;
    }
  });
})();
// --- END PAGE LOADER ---

// --- A11Y (ACCESSIBILITY) AUTO-INJECTION ---
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Hide the Accessibility Options FAB button ONLY on the home page (index.html or root /)
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html' || path.endsWith('/index.html') || path === '') {
    return;
  }

  // Inject A11y stylesheet
  const a11yCSS = document.createElement('link');
  a11yCSS.rel = 'stylesheet';
  a11yCSS.href = 'css/a11y.css?v=1.1';
  document.head.appendChild(a11yCSS);

  // Inject A11y script (loaded after DOM, so don't use defer — it won't work on dynamic scripts)
  const a11yJS = document.createElement('script');
  a11yJS.src = 'js/a11y.js?v=1.1';
  document.body ? document.body.appendChild(a11yJS) : document.head.appendChild(a11yJS);
})();
// --- END A11Y INJECTION ---

// --- CALENDAR (ADD-TO-CALENDAR) AUTO-INJECTION ---
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Inject Calendar script if not already present
  if (!document.querySelector('script[src*="calendar-links.js"]')) {
    const calJS = document.createElement('script');
    calJS.src = 'js/calendar-links.js?v=1.0';
    document.body ? document.body.appendChild(calJS) : document.head.appendChild(calJS);
  }
})();
// --- END CALENDAR INJECTION ---

/* St. Antony's Church Public Website Shared Core JavaScript */

const SAC_COMMON = {
  currentLang: 'ta',
  pageName: 'home',

  // Static UI translation dictionaries
  staticTranslations: {
    "ta": {
      "nav.home": "முகப்பு",
      "nav.bible": "விவிலியம் AI",
      "nav.schedule": "வழிபாடுகள்",
      "nav.liturgy": "இறைவார்த்தை",
      "nav.calendar": "நாட்காட்டி",
      "nav.legacy": "வரலாறு",
      "nav.devotion": "பக்தி",
      "nav.notices": "அறிவிப்புகள்",
      "nav.contact": "தொடர்பு",
      "nav.gallery": "புகைப்படங்கள்",
      "nav.portal": "உறுப்பினர் பகுதி",
      "nav.admin": "நிர்வாகி",
      "nav.more": "மேலும் ▾",
      "footer.tagline": "அமைதியும் அன்பும் அருளும் பெருகும் புண்ணியத்தலம்",
      "footer.quickLinks": "விரைவு இணைப்புகள்",
      "footer.resources": "வளங்கள்",
      "footer.navigate": "வழிசெலுத்தல்",
      "footer.parish": "பங்கு & வளங்கள்",
      "footer.visit": "ஆலயத்தை வருகை",
      "footer.visitLead": "வழிபாட்டு நேரங்கள், செப விண்ணப்பங்கள் மற்றும் பங்கு சேவைகளுக்கு எங்களைத் தொடர்பு கொள்ளுங்கள்.",
      "footer.contactBtn": "தொடர்பு கொள்ளுங்கள்",
      "footer.scheduleBtn": "அட்டவணை",
      "footer.massTimes": "திருப்பலி நேரங்கள்",
      "footer.backTop": "மேலே",
      "footer.copyText": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      "home.patronBadge": "நமது பாதுகாவலர் | Our Patron Saint",
      "home.patronTitle": "பதுவை நகர் புனித அந்தோணியார்",
      "home.patronDesc": "நமது ஆலயத்தின் பாதுகாவலரான புனித அந்தோணியார், இறைவனின் பேரன்பையும் வல்லமையையும் மக்கள் மத்தியில் பகிர்ந்து வரும் அற்புதங்கள் நிறைந்த அருளாளர் ஆவார். ஏழைகள் மற்றும் தொலைந்த பொருட்களின் பாதுகாவலரான இவரின் பரிந்துரையால் எண்ணற்ற மக்கள் ஆறுதலும் ஆசீரும் பெற்று வருகிறார்கள்.",
      "home.patronMiracles": "எண்ணற்ற அற்புதங்கள்",
      "home.patronCard1Title": "ஏழைகளின் பாதுகாவலர்",
      "home.patronCard1Desc": "எளியவர்கள் மற்றும் தேவையில் இருப்போரின் உற்ற துணையாக விளங்குகிறார்.",
      "home.patronCard2Title": "இழந்தவற்றைக் கண்டடையும் அருளாளர்",
      "home.patronCard2Desc": "நம்பிக்கையோடு செபிக்கும்போது, தொலைந்தவைகளை மீண்டும் பெற உதவுகிறார்.",
      "home.patronCard3Title": "அற்புதங்களின் நாயகன்",
      "home.patronCard3Desc": "தம்மை நாடி வருவோரின் வாழ்வில் இறையருளால் பல அற்புதங்களை நிகழ்த்துகிறார்.",
      "home.learnPatronBtn": "ஆலயப் பாரம்பரியம்",
      "home.countdownKicker": "அடுத்த திருப்பலி",
      "home.weeklyMasses": "வாராந்திர வழிபாடுகள்",
      "home.fullScheduleBtn": "முழு அட்டவணை",
      "home.sacramentsTag": "திருவருட்சாதனங்கள் | Sacraments",
      "home.sacramentsTitle": "ஆலய அருட்பணிகள்",
      "home.sacramentsSub": "பங்கு மக்களின் ஆன்மீக வளர்ச்சிக்காகவும் இறையருளைப் பெற்றுக்கொள்ளவும் வழங்கப்படும் திருவருட்சாதனங்கள்.",
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
      "sched.fridayTitle": "முழு இரவு ஜெபம்",
      "sched.fridayDesc": "அம்சம் பங்கு ஆலயத்தில் ஒவ்வொரு மாதமும் முதல் வெள்ளிக்கிழமை இரவு 10 மணி முதல் அதிகாலை 4 மணி வரை முழு இரவு ஜெபம் நடைபெறுகிறது.",
      "sched.feastBadge": "ஆண்டு திருவிழா",
      "sched.feastTitle": "ஆண்டு திருவிழா",
      "sched.feastDesc": "ஆண்டுதோறும் பாஸ்கா காலத்தின் இரண்டாம் சனிக்கிழமையன்று ஆலயத்தின் ஆண்டு திருவிழாவானது சிறப்புத்  திருப்பலி மற்றும் உயிர்த்தெழுந்த இயேசு கிறிஸ்துவின் திரு உருவம் மற்றும் புனிதரின் திருஉருவம் தாங்கிய தேர்பவனியும் நடைபெறும்.",
      "sched.juneFeastBadge": "ஜூன் 13 திருவிழா",
      "sched.juneFeastTitle": "புனித அந்தோணியார் பெருவிழா",
      "sched.juneFeastDesc": "ஒவ்வொரு ஆண்டும் ஜூன் 13-ஆம் தேதி நமது பாதுகாவலரான புனித அந்தோணியாரின் பெருவிழா மிகவும் சிறப்பான முறையில் கொண்டாடப்படும்.",
      "notices.noNotices": "தற்போது எந்த அறிவிப்புகளும் இல்லை. பின்னர் சரிபார்க்கவும்.",
      "heritage.heroKicker": "நமது பாரம்பரியம் (Our Heritage)",
      "heritage.heroTitle": "ஆலயத்தின் திருவரலாறு",
      "heritage.heroSubtitle": "A Journey Through Time & Faith",
      "heritage.tourTitle": "360° மெய்நிகர் தரிசனம்",
      "heritage.tourDesc": "ஆலயத்தின் உள்ளே ஒரு 360-டிகிரி விர்ச்சுவல் பயணம்.",
      "heritage.tourHint": "Drag to look around. Scroll to zoom. (சுழற்றிப் பார்க்க திரையைத் தொடவும்)",
      "heritage.timelineTitle": "பங்கு வரலாறு",
      "heritage.timelineDesc": "வடக்கு பாகனூர் மண்ணில் உதித்த நம்பிக்கையின் மைல்கற்கள்.",
      "heritage.y1920Title": "நம்பிக்கையின் விதை",
      "heritage.y1920Desc": "வடக்கு பாகனூர் கிராமத்தில் ஒரு சிறிய கூரை கொட்டகையில் புனித அந்தோணியாரின் சுரூபம் வைக்கப்பட்டு முதல் செபக்கூட்டம் ஆரம்பமானது.",
      "heritage.y1955Title": "முதல் செங்கல்",
      "heritage.y1955Desc": "மக்களின் பேராதரவுடன் முதல் முறையாக செங்கல் வைத்து சிறிய ஆலயம் கட்டப்பட்டது. அன்று முதல் வாராந்திர திருப்பலிகள் நடைபெறத் துவங்கின.",
      "heritage.y1982Title": "தனிப் பங்காக உதயம்",
      "heritage.y1982Desc": "புனித அந்தோணியார் ஆலயம் தனிப் பங்காக உயர்த்தப்பட்டு, முதல் பங்குத் தந்தை பொறுப்பேற்றார். இது நமது திருச்சபை வரலாற்றில் ஒரு பொற்காலம்.",
      "heritage.y2010Title": "புதிய ஆலய அற்பணிப்பு",
      "heritage.y2010Desc": "விரிவாக்கப்பட்ட புதிய ஆலயம் கட்டி முடிக்கப்பட்டு, மேதகு ஆயர் அவர்களால் புனிதப்படுத்தப்பட்டது.",
      "heritage.y2026Title": "டிஜிட்டல் சகாப்தம்",
      "heritage.y2026Desc": "உலகெங்கும் உள்ள நமது உறவுகளை இணைக்கும் வகையில், பங்கு இணையதளம் மற்றும் விர்ச்சுவல் டூர் சேவை துவங்கப்பட்டது.",
      "liturgy.heroTitle": "இன்றைய இறைவார்த்தை",
      "liturgy.saintLabel": "இன்றைய புனிதர்",
      "liturgy.loadingMsg": "இறைவார்த்தைகள் ஏற்றப்படுகின்றன...",
      "liturgy.ctaTitle": "திருப்பலியில் பங்கேற்போம்",
      "liturgy.ctaDesc": "இறைவார்த்தையை வாழ்வாக்க வாராந்திர திருப்பலிகளில் பங்கேற்று இறையாசீர் பெறுவோம்.",
      "liturgy.ctaBtn": "திருப்பலி நேரங்கள்",
      "devotion.heroKicker": "நம்பிக்கையின் ஒளி (Light of Faith)",
      "devotion.heroTitle": "மெழுகுவர்த்தி ஏற்றி செபிப்போம்",
      "devotion.quoteText": "\"செபம் இருளுக்கு ஒளியூட்டும் விளக்கு.\"",
      "devotion.quoteAuthor": "- புனித அந்தோணியார்",
      "notices.infoTitle": "அறிவிப்பு பலகை விவரம்",
      "notices.infoDesc": "பங்குப் பேரவை முடிவுகள், சிறப்பு திருவிழா அட்டவணைகள், திருப்பலி நேர மாற்றங்கள் மற்றும் முக்கிய அறிவிப்புகள் உடனுக்குடன் இங்கு புதுப்பிக்கப்படும். விபரங்களை அறிய அவ்வப்போது சரிபார்க்கவும்.",
      "hero.scripture": "\"அன்பே உருவான இறைவனிடம் கேளுங்கள், உங்களுக்குத் தரப்படும்; தேடுங்கள், நீங்கள் கண்டடைவீர்கள்.\"",
      "hero.scriptureRef": "மத்தேயு 7:7",
      "hero.welcomeKicker": "வடக்கு பாகனூர் · பங்கு மக்களின் இறைவிசுவாச வீடு",
      "hero.welcomeTitle": "இறைவனின் அருள் நிறைந்த வாசல்",
      "hero.welcomeTitleLine2": "உங்களுக்குத் திறந்துள்ளது",
      "hero.missionLine": "திருப்பலி, தியானம், பக்தி, தொண்டு — ஒவ்வொரு வாழ்விலும் இறையன்பை வளர்க்கும் நம் பங்கு சமூகத்தில் இணைந்து பிரார்த்திக்க வாருங்கள்.",
      "hero.pillarWorshipTitle": "வழிபாட்டு வாழ்வு",
      "hero.pillarWorshipText": "ஞாயிறு & செவ்வாய் திருப்பலி, புனித அந்தோணியார் நவநாள், நற்கருணை வழிபாடுகள்.",
      "hero.pillarCommunityTitle": "சமூக பந்தம்",
      "hero.pillarCommunityText": "குடும்பங்கள், இளைஞர், மறைக்கல்வி — அனைவரும் வரவேற்கப்படும் பங்கு வீடு.",
      "hero.pillarPrayerTitle": "அமைதியின் தருணம்",
      "hero.pillarPrayerText": "ஒப்புரவு, தனிப்பட்ட செபம், பகிர்ந்த பிரார்த்தனை நியதிகள்.",
      "hero.scriptureLine": "\"என் பெயரினால் இருவர் அல்லது மூன்றர் எங்கே கூடியிருக்கிறார்களோ, அங்கே நான் அவர்களுக்கு நடுவில் இருக்கிறேன்.\"",
      "hero.ctaJoinMass": "திருப்பலியில் இணையுங்கள்",
      "hero.ctaPlanVisit": "வருகை திட்டமிடுங்கள்",
      "hero.ctaOurStory": "நமது பாரம்பரியம்",
      "hero.chipSunday": "ஞாயிறு 8:30",
      "hero.chipTuesday": "செவ்வாய் 6:00",
      "hero.chipPlace": "வடக்கு பாகனூர்",
      "hero.miniTag": "புனித அந்தோணியார் ஆலயம்",
      "hero.miniTitle": "வரவேற்கிறோம்",
      "hero.miniSub": "வடக்கு பாகனூர் · அமைதியும் பக்தியும்",
      "hero.scrollCue": "கீழே செல்லுங்கள்",
      "hero.quoteAntony1": "\"புனித அந்தோணியாரே, எங்களுக்காக மன்றாடும்.\"",
      "hero.quoteAntony2": "\"நம்பிக்கையின் ஒளி, அன்பின் வழி.\"",
      "hero.viewGallery": "புகைப்படங்கள்",
      "hero.captionNew": "புதிய பேராலயம்",
      "hero.captionOld": "பாரம்பரிய ஆலயம்",
      "hero.captionSaint": "பாதுகாவலர்",
      "hero.sunLabel": "ஞாயிறு திருப்பலி",
      "hero.sunTime": "காலை 8:30 மணி",
      "hero.tueLabel": "செவ்வாய் நவநாள்",
      "hero.tueTime": "மாலை 6:00 மணி",
      "hero.placeLabel": "இடம்",
      "hero.placeValue": "வடக்கு பாகனூர், 630312",
      "hero.contactLabel": "தொடர்பு",
      "hero.contactCta": "எங்களை அணுகுங்கள்",
      "home.ministriesTag": "ஆலய இயக்கங்கள் | Parish Ministries",
      "home.ministriesTitle": "பங்குப் பேரவை மற்றும் இயக்கங்கள்",
      "home.ministriesSub": "ஆலயத்தின் ஆன்மீகப் பணிகள் மற்றும் சமுதாய நற்பணிகளில் செயலாற்றி வரும் முக்கியப் பிரிவுகள்.",
      "home.minCatTitle": "மறைக்கல்வி மன்றம்",
      "home.minCatDesc": "ஒவ்வொரு ஞாயிற்றுக்கிழமையும் திருப்பலிக்கு முன்னதாக பங்கு சிறுவர்களுக்கு விவிலிய போதனைகளும் கிறிஸ்தவ நம்பிக்கைப் பயிற்சிகளும் வழங்கப்படுகிறது.",
      "home.minYouthTitle": "இளையோர் இயக்கம்",
      "home.minYouthDesc": "பங்கின் ஆற்றல்மிக்க இளையோரை ஒருங்கிணைத்து ஆலயப் பெருவிழாக்கள், தொண்டுப்பணிகள் மற்றும் வழிபாட்டுப் பணிகளில் ஈடுபடுத்துகிறது.",
      "home.minLitTitle": "வழிபாட்டுக் குழு",
      "home.minLitDesc": "வழிபாடுகளில் ஒழுங்கு, வாசகர் பயிற்சி, திருப்பலி பீடப் பணி மற்றும் ஆராதனை செபங்களை தயாரித்து வழிநடத்தும் ஆன்மீகப் பிரிவு.",
      "home.minAnbiyamTitle": "அன்பியங்கள்",
      "home.minAnbiyamDesc": "நமது பங்குத் தளத்தில் மத்தேயு, மாற்கு, லூக்கா மற்றும் அன்னை தெரசா ஆகிய நான்கு அன்பியங்கள் செயல்பட்டு வருகின்றன. இவை இறைமக்களை ஒருங்கிணைத்து விவிலியப் பகிர்வை வளர்க்கும் அடிப்படை கிறிஸ்தவ சமூகங்களாகும்.",
      "sched.officeTag": "அலுவலக நிர்வாகம்",
      "sched.officeTitle": "அலுவலக வேலை நேரங்கள் & பதிவுகள்",
      "sched.offTimeTitle": "அலுவலக வேலை நேரம்",
      "sched.offTimeDesc": "திங்கள் முதல் சனி வரை: காலை 9:00 - மதியம் 12:30, மாலை 4:00 - 6:30 மணி. (ஞாயிறு விடுமுறை)",
      "sched.baptTitle": "திருமுழுக்கு பதிவுகள்",
      "sched.baptDesc": "மாதத்தின் முதல் மற்றும் மூன்றாம் ஞாயிற்றுக்கிழமைகளில் ஞாயிறு திருப்பலியைத் தொடர்ந்து குழந்தைகளுக்கு திருமுழுக்கு வழங்கப்படும். ஒரு வாரத்திற்கு முன்பே பதிவு செய்யவும்.",
      "legacy.milestoneTag": "வரலாற்று மைல்கற்கள் | Historical Milestones",
      "legacy.milestoneTitle": "ஆலயத்தின் முக்கிய வரலாற்றுத் தருணங்கள்",
      "legacy.ms85Title": "அடித்தளம் & தொடக்கம்",
      "legacy.ms85Desc": "வடக்கு பாகனூரில் புனித அந்தோணியாரின் சிறு ஆலய வழிபாடுகள் ஆரம்பிக்கப்பட்டு, பூசைகள் முதன்முதலாகத் துவங்கப்பட்ட ஆண்டு.",
      "legacy.ms10Title": "வெள்ளி விழா கொண்டாட்டம்",
      "legacy.ms10Desc": "ஆலயத்தின் வெள்ளி விழா நிறைவை ஒட்டி நற்கருணை ஆராதனைக் கூடம் மற்றும் புனித அந்தோணியார் திருக்குளம் புனரமைக்கப்பட்ட ஆண்டு.",
      "legacy.ms21Title": "புதிய ஆலய அர்ச்சிப்பு விழா",
      "legacy.ms21Desc": "பங்கு மக்களின் கூட்டு முயற்சியால் கட்டப்பட்ட அழகிய புதிய எழில்மிகு பேராலயம் அர்ச்சிக்கப்பட்டு புனித அந்தோணியார் திருத்தலமாக அறிவிக்கப்பட்டது.",
      "sched.heroBadge": "வழிபாட்டு நேரங்கள்",
      "sched.titleLabel": "வழிபாட்டு நேரங்கள்",
      "sched.subtitleLabel": "திருப்பலி நேரங்கள் மற்றும் விபரங்கள் பங்கு மக்களின் ஆன்மீக வாழ்விற்காக.",
      "sched.massCountLabel": "திருப்பலி அட்டவணைகள்",
      "sched.chipSun": "ஞாயிறு",
      "sched.chipTue": "செவ்வாய்",
      "sched.chipDaily": "தினசரி",
      "sched.massBadgeLabel": "திருப்பலி அட்டவணை",
      "sched.massTitle": "திருப்பலி நேரங்கள்",
      "sched.massLead": "எங்கள் பங்கு சமூகத்திற்கான வாராந்திர திருப்பலி நேரங்கள்.",
      "sched.devotionBadgeLabel": "சிறப்பு வழிபாடுகள்",
      "sched.devotionLead": "நவநாள், திருவிழா வழிபாடுகள் மற்றும் மாதாந்திர சிறப்பு வழிபாடுகள்.",
      "sched.officeBadgeLabel": "அலுவலக நிர்வாகம்",
      "sched.officeLead": "ஆலய அலுவலக நேரங்கள் மற்றும் திருவருட்சாதன பதிவு விபரங்கள்.",
      "sched.ctaTitle": "திருப்பலி அல்லது பதிவு குறித்த கேள்விகள்?",
      "sched.ctaText": "திருப்பலி கருத்துகள், திருமுழுக்கு பதிவு, சிறப்பு வேண்டுதல்களுக்கு ஆலய அலுவலகத்தை தொடர்பு கொள்ளுங்கள்.",
      "sched.ctaLink": "ஆலயத்தை தொடர்பு கொள்ள",
      "legacy.heroKicker": "நம்பிக்கையின் பயணம்",
      "legacy.heroTitle": "ஆலய வரலாறு & ஆன்மீக பாரம்பரியம்",
      "legacy.heroSubtitle": "விசுவாசத்திலும் அர்ப்பணிப்பிலும் வடக்கு பாகனூர் பங்கு கடந்து வந்த ஆன்மீகப் பாதை.",
      "legacy.heroPrimaryLink": "காலவரிசையைப் பாருங்கள்",
      "legacy.heroSecondaryLink": "வரலாற்றுப் படங்கள்",
      "legacy.statFoundation": "முதல் ஜெபக் கூடம் நினைவு",
      "legacy.statStone": "கல் ஆலயம் எழுந்த ஆண்டு",
      "legacy.statParish": "தனி பங்காக உயர்வு",
      "legacy.statShrine": "ஆலயம் புதுப்பிப்பு",
      "legacy.eventCountLabel": "வரலாற்று மைல்கற்கள்",
      "legacy.overviewKicker": "உயிருடன் வாழும் பாரம்பரியம்",
      "legacy.overviewTitle": "ஜெபம், சேவை, பகிர்ந்த அர்ப்பணிப்பால் கட்டப்பட்டது",
      "legacy.overviewLead": "எளிய கிராம ஜெபக் கூடத்திலிருந்து அன்புடன் போற்றப்படும் திருத்தலமாக வளர்ந்த இந்த வரலாறு, ஒன்றாக ஜெபித்து, ஒன்றாக கட்டி, புனித அந்தோணியார் பக்தியை தலைமுறைகளாக தாங்கி வந்த மக்களின் சாட்சியம்.",
      "legacy.overviewQuoteText": "ஒவ்வொரு கல்லும், ஜெபமும், திருவிழா நாளும் எங்கள் பங்கின் விசுவாசத்தை முன்னோக்கி எடுத்துச் செல்கிறது.",
      "legacy.photoCompareBadge": "அன்றும் இன்றும்",
      "legacy.photoCompareSub": "எங்கள் பங்கு இல்லம் அழகும் அருளும் கொண்டு எவ்வாறு வளர்ந்தது என்பதைக் காணுங்கள்.",
      "legacy.oldEraLabel": "அன்று",
      "legacy.newEraLabel": "இன்று",
      "legacy.photoGalleryLink": "முழு புகைப்படத் தொகுப்பைப் பார்க்க",
      "legacy.valueFaithTitle": "விசுவாசம்",
      "legacy.valueFaithDesc": "தினசரி வழிபாடு, திருவிழா பக்தி, நம்பிக்கையுள்ள ஜெபம் ஆகியவற்றால் உருவான பங்கு.",
      "legacy.valueCommunityTitle": "சமூகம்",
      "legacy.valueCommunityDesc": "குடும்பங்கள், மூப்பர்கள், இளையோர், பங்கு தலைவர்கள் இணைந்து காத்து வரும் ஒரே வரலாறு.",
      "legacy.valueServiceTitle": "சேவை",
      "legacy.valueServiceDesc": "தியாகம், தாராளம், மேய்ப்புப் பராமரிப்பு ஆகியவற்றால் பலமடைந்த பாரம்பரியம்.",
      "legacy.oldPhotoTitle": "பழமையான கல் ஆலயம்",
      "legacy.newPhotoTitle": "புதிய பங்கு திருத்தலம்",
      "legacy.timelineKicker": "வரலாற்றுப் பாதை",
      "legacy.timelineTitle": "அருளும் வளர்ச்சியும் கொண்ட காலவரிசை",
      "legacy.timelineLead": "வழிபாடு, கட்டிடம், கொண்டாட்டங்கள், சமூகச் சாட்சி ஆகியவற்றின் வழியாக உயிருடன் இருக்கும் பங்கின் முக்கிய நினைவுத் தருணங்கள்.",
      "legacy.loadingLabel": "வரலாற்று விபரங்கள் ஏற்றப்படுகின்றன...",
      "legacy.ms24Title": "ஆலய அடித்தளம்",
      "legacy.ms24Desc": "வடக்கு பாகனூரில் எளிய ஓலைக் கூரையின் கீழ் முதல் ஜெபக் கூடம் அமைக்கப்பட்டது.",
      "legacy.ms60Title": "கல் கோவில் எழுப்பப்பட்டது",
      "legacy.ms60Desc": "பங்கு மக்களின் கூட்டு முயற்சியால் அழகிய நிரந்தர கல் ஆலயம் கட்டப்பட்டு அர்ப்பணிக்கப்பட்டது.",
      "legacy.ms95Title": "தனி பங்காக உயர்வு",
      "legacy.ms95Desc": "புனித அந்தோணியார் ஆலயம் தனி பங்காக உயர்த்தப்பட்டு முதல் பங்குத்தந்தை நியமிக்கப்பட்டார்.",
      "legacy.ms20Title": "நவீன திருத்தல புதுப்பிப்பு",
      "legacy.ms20Desc": "ஆலயம் வண்ணக் கண்ணாடி, புதிய பீடங்கள் மற்றும் எழிலார்ந்த உள்ளமைப்புடன் முழுமையாக புதுப்பிக்கப்பட்டது.",
      "legacy.ctaKicker": "பங்கு நினைவுகள்",
      "legacy.ctaTitle": "ஒவ்வொரு புகைப்படமும் ஒரு ஜெபத்தை தாங்குகிறது",
      "legacy.ctaText": "பலிபீடப் படங்கள், திருவிழா கொண்டாட்டங்கள், பாடகர் குழு தருணங்கள், வரலாற்றுப் புகைப்படங்கள் ஆகியவற்றின் வழியாக இந்தப் பயணத்தை தொடருங்கள்.",
      "legacy.ctaLink": "புகைப்படத் தொகுப்பு",
      "saint.heroKicker": "பாதுகாவலர் வரலாறு",
      "saint.heroTitle": "பதுவை நகர் புனித அந்தோணியார்",
      "saint.heroQuote": "வார்த்தைகளை விட செயல்களே அதிகம் பேசும்; உங்கள் வார்த்தைகள் கற்பிக்கட்டும், செயல்கள் பேசட்டும்.",
      "saint.journeyTitle": "அர்ப்பணிப்பின் பயணம்",
      "saint.journeyLead": "லிஸ்பன் நகரில் உயர்குடியில் பிறந்து, உலகெங்கும் போற்றப்படும் பிரான்சிஸ்கன் புனிதராக மாறிய வரலாறு.",
      "saint.life1Title": "லிஸ்பனில் இளமைப் பருவம்",
      "saint.life1Desc": "பெர்னாண்டோ மார்ட்டின்ஸ் என்ற பெயரில் செல்வந்தர் குடும்பத்தில் பிறந்து, ஆன்மீகச் செல்வத்துக்காக உலகச் செல்வங்களைத் துறந்தார்.",
      "saint.life2Title": "பிரான்சிஸ்கன் சபையில் இணைதல்",
      "saint.life2Desc": "பிரான்சிஸ்கன் தியாகிகளால் ஈர்க்கப்பட்டு, அச்சபையில் இணைந்து அந்தோணியார் என்ற பெயரோடு தாழ்மையை நாடினார்.",
      "saint.life3Title": "புனிதர் பட்டமும் பாரம்பரியமும்",
      "saint.life3Desc": "தனது 36-வது வயதில் இறைவனடி சேர்ந்த இவர், நிகழ்த்திய எண்ணற்ற அற்புதங்களால் ஓராண்டுக்குள்ளாகவே திருத்தந்தை 9-ம் கிரிகோரியால் புனிதராக அறிவிக்கப்பட்டார்.",
      "saint.miraclesTitle": "அற்புதங்களும் பாதுகாவலும்",
      "saint.miraclesLead": "இழந்தப் பொருட்கள், ஏழைகள் மற்றும் பயணிகளின் பாதுகாவலராக உலகெங்கும் அறியப்படுகிறார்.",
      "saint.miracle1Title": "தொலைந்த சங்கீத புத்தகம்",
      "saint.miracle1Desc": "அவருடைய அரிய புத்தகம் திருடப்பட்டபோது, அவர் செபித்தார். திருடன் மனம் திருந்தி அதை திருப்பிக் கொடுத்தான். இதனால் அவர் தொலைந்த பொருட்களின் பாதுகாவலர் ஆனார்.",
      "saint.miracle2Title": "அந்தோணியார் அப்பம்",
      "saint.miracle2Desc": "இறந்த தன் குழந்தை உயிர் பெற்றால், குழந்தையின் எடைக்கு சமமான அப்பத்தை ஏழைகளுக்கு வழங்குவதாக ஒரு தாய் நேர்ந்துகொண்டார். இவ்வாறு ஏழைகளுக்கு உணவளிக்கும் வழக்கம் உருவானது.",
      "saint.miracle3Title": "மீன்களுக்கு மறையுரை",
      "saint.miracle3Desc": "மக்கள் அவரது போதனையைக் கேட்க மறுத்தபோது, அவர் ஆற்றங்கரையில் மீன்களுக்கு மறையுரை ஆற்றினார். மீன்கள் அனைத்தும் திரண்டு வந்து பக்தியுடன் செவிமடுத்தன.",
      "wall.title": "செப விண்ணப்பங்கள்",
      "wall.subtitle": "உங்களது செப தேவைகளை சமர்ப்பிக்கவும் மற்றும் பிறருக்காக இணைந்து செபிக்கவும்.",
      "wall.submitBtn": "செப தேவையை சமர்ப்பிக்க",
      "wall.modalTitle": "செப விண்ணப்பம் சமர்ப்பித்தல்",
      "wall.formName": "பெயர் (விரும்பினால்)",
      "wall.formEmail": "மின்னஞ்சல் (விரும்பினால் - வெளியில் தெரியாது)",
      "wall.formAnon": "பெயர் குறிப்பிடாமல் அநாமதேயமாக சமர்ப்பிக்கவும்",
      "wall.formCategory": "விண்ணப்ப வகை",
      "wall.formMessage": "செப விண்ணப்ப விபரம் (அதிகபட்சம் 300 எழுத்துக்கள்)",
      "wall.formMessagePlholder": "உங்களது செபத் தேவையை விளக்கி எழுதவும்...",
      "wall.btnSubmit": "சமர்ப்பிக்கவும்",
      "wall.btnCancel": "ரத்து",
      "wall.cat.health": "❤️ உடல்நலம்",
      "wall.cat.family": "🏠 குடும்பம்",
      "wall.cat.thanks": "🙏 நன்றியறிதல்",
      "wall.cat.rest": "👼 ஆன்ம இளைப்பாற்றி",
      "wall.cat.special": "🕯️ சிறப்புத் தேவை",
      "wall.successTitle": "சமர்ப்பிக்கப்பட்டது!",
      "wall.successMsg": "உங்களது செப விண்ணப்பம் செபச் சுவரில் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. புனித அந்தோணியார் உங்களுக்காக பரிந்து பேசுவார்!",
      "wall.successScripture": "\"கேளுங்கள், உங்களுக்குத் தரப்படும்; தேடுங்கள், நீங்கள் கண்டடைவீர்கள்.\" - மத்தேயு 7:7",
      "wall.successClose": "சரி",
      "wall.prayBtn": "செபிக்கவும்",
      "wall.prayedCount": "{count} பேர் செபித்தனர்",
      "wall.prayedCountSingle": "1 நபர் செபித்தார்",
      "wall.prayedCountNone": "துணை நிற்கிறோம்",
      "wall.btnAiFill": "🎤 AI உதவியாளர் மூலம் நிரப்பவும்",
      "wall.anonymous": "அநாமதேயர்",
      "wall.timeAgo": "மணிநேரத்திற்கு முன்"
    },
    "en": {
      "nav.home": "Home",
      "nav.bible": "Bible AI",
      "nav.schedule": "Mass Schedules",
      "nav.liturgy": "Liturgy",
      "nav.calendar": "Calendar",
      "nav.legacy": "Legacy",
      "nav.devotion": "Devotion",
      "nav.notices": "Notices",
      "nav.contact": "Contact",
      "nav.gallery": "Gallery",
      "nav.portal": "Member Portal",
      "nav.admin": "Admin",
      "nav.more": "More ▾",
      "footer.tagline": "A Sanctuary of Peace, Grace, and Divine Blessings",
      "footer.quickLinks": "Quick Links",
      "footer.resources": "Resources",
      "footer.navigate": "Navigate",
      "footer.parish": "Parish & Resources",
      "footer.visit": "Plan Your Visit",
      "footer.visitLead": "Mass times, prayer requests, and parish services — we welcome you.",
      "footer.contactBtn": "Contact Us",
      "footer.scheduleBtn": "Schedule",
      "footer.massTimes": "Mass Times",
      "footer.backTop": "Top",
      "footer.copyText": "All rights reserved.",
      "home.patronBadge": "Our Patron Saint",
      "home.patronTitle": "Saint Antony of Padua",
      "home.patronDesc": "Saint Antony of Padua, our sanctuary patron, is a miraculous saint who is a patron of the poor and helper in finding lost things. Countless people receive comfort, hope, and graces through his powerful intercession.",
      "home.patronMiracles": "Countless Miracles",
      "home.patronCard1Title": "Patron of the Poor",
      "home.patronCard1Desc": "A steadfast companion and helper to the simple and those in need.",
      "home.patronCard2Title": "Finder of Lost Things",
      "home.patronCard2Desc": "Helps recover what is lost when we pray with unwavering faith.",
      "home.patronCard3Title": "Worker of Miracles",
      "home.patronCard3Desc": "Performs profound miracles through God's grace for those who seek him.",
      "home.learnPatronBtn": "Parish Heritage",
      "home.countdownKicker": "Next Mass",
      "home.weeklyMasses": "Weekly Masses",
      "home.fullScheduleBtn": "Full schedule",
      "home.sacramentsTag": "Sacraments & Services",
      "home.sacramentsTitle": "Parish Sacraments & Services",
      "home.sacramentsSub": "Divine services and sacraments offered for the spiritual growth and nourishment of our parish community.",
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
      "sched.fridayTitle": "All-Night Vigil",
      "sched.fridayDesc": "The All-Night Vigil is held on every first Friday of the month at Amsam Parish Church from 10:00 PM to 4:00 AM.",
      "sched.feastBadge": "Annual Feast",
      "sched.feastTitle": "Annual Feast",
      "sched.feastDesc": "Every year, on the second Saturday of the Easter season, the Annual Feast of the church is celebrated with a special Holy Mass, followed by a grand chariot procession carrying the statues of the Risen Jesus Christ and the Patron Saint",
      "sched.juneFeastBadge": "June 13 Feast",
      "sched.juneFeastTitle": "St. Antony's Feast Day",
      "sched.juneFeastDesc": "Every year on June 13th, the grand feast of our patron St. Antony is celebrated in a very special way.",
      "notices.infoTitle": "Parish Notice Board Details",
      "notices.infoDesc": "Parish council decisions, special feast schedules, holy Mass timing changes, and announcements are instantly updated here. Check back regularly.",
      "notices.noNotices": "There are currently no active notices. Check back later.",
      "heritage.heroKicker": "Our Heritage",
      "heritage.heroTitle": "History of the Church",
      "heritage.heroSubtitle": "A Journey Through Time & Faith",
      "heritage.tourTitle": "360° Virtual Tour",
      "heritage.tourDesc": "Experience the beauty of our church interior through an interactive 360-degree panorama.",
      "heritage.tourHint": "Drag to look around. Scroll to zoom.",
      "heritage.timelineTitle": "Parish History",
      "heritage.timelineDesc": "Milestones of faith born in the soil of Vadakku Paganur.",
      "heritage.y1920Title": "The Seed of Faith",
      "heritage.y1920Desc": "A small prayer gathering started with a statue of St. Antony placed in a thatched hut in Vadakku Paganur village.",
      "heritage.y1955Title": "The First Brick",
      "heritage.y1955Desc": "With immense support from the people, a small church was built with bricks. Weekly masses began to be held regularly.",
      "heritage.y1982Title": "Elevated as an Independent Parish",
      "heritage.y1982Desc": "St. Antony's Church was elevated to an independent parish, and the first parish priest took charge. A golden era in our church history.",
      "heritage.y2010Title": "Dedication of the New Church",
      "heritage.y2010Desc": "The newly expanded church was completed and consecrated by His Excellency the Bishop.",
      "heritage.y2026Title": "The Digital Era",
      "heritage.y2026Desc": "To connect our community worldwide, the official parish website and virtual tour service were launched.",
      "liturgy.heroTitle": "Daily Liturgy",
      "liturgy.saintLabel": "Saint of the Day",
      "liturgy.loadingMsg": "Loading today's liturgy...",
      "liturgy.ctaTitle": "Join the Holy Mass",
      "liturgy.ctaDesc": "Let the Word of God transform your life. Join us for our weekly Eucharistic celebrations.",
      "liturgy.ctaBtn": "Mass Schedule",
      "devotion.heroKicker": "Light of Faith",
      "devotion.heroTitle": "Light a Candle & Pray",
      "devotion.quoteText": "\"Prayer is the lamp that illuminates the darkness.\"",
      "devotion.quoteAuthor": "- St. Antony",
      "hero.scripture": "\"Ask, and it will be given to you; seek, and you will find.\"",
      "hero.scriptureRef": "Matthew 7:7",
      "hero.welcomeKicker": "Vadakku Paganur · A Parish Family of Faith",
      "hero.welcomeTitle": "The Doors of Grace",
      "hero.welcomeTitleLine2": "Are Open to You",
      "hero.missionLine": "Through Mass, prayer, devotion, and service — join our parish family as we grow together in faith, hope, and love.",
      "hero.pillarWorshipTitle": "Rhythm of Worship",
      "hero.pillarWorshipText": "Sunday & Tuesday liturgies, St. Antony novena, and Eucharistic devotion.",
      "hero.pillarCommunityTitle": "Parish Family",
      "hero.pillarCommunityText": "Families, youth, and catechism — everyone has a place here.",
      "hero.pillarPrayerTitle": "Moments of Peace",
      "hero.pillarPrayerText": "Reconciliation, personal prayer, and shared intention boxes.",
      "hero.scriptureLine": "\"For where two or three gather in my name, there am I with them.\"",
      "hero.ctaJoinMass": "Join Holy Mass",
      "hero.ctaPlanVisit": "Plan Your Visit",
      "hero.ctaOurStory": "Our Parish Story",
      "hero.chipSunday": "Sun 8:30 AM",
      "hero.chipTuesday": "Tue 6:00 PM",
      "hero.chipPlace": "Vadakku Paganur",
      "hero.miniTag": "St. Antony's Church",
      "hero.miniTitle": "Welcome",
      "hero.miniSub": "Vadakku Paganur · Peace & Prayer",
      "hero.scrollCue": "Scroll down",
      "hero.quoteAntony1": "\"St. Antony of Padua, pray for us.\"",
      "hero.quoteAntony2": "\"The light of faith, the path of love.\"",
      "hero.scrollCue": "Scroll down",
      "hero.viewGallery": "Photo Gallery",
      "hero.captionNew": "New Sanctuary",
      "hero.captionOld": "Heritage Church",
      "hero.captionSaint": "Patron Saint",
      "hero.sunLabel": "Sunday Mass",
      "hero.sunTime": "8:30 AM",
      "hero.tueLabel": "Tuesday Novena",
      "hero.tueTime": "6:00 PM",
      "hero.placeLabel": "Location",
      "hero.placeValue": "Vadakku Paganur, 630312",
      "hero.contactLabel": "Contact",
      "hero.contactCta": "Reach our parish office",
      "home.ministriesTag": "Parish Ministries & Commissions",
      "home.ministriesTitle": "Parish Council & Associations",
      "home.ministriesSub": "Socio-spiritual groups actively contributing to the parish welfare and pastoral services.",
      "home.minCatTitle": "Sunday Catechism Association",
      "home.minCatDesc": "Biblical faith formation classes held every Sunday before holy Mass to nurture parish children in Christian values.",
      "home.minYouthTitle": "St. Antony's Youth Movement",
      "home.minYouthDesc": "Empowering young minds to participate in parish development, charity, and liturgical celebrations.",
      "home.minLitTitle": "Liturgical Commission",
      "home.minLitDesc": "Organizing holy services, practicing readers, altar servers, and preparing devotional community prayers.",
      "home.minAnbiyamTitle": "Basic Christian Communities (Anbiyam)",
      "home.minAnbiyamDesc": "Our parish consists of four Anbiyams: Mathew, Mark, Luke, and Annai Theresa, connecting parishioners to share the Word of God and foster mutual support.",
      "sched.officeTag": "Parish Administration",
      "sched.officeTitle": "Parish Office Timings & Registrations",
      "sched.offTimeTitle": "Office Working Hours",
      "sched.offTimeDesc": "Monday to Saturday: 9:00 AM - 12:30 PM, 4:00 PM - 6:30 PM. (Closed on Sundays)",
      "sched.baptTitle": "Holy Baptism Registrations",
      "sched.baptDesc": "Baptisms are celebrated on the 1st and 3rd Sundays of the month after Sunday Mass. Register one week prior.",
      "legacy.milestoneTag": "Historical Milestones",
      "legacy.milestoneTitle": "Key Historical Parish Moments",
      "legacy.ms85Title": "The Humble Foundation",
      "legacy.ms85Desc": "Established as a devotional mission chapel in Vadakku Paganur in 1985.",
      "legacy.ms10Title": "Silver Jubilee Celebrations",
      "legacy.ms10Desc": "Celebrating 25 years of grace with major renovations to the adoration chapel and holy saint ponds in 2010.",
      "legacy.ms21Title": "Grand Sanctuary Consecration",
      "legacy.ms21Desc": "Inauguration and blessing of the newly constructed majestic sanctuary by parish members and declared as a pilgrimage shrine.",
      "sched.heroBadge": "Liturgical Schedule",
      "sched.titleLabel": "Mass Schedules & Timings",
      "sched.subtitleLabel": "Holy Mass schedules, novena timings, and devotional services for our parish community.",
      "sched.massCountLabel": "Mass schedules listed",
      "sched.chipSun": "Sunday",
      "sched.chipTue": "Tuesday",
      "sched.chipDaily": "Weekday",
      "sched.massBadgeLabel": "Holy Mass Schedule",
      "sched.massTitle": "Mass Timings",
      "sched.massLead": "Weekly Holy Mass times for our parish community.",
      "sched.devotionBadgeLabel": "Special Devotions",
      "sched.devotionLead": "Novena, feast devotions, and monthly parish liturgies.",
      "sched.officeBadgeLabel": "Parish Administration",
      "sched.officeLead": "Parish office hours and sacrament registration information.",
      "sched.ctaTitle": "Questions about Mass or registrations?",
      "sched.ctaText": "Contact the parish office for bookings, baptisms, and special intentions.",
      "sched.ctaLink": "Contact Parish",
      "legacy.heroKicker": "Journey of Faith",
      "legacy.heroTitle": "Parish Legacy & History",
      "legacy.heroSubtitle": "The journey of St. Antony's Parish in Vadakku Paganur through faith, devotion, and community.",
      "legacy.heroPrimaryLink": "Explore Timeline",
      "legacy.heroSecondaryLink": "View Historic Photos",
      "legacy.statFoundation": "first chapel remembered",
      "legacy.statStone": "stone sanctuary built",
      "legacy.statParish": "raised as a parish",
      "legacy.statShrine": "sanctuary renewed",
      "legacy.eventCountLabel": "historic milestones",
      "legacy.overviewKicker": "Living Heritage",
      "legacy.overviewTitle": "Built by prayer, service, and shared sacrifice",
      "legacy.overviewLead": "From a humble village chapel to a beloved parish shrine, this history is carried by generations who prayed together, built together, and kept devotion to St. Antony alive through every season.",
      "legacy.overviewQuoteText": "Every stone, prayer, and feast day carries the faith of our parish forward.",
      "legacy.photoCompareBadge": "Then & Now",
      "legacy.photoCompareSub": "Witness how our parish home has grown in beauty and grace.",
      "legacy.oldEraLabel": "Then",
      "legacy.newEraLabel": "Now",
      "legacy.photoGalleryLink": "Browse full photo gallery",
      "legacy.valueFaithTitle": "Faith",
      "legacy.valueFaithDesc": "A parish shaped by daily worship, feast-day devotion, and hope-filled prayer.",
      "legacy.valueCommunityTitle": "Community",
      "legacy.valueCommunityDesc": "Families, elders, youth, and parish leaders preserving one shared story.",
      "legacy.valueServiceTitle": "Service",
      "legacy.valueServiceDesc": "A legacy strengthened by sacrifice, generosity, and pastoral care.",
      "legacy.oldPhotoTitle": "The historical stone sanctuary",
      "legacy.newPhotoTitle": "The renewed parish shrine",
      "legacy.timelineKicker": "Chronicle",
      "legacy.timelineTitle": "A timeline of grace and growth",
      "legacy.timelineLead": "Key moments from the parish memory, kept alive through worship, architecture, celebrations, and community witness.",
      "legacy.loadingLabel": "Loading parish history...",
      "legacy.ms24Title": "The Humble Foundation",
      "legacy.ms24Desc": "The first simple thatched chapel was built in Vadakku Paganur as a place of communal prayer.",
      "legacy.ms60Title": "The Stone Sanctuary",
      "legacy.ms60Desc": "With united parish labor, a permanent stone sanctuary was built and consecrated for worship.",
      "legacy.ms95Title": "Independent Parish Status",
      "legacy.ms95Desc": "St. Antony's Church was raised to an independent parish with its first resident parish priest.",
      "legacy.ms20Title": "Modern Shrine Renovation",
      "legacy.ms20Desc": "The church was beautifully renovated with stained glass, renewed shrines, and a dignified sanctuary.",
      "legacy.ctaKicker": "Parish Memory",
      "legacy.ctaTitle": "Every photograph carries a prayer",
      "legacy.ctaText": "Continue the story through altar images, feast celebrations, choir moments, and historic parish photographs preserved in the gallery.",
      "legacy.ctaLink": "Open Gallery",
      "saint.heroKicker": "Patron Saint History",
      "saint.heroTitle": "St. Antony of Padua",
      "saint.heroQuote": "Actions speak louder than words; let your words teach and your actions speak.",
      "saint.journeyTitle": "A Journey of Devotion",
      "saint.journeyLead": "From a noble birth in Lisbon to becoming the most beloved Franciscan saint.",
      "saint.life1Title": "Early Life in Lisbon",
      "saint.life1Desc": "Born Fernando Martins de Bulhões to a wealthy family, he surrendered his riches for spiritual wealth.",
      "saint.life2Title": "Joining the Franciscans",
      "saint.life2Desc": "Inspired by Franciscan martyrs, he joined the order and took the name Antony, seeking profound humility.",
      "saint.life3Title": "Legacy & Canonization",
      "saint.life3Desc": "He passed away at age 36 and was canonized within a year by Pope Gregory IX due to his immense miracles.",
      "saint.miraclesTitle": "Miracles & Patronage",
      "saint.miraclesLead": "Known worldwide as the patron saint of lost things, the poor, and travelers.",
      "saint.miracle1Title": "The Lost Psalter",
      "saint.miracle1Desc": "A novice stole his valuable book. Antony prayed, the thief repented and returned it, making him the patron of lost items.",
      "saint.miracle2Title": "St. Antony's Bread",
      "saint.miracle2Desc": "A mother promised to give bread to the poor equal to her child's weight if revived. Thus began the tradition of giving alms.",
      "saint.miracle3Title": "Preaching to Fishes",
      "saint.miracle3Desc": "When heretics refused to listen, he preached to the fish by the river, who gathered to listen in reverence.",
      "wall.title": "Interactive Prayer Wall",
      "wall.subtitle": "Share your prayer intentions and join in prayer with our community.",
      "wall.submitBtn": "Share a Prayer Intention",
      "wall.modalTitle": "Submit a Prayer Intention",
      "wall.formName": "Your Name (Optional)",
      "wall.formEmail": "Email Address (Optional - never shown publicly)",
      "wall.formAnon": "Submit anonymously without your name",
      "wall.formCategory": "Intention Category",
      "wall.formMessage": "Prayer Request Details (Max 300 characters)",
      "wall.formMessagePlholder": "Describe your prayer request here...",
      "wall.btnSubmit": "Submit Request",
      "wall.btnCancel": "Cancel",
      "wall.cat.health": "❤️ Health & Recovery",
      "wall.cat.family": "🏠 Family & Home",
      "wall.cat.thanks": "🙏 Thanksgiving",
      "wall.cat.rest": "👼 Eternal Rest",
      "wall.cat.special": "🕯️ Special Intention",
      "wall.successTitle": "Submitted Successfully!",
      "wall.successMsg": "Your prayer request has been placed on the wall. Our community will join you in prayer. May St. Antony intercede for you!",
      "wall.successScripture": "\"Ask, and it will be given to you; seek, and you will find.\" - Matthew 7:7",
      "wall.successClose": "Close",
      "wall.prayBtn": "Pray for this",
      "wall.prayedCount": "{count} people prayed",
      "wall.prayedCountSingle": "1 person prayed",
      "wall.prayedCountNone": "Standing in prayer",
      "wall.btnAiFill": "🎤 Ask AI to Fill Form",
      "wall.anonymous": "Anonymous",
      "wall.timeAgo": "ago"
    },
  },

  // Initialize shared scripts across pages
  async init(pageName) {
    this.pageName = pageName;

    // Normalize language value strictly to 'ta' or 'en'
    let lang = 'ta';
    try {
      lang = localStorage.getItem('sac_public_lang');
    } catch (e) {
      console.warn("localStorage read blocked:", e);
    }
    if (lang !== 'ta' && lang !== 'en') {
      lang = 'ta';
      try {
        localStorage.setItem('sac_public_lang', lang);
      } catch (e) {
        console.warn("localStorage write blocked:", e);
      }
    }
    this.currentLang = lang;
    document.documentElement.setAttribute('lang', this.currentLang);

    // Make sure futc style is present if not already added by inline head script
    let futcStyle = document.getElementById('sac-futc-style');
    if (!futcStyle) {
      futcStyle = document.createElement('style');
      futcStyle.id = 'sac-futc-style';
      futcStyle.innerHTML = 'body { opacity: 0 !important; }';
      document.head.appendChild(futcStyle);
    }

    try {
      // Pre-cache settings to make all dynamic translations synchronous and instant
      try {
        this.settings = await SAC_DATABASE.get("settings");
      } catch (e) {
        console.warn("Failed to load settings in init, using defaults:", e);
        this.settings = SAC_DATABASE.defaultData.settings;
      }

      try {
        const liveContent = await SAC_DATABASE.get("global_content");
        if (liveContent && Object.keys(liveContent).length > 0) {
          this.translations.ta = { ...this.translations.ta, ...(liveContent.ta || {}) };
          this.translations.en = { ...this.translations.en, ...(liveContent.en || {}) };
        }
      } catch (e) {
        console.warn("Failed to load global content CMS:", e);
      }

      // Inject programmatic high-definition SVG favicon
      this._injectFavicon();

      // Inject background particles container
      this._injectParticlesContainer();
      this._generateParticles();

      // Inject unified navbar
      if (window.SAC_NAVBAR) {
        SAC_NAVBAR.inject();
      }

      // Attach core event listeners
      this._setupNavbarListeners();

      // Enhanced shared footer
      if (window.SAC_FOOTER) {
        SAC_FOOTER.inject();
        SAC_FOOTER.bindBackToTop();
      }
      if (!document.getElementById('page-top')) {
        const pageTop = document.createElement('div');
        pageTop.id = 'page-top';
        pageTop.setAttribute('aria-hidden', 'true');
        document.body.prepend(pageTop);
      }

      // Translate page content
      await this.translatePage();

      // Set active nav styling
      this._highlightActiveNav();

      // Listen for background settings refresh to update header/footer live
      window.addEventListener('sacDataRefreshed', async (e) => {
        if (e.detail && e.detail.collection === 'settings') {
          try {
            this.settings = await SAC_DATABASE.get("settings");
            await this.translatePage();
          } catch (err) {
            console.warn("Background settings sync re-translate failed:", err);
          }
        }
      });

      // Set up automatic failsafe to reveal the page after 2000ms in case the page script has an error

      // Instant reveal for performance
      if (this.pageName === 'home') {
        this.revealPage();
      } else {
        // Allow other pages to reveal themselves immediately or use a very short 500ms fallback
        this._failsafeTimer = setTimeout(() => {
          this.revealPage();
        }, 500);
      }


    } catch (err) {
      console.error("Error initializing SAC_COMMON:", err);
      this.revealPage();
    }

    // Inject Web App Manifest dynamically for PWA
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = 'manifest.json';
      document.head.appendChild(manifestLink);
    }
    
    // Inject Theme Color meta tag dynamically for PWA
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      themeMeta.content = '#8b5cf6';
      document.head.appendChild(themeMeta);
    }

    // Register PWA Service Worker with auto-refresh update handler
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
          .then((registration) => {
            // Check for service worker updates immediately on page load
            registration.update();
            
            // Listen for new service worker installation
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('[PWA] New update installed. Auto-activating...');
                      // The new service worker will activate and trigger 'controllerchange'
                    }
                  }
                };
              }
            };
          })
          .catch(err => {
            console.warn('Service Worker registration failed:', err);
          });
      });

      // NOTE: We intentionally do NOT auto-reload on 'controllerchange'.
      // Auto-reloading caused a blank-screen loop: new SW activates → reload →
      // SW fires controllerchange again → reload again, especially on mobile.
      // Pages will naturally use the new SW on their next user-initiated navigation.
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New service worker is now in control. Fresh assets will be used on next navigation.');
      });
    }

    // Automatically ensure Firebase App and Firestore compat libraries are loaded
    const ensureFirebaseLoaded = (callback) => {
      if (window.firebase) {
        callback();
        return;
      }

      // Load firebase-app-compat.js first
      const appScript = document.createElement('script');
      appScript.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js';
      appScript.onload = () => {
        // Load firebase-firestore-compat.js next
        const firestoreScript = document.createElement('script');
        firestoreScript.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore-compat.js';
        firestoreScript.onload = () => {
          // Re-trigger DB connection check since firebase is now loaded
          if (window.SAC_DATABASE) {
            window.SAC_DATABASE.setupFirebaseConnection();
          } else if (typeof SAC_DATABASE !== 'undefined') {
            SAC_DATABASE.setupFirebaseConnection();
          }
          callback();
        };
        document.body.appendChild(firestoreScript);
      };
      document.body.appendChild(appScript);
    };

    // Load Firebase Messaging if not already present
    if (this.pageName !== 'admin') {
      ensureFirebaseLoaded(() => {
        const fcmScript = document.createElement('script');
        fcmScript.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js';
        fcmScript.onload = () => {
          const customMessagingScript = document.createElement('script');
          customMessagingScript.src = 'js/messaging.js';
          document.body.appendChild(customMessagingScript);
        };
        document.body.appendChild(fcmScript);
      });
    } else {
      // In Admin, just load messaging script as FCM compat is already in head or body
      const customMessagingScript = document.createElement('script');
      customMessagingScript.src = 'js/messaging.js';
      document.body.appendChild(customMessagingScript);
    }
  },

  // Smoothly reveals the page by fading in the body, removing the flicker-free style,
  // AND hiding the global loader overlay — both visibility systems in one call.
  revealPage() {
    if (this._failsafeTimer) {
      clearTimeout(this._failsafeTimer);
      this._failsafeTimer = null;
    }

    // Always dismiss the global loader overlay first
    if (typeof window.hideSACLoader === 'function') {
      window.hideSACLoader();
    }

    const futcStyle = document.getElementById('sac-futc-style');
    if (futcStyle) {
      try {
        document.body.style.transition = 'opacity 0.25s ease-in-out';
        document.body.offsetHeight; // force repaint
        document.body.style.opacity = '1';
        setTimeout(() => {
          if (futcStyle && futcStyle.parentNode) {
            futcStyle.remove();
          }
          document.body.style.transition = '';
        }, 250);
      } catch (e) {
        document.body.style.opacity = '1';
        if (futcStyle && futcStyle.parentNode) {
          futcStyle.remove();
        }
      }
    } else {
      document.body.style.opacity = '1';
    }
  },

  _injectFavicon() {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    const siteLogoUrl = this.settings && this.settings.siteLogo ? this.settings.siteLogo : null;
    if (siteLogoUrl) {
      link.removeAttribute('type');
      link.href = siteLogoUrl;
    } else {
      link.type = 'image/svg+xml';
      link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛪</text></svg>';
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
    document.querySelectorAll('.btn-lang, #lang-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggleLanguage());
    });
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
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      if (icon) icon.innerText = 'close';
      document.body.style.overflow = 'hidden';
    }
  },

  closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const icon = document.querySelector('.btn-mobile-menu span');
    if (drawer) drawer.classList.remove('open');
    if (icon) icon.innerText = 'menu';
    document.body.style.overflow = '';
  },

  // Toggle Language between English and Tamil instantly without flickering or refresh feel
  async toggleLanguage() {
    // Premium glassmorphic continuity: dim opacity slightly before translating
    document.body.style.transition = 'opacity 0.2s ease-in-out';
    document.body.style.opacity = '0.3';

    // Allow the browser to paint the dim effect
    await new Promise(r => setTimeout(r, 100));

    this.currentLang = this.currentLang === 'ta' ? 'en' : 'ta';
    try {
      localStorage.setItem('sac_public_lang', this.currentLang);
    } catch (e) {
      console.warn("Failed to save language setting:", e);
    }
    document.documentElement.setAttribute('lang', this.currentLang);

    // Update language toggle button labels
    document.querySelectorAll('.btn-lang, #lang-toggle').forEach(btn => {
      btn.innerText = this.currentLang === 'ta' ? 'ENG' : 'தமிழ்';
    });

    await this.translatePage();

    // Trigger custom translation events on specific pages if they need it (like Home countdown or Admin lists)
    window.dispatchEvent(new CustomEvent('sacLanguageChanged', { detail: { lang: this.currentLang } }));

    // Fade back to full opacity instantly
    setTimeout(() => {
      document.body.style.opacity = '1';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 250);
    }, 50);
  },

  // Translate all DOM elements on current page
  async translatePage() {
    // If not cached, dynamically load settings
    if (!this.settings) {
      try {
        this.settings = await SAC_DATABASE.get("settings");
      } catch (e) {
        console.warn("Failed to dynamically load settings in translatePage:", e);
        this.settings = SAC_DATABASE.defaultData.settings;
      }
    }
    const settings = this.settings;
    const isTa = this.currentLang === 'ta';

    // 1. Dynamic church settings translation
    const churchName = isTa ? settings.churchNameTa : settings.churchNameEn;
    const location = isTa ? settings.locationTa : settings.locationEn;
    const address = isTa ? settings.addressTa : settings.addressEn;

    document.querySelectorAll('.brand-title, .footer-brand-titles h3, .footer-info h3').forEach(el => el.innerText = churchName);
    document.querySelectorAll('.brand-sub, .footer-location').forEach(el => el.innerText = location);
    document.querySelectorAll('.footer-address-label').forEach(el => el.innerText = address);

    const siteLogoUrl = settings.logoUrl || settings.siteLogo || '';
    document.querySelectorAll('.logo-icon, .footer-church-logo').forEach(el => {
      if (siteLogoUrl) {
        el.innerHTML = `<img src="${siteLogoUrl}" alt="Church Logo" class="dynamic-logo-img">`;
      } else {
        el.innerHTML = '⛪';
      }
    });
    this._injectFavicon();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    document.querySelectorAll('#footer-church-name-copyright').forEach(el => {
      el.innerText = `${churchName}, ${location}`;
    });

    const phoneText = document.getElementById('footer-phone-text');
    const phoneLink = document.getElementById('footer-phone-link');
    if (phoneText && settings.phone) {
      phoneText.textContent = settings.phone;
      if (phoneLink) phoneLink.href = 'tel:' + settings.phone.replace(/[^\d+]/g, '');
    }

    const emailText = document.getElementById('footer-email-text');
    const emailLink = document.getElementById('footer-email-link');
    if (emailText && settings.email) {
      emailText.textContent = settings.email;
      if (emailLink) emailLink.href = 'mailto:' + settings.email;
    }

    // 2. Static standard translations with highly defensive dictionary lookup
    const dict = this.staticTranslations[this.currentLang] || this.staticTranslations['ta'] || {};

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
      else if (dict && dict[key]) {
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
        bible: "டிஜிட்டல் விவிலியம்",
        schedule: "வழிபாட்டு நேரங்கள்",
        legacy: "ஆலய வரலாறு",
        gallery: "ஆலய புகைப்படங்கள்",
        notices: "அறிவிப்புகள்",
        contact: "தொடர்பு கொள்ள",
        admin: "நிர்வாகி பகுதி"
      },
      en: {
        home: "Home",
        bible: "Digital Bible Hub",
        schedule: "Schedules",
        legacy: "Our History",
        gallery: "Photo Gallery",
        notices: "Notice Board",
        contact: "Contact Us",
        admin: "Admin Portal"
      }
    };
    const prefixMap = titlePrefixes[this.currentLang] || titlePrefixes['ta'];
    if (prefixMap && prefixMap[this.pageName]) {
      document.title = `${prefixMap[this.pageName]} | ${churchName} – ${location}`;
    }

    // Translate all language toggle buttons
    document.querySelectorAll('.btn-lang, #lang-toggle').forEach(btn => {
      btn.innerText = this.currentLang === 'ta' ? 'ENG' : 'தமிழ்';
    });
  }
};
