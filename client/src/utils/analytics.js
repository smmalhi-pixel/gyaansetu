export const getSubjectAnalytics = (board, classLevel) => {
  const progressKey = `progress_${board}_${classLevel}`;
  const saved = localStorage.getItem(progressKey);
  const progress = saved ? JSON.parse(saved) : {};

  const timerData = localStorage.getItem('gyaansetu_timer_sessions');
  const timerSessions = timerData ? JSON.parse(timerData) : {};

  const notesData = localStorage.getItem(`gyaansetu_notes_${board}_${classLevel}`);
  const notes = notesData ? JSON.parse(notesData) : {};

  const testData = localStorage.getItem('gyaansetu_flashcards');
  const flashcards = testData ? JSON.parse(testData) : {};

  // Get chapters data
  const chaptersData = localStorage.getItem('chapters');
  
  const totalCompleted = Object.values(progress).filter(v => v === 'completed').length;
  const totalInProgress = Object.values(progress).filter(v => v === 'in_progress').length;
  const totalNotStarted = Object.values(progress).filter(v => v === 'not_started').length;
  const total = totalCompleted + totalInProgress + totalNotStarted;

  const totalNotes = Object.values(notes).filter(n => n && n.trim().length > 0).length;
  const totalFlashcards = Object.values(flashcards).reduce((sum, cards) => sum + (Array.isArray(cards) ? cards.length : 0), 0);
  const totalStudySessions = Object.values(timerSessions).reduce((sum, v) => sum + v, 0);

  return {
    totalChapters: total,
    completed: totalCompleted,
    inProgress: totalInProgress,
    notStarted: totalNotStarted,
    percentage: total > 0 ? Math.round((totalCompleted / total) * 100) : 0,
    totalNotes,
    totalFlashcards,
    totalStudySessions,
  };
};

export const getWeeklyActivity = () => {
  const timerData = localStorage.getItem('gyaansetu_timer_sessions');
  const sessions = timerData ? JSON.parse(timerData) : {};

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    days.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: sessions[key] || 0,
    });
  }
  return days;
};