import { getRelativeDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js';

export class TodoItem {
  constructor(todo, todoManager, todoForm) {
    this.todo = todo;
    this.todoManager = todoManager;
    this.todoForm = todoForm;
  }

  render() {
    const el = document.createElement('div');
    el.className = `todo-item${this.todo.completed ? ' completed' : ''}`;
    el.dataset.id = this.todo.id;

    const dateClass = this.getDateClass();
    const relativeDate = this.todo.limitDate ? getRelativeDate(this.todo.limitDate) : '';

    el.innerHTML = `
      <div class="todo-header">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${this.todo.completed ? 'checked' : ''}
          aria-label="Mark as ${this.todo.completed ? 'incomplete' : 'complete'}"
        />
        <span class="todo-name">${this.escapeHtml(this.todo.name)}</span>
      </div>
      ${this.todo.description ? `<p class="todo-description">${this.escapeHtml(this.todo.description)}</p>` : ''}
      <div class="todo-footer">
        <span class="todo-date ${dateClass}">${relativeDate ? `Due: ${relativeDate}` : ''}</span>
        <div class="todo-actions">
          <button class="btn btn-secondary btn-small edit-btn" aria-label="Edit todo">Edit</button>
          <button class="btn btn-danger btn-small delete-btn" aria-label="Delete todo">Delete</button>
        </div>
      </div>
    `;

    this.attachEventListeners(el);
    return el;
  }

  getDateClass() {
    if (!this.todo.limitDate || this.todo.completed) return '';
    if (isOverdue(this.todo.limitDate)) return 'overdue';
    if (isUpcoming(this.todo.limitDate)) return 'upcoming';
    return '';
  }

  attachEventListeners(el) {
    const checkbox = el.querySelector('.todo-checkbox');
    const editBtn = el.querySelector('.edit-btn');
    const deleteBtn = el.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
      this.todoManager.toggleComplete(this.todo.id);
    });

    editBtn.addEventListener('click', () => {
      if (this.todoForm) {
        this.todoForm.setEditMode(this.todo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
