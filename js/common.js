/**
 * SYSTEM-AWARE DARK MODE MANAGER
 * Executes immediately to prevent theme flickering.
 */
window.SAC_THEME = {
  init() {
    this.injectFallbackStyles();
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('sac_theme'); } catch (e) { }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Determine initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Listen for OS-level theme changes in real-time
    prefersDark.addEventListener('change', (e) => {
      let hasSaved = false;
      try { hasSaved = !!localStorage.getItem('sac_theme'); } catch (e) { }
      if (!hasSaved) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        this.updateToggleIcon(e.matches ? 'dark' : 'light');
      }
    });
  },

  injectFallbackStyles() {
    if (!document.getElementById('sac-theme-fallback')) {
      const style = document.createElement('style');
      style.id = 'sac-theme-fallback';
      style.textContent = `
                :root[data-theme="dark"] {
                  --bg-light: hsl(222, 47%, 11%) !important;
                  --bg-card: hsla(222, 47%, 15%, 0.85) !important;
                  --bg-glass: hsla(222, 47%, 15%, 0.75) !important;
                  --bg-input: hsla(222, 47%, 20%, 1) !important;
                  --primary-glow: hsla(265, 75%, 65%, 0.15) !important;
                  --primary-light: hsl(265, 75%, 25%) !important;
                  --text-primary: hsl(210, 40%, 98%) !important;
                  --text-secondary: hsl(215, 20%, 75%) !important;
                  --text-tertiary: hsl(215, 15%, 60%) !important;
                  --text-inverse: hsl(222, 47%, 11%) !important;
                  --border-light: hsla(215, 20%, 85%, 0.1) !important;
                  --border-glass: hsla(0, 0%, 100%, 0.1) !important;
                }
                html[data-theme="dark"] body {
                    background-color: var(--bg-light) !important;
                    color: var(--text-primary) !important;
                }
                
                /* Specific Component Overrides for Dark Mode */
                html[data-theme="dark"] .patron-vision-pill,
                html[data-theme="dark"] .filter-btn,
                html[data-theme="dark"] .schedule-header-status {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                
                /* Forcefully override the JS-generated inline styles for the countdown timers */
                html[data-theme="dark"] .mass-countdown-container div[style*="ffffff"],
                html[data-theme="dark"] .mass-countdown-container div[style*="#ffffff"] {
                    background: var(--bg-card) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .mass-countdown-container div,
                html[data-theme="dark"] .mass-countdown-container span {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .mass-countdown-container .material-icons {
                    color: var(--text-secondary) !important;
                }
                
                /* Calendar Dropdown Buttons */
                html[data-theme="dark"] .btn-calendar,
                html[data-theme="dark"] button[style*="background-color: white"],
                html[data-theme="dark"] button[style*="background: white"] {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border-glass) !important;
                }
                
                /* Legacy Page Overrides */
                html[data-theme="dark"] .legacy-timeline-section,
                html[data-theme="dark"] .legacy-po-column {
                    background: var(--bg-light) !important;
                }
                html[data-theme="dark"] .legacy-metrics-bar,
                html[data-theme="dark"] .legacy-overview-shell,
                html[data-theme="dark"] .saint-miracles-block,
                html[data-theme="dark"] .legacy-memory-panel,
                html[data-theme="dark"] .legacy-milestone-card,
                html[data-theme="dark"] .legacy-po-card,
                html[data-theme="dark"] .ultimate-card,
                html[data-theme="dark"] .glass-icon,
                html[data-theme="dark"] .legacy-po-icon-wrap,
                html[data-theme="dark"] .legacy-po-avatar,
                html[data-theme="dark"] .legacy-value-card {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .legacy-action-link.primary,
                html[data-theme="dark"] .legacy-hero-secondary-link {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .legacy-overview-quote,
                html[data-theme="dark"] .legacy-photo-gallery-link {
                    background: var(--bg-input) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .legacy-action-link.primary:hover,
                html[data-theme="dark"] .legacy-hero-secondary-link:hover,
                html[data-theme="dark"] .legacy-photo-gallery-link:hover,
                html[data-theme="dark"] .legacy-value-card:hover {
                    background: var(--bg-glass) !important;
                }
                html[data-theme="dark"] .legacy-section-kicker,
                html[data-theme="dark"] .legacy-overview-kicker {
                    background: var(--bg-glass) !important;
                    color: var(--text-secondary) !important;
                }
                html[data-theme="dark"] .ultimate-kicker {
                    background: hsla(265, 75%, 65%, 0.15) !important;
                    color: hsl(265, 85%, 75%) !important;
                }
                html[data-theme="dark"] span[data-i18n="heritage.tourHint"],
                html[data-theme="dark"] span[style*="rgba(139, 92, 246, 0.1)"] {
                    background: transparent !important;
                    color: #ffffff !important;
                }
                html[data-theme="dark"] div:has(> span[data-i18n="heritage.tourHint"]) {
                    background: var(--bg-card) !important;
                    color: #ffffff !important;
                    border-top: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] div:has(> span[data-i18n="heritage.tourHint"]) span,
                html[data-theme="dark"] div:has(> span[data-i18n="heritage.tourHint"]) .material-icons {
                    color: #ffffff !important;
                }
                html[data-theme="dark"] .pnlm-compass {
                    filter: invert(0.85) hue-rotate(180deg) !important;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
                }
                html[data-theme="dark"] .legacy-metric {
                    background: var(--bg-input) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .legacy-metric-value {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .legacy-metric-label {
                    color: var(--text-secondary) !important;
                }
                html[data-theme="dark"] .legacy-overview-quote-icon,
                html[data-theme="dark"] .legacy-value-card .material-icons {
                    color: var(--text-secondary) !important;
                }
                html[data-theme="dark"] .legacy-overview-quote p,
                html[data-theme="dark"] .legacy-value-card h3,
                html[data-theme="dark"] .legacy-value-card h4,
                html[data-theme="dark"] .legacy-value-card p {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .legacy-milestone-year {
                    color: hsl(265, 85%, 75%) !important;
                }
                html[data-theme="dark"] .legacy-milestone-icon {
                    background: var(--bg-glass) !important;
                    color: hsl(265, 85%, 75%) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .saint-journey-grid::before {
                    display: none !important;
                }
                html[data-theme="dark"] .btn-hero-action.secondary {
                    background: var(--bg-input) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .btn-hero-action.secondary:hover {
                    background: var(--bg-glass) !important;
                    color: #fff !important;
                }
                
                /* Navbar Dropdown Overrides */
                html[data-theme="dark"] .nav-link:hover,
                html[data-theme="dark"] .nav-link.active {
                    color: hsl(265, 85%, 75%) !important;
                    text-shadow: 0 0 8px rgba(167, 139, 250, 0.3);
                }
                html[data-theme="dark"] .nav-link.active::after,
                html[data-theme="dark"] .nav-link:hover::after {
                    background: hsl(265, 85%, 75%) !important;
                    box-shadow: 0 0 8px rgba(167, 139, 250, 0.4) !important;
                }
                html[data-theme="dark"] .nav-link.dropdown-toggle {
                    background: transparent !important;
                }
                html[data-theme="dark"] .navbar .dropdown-menu {
                    background: var(--bg-card) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .navbar .dropdown-item {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .navbar .dropdown-item:hover {
                    background: var(--bg-glass) !important;
                }
                
                /* Language Toggle Button Enhancements */
                html[data-theme="dark"] .btn-lang {
                    background: var(--bg-input) !important;
                    border: 1px solid var(--border-glass) !important;
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .btn-lang:hover {
                    background: var(--bg-glass) !important;
                    border-color: var(--primary-light) !important;
                    color: #fff !important;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2) !important;
                }
                
                /* Skeleton Loading Blocks */
                html[data-theme="dark"] .skeleton-liturgy-block,
                html[data-theme="dark"] .skeleton-card {
                    background: var(--bg-card) !important;
                    border-color: var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .skeleton {
                    background: linear-gradient(90deg, hsla(222, 47%, 20%, 1) 25%, hsla(222, 47%, 25%, 1) 50%, hsla(222, 47%, 20%, 1) 75%) !important;
                    background-size: 200% 100% !important;
                }
                
                /* Schedule & Notices Page Overrides */
                html[data-theme="dark"] .notices-hero-counter,
                html[data-theme="dark"] .schedule-today-pill,
                html[data-theme="dark"] .schedule-quick-chip,
                html[data-theme="dark"] .schedule-quick-chip--sun,
                html[data-theme="dark"] .schedule-quick-chip--tue,
                html[data-theme="dark"] .schedule-card,
                html[data-theme="dark"] .cal-add-btn,
                html[data-theme="dark"] .notices-filter-bar,
                html[data-theme="dark"] .notices-subscribe-card,
                html[data-theme="dark"] .legacy-empty-state,
                html[data-theme="dark"] .filter-tabs,
                html[data-theme="dark"] .sched-time-display,
                html[data-theme="dark"] .schedule-cta-link {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .sched-time-display:hover,
                html[data-theme="dark"] .schedule-cta-link:hover,
                html[data-theme="dark"] .cal-add-btn:hover {
                    background: var(--bg-glass) !important;
                }
                html[data-theme="dark"] .sched-time-display .time-icon,
                html[data-theme="dark"] .cal-add-btn .material-icons,
                html[data-theme="dark"] .cal-add-btn .cal-chevron {
                    color: var(--text-secondary) !important;
                }
                html[data-theme="dark"] .sched-time-stacked,
                html[data-theme="dark"] .sched-time-stacked span {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .sched-day-badge {
                    color: var(--text-primary) !important;
                    background: var(--bg-glass) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                
                /* Calendar Dropdown Specifics */
                html[data-theme="dark"] .cal-dropdown {
                    background: var(--bg-card) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                }
                html[data-theme="dark"] .cal-dropdown::after {
                    background: var(--bg-card) !important;
                    border-top: 1px solid var(--border-glass) !important;
                    border-left: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .cal-option {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .cal-option:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                }
                html[data-theme="dark"] .cal-option-icon svg path {
                    fill: var(--text-primary) !important;
                }
                
                /* Calendar Page Agenda Card Overrides */
                html[data-theme="dark"] .calendar-agenda-card {
                    background: var(--bg-card) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .agenda-item {
                    border-bottom-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .agenda-sticky-header {
                    background: hsla(222, 47%, 15%, 0.95) !important; /* var(--bg-card) with higher opacity */
                    color: var(--text-primary) !important;
                    border-bottom: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .agenda-item div[style*="linear-gradient"] {
                    background: var(--bg-input) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .agenda-item div[style*="linear-gradient"] p,
                html[data-theme="dark"] .agenda-item div[style*="linear-gradient"] span,
                html[data-theme="dark"] .agenda-item div[style*="linear-gradient"] div {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .calendar-event-wrap {
                    background: var(--bg-glass) !important;
                }
                html[data-theme="dark"] .calendar-event-time {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .calendar-event-title,
                html[data-theme="dark"] .agenda-item .date-number {
                    color: var(--text-primary) !important;
                }
                
                html[data-theme="dark"] .notices-search-input,
                html[data-theme="dark"] .subscribe-input {
                    background: var(--bg-glass) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                
                html[data-theme="dark"] .subscribe-title {
                    color: var(--text-primary) !important;
                }
                
                /* Devotion Page Overrides */
                html[data-theme="dark"] .share-prayer-btn,
                html[data-theme="dark"] .wall-cat-pill,
                html[data-theme="dark"] .pray-btn {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                
                html[data-theme="dark"] .pray-btn .pray-count {
                    color: var(--text-secondary) !important;
                }
                
                html[data-theme="dark"] .pray-badge {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: var(--text-primary) !important;
                }
                
                html[data-theme="dark"] .pray-btn.prayed-active .pray-badge {
                    background: rgba(0, 0, 0, 0.2) !important;
                }
                
                html[data-theme="dark"] .prayer-card-name .material-icons,
                html[data-theme="dark"] .prayer-card-time .material-icons {
                    color: var(--text-secondary) !important;
                }
                
                /* Rosary Page Overrides */
                html[data-theme="dark"] .rosary-main-container::before {
                    background: radial-gradient(circle at center, hsla(265, 75%, 65%, 0.1) 0%, transparent 70%) !important;
                }
                html[data-theme="dark"] .rosary-mystery-badge {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .rosary-btn {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .rosary-btn:hover {
                    background: var(--bg-glass) !important;
                    color: var(--primary-light) !important;
                }
                html[data-theme="dark"] .rosary-btn.primary,
                html[data-theme="dark"] #btn-prev,
                html[data-theme="dark"] #btn-next {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .rosary-btn.primary:hover,
                html[data-theme="dark"] #btn-prev:hover,
                html[data-theme="dark"] #btn-next:hover {
                    background: var(--bg-glass) !important;
                    color: var(--primary-light) !important;
                }
                
                /* Gallery Page Overrides */
                html[data-theme="dark"] .gallery-filter-bar,
                html[data-theme="dark"] .gallery-card,
                html[data-theme="dark"] .gallery-card-info {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border-glass) !important;
                    box-shadow: none !important;
                }
                
                html[data-theme="dark"] .gallery-card-title {
                    color: var(--text-primary) !important;
                }
                
                html[data-theme="dark"] .gallery-card-category {
                    background: var(--bg-glass) !important;
                    color: var(--text-secondary) !important;
                }
                
                /* Contact Page Overrides */
                html[data-theme="dark"] .contact-quick-card,
                html[data-theme="dark"] .contact-reach-panel,
                html[data-theme="dark"] .contact-reach-item,
                html[data-theme="dark"] .contact-officials-block,
                html[data-theme="dark"] .contact-official-card,
                html[data-theme="dark"] .contact-map-block,
                html[data-theme="dark"] .contact-form-panel {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .contact-reach-item:hover,
                html[data-theme="dark"] .contact-official-card:hover {
                    background: var(--bg-glass) !important;
                }
                html[data-theme="dark"] .contact-form-panel .form-control {
                    background: var(--bg-input) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .contact-form-panel .form-control:focus {
                    background: var(--bg-card) !important;
                    border-color: var(--primary) !important;
                }
                html[data-theme="dark"] .contact-panel-title,
                html[data-theme="dark"] .contact-form-panel h3,
                html[data-theme="dark"] .contact-map-head h4 {
                    -webkit-text-fill-color: var(--text-primary) !important;
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .contact-quick-icon,
                html[data-theme="dark"] .contact-reach-icon {
                    background: var(--bg-input) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .contact-panel-badge,
                html[data-theme="dark"] .official-role-badge {
                    background: var(--bg-glass) !important;
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] .contact-map-head {
                    background: var(--bg-card) !important;
                    border-bottom: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] #ai-assistant-card {
                    background: var(--bg-input) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] #ai-assistant-card div {
                    color: var(--text-primary) !important;
                }
                html[data-theme="dark"] #ai-processing-overlay {
                    background: hsla(222, 47%, 11%, 0.9) !important;
                }
                html[data-theme="dark"] .translit-badge,
                html[data-theme="dark"] .translit-badge span,
                html[data-theme="dark"] .voice-lang-btn,
                html[data-theme="dark"] .voice-btn {
                    color: var(--text-secondary) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .voice-btn-group {
                    background: var(--bg-card) !important;
                    border-color: var(--border-glass) !important;
                }
                html[data-theme="dark"] .btn-submit,
                html[data-theme="dark"] .btn-submit:hover {
                    background: var(--bg-input) !important;
                    border: 1px solid var(--border-glass) !important;
                    box-shadow: none !important;
                }
                html[data-theme="dark"] .btn-submit *,
                html[data-theme="dark"] .btn-submit:hover * {
                    color: var(--text-primary) !important;
                    background: transparent !important;
                }
                html[data-theme="dark"] .official-contact-link,
                html[data-theme="dark"] .contact-map-link {
                    background: var(--bg-input) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-glass) !important;
                }
                html[data-theme="dark"] .official-contact-link:hover,
                html[data-theme="dark"] .official-contact-link:hover *,
                html[data-theme="dark"] .contact-map-link:hover,
                html[data-theme="dark"] .contact-map-link:hover * {
                    background: var(--bg-glass) !important;
                    color: #ffffff !important;
                }
                
                /* Global Devotion/Tabs Overrides */
                html[data-theme="dark"] .filter-tab:not(.active):not(.active-feast):not(.active-announcement):not(.active-special) {
                    color: var(--text-secondary) !important;
                }
                html[data-theme="dark"] .filter-tab:not(.active):not(.active-feast):not(.active-announcement):not(.active-special):hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                    color: var(--text-primary) !important;
                }
                
                html[data-theme="dark"] .legacy-po-name,
                html[data-theme="dark"] .legacy-po-role,
                html[data-theme="dark"] .legacy-po-period,
                html[data-theme="dark"] .saint-block-header h4,
                html[data-theme="dark"] .saint-block-header p,
                html[data-theme="dark"] .legacy-memory-panel h3,
                html[data-theme="dark"] .legacy-memory-panel p {
                    color: var(--text-primary) !important;
                }
            `;
      document.head.appendChild(style);
    }
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    try { localStorage.setItem('sac_theme', newTheme); } catch (e) { }

    this.updateToggleIcon(newTheme);
  },

  updateToggleIcon(theme) {
    // Find both desktop and mobile toggle icons if they exist
    const toggles = document.querySelectorAll('.theme-toggle-icon');
    toggles.forEach(icon => {
      icon.innerText = theme === 'dark' ? 'light_mode' : 'dark_mode';

      // Add subtle spin animation on click
      icon.style.transform = 'rotate(180deg)';
      setTimeout(() => icon.style.transform = 'none', 300);
    });
  }
};

