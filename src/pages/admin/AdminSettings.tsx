import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">General settings will be configured here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">SEO configuration will be here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Third-party integrations will be configured here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
