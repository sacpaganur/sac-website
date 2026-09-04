/* St. Antony's Church Public Website Database Logic (Bilingual Local & Firebase Sync) */

const SAC_DATABASE = {
  // Fallback initial data structure (Bilingual)
  defaultData: {
    settings: {
      churchNameEn: "St. Antony's Church",
      churchNameTa: "புனித அந்தோணியார் ஆலயம்",
      locationEn: "Vadakku Paganur",
      locationTa: "வடக்கு பாகனூர்",
      addressEn: "St. Antony's Church, Vadakku Paganur - 620009, Tamil Nadu, India.",
      addressTa: "புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர் - 620009, தமிழ்நாடு, இந்தியா.",
      phone: "+91 98650 43169",
      email: "sacpaganur@gmail.com",
      heroTagEn: "Shrine of St. Antony",
      heroTagTa: "புனித அந்தோணியார் திருத்தலம்",
      heroHeadlineEn: "Welcome to St. Antony's Church",
      heroHeadlineTa: "புனித அந்தோணியார் ஆலயத்திற்கு அன்போடு வரவேற்கிறோம்",
      heroLeadEn: "Welcome to our parish family. Join us in worship, find spiritual peace, and receive blessings in our sacred home.",
      heroLeadTa: "அமைதியும் அன்பும் தவழும் புனித பூமியில், எங்கள் கிளைப்பங்கு சமூகத்துடன் இணைந்து இறைவனின் அருளையும் நன்மைகளையும் பெற்று மகிழுங்கள்.",
      aiApiKey: typeof atob !== 'undefined' ? atob("QVEuQWI4Uk42SUNWZWVvWlpuYkdYeGM3d3dWX1lUOVpzQVpRU3JVS2lZdVNhZkZzZDVudEE=") : ""
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
        contentEn: "The annual feast of St. Anthony will conclude on June 13, 2026, with a special Holy Mass and a grand car procession in the evening. We lovingly invite all the faithful to participate and receive the blessings of St. Anthony.",
        contentTa: "புனித அந்தோணியாரின் ஆண்டு பெருவிழா வருகிற ஜூன் 13, 2026 அன்று மாலை ஆடம்பர தேர்ப்பவனியுடன் சிறப்பு திருப்பலியுடன் நிறைவடைகிறது. இறைமக்கள் அனைவரும் பங்கேற்று அந்தோணியாரின் அருள்பெற அன்போடு அழைக்கிறோம்.",
        eventDate: "2026-06-13",
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
        isActive: false
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
        descTa: "கிளைப்பங்கு மக்களின் கூட்டு முயற்சியாலும் உடல் உழைப்பாலும் ஆலயம் விரிவாக்கப்பட்டு, பழைய ஓலைக் கூரைக்கு பதிலாக புதிய கல் கட்டடமாக எழுப்பப்பட்டது.",
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
        id: "liturgy_20260904",
        date: "2026-09-04",
        seasonEn: "22nd Week in Ordinary Time",
        seasonTa: "பொதுக்காலம் 22-ஆம் வாரம்",
        saintEn: "St. Rosalia, Virgin",
        saintTa: "புனித ரோசாலியா, கன்னி",
        reading1TitleEn: "A reading from the first Letter of Saint Paul to the Corinthians",
        reading1TitleTa: "திருத்தூதர் பவுல் கொரிந்தியருக்கு எழுதிய முதல் திருமுகத்திலிருந்து வாசகம்",
        reading1Ref: "1 Cor 4:1-5",
        reading1TextEn: "Brothers and sisters: Thus should one regard us: as servants of Christ and stewards of the mysteries of God. Now it is of course required of stewards that one be found trustworthy. It does not concern me in the least that I be judged by you or any human tribunal; I do not even pass judgment on myself; I am not conscious of anything against me, but I do not thereby stand acquitted; the one who judges me is the Lord. Therefore, do not make any judgment before the appointed time, until the Lord comes, for he will bring to light what is hidden in darkness and will manifest the motives of our hearts, and then everyone will receive praise from God.\nThis is the word of the Lord.",
        reading1TextTa: "சகோதரர் சகோதரிகளே, எங்களை கிறிஸ்துவினுடைய பணியாளர்களாகவும் கடவுளின் மறைபொருள்களைப் பொறுப்பாக நிர்வகிப்பவர்களாகவும் கருதுங்கள். நிர்வாகியிடம் எதிர்பார்க்கப்படுவது நம்பகத்தன்மை ஒன்றே. உங்களோ, வேறு எந்த மனித நீதிமன்றமோ என்னை விசாரித்துத் தீர்ப்பளிப்பதைக் குறித்து எனக்குச் சிறிதும் கவலையில்லை; நானே என்னைத் தீர்ப்பிடுவதில்லை. என் மனசாட்சி என்னை எதிலும் குற்றவாளியாகக் காணவில்லை. ஆயினும் நான் குற்றமற்றவன் என்பது இதனால் உறுதியாகிவிடாது; என்னை விசாரித்துத் தீர்ப்பளிப்பவர் ஆண்டவரே. ஆதலால் குறிப்பிட்ட காலத்திற்கு முன், அதாவது ஆண்டவர் வரும்வரை, எதையும் குறித்துத் தீர்ப்பளிக்க வேண்டாம். அவரே இருளில் மறைந்திருப்பவற்றை வெளிச்சத்திற்குக் கொண்டுவருவார்; உள்ளங்களின் எண்ணங்களை வெளிப்படுத்துவார். அப்போது ஒவ்வொருவருக்கும் உரிய பாராட்டு கடவுளிடமிருந்து கிடைக்கும்.\nஇது ஆண்டவர் வழங்கும் அருள்வாக்கு.",
        psalmRef: "Ps 37:3-4, 5-6, 27-28, 39-40",
        psalmResponseEn: "The salvation of the just comes from the Lord.",
        psalmResponseTa: "நீதிமான்களுக்கு மீட்பு ஆண்டவரிடமிருந்தே வருகிறது.",
        psalmTextEn: "Trust in the LORD and do good, that you may dwell in the land and be fed in security. Take delight in the LORD, and he will grant you your heart's requests.\nCommit to the LORD your way; trust in him, and he will act. He will make justice dawn for you like the light; bright as the noonday shall be your vindication.",
        psalmTextTa: "ஆண்டவரில் நம்பிக்கை வைத்து நன்மையைச் செய்; நாட்டில் குடியிருந்து பாதுகாப்போடு வாழ். ஆண்டவரில் மகிழ்ச்சி கொள்; அவர் உன் உள்ளத்து விருப்பங்களை நிறைவேற்றுவார்.\nஉன் வழியை ஆண்டவரிடம் ஒப்படைத்துவிடு; அவரையே நம்பியிரு; அவர் அனைத்தையும் செய்து முடிப்பார். உன் நீதியை வைகறை வெளிச்சத்தைப் போலவும், உன் நேர்மையை நண்பகல் ஒளியைப் போலவும் விளங்கச் செய்வார்.",
        reading2TitleEn: "",
        reading2TitleTa: "",
        reading2Ref: "",
        reading2TextEn: "",
        reading2TextTa: "",
        gospelTitleEn: "A reading from the holy Gospel according to Luke",
        gospelTitleTa: "லூக்கா எழுதிய தூய நற்செய்தியிலிருந்து வாசகம்",
        gospelRef: "Lk 5:33-39",
        gospelTextEn: "The scribes and Pharisees said to Jesus, \"The disciples of John fast often and offer prayers, and the disciples of the Pharisees do the same; but yours eat and drink.\" Jesus answered them, \"Can you make the wedding guests fast while the bridegroom is with them? But the days will come, and when the bridegroom is taken away from them, then they will fast in those days.\" And he also told them a parable. \"No one tears a piece from a new cloak to patch an old one. Otherwise, he will tear the new and the piece from it will not match the old. Likewise, no one pours new wine into old wineskins. Otherwise, the new wine will burst the skins, and it will be spilled, and the skins will be ruined. Rather, new wine must be poured into fresh wineskins.\"\nThis is the Gospel of the Lord.",
        gospelTextTa: "மறைநூல் அறிஞர்களும் பரிசேயரும் இயேசுவை நோக்கி, \"யோவானுடைய சீடர்கள் அடிக்கடி நோன்பிருந்து மன்றாடி வருகிறார்கள்; பரிசேயர்களின் சீடர்களும் அவ்வாறே செய்கிறார்கள். உம்முடைய சீடர்களோ உண்கிறார்கள், குடிக்கிறார்கள்\" என்றார்கள். இயேசு அவர்களிடம், \"மணமகன் தங்களோடு இருக்கும்வரை நீங்கள் மணவிருந்தினரை நோன்பிருக்கச் செய்ய முடியுமா? காலம் வரும்; அப்போது மணமகன் அவர்களை விட்டுப் பிரிக்கப்படுவார்; அந்நாட்களில் அவர்கள் நோன்பிருப்பார்கள்\" என்றார். மேலும் அவர் அவர்களுக்கு ஓர் உவமையையும் கூறினார்: \"எவரும் புதிய ஆடையிலிருந்து ஒரு துண்டைக் கிழித்து அதை பழைய ஆடையில் ஒட்டுப்போடுவதில்லை; அவ்வாறு செய்தால் புதிய ஆடையும் கிழியும்; புதியதிலிருந்து கிழிக்கப்பட்ட துண்டு பழையதோடு பொருந்தவும் செய்யாது. அதுபோலவே பழைய தோல் பைகளில் எவரும் புதிய திராட்சை மதுவை ஊற்றி வைப்பதில்லை; புதிய மதுவைப் புதிய தோல் பைகளில்தான் ஊற்றி வைக்க வேண்டும்.\"\nஇது கிறிஸ்து வழங்கும் நற்செய்தி.",
        reflectionEn: "Jesus reminds us to welcome God's grace with open and renewed hearts, transforming our daily lives with holy joy and genuine compassion.",
        reflectionTa: "இயேசு கிறிஸ்து நம்மோடு இருக்கும்போது எழும் ஆன்மீக மகிழ்ச்சியையும், நமது உள்ளங்களை புதுப்பித்து இறைவனின் அருள்வழியில் வாழும் புதிய வாழ்வையும் இன்றைய நற்செய்தி நமக்கு உணர்த்துகிறது."
      },
      {
        id: "liturgy_20260905",
        date: "2026-09-05",
        seasonEn: "22nd Week in Ordinary Time",
        seasonTa: "பொதுக்காலம் 22-ஆம் வாரம்",
        saintEn: "St. Teresa of Calcutta (Mother Teresa)",
        saintTa: "கொல்கத்தா புனித தெரசா (அன்னை தெரசா)",
        reading1TitleEn: "A reading from the first Letter of Saint Paul to the Corinthians",
        reading1TitleTa: "திருத்தூதர் பவுல் கொரிந்தியருக்கு எழுதிய முதல் திருமுகத்திலிருந்து வாசகம்",
        reading1Ref: "1 Cor 4:6b-15",
        reading1TextEn: "Brothers and sisters: Learn from us the adage, \"Nothing beyond what is written!\" What do you possess that you have not received? But if you have received it, why are you boasting as if you did not receive it?...\nThis is the word of the Lord.",
        reading1TextTa: "சகோதரர் சகோதரிகளே, 'எழுதப்பட்டதற்கு மிஞ்சி எதையும் செய்யாதிருக்கக் கற்றுக்கொள்ளுங்கள்.' கடவுளிடமிருந்து பெற்றுக்கொள்ளாதது உங்களிடம் என்ன இருக்கிறது? பெற்றுக்கொண்டிருந்தும் பெற்றுக்கொள்ளாதவரைப் போல பெருமைபாராட்டலாமா?...\nஇது ஆண்டவர் வழங்கும் அருள்வாக்கு.",
        psalmRef: "Ps 145:17-18, 19-20, 21",
        psalmResponseEn: "The Lord is near to all who call upon him.",
        psalmResponseTa: "தம்மை நோக்கி மன்றாடும் யாவருக்கும் ஆண்டவர் அருகில் இருக்கிறார்.",
        psalmTextEn: "The LORD is just in all his ways and holy in all his works. The LORD is near to all who call upon him, to all who call upon him in truth.",
        psalmTextTa: "ஆண்டவர் தம் வழிகள் அனைத்திலும் நீதியுள்ளவர்; தம் செயல்கள் அனைத்திலும் தூய்மையானவர். தம்மை நோக்கி மன்றாடும் யாவருக்கும், உண்மையாய் மன்றாடும் யாவருக்கும் அருகில் இருக்கிறார்.",
        reading2TitleEn: "",
        reading2TitleTa: "",
        reading2Ref: "",
        reading2TextEn: "",
        reading2TextTa: "",
        gospelTitleEn: "A reading from the holy Gospel according to Luke",
        gospelTitleTa: "லூக்கா எழுதிய தூய நற்செய்தியிலிருந்து வாசகம்",
        gospelRef: "Lk 6:1-5",
        gospelTextEn: "While Jesus was going through a field of grain on a sabbath, his disciples were picking the heads of grain, rubbing them in their hands, and eating them. Some Pharisees said, \"Why are you doing what is unlawful on the sabbath?\" Jesus said to them, \"The Son of Man is lord of the sabbath.\"\nThis is the Gospel of the Lord.",
        gospelTextTa: "ஒரு ஓய்வுநாளில் இயேசு வயல்வழியே சென்றுகொண்டிருந்தபோது, அவருடைய சீடர்கள் கதிர்களைக் கொய்து, கைகளால் கசக்கித் தின்றார்கள். பரிசேயருள் சிலர், \"ஓய்வுநாளில் செய்யக்கூடாததை நீங்கள் செய்வதேன்?\" என்று கேட்டனர். இயேசு அவர்களைப் பார்த்து, \"மானிட மகன் ஓய்வுநாளுக்கும் ஆண்டவர்\" என்றார்.\nஇது கிறிஸ்து வழங்கும் நற்செய்தி.",
        reflectionEn: "Christ teaches us that compassion and human need take precedence over rigid legalism, calling us to follow Mother Teresa's path of selfless service.",
        reflectionTa: "சட்ட விதிகளுக்கு மேலாக இரக்கத்திற்கும் ஏழை எளியோரின் தேவைகளுக்கும் முதலிடம் அளிக்க வேண்டும் என்றும், அன்னை தெரசாவைப் போல அன்பின் தொண்டாற்றவும் இயேசு நமக்கு வழிகாட்டுகிறார்."
      },
      {
        id: "liturgy_seed_20260604",
        date: "2026-06-04",
        seasonEn: "9th Week in Ordinary Time",
        seasonTa: "பொதுக்காலம் 9-ஆம் வாரம்",
        saintEn: "",
        saintTa: "",
        reading1TitleEn: "A reading from the second Letter of Saint Paul to Timothy",
        reading1TitleTa: "திருத்தூதர் பவுல் திமொத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகத்திலிருந்து வாசகம்",
        reading1Ref: "2 Tm 2:8-15",
        reading1TextEn: "Beloved: Remember Jesus Christ, raised from the dead, a descendant of David...\nThis is the word of the Lord.",
        reading1TextTa: "அன்பார்ந்தவரே, தாவீதின் வழிவந்த இயேசு கிறிஸ்துவை நினைவிற்கொள்ளுங்கள்...\nஇது ஆண்டவர் வழங்கும் அருள்வாக்கு.",
        psalmRef: "Ps 25:4-5ab, 8-9, 10 and 14",
        psalmResponseEn: "Teach me your ways, O Lord.",
        psalmResponseTa: "ஆண்டவரே, உம் பாதைகளை நான் அறியச்செய்தருளும்.",
        psalmTextEn: "Your ways, O LORD, make known to me...\nGood and upright is the LORD.",
        psalmTextTa: "ஆண்டவரே, உம் பாதைகளை நான் அறியச்செய்தருளும்...\nஆண்டவர் நல்லவர், நேர்மையுள்ளவர்.",
        reading2TitleEn: "",
        reading2TitleTa: "",
        reading2Ref: "",
        reading2TextEn: "",
        reading2TextTa: "",
        gospelTitleEn: "A reading from the holy Gospel according to Mark",
        gospelTitleTa: "மாற்கு எழுதிய தூய நற்செய்தியிலிருந்து வாசகம்",
        gospelRef: "Mk 12:28-34",
        gospelTextEn: "One of the scribes came to Jesus and asked him, \"Which is the first of all the commandments?\"...\nThis is the Gospel of the Lord.",
        gospelTextTa: "மறைநூல் அறிஞருள் ஒருவர் இயேசுவிடம் வந்து, \"அனைத்துக் கட்டளைகளிலும் முதலாவது எது?\" என்று கேட்டார்...\nஇது கிறிஸ்து வழங்கும் நற்செய்தி.",
        reflectionEn: "Jesus reminds us that love of God and love of neighbor are inseparable.",
        reflectionTa: "கடவுள் அன்பும் பிறர் அன்பும் ஒன்றோடொன்று இணைந்தவை என்பதை இயேசு நமக்கு நினைவூட்டுகிறார்."
      }
    ],
    catholic_prayers: [],
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
      vapidKey: "BKtoXjOv7MTKksHjpfPRa5eJ99hbpxt9t3plbHWmkxQfYEUVAFaVbNE4J1d_oC0GSraKF15VaqRN7tvEj4aGFxs"
    },
    gallery: [
      {
        id: "gallery_1",
        src: "images/gallery_altar.webp",
        catTa: "பலிபீடம்",
        catEn: "Sanctuary Altar",
        titleTa: "அழகிய நற்கருணை பலிபீடம்",
        titleEn: "Holy Eucharistic Sanctuary Altar",
        isActive: true
      },
      {
        id: "gallery_2",
        src: "images/gallery_fest.webp",
        catTa: "ஆண்டு திருவிழா",
        catEn: "Annual Festival",
        titleTa: "ஆண்டு திருவிழா மின்விளக்கு அலங்காரம்",
        titleEn: "Grand Annual Feast Light Decoration",
        isActive: true
      },
      {
        id: "gallery_3",
        src: "images/gallery_choir.webp",
        catTa: "சந்நிதி",
        catEn: "Shrine",
        titleTa: "மெழுகுவர்த்தி ஏற்றி ஜெபிக்கும் சந்நிதி",
        titleEn: "Candlelight Prayer Shrine",
        isActive: true
      },
      {
        id: "gallery_4",
        src: "images/gallery_statue.webp",
        catTa: "பாதுகாவலர்",
        catEn: "Patron Saint Devotion",
        titleTa: "அற்புத புனித அந்தோணியார் திருவுருவச் சிலை",
        titleEn: "Miraculous Statue of St. Antony of Padua",
        isActive: true
      },
      {
        id: "gallery_5",
        src: "images/old_church_altar.webp",
        catTa: "பழைய ஆலயம்",
        catEn: "Historical Sanctuary",
        titleTa: "வரலாற்று சிறப்புமிக்க பழைய ஆலய பீடம்",
        titleEn: "Glorious Old Church Altar",
        isActive: true
      },
      {
        id: "gallery_new_1",
        src: "images/opening_ceremony_1.webp",
        catTa: "திறப்பு விழா",
        catEn: "Opening Ceremony",
        titleTa: "புதிய ஆலய திறப்பு விழா பவனி மற்றும் ஆராதனை",
        titleEn: "New Church Opening Ceremony Procession and Worship",
        isActive: true
      },
      {
        id: "gallery_new_2",
        src: "images/opening_ceremony_2.webp",
        catTa: "திறப்பு விழா",
        catEn: "Opening Ceremony",
        titleTa: "பேராயர் தலைமையில் புதிய ஆலய அர்ச்சிப்பு மற்றும் வரவேற்பு",
        titleEn: "Blessing of the New Church by the Bishop and Welcome Ceremony",
        isActive: true
      },
      {
        id: "gallery_new_3",
        src: "images/opening_ceremony_3.webp",
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
    this._ensureCollection("sac_catholic_prayers", this.defaultData.catholic_prayers);
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

        // Force update gallery_3 if it has the old title
        const gallery3 = items && items.find(i => i.id === 'gallery_3');
        if (gallery3 && gallery3.catEn === 'Parish Liturgical Choir') {
          const updatedItem = this.defaultData.gallery.find(i => i.id === 'gallery_3');
          if (updatedItem) {
            await this.save("gallery", updatedItem);
            window.dispatchEvent(new CustomEvent('sacDataRefreshed', { detail: { collection: 'gallery' } }));
          }
        }
      } catch (err) {
        console.error("Migration failed", err);
      }
    }, 500);
  },

  _ensureCollection(key, defaultValue) {
    let existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } else if (key === 'sac_settings') {
      try {
        let parsed = JSON.parse(existing);
        let modified = false;
        if (parsed) {
          if (!parsed.phone || parsed.phone === '+91 94860 12345') {
            parsed.phone = defaultValue.phone;
            modified = true;
          }
          if (!parsed.email || parsed.email === 'contact@stacpaganur.in' || parsed.email === 'contact@stantonyschurchpaganur.in') {
            parsed.email = defaultValue.email;
            modified = true;
          }
          if (!parsed.addressEn || parsed.addressEn.includes('630312')) {
            parsed.addressEn = defaultValue.addressEn;
            modified = true;
          }
          if (!parsed.addressTa || parsed.addressTa.includes('630312')) {
            parsed.addressTa = defaultValue.addressTa;
            modified = true;
          }
          if (modified) {
            localStorage.setItem(key, JSON.stringify(parsed));
          }
        }
      } catch (e) {}
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
    } else if (key === 'sac_daily_liturgy') {
      let parsed = JSON.parse(existing);
      let modified = false;
      if (Array.isArray(parsed) && Array.isArray(defaultValue)) {
        defaultValue.forEach(defItem => {
          if (!parsed.some(item => item.id === defItem.id || item.date === defItem.date)) {
            parsed.unshift(defItem);
            modified = true;
          }
        });
      }
      if (modified) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  },

  // Dynamic Firebase Initializer based on Admin Configuration
  activeListeners: {},
  db: null,
  isFirebaseActive: false,

  setupFirebaseConnection() {
    // FORCE ALWAYS LIVE: Use hardcoded default config instead of potentially broken local storage config
    const config = this.defaultData.firebase_config;
    this.setCollection("sac_firebase_config", config);
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

          // Force Long Polling logic removed to prevent settings override crashes in Firebase 10.

          // Enable offline caching and instant load
          this.db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            console.warn("Firestore persistence could not be enabled:", err);
          });

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
    // Auto-heal: If firebase loaded slightly late from the CDN, connect now before fetching!
    if (!this.isFirebaseActive && typeof window !== 'undefined' && window.firebase) {
      this.setupFirebaseConnection();
    }

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

    // Prepare immediate local return value
    let localResult = null;
    if (isArrayType) {
      let localArr = localData || this.defaultData[collectionName] || [];
      if (collectionName === "gallery") {
        localArr.forEach(item => {
          if (item.catTa && item.catTa.includes(' | ')) item.catTa = item.catTa.split(' | ')[0].trim();
        });
      }
      if (collectionName === "catholic_prayers") {
        const merged = [...this.defaultData.catholic_prayers];
        const localList = localData || [];
        localList.forEach(localItem => {
          const idx = merged.findIndex(d => d.id === localItem.id);
          if (idx !== -1) {
            merged[idx] = localItem;
          } else {
            merged.push(localItem);
          }
        });
        localArr = merged;
      }
      localResult = localArr;
    } else {
      localResult = sanitizeObj(localData, collectionName);
    }

    // Trigger background synchronization from Firestore if active
    if (this.isFirebaseActive && this.db) {
      setTimeout(async () => {
        try {
          // Timeout the fetch in 8 seconds to prevent lingering promises on bad connections
          const fetchPromise = this.db.collection(collectionName).get();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 8000)
          );
          const snapshot = await Promise.race([fetchPromise, timeoutPromise]);

          if (!snapshot.empty) {
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            let finalSyncData = null;

            if (isArrayType) {
              if (collectionName === "gallery") {
                results.forEach(item => {
                  if (item.catTa && item.catTa.includes(' | ')) {
                    item.catTa = item.catTa.split(' | ')[0].trim();
                  }
                });
              }
              if (collectionName === "catholic_prayers") {
                const merged = [...this.defaultData.catholic_prayers];
                results.forEach(firestoreItem => {
                  const idx = merged.findIndex(d => d.id === firestoreItem.id);
                  if (idx !== -1) {
                    merged[idx] = firestoreItem;
                  } else {
                    merged.push(firestoreItem);
                  }
                });
                finalSyncData = merged;
              } else {
                finalSyncData = results;
              }
            } else {
              const genDoc = results.find(r => r.id === "general") || results[0];
              finalSyncData = sanitizeObj(genDoc, collectionName);
              // Auto-heal strings on Firestore if they got corrupted (only if authenticated)
              if (JSON.stringify(genDoc) !== JSON.stringify(finalSyncData)) {
                const isAuthenticated = window.firebase && window.firebase.auth && window.firebase.auth().currentUser;
                if (isAuthenticated) {
                  await this.db.collection(collectionName).doc("general").set(finalSyncData).catch(e => { });
                }
              }
            }

            // Compare local cache with synchronized data
            const localStr = JSON.stringify(localResult);
            const fetchedStr = JSON.stringify(finalSyncData);
            if (localStr !== fetchedStr) {
              console.log(`[DB Sync] Fresh data fetched for collection "${collectionName}". Syncing LocalStorage cache and dispatching sacDataRefreshed...`);
              this.setCollection(localKey, finalSyncData);
              window.dispatchEvent(new CustomEvent('sacDataRefreshed', { detail: { collection: collectionName } }));
            }
          }
        } catch (err) {
          // Silent fallback for offline sync
        }
      }, 0);
    }

    // Return cached LocalStorage result immediately (<1ms)
    return localResult;
  },

  getCollection(key) {
    try {
      const val = localStorage.getItem(key);
      if (!val || val === "undefined") return null;
      return JSON.parse(val);
    } catch (e) {
      return null;
    }
  },

  setCollection(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || (e.message && e.message.includes('quota'))) {
        console.warn("Local storage limit reached! Cannot cache collection: " + key);
        if (typeof showGlobalErrorAlert === 'function') {
           showGlobalErrorAlert("Storage Limit Reached", "Your browser's local storage is completely full. Please delete some old gallery images or announcements to free up space before saving new ones.");
        } else {
           alert("Storage Limit Reached: Your browser's local storage is full. Please delete some old data to free up space.");
        }
      } else {
        console.error("Storage error:", e);
      }
    }
  },

  // Universal CRUD helper
  async save(collectionName, data) {
    // Auto-heal: If firebase loaded slightly late from the CDN, connect now before saving!
    if (!this.isFirebaseActive && typeof window !== 'undefined' && window.firebase) {
      this.setupFirebaseConnection();
    }

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

    // Sync to Firestore if active (Optimistic UI: non-blocking background task to prevent UI lag!)
    if (this.isFirebaseActive && this.db) {
      // Check if user is authenticated before writing (prevents Security Error on localhost)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isAuthenticated = window.firebase && window.firebase.auth && window.firebase.auth().currentUser;
      
      if (isLocalhost && !isAuthenticated) {
        console.warn(`[DB] Skipping Firestore sync for "${collectionName}" on localhost (no auth). Data saved to LocalStorage only.`);
        return data;
      }
      
      if (collectionName === "settings" || collectionName === "firebase_config") {
        await this.db.collection(collectionName).doc("general").set(data, { merge: true })
          .catch(err => {
            console.error(`Firestore save failed for ${collectionName}:`, err);
            if (err.code === 'permission-denied') {
                if (typeof showGlobalErrorAlert === 'function') {
                  showGlobalErrorAlert("Security Error", "Permission Denied. Please log in securely to save data. If you are testing locally, check your Firestore Security Rules.");
                } else {
                  alert("Security Error: Permission Denied. Check your Firestore Security Rules.");
                }
            } else {
                alert("Firestore Error: " + err.message);
            }
            throw err;
          });
      } else {
        const { id, ...dataWithoutId } = data;
        await this.db.collection(collectionName).doc(id).set(dataWithoutId)
          .catch(err => {
            console.error(`Firestore save failed for ${collectionName}:`, err);
            if (err.code === 'permission-denied') {
                if (typeof showGlobalErrorAlert === 'function') {
                  showGlobalErrorAlert("Security Error", "Permission Denied. Please log in securely to save data. If you are testing locally, check your Firestore Security Rules.");
                } else {
                  alert("Security Error: Permission Denied. Check your Firestore Security Rules.");
                }
            } else {
                alert("Firestore Error: " + err.message);
            }
            throw err;
          });
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
    // Auto-heal: If firebase loaded slightly late from the CDN, connect now before deleting!
    if (!this.isFirebaseActive && typeof window !== 'undefined' && window.firebase) {
      this.setupFirebaseConnection();
    }

    const localKey = "sac_" + collectionName;

    // Delete from LocalStorage
    const items = this.getCollection(localKey) || [];
    const filtered = items.filter(item => item.id !== id);
    this.setCollection(localKey, filtered);

    // Sync to Firestore if active (Optimistic UI: non-blocking background task to prevent UI lag!)
    if (this.isFirebaseActive && this.db) {
      // Check if user is authenticated before deleting (prevents Security Error on localhost)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isAuthenticated = window.firebase && window.firebase.auth && window.firebase.auth().currentUser;
      
      if (isLocalhost && !isAuthenticated) {
        console.warn(`[DB] Skipping Firestore delete for "${collectionName}" on localhost (no auth). Deleted from LocalStorage only.`);
        return true;
      }
      
      await this.db.collection(collectionName).doc(id).delete()
        .catch(err => {
          console.error(`Firestore delete failed for ${collectionName} with id ${id}:`, err);
          if (err.code === 'permission-denied') {
            if (typeof showGlobalErrorAlert === 'function') {
              showGlobalErrorAlert("Security Error", "Permission Denied. Please log in securely to delete data.");
            } else {
              showToast("Security Error: Permission Denied. You must be logged in to delete.");
            }
          }
        });
    }

    return true;
  },

  // --- VISITOR TRACKING ---
  async logVisit(data) {
    try {
      // 1. Always increment the local fallback counter FIRST for immediate UI reaction
      let localCount = parseInt(this.getCollection("sac_visitor_count")) || 0;
      localCount += 1;
      this.setCollection("sac_visitor_count", localCount);

      if (!this.isFirebaseActive || !this.db) {
        return; // Offline mode, local increment is enough
      }

      const id = "visit_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
      const dataWithId = { ...data, id, timestamp: new Date().toISOString() };

      // 2. Log the individual visit (with timeout so it doesn't hang the function)
      try {
        console.error("[DEBUG] Starting visitor_logs write");
        const logPromise = this.db.collection("visitor_logs").doc(id).set(dataWithId);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout visitor_logs")), 3000));
        await Promise.race([logPromise, timeoutPromise]);
        console.error("[DEBUG] visitor_logs SUCCESS");
      } catch (e) {
        console.error("[DEBUG] visitor_logs FAILED:", e);
      }

      // 3. Robust counter increment using FieldValue
      const statsRef = this.db.collection("stats").doc("visitors");
      try {
        console.error("[DEBUG] Starting stats increment");
        const incrementPromise = statsRef.set({
          total_count: window.firebase.firestore.FieldValue.increment(1),
          last_updated: new Date().toISOString()
        }, { merge: true });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout increment")), 3000));
        await Promise.race([incrementPromise, timeoutPromise]);
        console.error("[DEBUG] Stats increment SUCCESS");
      } catch (e) {
        console.error("[DEBUG] Stats increment FAILED:", e);
      }
    } catch (e) {
      console.error("[DEBUG] logVisit outer catch:", e);
    }
  },

  async getVisitorStats() {
    let localCount = parseInt(this.getCollection("sac_visitor_count")) || 0;
    try {
      if (this.isFirebaseActive && this.db) {
        const fetchPromise = this.db.collection("stats").doc("visitors").get({ source: 'server' });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2500));
        const doc = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (doc && doc.exists) {
          let dbCount = doc.data().total_count || 0;
          
          if (localCount > dbCount) {
             this.db.collection("stats").doc("visitors").set({
               total_count: localCount,
               last_updated: new Date().toISOString()
             }, { merge: true }).catch(() => {});
             return localCount;
          } else {
             this.setCollection("sac_visitor_count", dbCount);
             return dbCount;
          }
        }
      }
    } catch (e) {
      console.warn("Using local visitor count:", e);
    }
    return localCount;
  },

  async getVisitorLogs() {
    if (!this.isFirebaseActive || !this.db) return [];
    try {
      const fetchPromise = this.db.collection("visitor_logs")
        .orderBy("timestamp", "desc")
        .limit(200)
        .get();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000));
      const snapshot = await Promise.race([fetchPromise, timeoutPromise]);
      return snapshot.docs.map(doc => doc.data());
    } catch (e) {
      console.error("Failed to fetch visitor logs:", e);
      return [];
    }
  },

  async clearVisitorLogs() {
    if (!this.isFirebaseActive || !this.db) return false;
    try {
      const snapshot = await this.db.collection("visitor_logs").get();
      if (snapshot.empty) return true;

      // Batch has a limit of 500, so we delete them individually in parallel for robustness
      const deletePromises = [];
      snapshot.docs.forEach(doc => {
        deletePromises.push(doc.ref.delete());
      });
      await Promise.all(deletePromises);
      return true;
    } catch (e) {
      console.error("Failed to clear visitor logs:", e);
      return false;
    }
  }
};

// Auto-run DB init
SAC_DATABASE.init();

// Cross-tab synchronization for instant UI updates across all open tabs
window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith('sac_')) {
    const collectionName = e.key.replace('sac_', '');
    window.dispatchEvent(new CustomEvent('sacDataRefreshed', { detail: { collection: collectionName } }));
  }
});




// Expose globally to ensure accessibility across all modules
window.SAC_DATABASE = SAC_DATABASE;
