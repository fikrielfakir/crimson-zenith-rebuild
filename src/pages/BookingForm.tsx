import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  CreditCard,
  Banknote,
  Download,
  User,
  Shield,
  FileText,
  Home,
  CalendarIcon,
  MapPin,
  Clock,
  Users
} from "lucide-react";
import { jsPDF } from "jspdf";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const eventId = searchParams.get('event');
  const dateParam = searchParams.get('date');
  const participantsParam = searchParams.get('participants');

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateParam ? new Date(dateParam) : undefined
  );
  const [participants, setParticipants] = useState(
    participantsParam ? parseInt(participantsParam) : 2
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingStep, setBookingStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [cin, setCin] = useState('');
  const [cne, setCne] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const returnUrl = `/book/form?event=${eventId}${dateParam ? `&date=${dateParam}` : ''}${participantsParam ? `&participants=${participantsParam}` : ''}`;
      toast({
        title: "Login Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [authLoading, isAuthenticated, navigate, eventId, dateParam, participantsParam, toast]);

  useEffect(() => {
    if (user) {
      const userData = user as { firstName?: string; lastName?: string; email?: string };
      if (userData.firstName || userData.lastName) {
        setCustomerName(`${userData.firstName || ''} ${userData.lastName || ''}`.trim());
      }
      if (userData.email) {
        setCustomerEmail(userData.email);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('No event specified');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/booking/events/${eventId}`);
        const data = await response.json();

        if (response.ok && data.event) {
          setSelectedEvent(data.event);
        } else {
          throw new Error(data.error || 'Failed to fetch event');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchEvent();
    }
  }, [eventId, isAuthenticated]);

  const totalPrice = selectedEvent ? (selectedEvent.price || 0) * participants : 0;

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
    
    doc.setFillColor(212, 178, 106);
    doc.rect(0, 50, 210, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('EVENT TICKET', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(212, 178, 106);
    doc.text('THE JOURNEY ASSOCIATION', 105, 42, { align: 'center' });
    
    let yPos = 70;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(17, 31, 80);
    doc.text('Booking Reference:', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(212, 178, 106);
    doc.text(booking.bookingReference, 20, yPos);
    yPos += 20;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(17, 31, 80);
    doc.text('Event Details:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Event: ${selectedEvent.title}`, 20, yPos);
    yPos += 8;
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#D4B26A] border-t-transparent"></div>
          <p className="mt-6 text-gray-600 font-['Inter'] text-lg">Loading booking form...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !selectedEvent) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="text-red-500 mb-4">
            <h2 className="text-3xl font-bold font-['Poppins'] text-[#111f50] mb-3">Unable to Load Event</h2>
            <p className="mt-3 text-gray-600 font-['Inter']">{error || 'Event not found'}</p>
          </div>
          <Link to="/book">
            <Button className="mt-6 bg-[#D4B26A] hover:bg-[#C9A758] text-white">
              Back to Events
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a] relative overflow-hidden" style={{ paddingTop: '10rem' }}>
        <div className="container mx-auto px-6 pb-8">
          <nav className="mb-6">
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
                <Link 
                  to={`/book?event=${eventId}`}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 hover:border-white/30 font-['Inter'] text-sm"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Event Details
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <li>
                <span className="flex items-center gap-2 text-white font-semibold bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 font-['Inter'] text-sm">
                  Complete Booking
                </span>
              </li>
            </ol>
          </nav>

          <div className="py-4">
            <h1 className="font-['Poppins'] font-bold text-white mb-4 text-4xl leading-tight">
              {bookingStep === 3 ? 'Booking Complete!' : 'Complete Your Booking'}
            </h1>
            <p className="font-['Inter'] text-white/80 text-lg">
              {bookingStep === 3 
                ? 'Your booking has been processed successfully' 
                : `Step ${bookingStep} of 2 - ${bookingStep === 1 ? 'Your Information' : 'Payment'}`}
            </p>
            
            {bookingStep < 3 && (
              <div className="flex items-center gap-2 mt-6">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-['Poppins'] font-bold text-base transition-all duration-300 ${
                      step < bookingStep 
                        ? 'bg-[#D4B26A] text-white' 
                        : step === bookingStep 
                          ? 'bg-white text-[#111f50] shadow-lg' 
                          : 'bg-white/20 text-white/60'
                    }`}>
                      {step < bookingStep ? <Check className="w-6 h-6" /> : step}
                    </div>
                    {step < 2 && (
                      <div className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                        step < bookingStep ? 'bg-[#D4B26A]' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200 rounded-3xl shadow-xl overflow-hidden">
              <CardContent className="p-8">
                
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-['Poppins'] text-2xl font-bold text-[#111f50] mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-[#D4B26A]" />
                      {selectedEvent.isAssociationEvent ? 'Association Event Registration' : 'Club Event Registration'}
                    </h3>
                    
                    <div>
                      <Label htmlFor="name" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="font-['Inter'] h-14 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 text-base"
                      />
                    </div>

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
                        className="font-['Inter'] h-14 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 text-base"
                      />
                    </div>

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
                              className="font-['Inter'] h-14 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 text-base"
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
                              className="font-['Inter'] h-14 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 text-base"
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
                            className="font-['Inter'] h-14 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 text-base"
                          />
                        </div>
                      </>
                    )}

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
                            className="font-['Inter'] h-14 rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 text-base"
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
                            rows={3}
                            className="font-['Inter'] rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 py-3 resize-none text-base"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="requests" className="font-['Inter'] font-semibold text-[#111f50] mb-2 block text-sm">
                        Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      <Textarea
                        id="requests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requirements or notes?"
                        rows={3}
                        className="font-['Inter'] rounded-xl border-2 border-gray-200 focus:border-[#D4B26A] px-4 py-3 resize-none text-base"
                      />
                    </div>

                    <Button 
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold text-lg py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue to Payment
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <form onSubmit={handleSubmitBooking} className="space-y-6">
                    <h3 className="font-['Poppins'] text-2xl font-bold text-[#111f50] mb-6 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-[#D4B26A]" />
                      Payment Method
                    </h3>

                    {!selectedEvent.isAssociationEvent ? (
                      <div className="space-y-4">
                        <Label className="font-['Inter'] font-semibold text-[#111f50] block text-sm">
                          Choose your payment method
                        </Label>
                        
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                            paymentMethod === 'card'
                              ? 'border-[#D4B26A] bg-[#D4B26A]/10 shadow-md'
                              : 'border-gray-200 hover:border-[#D4B26A]/50'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            paymentMethod === 'card' ? 'bg-[#D4B26A] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <CreditCard className="w-7 h-7" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-['Poppins'] font-semibold text-[#111f50] text-lg">Card Payment</p>
                            <p className="font-['Inter'] text-sm text-gray-500">Instant confirmation & ticket</p>
                          </div>
                          {paymentMethod === 'card' && (
                            <div className="w-7 h-7 rounded-full bg-[#D4B26A] flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                            paymentMethod === 'cash'
                              ? 'border-[#D4B26A] bg-[#D4B26A]/10 shadow-md'
                              : 'border-gray-200 hover:border-[#D4B26A]/50'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            paymentMethod === 'cash' ? 'bg-[#D4B26A] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Banknote className="w-7 h-7" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-['Poppins'] font-semibold text-[#111f50] text-lg">Cash Payment</p>
                            <p className="font-['Inter'] text-sm text-gray-500">Pay on-site, pending admin approval</p>
                          </div>
                          {paymentMethod === 'cash' && (
                            <div className="w-7 h-7 rounded-full bg-[#D4B26A] flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
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
                      <div className="space-y-4">
                        <div className="w-full p-5 rounded-xl border-2 border-[#D4B26A] bg-[#D4B26A]/10 flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#D4B26A] text-white flex items-center justify-center">
                            <CreditCard className="w-7 h-7" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-['Poppins'] font-semibold text-[#111f50] text-lg">Card Payment Only</p>
                            <p className="font-['Inter'] text-sm text-gray-500">Association events require card payment</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-6">
                      <Button 
                        type="button"
                        onClick={handlePrevStep}
                        variant="outline"
                        className="flex-1 font-['Poppins'] font-semibold py-7 rounded-xl border-2 text-base"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold py-7 rounded-xl shadow-lg text-lg"
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

                {bookingStep === 3 && (
                  <div className="text-center py-8 space-y-8">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <Check className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-['Poppins'] text-3xl font-bold text-[#111f50] mb-3">
                        {paymentMethod === 'cash' && !selectedEvent.isAssociationEvent 
                          ? 'Booking Submitted!' 
                          : 'Booking Confirmed!'}
                      </h3>
                      <p className="font-['Inter'] text-gray-600 text-lg">
                        {paymentMethod === 'cash' && !selectedEvent.isAssociationEvent
                          ? 'Your booking is pending admin approval'
                          : 'Your ticket has been downloaded'}
                      </p>
                    </div>

                    <Card className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-left max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-[#D4B26A]" />
                        <span className="font-['Poppins'] font-semibold text-[#111f50] text-lg">Booking Reference</span>
                      </div>
                      <p className="font-['Inter'] text-3xl font-bold text-[#D4B26A] tracking-wider">
                        {bookingReference}
                      </p>
                    </Card>

                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-left max-w-md mx-auto">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="font-['Inter'] text-sm text-blue-800">
                        A confirmation email has been sent to <strong>{customerEmail}</strong>
                      </p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                      {(paymentMethod === 'card' || selectedEvent.isAssociationEvent) && (
                        <Button 
                          type="button"
                          onClick={() => generatePDFTicket({ bookingReference })}
                          className="w-full bg-[#111f50] hover:bg-[#1a2d5a] text-white font-['Poppins'] font-semibold py-6 rounded-xl text-base"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Ticket Again
                        </Button>
                      )}

                      <Link to="/" className="block">
                        <Button 
                          type="button"
                          variant="outline"
                          className="w-full font-['Poppins'] font-semibold py-6 rounded-xl border-2 text-base"
                        >
                          Return to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-200 rounded-3xl shadow-xl overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a] px-6 py-4">
                <h5 className="font-['Poppins'] font-bold text-white text-lg">Booking Summary</h5>
              </div>
              <CardContent className="p-6 space-y-4">
                {selectedEvent.image && (
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={selectedEvent.image} 
                      alt={selectedEvent.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <h4 className="font-['Poppins'] font-bold text-[#111f50] text-lg leading-tight">
                    {selectedEvent.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-gray-600 font-['Inter'] text-sm">
                    <MapPin className="w-4 h-4 text-[#D4B26A]" />
                    {selectedEvent.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 font-['Inter'] text-sm">
                    <Clock className="w-4 h-4 text-[#D4B26A]" />
                    {selectedEvent.duration || '4 hours'}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 font-['Inter'] text-sm">
                    <CalendarIcon className="w-4 h-4 text-[#D4B26A]" />
                    {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Date not selected'}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 font-['Inter'] text-sm">
                    <Users className="w-4 h-4 text-[#D4B26A]" />
                    {participants} {participants === 1 ? 'traveler' : 'travelers'}
                  </div>
                </div>

                <div className="border-t-2 border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between font-['Inter'] text-sm">
                    <span className="text-gray-500">Price per person</span>
                    <span className="font-semibold text-[#111f50]">${selectedEvent.price}</span>
                  </div>
                  <div className="flex justify-between font-['Inter'] text-sm">
                    <span className="text-gray-500">Travelers</span>
                    <span className="font-semibold text-[#111f50]">{participants}</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between font-['Poppins'] font-bold text-xl">
                    <span className="text-[#111f50]">Total</span>
                    <span className="text-[#D4B26A]">${totalPrice}</span>
                  </div>
                </div>

                <Badge className={`font-['Inter'] text-xs px-3 py-1 ${
                  selectedEvent.isAssociationEvent 
                    ? 'bg-purple-100 text-purple-800 border-purple-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {selectedEvent.isAssociationEvent ? 'Association Event' : 'Club Event'}
                </Badge>

                <div className="flex items-start gap-2 text-xs pt-2">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-gray-500">
                    Secure booking with encrypted data
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

export default BookingForm;
