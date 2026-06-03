const XP_KEY = 'gyaansetu_xp';

const XP_ACTIONS = {
  complete_chapter: 50,
  complete_topic: 10,
  write_note: 15,
  complete_test: 30,
  perfect_test: 50,
  complete_quiz: 20,
  complete_timer_session: 25,
  daily_login: 5,
  streak_bonus: 10,
};

const LEVELS = [
  { level: 1, name: 'Beginner', xpRequired: 0, emoji: '🌱' },
  { level: 2, name: 'Learner', xpRequired: 100, emoji: '📚' },
  { level: 3, name: 'Scholar', xpRequired: 300, emoji: '🎓' },
  { level: 4, name: 'Expert', xpRequired: 600, emoji: '⚡' },
  { level: 5, name: 'Master', xpRequired: 1000, emoji: '🏆' },
  { level: 6, name: 'Genius', xpRequired: 1500, emoji: '🧠' },
  { level: 7, name: 'Prodigy', xpRequired: 2200, emoji: '💎' },
  { level: 8, name: 'Legend', xpRequired: 3000, emoji: '👑' },
  { level: 9, name: 'Mythic', xpRequired: 4000, emoji: '🐉' },
  { level: 10, name: 'Gyaan Guru', xpRequired: 5000, emoji: '🌟' },
];

export const getXP = () => {
  const saved = localStorage.getItem(XP_KEY);
  return saved ? JSON.parse(saved) : { totalXP: 0, level: 1, history: [] };
};

export const addXP = (action) => {
  const xpData = getXP();
  const xpEarned = XP_ACTIONS[action] || 0;
  
  xpData.totalXP += xpEarned;
  xpData.history.push({ action, xp: xpEarned, time: new Date().toISOString() });
  
  // Calculate level
  let newLevel = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xpData.totalXP >= LEVELS[i].xpRequired) {
      newLevel = LEVELS[i].level;
      break;
    }
  }
  
  const leveledUp = newLevel > xpData.level;
  xpData.level = newLevel;
  
  localStorage.setItem(XP_KEY, JSON.stringify(xpData));
  
  return {
    xpEarned,
    totalXP: xpData.totalXP,
    level: xpData.level,
    leveledUp,
    levelData: LEVELS.find(l => l.level === xpData.level),
    nextLevel: LEVELS.find(l => l.level === xpData.level + 1),
  };
};

export const getLevelInfo = () => {
  const xpData = getXP();
  const currentLevel = LEVELS.find(l => l.level === xpData.level);
  const nextLevel = LEVELS.find(l => l.level === xpData.level + 1);
  const xpForNext = nextLevel ? nextLevel.xpRequired - xpData.totalXP : 0;
  
  return {
    ...xpData,
    currentLevel,
    nextLevel,
    xpForNext,
    progress: nextLevel ? ((xpData.totalXP - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100,
  };
};