import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Flame, Zap, Target, Clock, Award, BarChart3, Download } from 'lucide-react';
import { getWeeklyReport } from '../utils/Weekly';
import { getLevelInfo } from '../utils/Xp';
import { downloadReport } from '../utils/Export';
import { t } from '../utils/Language';

function Weekly() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [levelInfo, setLevelInfo] = useState(getLevelInfo());

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  useEffect(() => { setReport(getWeeklyReport(board, classLevel)); }, []);

  const maxSessions = Math.max(...(report?.weekDays?.map(d => d.sessions) || [1]), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-teal-500 dark:bg-teal-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2 flex-1"><BarChart3 size={24} /><div><h1 className="font-bold text-lg">{t('weekly')}</h1><p className="text-xs text-teal-100">{board} Class {classLevel}</p></div></div>
        <button onClick={() => downloadReport(board, classLevel)} className="p-2 rounded-full hover:bg-teal-400 dark:hover:bg-teal-600"><Download size={20} /></button>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {report && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">This Week's Summary</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-3 text-center"><Zap size={20} className="text-teal-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{report.thisWeekXP}</p><p className="text-xs text-gray-500">XP Earned</p></div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 text-center"><Award size={20} className="text-green-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{report.completedThisWeek}</p><p className="text-xs text-gray-500">Chapters Done</p></div>
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3 text-center"><Clock size={20} className="text-orange-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{report.totalTimerSessions}</p><p className="text-xs text-gray-500">Study Sessions</p></div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3 text-center"><Target size={20} className="text-purple-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{report.challengesCompleted}</p><p className="text-xs text-gray-500">Challenges</p></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Daily Activity</h3>
              <div className="flex items-end justify-between gap-1 h-32">
                {report.weekDays.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-24"><div className="w-full bg-teal-500 rounded-t-md" style={{ height: `${(day.sessions / maxSessions) * 100}%`, opacity: day.sessions > 0 ? 1 : 0.2, minHeight: day.sessions > 0 ? '8px' : '4px' }} /></div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{day.shortDay}</span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{day.sessions}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Level Progress</h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{levelInfo.currentLevel?.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{levelInfo.currentLevel?.name}</span><span className="text-gray-500">{levelInfo.nextLevel?.name || 'Max'}</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full" style={{ width: `${Math.min(levelInfo.progress, 100)}%` }} /></div>
                  <p className="text-xs text-gray-400 mt-1">{levelInfo.xpForNext} XP to next level</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center">
              <Flame size={32} className="text-orange-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{report.streak} Day Streak!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep the fire burning 🔥</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Weekly;
