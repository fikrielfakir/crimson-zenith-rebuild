import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

interface UseAdminCRUDOptions<T> {
  /**
   * Endpoint used for GET (list). May be the public CMS endpoint or the admin
   * endpoint — intentional split so admin list pages can show all records while
   * the public site sees only active/approved ones.
   * e.g. '/api/admin/cms/team-members' (admin, shows all)
   *   or '/api/cms/team-members' (public, shows active only)
   */
  readEndpoint: string;
  /**
   * Base admin endpoint used for POST (create), PUT /{id} (update), and
   * DELETE /{id} (remove). Always an admin-protected route.
   * e.g. '/api/admin/cms/team-members'
   */
  writeEndpoint: string;
  /** React Query cache key */
  queryKey: readonly unknown[];
  /** Toast messages (optional overrides) */
  messages?: {
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  };
}

interface AdminCRUD<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  create: (payload: Omit<T, 'id'>) => Promise<T>;
  update: (id: number, payload: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  refetch: () => void;
}

export function useAdminCRUD<T extends { id: number }>({
  readEndpoint,
  writeEndpoint,
  queryKey,
  messages = {},
}: UseAdminCRUDOptions<T>): AdminCRUD<T> {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const { data = [], isLoading, isError, refetch } = useQuery<T[]>({
    queryKey,
    queryFn: async () => {
      const res = await apiFetch(readEndpoint);
      if (!res.ok) throw new Error(`Failed to fetch from ${readEndpoint}`);
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<T, 'id'>): Promise<T> => {
      const res = await apiFetch(writeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? 'Create failed');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      toast({ title: messages.created ?? 'Created successfully' });
    },
    onError: (e: Error) =>
      toast({ title: messages.error ?? 'Error', description: e.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<T> }): Promise<T> => {
      const res = await apiFetch(`${writeEndpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? 'Update failed');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      toast({ title: messages.updated ?? 'Updated successfully' });
    },
    onError: (e: Error) =>
      toast({ title: messages.error ?? 'Error', description: e.message, variant: 'destructive' }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await apiFetch(`${writeEndpoint}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? 'Delete failed');
      }
    },
    onSuccess: () => {
      invalidate();
      toast({ title: messages.deleted ?? 'Deleted successfully' });
    },
    onError: (e: Error) =>
      toast({ title: messages.error ?? 'Error', description: e.message, variant: 'destructive' }),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
    create: (payload) => createMutation.mutateAsync(payload),
    update: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    remove: (id) => removeMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
