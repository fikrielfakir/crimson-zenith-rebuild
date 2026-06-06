import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function JoinUsConfig() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Join Us Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Join Us form configuration will be here</p>
        </CardContent>
      </Card>
    </div>
  );
}
