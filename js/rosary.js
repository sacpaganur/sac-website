const ROSARY_PRAYERS = {
    signOfCross: {
        en: { title: "Sign of the Cross", text: "In the name of the Father,<br>and of the Son,<br>and of the Holy Spirit.<br>Amen.", type: "cross" },
        ta: { title: "சிலுவை அடையாளம்", text: "தந்தை, மகன்,<br>தூய ஆவியாரின் பெயராலே.<br>ஆமென்.", type: "cross" }
    },
    creed: {
        en: { title: "Apostles' Creed", text: "I believe in God, the Father almighty, Creator of heaven and earth,<br>and in Jesus Christ, his only Son, our Lord,<br>who was conceived by the Holy Spirit,<br>born of the Virgin Mary,<br>suffered under Pontius Pilate,<br>was crucified, died and was buried;<br>he descended into hell;<br>on the third day he rose again from the dead;<br>he ascended into heaven,<br>and is seated at the right hand of God the Father almighty;<br>from there he will come to judge the living and the dead.<br><br>I believe in the Holy Spirit,<br>the holy catholic Church,<br>the communion of saints,<br>the forgiveness of sins,<br>the resurrection of the body,<br>and life everlasting.<br>Amen.", type: "large" },
        ta: { title: "விசுவாச அறிக்கை", text: "விண்ணகத்தையும் மண்ணகத்தையும் படைத்த<br>எல்லாம் வல்ல தந்தையாகிய கடவுளை நம்புகிறேன்.<br>அவருடைய ஒரே மகனாகிய<br>நம் ஆண்டவர் இயேசு கிறிஸ்துவையும் நம்புகிறேன்.<br><br>இவர் தூய ஆவியாரால் கருவாகி,<br>தூய கன்னி மரியாவிடமிருந்து பிறந்தார்.<br>பொந்தியு பிலாத்தின் அதிகாரத்தில் பாடுபட்டு,<br>சிலுவையில் அறையப்பட்டு, இறந்து, அடக்கம் செய்யப்பட்டார்.<br>பாதாளத்தில் இறங்கி, மூன்றாம் நாள்<br>இறந்தோரிடமிருந்து உயிர்த்தெழுந்தார்.<br>விண்ணகத்திற்கு எழுந்தருளி, எல்லாம் வல்ல<br>தந்தையாகிய கடவுளின் வலப்பக்கத்தில் வீற்றிருக்கிறார்.<br>அங்கிருந்து வாழ்வோருக்கும் இறந்தோருக்கும்<br>தீர்ப்பு வழங்க வருவார்.<br><br>தூய ஆவியாரை நம்புகிறேன்.<br>தூய கத்தோலிக்கத் திருச்சபையையும்,<br>புனிதர்களின் உறவையும் நம்புகிறேன்.<br>பாவ மன்னிப்பை நம்புகிறேன்.<br>உடலின் உயிர்ப்பை நம்புகிறேன்.<br>நிலை வாழ்வை நம்புகிறேன்.<br>ஆமென்.", type: "large" }
    },
    ourFather: {
        en: { title: "Our Father", text: "Our Father who art in heaven,<br>hallowed be thy name.<br>Thy kingdom come.<br>Thy will be done, on earth as it is in heaven.<br><br>Give us this day our daily bread; and forgive us our trespasses,<br>as we forgive those who trespass against us;<br>and lead us not into temptation,<br>but deliver us from evil.<br>Amen.", type: "large" },
        ta: { title: "கிறிஸ்து கற்பித்த செபம்", text: "விண்ணுலகில் இருக்கின்ற எங்கள் தந்தையே<br>உமது பெயர் தூயது எனப் போற்றப்பெறுக!<br>உமது ஆட்சி வருக<br><br>உமது திருவுளம் விண்ணுலகில் நிறைவேறுவது போல<br>மண்ணுலகிலும் நிறைவேறுக<br><br>எங்கள் அன்றாட உணவை இன்று எங்களுக்குத் தாரும்<br>எங்களுக்கு எதிராக குற்றம் செய்வோரை<br>நாங்கள் மன்னிப்பது போல எங்கள் குற்றங்களை மன்னியும்<br>எங்களைச் சோதனைக்கு உட்படுத்தாதேயும்,<br>தீயோனிடமிருந்து எங்களை விடுவித்தருளும்.<br>ஆமென்.", type: "large" }
    },
    hailMary: {
        en: { title: "Hail Mary", text: "Hail Mary, full of grace,<br>the Lord is with thee.<br>Blessed art thou amongst women<br>and blessed is the fruit of thy womb, Jesus.<br><br>Holy Mary, Mother of God,<br>pray for us sinners<br>now and at the hour of our death.<br>Amen.", type: "small" },
        ta: { title: "மங்கள வார்த்தை செபம்", text: "அருள்மிகப் பெற்ற மரியே வாழ்க!<br>ஆண்டவர் உம்முடனே.<br>பெண்களுக்குள் ஆசி பெற்றவர் நீரே.<br>உம்முடைய திருவயிற்றின் கனியாகிய<br>இயேசுவும் ஆசி பெற்றவரே.<br><br>புனித மரியே, இறைவனின் தாயே,<br>பாவிகளாய் இருக்கிற எங்களுக்காக<br>இப்பொழுதும் எங்கள் இறப்பின் வேளையிலும்<br>வேண்டிக்கொள்ளும்.<br>ஆமென்.", type: "small" }
    },
    gloryBe: {
        en: { title: "Glory Be", text: "Glory be to the Father,<br>and to the Son,<br>and to the Holy Spirit.<br><br>As it was in the beginning,<br>is now, and ever shall be,<br>world without end.<br>Amen.", type: "small" },
        ta: { title: "மூவொரு இறைவனுக்கு மாட்சி", text: "தந்தைக்கும் மகனுக்கும்<br>தூய ஆவியாருக்கும் மாட்சி உண்டாகுக.<br><br>தொடக்கத்தில் இருந்ததுபோல<br>இப்பொழுதும் எப்பொழுதும்<br>என்றென்றும் இருப்பதாக.<br>ஆமென்.", type: "small" }
    },
    fatima: {
        en: { title: "Fatima Prayer", text: "O my Jesus, forgive us our sins,<br>save us from the fires of hell,<br>and lead all souls to Heaven,<br>especially those in most need of Thy mercy.", type: "small" },
        ta: { title: "பாத்திமா செபம்", text: "ஓ என் இயேசுவே, எங்கள் பாவங்களை மன்னியும்.<br>நரக நெருப்பிலிருந்து எங்களை மீட்டருளும்.<br>எல்லாரையும் விண்ணுலகப் பாதைக்கு நடத்தியருளும்.<br>உமது இரக்கம் யாருக்கு அதிகம் தேவையோ,<br>அவர்களுக்குச் சிறப்பாக உதவி புரியும்.", type: "small" }
    },
    salveRegina: {
        en: { title: "Hail, Holy Queen", text: "Hail, Holy Queen, Mother of Mercy,<br>our life, our sweetness and our hope.<br>To thee do we cry, poor banished children of Eve:<br>to thee do we send up our sighs,<br>mourning and weeping in this valley of tears.<br><br>Turn then, most gracious Advocate,<br>thine eyes of mercy toward us,<br>and after this our exile,<br>show unto us the blessed fruit of thy womb, Jesus.<br><br>O clement, O loving, O sweet Virgin Mary!<br>Pray for us, O Holy Mother of God,<br>that we may be made worthy of the promises of Christ.", type: "large" },
        ta: { title: "அன்னையை நோக்கி மன்றாட்டு", text: "கிருபை நிறைந்த அன்னையே வாழ்க!<br>எங்கள் வாழ்வே, எங்கள் இனிமையே,<br>எங்கள் நம்பிக்கையே வாழ்க.<br>நாடு கடத்தப்பட்ட ஏவாளின் மக்களாகிய நாங்கள்<br>உம்மைப் பார்த்துக் கதறுகிறோம்.<br>இந்தக் கண்ணீர்ப் பள்ளத்தாக்கிலிருந்து விம்மி அழுது<br>உம்மை நோக்கியே பெருமூச்சு விடுகிறோம்.<br><br>ஆகையால் எங்களுக்காகப் பரிந்து பேசும் அன்னையே!<br>உம்முடைய இரக்கமுள்ள கண்களை<br>எங்கள் பக்கம் திருப்பியருளும்.<br>இந்த நாடு கடத்தப்பட்ட நிலைமை கடந்த பின்,<br>உம்முடைய திருவயிற்றின் ஆசி பெற்ற கனியாகிய<br>இயேசுவை எங்களுக்குக் காட்டியருளும்.<br><br>கருணையும் அன்பும் இனிமையும் நிறைந்த கன்னி மரியே!<br>கிறிஸ்துவின் வாக்குறுதிகளுக்கு<br>நாங்கள் தகுதிபெறும்படி,<br>இறைவனின் தூய அன்னையே,<br>எங்களுக்காக வேண்டிக்கொள்ளும்.", type: "large" }
    }
};

