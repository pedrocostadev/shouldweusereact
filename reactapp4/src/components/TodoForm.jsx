import { useState } from 'react';

export function TodoForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [limitDate, setLimitDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      limitDate,
    });

    setName('');
    setDescription('');
    setLimitDate('');
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
      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  );
}
