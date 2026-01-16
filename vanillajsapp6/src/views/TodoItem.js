import { formatDate, getRelativeDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js';

export class TodoItem {
  constructor(todo, todoManager) {
    this.todo = todo;
    this.todoManager = todoManager;
    this.isEditing = false;
    this.element = this.createElement();
  }

  createElement() {
    const el = document.createElement('div');
    el.className = `todo-item${this.todo.completed ? ' completed' : ''}`;
    el.dataset.id = this.todo.id;
    this.renderContent(el);
    return el;
  }

  renderContent(el) {
    if (this.isEditing) {
      this.renderEditMode(el);
    } else {
      this.renderViewMode(el);
    }
  }

  renderViewMode(el) {
    const dateClass = this.getDateClass();
    const relativeDate = getRelativeDate(this.todo.limitDate);
    
    el.innerHTML = `
      <div class="todo-header">
        <input type="checkbox" class="todo-checkbox" ${this.todo.completed ? 'checked' : ''}>
        <span class="todo-name">${this.escapeHtml(this.todo.name)}</span>
      </div>
      ${this.todo.description ? `<p class="todo-description">${this.escapeHtml(this.todo.description)}</p>` : ''}
      <div class="todo-footer">
        <span class="todo-date ${dateClass}">${relativeDate}</span>
        <div class="todo-actions">
          <button class="btn btn-secondary btn-small edit-btn">Edit</button>
          <button class="btn btn-danger btn-small delete-btn">Delete</button>
        </div>
      </div>
    `;

    el.querySelector('.todo-checkbox').addEventListener('change', () => {
      this.todoManager.toggleComplete(this.todo.id);
    });

    el.querySelector('.edit-btn').addEventListener('click', () => {
      this.isEditing = true;
      el.classList.add('editing');
      this.renderContent(el);
    });

    el.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this todo?')) {
        this.todoManager.deleteTodo(this.todo.id);
      }
    });
  }

  renderEditMode(el) {
    el.innerHTML = `
      <form class="edit-form">
        <input type="text" name="name" value="${this.escapeHtml(this.todo.name)}" required placeholder="Todo name">
        <textarea name="description" placeholder="Description (optional)">${this.escapeHtml(this.todo.description || '')}</textarea>
        <input type="date" name="limitDate" value="${this.todo.limitDate}" required>
        <div class="edit-actions">
          <button type="button" class="btn btn-secondary btn-small cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary btn-small">Save</button>
        </div>
      </form>
    `;

    const form = el.querySelector('.edit-form');
    
    form.querySelector('.cancel-btn').addEventListener('click', () => {
      this.isEditing = false;
      el.classList.remove('editing');
      this.renderContent(el);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name').trim();
      const description = formData.get('description').trim();
      const limitDate = formData.get('limitDate');

      if (!name) return;

      this.todoManager.updateTodo(this.todo.id, {
        name,
        description: description || null,
        limitDate
      });
    });
  }

  getDateClass() {
    if (this.todo.completed) return '';
    if (isOverdue(this.todo.limitDate)) return 'overdue';
    if (isUpcoming(this.todo.limitDate)) return 'upcoming';
    return '';
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getElement() {
    return this.element;
  }
}
