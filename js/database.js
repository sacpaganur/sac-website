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
      {
        id: "mass_1",
        dayEn: "Sunday",
        dayTa: "ஞாயிற்றுக்கிழமை",
        typeEn: "Sunday Holy Mass",
        typeTa: "ஞாயிறு திருப்பலி",
        time: "06:00 AM",
        category: "sunday"
      },
      {
        id: "mass_2",
        dayEn: "Tuesday",
        dayTa: "செவ்வாய்க்கிழமை",
        typeEn: "Tuesday Novena Mass",
        typeTa: "செவ்வாய் சிறப்பு திருப்பலி",
        time: "06:00 AM & 06:00 PM",
        category: "tuesday"
      },
      {
        id: "mass_3",
        dayEn: "Monday - Saturday",
        dayTa: "திங்கள் - சனி",
        typeEn: "Daily Holy Mass",
        typeTa: "தினசரி திருப்பli",
        time: "06:00 AM",
        category: "daily"
      }
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
        expiryDate: "2026-06-15"
      },
      {
        id: "notice_2",
        date: "2026-05-18",
        category: "Announcement",
        titleEn: "Catechism Classes Resume",
        titleTa: "மறைக்கல்வி வகுப்புகள் துவக்கம்",
        contentEn: "Sunday Catechism classes for children will resume on June 7th, 2026, immediately following the morning Holy Mass. Parents are requested to enroll their children.",
        contentTa: "குழந்தைகளுக்கான ஞாயிறு மறைக்கல்வி வகுப்புகள் வருகிற ஜூன் 7, 2026 முதல் காலை திருப்பலிக்குப் பின் துவங்க உள்ளன. பெற்றோர்கள் தங்கள் பிள்ளைகளை சேர்க்குமாறு கேட்டுக் கொள்ளப்படுகிறார்கள்.",
        expiryDate: "2026-06-10"
      }
    ],
    legacy_timeline: [
      {
        id: "legacy_1",
        year: "1924",
        titleEn: "The Humble Foundation",
        titleTa: "ஆலய அடித்தளம்",
        descEn: "The first simple thatched roof chapel was constructed in Vadakku Paganur village, establishing a local place for communal prayer.",
        descTa: "வடக்கு பாகனூர் கிராமத்தில் விசுவாசிகளின் ஜெபக் கூட்டத்திற்காக எளிய ஓலை வேய்ந்த கூரையின் கீழ் முதல் இறை இல்லம் அமைக்கப்பட்டது."
      },
      {
        id: "legacy_2",
        year: "1960",
        titleEn: "The Stone Sanctuary",
        titleTa: "புதிய கல் கோவில்",
        descEn: "With the unified contributions and manual labor of the parish community, a beautiful permanent stone sanctuary was built.",
        descTa: "பங்கு மக்களின் கூட்டு முயற்சியாலும் உடல் உழைப்பாலும் ஆலயம் அழகிய கல் கட்டடமாக எழுப்பப்பட்டு அர்ப்பணிக்கப்பட்டது."
      },
      {
        id: "legacy_3",
        year: "1995",
        titleEn: "Independent Parish Status",
        titleTa: "தனி பங்காக அறிவிப்பு",
        descEn: "St. Antony's Church was canonically raised to an independent parish status, and the first resident parish priest was appointed.",
        descTa: "புனித அந்தோணியார் ஆலயம் தனி பங்காக உயர்த்தப்பட்டு, முதல் பங்குத்தந்தை அதிகாரப்பூர்வமாக நியமிக்கப்பட்டார்."
      },
      {
        id: "legacy_4",
        year: "2020",
        titleEn: "Modern Shrine Renovation",
        titleTa: "புதுப்பிக்கப்பட்ட திருத்தலம்",
        descEn: "The entire church structure was beautifully renovated with modern architectural inputs, stained glass designs, and beautiful surrounding shrines.",
        descTa: "ஆலயத்தின் உள்கட்டமைப்புகள் முழுமையாக புதுப்பிக்கப்பட்டு, வண்ணக் கண்ணாடி ஓவியங்கள் மற்றும் எழிலார்ந்த பீடத்துடன் நவீன ஆலயமாக அர்ச்சிப்பு செய்யப்பட்டது."
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
        status: "pending"
      },
      {
        id: "prayer_2",
        name: "Maria",
        email: "maria@example.com",
        message: "Prayers for the successful completion of university exams for my daughter.",
        date: "2026-05-18T14:30:00Z",
        status: "prayed"
      }
    ],
    firebase_config: {
      enabled: false,
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    },
    gallery: [
      {
        id: "gallery_1",
        src: "images/gallery_altar.png",
        catTa: "பலிபீடம் | Sanctuary",
        catEn: "Sanctuary Altar",
        titleTa: "அழகிய நற்கருணை பலிபீடம்",
        titleEn: "Holy Eucharistic Sanctuary Altar"
      },
      {
        id: "gallery_2",
        src: "images/gallery_fest.png",
        catTa: "திருவிழா | Festival",
        catEn: "Annual Festival",
        titleTa: "ஆண்டு திருவிழா மின்விளக்கு அலங்காரம்",
        titleEn: "Grand Annual Feast Light Decoration"
      },
      {
        id: "gallery_3",
        src: "images/gallery_choir.png",
        catTa: "பங்கு பாடகர் குழு | Choir",
        catEn: "Parish Liturgical Choir",
        titleTa: "மெழுகுவர்த்தி வழிபாட்டு திருப்பலி பாடல்",
        titleEn: "Solemn Candlelight Liturgical Choir Service"
      },
      {
        id: "gallery_4",
        src: "images/gallery_statue.png",
        catTa: "பாதுகாவலர் | Patron",
        catEn: "Patron Saint Devotion",
        titleTa: "அற்புத புனித அந்தோணியார் திருவுருவச் சிலை",
        titleEn: "Miraculous Statue of St. Antony of Padua"
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

    this.setupFirebaseConnection();
  },

  _ensureCollection(key, defaultValue) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
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
    const isArrayType = Array.isArray(localData || this.defaultData[collectionName]);
    
    // Auto-heal helper to repair any literal "undefined" string values corrupted in Firestore
    const sanitizeSettings = (obj) => {
      const defaults = this.defaultData.settings;
      if (!obj) return { ...defaults };
      const clean = { ...defaults, ...obj };
      for (const key in clean) {
        if (
          clean[key] === undefined || 
          clean[key] === null || 
          clean[key] === "undefined" || 
          clean[key] === ""
        ) {
          clean[key] = defaults[key];
        }
      }
      return clean;
    };

    if (this.isFirebaseActive && this.db) {
      try {
        const snapshot = await this.db.collection(collectionName).get();
        if (!snapshot.empty) {
          const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (isArrayType) {
            return results;
          } else {
            // It's a single object (like settings)
            const genDoc = results.find(r => r.id === "general") || results[0];
            const healed = sanitizeSettings(genDoc);
            
            // If the Firestore was corrupted with "undefined" strings, auto-update it with healed values
            if (JSON.stringify(genDoc) !== JSON.stringify(healed)) {
              await this.db.collection(collectionName).doc("general").set(healed);
            }
            return healed;
          }
        } else {
          // If Firestore collection is empty, seed it with LocalStorage data so it's not blank
          const dataToSeed = localData || this.defaultData[collectionName];
          if (isArrayType) {
            for (const item of dataToSeed) {
              const { id, ...dataWithoutId } = item;
              await this.db.collection(collectionName).doc(id).set(dataWithoutId);
            }
          } else if (dataToSeed) {
            const healed = sanitizeSettings(dataToSeed);
            await this.db.collection(collectionName).doc("general").set(healed);
            return healed;
          }
          return dataToSeed;
        }
      } catch (err) {
        console.warn(`Firestore read failed for ${collectionName}, falling back to LocalStorage:`, err);
        return isArrayType ? (localData || []) : sanitizeSettings(localData);
      }
    }

    return isArrayType ? (localData || []) : sanitizeSettings(localData);
  },

  getCollection(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  setCollection(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Universal CRUD helper
  async save(collectionName, data) {
    const localKey = "sac_" + collectionName;
    
    // Save to LocalStorage first (for instant local response and fallback)
    if (collectionName === "settings" || collectionName === "firebase_config") {
      this.setCollection(localKey, data);
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
        if (collectionName === "settings") {
          await this.db.collection(collectionName).doc("general").set(data);
        } else if (collectionName === "firebase_config") {
          // don't store secrets in public firestore for security
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
