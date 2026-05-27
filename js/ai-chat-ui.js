/* AI Chat Modal UI Logic */

window.SAC_AI_UI = {
  isMuted: true, // Default to true so it doesn't auto-speak unless toggled
  lang: 'TA', // Default to Tamil
  voiceModeActive: false,

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

    // If we are on the dedicated Bible page, inject into the panel instead of as a modal
    const embedPanel = document.getElementById('bible-ai-panel');
    
    if (embedPanel) {
      if (document.getElementById('sac-ai-chat-container')) return;
      const html = `
        <div id="sac-ai-chat-container" class="embedded-mode" style="height:100%; display:flex; flex-direction:column; position:relative;">
          
          <div class="sac-ai-body" id="sac-ai-body">
            <div class="sac-msg ai">
              <p data-i18n="ai.welcome">வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?</p>
            </div>
            <div class="sac-typing-indicator" id="sac-ai-typing">
              <div class="sac-typing-dot"></div><div class="sac-typing-dot"></div><div class="sac-typing-dot"></div>
            </div>
          </div>
          <div class="sac-ai-footer">
            <button class="sac-ai-action-btn sac-btn-mic" id="sac-ai-mic-btn" onclick="SAC_AI_UI.toggleMic()" title="Voice to Text">
              <span class="material-icons">mic</span>
            </button>
            <div class="sac-ai-input-wrap">
              <button class="sac-ai-lang-btn" id="sac-lang-toggle-btn" onclick="SAC_AI_UI.toggleLanguage()">TA</button>
              <textarea class="sac-ai-textarea" id="sac-ai-input" placeholder="ஏதாவது கேளுங்கள்..." rows="1" oninput="SAC_AI_UI.autoResize(this)" onkeydown="SAC_AI_UI.handleKey(event)"></textarea>
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
                <img src="images/anthony.jpg" alt="SAC AI" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
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
            <div class="sac-msg ai">
              <p data-i18n="ai.welcome">வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?</p>
            </div>
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
              <button class="sac-ai-lang-btn" id="sac-lang-toggle-btn" onclick="SAC_AI_UI.toggleLanguage()">TA</button>
              <textarea class="sac-ai-textarea" id="sac-ai-input" placeholder="ஏதாவது கேளுங்கள்..." rows="1" oninput="SAC_AI_UI.autoResize(this)" onkeydown="SAC_AI_UI.handleKey(event)"></textarea>
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
      this.appendMessage('ai', `**Error:** ${err}`);
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
      btns.forEach(btn => btn.innerText = this.lang);
      
      const inputEl = document.getElementById('sac-ai-input');
      if (inputEl) {
          inputEl.placeholder = this.lang === 'TA' ? "ஏதாவது கேளுங்கள்..." : "Ask a question...";
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

  handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  },

  async sendMessage(overrideText = null) {
    const inputEl = document.getElementById('sac-ai-input');
    const text = overrideText || inputEl.value.trim();
    if (!text) {
        this.showToast(this.lang === 'TA' ? "தயவுசெய்து ஒரு கேள்வியை உள்ளிடவும்..." : "Please enter a question...");
        return;
    }

    // Stop speaking if user types something new
    if (window.SAC_AI) {
        SAC_AI.stopSpeaking();
        const orb = document.getElementById('voice-orb');
        if (orb) orb.classList.remove('speaking');
    }

    // Clear input
    inputEl.value = '';
    inputEl.style.height = 'auto';

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
        // If the error wasn't already caught and displayed by onError inside askGemini, display it here
        this.hideTyping();
        // Prevent duplicate error messages
        const body = document.getElementById('sac-ai-body');
        const lastMsg = body.lastElementChild;
        if (lastMsg && !lastMsg.innerText.includes('Error:')) {
            this.appendMessage('ai', `**Error:** ${e.message || "Something went wrong."}`);
        }
      }
    } else {
      this.hideTyping();
      this.appendMessage('ai', 'AI Service not loaded.');
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
