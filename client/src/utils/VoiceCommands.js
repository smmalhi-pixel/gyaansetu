let recognition = null;
let isActive = false;

export const COMMANDS = [
  { phrases: ['home', 'go home', 'go to home', 'घर'], action: 'navigate', path: '/' },
  { phrases: ['syllabus', 'chapters', 'open syllabus', 'सिलेबस'], action: 'navigate', path: '/syllabus' },
  { phrases: ['doubt', 'ask doubt', 'solve doubt', 'gyaan guru', 'डाउट'], action: 'navigate', path: '/doubt-solver' },
  { phrases: ['timer', 'study timer', 'pomodoro', 'टाइमर'], action: 'navigate', path: '/timer' },
  { phrases: ['quiz', 'take quiz', 'क्विज़'], action: 'navigate', path: '/quiz' },
  { phrases: ['flashcards', 'cards', 'फ्लैशकार्ड'], action: 'navigate', path: '/flashcards' },
  { phrases: ['profile', 'my profile', 'प्रोफाइल'], action: 'navigate', path: '/profile' },
  { phrases: ['music', 'study music', 'lo-fi', 'म्यूजिक'], action: 'navigate', path: '/music' },
  { phrases: ['whiteboard', 'draw', 'doodle', 'व्हाइटबोर्ड'], action: 'navigate', path: '/whiteboard' },
  { phrases: ['challenges', 'daily challenges', 'चैलेंज'], action: 'navigate', path: '/challenges' },
  { phrases: ['analytics', 'stats', 'analytics', 'एनालिटिक्स'], action: 'navigate', path: '/analytics' },
  { phrases: ['essay', 'write essay', 'एसे'], action: 'navigate', path: '/essay' },
  { phrases: ['to-do', 'todo', 'tasks', 'टूडू'], action: 'navigate', path: '/todo' },
  { phrases: ['study plan', 'exam plan', 'प्लान'], action: 'navigate', path: '/study-plan' },
  { phrases: ['formulas', 'formula sheet', 'फॉर्मूला'], action: 'navigate', path: '/formulas' },
];

let navigateCallback = null;

export const setNavigateCallback = (callback) => {
  navigateCallback = callback;
};

export const startVoiceCommands = (onResult) => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onResult('Voice commands not supported in this browser');
    return false;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    
    // Find matching command
    for (const cmd of COMMANDS) {
      for (const phrase of cmd.phrases) {
        if (transcript.includes(phrase.toLowerCase())) {
          if (cmd.action === 'navigate' && navigateCallback) {
            navigateCallback(cmd.path);
            onResult(`Opening ${cmd.phrases[0]}...`);
            return;
          }
        }
      }
    }
    
    onResult(`Command not recognized: "${transcript}"`);
  };

  recognition.onerror = () => {
    onResult('Could not hear you. Try again.');
  };

  recognition.onend = () => {
    isActive = false;
  };

  recognition.start();
  isActive = true;
  return true;
};

export const stopVoiceCommands = () => {
  if (recognition) {
    recognition.stop();
    isActive = false;
  }
};

export const isListening = () => isActive;
