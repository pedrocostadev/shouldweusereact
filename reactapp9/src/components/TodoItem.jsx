import { useState } from 'react';
import TodoForm from './TodoForm';

function formatDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return { text: 'Today', className: 'today' };
  }
  if (date.getTime() === tomorrow.getTime()) {
    return { text: 'Tomorrow', className: 'upcoming' };
  }
  if (date < today) {
    return { text: date.toLocaleDateString(), className: 'overdue' };
  }
  return { text: date.toLocaleDateString(), className: 'upcoming' };
}

export default function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updates) => {
    onUpdate(todo.id, updates);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(todo.id);
    }
  };

  const dateInfo = formatDate(todo.limitDate);

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.name}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="todo-name">{todo.name}</span>
      </div>
      
      {todo.description && (
        <p className="todo-description">{todo.description}</p>
      )}
      
      <div className="todo-footer">
        {dateInfo && (
          <span className={`todo-date ${dateInfo.className}`}>
            {dateInfo.text}
          </span>
        )}
        {!dateInfo && <span></span>}
        
        <div className="todo-actions">
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
            aria-label={`Edit "${todo.name}"`}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            aria-label={`Delete "${todo.name}"`}
          >
            Delete
          </button>
        </div>
      </div>
      
      {isEditing && (
        <div className="edit-form">
          <TodoForm
            initialData={todo}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
