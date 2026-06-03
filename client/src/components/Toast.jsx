import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const colors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500'
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-2xl border-l-4 ${colors[type]} flex items-center gap-3 min-w-[280px]`}>
        {icons[type]}
        <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="p-1"><X size={16} className="text-gray-400" /></button>
      </div>
    </div>
  );
}

export default Toast;