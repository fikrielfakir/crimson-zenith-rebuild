import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  Shield,
  MessageCircle,
  Globe,
  Home,
  ChevronRight,
  Plus,
  Minus,
  Award,
  Info
} from "lucide-react";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { addDays, format, isSameDay } from "date-fns";
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const Book = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const eventParam = searchParams.get('event');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [existingBooking, setExistingBooking] = useState<any>(null);
  const [hasBookedEvent, setHasBookedEvent] = useState(false);
  
  const { toast } = useToast();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [AutoScroll({ playOnInit: false, speed: 1 })]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapStyleUrl, setMapStyleUrl] = useState<string | null>(null);

  useEffect(() => {
    const initMapStyle = async () => {
      try {
        const response = await fetch("https://tiles.openfreemap.org/styles/liberty");
        if (response.ok) {
          setMapStyleUrl("https://tiles.openfreemap.org/styles/liberty");
        }
      } catch (error) {
        console.error("Failed to fetch map style:", error);
        setMapStyleUrl("https://tiles.openfreemap.org/styles/liberty");
      }
    };
    initMapStyle();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        
        if (!eventParam) {
          const response = await fetch('/api/booking/events');
          const data = await response.json();
          
          if (response.ok && data.events && data.events.length > 0) {
            setSelectedEvent(data.events[0]);
          } else {
            throw new Error('No events available');
          }
        } else {
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

  useEffect(() => {
    if (!selectedEvent) return;
    
    try {
      if (selectedEvent.images) {
        const images = typeof selectedEvent.images === 'string' 
          ? JSON.parse(selectedEvent.images)
          : selectedEvent.images;
        setGalleryImages(images);
      } else if (selectedEvent.image) {
        setGalleryImages([selectedEvent.image]);
      }
    } catch (err) {
      console.error('Failed to parse event images:', err);
      if (selectedEvent.image) {
        setGalleryImages([selectedEvent.image]);
      }
    }
  }, [selectedEvent]);

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

      const el = document.createElement('div');
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#D4B26A';
      el.style.border = '4px solid white';
      el.style.boxShadow = '0 4px 16px rgba(212, 178, 106, 0.4)';

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

  useEffect(() => {
    if (!selectedDate && selectedEvent?.eventDate) {
      setSelectedDate(new Date(selectedEvent.eventDate));
    }
  }, [selectedEvent?.eventDate, selectedDate]);

  useEffect(() => {
    const checkExistingBooking = async () => {
      if (authLoading) {
        return;
      }
      
      if (!selectedEvent?.id || !isAuthenticated) {
        setHasBookedEvent(false);
        setExistingBooking(null);
        return;
      }
      
      try {
        const response = await fetch(`/api/booking/check-event/${selectedEvent.id}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasBookedEvent(data.hasBooked);
          setExistingBooking(data.booking);
        }
      } catch (err) {
        console.error('Failed to check existing booking:', err);
      }
    };

    checkExistingBooking();
  }, [selectedEvent?.id, isAuthenticated, authLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#D4B26A] border-t-transparent"></div>
          <p className="mt-6 text-gray-600 font-['Inter'] text-lg">Loading your experience...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="text-red-500 mb-4">
            <X className="w-20 h-20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-['Poppins'] text-[#111f50] mb-3">Unable to Load Event</h2>
            <p className="mt-3 text-gray-600 font-['Inter']">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#D4B26A] border-t-transparent"></div>
          <p className="mt-6 text-gray-600 font-['Inter'] text-lg">Preparing your adventure...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const highlights = Array.isArray(selectedEvent.highlights) ? selectedEvent.highlights : [];
  const included = Array.isArray(selectedEvent.included) ? selectedEvent.included : [];
  const notIncluded = Array.isArray(selectedEvent.notIncluded) ? selectedEvent.notIncluded : [];
  const languages = selectedEvent.languages?.split(',').map((l: string) => l.trim()) || ['English'];
  const schedule: any[] = [];
  const reviews: any[] = [];

  const totalPrice = (selectedEvent.price || 0) * participants;

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

  const displayImages = galleryImages.length > 0
    ? galleryImages.map(img => typeof img === 'string' ? img : (img.imageUrl || img.url || '/api/placeholder/1200/600'))
    : (selectedEvent.image ? [selectedEvent.image] : ['/api/placeholder/1200/600']);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#5b6b8f] relative overflow-hidden" style={{ paddingTop: '15rem' }}>
        <div className="container mx-auto px-6 pb-12">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 hover:border-white/30 font-['Inter'] text-sm"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <li>
                <span className="flex items-center gap-2 text-white font-semibold bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 font-['Inter'] text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  Event Details
                </span>
              </li>
            </ol>
          </nav>

          {/* Hero Title */}
          <div className="py-4">
            <h1 className="font-['Poppins'] font-bold text-white mb-6 text-5xl leading-tight">
              {selectedEvent.title}
            </h1>
            
            {/* Event Meta Information */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/25">
                <MapPin className="w-4 h-4 text-[#D4B26A]" />
                <span className="text-white font-['Inter'] text-sm">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/25">
                <Clock className="w-4 h-4 text-[#D4B26A]" />
                <span className="text-white font-['Inter'] text-sm">{selectedEvent.duration || '4 hours'}</span>
              </div>
              {selectedEvent.rating && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/25">
                  <Star className="w-4 h-4 text-[#D4B26A] fill-[#D4B26A]" />
                  <span className="text-white font-['Inter'] text-sm font-semibold">{selectedEvent.rating}</span>
                  <span className="text-white/80 font-['Inter'] text-sm">({selectedEvent.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Thumbnail Slider - Same Width as TabsList */}
            <div className="w-full">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    className={`flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                      index === selectedImageIndex
                        ? 'border-[#D4B26A] shadow-xl scale-105'
                        : 'border-gray-200 hover:border-[#D4B26A]/50 shadow-md'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Modern Floating Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-sm h-auto">
                <TabsTrigger 
                  value="overview"
                  className="font-['Inter'] font-semibold text-base data-[state=active]:bg-white data-[state=active]:text-[#111f50] data-[state=active]:shadow-md rounded-xl py-3.5 transition-all duration-300"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="schedule"
                  className="font-['Inter'] font-semibold text-base data-[state=active]:bg-white data-[state=active]:text-[#111f50] data-[state=active]:shadow-md rounded-xl py-3.5 transition-all duration-300"
                >
                  Schedule
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="font-['Inter'] font-semibold text-base data-[state=active]:bg-white data-[state=active]:text-[#111f50] data-[state=active]:shadow-md rounded-xl py-3.5 transition-all duration-300"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-10 mt-10">
                
                {/* About Section */}
                <div>
                  <h3 className="font-['Poppins'] text-3xl font-bold text-[#111f50] mb-6">About This Experience</h3>
                  <p className="font-['Inter'] text-gray-700 leading-relaxed text-lg mb-8">
                    {selectedEvent.description}
                  </p>
                  
                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <>
                      <h4 className="font-['Poppins'] text-2xl font-semibold text-[#111f50] mb-6 flex items-center gap-3">
                        <Award className="w-6 h-6 text-[#D4B26A]" />
                        Experience Highlights
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {highlights.map((highlight, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                            <span className="font-['Inter'] text-gray-800 leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* What's Included / Not Included Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Included Card */}
                  <Card className="border-2 border-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5">
                      <h4 className="font-['Poppins'] text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                        What's Included
                      </h4>
                    </div>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {included.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 font-['Inter'] text-gray-700">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Not Included Card */}
                  <Card className="border-2 border-red-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5">
                      <h4 className="font-['Poppins'] text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <X className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                        What's Not Included
                      </h4>
                    </div>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 font-['Inter'] text-gray-700">
                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Important Information Section */}
                <Card className="border border-gray-200 rounded-2xl shadow-md bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
                  <CardContent className="p-8">
                    <h4 className="font-['Poppins'] text-2xl font-semibold text-[#111f50] mb-6 flex items-center gap-3">
                      <Info className="w-6 h-6 text-[#D4B26A]" />
                      Important Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedEvent.ageRange && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-[#D4B26A]/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-[#D4B26A]" />
                          </div>
                          <div>
                            <p className="font-['Inter'] font-semibold text-[#111f50] mb-1">Age Range</p>
                            <p className="font-['Inter'] text-gray-600">{selectedEvent.ageRange}</p>
                          </div>
                        </div>
                      )}
                      {selectedEvent.cancellationPolicy && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-[#D4B26A]/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-[#D4B26A]" />
                          </div>
                          <div>
                            <p className="font-['Inter'] font-semibold text-[#111f50] mb-1">Cancellation Policy</p>
                            <p className="font-['Inter'] text-gray-600">{selectedEvent.cancellationPolicy}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#D4B26A]/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 text-[#D4B26A]" />
                        </div>
                        <div>
                          <p className="font-['Inter'] font-semibold text-[#111f50] mb-1">Languages</p>
                          <p className="font-['Inter'] text-gray-600">Available in {languages.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#D4B26A]/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-[#D4B26A]" />
                        </div>
                        <div>
                          <p className="font-['Inter'] font-semibold text-[#111f50] mb-1">Support</p>
                          <p className="font-['Inter'] text-gray-600">24/7 customer service</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Map */}
                {selectedEvent.latitude && selectedEvent.longitude && (
                  <Card className="border border-gray-200 rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a] p-5">
                      <h4 className="font-['Poppins'] text-xl font-bold text-white flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#D4B26A]" />
                        Meeting Location
                      </h4>
                    </div>
                    <div ref={mapContainer} className="w-full h-80" />
                  </Card>
                )}
              </TabsContent>
              
              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-6 mt-10">
                <div>
                  <h3 className="font-['Poppins'] text-3xl font-bold text-[#111f50] mb-6">Daily Schedule</h3>
                  {schedule.length > 0 ? (
                    <div className="space-y-4">
                      {schedule.map((item, index) => (
                        <Card key={index} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex gap-6 items-start">
                              <div className="font-['Poppins'] font-bold text-[#D4B26A] text-lg min-w-[80px] bg-[#D4B26A]/10 px-4 py-2 rounded-lg text-center">
                                {item.time}
                              </div>
                              <div className="font-['Inter'] text-gray-700 leading-relaxed text-lg flex-1">
                                {item.activity}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-gray-200 rounded-xl">
                      <CardContent className="p-12 text-center">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="font-['Inter'] text-gray-500 text-lg">Detailed schedule coming soon</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-8 mt-10">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Poppins'] text-3xl font-bold text-[#111f50]">Guest Reviews</h3>
                  {selectedEvent.rating && (
                    <div className="flex items-center gap-3 bg-[#D4B26A]/10 px-6 py-3 rounded-xl border border-[#D4B26A]/20">
                      <Star className="w-7 h-7 text-[#D4B26A] fill-[#D4B26A]" />
                      <span className="font-['Poppins'] text-2xl font-bold text-[#111f50]">{selectedEvent.rating}</span>
                      <span className="font-['Inter'] text-gray-600">({selectedEvent.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
                
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <Card key={index} className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-5">
                            <img 
                              src={review.avatar} 
                              alt={review.name}
                              className="w-14 h-14 rounded-full object-cover shadow-md"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h5 className="font-['Poppins'] font-semibold text-lg text-[#111f50]">{review.name}</h5>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating 
                                          ? 'text-[#D4B26A] fill-[#D4B26A]' 
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-['Inter'] text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="font-['Inter'] text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border border-gray-200 rounded-xl">
                    <CardContent className="p-12 text-center">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="font-['Inter'] text-gray-500 text-lg">Be the first to review this experience</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Premium Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2 border-gray-200 rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)' }}>
              
              {/* Pricing Header */}
              <div className="bg-gradient-to-br from-[#111f50] via-[#1a2d5a] to-[#111f50] p-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-['Poppins'] text-5xl font-bold text-white">${selectedEvent.price}</span>
                  <span className="font-['Inter'] text-white/80 text-lg">per person</span>
                </div>
                {selectedEvent.originalPrice && selectedEvent.originalPrice > selectedEvent.price && (
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-['Inter'] text-white/60 line-through text-lg">${selectedEvent.originalPrice}</span>
                    <Badge className="bg-[#D4B26A] text-white border-0 font-['Inter'] font-semibold px-3 py-1 text-sm">
                      Save ${selectedEvent.originalPrice - selectedEvent.price}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-8 space-y-8">
                
                {/* Existing Booking Notice */}
                {hasBookedEvent && existingBooking && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-['Inter'] text-sm text-blue-800 font-semibold">You've already booked this event!</p>
                      <p className="font-['Inter'] text-xs text-blue-600 mt-1">
                        Booking ref: {existingBooking.bookingReference}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Participant Selector with Premium Stepper */}
                <div>
                  <Label className="font-['Inter'] font-semibold text-[#111f50] mb-4 block text-lg">Number of Travelers</Label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <button
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-[#111f50] hover:bg-[#111f50] hover:text-white hover:border-[#111f50] transition-all duration-300 shadow-sm hover:shadow-md"
                      disabled={participants <= 1}
                    >
                      <Minus className="w-5 h-5" strokeWidth={3} />
                    </button>
                    <span className="font-['Poppins'] text-3xl font-bold text-[#111f50]">{participants}</span>
                    <button
                      onClick={() => setParticipants(Math.min(20, participants + 1))}
                      className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-[#111f50] hover:bg-[#D4B26A] hover:text-white hover:border-[#D4B26A] transition-all duration-300 shadow-sm hover:shadow-md"
                      disabled={participants >= 20}
                    >
                      <Plus className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* Premium Date Picker */}
                <div>
                  <Label className="font-['Inter'] font-semibold text-[#111f50] mb-4 block text-lg">Select Your Date</Label>
                  {availableDates.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {availableDates.slice(0, 8).map((date, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 rounded-xl text-center transition-all duration-300 border-2 ${
                              selectedDate && isSameDay(selectedDate, date)
                                ? 'bg-[#D4B26A] text-white border-[#D4B26A] shadow-lg scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-[#D4B26A] hover:shadow-md'
                            }`}
                          >
                            <div className="font-['Inter'] text-xs font-medium mb-1">{format(date, 'EEE')}</div>
                            <div className="font-['Poppins'] font-bold text-lg">{format(date, 'd')}</div>
                          </button>
                        ))}
                      </div>
                      {selectedDate && (
                        <p className="font-['Inter'] text-sm text-gray-600 text-center bg-gray-50 px-4 py-3 rounded-lg">
                          Selected: <span className="font-semibold text-[#111f50]">{format(selectedDate, 'MMMM d, yyyy')}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-['Inter'] text-sm text-gray-500 bg-gray-50 px-4 py-4 rounded-lg text-center">
                      Dates will be available soon
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between items-center font-['Inter'] text-gray-700">
                    <span>Price per person</span>
                    <span className="font-semibold">${selectedEvent.price}</span>
                  </div>
                  <div className="flex justify-between items-center font-['Inter'] text-gray-700">
                    <span>Number of travelers</span>
                    <span className="font-semibold">{participants}</span>
                  </div>
                  <div className="flex justify-between items-center font-['Poppins'] text-2xl font-bold text-[#111f50] border-t-2 border-gray-200 pt-4 mt-4">
                    <span>Total</span>
                    <span className="text-[#D4B26A]">${totalPrice}</span>
                  </div>
                </div>

                {/* Premium Book Now / View Booking Button */}
                {hasBookedEvent && existingBooking ? (
                  <Button 
                    onClick={() => navigate(`/profile?tab=bookings`)}
                    className="w-full bg-gradient-to-r from-[#111f50] to-[#1a3366] hover:from-[#1a3366] hover:to-[#2a4376] text-white font-['Poppins'] font-bold text-lg py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0"
                    style={{ letterSpacing: '0.5px' }}
                  >
                    View Your Booking
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('event', selectedEvent.id.toString());
                      if (selectedDate) {
                        params.set('date', selectedDate.toISOString());
                      }
                      params.set('participants', participants.toString());
                      const bookingUrl = `/book/form?${params.toString()}`;
                      
                      if (!isAuthenticated) {
                        toast({
                          title: "Login Required",
                          description: "Please log in to book this experience.",
                        });
                        navigate(`/login?redirect=${encodeURIComponent(bookingUrl)}`);
                        return;
                      }
                      
                      navigate(bookingUrl);
                    }}
                    disabled={!selectedDate && availableDates.length > 0}
                    className="w-full bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold text-lg py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0"
                    style={{ letterSpacing: '0.5px' }}
                  >
                    Book This Experience
                  </Button>
                )}

                {/* Cancellation Policy Note */}
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-sm text-green-800 leading-relaxed">
                    <span className="font-semibold">Free cancellation</span> up to 24 hours before the experience starts
                  </p>
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
