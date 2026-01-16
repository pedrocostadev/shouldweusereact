export class TodoForm {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
    this.editingTodo = null;
  }

  setEditMode(todo) {
    this.editingTodo = todo;
    this.render();
  }

  clearEditMode() {
    this.editingTodo = null;
    this.render();
  }

  render() {
    const isEditing = !!this.editingTodo;
    
    this.container.innerHTML = `
      <form class="todo-form" id="todo-form">
        <div class="form-group">
          <label for="name">Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="Enter todo name"
            value="${isEditing ? this.escapeHtml(this.editingTodo.name) : ''}"
          />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            placeholder="Enter description (optional)"
          >${isEditing && this.editingTodo.description ? this.escapeHtml(this.editingTodo.description) : ''}</textarea>
        </div>
        <div class="form-group">
          <label for="limitDate">Due Date</label>
          <input 
            type="date" 
            id="limitDate" 
            name="limitDate"
            value="${isEditing && this.editingTodo.limitDate ? this.editingTodo.limitDate.split('T')[0] : ''}"
          />
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn btn-primary">
            ${isEditing ? 'Update Todo' : 'Add Todo'}
          </button>
          ${isEditing ? '<button type="button" class="btn btn-secondary" id="cancel-edit">Cancel</button>' : ''}
        </div>
      </form>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = this.container.querySelector('#todo-form');
    const cancelBtn = this.container.querySelector('#cancel-edit');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.clearEditMode();
      });
    }
  }

  handleSubmit(e) {
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const description = formData.get('description').trim();
    const limitDate = formData.get('limitDate');

    if (!name) {
      const nameInput = this.container.querySelector('#name');
      nameInput.classList.add('error');
      nameInput.focus();
      return;
    }

    const todoData = {
      name,
      description: description || null,
      limitDate: limitDate || null,
    };

    if (this.editingTodo) {
      this.todoManager.updateTodo(this.editingTodo.id, todoData);
      this.clearEditMode();
    } else {
      this.todoManager.addTodo(todoData);
      e.target.reset();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
