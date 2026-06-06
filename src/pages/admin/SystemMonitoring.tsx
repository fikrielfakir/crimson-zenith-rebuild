import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SystemMonitoring() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Monitoring</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">System monitoring interface will be implemented here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Database monitoring will be shown here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
