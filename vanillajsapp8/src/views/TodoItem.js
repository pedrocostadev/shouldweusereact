import { formatDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js'

export function createTodoItem(todo) {
  const item = document.createElement('div')
  item.className = `todo-item${todo.completed ? ' completed' : ''}`
  item.dataset.id = todo.id

  let dateClass = ''
  if (!todo.completed) {
    if (isOverdue(todo.limitDate)) {
      dateClass = 'overdue'
    } else if (isUpcoming(todo.limitDate)) {
      dateClass = 'upcoming'
    }
  }

  item.innerHTML = `
    <div class="todo-header">
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark as complete">
      <span class="todo-name">${escapeHtml(todo.name)}</span>
    </div>
    ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
    <div class="todo-footer">
      <span class="todo-date ${dateClass}">Due: ${formatDate(todo.limitDate)}</span>
      <div class="todo-actions">
        <button class="btn btn-edit" aria-label="Edit todo">Edit</button>
        <button class="btn btn-danger" aria-label="Delete todo">Delete</button>
      </div>
    </div>
  `

  return item
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
