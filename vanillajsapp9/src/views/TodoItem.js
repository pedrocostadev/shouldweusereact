import { getRelativeDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js';

export class TodoItem {
  constructor(todo, todoManager, onEdit) {
    this.todo = todo;
    this.todoManager = todoManager;
    this.onEdit = onEdit;
    this.element = this.createElement();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'todo-item';
    div.dataset.id = this.todo.id;
    
    if (this.todo.completed) {
      div.classList.add('completed');
    }
    
    if (!this.todo.completed && isOverdue(this.todo.limitDate)) {
      div.classList.add('overdue');
    } else if (!this.todo.completed && isUpcoming(this.todo.limitDate)) {
      div.classList.add('upcoming');
    }

    div.innerHTML = `
      <div class="todo-header">
        <input type="checkbox" class="todo-checkbox" ${this.todo.completed ? 'checked' : ''} aria-label="Mark as complete">
        <span class="todo-name">${this.escapeHtml(this.todo.name)}</span>
      </div>
      ${this.todo.description ? `<p class="todo-description">${this.escapeHtml(this.todo.description)}</p>` : ''}
      <div class="todo-footer">
        <span class="todo-date">${getRelativeDate(this.todo.limitDate)}</span>
        <div class="todo-actions">
          <button class="btn btn-secondary btn-small edit-btn" aria-label="Edit todo">Edit</button>
          <button class="btn btn-danger btn-small delete-btn" aria-label="Delete todo">Delete</button>
        </div>
      </div>
    `;

    this.attachEventListeners(div);
    return div;
  }

  attachEventListeners(element) {
    const checkbox = element.querySelector('.todo-checkbox');
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
      this.todoManager.toggleComplete(this.todo.id);
    });

    editBtn.addEventListener('click', () => {
      this.onEdit(this.todo);
    });

    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this todo?')) {
        this.todoManager.deleteTodo(this.todo.id);
      }
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
