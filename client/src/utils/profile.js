const PROFILE_KEY = 'gyaansetu_profile';

export const getProfile = () => {
  const saved = localStorage.getItem(PROFILE_KEY);
  return saved ? JSON.parse(saved) : {
    name: '',
    grade: '',
    school: '',
    avatar: '👨‍🎓',
    joined: new Date().toISOString()
  };
};

export const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

export const getTotalStats = () => {
  const xpData = localStorage.getItem('gyaansetu_xp');
  const xp = xpData ? JSON.parse(xpData) : { totalXP: 0 };

  const streakData = localStorage.getItem('gyaansetu_streak');
  const streak = streakData ? JSON.parse(streakData) : { count: 0 };

  const timerData = localStorage.getItem('gyaansetu_timer_sessions');
  const sessions = timerData ? JSON.parse(timerData) : {};
  const totalSessions = Object.values(sessions).reduce((sum, v) => sum + v, 0);

  const badgesData = localStorage.getItem('gyaansetu_badges');
  const badges = badgesData ? JSON.parse(badgesData) : [];
  const totalBadges = badges.length;

  return {
    totalXP: xp.totalXP || 0,
    streak: streak.count || 0,
    totalSessions,
    totalBadges
  };
};

export const AVATARS = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '🦸', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🦹', '🦹‍♀️', '👨‍🔬', '👩‍🔬', '🧑‍🚀', '👨‍💻', '👩‍💻', '🧑‍🎨', '👑'];