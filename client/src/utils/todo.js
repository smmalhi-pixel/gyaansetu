const TODO_KEY = 'gyaansetu_todos';

export const getTodos = () => {
  const saved = localStorage.getItem(TODO_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const addTodo = (text) => {
  const todos = getTodos();
  todos.push({ id: Date.now().toString(), text, completed: false, createdAt: new Date().toISOString() });
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  return todos;
};

export const toggleTodo = (id) => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  return todos;
};

export const deleteTodo = (id) => {
  const todos = getTodos().filter(t => t.id !== id);
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  return todos;
};