export class TodoForm {
  constructor(container, { onSubmit }) {
    this.container = container
    this.onSubmit = onSubmit
    this.editingId = null
    this.render()
  }

  render() {
    this.container.innerHTML = `
      <form class="todo-form" id="todo-form">
        <div class="form-group">
          <label for="name">Name *</label>
          <input type="text" id="name" name="name" required placeholder="Enter todo name">
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" placeholder="Enter description (optional)"></textarea>
        </div>
        <div class="form-group">
          <label for="limitDate">Due Date *</label>
          <input type="date" id="limitDate" name="limitDate" required>
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn btn-primary" id="submit-btn">Add Todo</button>
          <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">Cancel</button>
        </div>
      </form>
    `

    this.form = document.getElementById('todo-form')
    this.nameInput = document.getElementById('name')
    this.descriptionInput = document.getElementById('description')
    this.limitDateInput = document.getElementById('limitDate')
    this.submitBtn = document.getElementById('submit-btn')
    this.cancelBtn = document.getElementById('cancel-btn')

    this.form.addEventListener('submit', (e) => this.handleSubmit(e))
    this.cancelBtn.addEventListener('click', () => this.clearEdit())
  }

  handleSubmit(e) {
    e.preventDefault()
    
    const name = this.nameInput.value.trim()
    const description = this.descriptionInput.value.trim()
    const limitDate = this.limitDateInput.value

    if (!name) {
      this.nameInput.classList.add('error')
      return
    }
    this.nameInput.classList.remove('error')

    if (!limitDate) {
      this.limitDateInput.classList.add('error')
      return
    }
    this.limitDateInput.classList.remove('error')

    this.onSubmit({ name, description, limitDate })
    this.form.reset()
  }

  setEditMode(todo) {
    this.editingId = todo.id
    this.nameInput.value = todo.name
    this.descriptionInput.value = todo.description || ''
    this.limitDateInput.value = todo.limitDate
    this.submitBtn.textContent = 'Update Todo'
    this.cancelBtn.style.display = 'inline-block'
    this.nameInput.focus()
  }

  clearEdit() {
    this.editingId = null
    this.form.reset()
    this.submitBtn.textContent = 'Add Todo'
    this.cancelBtn.style.display = 'none'
  }
}
