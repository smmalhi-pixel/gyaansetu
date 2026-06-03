import { getLevelInfo } from './xp';
import { getStreak } from './streak';
import { getWeeklyReport } from './weekly';

export const generateReport = (board, classLevel) => {
  const levelInfo = getLevelInfo();
  const streak = getStreak();
  const weekly = getWeeklyReport(board, classLevel);

  const progressKey = `progress_${board}_${classLevel}`;
  const saved = localStorage.getItem(progressKey);
  const progress = saved ? JSON.parse(saved) : {};

  const totalCompleted = Object.values(progress).filter(v => v === 'completed').length;
  const totalInProgress = Object.values(progress).filter(v => v === 'in_progress').length;
  const totalNotStarted = Object.values(progress).filter(v => v === 'not_started').length;

  const report = `
╔══════════════════════════════════════╗
║        GYAANSETU STUDY REPORT        ║
╚══════════════════════════════════════╝

📋 Board: ${board}
📚 Class: ${classLevel}
📅 Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

═══════════════════════════════════════
🏆 OVERALL PROGRESS
═══════════════════════════════════════
✅ Completed Chapters: ${totalCompleted}
🔄 In Progress: ${totalInProgress}
⬜ Not Started: ${totalNotStarted}

═══════════════════════════════════════
🎮 XP & LEVEL
═══════════════════════════════════════
⭐ Level: ${levelInfo.level} - ${levelInfo.currentLevel?.name} ${levelInfo.currentLevel?.emoji}
💎 Total XP: ${levelInfo.totalXP} XP
📈 Next Level: ${levelInfo.xpForNext} XP needed

═══════════════════════════════════════
🔥 STREAK
═══════════════════════════════════════
Current Streak: ${streak.count} days 🔥

═══════════════════════════════════════
📊 THIS WEEK
═══════════════════════════════════════
⚡ XP Earned: ${weekly.thisWeekXP} XP
📝 Chapters Done: ${weekly.completedThisWeek}
⏱️ Study Sessions: ${weekly.totalTimerSessions}
🎯 Challenges: ${weekly.challengesCompleted}

═══════════════════════════════════════
📅 DAILY BREAKDOWN
═══════════════════════════════════════
${weekly.weekDays.map(d => `${d.day}: ${d.sessions} sessions`).join('\n')}

═══════════════════════════════════════
🚀 Keep Learning with GyaanSetu!
═══════════════════════════════════════
`;

  return report;
};

export const downloadReport = (board, classLevel) => {
  const report = generateReport(board, classLevel);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GyaanSetu_Report_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};