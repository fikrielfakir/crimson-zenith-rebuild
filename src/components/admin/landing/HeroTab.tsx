import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useHeroSettings, useUpdateHeroSettings, type HeroSettings } from "@/hooks/useCMS";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HeroTab = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<HeroSettings>>({});

  const { data: settings, isLoading } = useHeroSettings();

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useUpdateHeroSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
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
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Background Media</CardTitle>
          <CardDescription>
            Upload and manage the hero section background image or video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaUpload
            mediaType={(formData.backgroundType as 'image' | 'video') || 'image'}
            currentMediaId={formData.backgroundMediaId}
            currentMediaUrl={null}
            onMediaChange={(mediaId, mediaUrl) => {
              setFormData({ ...formData, backgroundMediaId: mediaId });
            }}
            onTypeChange={(type) => {
              setFormData({ ...formData, backgroundType: type });
            }}
          />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
          <CardDescription>
            Manage the main title, subtitle, and call-to-action buttons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryButtonText">Primary Button Text</Label>
              <Input
                id="primaryButtonText"
                value={formData.primaryButtonText || ''}
                onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                placeholder="Start Your Journey"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryButtonLink">Primary Button Link</Label>
              <Input
                id="primaryButtonLink"
                value={formData.primaryButtonLink || ''}
                onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                placeholder="/discover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secondaryButtonText">Secondary Button Text</Label>
              <Input
                id="secondaryButtonText"
                value={formData.secondaryButtonText || ''}
                onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                placeholder="Explore Clubs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryButtonLink">Secondary Button Link</Label>
              <Input
                id="secondaryButtonLink"
                value={formData.secondaryButtonLink || ''}
                onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                placeholder="/clubs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
