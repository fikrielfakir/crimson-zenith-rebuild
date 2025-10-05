import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SeoSettings {
  id?: string;
  siteTitle?: string;
  siteDescription?: string;
  keywords?: string;
  ogImage?: string;
  twitterHandle?: string;
}

const SeoTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SeoSettings>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: async () => {
      const response = await fetch('/api/cms/seo');
      if (!response.ok) throw new Error('Failed to fetch SEO settings');
      return response.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: SeoSettings) => {
      const response = await fetch('/api/admin/cms/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update SEO settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-settings'] });
      toast({ title: "Success", description: "SEO settings updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update SEO settings", variant: "destructive" });
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
        <h3 className="text-lg font-semibold">Basic SEO</h3>
        <div className="space-y-2">
          <Label>Site Title</Label>
          <Input
            value={formData.siteTitle || ''}
            onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            placeholder="Your Site Name - Tagline"
          />
          <p className="text-xs text-muted-foreground">
            Appears in browser tabs and search results. Keep under 60 characters.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Site Description</Label>
          <Textarea
            value={formData.siteDescription || ''}
            onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            rows={3}
            placeholder="A brief description of your website..."
          />
          <p className="text-xs text-muted-foreground">
            Shown in search results. Keep under 160 characters for best results.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Keywords</Label>
          <Textarea
            value={formData.keywords || ''}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            rows={2}
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated list of relevant keywords
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media</h3>
        <div className="space-y-2">
          <Label>Open Graph Image URL</Label>
          <Input
            value={formData.ogImage || ''}
            onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
            placeholder="/og-image.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Image shown when your site is shared on social media. Recommended size: 1200x630px
          </p>
        </div>
        <div className="space-y-2">
          <Label>Twitter Handle</Label>
          <Input
            value={formData.twitterHandle || ''}
            onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
            placeholder="@yourhandle"
          />
          <p className="text-xs text-muted-foreground">
            Your Twitter username for Twitter Card metadata
          </p>
        </div>
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

export default SeoTab;
