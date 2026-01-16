import { useState, useEffect } from 'react';
import { getTodos, saveTodos } from '../services/localStorage';

export function useTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadedTodos = getTodos();
    setTodos(loadedTodos);
  }, []);

  useEffect(() => {
    if (todos.length > 0 || getTodos().length > 0) {
      saveTodos(todos);
    }
  }, [todos]);

  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now().toString(),
      name: todo.name,
      description: todo.description || null,
      limitDate: todo.limitDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const updateTodo = (id, updates) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
}
