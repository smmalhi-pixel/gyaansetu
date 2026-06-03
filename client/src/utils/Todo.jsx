import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Circle, Trash2, ClipboardList } from 'lucide-react';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '../utils/todo';

function Todo() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => { setTodos(getTodos()); }, []);

  const handleAdd = () => {
    if (!input.trim()) return;
    setTodos(addTodo(input.trim()));
    setInput('');
  };

  const handleToggle = (id) => setTodos(toggleTodo(id));
  const handleDelete = (id) => setTodos(deleteTodo(id));

  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-emerald-500 dark:bg-emerald-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><ClipboardList size={24} /><h1 className="font-bold text-lg">Study To-Do</h1></div>
        {total > 0 && <span className="ml-auto text-sm">{completed}/{total} done</span>}
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleAdd(); }} placeholder="Add a task..." className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:border-emerald-400" />
          <button onClick={handleAdd} className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"><Plus size={20} /></button>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-10"><ClipboardList size={48} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No tasks yet. Add your first to-do!</p></div>
        ) : (
          <div className="space-y-2">
            {todos.map(todo => (
              <div key={todo.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <button onClick={() => handleToggle(todo.id)} className="flex-shrink-0">
                  {todo.completed ? <CheckCircle size={22} className="text-emerald-500" /> : <Circle size={22} className="text-gray-300 dark:text-gray-600" />}
                </button>
                <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>{todo.text}</span>
                <button onClick={() => handleDelete(todo.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>
              </div>
            ))}
          </div>
        )}

        {total > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Todo;