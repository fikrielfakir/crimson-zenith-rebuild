import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import { Cookie, Save, RotateCcw, Eye, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookieSettings {
  enabled: boolean;
  title: string;
  description: string;
  delayMs: number;
  position: 'bottom' | 'top';
  theme: 'gradient' | 'solid' | 'minimal';
  primaryColor: string;
  secondaryColor: string;
  showCustomizeButton: boolean;
  necessaryAlwaysEnabled: boolean;
  categories: {
    functional: { enabled: boolean; name: string; description: string };
    analytics: { enabled: boolean; name: string; description: string };
    marketing: { enabled: boolean; name: string; description: string };
  };
}

const defaultSettings: CookieSettings = {
  enabled: true,
  title: "🍪 We use cookies to enhance your experience",
  description: "Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. Essential cookies are always active.",
  delayMs: 1500,
  position: 'bottom',
  theme: 'gradient',
  primaryColor: '#f97316',
  secondaryColor: '#3b82f6',
  showCustomizeButton: true,
  necessaryAlwaysEnabled: true,
  categories: {
    functional: {
      enabled: true,
      name: "Functional Cookies",
      description: "Remember your preferences and settings"
    },
    analytics: {
      enabled: true,
      name: "Analytics Cookies",
      description: "Help us understand site usage"
    },
    marketing: {
      enabled: true,
      name: "Marketing Cookies",
      description: "Personalized content and ads"
    }
  }
};

const CookieSettings = () => {
  const [settings, setSettings] = useState<CookieSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminCookieSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading cookie settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminCookieSettings', JSON.stringify(settings));
    localStorage.setItem('cookieBannerConfig', JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Cookie banner settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "Cookie banner settings have been reset to defaults.",
    });
  };

  const handlePreview = () => {
    // Clear existing consent to show banner again
    localStorage.removeItem('cookieConsent');
    window.location.reload();
  };

  const updateSettings = (updates: Partial<CookieSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateCategory = (category: keyof CookieSettings['categories'], updates: any) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: { ...prev.categories[category], ...updates }
      }
    }));
    setHasChanges(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Cookie className="w-8 h-8 text-orange-500" />
              Cookie Banner Settings
            </h1>
            <p className="text-muted-foreground">
              Configure the cookie consent banner displayed to users
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Unsaved changes
              </Badge>
            )}
            <Button onClick={handlePreview} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Cookie Banner</Label>
                  <div className="text-sm text-muted-foreground">
                    Show cookie consent banner to users
                  </div>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(enabled) => updateSettings({ enabled })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => updateSettings({ title: e.target.value })}
                  placeholder="Cookie banner title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => updateSettings({ description: e.target.value })}
                  placeholder="Cookie banner description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delay">Show Delay (milliseconds)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  max="10000"
                  step="500"
                  value={settings.delayMs}
                  onChange={(e) => updateSettings({ delayMs: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Behavior Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Behavior Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Customize Button</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow users to customize cookie preferences
                  </div>
                </div>
                <Switch
                  checked={settings.showCustomizeButton}
                  onCheckedChange={(showCustomizeButton) => updateSettings({ showCustomizeButton })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Necessary Always Enabled</Label>
                  <div className="text-sm text-muted-foreground">
                    Prevent users from disabling necessary cookies
                  </div>
                </div>
                <Switch
                  checked={settings.necessaryAlwaysEnabled}
                  onCheckedChange={(necessaryAlwaysEnabled) => updateSettings({ necessaryAlwaysEnabled })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">Cookie Categories</Label>
                
                {Object.entries(settings.categories).map(([key, category]) => (
                  <Card key={key} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Enable {category.name}</Label>
                        <Switch
                          checked={category.enabled}
                          onCheckedChange={(enabled) => updateCategory(key as keyof CookieSettings['categories'], { enabled })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          value={category.name}
                          onChange={(e) => updateCategory(key as keyof CookieSettings['categories'], { name: e.target.value })}
                          placeholder="Category name"
                        />
                        <Input
                          value={category.description}
                          onChange={(e) => updateCategory(key as keyof CookieSettings['categories'], { description: e.target.value })}
                          placeholder="Category description"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <Cookie className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie Banner Preview</h3>
              <p className="text-gray-500 mb-4">
                Changes will be reflected when the banner is shown again.
              </p>
              <Button onClick={handlePreview} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Show Banner Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CookieSettings;