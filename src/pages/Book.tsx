import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Award,
  Globe,
  Home,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { addDays, differenceInDays, format, isSameDay } from "date-fns";
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const Book = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  
  // Booking form state
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [AutoScroll({ playOnInit: true, speed: 1 })]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Map state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapStyleUrl, setMapStyleUrl] = useState<string | null>(null);

  // Fetch satellite map style
  useEffect(() => {
    const initMapStyle = async () => {
      try {
        const response = await fetch("https://tiles.openfreemap.org/styles/liberty");
        if (response.ok) {
          const styleJson = await response.json();
          setMapStyleUrl("https://tiles.openfreemap.org/styles/liberty");
        }
      } catch (error) {
        console.error("Failed to fetch map style:", error);
        setMapStyleUrl("https://tiles.openfreemap.org/styles/liberty");
      }
    };

    initMapStyle();
  }, []);

  // Fetch event from backend using club_events table
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        
        // If no event param, fetch all booking events and use first one
        if (!eventParam) {
          const response = await fetch('/api/booking/events');
          const data = await response.json();
          
          if (response.ok && data.events && data.events.length > 0) {
            // Use the first booking event
            setSelectedEvent(data.events[0]);
          } else {
            throw new Error('No events available');
          }
        } else {
          // Fetch specific booking event by ID
          const response = await fetch(`/api/booking/events/${eventParam}`);
          const data = await response.json();
          
          if (response.ok && data.event) {
            setSelectedEvent(data.event);
          } else {
            throw new Error(data.error || 'Failed to fetch event');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventParam]);

  // Parse gallery images from event data
  useEffect(() => {
    if (!selectedEvent) return;
    
    try {
      // Booking events have images as a JSON string
      if (selectedEvent.images) {
        const images = typeof selectedEvent.images === 'string' 
          ? JSON.parse(selectedEvent.images)
          : selectedEvent.images;
        setGalleryImages(images);
      } else if (selectedEvent.image) {
        // Fallback to single image if gallery not available
        setGalleryImages([selectedEvent.image]);
      }
    } catch (err) {
      console.error('Failed to parse event images:', err);
      // Fallback to single image if parsing fails
      if (selectedEvent.image) {
        setGalleryImages([selectedEvent.image]);
      }
    }
  }, [selectedEvent]);

  // Handle carousel selection changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Initialize map when event is selected
  useEffect(() => {
    if (!selectedEvent || !mapContainer.current || !mapStyleUrl || map.current) return;

    const latitude = parseFloat(selectedEvent.latitude) || 31.7917;
    const longitude = parseFloat(selectedEvent.longitude) || -7.0926;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyleUrl,
        center: [longitude, latitude],
        zoom: 12,
        attributionControl: false,
      });

      // Add marker for event location
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#D4A574';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

      new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [selectedEvent, mapStyleUrl]);

  // Set default selected date to event start date
  useEffect(() => {
    if (!selectedDate && selectedEvent?.eventDate) {
      setSelectedDate(new Date(selectedEvent.eventDate));
    }
  }, [selectedEvent?.eventDate, selectedDate]);

  const validateBookingForm = (): string | null => {
    if (!selectedEvent || !selectedDate) {
      return "Please select an event and date before booking.";
    }
    
    if (!customerName.trim() || customerName.trim().length < 2) {
      return "Please enter a valid name (at least 2 characters).";
    }
    
    if (customerName.trim().length > 100) {
      return "Name must be less than 100 characters.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      return "Please enter a valid email address.";
    }
    
    if (customerEmail.trim().length > 255) {
      return "Email must be less than 255 characters.";
    }
    
    if (customerPhone.trim()) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(customerPhone.trim()) || customerPhone.trim().length > 20) {
        return "Please enter a valid phone number (max 20 characters).";
      }
    }
    
    if (specialRequests.trim().length > 1000) {
      return "Special requests must be less than 1000 characters.";
    }
    
    return null;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        
        setShowBookingDialog(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setSpecialRequests('');
      } else {
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

  // API now returns arrays directly, just ensure they're valid
  const highlights = Array.isArray(selectedEvent.highlights) ? selectedEvent.highlights : [];
  const included = Array.isArray(selectedEvent.included) ? selectedEvent.included : [];
  const notIncluded = Array.isArray(selectedEvent.notIncluded) ? selectedEvent.notIncluded : [];
  const languages = selectedEvent.languages?.split(',').map((l: string) => l.trim()) || ['English'];
  const schedule: any[] = []; // Schedule will come from event_schedule table in future
  const reviews: any[] = []; // Reviews will come from reviews table in future

  const totalPrice = (selectedEvent.price || 0) * participants;
  const savings = 0; // No savings calculation for now

  // Calculate available dates from eventDate and endDate
  const getAvailableDates = () => {
    if (!selectedEvent.eventDate) {
      return [];
    }
    
    const start = new Date(selectedEvent.eventDate);
    const end = selectedEvent.endDate ? new Date(selectedEvent.endDate) : start;
    const dates: Date[] = [];
    
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Use gallery images if available, otherwise fallback to single event image
  // Normalize image format - handle both string URLs and objects with imageUrl property
  const displayImages = galleryImages.length > 0
    ? galleryImages.map(img => typeof img === 'string' ? img : (img.imageUrl || img.url || '/api/placeholder/1200/600'))
    : (selectedEvent.image ? [selectedEvent.image] : ['/api/placeholder/1200/600']);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Primary Color Background */}
      <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
        {/* Primary Color Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: 'hsl(var(--primary))',
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />

        {/* Content */}
        <div className="relative container mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
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
                <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                  {selectedEvent.title}
                </span>
              </li>
            </ol>
          </nav>

          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              {selectedEvent.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <div className="container mx-auto px-4 -mt-8 mb-8">
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-xl shadow-2xl" ref={emblaRef}>
            <div className="flex">
              {displayImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative aspect-[16/9]">
                    <img 
                      src={image}
                      alt={`${selectedEvent.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation Buttons */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Carousel Dots Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === selectedImageIndex
                        ? 'bg-primary w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-2'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">About This Experience</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {selectedEvent.description}
                  </p>
                  
                  {highlights.length > 0 && (
                    <>
                      <h4 className="text-xl font-semibold mb-4">Highlights</h4>
                      <div className="grid md:grid-cols-2 gap-3 mb-6">
                        {highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
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
                    {selectedEvent.ageRange && (
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary" />
                        <span><strong>Age Range:</strong> {selectedEvent.ageRange}</span>
                      </div>
                    )}
                    {selectedEvent.cancellationPolicy && (
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-primary" />
                        <span><strong>Cancellation:</strong> {selectedEvent.cancellationPolicy}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span><strong>Languages:</strong> Available in {languages.length > 0 ? languages.join(', ') : 'English'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4 mt-6">
                <h3 className="text-2xl font-bold mb-4">Daily Schedule</h3>
                {schedule.length > 0 ? (
                  <div className="space-y-4">
                    {schedule.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="font-semibold text-primary min-w-16">{item.time}</div>
                        <div>{item.activity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No schedule information available.</p>
                )}
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
                
                {reviews.length > 0 ? (
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
                              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold">${selectedEvent.price}</span>
                    <span className="text-muted-foreground">/ person</span>
                  </div>
                  {selectedEvent.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">${selectedEvent.originalPrice}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Save ${selectedEvent.originalPrice - selectedEvent.price}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="participants" className="mb-2 block">Number of Participants</Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      max="20"
                      value={participants}
                      onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Select Date</Label>
                    {availableDates.length > 0 ? (
                      <div className="grid grid-cols-7 gap-1">
                        {availableDates.map((date, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`p-2 text-sm rounded transition-colors ${
                              selectedDate && isSameDay(selectedDate, date)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <div className="text-xs">{format(date, 'EEE')}</div>
                            <div className="font-semibold">{format(date, 'd')}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Date range not set for this event</p>
                    )}
                    {selectedDate && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {format(selectedDate, 'MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Price per person</span>
                    <span>${selectedEvent.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Participants</span>
                    <span>{participants}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600 mb-2">
                      <span>Savings</span>
                      <span>-${savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowBookingDialog(true)}
                  className="w-full bg-secondary hover:bg-secondary/90"
                  disabled={!selectedDate && availableDates.length > 0}
                >
                  Book Now
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Free cancellation up to 24 hours before the experience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Please provide your contact information to confirm this booking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requirements or requests?"
                rows={3}
              />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Booking Summary:</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Event:</span>
                  <span className="font-medium">{selectedEvent.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span className="font-medium">{participants}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-lg">${totalPrice}</span>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : `Confirm Booking - $${totalPrice}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Book;
