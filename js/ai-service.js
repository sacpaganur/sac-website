/* St. Antony's Church - AI Bible Companion Service */

window.SAC_AI = {
  apiKey: null,
  isInitialized: false,
  chatHistory: [],
  speechRecognition: null,
  synthesis: window.speechSynthesis,
  isListening: false,
  isSpeaking: false,
  
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
    this.apiKey = settings?.aiApiKey || "";
    
    if (!this.apiKey) {
      console.warn("SAC_AI: Gemini API Key not found. Please set it in the Admin Portal.");
      return false;
    }

    // Initialize System Prompt based on current language
    this._resetHistory();
    this._setupSpeechRecognition();
    
    this.isInitialized = true;
    return true;
  },

  _resetHistory() {
    const isTa = window.SAC_COMMON?.currentLang === 'ta';
    const systemInstruction = isTa 
      ? `You are an expert bilingual Catholic theologian and a digital Bible companion for St. Antony's Church, Vadakku Paganur. You must answer questions gracefully, accurately, and ONLY using Catholic theological context. When asked about Bible verses, quote the Catholic Bible. Respond primary in Tamil, but you can use English if asked. Keep responses concise and formatted cleanly.`
      : `You are an expert bilingual Catholic theologian and a digital Bible companion for St. Antony's Church, Vadakku Paganur. You must answer questions gracefully, accurately, and ONLY using Catholic theological context. When asked about Bible verses, quote the Catholic Bible. Respond primarily in English, but you can use Tamil if asked. Keep responses concise and formatted cleanly.`;

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

  startListening() {
    if (!this.speechRecognition) {
      if (this.onError) this.onError("Voice recognition is not supported in this browser.");
      return;
    }
    
    // Set language dynamically
    const isTa = window.SAC_COMMON?.currentLang === 'ta';
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

  async askGemini(promptText) {
    if (!this.isInitialized) {
      const success = await this.init();
      if (!success) throw new Error("Gemini API Key is missing. Please contact the administrator.");
    }

    // Add user message to history
    this.chatHistory.push({
      role: "user",
      parts: [{ text: promptText }]
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
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
        throw new Error(errData.error?.message || "Failed to communicate with AI.");
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
      // Remove the failed user prompt from history
      this.chatHistory.pop();
      if (this.onError) this.onError(error.message);
      throw error;
    }
  },

  speakText(text, onEndCallback) {
    if (!this.synthesis) return;
    
    this.synthesis.cancel(); // Stop any ongoing speech

    // Clean text (remove markdown like ** or # for speech)
    const cleanText = text.replace(/[*#_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isTa = window.SAC_COMMON?.currentLang === 'ta';
    
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
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback();
    };

    this.synthesis.speak(utterance);
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
