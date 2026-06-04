import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Loader2, Lightbulb, Clock, Target, BookOpen } from 'lucide-react';
import { t } from '../utils/Language';

function Revision() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [revisionPlan, setRevisionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';
  const progressKey = `progress_${board}_${classLevel}`;

  useEffect(() => {
    fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => setSubjects(data))
      .catch(() => {});
  }, []);

  const getWeakChapters = (subject) => {
    const saved = localStorage.getItem(progressKey);
    const progress = saved ? JSON.parse(saved) : {};
    const chapters = subjects[subject] || [];
    return chapters.filter(ch => progress[ch.id] !== 'completed').map(ch => ch.name).slice(0, 5);
  };

  const generateRevision = async (subject) => {
    setSelectedSubject(subject); setLoading(true); setError(null);
    const weakChapters = getWeakChapters(subject);
    try {
      const response = await fetch('http://localhost:5000/api/revision/suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, board, classLevel, weakChapters })
      });
      const data = await response.json();
      if (data.error) setError(data.error); else setRevisionPlan(data);
    } catch (err) { setError('Failed to generate revision plan.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-violet-500 dark:bg-violet-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Brain size={24} /><div><h1 className="font-bold text-lg">{t('revision')}</h1><p className="text-xs text-violet-100">{board} Class {classLevel}</p></div></div>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        {!selectedSubject ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">What to Revise?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI analyzes your weak areas and creates a revision plan</p>
            {Object.keys(subjects).map(subject => (
              <button key={subject} onClick={() => generateRevision(subject)} className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl text-left hover:border-violet-300 border border-gray-100 dark:border-gray-700 transition-all">
                <div className="flex items-center gap-3"><BookOpen size={20} className="text-violet-500" /><span className="font-semibold text-gray-800 dark:text-white">{subject}</span></div>
              </button>
            ))}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 size={48} className="text-violet-500 animate-spin mb-4" /><p className="text-gray-500 dark:text-gray-400">{t('loading')}</p></div>
        ) : error ? (
          <div className="text-center py-20"><p className="text-red-500 mb-4">{error}</p><button onClick={() => generateRevision(selectedSubject)} className="px-6 py-2 bg-violet-500 text-white rounded-xl">Retry</button></div>
        ) : revisionPlan ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800 dark:text-white">{revisionPlan.subject}</h2><button onClick={() => setSelectedSubject(null)} className="text-sm text-violet-500">Change</button></div>
            <div className="bg-violet-50 dark:bg-violet-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-violet-700 dark:text-violet-400 flex items-center gap-2 mb-2"><Target size={18} /> Focus Areas</h3>
              <div className="flex flex-wrap gap-2">{revisionPlan.focusAreas?.map((area, i) => (<span key={i} className="px-3 py-1 bg-violet-100 dark:bg-violet-800 rounded-full text-sm text-violet-700 dark:text-violet-300">{area}</span>))}</div>
            </div>
            {revisionPlan.revisionPlan?.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-2"><h3 className="font-bold text-gray-800 dark:text-white">{item.chapter}</h3><span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {item.estimatedTime}</span></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.whyImportant}</p>
                <div className="space-y-1 mb-3"><p className="text-xs font-semibold text-gray-500 uppercase">Key Topics:</p>{item.keyTopics?.map((topic, j) => (<div key={j} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Lightbulb size={14} className="text-yellow-500" />{topic}</div>))}</div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl"><p className="text-sm text-yellow-700 dark:text-yellow-400">💡 {item.quickTip}</p></div>
              </div>
            ))}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white text-center"><p className="text-lg font-semibold">{revisionPlan.motivation}</p></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Revision;
