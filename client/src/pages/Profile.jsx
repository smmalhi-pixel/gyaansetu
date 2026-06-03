import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Save, Zap, Flame, Clock, Award, CalendarDays, Shield, Hourglass } from 'lucide-react';
import { getProfile, saveProfile, getTotalStats, AVATARS } from '../utils/profile';
import { getLevelInfo } from '../utils/xp';
import { getLanguage, setLanguage, LANGUAGES } from '../utils/language';
import { getFreezeCount, addFreeze } from '../utils/streak';
import { getExam, setExam, removeExam, getDaysLeft } from '../utils/countdown';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getProfile());
  const [isEditing, setIsEditing] = useState(!profile.name);
  const [saved, setSaved] = useState(false);
  const [language, setLanguageState] = useState(getLanguage());
  const [freezes, setFreezes] = useState(getFreezeCount());
  const [exam, setExamState] = useState(getExam());
  const [showExamSetter, setShowExamSetter] = useState(false);
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');

  const stats = getTotalStats();
  const levelInfo = getLevelInfo();

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const joinedDate = new Date(profile.joined).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-cyan-500 dark:bg-cyan-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><User size={24} /><h1 className="font-bold text-lg">Student Profile</h1></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-6xl mb-3">{profile.avatar}</div>
          {isEditing ? (
            <div className="space-y-3">
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your Name" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-center text-lg font-semibold focus:outline-none focus:border-cyan-400" />
              <input value={profile.grade} onChange={(e) => setProfile({ ...profile, grade: e.target.value })} placeholder="Grade/Class" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-center focus:outline-none focus:border-cyan-400" />
              <input value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} placeholder="School Name" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-center focus:outline-none focus:border-cyan-400" />
              <div><p className="text-xs text-gray-500 mb-2">Choose Avatar</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {AVATARS.map(av => (<button key={av} onClick={() => setProfile({ ...profile, avatar: av })} className={`text-2xl p-2 rounded-xl transition-all ${profile.avatar === av ? 'bg-cyan-100 dark:bg-cyan-900 ring-2 ring-cyan-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{av}</button>))}
                </div>
              </div>
              <button onClick={handleSave} className="w-full py-3 bg-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-cyan-600"><Save size={18} /> {saved ? 'Saved!' : 'Save Profile'}</button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name || 'Student'}</h2>
              {profile.grade && <p className="text-gray-500 dark:text-gray-400">{profile.grade}</p>}
              {profile.school && <p className="text-gray-400 dark:text-gray-500 text-sm">{profile.school}</p>}
              <button onClick={() => setIsEditing(true)} className="mt-3 text-sm text-cyan-500 hover:text-cyan-600">Edit Profile</button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Overall Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-3 text-center"><Zap size={20} className="text-yellow-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{stats.totalXP}</p><p className="text-xs text-gray-500">Total XP</p></div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3 text-center"><Flame size={20} className="text-orange-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{stats.streak}</p><p className="text-xs text-gray-500">Best Streak</p></div>
            <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-xl p-3 text-center"><Clock size={20} className="text-cyan-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{stats.totalSessions}</p><p className="text-xs text-gray-500">Sessions</p></div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3 text-center"><Award size={20} className="text-purple-500 mx-auto mb-1" /><p className="text-xl font-bold text-gray-800 dark:text-white">{stats.totalBadges}</p><p className="text-xs text-gray-500">Badges</p></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Current Level</h3>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{levelInfo.currentLevel?.emoji}</span>
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-800 dark:text-white">{levelInfo.currentLevel?.name}</p>
              <p className="text-sm text-gray-500">Level {levelInfo.level}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: `${Math.min(levelInfo.progress, 100)}%` }} /></div>
            </div>
          </div>
        </div>

        {/* Streak Freeze */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Streak Freeze 🛡️</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Miss a day? Freeze protects your streak!</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-500">{freezes} freeze{freezes !== 1 ? 's' : ''}</span>
            <button onClick={() => { const count = addFreeze(); setFreezes(count); }} className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600">Get Freeze +1</button>
          </div>
        </div>

        {/* Exam Countdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><Hourglass size={18} className="text-red-500" /> Exam Countdown</h3>
          {exam ? (
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{getDaysLeft()?.days || 0} Days</p>
              <p className="text-sm text-gray-500">{exam.subject} • {new Date(exam.date).toLocaleDateString()}</p>
              <button onClick={() => { removeExam(); setExamState(null); }} className="mt-2 text-xs text-red-400">Remove</button>
            </div>
          ) : (
            <button onClick={() => setShowExamSetter(true)} className="w-full py-3 border-2 border-dashed border-red-300 dark:border-red-700 rounded-xl text-red-500">Set Exam Date</button>
          )}
          {showExamSetter && (
            <div className="mt-3 space-y-3">
              <input value={examSubject} onChange={(e) => setExamSubject(e.target.value)} placeholder="Subject (e.g., Maths)" className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm" />
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm" />
              <button onClick={() => { if (examSubject && examDate) { setExam(examSubject, examDate); setExamState({ subject: examSubject, date: examDate }); setShowExamSetter(false); } }} className="w-full py-2 bg-red-500 text-white rounded-xl font-semibold text-sm">Set Exam</button>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">App Language</h3>
          <div className="space-y-2">
            {LANGUAGES.map(lang => (
              <button key={lang.id} onClick={() => { setLanguage(lang.id); setLanguageState(lang.id); window.location.reload(); }} className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${language === lang.id ? 'bg-cyan-100 dark:bg-cyan-900 border-2 border-cyan-500' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'}`}>
                <span className="text-2xl">{lang.emoji}</span><span className="font-medium text-gray-800 dark:text-white">{lang.name}</span>{language === lang.id && <span className="ml-auto text-cyan-500 font-semibold text-sm">Active</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center">
          <CalendarDays size={20} className="text-gray-400 mx-auto mb-1" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Learning since {joinedDate}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;