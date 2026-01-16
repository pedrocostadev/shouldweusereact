import { createTodoItem } from './TodoItem.js'

export class TodoList {
  constructor(container, { onEdit, onDelete, onToggleComplete }) {
    this.container = container
    this.onEdit = onEdit
    this.onDelete = onDelete
    this.onToggleComplete = onToggleComplete
    this.setupEventDelegation()
  }

  setupEventDelegation() {
    this.container.addEventListener('click', (e) => {
      const todoItem = e.target.closest('.todo-item')
      if (!todoItem) return

      const id = todoItem.dataset.id

      if (e.target.classList.contains('btn-edit')) {
        this.onEdit(id)
      } else if (e.target.classList.contains('btn-danger')) {
        this.onDelete(id)
      }
    })

    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('todo-checkbox')) {
        const todoItem = e.target.closest('.todo-item')
        if (todoItem) {
          this.onToggleComplete(todoItem.dataset.id)
        }
      }
    })
  }

  render(todos) {
    if (todos.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      `
      return
    }

    const list = document.createElement('div')
    list.className = 'todo-list'

    todos.forEach(todo => {
      list.appendChild(createTodoItem(todo))
    })

    this.container.innerHTML = ''
    this.container.appendChild(list)
  }
}
