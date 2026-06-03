export const getWeeklyReport = (board, classLevel) => {
  const progressKey = `progress_${board}_${classLevel}`;
  const saved = localStorage.getItem(progressKey);
  const progress = saved ? JSON.parse(saved) : {};

  const timerData = localStorage.getItem('gyaansetu_timer_sessions');
  const timerSessions = timerData ? JSON.parse(timerData) : {};

  const streakData = localStorage.getItem('gyaansetu_streak');
  const streak = streakData ? JSON.parse(streakData) : { count: 0 };

  const xpData = localStorage.getItem('gyaansetu_xp');
  const xp = xpData ? JSON.parse(xpData) : { totalXP: 0, history: [] };

  const challengesData = localStorage.getItem('gyaansetu_daily_challenges');
  const challenges = challengesData ? JSON.parse(challengesData) : { challenges: [] };

  const weekDays = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    weekDays.push({
      date: key,
      day: d.toLocaleDateString('en-US', { weekday: 'long' }),
      shortDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: timerSessions[key] || 0,
    });
  }

  const thisWeekXP = xp.history?.filter(h => {
    const hDate = new Date(h.time);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return hDate >= weekAgo;
  }).reduce((sum, h) => sum + h.xp, 0) || 0;

  const completedThisWeek = Object.entries(progress).filter(([id, status]) => {
    return status === 'completed';
  }).length;

  const challengesCompleted = challenges.challenges?.filter(c => c.completed).length || 0;

  return {
    weekDays,
    streak: streak.count,
    thisWeekXP,
    completedThisWeek,
    challengesCompleted,
    totalTimerSessions: weekDays.reduce((sum, d) => sum + d.sessions, 0),
  };
};