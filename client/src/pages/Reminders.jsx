import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff, Plus, X, Clock, CheckCircle } from 'lucide-react';
import { getReminders, saveReminders, requestPermission, sendTestNotification, scheduleReminders } from '../utils/Reminders';
import { t } from '../utils/Language';

function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState(getReminders());
  const [permission, setPermission] = useState(Notification.permission);
  const [newTime, setNewTime] = useState('');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (reminders.enabled && permission === 'granted') scheduleReminders(reminders.times);
  }, [reminders.enabled]);

  const handleToggle = async () => {
    if (!reminders.enabled) {
      const result = await requestPermission(); setPermission(result);
      if (result === 'granted') { const updated = { ...reminders, enabled: true }; setReminders(updated); saveReminders(updated); scheduleReminders(updated.times); }
    } else { const updated = { ...reminders, enabled: false }; setReminders(updated); saveReminders(updated); }
  };

  const addTime = () => {
    if (newTime && !reminders.times.includes(newTime)) { const updated = { ...reminders, times: [...reminders.times, newTime].sort() }; setReminders(updated); saveReminders(updated); setNewTime(''); }
  };

  const removeTime = (time) => { const updated = { ...reminders, times: reminders.times.filter(t => t !== time) }; setReminders(updated); saveReminders(updated); };

  const handleTest = () => { const sent = sendTestNotification(); if (sent) { setTestSent(true); setTimeout(() => setTestSent(false), 3000); } };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-amber-500 dark:bg-amber-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Bell size={24} /><h1 className="font-bold text-lg">{t('reminders')}</h1></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-800 dark:text-white">{t('reminders')}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{reminders.enabled ? 'Enabled' : 'Disabled'}</p></div>
            <button onClick={handleToggle} className={`p-3 rounded-full transition-all ${reminders.enabled ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>{reminders.enabled ? <Bell size={24} /> : <BellOff size={24} />}</button>
          </div>
          {permission === 'denied' && <p className="text-red-500 text-sm mt-3">Notifications are blocked. Enable them in your browser settings.</p>}
        </div>

        {reminders.enabled && permission === 'granted' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Reminder Times</h3>
              <div className="space-y-2">
                {reminders.times.map(time => (
                  <div key={time} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-2"><Clock size={18} className="text-amber-500" /><span className="font-medium text-gray-800 dark:text-white">{time}</span></div>
                    <button onClick={() => removeTime(time)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"><X size={16} className="text-gray-400" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-amber-400" />
                <button onClick={addTime} className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold flex items-center gap-1 hover:bg-amber-600"><Plus size={18} /> Add</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Test Reminder</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Send a test notification to make sure it works</p>
              <button onClick={handleTest} className="w-full py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/50">
                {testSent ? <span className="flex items-center justify-center gap-2"><CheckCircle size={18} /> Notification Sent!</span> : 'Send Test Notification'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reminders;
