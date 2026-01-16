import { TodoItem } from './TodoItem';

export function TodoList({ todos, onUpdate, onDelete, onToggle }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