const MYSTERIES = {
    joyful: {
        en: "Joyful Mysteries", ta: "மகிழ்ச்சி நிறை தேவ இரகசியங்கள்",
        decades: [
            { en: "1. The Annunciation", ta: "1. மங்கள வார்த்தை அறிவித்தல்" },
            { en: "2. The Visitation", ta: "2. எலிசபெத்தம்மாளை சந்தித்தல்" },
            { en: "3. The Nativity", ta: "3. இயேசுவின் பிறப்பு" },
            { en: "4. The Presentation", ta: "4. காணிக்கையாக ஒப்புக்கொடுத்தல்" },
            { en: "5. Finding Jesus in the Temple", ta: "5. இயேசுவை தேவாலயத்தில் கண்டுபிடித்தல்" }
        ]
    },
    sorrowful: {
        en: "Sorrowful Mysteries", ta: "துயர நிறை தேவ இரகசியங்கள்",
        decades: [
            { en: "1. The Agony in the Garden", ta: "1. கெத்செமனி தோட்டத்தில் இயேசுவின் வேதனை" },
            { en: "2. The Scourging at the Pillar", ta: "2. கற்றூணில் கட்டுண்டு அடிபடுதல்" },
            { en: "3. The Crowning with Thorns", ta: "3. முள்முடி சூட்டப்படுதல்" },
            { en: "4. The Carrying of the Cross", ta: "4. சிலுவை சுமந்து செல்லுதல்" },
            { en: "5. The Crucifixion", ta: "5. சிலுவையில் அறையப்பட்டு இறத்தல்" }
        ]
    },
    glorious: {
        en: "Glorious Mysteries", ta: "மகிமை நிறை தேவ இரகசியங்கள்",
        decades: [
            { en: "1. The Resurrection", ta: "1. இயேசுவின் உயிர்ப்பு" },
            { en: "2. The Ascension", ta: "2. இயேசுவின் விண்ணேற்பு" },
            { en: "3. The Descent of the Holy Spirit", ta: "3. பரிசுத்த ஆவியின் வருகை" },
            { en: "4. The Assumption", ta: "4. அன்னை மரியாவின் விண்ணேற்பு" },
            { en: "5. The Coronation of Mary", ta: "5. அன்னை மரியாவுக்கு முடிசூட்டுதல்" }
        ]
    },
    luminous: {
        en: "Luminous Mysteries", ta: "ஒளி நிறை தேவ இரகசியங்கள்",
        decades: [
            { en: "1. The Baptism of Christ", ta: "1. யோர்தான் நதியில் திருமுழுக்கு பெறுதல்" },
            { en: "2. The Wedding at Cana", ta: "2. கானா ஊர் திருமணத்தில் முதல் அற்புதம்" },
            { en: "3. The Proclamation of the Kingdom", ta: "3. இறையாட்சியை அறிவித்தல்" },
            { en: "4. The Transfiguration", ta: "4. தாபோர் மலையில் தோற்றம் மாறுதல்" },
            { en: "5. The Institution of the Eucharist", ta: "5. நற்கருணையை ஏற்படுத்துதல்" }
        ]
    }
};

