import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { t } from '../utils/Language';

function Quiz() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  useEffect(() => {
    const progressKey = `progress_${board}_${classLevel}`;
    const saved = localStorage.getItem(progressKey);
    const progress = saved ? JSON.parse(saved) : {};
    fetch(`https://gyaansetu-8b44.onrender.com/api/chapters/${board}/${classLevel}`)
      .then(r => r.json())
      .then(data => {
        const completedSubjects = {};
        Object.keys(data).forEach(subject => {
          const chapters = data[subject];
          const completed = chapters.filter(ch => progress[ch.id] === 'completed');
          if (completed.length > 0) completedSubjects[subject] = completed;
        });
        setSubjects(completedSubjects);
      })
      .catch(() => {});
  }, [board, classLevel]);

  const generateQuestions = (subject, chapters) => {
    const questionBank = {
      Physics: [
        { q: "What is the SI unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], correct: 0 },
        { q: "Which law states that every action has an equal and opposite reaction?", options: ["First law", "Second law", "Third law", "Law of gravitation"], correct: 2 },
        { q: "What is the speed of light in vacuum?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1 },
        { q: "Which mirror is used in car headlights?", options: ["Plane", "Convex", "Concave", "Cylindrical"], correct: 2 },
        { q: "What is the unit of electric current?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 1 },
      ],
      Chemistry: [
        { q: "What is the pH of pure water?", options: ["0", "5", "7", "14"], correct: 2 },
        { q: "Which gas is most abundant in air?", options: ["Oxygen", "Nitrogen", "CO2", "Hydrogen"], correct: 1 },
        { q: "What is the chemical formula of water?", options: ["HO", "H₂O", "H₂O₂", "OH"], correct: 1 },
        { q: "Which element has the symbol 'Na'?", options: ["Nitrogen", "Neon", "Sodium", "Nickel"], correct: 2 },
        { q: "What type of bond holds NaCl together?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], correct: 1 },
      ],
      Biology: [
        { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correct: 2 },
        { q: "Which blood cells fight infection?", options: ["RBC", "WBC", "Platelets", "Plasma"], correct: 1 },
        { q: "What is the process by which plants make food?", options: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], correct: 1 },
        { q: "How many bones are in an adult human body?", options: ["106", "206", "306", "406"], correct: 1 },
        { q: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 },
      ],
      Maths: [
        { q: "What is 15% of 200?", options: ["15", "25", "30", "45"], correct: 2 },
        { q: "What is the value of π (pi) approximately?", options: ["2.14", "3.14", "4.14", "5.14"], correct: 1 },
        { q: "What is the area of a circle with radius 7?", options: ["49π", "14π", "7π", "21π"], correct: 0 },
        { q: "If x² = 49, what is x?", options: ["7", "±7", "49", "14"], correct: 1 },
        { q: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
      ],
      Science: [
        { q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correct: 2 },
        { q: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "CO2", "Helium"], correct: 2 },
        { q: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Brain"], correct: 2 },
        { q: "Which force keeps us on the ground?", options: ["Magnetic", "Gravity", "Friction", "Electric"], correct: 1 },
        { q: "What is the boiling point of water in Celsius?", options: ["50°C", "75°C", "100°C", "150°C"], correct: 2 },
      ],
      English: [
        { q: "What is the synonym of 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
        { q: "Which is a noun?", options: ["Run", "Beautiful", "Table", "Quickly"], correct: 2 },
        { q: "What is the past tense of 'go'?", options: ["Goed", "Went", "Gone", "Going"], correct: 1 },
        { q: "Choose the correct spelling:", options: ["Recieve", "Receive", "Recive", "Receeve"], correct: 1 },
        { q: "'A piece of cake' means:", options: ["A dessert", "Something easy", "A problem", "A slice"], correct: 1 },
      ],
      "Social Science": [
        { q: "Who is known as the Father of the Nation in India?", options: ["Nehru", "Gandhi", "Patel", "Bose"], correct: 1 },
        { q: "What is the capital of India?", options: ["Mumbai", "Chennai", "New Delhi", "Kolkata"], correct: 2 },
        { q: "Which river is the longest in India?", options: ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], correct: 1 },
        { q: "When did India get independence?", options: ["1945", "1947", "1950", "1942"], correct: 1 },
        { q: "What is the national currency of India?", options: ["Dollar", "Rupee", "Euro", "Yen"], correct: 1 },
      ],
    };
    const bank = questionBank[subject] || questionBank['Science'];
    return bank.sort(() => Math.random() - 0.5).slice(0, 5);
  };

  const startQuiz = (subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    const qs = generateQuestions(subject, subjects[subject]);
    setQuestions(qs);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizStarted(true);
    setLoading(false);
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQ].correct) setScore(score + 1);
    setTimeout(() => {
      if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelectedAnswer(null); }
      else setShowResult(true);
    }, 800);
  };

  const resetQuiz = () => { setQuizStarted(false); setSelectedSubject(null); setQuestions([]); setScore(0); setShowResult(false); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-purple-500 dark:bg-purple-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Brain size={24} /><div><h1 className="font-bold text-lg">{t('quiz')}</h1><p className="text-xs text-purple-100">{board} Class {classLevel}</p></div></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {!quizStarted ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Pick a Subject</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Only subjects with completed chapters appear below</p>
            {Object.keys(subjects).length === 0 ? (
              <div className="text-center py-8"><Brain size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-400 dark:text-gray-500">Complete some chapters first!</p><button onClick={() => navigate('/syllabus')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-semibold">{t('syllabus')}</button></div>
            ) : (
              Object.keys(subjects).map(subject => (
                <button key={subject} onClick={() => startQuiz(subject)} className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl text-left hover:border-purple-300 border border-gray-100 dark:border-gray-700 transition-all">
                  <div className="flex justify-between items-center"><span className="font-semibold text-gray-800 dark:text-white">{subject}</span><span className="text-xs text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">{subjects[subject].length} chapters</span></div>
                </button>
              ))
            )}
          </div>
        ) : showResult ? (
          <div className="text-center space-y-6">
            <Trophy size={64} className="text-yellow-500 mx-auto" />
            <div><p className="text-3xl font-bold text-gray-800 dark:text-white">{score}/{questions.length}</p><p className="text-gray-500 dark:text-gray-400 mt-1">{score === questions.length ? 'Perfect Score! 🎉' : score >= 3 ? 'Great job! 👏' : score >= 1 ? 'Keep practicing! 💪' : 'Try again! 📚'}</p></div>
            <div className="space-y-2">{questions.map((q, i) => (<div key={i} className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{i + 1}. {q.q}</p><p className="text-xs mt-1"><span className="text-green-600">✓ {q.options[q.correct]}</span></p></div>))}</div>
            <button onClick={resetQuiz} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:bg-purple-600"><RotateCcw size={20} /> Try Another</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500 dark:text-gray-400">Question {currentQ + 1} of {questions.length}</span><span className="text-sm font-semibold text-purple-500">Score: {score}</span></div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} /></div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{questions[currentQ]?.q}</h2>
              <div className="space-y-2">
                {questions[currentQ]?.options.map((option, i) => {
                  let btnClass = 'border-gray-200 dark:border-gray-600 hover:border-purple-300 bg-white dark:bg-gray-800';
                  if (selectedAnswer !== null) {
                    if (i === questions[currentQ].correct) btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700';
                    else if (i === selectedAnswer) btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700';
                    else btnClass = 'opacity-50 border-gray-200';
                  }
                  return (
                    <button key={i} onClick={() => selectedAnswer === null && handleAnswer(i)} disabled={selectedAnswer !== null} className={`w-full p-3 rounded-xl border-2 text-left font-medium transition-all ${btnClass} dark:text-gray-200`}>
                      <span className="flex items-center gap-2">
                        {selectedAnswer !== null && i === questions[currentQ].correct && <CheckCircle size={18} className="text-green-500" />}
                        {selectedAnswer === i && i !== questions[currentQ].correct && <XCircle size={18} className="text-red-500" />}
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
