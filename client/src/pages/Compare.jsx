import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, ArrowUp, ArrowDown, Minus } from 'lucide-react';

function Compare() {
  const navigate = useNavigate();
  const [boards] = useState(['CBSE', 'ICSE']);
  const [allClasses] = useState(['4', '5', '6', '7', '8', '9', '10', '11', '12']);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const data = [];
    boards.forEach(board => {
      allClasses.forEach(cls => {
        const key = `progress_${board}_${cls}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const progress = JSON.parse(saved);
          const total = Object.keys(progress).length;
          const completed = Object.values(progress).filter(v => v === 'completed').length;
          if (total > 0) {
            data.push({
              id: `${board}_${cls}`,
              board,
              class: cls,
              total,
              completed,
              percentage: Math.round((completed / total) * 100),
            });
          }
        }
      });
    });
    setClassData(data.sort((a, b) => b.percentage - a.percentage));
  }, []);

  const getTrend = (index) => {
    if (index === 0) return <ArrowUp size={16} className="text-green-500" />;
    if (index === classData.length - 1) return <ArrowDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-yellow-500" />;
  };

  const getColor = (pct) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 50) return 'bg-yellow-500';
    if (pct >= 25) return 'bg-orange-500';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-teal-500 dark:bg-teal-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><BarChart3 size={24} /><h1 className="font-bold text-lg">Compare Classes</h1></div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Progress Across All Classes</h2>
        
        {classData.length === 0 ? (
          <div className="text-center py-10"><BarChart3 size={48} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No data yet. Start completing chapters!</p></div>
        ) : (
          <div className="space-y-3">
            {classData.map((item, i) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className="flex-shrink-0">{getTrend(i)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{item.board} Class {item.class}</h3>
                    <span className="font-bold text-gray-800 dark:text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getColor(item.percentage)}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.completed}/{item.total} chapters done</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;