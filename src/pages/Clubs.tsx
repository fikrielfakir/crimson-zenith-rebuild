import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Calendar, Mountain, Bike, Camera, Search, Map, List, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Clubs = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Mock data for clubs
  const clubs = [
    {
      id: 1,
      name: "Atlas Hikers",
      image: "/api/placeholder/300/200",
      memberCount: 245,
      activities: ["Hiking", "Trekking", "Camping"],
      nextMeetup: {
        date: "Dec 15, 2024",
        location: "Imlil Base"
      },
      description: "Join fellow hiking enthusiasts for weekly treks in the Atlas Mountains",
      isJoined: false
    },
    {
      id: 2,
      name: "Desert Explorers",
      image: "/api/placeholder/300/200",
      memberCount: 189,
      activities: ["Desert Tours", "Camel Trekking", "Astronomy"],
      nextMeetup: {
        date: "Dec 20, 2024",
        location: "Merzouga Dunes"
      },
      description: "Discover the magic of Morocco's Sahara Desert with our adventure community",
      isJoined: true
    },
    {
      id: 3,
      name: "Coastal Riders",
      image: "/api/placeholder/300/200",
      memberCount: 156,
      activities: ["Surfing", "Cycling", "Beach Sports"],
      nextMeetup: {
        date: "Dec 18, 2024",
        location: "Taghazout Beach"
      },
      description: "Surf, cycle, and enjoy beach activities along Morocco's Atlantic coast",
      isJoined: false
    },
    {
      id: 4,
      name: "Culture Seekers",
      image: "/api/placeholder/300/200",
      memberCount: 312,
      activities: ["Cultural Tours", "Photography", "Food Tours"],
      nextMeetup: {
        date: "Dec 22, 2024",
        location: "Fez Medina"
      },
      description: "Immerse yourself in Morocco's rich cultural heritage and traditions",
      isJoined: false
    },
    {
      id: 5,
      name: "Rock Climbers Morocco",
      image: "/api/placeholder/300/200",
      memberCount: 98,
      activities: ["Rock Climbing", "Bouldering", "Via Ferrata"],
      nextMeetup: {
        date: "Dec 25, 2024",
        location: "Todra Gorge"
      },
      description: "Challenge yourself on Morocco's stunning rock formations",
      isJoined: false
    },
    {
      id: 6,
      name: "Photography Collective",
      image: "/api/placeholder/300/200",
      memberCount: 203,
      activities: ["Photography", "Photo Walks", "Workshops"],
      nextMeetup: {
        date: "Dec 28, 2024",
        location: "Chefchaouen"
      },
      description: "Capture Morocco's beauty through the lens with fellow photographers",
      isJoined: true
    }
  ];

  const clubBenefits = [
    {
      title: "Community Support",
      description: "Connect with like-minded adventurers and build lasting friendships",
      icon: "👥"
    },
    {
      title: "Expert Guidance",
      description: "Learn from experienced leaders and improve your skills safely",
      icon: "🧭"
    },
    {
      title: "Exclusive Events",
      description: "Access member-only adventures and special discounts",
      icon: "🎯"
    },
    {
      title: "Safety First",
      description: "Enjoy adventures with proper safety protocols and group support",
      icon: "🛡️"
    }
  ];

  const getActivityIcon = (activity: string) => {
    switch (activity.toLowerCase()) {
      case "hiking":
      case "trekking":
        return <Mountain className="w-4 h-4" />;
      case "cycling":
        return <Bike className="w-4 h-4" />;
      case "photography":
        return <Camera className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
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
            backgroundImage: `url(/api/placeholder/1920/800)`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-overlay)' }} />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
            Join Adventure Communities
          </h1>
          <p className="text-xl text-white/90 mb-8 font-body max-w-2xl mx-auto">
            Connect with fellow adventurers, join exciting clubs, and discover Morocco together.
          </p>
          <Button className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-3 h-auto">
            <Plus className="w-5 h-5 mr-2" />
            Start Your Club
          </Button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search clubs by name or activity..." 
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="hiking">Hiking & Trekking</SelectItem>
                  <SelectItem value="water">Water Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="adventure">Adventure Sports</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="marrakech">Marrakech</SelectItem>
                  <SelectItem value="casablanca">Casablanca</SelectItem>
                  <SelectItem value="fez">Fez</SelectItem>
                  <SelectItem value="atlas">Atlas Mountains</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "map")}>
              <TabsList>
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
          {viewMode === "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {clubs.map((club) => (
                <Card key={club.id} className="group hover:shadow-glow transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-card">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {club.memberCount}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold font-heading mb-2">{club.name}</h3>
                    <p className="text-muted-foreground font-body mb-4">{club.description}</p>
                    
                    {/* Activity Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {club.activities.map((activity) => (
                        <Badge key={activity} variant="outline" className="text-xs">
                          {getActivityIcon(activity)}
                          <span className="ml-1">{activity}</span>
                        </Badge>
                      ))}
                    </div>

                    {/* Next Meetup */}
                    <div className="bg-muted/50 rounded-button p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium font-body">Next Meetup:</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {club.nextMeetup.date} at {club.nextMeetup.location}
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${club.isJoined 
                        ? 'bg-success hover:bg-success/90' 
                        : 'bg-secondary hover:bg-secondary/90'
                      }`}
                      disabled={club.isJoined}
                    >
                      {club.isJoined ? 'Joined ✓' : 'Join Club'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "map" && (
            <div className="h-96 bg-muted rounded-card flex items-center justify-center mb-16">
              <div className="text-center">
                <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold font-heading mb-2">Interactive Club Map Coming Soon</h3>
                <p className="text-muted-foreground font-body">
                  Explore clubs on an interactive map of Morocco
                </p>
              </div>
            </div>
          )}

          {/* Club Benefits */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Join Our Clubs?</h2>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                Experience the benefits of being part of Morocco's most active adventure communities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clubBenefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-semibold font-heading mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground font-body text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-primary text-primary-foreground rounded-hero p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Member Success Stories</h2>
              <p className="text-xl text-primary-foreground/80 font-body">
                Real experiences from our adventure community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Success Story Cards */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <img 
                    src="/api/placeholder/80/80" 
                    alt="Sarah M."
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="font-semibold font-heading text-white mb-2">Sarah M.</h4>
                  <p className="text-sm text-primary-foreground/80 font-body">
                    "Joining Atlas Hikers transformed my weekends. I've made amazing friends and discovered incredible places I never knew existed!"
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <img 
                    src="/api/placeholder/80/80" 
                    alt="Ahmed K."
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="font-semibold font-heading text-white mb-2">Ahmed K.</h4>
                  <p className="text-sm text-primary-foreground/80 font-body">
                    "The Desert Explorers club introduced me to astronomy. Now I lead stargazing sessions and share my passion with newcomers."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <img 
                    src="/api/placeholder/80/80" 
                    alt="Fatima R."
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="font-semibold font-heading text-white mb-2">Fatima R.</h4>
                  <p className="text-sm text-primary-foreground/80 font-body">
                    "Starting with Photography Collective as a beginner, I've now had my photos featured in exhibitions. The support here is incredible!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Clubs;