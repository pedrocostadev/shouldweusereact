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

  const todoForm = new TodoForm(formContainer, {
    onSubmit: (todoData) => {
      if (todoForm.editingId) {
        todoManager.updateTodo(todoForm.editingId, todoData);
        todoForm.clearEdit();
      } else {
        todoManager.addTodo(todoData);
      }
    },
    onCancelEdit: () => {
      todoForm.clearEdit();
    }
  });

  const todoList = new TodoList(listContainer, {
    onEdit: (todo) => {
      todoForm.setEditMode(todo);
    },
    onDelete: (id) => {
      if (confirm('Delete this todo?')) {
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
