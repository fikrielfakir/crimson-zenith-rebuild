import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Loader2,
  Clock,
  ArrowLeft,
  Building2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ImageUpload } from '@/components/admin/ImageUpload';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isAssociationEvent: z.boolean().default(false),
  clubId: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  locationDetails: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  duration: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  languages: z.string().optional(),
  minAge: z.string().optional(),
  maxPeople: z.string().optional(),
  maxAttendees: z.string().optional(),
  price: z.string().optional(),
  image: z.string().optional(),
  highlights: z.string().optional(),
  included: z.string().optional(),
  notIncluded: z.string().optional(),
  importantInfo: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
});

type EventFormData = z.infer<typeof eventSchema>;

async function fetchEvents() {
  const response = await fetch(`/api/admin/events`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

async function fetchClubs() {
  const response = await fetch('/api/clubs');
  if (!response.ok) throw new Error('Failed to fetch clubs');
  return response.json();
}

export default function EventsManagement() {
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [viewingEvent, setViewingEvent] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<'club' | 'association' | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-club-events'],
    queryFn: fetchEvents,
  });

  const { data: clubsData } = useQuery({
    queryKey: ['clubs'],
    queryFn: fetchClubs,
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      isAssociationEvent: false,
      clubId: '',
      location: '',
      locationDetails: '',
      startDate: '',
      endDate: '',
      duration: '',
      category: '',
      languages: '',
      minAge: '',
      maxPeople: '',
      maxAttendees: '',
      price: '',
      image: '',
      highlights: '',
      included: '',
      notIncluded: '',
      importantInfo: '',
      status: 'upcoming',
    },
  });

  useEffect(() => {
    if (editingEvent && editingEvent.id) {
      setShowForm(true);
      setSelectedEventType(editingEvent.isAssociationEvent ? 'association' : 'club');
      form.reset({
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        isAssociationEvent: !!editingEvent.isAssociationEvent,
        clubId: editingEvent.clubId?.toString() || '',
        location: editingEvent.location || '',
        locationDetails: editingEvent.locationDetails || '',
        startDate: editingEvent.eventDate ? new Date(editingEvent.eventDate).toISOString().slice(0, 16) : '',
        endDate: editingEvent.endDate ? new Date(editingEvent.endDate).toISOString().slice(0, 16) : '',
        duration: editingEvent.duration || '',
        category: editingEvent.category || '',
        languages: editingEvent.languages || '',
        minAge: editingEvent.minAge?.toString() || '',
        maxPeople: editingEvent.maxPeople?.toString() || '',
        maxAttendees: editingEvent.maxParticipants?.toString() || '',
        price: editingEvent.price?.toString() || '',
        image: editingEvent.image || '',
        highlights: editingEvent.highlights || '',
        included: editingEvent.included || '',
        notIncluded: editingEvent.notIncluded || '',
        importantInfo: editingEvent.importantInfo || '',
        status: editingEvent.status || 'upcoming',
      });
    } else if (editingEvent && !editingEvent.id) {
      setShowForm(true);
      setSelectedEventType(null);
      form.reset({
        title: '',
        description: '',
        isAssociationEvent: false,
        clubId: '',
        location: '',
        locationDetails: '',
        startDate: '',
        endDate: '',
        duration: '',
        category: '',
        languages: '',
        minAge: '',
        maxPeople: '',
        maxAttendees: '',
        price: '',
        image: '',
        highlights: '',
        included: '',
        notIncluded: '',
        importantInfo: '',
        status: 'upcoming',
      });
    }
  }, [editingEvent, form]);

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-events'] });
      toast({ title: 'Event deleted successfully' });
      setDeletingEventId(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete event', description: error.message, variant: 'destructive' });
    },
  });

  const saveEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const url = (editingEvent && editingEvent.id)
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events';
      
      const payload = {
        title: data.title,
        description: data.description,
        isAssociationEvent: data.isAssociationEvent,
        clubId: data.clubId && !data.isAssociationEvent ? parseInt(data.clubId) : null,
        location: data.location,
        locationDetails: data.locationDetails,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        duration: data.duration || null,
        category: data.category,
        languages: data.languages || null,
        minAge: data.minAge ? parseInt(data.minAge) : null,
        maxPeople: data.maxPeople ? parseInt(data.maxPeople) : null,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
        price: data.price ? parseFloat(data.price) : null,
        image: data.image || null,
        highlights: data.highlights || null,
        included: data.included || null,
        notIncluded: data.notIncluded || null,
        importantInfo: data.importantInfo || null,
        status: data.status,
      };
      
      const response = await fetch(url, {
        method: (editingEvent && editingEvent.id) ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-events'] });
      toast({ title: `Event ${editingEvent ? 'updated' : 'created'} successfully` });
      setEditingEvent(null);
      setShowForm(false);
      setSelectedEventType(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save event', description: error.message, variant: 'destructive' });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(data?.events.map((e: any) => e.id) || []);
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    }
  };

  const handleExport = () => {
    toast({ title: 'Exporting events...', description: 'Download will start shortly' });
  };

  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;
    toast({ title: `Deleting ${selectedEvents.length} events...` });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setSelectedEventType(null);
    form.reset();
  };

  const handleEventTypeSelection = (type: 'club' | 'association') => {
    setSelectedEventType(type);
    form.setValue('isAssociationEvent', type === 'association');
  };

  const onSubmit = (data: EventFormData) => {
    saveEventMutation.mutate(data);
  };

  const filteredEvents = (data?.events || []).filter((event: any) => {
    if (search && !event.title?.toLowerCase().includes(search.toLowerCase()) && 
        !event.location?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    if (eventTypeFilter !== 'all') {
      if (eventTypeFilter === 'association' && !event.isAssociationEvent) return false;
      if (eventTypeFilter === 'club' && event.isAssociationEvent) return false;
    }
    
    if (categoryFilter !== 'all' && event.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && event.status !== statusFilter) return false;
    
    return true;
  });

  const events = filteredEvents;

  if (showForm) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancelForm}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{editingEvent?.id ? 'Edit Event' : 'Create New Event'}</h1>
            <p className="text-muted-foreground mt-1">
              {editingEvent?.id ? 'Update event information' : 'Add a new event to your community'}
            </p>
          </div>
        </div>

        {!editingEvent?.id && !selectedEventType && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Select Event Type</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose whether this is a club event or an association event
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => handleEventTypeSelection('club')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Club Event</CardTitle>
                      <CardDescription>Event organized by a specific club</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create an event for a specific club in your community. The event will be associated with the club you select.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => handleEventTypeSelection('association')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Globe className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Journey Association Event</CardTitle>
                      <CardDescription>Event organized by the main association</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create an event organized by The Journey Association. This event will be visible to all members.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {(selectedEventType || editingEvent?.id) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {form.watch('isAssociationEvent') ? (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    <Globe className="h-3 w-3 mr-1" />
                    Journey Association Event
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    <Building2 className="h-3 w-3 mr-1" />
                    Club Event
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter event title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your event" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!form.watch('isAssociationEvent') && (
                    <FormField
                      control={form.control}
                      name="clubId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Club</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a club" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clubsData?.clubs?.map((club: any) => (
                                <SelectItem key={club.id} value={club.id.toString()}>
                                  {club.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Event location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="locationDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Details (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Atlas Mountains, Morocco" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="conference">Conference</SelectItem>
                              <SelectItem value="meetup">Meetup</SelectItem>
                              <SelectItem value="webinar">Webinar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 3 Days / 2 Nights" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxAttendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Attendees (optional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Unlimited" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (optional)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} placeholder="Free" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., English, French" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Age (optional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="12+" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxPeople"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max People (optional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlights (optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter each highlight on a new line" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="included"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's Included (optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter each item on a new line" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notIncluded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's Not Included (optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter each item on a new line" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="importantInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Important Information (optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Any important information for participants" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Image (optional)</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={handleCancelForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saveEventMutation.isPending}>
                      {saveEventMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        editingEvent?.id ? 'Update Event' : 'Create Event'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journey Events Management</h1>
          <p className="text-muted-foreground mt-1">Manage bookable events for The Journey Association</p>
        </div>
        <Button onClick={() => { setEditingEvent({}); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="club">Club Events</SelectItem>
            <SelectItem value="association">Association Events</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="meetup">Meetup</SelectItem>
            <SelectItem value="webinar">Webinar</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {event.eventDate && format(new Date(event.eventDate), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.isAssociationEvent ? 'default' : 'secondary'}>
                      {event.isAssociationEvent ? 'Association' : 'Club'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      event.status === 'upcoming' ? 'default' :
                      event.status === 'ongoing' ? 'secondary' :
                      event.status === 'completed' ? 'outline' :
                      'destructive'
                    }>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {event.attendees || 0}/{event.maxAttendees || '∞'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setViewingEvent(event)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingEvent(event); setShowForm(true); }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingEventId(event.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deletingEventId !== null} onOpenChange={(open) => !open && setDeletingEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEventId && deleteEventMutation.mutate(deletingEventId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
