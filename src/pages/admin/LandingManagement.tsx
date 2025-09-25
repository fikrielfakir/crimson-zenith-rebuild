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
        backgroundImage: '/public/hero-bg.jpg',
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
            image: '/public/discover-hero.jpg',
            difficulty: 'Moderate to Challenging',
            duration: '2-7 days'
          },
          {
            id: '2', 
            name: 'Desert Expeditions',
            description: 'Camel trekking and camping in the Sahara',
            image: '/public/gallery-hero.jpg',
            difficulty: 'Easy to Moderate',
            duration: '1-3 days'
          },
          {
            id: '3',
            name: 'Cultural Tours',
            description: 'Explore medinas, souks, and local traditions',
            image: '/public/clubs-hero.jpg',
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
                <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content Data</TabsTrigger>
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
                <TabsContent value="content">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Section-specific content data. This is where you can customize the content that appears in this section.
                    </p>
                    <Textarea
                      placeholder="JSON data for this section..."
                      className="min-h-[300px] font-mono text-sm"
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