import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/lib/apiFetch';

export type BackendStatus = 'checking' | 'online' | 'offline' | 'server-error' | 'timeout';

const POLL_INTERVAL_MS  = 30_000;  // re-check every 30 s when online
const RETRY_INTERVAL_MS =  5_000;  // re-check every 5 s when offline
const FETCH_TIMEOUT_MS  =  5_000;  // consider timed-out after 5 s (was 8 s)
const FAIL_THRESHOLD    = 1;       // show error on first failure (was 2)

export function useBackendHealth() {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const [retrying, setRetrying] = useState(false);
  const failures = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = useCallback(async () => {
    setRetrying(true);
    try {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await apiFetch('/api/admin/me', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403 || res.ok) {
        // 401/403 → backend reachable but auth denied; ok → fully online
        failures.current = 0;
        setStatus('online');
      } else if (res.status >= 500) {
        failures.current += 1;
        if (failures.current >= FAIL_THRESHOLD) setStatus('server-error');
      } else {
        // other 4xx → backend alive
        failures.current = 0;
        setStatus('online');
      }
    } catch (err: any) {
      failures.current += 1;
      if (failures.current >= FAIL_THRESHOLD) {
        setStatus(err?.name === 'AbortError' ? 'timeout' : 'offline');
      }
    } finally {
      setRetrying(false);
    }
  }, []);

  // Schedule next poll based on current status
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const interval =
      status === 'online' || status === 'checking'
        ? POLL_INTERVAL_MS
        : RETRY_INTERVAL_MS;
    timerRef.current = setTimeout(check, interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [status, check]);

  // Initial check on mount
  useEffect(() => { check(); }, [check]);

  const retry = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    failures.current = 0; // reset so a single success brings it back online
    check();
  }, [check]);

  const isOffline = status === 'offline' || status === 'server-error' || status === 'timeout';

  return { status, isOffline, retrying, retry };
}
