import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pen, Loader2, Copy, CheckCircle, BookOpen, Sparkles } from 'lucide-react';

function Essay() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('descriptive');
  const [wordCount, setWordCount] = useState(300);
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  const generateEssay = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/essay/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, board, classLevel, type, wordCount })
      });
      const data = await response.json();
      if (data.error) setError(data.error); else setEssay(data);
    } catch (err) { setError('Failed to generate essay.'); }
    setLoading(false);
  };

  const copyEssay = () => {
    if (essay) {
      navigator.clipboard.writeText(`${essay.title}\n\n${essay.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const types = ['descriptive', 'narrative', 'argumentative', 'persuasive', 'expository'];
  const wordCounts = [150, 250, 300, 500, 750];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-amber-500 dark:bg-amber-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Pen size={24} /><h1 className="font-bold text-lg">AI Essay Writer</h1></div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {!essay ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Write an Essay</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">Topic</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Importance of Education" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white mt-1 focus:outline-none focus:border-amber-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">Type</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {types.map(t => (
                    <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${type === t ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">Word Count</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {wordCounts.map(w => (
                    <button key={w} onClick={() => setWordCount(w)} className={`px-4 py-2 rounded-full text-sm font-semibold ${wordCount === w ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{w}</button>
                  ))}
                </div>
              </div>

              <button onClick={generateEssay} disabled={!topic.trim() || loading} className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-lg hover:bg-amber-600 disabled:bg-gray-300 flex items-center justify-center gap-2">
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                {loading ? 'Writing...' : 'Generate Essay'}
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setEssay(null)} className="text-sm text-amber-500">← New Essay</button>
              <button onClick={copyEssay} className="flex items-center gap-1 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl text-sm font-semibold">
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{essay.title}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full capitalize">{essay.type}</span>
                  <span className="text-xs text-gray-400">{essay.wordCount} words</span>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {essay.content.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

            {essay.keyPoints && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><BookOpen size={18} className="text-amber-500" /> Key Points</h3>
                <div className="space-y-2">
                  {essay.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-amber-500 font-bold">{i + 1}.</span> {point}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Essay;