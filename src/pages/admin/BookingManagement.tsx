import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  DollarSign,
  Image,
  Save,
  RotateCcw
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface BookingEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  languages: string[];
  ageRange: string;
  groupSize: string;
  cancellationPolicy: string;
  images: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  schedule: { time: string; activity: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingPageSettings {
  id: string;
  title: string;
  subtitle: string;
  headerBackgroundImage: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  enableReviews: boolean;
  enableSimilarEvents: boolean;
  enableImageGallery: boolean;
  maxParticipants: number;
  minimumBookingHours: number;
  customCss: string;
  seoTitle: string;
  seoDescription: string;
}

const BookingManagement = () => {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [pageSettings, setPageSettings] = useState<BookingPageSettings>({
    id: "booking-page-settings",
    title: "Book Your Adventure",
    subtitle: "Secure your spot for an unforgettable Moroccan experience",
    headerBackgroundImage: "/book-hero.jpg",
    footerText: "Questions? Contact our team for personalized assistance.",
    contactEmail: "bookings@morocclubs.com",
    contactPhone: "+212 522 123 456",
    enableReviews: true,
    enableSimilarEvents: true,
    enableImageGallery: true,
    maxParticipants: 25,
    minimumBookingHours: 24,
    customCss: "",
    seoTitle: "Book Morocco Adventures | Morocco Clubs",
    seoDescription: "Book authentic Moroccan experiences with local clubs. From Atlas Mountains trekking to Sahara expeditions and cultural festivals."
  });

  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Fetch events from backend on component mount
  useEffect(() => {
    fetchEvents();
    fetchSettings();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const response = await fetch('/api/booking/events');
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events || []);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true);
      const response = await fetch('/api/booking/settings');
      const data = await response.json();
      if (response.ok) {
        setPageSettings(data.settings);
      } else {
        console.error('Failed to fetch settings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent({
      id: "",
      title: "",
      subtitle: "",
      description: "",
      location: "",
      duration: "",
      price: 0,
      originalPrice: 0,
      rating: 5.0,
      reviewCount: 0,
      category: "",
      languages: ["English"],
      ageRange: "All ages welcome",
      groupSize: "2-10 people",
      cancellationPolicy: "Free cancellation up to 24 hours before",
      images: [],
      highlights: [],
      included: [],
      notIncluded: [],
      schedule: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: BookingEvent) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!selectedEvent) return;

    try {
      if (selectedEvent.id === "") {
        // Create new event
        const response = await fetch('/api/booking/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedEvent)
        });
        
        if (response.ok) {
          await fetchEvents(); // Refresh the events list
        } else {
          const data = await response.json();
          console.error('Failed to create event:', data.error);
          return;
        }
      } else {
        // Update existing event
        const response = await fetch(`/api/booking/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedEvent)
        });
        
        if (response.ok) {
          await fetchEvents(); // Refresh the events list
        } else {
          const data = await response.json();
          console.error('Failed to update event:', data.error);
          return;
        }
      }

      setIsEventDialogOpen(false);
      setSelectedEvent(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/booking/events/${eventId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchEvents(); // Refresh the events list
      } else {
        const data = await response.json();
        console.error('Failed to delete event:', data.error);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/booking/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageSettings)
      });
      
      if (response.ok) {
        setIsSettingsDialogOpen(false);
      } else {
        const data = await response.json();
        console.error('Failed to save settings:', data.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const getBookingUrl = (eventId: string) => {
    return `${window.location.origin}/book?event=${encodeURIComponent(eventId)}`;
  };

  const copyBookingUrl = (eventId: string) => {
    navigator.clipboard.writeText(getBookingUrl(eventId));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Booking Management</h1>
            <p className="text-muted-foreground">Manage bookable events and customize the booking page</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Page Settings
            </Button>
            <Button onClick={handleCreateEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.isActive).length}</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Price</p>
                  <p className="text-2xl font-bold">${Math.round(events.reduce((sum, e) => sum + e.price, 0) / events.length || 0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{(events.reduce((sum, e) => sum + e.rating, 0) / events.length || 0).toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Bookable Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={event.images[0] || "/api/placeholder/80/80"} 
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.subtitle}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${event.price}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {event.rating} ({event.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={event.isActive ? "default" : "secondary"}>
                      {event.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyBookingUrl(event.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getBookingUrl(event.id), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Edit Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent?.id === "" ? "Create New Event" : "Edit Event"}
              </DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={selectedEvent.title}
                          onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={selectedEvent.category}
                          onChange={(e) => setSelectedEvent({...selectedEvent, category: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={selectedEvent.subtitle}
                        onChange={(e) => setSelectedEvent({...selectedEvent, subtitle: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedEvent.description}
                        onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={selectedEvent.location}
                          onChange={(e) => setSelectedEvent({...selectedEvent, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={selectedEvent.duration}
                          onChange={(e) => setSelectedEvent({...selectedEvent, duration: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupSize">Group Size</Label>
                        <Input
                          id="groupSize"
                          value={selectedEvent.groupSize}
                          onChange={(e) => setSelectedEvent({...selectedEvent, groupSize: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={selectedEvent.price}
                          onChange={(e) => setSelectedEvent({...selectedEvent, price: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price ($)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={selectedEvent.originalPrice}
                          onChange={(e) => setSelectedEvent({...selectedEvent, originalPrice: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={selectedEvent.isActive}
                        onCheckedChange={(checked) => setSelectedEvent({...selectedEvent, isActive: checked})}
                      />
                      <Label htmlFor="isActive">Event Active</Label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <Label>Highlights (one per line)</Label>
                      <Textarea
                        value={selectedEvent.highlights.join('\n')}
                        onChange={(e) => setSelectedEvent({
                          ...selectedEvent, 
                          highlights: e.target.value.split('\n').filter(h => h.trim())
                        })}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label>What's Included (one per line)</Label>
                      <Textarea
                        value={selectedEvent.included.join('\n')}
                        onChange={(e) => setSelectedEvent({
                          ...selectedEvent, 
                          included: e.target.value.split('\n').filter(i => i.trim())
                        })}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label>What's Not Included (one per line)</Label>
                      <Textarea
                        value={selectedEvent.notIncluded.join('\n')}
                        onChange={(e) => setSelectedEvent({
                          ...selectedEvent, 
                          notIncluded: e.target.value.split('\n').filter(i => i.trim())
                        })}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                      <Textarea
                        id="cancellationPolicy"
                        value={selectedEvent.cancellationPolicy}
                        onChange={(e) => setSelectedEvent({...selectedEvent, cancellationPolicy: e.target.value})}
                        rows={2}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="space-y-4">
                    <div>
                      <Label>Schedule (format: HH:MM | Activity description, one per line)</Label>
                      <Textarea
                        value={selectedEvent.schedule.map(s => `${s.time} | ${s.activity}`).join('\n')}
                        onChange={(e) => {
                          const schedule = e.target.value.split('\n').map(line => {
                            const [time, ...activityParts] = line.split('|');
                            return {
                              time: time?.trim() || '',
                              activity: activityParts.join('|').trim() || ''
                            };
                          }).filter(s => s.time && s.activity);
                          setSelectedEvent({...selectedEvent, schedule});
                        }}
                        rows={6}
                        placeholder="09:00 | Meet at designated meeting point&#10;11:00 | Explore traditional music venues"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="space-y-4">
                    <div>
                      <Label>Image URLs (one per line)</Label>
                      <Textarea
                        value={selectedEvent.images.join('\n')}
                        onChange={(e) => setSelectedEvent({
                          ...selectedEvent, 
                          images: e.target.value.split('\n').filter(img => img.trim())
                        })}
                        rows={4}
                        placeholder="/api/placeholder/800/500&#10;/path/to/image2.jpg"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEvent}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Event
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Page Settings Dialog */}
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Page Settings</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input
                    id="pageTitle"
                    value={pageSettings.title}
                    onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={pageSettings.contactPhone}
                    onChange={(e) => setPageSettings({...pageSettings, contactPhone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="pageSubtitle">Page Subtitle</Label>
                <Input
                  id="pageSubtitle"
                  value={pageSettings.subtitle}
                  onChange={(e) => setPageSettings({...pageSettings, subtitle: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={pageSettings.contactEmail}
                  onChange={(e) => setPageSettings({...pageSettings, contactEmail: e.target.value})}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Page Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableReviews"
                      checked={pageSettings.enableReviews}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, enableReviews: checked})}
                    />
                    <Label htmlFor="enableReviews">Enable Reviews Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSimilarEvents"
                      checked={pageSettings.enableSimilarEvents}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, enableSimilarEvents: checked})}
                    />
                    <Label htmlFor="enableSimilarEvents">Show Similar Events</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableImageGallery"
                      checked={pageSettings.enableImageGallery}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, enableImageGallery: checked})}
                    />
                    <Label htmlFor="enableImageGallery">Enable Image Gallery</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={pageSettings.seoTitle}
                    onChange={(e) => setPageSettings({...pageSettings, seoTitle: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={pageSettings.maxParticipants}
                    onChange={(e) => setPageSettings({...pageSettings, maxParticipants: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={pageSettings.seoDescription}
                  onChange={(e) => setPageSettings({...pageSettings, seoDescription: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BookingManagement;