import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Activity, 
  Server, 
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Clock,
  Zap,
  Users,
  Globe
} from "lucide-react";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: number;
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastCheck: string;
  responseTime: number;
}

const SystemMonitoring = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock system metrics
  const systemMetrics: SystemMetric[] = [
    { name: "CPU Usage", value: 45, unit: "%", status: "good", threshold: 80 },
    { name: "Memory Usage", value: 67, unit: "%", status: "warning", threshold: 80 },
    { name: "Disk Usage", value: 23, unit: "%", status: "good", threshold: 90 },
    { name: "Network I/O", value: 12.5, unit: "MB/s", status: "good", threshold: 100 }
  ];

  // Mock service statuses
  const services: ServiceStatus[] = [
    {
      name: "Web Server",
      status: "online",
      uptime: "15 days, 3 hours",
      lastCheck: "Just now",
      responseTime: 142
    },
    {
      name: "Database",
      status: "online", 
      uptime: "15 days, 3 hours",
      lastCheck: "Just now",
      responseTime: 8
    },
    {
      name: "File Storage",
      status: "online",
      uptime: "15 days, 3 hours", 
      lastCheck: "Just now",
      responseTime: 25
    },
    {
      name: "Email Service",
      status: "degraded",
      uptime: "2 days, 14 hours",
      lastCheck: "2 minutes ago",
      responseTime: 890
    }
  ];

  // Mock log entries
  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-12-25 10:30:15",
      level: "info",
      message: "User login successful for admin@morocco-clubs.com",
      source: "auth-service"
    },
    {
      id: 2,
      timestamp: "2024-12-25 10:28:42",
      level: "warning",
      message: "High memory usage detected on server instance",
      source: "system-monitor"
    },
    {
      id: 3,
      timestamp: "2024-12-25 10:25:11",
      level: "error",
      message: "Failed to send email notification - SMTP timeout",
      source: "email-service"
    },
    {
      id: 4,
      timestamp: "2024-12-25 10:22:33",
      level: "info",
      message: "Database backup completed successfully",
      source: "backup-service"
    },
    {
      id: 5,
      timestamp: "2024-12-25 10:20:07",
      level: "info",
      message: "New event created: Atlas Mountains Winter Trek",
      source: "events-api"
    }
  ];

  // Mock performance data
  const performanceMetrics = {
    pageLoadTime: 1.2,
    apiResponseTime: 245,
    databaseQueryTime: 12,
    activeUsers: 47,
    requestsPerMinute: 134,
    errorRate: 0.02
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'offline':
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const MetricCard = ({ metric }: { metric: SystemMetric }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
        {getStatusIcon(metric.status)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}{metric.unit}</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full ${
              metric.status === 'good' ? 'bg-green-500' :
              metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(metric.value, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Threshold: {metric.threshold}{metric.unit}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">System Monitoring</h1>
            <p className="text-muted-foreground">Real-time system health and performance monitoring</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleString()}
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-xl font-bold">Online</span>
              </div>
              <p className="text-xs text-muted-foreground">Uptime: 15d 3h 45m</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.requestsPerMinute}</div>
              <p className="text-xs text-muted-foreground">API requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(performanceMetrics.errorRate * 100).toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">High Memory Usage</div>
                        <div className="text-sm text-muted-foreground">Memory usage at 67% - approaching threshold</div>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-medium">Email Service Degraded</div>
                        <div className="text-sm text-muted-foreground">SMTP response time above normal - 890ms average</div>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(service.status)}
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Uptime: {service.uptime} • Last check: {service.lastCheck}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {service.responseTime}ms response
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Page Load Time</span>
                      <span className="font-medium">{performanceMetrics.pageLoadTime}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response Time</span>
                      <span className="font-medium">{performanceMetrics.apiResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database Query Time</span>
                      <span className="font-medium">{performanceMetrics.databaseQueryTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Requests Per Minute</span>
                      <span className="font-medium">{performanceMetrics.requestsPerMinute}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-2" />
                      <p>Performance chart visualization</p>
                      <p className="text-xs">Real-time metrics would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Badge className={getLogLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm">{log.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.timestamp} • {log.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    Load More Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SystemMonitoring;