import { createTodoItem } from './TodoItem.js'

export class TodoList {
  constructor(container, { onEdit, onDelete, onToggleComplete }) {
    this.container = container
    this.onEdit = onEdit
    this.onDelete = onDelete
    this.onToggleComplete = onToggleComplete
    this.render([])
  }

  render(todos) {
    this.container.innerHTML = ''

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
      const item = createTodoItem(todo, {
        onEdit: this.onEdit,
        onDelete: this.onDelete,
        onToggleComplete: this.onToggleComplete
      })
      list.appendChild(item)
    })

    this.container.appendChild(list)
  }
}
