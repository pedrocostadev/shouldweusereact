export class TodoForm {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
    this.editingTodo = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <form class="todo-form" id="todo-form">
        <div class="form-group">
          <label for="name">Name *</label>
          <input type="text" id="name" name="name" required placeholder="Enter todo name">
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" placeholder="Enter description (optional)"></textarea>
        </div>
        <div class="form-group">
          <label for="limitDate">Due Date *</label>
          <input type="date" id="limitDate" name="limitDate" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="submit-btn">Add Todo</button>
          <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">Cancel</button>
        </div>
      </form>
    `;

    this.form = this.container.querySelector('#todo-form');
    this.nameInput = this.container.querySelector('#name');
    this.descriptionInput = this.container.querySelector('#description');
    this.limitDateInput = this.container.querySelector('#limitDate');
    this.submitBtn = this.container.querySelector('#submit-btn');
    this.cancelBtn = this.container.querySelector('#cancel-btn');

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.cancelBtn.addEventListener('click', () => this.cancelEdit());
  }

  handleSubmit(e) {
    e.preventDefault();

    const name = this.nameInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const limitDate = this.limitDateInput.value;

    if (!name || !limitDate) {
      this.showValidationError();
      return;
    }

    if (this.editingTodo) {
      this.todoManager.updateTodo(this.editingTodo.id, {
        name,
        description: description || null,
        limitDate,
      });
      this.cancelEdit();
    } else {
      this.todoManager.addTodo({ name, description, limitDate });
      this.clearForm();
    }
  }

  showValidationError() {
    const nameGroup = this.nameInput.closest('.form-group');
    const dateGroup = this.limitDateInput.closest('.form-group');

    if (!this.nameInput.value.trim()) {
      nameGroup.classList.add('error');
    } else {
      nameGroup.classList.remove('error');
    }

    if (!this.limitDateInput.value) {
      dateGroup.classList.add('error');
    } else {
      dateGroup.classList.remove('error');
    }
  }

  clearForm() {
    this.form.reset();
    this.container.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  }

  setEditMode(todo) {
    this.editingTodo = todo;
    this.nameInput.value = todo.name;
    this.descriptionInput.value = todo.description || '';
    this.limitDateInput.value = todo.limitDate;
    this.submitBtn.textContent = 'Update Todo';
    this.cancelBtn.style.display = 'inline-block';
    this.nameInput.focus();
  }

  cancelEdit() {
    this.editingTodo = null;
    this.clearForm();
    this.submitBtn.textContent = 'Add Todo';
    this.cancelBtn.style.display = 'none';
  }
}
