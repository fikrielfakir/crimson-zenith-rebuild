import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Check,
  X,
  Calendar as CalendarIcon,
  Share2,
  Heart,
  Camera,
  Shield,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Globe
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const Book = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Enhanced events data with TripAdvisor-style information
  const events = [
    {
      title: "Gnaoua World Music Festival",
      subtitle: "3-Day Cultural Music Experience in Essaouira",
      location: "Essaouira, Morocco",
      duration: "3 days",
      price: 85,
      originalPrice: 120,
      rating: 4.8,
      reviewCount: 1247,
      images: [
        "/api/placeholder/800/500",
        "/api/placeholder/800/500", 
        "/api/placeholder/800/500",
        "/api/placeholder/800/500",
        "/api/placeholder/800/500",
        "/api/placeholder/800/500"
      ],
      description: "Experience the magical Gnaoua World Music Festival in the coastal city of Essaouira. This UNESCO-recognized festival brings together traditional Gnaoua musicians with international artists for an unforgettable cultural celebration.",
      highlights: [
        "UNESCO World Heritage festival experience",
        "Traditional Gnaoua music performances", 
        "International artist collaborations",
        "Coastal city of Essaouira exploration",
        "Local cultural immersion",
        "Traditional Moroccan workshops"
      ],
      included: [
        "3-day festival access pass",
        "Professional local guide", 
        "Cultural orientation session",
        "Traditional Moroccan lunch on Day 2",
        "Workshop participation",
        "Festival merchandise",
        "Group photo session"
      ],
      notIncluded: [
        "Hotel accommodation",
        "Transportation to Essaouira", 
        "Personal expenses",
        "Additional meals",
        "Travel insurance",
        "Tips and gratuities"
      ],
      schedule: [
        { time: "09:00", activity: "Meet at designated meeting point in Essaouira medina" },
        { time: "09:30", activity: "Cultural orientation and historical overview" },
        { time: "11:00", activity: "Explore traditional music venues and workshops" },
        { time: "13:00", activity: "Traditional Moroccan lunch (included)" },
        { time: "15:00", activity: "Afternoon performances and artist meet & greets" },
        { time: "19:00", activity: "Evening main stage performances" },
        { time: "22:00", activity: "Free time to explore night activities" }
      ],
      reviews: [
        {
          name: "Sarah M.",
          rating: 5,
          date: "2 weeks ago",
          comment: "Absolutely incredible experience! The music was soul-stirring and the cultural immersion was authentic. Our guide was knowledgeable and passionate.",
          helpful: 23,
          avatar: "/api/placeholder/40/40"
        },
        {
          name: "Ahmed K.", 
          rating: 5,
          date: "1 month ago",
          comment: "As a local, I was impressed by how well this tour showcased our culture. The festival access was seamless and the workshops were fascinating.",
          helpful: 18,
          avatar: "/api/placeholder/40/40"
        },
        {
          name: "Maria L.",
          rating: 4,
          date: "2 months ago", 
          comment: "Great festival experience! Only wish the lunch had more variety, but the music and atmosphere were phenomenal.",
          helpful: 12,
          avatar: "/api/placeholder/40/40"
        }
      ],
      similarEvents: [
        { title: "Timitar Festival Experience", price: 65, rating: 4.6, image: "/api/placeholder/200/150" },
        { title: "Fez Sacred Music Festival", price: 75, rating: 4.7, image: "/api/placeholder/200/150" },
        { title: "Mawazine Festival VIP", price: 95, rating: 4.9, image: "/api/placeholder/200/150" },
        { title: "Rose Festival Cultural Tour", price: 45, rating: 4.5, image: "/api/placeholder/200/150" }
      ],
      category: "Cultural Festival",
      languages: ["English", "French", "Arabic"],
      ageRange: "All ages welcome",
      groupSize: "2-25 people",
      cancellationPolicy: "Free cancellation up to 24 hours before the experience starts"
    }
  ];

  useEffect(() => {
    if (eventParam) {
      const matchingEvent = events.find(event => event.title === decodeURIComponent(eventParam));
      if (matchingEvent) {
        setSelectedEvent(matchingEvent);
      } else {
        // Default to first event if parameter doesn't match
        setSelectedEvent(events[0]);
      }
    } else {
      setSelectedEvent(events[0]);
    }
  }, [eventParam]);

  const nextImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) => 
        prev === selectedEvent.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedEvent.images.length - 1 : prev - 1
      );
    }
  };

  if (!selectedEvent) {
    return <div>Loading...</div>;
  }

  const totalPrice = selectedEvent.price * participants;
  const savings = (selectedEvent.originalPrice - selectedEvent.price) * participants;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Events', href: '/events' },
        { label: selectedEvent.title }
      ]} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Section with Image Gallery */}
            <div className="relative">
              <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
                <img 
                  src={selectedEvent.images[currentImageIndex]} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedEvent.images.length}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/80 hover:bg-white"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {selectedEvent.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-primary shadow-md' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title and Basic Info */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedEvent.title}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{selectedEvent.subtitle}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedEvent.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedEvent.groupSize}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {selectedEvent.languages.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedEvent.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{selectedEvent.rating}</span>
                    <span className="text-muted-foreground">({selectedEvent.reviewCount} reviews)</span>
                  </div>
                  <Badge variant="outline" className="mb-2">{selectedEvent.category}</Badge>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">Bestseller</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">About This Experience</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {selectedEvent.description}
                  </p>
                  
                  <h4 className="text-xl font-semibold mb-4">Highlights</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedEvent.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {selectedEvent.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-red-700 flex items-center">
                      <X className="w-5 h-5 mr-2" />
                      What's Not Included
                    </h4>
                    <ul className="space-y-2">
                      {selectedEvent.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Important Information</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-primary" />
                      <span><strong>Age Range:</strong> {selectedEvent.ageRange}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-primary" />
                      <span><strong>Cancellation:</strong> {selectedEvent.cancellationPolicy}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span><strong>Languages:</strong> Available in {selectedEvent.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4 mt-6">
                <h3 className="text-2xl font-bold mb-4">Daily Schedule</h3>
                <div className="space-y-4">
                  {selectedEvent.schedule.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="font-semibold text-primary min-w-16">{item.time}</div>
                      <div>{item.activity}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-bold">{selectedEvent.rating}</span>
                    <span className="text-muted-foreground">({selectedEvent.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {selectedEvent.reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img 
                            src={review.avatar} 
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-semibold">{review.name}</h5>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-muted-foreground mb-3 leading-relaxed">{review.comment}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                👍 Helpful ({review.helpful})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="space-y-6 mt-6">
                <h3 className="text-2xl font-bold">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedEvent.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={image} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Similar Events */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Similar Experiences</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedEvent.similarEvents.map((event, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h5 className="font-semibold mb-2 line-clamp-2">{event.title}</h5>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-sm">{event.rating}</span>
                        </div>
                        <span className="font-bold text-primary">${event.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Pricing */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">${selectedEvent.price}</span>
                      <span className="text-lg text-muted-foreground line-through">${selectedEvent.originalPrice}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">per person</p>
                    {savings > 0 && (
                      <p className="text-green-600 text-sm font-medium">Save ${savings} total!</p>
                    )}
                  </div>

                  <Separator />

                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Select Date</Label>
                    <div className="border rounded-lg p-1">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="w-full"
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Travelers</Label>
                    <Select value={participants.toString()} onValueChange={(value) => setParticipants(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Total Calculation */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>${selectedEvent.price} x {participants} person{participants !== 1 ? 's' : ''}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button 
                    className="w-full h-12 text-lg font-semibold"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                    disabled={!selectedDate}
                  >
                    {selectedDate ? `Reserve for ${selectedDate.toLocaleDateString()}` : 'Select Date to Book'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    You won't be charged yet
                  </p>

                  <Separator />

                  {/* Contact Options */}
                  <div className="space-y-3">
                    <Link to="/contact">
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ask a Question
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      View All Photos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Book;