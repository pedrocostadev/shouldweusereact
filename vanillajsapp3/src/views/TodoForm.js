export class TodoForm {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
    this.editingId = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <form class="todo-form" id="todo-form">
        <div class="form-group">
          <label for="todo-name">Name *</label>
          <input type="text" id="todo-name" name="name" required placeholder="Enter todo name">
        </div>
        <div class="form-group">
          <label for="todo-description">Description</label>
          <textarea id="todo-description" name="description" placeholder="Enter description (optional)"></textarea>
        </div>
        <div class="form-group">
          <label for="todo-date">Due Date *</label>
          <input type="date" id="todo-date" name="limitDate" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="submit-btn">Add Todo</button>
          <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">Cancel</button>
        </div>
      </form>
    `;

    this.form = this.container.querySelector('#todo-form');
    this.nameInput = this.container.querySelector('#todo-name');
    this.descriptionInput = this.container.querySelector('#todo-description');
    this.dateInput = this.container.querySelector('#todo-date');
    this.submitBtn = this.container.querySelector('#submit-btn');
    this.cancelBtn = this.container.querySelector('#cancel-btn');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.cancelBtn.addEventListener('click', this.handleCancel.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const name = this.nameInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const limitDate = this.dateInput.value;

    if (!name) {
      this.nameInput.classList.add('error');
      return;
    }
    this.nameInput.classList.remove('error');

    if (this.editingId) {
      this.todoManager.updateTodo(this.editingId, { name, description, limitDate });
      this.exitEditMode();
    } else {
      this.todoManager.addTodo({ name, description, limitDate });
    }

    this.clearForm();
  }

  handleCancel() {
    this.exitEditMode();
    this.clearForm();
  }

  clearForm() {
    this.form.reset();
    this.nameInput.classList.remove('error');
  }

  enterEditMode(todo) {
    this.editingId = todo.id;
    this.nameInput.value = todo.name;
    this.descriptionInput.value = todo.description || '';
    this.dateInput.value = todo.limitDate;
    this.submitBtn.textContent = 'Update Todo';
    this.cancelBtn.style.display = 'inline-block';
    this.nameInput.focus();
  }

  exitEditMode() {
    this.editingId = null;
    this.submitBtn.textContent = 'Add Todo';
    this.cancelBtn.style.display = 'none';
  }
}
