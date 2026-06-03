import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Brain, User } from 'lucide-react';
import { getLanguage, t } from '../utils/language';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState(getLanguage());

  useEffect(() => {
    const handleStorage = () => setLang(getLanguage());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setLang(getLanguage());
  }, [location]);

  const tabs = [
    { icon: <Home size={22} />, label: t('home'), path: '/' },
    { icon: <BookOpen size={22} />, label: t('syllabus'), path: '/syllabus' },
    { icon: <Brain size={22} />, label: t('doubt'), path: '/doubt-solver' },
    { icon: <User size={22} />, label: t('profile'), path: '/profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center py-2 px-4 transition-colors ${
              isActive(tab.path)
                ? 'text-orange-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;