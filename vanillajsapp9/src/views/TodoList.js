import { TodoItem } from './TodoItem.js';

export class TodoList {
  constructor(container, todoManager) {
    this.container = container;
    this.todoManager = todoManager;
    this.todoItems = new Map();
  }

  render(todos) {
    if (todos.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      `;
      this.todoItems.clear();
      return;
    }

    this.container.innerHTML = '<div class="todo-list" id="todo-list"></div>';
    const listElement = document.getElementById('todo-list');
    
    this.todoItems.clear();
    
    todos.forEach(todo => {
      const todoItem = new TodoItem(todo, this.todoManager, this.onEdit.bind(this));
      this.todoItems.set(todo.id, todoItem);
      listElement.appendChild(todoItem.element);
    });
  }

  onEdit(todo) {
    const formContainer = document.getElementById('form-container');
    const event = new CustomEvent('editTodo', { detail: todo });
    formContainer.dispatchEvent(event);
    
    const form = formContainer.querySelector('.todo-form');
    if (form) {
      const nameInput = form.querySelector('#name');
      const descriptionInput = form.querySelector('#description');
      const limitDateInput = form.querySelector('#limitDate');
      const submitBtn = form.querySelector('#submit-btn');
      const cancelBtn = form.querySelector('#cancel-btn');
      
      nameInput.value = todo.name;
      descriptionInput.value = todo.description || '';
      limitDateInput.value = todo.limitDate;
      submitBtn.textContent = 'Update Todo';
      cancelBtn.style.display = 'inline-block';
      
      form._editingTodo = todo;
      
      form.onsubmit = (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const limitDate = limitDateInput.value;
        
        if (!name || !limitDate) return;
        
        this.todoManager.updateTodo(todo.id, {
          name,
          description: description || null,
          limitDate
        });
        
        form.reset();
        submitBtn.textContent = 'Add Todo';
        cancelBtn.style.display = 'none';
        form._editingTodo = null;
        
        form.onsubmit = null;
      };
      
      cancelBtn.onclick = () => {
        form.reset();
        submitBtn.textContent = 'Add Todo';
        cancelBtn.style.display = 'none';
        form._editingTodo = null;
        form.onsubmit = null;
      };
      
      nameInput.focus();
    }
  }
}
