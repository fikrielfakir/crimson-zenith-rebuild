import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  UserPlus,
  CalendarDays
} from "lucide-react";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data
  const overviewStats = {
    totalVisitors: { value: 12847, change: +12.3, trend: "up" },
    pageViews: { value: 45632, change: +8.7, trend: "up" },
    bounceRate: { value: 34.2, change: -2.1, trend: "down" },
    avgSessionDuration: { value: "3m 42s", change: +15.6, trend: "up" }
  };

  const trafficSources = [
    { source: "Direct", visitors: 4523, percentage: 35.2 },
    { source: "Organic Search", visitors: 3841, percentage: 29.9 },
    { source: "Social Media", visitors: 2156, percentage: 16.8 },
    { source: "Referral", visitors: 1327, percentage: 10.3 },
    { source: "Email", visitors: 1000, percentage: 7.8 }
  ];

  const topPages = [
    { page: "/", views: 8934, bounce: 32.1 },
    { page: "/clubs", views: 6721, bounce: 28.4 },
    { page: "/events", views: 5643, bounce: 41.2 },
    { page: "/news", views: 4521, bounce: 35.7 },
    { page: "/contact", views: 3211, bounce: 22.8 }
  ];

  const userEngagement = {
    newUsers: 1847,
    returningUsers: 2935,
    avgPagesPerSession: 3.4,
    conversionRate: 4.2
  };

  const eventMetrics = {
    totalBookings: 234,
    popularEvents: [
      { name: "Atlas Mountains Trek", bookings: 45 },
      { name: "Desert Photography", bookings: 38 },
      { name: "Coastal Surfing", bookings: 29 },
      { name: "Cultural Walk", bookings: 22 }
    ]
  };

  const clubMetrics = {
    totalMembers: 1755,
    newMembersThisMonth: 89,
    activeClubs: 9,
    membershipGrowth: [
      { month: "Jan", members: 1234 },
      { month: "Feb", members: 1367 },
      { month: "Mar", members: 1489 },
      { month: "Apr", members: 1598 },
      { month: "May", members: 1755 }
    ]
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleExport = (type: string) => {
    // Mock export functionality
    alert(`Exporting ${type} data...`);
  };

  const getChangeColor = (change: number, trend: string) => {
    if (trend === "up") return change > 0 ? "text-green-600" : "text-red-600";
    if (trend === "down") return change > 0 ? "text-red-600" : "text-green-600";
    return "text-gray-600";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => handleExport('all')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats.totalVisitors.value.toLocaleString()}</div>
              <p className={`text-xs ${getChangeColor(overviewStats.totalVisitors.change, overviewStats.totalVisitors.trend)}`}>
                {overviewStats.totalVisitors.change > 0 ? '+' : ''}{overviewStats.totalVisitors.change}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats.pageViews.value.toLocaleString()}</div>
              <p className={`text-xs ${getChangeColor(overviewStats.pageViews.change, overviewStats.pageViews.trend)}`}>
                {overviewStats.pageViews.change > 0 ? '+' : ''}{overviewStats.pageViews.change}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats.bounceRate.value}%</div>
              <p className={`text-xs ${getChangeColor(overviewStats.bounceRate.change, overviewStats.bounceRate.trend)}`}>
                {overviewStats.bounceRate.change > 0 ? '+' : ''}{overviewStats.bounceRate.change}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats.avgSessionDuration.value}</div>
              <p className={`text-xs ${getChangeColor(overviewStats.avgSessionDuration.change, overviewStats.avgSessionDuration.trend)}`}>
                {overviewStats.avgSessionDuration.change > 0 ? '+' : ''}{overviewStats.avgSessionDuration.change}% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="events">Events Analytics</TabsTrigger>
            <TabsTrigger value="clubs">Club Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{source.source}</span>
                            <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="ml-4 text-sm font-semibold">{source.visitors.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{userEngagement.newUsers}</div>
                      <div className="text-sm text-muted-foreground">New Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{userEngagement.returningUsers}</div>
                      <div className="text-sm text-muted-foreground">Returning Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userEngagement.avgPagesPerSession}</div>
                      <div className="text-sm text-muted-foreground">Pages/Session</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{userEngagement.conversionRate}%</div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Performing Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-muted-foreground">
                          {page.views.toLocaleString()} views • {page.bounce}% bounce rate
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{page.views.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">page views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Event Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold">{eventMetrics.totalBookings}</div>
                    <div className="text-muted-foreground">Total Bookings This Month</div>
                  </div>
                  <div className="space-y-3">
                    {eventMetrics.popularEvents.map((event, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{event.name}</span>
                        <span className="font-semibold">{event.bookings}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <PieChart className="w-12 h-12 mx-auto mb-2" />
                      <p>Event booking distribution chart</p>
                      <p className="text-xs">Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clubs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Club Membership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{clubMetrics.totalMembers}</div>
                      <div className="text-sm text-muted-foreground">Total Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+{clubMetrics.newMembersThisMonth}</div>
                      <div className="text-sm text-muted-foreground">New This Month</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Membership Growth</div>
                    <div className="space-y-1">
                      {clubMetrics.membershipGrowth.map((month, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{month.month}</span>
                          <span className="font-medium">{month.members}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Club Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Clubs</span>
                      <span className="text-xl font-bold">{clubMetrics.activeClubs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Members per Club</span>
                      <span className="text-xl font-bold">{Math.round(clubMetrics.totalMembers / clubMetrics.activeClubs)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Monthly Growth Rate</span>
                      <span className="text-xl font-bold text-green-600">+5.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;