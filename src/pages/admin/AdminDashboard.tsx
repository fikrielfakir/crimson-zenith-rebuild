import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  BarChart3
} from "lucide-react";

const AdminDashboard = () => {
  // Mock analytics data
  const stats = [
    {
      title: "Total Clubs",
      value: "9",
      change: "+2 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Events",
      value: "6", 
      change: "+1 this week",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "News Articles",
      value: "12",
      change: "+3 this month",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Site Views",
      value: "2,847",
      change: "+12% vs last month",
      icon: Eye,
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    {
      action: "New member joined Atlas Hikers",
      time: "2 hours ago",
      type: "member"
    },
    {
      action: "Event 'Desert Photography Workshop' was updated",
      time: "4 hours ago", 
      type: "event"
    },
    {
      action: "Article 'Atlas Mountains Trek' was published",
      time: "1 day ago",
      type: "article"
    },
    {
      action: "New club 'Agadir Surfers' was created",
      time: "2 days ago",
      type: "club"
    },
    {
      action: "Contact form submission received",
      time: "3 days ago",
      type: "contact"
    }
  ];

  const popularClubs = [
    { name: "Casablanca Club", members: 320, growth: "+15" },
    { name: "Marrakech Club", members: 250, growth: "+8" },
    { name: "Tangier Club", members: 210, growth: "+12" },
    { name: "Rabat Club", members: 195, growth: "+5" }
  ];

  const upcomingEvents = [
    { name: "Atlas Mountains Trek", date: "Dec 15", attendees: 12 },
    { name: "Coastal Surfing Session", date: "Dec 18", attendees: 6 },
    { name: "Desert Photography", date: "Dec 20", attendees: 8 },
    { name: "Cultural Walk", date: "Dec 22", attendees: 20 }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your Morocco Clubs platform from this central hub
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Clubs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Popular Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularClubs.map((club, index) => (
                  <div key={club.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{club.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {club.members} members
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
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
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={event.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date} • {event.attendees} attendees
                      </div>
                    </div>
                    <Badge variant="outline">
                      {event.attendees}/{event.attendees + 3}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">
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
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Club
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CalendarPlus className="h-4 w-4" />
                Create Event
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Write Article
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
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