import { useTodos } from './hooks/useTodos'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos()

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Todo App</h1>
      </header>
      <main className="app-main">
        <section className="add-todo-section">
          <h2>Add New Todo</h2>
          <TodoForm onSubmit={addTodo} />
        </section>
        <section className="todos-section">
          <h2>Your Todos ({todos.length})</h2>
          <TodoList
            todos={todos}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onToggle={toggleComplete}
          />
        </section>
      </main>
    </div>
  )
}
