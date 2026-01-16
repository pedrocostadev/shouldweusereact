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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
}

export function isToday(dateString) {
  if (!dateString) return false;
  
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  return dateOnly.getTime() === today.getTime();
}

export function isUpcoming(dateString) {
  if (!dateString) return false;
  
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  
  return date > today && date <= threeDaysLater;
}

export function getDateClass(dateString, completed) {
  if (completed) return '';
  if (isToday(dateString)) return 'today';
  if (isOverdue(dateString)) return 'overdue';
  if (isUpcoming(dateString)) return 'upcoming';
  return '';
}
