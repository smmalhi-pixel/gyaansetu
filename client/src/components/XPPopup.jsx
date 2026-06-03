import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';

function XPPopup({ xpEarned, leveledUp, levelData, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className={`rounded-2xl p-4 shadow-2xl text-center min-w-[200px] ${
        leveledUp ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white dark:bg-gray-800'
      }`}>
        <button onClick={() => { setVisible(false); onClose(); }} className="absolute top-1 right-1 p-1">
          <X size={14} className="text-gray-400" />
        </button>
        
        {leveledUp ? (
          <div className="text-white">
            <p className="text-4xl mb-1">{levelData.emoji}</p>
            <p className="font-bold text-lg">Level Up!</p>
            <p className="text-sm">{levelData.name}</p>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-bold text-yellow-500">+{xpEarned} XP</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Keep going!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default XPPopup;