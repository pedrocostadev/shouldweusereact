export class TodoForm {
  constructor(container, { onSubmit, onCancelEdit }) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.onCancelEdit = onCancelEdit;
    this.editingId = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <form class="todo-form ${this.editingId ? 'editing' : ''}" id="todo-form">
        <h2>${this.editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
        <div class="form-group">
          <label for="name">Name <span class="required-indicator">*</span></label>
          <input type="text" id="name" name="name" required placeholder="Enter todo name">
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" placeholder="Enter description (optional)"></textarea>
        </div>
        <div class="form-group">
          <label for="limitDate">Due Date <span class="required-indicator">*</span></label>
          <input type="date" id="limitDate" name="limitDate" required>
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn btn-primary">
            ${this.editingId ? 'Update' : 'Add'} Todo
          </button>
          ${this.editingId ? '<button type="button" class="btn btn-secondary" id="cancel-edit">Cancel</button>' : ''}
        </div>
      </form>
    `;

    this.form = this.container.querySelector('#todo-form');
    this.nameInput = this.container.querySelector('#name');
    this.descriptionInput = this.container.querySelector('#description');
    this.limitDateInput = this.container.querySelector('#limitDate');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    const cancelBtn = this.container.querySelector('#cancel-edit');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.clearEdit();
        this.onCancelEdit();
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const name = this.nameInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const limitDate = this.limitDateInput.value;

    if (!name || !limitDate) return;

    this.onSubmit({ name, description, limitDate });
    this.form.reset();
  }

  setEditMode(todo) {
    this.editingId = todo.id;
    this.render();
    this.nameInput.value = todo.name;
    this.descriptionInput.value = todo.description || '';
    this.limitDateInput.value = todo.limitDate;
    this.nameInput.focus();
  }

  clearEdit() {
    this.editingId = null;
    this.render();
  }
}
