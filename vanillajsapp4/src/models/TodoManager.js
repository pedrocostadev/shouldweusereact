import { getTodos, saveTodos } from '../services/localStorage.js';

export class TodoManager {
  constructor() {
    this.todos = [];
    this.listeners = [];
    this.editingId = null;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach((cb) => cb(this.todos));
  }

  loadTodos() {
    this.todos = getTodos();
    this.notify();
  }

  persistTodos() {
    saveTodos(this.todos);
  }

  generateId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();
  }

  addTodo({ name, description, limitDate }) {
    const todo = {
      id: this.generateId(),
      name,
      description: description || null,
      limitDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(todo);
    this.persistTodos();
    this.notify();
    return todo;
  }

  updateTodo(id, updates) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos[index] = { ...this.todos[index], ...updates };
      this.persistTodos();
      this.notify();
      return this.todos[index];
    }
    return null;
  }

  deleteTodo(id) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.persistTodos();
      this.notify();
      return true;
    }
    return false;
  }

  getTodos() {
    return [...this.todos];
  }

  getTodoById(id) {
    return this.todos.find((t) => t.id === id) || null;
  }

  setEditingId(id) {
    this.editingId = id;
    this.notify();
  }

  getEditingId() {
    return this.editingId;
  }
}
