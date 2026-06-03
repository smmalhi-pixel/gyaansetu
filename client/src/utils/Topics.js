const TOPICS_KEY = 'gyaansetu_topics';

export const getTopics = (board, classLevel) => {
  const key = `${TOPICS_KEY}_${board}_${classLevel}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : {};
};

export const toggleTopic = (board, classLevel, chapterId, topicIndex) => {
  const key = `${TOPICS_KEY}_${board}_${classLevel}`;
  const topics = getTopics(board, classLevel);
  
  if (!topics[chapterId]) {
    topics[chapterId] = {};
  }
  
  topics[chapterId][topicIndex] = !topics[chapterId][topicIndex];
  localStorage.setItem(key, JSON.stringify(topics));
  return topics;
};

export const getTopicProgress = (board, classLevel, chapterId, totalTopics) => {
  const topics = getTopics(board, classLevel);
  const chapterTopics = topics[chapterId] || {};
  const completed = Object.values(chapterTopics).filter(v => v === true).length;
  return { completed, total: totalTopics, percentage: totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0 };
};

// Generate default topic names for chapters
export const getDefaultTopics = (chapterName, totalTopics) => {
  const genericTopics = [
    'Introduction & Basics',
    'Key Concepts',
    'Formulas & Theorems',
    'Solved Examples',
    'Practice Problems',
    'Common Mistakes',
    'Quick Revision',
    'Advanced Applications',
    'Exam Tips',
    'Summary'
  ];
  return genericTopics.slice(0, totalTopics);
};
