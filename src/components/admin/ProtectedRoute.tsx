import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from './AdminLayout';
import { BackendOfflinePage } from './BackendOfflinePage';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';
import { getAdminToken, clearAdminToken } from '@/lib/tokenStore';
import { useCallback } from 'react';

// Return value shape — null means "not authenticated", throws on network error
async function fetchAdminMe() {
  let response: Response;
  try {
    response = await apiFetch('/api/admin/me');
  } catch (err) {
    // Network error (no internet, server down, etc.) — re-throw so useQuery
    // sets isError=true and we can show the offline page instead of redirecting.
    throw err;
  }

  if (response.status === 401 || response.status === 403) {
    // Token is invalid or expired — clear it
    clearAdminToken();
    return null;
  }

  if (!response.ok) {
    // 5xx or unexpected error — also treat as network problem
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasToken = Boolean(getAdminToken());

  if (!hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <TokenValidatedRoute>{children}</TokenValidatedRoute>;
}

function TokenValidatedRoute({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminMe'],
    queryFn: fetchAdminMe,
    retry: 1,           // one auto-retry before showing error page
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000,
  });

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting to server…</p>
        </div>
      </div>
    );
  }

  // ── Network / server error — show the offline page ─────────────────────────
  if (isError) {
    const msg = (error as Error)?.message ?? '';
    const kind =
      msg.includes('500') || msg.includes('Server error') ? 'server'
      : msg.includes('timeout') || msg.includes('AbortError') ? 'timeout'
      : 'network';

    return (
      <div className="flex h-screen flex-col bg-background">
        {/* Minimal header so the user knows which app this is */}
        <div className="flex h-14 items-center gap-3 border-b px-6 shrink-0">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold select-none">
            JA
          </div>
          <span className="text-sm font-semibold">Journey Admin</span>
        </div>
        <BackendOfflinePage kind={kind} onRetry={handleRetry} />
      </div>
    );
  }

  // ── Not authenticated / not admin — redirect to login ──────────────────────
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  return <AdminLayout>{children}</AdminLayout>;
}
