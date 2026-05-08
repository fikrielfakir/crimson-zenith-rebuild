import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  LogOut,
  Camera,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Lock,
  CreditCard,
  Clock,
  ChevronRight,
  Star,
  Activity,
  Ticket,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Booking {
  id: number;
  bookingReference: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  numberOfParticipants: number;
  eventDate: string;
  totalPrice: string;
  paymentStatus: string;
  paymentMethod: string | null;
  specialRequests: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  eventTitle?: string;
}

const FAVORITES_KEY = 'journey_favorite_events';

interface FavoriteEvent {
  id: number | string;
  title: string;
  description?: string;
  location?: string;
  price?: number;
  image?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  eventDate?: string;
  category?: string;
  duration?: string;
}

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, refetch } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [userClubs, setUserClubs] = useState<any[]>([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [favoriteEvents, setFavoriteEvents] = useState<FavoriteEvent[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState({ numberOfParticipants: 1, specialRequests: '' });
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    interests: [] as string[],
    profileImageUrl: ''
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate('/login');
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
        interests: user.interests || [],
        profileImageUrl: user.profileImageUrl || ''
      });
      
      fetchUserClubs();
      fetchUserBookings();
      fetchFavoriteEvents();
    }
  }, [user, isAuthenticated, isLoading, toast, navigate]);

  const fetchUserClubs = async () => {
    try {
      setClubsLoading(true);
      const response = await apiFetch('/api/user/clubs');
      if (response.ok) {
        const clubs = await response.json();
        setUserClubs(Array.isArray(clubs) ? clubs : []);
      } else {
        setUserClubs([]);
      }
    } catch (error) {
      console.error('Error fetching user clubs:', error);
      setUserClubs([]);
    } finally {
      setClubsLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await apiFetch('/api/booking/my-tickets');
      if (response.ok) {
        const data = await response.json();
        setUserBookings(Array.isArray(data.tickets) ? data.tickets : []);
      } else {
        setUserBookings([]);
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchFavoriteEvents = async () => {
    try {
      setFavoritesLoading(true);
      const stored = localStorage.getItem(FAVORITES_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setFavoriteIds(new Set(ids));
      if (ids.length === 0) {
        setFavoriteEvents([]);
        return;
      }
      const response = await fetch('/api/booking/events');
      if (response.ok) {
        const data = await response.json();
        const raw: any[] = Array.isArray(data) ? data : (data.events || []);
        const matched = raw
          .filter((e: any) => ids.includes(String(e.id)))
          .map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            location: e.location,
            price: e.price,
            image: e.image,
            status: e.status,
            startDate: e.startDate ?? e.start_date,
            endDate: e.endDate ?? e.end_date,
            eventDate: e.eventDate ?? e.event_date,
            category: e.category,
            duration: e.duration,
          }));
        setFavoriteEvents(matched);
      } else {
        setFavoriteEvents([]);
      }
    } catch (error) {
      console.error('Error fetching favorite events:', error);
      setFavoriteEvents([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const removeFavorite = (eventId: number | string) => {
    const id = String(eventId);
    setFavoriteIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
    setFavoriteEvents(prev => prev.filter(e => String(e.id) !== id));
    toast({ title: 'Removed from favorites' });
  };

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    
    try {
      setActionLoading(true);
      const response = await apiFetch(`/api/booking/my-tickets/${cancellingBooking.bookingReference}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason: cancelReason }),
      });
      
      if (response.ok) {
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully.",
        });
        setCancellingBooking(null);
        setCancelReason('');
        fetchUserBookings();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel booking');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditBooking = async () => {
    if (!editingBooking) return;
    
    try {
      setActionLoading(true);
      const response = await apiFetch(`/api/booking/my-tickets/${editingBooking.bookingReference}/update`, {
        method: 'PUT',
        body: JSON.stringify(editFormData),
      });
      
      if (response.ok) {
        toast({
          title: "Booking Updated",
          description: "Your booking has been updated successfully.",
        });
        setEditingBooking(null);
        fetchUserBookings();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update booking');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (booking: Booking) => {
    setEditFormData({
      numberOfParticipants: booking.numberOfParticipants,
      specialRequests: booking.specialRequests || '',
    });
    setEditingBooking(booking);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
    }).format(parseFloat(price));
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({ title: "Error", description: "All password fields are required.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    try {
      setPasswordLoading(true);
      const response = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Password changed", description: "Your password has been updated successfully." });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        toast({ title: "Error", description: data.message || "Failed to change password.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await apiFetch('/api/auth/user', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        setIsEditing(false);
        if (refetch) refetch();
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        const response = await apiFetch('/api/auth/upload-profile-image', {
          method: 'POST',
          body: JSON.stringify({ imageData }),
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({ ...prev, profileImageUrl: data.profileImageUrl }));
          if (refetch) refetch();
          toast({
            title: "Success",
            description: "Profile image updated successfully!",
          });
        } else {
          throw new Error('Failed to upload image');
        }
        setImageUploading(false);
      };
      reader.onerror = () => {
        setImageUploading(false);
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setImageUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveInterest = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
    } catch (_) {}
    // Clear HMAC user token so subsequent auth checks return unauthenticated
    const { clearUserToken } = await import('@/lib/tokenStore');
    clearUserToken();
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userEmail');
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(227,65%,19%)] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isMember = userClubs.length > 0;
  const stats = {
    clubsJoined: userClubs.length,
    eventsAttended: 0,
    reviewsWritten: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      {/* Profile Hero Section */}
      <div className="relative pt-40 pb-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[hsl(227,65%,19%)] via-[hsl(227,65%,25%)] to-[hsl(227,65%,19%)]" />
          <div className="absolute top-0 left-0 right-0 h-64 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.profileImageUrl || user.profileImageUrl || ""} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-[hsl(227,65%,19%)] to-[hsl(227,65%,30%)] text-white">
                    {profileData.firstName?.[0] || 'U'}{profileData.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="profile-image-upload"
                  className="absolute bottom-1 right-1 w-9 h-9 bg-[hsl(227,65%,19%)] rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-[hsl(227,65%,25%)]"
                >
                  {imageUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-[hsl(227,65%,19%)]">
                        {profileData.firstName || 'User'} {profileData.lastName}
                      </h1>
                      <Badge className={`${isMember ? 'bg-[hsl(42,49%,70%)] text-[hsl(227,65%,19%)]' : 'bg-slate-200 text-slate-700'}`}>
                        {isMember ? 'Member' : 'User'}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-2">{profileData.email}</p>
                    {profileData.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {profileData.location}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-[hsl(227,65%,19%)] text-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,19%)] hover:text-white transition-all"
                    >
                      {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(227,65%,19%)]">{stats.clubsJoined}</div>
                    <div className="text-sm text-slate-500">Clubs Joined</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(227,65%,19%)]">{stats.eventsAttended}</div>
                    <div className="text-sm text-slate-500">Events Attended</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(227,65%,19%)]">{stats.reviewsWritten}</div>
                    <div className="text-sm text-slate-500">Reviews Written</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white shadow-sm rounded-xl p-1 mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clubs" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              My Clubs
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              My Favorites
              {favoriteIds.size > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {favoriteIds.size}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[hsl(227,65%,19%)] data-[state=active]:text-white rounded-lg px-4 py-2">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                              className="border-slate-200 focus:border-[hsl(227,65%,19%)]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                              className="border-slate-200 focus:border-[hsl(227,65%,19%)]"
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
                              className="border-slate-200 focus:border-[hsl(227,65%,19%)]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={profileData.location}
                              onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                              placeholder="City, Morocco"
                              className="border-slate-200 focus:border-[hsl(227,65%,19%)]"
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
                            rows={4}
                            className="border-slate-200 focus:border-[hsl(227,65%,19%)]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Interests</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {profileData.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 cursor-pointer">
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
                            className="border-dashed"
                          >
                            + Add Interest
                          </Button>
                        </div>
                        
                        <Button onClick={handleSaveProfile} className="w-full bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)]">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Email</p>
                              <p className="font-medium text-slate-900">{profileData.email || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Phone className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Phone</p>
                              <p className="font-medium text-slate-900">{profileData.phone || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        
                        {profileData.bio && (
                          <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500 mb-2">About</p>
                            <p className="text-slate-700">{profileData.bio}</p>
                          </div>
                        )}
                        
                        {Array.isArray(profileData.interests) && profileData.interests.length > 0 && (
                          <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500 mb-2">Interests</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.interests.map((interest, index) => (
                                <Badge key={index} className="bg-[hsl(42,49%,70%,0.3)] text-[hsl(227,65%,19%)] border-0">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg text-[hsl(227,65%,19%)]">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Link to="/clubs" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-[hsl(227,65%,19%)]" />
                          <span className="text-sm font-medium text-slate-700">Browse Clubs</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[hsl(227,65%,19%)] transition-colors" />
                      </Link>
                      <Link to="/events" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[hsl(227,65%,19%)]" />
                          <span className="text-sm font-medium text-slate-700">Find Events</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[hsl(227,65%,19%)] transition-colors" />
                      </Link>
                      <Link to="/book" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-[hsl(227,65%,19%)]" />
                          <span className="text-sm font-medium text-slate-700">Book Activity</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[hsl(227,65%,19%)] transition-colors" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Member Since Card */}
                <Card className="shadow-sm border-0 bg-gradient-to-br from-[hsl(227,65%,19%)] to-[hsl(227,65%,25%)] text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 opacity-80" />
                      <span className="text-sm opacity-80">Member Since</span>
                    </div>
                    <p className="text-xl font-bold">December 2024</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* My Clubs Tab */}
          <TabsContent value="clubs" className="space-y-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                  <Users className="w-5 h-5" />
                  My Clubs ({userClubs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {userClubs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Join Your First Club!</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                      Discover amazing clubs and start your adventure with The Journey Association.
                    </p>
                    <Button onClick={() => navigate('/clubs')} className="bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)]">
                      Explore Clubs
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {userClubs.map((membership: any) => (
                      <div key={membership.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[hsl(227,65%,19%)] to-[hsl(227,65%,30%)] rounded-xl flex items-center justify-center">
                            <Users className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">Club #{membership.clubId}</h4>
                            <p className="text-sm text-slate-500">
                              Joined {new Date(membership.joinedAt).toLocaleDateString()}
                            </p>
                            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">{membership.role || 'Member'}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/club/${membership.clubId}`)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                  <Calendar className="w-5 h-5" />
                  My Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Events Yet</h3>
                  <p className="text-slate-500 mb-6">Join clubs to participate in exciting events!</p>
                  <Button onClick={() => navigate('/events')} className="bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)]">
                    Browse Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                  <Ticket className="w-5 h-5" />
                  My Bookings ({userBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookingsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-[hsl(227,65%,19%)]" />
                    <p className="text-slate-500 mt-4">Loading your bookings...</p>
                  </div>
                ) : userBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <Ticket className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No Bookings Yet</h3>
                    <p className="text-slate-500 mb-6">Book your first activity or event!</p>
                    <Button onClick={() => navigate('/book')} className="bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)]">
                      Explore Activities
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[hsl(227,65%,19%)] to-[hsl(227,65%,30%)] rounded-xl flex items-center justify-center flex-shrink-0">
                              <Ticket className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-slate-800 truncate">
                                  {booking.eventTitle || `Event #${booking.eventId}`}
                                </h4>
                                {getStatusBadge(booking.status)}
                              </div>
                              <p className="text-sm text-slate-500 mb-1">
                                <span className="font-medium">Ref:</span> {booking.bookingReference}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(booking.eventDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {booking.numberOfParticipants} participant{booking.numberOfParticipants > 1 ? 's' : ''}
                                </span>
                                <span className="font-semibold text-[hsl(227,65%,19%)]">
                                  {formatPrice(booking.totalPrice)}
                                </span>
                              </div>
                              {booking.specialRequests && (
                                <p className="text-sm text-slate-500 mt-2 italic">
                                  Note: {booking.specialRequests}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {booking.status === 'pending' && (
                            <div className="flex gap-2 flex-shrink-0">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(booking)}
                                className="border-[hsl(227,65%,19%)] text-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,19%)] hover:text-white"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setCancellingBooking(booking)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                  <Heart className="w-5 h-5 text-red-500" fill="#ef4444" />
                  My Favorites ({favoriteEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {favoritesLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-[hsl(227,65%,19%)]" />
                    <p className="text-slate-500 mt-4">Loading your favorites...</p>
                  </div>
                ) : favoriteEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-red-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No Favorites Yet</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                      Heart any event on the booking page to save it here for quick access.
                    </p>
                    <Button onClick={() => navigate('/book')} className="bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)]">
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favoriteEvents.map((event) => {
                      const dateStr = event.startDate || event.eventDate;
                      const formattedDate = dateStr
                        ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : null;
                      return (
                        <div
                          key={event.id}
                          className="group relative border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer bg-white"
                          onClick={() => navigate(`/book?event=${event.id}`)}
                        >
                          {/* Event Image */}
                          <div className="relative h-44 bg-slate-100 overflow-hidden">
                            <img
                              src={event.image && !event.image.startsWith('blob:') ? event.image : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'; }}
                            />
                            {/* Remove button */}
                            <button
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors z-10"
                              title="Remove from favorites"
                              onClick={(e) => { e.stopPropagation(); removeFavorite(event.id); }}
                            >
                              <Heart className="w-4 h-4 text-red-500" fill="#ef4444" />
                            </button>
                            {/* Status badge */}
                            {event.status && (
                              <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                event.status.toLowerCase() === 'upcoming'
                                  ? 'bg-blue-100 text-blue-700'
                                  : event.status.toLowerCase() === 'ongoing'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {event.status}
                              </span>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="p-4">
                            <h4 className="font-semibold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-[hsl(227,65%,19%)] transition-colors">
                              {event.title}
                            </h4>

                            <div className="space-y-1.5 text-sm text-slate-500 mb-4">
                              {event.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                              {formattedDate && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{formattedDate}</span>
                                </div>
                              )}
                              {event.duration && (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{event.duration}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <span className="font-bold text-[hsl(227,65%,19%)]">
                                {event.price ? `${event.price} MAD` : 'Free'}
                              </span>
                              <Button
                                size="sm"
                                className="bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)] text-white text-xs px-3 h-8"
                                onClick={(e) => { e.stopPropagation(); navigate(`/book?event=${event.id}`); }}
                              >
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Activity Yet</h3>
                  <p className="text-slate-500">Your activity timeline will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                    <Shield className="w-5 h-5" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-800">Email</p>
                        <p className="text-sm text-slate-500">{profileData.email}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  </div>
                  {!showPasswordForm ? (
                    <Button
                      variant="outline"
                      className="w-full border-[hsl(227,65%,19%)] text-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,19%)] hover:text-white transition-all"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="relative">
                        <Label className="text-xs text-slate-500 mb-1 block">Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPw ? "text" : "password"}
                            placeholder="Current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                            className="pr-10 h-10 text-sm"
                          />
                          <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">New Password</Label>
                        <div className="relative">
                          <Input
                            type={showNewPw ? "text" : "password"}
                            placeholder="New password (min. 6 chars)"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                            className="pr-10 h-10 text-sm"
                          />
                          <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            type={showConfirmPw ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                            className="pr-10 h-10 text-sm"
                          />
                          <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          className="flex-1 h-9 text-sm bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)] text-white"
                          onClick={handleChangePassword}
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                          {passwordLoading ? 'Saving…' : 'Save Password'}
                        </Button>
                        <Button
                          variant="outline"
                          className="h-9 text-sm"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                          disabled={passwordLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-[hsl(227,65%,19%)]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Event Reminders</p>
                      <p className="text-sm text-slate-500">Get notified before events</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-[hsl(227,65%,19%)]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-[hsl(227,65%,19%)]">
                    <Eye className="w-5 h-5" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Profile Visibility</p>
                      <p className="text-sm text-slate-500">Who can see your profile</p>
                    </div>
                    <select className="border rounded-lg px-3 py-1.5 text-sm">
                      <option>Public</option>
                      <option>Members Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white border-red-100">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <X className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-slate-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 w-full">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      {/* Edit Booking Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update your booking details. Only pending bookings can be edited.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-participants">Number of Participants</Label>
              <Input
                id="edit-participants"
                type="number"
                min="1"
                max="50"
                value={editFormData.numberOfParticipants}
                onChange={(e) => setEditFormData(prev => ({ 
                  ...prev, 
                  numberOfParticipants: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-requests">Special Requests</Label>
              <Textarea
                id="edit-requests"
                placeholder="Any special requirements or notes..."
                value={editFormData.specialRequests}
                onChange={(e) => setEditFormData(prev => ({ 
                  ...prev, 
                  specialRequests: e.target.value 
                }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditBooking} 
              disabled={actionLoading}
              className="bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)]"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={!!cancellingBooking} onOpenChange={() => setCancellingBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {cancellingBooking && (
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="font-medium text-slate-800">{cancellingBooking.eventTitle || `Event #${cancellingBooking.eventId}`}</p>
                <p className="text-sm text-slate-500">Ref: {cancellingBooking.bookingReference}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason for Cancellation (Optional)</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Why are you cancelling this booking?"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancellingBooking(null)}>
              Keep Booking
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelBooking} 
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
