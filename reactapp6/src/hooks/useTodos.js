import { useState, useEffect } from 'react'
import { getTodos, saveTodos } from '../services/localStorage'

export function useTodos() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const loadedTodos = getTodos()
    setTodos(loadedTodos)
  }, [])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = ({ name, description, limitDate }) => {
    const newTodo = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      description: description || null,
      limitDate,
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTodos(prev => [...prev, newTodo])
  }

  const updateTodo = (id, updates) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete
  }
}
