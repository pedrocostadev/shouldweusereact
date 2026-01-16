import { TodoItem } from './TodoItem.js';

export class TodoList {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
    this.todoItems = new Map();
  }

  render(todos) {
    if (!todos || todos.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      `;
      this.todoItems.clear();
      return;
    }

    this.container.innerHTML = '<div class="todo-list"></div>';
    const listEl = this.container.querySelector('.todo-list');
    this.todoItems.clear();

    todos.forEach(todo => {
      const todoItem = new TodoItem(todo, this.todoManager, this.getFormInstance.bind(this));
      this.todoItems.set(todo.id, todoItem);
      listEl.appendChild(todoItem.element);
    });
  }

  getFormInstance() {
    const formContainer = document.getElementById('form-container');
    if (formContainer && formContainer.__todoForm) {
      return formContainer.__todoForm;
    }
    return null;
  }
}
