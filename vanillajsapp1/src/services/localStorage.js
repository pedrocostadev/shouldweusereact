const STORAGE_KEY = 'vanillajsapp1_todos';

export function getTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}
