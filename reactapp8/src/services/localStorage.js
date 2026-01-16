const STORAGE_KEY = 'todos-app-data'

export function getTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}
