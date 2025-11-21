import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Plus, Trash2, GripVertical, Eye } from 'lucide-react';

interface NavigationLink {
  label: string;
  url: string;
  isExternal: boolean;
  icon?: string;
  hasDropdown?: boolean;
}

export default function NavbarSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Logo Settings
  const [logoType, setLogoType] = useState<'image' | 'text'>('image');
  const [logoText, setLogoText] = useState('The Journey Association');
  const [logoImage, setLogoImage] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Navigation Links
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([
    { label: 'Discover', url: '/discover', isExternal: false, hasDropdown: true },
    { label: 'Activities', url: '/activities', isExternal: false },
    { label: 'Projects', url: '/projects', isExternal: false },
    { label: 'Clubs', url: '/clubs', isExternal: false },
    { label: 'Gallery', url: '/gallery', isExternal: false },
    { label: 'Blog', url: '/blog', isExternal: false },
    { label: 'Talents', url: '/talents', isExternal: false, hasDropdown: true },
    { label: 'Contact', url: '/contact', isExternal: false },
  ]);
  
  // Feature Toggles
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState(['EN', 'FR', 'AR']);
  const [showDarkModeToggle, setShowDarkModeToggle] = useState(true);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showJoinButton, setShowJoinButton] = useState(true);
  
  // Button Settings
  const [loginButtonText, setLoginButtonText] = useState('Login');
  const [loginButtonLink, setLoginButtonLink] = useState('/admin/login');
  const [joinButtonText, setJoinButtonText] = useState('Donate');
  const [joinButtonLink, setJoinButtonLink] = useState('/donate');
  const [joinButtonStyle, setJoinButtonStyle] = useState('secondary');
  
  // Styling
  const [navbarBgColor, setNavbarBgColor] = useState('#ffffff');
  const [navbarTextColor, setNavbarTextColor] = useState('#1a365d');
  const [navbarHeight, setNavbarHeight] = useState('80');
  const [navbarTransparency, setNavbarTransparency] = useState('95');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/cms/navbar-settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setLogoType(data.logoType || 'image');
          setLogoText(data.logoText || '');
          setLogoImage(data.logoImageUrl || '');
          setNavLinks(data.navigationLinks || []);
          setShowLanguageSwitcher(data.showLanguageSwitcher ?? true);
          setAvailableLanguages(data.availableLanguages || ['EN', 'FR', 'AR']);
          setShowDarkModeToggle(data.showDarkModeToggle ?? true);
          setShowLoginButton(data.showLoginButton ?? true);
          setShowJoinButton(data.showJoinButton ?? true);
          setLoginButtonText(data.loginButtonText || 'Login');
          setLoginButtonLink(data.loginButtonLink || '/admin/login');
          setJoinButtonText(data.joinButtonText || 'Donate');
          setJoinButtonLink(data.joinButtonLink || '/donate');
          setJoinButtonStyle(data.joinButtonStyle || 'secondary');
          setNavbarBgColor(data.navbarBgColor || '#ffffff');
          setNavbarTextColor(data.navbarTextColor || '#1a365d');
          setNavbarHeight(data.navbarHeight || '80');
          setNavbarTransparency(data.navbarTransparency || '95');
        }
      }
    } catch (error) {
      console.error('Error loading navbar settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      formData.append('logoType', logoType);
      formData.append('logoText', logoText);
      if (logoFile) {
        formData.append('logoImage', logoFile);
      }
      formData.append('navigationLinks', JSON.stringify(navLinks));
      formData.append('showLanguageSwitcher', String(showLanguageSwitcher));
      formData.append('availableLanguages', JSON.stringify(availableLanguages));
      formData.append('showDarkModeToggle', String(showDarkModeToggle));
      formData.append('showLoginButton', String(showLoginButton));
      formData.append('showJoinButton', String(showJoinButton));
      formData.append('loginButtonText', loginButtonText);
      formData.append('loginButtonLink', loginButtonLink);
      formData.append('joinButtonText', joinButtonText);
      formData.append('joinButtonLink', joinButtonLink);
      formData.append('joinButtonStyle', joinButtonStyle);
      formData.append('navbarBgColor', navbarBgColor);
      formData.append('navbarTextColor', navbarTextColor);
      formData.append('navbarHeight', navbarHeight);
      formData.append('navbarTransparency', navbarTransparency);

      const response = await fetch('/api/admin/cms/navbar-settings', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Navbar settings saved successfully' });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving navbar settings:', error);
      toast({ title: 'Error', description: 'Failed to save navbar settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: 'New Link', url: '/', isExternal: false }]);
  };

  const removeNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const updateNavLink = (index: number, field: keyof NavigationLink, value: any) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: value };
    setNavLinks(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Navbar Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your website's navigation bar</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Links</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
        </TabsList>

        {/* Logo Tab */}
        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Configuration</CardTitle>
              <CardDescription>Upload your logo or use text branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo Type</Label>
                <Select value={logoType} onValueChange={(value: 'image' | 'text') => setLogoType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image Logo</SelectItem>
                    <SelectItem value="text">Text Logo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {logoType === 'image' ? (
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo Image</Label>
                  <div className="flex flex-col gap-4">
                    {logoImage && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <img src={logoImage} alt="Logo preview" className="h-16 object-contain" />
                      </div>
                    )}
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended: PNG or SVG format, transparent background, 200x80px
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="logo-text">Logo Text</Label>
                  <Input
                    id="logo-text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="Your Brand Name"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Links Tab */}
        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Add, remove, or reorder navigation links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {navLinks.map((link, index) => (
                <div key={index} className="flex items-start gap-2 p-4 border rounded-lg bg-gray-50">
                  <Button variant="ghost" size="sm" className="cursor-move">
                    <GripVertical className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => updateNavLink(index, 'label', e.target.value)}
                        placeholder="Link Label"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateNavLink(index, 'url', e.target.value)}
                        placeholder="/page"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={link.isExternal}
                        onCheckedChange={(checked) => updateNavLink(index, 'isExternal', checked)}
                      />
                      <Label>External Link</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={link.hasDropdown || false}
                        onCheckedChange={(checked) => updateNavLink(index, 'hasDropdown', checked)}
                      />
                      <Label>Has Dropdown</Label>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNavLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addNavLink} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Navigation Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CTA Buttons</CardTitle>
              <CardDescription>Configure login and join buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Login Button */}
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={showLoginButton} onCheckedChange={setShowLoginButton} />
                  <Label>Show Login Button</Label>
                </div>
                {showLoginButton && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={loginButtonText} onChange={(e) => setLoginButtonText(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Link</Label>
                      <Input value={loginButtonLink} onChange={(e) => setLoginButtonLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Join/Donate Button */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={showJoinButton} onCheckedChange={setShowJoinButton} />
                  <Label>Show Join/Donate Button</Label>
                </div>
                {showJoinButton && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={joinButtonText} onChange={(e) => setJoinButtonText(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Link</Label>
                      <Input value={joinButtonLink} onChange={(e) => setJoinButtonLink(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Style</Label>
                      <Select value={joinButtonStyle} onValueChange={setJoinButtonStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navbar Features</CardTitle>
              <CardDescription>Toggle additional navbar functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={showLanguageSwitcher} onCheckedChange={setShowLanguageSwitcher} />
                  <Label>Show Language Switcher</Label>
                </div>
                {showLanguageSwitcher && (
                  <div className="space-y-2 pl-6">
                    <Label>Available Languages (comma-separated)</Label>
                    <Input
                      value={availableLanguages.join(', ')}
                      onChange={(e) => setAvailableLanguages(e.target.value.split(',').map(l => l.trim()))}
                      placeholder="EN, FR, AR"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={showDarkModeToggle} onCheckedChange={setShowDarkModeToggle} />
                <Label>Show Dark Mode Toggle</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Styling Tab */}
        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navbar Styling</CardTitle>
              <CardDescription>Customize navbar appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="navbar-bg">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="navbar-bg"
                      type="color"
                      value={navbarBgColor}
                      onChange={(e) => setNavbarBgColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={navbarBgColor}
                      onChange={(e) => setNavbarBgColor(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navbar-text">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="navbar-text"
                      type="color"
                      value={navbarTextColor}
                      onChange={(e) => setNavbarTextColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={navbarTextColor}
                      onChange={(e) => setNavbarTextColor(e.target.value)}
                      placeholder="#1a365d"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navbar-height">Height (px)</Label>
                  <Input
                    id="navbar-height"
                    type="number"
                    value={navbarHeight}
                    onChange={(e) => setNavbarHeight(e.target.value)}
                    min="60"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navbar-transparency">Background Opacity (%)</Label>
                  <Input
                    id="navbar-transparency"
                    type="number"
                    value={navbarTransparency}
                    onChange={(e) => setNavbarTransparency(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
