/**
 * Centralized fetch wrapper for all API calls.
 *
 * In development: relative paths (/api/...) are proxied by Vite → Laravel API
 * In production:  paths are prefixed with VITE_API_BASE_URL automatically
 *
 * Priority auth order:
 *  1. Bearer token (Sanctum personal access token) — stored in tokenStore
 *  2. Session cookie fallback (credentials: 'include')
 *  3. XSRF-TOKEN cookie forwarded as X-XSRF-TOKEN for non-GET requests
 */

import { getActiveToken } from './tokenStore';

/** Base URL of the API — empty in dev (Vite proxy handles it), absolute in production */
const API_BASE: string = (import.meta.env.VITE_API_BASE_URL as string) ?? '';

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

/**
 * Resolves a path to its full URL.
 * In dev (API_BASE = ''), returns the path unchanged — Vite proxies it.
 * In production, prepends the API base URL to relative paths.
 */
function resolveUrl(url: string): string {
  if (!API_BASE || !url.startsWith('/')) return url;
  return `${API_BASE}${url}`;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const fullUrl = resolveUrl(url);
  const method = (options.method ?? 'GET').toUpperCase();

  const headers = new Headers(options.headers ?? {});

  // 1. Bearer token — admin token takes priority, falls back to user token
  const token = getActiveToken();
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

  return fetch(fullUrl, init);
}

/**
 * Resolve a media asset ID to a URL via the API proxy.
 * Always use this instead of constructing media URLs manually.
 *
 * @example
 *   <img src={getMediaUrl(settings.backgroundImageId) ?? '/placeholder.jpg'} />
 */
export function getMediaUrl(id: number | null | undefined): string | null {
  if (!id) return null;
  return resolveUrl(`/api/media/${id}`);
}

/**
 * UUID filename pattern — matches bare filenames like
 * "bf407dc3-65e2-4550-870c-0d5c087a67e0.png" stored without a path prefix.
 */
const UUID_FILE_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;

/**
 * Resolve a server-side asset URL to its full form.
 *
 * Handles all cases where the browser cannot load the file by itself:
 *   /storage/…     — Laravel disk storage (new uploads)
 *   /uploads/…     — Laravel public/uploads (legacy uploads)
 *   uuid.ext       — bare UUID filename → treated as /storage/media/uuid.ext
 *
 * Already-absolute URLs (http/https) are returned unchanged.
 * In dev (VITE_API_BASE_URL = ''), Vite proxies paths to the right server so
 * relative URLs work fine without any prefix.
 *
 * @example
 *   <img src={resolveStorageUrl(club.imageUrl) ?? '/placeholder.jpg'} />
 */
export function resolveStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/storage/') || url.startsWith('/uploads/')) {
    return API_BASE ? `${API_BASE}${url}` : url;
  }
  if (UUID_FILE_RE.test(url)) {
    const path = `/storage/media/${url}`;
    return API_BASE ? `${API_BASE}${path}` : path;
  }
  return url;
}
