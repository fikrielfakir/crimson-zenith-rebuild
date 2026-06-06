import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, X, Clock, Mail, Phone, Search, Users, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

async function fetchApplications(status?: string, search?: string) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const response = await apiFetch(`/api/admin/applications?${params}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
}

export default function ApplicationsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['applications', statusFilter, search],
    queryFn: () => fetchApplications(statusFilter, search),
  });

  const approveApplicationMutation = useMutation({
    mutationFn: async (appId: number) => {
      const response = await apiFetch(`/api/admin/applications/${appId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to approve application');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Application approved successfully' });
    },
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: async (appId: number) => {
      const response = await apiFetch(`/api/admin/applications/${appId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to reject application');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Application rejected' });
    },
  });

  const applications = data?.applications || [];
  const pendingCount  = data?.pendingCount  ?? applications.filter((a: any) => a.status === 'pending').length;
  const approvedCount = data?.approvedCount ?? applications.filter((a: any) => a.status === 'approved').length;
  const rejectedCount = data?.rejectedCount ?? applications.filter((a: any) => a.status === 'rejected').length;
  const totalCount    = data?.total ?? applications.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications Management</h1>
          <p className="text-muted-foreground mt-1">Review membership applications and requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              All Users
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users/roles">
              <ExternalLink className="mr-2 h-4 w-4" />
              Roles & Permissions
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('pending')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('approved')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : approvedCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('rejected')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : rejectedCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : totalCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Review and process membership applications</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email…"
                  className="pl-8 w-56"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <p className="text-sm font-medium text-foreground">Failed to load applications</p>
              <button onClick={() => refetch()} className="text-xs text-primary underline">Retry</button>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-muted-foreground">
                {statusFilter !== 'all' ? `No ${statusFilter} applications` : 'No applications at the moment'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={app.avatar} />
                          <AvatarFallback>{(app.applicant_name || app.name)?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.applicant_name || app.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {(() => {
                              const raw = app.interests;
                              if (!raw) return '—';
                              if (Array.isArray(raw)) return raw.join(', ');
                              try {
                                const parsed = JSON.parse(raw);
                                return Array.isArray(parsed) ? parsed.join(', ') : String(raw);
                              } catch { return String(raw); }
                            })()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[160px]">{app.email}</span>
                        </div>
                        {app.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3 shrink-0" />
                            {app.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.type || 'Membership'}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(() => {
                        const raw = app.created_at || app.createdAt || app.submitted_at;
                        if (!raw) return '—';
                        const d = new Date(raw);
                        return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
                      })()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === 'pending'  ? 'secondary'   :
                          app.status === 'approved' ? 'default'     :
                          'destructive'
                        }
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          title="Search this applicant in Users"
                        >
                          <Link to={`/admin/users?search=${encodeURIComponent(app.email)}`}>
                            <Users className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => approveApplicationMutation.mutate(app.id)}
                          disabled={approveApplicationMutation.isPending || app.status !== 'pending'}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => rejectApplicationMutation.mutate(app.id)}
                          disabled={rejectApplicationMutation.isPending || app.status !== 'pending'}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
