import { getRelativeDate, isOverdue } from '../utils/dateFormatter.js';

export class TodoItem {
  constructor(todo, todoManager) {
    this.todo = todo;
    this.todoManager = todoManager;
    this.isEditing = false;
    this.element = this.createElement();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'todo-item';
    if (this.todo.completed) div.classList.add('completed');
    if (!this.todo.completed && isOverdue(this.todo.limitDate)) div.classList.add('overdue');
    
    this.renderContent(div);
    return div;
  }

  renderContent(container) {
    if (this.isEditing) {
      this.renderEditMode(container);
    } else {
      this.renderViewMode(container);
    }
  }

  renderViewMode(container) {
    container.innerHTML = `
      <div class="todo-header">
        <input type="checkbox" class="todo-checkbox" ${this.todo.completed ? 'checked' : ''} aria-label="Mark as complete">
        <span class="todo-name">${this.escapeHtml(this.todo.name)}</span>
      </div>
      ${this.todo.description ? `<p class="todo-description">${this.escapeHtml(this.todo.description)}</p>` : ''}
      <div class="todo-footer">
        <span class="todo-date">Due: ${getRelativeDate(this.todo.limitDate)}</span>
        <div class="todo-actions">
          <button class="btn btn-secondary btn-small edit-btn">Edit</button>
          <button class="btn btn-danger btn-small delete-btn">Delete</button>
        </div>
      </div>
    `;

    container.querySelector('.todo-checkbox').addEventListener('change', () => {
      this.todoManager.toggleComplete(this.todo.id);
    });

    container.querySelector('.edit-btn').addEventListener('click', () => {
      this.isEditing = true;
      this.element.classList.add('editing');
      this.renderContent(this.element);
    });

    container.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this todo?')) {
        this.todoManager.deleteTodo(this.todo.id);
      }
    });
  }

  renderEditMode(container) {
    container.innerHTML = `
      <form class="edit-form">
        <input type="text" class="edit-name" value="${this.escapeHtml(this.todo.name)}" required placeholder="Todo name">
        <textarea class="edit-description" placeholder="Description (optional)">${this.escapeHtml(this.todo.description || '')}</textarea>
        <input type="date" class="edit-date" value="${this.todo.limitDate}" required>
        <div class="edit-actions">
          <button type="submit" class="btn btn-primary btn-small">Save</button>
          <button type="button" class="btn btn-secondary btn-small cancel-edit-btn">Cancel</button>
        </div>
      </form>
    `;

    const form = container.querySelector('.edit-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('.edit-name').value.trim();
      const description = container.querySelector('.edit-description').value.trim();
      const limitDate = container.querySelector('.edit-date').value;
      
      if (name) {
        this.todoManager.updateTodo(this.todo.id, { name, description, limitDate });
      }
    });

    container.querySelector('.cancel-edit-btn').addEventListener('click', () => {
      this.isEditing = false;
      this.element.classList.remove('editing');
      this.renderContent(this.element);
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
