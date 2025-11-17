import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClubsPendingApproval() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pending Club Approvals</h1>
      <Card>
        <CardHeader>
          <CardTitle>Clubs Awaiting Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pending clubs approval interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
