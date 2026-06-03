const GOAL_KEY = 'gyaansetu_daily_goal';

export const getTodayGoal = () => {
  const today = new Date().toDateString();
  const saved = localStorage.getItem(GOAL_KEY);
  const data = saved ? JSON.parse(saved) : {};
  
  if (data.date === today) {
    return data;
  }
  
  return { date: today, target: 3, completed: 0, set: false };
};

export const setGoal = (target) => {
  const today = new Date().toDateString();
  const goal = { date: today, target, completed: 0, set: true };
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  return goal;
};

export const updateGoalProgress = (completed) => {
  const goal = getTodayGoal();
  goal.completed = Math.min(completed, goal.target);
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  return goal;
};

export const getGoalProgress = () => {
  const goal = getTodayGoal();
  if (!goal.set || goal.target === 0) return 0;
  return Math.round((goal.completed / goal.target) * 100);
};