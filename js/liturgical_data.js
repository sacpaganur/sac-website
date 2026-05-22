/**
 * Liturgical Data - Core Feasts and Saints
 * Curated for St. Antony's Church
 */
const LiturgicalData = {
  // Fixed Date Feasts (Month is 0-indexed: 0=Jan, 11=Dec)
  fixedFeasts: {
    '0-1': { en: 'Mary, Mother of God', ta: 'மரியாள், இறைவனின் தாய்', color: '#ffc107' },
    '0-3': { en: 'The Most Holy Name of Jesus', ta: 'இயேசுவின் திருப்பெயர் விழா', color: '#ffc107' },
    '0-17': { en: 'St. Antony the Abbot', ta: 'புனித அந்தோணியார் (துறவி)', color: '#ffc107' },
    '0-20': { en: 'St. Sebastian', ta: 'புனித செபஸ்தியார்', color: '#f44336' },
    '0-25': { en: 'Conversion of St. Paul', ta: 'புனித பவுல் மனமாற்றம்', color: '#ffc107' },
    '0-26': { en: 'St. Timothy & St. Titus', ta: 'புனித திமொத்தேயு மற்றும் தீத்து', color: '#f44336' },
    '0-28': { en: 'St. Thomas Aquinas', ta: 'புனித தோமா அக்குயினாஸ்', color: '#ffc107' },
    '0-31': { en: 'St. John Bosco', ta: 'புனித யோவான் போஸ்கோ', color: '#ffc107' },
    '1-2': { en: 'Presentation of the Lord', ta: 'ஆண்டவருடைய காணிக்கை பெருவிழா', color: '#ffc107' },
    '1-11': { en: 'Our Lady of Lourdes', ta: 'லூர்து அன்னை விழா', color: '#ffc107' },
    '1-22': { en: 'St. Peter\'s Chair', ta: 'புனித பேதுருவின் தலைமைப்பீட விழா', color: '#ffc107' },
    '2-17': { en: 'St. Patrick', ta: 'புனித பாட்ரிக்', color: '#4caf50' },
    '2-19': { en: 'St. Joseph, Spouse of Mary', ta: 'புனித யோசேப்பு, மரியாவின் கணவர்', color: '#ffc107' },
    '2-25': { en: 'The Annunciation of the Lord', ta: 'ஆண்டவருடைய மங்கள வார்த்தை அறிவிப்பு', color: '#ffc107' },
    '3-23': { en: 'St. George', ta: 'புனித ஜார்ஜ்', color: '#f44336' },
    '3-25': { en: 'St. Mark, Evangelist', ta: 'புனித மாற்கு, நற்செய்தியாளர்', color: '#f44336' },
    '3-29': { en: 'St. Catherine of Siena', ta: 'புனித சியன்னா கத்ரீன்', color: '#ffc107' },
    '4-1': { en: 'St. Joseph the Worker', ta: 'புனித தொழிலாளி யோசேப்பு', color: '#ffc107' },
    '4-3': { en: 'St. Philip & St. James', ta: 'புனித பிலிப்பு மற்றும் யாக்கோபு', color: '#f44336' },
    '4-14': { en: 'St. Matthias, Apostle', ta: 'புனித மத்தியா, திருத்தூதர்', color: '#f44336' },
    '4-31': { en: 'Visitation of the Blessed Virgin Mary', ta: 'மரியாள் எலிசபெத்தைச் சந்தித்த விழா', color: '#ffc107' },
    '5-1': { en: 'St. Justin', ta: 'புனித ஜஸ்டின்', color: '#f44336' },
    '5-11': { en: 'St. Barnabas', ta: 'புனித பர்னபா', color: '#f44336' },
    '5-13': { en: 'Feast of St. Antony (Parish Feast)', ta: 'புனித அந்தோணியார் திருவிழா', color: '#f44336', isMajor: true },
    '5-21': { en: 'St. Aloysius Gonzaga', ta: 'புனித அலோசியஸ் கொன்சாகா', color: '#ffc107' },
    '5-24': { en: 'Nativity of St. John the Baptist', ta: 'புனித திருமுழுக்கு யோவானின் பிறப்பு', color: '#ffc107' },
    '5-29': { en: 'St. Peter and St. Paul', ta: 'புனித பேதுரு மற்றும் பவுல்', color: '#f44336' },
    '6-3': { en: 'St. Thomas, Apostle (India)', ta: 'புனித தோமையார், திருத்தூதர்', color: '#f44336' },
    '6-11': { en: 'St. Benedict', ta: 'புனித பெனடிக்ட்', color: '#ffc107' },
    '6-15': { en: 'St. Bonaventure', ta: 'புனித போனவெஞ்சர்', color: '#ffc107' },
    '6-22': { en: 'St. Mary Magdalene', ta: 'புனித மரிய மகதலேனா', color: '#ffc107' },
    '6-25': { en: 'St. James, Apostle', ta: 'புனித யாக்கோபு, திருத்தூதர்', color: '#f44336' },
    '6-31': { en: 'St. Ignatius of Loyola', ta: 'புனித இஞ்ஞாசியார்', color: '#ffc107' },
    '7-4': { en: 'St. John Vianney', ta: 'புனித அருளானந்தர் (ஜான் வியான்னி)', color: '#ffc107' },
    '7-6': { en: 'Transfiguration of the Lord', ta: 'ஆண்டவருடைய உருமாற்ற விழா', color: '#ffc107' },
    '7-8': { en: 'St. Dominic', ta: 'புனித டோமினிக்', color: '#ffc107' },
    '7-10': { en: 'St. Lawrence', ta: 'புனித லாரன்ஸ்', color: '#f44336' },
    '7-15': { en: 'Assumption of the Blessed Virgin Mary', ta: 'புனித கன்னி மரியாவின் விண்ணேற்பு விழா', color: '#ffc107' },
    '7-24': { en: 'St. Bartholomew, Apostle', ta: 'புனித பர்த்தலோமேயு, திருத்தூதர்', color: '#f44336' },
    '7-27': { en: 'St. Monica', ta: 'புனித மோனிகா', color: '#ffc107' },
    '7-28': { en: 'St. Augustine', ta: 'புனித அகஸ்டின்', color: '#ffc107' },
    '8-3': { en: 'St. Gregory the Great', ta: 'புனித பெரிய கிரகோரி', color: '#ffc107' },
    '8-5': { en: 'Mother Teresa of Calcutta', ta: 'புனித கல்கத்தா தெரசா', color: '#ffc107' },
    '8-8': { en: 'Nativity of the Blessed Virgin Mary', ta: 'புனித கன்னி மரியாவின் பிறப்புத் திருவிழா', color: '#ffc107' },
    '8-14': { en: 'Exaltation of the Holy Cross', ta: 'புனித சிலுவை உயர்த்தப்பட்ட விழா', color: '#f44336' },
    '8-21': { en: 'St. Matthew, Apostle & Evangelist', ta: 'புனித மத்தேயு, திருத்தூதர்', color: '#f44336' },
    '8-27': { en: 'St. Vincent de Paul', ta: 'புனித வின்சென்ட் தே பவுல்', color: '#ffc107' },
    '8-29': { en: 'St. Michael, Gabriel & Raphael', ta: 'புனித அதிதூதர்கள் மிகாவேல், காபிரியேல், ரபேல்', color: '#ffc107' },
    '8-30': { en: 'St. Jerome', ta: 'புனித ஜெரோம்', color: '#ffc107' },
    '9-1': { en: 'St. Therese of the Child Jesus', ta: 'புனித குழந்தை இயேசுவின் திரேசா', color: '#ffc107' },
    '9-4': { en: 'St. Francis of Assisi', ta: 'புனித அசிசி பிரான்சிஸ்', color: '#4caf50' },
    '9-7': { en: 'Our Lady of the Rosary', ta: 'புனித ஜெபமாலை அன்னை விழா', color: '#ffc107' },
    '9-15': { en: 'St. Teresa of Avila', ta: 'புனித அவிலா தெரசா', color: '#ffc107' },
    '9-18': { en: 'St. Luke, Evangelist', ta: 'புனித லூக்கா, நற்செய்தியாளர்', color: '#f44336' },
    '9-22': { en: 'St. John Paul II', ta: 'புனித இரண்டாம் யோவான் பவுல்', color: '#ffc107' },
    '9-28': { en: 'St. Simon and St. Jude, Apostles', ta: 'புனித சீமோன் மற்றும் யூதா, திருத்தூதர்கள்', color: '#f44336' },
    '10-1': { en: 'All Saints Day', ta: 'அனைத்துப் புனிதர்கள் விழா', color: '#ffc107' },
    '10-2': { en: 'All Souls Day', ta: 'அனைத்து ஆன்மாக்கள் நினைவு நாள்', color: '#673ab7' },
    '10-9': { en: 'The Lateran Basilica', ta: 'லாத்தரன் பேராலய நேர்ந்தளிப்பு விழா', color: '#ffc107' },
    '10-16': { en: 'St. Margaret Mary Alacoque', ta: 'புனித மார்கரெட் மரியா அலக்கோக்', color: '#ffc107' },
    '10-21': { en: 'Presentation of the Blessed Virgin Mary', ta: 'கன்னி மரியாவின் காணிக்கை விழா', color: '#ffc107' },
    '10-30': { en: 'St. Andrew, Apostle', ta: 'புனித அந்திரேயா, திருத்தூதர்', color: '#f44336' },
    '11-3': { en: 'St. Francis Xavier', ta: 'புனித பிரான்சிஸ் சவேரியார்', color: '#ffc107' },
    '11-7': { en: 'St. Ambrose', ta: 'புனித அம்புரோஸ்', color: '#ffc107' },
    '11-8': { en: 'Immaculate Conception of Mary', ta: 'மரியாவின் அமல உற்பவத் திருவிழா', color: '#ffc107' },
    '11-13': { en: 'St. Lucy', ta: 'புனித லூசியா', color: '#f44336' },
    '11-14': { en: 'St. John of the Cross', ta: 'புனித சிலுவை யோவான்', color: '#ffc107' },
    '11-25': { en: 'Christmas Day', ta: 'கிறிஸ்து பிறப்பு பெருவிழா', color: '#ffc107', isMajor: true },
    '11-26': { en: 'St. Stephen, First Martyr', ta: 'புனித ஸ்தேவான், முதல் மறைசாட்சி', color: '#f44336' },
    '11-27': { en: 'St. John, Apostle & Evangelist', ta: 'புனித யோவான், திருத்தூதர்', color: '#ffc107' },
    '11-28': { en: 'Holy Innocents', ta: 'புனித மாசில்லா குழந்தைகள் விழா', color: '#f44336' }
  },

  // Daily Bible Words (Expanded pool to rotate)
  bibleVerses: {
    ordinary: [
      { en: "The Lord is my shepherd; I shall not want.", ta: "ஆண்டவரே என் ஆயர்; எனக்கேதும் குறையில்லை. (திருப்பாடல் 23:1)" },
      { en: "I can do all things through Christ who strengthens me.", ta: "எனக்கு வலுவூட்டுகிறவரின் துணையால் எதையும் செய்ய எனக்கு ஆற்றல் உண்டு. (பிலிப்பியர் 4:13)" },
      { en: "Be still, and know that I am God.", ta: "அமைதியாயிருங்கள்: நானே கடவுள் என உணர்ந்து கொள்ளுங்கள். (திருப்பாடல் 46:10)" },
      { en: "Love is patient, love is kind.", ta: "அன்பு பொறுமையுள்ளது; அன்பு கனிவுடையது. (1 கொரிந்தியர் 13:4)" },
      { en: "God is our refuge and strength.", ta: "கடவுள் நமக்கு அடைக்கலமும் ஆற்றலுமானவர். (திருப்பாடல் 46:1)" },
      { en: "Trust in the Lord with all your heart.", ta: "முழுமனதோடு ஆண்டவரை நம்பு. (நீதிமொழிகள் 3:5)" },
      { en: "For God so loved the world.", ta: "தம் ஒரே மகன் மீது நம்பிக்கை கொள்ளும் எவரும் அழியாமல் நிலைவாழ்வு பெறும் பொருட்டு அந்த மகனையே அளிக்கும் அளவுக்குக் கடவுள் உலகின் மேல் அன்பு கூர்ந்தார். (யோவான் 3:16)" },
      { en: "The joy of the Lord is your strength.", ta: "ஆண்டவர் அளிக்கும் மகிழ்ச்சியே உங்கள் வலிமை. (நெகேமியா 8:10)" },
      { en: "Ask and it will be given to you.", ta: "கேளுங்கள், உங்களுக்குக் கொடுக்கப்படும். (மத்தேயு 7:7)" },
      { en: "Thy word is a lamp unto my feet.", ta: "உம் வார்த்தையே என் காலடிக்கு விளக்கு. (திருப்பாடல் 119:105)" },
      { en: "The Lord will fight for you; you need only to be still.", ta: "ஆண்டவரே உங்களுக்காகப் போரிடுவார்; நீங்கள் அமைதியாய் இருந்தால் போதும். (விடுதலைப் பயணம் 14:14)" },
      { en: "Rejoice in the Lord always.", ta: "ஆண்டவரோடு இணைந்து என்றும் மகிழ்ச்சியாய் இருங்கள். (பிலிப்பியர் 4:4)" }
    ],
    lent: [
      { en: "Man does not live by bread alone.", ta: "மனிதர் அப்பத்தினால் மட்டுமல்ல, கடவுளின் வாய்ச்சொல் ஒவ்வொன்றாலும் வாழ்வர். (மத்தேயு 4:4)" },
      { en: "Repent and believe in the Gospel.", ta: "மனம் மாறுங்கள்; நற்செய்தியை நம்புங்கள். (மாற்கு 1:15)" },
      { en: "Create in me a clean heart, O God.", ta: "கடவுளே! தூயதோர் உள்ளத்தை என்னுள்ளே படைத்தருளும். (திருப்பாடல் 51:10)" },
      { en: "Return to me with all your heart.", ta: "இப்பொழுதாவது முழு இதயத்தோடு என்னிடம் திரும்பி வாருங்கள். (யோவேல் 2:12)" },
      { en: "If anyone would come after me, let him deny himself.", ta: "எவராவது என்னைப் பின் தொடர விரும்பினால், அவர் தன்னையே துறந்து தம் சிலுவையைத் தூக்கிக்கொண்டு என்னைப் பின் தொடரட்டும். (மத்தேயு 16:24)" }
    ],
    easter: [
      { en: "He is not here; he has risen!", ta: "அவர் இங்கே இல்லை; அவர் உயிருடன் எழுப்பப்பட்டார். (மத்தேயு 28:6)" },
      { en: "Peace be with you.", ta: "உங்களுக்கு அமைதி உரித்தாகுக! (யோவான் 20:19)" },
      { en: "I am the resurrection and the life.", ta: "உயிர்த்தெழுதலும் வாழ்வும் நானே. (யோவான் 11:25)" },
      { en: "Go and make disciples of all nations.", ta: "நீங்கள் போய் எல்லா மக்களினத்தாரையும் சீடராக்குங்கள். (மத்தேயு 28:19)" },
      { en: "Do not be afraid, for I have overcome the world.", ta: "அஞ்சாதீர்கள், நான் உலகை வென்றுவிட்டேன். (யோவான் 16:33)" }
    ]
  },

  /**
   * Returns the feast for a specific date if it exists.
   */
  getFeast(month, day) {
    return this.fixedFeasts[`${month}-${day}`];
  },

  /**
   * Returns a daily bible verse based on the date.
   */
  getDailyVerse(year, month, day, season) {
    const pool = this.bibleVerses[season] || this.bibleVerses.ordinary;
    // Deterministic selection based on date
    const index = (year + month + day) % pool.length;
    return pool[index];
  }
};
