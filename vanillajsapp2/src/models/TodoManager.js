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
    this.listeners.forEach(cb => cb([...this.todos]));
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
      : Date.now().toString(36) + Math.random().toString(36).substr(2);
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
    this.todos.unshift(todo);
    this.persistTodos();
    this.notify();
    return todo;
  }

  updateTodo(id, updates) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.todos[index] = { ...this.todos[index], ...updates };
    this.persistTodos();
    this.notify();
    return this.todos[index];
  }

  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.todos.splice(index, 1);
    this.persistTodos();
    this.notify();
    return true;
  }

  getTodos() {
    return [...this.todos];
  }

  getTodoById(id) {
    return this.todos.find(t => t.id === id) || null;
  }
}
