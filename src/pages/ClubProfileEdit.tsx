import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  X, 
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ClubProfileEdit = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [club, setClub] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    features: [],
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to be logged in to edit club profiles.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (clubId) {
      fetchClubData();
    }
  }, [clubId, isAuthenticated, isLoading, toast]);

  const fetchClubData = async () => {
    try {
      const response = await fetch(`/api/clubs/${clubId}`);
      if (response.ok) {
        const clubData = await response.json();
        setClub(clubData);
        setIsOwner(user?.id === clubData.ownerId);
        
        setFormData({
          name: clubData.name || '',
          description: clubData.description || '',
          longDescription: clubData.longDescription || '',
          location: clubData.location || '',
          contactPhone: clubData.contactPhone || '',
          contactEmail: clubData.contactEmail || '',
          website: clubData.website || '',
          features: clubData.features || [],
          socialMedia: {
            facebook: clubData.socialMedia?.facebook || '',
            instagram: clubData.socialMedia?.instagram || '',
            twitter: clubData.socialMedia?.twitter || '',
            youtube: clubData.socialMedia?.youtube || ''
          }
        });
      } else {
        throw new Error('Club not found');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load club data.",
        variant: "destructive",
      });
      navigate('/clubs');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Club profile updated successfully!",
        });
        navigate(`/club/${encodeURIComponent(formData.name)}`);
      } else {
        throw new Error('Failed to update club');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update club profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addFeature = () => {
    const feature = prompt('Enter new feature:');
    if (feature && feature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to edit this club.</p>
          <Button onClick={() => navigate('/clubs')}>Back to Clubs</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/club/${encodeURIComponent(club?.name || '')}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Club
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Club Profile</h1>
            <p className="text-muted-foreground">Update your club's information and settings</p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Club Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Enter club name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                      placeholder="City, Morocco"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Brief description of your club"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Detailed Description</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => setFormData(prev => ({...prev, longDescription: e.target.value}))}
                    placeholder="Detailed description of your club, activities, and mission"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Features & Activities</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {feature}
                        <button
                          onClick={() => removeFeature(index)}
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
                    onClick={addFeature}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({...prev, contactEmail: e.target.value}))}
                      placeholder="contact@yourclub.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({...prev, contactPhone: e.target.value}))}
                      placeholder="+212 xxx xxx xxx"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({...prev, website: e.target.value}))}
                      placeholder="https://www.yourclub.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      socialMedia: {...prev.socialMedia, facebook: e.target.value}
                    }))}
                    placeholder="https://facebook.com/yourclub"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      socialMedia: {...prev.socialMedia, instagram: e.target.value}
                    }))}
                    placeholder="https://instagram.com/yourclub"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      socialMedia: {...prev.socialMedia, twitter: e.target.value}
                    }))}
                    placeholder="https://twitter.com/yourclub"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.socialMedia.youtube}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      socialMedia: {...prev.socialMedia, youtube: e.target.value}
                    }))}
                    placeholder="https://youtube.com/yourclub"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Club Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
                  <p className="text-muted-foreground mb-4">
                    Add photos of your club activities, events, and members
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="sticky bottom-4 mt-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Save Changes</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure all information is accurate before saving.
                  </p>
                </div>
                <Button onClick={handleSave} size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Club Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClubProfileEdit;