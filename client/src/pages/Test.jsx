import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Loader2, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { t } from '../utils/language';

function Test() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chapter, subject, board, classLevel } = location.state || {};

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!chapter || !subject) {
      navigate('/syllabus');
      return;
    }
    generateTest();
  }, []);

  const generateTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://gyaansetu-8b44.onrender.com/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter, subject, board, classLevel })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setTest(data);
        setTimeLeft((data.timeMinutes || 15) * 60);
      }
    } catch (err) {
      setError('Failed to generate test.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (started && !submitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    let totalScore = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correct) {
        totalScore += q.marks || 4;
      }
    });
    setScore(totalScore);
    setSubmitted(true);
  };

  if (!chapter) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-purple-500 dark:bg-purple-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/syllabus')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2 flex-1"><Clock size={24} /><div><h1 className="font-bold text-lg">Chapter Test</h1><p className="text-xs text-purple-100">{subject} • {board} Class {classLevel}</p></div></div>
        {started && !submitted && <div className={`px-3 py-1 rounded-full font-bold text-sm ${timeLeft < 60 ? 'bg-red-400 animate-pulse' : 'bg-purple-400'}`}>{formatTime(timeLeft)}</div>}
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 size={48} className="text-purple-500 animate-spin mb-4" /><p className="text-gray-500 dark:text-gray-400">{t('loading')}</p></div>
        ) : error ? (
          <div className="text-center py-20"><p className="text-red-500 mb-4">{error}</p><button onClick={generateTest} className="px-6 py-2 bg-purple-500 text-white rounded-xl">Retry</button></div>
        ) : !started ? (
          <div className="text-center space-y-6 py-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{test?.title}</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-sm mx-auto space-y-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Questions</span><span className="font-bold">{test?.questions?.length || 10}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Total Marks</span><span className="font-bold">{test?.totalMarks || 40}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Time</span><span className="font-bold">{test?.timeMinutes || 15} minutes</span></div>
              <button onClick={() => setStarted(true)} className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold text-lg hover:bg-purple-600">Start Test</button>
            </div>
          </div>
        ) : submitted ? (
          <div className="space-y-6 py-6">
            <div className="text-center"><Trophy size={64} className="text-yellow-500 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-800 dark:text-white">{score}/{test.totalMarks}</p><p className="text-gray-500 dark:text-gray-400 mt-1">{score >= test.totalMarks * 0.8 ? 'Excellent! 🎉' : score >= test.totalMarks * 0.5 ? 'Good job! 👏' : 'Keep practicing! 💪'}</p></div>
            <div className="space-y-3">
              {test.questions.map((q, i) => {
                const userAns = answers[i];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={i} className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? <CheckCircle size={18} className="text-green-500 mt-0.5" /> : <XCircle size={18} className="text-red-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{i + 1}. {q.question}</p>
                        <p className="text-sm mt-1">Your answer: <span className={isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{q.options[userAns] || 'Not answered'}</span></p>
                        {!isCorrect && <p className="text-sm text-green-600 mt-1">Correct: {q.options[q.correct]}</p>}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate('/syllabus')} className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"><RotateCcw size={20} /> {t('back')} to {t('syllabus')}</button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400"><span>Question {currentQ + 1} of {test.questions.length}</span><span>{Object.keys(answers).length} answered</span></div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${((currentQ + 1) / test.questions.length) * 100}%` }} /></div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{currentQ + 1}. {test.questions[currentQ].question}</p>
              <div className="space-y-2">
                {test.questions[currentQ].options.map((opt, oi) => (
                  <button key={oi} onClick={() => selectAnswer(currentQ, oi)} className={`w-full p-3 rounded-xl border-2 text-left font-medium transition-all ${answers[currentQ] === oi ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 text-gray-700 dark:text-gray-300'}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="flex-1 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm disabled:opacity-30 font-medium text-gray-600 dark:text-gray-300">Previous</button>
              {currentQ < test.questions.length - 1 ? (
                <button onClick={() => setCurrentQ(currentQ + 1)} className="flex-1 py-2 bg-purple-500 text-white rounded-xl font-medium">Next</button>
              ) : (
                <button onClick={handleSubmit} className="flex-1 py-2 bg-green-500 text-white rounded-xl font-bold">Submit Test</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;