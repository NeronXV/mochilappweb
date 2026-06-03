export function formatDate(value: string | Date | number, locale: string = 'es-MX'): string {
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
  return date.toLocaleDateString(locale);
}

export function formatTime(value: string | Date | number, locale: string = 'es'): string {
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}
