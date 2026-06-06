/**
 * Token store for HMAC Bearer tokens.
 *
 * Admin token  — sessionStorage  (cleared when browser tab closes)
 * User token   — localStorage    (persistent across sessions)
 */

const ADMIN_KEY = 'admin_access_token';
const USER_KEY  = 'user_access_token';

// ── Admin token ──────────────────────────────────────────────────────────────

let _adminToken: string | null = null;

export function getAdminToken(): string | null {
  if (_adminToken) return _adminToken;
  try {
    const stored = sessionStorage.getItem(ADMIN_KEY);
    if (stored) _adminToken = stored;
  } catch { /* sessionStorage unavailable */ }
  return _adminToken;
}

export function setAdminToken(token: string): void {
  _adminToken = token;
  try { sessionStorage.setItem(ADMIN_KEY, token); } catch { /* ignore */ }
}

export function clearAdminToken(): void {
  _adminToken = null;
  try { sessionStorage.removeItem(ADMIN_KEY); } catch { /* ignore */ }
}

// ── User token ───────────────────────────────────────────────────────────────

let _userToken: string | null = null;

export function getUserToken(): string | null {
  if (_userToken) return _userToken;
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) _userToken = stored;
  } catch { /* localStorage unavailable */ }
  return _userToken;
}

export function setUserToken(token: string): void {
  _userToken = token;
  try { localStorage.setItem(USER_KEY, token); } catch { /* ignore */ }
}

export function clearUserToken(): void {
  _userToken = null;
  try { localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the active Bearer token — admin takes priority over user. */
export function getActiveToken(): string | null {
  return getAdminToken() ?? getUserToken();
}
