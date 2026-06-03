import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, ChevronLeft, ChevronRight, Loader2, Lightbulb, BookOpen, Target, Volume2, Sparkles } from 'lucide-react';
import { t } from '../utils/language';

function Lecture() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chapter, subject, board, classLevel } = location.state || {};

  const [lecture, setLecture] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!chapter || !subject) { navigate('/syllabus'); return; }
    // Auto-fetch videos on load
    fetchVideos();
  }, []);

  const generateLecture = async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/lecture/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter, subject, board, classLevel })
      });
      const data = await response.json();
      if (data.error) setError(data.error); else { setLecture(data); setGenerated(true); }
    } catch (err) { setError('Failed to generate lecture.'); }
    setLoading(false);
  };

  const speakSlide = () => {
    if ('speechSynthesis' in window && lecture) {
      window.speechSynthesis.cancel();
      if (isSpeaking) { setIsSpeaking(false); return; }
      const text = lecture.slides[currentSlide].heading + '. ' + lecture.slides[currentSlide].content;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; utterance.rate = 0.9; utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const nextSlide = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); if (currentSlide < (lecture?.slides?.length || 1) - 1) setCurrentSlide(currentSlide + 1); };
  const prevSlide = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); if (currentSlide > 0) setCurrentSlide(currentSlide - 1); };

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch(`http://localhost:5000/api/youtube/search?query=${encodeURIComponent(`${chapter} ${subject} ${board} Class ${classLevel}`)}`);
      const data = await res.json();
      setVideos(data);
    } catch (err) {}
    setLoadingVideos(false);
  };

  if (!chapter) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/syllabus')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Play size={24} /><div><h1 className="font-bold text-lg">AI Lecture</h1><p className="text-xs text-blue-100">{subject} • {board} Class {classLevel}</p></div></div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{chapter}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subject} • {board} Class {classLevel}</p>
        </div>

        {/* Tabs - always visible */}
        <div className="flex justify-center gap-2 mb-4">
          <button onClick={() => { setShowVideos(true); setShowSummary(false); setShowPractice(false); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${showVideos || (!generated && !showSummary && !showPractice) ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}><span className="mr-1">🎬</span> Videos</button>
          {generated && (
            <>
              <button onClick={() => { setShowSummary(!showSummary); setShowPractice(false); setShowVideos(false); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${showSummary ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Summary</button>
              <button onClick={() => { setShowPractice(!showPractice); setShowSummary(false); setShowVideos(false); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${showPractice ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Practice</button>
              <button onClick={() => { setShowSummary(false); setShowPractice(false); setShowVideos(false); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!showSummary && !showPractice && !showVideos ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>📖 Slides</button>
            </>
          )}
        </div>

        {/* Videos Section */}
        {(showVideos || (!generated && !showSummary && !showPractice)) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2 mb-4"><span className="text-xl">🎬</span> Video Lectures</h3>
            {selectedVideo ? (
              <div>
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo}`} title="Video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen className="rounded-xl" />
                </div>
                <button onClick={() => setSelectedVideo(null)} className="text-sm text-red-500">← Back to list</button>
              </div>
            ) : loadingVideos ? (
              <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-3">No videos found</p>
                <button onClick={fetchVideos} className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">🔄 Retry</button>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video, i) => (
                  <button key={i} onClick={() => setSelectedVideo(video.id)} className="w-full flex gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                    <img src={video.thumbnail} alt="" className="w-32 h-18 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">{video.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate AI Lecture Button */}
        {!generated && (
          <div className="text-center mt-6">
            <button onClick={generateLecture} disabled={loading} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              {loading ? 'Generating...' : 'Generate AI Lecture ✨'}
            </button>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10"><Loader2 size={48} className="text-blue-500 animate-spin mb-4" /><p className="text-gray-500 dark:text-gray-400 text-lg">{t('loading')}</p></div>
        )}

        {/* Slides */}
        {generated && !showSummary && !showPractice && !showVideos && lecture && lecture.slides && lecture.slides[currentSlide] && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Slide {currentSlide + 1} of {lecture.slides?.length || 0}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentSlide + 1) / (lecture.slides?.length || 1)) * 100}%` }} /></div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{lecture.slides[currentSlide].heading}</h3>
                <button onClick={speakSlide} className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`} title={isSpeaking ? 'Stop' : 'Listen'}><Volume2 size={20} /></button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{lecture.slides[currentSlide].content}</p>
              {lecture.slides[currentSlide].keyPoint && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2"><Lightbulb size={16} /> Key Takeaway</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">{lecture.slides[currentSlide].keyPoint}</p>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={prevSlide} disabled={currentSlide === 0} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm disabled:opacity-30 text-gray-600 dark:text-gray-300 font-medium"><ChevronLeft size={20} /> Previous</button>
              <button onClick={nextSlide} disabled={currentSlide === lecture.slides?.length - 1} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-sm disabled:opacity-30 font-medium">Next <ChevronRight size={20} /></button>
            </div>
          </div>
        )}

        {/* Summary */}
        {generated && showSummary && lecture && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2 mb-4"><Lightbulb size={20} className="text-yellow-500" /> Quick Summary</h3>
            <div className="space-y-2">
              {lecture.summary ? (Array.isArray(lecture.summary) ? lecture.summary.map((point, i) => (<div key={i} className="flex gap-2 text-gray-700 dark:text-gray-300"><span className="text-blue-500 font-bold">•</span><span className="text-sm">{point}</span></div>)) : typeof lecture.summary === 'string' ? lecture.summary.split('\n').filter(Boolean).map((point, i) => (<div key={i} className="flex gap-2 text-gray-700 dark:text-gray-300"><span className="text-blue-500 font-bold">•</span><span className="text-sm">{point.replace(/^[•\-\d.]\s*/, '')}</span></div>)) : <p className="text-gray-500 text-sm">No summary available.</p>) : <p className="text-gray-500 text-sm">No summary available.</p>}
            </div>
          </div>
        )}

        {/* Practice */}
        {generated && showPractice && lecture && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2 mb-4"><Target size={20} className="text-green-500" /> Practice Questions</h3>
            <div className="space-y-4">
              {Array.isArray(lecture.practiceQuestions) && lecture.practiceQuestions.length > 0 ? lecture.practiceQuestions.map((pq, i) => (<div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"><p className="font-medium text-gray-800 dark:text-gray-200">{i + 1}. {pq.question}</p><p className="text-sm text-orange-500 mt-2 flex items-center gap-1"><Lightbulb size={14} /> Hint: {pq.hint}</p></div>)) : <p className="text-gray-500 text-sm">No practice questions available.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lecture;