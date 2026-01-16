import { TodoManager } from './models/TodoManager.js';
import { TodoForm } from './views/TodoForm.js';
import { TodoList } from './views/TodoList.js';

export function initApp() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <h1>Todo App</h1>
      <div id="form-container"></div>
      <div id="list-container"></div>
    </div>
  `;

  const todoManager = new TodoManager();
  const formContainer = document.getElementById('form-container');
  const listContainer = document.getElementById('list-container');

  const todoList = new TodoList(listContainer, todoManager);
  const todoForm = new TodoForm(formContainer, todoManager);

  todoManager.subscribe(() => {
    todoList.render();
  });

  todoManager.loadTodos();
  todoForm.render();
  todoList.render();
}
