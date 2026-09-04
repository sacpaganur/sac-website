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
        }, 10000);
      }
    };

    this.recognition.onresult = (event) => {
      if (mode === 'ai') {
        if (this._silenceTimer) clearTimeout(this._silenceTimer);
        this._silenceTimer = setTimeout(() => {
          if (this.isRecording) this.stop();
        }, 60000);
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
        const targetInputId = this.activeInputId;
        this.stop();
        if (wasAI && this._currentOnComplete) {
          const cb = this._currentOnComplete;
          this._currentOnComplete = null;
          cb(finalResult);
        } else if (!wasAI && targetInputId) {
          const inputEl = document.getElementById(targetInputId);
          if (inputEl && (inputEl.type === 'email' || targetInputId.includes('email'))) {
            const parsedEmail = PrayerAIService._extractEmailOnly(finalResult);
            if (parsedEmail) {
              inputEl.value = parsedEmail;
              inputEl.dispatchEvent(new Event('input', { bubbles: true }));
              inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
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
const commonTamilNamesToEnglish = {
  'ஜோசப்': 'joseph',
  'அந்தோணி': 'anthony',
  'அந்தோனி': 'antony',
  'அந்தோணிசாமி': 'anthonysamy',
  'அந்தோனிசாமி': 'anthonysamy',
  'மைக்கேல்': 'michael',
  'மேரி': 'mary',
  'மரியா': 'maria',
  'பீட்டர்': 'peter',
  'பேட்டரி': 'peter',
  'ஜான்': 'john',
  'பால்': 'paul',
  'தாமஸ்': 'thomas',
  'அருண்': 'arun',
  'பிரான்சிஸ்': 'francis',
  'லூர்து': 'lourdu',
  'சேவியர்': 'xavier',
  'அல்போன்ஸ்': 'alphonse',
  'செபஸ்தியான்': 'sebastian',
  'இஞ்ஞாசி': 'ignatius',
  'ஆரோக்கியம்': 'arokkiyam',
  'ஜெகன்': 'jegan',
  'ஸ்டீபன்': 'stephen',
  'டேவிட்': 'david',
  'வின்சென்ட்': 'vincent',
  'ஆக்னஸ்': 'agnes',
  'ரோஸ்': 'rose',
  'தெரசா': 'theresa',
  'சார்லஸ்': 'charles',
  'ராபர்ட்': 'robert',
  'ரிச்சர்ட்': 'richard',
  'ஜேம்ஸ்': 'james',
  'ஆண்டனி': 'antony',
  'மரியதாஸ்': 'mariyadass',
  'ஆரோக்கியசாமி': 'arokkiyasamy',
  'சூசை': 'soosai',
  'செயாண்ட': 'st',
  'செயிண்ட்': 'st',
  'செயின்ட்': 'st',
  'செயின்': 'st',
  'சகாயராஜ்': 'sahayaraj',
  'சகாயராசு': 'sahayaraj',
  'சகாயமேரி': 'sahayamary',
  'அந்தோணிராஜ்': 'anthonyraj',
  'செல்வராஜ்': 'selvaraj',
  'ஆரோக்கியராஜ்': 'arokkiyaraj',
  'குமார்': 'kumar',
  'ராஜ்': 'raj',
  'ராஜா': 'raja'
};

function transliterateTamilToEnglish(text) {
  if (!text) return "";
  let s = text.trim();
  
  const words = s.split(/[\s._-]+/);
  const mappedWords = words.map(w => {
    if (commonTamilNamesToEnglish[w]) return commonTamilNamesToEnglish[w];
    
    let out = "";
    const tamilVowels = {
      'அ':'a','ஆ':'aa','இ':'i','ஈ':'ee','உ':'u','ஊ':'oo','எ':'e','ஏ':'ae','ஐ':'ai','ஒ':'o','ஓ':'oa','ஔ':'au','ஃ':'k'
    };
    const tamilConsonants = {
      'க':'k','ங':'ng','ச':'s','ஞ':'gn','ட':'t','ண':'n','த':'th','ந':'n','ப':'p','ம':'m',
      'ய':'y','ர':'r','ல':'l','வ':'v','ழ':'zh','ள':'l','ற':'r','ன':'n','ஜ':'j','ஷ':'sh','ஸ':'s','ஹ':'h','க்ஷ':'ksh'
    };
    const tamilMatras = {
      'ா':'aa','ி':'i','ீ':'ee','ு':'u','ூ':'oo','ெ':'e','ே':'ae','ை':'ai','ொ':'o','ோ':'oa','ௌ':'au'
    };
    
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      const next = w[i + 1];
      if (tamilVowels[ch]) {
        out += tamilVowels[ch];
      } else if (tamilConsonants[ch]) {
        if (next === '்') {
          out += tamilConsonants[ch];
          i++;
        } else if (next && tamilMatras[next]) {
          out += tamilConsonants[ch] + tamilMatras[next];
          i++;
        } else {
          out += tamilConsonants[ch] + 'a';
        }
      } else if (/[a-zA-Z0-9]/.test(ch)) {
        out += ch.toLowerCase();
      }
    }
    return out || w;
  });

  return mappedWords.join('');
}

const PrayerAIService = {
  _extractEmailOnly(text) {
    if (!text) return "";
    const res = this._parseVoiceLocal(text, true);
    return res.email || "";
  },

  async parsePrayerVoice(text) {
    const isTa = window.SAC_COMMON ? window.SAC_COMMON.currentLang === 'ta' : true;
    const localResult = this._parseVoiceLocal(text, isTa);

    // If local parser extracted email, prioritize it for instant response
    if (localResult.email) {
      return localResult;
    }

    let keyCandidates = [];
    if (window.SAC_AI?.apiKey) keyCandidates.push(window.SAC_AI.apiKey);
    const localKey = localStorage.getItem('sac_local_api_key');
    if (localKey) keyCandidates.push(localKey);

    if (typeof SAC_DATABASE !== 'undefined') {
      try {
        const settings = await SAC_DATABASE.get("settings");
        if (settings?.aiApiKey) keyCandidates.push(settings.aiApiKey);
      } catch (e) { console.warn("Failed to fetch settings for AI API Key"); }

      if (SAC_DATABASE.defaultData?.settings?.aiApiKey) {
        keyCandidates.push(SAC_DATABASE.defaultData.settings.aiApiKey);
      }
      if (SAC_DATABASE.defaultData?.firebase_config?.apiKey) {
        keyCandidates.push(SAC_DATABASE.defaultData.firebase_config.apiKey);
      }
    }
    keyCandidates = [...new Set(keyCandidates.filter(k => k && k.trim()))];

    if (keyCandidates.length > 0) {
      const langInstruction = isTa 
        ? "Extract devotee name in Tamil, valid email address, and spiritual prayer intention in clean Tamil." 
        : "Extract devotee name, valid email address, and prayer intention in clean English.";

      const prompt = `You are a Catholic church digital assistant processing voice input for prayer requests: "${text}"
Extract into strict JSON with these keys:
- name: string (devotee's name, e.g. "ஜோசப்")
- email: string (valid email format, converting spoken Tamil like "செயாண்ட சகாயராஜ் அடுத்து ரேட் ஜிமெயில் டாட் காம்" to "stsahayaraj@gmail.com" or "ஜோசப் அட் ஜிமெயில் டாட் காம்" to "joseph@gmail.com")
- message: string (only the spiritual prayer request / petition without name or email phrases. ${langInstruction})
Return ONLY JSON:
{"name": "...", "email": "...", "message": "..."}`;

      const modelsToTry = [
        window.SAC_AI?.modelName,
        'gemini-3.6-flash',
        'gemini-flash-latest',
        'gemini-2.0-flash',
        'gemini-2.5-flash'
      ].filter((m, i, arr) => m && arr.indexOf(m) === i);

      for (const key of keyCandidates) {
        for (const model of modelsToTry) {
          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                  response_mime_type: "application/json",
                  temperature: 0.1
                }
              })
            });

            if (!response.ok) continue;

            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!aiText) continue;

            const cleanText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            return {
              name: parsed.name || localResult.name || "",
              email: parsed.email || localResult.email || "",
              message: parsed.message || localResult.message || text
            };
          } catch (callErr) {
            console.warn(`[PrayerAI] Model ${model} call failed:`, callErr.message);
          }
        }
      }
    }

    return localResult;
  },

  _parseVoiceLocal(text, isTa) {
    if (!text) return { name: "", email: "", message: "" };
    let raw = text.trim();
    let name = "";
    let email = "";
    let message = raw;
    let emailMatchedSegment = "";

    // 1. Extract Name if explicitly spoken
    const nameRegex = /(?:^|[\s.,:;!?-])(?:என்\s*பெயர்|என்\s*பேர்|பெயர்|பேர்|நான்|my\s*name\s*is|name\s*is|i\s*am)\s*[:=]?\s*([a-zA-Z\u0B80-\u0BFF]+)/i;
    const nameMatch = raw.match(nameRegex);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim();
    }

    // 2. Extract Email
    const standardEmailMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    if (standardEmailMatch) {
      email = standardEmailMatch[0].toLowerCase();
      emailMatchedSegment = standardEmailMatch[0];
    } else {
      const prefixRegex = /(?:^|[\s.,:;!?-])(?:(?:என்\s*)?(?:மின்னஞ்சல்(?:\s*முகவரி)?|ஈமெயில்(?:\s*முகவரி)?|மெயில்\s*(?:முகவரி|ஐடி)|ஜிமெயில்\s*ஐடி|email(?:\s*(?:address|id))?|e-mail(?:\s*(?:address|id))?|mail\s*id)|(?:my\s*)?email(?:\s*is|\s*id(?:\s*is)?)?)\s*[:=-]?\s*/gi;
      const atRegex = /(?:\s*(?:அடுத்து\s*தி\s*ரேட்|அடுத்து\s*ரேட்|அடுத்துரேட்|அட்\s*தி\s*ரேட்|அட்\s*ரேட்|அட்ரேட்|அட்ரெட்|அட்\s*த\s*ரேட்|அட்|@|at\s*the\s*rate|at\s*rate|at)\s*)/i;
      const domainRegex = /(?:ஜி\s*மெயில்|ஜிமெயில்|gmail|யாஹூ|யாகூ|yahoo|ஹாட்\s*மெயில்|ஹாட்மெயில்|hotmail|அவுட்\s*லுக்|அவுட்லுக்|outlook|ஐகிளவுட்|icloud|சோஹோ|ஜோஹோ|zoho|[a-zA-Z0-9-]+)/i;
      const dotRegex = /(?:\s*(?:டாட்\s*காம்|டாட்காம்|dot\s*com|\.com|டாட்\s*இன்|டாட்டின்|dot\s*in|\.in|டாட்\s*org|dot\s*org|\.org|டாட்\s*net|dot\s*net|\.net|(?:\s*(?:டாட்|dot|\.)\s*[a-zA-Z\u0B80-\u0BFF]{2,})))?/i;

      let prefixIndex = -1;
      let prefixLength = 0;
      let matchP;
      while ((matchP = prefixRegex.exec(raw)) !== null) {
        prefixIndex = matchP.index;
        prefixLength = matchP[0].length;
      }

      if (prefixIndex !== -1) {
        const afterPrefix = raw.substring(prefixIndex + prefixLength);
        const atMatch = afterPrefix.match(atRegex);
        if (atMatch) {
          const atIndex = atMatch.index;
          const rawUser = afterPrefix.substring(0, atIndex).trim();
          const afterAt = afterPrefix.substring(atIndex + atMatch[0].length).trim();
          
          const domainMatch = afterAt.match(domainRegex);
          if (domainMatch) {
            const domStr = domainMatch[0].toLowerCase();
            let domain = "gmail.com";
            if (domStr.includes("yahoo") || domStr.includes("யாஹூ") || domStr.includes("யாகூ")) domain = "yahoo.com";
            else if (domStr.includes("hotmail") || domStr.includes("ஹாட்")) domain = "hotmail.com";
            else if (domStr.includes("outlook") || domStr.includes("அவுட்")) domain = "outlook.com";
            else if (domStr.includes("zoho") || domStr.includes("சோஹோ")) domain = "zoho.com";
            else if (domStr.includes("icloud") || domStr.includes("ஐகிளவுட்")) domain = "icloud.com";

            const afterDom = afterAt.substring(domainMatch.index + domainMatch[0].length);
            const dotMatch = afterDom.match(dotRegex);
            if (dotMatch && dotMatch[0]) {
              const dotStr = dotMatch[0].toLowerCase();
              if (dotStr.includes(".in") || dotStr.includes("இன்")) {
                domain = domain.replace(/\.com$/, '.in');
              } else if (dotStr.includes(".org") || dotStr.includes("org")) {
                domain = domain.replace(/\.com$/, '.org');
              }
            }

            let engUser = transliterateTamilToEnglish(rawUser);
            engUser = engUser.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
            if (!engUser && name) {
              engUser = transliterateTamilToEnglish(name).replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
            }
            if (!engUser) engUser = "devotee";

            email = `${engUser}@${domain}`;
            
            const fullEndIndex = prefixIndex + prefixLength + atIndex + atMatch[0].length + domainMatch.index + domainMatch[0].length + (dotMatch ? dotMatch[0].length : 0);
            emailMatchedSegment = raw.substring(prefixIndex, fullEndIndex);
          }
        }
      } else {
        const atMatch = raw.match(atRegex);
        if (atMatch) {
          const atIndex = atMatch.index;
          const beforeAt = raw.substring(0, atIndex).trim();
          const tokens = beforeAt.split(/\s+/);
          const userCandidate = tokens.slice(-2).join(' ');
          const afterAt = raw.substring(atIndex + atMatch[0].length).trim();
          const domainMatch = afterAt.match(domainRegex);
          if (domainMatch) {
            let domain = "gmail.com";
            const domStr = domainMatch[0].toLowerCase();
            if (domStr.includes("yahoo") || domStr.includes("யாஹூ")) domain = "yahoo.com";
            else if (domStr.includes("hotmail") || domStr.includes("ஹாட்")) domain = "hotmail.com";
            else if (domStr.includes("outlook") || domStr.includes("அவுட்")) domain = "outlook.com";

            const afterDom = afterAt.substring(domainMatch.index + domainMatch[0].length);
            const dotMatch = afterDom.match(dotRegex);
            if (dotMatch && dotMatch[0]) {
              const dotStr = dotMatch[0].toLowerCase();
              if (dotStr.includes(".in") || dotStr.includes("இன்")) {
                domain = domain.replace(/\.com$/, '.in');
              } else if (dotStr.includes(".org") || dotStr.includes("org")) {
                domain = domain.replace(/\.com$/, '.org');
              }
            }

            let engUser = transliterateTamilToEnglish(userCandidate).replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
            if (engUser) {
              email = `${engUser}@${domain}`;
              const tokenStartIndex = beforeAt.lastIndexOf(userCandidate);
              const fullEndIndex = atIndex + atMatch[0].length + domainMatch.index + domainMatch[0].length + (dotMatch ? dotMatch[0].length : 0);
              emailMatchedSegment = raw.substring(tokenStartIndex, fullEndIndex);
            }
          }
        }
      }
    }

    // 3. Clean Message
    if (emailMatchedSegment) {
      message = message.replace(emailMatchedSegment, ' ');
    }
    message = message.replace(/(?:^|[\s.,:;!?-])(?:(?:என்\s*)?(?:மின்னஞ்சல்(?:\s*முகவரி)?|ஈமெயில்(?:\s*முகவரி)?|மெயில்\s*(?:முகவரி|ஐடி)|ஜிமெயில்\s*ஐடி|email(?:\s*(?:address|id))?|e-mail(?:\s*(?:address|id))?|mail\s*id)|(?:my\s*)?email(?:\s*is|\s*id(?:\s*is)?)?)\s*[:=-]?\s*$/i, '');
    message = message.replace(/(?:டாட்\s*காம்|டாட்காம்|dot\s*com|\.com|டாட்\s*இன்|dot\s*in|\.in)\s*$/i, '');
    message = message.replace(/(?:^|[\s.,:;!?-])(?:என்\s*பெயர்|என்\s*பேர்|பெயர்|பேர்|நான்|my\s*name\s*is|name\s*is|i\s*am)\s*[:=]?\s*[a-zA-Z\u0B80-\u0BFF]+[,\.\s]*/i, ' ');
    message = message.replace(/\s+/g, ' ').replace(/^[,.\s-]+|[,.\s-]+$/g, '').trim();

    if (!message && !email && !name) {
      message = raw;
    }

    return { name, email, message };
  },

  async startAssistant() {
    const overlay = document.getElementById('ai-assistant-overlay');
    const processing = document.getElementById('ai-processing-overlay');
    const liveText = document.getElementById('ai-live-text');

    if (overlay.style.display === 'flex' || processing.style.display === 'flex') {
      return;
    }

    const isTa = window.SAC_COMMON ? window.SAC_COMMON.currentLang === 'ta' : true;
    liveText.textContent = isTa ? "கேட்கிறது... பேசுங்கள்..." : "Listening... Speak now...";
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
          if (el) { 
            el.value = result.name; 
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            this._applyMagicEffect(el); 
          }
        }
        if (result.email) {
          const el = document.getElementById('form-email');
          if (el) { 
            el.value = result.email; 
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            this._applyMagicEffect(el); 
          }
        }
        if (result.message) {
          const el = document.getElementById('form-message');
          if (el) { 
            el.value = result.message; 
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            this._applyMagicEffect(el); 
          }
        }
        
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
        liveText.scrollTop = liveText.scrollHeight;
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
