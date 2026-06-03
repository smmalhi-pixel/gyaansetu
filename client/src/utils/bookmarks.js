const BOOKMARK_KEY = 'gyaansetu_bookmarks';

export const getBookmarks = (board, classLevel) => {
  const key = `${BOOKMARK_KEY}_${board}_${classLevel}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

export const toggleBookmark = (board, classLevel, chapterId, chapterName) => {
  const bookmarks = getBookmarks(board, classLevel);
  const index = bookmarks.findIndex(b => b.id === chapterId);
  
  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push({ id: chapterId, name: chapterName, bookmarkedAt: new Date().toISOString() });
  }
  
  const key = `${BOOKMARK_KEY}_${board}_${classLevel}`;
  localStorage.setItem(key, JSON.stringify(bookmarks));
  return bookmarks;
};

export const isBookmarked = (board, classLevel, chapterId) => {
  const bookmarks = getBookmarks(board, classLevel);
  return bookmarks.some(b => b.id === chapterId);
};