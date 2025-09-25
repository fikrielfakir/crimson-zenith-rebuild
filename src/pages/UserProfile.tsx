import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Users,
  Calendar,
  Settings,
  LogOut
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userClubs, setUserClubs] = useState([]);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    interests: []
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        interests: user.interests || []
      });
      
      // Fetch user clubs
      fetchUserClubs();
    }
  }, [user, isAuthenticated, isLoading, toast]);

  const fetchUserClubs = async () => {
    try {
      const response = await fetch('/api/user/clubs');
      if (response.ok) {
        const clubs = await response.json();
        setUserClubs(clubs);
      }
    } catch (error) {
      console.error('Error fetching user clubs:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddInterest = () => {
    const interest = prompt('Enter new interest:');
    if (interest && interest.trim()) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const handleRemoveInterest = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback className="text-2xl">
                {profileData.firstName?.[0] || 'U'}{profileData.lastName?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-muted-foreground">{profileData.email}</p>
              {profileData.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="clubs">My Clubs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                          placeholder="+212 xxx xxx xxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                          placeholder="City, Morocco"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Interests</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profileData.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer">
                            {interest}
                            <button
                              onClick={() => handleRemoveInterest(index)}
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
                        onClick={handleAddInterest}
                      >
                        Add Interest
                      </Button>
                    </div>
                    
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </h4>
                        <p className="text-muted-foreground">{profileData.email || 'Not provided'}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </h4>
                        <p className="text-muted-foreground">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    {profileData.bio && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Bio</h4>
                        <p className="text-muted-foreground">{profileData.bio}</p>
                      </div>
                    )}
                    
                    {profileData.interests.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clubs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Clubs ({userClubs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userClubs.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No clubs yet</h3>
                    <p className="text-muted-foreground mb-4">Join a club to get started!</p>
                    <Button onClick={() => navigate('/clubs')}>
                      Browse Clubs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userClubs.map((membership: any) => (
                      <div key={membership.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Club #{membership.clubId}</h4>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(membership.joinedAt).toLocaleDateString()}
                            </p>
                            <Badge variant="secondary">{membership.role}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => navigate(`/club/${membership.clubId}`)}>
                          View Club
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  My Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground">Join clubs to participate in events!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Settings</h3>
                  <p className="text-muted-foreground">Account settings will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;