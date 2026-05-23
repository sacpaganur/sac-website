const fs = require('fs');

const commonPath = 'd:/SAC Website/js/common.js';
let commonJS = fs.readFileSync(commonPath, 'utf8');

const tamilAnchor = `"heritage.y2026Desc": "உலகெங்கும் உள்ள நமது உறவுகளை இணைக்கும் வகையில், பங்கு இணையதளம் மற்றும் விர்ச்சுவல் டூர் சேவை துவங்கப்பட்டது.",`;
const tamilInsert = `"heritage.y2026Desc": "உலகெங்கும் உள்ள நமது உறவுகளை இணைக்கும் வகையில், பங்கு இணையதளம் மற்றும் விர்ச்சுவல் டூர் சேவை துவங்கப்பட்டது.",
      "liturgy.heroTitle": "இன்றைய இறைவார்த்தை",
      "liturgy.saintLabel": "இன்றைய புனிதர்",
      "liturgy.loadingMsg": "இறைவார்த்தைகள் ஏற்றப்படுகின்றன...",
      "liturgy.ctaTitle": "திருப்பலியில் பங்கேற்போம்",
      "liturgy.ctaDesc": "இறைவார்த்தையை வாழ்வாக்க வாராந்திர திருப்பலிகளில் பங்கேற்று இறையாசீர் பெறுவோம்.",
      "liturgy.ctaBtn": "திருப்பலி நேரங்கள்",`;

const engAnchor = `"heritage.y2026Desc": "To connect our community worldwide, the official parish website and virtual tour service were launched.",`;
const engInsert = `"heritage.y2026Desc": "To connect our community worldwide, the official parish website and virtual tour service were launched.",
      "liturgy.heroTitle": "Daily Liturgy",
      "liturgy.saintLabel": "Saint of the Day",
      "liturgy.loadingMsg": "Loading today's liturgy...",
      "liturgy.ctaTitle": "Join the Holy Mass",
      "liturgy.ctaDesc": "Let the Word of God transform your life. Join us for our weekly Eucharistic celebrations.",
      "liturgy.ctaBtn": "Mass Schedule",`;

if (commonJS.includes(tamilAnchor) && !commonJS.includes("liturgy.heroTitle")) {
    commonJS = commonJS.replace(tamilAnchor, tamilInsert);
    console.log("Tamil translations inserted.");
}

if (commonJS.includes(engAnchor) && !commonJS.includes("liturgy.heroTitle", commonJS.indexOf(engAnchor))) {
    commonJS = commonJS.replace(engAnchor, engInsert);
    console.log("English translations inserted.");
}

fs.writeFileSync(commonPath, commonJS, 'utf8');
console.log("common.js translation update complete.");
