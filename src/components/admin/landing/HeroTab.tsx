import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon, Video, Type, Palette, MousePointer2, Eye, Plus, Trash2 } from "lucide-react";
import { useHeroSettings, useUpdateHeroSettings, type HeroSettings } from "@/hooks/useCMS";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const HeroTab = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<HeroSettings>>({});
  const [currentMediaUrl, setCurrentMediaUrl] = useState<string | null>(null);
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>([]);

  const { data: settings, isLoading } = useHeroSettings();

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setTypewriterTexts(Array.isArray(settings.typewriterTexts) ? settings.typewriterTexts : []);
      
      if (settings.backgroundMediaId) {
        fetch(`/api/admin/cms/media/${settings.backgroundMediaId}`, {
          credentials: 'include'
        })
          .then(res => res.json())
          .then(asset => {
            if (asset && asset.fileUrl) {
              setCurrentMediaUrl(asset.fileUrl);
            }
          })
          .catch(err => console.error('Error fetching media asset:', err));
      } else {
        setCurrentMediaUrl(null);
      }
    }
  }, [settings]);

  const updateMutation = useUpdateHeroSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      typewriterTexts,
    };
    updateMutation.mutate(dataToSubmit, {
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

  const addTypewriterText = () => {
    setTypewriterTexts([...typewriterTexts, '']);
  };

  const updateTypewriterText = (index: number, value: string) => {
    const updated = [...typewriterTexts];
    updated[index] = value;
    setTypewriterTexts(updated);
  };

  const deleteTypewriterText = (index: number) => {
    setTypewriterTexts(typewriterTexts.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            <Type className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="background">
            <ImageIcon className="w-4 h-4 mr-2" />
            Background
          </TabsTrigger>
          <TabsTrigger value="buttons">
            <MousePointer2 className="w-4 h-4 mr-2" />
            Buttons
          </TabsTrigger>
          <TabsTrigger value="styling">
            <Palette className="w-4 h-4 mr-2" />
            Styling
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Text Content</CardTitle>
              <CardDescription>Configure the main heading and subheading text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Main Heading</Label>
                <Textarea
                  id="title"
                  placeholder="WHERE ADVENTURE MEETS\nTRANSFORMATION"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  rows={3}
                  className="font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  Use \n for line breaks. Example: "WHERE\nADVENTURE"
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subheading</Label>
                <Textarea
                  id="subtitle"
                  placeholder="Experience Morocco's soul through sustainable journeys..."
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Typewriter Effect</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable animated typewriter effect for the title
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableTypewriter || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableTypewriter: checked })}
                  />
                </div>

                {formData.enableTypewriter && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <Label>Typewriter Texts</Label>
                      <Button type="button" size="sm" variant="outline" onClick={addTypewriterText}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Text
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {typewriterTexts.map((text, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={text}
                            onChange={(e) => updateTypewriterText(index, e.target.value)}
                            placeholder={`Animation text ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTypewriterText(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {typewriterTexts.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">
                          No typewriter texts added yet. Click "Add Text" to create animated text sequences.
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These texts will be animated in sequence with the typewriter effect
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Tab */}
        <TabsContent value="background" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Background Media</CardTitle>
              <CardDescription>Upload and manage the hero section background</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUpload
                mediaType={(formData.backgroundType as 'image' | 'video') || 'image'}
                currentMediaId={formData.backgroundMediaId}
                currentMediaUrl={currentMediaUrl}
                onMediaChange={(mediaId, mediaUrl) => {
                  setFormData({ ...formData, backgroundMediaId: mediaId });
                  setCurrentMediaUrl(mediaUrl);
                }}
                onTypeChange={(type) => {
                  setFormData({ ...formData, backgroundType: type });
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overlay Settings</CardTitle>
              <CardDescription>Adjust background overlay color and opacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overlayColor">Overlay Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="overlayColorPicker"
                    type="color"
                    value={formData.backgroundOverlayColor?.split('(')[0] === 'rgba' ? 
                      `#${formData.backgroundOverlayColor.match(/\d+/g)?.slice(0,3).map(x => parseInt(x).toString(16).padStart(2,'0')).join('') || '1a365d'}` : 
                      formData.backgroundOverlayColor || '#1a365d'}
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1,3), 16);
                      const g = parseInt(hex.slice(3,5), 16);
                      const b = parseInt(hex.slice(5,7), 16);
                      const alpha = (formData.backgroundOverlayOpacity || 70) / 100;
                      setFormData({ 
                        ...formData, 
                        backgroundOverlayColor: `rgba(${r}, ${g}, ${b}, ${alpha})`
                      });
                    }}
                    className="w-20"
                  />
                  <Input
                    id="overlayColor"
                    value={formData.backgroundOverlayColor || 'rgba(26, 54, 93, 0.7)'}
                    onChange={(e) => setFormData({ ...formData, backgroundOverlayColor: e.target.value })}
                    placeholder="rgba(26, 54, 93, 0.7)"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use rgba format for colors with transparency
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Overlay Opacity</Label>
                  <span className="text-sm text-muted-foreground">{formData.backgroundOverlayOpacity || 70}%</span>
                </div>
                <Slider
                  value={[formData.backgroundOverlayOpacity || 70]}
                  onValueChange={(value) => {
                    const opacity = value[0];
                    setFormData({ ...formData, backgroundOverlayOpacity: opacity });
                    
                    if (formData.backgroundOverlayColor && formData.backgroundOverlayColor.startsWith('rgba')) {
                      const rgb = formData.backgroundOverlayColor.match(/\d+/g);
                      if (rgb && rgb.length >= 3) {
                        setFormData({
                          ...formData,
                          backgroundOverlayOpacity: opacity,
                          backgroundOverlayColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity / 100})`
                        });
                      }
                    }
                  }}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Buttons</CardTitle>
              <CardDescription>Configure the primary and secondary action buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Primary Button
                </h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryButtonText">Button Text</Label>
                    <Input
                      id="primaryButtonText"
                      value={formData.primaryButtonText || ''}
                      onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                      placeholder="Start Your Journey"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryButtonLink">Button Link</Label>
                    <Input
                      id="primaryButtonLink"
                      value={formData.primaryButtonLink || ''}
                      onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                      placeholder="/discover"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  Secondary Button
                </h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondaryButtonText">Button Text</Label>
                    <Input
                      id="secondaryButtonText"
                      value={formData.secondaryButtonText || ''}
                      onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                      placeholder="Explore Clubs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryButtonLink">Button Link</Label>
                    <Input
                      id="secondaryButtonLink"
                      value={formData.secondaryButtonLink || ''}
                      onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                      placeholder="/clubs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Styling Tab */}
        <TabsContent value="styling" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography & Colors</CardTitle>
              <CardDescription>Customize text appearance, fonts, and colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Title Styling</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleFontSize">Font Size</Label>
                    <Input
                      id="titleFontSize"
                      value={formData.titleFontSize || ''}
                      onChange={(e) => setFormData({ ...formData, titleFontSize: e.target.value })}
                      placeholder="65px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.titleColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                        className="w-20"
                      />
                      <Input
                        value={formData.titleColor || ''}
                        onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Subtitle Styling</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtitleFontSize">Font Size</Label>
                    <Input
                      id="subtitleFontSize"
                      value={formData.subtitleFontSize || ''}
                      onChange={(e) => setFormData({ ...formData, subtitleFontSize: e.target.value })}
                      placeholder="20px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitleColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.subtitleColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                        className="w-20"
                      />
                      <Input
                        value={formData.subtitleColor || ''}
                        onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center border-t pt-6">
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setFormData(settings || {});
              setTypewriterTexts(Array.isArray(settings?.typewriterTexts) ? settings.typewriterTexts : []);
            }}
          >
            Reset Changes
          </Button>
          <Button type="button" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default HeroTab;
