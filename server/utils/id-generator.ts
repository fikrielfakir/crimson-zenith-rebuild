/**
 * Generate a unique ID for database records
 * Format: event-{timestamp}-{random}
 * Example: event-1732115234567-abc123def
 */
export function generateEventId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `event-${timestamp}-${random}`;
}

/**
 * Generate a prefixed ID with custom prefix
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${timestamp}-${random}`;
}
