const CHALLENGES_KEY = 'gyaansetu_daily_challenges';

const CHALLENGE_TEMPLATES = [
  { id: 'complete_chapters', title: 'Chapter Champion', description: 'Complete {target} chapters today', icon: '📚', target: 3, xpReward: 30 },
  { id: 'solve_quiz', title: 'Quiz Master', description: 'Score 4/5 in a quiz', icon: '🧠', target: 1, xpReward: 25 },
  { id: 'write_notes', title: 'Note Taker', description: 'Write notes for {target} chapters', icon: '📝', target: 2, xpReward: 20 },
  { id: 'study_timer', title: 'Focused Study', description: 'Complete {target} Pomodoro sessions', icon: '⏱️', target: 4, xpReward: 35 },
  { id: 'review_flashcards', title: 'Memory Boost', description: 'Review flashcards for {target} chapters', icon: '🃏', target: 3, xpReward: 25 },
  { id: 'take_test', title: 'Test Taker', description: 'Score 30+ in a chapter test', icon: '📋', target: 1, xpReward: 40 },
  { id: 'streak_day', title: 'Consistent Learner', description: 'Maintain your streak today', icon: '🔥', target: 1, xpReward: 15 },
  { id: 'mixed_quiz', title: 'Knowledge Explorer', description: 'Take a mixed-subject quiz', icon: '🎯', target: 1, xpReward: 30 },
];

export const getTodayChallenge = () => {
  const today = new Date().toDateString();
  const saved = localStorage.getItem(CHALLENGES_KEY);
  const data = saved ? JSON.parse(saved) : {};

  if (data.date === today && data.challenges) {
    return data;
  }

  // Generate new challenges
  const shuffled = CHALLENGE_TEMPLATES.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  
  const challenges = selected.map(c => ({
    ...c,
    description: c.description.replace('{target}', c.target),
    completed: false,
    progress: 0,
  }));

  const newData = { date: today, challenges };
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(newData));
  return newData;
};

export const updateChallengeProgress = (challengeId, progress) => {
  const data = getTodayChallenge();
  const challenge = data.challenges.find(c => c.id === challengeId);
  if (challenge) {
    challenge.progress = progress;
    if (progress >= challenge.target) {
      challenge.completed = true;
    }
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(data));
  }
  return data;
};

export const claimReward = (challengeId) => {
  const data = getTodayChallenge();
  const challenge = data.challenges.find(c => c.id === challengeId);
  if (challenge && challenge.completed && !challenge.claimed) {
    challenge.claimed = true;
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(data));
    return challenge.xpReward;
  }
  return 0;
};