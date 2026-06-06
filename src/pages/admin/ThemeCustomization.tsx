import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThemeCustomization() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Theme Customization</h1>
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme customization options will be here</p>
        </CardContent>
      </Card>
    </div>
  );
}
