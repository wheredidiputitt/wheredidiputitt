export function formatRelativeTime(isoString: string): string {
  try {
    const past = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - past.getTime();
    
    if (isNaN(diffMs) || diffMs < 0) {
      return 'Just now';
    }

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;

    // Standard date format fallback if more than 30 days
    return past.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch (e) {
    return 'Recently';
  }
}
