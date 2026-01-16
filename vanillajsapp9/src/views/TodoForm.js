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

    this.form = document.getElementById('todo-form');
    this.nameInput = document.getElementById('name');
    this.descriptionInput = document.getElementById('description');
    this.limitDateInput = document.getElementById('limitDate');
    this.submitBtn = document.getElementById('submit-btn');
    this.cancelBtn = document.getElementById('cancel-btn');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.cancelBtn.addEventListener('click', this.handleCancel.bind(this));
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
        limitDate
      });
      this.editingTodo = null;
      this.submitBtn.textContent = 'Add Todo';
      this.cancelBtn.style.display = 'none';
    } else {
      this.todoManager.addTodo({ name, description, limitDate });
    }

    this.clearForm();
  }

  handleCancel() {
    this.editingTodo = null;
    this.submitBtn.textContent = 'Add Todo';
    this.cancelBtn.style.display = 'none';
    this.clearForm();
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

  showValidationError() {
    if (!this.nameInput.value.trim()) {
      this.nameInput.classList.add('error');
    }
    if (!this.limitDateInput.value) {
      this.limitDateInput.classList.add('error');
    }

    setTimeout(() => {
      this.nameInput.classList.remove('error');
      this.limitDateInput.classList.remove('error');
    }, 2000);
  }

  clearForm() {
    this.form.reset();
    this.nameInput.classList.remove('error');
    this.limitDateInput.classList.remove('error');
  }
}
