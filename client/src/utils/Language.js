const LANG_KEY = 'gyaansetu_language';

export const LANGUAGES = [
  { id: 'hinglish', name: 'Hinglish', emoji: '🇮🇳' },
  { id: 'hindi', name: 'हिंदी', emoji: '🇮🇳' },
  { id: 'english', name: 'English', emoji: '🇬🇧' },
];

export const getLanguage = () => {
  return localStorage.getItem(LANG_KEY) || 'hinglish';
};

export const setLanguage = (lang) => {
  localStorage.setItem(LANG_KEY, lang);
};

// Translations for common UI text
export const translations = {
  hinglish: {
    home: 'Home',
    syllabus: 'Syllabus',
    doubt: 'Doubt',
    profile: 'Profile',
    challenges: 'Daily Challenges',
    leaderboard: 'Leaderboard',
    analytics: 'Analytics',
    revision: 'Smart Revision',
    reminders: 'Study Reminders',
    weekly: 'Weekly Report',
    calendar: 'Study Calendar',
    formulas: 'Formula Sheet',
    doubtSolver: 'AI Doubt Solver',
    quiz: 'Quiz Mode',
    flashcards: 'Flashcards',
    whiteboard: 'Whiteboard',
    timer: 'Study Timer',
    continueLearning: 'Continue Learning',
    changeClass: 'Change Board/Class',
    setGoal: 'Set Daily Goal',
    goalComplete: 'Goal Completed!',
    chapterComplete: 'Chapter completed!',
    notesSaved: 'Notes saved!',
    loading: 'Loading...',
    noData: 'No data yet',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
  },
  hindi: {
    home: 'होम',
    syllabus: 'सिलेबस',
    doubt: 'डाउट',
    profile: 'प्रोफाइल',
    challenges: 'दैनिक चुनौतियाँ',
    leaderboard: 'लीडरबोर्ड',
    analytics: 'एनालिटिक्स',
    revision: 'स्मार्ट रिवीजन',
    reminders: 'स्टडी रिमाइंडर',
    weekly: 'साप्ताहिक रिपोर्ट',
    calendar: 'स्टडी कैलेंडर',
    formulas: 'फॉर्मूला शीट',
    doubtSolver: 'AI डाउट सॉल्वर',
    quiz: 'क्विज़ मोड',
    flashcards: 'फ्लैशकार्ड्स',
    whiteboard: 'व्हाइटबोर्ड',
    timer: 'स्टडी टाइमर',
    continueLearning: 'पढ़ाई जारी रखें',
    changeClass: 'बोर्ड/क्लास बदलें',
    setGoal: 'दैनिक लक्ष्य सेट करें',
    goalComplete: 'लक्ष्य पूरा!',
    chapterComplete: 'चैप्टर पूरा!',
    notesSaved: 'नोट्स सेव हो गए!',
    loading: 'लोड हो रहा है...',
    noData: 'अभी कोई डेटा नहीं',
    back: 'वापस',
    save: 'सेव',
    cancel: 'रद्द करें',
  },
  english: {
    home: 'Home',
    syllabus: 'Syllabus',
    doubt: 'Doubt',
    profile: 'Profile',
    challenges: 'Daily Challenges',
    leaderboard: 'Leaderboard',
    analytics: 'Analytics',
    revision: 'Smart Revision',
    reminders: 'Study Reminders',
    weekly: 'Weekly Report',
    calendar: 'Study Calendar',
    formulas: 'Formula Sheet',
    doubtSolver: 'AI Doubt Solver',
    quiz: 'Quiz Mode',
    flashcards: 'Flashcards',
    whiteboard: 'Whiteboard',
    timer: 'Study Timer',
    continueLearning: 'Continue Learning',
    changeClass: 'Change Board/Class',
    setGoal: 'Set Daily Goal',
    goalComplete: 'Goal Completed!',
    chapterComplete: 'Chapter completed!',
    notesSaved: 'Notes saved!',
    loading: 'Loading...',
    noData: 'No data yet',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
  }
};

export const t = (key) => {
  const lang = getLanguage();
  return translations[lang]?.[key] || translations['hinglish'][key] || key;
};
