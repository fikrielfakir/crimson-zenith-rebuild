import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Download, TrendingUp, Users, Calendar as CalendarIcon, DollarSign, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageError } from '@/components/admin/AdminPageShell';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

async function fetchAnalytics(period: string) {
  const response = await apiFetch(`/api/admin/analytics?period=${period}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

export default function Analytics() {
  const [period, setPeriod] = useState('30days');
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => fetchAnalytics(period),
  });

  const { toast } = useToast();

  const handleExport = () => {
    toast({ title: t('admin.analytics.exportNotReady'), description: t('admin.analytics.exportSoon') });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <AdminPageError
        title={t('admin.analytics.failedTitle')}
        message={t('admin.analytics.failedDesc')}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.analytics.title')}</h1>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t('admin.analytics.last7days')}</SelectItem>
              <SelectItem value="30days">{t('admin.analytics.last30days')}</SelectItem>
              <SelectItem value="3months">{t('admin.analytics.last3months')}</SelectItem>
              <SelectItem value="6months">{t('admin.analytics.last6months')}</SelectItem>
              <SelectItem value="1year">{t('admin.analytics.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('admin.analytics.export')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">{t('admin.analytics.tabTraffic')}</TabsTrigger>
          <TabsTrigger value="users">{t('admin.analytics.tabUsers')}</TabsTrigger>
          <TabsTrigger value="events">{t('admin.analytics.tabEvents')}</TabsTrigger>
          <TabsTrigger value="revenue">{t('admin.analytics.tabRevenue')}</TabsTrigger>
          <TabsTrigger value="clubs">{t('admin.analytics.tabClubs')}</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.pageViews')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.traffic?.pageViews || '0'}</div>
                <p className="text-xs text-muted-foreground">+12% {t('admin.analytics.fromLastPeriod')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.uniqueVisitors')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.traffic?.uniqueVisitors || '0'}</div>
                <p className="text-xs text-muted-foreground">+8% {t('admin.analytics.fromLastPeriod')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.bounceRate')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.traffic?.bounceRate || '0'}%</div>
                <p className="text-xs text-muted-foreground">-3% {t('admin.analytics.fromLastPeriod')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.avgSession')}</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.traffic?.avgSession || '0'}m</div>
                <p className="text-xs text-muted-foreground">+5% {t('admin.analytics.fromLastPeriod')}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.pageViewsOverTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.traffic?.pageViewsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.topPages')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.analytics.page')}</TableHead>
                    <TableHead>{t('admin.analytics.views')}</TableHead>
                    <TableHead>{t('admin.analytics.uniqueVisitors')}</TableHead>
                    <TableHead>{t('admin.analytics.avgTime')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.traffic?.topPages?.map((page: any) => (
                    <TableRow key={page.path}>
                      <TableCell>{page.path}</TableCell>
                      <TableCell>{page.views}</TableCell>
                      <TableCell>{page.uniqueVisitors}</TableCell>
                      <TableCell>{page.avgTime}s</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.newUserRegistrations')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.users?.registrations || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.analytics.activeUsers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.analytics.dailyActiveUsers')}</p>
                    <p className="text-2xl font-bold">{data?.users?.dau || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.analytics.monthlyActiveUsers')}</p>
                    <p className="text-2xl font-bold">{data?.users?.mau || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin.analytics.mostActiveUsers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.analytics.user')}</TableHead>
                      <TableHead>{t('admin.analytics.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users?.topUsers?.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.actions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.eventsCreatedOverTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.events?.created || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.analytics.eventCategories')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.events?.categories || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {(data?.events?.categories || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin.analytics.mostPopularEvents')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.analytics.event')}</TableHead>
                      <TableHead>{t('admin.analytics.participants')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.events?.topEvents?.map((event: any) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.participants}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.revenueOverTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.revenue?.overTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.totalRevenue')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.revenue?.total || 0} MAD</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.avgTransaction')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.revenue?.avgTransaction || 0} MAD</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.analytics.transactions')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.revenue?.transactions || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.newClubsOverTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.clubs?.newClubs || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.mostPopularClubs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.analytics.club')}</TableHead>
                    <TableHead>{t('admin.analytics.members')}</TableHead>
                    <TableHead>{t('admin.analytics.events')}</TableHead>
                    <TableHead>{t('admin.analytics.rating')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.clubs?.topClubs?.map((club: any) => (
                    <TableRow key={club.id}>
                      <TableCell>{club.name}</TableCell>
                      <TableCell>{club.members}</TableCell>
                      <TableCell>{club.events}</TableCell>
                      <TableCell>{club.rating}/5</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
