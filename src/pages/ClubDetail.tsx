import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Star, 
  Camera, 
  Phone, 
  Mail, 
  ArrowLeft,
  Clock,
  MapIcon,
  Heart,
  Share2,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import marrakechImg from "@/assets/marrakech-club.jpg";
import fezImg from "@/assets/fez-club.jpg";
import casablancaImg from "@/assets/casablanca-club.jpg";

const ClubDetail = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);

  // Fetch real clubs data from API
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

  // Find the current club by name from the API data
  const club = clubsResponse?.clubs?.find((c: any) => 
    c.name === decodeURIComponent(clubName || '')
  );

  // Fallback club data for cases where API club doesn't have all needed display data
  const fallbackClubs = [
    {
      name: "Marrakech Club",
      description: "Explore the vibrant souks and palaces of the Red City",
      longDescription: "Immerse yourself in the magical atmosphere of Marrakech, where ancient traditions meet modern adventures. Our club offers exclusive access to hidden gems, local artisan workshops, and authentic experiences that showcase the true spirit of the Red City.",
      image: marrakechImg,
      members: "250+ Members",
      memberCount: 250,
      location: "Marrakech, Morocco",
      features: ["Historic Tours", "Local Cuisine", "Artisan Workshops"],
      rating: 4.8,
      established: "2019",
      phone: "+212 524 123 456",
      email: "contact@marrakech-club.ma",
      gallery: [marrakechImg, fezImg, casablancaImg, marrakechImg, fezImg],
      recentEvents: [
        { date: "Dec 15, 2024", title: "Medina Photography Walk", participants: 25, status: "upcoming" },
        { date: "Dec 8, 2024", title: "Traditional Cooking Class", participants: 18, status: "completed" },
        { date: "Dec 1, 2024", title: "Atlas Mountains Day Trip", participants: 32, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 22, 2024", title: "New Year Celebration at Jemaa el-Fnaa", type: "Cultural Event" },
        { date: "Dec 28, 2024", title: "Artisan Workshop: Leather Crafting", type: "Workshop" },
        { date: "Jan 5, 2025", title: "Desert Excursion to Ouarzazate", type: "Adventure Trip" }
      ],
      testimonials: [
        { name: "Sarah Ahmed", avatar: "/api/placeholder/40/40", text: "Amazing experiences and wonderful people! The local guides know all the hidden spots." },
        { name: "Mohammed Ben", avatar: "/api/placeholder/40/40", text: "Perfect blend of culture and adventure. Highly recommend the cooking classes!" },
        { name: "Lisa Chen", avatar: "/api/placeholder/40/40", text: "Met incredible friends and discovered the real Morocco. Best decision ever!" }
      ]
    },
    {
      name: "Fez Club", 
      description: "Discover the ancient medina and cultural heritage",
      longDescription: "Step back in time and explore the UNESCO World Heritage medina of Fez. Our club specializes in cultural immersion, traditional crafts learning, and connecting with local artisans who have preserved ancient techniques for generations.",
      image: fezImg,
      members: "180+ Members",
      memberCount: 180,
      location: "Fez, Morocco",
      features: ["Medina Walks", "Traditional Crafts", "Cultural Events"],
      rating: 4.7,
      established: "2020",
      phone: "+212 535 987 654",
      email: "hello@fez-adventures.ma",
      gallery: [fezImg, casablancaImg, marrakechImg, fezImg, casablancaImg],
      recentEvents: [
        { date: "Dec 18, 2024", title: "Pottery Making Workshop", participants: 15, status: "upcoming" },
        { date: "Dec 12, 2024", title: "Historical Medina Tour", participants: 22, status: "completed" },
        { date: "Dec 5, 2024", title: "Traditional Music Evening", participants: 28, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 25, 2024", title: "Christmas Cultural Exchange", type: "Cultural Event" },
        { date: "Jan 2, 2025", title: "Calligraphy and Zellige Workshop", type: "Workshop" },
        { date: "Jan 10, 2025", title: "Middle Atlas Mountains Hike", type: "Adventure Trip" }
      ],
      testimonials: [
        { name: "Omar Alami", avatar: "/api/placeholder/40/40", text: "The cultural depth and authenticity of experiences here is unmatched." },
        { name: "Emma Rodriguez", avatar: "/api/placeholder/40/40", text: "Learned traditional crafts from master artisans. Truly transformative!" },
        { name: "Yuki Tanaka", avatar: "/api/placeholder/40/40", text: "Fez Club opened my eyes to Morocco's incredible cultural heritage." }
      ]
    },
    {
      name: "Casablanca Club",
      description: "Experience the modern emerging art scene",
      longDescription: "Discover Morocco's economic capital through its vibrant art scene, modern architecture, and coastal beauty. Our club bridges traditional Morocco with contemporary culture, offering unique perspectives on the country's rapid modernization.",
      image: casablancaImg,
      members: "320+ Members",
      memberCount: 320,
      location: "Casablanca, Morocco",
      features: ["Art Galleries", "Modern Culture", "Coastal Adventures"],
      rating: 4.9,
      established: "2018",
      phone: "+212 522 456 789",
      email: "info@casa-modern.ma",
      gallery: [casablancaImg, marrakechImg, fezImg, casablancaImg, marrakechImg],
      recentEvents: [
        { date: "Dec 20, 2024", title: "Contemporary Art Gallery Opening", participants: 45, status: "upcoming" },
        { date: "Dec 14, 2024", title: "Coastal Cycling Tour", participants: 30, status: "completed" },
        { date: "Dec 7, 2024", title: "Hassan II Mosque Architecture Tour", participants: 25, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 30, 2024", title: "New Year Beach Party", type: "Social Event" },
        { date: "Jan 8, 2025", title: "Street Art and Graffiti Tour", type: "Cultural Tour" },
        { date: "Jan 15, 2025", title: "Modern Moroccan Cuisine Experience", type: "Food Experience" }
      ],
      testimonials: [
        { name: "Aicha Bennani", avatar: "/api/placeholder/40/40", text: "Love how this club showcases Morocco's modern side while respecting traditions." },
        { name: "James Wilson", avatar: "/api/placeholder/40/40", text: "The art scene here is incredible. Met amazing local artists!" },
        { name: "Fatima El Idrissi", avatar: "/api/placeholder/40/40", text: "Perfect for young professionals who want to network and explore." }
      ]
    },
    {
      name: "Rabat Club",
      description: "Explore Morocco's political capital and historical sites",
      longDescription: "Dive deep into Morocco's political and cultural heart, where royal palaces meet modern governance. Our club offers exclusive access to government buildings, archaeological sites, and cultural institutions that tell the story of modern Morocco.",
      image: marrakechImg,
      members: "195+ Members",
      memberCount: 195,
      location: "Rabat, Morocco",
      features: ["Government Tours", "Royal Palaces", "Archaeological Sites"],
      rating: 4.6,
      established: "2020",
      phone: "+212 537 765 432",
      email: "info@rabat-heritage.ma",
      gallery: [marrakechImg, fezImg, casablancaImg, marrakechImg, fezImg],
      recentEvents: [
        { date: "Dec 16, 2024", title: "Royal Palace Gardens Tour", participants: 20, status: "upcoming" },
        { date: "Dec 10, 2024", title: "Kasbah of the Udayas Exploration", participants: 18, status: "completed" },
        { date: "Dec 3, 2024", title: "Mausoleum of Mohammed V Visit", participants: 25, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 24, 2024", title: "Political History Walking Tour", type: "Educational Tour" },
        { date: "Dec 31, 2024", title: "Archaeological Museum Workshop", type: "Workshop" },
        { date: "Jan 7, 2025", title: "Bouregreg Valley Nature Walk", type: "Nature Activity" }
      ],
      testimonials: [
        { name: "Khalid Bennani", avatar: "/api/placeholder/40/40", text: "Fascinating insights into Morocco's political evolution. The palace tours are exclusive!" },
        { name: "Maria Santos", avatar: "/api/placeholder/40/40", text: "Rich historical context and beautiful architecture. Highly educational experience." },
        { name: "Hassan Alaoui", avatar: "/api/placeholder/40/40", text: "Perfect blend of history, politics, and culture. The guides are incredibly knowledgeable." }
      ]
    },
    {
      name: "Chefchaouen Club",
      description: "Wander through the enchanting blue pearl of Morocco",
      longDescription: "Discover the mystical blue city nestled in the Rif Mountains. Our club specializes in mountain adventures, traditional blue architecture exploration, and connecting with local Berber communities who maintain this unique cultural treasure.",
      image: fezImg,
      members: "145+ Members",
      memberCount: 145,
      location: "Chefchaouen, Morocco",
      features: ["Blue City Tours", "Mountain Hiking", "Photography Walks"],
      rating: 4.8,
      established: "2021",
      phone: "+212 539 654 321",
      email: "hello@chefchaouen-blue.ma",
      gallery: [fezImg, casablancaImg, marrakechImg, fezImg, casablancaImg],
      recentEvents: [
        { date: "Dec 19, 2024", title: "Blue Streets Photography Workshop", participants: 12, status: "upcoming" },
        { date: "Dec 11, 2024", title: "Rif Mountains Hiking Adventure", participants: 16, status: "completed" },
        { date: "Dec 4, 2024", title: "Traditional Berber Music Evening", participants: 20, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 26, 2024", title: "Mountain Sunrise Photography", type: "Photography Tour" },
        { date: "Jan 3, 2025", title: "Traditional Weaving Workshop", type: "Cultural Workshop" },
        { date: "Jan 12, 2025", title: "Talassemtane National Park Trek", type: "Adventure Trip" }
      ],
      testimonials: [
        { name: "Sofia Martinez", avatar: "/api/placeholder/40/40", text: "The blue city is magical! The photography tours capture incredible moments." },
        { name: "Ahmed Riffi", avatar: "/api/placeholder/40/40", text: "Mountain hikes with breathtaking views. The local guides know hidden trails." },
        { name: "Elena Popov", avatar: "/api/placeholder/40/40", text: "Peaceful atmosphere and wonderful community. Perfect for nature lovers!" }
      ]
    },
    {
      name: "Tangier Club",
      description: "Gateway to Africa with rich multicultural heritage",
      longDescription: "Experience the crossroads of Africa and Europe in this vibrant port city. Our club explores Tangier's unique position as a cultural melting pot, from its international literary history to its modern economic renaissance.",
      image: casablancaImg,
      members: "210+ Members",
      memberCount: 210,
      location: "Tangier, Morocco",
      features: ["Port Tours", "International Culture", "Strait Views"],
      rating: 4.7,
      established: "2019",
      phone: "+212 539 123 789",
      email: "contact@tangier-gateway.ma",
      gallery: [casablancaImg, marrakechImg, fezImg, casablancaImg, marrakechImg],
      recentEvents: [
        { date: "Dec 17, 2024", title: "International Literary Café Night", participants: 30, status: "upcoming" },
        { date: "Dec 13, 2024", title: "Hercules Caves Exploration", participants: 22, status: "completed" },
        { date: "Dec 6, 2024", title: "Tangier Port and Strait Tour", participants: 28, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 27, 2024", title: "New Year International Party", type: "Social Event" },
        { date: "Jan 4, 2025", title: "Kasbah Museum Cultural Tour", type: "Cultural Tour" },
        { date: "Jan 11, 2025", title: "Cap Spartel Lighthouse Hike", type: "Nature Activity" }
      ],
      testimonials: [
        { name: "Jean-Pierre Dubois", avatar: "/api/placeholder/40/40", text: "Tangier's international atmosphere is unique. Met people from all over the world!" },
        { name: "Layla Tazi", avatar: "/api/placeholder/40/40", text: "The literary history and cultural mix make every visit fascinating." },
        { name: "Roberto Silva", avatar: "/api/placeholder/40/40", text: "Great gateway city with amazing views of Spain. The cultural tours are excellent!" }
      ]
    },
    {
      name: "Meknes Club",
      description: "Imperial city with magnificent architecture and history",
      longDescription: "Step into Morocco's imperial past in this UNESCO World Heritage city. Our club specializes in historical architecture, royal heritage exploration, and discovering the sophisticated cultural legacy of the Alaouite dynasty.",
      image: marrakechImg,
      members: "165+ Members",
      memberCount: 165,
      location: "Meknes, Morocco",
      features: ["Imperial Tours", "Ancient Ruins", "Wine Tasting"],
      rating: 4.5,
      established: "2020",
      phone: "+212 535 432 876",
      email: "info@meknes-imperial.ma",
      gallery: [marrakechImg, fezImg, casablancaImg, marrakechImg, fezImg],
      recentEvents: [
        { date: "Dec 21, 2024", title: "Imperial Architecture Workshop", participants: 18, status: "upcoming" },
        { date: "Dec 15, 2024", title: "Volubilis Roman Ruins Tour", participants: 24, status: "completed" },
        { date: "Dec 8, 2024", title: "Meknes Wine Region Tasting", participants: 16, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 29, 2024", title: "Royal Stables Historical Tour", type: "Historical Tour" },
        { date: "Jan 6, 2025", title: "Traditional Handicrafts Workshop", type: "Craft Workshop" },
        { date: "Jan 14, 2025", title: "Middle Atlas Vineyard Visit", type: "Food & Wine Tour" }
      ],
      testimonials: [
        { name: "François Bertin", avatar: "/api/placeholder/40/40", text: "The imperial architecture is breathtaking! Excellent historical context provided." },
        { name: "Nadia Fassi", avatar: "/api/placeholder/40/40", text: "Wine tours are unique in Morocco. Great combination of history and gastronomy." },
        { name: "David Thompson", avatar: "/api/placeholder/40/40", text: "Less crowded than other imperial cities but equally impressive. Loved the Roman ruins!" }
      ]
    },
    {
      name: "Essaouira Club",
      description: "Coastal charm with Portuguese influence and ocean breeze",
      longDescription: "Experience Morocco's windswept Atlantic coast in this charming fishing port. Our club focuses on maritime culture, wind sports, traditional fishing practices, and the unique Gnawa music heritage that thrives in this coastal haven.",
      image: fezImg,
      members: "175+ Members",
      memberCount: 175,
      location: "Essaouira, Morocco",
      features: ["Coastal Activities", "Wind Sports", "Fishing Tours"],
      rating: 4.6,
      established: "2019",
      phone: "+212 524 567 890",
      email: "contact@essaouira-winds.ma",
      gallery: [fezImg, casablancaImg, marrakechImg, fezImg, casablancaImg],
      recentEvents: [
        { date: "Dec 22, 2024", title: "Windsurfing Training Session", participants: 14, status: "upcoming" },
        { date: "Dec 16, 2024", title: "Traditional Fishing Experience", participants: 12, status: "completed" },
        { date: "Dec 9, 2024", title: "Gnawa Music Festival Night", participants: 35, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Dec 30, 2024", title: "Coastal New Year Celebration", type: "Social Event" },
        { date: "Jan 8, 2025", title: "Argan Oil Cooperative Visit", type: "Cultural Tour" },
        { date: "Jan 16, 2025", title: "Kite Surfing Adventure", type: "Water Sports" }
      ],
      testimonials: [
        { name: "Marina Costa", avatar: "/api/placeholder/40/40", text: "Perfect for water sports enthusiasts! The wind conditions are incredible." },
        { name: "Brahim Gnaoui", avatar: "/api/placeholder/40/40", text: "The music scene here is authentic and vibrant. Great cultural immersion." },
        { name: "Tom Anderson", avatar: "/api/placeholder/40/40", text: "Laid-back coastal vibes with authentic Portuguese-Moroccan architecture. Love it!" }
      ]
    },
    {
      name: "Ouarzazate Club",
      description: "Gateway to the Sahara Desert and film studios",
      longDescription: "Discover Morocco's Hollywood in the desert gateway city. Our club specializes in desert expeditions, film industry tours, traditional Kasbah architecture, and authentic Berber cultural exchanges in the stunning pre-Saharan landscape.",
      image: casablancaImg,
      members: "130+ Members",
      memberCount: 130,
      location: "Ouarzazate, Morocco",
      features: ["Desert Tours", "Film Studios", "Kasbah Visits"],
      rating: 4.7,
      established: "2021",
      phone: "+212 524 890 123",
      email: "hello@ouarzazate-desert.ma",
      gallery: [casablancaImg, marrakechImg, fezImg, casablancaImg, marrakechImg],
      recentEvents: [
        { date: "Dec 23, 2024", title: "Atlas Film Studios Behind-the-Scenes", participants: 20, status: "upcoming" },
        { date: "Dec 17, 2024", title: "Ait Benhaddou Kasbah Trek", participants: 15, status: "completed" },
        { date: "Dec 10, 2024", title: "Desert Astronomy Night", participants: 18, status: "completed" }
      ],
      upcomingActivities: [
        { date: "Jan 1, 2025", title: "New Year Desert Camp", type: "Adventure Trip" },
        { date: "Jan 9, 2025", title: "Berber Village Cultural Exchange", type: "Cultural Experience" },
        { date: "Jan 18, 2025", title: "Sahara Photography Expedition", type: "Photography Tour" }
      ],
      testimonials: [
        { name: "Alex Rivera", avatar: "/api/placeholder/40/40", text: "Film studio tours are fascinating! Saw where major movies were shot." },
        { name: "Fatima Ouali", avatar: "/api/placeholder/40/40", text: "Desert experiences are life-changing. The starry nights are unforgettable." },
        { name: "Marco Benedetti", avatar: "/api/placeholder/40/40", text: "Perfect base for Sahara adventures. The Berber hospitality is incredible!" }
      ]
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="text-lg font-medium text-gray-700">Loading club details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Club</h1>
          <p className="text-gray-600 mb-6">There was an error loading the club details.</p>
          <Button onClick={() => navigate('/clubs')} className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
            View All Clubs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Club not found state
  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Club Not Found</h1>
          <p className="text-gray-600 mb-6">The club "{decodeURIComponent(clubName || '')}" doesn't exist.</p>
          <Button onClick={() => navigate('/clubs')} className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
            View All Clubs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Find fallback club data for rich display content
  const fallbackClub = fallbackClubs.find(c => 
    c.name.toLowerCase().includes(club?.name?.toLowerCase() || '') ||
    (club?.name === 'Atlas Hikers Club' && c.name === 'Marrakech Club') ||
    (club?.name === 'Desert Explorers' && c.name === 'Fez Club') ||
    (club?.name === 'Coastal Adventures' && c.name === 'Casablanca Club')
  ) || fallbackClubs[0]; // Default to first fallback if no match

  // Combine real API data with fallback display data
  const displayClub = {
    ...fallbackClub,
    id: club.id,
    name: club.name || fallbackClub.name,
    description: club.description || fallbackClub.description,
    location: club.location || fallbackClub.location,
    memberCount: club.member_count || fallbackClub.memberCount,
    members: `${club.member_count || fallbackClub.memberCount}+ Members`,
    rating: club.rating || fallbackClub.rating,
    features: club.features || fallbackClub.features,
    image: club.image || fallbackClub.image,
    isActive: club.is_active,
    latitude: club.latitude,
    longitude: club.longitude,
    contactEmail: club.contact_email || fallbackClub.email,
    contactPhone: club.contact_phone || fallbackClub.phone,
  };

  const handleJoinClub = () => {
    setIsJoined(!isJoined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={displayClub.image} 
          alt={displayClub.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/clubs')}
              className="absolute top-6 left-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clubs
            </Button>
            
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">{displayClub.name}</h1>
              <p className="text-xl mb-6 max-w-2xl mx-auto">{displayClub.longDescription}</p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {displayClub.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {displayClub.members}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {displayClub.rating}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Club Info Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{club.name}</CardTitle>
                    <p className="text-muted-foreground mt-2">{club.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">{club.memberCount} Active Members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Established in {displayClub.established}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{club.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{club.email}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Club Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.features.map((feature) => (
                        <Badge key={feature} variant="secondary">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleJoinClub} 
                  className="w-full"
                  variant={isJoined ? "outline" : "default"}
                >
                  {isJoined ? "Leave Club" : "Join Club"}
                </Button>
              </CardContent>
            </Card>

            {/* Tabs for different sections */}
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="events" className="space-y-4">
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Recent & Upcoming Events</h3>
                  {club.recentEvents.map((event, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {event.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.participants} participants
                              </div>
                            </div>
                          </div>
                          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <h3 className="text-lg font-semibold mt-6">Upcoming Activities</h3>
                  {club.upcomingActivities.map((activity, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{activity.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.date}
                              </div>
                              <Badge variant="outline">{activity.type}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Photo Gallery
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {club.gallery.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="space-y-4">
                <h3 className="text-lg font-semibold">Member Testimonials</h3>
                <div className="space-y-4">
                  {club.testimonials.map((testimonial, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} />
                            <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-muted-foreground mt-1">{testimonial.text}</p>
                            <div className="flex gap-1 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {club.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>{club.longDescription}</p>
                    
                    <h4 className="font-semibold mt-4">Why Join Us?</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Connect with like-minded adventurers</li>
                      <li>Access to exclusive local experiences</li>
                      <li>Professional local guides</li>
                      <li>Small group activities for personal attention</li>
                      <li>Cultural immersion opportunities</li>
                      <li>Networking with international members</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-4">Member Benefits</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>20% discount on all activities</li>
                      <li>Priority booking for popular events</li>
                      <li>Access to members-only WhatsApp group</li>
                      <li>Monthly newsletter with insider tips</li>
                      <li>Free welcome orientation session</li>
                      <li>Annual member appreciation dinner</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => navigate('/contact')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Club
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/events')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Events
                </Button>
                <Button variant="outline" className="w-full">
                  <MapIcon className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Interactive Map</p>
                    <p className="text-xs">{displayClub.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Clubs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Clubs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(clubsResponse?.clubs || []).filter((c: any) => c.name !== displayClub.name).slice(0, 2).map((relatedClub: any) => (
                  <div key={relatedClub.name} className="flex gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                    <img 
                      src={relatedClub.image} 
                      alt={relatedClub.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{relatedClub.name}</h4>
                      <p className="text-xs text-muted-foreground">{relatedClub.member_count}+ Members</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/clubs')}>
                  View All Clubs
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