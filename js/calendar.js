/**
 * Liturgical Calendar Component - Public Website Version
 * Features: Split-pane layout, Monthly agenda, Read-Only view for public
 */
const LiturgicalCalendarPage = {
  currentDate: new Date(),
  events: [],

  async init() {
    await this.render();
    
    // Listen for language changes
    window.addEventListener('sacLanguageChanged', () => {
      this.render();
    });
  },

  async render() {
    const isTa = SAC_COMMON.currentLang === 'ta';
    const months = isTa ? [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ] : [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const currentSeason = this.getCurrentSeasonInfo(month, year);
    
    await this.fetchEvents();

    const container = document.getElementById('calendar-container');
    if (!container) return;

    container.innerHTML = `
      <div class="calendar-layout">
        <!-- Left: Compact Calendar -->
        <div class="card calendar-sidebar" style="border-radius: 28px; background: var(--bg-card); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); overflow: hidden;">
          <div style="background: var(--bg-light); padding: 20px; border-bottom: 1px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div id="calendar-month-year" style="font-weight: 900; font-size: 1.5rem; color: var(--primary); letter-spacing: -0.5px;">${months[month]} ${year}</div>
                <div id="calendar-season-indicator" style="display: flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 800; color: ${currentSeason.color}; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                  <span class="material-icons" style="font-size: 14px;">auto_awesome</span> ${currentSeason.name}
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-ghost calendar-nav-btn" onclick="LiturgicalCalendarPage.changeMonth(-1)" style="width: 36px; height: 36px; padding: 0; border-radius: 10px; background: white; border: 1.5px solid rgba(0,0,0,0.08); color: var(--text-primary); box-shadow: 0 2px 6px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                  <span class="material-icons" style="font-size: 20px; font-weight: bold;">chevron_left</span>
                </button>
                <button class="btn btn-ghost calendar-nav-btn" onclick="LiturgicalCalendarPage.changeMonth(1)" style="width: 36px; height: 36px; padding: 0; border-radius: 10px; background: white; border: 1.5px solid rgba(0,0,0,0.08); color: var(--text-primary); box-shadow: 0 2px 6px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                  <span class="material-icons" style="font-size: 20px; font-weight: bold;">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 12px;">
              ${(isTa ? ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']).map(day => `
                <div style="text-align: center; font-size: 0.7rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase;">${day}</div>
              `).join('')}
            </div>
            <div id="calendar-grid-container" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
              ${this.renderCompactDays(year, month)}
            </div>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-light);">
               <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">${isTa ? 'வழிபாட்டு காலங்கள்' : 'Liturgical Seasons'}</div>
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                 ${this.renderCompactKeyItem(isTa ? 'சாதாரண காலம்' : 'Ordinary Time', '#4caf50')}
                 ${this.renderCompactKeyItem(isTa ? 'தவக்காலம்' : 'Lent / Advent', '#673ab7')}
                 ${this.renderCompactKeyItem(isTa ? 'கிறிஸ்துமஸ்' : 'Christmas / Easter', '#ffc107')}
                 ${this.renderCompactKeyItem(isTa ? 'திருவிழாக்கள்' : 'Feast Days', '#f44336')}
               </div>
            </div>
          </div>
        </div>

        <!-- Right: Monthly Agenda -->
        <div id="calendar-agenda-container">
          ${this.renderMonthlyAgenda(year, month)}
        </div>
      </div>
    `;

    // Automatically focus and scroll to today's date in the agenda
    const today = new Date();
    if (today.getMonth() === month && today.getFullYear() === year) {
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      setTimeout(() => {
        this.scrollToDate(dateStr);
      }, 500);
    }
  },

  renderCompactKeyItem(label, color) {
    return `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">
        <div style="width: 10px; height: 10px; background: ${color}; border-radius: 50%; box-shadow: 0 2px 4px ${color}44;"></div>
        ${label}
      </div>
    `;
  },

  renderCompactDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const d = prevMonthDays - firstDay + i + 1;
      days.push(`<div style="height: 44px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: var(--text-tertiary); opacity: 0.3;">${d}</div>`);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = this.events.filter(e => e.date === dateStr);
      const isToday = dateStr === todayStr;
      const seasonColor = this.getLiturgicalColor(year, month, d, dayEvents);

      days.push(`
        <div class="calendar-day-btn" 
             onclick="LiturgicalCalendarPage.scrollToDate('${dateStr}')"
             style="height: 44px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;
                    background: ${isToday ? 'var(--primary-50)' : 'transparent'};
                    color: ${isToday ? 'var(--primary-600)' : 'var(--text-primary)'};">
          
          <span style="font-weight: 800; font-size: 0.9rem;">${d}</span>
          
          <div style="display: flex; gap: 3px; margin-top: 4px;">
            ${dayEvents.length > 0 ? `
              <div style="width: 4px; height: 4px; background: ${seasonColor}; border-radius: 50%;"></div>
            ` : ''}
          </div>
        </div>
      `);
    }

    return days.join('');
  },

  renderMonthlyAgenda(year, month) {
    const isTa = SAC_COMMON.currentLang === 'ta';
    const months = isTa ? [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ] : [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = this.events.filter(e => e.date === dateStr);
      const dateObj = new Date(year, month, d);
      
      const seasonInfo = this.getCurrentSeasonInfo(month, year);
      const seasonKey = seasonInfo.name.toLowerCase().includes('lent') || seasonInfo.name.includes('தவ') ? 'lent' : 
                       (seasonInfo.name.toLowerCase().includes('easter') || seasonInfo.name.includes('ஈஸ்டர்') ? 'easter' : 'ordinary');
      const dailyVerse = LiturgicalData.getDailyVerse(year, month, d, seasonKey);

      days.push(`
        <div class="agenda-item" id="agenda-day-${dateStr}">
          <div style="text-align: center;">
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase;">${dateObj.toLocaleDateString(isTa ? 'ta' : 'en', { weekday: 'short' })}</div>
            <div class="date-number" style="font-size: 1.5rem; font-weight: 900; color: var(--primary-700); line-height: 1.1;">${d}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Daily Bible Word -->
            <div style="background: linear-gradient(to right, var(--primary-50), white); padding: 12px 16px; border-radius: 14px; border: 1px dashed var(--primary-200);">
              <div style="font-size: 0.65rem; font-weight: 800; color: var(--primary-400); text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                <span class="material-icons" style="font-size: 12px;">auto_stories</span> ${isTa ? 'இன்றைய இறைவசனம்' : 'Daily Bible Word'}
              </div>
              <p style="margin: 0; font-size: 0.85rem; font-style: italic; color: var(--primary-900); line-height: 1.4; font-weight: 600;">"${isTa ? dailyVerse.ta : dailyVerse.en}"</p>
            </div>

            ${dayEvents.length > 0 ? dayEvents.map(e => `
              <div class="calendar-event-wrap" style="background: var(--primary-50); padding: 16px 20px; position: relative; border-left: 4px solid ${e.color || 'var(--primary-500)'}; border-radius: 20px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                  <div style="flex: 1;">
                    ${e.isSaint ? `<div style="font-size: 0.65rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 2px;">${isTa ? 'புனிதர் நினைவு' : 'Saints Day'}</div>` : ''}
                    <h4 class="calendar-event-title" style="font-weight: 900; font-size: 1rem; color: var(--primary-900); margin: 0; line-height: 1.2;">${e.name}</h4>
                  </div>
                  ${e.time ? `
                    <span class="calendar-event-time" style="font-size: 0.6rem; font-weight: 900; color: var(--primary-600); background: white; padding: 3px 8px; border-radius: 8px; box-shadow: var(--shadow-xs); white-space: nowrap; flex-shrink: 0; border: 1px solid var(--primary-100);">
                      ${e.time}
                    </span>
                  ` : ''}
                </div>
                ${e.description ? `<p class="calendar-event-desc" style="margin: 0; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${e.description}</p>` : ''}
              </div>
            `).join('') : ''}
          </div>
        </div>
      `);
    }

    return `
      <div class="calendar-agenda-card" style="position: relative;">
        <!-- Premium Sticky Header -->
        <div class="agenda-sticky-header">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 900; color: var(--primary-900); margin: 0; letter-spacing: -0.5px;">
              ${months[month]} ${year}
            </h2>
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1.2px; margin-top: 2px;">${isTa ? 'தினசரி வழிபாட்டு முறை' : 'Daily Liturgical Calendar'}</div>
          </div>
          <div style="background: var(--primary); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; box-shadow: 0 4px 12px var(--primary-glow); display: flex; align-items: center; justify-content: center;">
            ${this.events.length} ${isTa ? 'நிகழ்வுகள்' : 'Events'}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${days.join('')}
        </div>
      </div>
    `;
  },

  async changeMonth(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const currentSeason = this.getCurrentSeasonInfo(month, year);
    const isTa = SAC_COMMON.currentLang === 'ta';
    
    const months = isTa ? [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ] : [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Update Headers
    const titleEl = document.getElementById('calendar-month-year');
    if(titleEl) titleEl.innerText = `${months[month]} ${year}`;
    
    const seasonIndicator = document.getElementById('calendar-season-indicator');
    if(seasonIndicator) {
      seasonIndicator.innerHTML = `<span class="material-icons" style="font-size: 16px;">auto_awesome</span> ${currentSeason.name}`;
      seasonIndicator.style.color = currentSeason.color;
    }

    // Update Grid with fade effect
    const grid = document.getElementById('calendar-grid-container');
    if(grid) {
      grid.style.opacity = '0';
      setTimeout(() => {
        grid.innerHTML = this.renderCompactDays(year, month);
        grid.style.opacity = '1';
      }, 150);
    }

    // Update Agenda with fade effect
    const agenda = document.getElementById('calendar-agenda-container');
    if(agenda) {
      agenda.style.opacity = '0.5';
      agenda.style.pointerEvents = 'none';
      
      await this.fetchEvents();
      agenda.innerHTML = this.renderMonthlyAgenda(year, month);
      agenda.style.opacity = '1';
      agenda.style.pointerEvents = 'auto';
    }
  },

  scrollToDate(dateStr) {
    const el = document.getElementById(`agenda-day-${dateStr}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const originalBg = el.style.background;
      el.style.background = 'var(--primary-50)';
      el.style.transition = 'background 0.5s';
      setTimeout(() => { el.style.background = originalBg; }, 1000);
    }
  },

  async fetchEvents() {
    let userEvents = [];
    const isTa = SAC_COMMON.currentLang === 'ta';
    
    if (window.SAC_DATABASE) {
      userEvents = await window.SAC_DATABASE.get("events") || [];
      const allAnnouncements = await window.SAC_DATABASE.get("announcements") || [];
      const announcements = allAnnouncements.filter(a => a.isActive !== false);
      
      const mappedAnnouncements = announcements.map(a => ({
        id: a.id || `ann_${Math.random()}`,
        date: a.date,
        name: isTa ? (a.titleTa || a.titleEn) : (a.titleEn || a.titleTa),
        description: isTa ? (a.contentTa || a.contentEn) : (a.contentEn || a.contentTa),
        type: 'announcement',
        color: '#f59e0b'
      }));
      
      userEvents = [...userEvents, ...mappedAnnouncements];
    }
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Generate events for the whole month based on LiturgicalData
    const autoEvents = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let d = 1; d <= daysInMonth; d++) {
      const feast = LiturgicalData.getFeast(month, d);
      if (feast) {
        autoEvents.push({
          id: `feast_${month}_${d}`,
          date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          name: isTa ? feast.ta : feast.en,
          type: 'feast',
          color: feast.color,
          isSaint: true,
          status: 'upcoming'
        });
      }
    }

    // Filter user events for this month only to keep it light
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const relevantUserEvents = userEvents.filter(e => e.date && e.date.startsWith(monthPrefix));

    this.events = [...autoEvents, ...relevantUserEvents];
  },

  getCurrentSeasonInfo(month, year) {
    const isTa = SAC_COMMON.currentLang === 'ta';
    if ((month === 1 && new Date().getDate() > 15) || month === 2 || (month === 3 && new Date().getDate() < 15)) return { name: isTa ? 'தவக்காலம்' : 'Lent', color: '#673ab7' };
    if ((month === 11 && new Date().getDate() >= 25) || (month === 0 && new Date().getDate() <= 6)) return { name: isTa ? 'கிறிஸ்துமஸ் காலம்' : 'Christmas', color: '#ffc107' };
    if (month === 3 && new Date().getDate() >= 15) return { name: isTa ? 'ஈஸ்டர் காலம்' : 'Easter', color: '#ffc107' };
    if (month === 11 && new Date().getDate() < 25) return { name: isTa ? 'திருவருகைக் காலம்' : 'Advent', color: '#673ab7' };
    return { name: isTa ? 'சாதாரண காலம்' : 'Ordinary Time', color: '#4caf50' };
  },

  getLiturgicalColor(year, month, day, events) {
    const feastEvent = events.find(e => e.type === 'feast' || e.isSaint);
    if (feastEvent && feastEvent.color) return feastEvent.color;
    
    const fixed = LiturgicalData.getFeast(month, day);
    if (fixed) return fixed.color;

    if ((month === 1 && day > 15) || month === 2 || (month === 3 && day < 15)) return '#673ab7'; 
    if ((month === 11 && day >= 25) || (month === 0 && day <= 6)) return '#ffc107';
    if (month === 3 && day >= 15) return '#ffc107';
    return '#4caf50';
  }
};
