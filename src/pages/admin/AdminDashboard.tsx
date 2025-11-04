import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Activity,
  MapPin,
  Eye,
  UserPlus,
  CalendarPlus,
  BarChart3,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Clock,
  RefreshCw,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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

const AdminDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [liveStats, setLiveStats] = useState({
    usersOnline: 24,
    recentRegistrations: 3,
    activeBookings: 7
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        usersOnline: Math.max(10, prev.usersOnline + Math.floor(Math.random() * 5 - 2)),
        recentRegistrations: Math.max(0, prev.recentRegistrations + Math.floor(Math.random() * 3 - 1)),
        activeBookings: Math.max(0, prev.activeBookings + Math.floor(Math.random() * 3 - 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Main statistics with trend indicators
  const stats = [
    {
      title: "Total Clubs",
      value: "9",
      change: "+2 this month",
      trend: "up",
      percentage: "+22.2%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      live: false
    },
    {
      title: "Active Events",
      value: "6", 
      change: "+1 this week",
      trend: "up",
      percentage: "+16.7%",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      live: false
    },
    {
      title: "News Articles",
      value: "12",
      change: "+3 this month",
      trend: "up",
      percentage: "+33.3%",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      live: false
    },
    {
      title: "Site Views",
      value: "2,847",
      change: "+12% vs last month",
      trend: "up",
      percentage: "+12%",
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      live: false
    },
    {
      title: "Users Online",
      value: liveStats.usersOnline.toString(),
      change: "Live updates",
      trend: "neutral",
      icon: Activity,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      live: true
    },
    {
      title: "Recent Bookings",
      value: liveStats.activeBookings.toString(),
      change: "Last 24 hours",
      trend: "neutral",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      live: true
    }
  ];

  // Membership growth data for line chart
  const membershipGrowthData = [
    { month: 'Jun', members: 180 },
    { month: 'Jul', members: 220 },
    { month: 'Aug', members: 280 },
    { month: 'Sep', members: 350 },
    { month: 'Oct', members: 420 },
    { month: 'Nov', members: 520 },
    { month: 'Dec', members: 650 }
  ];

  // Event attendance by category for bar chart
  const eventAttendanceData = [
    { category: 'Trekking', attendees: 145 },
    { category: 'Photography', attendees: 89 },
    { category: 'Water Sports', attendees: 112 },
    { category: 'Cultural', attendees: 156 },
    { category: 'Adventure', attendees: 98 }
  ];

  // Revenue data for area chart
  const revenueData = [
    { month: 'Jun', revenue: 4200 },
    { month: 'Jul', revenue: 5100 },
    { month: 'Aug', revenue: 6300 },
    { month: 'Sep', revenue: 7800 },
    { month: 'Oct', revenue: 9200 },
    { month: 'Nov', revenue: 11500 },
    { month: 'Dec', revenue: 14200 }
  ];

  // Traffic sources for pie chart
  const trafficSourcesData = [
    { name: 'Direct', value: 450, color: '#3b82f6' },
    { name: 'Organic', value: 380, color: '#10b981' },
    { name: 'Social', value: 280, color: '#8b5cf6' },
    { name: 'Referral', value: 150, color: '#f59e0b' },
    { name: 'Email', value: 90, color: '#ec4899' }
  ];

  const recentActivity = [
    { action: "New member joined Atlas Hikers", time: "2 hours ago", type: "member" },
    { action: "Event 'Desert Photography Workshop' was updated", time: "4 hours ago", type: "event" },
    { action: "Article 'Atlas Mountains Trek' was published", time: "1 day ago", type: "article" },
    { action: "New club 'Agadir Surfers' was created", time: "2 days ago", type: "club" },
    { action: "Contact form submission received", time: "3 days ago", type: "contact" }
  ];

  const popularClubs = [
    { name: "Casablanca Club", members: 320, growth: "+15", trend: "up" },
    { name: "Marrakech Club", members: 250, growth: "+8", trend: "up" },
    { name: "Tangier Club", members: 210, growth: "+12", trend: "up" },
    { name: "Rabat Club", members: 195, growth: "+5", trend: "up" }
  ];

  const upcomingEvents = [
    { name: "Atlas Mountains Trek", date: "Dec 15", attendees: 12, capacity: 15, status: "filling" },
    { name: "Coastal Surfing Session", date: "Dec 18", attendees: 6, capacity: 9, status: "available" },
    { name: "Desert Photography", date: "Dec 20", attendees: 8, capacity: 11, status: "available" },
    { name: "Cultural Walk", date: "Dec 22", attendees: 20, capacity: 22, status: "almost-full" }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 px-4 lg:px-8 py-6">
        {/* Welcome Header with Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 sm:p-6 border border-blue-100 dark:border-blue-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage your Morocco Clubs platform from this central hub
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Report</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 relative overflow-hidden">
              {stat.live && (
                <div className="absolute top-2 right-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                  {stat.trend === "up" && (
                    <Badge variant="secondary" className="text-green-600 bg-green-50 text-xs">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {stat.percentage}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="membership" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-1">
            <TabsTrigger value="membership" className="text-xs sm:text-sm">Membership</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue</TabsTrigger>
            <TabsTrigger value="traffic" className="text-xs sm:text-sm">Traffic</TabsTrigger>
          </TabsList>

          <TabsContent value="membership" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Membership Growth Trend</CardTitle>
                <CardDescription>Total member growth over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={membershipGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="members" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Event Attendance by Category</CardTitle>
                <CardDescription>Total attendees across different event types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendees" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Revenue Analytics</CardTitle>
                <CardDescription>Monthly revenue from bookings and memberships</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Traffic Sources Distribution</CardTitle>
                <CardDescription>Breakdown of visitor acquisition channels</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Popular Clubs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-5 w-5" />
                Popular Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularClubs.map((club) => (
                  <div key={club.name} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{club.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {club.members} members
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-green-600 gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {club.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.name} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{event.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {event.date} • {event.attendees} attendees
                      </div>
                    </div>
                    <Badge variant={event.status === 'almost-full' ? 'destructive' : 'outline'} className="text-xs">
                      {event.attendees}/{event.capacity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2" size="sm">
                <UserPlus className="h-4 w-4" />
                Add New Club
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <CalendarPlus className="h-4 w-4" />
                Create Event
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <FileText className="h-4 w-4" />
                Write Article
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
