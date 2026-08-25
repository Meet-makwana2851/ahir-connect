/* ============================================================
   AHIRSETU — Curated Daily Bhagavad Gita Shlokas
   Contains Sanskrit, Gujarati, and English translations.
   Changes automatically every day based on the calendar date.
   ============================================================ */

const GITA_SHLOKAS = [
    {
        chapterGu: "અધ્યાય ૨, શ્લોક ૪૭",
        chapterEn: "Chapter 2, Verse 47",
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
        meaningGu: "કર્મ કરવાનો જ તમારો અધિકાર છે, ફળ પર ક્યારેય નહીં. કર્મફળની ઇચ્છા રાખીને કાર્ય ન કરો અને કર્મ ન કરવામાં પણ આસક્તિ ન રાખો.",
        meaningEn: "You have a right to perform your prescribed duty, but never to the fruits of your actions. Never consider yourself the cause of results, nor be attached to inaction."
    },
    {
        chapterGu: "અધ્યાય ૪, શ્લોક ૭",
        chapterEn: "Chapter 4, Verse 7",
        sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानં सृजाम्यहम् ॥",
        meaningGu: "જ્યારે જ્યારે ધર્મની હાનિ થાય છે અને અધર્મનું જોર વધે છે, ત્યારે ત્યારે હું (ભગવાન) અવતાર ધારણ કરું છું.",
        meaningEn: "Whenever there is a decline in righteousness and an increase in unrighteousness, at that time I manifest Myself upon earth."
    },
    {
        chapterGu: "અધ્યાય ૪, શ્લોક ૮",
        chapterEn: "Chapter 4, Verse 8",
        sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥",
        meaningGu: "સજ્જનોના રક્ષણ માટે, દુષ્ટોના વિનાશ માટે અને ધર્મની સ્થાપના માટે હું પ્રત્યેક યુગમાં પ્રગટ થાઉં છું.",
        meaningEn: "To protect the righteous, annihilate the wicked, and firmly establish virtue, I appear era after era."
    },
    {
        chapterGu: "અધ્યાય ૯, શ્લોક ૨૨",
        chapterEn: "Chapter 9, Verse 22",
        sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
        meaningGu: "જે અનન્ય ભક્તો નિરંતર મારું ચિંતન કરતા મારી ઉપાસના કરે છે, તેમના યોગ અને ક્ષેમનું વહન હું પોતે કરું છું.",
        meaningEn: "To those who always remember Me with focused devotion, I provide what they lack and protect what they have."
    },
    {
        chapterGu: "અધ્યાય ૧૮, શ્લોક ૬૬",
        chapterEn: "Chapter 18, Verse 66",
        sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
        meaningGu: "સર્વ ધર્મોનો ત્યાગ કરીને કેવળ મારી એકમાત્ર શરણમાં આવો. હું તમને સર્વ પાપોમાંથી મુક્ત કરીશ, ચિંતા ન કરો.",
        meaningEn: "Surrender all duties to Me alone. Take refuge in Me; I shall liberate you from all sins. Do not grieve."
    },
    {
        chapterGu: "અધ્યાય ૨, શ્લોક ૨૦",
        chapterEn: "Chapter 2, Verse 20",
        sanskrit: "न जायते म्रियते वा कदाचि-न्नायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥",
        meaningGu: "આ આત્મા ક્યારેય જન્મતો નથી કે મૃત્યુ પામતો નથી. આ અજન્મા, નિત્ય, શાશ્વત અને પુરાતન છે. શરીરનો નાશ થવા છતાં તેનો નાશ થતો નથી.",
        meaningEn: "The soul is never born, nor does it ever die. It is unborn, eternal, ever-existing, and ancient. It is not slain when the body is slain."
    },
    {
        chapterGu: "અધ્યાય ૬, શ્લોક ૫",
        chapterEn: "Chapter 6, Verse 5",
        sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
        meaningGu: "પોતાના દ્વારા જ પોતાનો ઉદ્ધાર કરવો, પોતાને નીચે ન પાડવો. કારણ કે મનુષ્ય પોતે જ પોતાનો મિત્ર છે અને પોતે જ પોતાનો શત્રુ છે.",
        meaningEn: "Elevate yourself through the power of your mind, and do not degrade yourself. For the mind alone is one's friend, and the mind alone is one's enemy."
    },
    {
        chapterGu: "અધ્યાય ૨, શ્લોક ૬૨",
        chapterEn: "Chapter 2, Verse 62",
        sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥",
        meaningGu: "વિષયોનું ચિંતન કરવાથી તેમાં આસક્તિ જન્મે છે, આસક્તિથી કામના (ઇચ્છા) ઉત્પન્ન થાય છે અને કામનામાં વિઘ્ન આવવાથી ક્રોધ ઉત્પન્ન થાય છે.",
        meaningEn: "While contemplating objects of the senses, attachment develops. From attachment desire arises, and from unfulfilled desire comes anger."
    },
    {
        chapterGu: "અધ્યાય ૧૦, શ્લોક ૪૧",
        chapterEn: "Chapter 10, Verse 41",
        sanskrit: "यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा ।\nतत्तदेवावगच्छ त्वं मम तेजोंऽशसम्भवम् ॥",
        meaningGu: "સૃષ્ટિમાં જે કાંઈ ઐશ્વર્યવાન, કાંતિમાન અથવા શક્તિશાળી છે, તે સર્વ મારા જ તેજના અંશમાંથી પ્રગટ થયેલું જાણો.",
        meaningEn: "Know that whatever is majestic, beautiful, or glorious in this world springs from but a spark of My divine splendor."
    },
    {
        chapterGu: "અધ્યાય ૧૨, શ્લોક ૧૫",
        chapterEn: "Chapter 12, Verse 15",
        sanskrit: "यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः ।\nहर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ॥",
        meaningGu: "જેનાથી કોઈ પણ જીવ ઉદ્વેગ પામતો નથી અને જે કોઈનાથી ઉદ્વેગ પામતો નથી, જે હર્ષ, ઈર્ષ્યા, ભય અને ચિંતાથી મુક્ત છે, તે ભક્ત મને અતિ પ્રિય છે.",
        meaningEn: "He by whom no one is disturbed and who is not disturbed by the world, who is free from joy, envy, fear, and anxiety—he is dear to Me."
    }
];

/**
 * Returns today's shloka dynamically based on the day of the year.
 */
function getTodayShloka() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return GITA_SHLOKAS[dayOfYear % GITA_SHLOKAS.length];
}
