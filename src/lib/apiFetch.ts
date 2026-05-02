/**
 * Centralized fetch wrapper for all API calls.
 *
 * - Always sends session cookies (credentials: 'include')
 * - Reads the XSRF-TOKEN cookie set by Sanctum and forwards it
 *   as the X-XSRF-TOKEN header on every non-GET request so that
 *   Laravel's CSRF middleware accepts the request.
 */

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

  // Always include credentials (session cookie)
  const init: RequestInit = {
    ...options,
    credentials: 'include',
    headers,
  };

  // Attach XSRF token for state-mutating requests
  if (method !== 'GET' && method !== 'HEAD') {
    const token = getXsrfToken();
    if (token) {
      headers.set('X-XSRF-TOKEN', token);
    }
    // Mark as XHR so Laravel/Sanctum treats it as an API call
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
