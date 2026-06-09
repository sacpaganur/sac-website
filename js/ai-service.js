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
  modelName: 'gemini-1.5-flash', // Default, will be auto-detected
  
  // Custom Events
  onStartListening: null,
  onStopListening: null,
  onSpeechResult: null,
  onAIResponse: null,
  onError: null,

  async init() {
    if (this.isInitialized) return true;
    
    // Fetch API Key from Settings
    const settings = await SAC_DATABASE.get("settings");
    this.apiKey = settings?.aiApiKey || SAC_DATABASE?.defaultData?.firebase_config?.apiKey || "";
    
    if (!this.apiKey) {
      console.warn("SAC_AI: Gemini API Key not found. Please set it in the Admin Portal.");
      return false;
    }

    // Dynamically discover a supported model to prevent "Not Found" errors
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
      const data = await response.json();
      if (data.models) {
        const validModels = data.models.filter(m => 
          m.name.includes("gemini") && 
          m.supportedGenerationMethods && 
          m.supportedGenerationMethods.includes("generateContent") &&
          !m.name.includes("preview") &&
          !m.name.includes("exp") &&
          !m.name.includes("tts")
        );
        
        // Sort models: try 1.5-flash first, then 1.5-pro, then anything else
        this.availableModels = validModels.sort((a, b) => {
            if (a.name.includes("1.5-flash")) return -1;
            if (b.name.includes("1.5-flash")) return 1;
            if (a.name.includes("1.5-pro")) return -1;
            if (b.name.includes("1.5-pro")) return 1;
            return 0;
        });

        if (this.availableModels.length > 0) {
           this.currentModelIndex = 0;
           this.modelName = this.availableModels[0].name.replace("models/", "");
           console.log("SAC_AI: Auto-detected supported models ->", this.availableModels.map(m => m.name));
        }
      }
    } catch(e) {
      console.warn("Could not fetch models list, using default.", e);
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
            liveContext += `--- SAC SETTINGS ---\n`;
            liveContext += `Church Name: ${settings.churchNameEn || ''} / ${settings.churchNameTa || ''}\n`;
            liveContext += `Location: ${settings.locationEn || ''} / ${settings.locationTa || ''}\n`;
            liveContext += `Contact: ${settings.phone || ''} | ${settings.email || ''}\n`;
            
            let massSchedules = await SAC_DATABASE.get("mass_schedules") || [];
            if (!Array.isArray(massSchedules)) massSchedules = Object.values(massSchedules);
            const activeSchedules = massSchedules.filter(s => s && s.isActive !== false);
            if (activeSchedules.length > 0) {
                liveContext += `\n--- MASS TIMINGS ---\n`;
                activeSchedules.forEach(s => {
                    liveContext += `${s.dayEn || ''} / ${s.dayTa || ''}: ${s.time || ''} - ${s.typeEn || ''} / ${s.typeTa || ''}\n`;
                });
            }
            
            let notices = await SAC_DATABASE.get("announcements") || [];
            if (!Array.isArray(notices)) notices = Object.values(notices);
            const today = new Date().toISOString().split('T')[0];
            const activeNotices = notices.filter(n => n && (!n.expiryDate || n.expiryDate >= today) && n.isActive !== false);
            
            if (activeNotices.length > 0) {
                liveContext += `\n--- ACTIVE ANNOUNCEMENTS ---\n`;
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

    return `You are the official AI digital secretary and bilingual Catholic theologian for St. Antony's Church, Vadakku Paganur (வடக்கு பாகனூர்).
    
YOUR DIRECTIVES:
1. ONLY answer questions related to St. Antony's Church, Catholic theology, Bible verses, prayers, and spirituality.
2. If a user asks about anything unrelated (e.g. math, coding, politics, general world knowledge), you MUST politely refuse and state your purpose.
3. Keep responses concise, conversational, and formatted cleanly. No internal monologues.
4. ${langInstruction} If the user speaks Tamil, reply in perfectly natural Tamil. If English, reply in English.

LIVE KNOWLEDGE BASE (Use this to answer questions about the church):
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

  async askGemini(promptText, lang = null, isRetry = false) {
    if (!this.isInitialized) {
      const success = await this.init();
      if (!success) throw new Error("Gemini API Key is missing. Please contact the administrator.");
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: this.chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errData = await response.json();
        const errMsg = errData.error?.message || "Failed to communicate with AI.";
        const isQuotaErr = response.status === 429 || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("limit: 0");
        const isFeatureErr = errMsg.toLowerCase().includes("multiturn") || errMsg.toLowerCase().includes("not enabled");
        
        // Auto-fallback if quota exceeded, limit is 0, or model doesn't support chat
        if (isQuotaErr || isFeatureErr) {
            if (this.currentModelIndex < this.availableModels.length - 1) {
                this.currentModelIndex++;
                this.modelName = this.availableModels[this.currentModelIndex].name.replace("models/", "");
                console.warn(`Model failed (${errMsg}). Auto-falling back to next model: ${this.modelName}`);
                return await this.askGemini(promptText, lang, true);
            }
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      // Add AI response to history
      this.chatHistory.push({
        role: "model",
        parts: [{ text: aiResponseText }]
      });

      if (this.onAIResponse) this.onAIResponse(aiResponseText);
      return aiResponseText;

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Remove the failed user prompt from history only if it's not a successful retry resolving
      if (!isRetry) {
        this.chatHistory.pop();
      }
      if (this.onError) this.onError(error.message);
      throw error;
    }
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
