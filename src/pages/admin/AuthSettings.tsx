import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Authentication Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Auth Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Authentication settings will be configured here</p>
        </CardContent>
      </Card>
    </div>
  );
}
