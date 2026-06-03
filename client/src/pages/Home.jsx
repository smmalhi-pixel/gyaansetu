import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Target, ArrowRight, TrendingUp, Award, BarChart3, Flame, Clock, Medal, X, Layers, Zap, CalendarDays, Calculator, Flag, User, Bell, Pen, Trophy, PieChart, Share2, Shield, Calendar, Music, Hourglass, ClipboardList } from 'lucide-react';
import { getStreak, getFreezeCount } from '../utils/streak';
import { checkAndAwardBadges, getAllBadges } from '../utils/badges';
import { getLevelInfo } from '../utils/xp';
import { getTodayGoal, setGoal, getGoalProgress } from '../utils/goals';
import { getTodayQuote } from '../utils/quotes';
import { showToast } from '../utils/ToastManager';
import { playSound } from '../utils/sounds';
import Confetti from '../components/Confetti';
import { CardSkeleton } from '../components/Skeleton';
import { t } from '../utils/language';
import { shareProgress } from '../utils/share';
import { getDaysLeft } from '../utils/countdown';

function Home() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(localStorage.getItem('gyaansetu_board') || null);
  const [classLevel, setClassLevel] = useState(localStorage.getItem('gyaansetu_class') || null);
  const [stats, setStats] = useState(null);
  const [hasSaved, setHasSaved] = useState(!!board && !!classLevel);
  const [newBadges, setNewBadges] = useState([]);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [allBadges, setAllBadges] = useState([]);
  const [levelInfo, setLevelInfo] = useState(getLevelInfo());
  const [dailyGoal, setDailyGoal] = useState(getTodayGoal());
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [quote, setQuote] = useState(getTodayQuote());
  const [showConfetti, setShowConfetti] = useState(false);
  const [freezes, setFreezes] = useState(getFreezeCount());
  const [examInfo, setExamInfo] = useState(getDaysLeft());

  const boards = ['CBSE', 'ICSE'];
  const classes = [4, 5, 6, 7, 8, 9, 10, 11, 12];
  const goalOptions = [1, 2, 3, 5, 7, 10];

  useEffect(() => {
    if (board && classLevel) {
      const progressKey = `progress_${board}_${classLevel}`;
      const saved = localStorage.getItem(progressKey);
      const progress = saved ? JSON.parse(saved) : {};

      fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
        .then(r => r.json())
        .then(data => {
          let totalChapters = 0;
          let completedChapters = 0;
          let perfectSubjects = 0;
          const subjectStats = {};

          Object.keys(data).forEach(subject => {
            const chapters = data[subject];
            const completed = chapters.filter(ch => progress[ch.id] === 'completed').length;
            totalChapters += chapters.length;
            completedChapters += completed;
            if (completed === chapters.length && chapters.length > 0) perfectSubjects++;
            subjectStats[subject] = {
              total: chapters.length,
              completed,
              percentage: Math.round((completed / chapters.length) * 100)
            };
          });

          const overallPercentage = totalChapters > 0 
            ? Math.round((completedChapters / totalChapters) * 100) 
            : 0;

          const subjectEntries = Object.entries(subjectStats);
          const strongest = subjectEntries.length > 0 
            ? subjectEntries.reduce((a, b) => a[1].percentage > b[1].percentage ? a : b)
            : null;
          const weakest = subjectEntries.length > 0
            ? subjectEntries.reduce((a, b) => a[1].percentage < b[1].percentage ? a : b)
            : null;

          const streakData = getStreak();
          const timerData = localStorage.getItem('gyaansetu_timer_sessions');
          const timerSessions = timerData ? JSON.parse(timerData) : {};
          const totalSessions = Object.values(timerSessions).reduce((sum, val) => sum + val, 0);
          const hour = new Date().getHours();
          const isNightOwl = hour >= 22 || hour < 5;

          const badgeStats = {
            completedChapters,
            totalChapters,
            streak: streakData.count,
            perfectSubjects,
            timerSessions: totalSessions,
            isNightOwl
          };

          const result = checkAndAwardBadges(badgeStats);
          if (result.newBadges.length > 0) {
            setNewBadges(result.newBadges);
            setShowBadgePopup(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }

          setAllBadges(getAllBadges());
          setLevelInfo(getLevelInfo());
          setDailyGoal(getTodayGoal());
          setFreezes(getFreezeCount());
          setExamInfo(getDaysLeft());

          setTimeout(() => {
            setStats({
              totalChapters,
              completedChapters,
              overallPercentage,
              subjectCount: Object.keys(data).length,
              strongest,
              weakest,
              perfectSubjects
            });
          }, 1500);
        })
        .catch(() => {});
    }
  }, [board, classLevel]);

  const handleStart = () => {
    if (board && classLevel) {
      localStorage.setItem('gyaansetu_board', board);
      localStorage.setItem('gyaansetu_class', classLevel);
      setHasSaved(true);
      navigate('/syllabus');
    }
  };

  const goToSyllabus = () => navigate('/syllabus');

  const changeClass = () => {
    localStorage.removeItem('gyaansetu_board');
    localStorage.removeItem('gyaansetu_class');
    setBoard(null);
    setClassLevel(null);
    setHasSaved(false);
    setStats(null);
    showToast('Board & class changed', 'info');
  };

  const handleSetGoal = (target) => {
    const goal = setGoal(target);
    setDailyGoal(goal);
    setShowGoalSetter(false);
    showToast(`${t('setGoal')}: ${target} chapters! 🎯`, 'success');
    playSound('goal');
  };

  const streak = getStreak();
  const earnedBadges = allBadges.filter(b => b.earned);
  const goalProgress = getGoalProgress();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 page-enter">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      {showBadgePopup && newBadges.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl modal-enter">
            <button onClick={() => setShowBadgePopup(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} className="text-gray-400" /></button>
            <Medal size={48} className="text-yellow-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Badge Unlocked!</h2>
            {newBadges.map(badge => (<div key={badge.id} className="mb-2"><span className="text-4xl">{badge.emoji}</span><p className="font-bold text-lg text-orange-500">{badge.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p></div>))}
            <button onClick={() => setShowBadgePopup(false)} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600">Awesome!</button>
          </div>
        </div>
      )}

      <header className="px-6 py-8 text-center relative">
        <button onClick={() => navigate('/profile')} className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"><User size={20} className="text-gray-500 dark:text-gray-400" /></button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">GyaanSetu</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Tera Board, Teri Bhasha, Tera Score 🚀</p>
        {hasSaved && <button onClick={changeClass} className="mt-3 text-sm text-orange-500 underline hover:text-orange-600">{t('changeClass')}</button>}
      </header>

      {hasSaved && (
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-4 text-white text-center shadow-lg card-enter">
            <p className="text-lg font-medium italic">"{quote.text}"</p>
            <p className="text-sm mt-2 opacity-80">— {quote.author}</p>
          </div>
        </div>
      )}

      {hasSaved && examInfo && examInfo.days > 0 && (
        <div className="px-4 mb-4">
          <div className={`rounded-2xl p-4 text-white text-center shadow-lg ${
            examInfo.days <= 3 ? 'bg-gradient-to-r from-red-400 to-red-600 animate-pulse' :
            examInfo.days <= 7 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
            'bg-gradient-to-r from-blue-400 to-purple-500'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-1"><Hourglass size={20} /><span className="font-semibold">{examInfo.subject} Exam</span></div>
            <p className="text-3xl font-bold">{examInfo.days} Days Left</p>
            <p className="text-sm opacity-80">{new Date(examInfo.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      )}

      {hasSaved && !stats && (
        <div className="px-4 mb-6 space-y-3"><CardSkeleton /><CardSkeleton /></div>
      )}

      {hasSaved && stats && (
        <div className="px-4 mb-6 space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg card-enter">
            {!dailyGoal.set ? (
              <button onClick={() => setShowGoalSetter(true)} className="w-full py-3 border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-xl text-rose-500 hover:border-rose-500 flex items-center justify-center gap-2"><Flag size={20} /> {t('setGoal')}</button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2"><Flag size={18} className="text-rose-500" /> Daily Goal</h3><button onClick={() => setShowGoalSetter(true)} className="text-xs text-rose-500">Change</button></div>
                <div className="flex items-end justify-between mb-1"><span className="text-sm text-gray-500">Complete {dailyGoal.target} chapters</span><span className="text-lg font-bold text-rose-500">{dailyGoal.completed}/{dailyGoal.target}</span></div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className={`h-3 rounded-full ${goalProgress >= 100 ? 'bg-green-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(goalProgress, 100)}%` }} /></div>
                {goalProgress >= 100 && <p className="text-center text-green-500 text-sm font-semibold mt-2">🎉 {t('goalComplete')}</p>}
              </div>
            )}
          </div>

          {showGoalSetter && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg modal-enter">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-center">How many chapters today?</h3>
              <div className="grid grid-cols-3 gap-2">{goalOptions.map(opt => <button key={opt} onClick={() => handleSetGoal(opt)} className={`py-3 rounded-xl font-bold text-lg ${dailyGoal.target === opt ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-rose-900'}`}>{opt}</button>)}</div>
              <button onClick={() => setShowGoalSetter(false)} className="w-full mt-3 py-2 text-sm text-gray-400">{t('cancel')}</button>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg card-enter">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4"><BarChart3 size={20} className="text-orange-500" /> Your Study Stats 
              <button onClick={() => shareProgress(board, classLevel)} className="ml-auto p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Share Progress"><Share2 size={18} className="text-gray-400" /></button>
              <span className="text-xs font-normal text-gray-400">{board} Class {classLevel}</span>
            </h2>
            <div className="mb-4"><div className="flex justify-between items-end mb-1"><span className="text-sm text-gray-500">Overall Progress</span><span className="text-2xl font-bold text-orange-500">{stats.overallPercentage}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style={{ width: `${stats.overallPercentage}%` }} /></div></div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-2 text-center"><Award size={20} className="text-orange-500 mx-auto mb-1" /><p className="text-xs text-gray-500">Completed</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.completedChapters}/{stats.totalChapters}</p></div>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-2 text-center"><Flame size={20} className="text-purple-500 mx-auto mb-1" /><p className="text-xs text-gray-500">Streak</p><p className="text-lg font-bold text-gray-800 dark:text-white">{streak.count} 🔥</p>{freezes > 0 && <p className="text-xs text-blue-500"><Shield size={12} className="inline" /> x{freezes}</p>}</div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-2 text-center"><Zap size={20} className="text-yellow-500 mx-auto mb-1" /><p className="text-xs text-gray-500">Level</p><p className="text-sm font-bold text-gray-800 dark:text-white">{levelInfo.currentLevel?.emoji} {levelInfo.currentLevel?.name}</p></div>
            </div>
            <div className="mb-4"><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">XP: {levelInfo.totalXP} / {levelInfo.nextLevel?.xpRequired || 'Max'}</span><span className="text-yellow-600 font-semibold">Lv.{levelInfo.level}</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: `${Math.min(levelInfo.progress, 100)}%` }} /></div>{levelInfo.xpForNext > 0 && <p className="text-xs text-gray-400 mt-1">{levelInfo.xpForNext} XP to next level</p>}</div>
            {stats.strongest && stats.weakest && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3"><TrendingUp size={16} className="text-green-500 mb-1" /><p className="text-xs text-gray-500">Strongest</p><p className="font-semibold text-sm text-gray-800 dark:text-white">{stats.strongest[0]}</p><p className="text-lg font-bold text-green-600">{stats.strongest[1].percentage}%</p></div>
                <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-3"><Target size={16} className="text-red-500 mb-1" /><p className="text-xs text-gray-500">Needs Work</p><p className="font-semibold text-sm text-gray-800 dark:text-white">{stats.weakest[0]}</p><p className="text-lg font-bold text-red-600">{stats.weakest[1].percentage}%</p></div>
              </div>
            )}
            {earnedBadges.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"><h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1"><Medal size={14} /> Badges ({earnedBadges.length})</h3><div className="flex flex-wrap gap-2">{earnedBadges.map(badge => (<div key={badge.id} className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg px-3 py-2 text-center" title={badge.description}><span className="text-2xl">{badge.emoji}</span><p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{badge.name}</p></div>))}</div></div>
            )}
            <button onClick={goToSyllabus} className="w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600">{t('continueLearning')}</button>
          </div>
        </div>
      )}

      <div className="flex-1 px-4 space-y-8">
        {!hasSaved && (
          <>
            <div className="space-y-3"><h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><BookOpen size={20} /> Pehle Board Chuno</h2><div className="grid grid-cols-2 gap-3">{boards.map((b) => (<button key={b} onClick={() => setBoard(b)} className={`p-4 rounded-xl border-2 font-semibold text-lg card-enter ${board === b ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-orange-300'}`}>{b}</button>))}</div></div>
            {board && (<div className="space-y-3"><h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Target size={20} /> Ab Class Batao</h2><div className="grid grid-cols-5 gap-2">{classes.map((c) => (<button key={c} onClick={() => setClassLevel(c)} className={`p-3 rounded-xl border-2 font-semibold card-enter ${classLevel === c ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-orange-300'}`}>{c}</button>))}</div></div>)}
            {board && classLevel && (<button onClick={handleStart} className="w-full mt-8 py-4 bg-orange-500 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 card-enter">Shuru Karte Hain <ArrowRight size={20} /></button>)}
          </>
        )}
      </div>

      <div className="px-4 py-8 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/challenges')}><Target size={24} className="text-green-500" /><div><p className="font-semibold text-sm dark:text-white">{t('challenges')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Complete tasks, earn bonus XP every day</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/todo')}><ClipboardList size={24} className="text-emerald-500" /><div><p className="font-semibold text-sm dark:text-white">Study To-Do</p><p className="text-xs text-gray-500 dark:text-gray-400">Organize your study tasks</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/study-plan')}><Calendar size={24} className="text-pink-500" /><div><p className="font-semibold text-sm dark:text-white">AI Study Plan</p><p className="text-xs text-gray-500 dark:text-gray-400">Personalized exam study schedule</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/essay')}><Pen size={24} className="text-amber-500" /><div><p className="font-semibold text-sm dark:text-white">AI Essay Writer</p><p className="text-xs text-gray-500 dark:text-gray-400">Generate essays on any topic instantly</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/compare')}><BarChart3 size={24} className="text-teal-500" /><div><p className="font-semibold text-sm dark:text-white">Compare Classes</p><p className="text-xs text-gray-500 dark:text-gray-400">Side-by-side progress across all classes</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/leaderboard')}><Trophy size={24} className="text-yellow-500" /><div><p className="font-semibold text-sm dark:text-white">{t('leaderboard')}</p><p className="text-xs text-gray-500 dark:text-gray-400">See your progress ranking across all classes</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/analytics')}><PieChart size={24} className="text-blue-500" /><div><p className="font-semibold text-sm dark:text-white">{t('analytics')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Detailed subject-wise stats and charts</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/revision')}><Brain size={24} className="text-violet-500" /><div><p className="font-semibold text-sm dark:text-white">{t('revision')}</p><p className="text-xs text-gray-500 dark:text-gray-400">AI suggests what to revise based on weak areas</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/reminders')}><Bell size={24} className="text-amber-500" /><div><p className="font-semibold text-sm dark:text-white">{t('reminders')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Get notified when it's time to study</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/weekly')}><BarChart3 size={24} className="text-teal-500" /><div><p className="font-semibold text-sm dark:text-white">{t('weekly')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Your study stats for this week</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/calendar')}><CalendarDays size={24} className="text-green-500" /><div><p className="font-semibold text-sm dark:text-white">{t('calendar')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Visualize your study consistency</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/formulas')}><Calculator size={24} className="text-indigo-500" /><div><p className="font-semibold text-sm dark:text-white">{t('formulas')}</p><p className="text-xs text-gray-500 dark:text-gray-400">All formulas for every subject, AI-generated</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/music')}><Music size={24} className="text-indigo-500" /><div><p className="font-semibold text-sm dark:text-white">Study Music</p><p className="text-xs text-gray-500 dark:text-gray-400">Lo-fi beats for focused studying</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/syllabus')}><BookOpen size={24} className="text-orange-500" /><div><p className="font-semibold text-sm dark:text-white">{t('syllabus')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Browse chapters, track progress, write notes</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/doubt-solver')}><Brain size={24} className="text-purple-500" /><div><p className="font-semibold text-sm dark:text-white">{t('doubtSolver')}</p><p className="text-xs text-gray-500 dark:text-gray-400">2 AM bhi answer milega, Socratic style mein</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/quiz')}><Target size={24} className="text-green-500" /><div><p className="font-semibold text-sm dark:text-white">{t('quiz')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Test yourself with MCQs from completed chapters</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/flashcards')}><Layers size={24} className="text-blue-500" /><div><p className="font-semibold text-sm dark:text-white">{t('flashcards')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Create and review flashcards for any chapter</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/whiteboard')}><Pen size={24} className="text-gray-600" /><div><p className="font-semibold text-sm dark:text-white">{t('whiteboard')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Draw, doodle, and scribble while studying</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 stagger-item" onClick={() => navigate('/timer')}><Clock size={24} className="text-orange-500" /><div><p className="font-semibold text-sm dark:text-white">{t('timer')}</p><p className="text-xs text-gray-500 dark:text-gray-400">Pomodoro focus sessions with break reminders</p></div></div>
      </div>
    </div>
  );
}

export default Home;
