import { getRelativeDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js';

export class TodoItem {
  constructor(todo, todoManager, getFormInstance) {
    this.todo = todo;
    this.todoManager = todoManager;
    this.getFormInstance = getFormInstance;
    this.isEditing = false;
    this.element = this.createElement();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = `todo-item ${this.todo.completed ? 'completed' : ''}`;
    div.dataset.id = this.todo.id;
    
    this.renderContent(div);
    this.bindEvents(div);
    
    return div;
  }

  renderContent(container) {
    const dateClass = this.getDateClass();
    const relativeDate = getRelativeDate(this.todo.limitDate);

    container.innerHTML = `
      <div class="todo-header">
        <input type="checkbox" class="todo-checkbox" ${this.todo.completed ? 'checked' : ''} aria-label="Mark as complete">
        <span class="todo-name">${this.escapeHtml(this.todo.name)}</span>
      </div>
      ${this.todo.description ? `<p class="todo-description">${this.escapeHtml(this.todo.description)}</p>` : ''}
      <div class="todo-meta">
        <span class="todo-date ${dateClass}">Due: ${relativeDate}</span>
        <div class="todo-actions">
          <button class="btn btn-small btn-secondary edit-btn">Edit</button>
          <button class="btn btn-small btn-danger delete-btn">Delete</button>
        </div>
      </div>
    `;
  }

  getDateClass() {
    if (this.todo.completed) return '';
    if (isOverdue(this.todo.limitDate)) return 'overdue';
    if (isUpcoming(this.todo.limitDate)) return 'upcoming';
    return '';
  }

  bindEvents(container) {
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('todo-checkbox')) {
        this.handleToggleComplete();
      } else if (e.target.classList.contains('edit-btn')) {
        this.handleEdit();
      } else if (e.target.classList.contains('delete-btn')) {
        this.handleDelete();
      }
    });
  }

  handleToggleComplete() {
    this.todoManager.toggleComplete(this.todo.id);
  }

  handleEdit() {
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
      const form = formContainer.querySelector('.todo-form');
      if (form) {
        const nameInput = form.querySelector('#name');
        const descInput = form.querySelector('#description');
        const dateInput = form.querySelector('#limitDate');
        const submitBtn = form.querySelector('#submit-btn');
        const cancelBtn = form.querySelector('#cancel-btn');

        nameInput.value = this.todo.name;
        descInput.value = this.todo.description || '';
        dateInput.value = this.todo.limitDate;
        submitBtn.textContent = 'Update Todo';
        cancelBtn.style.display = 'inline-block';
        
        formContainer.__editingTodoId = this.todo.id;
        
        form.onsubmit = (e) => {
          e.preventDefault();
          const name = nameInput.value.trim();
          const description = descInput.value.trim();
          const limitDate = dateInput.value;

          if (name && limitDate) {
            this.todoManager.updateTodo(this.todo.id, {
              name,
              description: description || null,
              limitDate,
            });
            this.resetForm(form, submitBtn, cancelBtn);
          }
        };

        cancelBtn.onclick = () => {
          this.resetForm(form, submitBtn, cancelBtn);
        };

        nameInput.focus();
      }
    }
  }

  resetForm(form, submitBtn, cancelBtn) {
    form.reset();
    submitBtn.textContent = 'Add Todo';
    cancelBtn.style.display = 'none';
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
      formContainer.__editingTodoId = null;
    }
    form.onsubmit = null;
    cancelBtn.onclick = null;
  }

  handleDelete() {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoManager.deleteTodo(this.todo.id);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
