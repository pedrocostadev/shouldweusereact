export class TodoForm {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
    this.render();
  }

  render(editTodo = null) {
    const isEditing = !!editTodo;

    this.container.innerHTML = `
      <form class="todo-form" id="todo-form">
        <div class="form-group">
          <label for="name">Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value="${editTodo?.name || ''}"
            placeholder="Enter todo name"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description"
            placeholder="Enter description (optional)"
          >${editTodo?.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label for="limitDate">Due Date *</label>
          <input 
            type="date" 
            id="limitDate" 
            name="limitDate"
            value="${editTodo?.limitDate || ''}"
            required
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            ${isEditing ? 'Update' : 'Add'} Todo
          </button>
          ${isEditing ? '<button type="button" class="btn btn-secondary" id="cancel-edit">Cancel</button>' : ''}
        </div>
      </form>
    `;

    this.attachEvents(editTodo);
  }

  attachEvents(editTodo) {
    const form = this.container.querySelector('#todo-form');
    const cancelBtn = this.container.querySelector('#cancel-edit');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(editTodo);
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.todoManager.setEditingId(null);
        this.render();
      });
    }
  }

  handleSubmit(editTodo) {
    const form = this.container.querySelector('#todo-form');
    const nameInput = form.querySelector('#name');
    const descriptionInput = form.querySelector('#description');
    const limitDateInput = form.querySelector('#limitDate');

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const limitDate = limitDateInput.value;

    // Validation
    let isValid = true;
    this.clearErrors();

    if (!name) {
      this.showError(nameInput, 'Name is required');
      isValid = false;
    }

    if (!limitDate) {
      this.showError(limitDateInput, 'Due date is required');
      isValid = false;
    }

    if (!isValid) return;

    if (editTodo) {
      this.todoManager.updateTodo(editTodo.id, { name, description, limitDate });
      this.todoManager.setEditingId(null);
    } else {
      this.todoManager.addTodo({ name, description, limitDate });
    }

    this.render();
  }

  showError(input, message) {
    input.classList.add('validation-error');
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
  }

  clearErrors() {
    this.container.querySelectorAll('.validation-error').forEach((el) => {
      el.classList.remove('validation-error');
    });
    this.container.querySelectorAll('.error-message').forEach((el) => {
      el.remove();
    });
  }

  setEditMode(todo) {
    this.render(todo);
  }
}