let rosarySequence = [];
let currentStepIndex = 0;

function getMysteryOfTheDay() {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday...
    if (day === 1 || day === 6) return MYSTERIES.joyful; // Mon, Sat
    if (day === 2 || day === 5) return MYSTERIES.sorrowful; // Tue, Fri
    if (day === 3 || day === 0) return MYSTERIES.glorious; // Wed, Sun
    return MYSTERIES.luminous; // Thu
}

function buildSequence() {
    const mystery = getMysteryOfTheDay();
    const seq = [];
    
    // Intro
    seq.push({ type: 'intro', ref: 'signOfCross' });
    seq.push({ type: 'intro', ref: 'creed' });
    seq.push({ type: 'intro', ref: 'ourFather' });
    for(let i=0; i<3; i++) seq.push({ type: 'intro', ref: 'hailMary' });
    seq.push({ type: 'intro', ref: 'gloryBe' });
    seq.push({ type: 'intro', ref: 'fatima' });

    // Decades
    for(let decade=0; decade<5; decade++) {
        // Announce Mystery
        seq.push({ 
            type: 'mystery', 
            custom: true,
            titleEn: mystery.decades[decade].en,
            titleTa: mystery.decades[decade].ta,
            textEn: "Let us meditate on this mystery.",
            textTa: "இந்த தேவ இரகசியத்தை தியானிப்போம்.",
            beadType: 'large'
        });
        
        seq.push({ type: 'decade', ref: 'ourFather' });
        for(let i=0; i<10; i++) seq.push({ type: 'decade', ref: 'hailMary', count: i+1 });
        seq.push({ type: 'decade', ref: 'gloryBe' });
        seq.push({ type: 'decade', ref: 'fatima' });
    }

    // Outro
    seq.push({ type: 'outro', ref: 'salveRegina' });
    seq.push({ type: 'outro', ref: 'signOfCross' });

    return { sequence: seq, mysteryObj: mystery };
}

