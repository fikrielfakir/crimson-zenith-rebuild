import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  MapPin, 
  Search,
  Filter,
  Settings,
  Phone,
  Mail,
  Globe,
  Star,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";

interface Club {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  image: string;
  members: string;
  memberCount: number;
  location: string;
  features: string[];
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  rating: number;
  established?: string;
  isActive: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ClubsManagement = () => {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: 1,
      name: "Marrakech Club",
      description: "Explore the vibrant souks and palaces of the Red City",
      longDescription: "Immerse yourself in the magical atmosphere of Marrakech, where ancient traditions meet modern adventures. Our club offers exclusive access to hidden gems, local artisan workshops, and authentic experiences.",
      image: "🏛️",
      members: "250+ Members",
      memberCount: 250,
      location: "Marrakech, Morocco",
      features: ["Historic Tours", "Local Cuisine", "Artisan Workshops"],
      contactPhone: "+212 524 123 456",
      contactEmail: "contact@marrakech-club.ma",
      website: "https://marrakech-club.ma",
      socialMedia: {
        facebook: "https://facebook.com/marrakechclub",
        instagram: "https://instagram.com/marrakechclub",
        twitter: "https://twitter.com/marrakechclub"
      },
      rating: 4.8,
      established: "2019",
      isActive: true,
      ownerId: "admin-1",
      createdAt: "2019-03-15T10:00:00Z",
      updatedAt: "2024-12-20T15:30:00Z"
    },
    {
      id: 2,
      name: "Fez Club", 
      description: "Discover the ancient medina and cultural heritage",
      longDescription: "Step into history with our guided explorations of Fez's UNESCO World Heritage medina, traditional crafts workshops, and cultural immersion experiences.",
      image: "🕌",
      members: "180+ Members",
      memberCount: 180,
      location: "Fez, Morocco", 
      features: ["Medina Walks", "Traditional Crafts", "Cultural Events"],
      contactPhone: "+212 535 987 654",
      contactEmail: "hello@fez-club.ma",
      website: "https://fez-club.ma",
      socialMedia: {
        facebook: "https://facebook.com/fezclub",
        instagram: "https://instagram.com/fezclub"
      },
      rating: 4.6,
      established: "2020",
      isActive: true,
      ownerId: "admin-2",
      createdAt: "2020-06-10T14:00:00Z",
      updatedAt: "2024-12-18T09:45:00Z"
    },
    {
      id: 3,
      name: "Casablanca Club",
      description: "Experience the modern emerging art scene",
      longDescription: "Discover Morocco's economic capital through its thriving art galleries, modern architecture, coastal adventures, and vibrant contemporary culture.",
      image: "🌊",
      members: "320+ Members",
      memberCount: 320,
      location: "Casablanca, Morocco",
      features: ["Art Galleries", "Modern Culture", "Coastal Adventures"],
      contactPhone: "+212 522 456 789",
      contactEmail: "info@casablanca-club.ma",
      website: "https://casablanca-club.ma",
      socialMedia: {
        facebook: "https://facebook.com/casablancaclub",
        instagram: "https://instagram.com/casablancaclub",
        twitter: "https://twitter.com/casablancaclub",
        youtube: "https://youtube.com/casablancaclub"
      },
      rating: 4.9,
      established: "2018",
      isActive: true,
      ownerId: "admin-3",
      createdAt: "2018-11-22T11:30:00Z",
      updatedAt: "2024-12-22T16:20:00Z"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClub, setNewClub] = useState<Partial<Club>>({
    name: '',
    description: '',
    longDescription: '',
    image: '🏛️',
    members: '0 Members',
    memberCount: 0,
    location: '',
    features: [],
    contactPhone: '',
    contactEmail: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    rating: 5,
    established: new Date().getFullYear().toString(),
    isActive: true,
    ownerId: ''
  });

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClub = () => {
    // Validation
    if (!newClub.name?.trim()) {
      alert('Club name is required');
      return;
    }
    if (!newClub.description?.trim()) {
      alert('Club description is required');
      return;
    }
    if (!newClub.location?.trim()) {
      alert('Club location is required');
      return;
    }

    // Generate safe ID
    const nextId = clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) + 1 : 1;
    
