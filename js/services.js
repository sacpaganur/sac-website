/**
 * SAC Shared Services for Public Site (Voice, Transliteration, AI)
 */

// Mini Toast implementation
const SAC_Toast = {
  show(title, message, type = 'info') {
    let container = document.getElementById('sac-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sac-toast-container';
      Object.assign(container.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      });
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    Object.assign(toast.style, {
      background: isError ? '#fee2e2' : '#ffffff',
      color: isError ? '#991b1b' : '#1f2937',
      borderLeft: `4px solid ${isError ? '#ef4444' : 'var(--primary-500, #673ab7)'}`,
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '0.9rem',
      minWidth: '250px',
      transform: 'translateX(120%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    });

    toast.innerHTML = `
      <strong style="font-size:0.95rem;">${title}</strong>
      <span style="opacity:0.9;">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Remove after 4s
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },
  info(title, msg) { this.show(title, msg, 'info'); },
  error(title, msg) { this.show(title, msg, 'error'); }
};

/**
 * SAC Transliteration Service
 * Handles English-to-Tamil phonetic transliteration for input fields.
 */
const TransliterationService = {
  activeInputs: new Map(),
  isEnabled: true,

  register(input, onConvert) {
    if (!input || this.activeInputs.has(input)) return;

    const handleInput = async (e) => {
      if (!this.isEnabled) return;
      
      const val = input.value;
      const pos = input.selectionStart;
      const char = e.data || (val.length > 0 ? val[pos - 1] : null);
      
      if (char === ' ' || char === '.' || char === ',' || char === '?' || char === '!' || char === '\n') {
        const textBeforeCursor = val.substring(0, pos - 1);
        const lastSpace = Math.max(
          textBeforeCursor.lastIndexOf(' '),
          textBeforeCursor.lastIndexOf('\n'),
          textBeforeCursor.lastIndexOf('\t'),
          -1
        );
        
        const lastWord = textBeforeCursor.substring(lastSpace + 1).trim();
        
        if (lastWord && lastWord.length >= 1 && /^[a-zA-Z']+$/.test(lastWord)) {
          const badge = input.parentElement.querySelector('.translit-badge');
          if (badge) badge.style.transform = 'scale(1.2)';
          
          const converted = await this.transliterateWord(lastWord);
          
          if (badge) badge.style.transform = 'scale(1)';
          
          if (converted && converted !== lastWord) {
            const startPos = lastSpace + 1;
            const endPos = pos - 1;
            const newValue = val.substring(0, startPos) + converted + val.substring(endPos);
            
            input.value = newValue;
            
            const diff = converted.length - lastWord.length;
            input.setSelectionRange(pos + diff, pos + diff);
            
            if (onConvert) onConvert(converted);
          }
        }
      }
    };

    input.addEventListener('input', handleInput);
    this.activeInputs.set(input, handleInput);
    
    this.addIndicator(input);
  },

  async transliterateWord(word) {
    try {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=ta-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data[0] === 'SUCCESS' && data[1][0][1][0]) {
        return data[1][0][1][0];
      }
    } catch (err) {
      console.error('[Transliteration] Error:', err);
    }
    return word;
  },

  addIndicator(input) {
    const parent = input.parentElement;
    if (!parent) return;

    const group = input.closest('.form-group') || parent;
    const label = group.querySelector('label');
    
    if (!label || group.querySelector('.translit-badge')) return;

    if (!label.querySelector('.translit-label-wrapper')) {
      const wrapper = document.createElement('span');
      wrapper.className = 'translit-label-wrapper';
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '4px';
      while (label.firstChild) wrapper.appendChild(label.firstChild);
      label.appendChild(wrapper);
    }

    label.style.display = 'flex';
    label.style.justifyContent = 'space-between';
    label.style.alignItems = 'center';
    label.style.width = '100%';

    const badge = document.createElement('div');
    badge.className = 'translit-badge';
    badge.title = 'தமிழ் ஒலிபெயர்ப்பு / Tamil Transliteration';
    
    Object.assign(badge.style, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      padding: '2px 6px',
      borderRadius: '20px',
      background: this.isEnabled ? 'rgba(103, 58, 183, 0.1)' : '#f3f4f6',
      border: `1px solid ${this.isEnabled ? 'rgba(103, 58, 183, 0.2)' : '#e5e7eb'}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none',
    });

    badge.innerHTML = `
      <span style="font-size: 10px; font-weight: 800; color: ${this.isEnabled ? 'var(--primary-700, #512da8)' : '#9ca3af'}; margin-left: 2px;">தமிழ்</span>
      <div class="translit-switch" style="width: 28px; height: 16px; background: ${this.isEnabled ? 'var(--primary-500, #673ab7)' : '#d1d5db'}; border-radius: 10px; position: relative; transition: all 0.3s ease;">
        <div class="translit-knob" style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${this.isEnabled ? '14px' : '2px'}; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
      </div>
    `;

    badge.onclick = (e) => {
      e.stopPropagation();
      this.isEnabled = !this.isEnabled;
      this.updateBadges();
      const isTa = SAC_COMMON.currentLang === 'ta';
      SAC_Toast.info('Smart Tamil', isTa ? (this.isEnabled ? 'தமிழ் ஒலிபெயர்ப்பு இயக்கப்பட்டது' : 'தமிழ் முடக்கப்பட்டது') : (this.isEnabled ? 'Enabled' : 'Disabled'));
    };

    label.appendChild(badge);
  },

  updateBadges() {
    const badges = document.querySelectorAll('.translit-badge');
    badges.forEach(badge => {
      const switchEl = badge.querySelector('.translit-switch');
      const knobEl = badge.querySelector('.translit-knob');
      const textEl = badge.querySelector('span');
      
      if (this.isEnabled) {
        badge.style.background = 'rgba(103, 58, 183, 0.1)';
        badge.style.border = '1px solid rgba(103, 58, 183, 0.2)';
        if (switchEl) switchEl.style.background = 'var(--primary-500, #673ab7)';
        if (knobEl) knobEl.style.left = '14px';
        if (textEl) textEl.style.color = 'var(--primary-700, #512da8)';
      } else {
        badge.style.background = '#f3f4f6';
        badge.style.border = '1px solid #e5e7eb';
        if (switchEl) switchEl.style.background = '#d1d5db';
        if (knobEl) knobEl.style.left = '2px';
        if (textEl) textEl.style.color = '#9ca3af';
      }
    });
  },
  
  toggle(state) {
    this.isEnabled = state !== undefined ? state : !this.isEnabled;
    this.updateBadges();
  }
};


