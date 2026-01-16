export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) {
    return 'Today';
  }
  
  if (dateOnly.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRelativeDate(dateString) {
  return formatDate(dateString);
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
}

export function isUpcoming(dateString) {
  if (!dateString) return false;
  
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  return date >= today && date <= threeDaysFromNow;
}
