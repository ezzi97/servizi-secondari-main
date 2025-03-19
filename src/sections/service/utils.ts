export const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/^\w/, (c) => c.toUpperCase());
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  if (!time) return '';
  const [hours, mins] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(mins, 10) + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}; 