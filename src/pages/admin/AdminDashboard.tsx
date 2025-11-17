import { useQuery } from '@tanstack/react-query';
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
  const response = await fetch('/api/admin/stats');
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

async function fetchRecentActivity(): Promise<Activity[]> {
  const response = await fetch('/api/admin/activity');
  if (!response.ok) throw new Error('Failed to fetch activity');
  return response.json();
}

async function fetchUpcomingEvents(): Promise<Event[]> {
  const response = await fetch('/api/admin/upcoming-events');
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

async function fetchChartsData() {
  const response = await fetch('/api/admin/charts');
  if (!response.ok) throw new Error('Failed to fetch charts data');
  return response.json();
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: fetchUpcomingEvents,
  });

  const { data: chartsData, isLoading: chartsLoading } = useQuery({
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
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, Admin
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString() || 0}
          change={stats?.userGrowth || 0}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          title="Active Clubs"
          value={stats?.activeClubs || 0}
          change={stats?.newClubsThisMonth || 0}
          icon={Building}
          href="/admin/clubs"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          change={stats?.eventsThisWeek || 0}
          icon={Calendar}
          href="/admin/events"
        />
        <StatCard
          title="Total Revenue"
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
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-80 w-full" />
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
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-80 w-full" />
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
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/admin/activity">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
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
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 5 scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
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
          <CardTitle>Quick Actions</CardTitle>
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
