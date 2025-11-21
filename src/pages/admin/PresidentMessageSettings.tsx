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
import { Save, Upload, Eye, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
];

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px'];
const TEXT_ALIGNS = ['left', 'center', 'right'];
const IMAGE_POSITIONS = ['left', 'right'];

function MediaLibraryDialog({ 
  onSelectMedia, 
  title = "Select Image from Media Library" 
}: { 
  onSelectMedia: (mediaId: number, url: string) => void;
  title?: string;
}) {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cms/media')
      .then(res => res.json())
      .then(data => {
        setMedia(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load media:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Choose an image from your media library</DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.filter(m => m.fileType.startsWith('image/')).map((item) => (
            <div
              key={item.id}
              className="cursor-pointer border rounded-lg p-2 hover:border-primary transition-colors"
              onClick={() => onSelectMedia(item.id, item.fileUrl)}
            >
              <img 
                src={item.fileUrl} 
                alt={item.altText || item.fileName}
                className="w-full h-32 object-contain rounded"
              />
              <p className="text-xs mt-2 truncate text-center">{item.fileName}</p>
            </div>
          ))}
        </div>
      )}
    </DialogContent>
  );
}

export default function PresidentMessageSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Content
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState('A word from the president');
  const [presidentName, setPresidentName] = useState('Dr. Aderahim Azrkan');
  const [presidentRole, setPresidentRole] = useState('President, The Journey Association');
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState('');

  // Media
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [signatureId, setSignatureId] = useState<number | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [backgroundImageId, setBackgroundImageId] = useState<number | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');

  // Background & Colors
  const [backgroundColor, setBackgroundColor] = useState('#112250');
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(180deg, #112250 0%, #1a3366 100%)');

  // Typography - Title
  const [titleFontFamily, setTitleFontFamily] = useState('Poppins');
  const [titleFontSize, setTitleFontSize] = useState('48px');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [titleAlignment, setTitleAlignment] = useState('left');

  // Typography - President Name
  const [nameFontFamily, setNameFontFamily] = useState('Poppins');
  const [nameFontSize, setNameFontSize] = useState('28px');
  const [nameColor, setNameColor] = useState('#ffffff');

  // Typography - President Role
  const [roleFontFamily, setRoleFontFamily] = useState('Poppins');
  const [roleFontSize, setRoleFontSize] = useState('18px');
  const [roleColor, setRoleColor] = useState('#D8C18D');

  // Typography - Message
  const [messageFontFamily, setMessageFontFamily] = useState('Poppins');
  const [messageFontSize, setMessageFontSize] = useState('16px');
  const [messageColor, setMessageColor] = useState('#ffffff');

  // Typography - Quote
  const [quoteFontSize, setQuoteFontSize] = useState('18px');
  const [quoteColor, setQuoteColor] = useState('#D8C18D');

  // Layout & Positioning
  const [imagePosition, setImagePosition] = useState('left');
  const [imageAlignment, setImageAlignment] = useState('center');
  const [imageWidth, setImageWidth] = useState('42%');
  const [sectionPadding, setSectionPadding] = useState('80px 0');
  const [contentGap, setContentGap] = useState('48px');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/cms/president-message');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setIsActive(data.isActive ?? true);
          setTitle(data.title || 'A word from the president');
          setPresidentName(data.presidentName || '');
          setPresidentRole(data.presidentRole || '');
          setMessage(data.message || '');
          setQuote(data.quote || '');
          setPhotoId(data.photoId || null);
          if (data.photoId) {
            setPhotoUrl(`/api/cms/media/${data.photoId}`);
          }
          setSignatureId(data.signatureId || null);
          if (data.signatureId) {
            setSignatureUrl(`/api/cms/media/${data.signatureId}`);
          }
          setBackgroundImageId(data.backgroundImageId || null);
          if (data.backgroundImageId) {
            setBackgroundImageUrl(`/api/cms/media/${data.backgroundImageId}`);
          }
          setBackgroundColor(data.backgroundColor || '#112250');
          setBackgroundGradient(data.backgroundGradient || 'linear-gradient(180deg, #112250 0%, #1a3366 100%)');
          setTitleFontFamily(data.titleFontFamily || 'Poppins');
          setTitleFontSize(data.titleFontSize || '48px');
          setTitleColor(data.titleColor || '#ffffff');
          setTitleAlignment(data.titleAlignment || 'left');
          setNameFontFamily(data.nameFontFamily || 'Poppins');
          setNameFontSize(data.nameFontSize || '28px');
          setNameColor(data.nameColor || '#ffffff');
          setRoleFontFamily(data.roleFontFamily || 'Poppins');
          setRoleFontSize(data.roleFontSize || '18px');
          setRoleColor(data.roleColor || '#D8C18D');
          setMessageFontFamily(data.messageFontFamily || 'Poppins');
          setMessageFontSize(data.messageFontSize || '16px');
          setMessageColor(data.messageColor || '#ffffff');
          setQuoteFontSize(data.quoteFontSize || '18px');
          setQuoteColor(data.quoteColor || '#D8C18D');
          setImagePosition(data.imagePosition || 'left');
          setImageAlignment(data.imageAlignment || 'center');
          setImageWidth(data.imageWidth || '42%');
          setSectionPadding(data.sectionPadding || '80px 0');
          setContentGap(data.contentGap || '48px');
        }
      }
    } catch (error) {
      console.error('Error loading president message settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/cms/president-message', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive,
          title,
          presidentName,
          presidentRole,
          message,
          quote,
          photoId,
          signatureId,
          backgroundImageId,
          backgroundColor,
          backgroundGradient,
          titleFontFamily,
          titleFontSize,
          titleColor,
          titleAlignment,
          nameFontFamily,
          nameFontSize,
          nameColor,
          roleFontFamily,
          roleFontSize,
          roleColor,
          messageFontFamily,
          messageFontSize,
          messageColor,
          quoteFontSize,
          quoteColor,
          imagePosition,
          imageAlignment,
          imageWidth,
          sectionPadding,
          contentGap,
        }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'President message settings saved successfully' });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving president message settings:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save president message settings', 
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">President Message Settings</h1>
          <p className="text-muted-foreground mt-1">Customize the president's message section</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 mr-4">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Show Section</Label>
          </div>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout & Styling</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Content</CardTitle>
              <CardDescription>Edit the text content for the president message section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A word from the president"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="president-name">President Name</Label>
                  <Input
                    id="president-name"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    placeholder="Dr. Aderahim Azrkan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="president-role">President Role/Title</Label>
                  <Input
                    id="president-role"
                    value={presidentRole}
                    onChange={(e) => setPresidentRole(e.target.value)}
                    placeholder="President, The Journey Association"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Rich Text)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the president's message here..."
                  rows={10}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML formatting for rich text (e.g., &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote">Optional Quote</Label>
                <Input
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Together, we create lasting impact."
                />
                <p className="text-xs text-muted-foreground">
                  An inspirational quote to display at the end of the message
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>President Photo</CardTitle>
              <CardDescription>Upload or select the president's photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {photoUrl && (
                <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                  <img src={photoUrl} alt="President" className="h-48 object-contain rounded" />
                </div>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {photoId ? 'Change Photo' : 'Select Photo'}
                  </Button>
                </DialogTrigger>
                <MediaLibraryDialog 
                  onSelectMedia={(id, url) => {
                    setPhotoId(id);
                    setPhotoUrl(url);
                  }} 
                  title="Select President Photo"
                />
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signature Image (Optional)</CardTitle>
              <CardDescription>Upload or select a signature image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {signatureUrl && (
                <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                  <img src={signatureUrl} alt="Signature" className="h-20 object-contain rounded" />
                </div>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {signatureId ? 'Change Signature' : 'Select Signature'}
                  </Button>
                </DialogTrigger>
                <MediaLibraryDialog 
                  onSelectMedia={(id, url) => {
                    setSignatureId(id);
                    setSignatureUrl(url);
                  }} 
                  title="Select Signature Image"
                />
              </Dialog>
              {signatureId && (
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => {
                    setSignatureId(null);
                    setSignatureUrl('');
                  }}
                >
                  Remove Signature
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Background Image (Optional)</CardTitle>
              <CardDescription>Upload or select a background image for the section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {backgroundImageUrl && (
                <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                  <img src={backgroundImageUrl} alt="Background" className="h-32 object-cover rounded w-full" />
                </div>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {backgroundImageId ? 'Change Background' : 'Select Background'}
                  </Button>
                </DialogTrigger>
                <MediaLibraryDialog 
                  onSelectMedia={(id, url) => {
                    setBackgroundImageId(id);
                    setBackgroundImageUrl(url);
                  }} 
                  title="Select Background Image"
                />
              </Dialog>
              {backgroundImageId && (
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => {
                    setBackgroundImageId(null);
                    setBackgroundImageUrl('');
                  }}
                >
                  Remove Background Image
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Title Typography</CardTitle>
              <CardDescription>Customize the main title appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={titleFontFamily} onValueChange={setTitleFontFamily}>
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
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Alignment</Label>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>President Name & Role Typography</CardTitle>
              <CardDescription>Customize name and role text appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">President Name</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={nameFontFamily} onValueChange={setNameFontFamily}>
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
                    <Label>Font Size</Label>
                    <Select value={nameFontSize} onValueChange={setNameFontSize}>
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
                        value={nameColor}
                        onChange={(e) => setNameColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={nameColor}
                        onChange={(e) => setNameColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h4 className="font-medium">President Role</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={roleFontFamily} onValueChange={setRoleFontFamily}>
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
                    <Label>Font Size</Label>
                    <Select value={roleFontSize} onValueChange={setRoleFontSize}>
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
                        value={roleColor}
                        onChange={(e) => setRoleColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={roleColor}
                        onChange={(e) => setRoleColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message & Quote Typography</CardTitle>
              <CardDescription>Customize message and quote text appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Message Text</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={messageFontFamily} onValueChange={setMessageFontFamily}>
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
                    <Label>Font Size</Label>
                    <Select value={messageFontSize} onValueChange={setMessageFontSize}>
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
                        value={messageColor}
                        onChange={(e) => setMessageColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={messageColor}
                        onChange={(e) => setMessageColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h4 className="font-medium">Quote Text</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={quoteFontSize} onValueChange={setQuoteFontSize}>
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
                        value={quoteColor}
                        onChange={(e) => setQuoteColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={quoteColor}
                        onChange={(e) => setQuoteColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout & Styling Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Background Settings</CardTitle>
              <CardDescription>Configure the section background appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="bg-color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-gradient">Background Gradient (CSS)</Label>
                <Input
                  id="bg-gradient"
                  value={backgroundGradient}
                  onChange={(e) => setBackgroundGradient(e.target.value)}
                  placeholder="linear-gradient(180deg, #112250 0%, #1a3366 100%)"
                />
                <p className="text-xs text-muted-foreground">
                  CSS gradient value. Leave as-is or customize with your preferred gradient.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Positioning</CardTitle>
              <CardDescription>Control where the president's photo appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Image Position</Label>
                  <Select value={imagePosition} onValueChange={setImagePosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_POSITIONS.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Side where image appears
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Image Alignment</Label>
                  <Select value={imageAlignment} onValueChange={setImageAlignment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEXT_ALIGNS.map(align => (
                        <SelectItem key={align} value={align}>{align}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Vertical alignment
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-width">Image Width</Label>
                  <Input
                    id="image-width"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    placeholder="42%"
                  />
                  <p className="text-xs text-muted-foreground">
                    Width (%, px, rem)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spacing & Layout</CardTitle>
              <CardDescription>Adjust section padding and content spacing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section-padding">Section Padding</Label>
                  <Input
                    id="section-padding"
                    value={sectionPadding}
                    onChange={(e) => setSectionPadding(e.target.value)}
                    placeholder="80px 0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Top/bottom padding (e.g., "80px 0", "5rem 0")
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-gap">Content Gap</Label>
                  <Input
                    id="content-gap"
                    value={contentGap}
                    onChange={(e) => setContentGap(e.target.value)}
                    placeholder="48px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Gap between image and text (e.g., "48px", "3rem")
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
