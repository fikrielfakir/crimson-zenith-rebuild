import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast({ title: t('admin.applications.toastApproved') });
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
      toast({ title: t('admin.applications.toastDeclined') });
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
          <h1 className="text-3xl font-bold">{t('admin.applications.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.applications.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              {t('admin.applications.allUsers')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users/roles">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('admin.applications.rolesPermissions')}
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
            <CardTitle className="text-sm font-medium">{t('admin.applications.filterPending')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : pendingCount}</div>
            <p className="text-xs text-muted-foreground">{t('admin.applications.awaitingReview')}</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('approved')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.applications.filterApproved')}</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : approvedCount}</div>
            <p className="text-xs text-muted-foreground">{t('admin.common.allTime')}</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('rejected')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.applications.rejected')}</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : rejectedCount}</div>
            <p className="text-xs text-muted-foreground">{t('admin.common.allTime')}</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.applications.total')}</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : totalCount}</div>
            <p className="text-xs text-muted-foreground">{t('admin.common.allTime')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>{t('admin.applications.title')}</CardTitle>
              <CardDescription>{t('admin.applications.reviewProcess')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.applications.searchPlaceholder')}
                  className="pl-8 w-56"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={t('admin.common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.applications.filterAll')}</SelectItem>
                  <SelectItem value="pending">{t('admin.applications.filterPending')}</SelectItem>
                  <SelectItem value="approved">{t('admin.applications.filterApproved')}</SelectItem>
                  <SelectItem value="rejected">{t('admin.applications.rejected')}</SelectItem>
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
              <p className="text-sm font-medium text-foreground">{t('admin.common.errorLoad')}</p>
              <button onClick={() => refetch()} className="text-xs text-primary underline">{t('admin.common.retry')}</button>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">{t('admin.applications.noApplications')}</p>
              <p className="text-muted-foreground">
                {statusFilter !== 'all' ? t('admin.applications.noAppsStatus', { status: statusFilter }) : t('admin.applications.noAppsYet')}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.applications.colApplicant')}</TableHead>
                  <TableHead>{t('admin.applications.contactCol')}</TableHead>
                  <TableHead>{t('admin.common.type')}</TableHead>
                  <TableHead>{t('admin.applications.submittedCol')}</TableHead>
                  <TableHead>{t('admin.common.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.common.actions')}</TableHead>
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
                          {t('admin.applications.approve')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => rejectApplicationMutation.mutate(app.id)}
                          disabled={rejectApplicationMutation.isPending || app.status !== 'pending'}
                        >
                          <X className="mr-1 h-4 w-4" />
                          {t('admin.applications.decline')}
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
