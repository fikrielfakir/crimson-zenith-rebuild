import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from './AdminLayout';
import { BackendOfflinePage } from './BackendOfflinePage';
import { Loader2, ShieldOff } from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';
import { getAdminToken, clearAdminToken } from '@/lib/tokenStore';
import { useCallback } from 'react';
import { canAccessRoute, getDefaultRoute, STAFF_ROLES, ADMIN_ROLE_META, type AdminRole } from '@/lib/adminPermissions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

async function fetchAdminMe() {
  let response: Response;
  try {
    response = await apiFetch('/api/admin/me');
  } catch (err) {
    throw err;
  }

  if (response.status === 401 || response.status === 403) {
    clearAdminToken();
    return null;
  }

  if (!response.ok) {
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
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminMe'],
    queryFn: fetchAdminMe,
    retry: 1,
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000,
  });

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);

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

  if (isError) {
    const msg = (error as Error)?.message ?? '';
    const kind =
      msg.includes('500') || msg.includes('Server error') ? 'server'
      : msg.includes('timeout') || msg.includes('AbortError') ? 'timeout'
      : 'network';

    return (
      <div className="flex h-screen flex-col bg-background">
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

  const hasValidRole = user && (user.isAdmin || STAFF_ROLES.includes(user.role));

  if (!user || !hasValidRole) {
    return <Navigate to="/admin/login" replace />;
  }

  const role: AdminRole = STAFF_ROLES.includes(user.role) ? user.role : 'admin';

  if (!canAccessRoute(location.pathname, role)) {
    const meta = ADMIN_ROLE_META[role];
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldOff className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Access Restricted</h1>
            <p className="text-muted-foreground max-w-md">
              Your role <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mx-1 ${meta.colorClass}`}>{meta.label}</span>
              does not have permission to view this page.
            </p>
          </div>
          <Button onClick={() => navigate(getDefaultRoute(role))} variant="outline">
            {role === 'club_manager' ? 'Go to My Clubs' : role === 'event_organizer' ? 'Go to Events' : 'Go to Dashboard'}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
