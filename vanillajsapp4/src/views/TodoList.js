import { TodoItem } from './TodoItem.js';

export class TodoList {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
  }

  render(todos) {
    if (!todos || todos.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = '<div class="todo-list"></div>';
    const listEl = this.container.querySelector('.todo-list');

    todos.forEach((todo) => {
      const todoItem = new TodoItem(todo, this.todoManager);
      listEl.appendChild(todoItem.render());
    });
  }
}
