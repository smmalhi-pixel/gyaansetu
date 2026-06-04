import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Zap, Flame, Star, Moon, Sun, ChevronDown, ChevronUp, CheckCircle, Circle, StickyNote, Save, Play, ClipboardList, FileText, Bookmark, BookmarkCheck } from 'lucide-react';
import { updateStreak, getStreak } from '../utils/Streak';
import { getTheme, applyTheme } from '../utils/Theme';
import { getTopics, toggleTopic, getTopicProgress, getDefaultTopics } from '../utils/Topics';
import { getNotes, saveNotes, hasNotes } from '../utils/Notes';
import { addXP } from '../utils/Xp';
import XPPopup from '../components/XPPopup';
import { showToast } from '../utils/ToastManager';
import { playSound } from '../utils/Sounds';
import { ChapterSkeleton } from '../components/Skeleton';
import { t } from '../utils/Language';
import { toggleBookmark, isBookmarked } from '../utils/Bookmarks';
import { canUseAI, getRemainingAI, incrementAIUsage } from '../utils/AiLimit';

function Syllabus() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState({});
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(getStreak().count);
  const [theme, setTheme] = useState(getTheme());
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [topics, setTopics] = useState({});
  const [notesChapter, setNotesChapter] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [summaryChapter, setSummaryChapter] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';
  const progressKey = `progress_${board}_${classLevel}`;

  const getProgress = () => {
    const saved = localStorage.getItem(progressKey);
    return saved ? JSON.parse(saved) : {};
  };

  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const newStreak = updateStreak();
    setStreak(newStreak);
    setTopics(getTopics(board, classLevel));
    fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => {
        setSubjects(data);
        const firstSubject = Object.keys(data)[0];
        setActiveSubject(firstSubject);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [board, classLevel]);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress, progressKey]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  const cycleStatus = (chapterId) => {
    setProgress(prev => {
      const current = prev[chapterId] || 'not_started';
      const next = current === 'not_started' ? 'in_progress' : current === 'in_progress' ? 'completed' : 'not_started';
      if (next === 'completed') {
        const result = addXP('complete_chapter');
        setXpPopup(result);
        showToast(t('chapterComplete') + ' +50 XP 🎉', 'success');
        playSound('complete');
      }
      return { ...prev, [chapterId]: next };
    });
  };

  const handleToggleTopic = (chapterId, topicIndex) => {
    const updated = toggleTopic(board, classLevel, chapterId, topicIndex);
    setTopics({ ...updated });
    if (updated[chapterId]?.[topicIndex]) {
      const result = addXP('complete_topic');
      setXpPopup(result);
    }
  };

  const handleExpandChapter = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
    setNotesChapter(null);
  };

  const handleOpenNotes = (chapterId) => {
    setNotesChapter(notesChapter === chapterId ? null : chapterId);
    setExpandedChapter(null);
    setNoteText(getNotes(board, classLevel, chapterId));
    setNoteSaved(false);
  };

  const handleSaveNotes = (chapterId) => {
    saveNotes(board, classLevel, chapterId, noteText);
    setNoteSaved(true);
    const result = addXP('write_note');
    setXpPopup(result);
    showToast(t('notesSaved') + ' 📝', 'success');
    playSound('save');
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleChapterSummary = async (chapterId, chapterName) => {
    if (summaryChapter === chapterId) {
      setSummaryChapter(null);
      setSummaryData(null);
      return;
    }
    
    if (!canUseAI()) {
      showToast('Daily AI limit reached (10/day). Try again tomorrow!', 'error');
      return;
    }
    
    incrementAIUsage();
    setSummaryChapter(chapterId);
    setSummaryLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/summary/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter: chapterName, subject: activeSubject, board, classLevel })
      });
      const data = await response.json();
      if (data.error) setSummaryData({ error: data.error }); else setSummaryData(data);
    } catch (err) { setSummaryData({ error: 'Failed to generate summary' }); }
    setSummaryLoading(false);
  };

  const handleBookmark = (chapterId, chapterName) => {
    const updated = toggleBookmark(board, classLevel, chapterId, chapterName);
    setBookmarks(updated);
    showToast(isBookmarked(board, classLevel, chapterId) ? 'Chapter bookmarked! 🔖' : 'Bookmark removed', 'info');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    const newStreak = updateStreak();
    setStreak(newStreak);
    setTopics(getTopics(board, classLevel));
    fetch(`http://localhost:5000/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => { setSubjects(data); setActiveSubject(Object.keys(data)[0]); setRefreshing(false); showToast('Syllabus refreshed!', 'success'); })
      .catch(() => { setRefreshing(false); showToast('Failed to refresh', 'error'); });
  };

  const subjectProgress = (chapters) => {
    if (!chapters || chapters.length === 0) return 0;
    const completed = chapters.filter(ch => progress[ch.id] === 'completed').length;
    return Math.round((completed / chapters.length) * 100);
  };

  const difficultyIcon = (d) => {
    if (d === 'easy') return <Star size={16} className="text-green-500" />;
    if (d === 'medium') return <Flame size={16} className="text-orange-500" />;
    return <Zap size={16} className="text-red-500" />;
  };

  const difficultyColor = (d) => {
    if (d === 'easy') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    if (d === 'medium') return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  };

  const statusColor = (status) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in_progress') return 'bg-yellow-500';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  const statusLabel = (status) => {
    if (status === 'completed') return 'Completed';
    if (status === 'in_progress') return 'In Progress';
    return 'Not Started';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-orange-500 h-14" />
        <ChapterSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-orange-500 dark:bg-orange-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><BookOpen size={24} /><div><h1 className="font-bold text-lg">{t('syllabus')}</h1><p className="text-xs text-orange-100">{board} Class {classLevel}</p></div></div>
        <button onClick={handleToggleTheme} className="ml-auto p-2 rounded-full hover:bg-orange-400 dark:hover:bg-orange-600">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <div className="flex items-center gap-1 bg-orange-400 dark:bg-orange-600 rounded-full px-3 py-1"><Flame size={18} className="text-yellow-300" /><span className="font-bold text-sm">{streak}</span></div>
      </header>

      <div className="bg-white dark:bg-gray-800 shadow-sm px-2 py-2 flex gap-1 overflow-x-auto transition-colors">
        {Object.keys(subjects).map(sub => (
          <button key={sub} onClick={() => { setActiveSubject(sub); setExpandedChapter(null); setNotesChapter(null); }} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeSubject === sub ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{sub}</button>
        ))}
      </div>

      {refreshing && (
        <div className="flex items-center justify-center py-3">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-orange-500">{t('loading')}</span>
        </div>
      )}

      <div className="p-4 space-y-3" onTouchStart={(e) => { e.currentTarget.dataset.startY = e.touches[0].clientY; }} onTouchEnd={(e) => { const startY = parseFloat(e.currentTarget.dataset.startY); const endY = e.changedTouches[0].clientY; if (endY - startY > 100 && window.scrollY === 0) { handleRefresh(); } }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{activeSubject} Chapters ({subjects[activeSubject]?.length || 0})</h2>
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{subjectProgress(subjects[activeSubject])}% done</span>
        </div>

        {subjects[activeSubject]?.map((chapter, i) => {
          const status = progress[chapter.id] || 'not_started';
          const isExpanded = expandedChapter === chapter.id;
          const isNotesOpen = notesChapter === chapter.id;
          const defaultTopics = getDefaultTopics(chapter.name, chapter.topics);
          const topicProgress = getTopicProgress(board, classLevel, chapter.id, chapter.topics);
          const chapterHasNotes = hasNotes(board, classLevel, chapter.id);

          return (
            <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-all overflow-hidden">
              <div className="p-4 cursor-pointer" onClick={() => cycleStatus(chapter.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' : 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'}`}>{status === 'completed' ? '✓' : i + 1}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{chapter.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${difficultyColor(chapter.difficulty)}`}>{difficultyIcon(chapter.difficulty)}{chapter.difficulty}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{chapter.topics} topics</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">• {topicProgress.completed}/{chapter.topics} subtopics done</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(status)} text-white`}>{statusLabel(status)}</span>
                        {chapterHasNotes && <span className="text-xs text-yellow-600 dark:text-yellow-400">📝</span>}
                        {isBookmarked(board, classLevel, chapter.id) && <span className="text-xs text-yellow-500">🔖</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleBookmark(chapter.id, chapter.name); }} className={`p-1 rounded-full transition-colors ${isBookmarked(board, classLevel, chapter.id) ? 'text-yellow-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'}`} title="Bookmark">{isBookmarked(board, classLevel, chapter.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button>
                    <button onClick={(e) => { e.stopPropagation(); handleChapterSummary(chapter.id, chapter.name); }} className={`p-1 rounded-full transition-colors ${summaryChapter === chapter.id ? 'bg-green-100 dark:bg-green-900 text-green-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'}`} title="AI Summary"><FileText size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); navigate('/test', { state: { chapter: chapter.name, subject: activeSubject, board, classLevel } }); }} className="p-1 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-500" title="Chapter Test"><ClipboardList size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); navigate('/lecture', { state: { chapter: chapter.name, subject: activeSubject, board, classLevel } }); }} className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="AI Lecture"><Play size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenNotes(chapter.id); }} className={`p-1 rounded-full ${chapterHasNotes ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'}`} title="Notes"><StickyNote size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleExpandChapter(chapter.id); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">{isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}</button>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-300 ${status === 'completed' ? 'bg-green-500 w-full' : status === 'in_progress' ? 'bg-yellow-500 w-1/2' : 'bg-gray-300 dark:bg-gray-600 w-0'}`} /></div>
              </div>

              {summaryChapter === chapter.id && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">🤖 AI Chapter Summary</h4>
                  {summaryLoading ? <p className="text-sm text-gray-400">Generating summary...</p> : summaryData?.error ? <p className="text-sm text-red-500">{summaryData.error}</p> : summaryData ? (
                    <div className="space-y-3">
                      <div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Quick Recap</p><p className="text-sm text-gray-700 dark:text-gray-300">{summaryData.quickRecap}</p></div>
                      <div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Points</p><div className="space-y-1">{summaryData.keyPoints?.map((point, i) => (<div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><span className="text-green-500">•</span> {point}</div>))}</div></div>
                      {summaryData.importantDefinitions?.length > 0 && (<div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Important Definitions</p>{summaryData.importantDefinitions.map((def, i) => (<div key={i} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1"><p className="text-sm font-semibold text-gray-800 dark:text-white">{def.term}</p><p className="text-xs text-gray-600 dark:text-gray-400">{def.definition}</p></div>))}</div>)}
                      {summaryData.commonMistakes?.length > 0 && (<div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Common Mistakes</p>{summaryData.commonMistakes.map((mistake, i) => (<div key={i} className="flex gap-2 text-sm text-red-600 dark:text-red-400"><span>⚠️</span> {mistake}</div>))}</div>)}
                    </div>
                  ) : null}
                </div>
              )}

              {isNotesOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">📝 My Notes</h4>
                  <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write your notes here..." className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm resize-none focus:outline-none focus:border-orange-400" onClick={(e) => e.stopPropagation()} />
                  <button onClick={(e) => { e.stopPropagation(); handleSaveNotes(chapter.id); }} className="mt-2 w-full py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-600"><Save size={16} />{noteSaved ? 'Saved!' : t('save') + ' Notes'}</button>
                </div>
              )}

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Topic Checklist</h4>
                  <div className="space-y-1">
                    {defaultTopics.map((topic, tIndex) => {
                      const isTopicDone = topics[chapter.id]?.[tIndex] || false;
                      return (<button key={tIndex} onClick={(e) => { e.stopPropagation(); handleToggleTopic(chapter.id, tIndex); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">{isTopicDone ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" /> : <Circle size={18} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}<span className={`text-sm ${isTopicDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{topic}</span></button>);
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"><div className="flex justify-between text-xs text-gray-400"><span>Subtopics: {topicProgress.completed}/{chapter.topics}</span><span>{topicProgress.percentage}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${topicProgress.percentage}%` }} /></div></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {xpPopup && (<XPPopup xpEarned={xpPopup.xpEarned} leveledUp={xpPopup.leveledUp} levelData={xpPopup.levelData} onClose={() => setXpPopup(null)} />)}
    </div>
  );
}

export default Syllabus;
