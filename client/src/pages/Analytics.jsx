import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, BookOpen, StickyNote, Layers, Clock, PieChart } from 'lucide-react';
import { getSubjectAnalytics, getWeeklyActivity } from '../utils/analytics';
import { t } from '../utils/language';

function Analytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [weekData, setWeekData] = useState([]);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  useEffect(() => {
    setAnalytics(getSubjectAnalytics(board, classLevel));
    setWeekData(getWeeklyActivity());
  }, []);

  const maxSessions = Math.max(...weekData.map(d => d.sessions), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><BarChart3 size={24} /><div><h1 className="font-bold text-lg">{t('analytics')}</h1><p className="text-xs text-blue-100">{board} Class {classLevel}</p></div></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {analytics && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><PieChart size={18} className="text-blue-500" /> Chapter Progress</h3>
              <div className="text-center mb-3"><span className="text-4xl font-bold text-blue-500">{analytics.percentage}%</span><p className="text-sm text-gray-500">Overall Completion</p></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 flex overflow-hidden">
                <div className="bg-green-500 h-4" style={{ width: `${analytics.totalChapters > 0 ? (analytics.completed / analytics.totalChapters) * 100 : 0}%` }} />
                <div className="bg-yellow-500 h-4" style={{ width: `${analytics.totalChapters > 0 ? (analytics.inProgress / analytics.totalChapters) * 100 : 0}%` }} />
                <div className="bg-gray-300 dark:bg-gray-600 h-4" style={{ width: `${analytics.totalChapters > 0 ? (analytics.notStarted / analytics.totalChapters) * 100 : 0}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> {analytics.completed} Done</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" /> {analytics.inProgress} In Progress</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /> {analytics.notStarted} Left</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center"><BookOpen size={24} className="text-blue-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.totalChapters}</p><p className="text-xs text-gray-500">Total Chapters</p></div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center"><StickyNote size={24} className="text-yellow-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.totalNotes}</p><p className="text-xs text-gray-500">Notes Written</p></div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center"><Layers size={24} className="text-purple-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.totalFlashcards}</p><p className="text-xs text-gray-500">Flashcards</p></div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center"><Clock size={24} className="text-green-500 mx-auto mb-1" /><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.totalStudySessions}</p><p className="text-xs text-gray-500">Study Sessions</p></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500" /> Weekly Activity</h3>
              <div className="flex items-end justify-between gap-1 h-28">
                {weekData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-20"><div className="w-full bg-blue-500 rounded-t-md" style={{ height: `${(day.sessions / maxSessions) * 100}%`, opacity: day.sessions > 0 ? 1 : 0.2, minHeight: day.sessions > 0 ? '6px' : '3px' }} /></div>
                    <span className="text-xs text-gray-400">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;