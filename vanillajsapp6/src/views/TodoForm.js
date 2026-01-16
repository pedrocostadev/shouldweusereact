export class TodoForm {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
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
          <button type="submit" class="btn btn-primary">Add Todo</button>
        </div>
      </form>
    `;

    this.form = this.container.querySelector('#todo-form');
    this.nameInput = this.container.querySelector('#todo-name');
    this.descriptionInput = this.container.querySelector('#todo-description');
    this.dateInput = this.container.querySelector('#todo-date');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
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

    this.todoManager.addTodo({
      name,
      description,
      limitDate
    });

    this.clearForm();
  }

  clearForm() {
    this.form.reset();
    this.nameInput.classList.remove('error');
  }
}
