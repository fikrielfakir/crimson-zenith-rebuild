import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavbarSettings, useUpdateNavbarSettings } from '@/hooks/useCMS';
import { Save, Plus, Trash2, GripVertical, Eye, Upload, Link as LinkIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DropdownItem {
  label: string;
  url: string;
  isExternal?: boolean;
  imageId?: number | null;
  imageUrl?: string;
  description?: string;
}

type DropdownDisplayType = 'simple-list' | 'list-with-images' | 'carousel';

interface NavigationLink {
  label: string;
  url: string;
  isExternal?: boolean;
  hasDropdown?: boolean;
  dropdownType?: DropdownDisplayType;
  dropdownItems?: DropdownItem[];
}

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

function SortableNavLink({ 
  link, 
  index, 
  onUpdate, 
  onRemove 
}: { 
  link: NavigationLink; 
  index: number; 
  onUpdate: (index: number, field: keyof NavigationLink, value: any) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `nav-link-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState<number | null>(null);

  const addDropdownItem = () => {
    const dropdownItems = link.dropdownItems || [];
    onUpdate(index, 'dropdownItems', [...dropdownItems, { label: 'New Item', url: '/', isExternal: false }]);
  };

  const updateDropdownItem = (dropdownIndex: number, field: keyof DropdownItem, value: any) => {
    const dropdownItems = [...(link.dropdownItems || [])];
    dropdownItems[dropdownIndex] = { ...dropdownItems[dropdownIndex], [field]: value };
    onUpdate(index, 'dropdownItems', dropdownItems);
  };

  const handleSelectDropdownImage = (dropdownIndex: number, mediaId: number, url: string) => {
    updateDropdownItem(dropdownIndex, 'imageId', mediaId);
    updateDropdownItem(dropdownIndex, 'imageUrl', url);
    setSelectedDropdownIndex(null);
  };

  const removeDropdownItem = (dropdownIndex: number) => {
    const dropdownItem = link.dropdownItems?.[dropdownIndex];
    const confirmed = window.confirm(
      `Are you sure you want to delete the dropdown item "${dropdownItem?.label}"?`
    );
    if (confirmed) {
      const dropdownItems = (link.dropdownItems || []).filter((_, i) => i !== dropdownIndex);
      onUpdate(index, 'dropdownItems', dropdownItems);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 p-4 border rounded-lg bg-card">
      <Button 
        variant="ghost" 
        size="sm" 
        className="cursor-move mt-8"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={link.label}
              onChange={(e) => onUpdate(index, 'label', e.target.value)}
              placeholder="Link Label"
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={link.url}
              onChange={(e) => onUpdate(index, 'url', e.target.value)}
              placeholder="/page or https://example.com"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={link.isExternal || false}
              onCheckedChange={(checked) => onUpdate(index, 'isExternal', checked)}
            />
            <Label>External Link</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={link.hasDropdown || false}
              onCheckedChange={(checked) => onUpdate(index, 'hasDropdown', checked)}
            />
            <Label>Has Dropdown</Label>
          </div>
        </div>

        {/* Dropdown Items Section */}
        {link.hasDropdown && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-dashed space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Dropdown Display Type</Label>
              </div>
              <Select
                value={link.dropdownType || 'simple-list'}
                onValueChange={(value: DropdownDisplayType) => onUpdate(index, 'dropdownType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select dropdown display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple-list">Simple List</SelectItem>
                  <SelectItem value="list-with-images">List with Images</SelectItem>
                  <SelectItem value="carousel">Carousel / Slide</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {link.dropdownType === 'carousel' 
                  ? 'Horizontal scrollable carousel with images (min 3 items recommended)'
                  : link.dropdownType === 'list-with-images'
                  ? 'Vertical list with thumbnail images next to each item'
                  : 'Simple text links dropdown (default)'}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label className="text-sm font-semibold">Dropdown Items</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addDropdownItem}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            
            {link.dropdownItems && link.dropdownItems.length > 0 ? (
              <div className="space-y-2">
                {link.dropdownItems.map((item, dropdownIndex) => {
                  const showImageField = link.dropdownType === 'list-with-images' || link.dropdownType === 'carousel';
                  return (
                    <div key={dropdownIndex} className="flex items-start gap-2 p-3 bg-background rounded border">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Label</Label>
                            <Input
                              value={item.label}
                              onChange={(e) => updateDropdownItem(dropdownIndex, 'label', e.target.value)}
                              placeholder="Item Label"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">URL</Label>
                            <Input
                              value={item.url}
                              onChange={(e) => updateDropdownItem(dropdownIndex, 'url', e.target.value)}
                              placeholder="/page"
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>

                        {showImageField && (
                          <div className="space-y-2">
                            <Label className="text-xs">Image {link.dropdownType === 'carousel' && <span className="text-red-500">*</span>}</Label>
                            {item.imageUrl && (
                              <div className="border rounded p-2 bg-muted/20">
                                <img src={item.imageUrl} alt={item.label} className="h-16 w-full object-cover rounded" />
                              </div>
                            )}
                            <Dialog open={selectedDropdownIndex === dropdownIndex} onOpenChange={(open) => !open && setSelectedDropdownIndex(null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full h-8 text-xs"
                                  onClick={() => setSelectedDropdownIndex(dropdownIndex)}
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  {item.imageUrl ? 'Change Image' : 'Select Image'}
                                </Button>
                              </DialogTrigger>
                              <MediaLibraryDialog onSelectMedia={(mediaId, url) => handleSelectDropdownImage(dropdownIndex, mediaId, url)} />
                            </Dialog>
                          </div>
                        )}

                        {showImageField && (
                          <div className="space-y-1">
                            <Label className="text-xs">Description (optional)</Label>
                            <Input
                              value={item.description || ''}
                              onChange={(e) => updateDropdownItem(dropdownIndex, 'description', e.target.value)}
                              placeholder="Brief description"
                              className="h-8 text-sm"
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.isExternal || false}
                            onCheckedChange={(checked) => updateDropdownItem(dropdownIndex, 'isExternal', checked)}
                          />
                          <Label className="text-xs">External Link</Label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDropdownItem(dropdownIndex)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No dropdown items yet. Click "Add Item" to create one.
              </p>
            )}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 mt-8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function MediaLibraryDialog({ onSelectMedia }: { onSelectMedia: (mediaId: number, url: string) => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMedia = () => {
    setIsLoading(true);
    setError(null);
    fetch('/api/admin/cms/media')
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status >= 500 ? 'Server error. Please try again.' : 'Failed to load media');
        }
        return res.json();
      })
      .then(data => {
        setMedia(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load media:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Select Logo from Media Library</DialogTitle>
        <DialogDescription>Choose an image from your media library to use as the logo</DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <LoadingSpinner message="Loading media library..." className="p-8" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadMedia} className="p-8" />
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

export default function NavbarSettings() {
  const { toast } = useToast();
  const { data: navbarData, isLoading, error, refetch } = useNavbarSettings();
  const updateNavbar = useUpdateNavbarSettings();
  
  // Logo Settings
  const [logoType, setLogoType] = useState<'image' | 'text'>('image');
  const [logoText, setLogoText] = useState('The Journey Association');
  const [logoImageId, setLogoImageId] = useState<number | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string>('');
  const [logoSize, setLogoSize] = useState(135);
  const [logoLink, setLogoLink] = useState('/');
  
  // Navigation Links
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([
    { 
      label: 'Discover', 
      url: '/discover', 
      isExternal: false, 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Cities', url: '/discover/cities', isExternal: false },
        { label: 'Culture', url: '/discover/culture', isExternal: false },
        { label: 'Nature', url: '/discover/nature', isExternal: false },
      ]
    },
    { label: 'Activities', url: '/activities', isExternal: false },
    { label: 'Projects', url: '/projects', isExternal: false },
    { label: 'Clubs', url: '/clubs', isExternal: false },
    { label: 'Gallery', url: '/gallery', isExternal: false },
    { label: 'Blog', url: '/blog', isExternal: false },
    { 
      label: 'Talents', 
      url: '/talents', 
      isExternal: false, 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Volunteers (Spontaneous)', url: '/talents/volunteers/spontaneous', isExternal: false },
        { label: 'Volunteers (Posts)', url: '/talents/volunteers/posts', isExternal: false },
        { label: 'Experts', url: '/talents/experts', isExternal: false },
        { label: 'Work Offers', url: '/talents/work-offers', isExternal: false },
      ]
    },
    { label: 'Contact', url: '/contact', isExternal: false },
  ]);
  
  // Feature Toggles
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['EN', 'FR', 'AR']);
  const [showDarkModeToggle, setShowDarkModeToggle] = useState(true);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showJoinButton, setShowJoinButton] = useState(true);
  
  // Button Settings
  const [loginButtonText, setLoginButtonText] = useState('Login');
  const [loginButtonLink, setLoginButtonLink] = useState('/admin/login');
  const [joinButtonText, setJoinButtonText] = useState('Donate');
  const [joinButtonLink, setJoinButtonLink] = useState('/donate');
  const [joinButtonStyle, setJoinButtonStyle] = useState('secondary');
  
  // Styling Settings
  const [backgroundColor, setBackgroundColor] = useState('#112250');
  const [textColor, setTextColor] = useState('#ffffff');
  const [hoverColor, setHoverColor] = useState('#D8C18D');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('14px');
  const [isSticky, setIsSticky] = useState(true);
  const [isTransparent, setIsTransparent] = useState(false);
  const [transparentBg, setTransparentBg] = useState('rgba(0,0,0,0.3)');
  const [scrolledBg, setScrolledBg] = useState('#112250');
  const [height, setHeight] = useState(80);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (navbarData) {
      setLogoType(navbarData.logoType || 'image');
      setLogoText(navbarData.logoText || '');
      setLogoImageId(navbarData.logoImageId || null);
      if (navbarData.logoImageId) {
        setLogoImageUrl(`/api/cms/media/${navbarData.logoImageId}`);
      }
      setLogoSize(navbarData.logoSize || 135);
      setLogoLink(navbarData.logoLink || '/');
      setNavLinks(Array.isArray(navbarData.navigationLinks) ? navbarData.navigationLinks : []);
      setShowLanguageSwitcher(navbarData.showLanguageSwitcher ?? true);
      setAvailableLanguages(Array.isArray(navbarData.availableLanguages) ? navbarData.availableLanguages : ['EN', 'FR', 'AR']);
      setShowDarkModeToggle(navbarData.showDarkModeToggle ?? true);
      setShowLoginButton(navbarData.showLoginButton ?? true);
      setShowJoinButton(navbarData.showJoinButton ?? true);
      setLoginButtonText(navbarData.loginButtonText || 'Login');
      setLoginButtonLink(navbarData.loginButtonLink || '/admin/login');
      setJoinButtonText(navbarData.joinButtonText || 'Donate');
      setJoinButtonLink(navbarData.joinButtonLink || '/donate');
      setJoinButtonStyle(navbarData.joinButtonStyle || 'secondary');
      setBackgroundColor(navbarData.backgroundColor || '#112250');
      setTextColor(navbarData.textColor || '#ffffff');
      setHoverColor(navbarData.hoverColor || '#D8C18D');
      setFontFamily(navbarData.fontFamily || 'Inter');
      setFontSize(navbarData.fontSize || '14px');
      setIsSticky(navbarData.isSticky ?? true);
      setIsTransparent(navbarData.isTransparent ?? false);
      setTransparentBg(navbarData.transparentBg || 'rgba(0,0,0,0.3)');
      setScrolledBg(navbarData.scrolledBg || '#112250');
      setHeight(navbarData.height || 80);
    }
  }, [navbarData]);

  const sanitizeNavLinks = (links: NavigationLink[]) => {
    return links.map(link => {
      const sanitized = { ...link };
      
      if (sanitized.hasDropdown && sanitized.dropdownItems) {
        sanitized.dropdownItems = sanitized.dropdownItems.filter(item => {
          const label = String(item.label || '').trim();
          const url = String(item.url || '').trim();
          return label !== '' && url !== '';
        });
        
        if (sanitized.dropdownItems.length === 0) {
          delete sanitized.dropdownItems;
        }
      } else if (!sanitized.hasDropdown) {
        delete sanitized.dropdownItems;
      }
      
      return sanitized;
    });
  };

  const handleSave = async () => {
    try {
      const sanitizedNavLinks = sanitizeNavLinks(navLinks);
      
      await updateNavbar.mutateAsync({
        logoType,
        logoText,
        logoImageId,
        logoSize,
        logoLink,
        navigationLinks: sanitizedNavLinks,
        showLanguageSwitcher,
        availableLanguages,
        showDarkModeToggle,
        showLoginButton,
        showJoinButton,
        loginButtonText,
        loginButtonLink,
        joinButtonText,
        joinButtonLink,
        joinButtonStyle,
        backgroundColor,
        textColor,
        hoverColor,
        fontFamily,
        fontSize,
        isSticky,
        isTransparent,
        transparentBg,
        scrolledBg,
        height,
      });
      toast({ title: 'Success', description: 'Navbar settings saved successfully' });
    } catch (error) {
      console.error('Error saving navbar settings:', error);
      toast({ title: 'Error', description: 'Failed to save navbar settings', variant: 'destructive' });
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
    
    if (field === 'hasDropdown') {
      if (value && !updated[index].dropdownItems) {
        updated[index].dropdownItems = [];
      } else if (!value) {
        delete updated[index].dropdownItems;
      }
    }
    
    setNavLinks(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setNavLinks((items) => {
        const oldIndex = items.findIndex((_, i) => `nav-link-${i}` === active.id);
        const newIndex = items.findIndex((_, i) => `nav-link-${i}` === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSelectMedia = (mediaId: number, url: string) => {
    setLogoImageId(mediaId);
    setLogoImageUrl(url);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading navbar settings..." size="lg" className="h-64" />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Navbar Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your website's navigation bar</p>
        </div>
        <ErrorState 
          message={(error as Error).message} 
          onRetry={() => refetch()} 
        />
      </div>
    );
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
          <Button onClick={handleSave} disabled={updateNavbar.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateNavbar.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
        </TabsList>

        {/* Logo Tab */}
        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Configuration</CardTitle>
              <CardDescription>Choose between text or image logo and customize appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="space-y-4">
                  <Label>Logo Image</Label>
                  {logoImageUrl && (
                    <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                      <img src={logoImageUrl} alt="Logo preview" className="h-20 object-contain" />
                    </div>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Select from Media Library
                      </Button>
                    </DialogTrigger>
                    <MediaLibraryDialog onSelectMedia={handleSelectMedia} />
                  </Dialog>
                  <p className="text-sm text-muted-foreground">
                    Recommended: PNG or SVG format, transparent background, 200x80px
                  </p>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-size">Logo Size (px)</Label>
                  <Input
                    id="logo-size"
                    type="number"
                    value={logoSize}
                    onChange={(e) => setLogoSize(parseInt(e.target.value) || 135)}
                    min="50"
                    max="300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-link">Logo Link</Label>
                  <div className="flex gap-2">
                    <LinkIcon className="w-4 h-4 mt-2.5 text-muted-foreground" />
                    <Input
                      id="logo-link"
                      value={logoLink}
                      onChange={(e) => setLogoLink(e.target.value)}
                      placeholder="/"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Links Tab */}
        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Drag to reorder, add, remove, or edit navigation links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={navLinks.map((_, i) => `nav-link-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {navLinks.map((link, index) => (
                    <SortableNavLink
                      key={`nav-link-${index}`}
                      link={link}
                      index={index}
                      onUpdate={updateNavLink}
                      onRemove={removeNavLink}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
              <CardDescription>Configure login and join/donate buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                          <SelectItem value="destructive">Destructive</SelectItem>
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
              <CardDescription>Customize colors, typography, and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#112250"
                      />
                    </div>
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
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hover-color">Hover Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hover-color"
                        type="color"
                        value={hoverColor}
                        onChange={(e) => setHoverColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={hoverColor}
                        onChange={(e) => setHoverColor(e.target.value)}
                        placeholder="#D8C18D"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Typography</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                          <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Behavior & Appearance</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 80)}
                      min="60"
                      max="150"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={isSticky} onCheckedChange={setIsSticky} />
                    <Label>Sticky Navbar (stays at top when scrolling)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={isTransparent} onCheckedChange={setIsTransparent} />
                    <Label>Transparent Background (before scroll)</Label>
                  </div>
                  {isTransparent && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label>Transparent Background</Label>
                        <Input
                          value={transparentBg}
                          onChange={(e) => setTransparentBg(e.target.value)}
                          placeholder="rgba(0,0,0,0.3)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Scrolled Background</Label>
                        <Input
                          value={scrolledBg}
                          onChange={(e) => setScrolledBg(e.target.value)}
                          placeholder="#112250"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
