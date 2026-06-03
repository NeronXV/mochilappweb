export function getBookingStatusLabel(status: string): string {
  if (status === 'PAID' || status === 'Completado') return 'Liquidado';
  if (status === 'CANCELLED') return 'Cancelado';
  return 'Pendiente';
}

export function getBookingStatusColorClasses(status: string): { dot: string; text: string } {
  if (status === 'PAID' || status === 'Completado') {
    return { dot: 'bg-emerald-500', text: 'text-emerald-700' };
  }
  if (status === 'CANCELLED') {
    return { dot: 'bg-rose-500', text: 'text-rose-700' };
  }
  return { dot: 'bg-amber-400 animate-pulse', text: 'text-amber-700' };
}

export function isPaidBooking(status: string): boolean {
  return status === 'PAID' || status === 'Completado';
}
