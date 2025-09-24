import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, MapPin, Users, Cloud, Clock, Filter, List, Map } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Events = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "map">("list");

  // Mock data for events
  const events = [
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
      weather: "Sunny, 15°C",
      image: "/api/placeholder/400/200",
      organizer: "Atlas Hikers Club",
      description: "Join us for a spectacular winter trek through snow-capped peaks"
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
      weather: "Clear, 22°C",
      image: "/api/placeholder/400/200",
      organizer: "Photography Collective",
      description: "Capture the beauty of sunrise over the Sahara with expert guidance"
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
      weather: "Cloudy, 20°C",
      image: "/api/placeholder/400/200",
      organizer: "Coastal Riders",
      description: "Perfect waves for beginners and intermediate surfers"
    },
    {
      id: 4,
      title: "Marrakech Medina Cultural Walk",
      date: "2024-12-22",
      time: "16:00",
      location: "Marrakech Medina",
      category: "Cultural",
      difficulty: "Easy",
      rsvpCount: 20,
      maxCapacity: 25,
      weather: "Sunny, 25°C",
      image: "/api/placeholder/400/200",
      organizer: "Culture Seekers",
      description: "Explore the historic heart of Marrakech with local guides"
    },
    {
      id: 5,
      title: "Rock Climbing at Todra Gorge",
      date: "2024-12-25",
      time: "08:30",
      location: "Todra Gorge",
      category: "Climbing",
      difficulty: "Hard",
      rsvpCount: 4,
      maxCapacity: 8,
      weather: "Sunny, 18°C",
      image: "/api/placeholder/400/200",
      organizer: "Rock Climbers Morocco",
      description: "Challenge yourself on world-class limestone cliffs"
    },
    {
      id: 6,
      title: "Chefchaouen Blue City Photo Tour",
      date: "2024-12-28",
      time: "10:00",
      location: "Chefchaouen",
      category: "Photography",
      difficulty: "Easy",
      rsvpCount: 15,
      maxCapacity: 18,
      weather: "Partly Cloudy, 16°C",
      image: "/api/placeholder/400/200",
      organizer: "Photography Collective",
      description: "Capture the iconic blue streets and mountain views"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success";
      case "Moderate": return "bg-warning";
      case "Hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
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
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(/events-hero.jpg)`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-overlay)' }} />
        
        {/* Calendar Overlay Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
            Upcoming Adventures
          </h1>
          <p className="text-xl text-white/90 mb-8 font-body max-w-2xl mx-auto">
            Join exciting events, meet fellow adventurers, and create unforgettable memories in Morocco.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80 text-lg">
            <CalendarIcon className="w-6 h-6" />
            <span className="font-body">{events.length} upcoming events this month</span>
          </div>
        </div>
      </section>

      {/* Weather Alert Banner */}
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

      {/* Controls */}
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

      {/* Main Content */}
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
            <div className="space-y-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-glow transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <img 
                        src={event.image} 
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
                            <Badge className={`${getDifficultyColor(event.difficulty)} text-white`}>
                              {event.difficulty}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-body mb-3">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold font-heading text-primary mb-1">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-body">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-body">{event.rsvpCount}/{event.maxCapacity} attending</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-muted-foreground" />
                          <span className="font-body">{event.weather}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-body">by {event.organizer}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground font-body">
                          {event.maxCapacity - event.rsvpCount} spots remaining
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

          {/* Past Events Section */}
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
                      src={event.image} 
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
                      {event.rsvpCount} participants • Photo gallery available
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Photos
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;