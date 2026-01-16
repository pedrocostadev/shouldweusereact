export class TodoForm {
  constructor(container, { onSubmit, onCancel }) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.editingId = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <form class="todo-form" id="todo-form">
        <h2>${this.editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
        <div class="form-group">
          <label for="name">Name *</label>
          <input type="text" id="name" name="name" required placeholder="Enter todo name" />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" placeholder="Enter description (optional)"></textarea>
        </div>
        <div class="form-group">
          <label for="limitDate">Due Date *</label>
          <input type="date" id="limitDate" name="limitDate" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            ${this.editingId ? 'Update' : 'Add'} Todo
          </button>
          ${this.editingId ? '<button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>' : ''}
        </div>
      </form>
    `;

    this.form = this.container.querySelector('#todo-form');
    this.nameInput = this.container.querySelector('#name');
    this.descriptionInput = this.container.querySelector('#description');
    this.limitDateInput = this.container.querySelector('#limitDate');
    this.cancelBtn = this.container.querySelector('#cancel-btn');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', this.handleCancel.bind(this));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const name = this.nameInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const limitDate = this.limitDateInput.value;

    if (!name) {
      this.nameInput.classList.add('error');
      this.nameInput.focus();
      return;
    }

    this.nameInput.classList.remove('error');

    this.onSubmit({
      name,
      description,
      limitDate
    });

    this.clearForm();
  }

  handleCancel() {
    this.clearEdit();
    this.onCancel();
  }

  clearForm() {
    this.form.reset();
    this.nameInput.classList.remove('error');
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
