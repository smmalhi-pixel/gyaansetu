import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Loader2, BookOpen, Copy, CheckCircle } from 'lucide-react';
import { t } from '../utils/language';

function Formulas() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formulaData, setFormulaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  useEffect(() => {
    fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => setSubjects(Object.keys(data)))
      .catch(() => {});
  }, []);

  const generateFormulas = async (subject) => {
    setSelectedSubject(subject); setLoading(true); setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/formulas/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, board, classLevel })
      });
      const data = await response.json();
      if (data.error) setError(data.error); else setFormulaData(data);
    } catch (err) { setError('Failed to generate formula sheet.'); }
    setLoading(false);
  };

  const copyFormula = (text) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-indigo-500 dark:bg-indigo-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Calculator size={24} /><div><h1 className="font-bold text-lg">{t('formulas')}</h1><p className="text-xs text-indigo-100">{board} Class {classLevel}</p></div></div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {!selectedSubject ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Select a Subject</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI will generate all formulas for the selected subject</p>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map(subject => (
                <button key={subject} onClick={() => generateFormulas(subject)} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all text-center">
                  <BookOpen size={24} className="text-indigo-500 mx-auto mb-2" /><span className="font-semibold text-gray-800 dark:text-white">{subject}</span>
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 size={48} className="text-indigo-500 animate-spin mb-4" /><p className="text-gray-500 dark:text-gray-400">{t('loading')}</p></div>
        ) : error ? (
          <div className="text-center py-20"><p className="text-red-500 mb-4">{error}</p><button onClick={() => generateFormulas(selectedSubject)} className="px-6 py-2 bg-indigo-500 text-white rounded-xl">Retry</button></div>
        ) : formulaData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800 dark:text-white">{formulaData.subject} Formulas</h2><button onClick={() => setSelectedSubject(null)} className="text-sm text-indigo-500">Change Subject</button></div>
            {formulaData.chapters?.map((chapter, ci) => (
              <div key={ci} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-3">{chapter.chapterName}</h3>
                <div className="space-y-3">
                  {chapter.formulas?.map((formula, fi) => (
                    <div key={fi} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">{formula.name}</p>
                          <p className="text-lg font-mono text-indigo-600 dark:text-indigo-400 my-1">{formula.formula}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formula.description}</p>
                          {formula.example && <p className="text-xs text-green-600 dark:text-green-400 mt-1">Example: {formula.example}</p>}
                        </div>
                        <button onClick={() => copyFormula(formula.formula)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">{copied === formula.formula ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Formulas;