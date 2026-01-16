import { formatDate, isOverdue, isUpcoming } from '../utils/dateFormatter.js';
import { TodoForm } from './TodoForm.js';

export class TodoItem {
  constructor(todo, todoManager) {
    this.todo = todo;
    this.todoManager = todoManager;
  }

  render() {
    const { id, name, description, limitDate, completed } = this.todo;
    const overdue = !completed && isOverdue(limitDate);
    const upcoming = !completed && !overdue && isUpcoming(limitDate);

    const item = document.createElement('div');
    item.className = `todo-item${completed ? ' completed' : ''}${overdue ? ' overdue' : ''}${upcoming ? ' upcoming' : ''}`;
    item.dataset.id = id;

    item.innerHTML = `
      <div class="todo-header">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${completed ? 'checked' : ''}
          aria-label="Mark as ${completed ? 'incomplete' : 'complete'}"
        />
        <span class="todo-name">${this.escapeHtml(name)}</span>
      </div>
      ${description ? `<p class="todo-description">${this.escapeHtml(description)}</p>` : ''}
      <div class="todo-meta">
        <span class="todo-date${overdue ? ' overdue' : ''}${upcoming ? ' upcoming' : ''}">
          ${formatDate(limitDate)}
        </span>
        <div class="todo-actions">
          <button class="btn btn-secondary btn-sm edit-btn" aria-label="Edit todo">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" aria-label="Delete todo">Delete</button>
        </div>
      </div>
    `;

    this.attachEvents(item);
    return item;
  }

  attachEvents(item) {
    const checkbox = item.querySelector('.todo-checkbox');
    const editBtn = item.querySelector('.edit-btn');
    const deleteBtn = item.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
      this.todoManager.updateTodo(this.todo.id, { completed: checkbox.checked });
    });

    editBtn.addEventListener('click', () => {
      this.todoManager.setEditingId(this.todo.id);
      const formContainer = document.getElementById('form-container');
      const form = new TodoForm(formContainer, this.todoManager);
      form.setEditMode(this.todo);
    });

    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this todo?')) {
        this.todoManager.deleteTodo(this.todo.id);
      }
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
