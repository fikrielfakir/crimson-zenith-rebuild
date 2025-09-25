import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Calendar, 
  Shield,
  Camera,
  Heart,
  Share2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const ActivityDetail = () => {
  const { activityName } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Activity data - in a real app, this would come from an API
  const activities = {
    "atlas-mountains": {
      title: "Atlas Mountains Trek",
      description: "Experience breathtaking views and traditional Berber culture in Morocco's highest peaks",
      longDescription: "Embark on an unforgettable journey through the High Atlas Mountains, where snow-capped peaks meet traditional Berber villages. This multi-day trek offers spectacular panoramic views, encounters with local communities, and a chance to witness Morocco's stunning natural beauty from its highest vantage points.",
      images: [
        "/api/placeholder/800/400",
        "/api/placeholder/800/400", 
        "/api/placeholder/800/400",
        "/api/placeholder/800/400"
      ],
      duration: "3 days",
      difficulty: "Moderate",
      groupSize: "8-12 people",
      rating: 4.8,
      price: 299,
      location: "High Atlas Mountains, Morocco",
      bestTime: "April - October",
      included: [
        "Professional mountain guide",
        "All meals during trek", 
        "Camping equipment",
        "Transport to/from trailhead",
        "Traditional Berber village visit"
      ],
      notIncluded: [
        "Personal hiking equipment",
        "Travel insurance",
        "Tips for guides"
      ],
      itinerary: [
        { day: 1, title: "Arrival & Base Camp Setup", description: "Meet your guide, equipment check, and hike to base camp at 2,800m altitude." },
        { day: 2, title: "Summit Attempt & Village Visit", description: "Early morning summit push to 4,167m, afternoon visit to traditional Berber village." },
        { day: 3, title: "Return Journey", description: "Descent through cedar forests and return to Marrakech." }
      ]
    },
    "sahara-desert": {
      title: "Sahara Desert Adventure",
      description: "Camel trekking and camping under the stars in the world's largest hot desert",
      longDescription: "Discover the magic of the Sahara Desert on this incredible adventure. Travel by camel across golden dunes, experience traditional nomadic culture, and spend nights under some of the clearest starry skies on Earth. This experience offers a perfect blend of adventure and tranquility.",
      images: [
        "/api/placeholder/800/400",
        "/api/placeholder/800/400",
        "/api/placeholder/800/400", 
        "/api/placeholder/800/400"
      ],
      duration: "2 days",
      difficulty: "Easy",
      groupSize: "6-10 people",
      rating: 4.9,
      price: 189,
      location: "Merzouga, Erg Chebbi Dunes",
      bestTime: "October - April",
      included: [
        "Camel trekking experience",
        "Desert camp accommodation",
        "Traditional Berber dinner",
        "Sunrise/sunset viewing",
        "Professional guide"
      ],
      notIncluded: [
        "Transport to Merzouga",
        "Lunch on day 1",
        "Personal expenses"
      ],
      itinerary: [
        { day: 1, title: "Desert Entry & Sunset", description: "Arrive in Merzouga, camel trek into dunes, watch sunset, traditional dinner and overnight in desert camp." },
        { day: 2, title: "Sunrise & Return", description: "Early morning sunrise viewing, camel trek back, traditional breakfast." }
      ]
    },
    "atlantique": {
      title: "Coastal Surfing Experience",
      description: "Learn to surf on Morocco's pristine Atlantic coastline with expert instructors",
      longDescription: "Experience the thrill of surfing on Morocco's stunning Atlantic coast. Our expert instructors will guide you through the basics or help improve your technique on some of the world's most consistent waves. The coastal town of Taghazout offers perfect learning conditions with warm water and gentle breaks.",
      images: [
        "/api/placeholder/800/400",
        "/api/placeholder/800/400",
        "/api/placeholder/800/400",
        "/api/placeholder/800/400"
      ],
      duration: "1 day",
      difficulty: "Beginner",
      groupSize: "4-8 people",
      rating: 4.6,
      price: 89,
      location: "Taghazout, Atlantic Coast",
      bestTime: "Year-round",
      included: [
        "Professional surf instructor",
        "Surfboard rental",
        "Wetsuit rental",
        "Beach safety briefing",
        "Light lunch"
      ],
      notIncluded: [
        "Transport to Taghazout",
        "Personal surf equipment",
        "Accommodation"
      ],
      itinerary: [
        { day: 1, title: "Surf Lesson & Practice", description: "Morning theory session, practical surf lesson, lunch break, afternoon practice session with personalized feedback." }
      ]
    }
  };

  const activity = activities[activityName as keyof typeof activities];

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Activity Not Found</h1>
          <p className="text-muted-foreground mb-8">The activity you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/discover')}>
            Browse All Activities
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Activities', href: '/discover' },
        { label: activity.title }
      ]} />

      {/* Hero Section */}
      <section className="relative">
        <div className="h-96 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{activity.title}</h1>
            <p className="text-xl max-w-2xl mx-auto">{activity.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {activity.images.map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg aspect-video">
                    <img 
                      src={image} 
                      alt={`${activity.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="included">What's Included</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">About This Experience</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {activity.longDescription}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </h4>
                    <p className="text-muted-foreground">{activity.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Best Time to Visit
                    </h4>
                    <p className="text-muted-foreground">{activity.bestTime}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="itinerary" className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">Day by Day Itinerary</h3>
                {activity.itinerary.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">Day {item.day}: {item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="included" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4 text-green-700 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {activity.included.map((item, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-red-700">
                      Not Included
                    </h4>
                    <ul className="space-y-2">
                      {activity.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary">
                      ${activity.price}
                    </CardTitle>
                    <p className="text-muted-foreground">per person</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{activity.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Group Size</span>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{activity.groupSize}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                    <Badge className={getDifficultyColor(activity.difficulty)}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{activity.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Link to={`/book?event=${encodeURIComponent(activityName || '')}`}>
                    <Button className="w-full" size="lg">
                      Book Now - ${activity.price}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    View Photos
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full" size="lg">
                      Ask Questions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ActivityDetail;