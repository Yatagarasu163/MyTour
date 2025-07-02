/**
 * Returns a human-readable relative time string.
 * Examples: "just now", "2 minutes ago", "3 days ago"
 */
export function getRelativeTime(pastDate) {
  const now = Date.now();
  const then = new Date(pastDate).getTime();
  const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSeconds < 1) return 'just now';
  if (diffSeconds === 1) return '1 second ago';
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}