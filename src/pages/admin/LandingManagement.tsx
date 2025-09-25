import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Filter,
  Eye,
  EyeOff,
  GripVertical,
  Layout,
  Image,
  Type,
  Star,
  BarChart3,
  Calendar,
  Info,
  Phone,
  ImageIcon
} from "lucide-react";
import type { 
  LandingSection, 
  SectionDesign,
  HeroSectionData, 
  ActivitiesSectionData,
  TestimonialsSectionData,
  StatsSectionData,
  EventsSectionData,
  AboutSectionData,
  ContactSectionData,
  GallerySectionData 
} from "@/types/admin";

const LandingManagement = () => {
  const [sections, setSections] = useState<LandingSection[]>([
    {
      id: 1,
      pageId: 1,
      key: 'hero',
      type: 'hero',
      title: 'Hero Section',
      subtitle: 'Main landing hero with call-to-action',
      data: {
        backgroundImage: '/hero-bg.jpg',
        title: 'Explore Morocco\'s Best Sports Clubs',
        subtitle: 'Join vibrant communities of adventurers and culture enthusiasts',
        ctaText: 'Explore Clubs',
        ctaLink: '/clubs',
        overlayOpacity: 0.6
      } as HeroSectionData,
      order: 1,
      isVisible: true,
      locale: 'EN',
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 2,
      pageId: 1,
      key: 'activities',
      type: 'activities',
      title: 'Activities Section',
      subtitle: 'Showcase available activities',
      data: {
        title: 'Discover Amazing Activities',
        subtitle: 'From mountain trekking to cultural experiences',
        activities: [
          {
            id: '1',
            name: 'Atlas Mountains Trekking',
            description: 'Multi-day adventures in Morocco\'s highest peaks',
            image: '/discover-hero.jpg',
            difficulty: 'Moderate to Challenging',
            duration: '2-7 days'
          },
          {
            id: '2', 
            name: 'Desert Expeditions',
            description: 'Camel trekking and camping in the Sahara',
            image: '/gallery-hero.jpg',
            difficulty: 'Easy to Moderate',
            duration: '1-3 days'
          },
          {
            id: '3',
            name: 'Cultural Tours',
            description: 'Explore medinas, souks, and local traditions',
            image: '/clubs-hero.jpg',
            difficulty: 'Easy',
            duration: 'Half day to 2 days'
          }
        ]
      } as ActivitiesSectionData,
      order: 2,
      isVisible: true,
      locale: 'EN',
      createdAt: '2024-12-15T10:30:00Z',
      updatedAt: '2024-12-15T10:30:00Z'
    },
    {
      id: 3,
      pageId: 1,
      key: 'testimonials',
      type: 'testimonials',
      title: 'Testimonials Section',
      subtitle: 'Member reviews and experiences',
      data: {
        title: 'What Our Members Say',
        testimonials: [
          {
            id: '1',
            name: 'Sarah Johnson',
            role: 'Adventure Enthusiast',
            content: 'Incredible experiences with amazing people. The Atlas Mountains trek was life-changing!',
            avatar: '/api/placeholder/80/80',
            rating: 5
          },
          {
            id: '2',
            name: 'Ahmed Hassan',
            role: 'Cultural Explorer',
            content: 'The cultural tours opened my eyes to Morocco\'s rich heritage. Highly recommended!',
            avatar: '/api/placeholder/80/80',
            rating: 5
          },
          {
            id: '3',
            name: 'Maria Garcia',
            role: 'Photography Club Member',
            content: 'Perfect combination of adventure and culture. Great community of photographers!',
            avatar: '/api/placeholder/80/80',
            rating: 5
          }
        ]
      } as TestimonialsSectionData,
      order: 3,
      isVisible: true,
      locale: 'EN',
      createdAt: '2024-12-15T11:00:00Z',
      updatedAt: '2024-12-15T11:00:00Z'
    },
    {
      id: 4,
      pageId: 1,
      key: 'stats',
      type: 'stats',
      title: 'Statistics Section',
      subtitle: 'Key numbers and achievements',
      data: {
        title: 'Our Impact',
        stats: [
          {
            id: '1',
            label: 'Active Members',
            value: '1,500+',
            icon: 'users'
          },
          {
            id: '2',
            label: 'Adventures Organized',
            value: '500+',
            icon: 'mountain'
          },
          {
            id: '3',
            label: 'Years Experience',
            value: '10+',
            icon: 'calendar'
          },
          {
            id: '4',
            label: 'Club Locations',
            value: '25+',
            icon: 'map-pin'
          }
        ]
      } as StatsSectionData,
      order: 4,
      isVisible: true,
      locale: 'EN',
      createdAt: '2024-12-15T11:30:00Z',
      updatedAt: '2024-12-15T11:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVisible, setFilterVisible] = useState<string>('all');
  const [editingSection, setEditingSection] = useState<LandingSection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState<Partial<LandingSection>>({
    key: '',
    type: 'hero',
    title: '',
    subtitle: '',
    data: {},
    order: sections.length + 1,
    isVisible: true,
    locale: 'EN'
  });

  const sectionTypes = [
    { value: 'hero', label: 'Hero Banner', icon: Layout },
    { value: 'activities', label: 'Activities Grid', icon: Image },
    { value: 'testimonials', label: 'Testimonials', icon: Star },
    { value: 'stats', label: 'Statistics', icon: BarChart3 },
    { value: 'events', label: 'Events', icon: Calendar },
    { value: 'about', label: 'About Us', icon: Info },
    { value: 'contact', label: 'Contact', icon: Phone },
    { value: 'gallery', label: 'Gallery', icon: ImageIcon }
  ];

  const filteredSections = sections
    .filter(section => {
      const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          section.key.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || section.type === filterType;
      const matchesVisible = filterVisible === 'all' || 
                            (filterVisible === 'visible' && section.isVisible) ||
                            (filterVisible === 'hidden' && !section.isVisible);
      return matchesSearch && matchesType && matchesVisible;
    })
    .sort((a, b) => a.order - b.order);

  const handleCreateSection = () => {
    if (!newSection.key?.trim() || !newSection.title?.trim()) {
      alert('Key and title are required');
      return;
    }

    if (sections.some(s => s.key === newSection.key)) {
      alert('Section key must be unique');
      return;
    }

    const section: LandingSection = {
      id: Date.now(),
      pageId: 1,
      key: newSection.key!,
      type: newSection.type!,
      title: newSection.title!,
      subtitle: newSection.subtitle || '',
      data: getDefaultSectionData(newSection.type!),
      order: newSection.order!,
      isVisible: newSection.isVisible!,
      locale: newSection.locale!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSections(prev => [...prev, section]);
    setIsCreateDialogOpen(false);
    setNewSection({
      key: '',
      type: 'hero',
      title: '',
      subtitle: '',
      data: {},
      order: sections.length + 2,
      isVisible: true,
      locale: 'EN'
    });
  };

  const getDefaultSectionData = (type: LandingSection['type']) => {
    switch (type) {
      case 'hero':
        return {
          backgroundImage: '',
          title: 'New Hero Title',
          subtitle: 'Hero subtitle',
          ctaText: 'Learn More',
          ctaLink: '/',
          overlayOpacity: 0.5
        };
      case 'activities':
        return {
          title: 'Our Activities',
          subtitle: 'What we offer',
          activities: []
        };
      case 'testimonials':
        return {
          title: 'Testimonials',
          testimonials: []
        };
      case 'stats':
        return {
          title: 'Our Statistics',
          stats: []
        };
      default:
        return {};
    }
  };

  const handleUpdateSection = (section: LandingSection) => {
    setSections(prev => prev.map(s => s.id === section.id ? section : s));
    setEditingSection(null);
  };

  const handleDeleteSection = (id: number) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleVisibility = (id: number) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, isVisible: !s.isVisible, updatedAt: new Date().toISOString() } : s
    ));
  };

  const getSectionIcon = (type: string) => {
    const sectionType = sectionTypes.find(st => st.value === type);
    return sectionType ? sectionType.icon : Layout;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Landing Page Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage and customize landing page sections
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Section</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Section Key*</Label>
                    <Input
                      id="key"
                      placeholder="e.g., hero, activities"
                      value={newSection.key || ''}
                      onChange={(e) => setNewSection(prev => ({ ...prev, key: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Section Type*</Label>
                    <Select
                      value={newSection.type}
                      onValueChange={(value) => setNewSection(prev => ({ ...prev, type: value as LandingSection['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sectionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    value={newSection.title || ''}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={newSection.subtitle || ''}
                    onChange={(e) => setNewSection(prev => ({ ...prev, subtitle: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={newSection.order || 1}
                      onChange={(e) => setNewSection(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="visible"
                      checked={newSection.isVisible}
                      onCheckedChange={(checked) => setNewSection(prev => ({ ...prev, isVisible: checked }))}
                    />
                    <Label htmlFor="visible">Visible on page</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSection}>
                  Create Section
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sections..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {sectionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterVisible} onValueChange={setFilterVisible}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="visible">Visible Only</SelectItem>
                  <SelectItem value="hidden">Hidden Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sections List */}
        <div className="grid gap-4">
          {filteredSections.map((section) => {
            const IconComponent = getSectionIcon(section.type);
            return (
              <Card key={section.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 cursor-move">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <Badge variant="outline">{section.type}</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Key: {section.key} • Order: {section.order}
                        </p>
                        {section.subtitle && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={section.isVisible ? "default" : "secondary"}>
                        {section.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility(section.id)}
                      >
                        {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSection(section)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Edit Section Dialog */}
        {editingSection && (
          <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Section: {editingSection.title}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="py-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={editingSection.title}
                        onChange={(e) => setEditingSection(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={editingSection.subtitle}
                        onChange={(e) => setEditingSection(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={editingSection.order}
                        onChange={(e) => setEditingSection(prev => prev ? { ...prev, order: parseInt(e.target.value) } : null)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={editingSection.isVisible}
                        onCheckedChange={(checked) => setEditingSection(prev => prev ? { ...prev, isVisible: checked } : null)}
                      />
                      <Label>Visible on page</Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="content" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Content Editing</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Edit the content that appears in this section. Use the visual editor for rich text formatting.
                    </p>
                  </div>
                  
                  {/* Section-specific content editors */}
                  {editingSection.type === 'hero' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Hero Title</Label>
                        <Input
                          value={editingSection.data.title || ''}
                          onChange={(e) => setEditingSection(prev => prev ? { 
                            ...prev, 
                            data: { ...prev.data, title: e.target.value }
                          } : null)}
                          placeholder="Main hero title"
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hero Subtitle</Label>
                        <div className="border rounded-md">
                          <div className="border-b p-2 bg-muted/50">
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  const textarea = document.getElementById('hero-subtitle') as HTMLTextAreaElement;
                                  if (textarea) {
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const selectedText = textarea.value.substring(start, end);
                                    const newText = textarea.value.substring(0, start) + `**${selectedText || 'bold text'}**` + textarea.value.substring(end);
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, subtitle: newText }
                                    } : null);
                                  }
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <strong>B</strong>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const textarea = document.getElementById('hero-subtitle') as HTMLTextAreaElement;
                                  if (textarea) {
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const selectedText = textarea.value.substring(start, end);
                                    const newText = textarea.value.substring(0, start) + `*${selectedText || 'italic text'}*` + textarea.value.substring(end);
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, subtitle: newText }
                                    } : null);
                                  }
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <em>I</em>
                              </Button>
                              <Separator orientation="vertical" className="h-6" />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const currentText = editingSection.data.subtitle || '';
                                  setEditingSection(prev => prev ? { 
                                    ...prev, 
                                    data: { ...prev.data, subtitle: currentText + '\n• ' }
                                  } : null);
                                }}
                                className="h-8 px-2"
                              >
                                List
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            id="hero-subtitle"
                            value={editingSection.data.subtitle || ''}
                            onChange={(e) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              data: { ...prev.data, subtitle: e.target.value }
                            } : null)}
                            placeholder="Hero subtitle or description. Use **bold**, *italic*, or • for lists"
                            rows={4}
                            className="border-0 resize-none focus-visible:ring-0"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Formatting: **bold**, *italic*, • bullet points
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>CTA Button Text</Label>
                          <Input
                            value={editingSection.data.ctaText || ''}
                            onChange={(e) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              data: { ...prev.data, ctaText: e.target.value }
                            } : null)}
                            placeholder="Call to action text"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA Link</Label>
                          <Input
                            value={editingSection.data.ctaLink || ''}
                            onChange={(e) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              data: { ...prev.data, ctaLink: e.target.value }
                            } : null)}
                            placeholder="/clubs"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Background Image URL</Label>
                        <Input
                          value={editingSection.data.backgroundImage || ''}
                          onChange={(e) => setEditingSection(prev => prev ? { 
                            ...prev, 
                            data: { ...prev.data, backgroundImage: e.target.value }
                          } : null)}
                          placeholder="/hero-bg.jpg"
                        />
                      </div>
                    </div>
                  )}

                  {editingSection.type === 'activities' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                          value={editingSection.data.title || ''}
                          onChange={(e) => setEditingSection(prev => prev ? { 
                            ...prev, 
                            data: { ...prev.data, title: e.target.value }
                          } : null)}
                          placeholder="Discover Amazing Activities"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Subtitle</Label>
                        <Input
                          value={editingSection.data.subtitle || ''}
                          onChange={(e) => setEditingSection(prev => prev ? { 
                            ...prev, 
                            data: { ...prev.data, subtitle: e.target.value }
                          } : null)}
                          placeholder="From mountain trekking to cultural experiences"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Activities</Label>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              const newActivity = {
                                id: Date.now().toString(),
                                name: 'New Activity',
                                description: 'Activity description',
                                image: '/placeholder.jpg',
                                difficulty: 'Easy',
                                duration: '1 day'
                              };
                              const currentActivities = editingSection.data.activities || [];
                              setEditingSection(prev => prev ? { 
                                ...prev, 
                                data: { ...prev.data, activities: [...currentActivities, newActivity] }
                              } : null);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Activity
                          </Button>
                        </div>
                        {(editingSection.data.activities || []).map((activity: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h5 className="font-medium">Activity {index + 1}</h5>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newActivities = (editingSection.data.activities || []).filter((_: any, i: number) => i !== index);
                                  setEditingSection(prev => prev ? { 
                                    ...prev, 
                                    data: { ...prev.data, activities: newActivities }
                                  } : null);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Activity Name</Label>
                                <Input
                                  value={activity.name || ''}
                                  onChange={(e) => {
                                    const newActivities = [...(editingSection.data.activities || [])];
                                    newActivities[index] = { ...activity, name: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, activities: newActivities }
                                    } : null);
                                  }}
                                  placeholder="Atlas Mountains Trek"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input
                                  value={activity.image || ''}
                                  onChange={(e) => {
                                    const newActivities = [...(editingSection.data.activities || [])];
                                    newActivities[index] = { ...activity, image: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, activities: newActivities }
                                    } : null);
                                  }}
                                  placeholder="/hero-bg.jpg"
                                />
                              </div>
                              <div className="col-span-2 space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={activity.description || ''}
                                  onChange={(e) => {
                                    const newActivities = [...(editingSection.data.activities || [])];
                                    newActivities[index] = { ...activity, description: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, activities: newActivities }
                                    } : null);
                                  }}
                                  placeholder="Experience breathtaking views and traditional culture"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Duration</Label>
                                <Input
                                  value={activity.duration || ''}
                                  onChange={(e) => {
                                    const newActivities = [...(editingSection.data.activities || [])];
                                    newActivities[index] = { ...activity, duration: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, activities: newActivities }
                                    } : null);
                                  }}
                                  placeholder="3 days"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select
                                  value={activity.difficulty || ''}
                                  onValueChange={(value) => {
                                    const newActivities = [...(editingSection.data.activities || [])];
                                    newActivities[index] = { ...activity, difficulty: value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, activities: newActivities }
                                    } : null);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose difficulty" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingSection.type === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                          value={editingSection.data.title || ''}
                          onChange={(e) => setEditingSection(prev => prev ? { 
                            ...prev, 
                            data: { ...prev.data, title: e.target.value }
                          } : null)}
                          placeholder="What Our Members Say"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Testimonials</Label>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              const newTestimonial = {
                                id: Date.now().toString(),
                                name: 'New Member',
                                role: 'Member',
                                content: 'Great experience!',
                                avatar: '/api/placeholder/80/80',
                                rating: 5
                              };
                              const currentTestimonials = editingSection.data.testimonials || [];
                              setEditingSection(prev => prev ? { 
                                ...prev, 
                                data: { ...prev.data, testimonials: [...currentTestimonials, newTestimonial] }
                              } : null);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Testimonial
                          </Button>
                        </div>
                        {(editingSection.data.testimonials || []).map((testimonial: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h5 className="font-medium">Testimonial {index + 1}</h5>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newTestimonials = (editingSection.data.testimonials || []).filter((_: any, i: number) => i !== index);
                                  setEditingSection(prev => prev ? { 
                                    ...prev, 
                                    data: { ...prev.data, testimonials: newTestimonials }
                                  } : null);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                  value={testimonial.name || ''}
                                  onChange={(e) => {
                                    const newTestimonials = [...(editingSection.data.testimonials || [])];
                                    newTestimonials[index] = { ...testimonial, name: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, testimonials: newTestimonials }
                                    } : null);
                                  }}
                                  placeholder="Sarah Johnson"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Role</Label>
                                <Input
                                  value={testimonial.role || ''}
                                  onChange={(e) => {
                                    const newTestimonials = [...(editingSection.data.testimonials || [])];
                                    newTestimonials[index] = { ...testimonial, role: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, testimonials: newTestimonials }
                                    } : null);
                                  }}
                                  placeholder="Adventure Enthusiast"
                                />
                              </div>
                              <div className="col-span-2 space-y-2">
                                <Label>Testimonial Content</Label>
                                <Textarea
                                  value={testimonial.content || ''}
                                  onChange={(e) => {
                                    const newTestimonials = [...(editingSection.data.testimonials || [])];
                                    newTestimonials[index] = { ...testimonial, content: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, testimonials: newTestimonials }
                                    } : null);
                                  }}
                                  placeholder="Incredible experiences with amazing people..."
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Avatar URL</Label>
                                <Input
                                  value={testimonial.avatar || ''}
                                  onChange={(e) => {
                                    const newTestimonials = [...(editingSection.data.testimonials || [])];
                                    newTestimonials[index] = { ...testimonial, avatar: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, testimonials: newTestimonials }
                                    } : null);
                                  }}
                                  placeholder="/api/placeholder/80/80"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Rating</Label>
                                <Select
                                  value={String(testimonial.rating || 5)}
                                  onValueChange={(value) => {
                                    const newTestimonials = [...(editingSection.data.testimonials || [])];
                                    newTestimonials[index] = { ...testimonial, rating: parseInt(value) };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, testimonials: newTestimonials }
                                    } : null);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose rating" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 Star</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingSection.type === 'stats' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                          value={editingSection.data.title || ''}
                          onChange={(e) => setEditingSection(prev => prev ? { 
                            ...prev, 
                            data: { ...prev.data, title: e.target.value }
                          } : null)}
                          placeholder="Our Impact"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Statistics Items</Label>
                        {(editingSection.data.stats || []).map((stat: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Label</Label>
                                <Input
                                  value={stat.label || ''}
                                  onChange={(e) => {
                                    const newStats = [...(editingSection.data.stats || [])];
                                    newStats[index] = { ...stat, label: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, stats: newStats }
                                    } : null);
                                  }}
                                  placeholder="Active Members"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Value</Label>
                                <Input
                                  value={stat.value || ''}
                                  onChange={(e) => {
                                    const newStats = [...(editingSection.data.stats || [])];
                                    newStats[index] = { ...stat, value: e.target.value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, stats: newStats }
                                    } : null);
                                  }}
                                  placeholder="1,500+"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Icon</Label>
                                <Select
                                  value={stat.icon || ''}
                                  onValueChange={(value) => {
                                    const newStats = [...(editingSection.data.stats || [])];
                                    newStats[index] = { ...stat, icon: value };
                                    setEditingSection(prev => prev ? { 
                                      ...prev, 
                                      data: { ...prev.data, stats: newStats }
                                    } : null);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="users">Users</SelectItem>
                                    <SelectItem value="mountain">Mountain</SelectItem>
                                    <SelectItem value="calendar">Calendar</SelectItem>
                                    <SelectItem value="map-pin">Map Pin</SelectItem>
                                    <SelectItem value="heart">Heart</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback for other section types */}
                  {!['hero', 'stats'].includes(editingSection.type) && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Advanced content editing for {editingSection.type} sections coming soon. 
                        For now, you can edit the raw data below:
                      </p>
                      <Textarea
                        placeholder="JSON data for this section..."
                        className="min-h-[200px] font-mono text-sm"
                        value={JSON.stringify(editingSection.data, null, 2)}
                        onChange={(e) => {
                          try {
                            const data = JSON.parse(e.target.value);
                            setEditingSection(prev => prev ? { ...prev, data } : null);
                          } catch (error) {
                            // Invalid JSON, don't update
                          }
                        }}
                      />
                    </div>
                  )}
                </TabsContent>

                {/* Design Customization Tab */}
                <TabsContent value="design" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Design Customization</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize colors, typography, and visual effects for this section.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {/* Colors */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Colors</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingSection.design?.colors?.background || '#ffffff'}
                              onChange={(e) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  colors: { ...prev.design?.colors, background: e.target.value }
                                }
                              } : null)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={editingSection.design?.colors?.background || '#ffffff'}
                              onChange={(e) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  colors: { ...prev.design?.colors, background: e.target.value }
                                }
                              } : null)}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingSection.design?.colors?.text || '#000000'}
                              onChange={(e) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  colors: { ...prev.design?.colors, text: e.target.value }
                                }
                              } : null)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={editingSection.design?.colors?.text || '#000000'}
                              onChange={(e) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  colors: { ...prev.design?.colors, text: e.target.value }
                                }
                              } : null)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Accent Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingSection.design?.colors?.accent || '#3b82f6'}
                              onChange={(e) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  colors: { ...prev.design?.colors, accent: e.target.value }
                                }
                              } : null)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={editingSection.design?.colors?.accent || '#3b82f6'}
                              onChange={(e) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  colors: { ...prev.design?.colors, accent: e.target.value }
                                }
                              } : null)}
                              placeholder="#3b82f6"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Gradient</Label>
                          <Input
                            value={editingSection.design?.colors?.gradient || ''}
                            onChange={(e) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                colors: { ...prev.design?.colors, gradient: e.target.value }
                              }
                            } : null)}
                            placeholder="linear-gradient(45deg, #ff6b6b, #4ecdc4)"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Typography */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Typography</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Heading Font</Label>
                          <Select
                            value={editingSection.design?.typography?.headingFont || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                typography: { ...prev.design?.typography, headingFont: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Body Font</Label>
                          <Select
                            value={editingSection.design?.typography?.bodyFont || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                typography: { ...prev.design?.typography, bodyFont: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                              <SelectItem value="Nunito">Nunito</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Heading Size</Label>
                          <Select
                            value={editingSection.design?.typography?.headingSize || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                typography: { ...prev.design?.typography, headingSize: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="xl">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Line Height</Label>
                          <Select
                            value={editingSection.design?.typography?.lineHeight || 'normal'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                typography: { ...prev.design?.typography, lineHeight: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose line height" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tight">Tight</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="relaxed">Relaxed</SelectItem>
                              <SelectItem value="loose">Loose</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    {/* Effects */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Visual Effects</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Border Radius</Label>
                          <Select
                            value={editingSection.design?.effects?.borderRadius || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                effects: { ...prev.design?.effects, borderRadius: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="full">Full</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Shadow</Label>
                          <Select
                            value={editingSection.design?.effects?.shadow || 'none'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                effects: { ...prev.design?.effects, shadow: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose shadow" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="xl">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Layout Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control spacing, alignment, and layout structure for this section.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {/* Spacing */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Spacing</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Padding</Label>
                          <Select
                            value={editingSection.design?.spacing?.padding || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                spacing: { ...prev.design?.spacing, padding: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose padding" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="xl">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Margin</Label>
                          <Select
                            value={editingSection.design?.spacing?.margin || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                spacing: { ...prev.design?.spacing, margin: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose margin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="xl">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    {/* Layout Structure */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Layout Structure</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Content Alignment</Label>
                          <Select
                            value={editingSection.design?.layout?.alignment || 'center'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                layout: { ...prev.design?.layout, alignment: value as any }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose alignment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Container Width</Label>
                          <Select
                            value={editingSection.design?.layout?.containerWidth || 'default'}
                            onValueChange={(value) => setEditingSection(prev => prev ? { 
                              ...prev, 
                              design: { 
                                ...prev.design, 
                                layout: { ...prev.design?.layout, containerWidth: value }
                              }
                            } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose width" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="narrow">Narrow</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="wide">Wide</SelectItem>
                              <SelectItem value="full">Full Width</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {editingSection.type === 'stats' && (
                          <div className="space-y-2">
                            <Label>Columns</Label>
                            <Select
                              value={String(editingSection.design?.layout?.columns || 4)}
                              onValueChange={(value) => setEditingSection(prev => prev ? { 
                                ...prev, 
                                design: { 
                                  ...prev.design, 
                                  layout: { ...prev.design?.layout, columns: parseInt(value) }
                                }
                              } : null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose columns" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Column</SelectItem>
                                <SelectItem value="2">2 Columns</SelectItem>
                                <SelectItem value="3">3 Columns</SelectItem>
                                <SelectItem value="4">4 Columns</SelectItem>
                                <SelectItem value="6">6 Columns</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Preview how your changes will look on the homepage. Changes are applied in real-time.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-6 bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                        <Eye className="w-8 h-8" />
                      </div>
                      <h4 className="font-medium mb-2">Preview Coming Soon</h4>
                      <p className="text-sm">
                        Live preview of section changes will be available in a future update. 
                        For now, save your changes and view them on the actual homepage.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateSection({ ...editingSection, updatedAt: new Date().toISOString() })}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default LandingManagement;