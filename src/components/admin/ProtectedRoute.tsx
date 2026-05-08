import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from './AdminLayout';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';
import { getAdminToken, clearAdminToken } from '@/lib/tokenStore';

async function fetchAdminMe() {
  const response = await apiFetch('/api/admin/me');

  if (!response.ok) {
    // Token is invalid or expired — clear it so we don't loop
    clearAdminToken();
    return null;
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
  const { data: user, isLoading } = useQuery({
    queryKey: ['adminMe'],
    queryFn: fetchAdminMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
