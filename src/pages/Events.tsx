import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, MapPin, Users, Cloud, Clock, Filter, List, Map } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

interface BookingEvent {
  id: number;
  title: string;
  date?: string;
  start_date?: string;
  time?: string;
  start_time?: string;
  location?: string;
  category?: string;
  difficulty?: string;
  rsvp_count?: number;
  attending_count?: number;
  max_capacity?: number;
  capacity?: number;
  weather?: string;
  image?: string;
  image_url?: string;
  cover_image?: string;
  organizer?: string;
  description?: string;
  slug?: string;
}

const Events = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "map">("list");
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/booking/events', { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : (data.data ?? []));
      } catch (err: any) {
        setError(err.message ?? 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getEventDate = (e: BookingEvent) => e.start_date ?? e.date ?? '';
  const getEventTime = (e: BookingEvent) => e.start_time ?? e.time ?? '';
  const getRsvpCount = (e: BookingEvent) => e.attending_count ?? e.rsvp_count ?? 0;
  const getMaxCapacity = (e: BookingEvent) => e.max_capacity ?? e.capacity ?? 0;
  const getImage = (e: BookingEvent) => e.image_url ?? e.cover_image ?? e.image ?? '/api/placeholder/400/200';

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success";
      case "Moderate": return "bg-warning";
      case "Hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch ((category ?? '').toLowerCase()) {
      case "trekking": return "🥾";
      case "photography": return "📸";
      case "water sports": return "🏄";
      case "cultural": return "🏛️";
      case "climbing": return "🧗";
      default: return "📍";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Breadcrumbs items={[{ label: 'Events' }]} />

      <div className="bg-warning/10 border-l-4 border-warning py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-warning" />
            <p className="text-sm font-body">
              <strong>Weather Alert:</strong> Light snow expected in Atlas Mountains this weekend. 
              Check event updates for any changes.
            </p>
          </div>
        </div>
      </div>

      <section className="py-6 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <select className="px-3 py-2 border rounded-button text-sm font-body">
                <option>All Categories</option>
                <option>Trekking</option>
                <option>Photography</option>
                <option>Cultural</option>
                <option>Water Sports</option>
                <option>Climbing</option>
              </select>
              <select className="px-3 py-2 border rounded-button text-sm font-body">
                <option>All Difficulties</option>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list" | "map")}>
              <TabsList>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <TabsContent value="calendar" className={viewMode === "calendar" ? "block" : "hidden"}>
            <div className="bg-white rounded-card border p-6 mb-8">
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold font-heading mb-2">Interactive Calendar Coming Soon</h3>
                <p className="text-muted-foreground font-body">
                  Full calendar view with event dots and click-to-view details
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className={viewMode === "list" ? "block" : "hidden"}>
            {loading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground font-body">Loading events…</p>
              </div>
            )}
            {error && (
              <div className="text-center py-16">
                <p className="text-destructive font-body mb-4">Could not load events: {error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}
            {!loading && !error && events.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-body">No upcoming events at the moment.</p>
              </div>
            )}
            {!loading && !error && events.length > 0 && (
              <div className="space-y-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-glow transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                        <img 
                          src={getImage(event)} 
                          alt={event.title}
                          className="w-full h-48 md:h-full object-cover rounded-l-card"
                        />
                      </div>
                      <div className="md:col-span-3 p-6">
                        <div className="flex flex-wrap items-start gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                              <h3 className="text-xl font-semibold font-heading">{event.title}</h3>
                              {event.difficulty && (
                                <Badge className={`${getDifficultyColor(event.difficulty)} text-white`}>
                                  {event.difficulty}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground font-body mb-3">{event.description}</p>
                          </div>
                          <div className="text-right">
                            {getEventDate(event) && (
                              <div className="text-lg font-semibold font-heading text-primary mb-1">
                                {new Date(getEventDate(event)).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            )}
                            {getEventTime(event) && (
                              <div className="text-sm text-muted-foreground">{getEventTime(event)}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="font-body">{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-body">{getRsvpCount(event)}/{getMaxCapacity(event)} attending</span>
                          </div>
                          {event.weather && (
                            <div className="flex items-center gap-2">
                              <Cloud className="w-4 h-4 text-muted-foreground" />
                              <span className="font-body">{event.weather}</span>
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-body">by {event.organizer}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground font-body">
                            {getMaxCapacity(event) - getRsvpCount(event)} spots remaining
                          </div>
                          <Button className="bg-secondary hover:bg-secondary/90">
                            RSVP Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className={viewMode === "map" ? "block" : "hidden"}>
            <div className="h-96 bg-muted rounded-card flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold font-heading mb-2">Interactive Event Map Coming Soon</h3>
                <p className="text-muted-foreground font-body">
                  Explore events on an interactive map with location markers and info windows
                </p>
              </div>
            </div>
          </TabsContent>

          {!loading && events.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-heading">Past Events</h2>
                <Button variant="outline">View All</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.slice(0, 3).map((event) => (
                  <Card key={`past-${event.id}`} className="hover:shadow-elegant transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={getImage(event)} 
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-t-card"
                      />
                      <Badge className="absolute top-2 right-2 bg-muted text-muted-foreground">
                        Completed
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold font-heading mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground font-body mb-3">
                        {getRsvpCount(event)} participants • Photo gallery available
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Photos
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
