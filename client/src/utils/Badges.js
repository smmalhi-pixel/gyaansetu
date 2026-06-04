import { playSound } from './Sounds';

const BADGES_KEY = 'gyaansetu_badges';

const ALL_BADGES = [
  { id: 'first_chapter', name: 'First Step', emoji: '👶', description: 'Complete your first chapter', condition: (stats) => stats.completedChapters >= 1 },
  { id: 'five_chapters', name: 'Getting Started', emoji: '🚶', description: 'Complete 5 chapters', condition: (stats) => stats.completedChapters >= 5 },
  { id: 'ten_chapters', name: 'Halfway There', emoji: '🏃', description: 'Complete 10 chapters', condition: (stats) => stats.completedChapters >= 10 },
  { id: 'twenty_chapters', name: 'Beast Mode', emoji: '🦍', description: 'Complete 20 chapters', condition: (stats) => stats.completedChapters >= 20 },
  { id: 'all_chapters', name: 'Legend', emoji: '👑', description: 'Complete all chapters', condition: (stats) => stats.completedChapters === stats.totalChapters && stats.totalChapters > 0 },
  { id: 'streak_3', name: 'Consistent', emoji: '🔥', description: '3-day study streak', condition: (stats) => stats.streak >= 3 },
  { id: 'streak_7', name: 'On Fire', emoji: '🔥🔥', description: '7-day study streak', condition: (stats) => stats.streak >= 7 },
  { id: 'streak_14', name: 'Unstoppable', emoji: '⚡', description: '14-day study streak', condition: (stats) => stats.streak >= 14 },
  { id: 'streak_30', name: 'Dedicated', emoji: '💎', description: '30-day study streak', condition: (stats) => stats.streak >= 30 },
  { id: 'first_subject', name: 'Subject Master', emoji: '🏆', description: 'Complete all chapters in one subject', condition: (stats) => stats.perfectSubjects > 0 },
  { id: 'ten_sessions', name: 'Focused', emoji: '🎯', description: 'Complete 10 timer sessions', condition: (stats) => stats.timerSessions >= 10 },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Study after 10 PM', condition: (stats) => stats.isNightOwl },
];

export const getBadges = () => {
  const saved = localStorage.getItem(BADGES_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const checkAndAwardBadges = (stats) => {
  const earned = getBadges();
  const earnedIds = earned.map(b => b.id);
  
  const newBadges = ALL_BADGES.filter(badge => {
    return !earnedIds.includes(badge.id) && badge.condition(stats);
  });

  if (newBadges.length > 0) {
    const updated = [...earned, ...newBadges.map(b => ({ id: b.id, earnedAt: new Date().toISOString() }))];
    localStorage.setItem(BADGES_KEY, JSON.stringify(updated));
    setTimeout(() => playSound('badge'), 500);
    return { updated, newBadges };
  }

  return { updated: earned, newBadges: [] };
};

export const getAllBadges = () => {
  const earned = getBadges();
  const earnedIds = earned.map(b => b.id);
  return ALL_BADGES.map(badge => ({
    ...badge,
    earned: earnedIds.includes(badge.id),
    earnedAt: earned.find(e => e.id === badge.id)?.earnedAt
  }));
};
