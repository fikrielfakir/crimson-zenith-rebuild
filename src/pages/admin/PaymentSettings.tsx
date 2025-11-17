import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payment settings will be configured here</p>
        </CardContent>
      </Card>
    </div>
  );
}
