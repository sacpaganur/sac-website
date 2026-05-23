const fs = require('fs');

// 1. Update common.js with navbar translations
const commonPath = 'd:/SAC Website/js/common.js';
let commonJS = fs.readFileSync(commonPath, 'utf8');

const navTamilAnchor = `"nav.schedule": "வழிபாடுகள்",`;
const navTamilInsert = `"nav.schedule": "வழிபாடுகள்",
      "nav.liturgy": "இறைவார்த்தை",`;

const navEngAnchor = `"nav.schedule": "Schedule",`;
const navEngInsert = `"nav.schedule": "Schedule",
      "nav.liturgy": "Liturgy",`;

if (commonJS.includes(navTamilAnchor) && !commonJS.includes("nav.liturgy")) {
    commonJS = commonJS.replace(navTamilAnchor, navTamilInsert);
}
if (commonJS.includes(navEngAnchor) && !commonJS.includes(`"nav.liturgy": "Liturgy"`)) {
    commonJS = commonJS.replace(navEngAnchor, navEngInsert);
}
fs.writeFileSync(commonPath, commonJS, 'utf8');

// 2. Update navbar.js
const navPath = 'd:/SAC Website/js/navbar.js';
let navJS = fs.readFileSync(navPath, 'utf8');

const linkAnchor = `{ href: 'schedule.html', id: 'nav-lnk-schedule', i18n: 'nav.schedule', label: 'வழிபாடுகள்', icon: 'church' },`;
const linkInsert = `{ href: 'schedule.html', id: 'nav-lnk-schedule', i18n: 'nav.schedule', label: 'வழிபாடுகள்', icon: 'church' },
    { href: 'liturgy.html', id: 'nav-lnk-liturgy', i18n: 'nav.liturgy', label: 'இறைவார்த்தை', icon: 'menu_book' },`;

if (navJS.includes(linkAnchor) && !navJS.includes("liturgy.html")) {
    navJS = navJS.replace(linkAnchor, linkInsert);
    fs.writeFileSync(navPath, navJS, 'utf8');
}
console.log("Navbar updated with Liturgy page.");
