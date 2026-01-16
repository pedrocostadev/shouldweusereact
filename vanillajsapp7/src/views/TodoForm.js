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
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="submit-btn">Add Todo</button>
          <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">Cancel</button>
        </div>
      </form>
    `
    this.attachEvents()
  }

  attachEvents() {
    const form = this.container.querySelector('#todo-form')
    const cancelBtn = this.container.querySelector('#cancel-btn')

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      
      const nameInput = form.querySelector('#name')
      const descriptionInput = form.querySelector('#description')
      const limitDateInput = form.querySelector('#limitDate')

      nameInput.classList.remove('invalid')
      limitDateInput.classList.remove('invalid')

      let valid = true
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid')
        valid = false
      }
      if (!limitDateInput.value) {
        limitDateInput.classList.add('invalid')
        valid = false
      }

      if (!valid) return

      this.onSubmit({
        name: nameInput.value.trim(),
        description: descriptionInput.value.trim(),
        limitDate: limitDateInput.value
      })

      form.reset()
    })

    cancelBtn.addEventListener('click', () => {
      this.clearEdit()
    })
  }

  setEditMode(todo) {
    this.editingId = todo.id
    const form = this.container.querySelector('#todo-form')
    const submitBtn = this.container.querySelector('#submit-btn')
    const cancelBtn = this.container.querySelector('#cancel-btn')

    form.querySelector('#name').value = todo.name
    form.querySelector('#description').value = todo.description || ''
    form.querySelector('#limitDate').value = todo.limitDate

    submitBtn.textContent = 'Update Todo'
    cancelBtn.style.display = 'inline-block'
  }

  clearEdit() {
    this.editingId = null
    const form = this.container.querySelector('#todo-form')
    const submitBtn = this.container.querySelector('#submit-btn')
    const cancelBtn = this.container.querySelector('#cancel-btn')

    form.reset()
    submitBtn.textContent = 'Add Todo'
    cancelBtn.style.display = 'none'
  }
}
