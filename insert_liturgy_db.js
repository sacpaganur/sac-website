const fs = require('fs');

const dbPath = 'd:/SAC Website/js/database.js';
let dbJS = fs.readFileSync(dbPath, 'utf8');

const dataAnchor = `    firebase_config: {`;
const dataInsert = `    daily_liturgy: [
      {
        id: "liturgy_today",
        date: new Date().toISOString().split('T')[0],
        seasonEn: "6th Sunday of Easter",
        seasonTa: "பாஸ்கா காலம் 6-ம் ஞாயிறு",
        saintEn: "St. Christopher Magallanes and Companions",
        saintTa: "புனித கிறிஸ்தோபர் மகல்லனஸ் மற்றும் தோழர்கள்",
        reading1TitleEn: "Acts of the Apostles",
        reading1TitleTa: "திருத்தூதர் பணிகள் நூலிலிருந்து வாசகம்",
        reading1Ref: "Acts 10:25-26, 34-35, 44-48",
        reading1TextEn: "When Peter entered, Cornelius met him and, falling at his feet, paid him homage. Peter, however, raised him up, saying, 'Get up. I myself am also a human being.'\\nThen Peter proceeded to speak and said, 'In truth, I see that God shows no partiality. Rather, in every nation whoever fears him and acts uprightly is acceptable to him.'",
        reading1TextTa: "பேதுரு உள்ளே வந்தபோது கொர்னேலியு அவருக்கு எதிர்கொண்டுபோய் அவர் காலில் விழுந்து வணங்கினார். பேதுரு அவரைத் தூக்கியெழுப்பி, 'எழுந்திருங்கள், நானும் ஒரு மனிதன்தான்' என்றார்.\\nபின்பு பேதுரு பேசத் தொடங்கி, 'கடவுள் ஆள்பார்த்துச் செயல்படுவதில்லை என்பதை நான் உண்மையாகவே உணர்கிறேன். அவருக்கு அஞ்சி, நேர்மையாகச் செயல்படுபவர் எந்தச் சினத்தவராயினும் அவரை அவர் ஏற்றுக் கொள்கிறார்' என்றார்.",
        psalmRef: "Ps 98:1, 2-3, 3-4",
        psalmResponseEn: "The Lord has revealed to the nations his saving power.",
        psalmResponseTa: "ஆண்டவர் தம் மீட்பை அறிவித்தார்.",
        psalmTextEn: "Sing to the LORD a new song, for he has done wondrous deeds; His right hand has won victory for him, his holy arm.\\nR. The Lord has revealed to the nations his saving power.",
        psalmTextTa: "ஆண்டவருக்குப் புதியதொரு பாடல் பாடுங்கள்; ஏனெனில், அவர் வியத்தகு செயல்கள் புரிந்துள்ளார். அவருடைய வலக்கையும் புனிதமிகு புயமும் அவருக்கு வெற்றியை அளித்துள்ளன.\\nபல்லவி: ஆண்டவர் தம் மீட்பை அறிவித்தார்.",
        reading2TitleEn: "First Letter of John",
        reading2TitleTa: "திருத்தூதர் யோவான் எழுதிய முதல் திருமுகத்திலிருந்து வாசகம்",
        reading2Ref: "1 Jn 4:7-10",
        reading2TextEn: "Beloved, let us love one another, because love is of God; everyone who loves is begotten by God and knows God. Whoever is without love does not know God, for God is love.",
        reading2TextTa: "அன்பார்ந்தவர்களே, நாம் ஒருவரிடம் ஒருவர் அன்பு செலுத்துவோமாக. ஏனெனில் அன்பு கடவுளிடமிருந்து வருகிறது. அன்பு செலுத்தும் எவரும் கடவுளிடமிருந்து பிறந்தவர்; அவர் கடவுளை அறிவார். அன்பில்லாதவர் கடவுளை அறியார்; ஏனெனில் கடவுள் அன்பே.",
        gospelTitleEn: "Gospel according to John",
        gospelTitleTa: "யோவான் எழுதிய நற்செய்தியிலிருந்து வாசகம்",
        gospelRef: "Jn 15:9-17",
        gospelTextEn: "Jesus said to his disciples: 'As the Father loves me, so I also love you. Remain in my love.\\nIf you keep my commandments, you will remain in my love, just as I have kept my Father's commandments and remain in his love.'",
        gospelTextTa: "இயேசு தம் சீடரை நோக்கிக் கூறியது: 'என் தந்தை என்மீது அன்பு கொண்டுள்ளது போல நானும் உங்கள்மீது அன்பு கொண்டுள்ளேன். என் அன்பில் நிலைத்திருங்கள்.\\nநான் என் தந்தையின் கட்டளைகளைக் கடைப்பிடித்து அவரது அன்பில் நிலைத்திருப்பது போல, நீங்களும் என் கட்டளைகளைக் கடைப்பிடித்தால் என் அன்பில் நிலைத்திருப்பீர்கள்.'",
        reflectionEn: "Today's readings remind us of the universal nature of God's love. Just as Peter realized that God shows no partiality, Jesus commands us to love one another as He has loved us. This love is not just a feeling, but an active choice to keep His commandments and bear fruit that will last.\\nLet us ask ourselves today: How can I better show God's impartial love to those around me?",
        reflectionTa: "இன்றைய வாசகங்கள் கடவுளின் அன்பின் உலகளாவிய தன்மையை நமக்கு நினைவூட்டுகின்றன. கடவுள் ஆள்பார்த்துச் செயல்படுவதில்லை என்பதை பேதுரு உணர்ந்தது போல, இயேசு நம்மை அன்பு செய்தது போல நாமும் ஒருவரையொருவர் அன்பு செய்யும்படி அவர் கட்டளையிடுகிறார். இந்த அன்பு வெறும் உணர்வல்ல, மாறாக அவரது கட்டளைகளைக் கடைப்பிடித்து நிலைத்திருக்கும் கனிகளைத் தருவதற்கான ஒரு தீவிரமான தேர்வாகும்.\\nஇன்று நம்மை நாமே கேட்டுக்கொள்வோம்: என்னைச் சுற்றியுள்ளவர்களுக்கு கடவுளின் பாரபட்சமற்ற அன்பை நான் எவ்வாறு சிறப்பாகக் காட்ட முடியும்?"
      }
    ],
    firebase_config: {`;

const initAnchor = `this._ensureCollection("sac_firebase_config", this.defaultData.firebase_config);`;
const initInsert = `this._ensureCollection("sac_firebase_config", this.defaultData.firebase_config);
    this._ensureCollection("sac_daily_liturgy", this.defaultData.daily_liturgy);`;

if (dbJS.includes(dataAnchor) && !dbJS.includes("daily_liturgy: [")) {
    dbJS = dbJS.replace(dataAnchor, dataInsert);
    console.log("Mock data inserted.");
}

if (dbJS.includes(initAnchor) && !dbJS.includes("sac_daily_liturgy")) {
    dbJS = dbJS.replace(initAnchor, initInsert);
    console.log("Init method updated.");
}

fs.writeFileSync(dbPath, dbJS, 'utf8');
console.log("database.js update complete.");
