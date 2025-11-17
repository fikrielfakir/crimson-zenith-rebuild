import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from './AdminLayout';
import { Loader2 } from 'lucide-react';

async function fetchCurrentUser() {
  const response = await fetch('/api/user', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
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

  if (error || !user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
