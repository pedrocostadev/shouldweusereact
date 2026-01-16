import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';

function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();

  return (
    <div className="app">
      <h1>📝 Todo App</h1>
      <TodoForm onSubmit={addTodo} />
      <TodoList
        todos={todos}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onToggle={toggleComplete}
      />
    </div>
  );
}

export default App;
