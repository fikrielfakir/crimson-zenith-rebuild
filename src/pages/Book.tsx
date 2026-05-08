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
  ChevronLeft,
  Plus,
  Minus,
  Award,
  Info,
  Expand,
  ZoomIn
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

          if (response.ok) {
            const data = await response.json();
            // Handle both wrapped { event: {...} } and direct {...} response formats
            const event = data.event || (data.id ? data : null);
            if (event) {
              setSelectedEvent(event);
            } else {
              throw new Error('Event not found');
            }
          } else {
            // Server error (e.g. 500) — fall back to the events list and find the event there
            const listResponse = await fetch('/api/booking/events');
            if (listResponse.ok) {
              const listData = await listResponse.json();
              const events = listData.events || listData || [];
              const found = Array.isArray(events)
                ? events.find((e: any) => e.id === eventParam)
                : null;
              if (found) {
                setSelectedEvent(found);
              } else if (Array.isArray(events) && events.length > 0) {
                setSelectedEvent(events[0]);
              } else {
                throw new Error('Event not found');
              }
            } else {
              throw new Error('Failed to fetch event');
            }
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
    if (!selectedEvent?.id) return;
    fetch(`/api/booking/events/${selectedEvent.id}/reviews`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.reviews) setReviews(d.reviews); })
      .catch(() => {});
  }, [selectedEvent?.id]);

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

  const parseLines = (v: any): string[] => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === 'string' && v.trim()) {
      const byNewline = v.split('\n').map(s => s.trim()).filter(Boolean);
      if (byNewline.length > 1) return byNewline;
      return v.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };
  const highlights = parseLines(selectedEvent.highlights);
  const included = parseLines(selectedEvent.included);
  const notIncluded = parseLines(selectedEvent.notIncluded);
  const languages: string[] = Array.isArray(selectedEvent.languages) && selectedEvent.languages.length > 0
    ? selectedEvent.languages
    : typeof selectedEvent.languages === 'string' && selectedEvent.languages.trim()
      ? selectedEvent.languages.split(',').map((l: string) => l.trim())
      : ['English'];
  const schedule: any[] = [];

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
            
            {/* Image Gallery */}
            <div className="w-full space-y-3">

              {/* Main Hero Image */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl group" style={{ aspectRatio: '16/9' }}>
                <img
                  src={displayImages[selectedImageIndex]}
                  alt={`Event image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';
                  }}
                />

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Click to expand overlay */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10"
                  aria-label="View fullscreen"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Expand className="w-5 h-5 text-[#111f50]" />
                  </div>
                </button>

                {/* Prev / Next arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(i => (i - 1 + displayImages.length) % displayImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#111f50]" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(i => (i + 1) % displayImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-[#111f50]" />
                    </button>
                  </>
                )}

                {/* Image counter badge */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-['Inter'] font-semibold px-3 py-1.5 rounded-full">
                    {selectedImageIndex + 1} / {displayImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {displayImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                        index === selectedImageIndex
                          ? 'border-[#D4B26A] shadow-lg scale-105 ring-2 ring-[#D4B26A]/30'
                          : 'border-transparent hover:border-[#D4B26A]/60 opacity-70 hover:opacity-100 shadow-sm'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={() => setLightboxOpen(false)}
              >
                <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
                  {/* Close button */}
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>

                  {/* Full image */}
                  <img
                    src={displayImages[selectedImageIndex]}
                    alt={`Event image ${selectedImageIndex + 1}`}
                    className="w-full max-h-[80vh] object-contain rounded-xl"
                  />

                  {/* Lightbox prev/next */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(i => (i - 1 + displayImages.length) % displayImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(i => (i + 1) % displayImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Lightbox thumbnail strip */}
                  {displayImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-1">
                      {displayImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImageIndex(i)}
                          className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            i === selectedImageIndex ? 'border-[#D4B26A] scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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
              <TabsContent value="overview" className="space-y-8 mt-8">

                {/* Important Note (importantInfo) */}
                {selectedEvent.importantInfo && (
                  <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-['Inter'] font-semibold text-amber-800 mb-1">Important Notice</p>
                      <p className="font-['Inter'] text-amber-700 leading-relaxed">{selectedEvent.importantInfo}</p>
                    </div>
                  </div>
                )}

                {/* Quick stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedEvent.duration && (
                    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <Clock className="w-5 h-5 text-[#D4B26A]" />
                      <span className="font-['Poppins'] font-bold text-[#111f50] text-sm">{selectedEvent.duration}</span>
                      <span className="font-['Inter'] text-gray-500 text-xs">Duration</span>
                    </div>
                  )}
                  {selectedEvent.minAge && (
                    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <Users className="w-5 h-5 text-[#D4B26A]" />
                      <span className="font-['Poppins'] font-bold text-[#111f50] text-sm">{selectedEvent.minAge}+</span>
                      <span className="font-['Inter'] text-gray-500 text-xs">Min Age</span>
                    </div>
                  )}
                  {selectedEvent.maxPeople && (
                    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <Users className="w-5 h-5 text-[#D4B26A]" />
                      <span className="font-['Poppins'] font-bold text-[#111f50] text-sm">{selectedEvent.maxPeople}</span>
                      <span className="font-['Inter'] text-gray-500 text-xs">Max Capacity</span>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <Globe className="w-5 h-5 text-[#D4B26A]" />
                      <span className="font-['Poppins'] font-bold text-[#111f50] text-sm text-center leading-tight">{languages.join(', ')}</span>
                      <span className="font-['Inter'] text-gray-500 text-xs">Language</span>
                    </div>
                  )}
                </div>

                {/* About Section */}
                <div>
                  <h3 className="font-['Poppins'] text-2xl font-bold text-[#111f50] mb-4">About This Experience</h3>
                  <p className="font-['Inter'] text-gray-700 leading-relaxed text-lg">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div>
                    <h4 className="font-['Poppins'] text-xl font-semibold text-[#111f50] mb-4 flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#D4B26A]" />
                      Experience Highlights
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
                        >
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="font-['Inter'] text-gray-800 leading-relaxed text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What's Included / Not Included */}
                {(included.length > 0 || notIncluded.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {included.length > 0 && (
                      <Card className="border-2 border-green-100 rounded-2xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                          <h4 className="font-['Poppins'] text-lg font-bold text-white flex items-center gap-2">
                            <Check className="w-5 h-5" strokeWidth={3} />
                            What's Included
                          </h4>
                        </div>
                        <CardContent className="p-5">
                          <ul className="space-y-2.5">
                            {included.map((item, index) => (
                              <li key={index} className="flex items-start gap-3 font-['Inter'] text-gray-700 text-sm">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    {notIncluded.length > 0 && (
                      <Card className="border-2 border-red-100 rounded-2xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4">
                          <h4 className="font-['Poppins'] text-lg font-bold text-white flex items-center gap-2">
                            <X className="w-5 h-5" strokeWidth={3} />
                            Not Included
                          </h4>
                        </div>
                        <CardContent className="p-5">
                          <ul className="space-y-2.5">
                            {notIncluded.map((item, index) => (
                              <li key={index} className="flex items-start gap-3 font-['Inter'] text-gray-700 text-sm">
                                <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

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
              <TabsContent value="schedule" className="space-y-6 mt-8">
                <h3 className="font-['Poppins'] text-2xl font-bold text-[#111f50]">Event Schedule</h3>

                {/* Always show event date/time info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedEvent.eventDate && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#111f50]/5 border border-[#111f50]/10">
                      <div className="w-10 h-10 rounded-full bg-[#111f50] flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-['Inter'] font-semibold text-[#111f50] mb-0.5">Start Date</p>
                        <p className="font-['Inter'] text-gray-600 text-sm">
                          {format(new Date(selectedEvent.eventDate), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="font-['Poppins'] font-bold text-[#D4B26A] text-sm mt-1">
                          {format(new Date(selectedEvent.eventDate), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedEvent.endDate && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#D4B26A]/5 border border-[#D4B26A]/20">
                      <div className="w-10 h-10 rounded-full bg-[#D4B26A] flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-['Inter'] font-semibold text-[#111f50] mb-0.5">End Date</p>
                        <p className="font-['Inter'] text-gray-600 text-sm">
                          {format(new Date(selectedEvent.endDate), 'EEEE, MMMM d, yyyy')}
                        </p>
                        {selectedEvent.duration && (
                          <p className="font-['Inter'] text-gray-500 text-xs mt-1">Duration: {selectedEvent.duration}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed schedule items if any */}
                {schedule.length > 0 ? (
                  <div className="space-y-4">
                    {schedule.map((item: any, index: number) => (
                      <Card key={index} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-5">
                          <div className="flex gap-5 items-start">
                            <div className="font-['Poppins'] font-bold text-[#D4B26A] text-base min-w-[70px] bg-[#D4B26A]/10 px-3 py-1.5 rounded-lg text-center">
                              {item.time || `Day ${item.day_number || index + 1}`}
                            </div>
                            <div className="flex-1">
                              {item.title && <p className="font-['Poppins'] font-semibold text-[#111f50] mb-1">{item.title}</p>}
                              {item.description && <p className="font-['Inter'] text-gray-600 text-sm leading-relaxed">{item.description}</p>}
                              {item.activity && <p className="font-['Inter'] text-gray-700 leading-relaxed">{item.activity}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-['Poppins'] font-semibold text-gray-400 mb-1">Detailed schedule coming soon</p>
                    <p className="font-['Inter'] text-gray-400 text-sm">The organiser will update the full day-by-day plan shortly.</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-8 mt-8">

                {/* Header row */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <h3 className="font-['Poppins'] text-2xl font-bold text-[#111f50]">Guest Reviews</h3>
                  {(selectedEvent.rating > 0 || reviews.length > 0) && (
                    <div className="flex items-center gap-2 bg-[#D4B26A]/10 px-5 py-2.5 rounded-xl border border-[#D4B26A]/20">
                      <Star className="w-5 h-5 text-[#D4B26A] fill-[#D4B26A]" />
                      <span className="font-['Poppins'] text-xl font-bold text-[#111f50]">
                        {selectedEvent.rating || (reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : '—')}
                      </span>
                      <span className="font-['Inter'] text-gray-500 text-sm">({reviews.length || selectedEvent.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Submit a review — only if authenticated */}
                {!reviewSubmitted ? (
                  <Card className="border-2 border-[#D4B26A]/20 rounded-2xl shadow-md bg-gradient-to-br from-amber-50/40 to-orange-50/20">
                    <CardContent className="p-6">
                      <h4 className="font-['Poppins'] font-semibold text-[#111f50] text-lg mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#D4B26A]" />
                        {isAuthenticated ? 'Write a Review' : 'Log in to Leave a Review'}
                      </h4>

                      {isAuthenticated ? (
                        <div className="space-y-4">
                          {/* Star selector */}
                          <div>
                            <p className="font-['Inter'] text-sm text-gray-600 mb-2">Your Rating</p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setReviewHover(star)}
                                  onMouseLeave={() => setReviewHover(0)}
                                  className="transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-8 h-8 transition-colors ${
                                      star <= (reviewHover || reviewRating)
                                        ? 'text-[#D4B26A] fill-[#D4B26A]'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                              {reviewRating > 0 && (
                                <span className="ml-2 font-['Inter'] text-sm text-gray-600 self-center">
                                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Comment */}
                          <div>
                            <p className="font-['Inter'] text-sm text-gray-600 mb-2">Your Review (optional)</p>
                            <textarea
                              value={reviewText}
                              onChange={e => setReviewText(e.target.value)}
                              placeholder="Share your experience…"
                              rows={3}
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 font-['Inter'] text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#D4B26A]/40 focus:border-[#D4B26A]"
                            />
                          </div>

                          <Button
                            onClick={async () => {
                              if (!reviewRating) {
                                toast({ title: 'Please select a star rating', variant: 'destructive' });
                                return;
                              }
                              setReviewSubmitting(true);
                              try {
                                const res = await fetch(`/api/booking/events/${selectedEvent.id}/reviews`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({
                                    rating: reviewRating,
                                    review: reviewText,
                                    userName: user?.name || user?.username || 'Anonymous',
                                  }),
                                });
                                if (res.ok) {
                                  const d = await res.json();
                                  setReviews(prev => [d.review, ...prev]);
                                  setReviewSubmitted(true);
                                  toast({ title: 'Review submitted — thank you!' });
                                } else {
                                  toast({ title: 'Could not submit review', description: 'Please try again later.', variant: 'destructive' });
                                }
                              } catch {
                                toast({ title: 'Could not submit review', description: 'Please try again later.', variant: 'destructive' });
                              } finally {
                                setReviewSubmitting(false);
                              }
                            }}
                            disabled={reviewSubmitting || !reviewRating}
                            className="bg-[#D4B26A] hover:bg-[#C9A758] text-white font-['Poppins'] font-semibold px-6 py-2.5 rounded-xl border-0"
                          >
                            {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <p className="font-['Inter'] text-gray-600 text-sm">You must be logged in to share your experience.</p>
                          <Button
                            onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.href)}`)}
                            className="bg-[#111f50] hover:bg-[#1a2d5a] text-white font-['Inter'] font-semibold px-5 py-2 rounded-xl border-0 text-sm"
                          >
                            Log In
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-5">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="font-['Inter'] text-green-800 font-semibold">Thanks for your review! It helps other travellers.</p>
                  </div>
                )}

                {/* Review list */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any, index: number) => (
                      <Card key={index} className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#111f50] flex items-center justify-center flex-shrink-0 text-white font-['Poppins'] font-bold text-sm">
                              {(review.userName || review.user_name || 'A')[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h5 className="font-['Poppins'] font-semibold text-[#111f50]">{review.userName || review.user_name || 'Anonymous'}</h5>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[#D4B26A] fill-[#D4B26A]' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                {review.createdAt && (
                                  <span className="font-['Inter'] text-xs text-gray-400">
                                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                  </span>
                                )}
                              </div>
                              {review.review && (
                                <p className="font-['Inter'] text-gray-700 leading-relaxed text-sm">{review.review}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 text-center">
                    <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-['Poppins'] font-semibold text-gray-400 mb-1">No reviews yet</p>
                    <p className="font-['Inter'] text-gray-400 text-sm">Be the first to share your experience!</p>
                  </div>
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
