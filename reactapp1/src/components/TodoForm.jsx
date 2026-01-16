import { useState } from 'react';

export function TodoForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [limitDate, setLimitDate] = useState(initialData?.limitDate || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim(), limitDate });
    if (!initialData) {
      setName('');
      setDescription('');
      setLimitDate('');
    }
    setError('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter todo name"
        />
        {error && <span className="error">{error}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          rows={3}
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
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Save' : 'Add Todo'}
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
