import { formatDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js';

export function createTodoItem(todo, { onEdit, onDelete, onToggleComplete }) {
  const item = document.createElement('div');
  item.className = 'todo-item';
  
  if (todo.completed) {
    item.classList.add('completed');
  }
  
  if (!todo.completed && isOverdue(todo.limitDate)) {
    item.classList.add('overdue');
  }

  const dateClass = !todo.completed && isUpcoming(todo.limitDate) ? 'upcoming' : '';

  item.innerHTML = `
    <div class="todo-header">
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark as ${todo.completed ? 'incomplete' : 'complete'}">
      <span class="todo-name">${escapeHtml(todo.name)}</span>
    </div>
    ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
    <div class="todo-footer">
      <span class="todo-date ${dateClass}">Due: ${formatDate(todo.limitDate)}</span>
      <div class="todo-actions">
        <button class="btn btn-small btn-secondary edit-btn" aria-label="Edit todo">Edit</button>
        <button class="btn btn-small btn-danger delete-btn" aria-label="Delete todo">Delete</button>
      </div>
    </div>
  `;

  const checkbox = item.querySelector('.todo-checkbox');
  checkbox.addEventListener('change', onToggleComplete);

  const editBtn = item.querySelector('.edit-btn');
  editBtn.addEventListener('click', onEdit);

  const deleteBtn = item.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', onDelete);

  return item;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
