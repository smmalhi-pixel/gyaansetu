import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, TrendingUp, Star } from 'lucide-react';
import { getLeaderboardData } from '../utils/leaderboard';
import { t } from '../utils/language';

function Leaderboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => { setData(getLeaderboardData()); }, []);

  const getMedal = (index) => {
    if (index === 0) return <Trophy size={24} className="text-yellow-500" />;
    if (index === 1) return <Medal size={24} className="text-gray-400" />;
    if (index === 2) return <Medal size={24} className="text-amber-600" />;
    return <span className="text-gray-400 font-bold w-6 text-center">{index + 1}</span>;
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-yellow-500 dark:bg-yellow-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Trophy size={24} /><h1 className="font-bold text-lg">{t('leaderboard')}</h1></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Progress Ranking</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Based on chapters completed across all boards and classes</p>

        {data.length === 0 ? (
          <div className="text-center py-10"><Trophy size={48} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-400">{t('noData')}</p></div>
        ) : (
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3 ${index < 3 ? 'border-2 border-yellow-300 dark:border-yellow-600' : 'border border-gray-100 dark:border-gray-700'}`}>
                <div className="flex-shrink-0">{getMedal(index)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1"><h3 className="font-semibold text-gray-800 dark:text-white text-sm">{item.name}</h3><span className="text-lg font-bold text-gray-800 dark:text-white">{item.percentage}%</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full ${getBarColor(item.percentage)}`} style={{ width: `${item.percentage}%` }} /></div>
                  <p className="text-xs text-gray-400 mt-1">{item.completed}/{item.total} chapters completed</p>
                </div>
                {item.percentage >= 80 && <Star size={16} className="text-yellow-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;