/**
 * Voice Input Service
 */
const VoiceInput = {
  recognition: null,
  isRecording: false,
  activeInputId: null,
  currentLang: 'ta-IN',
  isSwitchingLang: false,
  persistentFinalTranscript: '',
  _silenceTimer: null,

  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  init() {
    if (this.recognition) return;
    if (!this.isSupported()) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  },

  _setupHandlers(mode = 'normal', onInterim = null) {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      if (mode === 'ai') {
        if (this._silenceTimer) clearTimeout(this._silenceTimer);
        this._silenceTimer = setTimeout(() => {
          if (this.isRecording) this.stop();
        }, 5000);
      }
    };

    this.recognition.onresult = (event) => {
      if (mode === 'ai') {
        if (this._silenceTimer) clearTimeout(this._silenceTimer);
        this._silenceTimer = setTimeout(() => {
          if (this.isRecording) this.stop();
        }, 3000);
      }

      let currentSessionText = '';
      for (let i = 0; i < event.results.length; ++i) {
        let t = event.results[i][0].transcript;
        if (currentSessionText && t.toLowerCase().startsWith(currentSessionText.toLowerCase())) {
          currentSessionText = t;
        } else {
          currentSessionText += (currentSessionText && !currentSessionText.endsWith(' ') && !t.startsWith(' ') ? ' ' : '') + t;
        }
      }

      this.currentSessionFinalText = currentSessionText;
      const fullText = (this.persistentFinalTranscript + currentSessionText).trim();

      if (mode === 'ai') {
        if (onInterim) onInterim(fullText);
      } else {
        const inputEl = document.getElementById(this.activeInputId);
        if (inputEl) {
          inputEl.value = fullText;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };

    this.recognition.onerror = (event) => {
      if (this._silenceTimer) clearTimeout(this._silenceTimer);
      if (event.error === 'not-allowed') {
        SAC_Toast.error('Error', 'Microphone access denied');
      }
      this.stop();
    };

    this.recognition.onend = () => {
      if (this._silenceTimer) clearTimeout(this._silenceTimer);
      if (this.currentSessionFinalText) {
        this.persistentFinalTranscript += this.currentSessionFinalText + ' ';
        this.currentSessionFinalText = '';
      }

      const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
      
      if (!isMobile && this.isRecording && this.activeInputId && !this.isSwitchingLang && mode !== 'ai') {
        try { this.recognition.start(); } catch (e) { this.stop(); }
      } else if (!this.isSwitchingLang) {
        const finalResult = this.persistentFinalTranscript.trim();
        const wasAI = mode === 'ai';
        this.stop();
        if (wasAI && this._currentOnComplete) {
          const cb = this._currentOnComplete;
          this._currentOnComplete = null;
          cb(finalResult);
        }
      }
    };
  },

  start(inputId) {
    if (!this.isSupported()) return;
    this.init();

    if (this.isRecording && this.activeInputId === inputId) {
      this.stop();
      return;
    }

    if (this.isRecording) {
      this.isSwitchingLang = true;
      try { this.recognition.stop(); } catch(e){}
    }

    const inputEl = document.getElementById(inputId);
    this.persistentFinalTranscript = inputEl ? inputEl.value : '';
    if (this.persistentFinalTranscript && !this.persistentFinalTranscript.endsWith(' ')) {
      this.persistentFinalTranscript += ' ';
    }
    
    // Sync manual edits back to persistent transcript
    if (!this._inputListeners) this._inputListeners = {};
    if (!this._inputListeners[inputId]) {
        this._inputListeners[inputId] = (e) => {
            if (!this.currentSessionFinalText && this.activeInputId === inputId) {
                this.persistentFinalTranscript = e.target.value;
                if (this.persistentFinalTranscript && !this.persistentFinalTranscript.endsWith(' ')) {
                    this.persistentFinalTranscript += ' ';
                }
            }
        };
        inputEl.addEventListener('input', this._inputListeners[inputId]);
    }
    
    this.activeInputId = inputId;
    this.currentSessionFinalText = '';
    this.isRecording = true;
    this.isSwitchingLang = false;

    this._setupHandlers('normal');

    try {
      this.recognition.continuous = true;
      this.recognition.lang = this.currentLang;
      this.recognition.start();
      this._updateAllButtons();
      SAC_Toast.info('Voice Input', this.currentLang === 'ta-IN' ? 'தமிழில் பேசுங்கள்...' : 'Speak now...');
    } catch (err) {
      this._updateAllButtons();
    }
  },

  startAIAssistant(onComplete, onInterim) {
    if (!this.isSupported()) return;
    this.init();

    if (this.isRecording) {
      this.isSwitchingLang = true;
      try { this.recognition.stop(); } catch(e){}
    }

    this.activeInputId = 'ai-assistant';
    this.persistentFinalTranscript = '';
    this.currentSessionFinalText = '';
    this.isRecording = true;
    this.isSwitchingLang = false;
    this.currentLang = 'ta-IN'; 
    this._currentOnComplete = onComplete;

    this._setupHandlers('ai', onInterim);

    try {
      this.recognition.continuous = true;
      this.recognition.lang = this.currentLang;
      this.recognition.start();
      this._updateAllButtons();
    } catch (e) {
      console.error(e);
    }
  },

  stop() {
    if (this._silenceTimer) clearTimeout(this._silenceTimer);
    const wasAI = this.activeInputId === 'ai-assistant';
    this.isRecording = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    if (wasAI) {
      const overlay = document.getElementById('ai-assistant-overlay');
      if (overlay) overlay.style.display = 'none';
    }
    this.activeInputId = null;
    this._updateAllButtons();
  },

  clearInput(inputId) {
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },

  clearAITranscript() {
    this.persistentFinalTranscript = '';
    this.currentSessionFinalText = '';
    if (this.isRecording) {
      this.isSwitchingLang = true;
      try { this.recognition.stop(); } catch(e) {}
      setTimeout(() => {
        this.isSwitchingLang = false;
        try { this.recognition.start(); } catch(e) { this.isRecording = false; }
      }, 300);
    }
  },

  async toggleLang(event) {
    event.stopPropagation();
    this.currentLang = this.currentLang === 'en-IN' ? 'ta-IN' : 'en-IN';
    const isTa = this.currentLang === 'ta-IN';
    const langLabel = isTa ? 'TA' : 'EN';

    document.querySelectorAll('.voice-lang-btn').forEach(btn => {
      btn.innerText = langLabel;
    });

    if (this.isRecording && this.recognition) {
      try {
        this.isSwitchingLang = true;
        this.recognition.stop();
        setTimeout(() => {
          this.recognition.lang = this.currentLang;
          this.recognition.start();
          SAC_Toast.info('Language Switched', isTa ? 'இப்போது தமிழில் பேசுங்கள்' : 'Speak now in English');
        }, 300);
      } catch(e) {
        this.isSwitchingLang = false;
      }
    } else {
      SAC_Toast.info('Language Switched', isTa ? 'தமிழ் (Tamil)' : 'English');
    }
  },

  _updateAllButtons() {
    const micIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
    const stopIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>`;

    document.querySelectorAll('.voice-btn').forEach(btn => {
      const forInput = btn.getAttribute('data-for');
      const isActive = this.isRecording && this.activeInputId === forInput;
      btn.classList.toggle('recording', isActive);
      btn.innerHTML = isActive ? stopIcon : micIcon;
      if (isActive) {
        btn.style.color = '#ef4444';
      } else {
        btn.style.color = 'inherit';
      }
    });
  },

  renderButtons(inputId) {
    if (!this.isSupported()) return '';
    const micIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
    
    if (!this.currentLang) this.currentLang = 'ta-IN';
    const isTa = this.currentLang === 'ta-IN';
    const langLabel = isTa ? 'TA' : 'EN';
    
    return `
      <div class="voice-btn-group" style="display:flex; align-items:center; gap:2px; padding:2px; background:var(--bg-primary, #f9fafb); border-radius: 20px; border:1px solid var(--border-light, #e5e7eb); box-shadow: 0 1px 2px rgba(0,0,0,0.05); position: absolute; right: 8px; top: 8px; z-index: 10;">
        <button type="button" class="voice-lang-btn" onclick="VoiceInput.toggleLang(event)" 
          style="font-size:10px; font-weight:800; border:none; background:none; cursor:pointer; padding:4px 6px; color:var(--primary-700, #512da8); border-right:1px solid var(--border-light, #e5e7eb);">${langLabel}</button>
        <button type="button" class="voice-btn" data-for="${inputId}" 
          onclick="VoiceInput.start('${inputId}')" 
          style="width:26px; height:26px; margin:0 2px; display:flex; align-items:center; justify-content:center; background:none; border:none; cursor:pointer; transition:color 0.2s;">${micIcon}</button>
        <button type="button" class="voice-clear-btn" 
          onclick="VoiceInput.clearInput('${inputId}')" 
          style="width:24px; height:24px; margin-right:2px; display:flex; align-items:center; justify-content:center; background:none; border:none; cursor:pointer; font-size:12px; color:#6b7280;">✕</button>
      </div>`;
  }
};


/**
 * Prayer AI Service
 */
const PrayerAIService = {
  async parsePrayerVoice(text) {
    let apiKey = localStorage.getItem('sac_local_api_key');
    if (!apiKey && window.SAC_DATABASE) {
      try {
        const settings = await window.SAC_DATABASE.get("settings");
        if (settings && settings.aiApiKey) apiKey = settings.aiApiKey;
      } catch (e) { console.warn("Failed to fetch settings for AI API Key"); }
    }
    
    if (!apiKey) {
      apiKey = window.prompt("AI API Key is missing.\n\nPlease paste your Gemini API Key here to continue:");
      if (!apiKey) {
        SAC_Toast.error("API Key Missing", "Please configure the AI API Key in the Admin portal settings.");
        throw new Error('API Key missing.');
      }
      
      // Save it locally in the browser so it persists across refreshes
      // without needing Admin database write permissions
      localStorage.setItem('sac_local_api_key', apiKey);
      SAC_Toast.success("API Key Saved", "Your API key has been saved locally for this browser!");
    }
    
    const isTa = window.SAC_COMMON ? window.SAC_COMMON.currentLang === 'ta' : true;
    const langInstruction = isTa ? "Translate the message to Tamil if it is in English, otherwise keep as Tamil." : "Translate the message to English if it is in Tamil, otherwise keep as English.";

    const prompt = `Analyze this voice input: "${text}"
Extract the details into a strict JSON object with these exact keys:
- name (string, user's name, empty string if none mentioned)
- email (string, user's email, infer if present, otherwise empty string)
- message (string, the main prayer intention or feedback request. ${langInstruction})
Return ONLY the JSON object, nothing else.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          response_mime_type: "application/json",
          temperature: 0.1
        }
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || `API Error ${response.status}`);
    }
    
    const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      throw new Error('AI returned an empty or blocked response.');
    }
    
    try {
      const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e) {
      throw new Error('Failed to parse AI response into JSON format.');
    }
  },

  async startAssistant() {
    const overlay = document.getElementById('ai-assistant-overlay');
    const processing = document.getElementById('ai-processing-overlay');
    const liveText = document.getElementById('ai-live-text');

    if (overlay.style.display === 'flex' || processing.style.display === 'flex') {
      return;
    }

    liveText.textContent = 'Listening...';
    overlay.style.display = 'flex';
    
    VoiceInput.startAIAssistant(async (text) => {
      overlay.style.display = 'none';
      if (!text || text.trim().length < 3) return;

      processing.style.display = 'flex';

      try {
        const result = await this.parsePrayerVoice(text);
        processing.style.display = 'none';

        if (result.name) {
          const el = document.getElementById('form-name');
          if (el) { el.value = result.name; this._applyMagicEffect(el); }
        }
        if (result.email) {
          const el = document.getElementById('form-email');
          if (el) { el.value = result.email; this._applyMagicEffect(el); }
        }
        if (result.message) {
          const el = document.getElementById('form-message');
          if (el) { el.value = result.message; this._applyMagicEffect(el); }
        }
        
        const isTa = window.SAC_COMMON ? window.SAC_COMMON.currentLang === 'ta' : true;
        SAC_Toast.info('AI Assistant', isTa ? 'விவரங்கள் தானாகவே நிரப்பப்பட்டன' : 'Form details filled automatically.');
      } catch (err) {
        console.error('[PrayerAI] Parse error:', err);
        SAC_Toast.error('AI Processing Failed', err.message);
        processing.style.display = 'none';
      }
    }, (interim) => {
      if (interim === null) {
        overlay.style.display = 'none';
      } else {
        liveText.textContent = interim;
      }
    });
  },

  _applyMagicEffect(el) {
    if (!el) return;
    el.style.setProperty('transition', 'all 0.5s', 'important');
    el.style.setProperty('box-shadow', '0 0 15px var(--primary-500)', 'important');
    el.style.setProperty('border-color', 'var(--primary-500)', 'important');
    el.style.setProperty('background-color', 'var(--primary-50)', 'important');
    
    setTimeout(() => {
      el.style.removeProperty('box-shadow');
      el.style.removeProperty('border-color');
      el.style.removeProperty('background-color');
      el.style.removeProperty('transition');
    }, 2000);
  }
};
