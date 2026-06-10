import { useTranslation } from 'react-i18next';
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
  Loader2, User, FileText, Building,
  LayoutDashboard, CalendarDays, BookOpen,
  Image, Globe, BarChart3, Mail, Lock,
  Check, X, MapPin, Newspaper,
} from 'lucide-react';
import { NAV_ROLES, ROUTE_ROLES, type AdminRole } from '@/lib/adminPermissions';

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

// ─── Admin Section Definitions ────────────────────────────────────────────────
// Maps actual nav/route keys to display info
const ADMIN_SECTIONS = [
  { key: 'admin.nav.dashboard',     label: 'Dashboard',          icon: LayoutDashboard, route: '/admin' },
  { key: 'admin.nav.users',         label: 'User Management',    icon: Users,            route: '/admin/users' },
  { key: 'admin.nav.clubs',         label: 'Clubs',              icon: Building,         route: '/admin/clubs' },
  { key: 'admin.nav.events',        label: 'Events',             icon: CalendarDays,     route: '/admin/events' },
  { key: 'admin.nav.bookings',      label: 'Bookings',           icon: BookOpen,         route: '/admin/bookings' },
  { key: 'admin.nav.applications',  label: 'Applications',       icon: FileText,         route: '/admin/applications' },
  { key: 'admin.nav.content',       label: 'Blog / Content',     icon: Newspaper,        route: '/admin/news' },
  { key: 'admin.nav.cities',        label: 'Cities',             icon: MapPin,           route: '/admin/cities' },
  { key: 'admin.nav.analytics',     label: 'Analytics',          icon: BarChart3,        route: '/admin/analytics' },
  { key: 'admin.nav.customization', label: 'CMS & Landing',      icon: Globe,            route: '/admin/cms' },
  { key: 'admin.nav.contactInbox',  label: 'Contact Inbox',      icon: Mail,             route: '/admin/contact-submissions' },
  { key: 'admin.nav.translations',  label: 'Translations',       icon: Globe,            route: '/admin/translations' },
  { key: 'admin.nav.settings',      label: 'Settings',           icon: Settings,         route: '/admin/settings' },
  { key: 'admin.nav.system',        label: 'System / Security',  icon: Lock,             route: '/admin/system' },
] as const;

const ROLES_ORDER: AdminRole[] = ['admin', 'moderator', 'club_manager', 'event_organizer'];

