const REMINDER_KEY = 'gyaansetu_reminders';

export const getReminders = () => {
  const saved = localStorage.getItem(REMINDER_KEY);
  return saved ? JSON.parse(saved) : { enabled: false, times: ['09:00', '17:00', '21:00'] };
};

export const saveReminders = (reminders) => {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
};

export const requestPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  const permission = await Notification.requestPermission();
  return permission;
};

export const scheduleReminders = (times) => {
  times.forEach(time => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      sendNotification();
      // Repeat daily
      setInterval(() => {
        const now2 = new Date();
        if (now2.getHours() === hours && now2.getMinutes() === minutes) {
          sendNotification();
        }
      }, 60000);
    }, delay);
  });
};

export const sendNotification = () => {
  if (Notification.permission === 'granted') {
    const messages = [
      { title: '📚 Study Time!', body: 'Gyaan Guru is waiting for you. Let\'s complete a chapter today!' },
      { title: '🔥 Keep Your Streak!', body: 'Don\'t break your study streak. Just 5 minutes of revision helps!' },
      { title: '🎯 Goal Reminder', body: 'You set a goal today. Have you completed it yet?' },
      { title: '🧠 Smart Revision', body: 'AI has prepared a revision plan for you. Check it out!' },
      { title: '⏰ Time to Learn!', body: 'Your daily challenge awaits. Earn bonus XP today!' },
    ];
    
    const msg = messages[Math.floor(Math.random() * messages.length)];
    new Notification(msg.title, {
      body: msg.body,
      icon: '📚',
      badge: '📚',
    });
  }
};

export const sendTestNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('✅ It Works!', {
      body: 'You will now receive study reminders at your scheduled times.',
      icon: '📚',
    });
    return true;
  }
  return false;
};
