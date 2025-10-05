import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FooterSettings {
  id?: string;
  copyrightText?: string;
  description?: string;
  links?: Array<{ label: string; url: string }>;
  socialLinks?: Record<string, string>;
  newsletterEnabled?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
}

const FooterTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FooterSettings>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['footer-settings'],
    queryFn: async () => {
      const response = await fetch('/api/cms/footer');
      if (!response.ok) throw new Error('Failed to fetch footer settings');
      return response.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: FooterSettings) => {
      const response = await fetch('/api/admin/cms/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update footer settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-settings'] });
      toast({ title: "Success", description: "Footer settings updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update footer settings", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="space-y-2">
          <Label>Copyright Text</Label>
          <Input
            value={formData.copyrightText || ''}
            onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
            placeholder="© 2024 Company Name. All rights reserved."
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Brief description of your company..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input
              value={formData.socialLinks?.facebook || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialLinks: { ...formData.socialLinks, facebook: e.target.value }
              })}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialLinks: { ...formData.socialLinks, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label>Twitter</Label>
            <Input
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialLinks: { ...formData.socialLinks, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label>YouTube</Label>
            <Input
              value={formData.socialLinks?.youtube || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialLinks: { ...formData.socialLinks, youtube: e.target.value }
              })}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Newsletter</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.newsletterEnabled || false}
            onCheckedChange={(checked) => setFormData({ ...formData, newsletterEnabled: checked })}
          />
          <Label>Enable newsletter signup</Label>
        </div>
        {formData.newsletterEnabled && (
          <>
            <div className="space-y-2">
              <Label>Newsletter Title</Label>
              <Input
                value={formData.newsletterTitle || ''}
                onChange={(e) => setFormData({ ...formData, newsletterTitle: e.target.value })}
                placeholder="Stay Updated"
              />
            </div>
            <div className="space-y-2">
              <Label>Newsletter Description</Label>
              <Input
                value={formData.newsletterDescription || ''}
                onChange={(e) => setFormData({ ...formData, newsletterDescription: e.target.value })}
                placeholder="Subscribe to our newsletter..."
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setFormData(settings || {})}>
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

export default FooterTab;
