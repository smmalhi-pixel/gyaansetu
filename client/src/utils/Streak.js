const STREAK_KEY = 'gyaansetu_streak';
const FREEZE_KEY = 'gyaansetu_freeze';

export const getStreak = () => {
  const data = localStorage.getItem(STREAK_KEY);
  if (!data) return { count: 0, lastVisit: null, freezes: 0 };
  return JSON.parse(data);
};

export const updateStreak = () => {
  const today = new Date().toDateString();
  const streak = getStreak();

  if (streak.lastVisit === today) {
    return streak.count;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  let newCount;
  if (streak.lastVisit === yesterdayStr) {
    newCount = streak.count + 1;
  } else if (streak.freezes > 0 && streak.lastVisit) {
    // Use a freeze
    newCount = streak.count + 1;
    streak.freezes -= 1;
  } else {
    newCount = 1;
  }

  const newStreak = { 
    count: newCount, 
    lastVisit: today, 
    freezes: streak.freezes || 0 
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  return newStreak;
};

export const addFreeze = () => {
  const streak = getStreak();
  streak.freezes = (streak.freezes || 0) + 1;
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak.freezes;
};

export const useFreeze = () => {
  const streak = getStreak();
  if (streak.freezes > 0) {
    streak.freezes -= 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    return true;
  }
  return false;
};

export const getFreezeCount = () => {
  const streak = getStreak();
  return streak.freezes || 0;
};
