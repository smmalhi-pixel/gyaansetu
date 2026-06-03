export const getLeaderboardData = () => {
  const boards = ['CBSE', 'ICSE'];
  const allClasses = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const subjects = ['Maths', 'Physics', 'Chemistry', 'Biology', 'Science', 'English', 'Social Science', 'EVS'];
  
  const results = [];

  boards.forEach(board => {
    allClasses.forEach(cls => {
      const progressKey = `progress_${board}_${cls}`;
      const saved = localStorage.getItem(progressKey);
      if (!saved) return;
      const progress = JSON.parse(saved);
      const total = Object.keys(progress).length;
      const completed = Object.values(progress).filter(v => v === 'completed').length;
      if (total === 0) return;
      
      results.push({
        id: `${board}_${cls}`,
        name: `${board} Class ${cls}`,
        board,
        class: cls,
        total,
        completed,
        percentage: Math.round((completed / total) * 100)
      });
    });
  });

  return results.sort((a, b) => b.percentage - a.percentage);
};

export const getSubjectLeaderboard = (board, classLevel) => {
  const progressKey = `progress_${board}_${classLevel}`;
  const saved = localStorage.getItem(progressKey);
  if (!saved) return [];
  const progress = JSON.parse(saved);
  
  const subjectStats = {};
  Object.keys(progress).forEach(chapterId => {
    // Get subject from chapter ID prefix
    const prefix = chapterId.substring(0, 2);
    if (!subjectStats[prefix]) {
      subjectStats[prefix] = { total: 0, completed: 0 };
    }
    subjectStats[prefix].total++;
    if (progress[chapterId] === 'completed') {
      subjectStats[prefix].completed++;
    }
  });

  return Object.entries(subjectStats)
    .map(([prefix, stats]) => ({
      prefix,
      total: stats.total,
      completed: stats.completed,
      percentage: Math.round((stats.completed / stats.total) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);
};