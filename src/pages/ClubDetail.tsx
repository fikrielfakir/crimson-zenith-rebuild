import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Star, 
  Phone, 
  Mail, 
  Heart,
  Share2,
  Globe,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Home,
  ChevronRight,
  UserPlus
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";

const ClubEventsSection = ({ clubId }: { clubId: number }) => {
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['club-events', clubId],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${clubId}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
  });

  const events = eventsData?.events || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
            <p className="text-sm">Check back soon for new activities!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event: any) => (
              <div key={event.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{event.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.eventDate && format(new Date(event.eventDate), 'MMM d, yyyy')}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.maxParticipants && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{event.currentParticipants || 0}/{event.maxParticipants}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {event.category && (
                      <Badge variant="secondary">{event.category}</Badge>
                    )}
                    {event.price && (
                      <span className="text-lg font-bold text-primary">${event.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {events.length > 5 && (
              <Button variant="outline" className="w-full">
                View All {events.length} Events
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: club, isLoading, error } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch club');
      }
      return response.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!club || !mapContainer.current || map.current) return;

    const latitude = club.latitude ? parseFloat(club.latitude) : 31.79;
    const longitude = club.longitude ? parseFloat(club.longitude) : -7.09;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [longitude, latitude],
        zoom: 12,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      new maplibregl.Marker({ color: '#2563eb' })
        .setLngLat([longitude, latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm mb-1">${club.name}</h3>
                <p class="text-xs text-gray-600">${club.location}</p>
              </div>
            `)
        )
        .addTo(map.current);

    } catch (err) {
      console.error('Map initialization error:', err);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [club]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading club details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Club Not Found</h2>
          <p className="text-muted-foreground mb-6">The club you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/clubs')}>View All Clubs</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const features = Array.isArray(club.features) ? club.features : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${club.image || '/api/placeholder/1920/1080'}')`,
            transform: `translateY(${scrollY * 0.3}px)`,
            filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
          }}
        />

        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

        {/* Content */}
        <div className="relative container mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
                >
                  <Home className="w-4 h-4 mr-1.5" />
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                <Link 
                  to="/clubs" 
                  className="text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
                >
                  Clubs
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                  {club.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Club Info */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-8`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {club.is_active && (
                    <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-white/20">Active</Badge>
                  )}
                  {club.rating && (
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{club.rating}/5</span>
                    </div>
                  )}
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                  {club.name}
                </h1>
                <p className="text-lg md:text-xl text-white/95 max-w-3xl leading-relaxed drop-shadow-lg mb-6">
                  {club.description}
                </p>
                <div className="flex items-center gap-6 text-white/90 mb-8">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{club.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">{club.member_count || club.memberCount || 0} Members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => setIsJoined(!isJoined)}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                {isJoined ? 'Leave Club' : 'Join Club'}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/40"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current text-red-400' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/40"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="w-6 h-6 text-primary" />
                  About This Club
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {club.long_description || club.description || 'Join our community and discover amazing experiences in Morocco. Connect with fellow travelers and locals who share your passion for adventure and culture.'}
                </p>

                {features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Club Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  {club.contact_phone && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{club.contact_phone}</p>
                      </div>
                    </div>
                  )}
                  {club.contact_email && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{club.contact_email}</p>
                      </div>
                    </div>
                  )}
                  {club.website && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a href={club.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                  {club.established && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Established</p>
                        <p className="font-medium">{club.established}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Club Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapContainer} 
                  className="w-full h-[400px] rounded-lg overflow-hidden border"
                />
                <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {club.location}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Club Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {club.member_count || club.memberCount || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {club.rating || 5}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {features.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ClubEventsSection clubId={club.id} />
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-6">Join This Club</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{club.member_count || club.memberCount || 0} Active Members</p>
                      <p className="text-sm text-muted-foreground">Growing community</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Verified Club</p>
                      <p className="text-sm text-muted-foreground">Trusted by our community</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Regular Events</p>
                      <p className="text-sm text-muted-foreground">Weekly activities</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mb-3"
                  size="lg"
                  onClick={() => setIsJoined(!isJoined)}
                >
                  {isJoined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Join Club
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Club
                  </Link>
                </Button>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/events">
                        <Calendar className="w-4 h-4 mr-2" />
                        View Events
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/clubs">
                        <Users className="w-4 h-4 mr-2" />
                        All Clubs
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about this club? Our team is here to help!
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClubDetail;
