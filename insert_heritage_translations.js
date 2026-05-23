const fs = require('fs');

const commonPath = 'd:/SAC Website/js/common.js';
let commonJS = fs.readFileSync(commonPath, 'utf8');

const tamilAnchor = `"notices.noNotices": "தற்போது எந்த அறிவிப்புகளும் இல்லை. பின்னர் சரிபார்க்கவும்.",`;
const tamilInsert = `"notices.noNotices": "தற்போது எந்த அறிவிப்புகளும் இல்லை. பின்னர் சரிபார்க்கவும்.",
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
      "heritage.y2026Desc": "உலகெங்கும் உள்ள நமது உறவுகளை இணைக்கும் வகையில், பங்கு இணையதளம் மற்றும் விர்ச்சுவல் டூர் சேவை துவங்கப்பட்டது.",`;

const engAnchor = `"notices.noNotices": "There are currently no active notices. Check back later.",`;
const engInsert = `"notices.noNotices": "There are currently no active notices. Check back later.",
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
      "heritage.y2026Desc": "To connect our community worldwide, the official parish website and virtual tour service were launched.",`;

if (commonJS.includes(tamilAnchor) && !commonJS.includes("heritage.heroKicker")) {
    commonJS = commonJS.replace(tamilAnchor, tamilInsert);
    console.log("Tamil translations inserted.");
}

if (commonJS.includes(engAnchor) && !commonJS.includes("Our Heritage")) {
    commonJS = commonJS.replace(engAnchor, engInsert);
    console.log("English translations inserted.");
}

fs.writeFileSync(commonPath, commonJS, 'utf8');
console.log("common.js translation update complete.");
