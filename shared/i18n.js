/* ============================================================
   AHIRSETU — Internationalization / Language Engine (i18n)
   Supports English (Default) and Gujarati.
   ============================================================ */

const I18N_STRINGS = {
    en: {
        brandTagline: "Yaduvanshi Samaj Community Portal",
        spiritualGreeting: "Jai Muralidhar",
        navFeed: "Samaj Feed",
        navDirectory: "Member Directory",
        navDayro: "Culture & Dayro",
        navMessages: "Messages",
        navNotifications: "Notifications",
        navProfile: "Profile",
        navSettings: "Settings",
        newPost: "New Post",
        shlokaHeader: "Daily Krishna Wisdom • Bhagavad Gita",
        announcementPin: "📌 Announcement",
        announcementTitle: "Shree Dwarkadhish Janmashtami Festival & Blood Donation Camp 2026",
        announcementDesc: "Date: 28th August • Venue: Ahir Samaj Hall • All community families are welcome.",
        announcementBtn: "View Details",
        searchPlaceholder: "Search by member name, native village, or profession...",
        allDistricts: "All Districts",
        membersFound: "members found",
        noMembers: "No members found. Try changing your search filters.",
        viewProfile: "View Profile 🪶",
        likeBtn: "Jai Muralidhar",
        commentPlaceholder: "Share a comment with the community...",
        gamLabel: "Native Village",
        districtLabel: "District",
        professionLabel: "Profession",
        samajIdentity: "Samaj Identity",
        editProfile: "Edit Profile",
        saveBtn: "Save",
        emptyFeed: "No posts yet in the Samaj feed. Share village news or updates!",
        languageToggle: "Language Preference"
    },
    gu: {
        brandTagline: "યદુવંશ સમાજ ડિજિટલ મંચ",
        spiritualGreeting: "જય મુરલીધર",
        navFeed: "સમાજ ફીડ",
        navDirectory: "સભ્ય ડિરેક્ટરી",
        navDayro: "લોક સાહિત્ય & ડાયરો",
        navMessages: "સંદેશાઓ",
        navNotifications: "સૂચનાઓ",
        navProfile: "પ્રોફાઇલ",
        navSettings: "સેટિંગ્સ",
        newPost: "નવી પોસ્ટ",
        shlokaHeader: "🪶 શ્રીકૃષ્ણ અમૃતવાણી • આજનો ગીતા શ્લોક",
        announcementPin: "📌 પરિપત્ર",
        announcementTitle: "શ્રી દ્વારકાધીશ જન્માષ્ટમી મહોત્સવ અને રક્તદાન મહાશિબિર ૨૦૨૬",
        announcementDesc: "તારીખ: ૨૮ ઑગસ્ટ • સ્થળ: શ્રી આહીર સમાજ વાડી • તમામ પરિવારોને ભાવભર્યું આમંત્રણ.",
        announcementBtn: "વિગત જુઓ",
        searchPlaceholder: "નામ, મૂળ ગામ અથવા વ્યવસાય શોધો...",
        allDistricts: "બધા જિલ્લા",
        membersFound: "સભ્યો મળ્યા",
        noMembers: "કોઈ સભ્ય મળ્યા નથી. ફિલ્ટર બદલીને ફરીથી શોધો.",
        viewProfile: "પ્રોફાઇલ જુઓ 🪶",
        likeBtn: "જય મુરલીધર",
        commentPlaceholder: "સમાજ સાથે ટિપ્પણી શેર કરો...",
        gamLabel: "મૂળ ગામ",
        districtLabel: "જિલ્લો",
        professionLabel: "વ્યવસાય",
        samajIdentity: "સમાજ ઓળખ",
        editProfile: "પ્રોફાઇલ એડિટ કરો",
        saveBtn: "સાચવો (Save)",
        emptyFeed: "સમાજ ફીડમાં હજુ કોઈ પોસ્ટ નથી. ગામના સમાચાર અથવા વિચાર શેર કરો!",
        languageToggle: "ભાષા પસંદગી (Language)"
    }
};

function getCurrentLang() {
    return localStorage.getItem('ahirsetu_lang') || 'en';
}

function setAppLanguage(lang) {
    localStorage.setItem('ahirsetu_lang', lang);
    window.location.reload();
}

function t(key) {
    const lang = getCurrentLang();
    return (I18N_STRINGS[lang] && I18N_STRINGS[lang][key]) || (I18N_STRINGS['en'][key] || key);
}
