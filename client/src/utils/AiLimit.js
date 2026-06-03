const LIMIT_KEY = 'gyaansetu_ai_limit';
const DAILY_LIMIT = 10; // Max AI calls per day

export const getAIUsage = () => {
  const today = new Date().toDateString();
  const saved = localStorage.getItem(LIMIT_KEY);
  const data = saved ? JSON.parse(saved) : { date: today, count: 0 };
  
  if (data.date !== today) {
    return { date: today, count: 0 };
  }
  return data;
};

export const incrementAIUsage = () => {
  const usage = getAIUsage();
  usage.count += 1;
  localStorage.setItem(LIMIT_KEY, JSON.stringify(usage));
  return usage;
};

export const canUseAI = () => {
  const usage = getAIUsage();
  return usage.count < DAILY_LIMIT;
};

export const getRemainingAI = () => {
  const usage = getAIUsage();
  return Math.max(0, DAILY_LIMIT - usage.count);
};
