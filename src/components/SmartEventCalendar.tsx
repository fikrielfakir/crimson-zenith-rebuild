import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Users, Star, Search, Filter, Brain, Zap, AlertTriangle, CheckCircle, TrendingUp, CalendarDays, Eye, EyeOff } from "lucide-react";
import CalendarComponent from "react-calendar";
import { format, isToday, isFuture, isPast, parseISO, differenceInHours, isWithinInterval, addDays, subDays } from "date-fns";
import "react-calendar/dist/Calendar.css";

interface SmartEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  clubId: number;
  clubName: string;
  category?: string;
  difficulty?: string;
  tags: string[];
  weatherConditions?: string;
  price?: number;
  smartScore: number;
  conflictEvents?: SmartEvent[];
  recommendations?: SmartEvent[];
}

interface SmartFilters {
  search: string;
  category: string;
  difficulty: string;
  dateRange: string;
  capacity: string;
  club: string;
  showConflicts: boolean;
  showRecommendations: boolean;
  smartSort: boolean;
}

const SmartEventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<SmartEvent[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"calendar" | "smart" | "list">("smart");
  const [filters, setFilters] = useState<SmartFilters>({
    search: "",
    category: "all",
    difficulty: "all", 
    dateRange: "upcoming",
    capacity: "all",
    club: "all",
    showConflicts: false,
    showRecommendations: true,
    smartSort: true
  });

  // Fetch events and clubs from backend
  useEffect(() => {
    fetchEventsAndClubs();
  }, []);

  const fetchEventsAndClubs = async () => {
    try {
      setIsLoading(true);
      
      // Fetch clubs and their events
      const [clubsResponse, eventsResponse] = await Promise.all([
        fetch('/api/clubs'),
        fetch('/api/events')
      ]);
      
      const clubsData = await clubsResponse.json();
      const eventsData = await eventsResponse.json();
      
      if (clubsResponse.ok) {
        setClubs(clubsData.clubs || []);
      }
      
      if (eventsResponse.ok) {
        const enhancedEvents = enhanceEventsWithSmartFeatures(eventsData.events || [], clubsData.clubs || []);
        setEvents(enhancedEvents);
      }
    } catch (error) {
      console.error('Error fetching events and clubs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhance events with smart features
  const enhanceEventsWithSmartFeatures = (rawEvents: any[], clubList: any[]): SmartEvent[] => {
    return rawEvents.map(event => {
      const club = clubList.find(c => c.id === event.club_id);
      const eventDate = parseISO(event.event_date);
      
      // Calculate smart score based on multiple factors
      const smartScore = calculateSmartScore(event, eventDate);
      
      // Auto-detect category and difficulty
      const category = detectCategory(event.title, event.description);
      const difficulty = detectDifficulty(event.title, event.description);
      
      // Extract tags from title and description
      const tags = extractTags(event.title, event.description);
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        location: event.location,
        maxParticipants: event.max_participants,
        currentParticipants: event.current_participants,
        status: event.status,
        clubId: event.club_id,
        clubName: club?.name || 'Unknown Club',
        category,
        difficulty,
        tags,
        smartScore,
        weatherConditions: getWeatherConditions(event.location),
        price: Math.floor(Math.random() * 100) + 25 // Mock price for demo
      };
    });
  };

  // Smart scoring algorithm
  const calculateSmartScore = (event: any, eventDate: Date): number => {
    let score = 0;
    
    // Date relevance (future events score higher)
    if (isFuture(eventDate)) score += 30;
    if (isToday(eventDate)) score += 50;
    
    // Capacity availability
    const capacityRatio = event.current_participants / event.max_participants;
    score += (1 - capacityRatio) * 20;
    
    // Event status
    if (event.status === 'upcoming') score += 25;
    
    // Popularity (more participants = higher score)
    score += Math.min(event.current_participants * 2, 25);
    
    return Math.min(score, 100);
  };

  // Auto-categorization based on keywords
  const detectCategory = (title: string, description: string): string => {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('trek') || text.includes('hik') || text.includes('mountain')) return 'Trekking';
    if (text.includes('photo') || text.includes('camera')) return 'Photography';
    if (text.includes('surf') || text.includes('beach') || text.includes('water')) return 'Water Sports';
    if (text.includes('cultur') || text.includes('medina') || text.includes('tradition')) return 'Cultural';
    if (text.includes('climb') || text.includes('rock')) return 'Climbing';
    if (text.includes('desert') || text.includes('sahara')) return 'Desert Adventure';
    if (text.includes('food') || text.includes('cooking')) return 'Culinary';
    
    return 'General';
  };

  // Auto-difficulty detection
  const detectDifficulty = (title: string, description: string): string => {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('beginner') || text.includes('easy') || text.includes('family')) return 'Easy';
    if (text.includes('advanced') || text.includes('expert') || text.includes('challenging')) return 'Hard';
    if (text.includes('intermediate') || text.includes('moderate')) return 'Moderate';
    
    // Default based on activity type
    if (text.includes('climb') || text.includes('trek')) return 'Moderate';
    if (text.includes('walk') || text.includes('photo')) return 'Easy';
    
    return 'Moderate';
  };

  // Extract relevant tags
  const extractTags = (title: string, description: string): string[] => {
    const text = `${title} ${description}`.toLowerCase();
    const tags = [];
    
    if (text.includes('sunset') || text.includes('sunrise')) tags.push('Scenic');
    if (text.includes('group') || text.includes('team')) tags.push('Group Activity');
    if (text.includes('workshop') || text.includes('learn')) tags.push('Educational');
    if (text.includes('adventure') || text.includes('extreme')) tags.push('Adventure');
    if (text.includes('relax') || text.includes('peaceful')) tags.push('Relaxing');
    if (text.includes('challenge') || text.includes('competition')) tags.push('Competitive');
    
    return tags;
  };

  // Mock weather conditions
  const getWeatherConditions = (location: string): string => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Clear', 'Overcast'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Detect conflicting events (same time/location)
  const detectConflicts = (targetEvent: SmartEvent): SmartEvent[] => {
    const targetDate = parseISO(targetEvent.eventDate);
    
    return events.filter(event => {
      if (event.id === targetEvent.id) return false;
      
      const eventDate = parseISO(event.eventDate);
      const timeDiff = Math.abs(differenceInHours(targetDate, eventDate));
      
      return (
        timeDiff < 4 && // Within 4 hours
        event.location === targetEvent.location // Same location
      );
    });
  };

  // Generate smart recommendations
  const generateRecommendations = (targetEvent: SmartEvent): SmartEvent[] => {
    return events
      .filter(event => event.id !== targetEvent.id)
      .filter(event => 
        event.category === targetEvent.category ||
        event.clubId === targetEvent.clubId ||
        event.tags.some(tag => targetEvent.tags.includes(tag))
      )
      .sort((a, b) => b.smartScore - a.smartScore)
      .slice(0, 3);
  };

  // Smart filtering and sorting
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const eventDate = parseISO(event.eventDate);
      
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!event.title.toLowerCase().includes(searchTerm) &&
            !event.description.toLowerCase().includes(searchTerm) &&
            !event.clubName.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }
      
      // Category filter
      if (filters.category !== 'all' && event.category !== filters.category) return false;
      
      // Difficulty filter  
      if (filters.difficulty !== 'all' && event.difficulty !== filters.difficulty) return false;
      
      // Club filter
      if (filters.club !== 'all' && event.clubName !== filters.club) return false;
      
      // Date range filter
      switch (filters.dateRange) {
        case 'today':
          if (!isToday(eventDate)) return false;
          break;
        case 'week':
          if (!isWithinInterval(eventDate, { start: new Date(), end: addDays(new Date(), 7) })) return false;
          break;
        case 'month':
          if (!isWithinInterval(eventDate, { start: new Date(), end: addDays(new Date(), 30) })) return false;
          break;
        case 'upcoming':
          if (!isFuture(eventDate)) return false;
          break;
      }
      
      // Capacity filter
      switch (filters.capacity) {
        case 'available':
          if (event.currentParticipants >= event.maxParticipants) return false;
          break;
        case 'filling':
          const ratio = event.currentParticipants / event.maxParticipants;
          if (ratio < 0.7) return false;
          break;
        case 'full':
          if (event.currentParticipants < event.maxParticipants) return false;
          break;
      }
      
      return true;
    });

    // Smart sorting
    if (filters.smartSort) {
      filtered.sort((a, b) => b.smartScore - a.smartScore);
    } else {
      filtered.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    }
    
    return filtered;
  }, [events, filters]);

  const updateFilter = (key: keyof SmartFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getCapacityStatus = (event: SmartEvent) => {
    const ratio = event.currentParticipants / event.maxParticipants;
    if (ratio >= 1) return { status: 'Full', color: 'bg-red-500', icon: AlertTriangle };
    if (ratio >= 0.8) return { status: 'Filling Fast', color: 'bg-orange-500', icon: TrendingUp };
    if (ratio >= 0.5) return { status: 'Available', color: 'bg-green-500', icon: CheckCircle };
    return { status: 'Open', color: 'bg-blue-500', icon: CheckCircle };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Loading smart calendar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Smart Events Calendar</h2>
            <p className="text-muted-foreground">AI-powered event discovery and management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3" />
            {filteredAndSortedEvents.length} Smart Matches
          </Badge>
        </div>
      </div>

      {/* Smart Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Smart Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search Events</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, location..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Trekking">Trekking</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Water Sports">Water Sports</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Climbing">Climbing</SelectItem>
                  <SelectItem value="Desert Adventure">Desert Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="upcoming">All Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select value={filters.capacity} onValueChange={(value) => updateFilter('capacity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="available">Available Spots</SelectItem>
                  <SelectItem value="filling">Filling Fast</SelectItem>
                  <SelectItem value="full">Full Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Smart Options</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant={filters.smartSort ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('smartSort', !filters.smartSort)}
                  className="gap-2"
                >
                  <Brain className="w-3 h-3" />
                  Smart Sort
                </Button>
                <Button
                  variant={filters.showRecommendations ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('showRecommendations', !filters.showRecommendations)}
                  className="gap-2"
                >
                  <Star className="w-3 h-3" />
                  Recommendations
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Selector */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList>
          <TabsTrigger value="smart" className="gap-2">
            <Brain className="w-4 h-4" />
            Smart View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <Eye className="w-4 h-4" />
            List View
          </TabsTrigger>
        </TabsList>

        {/* Smart View */}
        <TabsContent value="smart" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event) => {
              const capacity = getCapacityStatus(event);
              const CapacityIcon = capacity.icon;
              const conflicts = detectConflicts(event);
              const recommendations = generateRecommendations(event);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  {/* Smart Score Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {Math.round(event.smartScore)}% Match
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Event Header */}
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </div>
                      
                      {/* Event Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(parseISO(event.eventDate), 'MMM dd, yyyy - HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                        </div>
                      </div>
                      
                      {/* Smart Tags and Status */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{event.category}</Badge>
                        <Badge className={getDifficultyColor(event.difficulty)}>{event.difficulty}</Badge>
                        <Badge className={`${capacity.color} text-white flex items-center gap-1`}>
                          <CapacityIcon className="w-3 h-3" />
                          {capacity.status}
                        </Badge>
                      </div>
                      
                      {/* Smart Features */}
                      {conflicts.length > 0 && filters.showConflicts && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-800 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            Scheduling Conflict
                          </div>
                          <p className="text-xs text-orange-600 mt-1">
                            {conflicts.length} other event(s) at similar time/location
                          </p>
                        </div>
                      )}
                      
                      {filters.showRecommendations && recommendations.length > 0 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-2">
                            <Star className="w-4 h-4" />
                            You might also like
                          </div>
                          <div className="space-y-1">
                            {recommendations.slice(0, 2).map(rec => (
                              <p key={rec.id} className="text-xs text-blue-600">{rec.title}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-primary">
                          ${event.price}
                        </span>
                        <Button 
                          size="sm"
                          disabled={event.currentParticipants >= event.maxParticipants}
                        >
                          {event.currentParticipants >= event.maxParticipants ? 'Full' : 'Join Event'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredAndSortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find more events</p>
            </div>
          )}
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  className="w-full"
                  tileClassName={({ date }) => {
                    const dayEvents = events.filter(event => 
                      format(parseISO(event.eventDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    );
                    return dayEvents.length > 0 ? 'bg-primary/20 text-primary font-bold' : '';
                  }}
                />
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Events on {format(selectedDate, 'MMMM dd, yyyy')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const dayEvents = filteredAndSortedEvents.filter(event => 
                      format(parseISO(event.eventDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    );
                    
                    if (dayEvents.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-muted-foreground">No events scheduled for this date</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-4">
                        {dayEvents.map(event => (
                          <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{format(parseISO(event.eventDate), 'HH:mm')}</span>
                                <Badge variant="outline" className="text-xs">{event.category}</Badge>
                              </div>
                            </div>
                            <Button size="sm">View Details</Button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <div className="space-y-4">
            {filteredAndSortedEvents.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {Math.round(event.smartScore)}% Match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(parseISO(event.eventDate), 'MMM dd, yyyy - HH:mm')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.currentParticipants}/{event.maxParticipants}
                        </div>
                        <Badge variant="outline">{event.category}</Badge>
                        <Badge className={getDifficultyColor(event.difficulty)}>{event.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary mb-2">${event.price}</div>
                      <Button size="sm">Join Event</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartEventCalendar;