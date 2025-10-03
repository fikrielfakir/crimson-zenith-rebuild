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
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const ClubDetail = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const { data: clubsResponse, isLoading, error } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      return response.json();
    },
  });

  const club = clubsResponse?.clubs?.find((c: any) => 
    c.name === decodeURIComponent(clubName || '')
  );

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
      
      <Breadcrumbs items={[
        { label: 'Clubs', href: '/clubs' },
        { label: club.name }
      ]} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <div className="relative h-[400px]">
                <img 
                  src={club.image || '/api/placeholder/800/400'} 
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-3">{club.name}</h1>
                    <p className="text-xl text-muted-foreground mb-4">{club.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{club.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{club.member_count || club.memberCount || 0} Members</span>
                      </div>
                      {club.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{club.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {club.is_active && (
                    <Badge className="bg-green-500">Active</Badge>
                  )}
                </div>

                {features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Club Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4 text-lg">About This Club</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {club.long_description || club.description || 'Join our community and discover amazing experiences in Morocco. Connect with fellow travelers and locals who share your passion for adventure and culture.'}
                  </p>
                </div>

                <div className="pt-6 grid md:grid-cols-2 gap-4">
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
