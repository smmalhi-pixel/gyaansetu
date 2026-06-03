import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, Clock, Target, BookOpen, Lightbulb, Trophy } from 'lucide-react';
import { t } from '../utils/language';

function StudyPlan() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [daysUntilExam, setDaysUntilExam] = useState(7);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  useEffect(() => {
    fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => setSubjects(Object.keys(data)))
      .catch(() => {});
  }, []);

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const generatePlan = async () => {
    if (selectedSubjects.length === 0) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/studyplan/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: selectedSubjects, board, classLevel, daysUntilExam })
      });
      const data = await response.json();
      if (data.error) setError(data.error); else setPlan(data);
    } catch (err) { setError('Failed to generate plan.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-pink-500 dark:bg-pink-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Calendar size={24} /><h1 className="font-bold text-lg">AI Study Plan</h1></div>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        {!plan ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create Your Study Plan</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><Clock size={18} className="text-pink-500" /> Days Until Exam</h3>
              <div className="flex gap-2 flex-wrap">
                {[3, 5, 7, 10, 14, 21, 30].map(d => (
                  <button key={d} onClick={() => setDaysUntilExam(d)} className={`px-4 py-2 rounded-full font-semibold text-sm ${daysUntilExam === d ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{d} days</button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><BookOpen size={18} className="text-pink-500" /> Select Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <button key={subject} onClick={() => toggleSubject(subject)} className={`px-4 py-2 rounded-full font-semibold text-sm ${selectedSubjects.includes(subject) ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{subject}</button>
                ))}
              </div>
            </div>

            <button onClick={generatePlan} disabled={selectedSubjects.length === 0 || loading} className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold text-lg hover:bg-pink-600 disabled:bg-gray-300">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" /> Generating...</span> : 'Generate Study Plan'}
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 size={48} className="text-pink-500 animate-spin mb-4" /><p className="text-gray-500">{t('loading')}</p></div>
        ) : error ? (
          <div className="text-center py-20"><p className="text-red-500 mb-4">{error}</p><button onClick={() => setPlan(null)} className="px-6 py-2 bg-pink-500 text-white rounded-xl">Back</button></div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800 dark:text-white">{plan.title}</h2><button onClick={() => setPlan(null)} className="text-sm text-pink-500">New Plan</button></div>
            
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-5 text-white text-center">
              <Trophy size={32} className="mx-auto mb-2" />
              <p className="text-lg font-semibold">{plan.motivation}</p>
            </div>

            {plan.dailySchedule?.map((day, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Target size={18} className="text-pink-500" /> Day {day.day}</h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {day.duration}</span>
                </div>
                <p className="font-semibold text-pink-600 dark:text-pink-400 mb-2">{day.focus}</p>
                <div className="space-y-1 mb-3"><p className="text-xs font-semibold text-gray-500 uppercase">Chapters:</p>{day.chapters?.map((ch, j) => (<div key={j} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><BookOpen size={14} className="text-gray-400" />{ch}</div>))}</div>
                <div className="space-y-1 mb-3"><p className="text-xs font-semibold text-gray-500 uppercase">Tasks:</p>{day.tasks?.map((task, j) => (<div key={j} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Lightbulb size={14} className="text-yellow-500" />{task}</div>))}</div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl"><p className="text-sm text-yellow-700 dark:text-yellow-400">💡 {day.tip}</p></div>
              </div>
            ))}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Exam Tips</h3>
              {plan.examTips?.map((tip, i) => (<div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2"><Lightbulb size={14} className="text-yellow-500" />{tip}</div>))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPlan;