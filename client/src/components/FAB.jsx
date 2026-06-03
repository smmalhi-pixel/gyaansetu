import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, BookOpen, Brain, Clock, Pen } from 'lucide-react';
import { t } from '../utils/language';

function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <BookOpen size={20} />, label: t('syllabus'), path: '/syllabus', color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: <Brain size={20} />, label: t('doubt'), path: '/doubt-solver', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: <Clock size={20} />, label: t('timer'), path: '/timer', color: 'bg-teal-500 hover:bg-teal-600' },
    { icon: <Pen size={20} />, label: t('whiteboard'), path: '/whiteboard', color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => { navigate(action.path); setIsOpen(false); }}
              className={`${action.color} text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105`}
            >
              <span className="text-sm font-medium">{action.label}</span>
              {action.icon}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-orange-500'}`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <Plus size={24} className="text-white" />}
      </button>
    </div>
  );
}

export default FAB;