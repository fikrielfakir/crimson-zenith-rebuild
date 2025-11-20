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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking form state
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch booking events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/booking/events');
        const data = await response.json();
        
        if (response.ok) {
          setEvents(data.events || []);
        } else {
          throw new Error(data.error || 'Failed to fetch events');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      if (eventParam) {
        const matchingEvent = events.find(event => 
          event.id === eventParam || event.title === decodeURIComponent(eventParam)
        );
        if (matchingEvent) {
          setSelectedEvent(matchingEvent);
        } else {
          // Default to first event if parameter doesn't match
          setSelectedEvent(events[0]);
        }
      } else {
        setSelectedEvent(events[0]);
      }
    }
  }, [eventParam, events]);

  const nextImage = () => {
    if (selectedEvent && images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent && images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const validateBookingForm = (): string | null => {
    // Validate required fields
    if (!selectedEvent || !selectedDate) {
      return "Please select an event and date before booking.";
    }
    
    if (!customerName.trim() || customerName.trim().length < 2) {
      return "Please enter a valid name (at least 2 characters).";
    }
    
    if (customerName.trim().length > 100) {
      return "Name must be less than 100 characters.";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      return "Please enter a valid email address.";
    }
    
    if (customerEmail.trim().length > 255) {
      return "Email must be less than 255 characters.";
    }
    
    // Phone validation (if provided)
    if (customerPhone.trim()) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(customerPhone.trim()) || customerPhone.trim().length > 20) {
        return "Please enter a valid phone number (max 20 characters).";
      }
    }
    
    // Special requests length
    if (specialRequests.trim().length > 1000) {
      return "Special requests must be less than 1000 characters.";
    }
    
    return null;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    const validationError = validateBookingForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        eventId: selectedEvent!.id,
        eventTitle: selectedEvent!.title,
        eventDate: selectedDate!.toISOString(),
        participants: participants,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim() || null,
        specialRequests: specialRequests.trim() || null,
        totalPrice: selectedEvent!.price * participants,
        status: 'pending',
        paymentStatus: 'pending',
      };

      const response = await fetch('/api/booking/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: `Your booking reference is: ${data.ticket.bookingReference}. Check your email for details.`,
        });
        
        // Reset form
        setShowBookingDialog(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setSpecialRequests('');
      } else {
        // Show specific error from backend
        const errorMessage = data.error || 'Failed to create booking';
        toast({
          title: "Booking Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading booking events...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-red-500 mb-4">
            <X className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Error Loading Events</h2>
            <p className="mt-2">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-muted-foreground mb-4">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">No Events Available</h2>
            <p className="mt-2">There are currently no booking events available.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Safe array defaults to prevent crashes when properties are undefined
  // Parse JSON fields if they come as strings from the database
  const parseJsonField = (field: any): any[] => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const images = parseJsonField(selectedEvent.images);
  const schedule = parseJsonField(selectedEvent.schedule);
  const reviews = parseJsonField(selectedEvent.reviews);
  const similarEvents = parseJsonField(selectedEvent.similarEvents);
  const highlights = parseJsonField(selectedEvent.highlights);
  const included = parseJsonField(selectedEvent.included);
  const notIncluded = parseJsonField(selectedEvent.notIncluded);
  const languages = parseJsonField(selectedEvent.languages);

  const totalPrice = selectedEvent.price * participants;
  const savings = selectedEvent.originalPrice ? 
    (selectedEvent.originalPrice - selectedEvent.price) * participants : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      {selectedEvent && (
        <Breadcrumbs items={[
          { label: 'Events', href: '/events' },
          { label: selectedEvent.title }
        ]} />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Section with Image Gallery */}
            <div className="relative">
              <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
                {images.length > 0 ? (
                  <img 
                    src={images[currentImageIndex] || '/api/placeholder/800/600'} 
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                    <span className="ml-2 text-gray-500">No images available</span>
                  </div>
                )}
                
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
                  {images.length > 0 ? `${currentImageIndex + 1} / ${images.length}` : '0 / 0'}
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
                {images.map((image, index) => (
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
                      {languages.length > 0 ? languages.join(', ') : 'English'}
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
                    {highlights.map((highlight, index) => (
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
                      {included.map((item, index) => (
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
                      {notIncluded.map((item, index) => (
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
                      <span><strong>Languages:</strong> Available in {languages.length > 0 ? languages.join(', ') : 'English'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4 mt-6">
                <h3 className="text-2xl font-bold mb-4">Daily Schedule</h3>
                <div className="space-y-4">
                  {schedule.map((item, index) => (
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
                  {reviews.map((review, index) => (
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
                  {images.map((image, index) => (
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
                {similarEvents.map((event, index) => (
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
                    onClick={() => setShowBookingDialog(true)}
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

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Fill in your details to confirm your reservation for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Event:</span>
                <span className="text-sm">{selectedEvent?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Travelers:</span>
                <span className="text-sm">{participants} {participants === 1 ? 'person' : 'people'}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-bold">Total Price:</span>
                <span className="font-bold text-primary">${selectedEvent?.price * participants}</span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  maxLength={100}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {customerName.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  maxLength={255}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {customerEmail.length}/255 characters
                </p>
              </div>

              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+212 XXX XXX XXX"
                  pattern="[\d\s\+\-\(\)]+"
                  maxLength={20}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional - {customerPhone.length}/20 characters
                </p>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any dietary restrictions, accessibility needs, or special requests?"
                  maxLength={1000}
                  className="mt-1.5 min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional - {specialRequests.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingDialog(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Book;