// Initialize immediately before DOM content loads
SAC_THEME.init();

// Ensure the icon matches the initial theme after navbar is loaded
document.addEventListener('DOMContentLoaded', () => {
  SAC_THEME.updateToggleIcon(document.documentElement.getAttribute('data-theme') || 'light');
});

// Toast Notification System
window.showToast = function (message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'sac-toast toast-' + type;

  const icon = type === 'success' ? '✅' : '⚠️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('toast-show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// --- GLOBAL PAGE LOADER INJECTION ---
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const loaderHTML = `
    <div id="sac-global-loader" style="position:fixed; top:0; left:0; width:0%; height:4px; background:var(--primary, #4338ca); z-index:999999; box-shadow: 0 0 10px var(--primary, #4338ca); transition: width 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;"></div>
  `;

  const loaderStartTime = Date.now();
  let isLoaderHidden = false;

  // Expose hideLoader globally so revealPage can call it
  window.hideSACLoader = () => {
    if (isLoaderHidden) return;

    const elapsed = Date.now() - loaderStartTime;
    const remaining = Math.max(0, 800 - elapsed);

    setTimeout(() => {
      isLoaderHidden = true;
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
      const futcStyle = document.getElementById('sac-futc-style');
      if (futcStyle) {
        document.body.style.opacity = '1';
        futcStyle.remove();
      }
    }, remaining);
  };

  // Ultimate fallback: forcefully hide after 8000ms no matter what
  // This matches the Firebase timeout, ensuring we wait for all fetches
  setTimeout(window.hideSACLoader, 8000);

  // Handle Back-Forward Cache (bfcache) navigation on mobile browsers
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      isLoaderHidden = false; // Force reset
      if (typeof window.hideSACLoader === 'function') window.hideSACLoader();
      document.body.style.overflow = ''; // Ensure scroll is restored
    }
  });

  // Intercept navigation links to show loader
  document.addEventListener('click', (e) => {
    // Theme Toggle Delegation
    const themeBtn = e.target.closest('.theme-toggle-icon');
    if (themeBtn && window.SAC_THEME) {
      window.SAC_THEME.toggle();
      return;
    }

    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Only intercept internal standard links
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && target !== '_blank' && !link.hasAttribute('download')) {
      e.preventDefault();

      isLoaderHidden = false; // Reset so it can be hidden if user returns via Back button
      let loader = document.getElementById('sac-global-loader');
      if (!loader) {
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        loader = document.getElementById('sac-global-loader');
      }

      // Start progress bar animation
      loader.style.transition = 'none';
      loader.style.opacity = '1';
      loader.style.visibility = 'visible';
      loader.style.width = '0%';

      // Force reflow
      void loader.offsetWidth;
      loader.style.transition = 'width 10s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.3s ease, visibility 0.3s ease';
      loader.style.width = '80%'; // Fake load up to 80%

      window.location.href = href;
    }
  });
})();
// --- END PAGE LOADER ---

