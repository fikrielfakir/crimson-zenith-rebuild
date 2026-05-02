/**
 * Simple in-memory + sessionStorage token store for the admin Bearer token.
 *
 * - sessionStorage persists across page refreshes but NOT across tabs/windows
 * - In-memory variable gives synchronous access without parsing storage each time
 */

const STORAGE_KEY = 'admin_access_token';

let _token: string | null = null;

export function getAdminToken(): string | null {
  if (_token) return _token;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) _token = stored;
  } catch {
    // sessionStorage unavailable (private browsing edge case)
  }
  return _token;
}

export function setAdminToken(token: string): void {
  _token = token;
  try {
    sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function clearAdminToken(): void {
  _token = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
