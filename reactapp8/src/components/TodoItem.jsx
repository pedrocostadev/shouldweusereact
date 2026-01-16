import { useState } from 'react'
import { TodoForm } from './TodoForm'

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const isToday = date.toDateString() === today.toDateString()
  const isTomorrow = date.toDateString() === tomorrow.toDateString()
  const isOverdue = date < today && !isToday
  
  let formatted
  if (isToday) formatted = 'Today'
  else if (isTomorrow) formatted = 'Tomorrow'
  else formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  return { formatted, isOverdue }
}

export function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const dateInfo = formatDate(todo.limitDate)

  const handleUpdate = (updates) => {
    onUpdate(todo.id, updates)
    setIsEditing(false)
  }

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed })
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

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${dateInfo?.isOverdue && !todo.completed ? 'overdue' : ''}`}>
      <div className="todo-content">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            aria-label={`Mark "${todo.name}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="checkmark"></span>
        </label>
        <div className="todo-details">
          <h3 className="todo-name">{todo.name}</h3>
          {todo.description && <p className="todo-description">{todo.description}</p>}
          {dateInfo && (
            <span className={`todo-date ${dateInfo.isOverdue && !todo.completed ? 'overdue' : ''}`}>
              Due: {dateInfo.formatted}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} aria-label="Edit todo">Edit</button>
        <button onClick={() => onDelete(todo.id)} className="delete" aria-label="Delete todo">Delete</button>
      </div>
    </div>
  )
}
