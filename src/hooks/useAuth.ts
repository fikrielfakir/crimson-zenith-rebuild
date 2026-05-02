import { useQuery } from "@tanstack/react-query";
import { getUserToken, clearUserToken } from "@/lib/tokenStore";

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
    const headers: Record<string, string> = {};
    const token = getUserToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/auth/user', {
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired — clear it
        clearUserToken();
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
