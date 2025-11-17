import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserRolesManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Roles & Permissions</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Roles Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Roles and permissions management interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
