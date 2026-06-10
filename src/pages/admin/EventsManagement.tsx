import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect } from 'react';
import { useAdminRole, useAdminUser } from '@/hooks/useAdminRole';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
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
  Copy,
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
import { TranslateDialog } from '@/components/admin/TranslateDialog';

/** Convert any date string to MySQL-compatible datetime: '2026-06-15 08:00:00' */
function toMySQLDatetime(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new Date(value).toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return null;
  }
}

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
  image: z.string().min(1, 'Event image is required'),
  highlights: z.string().optional(),
  included: z.string().optional(),
  notIncluded: z.string().optional(),
  importantInfo: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
});

type EventFormData = z.infer<typeof eventSchema>;

async function fetchEvents() {
  const response = await apiFetch(`/api/admin/events`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

async function fetchClubs() {
  const response = await apiFetch('/api/clubs');
  if (!response.ok) throw new Error('Failed to fetch clubs');
  return response.json();
}

export default function EventsManagement() {
  const { t } = useTranslation();
  const adminRole = useAdminRole();
  const adminUser = useAdminUser() as any;
  const isClubManager = adminRole === 'club_manager';
  const managedClubId = adminUser?.managedClubId ? String(adminUser.managedClubId) : null;

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
  const [activeLangTab, setActiveLangTab] = useState<'fr' | 'ar' | 'es'>('fr');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
    fr: {}, ar: {}, es: {},
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
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

  const isEditingExistingEvent = editingEvent && editingEvent.id && editingEvent.id !== '';

  useEffect(() => {
    if (editingEvent && editingEvent.id && editingEvent.id !== '') {
      setShowForm(true);
      setSelectedEventType(editingEvent.isAssociationEvent ? 'association' : 'club');
      if (editingEvent.translations && typeof editingEvent.translations === 'object') {
        setTranslations({
          fr: editingEvent.translations.fr ?? {},
          ar: editingEvent.translations.ar ?? {},
          es: editingEvent.translations.es ?? {},
        });
      } else {
        setTranslations({ fr: {}, ar: {}, es: {} });
      }
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
    } else if (editingEvent && (!editingEvent.id || editingEvent.id === '')) {
      setShowForm(true);
      // Club managers always create club-type events — skip the type selector
      setSelectedEventType(isClubManager ? 'club' : null);
      form.reset({
        title: '',
        description: '',
        isAssociationEvent: false,
        clubId: isClubManager ? (managedClubId ?? '') : '',
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
      const response = await apiFetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-events'] });
      toast({ title: t('admin.events.toastDeleted') });
      setDeletingEventId(null);
    },
    onError: (error: Error) => {
      toast({ title: t('admin.events.toastDeleteFailed'), description: error.message, variant: 'destructive' });
    },
  });

  const saveEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const isEditing = editingEvent && editingEvent.id;
      const url = isEditing
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events';

      const payload = {
        title: data.title,
        description: data.description,
        isAssociationEvent: data.isAssociationEvent,
        clubId: data.clubId && !data.isAssociationEvent ? parseInt(data.clubId) : null,
        location: data.location,
        locationDetails: data.locationDetails,
        startDate: toMySQLDatetime(data.startDate),
        endDate: toMySQLDatetime(data.endDate),
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
        translations,
      };

      const response = await apiFetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-events'] });
      toast({ title: editingEvent?.id ? t('admin.events.toastSaved') : t('admin.events.toastSaved') });
      setEditingEvent(null);
      setShowForm(false);
      setSelectedEventType(null);
      setTranslations({ fr: {}, ar: {}, es: {} });
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: t('admin.events.toastSaveFailed'), description: error.message, variant: 'destructive' });
    },
  });

  const duplicateEventMutation = useMutation({
    mutationFn: async (event: any) => {
      const payload = {
        title: `Copy of ${event.title}`,
        description: event.description,
        isAssociationEvent: event.isAssociationEvent,
        clubId: event.clubId ?? null,
        location: event.location,
        locationDetails: event.locationDetails ?? null,
        startDate: toMySQLDatetime(event.startDate ?? event.eventDate) ?? toMySQLDatetime(new Date().toISOString()),
        endDate: toMySQLDatetime(event.endDate),
        duration: event.duration ?? null,
        category: event.category,
        languages: event.languages ?? null,
        minAge: event.minAge ?? null,
        maxPeople: event.maxPeople ?? null,
        maxAttendees: event.maxAttendees ?? null,
        price: event.price ?? null,
        image: event.image ?? null,
        highlights: event.highlights ?? null,
        included: event.included ?? null,
        notIncluded: event.notIncluded ?? null,
        importantInfo: event.importantInfo ?? null,
        status: 'upcoming',
      };

      const response = await apiFetch('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to duplicate event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-events'] });
      toast({ title: t('admin.events.toastDuplicated'), description: t('admin.events.toastDuplicatedDesc') });
    },
    onError: (error: Error) => {
      toast({ title: t('admin.events.toastDuplicateFailed'), description: error.message, variant: 'destructive' });
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
    toast({ title: t('admin.events.toastExporting'), description: t('admin.events.toastExportDesc') });
  };

  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;
    toast({ title: t('admin.events.toastDeletingBulk', { count: selectedEvents.length }) });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setSelectedEventType(null);
    setTranslations({ fr: {}, ar: {}, es: {} });
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

    // Club managers only see club-type events for their assigned club
    if (isClubManager) {
      if (event.isAssociationEvent) return false;
      if (managedClubId && String(event.clubId) !== managedClubId) return false;
    } else if (eventTypeFilter !== 'all') {
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
            <h1 className="text-3xl font-bold">{isEditingExistingEvent ? t('admin.events.editEvent') : t('admin.events.createNew')}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditingExistingEvent ? t('admin.events.updateInfo') : t('admin.events.addNew')}
            </p>
          </div>
        </div>

        {!isEditingExistingEvent && !selectedEventType && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{t('admin.events.selectTypeTitle')}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.events.selectTypeDesc')}
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
                      <CardTitle>{t('admin.events.clubEventTitle')}</CardTitle>
                      <CardDescription>{t('admin.events.clubEventDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.events.clubEventInfo')}
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
                      <CardTitle>{t('admin.events.assocEventTitle')}</CardTitle>
                      <CardDescription>{t('admin.events.assocEventDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.events.assocEventInfo')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {(selectedEventType || isEditingExistingEvent) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {form.watch('isAssociationEvent') ? (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    <Globe className="h-3 w-3 mr-1" />
                    {t('admin.events.assocEventTitle')}
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    <Building2 className="h-3 w-3 mr-1" />
                    {t('admin.events.clubEventTitle')}
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
                        <FormLabel>{t('admin.events.fieldTitle')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('admin.events.fieldTitlePlaceholder')} />
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
                        <FormLabel>{t('admin.events.fieldDescription')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder={t('admin.events.fieldDescPlaceholder')} rows={4} />
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
                          <FormLabel>{t('admin.events.fieldClub')}</FormLabel>
                          {isClubManager ? (
                            <FormControl>
                              <Input
                                disabled
                                value={
                                  clubsData?.clubs?.find((c: any) => String(c.id) === managedClubId)?.name
                                  ?? managedClubId
                                  ?? t('admin.events.yourClub')
                                }
                              />
                            </FormControl>
                          ) : (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('admin.events.fieldChooseClub')} />
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
                          )}
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
                          <FormLabel>{t('admin.events.colLocation')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('admin.events.fieldLocationPlaceholder')} />
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
                          <FormLabel>{t('admin.events.locationDetailsLabel')}</FormLabel>
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
                          <FormLabel>{t('admin.events.categoryLabel')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('admin.events.selectCategory')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="workshop">{t('admin.events.workshop')}</SelectItem>
                              <SelectItem value="conference">{t('admin.events.conference')}</SelectItem>
                              <SelectItem value="meetup">{t('admin.events.meetup')}</SelectItem>
                              <SelectItem value="webinar">{t('admin.events.webinar')}</SelectItem>
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
                          <FormLabel>{t('admin.events.durationLabel')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('admin.events.durationPlaceholder')} />
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
                          <FormLabel>{t('admin.events.startDateLabel')}</FormLabel>
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
                          <FormLabel>{t('admin.events.endDateLabel')}</FormLabel>
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
                          <FormLabel>{t('admin.events.maxAttendeesLabel')}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder={t('admin.events.maxAttendeesPlaceholder')} />
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
                          <FormLabel>{t('admin.events.priceLabel')}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} placeholder={t('admin.events.pricePlaceholderFree')} />
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
                          <FormLabel>{t('admin.events.languagesLabel')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('admin.events.languagesPlaceholder')} />
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
                          <FormLabel>{t('admin.events.minAgeLabel')}</FormLabel>
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
                          <FormLabel>{t('admin.events.maxPeopleLabel')}</FormLabel>
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
                        <FormLabel>{t('admin.events.highlightsLabel')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder={t('admin.events.highlightsPlaceholder')} rows={3} />
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
                        <FormLabel>{t('admin.events.includedLabel')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder={t('admin.events.includedPlaceholder')} rows={3} />
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
                        <FormLabel>{t('admin.events.notIncludedLabel')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder={t('admin.events.includedPlaceholder')} rows={3} />
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
                        <FormLabel>{t('admin.events.importantInfoLabel')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder={t('admin.events.importantInfoPlaceholder')} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ── Translations Section ─────────────────────────── */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h3 className="font-semibold text-sm">{t('admin.events.translations')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('admin.events.translationsFallbackNote')}
                      </p>
                    </div>
                    {/* Language tabs */}
                    <div className="flex border-b">
                      {(['fr', 'ar', 'es'] as const).map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setActiveLangTab(lang)}
                          className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            activeLangTab === lang
                              ? 'bg-background border-b-2 border-primary text-primary'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {lang === 'fr' ? '🇫🇷 French' : lang === 'ar' ? '🇲🇦 Arabic' : '🇪🇸 Spanish'}
                        </button>
                      ))}
                    </div>
                    {/* Translation fields */}
                    <div className="p-4 space-y-4" dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}>
                      <div className="space-y-1.5">
                        <Label>{t('admin.events.translatedTitle')}</Label>
                        <Input
                          value={translations[activeLangTab]?.title ?? ''}
                          onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], title: e.target.value } }))}
                          placeholder={t('admin.events.translatedTitle')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('admin.events.translatedDesc')}</Label>
                        <Textarea
                          rows={3}
                          value={translations[activeLangTab]?.description ?? ''}
                          onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], description: e.target.value } }))}
                          placeholder={t('admin.events.translatedDesc')}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>{t('admin.events.colLocation')}</Label>
                          <Input
                            value={translations[activeLangTab]?.location ?? ''}
                            onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], location: e.target.value } }))}
                            placeholder={t('admin.events.translatedLocation')}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('admin.events.translatedLocationDetails')}</Label>
                          <Input
                            value={translations[activeLangTab]?.locationDetails ?? ''}
                            onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], locationDetails: e.target.value } }))}
                            placeholder={t('admin.events.translatedLocationDetails')}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('admin.events.translatedHighlights')}</Label>
                        <Textarea
                          rows={3}
                          value={translations[activeLangTab]?.highlights ?? ''}
                          onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], highlights: e.target.value } }))}
                          placeholder={t('admin.events.highlightsPlaceholder')}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>{t('admin.events.translatedIncluded')}</Label>
                          <Textarea
                            rows={3}
                            value={translations[activeLangTab]?.included ?? ''}
                            onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], included: e.target.value } }))}
                            placeholder={t('admin.events.includedPlaceholder')}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('admin.events.translatedNotIncluded')}</Label>
                          <Textarea
                            rows={3}
                            value={translations[activeLangTab]?.notIncluded ?? ''}
                            onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], notIncluded: e.target.value } }))}
                            placeholder={t('admin.events.includedPlaceholder')}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('admin.events.importantInfoLabel')}</Label>
                        <Textarea
                          rows={3}
                          value={translations[activeLangTab]?.importantInfo ?? ''}
                          onChange={e => setTranslations(prev => ({ ...prev, [activeLangTab]: { ...prev[activeLangTab], importantInfo: e.target.value } }))}
                          placeholder={t('admin.events.importantInfoPlaceholder')}
                        />
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.events.fieldImage')} <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel>{t('admin.common.status')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upcoming">{t('admin.events.statusUpcoming')}</SelectItem>
                            <SelectItem value="ongoing">{t('admin.events.statusOngoing')}</SelectItem>
                            <SelectItem value="completed">{t('admin.events.statusCompleted')}</SelectItem>
                            <SelectItem value="cancelled">{t('admin.events.statusCancelled')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={handleCancelForm}>
                      {t('admin.common.cancel')}
                    </Button>
                    <Button type="submit" disabled={saveEventMutation.isPending}>
                      {saveEventMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('admin.events.saving')}
                        </>
                      ) : (
                        isEditingExistingEvent ? t('admin.events.updateEvent') : t('admin.events.createEvent')
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
          <h1 className="text-3xl font-bold">{t('admin.events.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.events.subtitle')}</p>
        </div>
        <Button onClick={() => {
          if (isClubManager) {
            // Club managers skip the type selector — always creates a Club Event
            setSelectedEventType('club');
            setShowForm(true);
            setEditingEvent({});
            form.reset({
              title: '', description: '', isAssociationEvent: false,
              clubId: managedClubId ?? '', location: '', locationDetails: '',
              startDate: '', endDate: '', duration: '', category: '',
              languages: '', minAge: '', maxPeople: '', maxAttendees: '',
              price: '', image: '', highlights: '', included: '',
              notIncluded: '', importantInfo: '', status: 'upcoming',
            });
          } else {
            setEditingEvent({}); setShowForm(true);
          }
        }}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.events.createEvent')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.events.searchPlaceholder')}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!isClubManager && (
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('admin.events.filterEventType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.events.filterAllEvents')}</SelectItem>
              <SelectItem value="club">{t('admin.events.filterClub')}</SelectItem>
              <SelectItem value="association">{t('admin.events.filterAssociation')}</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('admin.events.categoryLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.events.filterAllCategories')}</SelectItem>
            <SelectItem value="workshop">{t('admin.events.workshop')}</SelectItem>
            <SelectItem value="conference">{t('admin.events.conference')}</SelectItem>
            <SelectItem value="meetup">{t('admin.events.meetup')}</SelectItem>
            <SelectItem value="webinar">{t('admin.events.webinar')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('admin.common.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.events.filterAllStatus')}</SelectItem>
            <SelectItem value="upcoming">{t('admin.events.statusUpcoming')}</SelectItem>
            <SelectItem value="ongoing">{t('admin.events.statusOngoing')}</SelectItem>
            <SelectItem value="completed">{t('admin.events.statusCompleted')}</SelectItem>
            <SelectItem value="cancelled">{t('admin.events.statusCancelled')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.events.colTitle')}</TableHead>
              <TableHead>{t('admin.events.colDate')}</TableHead>
              <TableHead>{t('admin.events.colLocation')}</TableHead>
              <TableHead>{t('admin.events.categoryLabel')}</TableHead>
              <TableHead>{t('admin.events.colType')}</TableHead>
              <TableHead>{t('admin.common.status')}</TableHead>
              <TableHead>{t('admin.events.colAttendees')}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full rounded" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium text-foreground">{t('admin.events.failedLoad')}</p>
                    <button onClick={() => refetch()} className="text-xs text-primary underline">{t('admin.common.retry')}</button>
                  </div>
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {t('admin.events.noEvents')}
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
                      {event.isAssociationEvent ? t('admin.bookings.associationBadge') : t('admin.bookings.clubBadge')}
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
                    <div className="flex items-center justify-end gap-1">
                    <TranslateDialog
                      entityType="event"
                      entityId={event.id}
                      entityLabel={event.title}
                      fields={[
                        { key: 'title', label: 'Title' },
                        { key: 'description', label: 'Description', multiline: true },
                        { key: 'location', label: 'Location' },
                        { key: 'highlights', label: 'Highlights', multiline: true },
                        { key: 'importantInfo', label: 'Important Info', multiline: true },
                      ]}
                      sourceValues={{
                        title: event.title,
                        description: (event as any).description ?? '',
                        location: (event as any).location ?? '',
                        highlights: Array.isArray((event as any).highlights) ? (event as any).highlights.join('\n') : ((event as any).highlights ?? ''),
                        importantInfo: (event as any).importantInfo ?? (event as any).important_info ?? '',
                      }}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('admin.common.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setViewingEvent(event)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t('admin.events.viewDetails')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingEvent(event); setShowForm(true); }}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('admin.events.editEvent')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => duplicateEventMutation.mutate(event)}
                          disabled={duplicateEventMutation.isPending}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          {t('admin.events.duplicateEvent')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingEventId(event.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('admin.events.deleteEvent')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
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
            <AlertDialogTitle>{t('admin.common.areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.events.deleteDescConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEventId && deleteEventMutation.mutate(deletingEventId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('admin.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {viewingEvent && (
        <AlertDialog open={viewingEvent !== null} onOpenChange={(open) => !open && setViewingEvent(null)}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">{viewingEvent.title}</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4 text-left">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={viewingEvent.isAssociationEvent ? 'default' : 'secondary'}>
                      {viewingEvent.isAssociationEvent ? t('admin.events.assocEventTitle') : t('admin.events.clubEventTitle')}
                    </Badge>
                    <Badge variant="outline">{viewingEvent.category}</Badge>
                    <Badge variant={
                      viewingEvent.status === 'upcoming' ? 'default' :
                      viewingEvent.status === 'ongoing' ? 'secondary' :
                      viewingEvent.status === 'completed' ? 'outline' :
                      'destructive'
                    }>
                      {viewingEvent.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{t('admin.events.fieldDescription')}</h4>
                    <p className="text-sm">{viewingEvent.description || t('admin.events.viewNoDescription')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {t('admin.events.viewLocation')}
                      </h4>
                      <p className="text-sm">{viewingEvent.location || t('admin.events.viewNotSpecified')}</p>
                      {viewingEvent.locationDetails && (
                        <p className="text-sm text-muted-foreground">{viewingEvent.locationDetails}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {t('admin.events.viewDate')}
                      </h4>
                      <p className="text-sm">
                        {viewingEvent.eventDate ? format(new Date(viewingEvent.eventDate), 'PPP') : t('admin.events.viewNotSpecified')}
                      </p>
                      {viewingEvent.duration && (
                        <p className="text-sm text-muted-foreground">{t('admin.events.viewDuration')}: {viewingEvent.duration}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1">
                        <Users className="h-4 w-4" /> {t('admin.events.viewCapacity')}
                      </h4>
                      <p className="text-sm">
                        {viewingEvent.attendees || 0} / {viewingEvent.maxAttendees || '∞'} {t('admin.events.viewAttendees')}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('admin.events.viewPrice')}</h4>
                      <p className="text-sm">
                        {viewingEvent.price ? `$${viewingEvent.price}` : t('admin.events.viewFree')}
                      </p>
                    </div>
                  </div>

                  {viewingEvent.highlights && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('admin.events.viewHighlights')}</h4>
                      <p className="text-sm whitespace-pre-line">{viewingEvent.highlights}</p>
                    </div>
                  )}

                  {viewingEvent.included && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('admin.events.viewIncluded')}</h4>
                      <p className="text-sm whitespace-pre-line">{viewingEvent.included}</p>
                    </div>
                  )}

                  {viewingEvent.notIncluded && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('admin.events.viewNotIncluded')}</h4>
                      <p className="text-sm whitespace-pre-line">{viewingEvent.notIncluded}</p>
                    </div>
                  )}

                  {viewingEvent.importantInfo && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('admin.events.viewImportantInfo')}</h4>
                      <p className="text-sm whitespace-pre-line">{viewingEvent.importantInfo}</p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('admin.common.close')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setViewingEvent(null); setEditingEvent(viewingEvent); setShowForm(true); }}>
                {t('admin.events.editEvent')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
