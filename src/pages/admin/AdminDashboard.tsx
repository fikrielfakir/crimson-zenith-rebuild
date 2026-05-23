import { apiFetch } from '@/lib/apiFetch';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { AdminPageHeader, AdminStatsSkeleton, AdminPageError } from '@/components/admin/AdminPageShell';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Mail,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  activeClubs: number;
  newClubsThisMonth: number;
  upcomingEvents: number;
  eventsThisWeek: number;
  totalRevenue: number;
  revenueGrowth: number;
}

interface Activity {
  id: string;
  type: 'user' | 'club' | 'booking' | 'event';
  description: string;
  timestamp: string;
  user?: { name: string; avatar?: string };
}

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  attendees: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await apiFetch('/api/admin/stats', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

async function fetchRecentActivity(): Promise<Activity[]> {
  const response = await apiFetch('/api/admin/activity', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch activity');
  return response.json();
}

async function fetchUpcomingEvents(): Promise<Event[]> {
  const response = await apiFetch('/api/admin/upcoming-events', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

async function fetchChartsData() {
  const response = await apiFetch('/api/admin/charts', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch charts data');
  return response.json();
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: activity, isLoading: activityLoading, isError: activityError } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
  });

  const { data: upcomingEvents, isLoading: eventsLoading, isError: eventsError } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: fetchUpcomingEvents,
  });

  const { data: chartsData, isLoading: chartsLoading, isError: chartsError } = useQuery({
    queryKey: ['chartsData'],
    queryFn: fetchChartsData,
  });

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    href,
  }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    href: string;
  }) => (
    <Link to={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {change >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(change)}%
            </span>
            <span className="ml-1">{t('admin.dashboard.fromLastMonth')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title={t('admin.dashboard.title')} />
        <AdminStatsSkeleton count={4} />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-64 w-full rounded-lg md:col-span-2" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title={t('admin.dashboard.title')} />
        <AdminPageError
          title="Failed to load dashboard"
          message="Could not fetch dashboard data from the server. Check your connection and try again."
          onRetry={() => refetchStats()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('admin.dashboard.title')}</h1>
        <div className="text-sm text-muted-foreground">
          {t('admin.dashboard.welcomeBack')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('admin.dashboard.totalUsers')}
          value={stats?.totalUsers.toLocaleString() || 0}
          change={stats?.userGrowth || 0}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          title={t('admin.dashboard.activeClubs')}
          value={stats?.activeClubs || 0}
          change={stats?.newClubsThisMonth || 0}
          icon={Building}
          href="/admin/clubs"
        />
        <StatCard
          title={t('admin.dashboard.upcomingEvents')}
          value={stats?.upcomingEvents || 0}
          change={stats?.eventsThisWeek || 0}
          icon={Calendar}
          href="/admin/events"
        />
        <StatCard
          title={t('admin.dashboard.totalRevenue')}
          value={`${(stats?.totalRevenue || 0).toLocaleString()} MAD`}
          change={stats?.revenueGrowth || 0}
          icon={DollarSign}
          href="/admin/analytics"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.userGrowth')}</CardTitle>
            <CardDescription>{t('admin.dashboard.userGrowthDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : chartsError ? (
              <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                Chart data unavailable
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartsData?.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.revenue')}</CardTitle>
            <CardDescription>{t('admin.dashboard.revenueDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : chartsError ? (
              <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                Chart data unavailable
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartsData?.revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed and Upcoming Events */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('admin.dashboard.recentActivity')}</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/admin/activity">
                  {t('admin.dashboard.viewAll')} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : activityError ? (
              <p className="text-sm text-muted-foreground text-center py-6">Activity unavailable</p>
            ) : (
              <div className="space-y-4">
                {activity?.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.user?.avatar} />
                      <AvatarFallback>{item.user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant={
                      item.type === 'user' ? 'default' :
                      item.type === 'club' ? 'secondary' :
                      item.type === 'event' ? 'outline' : 'default'
                    }>
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.upcomingEventsSection')}</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : eventsError ? (
              <p className="text-sm text-muted-foreground text-center py-6">Events unavailable</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents?.slice(0, 5).map((event) => (
                  <div key={event.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{event.name}</p>
                      <Badge variant="outline">{event.attendees}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/admin/events">Manage Events</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.common.addNew')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-5">
            <Button asChild>
              <Link to="/admin/clubs/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Club
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/applications">
                <FileText className="mr-2 h-4 w-4" />
                Review Applications
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/email">
                <Mail className="mr-2 h-4 w-4" />
                Send Email Campaign
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
