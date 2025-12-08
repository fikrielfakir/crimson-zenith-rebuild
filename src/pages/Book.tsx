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
  CreditCard,
  Banknote,
  Download,
  User,
  MapPinIcon,
  FileText
} from "lucide-react";
import { jsPDF } from "jspdf";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { addDays, format, isSameDay } from "date-fns";
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const Book = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [bookingStep, setBookingStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [cin, setCin] = useState('');
  const [cne, setCne] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

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

    if (selectedEvent.isAssociationEvent) {
      if (!dateOfBirth) {
        return "Please enter your date of birth.";
      }
      if (!address.trim() || address.trim().length < 5) {
        return "Please enter a valid address (at least 5 characters).";
      }
    } else {
      if (!cin.trim() || cin.trim().length < 5) {
        return "Please enter a valid CIN (at least 5 characters).";
      }
      if (!cne.trim() || cne.trim().length < 5) {
        return "Please enter a valid CNE (at least 5 characters).";
      }
      if (!customerPhone.trim()) {
        return "Please enter your phone number.";
      }
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

  const generatePDFTicket = (booking: any) => {
    const doc = new jsPDF();
    
    doc.setFillColor(17, 31, 80);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Ticket', 105, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Booking Reference: ${booking.bookingReference}`, 105, 40, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedEvent.title, 20, 70);
    
    doc.setDrawColor(212, 178, 106);
    doc.setLineWidth(2);
    doc.line(20, 75, 190, 75);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPos = 90;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Event Details:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'N/A'}`, 20, yPos);
    yPos += 8;
    doc.text(`Location: ${selectedEvent.location}`, 20, yPos);
    yPos += 8;
    doc.text(`Duration: ${selectedEvent.duration || '4 hours'}`, 20, yPos);
    yPos += 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Attendee Information:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${customerName}`, 20, yPos);
    yPos += 8;
    doc.text(`Email: ${customerEmail}`, 20, yPos);
    yPos += 8;
    if (customerPhone) {
      doc.text(`Phone: ${customerPhone}`, 20, yPos);
      yPos += 8;
    }
    yPos += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Summary:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Number of Travelers: ${participants}`, 20, yPos);
    yPos += 8;
    doc.text(`Price per Person: $${selectedEvent.price}`, 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Total Amount: $${totalPrice}`, 20, yPos);
    yPos += 15;
    
    doc.setFillColor(212, 178, 106);
    doc.roundedRect(20, yPos, 170, 25, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Status: CONFIRMED - Payment Verified', 105, yPos + 15, { align: 'center' });
    
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(10);
    doc.text('Please present this ticket at the event entrance.', 105, 270, { align: 'center' });
    doc.text('Thank you for booking with us!', 105, 278, { align: 'center' });
    
    doc.save(`ticket-${booking.bookingReference}.pdf`);
  };

  const resetBookingForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setSpecialRequests('');
    setCin('');
    setCne('');
    setDateOfBirth('');
    setAddress('');
    setPaymentMethod('card');
    setBookingStep(1);
    setBookingComplete(false);
    setBookingReference('');
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
      const isAssociation = selectedEvent.isAssociationEvent;
      const isCashPayment = !isAssociation && paymentMethod === 'cash';
      
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
        status: isCashPayment ? 'pending' : 'accepted',
        paymentStatus: isCashPayment ? 'pending' : 'completed',
        paymentMethod: isAssociation ? 'card' : paymentMethod,
        cin: !isAssociation ? cin.trim() : null,
        cne: !isAssociation ? cne.trim() : null,
        dateOfBirth: isAssociation ? dateOfBirth : null,
        address: isAssociation ? address.trim() : null,
        isAssociationEvent: isAssociation,
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
        setBookingReference(data.ticket.bookingReference);
        setBookingComplete(true);
        setBookingStep(3);
        
        if (!isCashPayment) {
          generatePDFTicket(data.ticket);
        }
        
        toast({
          title: isCashPayment ? "Booking Submitted!" : "Booking Confirmed!",
          description: isCashPayment 
            ? `Your booking reference is: ${data.ticket.bookingReference}. Payment pending admin approval.`
            : `Your booking reference is: ${data.ticket.bookingReference}. Your ticket has been downloaded.`,
        });
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

  const handleNextStep = () => {
    if (bookingStep === 1) {
      if (!customerName.trim() || customerName.trim().length < 2) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid name (at least 2 characters).",
          variant: "destructive",
        });
        return;
      }
      if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
      if (selectedEvent.isAssociationEvent) {
        if (!dateOfBirth) {
          toast({
            title: "Validation Error",
            description: "Please enter your date of birth.",
            variant: "destructive",
          });
          return;
        }
        if (!address.trim() || address.trim().length < 5) {
          toast({
            title: "Validation Error",
            description: "Please enter a valid address.",
            variant: "destructive",
          });
          return;
        }
      } else {
        if (!cin.trim() || cin.trim().length < 5) {
          toast({
            title: "Validation Error",
            description: "Please enter a valid CIN.",
            variant: "destructive",
          });
          return;
        }
        if (!cne.trim() || cne.trim().length < 5) {
          toast({
            title: "Validation Error",
            description: "Please enter a valid CNE.",
            variant: "destructive",
          });
          return;
        }
        if (!customerPhone.trim()) {
          toast({
            title: "Validation Error",
            description: "Please enter your phone number.",
            variant: "destructive",
          });
          return;
        }
      }
      setBookingStep(2);
    }
  };

  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleCloseDialog = () => {
    setShowBookingDialog(false);
    resetBookingForm();
  };

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

                {/* Premium Book Now Button */}
                <Button 
                  onClick={() => setShowBookingDialog(true)}
                  disabled={!selectedDate && availableDates.length > 0}
                  className="w-full bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold text-lg py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0"
                  style={{ letterSpacing: '0.5px' }}
                >
                  Book This Experience
                </Button>

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

      {/* Booking Dialog - Multi-Step Premium Design */}
      <Dialog open={showBookingDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] rounded-3xl border-2 border-gray-200 p-0 overflow-hidden flex flex-col">
          
          {/* Dialog Header with Gradient */}
          <div className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a] p-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="font-['Poppins'] text-2xl font-bold text-white mb-2">
                {bookingStep === 3 ? 'Booking Complete!' : 'Complete Your Booking'}
              </DialogTitle>
              <DialogDescription className="font-['Inter'] text-white/80 text-sm">
                {bookingStep === 3 
                  ? 'Your booking has been processed successfully' 
                  : `Step ${bookingStep} of 2 - ${bookingStep === 1 ? 'Your Information' : 'Payment'}`}
              </DialogDescription>
            </DialogHeader>
            
            {/* Step Progress Indicator */}
            {bookingStep < 3 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-['Poppins'] font-bold text-sm transition-all duration-300 ${
                      step < bookingStep 
                        ? 'bg-[#D4B26A] text-white' 
                        : step === bookingStep 
                          ? 'bg-white text-[#111f50] shadow-lg' 
                          : 'bg-white/20 text-white/60'
                    }`}>
                      {step < bookingStep ? <Check className="w-5 h-5" /> : step}
                    </div>
                    {step < 2 && (
                      <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                        step < bookingStep ? 'bg-[#D4B26A]' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Content - Scrollable */}
          <div className="overflow-y-auto flex-1">
            <div className="grid md:grid-cols-5 gap-0">
              
              {/* Main Form Area */}
              <div className="md:col-span-3 p-6">
                
                {/* Step 1: Personal Information */}
                {bookingStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="font-['Poppins'] text-xl font-bold text-[#111f50] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#D4B26A]" />
                      {selectedEvent.isAssociationEvent ? 'Association Event Registration' : 'Club Event Registration'}
                    </h3>
                    
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="name" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="font-['Inter'] h-12 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="font-['Inter'] h-12 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4"
                      />
                    </div>

                    {/* Club Event Fields */}
                    {!selectedEvent.isAssociationEvent && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cin" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                              CIN <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="cin"
                              value={cin}
                              onChange={(e) => setCin(e.target.value)}
                              placeholder="National ID Number"
                              className="font-['Inter'] h-12 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cne" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                              CNE <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="cne"
                              value={cne}
                              onChange={(e) => setCne(e.target.value)}
                              placeholder="Student ID Number"
                              className="font-['Inter'] h-12 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+212 6XX XXX XXX"
                            className="font-['Inter'] h-12 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4"
                          />
                        </div>
                      </>
                    )}

                    {/* Association Event Fields */}
                    {selectedEvent.isAssociationEvent && (
                      <>
                        <div>
                          <Label htmlFor="dob" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                            Date of Birth <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="dob"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="font-['Inter'] h-12 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                            Address <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full address"
                            rows={2}
                            className="font-['Inter'] rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 py-3 resize-none"
                          />
                        </div>
                      </>
                    )}

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="requests" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                        Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      <Textarea
                        id="requests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requirements or notes?"
                        rows={2}
                        className="font-['Inter'] rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 py-3 resize-none"
                      />
                    </div>

                    <Button 
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold text-base py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue to Payment
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {bookingStep === 2 && (
                  <form onSubmit={handleSubmitBooking} className="space-y-5">
                    <h3 className="font-['Poppins'] text-xl font-bold text-[#111f50] mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#D4B26A]" />
                      Payment Method
                    </h3>

                    {/* Payment Method Selection */}
                    {!selectedEvent.isAssociationEvent ? (
                      <div className="space-y-3">
                        <Label className="font-['Inter'] font-semibold text-[#111f50] block text-sm">
                          Choose your payment method
                        </Label>
                        
                        {/* Card Payment Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                            paymentMethod === 'card'
                              ? 'border-[#D4B26A] bg-[#D4B26A]/10 shadow-md'
                              : 'border-gray-200 hover:border-[#D4B26A]/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === 'card' ? 'bg-[#D4B26A] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-['Poppins'] font-semibold text-[#111f50]">Card Payment</p>
                            <p className="font-['Inter'] text-sm text-gray-500">Instant confirmation & ticket</p>
                          </div>
                          {paymentMethod === 'card' && (
                            <div className="w-6 h-6 rounded-full bg-[#D4B26A] flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>

                        {/* Cash Payment Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                            paymentMethod === 'cash'
                              ? 'border-[#D4B26A] bg-[#D4B26A]/10 shadow-md'
                              : 'border-gray-200 hover:border-[#D4B26A]/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === 'cash' ? 'bg-[#D4B26A] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Banknote className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-['Poppins'] font-semibold text-[#111f50]">Cash Payment</p>
                            <p className="font-['Inter'] text-sm text-gray-500">Pay on-site, pending admin approval</p>
                          </div>
                          {paymentMethod === 'cash' && (
                            <div className="w-6 h-6 rounded-full bg-[#D4B26A] flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>

                        {paymentMethod === 'cash' && (
                          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="font-['Inter'] text-sm text-amber-800">
                              Cash payments require admin approval. Your booking will be pending until confirmed.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-full p-4 rounded-xl border-2 border-[#D4B26A] bg-[#D4B26A]/10 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#D4B26A] text-white flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-['Poppins'] font-semibold text-[#111f50]">Card Payment Only</p>
                            <p className="font-['Inter'] text-sm text-gray-500">Association events require card payment</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="button"
                        onClick={handlePrevStep}
                        variant="outline"
                        className="flex-1 font-['Poppins'] font-semibold py-6 rounded-xl border-2"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold py-6 rounded-xl shadow-lg"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <>Confirm Booking - ${totalPrice}</>
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: Confirmation */}
                {bookingStep === 3 && (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-['Poppins'] text-2xl font-bold text-[#111f50] mb-2">
                        {paymentMethod === 'cash' && !selectedEvent.isAssociationEvent 
                          ? 'Booking Submitted!' 
                          : 'Booking Confirmed!'}
                      </h3>
                      <p className="font-['Inter'] text-gray-600">
                        {paymentMethod === 'cash' && !selectedEvent.isAssociationEvent
                          ? 'Your booking is pending admin approval'
                          : 'Your ticket has been downloaded'}
                      </p>
                    </div>

                    <Card className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-[#D4B26A]" />
                        <span className="font-['Poppins'] font-semibold text-[#111f50]">Booking Reference</span>
                      </div>
                      <p className="font-['Inter'] text-2xl font-bold text-[#D4B26A] tracking-wider">
                        {bookingReference}
                      </p>
                    </Card>

                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="font-['Inter'] text-sm text-blue-800">
                        A confirmation email has been sent to <strong>{customerEmail}</strong>
                      </p>
                    </div>

                    {(paymentMethod === 'card' || selectedEvent.isAssociationEvent) && (
                      <Button 
                        type="button"
                        onClick={() => generatePDFTicket({ bookingReference })}
                        className="w-full bg-[#111f50] hover:bg-[#1a2d5a] text-white font-['Poppins'] font-semibold py-5 rounded-xl"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Ticket Again
                      </Button>
                    )}

                    <Button 
                      type="button"
                      onClick={handleCloseDialog}
                      variant="outline"
                      className="w-full font-['Poppins'] font-semibold py-5 rounded-xl border-2"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>

              {/* Booking Summary Sidebar */}
              <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200 p-6">
                <Card className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-md">
                  <div className="bg-[#111f50] px-4 py-3">
                    <h5 className="font-['Poppins'] font-bold text-white text-sm">Booking Summary</h5>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-['Inter']">
                        <span className="text-gray-500">Event</span>
                        <span className="font-semibold text-[#111f50] text-right max-w-[120px] truncate">{selectedEvent.title}</span>
                      </div>
                      <div className="flex justify-between font-['Inter']">
                        <span className="text-gray-500">Date</span>
                        <span className="font-semibold text-[#111f50]">
                          {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between font-['Inter']">
                        <span className="text-gray-500">Travelers</span>
                        <span className="font-semibold text-[#111f50]">{participants}</span>
                      </div>
                      <div className="flex justify-between font-['Inter']">
                        <span className="text-gray-500">Per person</span>
                        <span className="font-semibold text-[#111f50]">${selectedEvent.price}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-['Poppins'] font-bold">
                        <span className="text-[#111f50]">Total</span>
                        <span className="text-[#D4B26A] text-lg">${totalPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Type Badge */}
                <div className="mt-4">
                  <Badge className={`font-['Inter'] text-xs px-3 py-1 ${
                    selectedEvent.isAssociationEvent 
                      ? 'bg-purple-100 text-purple-800 border-purple-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {selectedEvent.isAssociationEvent ? 'Association Event' : 'Club Event'}
                  </Badge>
                </div>

                {/* Security Note */}
                <div className="mt-4 flex items-start gap-2 text-xs">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-gray-500">
                    Secure booking with encrypted data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Book;