// --- A11Y (ACCESSIBILITY) AUTO-INJECTION ---
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  return; // Temporarily disabled globally as per request

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
      "nav.rosary": "செபமாலை",
      "nav.prayers": "செபங்கள்",
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
      "footer.visitors": "மொத்த பார்வையாளர்கள்:",
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
      "sched.novenaDesc": "ஒவ்வொரு செவ்வாய்க்கிழமையும் மாலை 6:30 மணி முதல் இரவு 8:30 மணி வரை புனித அந்தோணியாரின் சிறப்பு நவநாள் திருப்பலியும், எண்ணெய் அபிஷேகமும், நற்கருணை ஆராதனையும்  நடைபெறும்.",
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
      "sched.officeTitle": "பங்கு அலுவலக வேலை நேரங்கள் & பதிவுகள்",
      "sched.offTimeTitle": "பங்கு அலுவலக வேலை நேரம்",
      "sched.offTimeDesc": "திங்கள் முதல் சனி வரை: <strong style=\"color: #6d28d9;\">காலை 9:00 - மதியம் 12:00, மாலை 2:30 - 4:30 மணி.</strong> (ஞாயிறு விடுமுறை)",
      "sched.baptTitle": "திருமுழுக்கு பதிவுகள்",
      "sched.baptDesc": "மாதத்தின் <strong style=\"color: #6d28d9;\">முதல் மற்றும் மூன்றாம் ஞாயிற்றுக்கிழமைகளில்</strong> ஞாயிறு திருப்பலியைத் தொடர்ந்து குழந்தைகளுக்கு திருமுழுக்கு வழங்கப்படும். ஒரு வாரத்திற்கு முன்பே பதிவு செய்யவும்.",
      "sched.marriageTitle": "திருமண ஓலை",
      "sched.marriageDesc": "திருமணத்திற்கு ஒரு மாதத்திற்கு முன்பே பங்கு அலுவலகத்தை அணுகி முன்பதிவு செய்ய வேண்டும். <br><strong style=\"color: #6d28d9; font-size: 1.05em;\">ஓலை எழுதும் நாட்கள்:</strong> <strong>புதன் மற்றும் வெள்ளி.</strong>",
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
      "sched.massLead": "எங்கள் ஆலய சமூகத்திற்கான வாராந்திர திருப்பலி நேரங்கள்.",
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
      "legacy.statParish": "புதிய ஆலயம் அடிக்கல்",
      "legacy.statShrine": "புதிய ஆலயம் அர்ச்சிப்பு",
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
      "legacy.newPhotoTitle": "புதிய அந்தோணியார் ஆலயம்",
      "legacy.timelineKicker": "வரலாற்றுப் பாதை",
      "legacy.timelineTitle": "அருளும் வளர்ச்சியும் கொண்ட காலவரிசை",
      "legacy.timelineLead": "வழிபாடு, கட்டிடம், கொண்டாட்டங்கள், சமூகச் சாட்சி ஆகியவற்றின் வழியாக உயிருடன் இருக்கும் பங்கின் முக்கிய நினைவுத் தருணங்கள்.",
      "legacy.loadingLabel": "வரலாற்று விபரங்கள் ஏற்றப்படுகின்றன...",
      "legacy.ms24Title": "ஆலய அடித்தளம்",
      "legacy.ms24Desc": "வடக்கு பாகனூரில் எளிய ஓலைக் கூரையின் கீழ் முதல் ஜெபக் கூடம் அமைக்கப்பட்டது.",
      "legacy.ms60Title": "கல் கோவில் எழுப்பப்பட்டது",
      "legacy.ms60Desc": "பங்கு மக்களின் கூட்டு முயற்சியால் அழகிய நிரந்தர கல் ஆலயம் கட்டப்பட்டு அர்ப்பணிக்கப்பட்டது.",
      "legacy.ms95Title": "புதிய ஆலய அடிக்கல்",
      "legacy.ms95Desc": "ஊர் மற்றும் பங்கு மக்களின் செபம், தியாகம் மற்றும் கூட்டு முயற்சியால் புதிய ஆலயத்தின் அடிக்கல் நாட்டும் விழா நடைபெற்றது.",
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
      "wall.timeAgo": "மணிநேரத்திற்கு முன்",
      "wall.ai.listenTitle": "உங்களது செபங்களை கேட்கிறது...",
      "wall.ai.listenDesc": "உங்களது பெயர், மின்னஞ்சல் மற்றும் செப விண்ணப்பத்தை இயல்பாக பேசவும். புனித அந்தோணியார் AI உங்களுக்காக படிவத்தை நிரப்பும்.",
      "wall.ai.listening": "\"கேட்கிறது...\"",
      "wall.ai.processTitle": "AI மூலம் ஒருங்கிணைக்கப்படுகிறது...",
      "wall.ai.processDesc": "Gemini உங்களுக்காக தகவல்களை மொழிபெயர்த்து நிரப்புகிறது.",
      "rosary.title": "மெய்நிகர் செபமாலை",
      "rosary.beads": "மணிகள்",
      "rosary.instruction": "தொடங்க எங்கும் தட்டவும்",
      "home.mpBadge": "தாய் பங்கு | Mother Parish",
      "home.mpTitle": "சகாய அன்னை பங்கு",
      "home.mpSub": "நமது புனித அந்தோணியார் ஆலயம், அனைத்து மக்களின்சகாய அன்னை பங்கின் கிளைப் பங்காக செயல்பட்டு வருகிறது.",
      "home.mpTabSagaya": "சகாய அன்னை",
      "home.mpTabParish": "தாய் பங்கு",
      "home.mpTabSub": "கிளைப் பங்குகள்",
      "home.mpTabAct": "செயல்பாடுகள்",
      "home.mpSagayaTitle": "அருள் பொழியும் சகாயத் தாய்",
      "home.mpSagayaDesc": "சகாய அன்னை, நம்மை எப்போதும் பாதுகாத்து, நம் தேவைகளில் இறைவனிடம் பரிந்துபேசும் அன்பின் தாய். பக்தர்களின் வேண்டுதல்களைக் கேட்டு, அற்புதங்கள் பல புரியும் சகாயத் தாயின் கருணையை நாம் தினமும் உணர்கிறோம்.",
      "home.mpSagayaDesc2": "துன்புறும் வேளைகளில் ஆறுதலாகவும், இருளில் நல் ஒளியாகவும் விளங்கும் அன்னை மரியாளின் திருக்கரம், நம் குடும்பங்களை அரவணைத்து ஆசீர்வதிக்கிறது. அன்னையின் மன்றாட்டால் நம் வாழ்வில் இறைவனின் சமாதானமும் மகிழ்ச்சியும் என்றும் தங்கியிருக்கிறது.",
      "home.mpParishTitle": "தொன்போஸ்கோ சகாய அன்னை பங்கு",
      "home.mpParishDesc": "நமது தாய் பங்கு, தொன்போஸ்கோ மாணவர் இல்ல வளாகத்தில் அமைந்துள்ள சகாய அன்னை பங்கு ஆகும். இது ஆன்மீக வழிகாட்டுதலையும், சமுதாய வளர்ச்சியையும் முன்னிறுத்தி செயலாற்றி வருகிறது.",
      "home.mpParishDesc2": "சலேசிய சபை அருட்தந்தையர்களின் சிறப்பான வழிகாட்டுதலில், இளையோர் நலன் மற்றும் கல்விக்கு முக்கியத்துவம் அளிக்கப்படுகிறது. சகாய அன்னையின் அருளாலும், புனித ஜான் போஸ்கோவின் பரிந்துரையாலும் இப்பங்கு மக்கள் ஆன்மீகத்திலும் சமுதாய வாழ்விலும் தொடர்ந்து முன்னேற்றம் கண்டு வருகின்றனர்.",
      "home.mpParishDesc3": "இப்பங்கு 24-07-1990 அன்று உருவாக்கப்பட்டது. அப்போதைய திருச்சிராப்பள்ளி மறைமாவட்ட ஆயர் மேதகு தாமஸ் பெர்னாண்டோ அவர்களால் இப்பங்கு நிறுவப்பட்டது. சலேசிய மாநிலத் தலைவர் அருட்தந்தை வின்சென்ட் துரைராஜ் (ச.ச) அவர்களின் வழிகாட்டுதலில், அனைத்து மக்களின் சகாய அன்னை மையமாக இது உருவெடுத்தது.",
      "home.mpSubTitle": "இறையாட்சி வளரும் கிளைப் பங்குகள்",
      "home.mpSubDesc": "வடக்கு பாகனூர் நமது புனித அந்தோணியார் ஆலயம், நவலூர் குட்டப்பட்டு (அருள்நிறை அடைக்கல அன்னை ஆலயம்), முதுக்குளம் (புனித செபஸ்தியார் ஆலயம்), தெற்கு பாகனூர் (புனித ஆரோக்கிய அன்னை ஆலயம்) மற்றும் சோழன் நகர், பூங்குடி, சத்திரப்பட்டி, மாத்தூர் உட்பட கிளைப் பங்குகள், தாய் பங்கின் ஆன்மீகக் குடையின் கீழ் செயல்பட்டு வருகின்றன.",
      "home.mpActTitle": "பங்குப் பேரவை மற்றும் ஆன்மீகப் பணிகள்",
      "home.mpActDesc": "மறைக்கல்வி, இளைஞர் இயக்கம், அன்பியங்கள், சலேசிய உடனுழைப்பாளர்கள் மற்றும் பல்வேறு ஆன்மீகப் பணிகள் தாய் பங்கின் வழிகாட்டுதலில் சிறப்பாக நடைபெறுகின்றன. இறைமக்களின் ஆன்மீக வளர்ச்சிக்காக பல கூட்டங்கள் தொடர்ந்து ஒருங்கிணைக்கப்படுகின்றன."
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
      "nav.rosary": "Virtual Rosary",
      "nav.prayers": "Prayers",
      "nav.more": "More ▾",
      "footer.tagline": "A Sanctuary of Peace, Grace, and Divine Blessings",
      "footer.quickLinks": "Quick Links",
      "footer.resources": "Resources",
      "footer.navigate": "Navigate",
      "footer.parish": "Church & Resources",
      "footer.visit": "Plan Your Visit",
      "footer.visitLead": "Mass times, prayer requests, and parish services — we welcome you.",
      "footer.contactBtn": "Contact Us",
      "footer.scheduleBtn": "Schedule",
      "footer.massTimes": "Mass Times",
      "footer.backTop": "Top",
      "footer.copyText": "All rights reserved.",
      "footer.visitors": "Total Visitors:",
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
      "home.sacPrayDesc": "Submit your prayer requests online or in the church drop-box to join our community prayers.",
      "home.mpBadge": "Mother Parish",
      "home.mpTitle": "Sagaya Annai Parish",
      "home.mpSub": "Our St. Antony's Church flourishes as a vibrant sub-parish under the Sagaya Annai Mother Parish, Kuttapattu.",
      "home.mpTabSagaya": "Sagaya Annai",
      "home.mpTabParish": "Mother Parish",
      "home.mpTabSub": "Sub Parishes",
      "home.mpTabAct": "Activities",
      "home.mpSagayaTitle": "Our Lady of Perpetual Help",
      "home.mpSagayaDesc": "Our Lady of Perpetual Help is the patroness who constantly intercedes for us. She offers maternal comfort, guidance, and endless miracles to her devoted children.",
      "home.mpSagayaDesc2": "In times of suffering, the gentle hand of Mother Mary serves as our comfort and a guiding light in the darkness, embracing and blessing our families. Through her intercession, God's peace and joy dwell in our lives forever.",
      "home.mpParishTitle": "Don Bosco Sagaya Annai Parish",
      "home.mpParishDesc": "Located at the Don Bosco Student Home campus, our Mother Parish serves as the spiritual epicenter, guiding the community in faith, education, and social upliftment.",
      "home.mpParishDesc2": "Under the dedicated guidance of the Salesian Fathers of Don Bosco, special emphasis is placed on youth welfare and education. Through the grace of Our Lady of Perpetual Help and the intercession of St. John Bosco, the parishioners continue to flourish both spiritually and socially.",
      "home.mpParishDesc3": "This parish was established on July 24, 1990. It was founded by the then Bishop of Tiruchirappalli, His Excellency Most Rev. Thomas Fernando. Under the guidance of the Salesian Provincial Rev. Fr. Vincent Durairaj SDB, it was formed as the All Peoples' Our Lady of Perpetual Help Center.",
      "home.mpSubTitle": "Flourishing Sub Parishes",
      "home.mpSubDesc": "Our St. Antony's Church in Vadakku Paganur, Navalur Kuttappattu (Our Lady of Refuge Church), Muthukkulam (St. Sebastian's Church), Therku Paganur (Our Lady of Health Church), along with other sub-parishes including Cholan Nagar, Poongudi, Chathirappatti, and Mathur, operate under the spiritual umbrella of the Mother Parish.",
      "home.mpActTitle": "Parish Council & Pastoral Activities",
      "home.mpActDesc": "Catechism, Youth Ministry, Basic Christian Communities (Anbiyam), Parish Council, Salesian Cooperators, and various other spiritual activities are successfully carried out under the guidance of the Mother Parish. Numerous gatherings are continuously organized for the spiritual growth of the congregation.",
      "sched.devotionTag": "Special Devotions",
      "sched.devotionTitle": "Monthly Devotions & Special Services",
      "sched.novenaBadge": "Tuesday Novena",
      "sched.novenaTitle": "Novena of St. Antony of Padua",
      "sched.novenaDesc": "Every Tuesday, from 6:30 PM to 8:30 PM, a special Novena Mass in honor of St. Antony, followed by the Anointing with Oil and Eucharistic Adoration, is conducted.",
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
      "sched.offTimeTitle": "Parish Office Working Hours",
      "sched.offTimeDesc": "Monday to Saturday: <strong style=\"color: #6d28d9;\">9:00 AM - 12:00 PM, 2:30 PM - 4:30 PM.</strong> (Closed on Sundays)",
      "sched.baptTitle": "Holy Baptism Registrations",
      "sched.baptDesc": "Baptisms are celebrated on the <strong style=\"color: #6d28d9;\">1st and 3rd Sundays</strong> of the month after Sunday Mass. Register one week prior.",
      "sched.marriageTitle": "Marriage Registration",
      "sched.marriageDesc": "Couples are requested to contact the parish office at least one month prior to the wedding date. <br><strong style=\"color: #6d28d9; font-size: 1.05em;\">Registration Days:</strong> <strong>Wednesday and Friday.</strong>",
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
      "sched.massLead": "Weekly Holy Mass times for our church community.",
      "sched.devotionBadgeLabel": "Special Devotions",
      "sched.devotionLead": "Novena, feast devotions, and monthly church liturgies.",
      "sched.officeBadgeLabel": "Parish Administration",
      "sched.officeLead": "Parish office hours and sacrament registration information.",
      "sched.ctaTitle": "Questions about Mass or registrations?",
      "sched.ctaText": "Contact the parish office for bookings, baptisms, and special intentions.",
      "sched.ctaLink": "Contact Church",
      "legacy.heroKicker": "Journey of Faith",
      "legacy.heroTitle": "Parish Legacy & History",
      "legacy.heroSubtitle": "The journey of St. Antony's Parish in Vadakku Paganur through faith, devotion, and community.",
      "legacy.heroPrimaryLink": "Explore Timeline",
      "legacy.heroSecondaryLink": "View Historic Photos",
      "legacy.statFoundation": "first chapel remembered",
      "legacy.statStone": "stone sanctuary built",
      "legacy.statParish": "Foundation Stone Laying",
      "legacy.statShrine": "New Church Consecration",
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
      "legacy.newPhotoTitle": "The renewed St.Antony's Church",
      "legacy.timelineKicker": "Chronicle",
      "legacy.timelineTitle": "A timeline of grace and growth",
      "legacy.timelineLead": "Key moments from the parish memory, kept alive through worship, architecture, celebrations, and community witness.",
      "legacy.loadingLabel": "Loading parish history...",
      "legacy.ms24Title": "The Humble Foundation",
      "legacy.ms24Desc": "The first simple thatched chapel was built in Vadakku Paganur as a place of communal prayer.",
      "legacy.ms60Title": "The Stone Sanctuary",
      "legacy.ms60Desc": "With united parish labor, a permanent stone sanctuary was built and consecrated for worship.",
      "legacy.ms95Title": "New Church Foundation Stone Laying",
      "legacy.ms95Desc": "The Foundation Stone Laying Ceremony of the new church was made possible through the prayers, sacrifices, and united efforts of the parish and village community.",
      "legacy.ms20Title": "Modern Shrine Renovation",
      "legacy.ms20Desc": "The church was beautifully renovated with stained glass, renewed shrines, and a dignified sanctuary.",
      "legacy.ctaKicker": "Church Memory",
      "legacy.ctaTitle": "Every photograph carries a prayer",
      "legacy.ctaText": "Continue the story through altar images, feast celebrations, choir moments, and historic church photographs preserved in the gallery.",
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
      "wall.timeAgo": "ago",
      "wall.ai.listenTitle": "Listening to your prayer...",
      "wall.ai.listenDesc": "Speak your name, email, and prayer request naturally. St. Antony's AI organized form for you.",
      "wall.ai.listening": "\"Listening...\"",
      "wall.ai.processTitle": "Organizing with AI...",
      "wall.ai.processDesc": "Gemini is extracting and filling out the details for you.",
      "rosary.title": "Virtual Rosary",
      "rosary.beads": "Beads",
      "rosary.instruction": "Tap anywhere to begin"
    },
  },

  // Initialize shared scripts across pages
  async init(pageName) {
    if (window.location.hostname === '127.0.0.1') {
      window.location.hostname = 'localhost';
      return;
    }

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
      futcStyle.innerHTML = 'body > *:not(#sac-global-loader):not(script):not(style) { opacity: 0 !important; pointer-events: none !important; }';
      document.head.appendChild(futcStyle);
    }

    try {
      // 1. INJECT UI SHELL IMMEDIATELY (Navbar & Footer) BEFORE ANY NETWORK DELAYS
      if (window.SAC_NAVBAR) {
        SAC_NAVBAR.inject();
      }
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
      this._setupNavbarListeners();

      try {
        this.settings = await SAC_DATABASE.get("settings");
      } catch (e) {
        console.warn("Failed to load settings in init, using defaults:", e);
        this.settings = SAC_DATABASE.defaultData.settings;
      }

      // ==========================================
      // LAUNCH MODE INTERCEPTION (Takes priority over Maintenance Mode)
      // ==========================================
      const isAdminLogged = sessionStorage.getItem('sac_admin_logged_in') === 'true';
      const isDevEnvironment = window.location.hostname === 'localhost' || window.location.hostname === 'stacpaganurdev.web.app';
      const launchTargetDate = new Date('June 13, 2026 21:00:00').getTime();
      const isPastLaunch = new Date().getTime() >= launchTargetDate;

      if (this.settings && (this.settings.launchMode === true || this.settings.launchMode === 'true') && !isPastLaunch) {
        if (this.pageName !== 'admin' && !isAdminLogged && !isDevEnvironment) {
          document.body.innerHTML = `
                  <div class="l-wrapper">
                      <!-- Ambient orbs and Festive Elements -->
                      <div class="l-ambient-orb orb1"></div>
                      <div class="l-ambient-orb orb2"></div>
                      <div class="l-stars"></div>
                      <div id="l-festive-container" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2; overflow:hidden;"></div>

                      <div class="l-glass-board">
                          <div class="l-glass-bevel"></div>
                          
                          <div class="l-logo-container">
                              <img src="images/church_logo.webp" alt="Logo" loading="lazy" class="l-logo">
                              <div class="l-logo-glow"></div>
                          </div>

                          <div class="l-badge">
                              <span class="material-icons" style="font-size:14px; margin-right:6px;">campaign</span>
                              GRAND DIGITAL LAUNCH
                          </div>

                          <h1 class="l-title-ta">புதிய இணையதள திறப்பு விழா</h1>
                          <h2 class="l-title-en">OFFICIAL WEBSITE LAUNCH</h2>
                          
                          <p class="l-desc-ta">புனித அந்தோணியார் ஆலயத்தின் புதிய அதிகாரப்பூர்வ இணையதளம் விரைவில் நேரலையில்...</p>
                          <p class="l-desc-en">Experience our new digital sanctuary. Going live on June 13, 2026 at 9:00 PM.</p>

                          <div class="l-countdown" id="launch-countdown">
                              <div class="l-time-box"><div class="l-time-val" id="cd-days">00</div><div class="l-time-label">DAYS</div></div>
                              <div class="l-time-box"><div class="l-time-val" id="cd-hours">00</div><div class="l-time-label">HOURS</div></div>
                              <div class="l-time-box"><div class="l-time-val" id="cd-mins">00</div><div class="l-time-label">MINS</div></div>
                              <div class="l-time-box"><div class="l-time-val" id="cd-secs">00</div><div class="l-time-label">SECS</div></div>
                          </div>

                          <div class="l-glow-line"></div>

                          <div class="l-footer">
                              <div class="l-f-ta">புனித அந்தோணியார் ஆலயம் • வடக்கு பாகனூர்</div>
                              <div class="l-f-en">ST. ANTONY'S CHURCH • NORTH PAGANUR</div>
                          </div>
                      </div>

                      <style>
                          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Inter:wght@300;400;600;800&family=Tiro+Tamil:ital@0;1&family=Material+Icons&display=swap');

                          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #f8fafc; font-family: 'Inter', sans-serif; }

                          .l-wrapper {
                              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                              display: flex; justify-content: center; align-items: center;
                              padding: 20px; box-sizing: border-box;
                              overflow: hidden;
                              background: radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%);
                          }

                          /* Ambient Orbs */
                          .l-ambient-orb { position: absolute; border-radius: 50%; filter: blur(80px); z-index: 0; opacity: 0.5; animation: orbit 20s infinite linear; }
                          .l-wrapper .orb1 { width: 50vw; height: 50vw; max-width: 600px; max-height: 600px; background: #d8b4fe; top: -10%; left: -10%; }
                          .l-wrapper .orb2 { width: 40vw; height: 40vw; max-width: 500px; max-height: 500px; background: #fef08a; bottom: -10%; right: -10%; animation-direction: reverse; animation-duration: 25s; }

                          /* Light Starfield / Pattern */
                          .l-stars {
                              position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
                              background-image: radial-gradient(2px 2px at 20px 30px, #e2e8f0, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, #e2e8f0, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #e2e8f0, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #e2e8f0, rgba(0,0,0,0));
                              background-repeat: repeat; background-size: 200px 200px; opacity: 0.6; animation: twinkle 5s infinite alternate;
                          }
                          
                          /* Global Digital Launch Animations */
                          .l-data-stream { position: absolute; bottom: -150px; width: 2px; background: linear-gradient(to top, transparent, currentColor); border-radius: 2px; animation: streamUp linear infinite; opacity: 0.6; }
                          @keyframes streamUp { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-120vh); opacity: 0; } }
                          
                          .l-digital-spark { position: absolute; bottom: -20px; width: 5px; height: 5px; background: currentColor; border-radius: 50%; box-shadow: 0 0 10px currentColor, 0 0 20px currentColor; animation: sparkFloat linear infinite; }
                          @keyframes sparkFloat { 0% { transform: translateY(0) scale(1); opacity: 0; } 20% { opacity: 1; transform: translateY(-20vh) scale(1.5); } 80% { opacity: 1; transform: translateY(-80vh) scale(0.8); } 100% { transform: translateY(-110vh) scale(0); opacity: 0; } }
                          
                          .l-ripple { position: absolute; top: 50%; left: 50%; border: 2px solid currentColor; border-radius: 50%; transform: translate(-50%, -50%); animation: rippleOut linear infinite; opacity: 0; }
                          @keyframes rippleOut { 0% { width: 20px; height: 20px; opacity: 0.8; border-width: 4px; } 100% { width: 600px; height: 600px; opacity: 0; border-width: 1px; } }

                          .l-glass-board {
                              position: relative; z-index: 10; width: 90%; max-width: 680px;
                              background: rgba(255, 255, 255, 0.75);
                              backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                              border-radius: 32px;
                              padding: 60px 40px 40px 40px;
                              text-align: center;
                              border: 1px solid rgba(255, 255, 255, 0.9);
                              box-shadow: 0 25px 60px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1);
                              animation: materialize 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                          }

                          .l-logo-container { position: absolute; top: -60px; left: 50%; transform: translateX(-50%); width: 120px; height: 120px; z-index: 20; }
                          .l-logo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 4px solid #ffffff; box-shadow: 0 15px 35px rgba(0,0,0,0.1); position: relative; z-index: 2; }
                          .l-logo-glow { position: absolute; inset: -20px; background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%); z-index: 1; animation: pulseGlow 3s infinite alternate; }

                          .l-badge {
                              display: inline-flex; align-items: center; justify-content: center;
                              background: rgba(147, 51, 234, 0.08);
                              border: 1px solid rgba(147, 51, 234, 0.2); border-radius: 30px;
                              padding: 8px 20px; color: #7e22ce; font-size: 0.75rem; font-weight: 800; letter-spacing: 3px;
                              margin: 20px 0 30px 0; box-shadow: 0 4px 15px rgba(147,51,234,0.05);
                          }

                          .l-title-ta { font-family: 'Tiro Tamil', serif; font-size: 2.2rem; font-weight: 800; margin: 0 0 10px 0; background: linear-gradient(135deg, #7e22ce, #db2777); -webkit-background-clip: text; color: transparent; text-shadow: 0 2px 10px rgba(126,34,206,0.1); }
                          .l-title-en { font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 800; color: #9333ea; letter-spacing: 6px; margin: 0 0 25px 0; text-shadow: 0 2px 10px rgba(147,51,234,0.1); }

                          .l-desc-ta { font-family: 'Tiro Tamil', serif; font-size: 1.05rem; line-height: 1.6; color: #475569; margin: 0 0 10px 0; }
                          .l-desc-en { font-size: 0.9rem; line-height: 1.5; color: #64748b; margin: 0 0 35px 0; }

                          /* Countdown Styles */
                          .l-countdown { display: flex; justify-content: center; gap: 20px; margin-bottom: 35px; }
                          .l-time-box { 
                              background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(147, 51, 234, 0.15); 
                              border-radius: 16px; width: 90px; padding: 15px 0;
                              box-shadow: inset 0 2px 10px rgba(255,255,255,0.8), 0 10px 20px rgba(147, 51, 234, 0.05);
                              position: relative; overflow: hidden;
                          }
                          .l-time-box::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent); }
                          .l-time-val { font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 800; color: #7e22ce; line-height: 1; margin-bottom: 5px; text-shadow: 0 2px 15px rgba(126,34,206,0.1); }
                          .l-time-label { font-size: 0.65rem; font-weight: 700; color: #a855f7; letter-spacing: 2px; }

                          .l-glow-line { width: 100px; height: 3px; margin: 0 auto 25px auto; border-radius: 3px; background: linear-gradient(90deg, transparent, #d8b4fe, transparent); box-shadow: 0 0 15px rgba(216,180,254,0.6); }

                          .l-footer { position: relative; }
                          .l-f-ta { font-family: 'Tiro Tamil', serif; font-size: 0.9rem; color: #64748b; margin-bottom: 5px; }
                          .l-f-en { font-size: 0.65rem; color: #94a3b8; letter-spacing: 4px; font-weight: 700; }

                          /* Hide floating buttons during interception */
                          #sac-ai-fab, #a11y-fab { display: none !important; }

                          /* Animations */
                          @keyframes materialize { 0% { transform: scale(0.95) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
                          @keyframes pulseGlow { 0% { opacity: 0.6; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1.1); } }
                          @keyframes orbit { 0% { transform: rotate(0deg) translateX(30px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); } }
                          @keyframes twinkle { 0% { opacity: 0.4; } 100% { opacity: 0.8; } }

                          /* Responsive Rules */
                          @media (max-width: 640px) {
                              .l-glass-board { padding: 50px 20px 30px 20px; border-radius: 24px; width: 95%; }
                              .l-logo-container { width: 90px; height: 90px; top: -45px; }
                              .l-title-ta { font-size: 1.6rem; }
                              .l-title-en { font-size: 0.85rem; }
                              .l-desc-ta { font-size: 0.95rem; }
                              .l-desc-en { font-size: 0.8rem; }
                              .l-countdown { gap: 10px; margin-bottom: 25px; }
                              .l-time-box { width: 70px; padding: 10px 0; border-radius: 12px; }
                              .l-time-val { font-size: 1.8rem; }
                              .l-time-label { font-size: 0.55rem; }
                              .l-badge { margin: 15px 0 20px 0; padding: 6px 15px; font-size: 0.65rem; }
                          }

                          @media (max-height: 700px) {
                              .l-glass-board { padding: 40px 20px 20px 20px; }
                              .l-title-ta { font-size: 1.5rem; margin-bottom: 5px; }
                              .l-title-en { font-size: 0.8rem; margin-bottom: 15px; }
                              .l-desc-ta { font-size: 0.9rem; margin-bottom: 5px; }
                              .l-desc-en { font-size: 0.75rem; margin-bottom: 20px; }
                              .l-countdown { margin-bottom: 20px; }
                              .l-time-box { padding: 8px 0; }
                              .l-time-val { font-size: 1.6rem; }
                              .l-glow-line { margin-bottom: 15px; }
                          }
                          
                          @media (max-height: 580px) {
                              .l-glass-board { padding: 30px 15px 15px 15px; border-radius: 16px; }
                              .l-logo-container { width: 60px; height: 60px; top: -30px; }
                              .l-badge { margin: 5px 0 10px 0; padding: 4px 10px; font-size: 0.55rem; }
                              .l-title-ta { font-size: 1.2rem; }
                              .l-title-en { font-size: 0.65rem; margin-bottom: 8px; }
                              .l-desc-ta { font-size: 0.8rem; line-height: 1.3; }
                              .l-desc-en { font-size: 0.7rem; margin-bottom: 12px; }
                              .l-countdown { margin-bottom: 12px; gap: 8px; }
                              .l-time-box { width: 55px; padding: 6px 0; border-radius: 8px; }
                              .l-time-val { font-size: 1.2rem; margin-bottom: 2px; }
                              .l-time-label { font-size: 0.45rem; }
                              .l-glow-line { margin-bottom: 10px; }
                              .l-f-ta { font-size: 0.7rem; }
                              .l-f-en { font-size: 0.5rem; }
                          }
                      </style>
                  </div>
              `;

          // Global Launch Digital Generation
          const festiveContainer = document.getElementById('l-festive-container');
          const launchColors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f43f5e']; // Tech/Digital colors

          // Generate Data Streams
          for (let i = 0; i < 30; i++) {
            let stream = document.createElement('div');
            stream.className = 'l-data-stream';
            stream.style.left = Math.random() * 100 + 'vw';
            stream.style.color = launchColors[Math.floor(Math.random() * launchColors.length)];
            stream.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            stream.style.animationDelay = (Math.random() * 3) + 's';
            stream.style.height = (Math.random() * 100 + 50) + 'px';
            festiveContainer.appendChild(stream);
          }

          // Generate Digital Sparks
          for (let i = 0; i < 40; i++) {
            let spark = document.createElement('div');
            spark.className = 'l-digital-spark';
            spark.style.left = Math.random() * 100 + 'vw';
            spark.style.color = launchColors[Math.floor(Math.random() * launchColors.length)];
            spark.style.animationDuration = (Math.random() * 6 + 4) + 's';
            spark.style.animationDelay = (Math.random() * 5) + 's';
            festiveContainer.appendChild(spark);
          }

          // Generate Global Ripples (Radar/Ping effect)
          for (let i = 0; i < 3; i++) {
            let ripple = document.createElement('div');
            ripple.className = 'l-ripple';
            ripple.style.color = launchColors[i % launchColors.length];
            ripple.style.animationDuration = '4s';
            ripple.style.animationDelay = (i * 1.3) + 's';
            festiveContainer.appendChild(ripple);
          }

          // Countdown Logic
          const timer = setInterval(function () {
            const now = new Date().getTime();
            const distance = launchTargetDate - now;

            if (distance <= 0) {
              clearInterval(timer);
              // Time reached! Refresh the page so the public can instantly see the live site.
              window.location.reload();
              return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (document.getElementById('cd-days')) {
              document.getElementById('cd-days').innerText = days.toString().padStart(2, '0');
              document.getElementById('cd-hours').innerText = hours.toString().padStart(2, '0');
              document.getElementById('cd-mins').innerText = minutes.toString().padStart(2, '0');
              document.getElementById('cd-secs').innerText = seconds.toString().padStart(2, '0');
            }
          }, 1000);

          return; // Abort further initialization
        }
      }

      // ==========================================
      // MAINTENANCE MODE INTERCEPTION
      // ==========================================
      if (this.settings && (this.settings.maintenanceMode === true || this.settings.maintenanceMode === 'true')) {
        if (this.pageName !== 'admin' && !isAdminLogged && !isDevEnvironment) {
          document.body.innerHTML = `
                  <div class="n-wrapper">
                      <!-- Two dynamic colored ambient orbs -->
                      <div class="n-ambient-orb orb1"></div>
                      <div class="n-ambient-orb orb2"></div>

                      <div class="n-stone-board">
                          <div class="n-stone-bevel"></div>
                          
                          <div class="n-embossed-emblem">
                              <div class="n-emblem-inner">
                                  <div class="n-icon-bg"></div>
                                  <img src="images/church_logo.webp" alt="Logo" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                              </div>
                          </div>

                          <div class="n-inset-box">
                              <div class="n-badge">
                                  <div class="n-led"></div>
                                  SYSTEM UPGRADE
                              </div>
                              <h1 class="n-title-ta">இணையதளம் பராமரிப்பில் உள்ளது</h1>
                              <h2 class="n-title-en">SITE UNDER MAINTENANCE</h2>
                          </div>

                          <p class="n-desc-ta">எங்கள் இணையதளம் தற்போது மேம்படுத்தப்பட்டு வருகிறது. ஆன்மீக சேவைகளை மென்மேலும் சிறப்பாக்க இந்த பணி நடைபெறுகிறது.</p>
                          <p class="n-desc-en">We are currently performing scheduled maintenance to enhance your experience. Please check back soon.</p>

                          <div class="n-glow-line"></div>

                          <div class="n-footer">
                              <div class="n-f-ta">புனித அந்தோணியார் ஆலயம் • வடக்கு பாகனூர்</div>
                              <div class="n-f-en">ST. ANTONY'S CHURCH • NORTH PAGANUR</div>
                          </div>
                      </div>

                      <style>
                          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Inter:wght@300;500;700&family=Tiro+Tamil:ital@0;1&display=swap');

                          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #e0e5ec; }

                          .n-wrapper {
                              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                              display: flex; justify-content: center; align-items: center;
                              padding: 20px; box-sizing: border-box;
                              overflow: hidden;
                          }

                          /* Ultra-premium colorful ambient backdrop orbs */
                          .n-ambient-orb {
                              position: absolute; border-radius: 50%; filter: blur(60px); z-index: 0;
                              animation: orbit 15s infinite linear;
                          }
                          .orb1 {
                              width: 60vw; height: 60vw; max-width: 600px; max-height: 600px;
                              background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
                              top: -10%; left: -10%;
                          }
                          .orb2 {
                              width: 50vw; height: 50vw; max-width: 500px; max-height: 500px;
                              background: radial-gradient(circle, var(--accent-gold-glow) 0%, transparent 70%);
                              bottom: -10%; right: -10%; animation-direction: reverse; animation-duration: 25s;
                          }

                          .n-stone-board {
                              position: relative; z-index: 10; width: 90%; max-width: 620px;
                              background: #e0e5ec;
                              border-radius: 36px;
                              padding: 50px 36px 32px 36px;
                              text-align: center;
                              box-shadow: 25px 25px 75px #bec3c9, -25px -25px 75px #ffffff;
                              animation: materialize 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                          }
                          
                          /* Subtle white beveled edge for extra physical realism */
                          .n-stone-bevel {
                              position: absolute; inset: 1px; border-radius: 35px;
                              border: 1px solid rgba(255,255,255,0.7); pointer-events: none;
                          }

                          .n-embossed-emblem {
                              position: absolute; top: -50px; left: 50%; transform: translateX(-50%);
                              width: 100px; height: 100px;
                              background: #e0e5ec;
                              border-radius: 50%;
                              display: flex; justify-content: center; align-items: center;
                              box-shadow: 12px 12px 24px #bec3c9, -12px -12px 24px #ffffff;
                          }
                          
                          .n-emblem-inner {
                              position: relative; width: 70px; height: 70px;
                              border-radius: 50%;
                              background: #e0e5ec;
                              display: flex; justify-content: center; align-items: center;
                              box-shadow: inset 6px 6px 12px #bec3c9, inset -6px -6px 12px #ffffff;
                              overflow: hidden;
                          }
                          
                          /* Inner glow behind the icon */
                          .n-icon-bg {
                              position: absolute; inset: -20px;
                              background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%);
                              animation: pulseGlow 4s infinite alternate;
                          }

                          .n-icon { 
                              font-size: 44px; color: var(--primary); position: relative; z-index: 2;
                              text-shadow: 2px 2px 5px var(--primary-glow), -2px -2px 5px #ffffff; 
                          }

                          .n-inset-box {
                              background: #e0e5ec;
                              border-radius: 20px;
                              padding: 28px 16px;
                              margin: 20px 0;
                              box-shadow: inset 10px 10px 20px #bec3c9, inset -10px -10px 20px #ffffff;
                              position: relative;
                          }

                          .n-badge {
                              display: inline-flex; align-items: center; gap: 10px;
                              background: rgba(255, 255, 255, 0.3); padding: 6px 16px; border-radius: 30px;
                              border: 1px solid rgba(255,255,255,0.6);
                              font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 800;
                              color: var(--primary); letter-spacing: 3px; margin-bottom: 18px;
                              box-shadow: 4px 4px 10px rgba(0,0,0,0.03);
                          }
                          .n-led {
                              width: 8px; height: 8px; border-radius: 50%; background: var(--accent-gold);
                              box-shadow: 0 0 15px var(--accent-gold), inset 2px 2px 4px rgba(255,255,255,0.8);
                              animation: blink 1.5s infinite;
                          }

                          .n-title-ta {
                              font-family: 'Tiro Tamil', serif; font-size: 1.8rem; font-weight: 800;
                              margin: 0 0 8px 0;
                              background: linear-gradient(135deg, var(--primary) 0%, var(--accent-gold) 50%, var(--primary) 100%);
                              background-size: 200% auto;
                              -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                              animation: gradientShift 6s infinite linear;
                          }
                          
                          .n-title-en {
                              font-family: 'Cinzel', serif; font-size: 0.85rem; font-weight: 800;
                              color: var(--text-primary); letter-spacing: 6px; margin: 0;
                              text-shadow: 1px 1px 0px #ffffff;
                          }

                          .n-glow-line {
                              width: 100px; height: 4px; margin: 20px auto; border-radius: 3px;
                              background: linear-gradient(90deg, var(--primary), var(--accent-gold), var(--primary));
                              background-size: 200% 200%;
                              box-shadow: 0 4px 20px var(--primary-glow);
                              animation: shimmer 3s infinite linear;
                          }

                          .n-desc-ta {
                              // 2. Static standard translations with highly defensive dictionary lookup
    const dict = this.staticTranslations[this.currentLang] || {};
    const fallbackDict = this.staticTranslations['ta'] || {};

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
      else {
        const translatedText = dict[key] || fallbackDict[key];
        if (translatedText) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.setAttribute('placeholder', translatedText);
          } else {
            el.innerHTML = translatedText;
          }
        }
      }
    });
                          }
                          .n-desc-en {
                              font-family: 'Inter', sans-serif; font-size: 0.8rem; line-height: 1.5;
                              color: var(--text-muted); margin: 0; padding: 0 10px;
                          }

                          .n-footer { margin-top: 16px; position: relative; }
                          .n-f-ta { font-family: 'Tiro Tamil', serif; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; }
                          .n-f-en { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: var(--text-muted); letter-spacing: 4px; font-weight: 700; }

                          /* Hide floating buttons during interception */
                          #sac-ai-fab, #a11y-fab { display: none !important; }

                          @keyframes materialize { 0% { transform: scale(0.9) translateY(30px); opacity: 0; box-shadow: 0 0 0 transparent, 0 0 0 transparent; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
                          @keyframes blink { 0%, 100% { opacity: 1; box-shadow: 0 0 15px var(--accent-gold); } 50% { opacity: 0.3; box-shadow: 0 0 2px var(--accent-gold); } }
                          @keyframes pulseGlow { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 1; } }
                          @keyframes orbit { 0% { transform: rotate(0deg) translateX(30px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); } }
                          @keyframes gradientShift { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
                          @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: -200% 50%; } }

                          /* Tablet */
                          @media (max-height: 700px) {
                              .n-stone-board { padding: 40px 24px 24px 24px; border-radius: 28px; }
                              .n-embossed-emblem { width: 80px; height: 80px; top: -40px; }
                              .n-emblem-inner { width: 58px; height: 58px; }
                              .n-inset-box { padding: 20px 12px; margin: 14px 0; }
                              .n-title-ta { font-size: 1.4rem; }
                              .n-title-en { font-size: 0.75rem; letter-spacing: 4px; }
                              .n-desc-ta { font-size: 0.85rem; line-height: 1.6; margin-bottom: 6px; }
                              .n-desc-en { font-size: 0.75rem; }
                              .n-glow-line { margin: 14px auto; width: 80px; }
                              .n-footer { margin-top: 10px; }
                              .n-badge { margin-bottom: 12px; padding: 5px 12px; font-size: 0.65rem; }
                          }

                          /* Mobile */
                          @media (max-width: 640px) {
                              .n-stone-board { padding: 40px 16px 24px 16px; border-radius: 24px; width: 95%; }
                              .n-embossed-emblem { width: 80px; height: 80px; top: -40px; }
                              .n-emblem-inner { width: 58px; height: 58px; }
                              .n-icon { font-size: 32px; }
                              .n-title-ta { font-size: 1.3rem; }
                              .n-title-en { font-size: 0.7rem; letter-spacing: 3px; }
                              .n-inset-box { padding: 18px 10px; margin: 14px 0; }
                              .n-desc-ta { font-size: 0.85rem; padding: 0 5px; }
                              .n-desc-en { font-size: 0.72rem; padding: 0 5px; }
                              .n-glow-line { margin: 14px auto; width: 70px; }
                              .n-footer { margin-top: 10px; }
                              .n-f-ta { font-size: 0.78rem; }
                              .n-f-en { font-size: 0.6rem; letter-spacing: 3px; }
                          }

                          /* Very short screens (landscape mobile, small laptops) */
                          @media (max-height: 580px) {
                              .n-stone-board { padding: 32px 16px 16px 16px; border-radius: 20px; }
                              .n-embossed-emblem { width: 64px; height: 64px; top: -32px; }
                              .n-emblem-inner { width: 48px; height: 48px; }
                              .n-icon { font-size: 28px; }
                              .n-inset-box { padding: 14px 10px; margin: 10px 0; border-radius: 14px; }
                              .n-title-ta { font-size: 1.15rem; margin-bottom: 4px; }
                              .n-title-en { font-size: 0.65rem; letter-spacing: 3px; }
                              .n-desc-ta { font-size: 0.78rem; line-height: 1.5; margin-bottom: 4px; }
                              .n-desc-en { font-size: 0.68rem; line-height: 1.4; }
                              .n-glow-line { margin: 8px auto; height: 3px; width: 60px; }
                              .n-footer { margin-top: 6px; }
                              .n-f-ta { font-size: 0.72rem; }
                              .n-f-en { font-size: 0.55rem; }
                              .n-badge { margin-bottom: 8px; padding: 4px 10px; font-size: 0.6rem; letter-spacing: 2px; }
                          }
                      </style>
                  </div>
              `;
          return; // Abort further initialization
        }
      }
      // ==========================================

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


      // Translate page content
      await this.translatePage();


      // Dispatch initial language event so dynamic components (like rosary.js) sync to the correctly loaded language
      window.dispatchEvent(new CustomEvent('sacLanguageChanged', { detail: { lang: this.currentLang } }));

      // Set active nav styling
      this._highlightActiveNav();

      // Listen for background settings refresh to update header/footer live and catch mode toggles
      window.addEventListener('sacDataRefreshed', async (e) => {
        if (e.detail && e.detail.collection === 'settings') {
          try {
            const oldLaunchMode = this.settings ? this.settings.launchMode : null;
            const oldMaintenanceMode = this.settings ? this.settings.maintenanceMode : null;

            this.settings = await SAC_DATABASE.get("settings");

            const newLaunchMode = this.settings ? this.settings.launchMode : null;
            const newMaintenanceMode = this.settings ? this.settings.maintenanceMode : null;

            // If admin is NOT logged in, and modes changed, we MUST instantly reload to show/hide the blocks
            const isAdminLogged = sessionStorage.getItem('sac_admin_logged_in') === 'true';
            if (!isAdminLogged && (oldLaunchMode !== newLaunchMode || oldMaintenanceMode !== newMaintenanceMode)) {
              console.log("System mode changed. Instantly reloading page to apply changes...");
              window.location.reload();
              return;
            }

            await this.translatePage();
          } catch (err) {
            console.warn("Background settings sync re-translate failed:", err);
          }
        }
      });

      // Set up automatic failsafe to reveal the page after 8000ms in case the page script has an error or is too slow
      this._failsafeTimer = setTimeout(() => {
        this.revealPage();
      }, 8000);

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
    const ensureFirebaseLoaded = () => {
      return new Promise((resolve) => {
        if (window.firebase) {
          resolve();
          return;
        }

        // Load firebase-app-compat.js first
        const appScript = document.createElement('script');
        appScript.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
        appScript.onload = () => {
          // Load firebase-firestore-compat.js next
          const firestoreScript = document.createElement('script');
          firestoreScript.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js';
          firestoreScript.onload = () => {
            // Re-trigger DB connection check since firebase is now loaded
            if (window.SAC_DATABASE) {
              window.SAC_DATABASE.setupFirebaseConnection();
            } else if (typeof SAC_DATABASE !== 'undefined') {
              SAC_DATABASE.setupFirebaseConnection();
            }
            resolve();
          };
          firestoreScript.onerror = () => resolve();
          document.body.appendChild(firestoreScript);
        };
        appScript.onerror = () => resolve();
        document.body.appendChild(appScript);
      });
    };

    try {
      await ensureFirebaseLoaded();
    } catch (e) { console.warn("Firebase load failed", e); }

    // Handle visitor tracking and display (Runs after Firebase is active)
    if (window.SAC_DATABASE && typeof SAC_DATABASE.getVisitorStats === 'function') {
      // Skip logging if this is the admin portal or an admin is browsing
      const isAdminLogged = sessionStorage.getItem('sac_admin_logged_in') === 'true';
      if (this.pageName !== 'admin' && !isAdminLogged && SAC_DATABASE.logVisit) {
        if (!sessionStorage.getItem('sac_visit_logged_today')) {
          SAC_DATABASE.logVisit({
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            lang: this.currentLang
          });
          sessionStorage.setItem('sac_visit_logged_today', 'true');
        }
      }

      // Fetch and display total visitor count in footer
      try {
        const totalVisits = await SAC_DATABASE.getVisitorStats();
        const visitorEl = document.getElementById('public-visitor-number');
        if (visitorEl) {
          visitorEl.innerText = totalVisits.toLocaleString();
        }
      } catch (e) {
        console.warn("Failed to load visitor stats:", e);
      }
    }

    // Load Firebase Messaging if not already present
    if (this.pageName !== 'admin') {
      const fcmScript = document.createElement('script');
      fcmScript.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js';
      fcmScript.onload = () => {
        const customMessagingScript = document.createElement('script');
        customMessagingScript.src = 'js/messaging.js';
        document.body.appendChild(customMessagingScript);
      };
      document.body.appendChild(fcmScript);
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
    let siteLogoUrl = this.settings && (this.settings.logoUrl || this.settings.siteLogo) ? (this.settings.logoUrl || this.settings.siteLogo) : null;
    if (siteLogoUrl === 'undefined' || siteLogoUrl === 'null') siteLogoUrl = null;

    if (siteLogoUrl) {
      link.removeAttribute('type');
      link.href = siteLogoUrl;
    } else {
      link.type = 'image/jpeg';
      link.href = 'images/church_logo.webp';
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

    // Phase 1: Navbar scroll effect — toggles .scrolled class for enhanced glassmorphism
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // Set initial state
    }
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
    this.closeMobileMenu(); // Fix: Close the drawer overlay after switching language on mobile

    // Trigger custom translation events on specific pages if they need it (like Home countdown or Admin lists)
    window.dispatchEvent(new CustomEvent('sacLanguageChanged', { detail: { lang: this.currentLang } }));
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

    let siteLogoUrl = settings.logoUrl || settings.siteLogo || '';
    if (siteLogoUrl === 'undefined' || siteLogoUrl === 'null') siteLogoUrl = '';

    document.querySelectorAll('.logo-icon, .footer-church-logo').forEach(el => {
      if (siteLogoUrl) {
        el.innerHTML = `<img src="${siteLogoUrl}" alt="Church Logo" class="dynamic-logo-img" loading="lazy">`;
      } else {
        el.innerHTML = `<img src="images/church_logo.webp" alt="Church Logo" class="dynamic-logo-img" loading="lazy">`;
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


/* --- ADVANCED CSS BACKGROUND LAZY LOADING --- */
document.addEventListener("DOMContentLoaded", () => {
  const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyBg = entry.target;
          const bgUrl = lazyBg.getAttribute('data-bg');
          if (bgUrl) {
            lazyBg.style.backgroundImage = `url('${bgUrl}')`;
            lazyBg.classList.add('bg-loaded');
          }
          observer.unobserve(lazyBg);
        }
      });
    }, { rootMargin: "200px 0px" }); // Preload slightly before it enters viewport

    lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
  } else {
    // Fallback for older browsers
    lazyBackgrounds.forEach(lazyBg => {
      const bgUrl = lazyBg.getAttribute('data-bg');
      if (bgUrl) lazyBg.style.backgroundImage = `url('${bgUrl}')`;
    });
  }
});

