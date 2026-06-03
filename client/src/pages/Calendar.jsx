import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Flame, Activity, BookOpen } from 'lucide-react';
import { getHeatmapData, getStats, markToday } from '../utils/calendar';
import { t } from '../utils/language';

function Calendar() {
  const navigate = useNavigate();
  const [heatmapData, setHeatmapData] = useState([]);
  const [stats, setStats] = useState({ totalSessions: 0, totalDays: 0, currentStreak: 0 });

  useEffect(() => {
    markToday();
    setHeatmapData(getHeatmapData());
    setStats(getStats());
  }, []);

  const getIntensityColor = (intensity, isToday) => {
    if (isToday) return 'ring-2 ring-orange-400 dark:ring-orange-500';
    switch (intensity) {
      case 4: return 'bg-green-600';
      case 3: return 'bg-green-500';
      case 2: return 'bg-green-400';
      case 1: return 'bg-green-300';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  const weeks = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-green-500 dark:bg-green-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><CalendarDays size={24} /><div><h1 className="font-bold text-lg">{t('calendar')}</h1><p className="text-xs text-green-100">Your learning journey</p></div></div>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm"><Activity size={20} className="text-green-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalSessions}</p><p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm"><CalendarDays size={20} className="text-blue-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalDays}</p><p className="text-xs text-gray-500 dark:text-gray-400">Days</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm"><Flame size={20} className="text-orange-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.currentStreak}</p><p className="text-xs text-gray-500 dark:text-gray-400">Streak</p></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Last 20 Weeks</h3>
          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <div key={di} className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity, day.isToday)}`} title={`${day.date}: ${day.sessions} sessions`} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end text-xs text-gray-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <span>More</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2"><BookOpen size={18} className="text-green-500" /> Did You Know?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Every time you open the app, complete a chapter, or take a test — it counts as a study session. Keep your calendar green! 💚</p>
        </div>
      </div>
    </div>
  );
}

export default Calendar;