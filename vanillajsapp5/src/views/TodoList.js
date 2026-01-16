import { TodoItem } from './TodoItem.js';

export class TodoList {
  constructor(container, { onEdit, onDelete, onToggleComplete }) {
    this.container = container;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.onToggleComplete = onToggleComplete;
  }

  render(todos) {
    this.container.innerHTML = '';

    if (todos.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      `;
      return;
    }

    const list = document.createElement('div');
    list.className = 'todo-list';

    todos.forEach(todo => {
      const todoItem = new TodoItem(todo, {
        onEdit: this.onEdit,
        onDelete: this.onDelete,
        onToggleComplete: this.onToggleComplete
      });
      list.appendChild(todoItem.element);
    });

    this.container.appendChild(list);
  }
}
