import { useQueryClient } from '@tanstack/react-query';
import type { AdminRole } from '@/lib/adminPermissions';
import { STAFF_ROLES } from '@/lib/adminPermissions';

/** Returns the current admin's role from the cached /api/admin/me response. */
export function useAdminRole(): AdminRole {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<any>(['adminMe']);
  const role = user?.role as AdminRole | undefined;
  if (role && STAFF_ROLES.includes(role)) return role;
  return 'admin';
}

/** Returns the full cached admin user object. */
export function useAdminUser(): {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  role: AdminRole;
} | null {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<any>(['adminMe']) ?? null;
}
