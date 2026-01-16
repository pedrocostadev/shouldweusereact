export function formatDate(dateString) {
  const relative = getRelativeDate(dateString);
  if (relative) return relative;
  
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getRelativeDate(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString + 'T00:00:00');
  date.setHours(0, 0, 0, 0);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  
  return null;
}

export function isOverdue(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString + 'T00:00:00');
  date.setHours(0, 0, 0, 0);
  
  return date < today;
}

export function isUpcoming(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString + 'T00:00:00');
  date.setHours(0, 0, 0, 0);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= 3;
}
