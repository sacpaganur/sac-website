/* St. Antony's Church - AI Bible Companion Service */

window.SAC_AI = {
  apiKey: null,
  isInitialized: false,
  chatHistory: [],
  speechRecognition: null,
  synthesis: window.speechSynthesis,
  isListening: false,
  isSpeaking: false,
  availableModels: [],
  currentModelIndex: 0,
  modelName: 'gemini-3.6-flash', // Modern stable default, will be auto-detected
  
  // Custom Events
  onStartListening: null,
  onStopListening: null,
  onSpeechResult: null,
  onAIResponse: null,
  onError: null,

  async init() {
    if (this.isInitialized) return true;
    
    // Fetch API Key from Settings (may return stale localStorage cache)
    const settings = await SAC_DATABASE.get("settings");
    
    // Build a prioritized list of API keys to try (code default first to override stale localStorage)
    const codeKey = SAC_DATABASE?.defaultData?.settings?.aiApiKey;
    const keyCandidates = [
      codeKey,
      settings?.aiApiKey,
      SAC_DATABASE?.defaultData?.firebase_config?.apiKey
    ].filter(k => k && k.trim() !== "");
    
    // Remove duplicates while preserving order
    const uniqueKeys = [...new Set(keyCandidates)];
    
    if (uniqueKeys.length === 0) {
      console.warn("SAC_AI: Gemini API Key not found. Please set it in the Admin Portal.");
      return false;
    }

    // Try each key until one works (handles stale cached keys)
    let keyWorked = false;
    for (const candidateKey of uniqueKeys) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${candidateKey}`);
        if (response.ok) {
          // Probe generateContent to verify project isn't blocked by Google anti-abuse / 403 denied access
          let isBlocked = false;
          try {
            const probe = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${candidateKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: '1' }] }] })
            });
            if (probe.status === 403) {
              const probeErr = await probe.json().catch(() => ({}));
              const msg = (probeErr.error?.message || "").toLowerCase();
              if (msg.includes("denied access") || probeErr.error?.status === "PERMISSION_DENIED") {
                console.warn(`SAC_AI: Candidate key rejected (403 PERMISSION_DENIED: project denied access). Trying next candidate...`);
                isBlocked = true;
              }
            }
          } catch (pe) { }

          if (isBlocked) {
            continue; // Try next candidate key
          }

          const data = await response.json();
          this.apiKey = candidateKey;
          keyWorked = true;
          
          if (data.models) {
            const validModels = data.models.filter(m => {
              const name = m.name.toLowerCase();
              return name.includes("gemini") && 
                m.supportedGenerationMethods && 
                m.supportedGenerationMethods.includes("generateContent") &&
                !name.includes("-lite") &&
                !name.includes("-image") &&
                !name.includes("-tts") &&
                !name.includes("-transcribe") &&
                !name.includes("robotics") &&
                !name.includes("computer-use") &&
                !name.includes("banana") &&
                !name.includes("embedding") &&
                !name.includes("preview") &&
                !name.includes("exp");
            });
            
            this.availableModels = validModels.sort((a, b) => {
                const aName = a.name.replace("models/", "");
                const bName = b.name.replace("models/", "");
                if (aName === "gemini-3.6-flash") return -1;
                if (bName === "gemini-3.6-flash") return 1;
                if (aName === "gemini-flash-latest") return -1;
                if (bName === "gemini-flash-latest") return 1;
                if (aName === "gemini-2.0-flash") return -1;
                if (bName === "gemini-2.0-flash") return 1;
                if (aName === "gemini-2.5-flash") return -1;
                if (bName === "gemini-2.5-flash") return 1;
                return aName.localeCompare(bName);
            });

            this.currentModelIndex = 0;
            this.modelName = this.availableModels[0] ? this.availableModels[0].name.replace("models/", "") : "gemini-3.6-flash";
            console.log("SAC_AI: Auto-detected supported models ->", this.availableModels.map(m => m.name));
          }
          
          // If this working key is different from the cached one, update localStorage
          if (candidateKey !== settings?.aiApiKey) {
            console.warn(`SAC_AI: Cached API key was stale/blocked. Switched to working key.`);
            try {
              const localSettings = JSON.parse(localStorage.getItem("sac_settings") || "{}");
              localSettings.aiApiKey = candidateKey;
              localStorage.setItem("sac_settings", JSON.stringify(localSettings));
            } catch(e) { }
          }
          
          break; // Found a working key
        } else if (response.status === 403) {
          console.warn(`SAC_AI: API key rejected (403 PERMISSION_DENIED). Trying next key...`);
          continue; // Try the next key
        } else {
          console.warn(`SAC_AI: API key test returned ${response.status}. Trying next key...`);
          continue;
        }
      } catch(e) {
        console.warn("SAC_AI: Could not validate API key, trying next...", e);
        continue;
      }
    }
    
    if (!keyWorked) {
      // Last resort: try to fetch fresh key directly from Firestore
      try {
        if (SAC_DATABASE.isFirebaseActive && SAC_DATABASE.db) {
          const snap = await SAC_DATABASE.db.collection("settings").doc("general").get();
          if (snap.exists && snap.data().aiApiKey) {
            const freshKey = snap.data().aiApiKey;
            const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${freshKey}`);
            if (testRes.ok) {
              this.apiKey = freshKey;
              keyWorked = true;
              console.log("SAC_AI: Fresh key from Firestore works!");
            }
          }
        }
      } catch(e) {
        console.warn("SAC_AI: Firestore fresh key fetch failed", e);
      }
    }
    
    if (!keyWorked) {
      console.error("SAC_AI: All API keys failed validation. AI features will be unavailable.");
      return false;
    }

    // Initialize System Prompt based on current language
    await this._resetHistory();
    this._setupSpeechRecognition();
    
    this.isInitialized = true;
    return true;
  },

  async _getSystemInstruction(lang = null) {
    const isTa = lang ? (lang === 'TA') : (typeof window !== 'undefined' && window.SAC_COMMON && window.SAC_COMMON.currentLang === 'ta');
    const langInstruction = isTa ? "Respond primarily in Tamil." : "Respond primarily in English.";
    
    // RAG Implementation: Fetch live database context
    let liveContext = "";
    try {
        if (typeof SAC_DATABASE !== 'undefined') {
            const settings = await SAC_DATABASE.get("settings") || {};
            liveContext += `--- SAC SETTINGS & OFFICIALS ---\n`;
            liveContext += `Church Name: ${settings.churchNameEn || "St. Antony's Church"} / ${settings.churchNameTa || "புனித அந்தோணியார் ஆலயம்"}\n`;
            liveContext += `Location: ${settings.locationEn || "Vadakku Paganur"} / ${settings.locationTa || "வடக்கு பாகனூர்"}\n`;
            liveContext += `Parish Priest: Rev. Fr. John Kennedy (+91 89403 71033)\n`;
            liveContext += `Treasurer / Maniyakkarar: Mr. A. Arokkiyasamy (+91 98650 43169)\n`;
            liveContext += `Patron / Founder: Mr. P. Antonysamy Family (1924 Founder)\n`;
            liveContext += `Parish Contact: ${settings.phone || "+91 98650 43169"} | ${settings.email || "sacpaganur@gmail.com"}\n`;
            liveContext += `Address: St. Antony's Church, Vadakku Paganur - 620009, Tiruchirappalli, Tamil Nadu, India.\n`;
            
            let massSchedules = await SAC_DATABASE.get("mass_schedules") || [];
            if (!Array.isArray(massSchedules)) massSchedules = Object.values(massSchedules);
            const activeSchedules = massSchedules.filter(s => s && s.isActive !== false);
            if (activeSchedules.length > 0) {
                liveContext += `\n--- MASS TIMINGS ---\n`;
                activeSchedules.forEach(s => {
                    liveContext += `${s.dayEn || ''} / ${s.dayTa || ''}: ${s.time || ''} - ${s.typeEn || ''} / ${s.typeTa || ''}\n`;
                });
            } else {
                liveContext += `\n--- MASS TIMINGS ---\nSunday: 06:00 AM (Holy Mass)\nTuesday: 06:00 AM & 06:00 PM (Novena Mass)\nMonday to Saturday: 06:00 AM (Daily Mass)\n`;
            }
            
            let notices = await SAC_DATABASE.get("announcements") || [];
            if (!Array.isArray(notices)) notices = Object.values(notices);
            const today = new Date().toISOString().split('T')[0];
            const activeNotices = notices.filter(n => n && (!n.expiryDate || n.expiryDate >= today) && n.isActive !== false);
            
            if (activeNotices.length > 0) {
                liveContext += `\n--- ACTIVE ANNOUNCEMENTS & FEAST ---\n`;
                activeNotices.forEach(n => {
                    liveContext += `Title: ${n.titleEn || ''} / ${n.titleTa || ''}\n`;
                    liveContext += `Content: ${n.contentEn || ''} / ${n.contentTa || ''}\n`;
                    if (n.date) liveContext += `Date: ${n.date}\n`;
                    liveContext += `-\n`;
                });
            }
        }
    } catch(e) {
        console.warn("RAG Context fetch failed:", e);
    }

    return `You are the official comprehensive AI digital assistant and Catholic parish guide for St. Antony's Church, Vadakku Paganur (புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர், திருச்சி).

YOUR MISSION & ROLE:
1. You assist the public and devotees with ANY and EVERY question about the entire church and website from Home to Contact:
   - 🏠 Home (index.html): Parish welcome, today's liturgical readings, Mass timings, highlights.
   - ⛪ Liturgy (liturgy.html): Sunday & weekday Mass times, 7 Sacraments guidelines (Baptism, Communion, Confirmation, Marriage, Confession, Anointing).
   - 📜 History & Heritage (legacy.html): 1924 founding by Mr. P. Antonysamy, Italian miraculous statue, 1960 stone church, 1995 parish status, 2020 modern shrine, miracles of St. Antony.
   - 📅 Notices & Feast (notices.html): Annual Feast (June 13), 9 days novena, flag hoisting, car procession, community feast (annadhanam).
   - 🕊️ Devotions (devotion.html): 13 Tuesdays Novena, Eucharistic Adoration, Way of the Cross during Lent.
   - 🙏 Prayers (prayers.html): Catholic prayers, St. Antony intercessory prayers, novena text.
   - 📿 Holy Rosary (rosary.html): Joyful, Sorrowful, Glorious, Luminous mysteries with digital prayer counter.
   - 📖 Holy Bible (bible.html): Catholic Old & New Testaments, search by verses and books, audio narration.
   - 🖼️ Gallery (gallery.html): Altar, feast illumination, miraculous statue, historic shrine, car procession photos.
   - ✍️ Prayer Requests (contact.html): How devotees can submit prayer intentions with the AI Voice Assistant button or form.
   - 📞 Contacts (contact.html): Parish Priest Rev. Fr. John Kennedy (+91 89403 71033), Treasurer Mr. A. Arokkiyasamy (+91 98650 43169), Patron Mr. P. Antonysamy family, directions, Google Map.
   - ⚙️ Website Features: Smart Tamil typing (TA/EN), Dark/Light mode toggle, language switch (ENG/தமிழ்).
2. Understand questions asked in ANY language: formal Tamil, colloquial Tamil, Tanglish (Tamil written in English letters, e.g. "priest yaaru", "mass timing enna", "prayer epdi podurathu"), and English.
3. Provide warm, pastoral, polite, and encouraging responses. Use clean markdown formatting with bullet points and bold headers.
4. ${langInstruction} If the user speaks Tamil or Tanglish, reply in natural Tamil. If English, reply in English.

LIVE KNOWLEDGE BASE:
${liveContext}`;
  },

  async _resetHistory(overrideLang = null) {
    const systemInstruction = await this._getSystemInstruction(overrideLang);

    this.chatHistory = [
      {
        role: "user",
        parts: [{ text: systemInstruction }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to serve as the Catholic Bible Companion." }]
      }
    ];
  },

  _setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SAC_AI: Speech Recognition API is not supported in this browser.");
      return;
    }

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = false;
    
    this.speechRecognition.onstart = () => {
      this.isListening = true;
      if (this.onStartListening) this.onStartListening();
    };

    this.speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onSpeechResult) this.onSpeechResult(transcript);
    };

    this.speechRecognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      this.isListening = false;
      if (this.onError) this.onError("Voice recognition failed: " + event.error);
      if (this.onStopListening) this.onStopListening();
    };

    this.speechRecognition.onend = () => {
      this.isListening = false;
      if (this.onStopListening) this.onStopListening();
    };
  },

  startListening(lang = null) {
    if (!this.speechRecognition) {
      if (this.onError) this.onError("Voice recognition is not supported in this browser.");
      return;
    }
    
    // Set language dynamically
    const isTa = lang ? (lang === 'TA') : (window.SAC_COMMON?.currentLang === 'ta');
    this.speechRecognition.lang = isTa ? 'ta-IN' : 'en-IN';
    
    try {
      this.speechRecognition.start();
    } catch(e) {
      console.error(e);
      this.speechRecognition.stop();
      setTimeout(() => this.speechRecognition.start(), 100);
    }
  },

  stopListening() {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  },

  // Comprehensive Local Parish & Website Knowledge Engine (Zero quota, instantaneous, bilingual & Tanglish support)
  _getLocalParishResponse(text, isTa) {
    if (!text) return null;
    const rawQ = text.trim();
    const q = rawQ.toLowerCase();

    // Normalize colloquial Tamil & Tanglish phrases with word boundaries and compound priority
    const norm = q
      .replace(/\b(jebamaalai|sebamaalai|rosary)\b/g, 'ஜெபமாலை')
      .replace(/\b(prayer request|prayer requests|venduthal|prayer form|voice prayer)\b/g, 'வேண்டுதல்')
      .replace(/\b(thirupali|thiruppali|thiruppalli|mass|poosai|poojai|puja)\b/g, 'திருப்பலி')
      .replace(/\b(neram|nerangal|timing|timings|time|schedule|schedules)\b/g, 'நேரம்')
      .replace(/\b(kovil|kovilukku|aalayam|alayam|church)\b/g, 'ஆலயம்')
      .replace(/\b(varalaru|history|origin|heritage)\b/g, 'வரலாறு')
      .replace(/\b(thiruvizha|thiruvila|festival|feast|peruvizha)\b/g, 'திருவிழா')
      .replace(/\b(sebam|sebham|jebam|prayer|prayers|praying|prayed)\b/g, 'செபம்')
      .replace(/\b(vedhagamam|viviliam|bible|scripture)\b/g, 'விவிலியம்')
      .replace(/\b(therbavani|ther|procession|car procession)\b/g, 'தேர்ப்பவனி')
      .replace(/\b(arivippugal|notices|announcements|notice|circular)\b/g, 'அறிவிப்பு')
      .replace(/\b(father|priest|pangu thandhai|panguthandhai)\b/g, 'பங்குத்தந்தை')
      .replace(/\b(maniyakkarar|maniyakarar|treasurer|porulalar)\b/g, 'மணியக்காரர்')
      .replace(/\b(patron|pattaiyadharar|founder)\b/g, 'பட்டையதாரார்')
      .replace(/\b(pugaippadam|photo|photos|gallery|video|videos|picture|pictures)\b/g, 'புகைப்படம்')
      .replace(/\b(arutsadhanam|sacraments|sacrament|arulsadhanam)\b/g, 'அருட்சாதனம்')
      .replace(/\b(gnanasnanam|baptism)\b/g, 'திருமுழுக்கு')
      .replace(/\b(kalyanam|thirumanam|marriage|matrimony)\b/g, 'திருமணம்')
      .replace(/\b(pudhunamai|communion|holy communion)\b/g, 'புதுநன்மை')
      .replace(/\b(uruthiboosuthal|confirmation)\b/g, 'உறுதிபூசுதல்')
      .replace(/\b(paavasangeerthanam|confession|reconciliation)\b/g, 'பாவசங்கீர்த்தனம்')
      .replace(/\b(website|inaiyathalam|valaiyathalam|sitemap|pages|page)\b/g, 'இணையதளம்')
      .replace(/\b(enga|engu|where|location|route|eppadi poradhu|epdi poradhu|address|mugavari)\b/g, 'எங்கே')
      .replace(/\b(phone|email|contact|thodarbu|call)\b/g, 'தொடர்பு')
      .replace(/\b(typing|transliteration|translit|smart tamil)\b/g, 'தட்டச்சு')
      .replace(/\b(calendar|natkatti|readings|liturgical calendar)\b/g, 'நாட்காட்டி')
      .replace(/\b(admin|portal|login|nirvagam)\b/g, 'நிர்வாகம்');

    // 1. Greetings & Complete Website Assistant Overview
    const greetings = ['hi', 'hello', 'வணக்கம்', 'காலை வணக்கம்', 'மாலை வணக்கம்', 'ஹாய்', 'hey', 'good morning', 'good evening', 'good afternoon', 'praise the lord', 'இறைவனுக்கு புகழ்', 'ஆமென்', 'amen', 'start', 'vanakkam', 'vanakam'];
    if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!') || q.startsWith(g + '.'))) {
      if (isTa) {
        return "வணக்கம்! புனித அந்தோணியார் ஆலயத்தின் மெய்நிகர் AI வழிகாட்டிக்கு (SAC AI) உங்களை அன்போடு வரவேற்கிறோம். 🙏✨\n\nநமது இணையதளத்தின் முகப்பு முதல் தொடர்பு பக்கம் வரை உள்ள அனைத்து விவரங்களுக்கும் நான் உதவ தயாராக உள்ளேன்:\n\n• 🏠 **முகப்பு & திருப்பலி நேரங்கள்** (Home & Mass Timings)\n• 📜 **ஆலய வரலாறு & 1924 அற்புதங்கள்** (History & Miracles)\n• 📅 **ஆண்டுப் பெருவிழா (ஜூன் 13) & அறிவிப்புகள்** (Feast & Notices)\n• ⛪ **7 அருட்சாதனங்கள் வழிகாட்டி** (Baptism, Communion, Marriage)\n• 🕊️ **கத்தோலிக்க செபங்கள் & 13 செவ்வாய் நவநாள்** (Prayers & Novena)\n• 📿 **தூய ஜெபமாலை மறைபொருள்கள்** (Holy Rosary)\n• 📖 **திருவிவிலியம் வாசிப்பு & தேடுதல்** (Holy Bible & Audio)\n• 🖼️ **புகைப்படங்கள் & தேர்ப்பவனி காணொளிகள்** (Photo Gallery)\n• ✍️ **செப வேண்டுதல் பதிவு செய்வது எப்படி?** (Prayer Request Form)\n• 📞 **பங்குத்தந்தை & ஆலயப் பொறுப்பாளர்கள் தொடர்பு** (Priest & Contacts)\n• 🗓️ **வழிபாட்டு நாட்காட்டி & தினசரி வாசகங்கள்** (Calendar & Readings)\n• ⚙️ **தமிழ் தட்டச்சு (TA) & இரவு பயன்முறை (Dark Mode)**\n\nநீங்கள் எந்த கேள்வியையும் தமிழ், ஆங்கிலம் அல்லது Tanglish-ல் தாராளமாகக் கேட்கலாம்!";
      } else {
        return "Peace and blessings! Welcome to St. Antony's Church AI Digital Assistant (SAC AI). 🙏✨\n\nI am here to assist you with all parish and website information from Home to Contact:\n\n• 🏠 **Home & Holy Mass Schedules** (Sunday & Daily Mass)\n• 📜 **Parish History & Italian Statue Heritage** (1924 to Present)\n• 📅 **Annual Feast (June 13) & Announcements** (Car Procession)\n• ⛪ **Catholic Sacraments Guide** (Baptism, Communion, Marriage)\n• 🕊️ **Catholic Prayers & 13 Tuesdays Novena**\n• 📿 **Holy Rosary 4 Mysteries & Recitation Guide**\n• 📖 **Holy Bible Search & Audio Scripture**\n• 🖼️ **Photo & Video Gallery** (Sanctuary & Celebrations)\n• ✍️ **Submitting Online Prayer Requests** (Voice & Form)\n• 📞 **Parish Priest & Officials Contacts**\n• 🗓️ **Liturgical Calendar & Daily Mass Readings**\n• ⚙️ **Smart Tamil Typing (TA/EN) & Dark Mode**\n\nFeel free to ask any question in English, Tamil, or Tanglish!";
      }
    }

    // 2. Complete Website Sitemap & Overview of Pages
    if (norm.includes('இணையதளம்') || q.includes('sitemap') || q.includes('pages') || q.includes('பக்கங்கள்') || q.includes('என்னென்ன') || q.includes('features') || q.includes('overview') || q.includes('help') || q.includes('home to contact') || q.includes('all details')) {
      if (isTa) {
        return "🌐 **புனித அந்தோணியார் ஆலய இணையதள வழிகாட்டி (Website Sitemap):**\n\nநமது இணையதளத்தில் கீழ்க்கண்ட முக்கிய பக்கங்கள் உள்ளன:\n\n1. 🏠 **முகப்பு (Home - `index.html`)**: ஆலய அறிமுகம், இன்றைய வாசகங்கள், திருப்பலி நேரங்கள், சிறப்பு அறிவிப்புகள்.\n2. ⛪ **வழிபாடுகள் (Liturgy - `liturgy.html`)**: ஞாயிறு மற்றும் தினசரி திருப்பலி நேரங்கள், 7 அருட்சாதனங்களின் விவரங்கள் மற்றும் ஆவணங்கள்.\n3. 📜 **வரலாறு (History - `legacy.html`)**: 1924-ல் திரு. பி. அந்தோணிசாமி அவர்கள் துவங்கிய ஓலைக் குடிசை முதல், இத்தாலி அற்புத சிலை, கல் கோவில் மற்றும் தற்போதைய நவீன ஆலயம் வரையிலான வரலாறு.\n4. 📅 **அறிவிப்புகள் (Notices - `notices.html`)**: ஆண்டு பெருவிழா (ஜூன் 13), கொடியேற்றம், தேர்ப்பவனி, கிளைப்பங்கு நிகழ்வுகள்.\n5. 🕊️ **பக்தி முயற்சிகள் (Devotion - `devotion.html`)**: 13 செவ்வாய்க்கிழமை நவநாள், நற்கருணை ஆராதனை, தவக்கால சிலுவைப்பாதை.\n6. 🙏 **கத்தோலிக்க செபங்கள் (Prayers - `prayers.html`)**: முக்கிய கத்தோலிக்க செபங்கள், புனித அந்தோணியார் நவநாள் மன்றாட்டுகள்.\n7. 📿 **ஜெபமாலை (Rosary - `rosary.html`)**: ஜெபமாலையின் 4 மறைபொருள்கள் (மகிழ்ச்சி, துயரம், மகிமை, ஒளி) மற்றும் செபிக்கும் முறை.\n8. 📖 **திருவிவிலியம் (Bible - `bible.html`)**: பழைய & புதிய ஏற்பாடு, வசன தேடுதல், ஆடியோவில் வசனங்கள் கேட்கும் வசதி.\n9. 🖼️ **புகைப்படங்கள் (Gallery - `gallery.html`)**: பலிபீடம், மின்விளக்கு அலங்காரம், திருவிழா தேர்ப்பவனி மற்றும் வரலாற்று படங்கள்.\n10. 📞 **தொடர்பு கொள்ள & செப வேண்டுதல் (Contact - `contact.html`)**: பங்குத்தந்தை, மணியக்காரர், பட்டையதாரார் தொடர்பு எண்கள், கூகுள் மேப் வழிகாட்டி மற்றும் AI குரல் பதிவு செப வேண்டுதல் படிவம்.\n11. 🗓️ **நாட்காட்டி (Calendar - `calendar.html`/`schedule.html`)**: தினசரி வழிபாட்டு வாசகங்கள் மற்றும் திருவிழா அட்டவணை.\n\nநீங்கள் எந்த பக்கத்தைப் பற்றியும் விவரம் அறிய என்னிடம் கேட்கலாம்! 🙏";
      } else {
        return "🌐 **St. Antony's Church Website Sitemap & Navigation Guide:**\n\nOur website features the following sections:\n\n1. 🏠 **Home (`index.html`)**: Parish overview, daily readings, Mass schedule card, key highlights.\n2. ⛪ **Liturgy (`liturgy.html`)**: Sunday & weekday Mass times, guidelines and requirements for Holy Sacraments.\n3. 📜 **History & Legacy (`legacy.html`)**: 1924 founding by Mr. P. Antonysamy, Italian miraculous statue, stone church building, elevation to parish, and modern shrine.\n4. 📅 **Notices & Feast (`notices.html`)**: Annual Feast details (June 13), car procession, parish circulars.\n5. 🕊️ **Devotions (`devotion.html`)**: 13 Tuesdays Novena, Eucharistic Adoration, Way of the Cross during Lent.\n6. 🙏 **Prayers (`prayers.html`)**: Daily Catholic prayers, St. Antony intercessory prayers and novenas.\n7. 📿 **Holy Rosary (`rosary.html`)**: The 4 mysteries of the Rosary with interactive prayer beads counter.\n8. 📖 **Holy Bible (`bible.html`)**: Bilingual Old & New Testaments, keyword search, audio scripture narration.\n9. 🖼️ **Gallery (`gallery.html`)**: High-definition photos of sanctuary, feast car procession, and shrine heritage.\n10. 📞 **Contact & Prayer Form (`contact.html`)**: Parish Priest, Treasurer & Patron contacts, Google Map directions, and AI-powered Voice Prayer Request form.\n11. 🗓️ **Liturgical Calendar (`calendar.html`/`schedule.html`)**: Daily liturgical readings and parish schedules.\n\nAsk me anytime about any specific page or parish feature! 🙏";
      }
    }

    // 3. Prayer Request Form & Voice Assistant
    if (norm.includes('வேண்டுதல்') || q.includes('submit') || q.includes('prayer request') || q.includes('குரல் பதிவு') || q.includes('prayer form') || q.includes('how to pray')) {
      if (isTa) {
        return "✍️ **செப வேண்டுதல் பதிவு செய்வது எப்படி? (தொடர்பு பக்கம் - `contact.html`):**\n\nஉங்கள் குடும்ப நலன், நோய் நலம், அமைதி மற்றும் திருப்பலி வேண்டுதல்களை இணையதளம் மூலம் எளிதாக சமர்ப்பிக்கலாம்:\n\n1. **தொடர்பு (Contact)** பக்கத்தில் உள்ள 'உங்கள் செப வேண்டுதல்' படிவத்திற்கு செல்லவும்.\n2. **குரல் பதிவு AI உதவியாளர் (Purple Banner)**: 'குரல் பதிவு' பொத்தானைக் கிளிக் செய்து, உங்கள் பெயர், மின்னஞ்சல் மற்றும் செப வேண்டுதலை தமிழில் பேசினாலே போதும் — படிவம் தானாகவே நிரப்பப்படும்!\n3. அல்லது நேரடியாக பெயர், மின்னஞ்சல், வேண்டுதலை தட்டச்சு செய்து **'சமர்ப்பிக்கவும்'** (Submit) பொத்தானை அழுத்தவும்.\n\nஉங்கள் வேண்டுதல்கள் ஆலய திருப்பலியில் நினைவுகூரப்பட்டு உங்களுக்காக செபிக்கப்படும்! 🙏";
      } else {
        return "✍️ **How to Submit a Prayer Intention (Contact Page - `contact.html`):**\n\nYou can easily submit your prayer intentions, thanksgiving, and Mass requests online:\n\n1. Go to the **Contact** page (`contact.html`) to the 'Your Prayer Intention' form.\n2. **AI Voice Assistant (Purple Card)**: Click the 'Voice Recording' button and speak your name, email, and prayer request in Tamil or English — the form will parse and fill the details automatically!\n3. Or type your name, email, and prayer intention manually and click **'Submit'**.\n\nYour petitions will be prayerfully offered during parish Holy Masses! 🙏";
      }
    }

    // 4. Holy Rosary & Mysteries
    if (norm.includes('ஜெபமாலை') || q.includes('rosary') || q.includes('mysteries') || q.includes('மறைபொருள்')) {
      if (isTa) {
        return "📿 **தூய ஜெபமாலை & மறைபொருள்கள் (ஜெபமாலை பக்கம் - `rosary.html`):**\n\nதூய ஜெபமாலையின் 4 மறைபொருள்கள்:\n1. 🕊️ **மகிழ்ச்சி நிறை மறைபொருள்கள்** (திங்கள் & சனி)\n2. ✝️ **துயரம் நிறை மறைபொருள்கள்** (செவ்வாய் & வெள்ளி)\n3. 👑 **மகிமை நிறை மறைபொருள்கள்** (புதன் & ஞாயிறு)\n4. 💡 **ஒளி நிறை மறைபொருள்கள்** (வியாழன்)\n\nஇணையதளத்தின் **'ஜெபமாலை'** பக்கத்தில் எண்ணும் ஜெபமாலை மணிகள் (Interactive Beads Counter) வசதியுடன் நீங்கள் சுலபமாக செபிக்கலாம்! 🙏";
      } else {
        return "📿 **Holy Rosary Guide (Rosary Page - `rosary.html`):**\n\nThe 4 Mysteries of the Holy Rosary:\n1. 🕊️ **Joyful Mysteries** (Monday & Saturday)\n2. ✝️ **Sorrowful Mysteries** (Tuesday & Friday)\n3. 👑 **Glorious Mysteries** (Wednesday & Sunday)\n4. 💡 **Luminous Mysteries** (Thursday)\n\nVisit our dedicated **Rosary** page (`rosary.html`) which includes an interactive digital beads counter to guide your prayer! 🙏";
      }
    }

    // 5. Mass Timings & Schedules
    if (norm.includes('திருப்பலி') || norm.includes('நேரம்') || norm.includes('பூசை') || q.includes('timing') || q.includes('schedule') || q.includes('mass')) {
      let schedules = [];
      try {
        if (typeof SAC_DATABASE !== 'undefined') {
          schedules = SAC_DATABASE.getCollection('sac_mass_schedules') || SAC_DATABASE.defaultData?.mass_schedules || [];
        }
      } catch(e) {}
      
      if (isTa) {
        let text = "🕊️ **புனித அந்தோணியார் ஆலய திருப்பலி நேரங்கள் (வழிபாடுகள் பக்கம்):**\n\n";
        if (schedules && schedules.length > 0) {
          schedules.forEach(m => {
            if (m.isActive !== false) {
              text += `• **${m.dayTa || m.dayEn}**: ${m.time} (${m.typeTa || m.typeEn})\n`;
            }
          });
        } else {
          text += "• **ஞாயிற்றுக்கிழமை**: காலை 06:00 AM (ஞாயிறு சமூக திருப்பலி)\n• **செவ்வாய்க்கிழமை (நவநாள் நாள்)**: காலை 06:00 AM & மாலை 06:00 PM (சிறப்புத் திருப்பலி & நவநாள் மன்றாட்டு)\n• **திங்கள் முதல் சனி வரை**: காலை 06:00 AM (தினசரி காலைத் திருப்பலி)\n• **முதல் வெள்ளி**: காலை திருப்பலிக்குப் பின் நற்கருணை ஆராதனை மற்றும் ஆசீர்வாதம்.\n";
        }
        text += "\nமேலும் விவரங்களை இணையதளத்தின் **'வழிபாடுகள்'** (Liturgy) பக்கத்தில் காணலாம். திருப்பலியில் பங்கேற்று இறை ஆசீர் பெற அன்போடு அழைக்கிறோம்! 🙏";
        return text;
      } else {
        let text = "🕊️ **St. Antony's Church Holy Mass Schedules (Liturgy Page):**\n\n";
        if (schedules && schedules.length > 0) {
          schedules.forEach(m => {
            if (m.isActive !== false) {
              text += `• **${m.dayEn}**: ${m.time} (${m.typeEn})\n`;
            }
          });
        } else {
          text += "• **Sunday**: 06:00 AM (Solemn Parish Holy Mass)\n• **Tuesday (Novena Day)**: 06:00 AM & 06:00 PM (Special Novena Mass & Benediction)\n• **Monday to Saturday**: 06:00 AM (Daily Morning Mass)\n• **First Friday**: Morning Mass followed by Eucharistic Adoration & Benediction.\n";
        }
        text += "\nYou can also find these on the **Liturgy** page. All faithful are lovingly welcome to worship! 🙏";
        return text;
      }
    }

    // 6. Sacraments & Guidelines
    if (norm.includes('அருட்சாதனம்') || norm.includes('திருமுழுக்கு') || norm.includes('திருமணம்') || norm.includes('புதுநன்மை') || norm.includes('உறுதிபூசுதல்') || norm.includes('பாவசங்கீர்த்தனம்') || q.includes('sacrament') || q.includes('baptism') || q.includes('marriage') || q.includes('confession')) {
      if (isTa) {
        return "⛪ **கத்தோலிக்க திருவருட்சாதனங்கள் வழிகாட்டி (வழிபாடுகள் பக்கம்):**\n\n1. **திருமுழுக்கு (ஞானஸ்நானம்)**: குழந்தையின் பிறப்புச் சான்றிதழ், பெற்றோரின் திருமண சான்றிதழ், ஞானபெற்றோரின் உறுதிபூசுதல் சான்றிதழ் தேவை.\n2. **முதல் நற்கருணை (புதுநன்மை)**: குறைந்தபட்சம் 9 வயது பூர்த்தியாகியிருக்க வேண்டும், 1 வருட மறைக்கல்வி வகுப்பு பயின்றிருக்க வேண்டும்.\n3. **உறுதிபூசுதல்**: 14 வயது பூர்த்தியாகியிருக்க வேண்டும், சிறப்பு தயாரிப்பு வகுப்புகளில் பங்கேற்றிருக்க வேண்டும்.\n4. **திருமணம் (Holy Matrimony)**: மணமக்கள் இருவரின் ஞானஸ்நானம், உறுதிபூசுதல் சான்றிதழ்கள், திருமண தயாரிப்பு பயிற்சி சான்றிதழ், திருமணத்திற்கு 3 மாதங்களுக்கு முன்பே பங்குத்தந்தையை சந்தித்து அறிவிப்பு செய்ய வேண்டும்.\n5. **பாவசங்கீர்த்தனம் (Confession)**: செவ்வாய் மற்றும் ஞாயிறு திருப்பலிக்கு முன்பாக அல்லது பங்குத்தந்தையிடம் எந்நேரமும் பெற்றுக்கொள்ளலாம்.\n6. **நோய்பூசுதல்**: உடல்நலக்குறைவு உள்ளோருக்கு பங்குத்தந்தையை அணுகி உடனடியாக பெற்றுக்கொள்ளலாம்.\n\nமேலும் விவரங்களுக்கு பங்குத்தந்தை அருட்பணி. ஜான் கென்னடி அவர்களை அணுகவும். 🙏";
      } else {
        return "⛪ **Catholic Holy Sacraments Guide (Liturgy Page):**\n\n1. **Holy Baptism**: Requires child's birth certificate, parents' Catholic marriage certificate, godparents' Confirmation certificate.\n2. **First Holy Communion**: Minimum age of 9 years and regular attendance in 1-year preparatory Catechism classes.\n3. **Confirmation**: Minimum age of 14 years and attendance in special Confirmation preparatory classes.\n4. **Holy Matrimony**: Baptism, Communion & Confirmation certificates of bride and groom, Pre-Cana marriage preparation course certificate, and notice to the Parish Priest at least 3 months in advance.\n5. **Reconciliation (Confession)**: Available before Tuesday & Sunday Masses or anytime upon requesting the priest.\n6. **Anointing of the Sick**: Arranged by contacting the parish priest for elderly or sick parishioners.\n\nFor assistance, please contact Parish Priest Rev. Fr. John Kennedy. 🙏";
      }
    }

    // 7. Church History, Origin & Miracles
    if (norm.includes('வரலாறு') || q.includes('1924') || q.includes('statue') || q.includes('miracle') || q.includes('அற்புதம்') || q.includes('தோற்றம்') || q.includes('சிலை') || q.includes('history') || q.includes('origin')) {
      if (isTa) {
        return "📜 **புனித அந்தோணியார் ஆலய வரலாறு & அற்புதங்கள் (வரலாறு பக்கம்):**\n\n• **1924 (ஆலய அடித்தளம்)**: திரு. பி. அந்தோணிசாமி அவர்களால் வடக்கு பாகனூரில் எளிய ஓலைக் குடிசையாக இறை விசுவாசிகளின் ஜெப இல்லம் துவங்கப்பட்டது.\n• **அற்புதத் திருச்சொரூபம்**: 1924-ல் இத்தாலியிலிருந்து கொண்டுவரப்பட்ட பதுவை புனித அந்தோணியாரின் திருவுருவச் சிலை பீடத்தில் நிறுவப்பட்டது.\n• **1960 (கல் ஆலயம்)**: கிளைப்பங்கு மக்களின் கூட்டு முயற்சியாலும் உடல் உழைப்பாலும் ஆலயம் அழகிய கல் கட்டடமாக விரிவாக்கப்பட்டது.\n• **1995 (தனி பங்கு)**: ஆயரால் புனித அந்தோணியார் ஆலயம் தனி பங்காக உயர்த்தப்பட்டு, முதல் பங்குத்தந்தை நியமிக்கப்பட்டார்.\n• **2020 (புதுப்பிக்கப்பட்ட திருத்தலம்)**: அழகிய நற்கருணை பீடம், புதிய உள்கட்டமைப்பு மற்றும் பளிங்குத் தரைத்தளத்துடன் ஆலயம் புதுப்பிக்கப்பட்டது.\n• **அற்புதங்கள்**: காணாமல் போன பொருட்களைக் கண்டெடுப்பது, தீராத நோய்களைக் குணப்படுத்துவது, குழந்தை பாக்கியம் மற்றும் குடும்ப அமைதியை வழங்கி புனித அந்தோணியார் இன்றும் எண்ணற்ற புதுமைகளை ஆற்றி வருகிறார். 🙏";
      } else {
        return "📜 **History & Miracles of St. Antony's Church (Legacy Page):**\n\n• **1924 (Humble Foundation)**: Founded as a simple thatched roof prayer chapel in Vadakku Paganur by Mr. P. Antonysamy.\n• **Miraculous Italian Statue**: The venerable statue of St. Antony brought from Italy was enshrined in 1924.\n• **1960 (Stone Church)**: Rebuilt with solid stone through the physical labor and united efforts of parish devotees.\n• **1995 (Independent Parish)**: Formally declared an independent parish by the Bishop, with a resident parish priest appointed.\n• **2020 (Modernized Sanctuary)**: Comprehensively renovated with a majestic Eucharistic altar, sound systems, and enhanced sanctuary lighting.\n• **Miracles**: Devotees continuously experience miracles — recovery of lost articles, healing of illnesses, gift of children, and blessed family peace. 🙏";
      }
    }

    // 8. Annual Feast, Car Procession & Announcements
    if (norm.includes('திருவிழா') || norm.includes('அறிவிப்பு') || norm.includes('தேர்ப்பவனி') || q.includes('feast') || q.includes('festival') || q.includes('june 13') || q.includes('notice')) {
      if (isTa) {
        return "🎉 **புனித அந்தோணியார் ஆண்டுப் பெருவிழா & அறிவிப்புகள் (அறிவிப்புகள் பக்கம்):**\n\n• **திருவிழா நாள்**: ஆண்டுதோறும் **ஜூன் 13** அன்று புனித அந்தோணியாரின் திருநாள் மிக விமரிசையாகக் கொண்டாடப்படுகிறது.\n• **நவநாள் & கொடியேற்றம்**: விழாவிற்கு முந்தைய 9 நாட்கள் மாலையில் கொடியேற்றம், சிறப்பு திருப்பலி மற்றும் நவநாள் செபங்கள் நடைபெறும்.\n• **தேர்ப்பவனி**: ஜூன் 13 மாலை அலங்கரிக்கப்பட்ட ஆடம்பரத் தேர்ப்பவனி ஊரின் முக்கிய வீதிகள் வழியாக பவனியாக வரும்.\n• **அன்னதானம்**: விழாவில் பங்கேற்கும் அனைத்து இறைமக்களுக்கும் அன்பு விருந்து (அன்னதானம்) வழங்கப்படும்.\n• புதிய அறிவிப்புகள் மற்றும் நிகழ்வு அறிக்கைகளை இணையதளத்தின் **'அறிவிப்புகள்'** (Notices) பக்கத்தில் நேரடியாகக் காணலாம். 🙏";
      } else {
        return "🎉 **St. Antony's Annual Feast & Parish Notices (Notices Page):**\n\n• **Feast Day**: Celebrated grandly every year on **June 13th** in honour of St. Antony of Padua.\n• **9 Days Novena & Flag Hoisting**: Solemn flag hoisting accompanied by evening novena masses leading up to the feast.\n• **Grand Car Procession**: On June 13th evening, the miraculous statue is carried in a gorgeously illuminated car procession through the village.\n• **Community Fellowship**: Blessed bread and festive meals (Annadhanam) are distributed to all devotees.\n• For ongoing parish circulars and updates, visit the **Notices** page on our website. 🙏";
      }
    }

    // 9. Catholic Prayers, 13 Tuesdays Novena & Devotions
    if (norm.includes('செபம்') || q.includes('novena') || q.includes('our father') || q.includes('hail mary') || q.includes('devotion') || q.includes('பக்தி') || q.includes('மன்றாட்டு') || q.includes('நவநாள்') || q.includes('13 sevvai')) {
      if (isTa) {
        return "🕊️ **கத்தோலிக்க செபங்கள் & பக்தி முயற்சிகள் (செபங்கள் & பக்தி பக்கம்):**\n\n• **13 செவ்வாய்க்கிழமை நவநாள்**: புனித அந்தோணியாருக்கு அர்ப்பணிக்கப்பட்ட 13 செவ்வாய் சிறப்பு நவநாள் செபித்து அப்பம் வழங்குவது இவ்வாலயத்தின் சிறப்பு பக்தி.\n• **புதுமைகளின் புனித அந்தோணியார் மன்றாட்டு**:\n\"அதிசயங்களின் புனித அந்தோணியாரே! ஏழைகளின் பாதுகாவலரே, நாங்கள் இழந்த சமாதானத்தையும் ஆன்மீக நலனையும் பெற்றுத்தர இறைவனிடம் பரிந்துபேசும். ஆமென்.\"\n• **அடிப்படை செபங்கள்**: பரலோகத்தில் இருக்கும் எங்கள் பிதாவே, அருள் நிறைந்த மரியே, திரித்துவ மாட்சிமை, விசுவாச அறிக்கை, மனஸ்தாப செபம்.\n• **நற்கருணை ஆராதனை & சிலுவைப்பாதை**: முதல் வெள்ளிக்கிழமைகளில் நற்கருணை ஆசீரும், தவக்காலத்தில் சிலுவைப்பாதையும் நடைபெறுகிறது.\n\nமுழுமையான செபங்களை இணையதளத்தின் **'செபங்கள்'** (Prayers) மற்றும் **'பக்தி'** (Devotion) பக்கங்களில் வாசிக்கலாம். 🙏";
      } else {
        return "🕊️ **Catholic Prayers & Parish Devotions (Prayers & Devotion Pages):**\n\n• **13 Tuesdays Novena**: A beloved tradition honoring St. Antony with 13 consecutive Tuesdays of novena prayer, candles, and charity bread.\n• **Miraculous Prayer to St. Antony**:\n\"O Blessed St. Antony, gentlest of Saints, restorer of lost things, carry our petitions into the presence of Jesus Christ and grant us peace and grace. Amen.\"\n• **Traditional Catholic Prayers**: The Lord's Prayer (Our Father), Hail Mary, Glory Be, Apostles' Creed, and Act of Contrition.\n• **Eucharistic Adoration & Lent**: First Friday Eucharistic adoration and seasonal Stations of the Cross during Lent.\n\nRead complete prayer texts on the **Prayers** and **Devotion** pages. 🙏";
      }
    }

    // 10. Holy Bible (திருவிவிலியம்)
    if (norm.includes('விவிலியம்') || q.includes('bible') || q.includes('scripture') || q.includes('வேதபுத்தகம்') || q.includes('பைபிள்')) {
      if (isTa) {
        return "📖 **திருவிவிலியம் வாசிப்பு & தேடுதல் (விவிலியம் பக்கம் - `bible.html`):**\n\n• **முழு கத்தோலிக்க பைபிள்**: பழைய ஏற்பாடு (46 நூல்கள்) மற்றும் புதிய ஏற்பாடு (27 நூல்கள்) தமிழ் மற்றும் ஆங்கிலத்தில்.\n• **வசன தேடுதல் (Search)**: எந்த சொல்லையும் தட்டச்சு செய்து தொடர்புடைய விவிலிய வசனங்களை உடனடியாகக் கண்டறியலாம்.\n• **குரல் வாசிப்பு (Audio)**: வசனங்களைக் குரல் வடிவில் கேட்கும் வசதி.\n• **அன்றாட சிந்தனை**: இன்றைய நாளுக்கான வாசகங்களும் நற்செய்தி விளக்கங்களும் முகப்பு பக்கத்திலும் உள்ளன.\n\nவிவிலியத்தை வாசிக்க இணையதளத்தின் **'விவிலியம்'** பக்கத்திற்கு செல்லவும்! 🙏";
      } else {
        return "📖 **Holy Bible Features (Bible Page - `bible.html`):**\n\n• **Complete Catholic Canon**: Old Testament (46 books) and New Testament (27 books) in Tamil and English.\n• **Smart Scripture Search**: Search by keywords, book names, chapters, and specific verse numbers.\n• **Audio Narration**: Listen to scriptures read aloud with Text-to-Speech.\n• **Daily Mass Readings**: Today's liturgical readings are also available on the Home page.\n\nOpen the **Bible** page on our website to begin reading and searching! 🙏";
      }
    }

    // 11. Photo & Video Gallery
    if (norm.includes('புகைப்படம்') || q.includes('gallery') || q.includes('photos') || q.includes('videos') || q.includes('காணொளி')) {
      if (isTa) {
        return "🖼️ **ஆலயப் புகைப்படங்கள் & காணொளிகள் (புகைப்படங்கள் பக்கம் - `gallery.html`):**\n\nநமது இணையதளத்தின் புகைப்படக் காட்சியகத்தில்:\n• அழகிய நற்கருணைப் பலிபீடம் (Sanctuary Altar)\n• ஆண்டு திருவிழா வண்ண மின்விளக்கு அலங்காரம் (Feast Lights)\n• மெழுகுவர்த்தி ஏற்றி ஜெபிக்கும் அந்தோணியார் சந்நிதி (Shrine)\n• 1924 இத்தாலி அற்புத திருவுருவச் சிலை (Miraculous Statue)\n• வரலாற்று சிறப்புமிக்க பழைய கல் கோவில் பீடம் (Old Church Altar)\n• ஆண்டு பெருவிழா ஆடம்பர தேர்ப்பவனி புகைப்படங்கள்\n\nஅனைத்து உயர்தரப் படங்களையும் காண **'புகைப்படங்கள்'** (Gallery) பக்கத்தைப் பார்வையிடவும்! 🙏";
      } else {
        return "🖼️ **Photo & Video Gallery (Gallery Page - `gallery.html`):**\n\nExplore high-resolution photographs and videos of our parish:\n• Holy Eucharistic Sanctuary Altar\n• Grand Annual Feast Light Illumination\n• St. Antony's Miraculous Shrine & Candlelight Devotion\n• The 1924 Italian Miraculous Statue\n• Historic 1960 Stone Church Altar Heritage\n• Festive Solemn Car Processions\n\nVisit the **Gallery** page (`gallery.html`) on our website to view the collections! 🙏";
      }
    }

    // 12. Parish Priest Details
    if (norm.includes('பங்குத்தந்தை') || q.includes('kennedy') || q.includes('priest') || q.includes('father')) {
      if (isTa) {
        return "⛪ **பங்குத் தந்தை விவரங்கள்:**\n\n• **பங்குத் தந்தை**: **அருட்பணி. ஜான் கென்னடி** (Rev. Fr. John Kennedy)\n• **ஆலயம்**: புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர்\n• **அலைபேசி**: **+91 89403 71033**\n\nதிருப்பலி ஒப்புக்கொடுத்தல், அருட்சாதனங்கள் பெறுதல், ஆலோசனை அல்லது இல்ல ஆசீருக்கு பங்குத்தந்தையை நேரில் அல்லது அலைபேசியில் தொடர்பு கொள்ளலாம். 🙏";
      } else {
        return "⛪ **Parish Priest Information:**\n\n• **Parish Priest**: **Rev. Fr. John Kennedy**\n• **Parish**: St. Antony's Church, Vadakku Paganur\n• **Mobile**: **+91 89403 71033**\n\nFor Mass intentions, sacraments, pastoral counseling, or house blessings, feel free to contact Father directly. 🙏";
      }
    }

    // 13. Parish Treasurer / Maniyakkarar Details
    if (norm.includes('மணியக்காரர்') || q.includes('treasurer') || q.includes('ஆரோக்கியசாமி') || q.includes('arokkiyasamy')) {
      if (isTa) {
        return "🔑 **ஆலய மணியக்காரர் / பொருளாளர் விவரங்கள்:**\n\n• **மணியக்காரர்**: **திரு. அ. ஆரோக்கியசாமி** (Mr. A. Arokkiyasamy)\n• **பொறுப்பு**: ஆலய நிதி நிர்வாகம் மற்றும் திருப்பணி ஒருங்கிணைப்பு\n• **அலைபேசி**: **+91 98650 43169**\n\nஆலய வளர்ச்சிப் பணிகள், நன்கொடைகள் மற்றும் திருவிழா பங்களிப்புகளுக்கு இவரைத் தொடர்பு கொள்ளலாம். 🙏";
      } else {
        return "🔑 **Parish Treasurer Information:**\n\n• **Treasurer / Maniyakkarar**: **Mr. A. Arokkiyasamy**\n• **Responsibility**: Parish administration, finances & development coordination\n• **Mobile**: **+91 98650 43169**\n\nFor shrine development offerings, donations, or feast festival contributions, you can contact the treasurer. 🙏";
      }
    }

    // 14. Patron / Pattaiyadharar Details
    if (norm.includes('பட்டையதாரார்') || q.includes('patron') || q.includes('அந்தோணிசாமி') || q.includes('antonysamy')) {
      if (isTa) {
        return "📜 **ஆலய பட்டையதாரார் விவரங்கள்:**\n\n• **பட்டையதாரார்**: **திரு. பி. அந்தோணிசாமி குடும்பத்தினர்** (Mr. P. Antonysamy Family)\n• **வரலாறு**: 1924-ல் எளிய ஓலைக் குடிசையில் புனித அந்தோணியாருக்கு முதல் ஜெப இல்லத்தை அமைத்து, இத்தாலி அற்புத திருவுருவச் சிலையை நிறுவிய நிறுவன பரம்பரை.\n• நான்கு தலைமுறைகளாக ஆலய பாரம்பரியத்தையும் பெருவிழா கொடியேற்ற மரபையும் பேணிப் பாதுகாத்து வருகின்றனர். 🙏";
      } else {
        return "📜 **Parish Patron / Pattaiyadharar Information:**\n\n• **Patron**: **Mr. P. Antonysamy Family**\n• **Heritage**: The founding lineage that established the first chapel in 1924 and enshrined the miraculous statue of St. Antony from Italy.\n• Continues to preserve the sacred heritage and traditional feast flag-hoisting customs for four generations. 🙏";
      }
    }

    // 15. Address, Location & Directions
    if (norm.includes('எங்கே') || q.includes('location') || q.includes('map') || q.includes('directions') || q.includes('route') || q.includes('address') || q.includes('reach') || q.includes('bus')) {
      let addrTa = "புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர் - 620009, திருச்சி மாவட்டம், தமிழ்நாடு, இந்தியா.";
      let addrEn = "St. Antony's Church, Vadakku Paganur - 620009, Tiruchirappalli District, Tamil Nadu, India.";
      try {
        if (typeof SAC_DATABASE !== 'undefined') {
          const dbSettings = (typeof SAC_DATABASE.getCollection === 'function' ? SAC_DATABASE.getCollection('sac_settings') : null) || SAC_DATABASE.defaultData?.settings;
          if (dbSettings?.addressTa && !dbSettings.addressTa.includes('630312')) addrTa = dbSettings.addressTa;
          if (dbSettings?.addressEn && !dbSettings.addressEn.includes('630312')) addrEn = dbSettings.addressEn;
        }
      } catch(e) {}

      if (isTa) {
        return `📍 **ஆலய இருப்பிடம் & வழித்தடம் (தொடர்பு பக்கம் - \`contact.html\`):**\n\n• **முகவரி**: ${addrTa}\n• **வழித்தடம்**: திருச்சிராப்பள்ளி நகரில் இருந்து எளிதாக பேருந்து அல்லது வாகனங்கள் மூலம் வடக்கு பாகனூரை அடையலாம்.\n• **கூகுள் மேப் வழிகாட்டி**: தொடர்பு பக்கத்தில் நேரடி Google Map இணைப்பு உள்ளது (\`near_me வழிகாட்டி\` பொத்தானைக் கிளிக் செய்யவும்).\n• **தொலைபேசி**: +91 98650 43169\n\nஆலயத்திற்கு வருகை தந்து புனித அந்தோணியாரின் பேரருளைப் பெற அன்போடு அழைக்கிறோம்! 🙏`;
      } else {
        return `📍 **Parish Location & Directions (Contact Page - \`contact.html\`):**\n\n• **Address**: ${addrEn}\n• **How to Reach**: Located in Vadakku Paganur near Tiruchirappalli, accessible by local buses, taxis, and road transit.\n• **Google Maps Navigation**: Click the 'Directions' button on our **Contact** page to open exact turn-by-turn Google Maps navigation.\n• **Phone**: +91 98650 43169\n\nYou are warmly welcome to visit the shrine of St. Antony! 🙏`;
      }
    }

    // 16. General Contact Details
    if (norm.includes('தொடர்பு') || q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('mail')) {
      let phone = "+91 98650 43169";
      let email = "sacpaganur@gmail.com";
      let addrTa = "புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர் - 620009, தமிழ்நாடு, இந்தியா.";
      let addrEn = "St. Antony's Church, Vadakku Paganur - 620009, Tamil Nadu, India.";
      let website = "https://stacpaganur.web.app";

      try {
        if (typeof SAC_DATABASE !== 'undefined') {
          const dbSettings = (typeof SAC_DATABASE.getCollection === 'function' ? SAC_DATABASE.getCollection('sac_settings') : null) || SAC_DATABASE.defaultData?.settings;
          if (dbSettings) {
            if (dbSettings.phone && dbSettings.phone !== '+91 94860 12345') phone = dbSettings.phone;
            if (dbSettings.email && dbSettings.email !== 'contact@stacpaganur.in' && dbSettings.email !== 'contact@stantonyschurchpaganur.in') email = dbSettings.email;
            if (dbSettings.addressTa && !dbSettings.addressTa.includes('630312')) addrTa = dbSettings.addressTa;
            if (dbSettings.addressEn && !dbSettings.addressEn.includes('630312')) addrEn = dbSettings.addressEn;
          }
        }
      } catch (e) {}

      if (isTa) {
        return `📞 **ஆலயத் தொடர்பு விவரங்கள் (தொடர்பு பக்கம் - \`contact.html\`):**\n\n• **ஆலயம்**: புனித அந்தோணியார் ஆலயம் (St. Antony's Church)\n• **முகவரி**: ${addrTa}\n• **ஆலயத் தொலைபேசி**: **${phone}**\n• **பங்குத்தந்தை அலைபேசி**: **+91 89403 71033**\n• **மின்னஞ்சல்**: **${email}**\n• **வலைத்தளம்**: ${website}\n\nஎந்த நேரமும் தொடர்பு பக்கத்தின் வழியாக நீங்கள் தொடர்பு கொள்ளலாம் அல்லது செப வேண்டுதலைப் பதிவு செய்யலாம். 🙏`;
      } else {
        return `📞 **Parish Contact Information (Contact Page - \`contact.html\`):**\n\n• **Church**: St. Antony's Church\n• **Address**: ${addrEn}\n• **Parish Phone**: **${phone}**\n• **Parish Priest Mobile**: **+91 89403 71033**\n• **Email**: **${email}**\n• **Website**: ${website}\n\nYou can reach us anytime through the Contact page or submit prayer requests online. 🙏`;
      }
    }

    // 17. Website Tools: Smart Tamil Typing (TA), Dark Mode, Voice Input
    if (norm.includes('தட்டச்சு') || q.includes('dark mode') || q.includes('night mode') || q.includes('light mode') || q.includes('tamil typing') || q.includes('language') || q.includes('translit')) {
      if (isTa) {
        return "⚙️ **இணையதள வசதிகள் & வழிகாட்டி (Website Tools):**\n\n• **ஸ்மார்ட் தமிழ் தட்டச்சு (TA பொத்தான்)**: ஆங்கில விசைப்பலகையில் தட்டச்சு செய்து (எ.கா: `vanakkam`, `neram`, `thiruppali`) Space பட்டனை அழுத்தினால் உடனே அழகிய தமிழில் மாறும்! ஆங்கிலத்தில் மட்டும் எழுத `EN` பட்டனை அழுத்தலாம்.\n• **இரவு / பகல் முறைமை (Dark/Light Mode)**: இணையதள தலைப்புப் பட்டியில் (Header) உள்ள பிறை நிலவு (Moon/Sun) சின்னத்தைக் கிளிக் செய்து இரவு அல்லது பகல் பயன்முறைக்கு மாறலாம்.\n• **மொழி மாற்றம் (Language Toggle)**: மேல் வலதுபுறத்தில் உள்ள `ENG / தமிழ்` பொத்தானைக் கிளிக் செய்து முழு இணையதளத்தையும் ஆங்கிலம் அல்லது தமிழுக்கு மாற்றலாம்.\n• **குரல் பதிவு (Voice Input)**: உள்ளீட்டுப் பெட்டிகளிலும் இந்த AI அரட்டையிலும் உள்ள மைக் பொத்தானை அழுத்திப் பேசலாம். 🙏";
      } else {
        return "⚙️ **Website Features & Tools Guide:**\n\n• **Smart Tamil Transliteration (TA Button)**: Type phonetically in English (e.g., `vanakkam`, `neram`, `thiruppali`) and press Space — it will automatically convert into Tamil! Click `TA` to toggle to `EN` for normal English typing.\n• **Dark / Light Mode**: Click the Moon/Sun icon in the website header to toggle comfortable dark mode or crisp light mode.\n• **Language Switch**: Click the `ENG / தமிழ்` button in the header to switch the entire website between English and Tamil instantly.\n• **Voice-to-Text**: Click the microphone icon in input fields and this AI chat to speak in Tamil or English. 🙏";
      }
    }

    // 18. Donations & Offerings
    if (q.includes('donation') || q.includes('donate') || q.includes('offering') || q.includes('kanikkai') || q.includes('காணிக்கை') || q.includes('நன்கொடை')) {
      if (isTa) {
        return "🙏 **ஆலயக் காணிக்கை & நன்கொடைகள்:**\n\nபுனித அந்தோணியார் ஆலயத்தின் வளர்ச்சிப் பணிகள், திருப்பலி வேண்டுதல்கள், திருவிழா மற்றும் ஏழைகளுக்கான அன்னதானப் பணிகளுக்கு உங்கள் காணிக்கைகளை மனமுவந்து அளிக்கலாம்.\n\nநன்கொடை விவரங்கள் மற்றும் ரசீது பெற:\n• பங்குத்தந்தை: **அருட்பணி. ஜான் கென்னடி** (+91 89403 71033)\n• பொருளாளர்: **திரு. அ. ஆரோக்கியசாமி** (+91 98650 43169)\nநேரடியாக தொடர்பு கொள்ளலாம். உங்கள் கொடைகள் அனைத்திற்கும் இறைவன் நூறுமடங்கு பலன் தருவாராக! ஆமென். 🙏";
      } else {
        return "🙏 **Parish Offerings & Donations:**\n\nYou can contribute offerings for shrine maintenance, Holy Mass intentions, annual feast car procession, and charitable outreach for the needy.\n\nTo arrange donations or obtain an official parish receipt, please contact:\n• Parish Priest: **Rev. Fr. John Kennedy** (+91 89403 71033)\n• Parish Treasurer: **Mr. A. Arokkiyasamy** (+91 98650 43169)\nMay God and St. Antony bless your generosity abundantly! Amen. 🙏";
      }
    }

    // 19. Catechism & Associations
    if (q.includes('catechism') || q.includes('மறைக்கல்வி') || q.includes('சங்கம்') || q.includes('இயக்கம்') || q.includes('youth') || q.includes('society')) {
      if (isTa) {
        return "📖 **மறைக்கல்வி & கிளைப்பங்கு இயக்கங்கள்:**\n\n• **ஞாயிறு மறைக்கல்வி**: பள்ளி மாணவர்களுக்கு ஞாயிறு காலை திருப்பலிக்குப் பின் மறைக்கல்வி வகுப்புகள் நடைபெறுகின்றன.\n• **பக்த சபைகள்**: வின்சென்ட் டி பவுல் சபை (ஏழைகளுக்கான உதவி), மரியாயின் சேனை (ஜெப இயக்கம்), கத்தோலிக்க வாலிபர் இயக்கம், மற்றும் பீடச் சிறார்கள் சங்கம் கிளைப்பங்கில் சிறப்பாக செயல்பட்டு வருகின்றன.\n\nமேலும் விவரங்களுக்கு பங்குத்தந்தை அருட்பணி. ஜான் கென்னடி அவர்களை அணுகவும். 🙏";
      } else {
        return "📖 **Catechism & Parish Associations:**\n\n• **Sunday Catechism**: Sunday school for children is conducted every Sunday immediately following the morning Holy Mass.\n• **Pious Associations**: Society of St. Vincent de Paul, Legion of Mary, Catholic Youth Movement, and Altar Servers Guild actively serve the parish.\n\nFor enrollment or joining, please speak with the Parish Priest. 🙏";
      }
    }

    // 20. Liturgical Calendar & Daily Readings
    if (norm.includes('நாட்காட்டி') || q.includes('calendar') || q.includes('readings') || q.includes('liturgical')) {
      if (isTa) {
        return "🗓️ **வழிபாட்டு நாட்காட்டி & வாசகங்கள் (`calendar.html` / `schedule.html`):**\n\n• **தினசரி வாசகங்கள்**: கத்தோலிக்க திருச்சபையின் அன்றாட நற்செய்தி மற்றும் விவிலிய வாசகங்கள்.\n• **புனிதர்கள் திருநாள்**: ஆண்டு முழுவதும் கொண்டாடப்படும் முக்கிய மறைசாட்சிகள் மற்றும் புனிதர்களின் திருநாட்கள்.\n• **சிறப்பு திருப்பலிகள்**: தவக்காலம், திருவருகைக் காலம், பாஸ்கா பெருவிழா மற்றும் நத்தார் பெருவிழா வழிபாட்டு அட்டவணைகள்.\n\nஇணையதளத்தின் **'நாட்காட்டி'** (Calendar) பக்கத்தில் முழு வழிபாட்டு அட்டவணையையும் காணலாம்! 🙏";
      } else {
        return "🗓️ **Liturgical Calendar & Daily Readings (`calendar.html` / `schedule.html`):**\n\n• **Daily Scripture Readings**: Catholic Church's daily Gospel and epistle readings.\n• **Feasts of Saints**: Liturgical calendar honoring Apostles, Martyrs, and Saints throughout the year.\n• **Special Seasons**: Seasonal calendars for Advent, Christmas, Lent, Holy Week, and Easter celebrations.\n\nCheck the **Calendar** page on our website for the complete liturgical schedule! 🙏";
      }
    }

    // 21. Parish Administration Portal
    if (norm.includes('நிர்வாகம்') || q.includes('admin') || q.includes('portal') || q.includes('login')) {
      if (isTa) {
        return "🔐 **ஆலய நிர்வாக போர்டல் (`sac-admin-portal.html`):**\n\n• ஆலய பங்குத்தந்தை மற்றும் நிர்வாகக் குழுவினருக்கான பிரத்யேக போர்ட்டல்.\n• திருப்பலி அட்டவணை மாற்றம், புதிய அறிவிப்புகள் வெளியிடுதல், ஆன்லைன் செப வேண்டுதல்களைப் பார்வையிடுதல் மற்றும் நன்கொடைகளை நிர்வகிக்கும் வசதிகள் இதில் உள்ளன. 🙏";
      } else {
        return "🔐 **Parish Administration Portal (`sac-admin-portal.html`):**\n\n• Dedicated portal for Parish Priest and church administrative council.\n• Allows updating mass schedules, publishing new notices, managing online prayer intentions, and recording donations. 🙏";
      }
    }

    // 22. General Parish / Church Overview
    if (norm.includes('ஆலயம்') || q.includes('church') || q.includes('details') || q.includes('about')) {
      if (isTa) {
        return "⛪ **புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர் - ஒரு பார்வை:**\n\n• **ஆலயம்**: புனித அந்தோணியார் ஆலயம் (St. Antony's Church)\n• **அமைவிடம்**: வடக்கு பாகனூர் - 620009, திருச்சிராப்பள்ளி மாவட்டம், தமிழ்நாடு.\n• **நிறுவப்பட்ட ஆண்டு**: 1924 (திரு. பி. அந்தோணிசாமி அவர்களால் துவக்கப்பட்டது).\n• **திருப்பலி நேரங்கள்**: ஞாயிறு 06:00 AM, செவ்வாய் 06:00 AM & 06:00 PM (நவநாள்), திங்கள்-சனி 06:00 AM.\n• **ஆண்டுப் பெருவிழா**: ஆண்டுதோறும் ஜூன் 13 அன்று அலங்கரிக்கப்பட்ட தேர்ப்பவனியுடன்.\n• **பங்குத்தந்தை**: அருட்பணி. ஜான் கென்னடி (+91 89403 71033)\n• **மணியக்காரர்**: திரு. அ. ஆரோக்கியசாமி (+91 98650 43169)\n\nஇணையதளத்தில் முகப்பு, வழிபாடுகள், வரலாறு, அறிவிப்புகள், செபங்கள், விவிலியம், காட்சியகம் மற்றும் தொடர்பு பக்கங்கள் உள்ளன. எந்த விவரம் வேண்டுமானாலும் என்னிடம் கேட்கலாம்! 🙏";
      } else {
        return "⛪ **St. Antony's Church, Vadakku Paganur - Overview:**\n\n• **Shrine**: St. Antony's Church\n• **Location**: Vadakku Paganur - 620009, Tiruchirappalli District, Tamil Nadu, India.\n• **Founded**: 1924 (Humble beginning by Mr. P. Antonysamy).\n• **Mass Timings**: Sunday 06:00 AM, Tuesday 06:00 AM & 06:00 PM (Novena), Mon-Sat 06:00 AM.\n• **Annual Feast**: June 13th every year with grand car procession.\n• **Parish Priest**: Rev. Fr. John Kennedy (+91 89403 71033)\n• **Parish Treasurer**: Mr. A. Arokkiyasamy (+91 98650 43169)\n\nOur website features Home, Liturgy, Legacy, Notices, Prayers, Rosary, Bible, Gallery, and Contact pages. Ask me anything anytime! 🙏";
      }
    }

    return null;
  },

  async askGemini(promptText, lang = null, isRetry = false) {
    const isTa = lang ? (lang === 'TA') : (window.SAC_COMMON?.currentLang === 'ta');

    // 1. Instant Intelligent Parish Knowledge Response (Fast, always works, zero quota consumed)
    const localAnswer = this._getLocalParishResponse(promptText, isTa);
    if (localAnswer) {
      if (!isRetry) {
        this.chatHistory.push({ role: "user", parts: [{ text: promptText }] });
      }
      this.chatHistory.push({ role: "model", parts: [{ text: localAnswer }] });
      if (this.onAIResponse) this.onAIResponse(localAnswer);
      return localAnswer;
    }

    // 2. Otherwise query Gemini Cloud AI
    if (!this.isInitialized) {
      await this.init();
    }

    // Temporarily update system prompt if language changed
    if (this.chatHistory.length > 0 && !isRetry) {
        this.chatHistory[0].parts[0].text = await this._getSystemInstruction(lang);
    }

    // Add user message to history only if not retrying
    if (!isRetry) {
        this.chatHistory.push({
          role: "user",
          parts: [{ text: promptText }]
        });
    }

    // Try Gemini model candidates
    const modelsToTry = [this.modelName || 'gemini-3.6-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let aiResponseText = null;

    for (const modelCandidate of modelsToTry) {
      if (!this.apiKey) break;
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: this.chatHistory,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            aiResponseText = data.candidates[0].content.parts[0].text;
            this.modelName = modelCandidate;
            break;
          }
        }
      } catch (e) {
        console.warn(`Model ${modelCandidate} attempt failed:`, e);
      }
    }

    // 3. If Gemini returned a response, use it
    if (aiResponseText) {
      this.chatHistory.push({
        role: "model",
        parts: [{ text: aiResponseText }]
      });
      if (this.onAIResponse) this.onAIResponse(aiResponseText);
      return aiResponseText;
    }

    // 4. Comprehensive Parish & Website Fallback Response
    const fallbackMsg = isTa
      ? "வணக்கம்! புனித அந்தோணியார் ஆலயத்தின் முழுமையான இணையதள வழிகாட்டி இதோ:\n\n• 🏠 **திருப்பலி நேரங்கள்**: ஞாயிறு 06:00 AM, செவ்வாய் 06:00 AM & 06:00 PM, திங்கள்-சனி 06:00 AM.\n• 📜 **வரலாறு**: 1924-ல் திரு. பி. அந்தோணிசாமி அவர்கள் துவங்கிய ஓலைக் குடிசை, 1924 இத்தாலி அற்புத சிலை, 1960 கல் கோவில், 1995 தனி பங்கு, 2020 நவீன ஆலயம்.\n• 📅 **திருவிழா**: ஆண்டுதோறும் ஜூன் 13 அன்று மாலை தேர்ப்பவனியுடன் பெருவிழா.\n• ⛪ **அருட்சாதனங்கள்**: திருமுழுக்கு, நற்கருணை, உறுதிபூசுதல், திருமணம், பாவசங்கீர்த்தனம் (வழிபாடுகள் பக்கம்).\n• 🕊️ **செபங்கள் & விவிலியம்**: கத்தோலிக்க செபங்கள், 13 செவ்வாய் நவநாள், ஜெபமாலை மற்றும் முழு விவிலியம்.\n• ✍️ **செப வேண்டுதல்**: 'தொடர்பு' பக்கத்தில் குரல் பதிவு அல்லது தட்டச்சு மூலம் உங்கள் வேண்டுதலைப் பதிவு செய்யலாம்.\n• 📞 **பொறுப்பாளர்கள்**: பங்குத்தந்தை அருட்பணி. ஜான் கென்னடி (+91 89403 71033), மணியக்காரர் திரு. அ. ஆரோக்கியசாமி (+91 98650 43169).\n\nகுறிப்பிட்ட எந்த தலைப்பைப் பற்றியும் என்னிடம் நீங்கள் தாராளமாகக் கேட்கலாம்! புனித அந்தோணியார் உங்களை ஆசீர்வதிப்பாராக! 🙏"
      : "Welcome! Here is your complete guide to St. Antony's Church & Website:\n\n• 🏠 **Mass Timings**: Sunday 06:00 AM, Tuesday 06:00 AM & 06:00 PM, Mon-Sat 06:00 AM.\n• 📜 **History**: Founded in 1924 by Mr. P. Antonysamy, miraculous Italian statue, 1960 stone church, 1995 independent parish, 2020 modern shrine.\n• 📅 **Feast Day**: June 13th every year with solemn car procession & novena.\n• ⛪ **Sacraments**: Guidelines for Baptism, Communion, Confirmation, Marriage & Confession on the Liturgy page.\n• 🕊️ **Prayers & Bible**: Complete Catholic prayers, 13 Tuesdays Novena, Holy Rosary, and searchable Holy Bible.\n• ✍️ **Prayer Requests**: Submit online via Voice AI or text form on the Contact page.\n• 📞 **Contacts**: Parish Priest Rev. Fr. John Kennedy (+91 89403 71033), Treasurer Mr. A. Arokkiyasamy (+91 98650 43169).\n\nFeel free to ask about any specific topic or page! May St. Antony bless you! 🙏";

    this.chatHistory.push({
      role: "model",
      parts: [{ text: fallbackMsg }]
    });

    if (this.onAIResponse) this.onAIResponse(fallbackMsg);
    return fallbackMsg;
  },

  speakText(text, lang = null) {
    return new Promise((resolve) => {
        if (!this.synthesis) return resolve();
        
        this.synthesis.cancel(); // Stop any ongoing speech

        // Clean text (remove markdown like ** or # for speech)
        const cleanText = text.replace(/[*#_]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const isTa = lang ? (lang === 'TA') : (window.SAC_COMMON?.currentLang === 'ta');
    
    // Try to find a specific voice, fallback to default
    const voices = this.synthesis.getVoices();
    let voice = null;
    
    if (isTa) {
      utterance.lang = 'ta-IN';
      voice = voices.find(v => v.lang === 'ta-IN');
    } else {
      utterance.lang = 'en-IN';
      voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    if (voice) utterance.voice = voice;
    
    utterance.rate = 0.95; // slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => this.isSpeaking = true;
    utterance.onend = () => {
      this.isSpeaking = false;
      resolve();
    };
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      this.isSpeaking = false;
      resolve();
    };

    this.synthesis.speak(utterance);
    });
  },

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }
};

// Ensure voices are loaded
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices loaded
  };
}
