import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Eye, Plus, Trash2 } from 'lucide-react';

const FONT_SIZES = ['24px', '32px', '40px', '48px', '56px', '64px', '72px', '80px'];
const TEXT_ALIGNS = ['left', 'center', 'right'];

export default function HeroSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Content
  const [title, setTitle] = useState('WHERE');
  const [subtitle, setSubtitle] = useState("Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.");
  const [enableTypewriter, setEnableTypewriter] = useState(false);
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>([]);

  // Buttons
  const [primaryButtonText, setPrimaryButtonText] = useState('Start Your Journey');
  const [primaryButtonLink, setPrimaryButtonLink] = useState('/discover');
  const [secondaryButtonText, setSecondaryButtonText] = useState('Explore Clubs');
  const [secondaryButtonLink, setSecondaryButtonLink] = useState('/clubs');
  const [showPrimaryButton, setShowPrimaryButton] = useState(true);
  const [showSecondaryButton, setShowSecondaryButton] = useState(true);

  // Background
  const [backgroundType, setBackgroundType] = useState<'image' | 'video' | 'gradient'>('image');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundOverlayColor, setBackgroundOverlayColor] = useState('rgba(26, 54, 93, 0.7)');
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState('70');

  // Typography & Styling
  const [titleFontSize, setTitleFontSize] = useState('64px');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [titleAlignment, setTitleAlignment] = useState('center');
  const [subtitleFontSize, setSubtitleFontSize] = useState('20px');
  const [subtitleColor, setSubtitleColor] = useState('#ffffff');
  const [subtitleAlignment, setSubtitleAlignment] = useState('center');

  // Layout
  const [heroHeight, setHeroHeight] = useState('600');
  const [contentMaxWidth, setContentMaxWidth] = useState('800');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/cms/hero-settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setTitle(data.title || 'WHERE');
          setSubtitle(data.subtitle || '');
          setEnableTypewriter(data.enableTypewriter || false);
          setTypewriterTexts(data.typewriterTexts || []);
          setPrimaryButtonText(data.primaryButtonText || 'Start Your Journey');
          setPrimaryButtonLink(data.primaryButtonLink || '/discover');
          setSecondaryButtonText(data.secondaryButtonText || 'Explore Clubs');
          setSecondaryButtonLink(data.secondaryButtonLink || '/clubs');
          setShowPrimaryButton(data.showPrimaryButton ?? true);
          setShowSecondaryButton(data.showSecondaryButton ?? true);
          setBackgroundType(data.backgroundType || 'image');
          setBackgroundImage(data.backgroundImageUrl || '');
          setBackgroundOverlayColor(data.backgroundOverlayColor || 'rgba(26, 54, 93, 0.7)');
          setBackgroundOverlayOpacity(data.backgroundOverlayOpacity || '70');
          setTitleFontSize(data.titleFontSize || '64px');
          setTitleColor(data.titleColor || '#ffffff');
          setTitleAlignment(data.titleAlignment || 'center');
          setSubtitleFontSize(data.subtitleFontSize || '20px');
          setSubtitleColor(data.subtitleColor || '#ffffff');
          setSubtitleAlignment(data.subtitleAlignment || 'center');
          setHeroHeight(data.heroHeight || '600');
          setContentMaxWidth(data.contentMaxWidth || '800');
        }
      }
    } catch (error) {
      console.error('Error loading hero settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('enableTypewriter', String(enableTypewriter));
      formData.append('typewriterTexts', JSON.stringify(typewriterTexts));
      formData.append('primaryButtonText', primaryButtonText);
      formData.append('primaryButtonLink', primaryButtonLink);
      formData.append('secondaryButtonText', secondaryButtonText);
      formData.append('secondaryButtonLink', secondaryButtonLink);
      formData.append('showPrimaryButton', String(showPrimaryButton));
      formData.append('showSecondaryButton', String(showSecondaryButton));
      formData.append('backgroundType', backgroundType);
      if (backgroundFile) {
        formData.append('backgroundImage', backgroundFile);
      }
      formData.append('backgroundOverlayColor', backgroundOverlayColor);
      formData.append('backgroundOverlayOpacity', backgroundOverlayOpacity);
      formData.append('titleFontSize', titleFontSize);
      formData.append('titleColor', titleColor);
      formData.append('titleAlignment', titleAlignment);
      formData.append('subtitleFontSize', subtitleFontSize);
      formData.append('subtitleColor', subtitleColor);
      formData.append('subtitleAlignment', subtitleAlignment);
      formData.append('heroHeight', heroHeight);
      formData.append('contentMaxWidth', contentMaxWidth);

      const response = await fetch('/api/admin/cms/hero-settings', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Hero settings saved successfully' });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast({ title: 'Error', description: 'Failed to save hero settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTypewriterText = () => {
    setTypewriterTexts([...typewriterTexts, '']);
  };

  const updateTypewriterText = (index: number, value: string) => {
    const updated = [...typewriterTexts];
    updated[index] = value;
    setTypewriterTexts(updated);
  };

  const removeTypewriterText = (index: number) => {
    setTypewriterTexts(typewriterTexts.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Section Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your homepage hero section</p>
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

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Edit the main hero text and messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="WHERE"
                  className="text-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Your compelling subtitle..."
                  rows={3}
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={enableTypewriter} onCheckedChange={setEnableTypewriter} />
                  <Label>Enable Typewriter Effect</Label>
                </div>

                {enableTypewriter && (
                  <div className="space-y-2 pl-6">
                    <Label>Typewriter Texts</Label>
                    {typewriterTexts.map((text, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={text}
                          onChange={(e) => updateTypewriterText(index, e.target.value)}
                          placeholder="Text to animate..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTypewriterText(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addTypewriterText} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Text
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Buttons</CardTitle>
              <CardDescription>Configure hero section buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={showPrimaryButton} onCheckedChange={setShowPrimaryButton} />
                  <Label>Show Primary Button</Label>
                </div>
                {showPrimaryButton && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={primaryButtonText} onChange={(e) => setPrimaryButtonText(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Link</Label>
                      <Input value={primaryButtonLink} onChange={(e) => setPrimaryButtonLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={showSecondaryButton} onCheckedChange={setShowSecondaryButton} />
                  <Label>Show Secondary Button</Label>
                </div>
                {showSecondaryButton && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={secondaryButtonText} onChange={(e) => setSecondaryButtonText(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Link</Label>
                      <Input value={secondaryButtonLink} onChange={(e) => setSecondaryButtonLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Tab */}
        <TabsContent value="background" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Background Media</CardTitle>
              <CardDescription>Set hero background image or video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Background Type</Label>
                <Select value={backgroundType} onValueChange={(value: 'image' | 'video' | 'gradient') => setBackgroundType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {backgroundType === 'image' && (
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  {backgroundImage && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img src={backgroundImage} alt="Background preview" className="w-full h-48 object-cover rounded" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="cursor-pointer"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Overlay Color</Label>
                  <Input
                    value={backgroundOverlayColor}
                    onChange={(e) => setBackgroundOverlayColor(e.target.value)}
                    placeholder="rgba(26, 54, 93, 0.7)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Overlay Opacity (%)</Label>
                  <Input
                    type="number"
                    value={backgroundOverlayOpacity}
                    onChange={(e) => setBackgroundOverlayOpacity(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography & Colors</CardTitle>
              <CardDescription>Customize text appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 border-b pb-6">
                <h4 className="font-semibold">Title Styling</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={titleFontSize} onValueChange={setTitleFontSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={titleColor}
                        onChange={(e) => setTitleColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={titleColor}
                        onChange={(e) => setTitleColor(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Alignment</Label>
                    <Select value={titleAlignment} onValueChange={setTitleAlignment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEXT_ALIGNS.map(align => (
                          <SelectItem key={align} value={align}>{align}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Subtitle Styling</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={subtitleFontSize} onValueChange={setSubtitleFontSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.slice(0, 5).map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={subtitleColor}
                        onChange={(e) => setSubtitleColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={subtitleColor}
                        onChange={(e) => setSubtitleColor(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Alignment</Label>
                    <Select value={subtitleAlignment} onValueChange={setSubtitleAlignment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEXT_ALIGNS.map(align => (
                          <SelectItem key={align} value={align}>{align}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Control hero dimensions and spacing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Height (px)</Label>
                  <Input
                    type="number"
                    value={heroHeight}
                    onChange={(e) => setHeroHeight(e.target.value)}
                    min="400"
                    max="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content Max Width (px)</Label>
                  <Input
                    type="number"
                    value={contentMaxWidth}
                    onChange={(e) => setContentMaxWidth(e.target.value)}
                    min="600"
                    max="1400"
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
