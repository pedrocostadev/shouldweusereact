import { useState } from 'react'
import TodoForm from './TodoForm'

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) return 'Today'
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow'
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function isOverdue(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return date < today
}

export default function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = (data) => {
    onUpdate(todo.id, data)
    setIsEditing(false)
  }

  const overdue = isOverdue(todo.limitDate) && !todo.completed
  const formattedDate = formatDate(todo.limitDate)

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

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.name}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
      </div>
      <div className="todo-content">
        <h3 className="todo-name">{todo.name}</h3>
        {todo.description && <p className="todo-description">{todo.description}</p>}
        {formattedDate && (
          <span className={`todo-date ${overdue ? 'overdue' : ''}`}>
            📅 {formattedDate}
          </span>
        )}
      </div>
      <div className="todo-actions">
        <button
          className="btn btn-edit"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit "${todo.name}"`}
        >
          ✏️
        </button>
        <button
          className="btn btn-delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.name}"`}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