    const club: Club = {
      id: nextId,
      name: newClub.name.trim(),
      description: newClub.description.trim(),
      longDescription: newClub.longDescription?.trim() || '',
      image: newClub.image || '🏛️',
      members: newClub.members || '0 Members',
      memberCount: newClub.memberCount || 0,
      location: newClub.location.trim(),
      features: newClub.features || [],
      contactPhone: newClub.contactPhone?.trim() || '',
      contactEmail: newClub.contactEmail?.trim() || '',
      website: newClub.website?.trim() || '',
      socialMedia: newClub.socialMedia || {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      },
      rating: newClub.rating || 5,
      established: newClub.established || new Date().getFullYear().toString(),
      isActive: newClub.isActive ?? true,
      ownerId: newClub.ownerId?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClubs([...clubs, club]);
    setNewClub({ 
      name: '', 
      description: '', 
      longDescription: '',
      image: '🏛️', 
      members: '0 Members', 
      memberCount: 0,
      location: '', 
      features: [],
      contactPhone: '',
      contactEmail: '',
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      },
      rating: 5,
      established: new Date().getFullYear().toString(),
      isActive: true,
      ownerId: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateClub = () => {
    if (!editingClub) return;

    // Validation
    if (!editingClub.name?.trim()) {
      alert('Club name is required');
      return;
    }
    if (!editingClub.description?.trim()) {
      alert('Club description is required');
      return;
    }
    if (!editingClub.location?.trim()) {
      alert('Club location is required');
      return;
    }

    const updatedClub: Club = {
      ...editingClub,
      name: editingClub.name.trim(),
      description: editingClub.description.trim(),
      longDescription: editingClub.longDescription?.trim() || '',
      location: editingClub.location.trim(),
      contactPhone: editingClub.contactPhone?.trim() || '',
      contactEmail: editingClub.contactEmail?.trim() || '',
      website: editingClub.website?.trim() || '',
      socialMedia: editingClub.socialMedia || {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      },
      memberCount: editingClub.memberCount || 0,
      rating: editingClub.rating || 5,
      established: editingClub.established || new Date().getFullYear().toString(),
      isActive: editingClub.isActive ?? true,
      ownerId: editingClub.ownerId?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    setClubs(clubs.map(club => club.id === editingClub.id ? updatedClub : club));
    setEditingClub(null);
  };

  const handleDeleteClub = (id: number) => {
    setClubs(clubs.filter(club => club.id !== id));
  };

  const addFeature = (clubRef: any, setClubRef: any) => {
    const feature = prompt('Enter new feature:');
    if (feature && feature.trim()) {
      setClubRef({
        ...clubRef,
        features: [...(clubRef.features || []), feature.trim()]
      });
    }
  };

  const removeFeature = (clubRef: any, setClubRef: any, index: number) => {
    setClubRef({
      ...clubRef,
      features: clubRef.features.filter((_: any, i: number) => i !== index)
    });
  };

  const ClubForm = ({ club, setClub, onSave, title }: any) => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {title}
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="status">Status & Admin</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                value={club.name || ''}
                onChange={(e) => setClub({...club, name: e.target.value})}
                placeholder="Enter club name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Club Icon</Label>
              <Input
                id="emoji"
                value={club.image || ''}
                onChange={(e) => setClub({...club, image: e.target.value})}
                placeholder="🏛️"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={club.description || ''}
              onChange={(e) => setClub({...club, description: e.target.value})}
              placeholder="Brief description for club listings"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longDescription">Detailed Description</Label>
            <Textarea
              id="longDescription"
              value={club.longDescription || ''}
              onChange={(e) => setClub({...club, longDescription: e.target.value})}
              placeholder="Detailed description for club page"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={club.location || ''}
                onChange={(e) => setClub({...club, location: e.target.value})}
                placeholder="City, Morocco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established Year</Label>
              <Input
                id="established"
                value={club.established || ''}
                onChange={(e) => setClub({...club, established: e.target.value})}
                placeholder="2019"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Club Features</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {club.features?.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  {feature}
                  <button
                    onClick={() => removeFeature(club, setClub, index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFeature(club, setClub)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </TabsContent>

        {/* Contact & Social Media Tab */}
        <TabsContent value="contact" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={club.contactEmail || ''}
                onChange={(e) => setClub({...club, contactEmail: e.target.value})}
                placeholder="contact@club.ma"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                value={club.contactPhone || ''}
                onChange={(e) => setClub({...club, contactPhone: e.target.value})}
                placeholder="+212 5XX XXX XXX"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                value={club.website || ''}
                onChange={(e) => setClub({...club, website: e.target.value})}
                placeholder="https://club-website.ma"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-sm font-medium">Social Media Links</Label>
              
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={club.socialMedia?.facebook || ''}
                  onChange={(e) => setClub({
                    ...club, 
                    socialMedia: { ...club.socialMedia, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/yourclub"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={club.socialMedia?.instagram || ''}
                  onChange={(e) => setClub({
                    ...club, 
                    socialMedia: { ...club.socialMedia, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/yourclub"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={club.socialMedia?.twitter || ''}
                  onChange={(e) => setClub({
                    ...club, 
                    socialMedia: { ...club.socialMedia, twitter: e.target.value }
                  })}
                  placeholder="https://twitter.com/yourclub"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  value={club.socialMedia?.youtube || ''}
                  onChange={(e) => setClub({
                    ...club, 
                    socialMedia: { ...club.socialMedia, youtube: e.target.value }
                  })}
                  placeholder="https://youtube.com/yourclub"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberCount">Member Count</Label>
              <Input
                id="memberCount"
                type="number"
                value={club.memberCount || 0}
                onChange={(e) => setClub({...club, memberCount: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating" className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Rating
              </Label>
              <Select 
                value={club.rating?.toString() || '5'} 
                onValueChange={(value) => setClub({...club, rating: parseFloat(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5.0)</SelectItem>
                  <SelectItem value="4.9">⭐⭐⭐⭐⭐ (4.9)</SelectItem>
                  <SelectItem value="4.8">⭐⭐⭐⭐⭐ (4.8)</SelectItem>
                  <SelectItem value="4.7">⭐⭐⭐⭐⭐ (4.7)</SelectItem>
                  <SelectItem value="4.6">⭐⭐⭐⭐⭐ (4.6)</SelectItem>
                  <SelectItem value="4.5">⭐⭐⭐⭐⭐ (4.5)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4.0)</SelectItem>
                  <SelectItem value="3.5">⭐⭐⭐ (3.5)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="members">Display Text for Members</Label>
            <Input
              id="members"
              value={club.members || ''}
              onChange={(e) => setClub({...club, members: e.target.value})}
              placeholder="250+ Members"
            />
            <p className="text-xs text-muted-foreground">
              This text is displayed publicly (e.g., "250+ Members", "Active Community")
            </p>
          </div>
        </TabsContent>

        {/* Status & Admin Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Club Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  Active clubs are visible to users and accepting new members
                </p>
              </div>
              <Switch
                checked={club.isActive ?? true}
                onCheckedChange={(checked) => setClub({...club, isActive: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="ownerId" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Club Owner ID
              </Label>
              <Input
                id="ownerId"
                value={club.ownerId || ''}
                onChange={(e) => setClub({...club, ownerId: e.target.value})}
                placeholder="admin-1"
              />
              <p className="text-xs text-muted-foreground">
                User ID of the club owner/administrator
              </p>
            </div>
            
            {club.createdAt && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Creation Details
                </Label>
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  <p>Created: {new Date(club.createdAt).toLocaleDateString()}</p>
                  {club.updatedAt && (
                    <p>Last Updated: {new Date(club.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex gap-2 pt-4">
        <Button onClick={onSave} className="flex-1">
          <Settings className="w-4 h-4 mr-2" />
          Save Club Configuration
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clubs Management</h1>
            <p className="text-muted-foreground">Manage your sports clubs and communities</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Club
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <ClubForm
                club={newClub}
                setClub={setNewClub}
                onSave={handleCreateClub}
                title="Create New Club"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubs.length}</div>
              <p className="text-xs text-muted-foreground">Across Morocco</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,755+</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(clubs.map(c => c.location.split(',')[0])).size}</div>
              <p className="text-xs text-muted-foreground">Moroccan cities</p>
            </CardContent>
          </Card>
        </div>

        {/* Clubs List */}
        <div className="grid gap-6">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow border-l-4" 
                  style={{ borderLeftColor: club.isActive ? '#10b981' : '#ef4444' }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <div className="text-4xl">{club.image}</div>
                      {!club.isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{club.name}</h3>
                        <Badge variant={club.isActive ? "default" : "destructive"} className="text-xs">
                          {club.isActive ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                        {club.rating && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {club.rating}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{club.description}</p>
                      
                      {/* Enhanced Info Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {club.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {club.memberCount || club.members}
                        </div>
                        {club.established && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Est. {club.established}
                          </div>
                        )}
                        {club.contactEmail && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            Contact Available
                          </div>
                        )}
                      </div>

                      {/* Contact & Social Media Quick Info */}
                      {(club.contactPhone || club.contactEmail || club.website || 
                        Object.values(club.socialMedia || {}).some(url => url)) && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          {club.contactPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              Phone
                            </div>
                          )}
                          {club.contactEmail && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              Email
                            </div>
                          )}
                          {club.website && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Website
                            </div>
                          )}
                          {club.socialMedia?.facebook && (
                            <div className="flex items-center gap-1">
                              <Facebook className="w-3 h-3 text-blue-600" />
                              FB
                            </div>
                          )}
                          {club.socialMedia?.instagram && (
                            <div className="flex items-center gap-1">
                              <Instagram className="w-3 h-3 text-pink-600" />
                              IG
                            </div>
                          )}
                          {club.socialMedia?.twitter && (
                            <div className="flex items-center gap-1">
                              <Twitter className="w-3 h-3 text-blue-400" />
                              TW
                            </div>
                          )}
                          {club.socialMedia?.youtube && (
                            <div className="flex items-center gap-1">
                              <Youtube className="w-3 h-3 text-red-600" />
                              YT
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {club.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingClub(club)}
                          className="w-full justify-start gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Configure
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {editingClub && (
                          <ClubForm
                            club={editingClub}
                            setClub={setEditingClub}
                            onSave={handleUpdateClub}
                            title="Configure Club Details"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${club.name}?`)) {
                          handleDeleteClub(club.id);
                        }
                      }}
                      className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClubsManagement;