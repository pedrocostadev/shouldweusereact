import { getTodos, saveTodos } from '../services/localStorage.js';

export class TodoManager {
  constructor() {
    this.todos = [];
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.todos));
  }

  loadTodos() {
    this.todos = getTodos();
    this.notify();
  }

  persistTodos() {
    saveTodos(this.todos);
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  addTodo({ name, description, limitDate }) {
    const todo = {
      id: this.generateId(),
      name,
      description: description || null,
      limitDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.todos = [...this.todos, todo];
    this.persistTodos();
    this.notify();
    return todo;
  }

  updateTodo(id, updates) {
    this.todos = this.todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    );
    this.persistTodos();
    this.notify();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.persistTodos();
    this.notify();
  }

  getTodos() {
    return this.todos;
  }

  getTodoById(id) {
    return this.todos.find(todo => todo.id === id) || null;
  }

  toggleComplete(id) {
    const todo = this.getTodoById(id);
    if (todo) {
      this.updateTodo(id, { completed: !todo.completed });
    }
  }
}
