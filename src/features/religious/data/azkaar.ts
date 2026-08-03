export interface AzkaarItem {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  benefit?: string;
}

export const sleepingAzkaar: AzkaarItem[] = [
  {
    id: 1,
    title: "Reciting the Mu'awwidhat (Surah Al-Ikhlas, Al-Falaq, & An-Nas 3x)",
    arabic: "يَجْمَعُ كَفَّيْهِ ثُمَّ يَنْفُثُ فِيهِمَا فَيَقْرَأُ فِيهِمَا: بسم الله الرحمن الرحيم ﴿قل هو اللهُ أحدٌ * اللهُ الصمدُ * لم يلد ولم يُولَد * ولم يكن لهُ كفواً أحدٌ﴾، بسم الله الرحمن الرحيم ﴿قل أعوذُ بربِّ الفلقِ * من شر ما خلقَ * ومن شر غاسقٍ إذا وقبَ * ومن شر النَّفَّاثاتِ في العُقَدِ * ومن شر حاسدٍ إذا حَسَدَ﴾، بسم الله الرحمن الرحيم ﴿قل أعوذُ بربِّ النَّاسِ * ملكِ النَّاسِ * إلهِ النَّاسِ * مِن شر الوَسوَاسِ الخَنَّاسِ * الذي يُوَسوِسُ في صدورِ النَّاسِ * من الجِنَّةِ وَ النَّاسِ﴾ ثمَّ يمسَحُ بهمَا ما استَطَاعَ من جَسَدِهِ يبدَأُ بهمَا على رأسهِ ووجهِهِ وما أقبَلَ من جَسَدِهِ.",
    transliteration: "yajma'u kaffayhi thumma yanfuthu fiyhimaa fayaqraau fiyhimaa: bsm Allah alrhmn alrhym qul huwa alllahu ahadun alllahu alssamadu lam yalid walam yuwlad walam yakun llahu kufuwaan ahadun. bsm Allah alrhmn alrhym qul a'uwdhu birabbi alfalaqi min sharri maa khalaqa wamin sharri ghaasiqin iidhaa waqaba wamin sharri alnnaffaathaati fi al'uqadi wamin sharri haasidin iidhaa hasada. bsm Allah alrhmn alrhym qul a'uwdhu birabbi alnnaasi maliki alnnaasi iilahi alnnaasi min sharri alwaswaasi alkhannaasi alladhiy yuwaswisu fi suduwri alnnaasi mina aljinnahi wa alnnaasi thumma yamsahu bihimaa maa astataa'a min jasadihi yabdaau bihimaa 'alaa raasihi wawajhihi wamaa aqbala min jasadihi (yaf'alu dhalika thalatha marrat).",
    translation: "When retiring to his bed every night, the Prophet (ﷺ) would hold his palms together, blow into them, recite the last three chapters (Al-Ikhlas, Al-Falaq, An-Nas) of the Quran, and then wipe over his entire body as much as possible with his hands, beginning with his head and face and front of his body. He would do this three times.",
    reference: "Al-Bukhārī (#5017, 9/62) and Muslim (#2192)",
  },
  {
    id: 2,
    title: "Reciting Ayatul Kursi (Surah Al-Baqarah: 255)",
    arabic: "أعوذ بالـلـه من الشيطان الـرجـيم ﴿اللَّهُ لاَ إِلَٰهَ إِلاَّ هُـوَ الْـحَيُّ الْـقَيُّومُ لاَ تَأخذُهُ سنَةٌ ولا نومٌ لهُ ما في السَّمَاوَاتِ وما في الأَرضِ من ذا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بإِذنهِ يعْلَمُ ما بينَ أيدِيهِمْ وما خلفَهُمْ ولا يُحيطُونَ بِشيءٍ مِّن عِلْمِهِ إِلاَّ بِمَا شَاء وَسعَ كُرْسيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤودُهُ حِفظُهُمَا وهوَ العَليُّ العَظيمُ﴾ [البقرة: ٢٥٥].",
    transliteration: "Alllahu la iilaha iila huwa alhayyu alqayyuwmu la taakhudhuhu sinahun wala nawmun llahu maa fi alssamawaati wamaa fi alardi man dhaa alladhiy yashfa'u 'indahu iila biiidhnihi ya'lamu maa bayna aydiyhim wamaa khalfahum wala yuhiytuwna bishay'in mmin 'ilmihi iila bimaa shaa' wasi'a kursiyyuhu alssamawaati waalarda wala yauuwduhu hifzuhumaa wahuwa al'aliyyu al'aziymu",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    reference: "Al-Bukhārī (#2311)",
  },
  {
    id: 3,
    title: "Reciting the Last Two Verses of Surah Al-Baqarah (285-286)",
    arabic: "﴿آمنَ الرسولُ بما أُنزِلَ إليهِ من ربهِ والمُؤمِنُونَ كلٌّ آمنَ باللهِ وملآئكتِهِ وكتبِهِ ورُسلِهِ لا نفَرِّقُ بينَ أحدٍ من رسلِهِ وقالُواْ سمعنَا وأطَعنَا غُفرانَكَ ربَّنا وإليكَ المَصِيرُ * لا يُكلِّفُ اللهُ نفْساً إلا وسعَهَا لها ما كسَبَتْ وعليهَا ما اكتَسَبَتْ ربَّنا لا تؤاخِذنَا إن نَّسِينَا أو أخطَأنا ربَّنا ولا تَحمِلْ علينَا إصراً كما حملتَهُ على الذينَ من قَبلِنَا ربَّنا ولا تُحَمِّلْنَا ما لا طاقةَ لنا به واعفُ عَنَّا واغفِرْ لنا وارحَمْنَآ أنتَ مولاَنَا فانصُرنَا على القَومِ الكَافِرِينَ﴾ [البقرة: ٢٨٥-٢٨٦].",
    transliteration: "Amana alrrasuwlu bimaa aunzila iilayhi min rrabbihi waalmuuminuwna kullun amana bialllahi wamalaiikatihi wakutubihi warusulihi la nufarriqu bayna ahadin mmin rrusulihi waqaaluwa sami'naa waata'naa ghufraanaka rabbanaa waiilayka almasiyru la yukallifu alllahu nafsaan iila wus'ahaa lahaa maa kasabat wa'alayhaa maa aktasabat rabbanaa la tuuaakhidhnaa iin nnasiynaa aw akhtaanaa rabbanaa wala tahmil 'alaynaa iisraan kamaa hamaltahu 'alaa alladhiyna min qablinaa rabbanaa wala tuhammilnaa maa la taaqaha lanaa bihi waa'fu 'annaa waaghfir lanaa waarhamnaa anta mawlanaa faansurnaa 'alaa alqawmi alkaafiriyna",
    translation: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], We make no distinction between any of His messengers. And they say, We hear and we obey. We seek Your forgiveness, our Lord, and to You is the [final] destination. Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.",
    reference: "Al-Bukhārī (#5009) and Muslim (#807)",
  },
  {
    id: 4,
    title: "In Your Name My Lord, I Lie Down (Bismika Rabbi)",
    arabic: "باسمِكَ ربي وضعْتُ جَنْبي، وبكَ أرفَعُهُ، فَإِن أَمْسَكْتَ نَفْسِي فارْحَمْهَا، وإن أرسَلْتَهَا فاحفَظهَا، بما تحفَظُ به عِبادكَ الصَّالِحينَ.",
    transliteration: "Bismika rabbee wadaAAtu janbee wabika arfaAAuh, fa-in amsakta nafsee farhamha, wa-in arsaltaha fahfathha bima tahfathu bihi AAibadakas-saliheen",
    translation: "In Your name my Lord, I lie down and in Your name I rise, so if You should take my soul then have mercy upon it, and if You should return my soul then protect it in the manner You do so with Your righteous servants.",
    reference: "Al-Bukhārī (#6320, 11/126) and Muslim (#2714, 4/2084)",
  },
  {
    id: 5,
    title: "Entrusting Soul to Allah & Asking for Health (Allahumma Khalaqta Nafsi)",
    arabic: "اللَّهُمَّ إنكَ خلقْتَ نفْسِي وأنتَ توفَّاها، لكَ مماتُهَا ومحياها، إن أحييتَهَا فاحفَظهَا، وإن أمَتَّها فاغفِر لها. اللَّهُمَّ إني أسألكَ العَافِيَةَ.",
    transliteration: "Allahumma innaka khalaqta nafsee wa-anta tawaffaha, laka mamatuha wamahyaha in ahyaytaha fahfathha, wa-in amattaha faghfir laha. Allahumma innee as-alukal-AAafiyah",
    translation: "O Allah, verily You have created my soul and You shall take its life, to You belongs its life and death. If You should keep my soul alive then protect it, and if You should take its life then forgive it. O Allah, I ask You to grant me good health.",
    reference: "Muslim (#2712, 4/2083)",
  },
  {
    id: 6,
    title: "Protection From Allah's Punishment on Judgment Day (Allahumma Qini 'Adhabak)",
    arabic: "اللَّهُمَّ قِني عذابكَ يومَ تَبْعَثُ عِبادَكَ.",
    transliteration: "Allahumma qinee AAathabaka yawma tabAAathu AAibadak",
    translation: "O Allah, protect me from Your punishment on the day Your servants are resurrected.",
    reference: "Abū Dāwud (#5045) and Ṣaḥīḥ al-Tirmidhī (#3398)",
  },
  {
    id: 7,
    title: "In Your Name, O Allah, I Live and Die (Bismikallahumma Amutu Wa-Ahya)",
    arabic: "بِاسمِكَ اللَّهُمَّ أموتُ وأَحْيا.",
    transliteration: "Bismika Allahumma amutu wa-ahya",
    translation: "In Your name O Allah, I live and die.",
    reference: "Al-Bukhārī (#6312) and Muslim (#2711)",
  },
  {
    id: 8,
    title: "Tasbeeh, Tahmeed, & Takbeer Before Sleep (Subhanallah 33x, Alhamdulillah 33x, Allahu Akbar 34x)",
    arabic: "سُبحَانَ اللهِ (ثلاثاً وثلاثين) والحَمدُ للهِ (ثلاثاً وثلاثين) واللهُ أكبَرُ (أربعاً وثلاثينَ).",
    transliteration: "Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (34x)",
    translation: "How Perfect Allah is (33 times). All praise is for Allah (33 times). Allah is the greatest (34 times).",
    reference: "Al-Bukhārī (#3705, 7/71) and Muslim (#2727, 4/2091)",
  },
  {
    id: 9,
    title: "Dua to the Lord of the Heavens for Relief from Debt & Poverty",
    arabic: "اللَّهُمَّ ربَّ السَّماواتِ السَّبْع وربَّ الأرضِ، وربَّ العَرشِ العظيمِ، ربَّنا وربَّ كل شيءٍ، فالقَ الحَبِّ والنَّوى، ومُنزِلَ التورَاةِ والإنجيلِ، والفُرقانِ، أعوذُ بكَ من شر كل شيءٍ أنتَ آخِذٌ بناصيَتِهِ. اللَّهُمَّ أنتَ الأولُ فليسَ قبلَكَ شيءٌ، وأنتَ الآخرُ فليسَ بعدَكَ شيءٌ، وأنتَ الظاهرُ فليسَ فوقكَ شيءٌ، وأنتَ الباطنُ فليْس دونَكَ شيءٌ، اقْضِ عَنَّا الدَّيْنَ وأغنِنَا مِنَ الفَقْرِ.",
    transliteration: "Allahumma rabbas-samawatis-sabAA, warabbal-AAarshil-AAatheem, rabbana warabba kulli shay/, faliqal-habbi wannawa, wamunazzilat-tawra, wal-injeel, walfurqan, aAAoothu bika min sharri kulli shayin anta akhithun binasiyatih. Allahumma antal-awwal, falaysa qablaka shay/, wa-antal-akhir, falaysa baAAdaka shay/, wa-antath-thahir falaysa fawqaka shay/, waantal-batin, falaysa doonaka shay/, iqdi AAannad-dayna wa-aghnina minal-faqr",
    translation: "O Allah, Lord of the seven heavens and the exalted throne, our Lord and Lord of all things, Splitter of the seed and the date stone, Revealer of the Tawrah, the Injeel and the Furqan, I take refuge in You from the evil of all things You shall seize by the forelock (i.e. You have total mastery over). O Allah, You are The First so there is nothing before You and You are The Last so there is nothing after You. You are Aththahir so there is nothing above You and You are Al-Batin so there is nothing closer than You. Settle our debt for us and spare us from poverty.",
    reference: "Muslim (#2713, 4/2084)",
  },
  {
    id: 10,
    title: "Praise to Allah Who Fed Us, Gave Us Drink, & Sheltered Us",
    arabic: "الحَمدُ للهِ الذي أطعَمَنا وسَقانا، وكَفانا، وآوَانا، فكم مِمَّنْ لا كافيَ لهُ ولا مؤْوِيَ.",
    transliteration: "Alhamdu lillahil-lathee atAAamana wasaqana, wakafana, wa-awana, fakam mimman la kafiya lahu wala mu'wee",
    translation: "All praise is for Allah, Who fed us and gave us drink, and Who is sufficient for us and has sheltered us, for how many have none to suffice them or shelter them.",
    reference: "Muslim (#2715, 4/2085)",
  },
  {
    id: 11,
    title: "Seeking Protection from Evil of Self & Shaytan (Allahumma 'Alimal-Ghayb)",
    arabic: "اللَّهُمَّ عالِمَ الغَيْبِ والشهادَةِ فاطرَ السَّمواتِ والأرضِ، ربَّ كل شيءٍ ومليكَهُ، أشهَدُ أن لا إلهَ إلا أنتَ، أعوذُ بكَ من شر نفسي، ومن شر الشيطانِ وشركِهِ، وأن أقترِفَ على نفسِي سوءاً، أو أجرَّهُ إلى مُسلِمٍ.",
    transliteration: "Allahumma AAalimal-ghaybi washshahadah, fatiras-samawati wal-ard, rabba kulli shayin wamaleekah, ashhadu an la ilaha illa ant, aAAoothu bika min sharri nafsee wamin sharrish-shaytani washirkih, wa-an aqtarifa AAala nafsee soo-an aw ajurrahu ila muslim",
    translation: "O Allah, Knower of the seen and the unseen, Creator of the heavens and the earth, Lord and Sovereign of all things I bear witness that none has the right to be worshipped except You. I take refuge in You from the evil of my soul and from the evil and shirk of the devil, and from committing wrong against my soul or bringing such upon another Muslim.",
    reference: "Abū Dāwud (#5083, 4/317) and Ṣaḥīḥ al-Tirmidhī (#3392)",
  },
  {
    id: 12,
    title: "Reciting Surah As-Sajdah (32) & Surah Al-Mulk (67)",
    arabic: "يَقرأُ ﴿الم﴾ تنزيلَ السَّجدَةِ، وتباركَ الذي بيَدِهِ المُلكُ.",
    transliteration: "yaqraau alm tanziyla alssajdah, watabaaraka alladhy biyadihi almulku",
    translation: "The Prophet (ﷺ) never used to sleep until he had recited Surah As-Sajdah (chapter 32) and Surah Al-Mulk (chapter 67).",
    reference: "At-Tirmidhī (#2892) and Ṣaḥīḥ al-Tirmidhī (#2316)",
  },
  {
    id: 13,
    title: "Complete Submission and Trust in Allah Before Sleep (Allahumma Aslamtu Nafsi)",
    arabic: "اللَّهُمَّ أسلَمتُ نَفسي إليكَ، وفوَّضتُ أمري إليكَ، ووجَّهتُ وَجْهي إليكَ، وأَلجَأْتُ ظَهري إليكَ، رَغبةً ورهبَةً إليكَ، لا ملجَأَ ولا منجَا منكَ إلا إليكَ، آمنتُ بكِتابِكَ الذي أنزلتَ، وبنَبيِّكَ الذي أرسَلتَ.",
    transliteration: "Allahumma aslamtu nafsee ilayk, wafawwadtu amree ilayk, wawajjahtu wajhee ilayk, wa-alja/tu thahree ilayk, raghbatan warahbatan ilayk, la maljaa wala manja minka illa ilayk, amantu bikitabikal-lathee anzalt, wabinabiyyikal-lathee arsalt",
    translation: "O Allah, I submit my soul unto You, and I entrust my affair unto You, and I turn my face towards You, and I totally rely on You, in hope and fear of You. Verily there is no refuge nor safe haven from You except with You. I believe in Your Book which You have revealed and in Your Prophet whom You have sent.",
    reference: "Al-Bukhārī (#6313, #6315, #7488, 11/113) and Muslim (#2710, 4/2081)",
  },
];

