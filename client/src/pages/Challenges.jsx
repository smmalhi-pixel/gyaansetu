import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle, Gift, Star } from 'lucide-react';
import { getTodayChallenge, claimReward } from '../utils/Challenges';
import { addXP } from '../utils/Xp';
import { t } from '../utils/Language';

function Challenges() {
  const navigate = useNavigate();
  const [challengeData, setChallengeData] = useState(null);
  const [claimed, setClaimed] = useState({});

  useEffect(() => { setChallengeData(getTodayChallenge()); }, []);

  const handleClaim = (challengeId) => {
    const xp = claimReward(challengeId);
    if (xp > 0) {
      addXP('complete_chapter');
      setClaimed(prev => ({ ...prev, [challengeId]: true }));
      setTimeout(() => { setChallengeData(getTodayChallenge()); }, 500);
    }
  };

  const completedCount = challengeData?.challenges?.filter(c => c.completed).length || 0;
  const totalCount = challengeData?.challenges?.length || 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-green-500 dark:bg-green-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Target size={24} /><div><h1 className="font-bold text-lg">{t('challenges')}</h1><p className="text-xs text-green-100">{challengeData?.date || 'Today'}</p></div></div>
        <div className="ml-auto text-sm font-semibold">{completedCount}/{totalCount} Done</div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div className="text-center mb-4"><p className="text-gray-500 dark:text-gray-400 text-sm">Complete challenges to earn bonus XP!</p></div>

        {challengeData?.challenges?.map((challenge, i) => (
          <div key={challenge.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-2 transition-all ${challenge.completed && !challenge.claimed ? 'border-yellow-400 dark:border-yellow-500' : challenge.claimed ? 'border-green-300 dark:border-green-700' : 'border-gray-100 dark:border-gray-700'}`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl">{challenge.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{challenge.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{challenge.description}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress: {challenge.progress}/{challenge.target}</span><span>+{challenge.xpReward} XP</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${challenge.completed ? 'bg-green-500' : 'bg-green-400'}`} style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }} /></div>
                </div>
                {challenge.completed && !challenge.claimed && <button onClick={() => handleClaim(challenge.id)} className="mt-3 w-full py-2 bg-yellow-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-yellow-600"><Gift size={16} /> Claim {challenge.xpReward} XP</button>}
                {challenge.claimed && <div className="mt-3 flex items-center gap-2 text-green-500 text-sm font-semibold"><CheckCircle size={16} /> Claimed!</div>}
              </div>
            </div>
          </div>
        ))}

        {completedCount === totalCount && (
          <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl"><Star size={48} className="text-yellow-500 mx-auto mb-2" /><p className="text-lg font-bold text-gray-800 dark:text-white">All Challenges Complete!</p><p className="text-sm text-gray-500 dark:text-gray-400">Come back tomorrow for new challenges</p></div>
        )}
      </div>
    </div>
  );
}

export default Challenges;