/* --- SCROLL REVEAL ANIMATION ENGINE --- */
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll('.reveal-base');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: stop observing once revealed so it doesn't animate out and in repeatedly
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 }); // Trigger slightly before fully in view

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});


// --- Global Scroll Micro-Animations ---
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-base');
  revealElements.forEach(el => observer.observe(el));
});

// --- PWA & Offline Experience UI ---
const PWAUI = {
  deferredPrompt: null,

  init() {
    this.setupOfflineBanner();
    this.setupInstallPrompt();
  },

  setupOfflineBanner() {
    const banner = document.createElement('div');
    banner.id = 'sac-offline-banner';
    banner.innerHTML = `
            <div style="background: var(--color-primary); color: white; text-align: center; padding: 10px 20px; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); border-radius: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10000; display: flex; align-items: center; gap: 10px; font-weight: bold; transition: all 0.3s ease; opacity: 0; pointer-events: none;">
                <i class="fas fa-wifi-slash"></i> <span id="sac-offline-text">You are currently offline.</span>
            </div>
        `;
    document.body.appendChild(banner);

    const updateOnlineStatus = () => {
      const el = banner.firstElementChild;
      const textEl = document.getElementById('sac-offline-text');
      const iconEl = el.querySelector('i');

      if (navigator.onLine) {
        textEl.innerText = 'Back online!';
        iconEl.className = 'fas fa-wifi';
        el.style.background = '#28a745';
        el.style.opacity = '1';
        setTimeout(() => {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        }, 3000);
      } else {
        textEl.innerText = 'You are currently offline.';
        iconEl.className = 'fas fa-wifi-slash';
        el.style.background = 'var(--color-primary)';
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    if (!navigator.onLine) updateOnlineStatus();
  },

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      this.deferredPrompt = e;
      // Optionally, show our custom install UI here
      this.showInstallPromotion();
    });
  },

  showInstallPromotion() {
    // Only show if we haven't dismissed it recently
    if (localStorage.getItem('sac_pwa_dismissed')) return;
    if (document.getElementById('sac-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'sac-install-banner';
    banner.innerHTML = `
            <div style="background: var(--bg-card, white); color: var(--text-primary, #333); border: 1px solid var(--border-glass, #ddd); padding: 15px 20px; position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999; display: flex; align-items: center; gap: 15px; width: 90%; max-width: 400px; backdrop-filter: blur(10px);">
                <img src="images/church_logo.webp" alt="App Logo" loading="lazy" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div style="flex-grow: 1;">
                    <div style="font-weight: bold; font-size: 1.05rem; margin-bottom: 3px;">Install App</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary, #666); line-height: 1.2;">Install St. Antony's Church on your home screen for quick offline access.</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button id="pwa-install-btn" style="background: var(--color-primary, #b22222); color: white; border: none; padding: 6px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; cursor: pointer; transition: transform 0.2s;">Install</button>
                    <button id="pwa-dismiss-btn" style="background: transparent; color: var(--text-secondary, #666); border: none; padding: 0; font-size: 0.8rem; cursor: pointer; text-decoration: underline;">Not Now</button>
                </div>
            </div>
        `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      banner.remove();
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('User response to the install prompt:', outcome);
        this.deferredPrompt = null;
      }
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      banner.remove();
      localStorage.setItem('sac_pwa_dismissed', 'true');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PWAUI.init();
});


// --- Mother Parish Editorial Tabs Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.mp-tab-btn');
  const panels = document.querySelectorAll('.mp-panel');
  const visualImg = document.getElementById('mp-dynamic-img');

  if (!visualImg || tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active to clicked
      btn.classList.add('active');

      // Show target panel
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Update Image with crossfade
      const newImgSrc = btn.getAttribute('data-img');
      if (newImgSrc && visualImg.src !== newImgSrc) {
        visualImg.style.opacity = '0';
        setTimeout(() => {
          visualImg.src = newImgSrc;
          visualImg.onload = () => {
            visualImg.style.opacity = '1';
          };
        }, 300);
      }
    });
  });
});