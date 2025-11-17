import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  UserX,
  Eye,
  Key,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  interests: z.string().optional(),
  isAdmin: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

async function fetchUsers(params: { search?: string; role?: string; status?: string; page: number; perPage: number }) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    perPage: params.perPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.role && params.role !== 'all' && { role: params.role }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
  });
  
  const response = await fetch(`/api/admin/users?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['users', { search, roleFilter, statusFilter, page, perPage }],
    queryFn: () => fetchUsers({
      search,
      role: roleFilter,
      status: statusFilter,
      page,
      perPage,
    }),
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: editingUser || {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      interests: '',
      isAdmin: false,
      isActive: true,
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User deleted successfully' });
      setDeletingUserId(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete user', description: error.message, variant: 'destructive' });
    },
  });

  const saveUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users';
      
      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: `User ${editingUser ? 'updated' : 'created'} successfully` });
      setEditingUser(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save user', description: error.message, variant: 'destructive' });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: number; isAdmin: boolean }) => {
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });
      if (!response.ok) throw new Error('Failed to toggle admin status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Admin status updated' });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(data?.users.map((u: any) => u.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleExport = () => {
    toast({ title: 'Exporting users...', description: 'Download will start shortly' });
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    toast({ title: `Deleting ${selectedUsers.length} users...` });
  };

  const onSubmit = (data: UserFormData) => {
    saveUserMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
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
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>
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

      {/* Users Table */}
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
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
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
                    <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
                      {user.isAdmin ? 'Admin' : 'Member'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'outline'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.clubCount || 0}</TableCell>
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
                          <Link to={`/profile/${user.username}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
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
                        <DropdownMenuItem>
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, data?.total || 0)} of {data?.total || 0} users
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: data?.totalPages || 0 }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))}
              disabled={page === data?.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog open={editingUser !== null} onOpenChange={() => setEditingUser(null)}>
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
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between space-x-4">
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Admin</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveUserMutation.isPending}>
                  {saveUserMutation.isPending ? 'Saving...' : 'Save User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deletingUserId !== null} onOpenChange={() => setDeletingUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUserId && deleteUserMutation.mutate(deletingUserId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
