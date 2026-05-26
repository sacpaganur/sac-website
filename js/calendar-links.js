/**
 * St. Antony's Church — Add-to-Calendar Utility
 * Generates Google Calendar, Apple iCal (.ics), and Outlook links
 * for mass schedules, devotions, and parish events.
 * Zero external dependencies.
 */

if (typeof window.SAC_CALENDAR === 'undefined') {
  var SAC_CALENDAR = {
  // Default church location
  LOCATION: "St. Antony's Church, Vadakku Paganur - 630312, Tamil Nadu, India",

  /**
   * Format a JS Date to Google Calendar's required format: YYYYMMDDTHHmmSS
   */
  _toGoogleDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  },

  /**
   * Format a JS Date to iCal's UTC format: YYYYMMDDTHHmmSSZ
   * We use local time with TZID instead for accuracy
   */
  _toICSDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  },

  /**
   * Parse a time string like "06:00 AM" or "06:00 PM" into { hours24, minutes }
   */
  _parseTime(timeStr) {
    if (!timeStr) return null;
    // Handle 24h format like "08:30"
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      return { hours24: parseInt(match24[1]), minutes: parseInt(match24[2]) };
    }
    // Handle 12h format like "06:00 AM"
    const match12 = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match12) {
      let hours = parseInt(match12[1]);
      const minutes = parseInt(match12[2]);
      const ampm = match12[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return { hours24: hours, minutes };
    }
    return null;
  },

  /**
   * Get the next occurrence of a given day of week (0=Sun, 1=Mon, ..., 6=Sat)
   * If today is that day and the time hasn't passed, returns today.
   */
  _getNextDayOfWeek(dayOfWeek, hours, minutes) {
    const now = new Date();
    const result = new Date();
    const currentDay = now.getDay();
    let daysAhead = dayOfWeek - currentDay;
    if (daysAhead < 0) daysAhead += 7;
    if (daysAhead === 0) {
      // Check if time already passed today
      if (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)) {
        daysAhead = 7;
      }
    }
    result.setDate(now.getDate() + daysAhead);
    result.setHours(hours, minutes, 0, 0);
    return result;
  },

  /**
   * Determine the day of week index from a day string
   */
  _dayToIndex(dayStr) {
    if (!dayStr) return -1;
    const lower = dayStr.toLowerCase();
    if (lower.includes('sun') || lower.includes('ஞாயிறு')) return 0;
    if (lower.includes('mon') || lower.includes('திங்கள்')) return 1;
    if (lower.includes('tue') || lower.includes('செவ்வாய்')) return 2;
    if (lower.includes('wed') || lower.includes('புதன்')) return 3;
    if (lower.includes('thu') || lower.includes('வியாழ')) return 4;
    if (lower.includes('fri') || lower.includes('வெள்ளி')) return 5;
    if (lower.includes('sat') || lower.includes('சனி')) return 6;
    return -1;
  },

  /**
   * Generate a Google Calendar URL
   */
  googleUrl(event) {
    const start = this._toGoogleDate(event.startDate);
    const end = this._toGoogleDate(event.endDate);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: event.description || '',
      location: event.location || this.LOCATION,
      sf: 'true'
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  },

  /**
   * Generate an iCal (.ics) file content and return as a downloadable Blob URL
   */
  icsUrl(event) {
    const uid = `sac-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@stacpaganur.in`;
    const now = this._toICSDate(new Date());
    const start = this._toICSDate(event.startDate);
    const end = this._toICSDate(event.endDate);
    const description = (event.description || '').replace(/\n/g, '\\n');
    const location = (event.location || this.LOCATION).replace(/,/g, '\\,');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//St Antony Church Paganur//SAC Website//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=Asia/Kolkata:${start}`,
      `DTEND;TZID=Asia/Kolkata:${end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${event.title} starts in 30 minutes`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  },

  /**
   * Build a calendar event object from a mass schedule data item
   */
  buildFromMass(mass, lang) {
    const isTa = lang === 'ta';
    const title = isTa ? mass.typeTa : mass.typeEn;
    const dayStr = mass.dayEn || '';
    const timeStr = mass.time || '';
    const churchName = isTa
      ? 'புனித அந்தோணியார் ஆலயம், வடக்கு பாகானூர்'
      : this.LOCATION;

    // Parse individual times — handle "06:00 AM & 06:00 PM" as multiple
    const timeEntries = timeStr.split(/\s*[&,]\s*/);
    const events = [];

    for (const t of timeEntries) {
      const parsed = this._parseTime(t.trim());
      if (!parsed) continue;

      // Determine the next date for this mass
      const dayIndex = this._dayToIndex(dayStr);
      let startDate;

      if (dayIndex >= 0) {
        startDate = this._getNextDayOfWeek(dayIndex, parsed.hours24, parsed.minutes);
      } else {
        // Daily mass or range like "MON - SAT" → use tomorrow or today
        startDate = new Date();
        if (startDate.getHours() > parsed.hours24 ||
            (startDate.getHours() === parsed.hours24 && startDate.getMinutes() >= parsed.minutes)) {
          startDate.setDate(startDate.getDate() + 1);
        }
        startDate.setHours(parsed.hours24, parsed.minutes, 0, 0);
      }

      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

      const description = isTa
        ? `${mass.dayTa} திருப்பலி — ${t.trim()}\n\nபுனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர்`
        : `${mass.dayEn} Mass — ${t.trim()}\n\nSt. Antony's Church, Vadakku Paganur`;

      events.push({
        title: `⛪ ${title}`,
        startDate,
        endDate,
        description,
        location: churchName
      });
    }

    return events;
  },

  /**
   * Build a calendar event from a devotion/feast (static data)
   */
  buildFromDevotion(devotion, lang) {
    const isTa = lang === 'ta';
    const title = isTa ? devotion.titleTa : devotion.titleEn;
    const description = isTa ? devotion.descTa : devotion.descEn;

    let startDate, endDate;

    if (devotion.specificDate) {
      // Feast with a known date like June 13
      startDate = new Date(devotion.specificDate);
      startDate.setHours(devotion.startHour || 6, devotion.startMinute || 0, 0, 0);
      endDate = new Date(startDate.getTime() + (devotion.durationMinutes || 120) * 60 * 1000);
    } else if (devotion.dayOfWeek !== undefined) {
      // Recurring like "Every Tuesday"
      const hour = devotion.startHour || 18;
      const minute = devotion.startMinute || 0;
      startDate = this._getNextDayOfWeek(devotion.dayOfWeek, hour, minute);
      endDate = new Date(startDate.getTime() + (devotion.durationMinutes || 120) * 60 * 1000);
    } else {
      // Fallback: next Sunday
      startDate = this._getNextDayOfWeek(0, 8, 30);
      endDate = new Date(startDate.getTime() + 120 * 60 * 1000);
    }

    return [{
      title: `🙏 ${title}`,
      startDate,
      endDate,
      description: description || '',
      location: isTa ? 'புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர்' : this.LOCATION
    }];
  },

  /**
   * Render a compact "Add to Calendar" dropdown button inside a container element
   */
  renderButton(calEvents, containerEl, lang) {
    if (!containerEl || !calEvents || calEvents.length === 0) return;

    const isTa = lang === 'ta';
    const btnLabel = isTa ? 'நாட்காட்டியில் சேர்' : 'Add to Calendar';
    const id = 'cal-' + Math.random().toString(36).substring(2, 8);

    const wrapper = document.createElement('div');
    wrapper.className = 'cal-wrapper';
    wrapper.innerHTML = `
      <button class="cal-add-btn" id="${id}" aria-label="${btnLabel}" aria-expanded="false">
        <span class="material-icons" style="font-size:16px;">event</span>
        <span class="cal-btn-text">${btnLabel}</span>
        <span class="material-icons cal-chevron" style="font-size:14px;">expand_more</span>
      </button>
      <div class="cal-dropdown" id="${id}-dropdown" role="menu">
        <a class="cal-option" role="menuitem" data-provider="google" target="_blank" rel="noopener">
          <span class="cal-option-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 11v2h3.17l-1.07 1.07 1.41 1.42L19 12l-3.49-3.49-1.41 1.42L15.17 11H12z" fill="#4285F4"/><path d="M5 19V5h14v14H5zm2-2h10V7H7v10z" fill="#34A853"/></svg>
          </span>
          Google Calendar
        </a>
        <a class="cal-option" role="menuitem" data-provider="apple">
          <span class="cal-option-icon">🍎</span>
          Apple Calendar
        </a>
        <a class="cal-option" role="menuitem" data-provider="outlook">
          <span class="cal-option-icon">📧</span>
          Outlook
        </a>
      </div>
    `;

    // Event handling
    const btn = wrapper.querySelector('.cal-add-btn');
    const dropdown = wrapper.querySelector('.cal-dropdown');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      // Close all other open dropdowns first
      document.querySelectorAll('.cal-dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.cal-add-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!isOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Set links for each provider
    const event = calEvents[0]; // Use first event for single-time entries

    const googleLink = wrapper.querySelector('[data-provider="google"]');
    googleLink.href = this.googleUrl(event);

    const appleLink = wrapper.querySelector('[data-provider="apple"]');
    appleLink.href = this.icsUrl(event);
    appleLink.download = `${event.title.replace(/[^\w\s]/gi, '').trim().substring(0, 30)}.ics`;

    const outlookLink = wrapper.querySelector('[data-provider="outlook"]');
    outlookLink.href = this.icsUrl(event);
    outlookLink.download = `${event.title.replace(/[^\w\s]/gi, '').trim().substring(0, 30)}.ics`;

    // If there are multiple times (e.g., "6AM & 6PM"), add a note
    if (calEvents.length > 1) {
      const note = document.createElement('div');
      note.className = 'cal-multi-note';
      note.textContent = isTa
        ? `${calEvents.length} நேரங்கள் உள்ளன — முதல் நேரம் சேர்க்கப்படும்`
        : `${calEvents.length} times available — adding first`;
      dropdown.appendChild(note);
    }

    containerEl.appendChild(wrapper);
  }
  };

  window.SAC_CALENDAR = SAC_CALENDAR;

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.cal-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.cal-add-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });
} else {
  var SAC_CALENDAR = window.SAC_CALENDAR;
}
