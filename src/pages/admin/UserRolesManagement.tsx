import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
  Shield, Users, Settings, Search,
  ChevronDown, ChevronUp, Loader2, User,
  FileText, Building,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RoleDef {
  key: string;
  label: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  admin:           'bg-red-100 text-red-700 border-red-200',
  moderator:       'bg-orange-100 text-orange-700 border-orange-200',
  club_manager:    'bg-blue-100 text-blue-700 border-blue-200',
  event_organizer: 'bg-purple-100 text-purple-700 border-purple-200',
  user:            'bg-gray-100 text-gray-600 border-gray-200',
};

const ROLE_BADGE_VARIANT: Record<string, 'destructive' | 'default' | 'secondary' | 'outline'> = {
  admin:           'destructive',
  moderator:       'default',
  club_manager:    'default',
  event_organizer: 'secondary',
  user:            'outline',
};

function RoleBadge({ role, label }: { role: string; label?: string }) {
  const cls = ROLE_COLORS[role] ?? ROLE_COLORS.user;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label ?? role}
    </span>
  );
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────
async function fetchRoles(): Promise<{ roles: RoleDef[]; totalUsers: number; totalPermissions: number }> {
  const res = await apiFetch('/api/admin/roles', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load roles');
  return res.json();
}

async function fetchAllUsers(search: string, roleFilter: string): Promise<{ users: UserRow[] }> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (roleFilter) params.set('role', roleFilter);
  const res = await apiFetch(`/api/admin/roles/users?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

// ─── Permissions matrix (all available permissions) ───────────────────────────
const ALL_PERMISSIONS = [
  { key: 'users.manage',        label: 'Manage Users' },
  { key: 'clubs.manage',        label: 'Manage Clubs' },
  { key: 'clubs.edit',          label: 'Edit Clubs' },
  { key: 'clubs.join',          label: 'Join Clubs' },
  { key: 'events.manage',       label: 'Manage Events' },
  { key: 'events.create',       label: 'Create Events' },
  { key: 'events.edit',         label: 'Edit Events' },
  { key: 'events.book',         label: 'Book Events' },
  { key: 'content.manage',      label: 'Manage Content' },
  { key: 'settings.manage',     label: 'Manage Settings' },
  { key: 'applications.manage', label: 'Manage Applications' },
  { key: 'applications.review', label: 'Review Applications' },
  { key: 'members.view',        label: 'View Members' },
  { key: 'profile.edit',        label: 'Edit Profile' },
];

// ─── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({ role, expanded, onToggle }: { role: RoleDef; expanded: boolean; onToggle: () => void }) {
  const colorCls = ROLE_COLORS[role.key] ?? ROLE_COLORS.user;
  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 w-full ${colorCls.split(' ')[0]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`h-5 w-5 ${colorCls.split(' ')[1]}`} />
            <CardTitle className="text-base">{role.label}</CardTitle>
          </div>
          <RoleBadge role={role.key} label={`${role.userCount} users`} />
        </div>
        <CardDescription className="text-xs mt-1">{role.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Permissions ({role.permissions.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {(expanded ? role.permissions : role.permissions.slice(0, 3)).map(p => (
              <Badge key={p} variant="outline" className="text-xs font-normal">
                {ALL_PERMISSIONS.find(a => a.key === p)?.label ?? p}
              </Badge>
            ))}
            {!expanded && role.permissions.length > 3 && (
              <button
                onClick={onToggle}
                className="text-xs text-primary font-medium hover:underline"
              >
                +{role.permissions.length - 3} more
              </button>
            )}
          </div>
        </div>
        {role.permissions.length > 3 && (
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? 'Show less' : 'Show all'}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Permissions Matrix ───────────────────────────────────────────────────────
function PermissionsMatrix({ roles }: { roles: RoleDef[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Permissions Matrix</CardTitle>
        <CardDescription>Which roles have which permissions</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground min-w-[160px]">Permission</th>
              {roles.map(r => (
                <th key={r.key} className="text-center py-3 px-3 font-medium min-w-[120px]">
                  <RoleBadge role={r.key} label={r.label} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((perm, i) => {
              const anyHas = roles.some(r => r.permissions.includes(perm.key));
              if (!anyHas) return null;
              return (
                <tr key={perm.key} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                  <td className="py-2.5 px-4 text-sm text-foreground font-medium">{perm.label}</td>
                  {roles.map(r => (
                    <td key={r.key} className="py-2.5 px-3 text-center">
                      {r.permissions.includes(perm.key) ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-300">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── User Assignment Tab ──────────────────────────────────────────────────────
function UserAssignment({ roles }: { roles: RoleDef[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['roles-users', search, roleFilter],
    queryFn: () => fetchAllUsers(search, roleFilter),
    staleTime: 30_000,
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? 'Failed to update role');
      }
      return res.json();
    },
    onSuccess: (_, { userId }) => {
      toast({ title: 'Role updated successfully' });
      setPendingRoles(p => { const n = { ...p }; delete n[userId]; return n; });
      queryClient.invalidateQueries({ queryKey: ['roles-users'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: any) => {
      toast({ title: 'Failed to update role', description: err.message, variant: 'destructive' });
    },
  });

  const users = data?.users ?? [];

  const getRoleLabel = (key: string) => roles.find(r => r.key === key)?.label ?? key;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All roles</SelectItem>
            {roles.map(r => (
              <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading users…
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => {
                  const selectedRole = pendingRoles[u.id] ?? u.role ?? 'user';
                  const isDirty = selectedRole !== (u.role ?? 'user');
                  const isSaving = updateRole.isPending && updateRole.variables?.userId === u.id;

                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={u.role ?? 'user'} label={getRoleLabel(u.role ?? 'user')} />
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.is_active ? 'default' : 'secondary'}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={selectedRole}
                            onValueChange={val =>
                              setPendingRoles(p => ({ ...p, [u.id]: val }))
                            }
                            disabled={isSaving}
                          >
                            <SelectTrigger className="w-44 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map(r => (
                                <SelectItem key={r.key} value={r.key} className="text-xs">
                                  {r.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            disabled={!isDirty || isSaving}
                            onClick={() => updateRole.mutate({ userId: u.id, role: selectedRole })}
                          >
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserRolesManagement() {
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 60_000,
  });

  const roles = data?.roles ?? [];
  const totalUsers = data?.totalUsers ?? 0;
  const totalPermissions = data?.totalPermissions ?? 0;
  const adminCount = roles.find(r => r.key === 'admin')?.userCount ?? 0;

  const toggleExpanded = (key: string) =>
    setExpandedRoles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">Manage user roles and their access permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              All Users
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/applications">
              <FileText className="mr-2 h-4 w-4" />
              Applications
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/clubs">
              <Building className="mr-2 h-4 w-4" />
              Clubs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : roles.length}</div>
            <p className="text-xs text-muted-foreground">Defined in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : totalUsers}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : adminCount}</div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : totalPermissions}</div>
            <p className="text-xs text-muted-foreground">Unique permissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Roles Overview</TabsTrigger>
          <TabsTrigger value="matrix">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="users">User Assignment</TabsTrigger>
        </TabsList>

        {/* ── Roles Overview ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading roles…
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map(role => (
                <RoleCard
                  key={role.key}
                  role={role}
                  expanded={!!expandedRoles[role.key]}
                  onToggle={() => toggleExpanded(role.key)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Permissions Matrix ─────────────────────────────────────────── */}
        <TabsContent value="matrix" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : (
            <PermissionsMatrix roles={roles} />
          )}
        </TabsContent>

        {/* ── User Assignment ────────────────────────────────────────────── */}
        <TabsContent value="users" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : (
            <UserAssignment roles={roles} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
