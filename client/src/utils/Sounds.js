const SOUNDS = {
  complete: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  badge: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  xp: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  save: 'https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3',
  goal: 'https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3',
};

let soundEnabled = true;

export const isSoundEnabled = () => soundEnabled;

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('gyaansetu_sound', soundEnabled.toString());
  return soundEnabled;
};

export const initSound = () => {
  const saved = localStorage.getItem('gyaansetu_sound');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
};

export const playSound = (soundName) => {
  if (!soundEnabled) return;
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (e) {}
};
