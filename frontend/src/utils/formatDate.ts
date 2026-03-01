/**
 * Formats a date string into a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

/**
 * Formats a time string into a readable format
 * @param timeString - The time string to format
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  try {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    return timeString;
  }
}

/**
 * Converts minutes to hours and minutes format
 * @param minutes - The duration in minutes
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
}

/**
 * Formats a timestamp (nanoseconds) into a readable date and time
 * @param timestamp - The timestamp in nanoseconds
 * @returns Formatted date and time string
 */
export function formatTimestamp(timestamp: number): string {
  try {
    const date = new Date(Number(timestamp) / 1_000_000); // Convert nanoseconds to milliseconds
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return 'Invalid date';
  }
}
