/* AI Chat Modal UI Logic */

window.SAC_AI_UI = {
  isMuted: false,

  inject() {
    // If we are on the dedicated Bible page, inject into the panel instead of as a modal
    const embedPanel = document.getElementById('bible-ai-panel');
    
    if (embedPanel) {
      if (document.getElementById('sac-ai-chat-container')) return;
      const html = `
        <div id="sac-ai-chat-container" class="embedded-mode" style="height:100%; display:flex; flex-direction:column;">
          <div class="sac-ai-body" id="sac-ai-body">
            <div class="sac-msg ai">
              <p data-i18n="ai.welcome">Hello! I am your AI Bible Companion. Ask me anything about the scripture or our faith.</p>
            </div>
            <div class="sac-typing-indicator" id="sac-ai-typing">
              <div class="sac-typing-dot"></div><div class="sac-typing-dot"></div><div class="sac-typing-dot"></div>
            </div>
          </div>
          <div class="sac-ai-footer">
            <button class="sac-ai-action-btn sac-btn-mic" id="sac-ai-mic-btn" onclick="SAC_AI_UI.toggleMic()">
              <span class="material-icons">mic</span>
            </button>
            <div class="sac-ai-input-wrap">
              <textarea class="sac-ai-textarea" id="sac-ai-input" placeholder="Ask a question..." rows="1" oninput="SAC_AI_UI.autoResize(this)" onkeydown="SAC_AI_UI.handleKey(event)"></textarea>
            </div>
            <button class="sac-ai-action-btn sac-btn-send" id="sac-ai-send-btn" onclick="SAC_AI_UI.sendMessage()">
              <span class="material-icons">send</span>
            </button>
          </div>
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
                <span class="material-icons">menu_book</span>
              </div>
              <div>
                <h3 class="sac-ai-title" data-i18n="ai.title">Bible AI</h3>
                <p class="sac-ai-subtitle" data-i18n="ai.subtitle">Your Digital Companion</p>
              </div>
            </div>
            <div class="sac-ai-controls">
              <button class="sac-ai-btn" id="sac-ai-mute-btn" onclick="SAC_AI_UI.toggleMute()" title="Toggle Voice">
                <span class="material-icons">volume_up</span>
              </button>
              <button class="sac-ai-btn" onclick="SAC_AI_UI.toggleModal()" title="Close">
                <span class="material-icons">close</span>
              </button>
            </div>
          </div>

          <div class="sac-ai-body" id="sac-ai-body">
            <div class="sac-msg ai">
              <p data-i18n="ai.welcome">Hello! I am your AI Bible Companion. Ask me anything about the scripture or our faith.</p>
            </div>
            <div class="sac-typing-indicator" id="sac-ai-typing">
              <div class="sac-typing-dot"></div>
              <div class="sac-typing-dot"></div>
              <div class="sac-typing-dot"></div>
            </div>
          </div>

          <div class="sac-ai-footer">
            <button class="sac-ai-action-btn sac-btn-mic" id="sac-ai-mic-btn" onclick="SAC_AI_UI.toggleMic()">
              <span class="material-icons">mic</span>
            </button>
            <div class="sac-ai-input-wrap">
              <textarea class="sac-ai-textarea" id="sac-ai-input" placeholder="Ask a question..." rows="1" oninput="SAC_AI_UI.autoResize(this)" onkeydown="SAC_AI_UI.handleKey(event)"></textarea>
            </div>
            <button class="sac-ai-action-btn sac-btn-send" id="sac-ai-send-btn" onclick="SAC_AI_UI.sendMessage()">
              <span class="material-icons">send</span>
            </button>
          </div>

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
    };

    SAC_AI.onStopListening = () => {
      document.getElementById('sac-ai-mic-btn').classList.remove('listening');
    };

    SAC_AI.onSpeechResult = (text) => {
      document.getElementById('sac-ai-input').value = text;
      this.sendMessage(text);
    };

    SAC_AI.onAIResponse = (text) => {
      this.hideTyping();
      this.appendMessage('ai', text);
      if (!this.isMuted) {
        SAC_AI.speakText(text);
      }
    };

    SAC_AI.onError = (err) => {
      this.hideTyping();
      this.appendMessage('ai', `**Error:** ${err}`);
      document.getElementById('sac-ai-mic-btn').classList.remove('listening');
    };
  },

  toggleModal() {
    const modal = document.getElementById('sac-ai-modal');
    modal.classList.toggle('active');
    
    // Auto init AI on first open
    if (modal.classList.contains('active') && window.SAC_AI && !SAC_AI.isInitialized) {
      SAC_AI.init();
    }
    
    // If closing, stop speaking
    if (!modal.classList.contains('active') && window.SAC_AI) {
      SAC_AI.stopSpeaking();
    }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    const icon = document.querySelector('#sac-ai-mute-btn .material-icons');
    icon.textContent = this.isMuted ? 'volume_off' : 'volume_up';
    if (this.isMuted && window.SAC_AI) {
      SAC_AI.stopSpeaking();
    }
  },

  toggleMic() {
    if (!window.SAC_AI) return;
    if (SAC_AI.isListening) {
      SAC_AI.stopListening();
    } else {
      SAC_AI.startListening();
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
    if (!text) return;

    // Stop speaking if user types something new
    if (window.SAC_AI) SAC_AI.stopSpeaking();

    // Clear input
    inputEl.value = '';
    inputEl.style.height = 'auto';

    // Show user msg
    this.appendMessage('user', text);
    this.showTyping();

    if (window.SAC_AI) {
      try {
        await SAC_AI.askGemini(text);
      } catch (e) {
        // Error handled in onError callback
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
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\n/g, '<br>');

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
  }
};

// Auto inject after page load
document.addEventListener('DOMContentLoaded', () => {
  // Only inject if it's not the admin portal (we don't want the FAB in the admin panel)
  if (!window.location.href.includes('admin-portal')) {
    SAC_AI_UI.inject();
  }
});