// ─── Role color helpers ───────────────────────────────────────────────────────
const ROLE_STYLES: Record<string, { bar: string; icon: string; badge: string; header: string }> = {
  admin:           { bar: 'bg-red-500',    icon: 'text-red-600',    badge: 'bg-red-100 text-red-700 border-red-200',       header: 'from-red-50' },
  moderator:       { bar: 'bg-orange-500', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200', header: 'from-orange-50' },
  club_manager:    { bar: 'bg-blue-500',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700 border-blue-200',    header: 'from-blue-50' },
  event_organizer: { bar: 'bg-purple-500', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700 border-purple-200', header: 'from-purple-50' },
  user:            { bar: 'bg-gray-400',   icon: 'text-gray-500',   badge: 'bg-gray-100 text-gray-600 border-gray-200',    header: 'from-gray-50' },
};

function RoleBadge({ role, label }: { role: string; label?: string }) {
  const s = ROLE_STYLES[role] ?? ROLE_STYLES.user;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.badge}`}>
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
  if (roleFilter && roleFilter !== 'all') params.set('role', roleFilter);
  const res = await apiFetch(`/api/admin/roles/users?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

// Check whether a role has access to a given admin section
function roleHasAccess(role: AdminRole, sectionKey: string): boolean {
  const allowed = NAV_ROLES[sectionKey];
  if (!allowed) return true; // no restriction = everyone
  return allowed.includes(role);
}

// ─── Role Detail Card ─────────────────────────────────────────────────────────
function RoleDetailCard({ role, userCount }: { role: RoleDef; userCount: number }) {
  const s = ROLE_STYLES[role.key] ?? ROLE_STYLES.user;
  const accessibleSections = ADMIN_SECTIONS.filter(sec =>
    roleHasAccess(role.key as AdminRole, sec.key)
  );
  const blockedSections = ADMIN_SECTIONS.filter(sec =>
    !roleHasAccess(role.key as AdminRole, sec.key)
  );

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className={`h-1.5 w-full ${s.bar}`} />
      <CardHeader className={`pb-3 bg-gradient-to-b ${s.header} to-transparent`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-white shadow-sm`}>
              <Shield className={`h-4 w-4 ${s.icon}`} />
            </div>
            <div>
              <CardTitle className="text-base leading-tight">{role.label}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{userCount} user{userCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <RoleBadge role={role.key} label={role.key} />
        </div>
        <CardDescription className="text-xs mt-2 leading-relaxed">{role.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-4 flex-1 space-y-4">
        {/* Accessible sections */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-500" />
            Has Access ({accessibleSections.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {accessibleSections.map(sec => {
              const Icon = sec.icon;
              return (
                <span
                  key={sec.key}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-green-50 text-green-700 border border-green-100 font-medium"
                >
                  <Icon className="h-3 w-3" />
                  {sec.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Blocked sections */}
        {blockedSections.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 text-red-400" />
              No Access ({blockedSections.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blockedSections.map(sec => {
                const Icon = sec.icon;
                return (
                  <span
                    key={sec.key}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-50 text-gray-400 border border-gray-100"
                  >
                    <Icon className="h-3 w-3" />
                    {sec.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Permissions Matrix ───────────────────────────────────────────────────────
function PermissionsMatrix({ roles }: { roles: RoleDef[] }) {
  // Only show the 4 staff roles in the matrix
  const staffRoles = roles.filter(r => ROLES_ORDER.includes(r.key as AdminRole));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Permissions Matrix</CardTitle>
        <CardDescription>Admin panel section access by role — based on enforced route permissions</CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground min-w-[180px] sticky left-0 bg-muted/30">
                Section
              </th>
              {staffRoles.map(r => {
                const s = ROLE_STYLES[r.key] ?? ROLE_STYLES.user;
                return (
                  <th key={r.key} className="text-center py-3 px-4 font-medium min-w-[140px]">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className={`h-4 w-4 ${s.icon}`} />
                      <span className="text-xs">{r.label}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ADMIN_SECTIONS.map((sec, i) => {
              const Icon = sec.icon;
              return (
                <tr key={sec.key} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                  <td className="py-2.5 px-4 sticky left-0 bg-inherit">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium text-sm">{sec.label}</span>
                    </div>
                  </td>
                  {staffRoles.map(r => {
                    const hasAccess = roleHasAccess(r.key as AdminRole, sec.key);
                    return (
                      <td key={r.key} className="py-2.5 px-4 text-center">
                        {hasAccess ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 mx-auto">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-300 mx-auto">
                            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </span>
                        )}
                      </td>
                    );
                  })}
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
  const [roleFilter, setRoleFilter] = useState('all');
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
        throw new Error((err as any).message ?? 'Failed to update role');
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
            <SelectItem value="all">All roles</SelectItem>
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
                  <TableHead>{t('admin.roles.colUser')}</TableHead>
                  <TableHead>{t('admin.roles.colCurrentRole')}</TableHead>
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
                            onValueChange={val => setPendingRoles(p => ({ ...p, [u.id]: val }))}
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
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 60_000,
  });

  const roles = data?.roles ?? [];
  const totalUsers = data?.totalUsers ?? 0;
  const adminCount = roles.find(r => r.key === 'admin')?.userCount ?? 0;

  // Only the 4 staff roles shown as cards
  const staffRoles = ROLES_ORDER
    .map(key => roles.find(r => r.key === key))
    .filter(Boolean) as RoleDef[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">View role access levels and manage user assignments</p>
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
            <CardTitle className="text-sm font-medium">Staff Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : ROLES_ORDER.length}</div>
            <p className="text-xs text-muted-foreground">Admin panel roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered</p>
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
            <CardTitle className="text-sm font-medium">Protected Sections</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ADMIN_SECTIONS.length}</div>
            <p className="text-xs text-muted-foreground">Admin panel areas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Role Overview</TabsTrigger>
          <TabsTrigger value="matrix">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="users">User Assignment</TabsTrigger>
        </TabsList>

        {/* ── Role Overview ──────────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading roles…
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {staffRoles.map(role => (
                <RoleDetailCard
                  key={role.key}
                  role={role}
                  userCount={role.userCount}
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
