import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  Search,
  Filter,
  UserPlus,
  UserX,
  Mail,
  Phone,
  Shield,
  Crown,
  Ban,
  CheckCircle,
  MoreHorizontal
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'moderator' | 'member';
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastActive: string;
  clubMemberships: string[];
  eventsAttended: number;
  avatar?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed.benali@email.com",
      phone: "+212 655 123 456",
      role: "admin",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-12-24",
      clubMemberships: ["Atlas Hikers", "Photography Collective"],
      eventsAttended: 12
    },
    {
      id: 2,
      name: "Fatima El-Khoury",
      email: "fatima.elkhoury@email.com",
      phone: "+212 661 234 567",
      role: "moderator",
      status: "active",
      joinDate: "2024-02-03",
      lastActive: "2024-12-23",
      clubMemberships: ["Culture Seekers", "Desert Explorers"],
      eventsAttended: 8
    },
    {
      id: 3,
      name: "Youssef Alami",
      email: "youssef.alami@email.com",
      phone: "+212 662 345 678",
      role: "member",
      status: "active",
      joinDate: "2024-03-10",
      lastActive: "2024-12-22",
      clubMemberships: ["Coastal Riders"],
      eventsAttended: 5
    },
    {
      id: 4,
      name: "Maryam Zahra",
      email: "maryam.zahra@email.com",
      phone: "+212 663 456 789",
      role: "member",
      status: "inactive",
      joinDate: "2024-04-20",
      lastActive: "2024-11-15",
      clubMemberships: ["Rock Climbers Morocco"],
      eventsAttended: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    status: 'active',
    clubMemberships: [],
    eventsAttended: 0
  });

  const roles = ['admin', 'moderator', 'member'];
  const statuses = ['active', 'inactive', 'banned'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    // Validation
    if (!newUser.name?.trim()) {
      alert('Name is required');
      return;
    }
    if (!newUser.email?.trim()) {
      alert('Email is required');
      return;
    }
    if (!newUser.phone?.trim()) {
      alert('Phone is required');
      return;
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const user: User = {
      id: nextId,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      phone: newUser.phone.trim(),
      role: newUser.role || 'member',
      status: newUser.status || 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      clubMemberships: newUser.clubMemberships || [],
      eventsAttended: 0
    } as User;

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'member',
      status: 'active',
      clubMemberships: [],
      eventsAttended: 0
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    // Validation
    if (!editingUser.name?.trim()) {
      alert('Name is required');
      return;
    }
    if (!editingUser.email?.trim()) {
      alert('Email is required');
      return;
    }

    const updatedUser = {
      ...editingUser,
      name: editingUser.name.trim(),
      email: editingUser.email.trim(),
      phone: editingUser.phone?.trim() || ''
    };

    setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'activate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'active' as const } : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'inactive' as const } : user
        ));
        break;
      case 'ban':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'banned' as const } : user
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        }
        break;
    }
    setSelectedUsers([]);
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'moderator': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserForm = ({ user, setUser, onSave, title }: any) => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="Enter email address"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={user.phone}
            onChange={(e) => setUser({...user, phone: e.target.value})}
            placeholder="+212 6XX XXX XXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={user.role} onValueChange={(value) => setUser({...user, role: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={user.status} onValueChange={(value) => setUser({...user, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onSave} className="w-full">
        Save User
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <UserForm
                user={newUser}
                setUser={setNewUser}
                onSave={handleCreateUser}
                title="Create New User"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                    <UserX className="w-4 h-4 mr-1" />
                    Deactivate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('ban')}>
                    <Ban className="w-4 h-4 mr-1" />
                    Ban
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">Admin users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => new Date(u.joinDate).getMonth() === new Date().getMonth()).length}
              </div>
              <p className="text-xs text-muted-foreground">Recently joined</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          <span className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        </div>
                        <div className="mt-1">
                          Joined: {new Date(user.joinDate).toLocaleDateString()} • 
                          Last active: {new Date(user.lastActive).toLocaleDateString()} • 
                          Events: {user.eventsAttended}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        {editingUser && (
                          <UserForm
                            user={editingUser}
                            setUser={setEditingUser}
                            onSave={handleUpdateUser}
                            title="Edit User"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                          handleDeleteUser(user.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;