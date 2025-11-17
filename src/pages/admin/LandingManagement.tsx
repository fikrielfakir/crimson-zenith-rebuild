import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LandingManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Landing Page Management</h1>
      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Hero section customization will be here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Page Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Page sections management will be here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Footer customization will be here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
