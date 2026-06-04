import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Brain, Coffee, CheckCircle } from 'lucide-react';
import { addSession, getTodaySessions, getWeekSessions } from '../utils/Timer';
import { getTheme } from '../utils/Theme';
import { t } from '../utils/Language';

function Timer() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(getTodaySessions());
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef(null);
  const theme = getTheme();

  const STUDY_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      if (mode === 'study') {
        const newSessions = addSession();
        setSessions(newSessions);
        setShowComplete(true);
        setTimeout(() => setShowComplete(false), 3000);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => { setIsRunning(false); setTimeLeft(mode === 'study' ? STUDY_TIME : BREAK_TIME); };
  const switchMode = (newMode) => { setIsRunning(false); setMode(newMode); setTimeLeft(newMode === 'study' ? STUDY_TIME : BREAK_TIME); };
  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`; };
  const progress = mode === 'study' ? ((STUDY_TIME - timeLeft) / STUDY_TIME) * 100 : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;
  const weekSessions = getWeekSessions();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-orange-500 dark:bg-orange-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Clock size={24} /><h1 className="font-bold text-lg">{t('timer')}</h1></div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
          <button onClick={() => switchMode('study')} className={`flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'study' ? 'bg-orange-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Brain size={18} /> Study</button>
          <button onClick={() => switchMode('break')} className={`flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'break' ? 'bg-green-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Coffee size={18} /> Break</button>
        </div>

        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="112" fill="none" stroke={mode === 'study' ? '#f0f0f0' : '#d1fae5'} strokeWidth="12" className="dark:opacity-20" />
              <circle cx="128" cy="128" r="112" fill="none" stroke={mode === 'study' ? '#f97316' : '#22c55e'} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 112}`} strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold text-gray-800 dark:text-white font-mono">{formatTime(timeLeft)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">{mode === 'study' ? 'Focus Time' : 'Break Time'}</span>
              {showComplete && <span className="text-green-500 font-semibold text-sm mt-1 flex items-center gap-1"><CheckCircle size={16} /> Session Complete!</span>}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={resetTimer} className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><RotateCcw size={24} className="text-gray-600 dark:text-gray-300" /></button>
          <button onClick={toggleTimer} className={`p-6 rounded-full text-white transition-all transform hover:scale-105 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : mode === 'study' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}>{isRunning ? <Pause size={32} /> : <Play size={32} />}</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Today</h3>
          <div className="text-center"><p className="text-4xl font-bold text-orange-500">{sessions}</p><p className="text-sm text-gray-500 dark:text-gray-400">study sessions completed</p></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">This Week</h3>
          <div className="flex justify-between items-end gap-1">
            {weekSessions.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-orange-500 rounded-t-sm" style={{ height: `${Math.min(day.sessions * 12, 48)}px`, opacity: day.sessions > 0 ? 1 : 0.2 }} />
                <span className="text-xs text-gray-400 dark:text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer;
