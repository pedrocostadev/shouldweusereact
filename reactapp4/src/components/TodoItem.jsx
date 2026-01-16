import { useState } from 'react';

function formatDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) {
    return { text: 'Today', className: 'today' };
  }
  if (dateOnly.getTime() === tomorrow.getTime()) {
    return { text: 'Tomorrow', className: 'upcoming' };
  }
  if (dateOnly < today) {
    return { text: date.toLocaleDateString(), className: 'overdue' };
  }
  return { text: date.toLocaleDateString(), className: 'upcoming' };
}

export function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(todo.name);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editLimitDate, setEditLimitDate] = useState(todo.limitDate || '');

  const handleSave = () => {
    if (!editName.trim()) return;
    onUpdate(todo.id, {
      name: editName.trim(),
      description: editDescription.trim() || null,
      limitDate: editLimitDate,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(todo.name);
    setEditDescription(todo.description || '');
    setEditLimitDate(todo.limitDate || '');
    setIsEditing(false);
  };

  const dateInfo = formatDate(todo.limitDate);

  if (isEditing) {
    return (
      <div className="todo-item">
        <div className="edit-form">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Task name"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <input
            type="date"
            value={editLimitDate}
            onChange={(e) => setEditLimitDate(e.target.value)}
          />
          <div className="edit-actions">
            <button className="btn btn-secondary btn-small" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary btn-small" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark ${todo.name} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="todo-name">{todo.name}</span>
      </div>
      {todo.description && (
        <p className="todo-description">{todo.description}</p>
      )}
      <div className="todo-footer">
        {dateInfo ? (
          <span className={`todo-date ${dateInfo.className}`}>
            Due: {dateInfo.text}
          </span>
        ) : (
          <span className="todo-date">No due date</span>
        )}
        <div className="todo-actions">
          <button
            className="btn btn-secondary btn-small"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-small"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
