const TIMER_KEY = 'gyaansetu_timer_sessions';

export const getTodaySessions = () => {
  const today = new Date().toDateString();
  const data = localStorage.getItem(TIMER_KEY);
  const sessions = data ? JSON.parse(data) : {};
  return sessions[today] || 0;
};

export const addSession = () => {
  const today = new Date().toDateString();
  const data = localStorage.getItem(TIMER_KEY);
  const sessions = data ? JSON.parse(data) : {};
  sessions[today] = (sessions[today] || 0) + 1;
  localStorage.setItem(TIMER_KEY, JSON.stringify(sessions));
  return sessions[today];
};

export const getWeekSessions = () => {
  const data = localStorage.getItem(TIMER_KEY);
  const sessions = data ? JSON.parse(data) : {};
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    weekData.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: sessions[key] || 0,
      date: key
    });
  }
  return weekData;
};
