const fs = require('fs');

// 1. Fix common.js translations
const commonPath = 'd:/SAC Website/js/common.js';
let commonJS = fs.readFileSync(commonPath, 'utf8');

// Ensure English translation is present
if (!commonJS.includes('"nav.liturgy": "Liturgy"')) {
    // Find the english translations block
    // Looking for "nav.schedule": "Schedules" or "nav.schedule": "Schedule" in the english block.
    // The english block starts with "en": {
    const enBlockStart = commonJS.indexOf('"en": {');
    if (enBlockStart !== -1) {
        const scheduleIndex = commonJS.indexOf('"nav.schedule":', enBlockStart);
        if (scheduleIndex !== -1) {
            const endOfLine = commonJS.indexOf(',', scheduleIndex);
            commonJS = commonJS.substring(0, endOfLine + 1) + 
                       '\n      "nav.liturgy": "Liturgy",' + 
                       commonJS.substring(endOfLine + 1);
        }
    }
    fs.writeFileSync(commonPath, commonJS, 'utf8');
    console.log("common.js updated with English translation for Liturgy.");
}

// 2. Fix navbar.js order
const navPath = 'd:/SAC Website/js/navbar.js';
let navJS = fs.readFileSync(navPath, 'utf8');

navJS = navJS.replace(/links: \[([\s\S]*?)\]/, function(match, p1) {
    // Manually reconstruct the array in the desired order
    return `links: [
    { href: 'index.html', id: 'nav-lnk-home', i18n: 'nav.home', label: 'முகப்பு', icon: 'home' },
    { href: 'schedule.html', id: 'nav-lnk-schedule', i18n: 'nav.schedule', label: 'வழிபாடுகள்', icon: 'church' },
    { href: 'legacy.html', id: 'nav-lnk-legacy', i18n: 'nav.legacy', label: 'வரலாறு', icon: 'history_edu' },
    { href: 'notices.html', id: 'nav-lnk-notices', i18n: 'nav.notices', label: 'அறிவிப்புகள்', icon: 'campaign' },
    { href: 'liturgy.html', id: 'nav-lnk-liturgy', i18n: 'nav.liturgy', label: 'இறைவார்த்தை', icon: 'menu_book' },
    { href: 'calendar.html', id: 'nav-lnk-calendar', i18n: 'nav.calendar', label: 'நாட்காட்டி', icon: 'event' },
    { href: 'devotion.html', id: 'nav-lnk-devotion', i18n: 'nav.devotion', label: 'பக்தி', icon: 'volunteer_activism' },
    { href: 'gallery.html', id: 'nav-lnk-gallery', i18n: 'nav.gallery', label: 'புகைப்படங்கள்', icon: 'photo_library' },
    { href: 'contact.html', id: 'nav-lnk-contact', i18n: 'nav.contact', label: 'தொடர்பு', icon: 'support_agent' }
  ]`;
});

fs.writeFileSync(navPath, navJS, 'utf8');
console.log("navbar.js updated with new link order.");
