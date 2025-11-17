import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookieSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cookie Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cookie Consent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cookie consent settings will be configured here</p>
        </CardContent>
      </Card>
    </div>
  );
}
