/**
 * St. Antony's Church - Accessibility (A11y) Mode Widget
 */

const SAC_A11Y = {
  state: {
    textSize: 'normal', // normal, large, xlarge
    highContrast: false,
    dyslexicFont: false,
    highlightLinks: false,
    pauseAnimations: false
  },

  init() {
    this.loadState();
    this.injectUI();
    this.applyState();
  },

  loadState() {
    try {
      const savedState = localStorage.getItem('sac_a11y_state');
      if (savedState) {
        this.state = { ...this.state, ...JSON.parse(savedState) };
      }
    } catch (err) {
      console.warn('Could not load A11y state', err);
    }
  },

  saveState() {
    try {
      localStorage.setItem('sac_a11y_state', JSON.stringify(this.state));
    } catch (err) {
      console.warn('Could not save A11y state', err);
    }
    this.applyState();
  },

  applyState() {
    // 1. Text Size
    document.documentElement.classList.remove('a11y-text-large', 'a11y-text-xlarge');
    if (this.state.textSize === 'large') document.documentElement.classList.add('a11y-text-large');
    if (this.state.textSize === 'xlarge') document.documentElement.classList.add('a11y-text-xlarge');

    // 2. High Contrast
    if (this.state.highContrast) document.body.classList.add('a11y-high-contrast');
    else document.body.classList.remove('a11y-high-contrast');

    // 3. Dyslexic Font
    if (this.state.dyslexicFont) document.body.classList.add('a11y-dyslexic');
    else document.body.classList.remove('a11y-dyslexic');

    // 4. Highlight Links
    if (this.state.highlightLinks) document.body.classList.add('a11y-highlight-links');
    else document.body.classList.remove('a11y-highlight-links');

    // 5. Pause Animations
    if (this.state.pauseAnimations) document.body.classList.add('a11y-pause-animations');
    else document.body.classList.remove('a11y-pause-animations');
    
    this.updateUI();
  },

  injectUI() {
    // Only inject once
    if (document.getElementById('a11y-fab')) return;

    // Get current language context
    const isTa = (window.SAC_COMMON && SAC_COMMON.currentLang === 'ta');

    const html = `
      <button id="a11y-fab" aria-label="${isTa ? 'அணுகல்தன்மை விருப்பங்கள்' : 'Accessibility Options'}" onclick="SAC_A11Y.togglePanel()">
        <span class="material-icons">accessible</span>
      </button>

      <div id="a11y-panel">
        <div class="a11y-header">
          <h3 class="a11y-title">
            <span class="material-icons">accessible</span> 
            ${isTa ? 'அணுகல்தன்மை (Accessibility)' : 'Accessibility Options'}
          </h3>
          <button class="a11y-close" onclick="SAC_A11Y.togglePanel()">
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Text Size -->
        <div class="a11y-option">
          <div class="a11y-label">
            <span class="material-icons">format_size</span> 
            ${isTa ? 'எழுத்துரு அளவு' : 'Text Size'}
          </div>
          <div class="a11y-btn-group">
            <button class="a11y-btn ${this.state.textSize === 'normal' ? 'active' : ''}" onclick="SAC_A11Y.setTextSize('normal')" id="btn-text-normal">Aa</button>
            <button class="a11y-btn ${this.state.textSize === 'large' ? 'active' : ''}" onclick="SAC_A11Y.setTextSize('large')" id="btn-text-large" style="font-size: 1.1rem">Aa</button>
            <button class="a11y-btn ${this.state.textSize === 'xlarge' ? 'active' : ''}" onclick="SAC_A11Y.setTextSize('xlarge')" id="btn-text-xlarge" style="font-size: 1.3rem">Aa</button>
          </div>
        </div>

        <!-- High Contrast -->
        <div class="a11y-toggle-row ${this.state.highContrast ? 'active' : ''}" id="row-high-contrast" onclick="SAC_A11Y.toggle('highContrast')">
          <div class="a11y-label">
            <span class="material-icons">contrast</span> 
            ${isTa ? 'உயர் மாறுபாடு (High Contrast)' : 'High Contrast'}
          </div>
          <div class="a11y-switch"></div>
        </div>

        <!-- Dyslexia Friendly -->
        <div class="a11y-toggle-row ${this.state.dyslexicFont ? 'active' : ''}" id="row-dyslexic" onclick="SAC_A11Y.toggle('dyslexicFont')">
          <div class="a11y-label">
            <span class="material-icons">spellcheck</span> 
            ${isTa ? 'படிக்க எளிதான எழுத்து' : 'Dyslexia Friendly'}
          </div>
          <div class="a11y-switch"></div>
        </div>

        <!-- Highlight Links -->
        <div class="a11y-toggle-row ${this.state.highlightLinks ? 'active' : ''}" id="row-highlight" onclick="SAC_A11Y.toggle('highlightLinks')">
          <div class="a11y-label">
            <span class="material-icons">link</span> 
            ${isTa ? 'இணைப்புகளைக் காட்டு' : 'Highlight Links'}
          </div>
          <div class="a11y-switch"></div>
        </div>

        <!-- Pause Animations -->
        <div class="a11y-toggle-row ${this.state.pauseAnimations ? 'active' : ''}" id="row-animations" onclick="SAC_A11Y.toggle('pauseAnimations')">
          <div class="a11y-label">
            <span class="material-icons">motion_photos_paused</span> 
            ${isTa ? 'அசைவுகளை நிறுத்து' : 'Pause Animations'}
          </div>
          <div class="a11y-switch"></div>
        </div>

        <button class="a11y-reset" onclick="SAC_A11Y.resetAll()">
          ${isTa ? 'அமைப்புகளை மீட்டமைக்க' : 'Reset All Settings'}
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  },

  updateUI() {
    const p = document.getElementById('a11y-panel');
    if (!p) return;

    // Update Text buttons
    document.getElementById('btn-text-normal').className = 'a11y-btn' + (this.state.textSize === 'normal' ? ' active' : '');
    document.getElementById('btn-text-large').className = 'a11y-btn' + (this.state.textSize === 'large' ? ' active' : '');
    document.getElementById('btn-text-xlarge').className = 'a11y-btn' + (this.state.textSize === 'xlarge' ? ' active' : '');

    // Update Toggles
    document.getElementById('row-high-contrast').className = 'a11y-toggle-row' + (this.state.highContrast ? ' active' : '');
    document.getElementById('row-dyslexic').className = 'a11y-toggle-row' + (this.state.dyslexicFont ? ' active' : '');
    document.getElementById('row-highlight').className = 'a11y-toggle-row' + (this.state.highlightLinks ? ' active' : '');
    document.getElementById('row-animations').className = 'a11y-toggle-row' + (this.state.pauseAnimations ? ' active' : '');
  },

  togglePanel() {
    const panel = document.getElementById('a11y-panel');
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
    } else {
      panel.classList.add('open');
    }
  },

  setTextSize(size) {
    this.state.textSize = size;
    this.saveState();
  },

  toggle(key) {
    this.state[key] = !this.state[key];
    this.saveState();
  },

  resetAll() {
    this.state = {
      textSize: 'normal',
      highContrast: false,
      dyslexicFont: false,
      highlightLinks: false,
      pauseAnimations: false
    };
    this.saveState();
  }
};

// Initialize after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Give priority to critical UI first, then load A11y widget slightly delayed
  setTimeout(() => {
    SAC_A11Y.init();
  }, 1500);
});
