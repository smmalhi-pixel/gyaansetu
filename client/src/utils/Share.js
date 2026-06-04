import { getLevelInfo } from './Xp';
import { getStreak } from './Streak';

export const generateShareImage = async (board, classLevel) => {
  const levelInfo = getLevelInfo();
  const streak = getStreak();
  
  const progressKey = `progress_${board}_${classLevel}`;
  const saved = localStorage.getItem(progressKey);
  const progress = saved ? JSON.parse(saved) : {};
  const total = Object.keys(progress).length;
  const completed = Object.values(progress).filter(v => v === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, '#f97316');
  gradient.addColorStop(1, '#ec4899');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 500, 600);

  // White card
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(30, 80, 440, 450, 20);
  ctx.fill();

  // Title
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GyaanSetu', 250, 130);

  // Board & Class
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px Arial';
  ctx.fillText(`${board} Class ${classLevel}`, 250, 160);

  // Stats
  ctx.fillStyle = '#f97316';
  ctx.font = 'bold 64px Arial';
  ctx.fillText(`${percentage}%`, 250, 250);
  
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px Arial';
  ctx.fillText('Overall Progress', 250, 280);

  // Divider
  ctx.strokeStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.moveTo(80, 310);
  ctx.lineTo(420, 310);
  ctx.stroke();

  // Stats row
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`${completed}/${total}`, 140, 360);
  ctx.fillText(`${streak.count} 🔥`, 250, 360);
  ctx.fillText(`${levelInfo.currentLevel?.emoji}`, 360, 360);

  ctx.fillStyle = '#6b7280';
  ctx.font = '14px Arial';
  ctx.fillText('Chapters', 140, 385);
  ctx.fillText('Day Streak', 250, 385);
  ctx.fillText(levelInfo.currentLevel?.name || 'Beginner', 360, 385);

  // Level info
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Level ${levelInfo.level} • ${levelInfo.totalXP} XP`, 250, 440);

  // Footer
  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  ctx.fillText('Study with GyaanSetu 🚀', 250, 500);

  return canvas.toDataURL('image/png');
};

export const shareProgress = async (board, classLevel) => {
  const dataUrl = await generateShareImage(board, classLevel);
  
  if (navigator.share) {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'gyaansetu-progress.png', { type: 'image/png' });
    await navigator.share({
      title: 'My GyaanSetu Progress',
      text: `I've completed ${Math.round((Object.values(JSON.parse(localStorage.getItem(`progress_${board}_${classLevel}`) || '{}')).filter(v => v === 'completed').length / Math.max(Object.keys(JSON.parse(localStorage.getItem(`progress_${board}_${classLevel}`) || '{}')).length, 1)) * 100)}% of ${board} Class ${classLevel} on GyaanSetu! 🚀`,
      files: [file],
    });
  } else {
    const link = document.createElement('a');
    link.download = 'gyaansetu-progress.png';
    link.href = dataUrl;
    link.click();
  }
};
