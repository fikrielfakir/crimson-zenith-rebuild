import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationsManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Applications Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Applications management interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
