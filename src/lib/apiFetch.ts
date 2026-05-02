/**
 * Centralized fetch wrapper for all API calls.
 *
 * Priority auth order:
 *  1. Bearer token (Sanctum personal access token) — stored in tokenStore
 *  2. Session cookie fallback (credentials: 'include')
 *  3. XSRF-TOKEN cookie forwarded as X-XSRF-TOKEN for non-GET requests
 */

import { getAdminToken } from './tokenStore';

function getXsrfToken(): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='));
  if (!match) return null;
  try {
    return decodeURIComponent(match.split('=')[1]);
  } catch {
    return null;
  }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase();

  const headers = new Headers(options.headers ?? {});

  // 1. Bearer token auth (takes priority — stateless, works without sessions)
  const token = getAdminToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 2. Always include session cookies as well (belt-and-suspenders)
  const init: RequestInit = {
    ...options,
    credentials: 'include',
    headers,
  };

  // 3. Forward XSRF token for state-mutating requests
  if (method !== 'GET' && method !== 'HEAD') {
    const xsrf = getXsrfToken();
    if (xsrf) {
      headers.set('X-XSRF-TOKEN', xsrf);
    }
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }

  // Default Content-Type for JSON bodies
  if (
    options.body &&
    typeof options.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, init);
}
