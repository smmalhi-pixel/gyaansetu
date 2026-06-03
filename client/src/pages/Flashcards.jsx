import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, RotateCw, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { getFlashcards, addFlashcard, deleteFlashcard } from '../utils/flashcards';
import { t } from '../utils/language';

function Flashcards() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [chapters, setChapters] = useState({});

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  useEffect(() => {
    setFlashcards(getFlashcards(board, classLevel));
    fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => setChapters(data))
      .catch(() => {});
  }, [board, classLevel]);

  const handleAddCard = () => {
    if (newQuestion.trim() && newAnswer.trim() && selectedChapter) {
      const updated = addFlashcard(board, classLevel, selectedChapter, newQuestion.trim(), newAnswer.trim());
      setFlashcards({ ...updated });
      setNewQuestion('');
      setNewAnswer('');
      setShowAdd(false);
    }
  };

  const handleDeleteCard = (cardId) => {
    const updated = deleteFlashcard(board, classLevel, selectedChapter, cardId);
    setFlashcards({ ...updated });
    if (currentCard >= updated[selectedChapter]?.length) {
      setCurrentCard(Math.max(0, (updated[selectedChapter]?.length || 1) - 1));
    }
  };

  const currentCards = selectedChapter ? flashcards[selectedChapter] || [] : [];
  const allChapterIds = Object.keys(flashcards);
  const totalCards = allChapterIds.reduce((sum, ch) => sum + (flashcards[ch]?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-orange-500 dark:bg-orange-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Layers size={24} /><div><h1 className="font-bold text-lg">{t('flashcards')}</h1><p className="text-xs text-orange-100">{totalCards} cards • {board} Class {classLevel}</p></div></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {!selectedChapter ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Select a Subject</h2>
            {Object.keys(chapters).map(subject => (
              <div key={subject} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">{subject}</h3>
                <div className="space-y-1">
                  {chapters[subject]?.map(chapter => {
                    const cardCount = flashcards[chapter.id]?.length || 0;
                    return (
                      <button key={chapter.id} onClick={() => { setSelectedChapter(chapter.id); setCurrentCard(0); setIsFlipped(false); }} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg text-left hover:border-orange-300 border border-gray-100 dark:border-gray-700 transition-all">
                        <div className="flex justify-between items-center"><span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{chapter.name}</span><span className="text-xs text-gray-400">{cardCount} cards</span></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(chapters).length === 0 && <p className="text-gray-400 text-center py-8">{t('noData')}</p>}
          </div>
        ) : (
          <>
            <button onClick={() => setSelectedChapter(null)} className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"><ChevronLeft size={16} /> {t('back')}</button>
            {currentCards.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-400">Card {currentCard + 1} of {currentCards.length}</div>
                <div onClick={() => setIsFlipped(!isFlipped)} className="min-h-[200px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center cursor-pointer transition-all hover:shadow-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2 uppercase">{isFlipped ? 'Answer' : 'Question'}</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{isFlipped ? currentCards[currentCard].answer : currentCards[currentCard].question}</p>
                    <p className="text-xs text-gray-400 mt-4">Tap to flip</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setIsFlipped(false); }} disabled={currentCard === 0} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow disabled:opacity-30"><ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /></button>
                  <button onClick={() => setIsFlipped(!isFlipped)} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow"><RotateCw size={20} className="text-orange-500" /></button>
                  <button onClick={() => handleDeleteCard(currentCards[currentCard].id)} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={20} className="text-red-400" /></button>
                  <button onClick={() => { setCurrentCard(Math.min(currentCards.length - 1, currentCard + 1)); setIsFlipped(false); }} disabled={currentCard === currentCards.length - 1} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow disabled:opacity-30"><ChevronRight size={20} className="text-gray-600 dark:text-gray-300" /></button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8"><Layers size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-400 dark:text-gray-500">{t('noData')}</p></div>
            )}
            {showAdd ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Question..." className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-orange-400" />
                <input value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Answer..." className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-orange-400" />
                <div className="flex gap-2"><button onClick={handleAddCard} className="flex-1 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm">Add Card</button><button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm">{t('cancel')}</button></div>
              </div>
            ) : (
              <button onClick={() => setShowAdd(true)} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"><Plus size={20} /> {t('flashcards')}</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Flashcards;
