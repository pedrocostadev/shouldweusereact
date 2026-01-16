import { TodoItem } from './TodoItem';

export function TodoList({ todos, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet. Add one above!</p>
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
        />
      ))}
    </div>
  );
}
