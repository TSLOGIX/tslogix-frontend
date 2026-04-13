// utils/dateUtils.ts
/**
 * Format date string for display - uses UTC to ensure consistent dates across timezones
 * This prevents dates from shifting when users in different timezones view the same data
 * e.g., "2025-10-28T00:00:00.000Z" will display as "Oct 28, 2025" for ALL users
 */
export const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    // Use UTC components to prevent timezone shifts
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

/**
 * Format date and time string in dd-MM-yyyy HH:mm format (UTC)
 * Uses UTC to ensure consistent time display across all timezones
 * e.g., "2025-02-23T14:30:00.000Z" will display as "23-02-2025 14:30" for ALL users
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  // Use UTC components to show the same time to all users regardless of timezone
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
  