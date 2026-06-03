const EXAM_KEY = 'gyaansetu_exam';

export const getExam = () => {
  const saved = localStorage.getItem(EXAM_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const setExam = (subject, date) => {
  const exam = { subject, date, createdAt: new Date().toISOString() };
  localStorage.setItem(EXAM_KEY, JSON.stringify(exam));
  return exam;
};

export const removeExam = () => {
  localStorage.removeItem(EXAM_KEY);
};

export const getDaysLeft = () => {
  const exam = getExam();
  if (!exam) return null;
  const examDate = new Date(exam.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { days: diffDays, subject: exam.subject, date: exam.date };
};