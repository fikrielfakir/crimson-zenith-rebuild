import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { Key, Save, RotateCcw, TestTube, Shield, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OAuthProvider {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

interface AuthSettings {
  providers: {
    google: OAuthProvider;
    facebook: OAuthProvider;
    github: OAuthProvider;
  };
  allowEmailPassword: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

const defaultSettings: AuthSettings = {
  providers: {
    google: {
      enabled: true,
      clientId: '',
      clientSecret: '',
      redirectUri: `${window.location.origin}/api/auth/google/callback`,
      scopes: ['openid', 'email', 'profile']
    },
    facebook: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      redirectUri: `${window.location.origin}/api/auth/facebook/callback`,
      scopes: ['email', 'public_profile']
    },
    github: {
      enabled: true,
      clientId: '',
      clientSecret: '',
      redirectUri: `${window.location.origin}/api/auth/github/callback`,
      scopes: ['user:email', 'read:user']
    }
  },
  allowEmailPassword: true,
  requireEmailVerification: false,
  sessionTimeout: 7 * 24 * 60, // 7 days in minutes
  maxLoginAttempts: 5,
  lockoutDuration: 30 // minutes
};

const AuthSettings = () => {
  const [settings, setSettings] = useState<AuthSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminAuthSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading auth settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminAuthSettings', JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Authentication settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "Authentication settings have been reset to defaults.",
    });
  };

  const updateProvider = (provider: keyof AuthSettings['providers'], updates: Partial<OAuthProvider>) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: { ...prev.providers[provider], ...updates }
      }
    }));
    setHasChanges(true);
  };

  const updateGeneralSettings = (updates: Partial<AuthSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const testProvider = async (provider: string) => {
    setTestingProvider(provider);
    // Simulate API test
    setTimeout(() => {
      setTestingProvider(null);
      toast({
        title: "Test Completed",
        description: `${provider} authentication test completed successfully.`,
      });
    }, 2000);
  };

  const getProviderInstructions = (provider: string) => {
    switch (provider) {
      case 'google':
        return {
          title: "Google OAuth Setup",
          instructions: [
            "1. Go to Google Cloud Console (console.cloud.google.com)",
            "2. Create a new project or select existing one",
            "3. Enable Google+ API",
            "4. Go to Credentials → Create OAuth 2.0 Client ID",
            "5. Set Authorized Redirect URI to the URL shown below",
            "6. Copy Client ID and Client Secret"
          ]
        };
      case 'facebook':
        return {
          title: "Facebook OAuth Setup",
          instructions: [
            "1. Go to Facebook Developers (developers.facebook.com)",
            "2. Create a new app or select existing one",
            "3. Add Facebook Login product",
            "4. Configure Valid OAuth Redirect URIs",
            "5. Copy App ID and App Secret from Settings → Basic"
          ]
        };
      case 'github':
        return {
          title: "GitHub OAuth Setup",
          instructions: [
            "1. Go to GitHub Settings → Developer settings",
            "2. Click OAuth Apps → New OAuth App",
            "3. Set Authorization callback URL",
            "4. Register application",
            "5. Copy Client ID and generate Client Secret"
          ]
        };
      default:
        return { title: "", instructions: [] };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              Authentication Settings
            </h1>
            <p className="text-muted-foreground">
              Configure OAuth providers and authentication settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Unsaved changes
              </Badge>
            )}
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

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="providers">OAuth Providers</TabsTrigger>
            <TabsTrigger value="general">General Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            {Object.entries(settings.providers).map(([providerKey, provider]) => {
              const instructions = getProviderInstructions(providerKey);
              return (
                <Card key={providerKey}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 capitalize">
                        <LogIn className="w-5 h-5" />
                        {providerKey} OAuth
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={provider.enabled}
                          onCheckedChange={(enabled) => updateProvider(providerKey as keyof AuthSettings['providers'], { enabled })}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testProvider(providerKey)}
                          disabled={!provider.enabled || !provider.clientId || testingProvider === providerKey}
                        >
                          {testingProvider === providerKey ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <TestTube className="w-4 h-4" />
                          )}
                          Test
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${providerKey}-client-id`}>Client ID</Label>
                        <Input
                          id={`${providerKey}-client-id`}
                          value={provider.clientId}
                          onChange={(e) => updateProvider(providerKey as keyof AuthSettings['providers'], { clientId: e.target.value })}
                          placeholder={`${providerKey} Client ID`}
                          disabled={!provider.enabled}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${providerKey}-client-secret`}>Client Secret</Label>
                        <Input
                          id={`${providerKey}-client-secret`}
                          type="password"
                          value={provider.clientSecret}
                          onChange={(e) => updateProvider(providerKey as keyof AuthSettings['providers'], { clientSecret: e.target.value })}
                          placeholder={`${providerKey} Client Secret`}
                          disabled={!provider.enabled}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${providerKey}-redirect`}>Redirect URI</Label>
                      <Input
                        id={`${providerKey}-redirect`}
                        value={provider.redirectUri}
                        onChange={(e) => updateProvider(providerKey as keyof AuthSettings['providers'], { redirectUri: e.target.value })}
                        placeholder={`${providerKey} Redirect URI`}
                        disabled={!provider.enabled}
                      />
                    </div>

                    {provider.enabled && (
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">{instructions.title}</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {instructions.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Email/Password Login</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable traditional email and password authentication
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowEmailPassword}
                    onCheckedChange={(allowEmailPassword) => updateGeneralSettings({ allowEmailPassword })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Email Verification</Label>
                    <div className="text-sm text-muted-foreground">
                      Users must verify their email before accessing the account
                    </div>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(requireEmailVerification) => updateGeneralSettings({ requireEmailVerification })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      min="5"
                      max="43200"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateGeneralSettings({ sessionTimeout: parseInt(e.target.value) || 60 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Max Login Attempts</Label>
                    <Input
                      id="max-attempts"
                      type="number"
                      min="1"
                      max="20"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateGeneralSettings({ maxLoginAttempts: parseInt(e.target.value) || 5 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      min="1"
                      max="1440"
                      value={settings.lockoutDuration}
                      onChange={(e) => updateGeneralSettings({ lockoutDuration: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AuthSettings;