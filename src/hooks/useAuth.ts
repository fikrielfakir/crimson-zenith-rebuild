import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const demoAuth = typeof window !== 'undefined' && localStorage.getItem('userAuth') === 'authenticated';
  const demoEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  const isAuthenticated = !!user || demoAuth;
  const effectiveUser = user || (demoAuth ? { email: demoEmail, firstName: 'Demo', lastName: 'User' } : null);

  return {
    user: effectiveUser,
    isLoading,
    isAuthenticated,
  };
}