export function tsToDate(value: any): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'number') {
    return new Date(value);
  }
  if (typeof value === 'object') {
    if (typeof value._seconds === 'number') {
      return new Date(value._seconds * 1000);
    }
    if (typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000);
    }
    if (typeof value.toDate === 'function') {
      return value.toDate();
    }
  }
  return null;
}

export function statusBadgeColor(status: string): string {
  switch (status) {
    case 'Oczekuje na kierowce':
      return 'warning';
    case 'Kierowca przydzielony':
    case 'W drodze':
      return 'tertiary';
    case 'Ładowanie':
      return 'primary';
    case 'Zakończone':
      return 'success';
    default:
      return 'medium';
  }
}

export function roleLabel(role: string | undefined): string {
  switch (role) {
    case 'driver':
      return 'Kierowca';
    case 'operator':
      return 'Operator';
    case 'admin':
      return 'Administrator';
    case 'client':
    default:
      return 'Klient';
  }
}

export function initials(name: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  const letters = parts
    .map((part) => part[0]?.toUpperCase() ?? '')
    .filter((letter) => letter.length > 0);
  if (letters.length === 0) return '?';
  return letters.slice(0, 2).join('');
}
