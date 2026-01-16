import { TodoManager } from './models/TodoManager.js';
import { TodoForm } from './views/TodoForm.js';
import { TodoList } from './views/TodoList.js';

export function initApp() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <header class="header">
        <h1>Todo App</h1>
      </header>
      <main class="main">
        <div id="form-container"></div>
        <div id="list-container"></div>
      </main>
    </div>
  `;

  const todoManager = new TodoManager();
  const formContainer = document.getElementById('form-container');
  const listContainer = document.getElementById('list-container');

  const todoForm = new TodoForm(formContainer, {
    onSubmit: (todoData) => {
      if (todoForm.editingId) {
        todoManager.updateTodo(todoForm.editingId, todoData);
        todoForm.clearEdit();
      } else {
        todoManager.addTodo(todoData);
      }
    },
    onCancel: () => {
      todoForm.clearEdit();
    }
  });

  const todoList = new TodoList(listContainer, {
    onEdit: (todo) => {
      todoForm.setEditMode(todo);
    },
    onDelete: (id) => {
      if (confirm('Are you sure you want to delete this todo?')) {
        todoManager.deleteTodo(id);
      }
    },
    onToggleComplete: (id) => {
      const todo = todoManager.getTodoById(id);
      if (todo) {
        todoManager.updateTodo(id, { completed: !todo.completed });
      }
    }
  });

  todoManager.subscribe((todos) => {
    todoList.render(todos);
  });

  todoManager.loadTodos();
}
