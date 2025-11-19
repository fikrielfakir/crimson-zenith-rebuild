import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Globe, Search, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState('The Journey Association');

  const handleSave = () => {
    toast({ title: 'Settings saved successfully' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your website settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

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
              <CardDescription>Configure basic site information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Your site name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  placeholder="Brief description of your site"
                  rows={3}
                  defaultValue="Experience Morocco's soul through sustainable journeys and cultural connections."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="contact@example.com"
                  defaultValue="contact@thejourneyassociation.org"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue="Africa/Casablanca"
                >
                  <option value="Africa/Casablanca">Africa/Casablanca (Morocco)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Europe/Paris">Europe/Paris (CET)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance">Maintenance mode</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="registration" defaultChecked />
                <Label htmlFor="registration">Allow user registration</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your site for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  placeholder="Site title for search engines"
                  defaultValue="The Journey Association | Sustainable Travel in Morocco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Description for search results"
                  rows={3}
                  defaultValue="Discover authentic Moroccan experiences through sustainable tourism. Connect with local communities, explore cultural heritage, and create meaningful journeys."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input
                  id="meta-keywords"
                  placeholder="Comma-separated keywords"
                  defaultValue="morocco travel, sustainable tourism, cultural experiences, adventure clubs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-image">Open Graph Image URL</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input id="og-image" placeholder="https://example.com/og-image.jpg" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="noindex" />
                <Label htmlFor="noindex">Discourage search engines from indexing this site</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Connect external services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Search className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-muted-foreground">Track website analytics</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <Input placeholder="Tracking ID (e.g., G-XXXXXXXXXX)" />
              </div>

              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Google Maps</h4>
                      <p className="text-sm text-muted-foreground">Enable map features</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Input placeholder="API Key" type="password" />
              </div>

              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Stripe</h4>
                      <p className="text-sm text-muted-foreground">Payment processing</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="grid gap-2">
                  <Input placeholder="Publishable Key" />
                  <Input placeholder="Secret Key" type="password" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Email Service (SMTP)</h4>
                      <p className="text-sm text-muted-foreground">Configure email delivery</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="grid gap-2">
                  <Input placeholder="SMTP Host" />
                  <Input placeholder="SMTP Port" type="number" defaultValue="587" />
                  <Input placeholder="Username" />
                  <Input placeholder="Password" type="password" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
