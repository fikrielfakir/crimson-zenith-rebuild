import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  interests: string[] | null;
  isAdmin: boolean;
  role: 'user' | 'member' | 'admin';
}

async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  } catch (error) {
    console.error('Auth fetch error:', error);
    return null;
  }
}

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = !!user;
  const isMember = user?.role === 'member' || user?.role === 'admin' || user?.isAdmin;
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  return {
    user,
    isLoading,
    isAuthenticated,
    isMember,
    isAdmin,
    refetch,
  };
}
