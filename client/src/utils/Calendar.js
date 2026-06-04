const CALENDAR_KEY = 'gyaansetu_study_days';

export const getStudyDays = () => {
  const saved = localStorage.getItem(CALENDAR_KEY);
  return saved ? JSON.parse(saved) : {};
};

export const markToday = () => {
  const today = new Date().toDateString();
  const days = getStudyDays();
  days[today] = (days[today] || 0) + 1;
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(days));
  return days;
};

export const getHeatmapData = (weeks = 20) => {
  const days = getStudyDays();
  const data = [];
  const today = new Date();
  
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const sessions = days[key] || 0;
    
    let intensity = 0;
    if (sessions >= 5) intensity = 4;
    else if (sessions >= 3) intensity = 3;
    else if (sessions >= 2) intensity = 2;
    else if (sessions >= 1) intensity = 1;
    
    data.push({
      date: key,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions,
      intensity,
      isToday: key === today.toDateString(),
    });
  }
  
  return data;
};

export const getStats = () => {
  const days = getStudyDays();
  const values = Object.values(days);
  const totalSessions = values.reduce((sum, v) => sum + v, 0);
  const totalDays = values.length;
  const currentStreak = getCurrentStreak(days);
  
  return { totalSessions, totalDays, currentStreak };
};

const getCurrentStreak = (days) => {
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    if (days[key]) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
};
