import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  MapPin, 
  Search,
  Filter,
  Users,
  Clock
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  difficulty: string;
  rsvpCount: number;
  maxCapacity: number;
  description: string;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const EventsManagement = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Atlas Mountains Winter Trek",
      date: "2024-12-15",
      time: "08:00",
      location: "Imlil, High Atlas",
      category: "Trekking",
      difficulty: "Moderate",
      rsvpCount: 12,
      maxCapacity: 15,
      description: "Join us for a spectacular winter trek through snow-capped peaks",
      organizer: "Atlas Hikers Club",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Sahara Desert Photography Workshop",
      date: "2024-12-20",
      time: "06:00",
      location: "Merzouga Dunes",
      category: "Photography",
      difficulty: "Easy",
      rsvpCount: 8,
      maxCapacity: 10,
      description: "Capture the beauty of sunrise over the Sahara with expert guidance",
      organizer: "Photography Collective",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Coastal Surfing Session",
      date: "2024-12-18",
      time: "09:00",
      location: "Taghazout Beach",
      category: "Water Sports",
      difficulty: "Beginner",
      rsvpCount: 6,
      maxCapacity: 12,
      description: "Perfect waves for beginners and intermediate surfers",
      organizer: "Coastal Riders",
      status: "upcoming"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Trekking',
    difficulty: 'Easy',
    rsvpCount: 0,
    maxCapacity: 10,
    description: '',
    organizer: '',
    status: 'upcoming'
  });

  const categories = ['Trekking', 'Photography', 'Water Sports', 'Cultural', 'Climbing', 'Desert'];
  const difficulties = ['Easy', 'Moderate', 'Hard'];
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateEvent = () => {
    // Validation
    if (!newEvent.title?.trim()) {
      alert('Event title is required');
      return;
    }
    if (!newEvent.date) {
      alert('Event date is required');
      return;
    }
    if (!newEvent.time) {
      alert('Event time is required');
      return;
    }
    if (!newEvent.location?.trim()) {
      alert('Event location is required');
      return;
    }
    if (!newEvent.organizer?.trim()) {
      alert('Event organizer is required');
      return;
    }
    if (!newEvent.description?.trim()) {
      alert('Event description is required');
      return;
    }
    if (!Number.isFinite(newEvent.maxCapacity) || (newEvent.maxCapacity || 0) < 1) {
      alert('Max capacity must be at least 1');
      return;
    }
    if (!Number.isFinite(newEvent.rsvpCount) || (newEvent.rsvpCount || 0) < 0) {
      alert('RSVP count must be 0 or greater');
      return;
    }
    if ((newEvent.rsvpCount || 0) > (newEvent.maxCapacity || 0)) {
      alert('RSVP count cannot exceed max capacity');
      return;
    }

    // Generate safe ID
    const nextId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    
    const event: Event = {
      id: nextId,
      title: newEvent.title.trim(),
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location.trim(),
      category: newEvent.category || 'Trekking',
      difficulty: newEvent.difficulty || 'Easy',
      rsvpCount: Number.isFinite(newEvent.rsvpCount) ? Math.max(0, newEvent.rsvpCount) : 0,
      maxCapacity: Number.isFinite(newEvent.maxCapacity) ? Math.max(1, newEvent.maxCapacity) : 10,
      description: newEvent.description.trim(),
      organizer: newEvent.organizer.trim(),
      status: newEvent.status || 'upcoming'
    } as Event;
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      category: 'Trekking',
      difficulty: 'Easy',
      rsvpCount: 0,
      maxCapacity: 10,
      description: '',
      organizer: '',
      status: 'upcoming'
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    // Validation
    if (!editingEvent.title?.trim()) {
      alert('Event title is required');
      return;
    }
    if (!editingEvent.date) {
      alert('Event date is required');
      return;
    }
    if (!editingEvent.time) {
      alert('Event time is required');
      return;
    }
    if (!editingEvent.location?.trim()) {
      alert('Event location is required');
      return;
    }
    if (!editingEvent.organizer?.trim()) {
      alert('Event organizer is required');
      return;
    }
    if (!editingEvent.description?.trim()) {
      alert('Event description is required');
      return;
    }
    if (!Number.isFinite(editingEvent.maxCapacity) || editingEvent.maxCapacity < 1) {
      alert('Max capacity must be a valid number and at least 1');
      return;
    }
    if (!Number.isFinite(editingEvent.rsvpCount) || editingEvent.rsvpCount < 0) {
      alert('RSVP count must be a valid number and cannot be negative');
      return;
    }
    if (editingEvent.rsvpCount > editingEvent.maxCapacity) {
      alert('RSVP count cannot exceed max capacity');
      return;
    }

    const updatedEvent = {
      ...editingEvent,
      title: editingEvent.title.trim(),
      location: editingEvent.location.trim(),
      description: editingEvent.description.trim(),
      organizer: editingEvent.organizer.trim(),
      rsvpCount: Number.isFinite(editingEvent.rsvpCount) ? Math.max(0, editingEvent.rsvpCount) : 0,
      maxCapacity: Number.isFinite(editingEvent.maxCapacity) ? Math.max(1, editingEvent.maxCapacity) : 1
    };

    setEvents(events.map(event => event.id === editingEvent.id ? updatedEvent : event));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EventForm = ({ event, setEvent, onSave, title }: any) => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={event.title}
            onChange={(e) => setEvent({...event, title: e.target.value})}
            placeholder="Enter event title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizer">Organizer</Label>
          <Input
            id="organizer"
            value={event.organizer}
            onChange={(e) => setEvent({...event, organizer: e.target.value})}
            placeholder="Event organizer"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={event.description}
          onChange={(e) => setEvent({...event, description: e.target.value})}
          placeholder="Enter event description"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={event.date}
            onChange={(e) => setEvent({...event, date: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={event.time}
            onChange={(e) => setEvent({...event, time: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={event.location}
            onChange={(e) => setEvent({...event, location: e.target.value})}
            placeholder="Event location"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={event.category} onValueChange={(value) => setEvent({...event, category: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={event.difficulty} onValueChange={(value) => setEvent({...event, difficulty: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(diff => (
                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={event.status} onValueChange={(value) => setEvent({...event, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Max Capacity</Label>
          <Input
            id="maxCapacity"
            type="number"
            value={event.maxCapacity || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
              setEvent({...event, maxCapacity: Number.isFinite(value) ? value : 0});
            }}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rsvpCount">Current RSVPs</Label>
          <Input
            id="rsvpCount"
            type="number"
            value={event.rsvpCount || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
              setEvent({...event, rsvpCount: Number.isFinite(value) ? value : 0});
            }}
            min="0"
          />
        </div>
      </div>
      <Button onClick={onSave} className="w-full">
        Save Event
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Events Management</h1>
            <p className="text-muted-foreground">Manage your events and activities</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <EventForm
                event={newEvent}
                setEvent={setNewEvent}
                onSave={handleCreateEvent}
                title="Create New Event"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => e.status === 'upcoming').length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce((sum, e) => sum + e.rsvpCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(events.reduce((sum, e) => sum + (e.rsvpCount / e.maxCapacity * 100), 0) / events.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Filled</p>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <Badge className={getDifficultyColor(event.difficulty)}>
                          {event.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.rsvpCount}/{event.maxCapacity} attendees
                      </div>
                      <div>
                        <strong>Organizer:</strong> {event.organizer}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.rsvpCount / event.maxCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        {editingEvent && (
                          <EventForm
                            event={editingEvent}
                            setEvent={setEditingEvent}
                            onSave={handleUpdateEvent}
                            title="Edit Event"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${event.title}?`)) {
                          handleDeleteEvent(event.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
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

export default EventsManagement;