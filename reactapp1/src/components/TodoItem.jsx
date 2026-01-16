import { useState } from 'react';
import { TodoForm } from './TodoForm';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) return 'Today';
  if (dateOnly.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleSave = (updates) => {
    onUpdate(todo.id, updates);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this todo?')) {
      onDelete(todo.id);
    }
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <TodoForm
          initialData={todo}
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const overdue = !todo.completed && isOverdue(todo.limitDate);

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Mark ${todo.name} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
      </div>
      <div className="todo-content" onClick={() => setIsEditing(true)}>
        <h3 className="todo-name">{todo.name}</h3>
        {todo.description && <p className="todo-description">{todo.description}</p>}
        {todo.limitDate && (
          <span className={`todo-date ${overdue ? 'overdue' : ''}`}>
            {formatDate(todo.limitDate)}
          </span>
        )}
      </div>
      <div className="todo-actions">
        <button className="btn btn-icon" onClick={() => setIsEditing(true)} aria-label="Edit">
          ✏️
        </button>
        <button className="btn btn-icon" onClick={handleDelete} aria-label="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
}
