import { useState } from 'react'
import { TodoForm } from './TodoForm'

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)

  if (dateOnly.getTime() === today.getTime()) return 'Today'
  if (dateOnly.getTime() === tomorrow.getTime()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = (updates) => {
    onUpdate(todo.id, updates)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <TodoForm
          initialData={todo}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  const overdue = isOverdue(todo.limitDate) && !todo.completed

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="todo-header">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={`Mark ${todo.name} as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="checkmark"></span>
        </label>
        <h3 className="todo-name">{todo.name}</h3>
      </div>
      {todo.description && <p className="todo-description">{todo.description}</p>}
      {todo.limitDate && (
        <span className={`todo-date ${overdue ? 'overdue-text' : ''}`}>
          Due: {formatDate(todo.limitDate)}
        </span>
      )}
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} className="edit-btn" aria-label="Edit todo">
          Edit
        </button>
        <button onClick={() => onDelete(todo.id)} className="delete-btn" aria-label="Delete todo">
          Delete
        </button>
      </div>
    </div>
  )
}
