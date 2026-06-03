const FLASHCARDS_KEY = 'gyaansetu_flashcards';

export const getFlashcards = (board, classLevel) => {
  const key = `${FLASHCARDS_KEY}_${board}_${classLevel}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : {};
};

export const addFlashcard = (board, classLevel, chapterId, question, answer) => {
  const key = `${FLASHCARDS_KEY}_${board}_${classLevel}`;
  const flashcards = getFlashcards(board, classLevel);
  
  if (!flashcards[chapterId]) {
    flashcards[chapterId] = [];
  }
  
  flashcards[chapterId].push({
    id: Date.now().toString(),
    question,
    answer,
    created: new Date().toISOString()
  });
  
  localStorage.setItem(key, JSON.stringify(flashcards));
  return flashcards;
};

export const deleteFlashcard = (board, classLevel, chapterId, cardId) => {
  const key = `${FLASHCARDS_KEY}_${board}_${classLevel}`;
  const flashcards = getFlashcards(board, classLevel);
  
  if (flashcards[chapterId]) {
    flashcards[chapterId] = flashcards[chapterId].filter(c => c.id !== cardId);
    localStorage.setItem(key, JSON.stringify(flashcards));
  }
  return flashcards;
};