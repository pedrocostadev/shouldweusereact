import { formatDate, getDateClass } from '../utils/dateFormatter.js';

export class TodoItem {
  constructor(todo, { onEdit, onDelete, onToggleComplete }) {
    this.todo = todo;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.onToggleComplete = onToggleComplete;
    this.element = this.createElement();
  }

  createElement() {
    const item = document.createElement('div');
    item.className = `todo-item${this.todo.completed ? ' completed' : ''}`;
    item.dataset.id = this.todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = this.todo.completed;
    checkbox.setAttribute('aria-label', 'Mark as complete');
    checkbox.addEventListener('change', () => this.onToggleComplete(this.todo.id));

    const content = document.createElement('div');
    content.className = 'todo-content';

    const name = document.createElement('div');
    name.className = 'todo-name';
    name.textContent = this.todo.name;
    content.appendChild(name);

    if (this.todo.description) {
      const description = document.createElement('div');
      description.className = 'todo-description';
      description.textContent = this.todo.description;
      content.appendChild(description);
    }

    const dateClass = getDateClass(this.todo.limitDate, this.todo.completed);
    const date = document.createElement('div');
    date.className = `todo-date ${dateClass}`;
    date.textContent = `Due: ${formatDate(this.todo.limitDate)}`;
    content.appendChild(date);

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary btn-small';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit todo');
    editBtn.addEventListener('click', () => this.onEdit(this.todo));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-small';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete todo');
    deleteBtn.addEventListener('click', () => this.onDelete(this.todo.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(actions);

    return item;
  }
}
