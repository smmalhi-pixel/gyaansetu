const THEME_KEY = 'gyaansetu_theme';

export const THEMES = [
  { id: 'light', name: 'Light', emoji: '☀️', primary: 'orange' },
  { id: 'dark', name: 'Dark', emoji: '🌙', primary: 'orange' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', primary: 'blue' },
  { id: 'forest', name: 'Forest', emoji: '🌿', primary: 'green' },
  { id: 'sunset', name: 'Sunset', emoji: '🌅', primary: 'rose' },
  { id: 'purple', name: 'Royal', emoji: '👑', primary: 'purple' },
];

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const applyTheme = (themeId) => {
  const root = document.documentElement;
  root.classList.remove('dark', 'theme-ocean', 'theme-forest', 'theme-sunset', 'theme-purple');
  
  if (themeId === 'dark') {
    root.classList.add('dark');
  } else if (themeId !== 'light') {
    root.classList.add(`theme-${themeId}`);
  }
  
  setTheme(themeId);
};