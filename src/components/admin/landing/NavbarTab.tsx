import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { useNavbarSettings, useUpdateNavbarSettings, type NavbarSettings } from "@/hooks/useCMS";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NavigationLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

const NavbarTab = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<NavbarSettings>>({});
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');

  const { data: settings, isLoading } = useNavbarSettings();

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setNavLinks(Array.isArray(settings.navigationLinks) ? settings.navigationLinks : []);
      setLanguages(Array.isArray(settings.availableLanguages) ? settings.availableLanguages : ['EN', 'FR', 'AR']);
    }
  }, [settings]);

  const updateMutation = useUpdateNavbarSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit = {
      ...formData,
      navigationLinks: navLinks,
      availableLanguages: languages,
    };

    updateMutation.mutate(dataToSubmit, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Navbar settings updated successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update navbar settings",
          variant: "destructive",
        });
      },
    });
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: '', url: '', isExternal: false }]);
  };

  const updateNavLink = (index: number, field: keyof NavigationLink, value: string | boolean) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: value };
    setNavLinks(updated);
  };

  const deleteNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const moveNavLink = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === navLinks.length - 1)) return;
    
    const updated = [...navLinks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setNavLinks(updated);
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim().toUpperCase())) {
      setLanguages([...languages, newLanguage.trim().toUpperCase()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Logo Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoType">Logo Type</Label>
            <Select
              value={formData.logoType || 'image'}
              onValueChange={(value) => setFormData({ ...formData, logoType: value })}
            >
              <SelectTrigger id="logoType">
                <SelectValue placeholder="Select logo type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="svg">SVG Code</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.logoType === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="logoImageId">Logo Image ID</Label>
              <Input
                id="logoImageId"
                type="number"
                value={formData.logoImageId || ''}
                onChange={(e) => setFormData({ ...formData, logoImageId: parseInt(e.target.value) || null })}
                placeholder="Media asset ID"
              />
              <p className="text-sm text-muted-foreground">Upload image in Media Library and use its ID</p>
            </div>
          )}

          {formData.logoType === 'svg' && (
            <div className="space-y-2">
              <Label htmlFor="logoSvg">SVG Code</Label>
              <Textarea
                id="logoSvg"
                value={formData.logoSvg || ''}
                onChange={(e) => setFormData({ ...formData, logoSvg: e.target.value })}
                placeholder="<svg>...</svg>"
                rows={6}
              />
            </div>
          )}

          {formData.logoType === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="logoText">Logo Text</Label>
              <Input
                id="logoText"
                value={formData.logoText || ''}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                placeholder="Adventure Morocco"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Navigation Links */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Navigation Links</h3>
          <Button type="button" size="sm" onClick={addNavLink}>
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
        <div className="space-y-3">
          {navLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => moveNavLink(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => moveNavLink(index, 'down')}
                  disabled={index === navLinks.length - 1}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateNavLink(index, 'label', e.target.value)}
                  placeholder="Label"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateNavLink(index, 'url', e.target.value)}
                  placeholder="URL"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={link.isExternal || false}
                    onCheckedChange={(checked) => updateNavLink(index, 'isExternal', checked)}
                  />
                  <Label className="text-sm">External</Label>
                  {link.isExternal && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => deleteNavLink(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {navLinks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No navigation links added yet</p>
          )}
        </div>
      </Card>

      {/* Language & UI Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Language & UI Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showLanguageSwitcher">Show Language Switcher</Label>
            <Switch
              id="showLanguageSwitcher"
              checked={formData.showLanguageSwitcher ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, showLanguageSwitcher: checked })}
            />
          </div>

          {formData.showLanguageSwitcher && (
            <div className="space-y-2">
              <Label>Available Languages</Label>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add language (e.g., EN)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                />
                <Button type="button" size="sm" onClick={addLanguage}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.map((lang) => (
                  <div key={lang} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md">
                    <span className="text-sm font-medium">{lang}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-auto p-0 px-1"
                      onClick={() => removeLanguage(lang)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="showDarkModeToggle">Show Dark Mode Toggle</Label>
            <Switch
              id="showDarkModeToggle"
              checked={formData.showDarkModeToggle ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, showDarkModeToggle: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Login Button Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Login Button Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showLoginButton">Show Login Button</Label>
            <Switch
              id="showLoginButton"
              checked={formData.showLoginButton ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, showLoginButton: checked })}
            />
          </div>

          {formData.showLoginButton && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loginButtonText">Button Text</Label>
                <Input
                  id="loginButtonText"
                  value={formData.loginButtonText || ''}
                  onChange={(e) => setFormData({ ...formData, loginButtonText: e.target.value })}
                  placeholder="Login"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginButtonLink">Button Link</Label>
                <Input
                  id="loginButtonLink"
                  value={formData.loginButtonLink || ''}
                  onChange={(e) => setFormData({ ...formData, loginButtonLink: e.target.value })}
                  placeholder="/admin/login"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Join Button Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Join Button Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showJoinButton">Show Join Button</Label>
            <Switch
              id="showJoinButton"
              checked={formData.showJoinButton ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, showJoinButton: checked })}
            />
          </div>

          {formData.showJoinButton && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joinButtonText">Button Text</Label>
                <Input
                  id="joinButtonText"
                  value={formData.joinButtonText || ''}
                  onChange={(e) => setFormData({ ...formData, joinButtonText: e.target.value })}
                  placeholder="Join Us"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinButtonLink">Button Link</Label>
                <Input
                  id="joinButtonLink"
                  value={formData.joinButtonLink || ''}
                  onChange={(e) => setFormData({ ...formData, joinButtonLink: e.target.value })}
                  placeholder="/join"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinButtonStyle">Button Style</Label>
                <Select
                  value={formData.joinButtonStyle || 'secondary'}
                  onValueChange={(value) => setFormData({ ...formData, joinButtonStyle: value })}
                >
                  <SelectTrigger id="joinButtonStyle">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setFormData(settings || {});
            setNavLinks(Array.isArray(settings?.navigationLinks) ? settings.navigationLinks : []);
            setLanguages(Array.isArray(settings?.availableLanguages) ? settings.availableLanguages : ['EN', 'FR', 'AR']);
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default NavbarTab;
