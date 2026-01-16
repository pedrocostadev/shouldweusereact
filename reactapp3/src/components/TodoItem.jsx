import { useState } from 'react'
import { TodoForm } from './TodoForm'

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())

  if (dateOnly.getTime() === todayOnly.getTime()) return 'Today'
  if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'Tomorrow'
  return date.toLocaleDateString()
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
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark ${todo.name} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
      </div>
      <div className="todo-content" onClick={() => setIsEditing(true)}>
        <h3>{todo.name}</h3>
        {todo.description && <p>{todo.description}</p>}
        {todo.limitDate && (
          <span className={`due-date ${overdue ? 'overdue' : ''}`}>
            Due: {formatDate(todo.limitDate)}
          </span>
        )}
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} aria-label="Edit todo">Edit</button>
        <button onClick={() => onDelete(todo.id)} aria-label="Delete todo">Delete</button>
      </div>
    </div>
  )
}
