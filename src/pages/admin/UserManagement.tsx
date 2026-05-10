import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Plus, Download, MoreVertical, Edit, Trash2,
  Shield, UserX, Eye, Key, Loader2, FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

// ── Role styling ───────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; cls: string }> = {
  admin:           { label: 'Admin',           cls: 'bg-red-100 text-red-700 border-red-200' },
  moderator:       { label: 'Moderator',       cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  club_manager:    { label: 'Club Manager',    cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  event_organizer: { label: 'Event Organizer', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  user:            { label: 'Member',          cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? ROLE_META.user;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

// ── Form schema ────────────────────────────────────────────────────────────────
const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  username:  z.string().min(3, 'Username must be at least 3 characters'),
  email:     z.string().email('Invalid email address'),
  password:  z.union([z.string().min(6), z.string().length(0)]).optional(),
  phone:     z.string().optional(),
  location:  z.string().optional(),
  bio:       z.string().optional(),
  interests: z.string().optional(),
  role:      z.string().default('user'),
  isActive:  z.boolean().default(true),
});
type UserFormData = z.infer<typeof userSchema>;

// ── Fetch helper ───────────────────────────────────────────────────────────────
async function fetchUsers(params: {
  search?: string; role?: string; status?: string; page: number; perPage: number;
}) {
  const q = new URLSearchParams({
    page:    params.page.toString(),
    perPage: params.perPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.role && params.role !== 'all' && { role: params.role }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
  });
  const res = await apiFetch(`/api/admin/users?${q}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]             = useState(searchParams.get('search') ?? '');
  const [roleFilter, setRoleFilter]     = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage]                 = useState(1);
  const [perPage]                       = useState(25);
  const [selectedUsers, setSelectedUsers]         = useState<number[]>([]);
  const [editingUser, setEditingUser]             = useState<any>(null);
  const [deletingUserId, setDeletingUserId]       = useState<number | null>(null);
  const [resettingPasswordUser, setResettingPasswordUser] = useState<any>(null);
  const [newPassword, setNewPassword]             = useState('');

  const queryClient = useQueryClient();
  const { toast }   = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['users', { search, roleFilter, statusFilter, page, perPage }],
    queryFn:  () => fetchUsers({ search, role: roleFilter, status: statusFilter, page, perPage }),
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '', lastName: '', username: '', email: '',
      password: '', phone: '', location: '', bio: '',
      interests: '', role: 'user', isActive: true,
    },
  });

  useEffect(() => {
    if (editingUser?.id) {
      form.reset({
        firstName: editingUser.firstName || '',
        lastName:  editingUser.lastName  || '',
        username:  editingUser.username  || '',
        email:     editingUser.email     || '',
        password:  '',
        phone:     editingUser.phone     || '',
        location:  editingUser.location  || '',
        bio:       editingUser.bio       || '',
        interests: editingUser.interests || '',
        role:      editingUser.role      || 'user',
        isActive:  editingUser.isActive  !== undefined ? editingUser.isActive : true,
      });
    } else {
      form.reset({
        firstName: '', lastName: '', username: '', email: '',
        password: '', phone: '', location: '', bio: '',
        interests: '', role: 'user', isActive: true,
      });
    }
  }, [editingUser, form]);

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User deleted successfully' });
      setDeletingUserId(null);
    },
    onError: (e: Error) => toast({ title: 'Failed to delete user', description: e.message, variant: 'destructive' }),
  });

  const saveUserMutation = useMutation({
    mutationFn: async (formData: UserFormData) => {
      const url    = editingUser?.id ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser?.id ? 'PUT' : 'POST';
      const body   = { ...formData };
      if (!body.password) delete body.password;
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to save user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: `User ${editingUser?.id ? 'updated' : 'created'} successfully` });
      setEditingUser(null);
      form.reset();
    },
    onError: (e: Error) => toast({ title: 'Failed to save user', description: e.message, variant: 'destructive' }),
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const res = await apiFetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to toggle admin status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Admin status updated' });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiFetch(`/api/admin/users/${userId}/toggle-active`, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to toggle active status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User status updated' });
    },
    onError: (e: Error) => toast({ title: 'Failed to update status', description: e.message, variant: 'destructive' }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      const res = await apiFetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to reset password');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Password reset successfully' });
      setResettingPasswordUser(null);
      setNewPassword('');
    },
    onError: (e: Error) => toast({ title: 'Failed to reset password', description: e.message, variant: 'destructive' }),
  });

  const handleSelectAll = (checked: boolean) =>
    setSelectedUsers(checked ? (data?.users.map((u: any) => u.id) || []) : []);

  const handleSelectUser = (userId: number, checked: boolean) =>
    setSelectedUsers(checked ? [...selectedUsers, userId] : selectedUsers.filter(id => id !== userId));

  const onSubmit = (formData: UserFormData) => {
    if (!editingUser?.id && !formData.password) {
      toast({ title: 'Password required', description: 'Please enter a password for the new user', variant: 'destructive' });
      return;
    }
    saveUserMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/applications">
              <FileText className="mr-2 h-4 w-4" />
              Applications
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users/roles">
              <Shield className="mr-2 h-4 w-4" />
              Roles & Permissions
            </Link>
          </Button>
          <Button variant="outline" onClick={() => toast({ title: 'Exporting users...' })}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setEditingUser({})}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="club_manager">Club Manager</SelectItem>
            <SelectItem value="event_organizer">Event Organizer</SelectItem>
            <SelectItem value="user">Member</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <span className="text-sm">{selectedUsers.length} users selected</span>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === data?.users?.length && data?.users?.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Clubs</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data?.users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={checked => handleSelectUser(user.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role ?? (user.isAdmin ? 'admin' : 'user')} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'outline'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/clubs?search=${encodeURIComponent(user.firstName + ' ' + user.lastName)}`}
                      className="text-sm hover:underline text-muted-foreground hover:text-foreground"
                    >
                      {user.clubCount || 0} clubs
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.createdAt && format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/applications?search=${encodeURIComponent(user.email)}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Application
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleAdminMutation.mutate({ userId: user.id, isAdmin: user.isAdmin })}>
                          <Shield className="mr-2 h-4 w-4" />
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setResettingPasswordUser(user)}>
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActiveMutation.mutate(user.id)}>
                          <UserX className="mr-2 h-4 w-4" />
                          {user.isActive ? 'Suspend' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingUserId(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, data?.total || 0)} of {data?.total || 0} users
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            {Array.from({ length: data?.totalPages || 0 }, (_, i) => i + 1).map(p => (
              <Button key={p} variant={page === p ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))} disabled={page === data?.totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={editingUser !== null} onOpenChange={open => !open && setEditingUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser?.id ? 'Update user information' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              {!editingUser?.id && (
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Enter password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Member</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="club_manager">Club Manager</SelectItem>
                      <SelectItem value="event_organizer">Event Organizer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="!mt-0">Active</FormLabel>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button type="submit" disabled={saveUserMutation.isPending}>
                  {saveUserMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingUser?.id ? 'Save Changes' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deletingUserId !== null} onOpenChange={open => !open && setDeletingUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user and all their data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingUserId && deleteUserMutation.mutate(deletingUserId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={resettingPasswordUser !== null} onOpenChange={open => !open && setResettingPasswordUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {resettingPasswordUser?.firstName} {resettingPasswordUser?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResettingPasswordUser(null)}>Cancel</Button>
            <Button
              disabled={!newPassword || newPassword.length < 6 || resetPasswordMutation.isPending}
              onClick={() => resetPasswordMutation.mutate({ userId: resettingPasswordUser.id, newPassword })}
            >
              {resetPasswordMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
