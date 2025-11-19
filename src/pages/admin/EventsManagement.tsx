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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
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
  highlights: z.string().optional(),
  included: z.string().optional(),
  notIncluded: z.string().optional(),
  importantInfo: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled']).default('draft'),
});

type EventFormData = z.infer<typeof eventSchema>;

async function fetchEvents(params: { search?: string; status?: string; category?: string; page: number; perPage: number }) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    perPage: params.perPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
    ...(params.category && params.category !== 'all' && { category: params.category }),
  });
  
  const response = await fetch(`/api/admin/events?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

export default function EventsManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [viewingEvent, setViewingEvent] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-events', { search, statusFilter, categoryFilter, page, perPage }],
    queryFn: () => fetchEvents({
      search,
      status: statusFilter,
      category: categoryFilter,
      page,
      perPage,
    }),
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
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
      highlights: '',
      included: '',
      notIncluded: '',
      importantInfo: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (editingEvent && editingEvent.id) {
      form.reset({
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        location: editingEvent.location || '',
        locationDetails: editingEvent.locationDetails || '',
        startDate: editingEvent.startDate ? new Date(editingEvent.startDate).toISOString().slice(0, 16) : '',
        endDate: editingEvent.endDate ? new Date(editingEvent.endDate).toISOString().slice(0, 16) : '',
        duration: editingEvent.duration || '',
        category: editingEvent.category || '',
        languages: editingEvent.languages || '',
        minAge: editingEvent.minAge?.toString() || '',
        maxPeople: editingEvent.maxPeople?.toString() || '',
        maxAttendees: editingEvent.maxAttendees?.toString() || '',
        price: editingEvent.price?.toString() || '',
        highlights: editingEvent.highlights || '',
        included: editingEvent.included || '',
        notIncluded: editingEvent.notIncluded || '',
        importantInfo: editingEvent.importantInfo || '',
        status: editingEvent.status || 'draft',
      });
    } else {
      form.reset({
        title: '',
        description: '',
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
        highlights: '',
        included: '',
        notIncluded: '',
        importantInfo: '',
        status: 'draft',
      });
    }
  }, [editingEvent, form]);

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
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
        ...data,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
        price: data.price ? parseFloat(data.price) : null,
        minAge: data.minAge ? parseInt(data.minAge) : null,
        maxPeople: data.maxPeople ? parseInt(data.maxPeople) : null,
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
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: `Event ${editingEvent ? 'updated' : 'created'} successfully` });
      setEditingEvent(null);
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

  const handleSelectEvent = (eventId: number, checked: boolean) => {
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

  const onSubmit = (data: EventFormData) => {
    saveEventMutation.mutate(data);
  };

  const events = data?.events || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journey Events Management</h1>
          <p className="text-muted-foreground mt-1">Manage bookable events for The Journey Association</p>
        </div>
        <Button onClick={() => setEditingEvent({})}>
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
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
                      {event.startDate && format(new Date(event.startDate), 'MMM d, yyyy')}
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
                    <Badge variant={
                      event.status === 'published' ? 'default' :
                      event.status === 'draft' ? 'secondary' :
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
                        <DropdownMenuItem onClick={() => setEditingEvent(event)}>
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

      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, data?.total || 0)} of {data?.total || 0} events
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(data?.totalPages || 0, 5) }, (_, i) => {
              const pageNum = page <= 3 ? i + 1 : page - 2 + i;
              if (pageNum > (data?.totalPages || 0)) return null;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))}
              disabled={page === data?.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={editingEvent !== null} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent?.id ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent?.id ? 'Update event information' : 'Create a new event for your community'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Event title" />
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
                      <Textarea {...field} placeholder="Event description" rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
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
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., English, French, Arabic" />
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
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingEvent(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveEventMutation.isPending}>
                  {saveEventMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingEvent?.id ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingEventId !== null} onOpenChange={(open) => !open && setDeletingEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingEventId && deleteEventMutation.mutate(deletingEventId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewingEvent !== null} onOpenChange={(open) => !open && setViewingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              View complete information about this event
            </DialogDescription>
          </DialogHeader>
          {viewingEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{viewingEvent.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{viewingEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm">{viewingEvent.location}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline">{viewingEvent.category}</Badge>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm">
                      {viewingEvent.startDate && format(new Date(viewingEvent.startDate), 'PPP p')}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm">
                      {viewingEvent.endDate && format(new Date(viewingEvent.endDate), 'PPP p')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Attendees</Label>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm">
                      {viewingEvent.attendees || 0} / {viewingEvent.maxAttendees || '∞'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Price</Label>
                  <p className="text-sm mt-1">
                    {viewingEvent.price ? `$${viewingEvent.price}` : 'Free'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <p className="text-sm mt-1">
                  <Badge variant={
                    viewingEvent.status === 'published' ? 'default' :
                    viewingEvent.status === 'draft' ? 'secondary' :
                    viewingEvent.status === 'upcoming' ? 'default' :
                    'destructive'
                  }>
                    {viewingEvent.status}
                  </Badge>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingEvent(null)}>
              Close
            </Button>
            <Button onClick={() => {
              setEditingEvent(viewingEvent);
              setViewingEvent(null);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
