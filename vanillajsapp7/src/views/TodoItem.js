import { formatDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js'

export function createTodoItem(todo, { onEdit, onDelete, onToggleComplete }) {
  const item = document.createElement('div')
  item.className = `todo-item${todo.completed ? ' completed' : ''}`
  item.dataset.id = todo.id

  const dateClass = todo.completed ? '' : (isOverdue(todo.limitDate) ? 'overdue' : (isUpcoming(todo.limitDate) ? 'upcoming' : ''))

  item.innerHTML = `
    <div class="todo-header">
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark as complete">
      <span class="todo-name">${escapeHtml(todo.name)}</span>
    </div>
    ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
    <div class="todo-footer">
      <span class="todo-date ${dateClass}">Due: ${formatDate(todo.limitDate)}</span>
      <div class="todo-actions">
        <button class="btn btn-secondary btn-small edit-btn" aria-label="Edit todo">Edit</button>
        <button class="btn btn-danger btn-small delete-btn" aria-label="Delete todo">Delete</button>
      </div>
    </div>
  `

  const checkbox = item.querySelector('.todo-checkbox')
  checkbox.addEventListener('change', () => {
    onToggleComplete(todo.id)
  })

  const editBtn = item.querySelector('.edit-btn')
  editBtn.addEventListener('click', () => {
    onEdit(todo)
  })

  const deleteBtn = item.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id)
    }
  })

  return item
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
