/** Returns today's date as "yyyy-MM-dd", matching what the backend DateOnly expects. */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Converts a "HH:mm:ss" (or "HH:mm") TimeSpan string into a readable 12-hour label, e.g. "2:30 PM". */
export function formatTimeLabel(time: string): string {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHour}:${displayMinutes} ${period}`;
}

/** Formats a "yyyy-MM-dd" date string as "Mon, Aug 20" for display. */
export function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
