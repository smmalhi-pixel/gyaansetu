const NOTES_KEY = 'gyaansetu_notes';

export const getNotes = (board, classLevel, chapterId) => {
  const key = `${NOTES_KEY}_${board}_${classLevel}`;
  const saved = localStorage.getItem(key);
  const allNotes = saved ? JSON.parse(saved) : {};
  return allNotes[chapterId] || '';
};

export const saveNotes = (board, classLevel, chapterId, notes) => {
  const key = `${NOTES_KEY}_${board}_${classLevel}`;
  const saved = localStorage.getItem(key);
  const allNotes = saved ? JSON.parse(saved) : {};
  allNotes[chapterId] = notes;
  localStorage.setItem(key, JSON.stringify(allNotes));
};

export const hasNotes = (board, classLevel, chapterId) => {
  const notes = getNotes(board, classLevel, chapterId);
  return notes.trim().length > 0;
};