import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Upload, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LandingManagement() {
  const { toast } = useToast();
  const [heroTitle, setHeroTitle] = useState('WHERE');
  const [heroSubtitle, setHeroSubtitle] = useState("Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.");

  const handleSave = () => {
    toast({ title: 'Landing page updated successfully' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Landing Page Management</h1>
          <p className="text-muted-foreground mt-1">Customize your website's landing page content</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="sections">Page Sections</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Customize the main hero section of your landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Main headline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Supporting text"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex items-center space-x-2">
                  <Input type="file" accept="image/*" />
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="show-hero" defaultChecked />
                <Label htmlFor="show-hero">Show hero section</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Sections</CardTitle>
              <CardDescription>Manage different sections of the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">About Section</h4>
                    <p className="text-sm text-muted-foreground">Introduction to The Journey Association</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Features Section</h4>
                    <p className="text-sm text-muted-foreground">Highlight key features and benefits</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Testimonials</h4>
                    <p className="text-sm text-muted-foreground">User reviews and success stories</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Call to Action</h4>
                    <p className="text-sm text-muted-foreground">Encourage visitors to take action</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>Customize footer content and links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Textarea
                  id="footer-text"
                  placeholder="Copyright notice and additional information"
                  rows={2}
                  defaultValue="© 2025 The Journey Association. All rights reserved."
                />
              </div>

              <div className="space-y-2">
                <Label>Social Media Links</Label>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Label className="w-20">Facebook</Label>
                    <Input placeholder="Facebook URL" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="w-20">Instagram</Label>
                    <Input placeholder="Instagram URL" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="w-20">Twitter</Label>
                    <Input placeholder="Twitter URL" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="show-footer" defaultChecked />
                <Label htmlFor="show-footer">Show footer</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
