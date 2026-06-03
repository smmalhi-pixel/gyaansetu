import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';
import Home from './pages/Home';
import DoubtSolver from './pages/DoubtSolver';
import Syllabus from './pages/Syllabus';
import Timer from './pages/Timer';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Lecture from './pages/Lecture';
import Test from './pages/Test';
import Challenges from './pages/Challenges';
import Calendar from './pages/Calendar';
import Formulas from './pages/Formulas';
import Weekly from './pages/Weekly';
import Revision from './pages/Revision';
import Profile from './pages/Profile';
import Reminders from './pages/Reminders';
import Whiteboard from './pages/Whiteboard';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import StudyPlan from './pages/StudyPlan';
import MusicPlayer from './pages/Music';
import Compare from './pages/Compare';
import Essay from './pages/Essay';
import Todo from './pages/Todo';
import Toast from './components/Toast';
import FAB from './components/FAB';
import BottomNav from './components/BottomNav';
import { setToastCallback } from './utils/ToastManager';
import { startVoiceCommands, stopVoiceCommands, setNavigateCallback } from './utils/VoiceCommands';

function AppContent() {
  const [toast, setToast] = useState(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const navigate = useNavigate();

  const handleToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  setToastCallback(handleToast);
  setNavigateCallback((path) => navigate(path));

  const toggleVoice = () => {
    if (voiceActive) {
      stopVoiceCommands();
      setVoiceActive(false);
    } else {
      const started = startVoiceCommands((msg) => {
        setVoiceText(msg);
        setTimeout(() => setVoiceText(''), 3000);
      });
      if (started) setVoiceActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {voiceText && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg">
          {voiceText}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doubt-solver" element={<DoubtSolver />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/lecture" element={<Lecture />} />
        <Route path="/test" element={<Test />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/formulas" element={<Formulas />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/music" element={<MusicPlayer />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/essay" element={<Essay />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>

      {/* Voice Command Button */}
      <button
        onClick={toggleVoice}
        className={`fixed bottom-20 left-6 z-50 p-4 rounded-full shadow-lg transition-all ${
          voiceActive ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'
        }`}
        title="Voice Commands"
      >
        {voiceActive ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
      </button>

      <FAB />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
