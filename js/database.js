/* St. Antony's Church Public Website Database Logic (Bilingual Local & Firebase Sync) */

const SAC_DATABASE = {
  // Fallback initial data structure (Bilingual)
  defaultData: {
    settings: {
      churchNameEn: "St. Antony's Church",
      churchNameTa: "புனித அந்தோணியார் ஆலயம்",
      locationEn: "Vadakku Paganur",
      locationTa: "வடக்கு பாகனூர்",
      addressEn: "St. Antony's Church, Vadakku Paganur - 630312, Tamil Nadu, India.",
      addressTa: "புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர் - 630312, தமிழ்நாடு, இந்தியா.",
      phone: "+91 94860 12345",
      email: "contact@stacpaganur.in",
      heroTagEn: "Shrine of St. Antony",
      heroTagTa: "புனித அந்தோணியார் திருத்தலம்",
      heroHeadlineEn: "Welcome to St. Antony's Church",
      heroHeadlineTa: "புனித அந்தோணியார் ஆலயத்திற்கு அன்போடு வரவேற்கிறோம்",
      heroLeadEn: "Welcome to our parish family. Join us in worship, find spiritual peace, and receive blessings in our sacred home.",
      heroLeadTa: "அமைதியும் அன்பும் தவழும் புனித பூமியில், எங்கள் பங்கு சமூகத்துடன் இணைந்து இறைவனின் அருளையும் நன்மைகளையும் பெற்று மகிழுங்கள்."
    },
    mass_schedules: [

      { id: "mass_sun", dayEn: "SUNDAY", dayTa: "ஞாயிற்றுக்கிழமை", time: "06:00 AM", typeEn: "Sunday Mass", typeTa: "ஞாயிறு திருப்பலி", category: "SUNDAY", isActive: true },
      { id: "mass_tue", dayEn: "TUESDAY", dayTa: "செவ்வாய்க்கிழமை", time: "06:00 AM & 06:00 PM", typeEn: "Tuesday Special Mass", typeTa: "செவ்வாய் சிறப்பு திருப்பலி", category: "TUESDAY", isActive: true },
      { id: "mass_daily", dayEn: "MON - SAT", dayTa: "திங்கள் - சனி", time: "06:00 AM", typeEn: "Daily Mass", typeTa: "தினசரி திருப்பலி", category: "DAILY", isActive: true }
    ],
    announcements: [
      {
        id: "notice_1",
        date: "2026-05-19",
        category: "Feast",
        titleEn: "St. Antony's Annual Feast 2026",
        titleTa: "புனித அந்தோணியார் ஆண்டு பெருவிழா 2026",
        contentEn: "The annual grand festival of St. Antony will commence with the flag hoisting ceremony on June 4th, 2026, and conclude with the grand car procession on June 13th, 2026. All are welcome to receive blessings.",
        contentTa: "புனித அந்தோணியாரின் ஆண்டு பெருவிழா வருகிற ஜூன் 4, 2026 அன்று கொடியேற்றத்துடன் தொடங்கி, ஜூன் 13, 2026 அன்று ஆடம்பர தேர்ப்பவனியுடன் நிறைவடைகிறது. இறைமக்கள் அனைவரும் பங்கேற்று அருள்பெற அன்போடு அழைக்கிறோம்.",
        eventDate: "2026-06-04",
        expiryDate: "2026-06-15",
        isActive: true
      },
      {
        id: "notice_2",
        date: "2026-05-18",
        category: "Announcement",
        titleEn: "Catechism Classes Resume",
        titleTa: "மறைக்கல்வி வகுப்புகள் துவக்கம்",
        contentEn: "Sunday Catechism classes for children will resume on June 7th, 2026, immediately following the morning Holy Mass. Parents are requested to enroll their children.",
        contentTa: "குழந்தைகளுக்கான ஞாயிறு மறைக்கல்வி வகுப்புகள் வருகிற ஜூன் 7, 2026 முதல் காலை திருப்பலிக்குப் பின் துவங்க உள்ளன. பெற்றோர்கள் தங்கள் பிள்ளைகளை சேர்க்குமாறு கேட்டுக் கொள்ளப்படுகிறார்கள்.",
        eventDate: "2026-06-07",
        expiryDate: "2026-06-10",
        isActive: true
      }
    ],
    legacy_timeline: [
      {
        id: "legacy_1",
        year: "1924",
        titleEn: "The Humble Foundation",
        titleTa: "ஆலய அடித்தளம்",
        descEn: "The first simple thatched roof chapel was constructed in Vadakku Paganur village, establishing a local place for communal prayer.",
        descTa: "வடக்கு பாகனூர் கிராமத்தில் விசுவாசிகளின் ஜெபக் கூட்டத்திற்காக எளிய ஓலை வேய்ந்த கூரையின் கீழ் முதல் இறை இல்லம் அமைக்கப்பட்டது.",
        isActive: true
      },
      {
        id: "legacy_2",
        year: "1960",
        titleEn: "New Stone Church",
        titleTa: "புதிய கல் கோவில்",
        descEn: "Through the collective efforts and physical labor of the parishioners, the church was expanded and rebuilt with stone, replacing the old thatched structure.",
        descTa: "பங்கு மக்களின் கூட்டு முயற்சியாலும் உடல் உழைப்பாலும் ஆலயம் விரிவாக்கப்பட்டு, பழைய ஓலைக் கூரைக்கு பதிலாக புதிய கல் கட்டடமாக எழுப்பப்பட்டது.",
        isActive: true
      },
      {
        id: "legacy_3",
        year: "1995",
        titleEn: "Elevation to Independent Parish",
        titleTa: "தனி பங்காக அறிவிப்பு",
        descEn: "St. Antony's Church was officially elevated to the status of an independent parish, with its first resident parish priest appointed by the Bishop.",
        descTa: "புனித அந்தோணியார் ஆலயம் தனி பங்காக உயர்த்தப்பட்டு, முதல் பங்குத் தந்தை ஆயரால் நியமிக்கப்பட்டார்.",
        isActive: true
      },
      {
        id: "legacy_4",
        year: "2020",
        titleEn: "Renovated Shrine",
        titleTa: "புதுப்பிக்கப்பட்ட திருத்தலம்",
        descEn: "The church interior infrastructure was completely modernized, featuring new altar designs, advanced sound systems, and improved seating for the faithful.",
        descTa: "ஆலயத்தின் உள்கட்டமைப்புகள் முழுமையாக புதுப்பிக்கப்பட்டு, புதிய பலிபீட வடிவமைப்பு, மேம்படுத்தப்பட்ட ஒலிபெருக்கி வசதிகள் மற்றும் இறைமக்களுக்கான புதிய இருக்கைகள் அமைக்கப்பட்டன.",
        isActive: true
      }
    ],
    sacraments: [
      {
        id: "sac_1",
        nameEn: "Holy Baptism",
        nameTa: "திருமுழுக்கு (ஞானஸ்நானம்)",
        descEn: "The first step of joining God's family, washing away original sin, and entering into the holy Catholic Church.",
        descTa: "ஆதி பாவத்தை போக்கி, கத்தோலிக்க திருச்சபையில் இணைந்து இறைவனின் பிள்ளையாக மாறும் முதல் மற்றும் முதன்மையான அருட்சாதனம்.",
        reqEn: "1. Child's official birth certificate.\n2. Parents' Church marriage certificate.\n3. Godparents' Confirmation certificate.",
        reqTa: "1. குழந்தையின் அதிகாரப்பூர்வ பிறப்புச் சான்றிதழ்.\n2. பெற்றோரின் கத்தோலிக்க திருமண சான்றிதழ்.\n3. ஞானபெற்றோரின் உறுதிபூசுதல் சான்றிதழ்."
      },
      {
        id: "sac_2",
        nameEn: "First Holy Communion",
        nameTa: "நற்கருணை (புதுநன்மை)",
        descEn: "The source and summit of our faith, where children receive the actual Body and Blood of Jesus Christ for spiritual strength.",
        descTa: "கிறிஸ்தவ வாழ்வின் மையமும் உன்னதமுமான இயேசுவின் திருவுடலையும் திருஇரத்தத்தையும் முதன்முறையாக உட்கொண்டு ஆன்ம பலம் பெறும் திருவருட்சாதனம்.",
        reqEn: "1. Child's Holy Baptism certificate.\n2. Minimum age of 9 years.\n3. Regular attendance in 1-year preparatory Catechism class.",
        reqTa: "1. குழந்தையின் திருமுழுக்கு (ஞானஸ்நான) சான்றிதழ்.\n2. குறைந்தபட்சம் 9 வயது பூர்த்தியாகியிருக்க வேண்டும்.\n3. ஒரு வருட தயாரிப்பு மறைக்கல்வி வகுப்புகளில் முறையாகப் பங்கேற்றிருக்க வேண்டும்."
      },
      {
        id: "sac_3",
        nameEn: "Confirmation",
        nameTa: "உறுதிபூசுதல் (நெய்பூசுதல்)",
        descEn: "Sealing the believer with the gifts of the Holy Spirit, perfecting baptismal grace, and strengthening them to be witnesses of Christ.",
        descTa: "தூய ஆவியாரின் கொடைகளால் முத்திரையிடப்பட்டு, திருமுழுக்கின் அருளை நிறைவு செய்து, விசுவாசத்தின் சாட்சிகளாக வாழச் செய்யும் அருள்சாதனம்.",
        reqEn: "1. Baptism and First Holy Communion certificates.\n2. Minimum age of 14 years.\n3. Regular attendance in Confirmation preparation courses.",
        reqTa: "1. திருமுழுக்கு மற்றும் புதுநன்மை சான்றிதழ்கள்.\n2. குறைந்தபட்சம் 14 வயது பூர்த்தியாகியிருக்க வேண்டும்.\n3. உறுதிபூசுதல் சிறப்பு தயாரிப்பு வகுப்புகளில் பங்கேற்றிருக்க வேண்டும்."
      },
      {
        id: "sac_4",
        nameEn: "Holy Matrimony",
        nameTa: "திருமணம்",
        descEn: "A sacred lifelong covenant between a man and a woman in the presence of God and the parish community.",
        descTa: "இறைவனின் முன்னிலையிலும் திருச்சபை சமூகத்தின் முன்னிலையிலும் ஒரு ஆணும் பெண்ணும் அன்பில் இணையும் புனிதமான வாழ்வொப்பந்தம்.",
        reqEn: "1. Baptism, Communion & Confirmation certificates of both.\n2. Church Marriage Preparation Course certificate.\n3. Notice submitted to the Parish Priest at least 3 months prior.",
        reqTa: "1. மணமக்கள் இருவரின் திருமுழுக்கு, புதுநன்மை, உறுதிபூசுதல் சான்றிதழ்கள்.\n2. திருச்சபை வழங்கும் திருமண தயாரிப்பு பயிற்சி சான்றிதழ்.\n3. திருமணத்திற்கு 3 மாதங்களுக்கு முன்பே பங்குத்தந்தையை சந்தித்து அறிவிப்பு செய்தல்."
      }
    ],
    prayer_requests: [
      {
        id: "prayer_1",
        name: "Savariar",
        email: "savar@example.com",
        message: "Requesting special prayers for the good health of my elderly parents.",
        date: "2026-05-19T10:00:00Z",
        category: "health",
        prayCount: 24,
        status: "pending"
      },
      {
        id: "prayer_2",
        name: "Maria",
        email: "maria@example.com",
        message: "Prayers for the successful completion of university exams for my daughter.",
        date: "2026-05-18T14:30:00Z",
        category: "family",
        prayCount: 42,
        status: "prayed"
      }
    ],
    daily_liturgy: [
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
        reading1TextEn: "When Peter entered, Cornelius met him and, falling at his feet, paid him homage. Peter, however, raised him up, saying, 'Get up. I myself am also a human being.'\nThen Peter proceeded to speak and said, 'In truth, I see that God shows no partiality. Rather, in every nation whoever fears him and acts uprightly is acceptable to him.'",
        reading1TextTa: "பேதுரு உள்ளே வந்தபோது கொர்னேலியு அவருக்கு எதிர்கொண்டுபோய் அவர் காலில் விழுந்து வணங்கினார். பேதுரு அவரைத் தூக்கியெழுப்பி, 'எழுந்திருங்கள், நானும் ஒரு மனிதன்தான்' என்றார்.\nபின்பு பேதுரு பேசத் தொடங்கி, 'கடவுள் ஆள்பார்த்துச் செயல்படுவதில்லை என்பதை நான் உண்மையாகவே உணர்கிறேன். அவருக்கு அஞ்சி, நேர்மையாகச் செயல்படுபவர் எந்தச் சினத்தவராயினும் அவரை அவர் ஏற்றுக் கொள்கிறார்' என்றார்.",
        psalmRef: "Ps 98:1, 2-3, 3-4",
        psalmResponseEn: "The Lord has revealed to the nations his saving power.",
        psalmResponseTa: "ஆண்டவர் தம் மீட்பை அறிவித்தார்.",
        psalmTextEn: "Sing to the LORD a new song, for he has done wondrous deeds; His right hand has won victory for him, his holy arm.\nR. The Lord has revealed to the nations his saving power.",
        psalmTextTa: "ஆண்டவருக்குப் புதியதொரு பாடல் பாடுங்கள்; ஏனெனில், அவர் வியத்தகு செயல்கள் புரிந்துள்ளார். அவருடைய வலக்கையும் புனிதமிகு புயமும் அவருக்கு வெற்றியை அளித்துள்ளன.\nபல்லவி: ஆண்டவர் தம் மீட்பை அறிவித்தார்.",
        reading2TitleEn: "First Letter of John",
        reading2TitleTa: "திருத்தூதர் யோவான் எழுதிய முதல் திருமுகத்திலிருந்து வாசகம்",
        reading2Ref: "1 Jn 4:7-10",
        reading2TextEn: "Beloved, let us love one another, because love is of God; everyone who loves is begotten by God and knows God. Whoever is without love does not know God, for God is love.",
        reading2TextTa: "அன்பார்ந்தவர்களே, நாம் ஒருவரிடம் ஒருவர் அன்பு செலுத்துவோமாக. ஏனெனில் அன்பு கடவுளிடமிருந்து வருகிறது. அன்பு செலுத்தும் எவரும் கடவுளிடமிருந்து பிறந்தவர்; அவர் கடவுளை அறிவார். அன்பில்லாதவர் கடவுளை அறியார்; ஏனெனில் கடவுள் அன்பே.",
        gospelTitleEn: "Gospel according to John",
        gospelTitleTa: "யோவான் எழுதிய நற்செய்தியிலிருந்து வாசகம்",
        gospelRef: "Jn 15:9-17",
        gospelTextEn: "Jesus said to his disciples: 'As the Father loves me, so I also love you. Remain in my love.\nIf you keep my commandments, you will remain in my love, just as I have kept my Father's commandments and remain in his love.'",
        gospelTextTa: "இயேசு தம் சீடரை நோக்கிக் கூறியது: 'என் தந்தை என்மீது அன்பு கொண்டுள்ளது போல நானும் உங்கள்மீது அன்பு கொண்டுள்ளேன். என் அன்பில் நிலைத்திருங்கள்.\nநான் என் தந்தையின் கட்டளைகளைக் கடைப்பிடித்து அவரது அன்பில் நிலைத்திருப்பது போல, நீங்களும் என் கட்டளைகளைக் கடைப்பிடித்தால் என் அன்பில் நிலைத்திருப்பீர்கள்.'",
        reflectionEn: "Today's readings remind us of the universal nature of God's love. Just as Peter realized that God shows no partiality, Jesus commands us to love one another as He has loved us. This love is not just a feeling, but an active choice to keep His commandments and bear fruit that will last.\nLet us ask ourselves today: How can I better show God's impartial love to those around me?",
        reflectionTa: "இன்றைய வாசகங்கள் கடவுளின் அன்பின் உலகளாவிய தன்மையை நமக்கு நினைவூட்டுகின்றன. கடவுள் ஆள்பார்த்துச் செயல்படுவதில்லை என்பதை பேதுரு உணர்ந்தது போல, இயேசு நம்மை அன்பு செய்தது போல நாமும் ஒருவரையொருவர் அன்பு செய்யும்படி அவர் கட்டளையிடுகிறார். இந்த அன்பு வெறும் உணர்வல்ல, மாறாக அவரது கட்டளைகளைக் கடைப்பிடித்து நிலைத்திருக்கும் கனிகளைத் தருவதற்கான ஒரு தீவிரமான தேர்வாகும்.\nஇன்று நம்மை நாமே கேட்டுக்கொள்வோம்: என்னைச் சுற்றியுள்ளவர்களுக்கு கடவுளின் பாரபட்சமற்ற அன்பை நான் எவ்வாறு சிறப்பாகக் காட்ட முடியும்?"
      }
    ],
    firebase_config: {
      // NOTE: Hardcode your live Firebase project credentials here to ensure that all public, 
      // mobile, and incognito users automatically connect to the same live database by default!
      enabled: true,
      apiKey: "AIzaSyD2PpMl6jeHehj6GlNS5B1Uni6pos7UkJc",
      authDomain: "stacpaganur.firebaseapp.com",
      projectId: "stacpaganur",
      storageBucket: "stacpaganur.firebasestorage.app",
      messagingSenderId: "495839870905",
      appId: "1:495839870905:web:f9f8ab0446292689a50068",
      vapidKey: "YOUR_PUBLIC_VAPID_KEY_HERE"
    },
    gallery: [
      {
        id: "gallery_1",
        src: "images/gallery_altar.png",
        catTa: "பலிபீடம்",
        catEn: "Sanctuary Altar",
        titleTa: "அழகிய நற்கருணை பலிபீடம்",
        titleEn: "Holy Eucharistic Sanctuary Altar",
        isActive: true
      },
      {
        id: "gallery_2",
        src: "images/gallery_fest.png",
        catTa: "ஆண்டு திருவிழா",
        catEn: "Annual Festival",
        titleTa: "ஆண்டு திருவிழா மின்விளக்கு அலங்காரம்",
        titleEn: "Grand Annual Feast Light Decoration",
        isActive: true
      },
      {
        id: "gallery_3",
        src: "images/gallery_choir.png",
        catTa: "பங்கு பாடகர் குழு",
        catEn: "Parish Liturgical Choir",
        titleTa: "மெழுகுவர்த்தி வழிபாட்டு திருப்பலி பாடல்",
        titleEn: "Solemn Candlelight Liturgical Choir Service",
        isActive: true
      },
      {
        id: "gallery_4",
        src: "images/gallery_statue.png",
        catTa: "பாதுகாவலர்",
        catEn: "Patron Saint Devotion",
        titleTa: "அற்புத புனித அந்தோணியார் திருவுருவச் சிலை",
        titleEn: "Miraculous Statue of St. Antony of Padua",
        isActive: true
      },
      {
        id: "gallery_5",
        src: "images/old_church_altar.png",
        catTa: "பழைய ஆலயம்",
        catEn: "Historical Sanctuary",
        titleTa: "வரலாற்று சிறப்புமிக்க பழைய ஆலய பீடம்",
        titleEn: "Glorious Old Church Altar",
        isActive: true
      },
      {
        id: "gallery_new_1",
        src: "images/opening_ceremony_1.jpg",
        catTa: "திறப்பு விழா",
        catEn: "Opening Ceremony",
        titleTa: "புதிய ஆலய திறப்பு விழா பவனி மற்றும் ஆராதனை",
        titleEn: "New Church Opening Ceremony Procession and Worship",
        isActive: true
      },
      {
        id: "gallery_new_2",
        src: "images/opening_ceremony_2.jpg",
        catTa: "திறப்பு விழா",
        catEn: "Opening Ceremony",
        titleTa: "பேராயர் தலைமையில் புதிய ஆலய அர்ச்சிப்பு மற்றும் வரவேற்பு",
        titleEn: "Blessing of the New Church by the Bishop and Welcome Ceremony",
        isActive: true
      },
      {
        id: "gallery_new_3",
        src: "images/opening_ceremony_3.jpg",
        catTa: "திறப்பு விழா",
        catEn: "Opening Ceremony",
        titleTa: "விழாக்கோலத்தில் புதிய ஆலயம்",
        titleEn: "New Church Illuminated with Grand Lighting during the Ceremony",
        isActive: true
      }
    ]
  },

  // Initialize DB in LocalStorage if not present
  init() {
    this._ensureCollection("sac_settings", this.defaultData.settings);
    this._ensureCollection("sac_mass_schedules", this.defaultData.mass_schedules);
    this._ensureCollection("sac_announcements", this.defaultData.announcements);
    this._ensureCollection("sac_legacy_timeline", this.defaultData.legacy_timeline);
    this._ensureCollection("sac_sacraments", this.defaultData.sacraments);
    this._ensureCollection("sac_prayer_requests", this.defaultData.prayer_requests);
    this._ensureCollection("sac_gallery", this.defaultData.gallery);
    this._ensureCollection("sac_firebase_config", this.defaultData.firebase_config);
    this._ensureCollection("sac_daily_liturgy", this.defaultData.daily_liturgy);

    this.setupFirebaseConnection();

    // Dynamically sync Firebase configuration and VAPID key from Firestore if active
    if (this.isFirebaseActive) {
      this.get("firebase_config").then((config) => {
        if (config && config.apiKey && config.projectId) {
          const localKey = "sac_firebase_config";
          const currentLocal = this.getCollection(localKey) || {};
          
          // Only update and re-connect if the Firestore config is different
          if (JSON.stringify(currentLocal) !== JSON.stringify(config)) {
            this.setCollection(localKey, config);
            this.setupFirebaseConnection();
            console.log("Firebase credentials dynamically synced and updated from Firestore!");
            // Re-trigger messaging registration with new credentials
            if (window.SAC_MESSAGING && window.SAC_MESSAGING.init) {
              window.SAC_MESSAGING.init();
            }
          }
        }
      }).catch(err => {
        console.warn("Could not sync Firebase config on startup:", err);
      });
    }

    // Async force migration for new gallery items (works for both Local and Firebase)
    setTimeout(async () => {
      try {
        const items = await this.get("gallery");
        if (items && !items.some(i => i.id === 'gallery_5')) {
          const newItem = this.defaultData.gallery.find(i => i.id === 'gallery_5');
          if (newItem) {
            await this.save("gallery", newItem);
            // Trigger refresh event so UI updates if already loaded
            window.dispatchEvent(new CustomEvent('sacDataRefreshed', { detail: { collection: 'gallery' } }));
          }
        }
      } catch (e) {
        console.error("Migration failed", e);
      }
    }, 500);
  },

  _ensureCollection(key, defaultValue) {
    let existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } else if (key === 'sac_firebase_config') {
      let parsed = JSON.parse(existing);
      let modified = false;
      // If config is missing, has dummy placeholders, or has outdated storageBucket, let's force update
      if (!parsed || 
          !parsed.apiKey || 
          parsed.apiKey.includes("PASTE_YOUR") || 
          parsed.apiKey === "PASTE_YOUR_FIREBASE_API_KEY_HERE" ||
          parsed.storageBucket === "stacpaganur.appspot.com" ||
          !parsed.appId || 
          parsed.appId.includes("PASTE_YOUR")) {
        parsed = { ...defaultValue };
        modified = true;
      }
      if (modified) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    } else if (key === 'sac_announcements') {
      // Migrate existing announcements to ensure they have an eventDate
      let parsed = JSON.parse(existing);
      let modified = false;
      parsed.forEach(item => {
        if (!item.eventDate) {
          item.eventDate = item.date;
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    } else if (key === 'sac_gallery') {
      // Migrate existing gallery to include the old_church_altar.png if missing
      let parsed = JSON.parse(existing);
      let modified = false;
      if (!parsed.some(item => item.id === 'gallery_5')) {
        let newItem = defaultValue.find(i => i.id === 'gallery_5');
        if (newItem) {
          parsed.push(newItem);
          modified = true;
        }
      }
      
      // Migration: Clean up old mixed language catTa (e.g. "பலிபீடம் | Sanctuary" -> "பலிபீடம்")
      parsed.forEach(item => {
        if (item.catTa && item.catTa.includes(' | ')) {
          item.catTa = item.catTa.split(' | ')[0].trim();
          modified = true;
        }
      });

      if (modified) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  },

  // Dynamic Firebase Initializer based on Admin Configuration
  db: null,
  isFirebaseActive: false,

  setupFirebaseConnection() {
    const config = this.getCollection("sac_firebase_config");
    if (config && config.enabled && config.apiKey && config.projectId) {
      try {
        if (window.firebase) {
          // Initialize or reuse Firebase App
          let app;
          if (window.firebase.apps.length === 0) {
            app = window.firebase.initializeApp(config);
          } else {
            app = window.firebase.app();
          }
          this.db = window.firebase.firestore();
          this.isFirebaseActive = true;
          console.log("Firebase Firestore successfully connected via custom Admin configuration!");
        }
      } catch (error) {
        console.error("Failed to initialize custom Firebase configuration:", error);
        this.isFirebaseActive = false;
        this.db = null;
      }
    } else {
      this.isFirebaseActive = false;
      this.db = null;
      console.log("Using browser LocalStorage as local database.");
    }
  },

  // Data fetching helper (Loads from Firestore if active, else falls back to LocalStorage)
  async get(collectionName) {
    const localKey = "sac_" + collectionName;
    const localData = this.getCollection(localKey);
    
    // Explicitly define which collections are single objects. Everything else is an array collection.
    const objectCollections = ["settings", "firebase_config"];
    const isArrayType = !objectCollections.includes(collectionName);
    
    // Auto-heal helper to repair any literal "undefined" string values corrupted in Firestore
    const sanitizeObj = (obj, colName) => {
      const defaults = this.defaultData[colName] || {};
      if (!obj) return { ...defaults };
      const clean = { ...defaults, ...obj };
      for (const key in clean) {
        if (clean[key] === "undefined" || clean[key] === null) {
          clean[key] = defaults[key] !== undefined ? defaults[key] : "";
        }
      }
      return clean;
    };

    if (this.isFirebaseActive && this.db) {
      try {
        // Enforce a strict 3-second timeout on Firebase requests.
        // If the network is spotty or blocked by an adblocker, we must not freeze the app forever.
        const fetchPromise = this.db.collection(collectionName).get();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Firebase request timed out (3s)")), 3000)
        );
        
        const snapshot = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!snapshot.empty) {
          const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (isArrayType) {
            return results;
          } else {
            // It's a single object (like settings)
            const genDoc = results.find(r => r.id === "general") || results[0];
            const healed = sanitizeObj(genDoc, collectionName);
            
            // If the Firestore was corrupted with "undefined" strings, auto-update it with healed values
            if (JSON.stringify(genDoc) !== JSON.stringify(healed)) {
              await this.db.collection(collectionName).doc("general").set(healed).catch(e => console.warn("Auto-heal failed", e));
            }
            return healed;
          }
        } else {
          // If Firestore collection is empty, seed it with LocalStorage data so it's not blank
          const fallbackData = localData || this.defaultData[collectionName];
          const dataToSeed = fallbackData || (isArrayType ? [] : {});
          
          if (isArrayType) {
            for (const item of dataToSeed) {
              const { id, ...dataWithoutId } = item;
              if (id) {
                 await this.db.collection(collectionName).doc(id).set(dataWithoutId).catch(e => console.warn("Seed failed", e));
              }
            }
          } else if (Object.keys(dataToSeed).length > 0) {
            const healed = sanitizeObj(dataToSeed, collectionName);
            await this.db.collection(collectionName).doc("general").set(healed).catch(e => console.warn("Seed failed", e));
            return healed;
          }
          return dataToSeed;
        }
      } catch (err) {
        console.warn(`Firestore read failed or timed out for ${collectionName}, falling back to LocalStorage:`, err.message);
        return isArrayType ? (localData || []) : sanitizeObj(localData, collectionName);
      }
    }

    return isArrayType ? (localData || []) : sanitizeObj(localData, collectionName);
  },

  getCollection(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  setCollection(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert("Local storage limit reached! You have saved too many high-resolution photos. Please delete some old ones first.");
      }
      console.error("Storage error:", e);
      throw e;
    }
  },

  // Universal CRUD helper
  async save(collectionName, data) {
    const localKey = "sac_" + collectionName;
    
    // Save to LocalStorage first (for instant local response and fallback)
    if (collectionName === "settings" || collectionName === "firebase_config") {
      const existing = this.getCollection(localKey) || {};
      this.setCollection(localKey, { ...existing, ...data });
    } else {
      // It's a collection array
      const items = this.getCollection(localKey) || [];
      if (data.id) {
        // Update
        const idx = items.findIndex(item => item.id === data.id);
        if (idx !== -1) {
          items[idx] = data;
        } else {
          items.push(data);
        }
      } else {
        // Add
        data.id = collectionName + "_" + Date.now();
        items.push(data);
      }
      this.setCollection(localKey, items);
    }

    // Sync to Firestore if active
    if (this.isFirebaseActive && this.db) {
      try {
        if (collectionName === "settings" || collectionName === "firebase_config") {
          await this.db.collection(collectionName).doc("general").set(data, { merge: true });
        } else {
          const { id, ...dataWithoutId } = data;
          await this.db.collection(collectionName).doc(id).set(dataWithoutId);
        }
      } catch (err) {
        console.error(`Firestore save failed for ${collectionName}:`, err);
      }
    }

    // Special trigger: Re-initialize Firebase if configuration changes
    if (collectionName === "firebase_config") {
      this.setupFirebaseConnection();
    }

    return data;
  },

  // Delete helper
  async delete(collectionName, id) {
    const localKey = "sac_" + collectionName;
    
    // Delete from LocalStorage
    const items = this.getCollection(localKey) || [];
    const filtered = items.filter(item => item.id !== id);
    this.setCollection(localKey, filtered);

    // Sync to Firestore if active
    if (this.isFirebaseActive && this.db) {
      try {
        await this.db.collection(collectionName).doc(id).delete();
      } catch (err) {
        console.error(`Firestore delete failed for ${collectionName} with id ${id}:`, err);
      }
    }

    return true;
  }
};

// Auto-run DB init
SAC_DATABASE.init();