function updateUI(instant = false) {
    if (rosarySequence.length === 0) return;
    
    const step = rosarySequence[currentStepIndex];
    const isTa = SAC_COMMON.currentLang === 'ta';
    
    const titleEl = document.getElementById('prayer-title');
    const contentEl = document.getElementById('prayer-content');
    const beadEl = document.getElementById('active-bead');
    const progressEl = document.getElementById('bead-counter');
    const textContainer = document.querySelector('.rosary-text-container');
    
    const applyUpdate = () => {
        let pTitle = "", pText = "", pType = "small";
        
        if (step.custom) {
            pTitle = isTa ? step.titleTa : step.titleEn;
            pText = isTa ? step.textTa : step.textEn;
            pType = step.beadType;
        } else {
            const pr = ROSARY_PRAYERS[step.ref];
            pTitle = isTa ? pr.ta.title : pr.en.title;
            pText = isTa ? pr.ta.text : pr.en.text;
            pType = pr.en.type;
        }
        
        if (step.count) {
            pTitle += ` (${step.count}/10)`;
        }

        titleEl.textContent = pTitle;
        contentEl.innerHTML = pText;
        
        // Update Bead visual
        beadEl.className = `rosary-glowing-bead type-${pType}`;
        progressEl.textContent = `${currentStepIndex + 1}/${rosarySequence.length}`;
        
        // Fade in
        textContainer.classList.remove('fade-transition');
        beadEl.style.transform = 'scale(1)';
    };

    if (instant) {
        applyUpdate();
    } else {
        // Fade out
        textContainer.classList.add('fade-transition');
        beadEl.style.transform = 'scale(0.8)';
        setTimeout(applyUpdate, 150);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const { sequence, mysteryObj } = buildSequence();
    rosarySequence = sequence;
    
    const isTa = SAC_COMMON.currentLang === 'ta';
    document.getElementById('mystery-badge').textContent = isTa ? mysteryObj.ta : mysteryObj.en;
    
    // Controls
    document.getElementById('rosary-tap-zone').addEventListener('click', () => {
        if (currentStepIndex < rosarySequence.length - 1) {
            currentStepIndex++;
            updateUI();
        }
    });
    
    document.getElementById('btn-next').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentStepIndex < rosarySequence.length - 1) {
            currentStepIndex++;
            updateUI();
        }
    });

    document.getElementById('btn-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateUI();
        }
    });

    document.getElementById('btn-restart').addEventListener('click', (e) => {
        e.stopPropagation();
        currentStepIndex = 0;
        updateUI();
    });
    
    window.addEventListener('sacLanguageChanged', () => {
        const isTa = SAC_COMMON.currentLang === 'ta';
        document.getElementById('mystery-badge').textContent = isTa ? mysteryObj.ta : mysteryObj.en;
        updateUI(true); // Instant update on language switch
    });
    
    updateUI();
});
