/* AI Chat Modal UI Logic */

window.SAC_AI_UI = {
  isMuted: true, // Default to true so it doesn't auto-speak unless toggled
  lang: 'TA', // Default to Tamil
  voiceModeActive: false,
  translitCache: {
    'vanakkam': 'வணக்கம்',
    'vanakam': 'வணக்கம்',
    'halo': 'ஹலோ',
    'hello': 'ஹலோ',
    'hi': 'ஹாய்',
    'thiruppali': 'திருப்பலி',
    'thirupali': 'திருப்பலி',
    'poosai': 'பூசை',
    'poojai': 'பூஜை',
    'neram': 'நேரம்',
    'nerangal': 'நேரங்கள்',
    'kovil': 'கோவில்',
    'aalayam': 'ஆலயம்',
    'alayam': 'ஆலயம்',
    'varalaru': 'வரலாறு',
    'thiruvizha': 'திருவிழா',
    'thiruvila': 'திருவிழா',
    'vizha': 'விழா',
    'peruvizha': 'பெருவிழா',
    'sebham': 'செபம்',
    'sebam': 'செபம்',
    'jebam': 'ஜெபம்',
    'jebamaalai': 'ஜெபமாலை',
    'sebamaalai': 'செபமாலை',
    'mandrattu': 'மன்றாட்டு',
    'manrattu': 'மன்றாட்டு',
    'novena': 'நவநாள்',
    'padua': 'பதுவை',
    'punitha': 'புனித',
    'anthoniyar': 'அந்தோணியார்',
    'anthony': 'அந்தோணியார்',
    'father': 'பங்குத்தந்தை',
    'priest': 'பங்குத்தந்தை',
    'pangu': 'பங்கு',
    'maniyakkarar': 'மணியக்காரர்',
    'maniyakarar': 'மணியக்காரர்',
    'pattaiyadharar': 'பட்டையதாரார்',
    'patron': 'பட்டையதாரார்',
    'thodarbu': 'தொடர்பு',
    'mugavari': 'முகவரி',
    'engae': 'எங்கே',
    'enga': 'எங்கே',
    'engu': 'எங்கு',
    'enna': 'என்ன',
    'eppadi': 'எப்படி',
    'epdi': 'எப்படி',
    'yaaru': 'யார்',
    'yaru': 'யார்',
    'eppo': 'எப்போது',
    'eppa': 'எப்போது',
    'viviliam': 'திருவிவிலியம்',
    'vedhagamam': 'திருவிவிலியம்',
    'pugaippadam': 'புகைப்படம்',
    'padangal': 'படங்கள்',
    'arutsadhanam': 'அருட்சாதனம்',
    'gnanasnanam': 'திருமுழுக்கு',
    'kalyanam': 'திருமணம்',
    'thirumanam': 'திருமணம்',
    'pudhunamai': 'புதுநன்மை',
    'venduthal': 'வேண்டுதல்',
    'kanikkai': 'காணிக்கை',
    'nandri': 'நன்றி',
    'aamen': 'ஆமென்',
    'amen': 'ஆமென்',
    'tamil': 'தமிழ்',
    'english': 'ஆங்கிலம்',
    'inaiyathalam': 'இணையதளம்',
    'valaiyathalam': 'வலைத்தளம்'
  },

  handleChipClick(query) {
    if (!query) return;
    this.sendMessage(query);
  },

  inject() {
    // If voice recognition is not supported on this device/browser (e.g. some mobile browsers or non-secure contexts),
    // hide all microphone and voice conversation overlay controls gracefully.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (!document.getElementById('sac-ai-no-voice-override')) {
        const style = document.createElement('style');
        style.id = 'sac-ai-no-voice-override';
        style.textContent = `
          #sac-ai-mic-btn, .sac-ai-voice-btn, #sac-ai-voice-overlay {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Shared HTML for voice overlay
    const voiceOverlayHTML = `
      <div class="sac-ai-voice-overlay" id="sac-ai-voice-overlay">
        <h2 class="voice-overlay-title">SAC AI குரல் உரையாடல்</h2>
        <div class="voice-orb-container">
          <div class="voice-orb" id="voice-orb"></div>
        </div>
        <p class="voice-status-text" id="voice-status-text">கேட்கிறது...</p>
        <div class="voice-controls-row">
           <button class="voice-ctrl-btn" onclick="SAC_AI_UI.toggleVoiceOverlayMic()"><span class="material-icons" id="voice-overlay-mic-icon">mic</span></button>
           <button class="voice-ctrl-btn hangup" onclick="SAC_AI_UI.closeVoice()"><span class="material-icons">call_end</span></button>
           <button class="voice-ctrl-btn" onclick="SAC_AI_UI.toggleMute()"><span class="material-icons" id="voice-mute-icon">volume_off</span></button>
        </div>
      </div>
    `;

    // Welcome Card HTML covering complete website from Home to Contact
    const welcomeCardHTML = `
      <div class="sac-msg ai" id="sac-welcome-msg">
        <div class="sac-welcome-content">
          <p><strong>வணக்கம்! புனித அந்தோணியார் ஆலயத்தின் மெய்நிகர் AI வழிகாட்டிக்கு (SAC AI) உங்களை அன்போடு வரவேற்கிறோம். 🙏✨</strong></p>
          <p style="margin:4px 0 8px 0; font-size:0.88rem; color:var(--text-secondary);">முகப்பு முதல் தொடர்பு வரை நமது இணையதளத்தின் அனைத்து விவரங்களுக்கும் உதவ நான் தயாராக உள்ளேன். நீங்கள் விரும்பும் தலைப்பைத் தேர்ந்தெடுக்கலாம் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யலாம்:</p>
          <div class="sac-ai-quick-chips" id="sac-quick-chips">
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('திருப்பலி நேரங்கள்')">🏠 திருப்பலி நேரங்கள்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('அருட்சாதனங்கள்')">⛪ அருட்சாதனங்கள்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('ஆலய வரலாறு')">📜 ஆலய வரலாறு</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('ஆண்டு பெருவிழா')">📅 ஆண்டு பெருவிழா</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('கத்தோலிக்க செபங்கள்')">🕊️ செபங்கள் & நவநாள்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('தூய ஜெபமாலை')">📿 தூய ஜெபமாலை</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('திருவிவிலியம்')">📖 திருவிவிலியம்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('புகைப்படங்கள்')">🖼️ புகைப்படங்கள்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('செப வேண்டுதல் பதிவு')">✍️ செப வேண்டுதல்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('பங்குத்தந்தை & தொடர்புகள்')">📞 தொடர்புகள்</button>
            <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('முழு இணையதள வழிகாட்டி')">🌐 இணையதள வழிகாட்டி</button>
          </div>
        </div>
      </div>
    `;

    // If we are on the dedicated Bible page, inject into the panel instead of as a modal
    const embedPanel = document.getElementById('bible-ai-panel');
    
    if (embedPanel) {
      if (document.getElementById('sac-ai-chat-container')) return;
      const html = `
        <div id="sac-ai-chat-container" class="embedded-mode" style="height:100%; display:flex; flex-direction:column; position:relative;">
          
          <div class="sac-ai-body" id="sac-ai-body">
            ${welcomeCardHTML}
            <div class="sac-typing-indicator" id="sac-ai-typing">
              <div class="sac-typing-dot"></div><div class="sac-typing-dot"></div><div class="sac-typing-dot"></div>
            </div>
          </div>
          <div class="sac-ai-footer">
            <button class="sac-ai-action-btn sac-btn-mic" id="sac-ai-mic-btn" onclick="SAC_AI_UI.toggleMic()" title="Voice to Text">
              <span class="material-icons">mic</span>
            </button>
            <div class="sac-ai-input-wrap">
              <button class="sac-ai-lang-btn" id="sac-lang-toggle-btn" onclick="SAC_AI_UI.toggleLanguage()" title="தமிழ் ஒலிபெயர்ப்பு ஆன் (TA): Type in English, press Space for Tamil">TA</button>
              <textarea class="sac-ai-textarea" id="sac-ai-input" placeholder="ஏதாவது கேளுங்கள்... (எ.கா: Vanakkam)" rows="1" oninput="SAC_AI_UI.handleInput(event, this)" onkeydown="SAC_AI_UI.handleKey(event)"></textarea>
              <button class="sac-ai-action-btn sac-btn-send" id="sac-ai-send-btn" onclick="SAC_AI_UI.sendMessage()">
                <span class="material-icons">send</span>
              </button>
            </div>
          </div>
          
          ${voiceOverlayHTML}
        </div>
      `;
      embedPanel.innerHTML = html;
      this._bindEvents();
      // Auto initialize AI on embedded load
      if (window.SAC_AI) SAC_AI.init();
      return;
    }

    // Default: Floating FAB Modal Mode
    if (document.getElementById('sac-ai-chat-container')) return;
    const html = `
      <div id="sac-ai-chat-container">
        <!-- Floating Action Button -->
        <div class="sac-ai-fab" id="sac-ai-fab" onclick="SAC_AI_UI.toggleModal()">
          <span class="material-icons">auto_awesome</span>
        </div>

        <!-- Chat Modal -->
        <div class="sac-ai-modal" id="sac-ai-modal">
          
          <div class="sac-ai-header">
            <div class="sac-ai-title-area">
              <div class="sac-ai-avatar">
                <img src="images/anthony.webp" alt="SAC AI" loading="lazy" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="material-icons" style="display:none;">menu_book</span>
              </div>
              <div>
                <h3 class="sac-ai-title" data-i18n="ai.title">SAC AI</h3>
                <div style="display:flex; align-items:center; gap:4px;">
                  <div class="sac-ai-status-dot"></div>
                  <p class="sac-ai-subtitle" data-i18n="ai.subtitle">ஆன்லைனில்</p>
                </div>
              </div>
            </div>
            <div class="sac-ai-controls">
              <button class="sac-ai-btn sac-ai-voice-btn" onclick="SAC_AI_UI.openVoice()" title="Voice to Voice Conversation">
                <span class="material-icons">record_voice_over</span>
              </button>
              <button class="sac-ai-btn" id="sac-ai-mute-btn" onclick="SAC_AI_UI.toggleMute()" title="குரலை இயக்கு">
                <span class="material-icons">volume_off</span>
              </button>
              <button class="sac-ai-btn" onclick="SAC_AI_UI.toggleModal()" title="Close">
                <span class="material-icons">close</span>
              </button>
            </div>
          </div>

          <div class="sac-ai-body" id="sac-ai-body">
            ${welcomeCardHTML}
            <div class="sac-typing-indicator" id="sac-ai-typing">
              <div class="sac-typing-dot"></div>
              <div class="sac-typing-dot"></div>
              <div class="sac-typing-dot"></div>
            </div>
          </div>

          <div class="sac-ai-footer">
            <button class="sac-ai-action-btn sac-btn-mic" id="sac-ai-mic-btn" onclick="SAC_AI_UI.toggleMic()" title="Voice to Text">
              <span class="material-icons">mic</span>
            </button>
            <div class="sac-ai-input-wrap">
              <button class="sac-ai-lang-btn" id="sac-lang-toggle-btn" onclick="SAC_AI_UI.toggleLanguage()" title="தமிழ் ஒலிபெயர்ப்பு ஆன் (TA): Type in English, press Space for Tamil">TA</button>
              <textarea class="sac-ai-textarea" id="sac-ai-input" placeholder="ஏதாவது கேளுங்கள்... (எ.கா: Vanakkam)" rows="1" oninput="SAC_AI_UI.handleInput(event, this)" onkeydown="SAC_AI_UI.handleKey(event)"></textarea>
              <button class="sac-ai-action-btn sac-btn-send" id="sac-ai-send-btn" onclick="SAC_AI_UI.sendMessage()">
                <span class="material-icons">send</span>
              </button>
            </div>
          </div>
          
          ${voiceOverlayHTML}
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this._bindEvents();

    // Auto translate if common loaded
    if (window.SAC_COMMON && typeof SAC_COMMON.translatePage === 'function') {
      SAC_COMMON.translatePage();
    }
  },

  _bindEvents() {
    if (!window.SAC_AI) return;

    SAC_AI.onStartListening = () => {
      document.getElementById('sac-ai-mic-btn').classList.add('listening');
      const orb = document.getElementById('voice-orb');
      if (orb) {
        orb.classList.add('listening');
        orb.classList.remove('speaking', 'thinking');
        document.getElementById('voice-status-text').innerText = this.lang === 'TA' ? 'கேட்கிறது...' : 'Listening...';
      }
      const overlayMicIcon = document.getElementById('voice-overlay-mic-icon');
      if (overlayMicIcon) overlayMicIcon.textContent = 'mic';
    };

    SAC_AI.onStopListening = () => {
      document.getElementById('sac-ai-mic-btn').classList.remove('listening');
      const orb = document.getElementById('voice-orb');
      if (orb) {
        orb.classList.remove('listening');
        if (!orb.classList.contains('speaking') && !orb.classList.contains('thinking')) {
          document.getElementById('voice-status-text').innerText = '';
        }
      }
      const overlayMicIcon = document.getElementById('voice-overlay-mic-icon');
      if (overlayMicIcon) overlayMicIcon.textContent = 'mic_off';
    };

    SAC_AI.onSpeechResult = (text) => {
      document.getElementById('sac-ai-input').value = text;
      this.sendMessage(text);
    };

    SAC_AI.onAIResponse = (text) => {
      this.hideTyping();
      this.appendMessage('ai', text);
      const orb = document.getElementById('voice-orb');
      if (orb) orb.classList.remove('thinking');
      
      if (!this.isMuted) {
        if (orb) {
          orb.classList.add('speaking');
          document.getElementById('voice-status-text').innerText = this.lang === 'TA' ? 'பேசுகிறது...' : 'Speaking...';
        }
        SAC_AI.speakText(text, this.lang).then(() => {
          if (orb) {
            orb.classList.remove('speaking');
            document.getElementById('voice-status-text').innerText = '';
          }
        });
      }
    };

    SAC_AI.onError = (err) => {
      this.hideTyping();
      const isFriendly = typeof err === 'string' && (err.includes("மன்னிக்கவும்") || err.includes("அன்பான") || err.includes("Dear friend") || err.includes("வரம்பு"));
      const displayMsg = isFriendly ? err : `⚠️ **தகவல்:** ${err}`;
      this.appendMessage('ai', displayMsg);
      document.getElementById('sac-ai-mic-btn').classList.remove('listening');
      const orb = document.getElementById('voice-orb');
      if (orb) orb.classList.remove('listening', 'speaking');
    };
  },

  toggleModal() {
    const modal = document.getElementById('sac-ai-modal');
    const fab = document.getElementById('sac-ai-fab');
    modal.classList.toggle('active');
    
    // Prevent background scrolling when modal is open
    document.body.classList.toggle('ai-modal-open', modal.classList.contains('active'));
    
    if (fab) {
        fab.classList.toggle('active-fab');
        const fabIcon = fab.querySelector('.material-icons');
        if (fabIcon) {
            fabIcon.textContent = modal.classList.contains('active') ? 'close' : 'auto_awesome';
        }
    }
    
    // Auto init AI on first open
    if (modal.classList.contains('active') && window.SAC_AI && !SAC_AI.isInitialized) {
      SAC_AI.init();
    }
    
    // If closing, stop speaking and voice mode
    if (!modal.classList.contains('active')) {
      if (window.SAC_AI) {
        SAC_AI.stopSpeaking();
        SAC_AI.stopListening();
      }
      this.closeVoice();
    }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('sac-ai-mute-btn');
    if (btn) {
        btn.title = this.isMuted 
            ? (this.lang === 'TA' ? "குரலை இயக்கு" : "Turn Voice On") 
            : (this.lang === 'TA' ? "குரலை அணை" : "Turn Voice Off");
    }
    
    const icons = document.querySelectorAll('#sac-ai-mute-btn .material-icons, #voice-mute-icon');
    icons.forEach(icon => {
        icon.textContent = this.isMuted ? 'volume_off' : 'volume_up';
    });
    
    if (this.isMuted && window.SAC_AI) {
      SAC_AI.stopSpeaking();
      const orb = document.getElementById('voice-orb');
      if (orb) {
        orb.classList.remove('speaking');
        document.getElementById('voice-status-text').innerText = '';
      }
    }
  },
  
  toggleLanguage() {
      this.lang = this.lang === 'TA' ? 'EN' : 'TA';
      const btns = document.querySelectorAll('.sac-ai-lang-btn');
      btns.forEach(btn => {
        btn.innerText = this.lang;
        btn.title = this.lang === 'TA' 
          ? "தமிழ் ஒலிபெயர்ப்பு ஆன் (TA): Type in English, press Space for Tamil" 
          : "English Mode (EN): English typing without transliteration";
        if (this.lang === 'TA') {
          btn.classList.remove('en-mode');
        } else {
          btn.classList.add('en-mode');
        }
      });
      
      const inputEl = document.getElementById('sac-ai-input');
      if (inputEl) {
          inputEl.placeholder = this.lang === 'TA' 
            ? "ஏதாவது கேளுங்கள்... (எ.கா: Vanakkam)" 
            : "Ask a question in English...";
      }
      
      const subtitles = document.querySelectorAll('.sac-ai-subtitle');
      subtitles.forEach(el => {
          el.innerText = this.lang === 'TA' ? "ஆன்லைனில்" : "Online";
      });
      
      const voiceTitles = document.querySelectorAll('.voice-overlay-title');
      voiceTitles.forEach(el => {
          el.innerText = this.lang === 'TA' ? "SAC AI குரல் உரையாடல்" : "SAC AI Voice Chat";
      });
      
      const muteBtn = document.getElementById('sac-ai-mute-btn');
      if (muteBtn) {
          muteBtn.title = this.isMuted 
            ? (this.lang === 'TA' ? "குரலை இயக்கு" : "Turn Voice On") 
            : (this.lang === 'TA' ? "குரலை அணை" : "Turn Voice Off");
      }

      const welcomeMsgs = document.querySelectorAll('#sac-welcome-msg');
      welcomeMsgs.forEach(msg => {
        if (this.lang === 'EN') {
          msg.innerHTML = `
            <div class="sac-welcome-content">
              <p><strong>Peace and blessings! Welcome to St. Antony's Church AI Assistant (SAC AI). 🙏✨</strong></p>
              <p style="margin:4px 0 8px 0; font-size:0.88rem; color:var(--text-secondary);">I am here to assist you with all parish and website information from Home to Contact. Tap any topic below or ask any question:</p>
              <div class="sac-ai-quick-chips" id="sac-quick-chips">
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Mass Timings')">🏠 Mass Timings</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Holy Sacraments')">⛪ Sacraments Guide</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Church History')">📜 Parish History</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Annual Feast')">📅 Annual Feast</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Catholic Prayers')">🕊️ Prayers & Novena</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Holy Rosary')">📿 Holy Rosary</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Holy Bible')">📖 Holy Bible</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Photo Gallery')">🖼️ Photo Gallery</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Prayer Request Form')">✍️ Prayer Request</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Priest & Contacts')">📞 Contacts</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('Website Guide')">🌐 Website Guide</button>
              </div>
            </div>
          `;
        } else {
          msg.innerHTML = `
            <div class="sac-welcome-content">
              <p><strong>வணக்கம்! புனித அந்தோணியார் ஆலயத்தின் மெய்நிகர் AI வழிகாட்டிக்கு (SAC AI) உங்களை அன்போடு வரவேற்கிறோம். 🙏✨</strong></p>
              <p style="margin:4px 0 8px 0; font-size:0.88rem; color:var(--text-secondary);">முகப்பு முதல் தொடர்பு வரை நமது இணையதளத்தின் அனைத்து விவரங்களுக்கும் உதவ நான் தயாராக உள்ளேன். நீங்கள் விரும்பும் தலைப்பைத் தேர்ந்தெடுக்கலாம் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யலாம்:</p>
              <div class="sac-ai-quick-chips" id="sac-quick-chips">
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('திருப்பலி நேரங்கள்')">🏠 திருப்பலி நேரங்கள்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('அருட்சாதனங்கள்')">⛪ அருட்சாதனங்கள்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('ஆலய வரலாறு')">📜 ஆலய வரலாறு</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('ஆண்டு பெருவிழா')">📅 ஆண்டு பெருவிழா</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('கத்தோலிக்க செபங்கள்')">🕊️ செபங்கள் & நவநாள்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('தூய ஜெபமாலை')">📿 தூய ஜெபமாலை</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('திருவிவிலியம்')">📖 திருவிவிலியம்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('புகைப்படங்கள்')">🖼️ புகைப்படங்கள்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('செப வேண்டுதல் பதிவு')">✍️ செப வேண்டுதல்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('பங்குத்தந்தை & தொடர்புகள்')">📞 தொடர்புகள்</button>
                <button type="button" class="sac-chip-btn" onclick="SAC_AI_UI.handleChipClick('முழு இணையதள வழிகாட்டி')">🌐 இணையதள வழிகாட்டி</button>
              </div>
            </div>
          `;
        }
      });
  },

  openVoice() {
    if (!window.SAC_AI) return;
    const overlay = document.getElementById('sac-ai-voice-overlay');
    if (overlay) {
        overlay.classList.add('active');
        this.voiceModeActive = true;
        
        // Auto-unmute specifically for voice-to-voice overlay mode
        if (this.isMuted) {
            this.toggleMute();
        }
        
        // Unlock browser TTS with a silent utterance immediately on user click
        if (window.speechSynthesis) {
            const silentUtterance = new SpeechSynthesisUtterance('');
            silentUtterance.volume = 0;
            window.speechSynthesis.speak(silentUtterance);
        }
        
        // Start listening immediately when opening voice overlay
        SAC_AI.startListening(this.lang);
    }
  },

  closeVoice() {
      const overlay = document.getElementById('sac-ai-voice-overlay');
      if (overlay) overlay.classList.remove('active');
      this.voiceModeActive = false;
      if (window.SAC_AI) {
          SAC_AI.stopListening();
          SAC_AI.stopSpeaking();
      }
      const orb = document.getElementById('voice-orb');
      if (orb) orb.classList.remove('listening', 'speaking');
      
      // Auto-mute back when exiting voice-to-voice
      if (!this.isMuted) {
          this.toggleMute();
      }
  },

  toggleMic() {
    if (!window.SAC_AI) return;
    if (SAC_AI.isListening) {
      SAC_AI.stopListening();
    } else {
      SAC_AI.startListening(this.lang);
    }
  },

  toggleVoiceOverlayMic() {
    if (!window.SAC_AI) return;
    if (SAC_AI.isListening) {
      SAC_AI.stopListening();
    } else {
      SAC_AI.startListening(this.lang);
    }
  },

  autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight < 100 ? textarea.scrollHeight : 100) + 'px';
  },

  async transliterateWord(word) {
    if (!word || !/^[a-zA-Z']+$/.test(word)) return word;
    const lower = word.toLowerCase();
    if (this.translitCache[lower]) {
      return this.translitCache[lower];
    }
    try {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=ta-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0] === 'SUCCESS' && data[1]?.[0]?.[1]?.[0]) {
        const converted = data[1][0][1][0];
        this.translitCache[lower] = converted;
        return converted;
      }
    } catch (e) {
      console.warn('[SAC_AI_UI Transliteration Error]:', e);
    }
    return word;
  },

  async transliterateFullText(text) {
    if (!text || this.lang !== 'TA') return text;
    const parts = text.split(/([ \t\n.,?!;:]+)/);
    const converted = await Promise.all(parts.map(async p => {
      if (/^[a-zA-Z']+$/.test(p)) {
        return await this.transliterateWord(p);
      }
      return p;
    }));
    return converted.join('');
  },

  async handleInput(e, textarea) {
    this.autoResize(textarea);
    if (this.lang !== 'TA') return;

    const val = textarea.value;
    const pos = textarea.selectionStart;
    if (pos === null || pos === undefined || pos < 1) return;

    const char = val[pos - 1];
    // Trigger transliteration when word boundary / separator is typed
    if (char === ' ' || char === '\n' || char === '.' || char === ',' || char === '?' || char === '!') {
      const textBefore = val.substring(0, pos - 1);
      const lastSeparator = Math.max(
        textBefore.lastIndexOf(' '),
        textBefore.lastIndexOf('\n'),
        textBefore.lastIndexOf('\t'),
        -1
      );
      const lastWord = textBefore.substring(lastSeparator + 1).trim();

      if (lastWord && /^[a-zA-Z']+$/.test(lastWord)) {
        const langBtn = document.getElementById('sac-lang-toggle-btn');
        if (langBtn) langBtn.style.opacity = '0.5';

        const converted = await this.transliterateWord(lastWord);
        if (langBtn) langBtn.style.opacity = '1';

        if (converted && converted !== lastWord) {
          const currentVal = textarea.value;
          const currentPos = textarea.selectionStart;
          const startPos = lastSeparator + 1;
          const endPos = pos - 1;

          if (currentVal.substring(startPos, endPos) === lastWord) {
            const beforeWord = currentVal.substring(0, startPos);
            const afterWord = currentVal.substring(endPos);
            textarea.value = beforeWord + converted + afterWord;
            const diff = converted.length - lastWord.length;
            const newCursor = currentPos + diff;
            textarea.setSelectionRange(newCursor, newCursor);
            this.autoResize(textarea);
          }
        }
      }
    }
  },

  async handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await this.sendMessage();
    }
  },

  async sendMessage(overrideText = null) {
    const inputEl = document.getElementById('sac-ai-input');
    let text = overrideText || (inputEl ? inputEl.value.trim() : '');
    if (!text) {
        this.showToast(this.lang === 'TA' ? "தயவுசெய்து ஒரு கேள்வியை உள்ளிடவும்..." : "Please enter a question...");
        return;
    }

    // If in TA mode and any untransliterated English remains, convert to Tamil before sending!
    if (this.lang === 'TA' && /[a-zA-Z]/.test(text)) {
      text = await this.transliterateFullText(text);
    }

    // Stop speaking if user types something new
    if (window.SAC_AI) {
        SAC_AI.stopSpeaking();
        const orb = document.getElementById('voice-orb');
        if (orb) orb.classList.remove('speaking');
    }

    // Clear input
    if (inputEl) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
    }

    // Show user msg
    this.appendMessage('user', text);
    this.showTyping();
    
    // Show thinking state in voice overlay
    if (this.voiceModeActive) {
        const orb = document.getElementById('voice-orb');
        if (orb) {
            orb.classList.add('thinking');
            document.getElementById('voice-status-text').innerText = this.lang === 'TA' ? 'சிந்திக்கிறது...' : 'Thinking...';
        }
    }

    if (window.SAC_AI) {
      try {
        await SAC_AI.askGemini(text, this.lang);
      } catch (e) {
        this.hideTyping();
        console.warn("SAC_AI chat notice:", e);
      }
    } else {
      this.hideTyping();
      this.appendMessage('ai', this.lang === 'TA' ? 'AI சேவை தயாராகவில்லை.' : 'AI Service not loaded.');
    }
  },

  appendMessage(role, text) {
    const body = document.getElementById('sac-ai-body');
    const typing = document.getElementById('sac-ai-typing');
    
    // Simple markdown parsing for **bold** and line breaks
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    const div = document.createElement('div');
    div.className = `sac-msg ${role}`;
    div.innerHTML = `<p>${formattedText}</p>`;
    
    body.insertBefore(div, typing);
    this.scrollToBottom();
  },

  showTyping() {
    document.getElementById('sac-ai-typing').style.display = 'flex';
    this.scrollToBottom();
  },

  hideTyping() {
    document.getElementById('sac-ai-typing').style.display = 'none';
  },

  scrollToBottom() {
    const body = document.getElementById('sac-ai-body');
    body.scrollTop = body.scrollHeight;
  },

  showToast(message) {
    // Remove existing toast if any
    const existingToast = document.getElementById('sac-ai-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'sac-ai-toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '100px'; // Position above chat input
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#ef4444'; // Red error
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '30px';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = 'bold';
    toast.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.4)';
    toast.style.zIndex = '999999';
    toast.style.animation = 'msgPop 0.3s ease-out';
    toast.style.whiteSpace = 'nowrap';
    toast.style.pointerEvents = 'none';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};

// Auto inject
function tryInjectAI() {
  if (typeof window === 'undefined' || !document.body) return;
  if (!window.location.href.includes('admin-portal')) {
    SAC_AI_UI.inject();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryInjectAI);
} else {
  tryInjectAI();
}

