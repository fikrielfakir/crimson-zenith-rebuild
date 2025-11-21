import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, RefreshCw } from 'lucide-react';

const FONT_FAMILIES = [
  'Inter',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Georgia',
  'Times New Roman',
  'Arial',
];

const FONT_SIZES = {
  heading1: ['48px', '56px', '64px', '72px', '80px'],
  heading2: ['36px', '40px', '48px', '56px'],
  heading3: ['28px', '32px', '36px', '40px'],
  body: ['14px', '16px', '18px', '20px'],
  small: ['12px', '14px', '16px'],
};

export default function ThemeSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Colors
  const [primaryColor, setPrimaryColor] = useState('#112250');
  const [secondaryColor, setSecondaryColor] = useState('#D8C18D');
  const [accentColor, setAccentColor] = useState('#E63946');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#1A202C');
  
  // Typography
  const [headingFont, setHeadingFont] = useState('Poppins');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [h1Size, setH1Size] = useState('64px');
  const [h2Size, setH2Size] = useState('48px');
  const [h3Size, setH3Size] = useState('32px');
  const [bodySize, setBodySize] = useState('16px');
  const [smallSize, setSmallSize] = useState('14px');
  
  // Spacing
  const [sectionPadding, setSectionPadding] = useState('80');
  const [cardBorderRadius, setCardBorderRadius] = useState('12');
  const [buttonBorderRadius, setButtonBorderRadius] = useState('8');
  
  // Custom CSS
  const [customCss, setCustomCss] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/cms/theme-settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setPrimaryColor(data.primaryColor || '#112250');
          setSecondaryColor(data.secondaryColor || '#D8C18D');
          setAccentColor(data.accentColor || '#E63946');
          setBackgroundColor(data.backgroundColor || '#FFFFFF');
          setTextColor(data.textColor || '#1A202C');
          setHeadingFont(data.headingFont || 'Poppins');
          setBodyFont(data.bodyFont || 'Inter');
          setH1Size(data.h1Size || '64px');
          setH2Size(data.h2Size || '48px');
          setH3Size(data.h3Size || '32px');
          setBodySize(data.bodySize || '16px');
          setSmallSize(data.smallSize || '14px');
          setSectionPadding(data.sectionPadding || '80');
          setCardBorderRadius(data.cardBorderRadius || '12');
          setButtonBorderRadius(data.buttonBorderRadius || '8');
          setCustomCss(data.customCss || '');
        }
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/cms/theme-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryColor,
          secondaryColor,
          accentColor,
          backgroundColor,
          textColor,
          headingFont,
          bodyFont,
          h1Size,
          h2Size,
          h3Size,
          bodySize,
          smallSize,
          sectionPadding,
          cardBorderRadius,
          buttonBorderRadius,
          customCss,
        }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Theme settings saved successfully' });
        // Reload the page to apply new theme
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast({ title: 'Error', description: 'Failed to save theme settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setPrimaryColor('#112250');
    setSecondaryColor('#D8C18D');
    setAccentColor('#E63946');
    setBackgroundColor('#FFFFFF');
    setTextColor('#1A202C');
    setHeadingFont('Poppins');
    setBodyFont('Inter');
    setH1Size('64px');
    setH2Size('48px');
    setH3Size('32px');
    setBodySize('16px');
    setSmallSize('14px');
    setSectionPadding('80');
    setCardBorderRadius('12');
    setButtonBorderRadius('8');
    setCustomCss('');
    toast({ title: 'Reset', description: 'Theme settings reset to defaults' });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme Settings</h1>
          <p className="text-muted-foreground mt-1">Customize global colors, fonts, and styling</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save & Apply'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing & Borders</TabsTrigger>
          <TabsTrigger value="custom">Custom CSS</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Define your brand colors used throughout the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#112250"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Main brand color for buttons, links, etc.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#D8C18D"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Accent color for highlights, icons</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#E63946"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">For CTAs, notifications, alerts</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Main page background</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#1A202C"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Primary text color</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Configure fonts and text sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Families */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select value={headingFont} onValueChange={setHeadingFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select value={bodyFont} onValueChange={setBodyFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font Sizes */}
              <div className="space-y-4">
                <h4 className="font-semibold">Font Sizes</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>H1 Size</Label>
                    <Select value={h1Size} onValueChange={setH1Size}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.heading1.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>H2 Size</Label>
                    <Select value={h2Size} onValueChange={setH2Size}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.heading2.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>H3 Size</Label>
                    <Select value={h3Size} onValueChange={setH3Size}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.heading3.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Body Text Size</Label>
                    <Select value={bodySize} onValueChange={setBodySize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.body.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Small Text Size</Label>
                    <Select value={smallSize} onValueChange={setSmallSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.small.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spacing & Borders</CardTitle>
              <CardDescription>Control layout spacing and border radius</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section-padding">Section Padding (px)</Label>
                  <Input
                    id="section-padding"
                    type="number"
                    value={sectionPadding}
                    onChange={(e) => setSectionPadding(e.target.value)}
                    min="40"
                    max="160"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-radius">Card Border Radius (px)</Label>
                  <Input
                    id="card-radius"
                    type="number"
                    value={cardBorderRadius}
                    onChange={(e) => setCardBorderRadius(e.target.value)}
                    min="0"
                    max="32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button-radius">Button Border Radius (px)</Label>
                  <Input
                    id="button-radius"
                    type="number"
                    value={buttonBorderRadius}
                    onChange={(e) => setButtonBorderRadius(e.target.value)}
                    min="0"
                    max="32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom CSS Tab */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>Add custom CSS for advanced styling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS Code</Label>
                <Textarea
                  id="custom-css"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Add your custom CSS here */"
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Advanced users only. Invalid CSS may break your site styling.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
