import { useState } from 'react';

export default function TodoForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [limitDate, setLimitDate] = useState(initialData?.limitDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      limitDate,
    });

    if (!initialData) {
      setName('');
      setDescription('');
      setLimitDate('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Task Name *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
        />
      </div>
      <div className="form-group">
        <label htmlFor="limitDate">Due Date</label>
        <input
          type="date"
          id="limitDate"
          value={limitDate}
          onChange={(e) => setLimitDate(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
