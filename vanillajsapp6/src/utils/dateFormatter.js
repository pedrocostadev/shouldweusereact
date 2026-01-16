export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getRelativeDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  }
  if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return 'Tomorrow';
  }
  return formatDate(dateString);
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function isUpcoming(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  threeDaysFromNow.setHours(0, 0, 0, 0);
  
  return date >= today && date <= threeDaysFromNow;
}
