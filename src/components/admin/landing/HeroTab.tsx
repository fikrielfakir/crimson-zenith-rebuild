import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface HeroSettings {
  id?: string;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  overlayOpacity?: number;
}

const HeroTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<HeroSettings>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['hero-settings'],
    queryFn: async () => {
      const response = await fetch('/api/cms/hero');
      if (!response.ok) throw new Error('Failed to fetch hero settings');
      return response.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: HeroSettings) => {
      const response = await fetch('/api/admin/cms/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update hero settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-settings'] });
      toast({
        title: "Success",
        description: "Hero settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update hero settings",
        variant: "destructive",
      });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Main hero title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Hero subtitle"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundImage">Background Image URL</Label>
        <Input
          id="backgroundImage"
          value={formData.backgroundImage || ''}
          onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
          placeholder="/path/to/image.jpg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ctaText">CTA Button Text</Label>
          <Input
            id="ctaText"
            value={formData.ctaText || ''}
            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
            placeholder="Get Started"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaLink">CTA Button Link</Label>
          <Input
            id="ctaLink"
            value={formData.ctaLink || ''}
            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
            placeholder="/signup"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setFormData(settings || {})}
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

export default HeroTab;
