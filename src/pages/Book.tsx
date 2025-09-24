import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Users, 
  Shield, 
  CreditCard, 
  Check,
  QrCode,
  Download,
  Phone,
  Mail
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams } from "react-router-dom";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";

const Book = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAdventure, setSelectedAdventure] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isEventBooking, setIsEventBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    participants: 1,
    equipment: [],
    insurance: false,
    emergency_contact: "",
    dietary_requirements: "",
    payment_method: "card"
  });

  // Events data (same as EventCalendar)
  const events = [
    {
      title: "Gnaoua World Music Festival",
      date: "June 21-23, 2024",
      time: "7:00 PM - 11:00 PM",
      location: "Essaouira",
      description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
      image: gnaoua,
      price: "From $45",
      fixedDate: true
    },
    {
      title: "Timitar Festival",
      date: "July 15-20, 2024", 
      time: "6:00 PM - 12:00 AM",
      location: "Agadir",
      description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
      image: timitar,
      price: "From $65",
      fixedDate: true
    },
    {
      title: "Mawazine Festival",
      date: "May 24-June 1, 2024",
      time: "8:00 PM - 2:00 AM",
      location: "Rabat",
      description: "One of the world's largest music festivals featuring international and Moroccan artists across multiple genres.",
      image: gnaoua,
      price: "From $35",
      fixedDate: true
    },
    {
      title: "Rose Festival",
      date: "May 10-12, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Kelaat M'Gouna",
      description: "Annual celebration of the rose harvest in the Valley of Roses with traditional music, dances, and rose picking.",
      image: timitar,
      price: "From $25",
      fixedDate: true
    },
    {
      title: "Fez Festival of World Sacred Music",
      date: "September 14-22, 2024",
      time: "7:30 PM - 11:30 PM",
      location: "Fez",
      description: "Spiritual and sacred music from around the world performed in the mystical setting of ancient Fez.",
      image: gnaoua,
      price: "From $55",
      fixedDate: true
    },
    {
      title: "Marrakech International Film Festival",
      date: "November 29 - December 7, 2024",
      time: "6:00 PM - 12:00 AM",
      location: "Marrakech",
      description: "Prestigious film festival showcasing international cinema in the magical city of Marrakech.",
      image: timitar,
      price: "From $75",
      fixedDate: true
    },
    {
      title: "Tan-Tan Moussem",
      date: "August 15-18, 2024",
      time: "10:00 AM - 11:00 PM",
      location: "Tan-Tan",
      description: "UNESCO-recognized cultural gathering celebrating nomadic heritage with camel races and traditional performances.",
      image: gnaoua,
      price: "From $40",
      fixedDate: true
    },
    {
      title: "Chefchaouen Cultural Days",
      date: "April 20-25, 2024",
      time: "2:00 PM - 10:00 PM",
      location: "Chefchaouen",
      description: "Cultural festival in the blue city featuring local artisans, traditional crafts, and mountain folklore.",
      image: timitar,
      price: "From $30",
      fixedDate: true
    },
  ];

  const totalSteps = isEventBooking ? 3 : 4; // Skip date selection for events with fixed dates
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Mock adventure data
  const adventures = [
    {
      id: 1,
      title: "Atlas Mountains Trek",
      price: 299,
      duration: "3 days",
      difficulty: "Moderate",
      image: "/api/placeholder/400/300",
      includes: ["Professional guide", "All meals", "Camping equipment", "Transportation"],
      excludes: ["Personal equipment", "Travel insurance", "Tips"]
    },
    {
      id: 2,
      title: "Sahara Desert Expedition", 
      price: 189,
      duration: "2 days",
      difficulty: "Easy",
      image: "/api/placeholder/400/300",
      includes: ["Camel trek", "Desert camp", "Traditional meals", "Stargazing session"],
      excludes: ["Personal items", "Additional drinks", "Souvenirs"]
    }
  ];

  // Check if booking a specific event
  useEffect(() => {
    if (eventParam) {
      const matchingEvent = events.find(event => event.title === decodeURIComponent(eventParam));
      if (matchingEvent) {
        setSelectedAdventure({
          id: 999, // Special ID for events
          title: matchingEvent.title,
          price: parseInt(matchingEvent.price.replace(/[^0-9]/g, '')),
          duration: matchingEvent.date,
          difficulty: "Event",
          image: matchingEvent.image,
          location: matchingEvent.location,
          time: matchingEvent.time,
          description: matchingEvent.description,
          fixedDate: matchingEvent.fixedDate,
          includes: ["Event access", "Cultural experience", "Local performances"],
          excludes: ["Food and beverages", "Transportation", "Accommodation"]
        });
        setIsEventBooking(true);
        // For events with fixed dates, start at step 1 (Event Details) and skip date selection step
      }
    }
  }, [eventParam]);

  // Mock availability data
  const getDateAvailability = (date: Date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return "available"; // Weekend - available
    if (Math.random() > 0.7) return "limited"; // 30% chance limited
    if (Math.random() > 0.9) return "unavailable"; // 10% chance unavailable
    return "available";
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    if (isEventBooking) {
      // For event bookings with fixed dates, skip date selection
      switch (currentStep) {
        case 1:
          return <Step1AdventureSelection />;
        case 2:
          return <Step3ParticipantDetails />;
        case 3:
          return <Step4Payment />;
        default:
          return <ConfirmationPage />;
      }
    } else {
      // Regular booking flow
      switch (currentStep) {
        case 1:
          return <Step1AdventureSelection />;
        case 2:
          return <Step2DateSelection />;
        case 3:
          return <Step3ParticipantDetails />;
        case 4:
          return <Step4Payment />;
        default:
          return <ConfirmationPage />;
      }
    }
  };

  const Step1AdventureSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-heading mb-2">
          {isEventBooking ? "Event Details" : "Choose Your Adventure"}
        </h2>
        <p className="text-muted-foreground font-body">
          {isEventBooking ? "Review your selected event details" : "Select the experience that calls to your adventurous spirit"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(isEventBooking ? [selectedAdventure] : adventures).filter(Boolean).map((adventure) => (
          <Card 
            key={adventure.id}
            className={`${isEventBooking ? 'ring-2 ring-secondary shadow-glow' : 'cursor-pointer hover:shadow-elegant'} transition-all duration-300 ${
              selectedAdventure?.id === adventure.id 
                ? 'ring-2 ring-secondary shadow-glow' 
                : 'hover:shadow-elegant'
            }`}
            onClick={() => !isEventBooking && setSelectedAdventure(adventure)}
          >
            <div className="relative">
              <img 
                src={adventure.image} 
                alt={adventure.title}
                className="w-full h-48 object-cover rounded-t-card"
              />
              <Badge className="absolute top-3 right-3 bg-primary text-white">
                {adventure.difficulty}
              </Badge>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold font-heading mb-2">{adventure.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-body">{adventure.duration}</span>
                <span className="text-2xl font-bold text-primary">${adventure.price}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold font-heading text-sm mb-2 text-success">Includes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 font-body">
                    {adventure.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold font-heading text-sm mb-2 text-destructive">Excludes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 font-body">
                    {adventure.excludes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-3 h-3 text-destructive">×</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const Step2DateSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-heading mb-2">Select Your Date</h2>
        <p className="text-muted-foreground font-body">Choose when you'd like to embark on your adventure</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-card border shadow-card"
            modifiers={{
              available: (date) => getDateAvailability(date) === "available",
              limited: (date) => getDateAvailability(date) === "limited",
              unavailable: (date) => getDateAvailability(date) === "unavailable"
            }}
            modifiersStyles={{
              available: { backgroundColor: "#10b981", color: "white" },
              limited: { backgroundColor: "#f59e0b", color: "white" },
              unavailable: { backgroundColor: "#ef4444", color: "white", textDecoration: "line-through" }
            }}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold font-heading mb-4">Availability Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-success rounded"></div>
                <span className="font-body text-sm">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-warning rounded"></div>
                <span className="font-body text-sm">Limited spots</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-destructive rounded"></div>
                <span className="font-body text-sm">Unavailable</span>
              </div>
            </div>
          </div>
          
          {selectedDate && (
            <Card className="p-4">
              <h4 className="font-semibold font-heading mb-2">Selected Date</h4>
              <p className="font-body text-lg">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <Badge className="mt-2 bg-success">
                {getDateAvailability(selectedDate) === "available" ? "Available" : "Limited spots"}
              </Badge>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const Step3ParticipantDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-heading mb-2">Participant Details</h2>
        <p className="text-muted-foreground font-body">Tell us about yourself and any special requirements</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="participants" className="font-heading">Number of Participants</Label>
            <select 
              id="participants"
              className="w-full mt-2 px-3 py-2 border rounded-button font-body"
              value={bookingData.participants}
              onChange={(e) => setBookingData({...bookingData, participants: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="emergency" className="font-heading">Emergency Contact</Label>
            <Input 
              id="emergency"
              placeholder="Emergency contact name and phone"
              className="mt-2"
              value={bookingData.emergency_contact}
              onChange={(e) => setBookingData({...bookingData, emergency_contact: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="dietary" className="font-heading">Dietary Requirements</Label>
            <textarea 
              id="dietary"
              placeholder="Please list any dietary restrictions or allergies"
              className="w-full mt-2 px-3 py-2 border rounded-button font-body h-24 resize-none"
              value={bookingData.dietary_requirements}
              onChange={(e) => setBookingData({...bookingData, dietary_requirements: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold font-heading mb-4">Equipment Rental</h3>
            <div className="space-y-3">
              {[
                { id: "backpack", name: "Professional Backpack", price: 15 },
                { id: "boots", name: "Hiking Boots", price: 25 },
                { id: "sleeping_bag", name: "Sleeping Bag", price: 20 },
                { id: "jacket", name: "Weather Jacket", price: 30 }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-button">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={item.id}
                      checked={bookingData.equipment.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBookingData({
                            ...bookingData, 
                            equipment: [...bookingData.equipment, item.id]
                          });
                        } else {
                          setBookingData({
                            ...bookingData,
                            equipment: bookingData.equipment.filter(eq => eq !== item.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="font-body">{item.name}</Label>
                  </div>
                  <span className="font-semibold">${item.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border rounded-button">
            <div className="flex items-center gap-3 mb-2">
              <Checkbox 
                id="insurance"
                checked={bookingData.insurance}
                onCheckedChange={(checked) => setBookingData({...bookingData, insurance: !!checked})}
              />
              <Shield className="w-5 h-5 text-primary" />
              <Label htmlFor="insurance" className="font-heading">Travel Insurance</Label>
            </div>
            <p className="text-sm text-muted-foreground font-body ml-8">
              Comprehensive coverage for medical emergencies and trip cancellation (+$25)
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const Step4Payment = () => {
    const equipmentCost = bookingData.equipment.length * 20; // Simplified calculation
    const insuranceCost = bookingData.insurance ? 25 : 0;
    const basePrice = selectedAdventure?.price || 0;
    const totalCost = (basePrice * bookingData.participants) + equipmentCost + insuranceCost;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading mb-2">Payment & Summary</h2>
          <p className="text-muted-foreground font-body">Review your booking and complete payment</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-body">Adventure</span>
                  <span className="font-semibold">{selectedAdventure?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body">Date</span>
                  <span className="font-semibold">
                    {isEventBooking && selectedAdventure?.fixedDate ? 
                      selectedAdventure.duration : 
                      selectedDate?.toLocaleDateString()
                    }
                  </span>
                </div>
                {isEventBooking && selectedAdventure?.time && (
                  <div className="flex justify-between">
                    <span className="font-body">Time</span>
                    <span className="font-semibold">{selectedAdventure.time}</span>
                  </div>
                )}
                {isEventBooking && selectedAdventure?.location && (
                  <div className="flex justify-between">
                    <span className="font-body">Location</span>
                    <span className="font-semibold">{selectedAdventure.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-body">Participants</span>
                  <span className="font-semibold">{bookingData.participants}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-body">Base Price</span>
                  <span>${basePrice * bookingData.participants}</span>
                </div>
                {equipmentCost > 0 && (
                  <div className="flex justify-between">
                    <span className="font-body">Equipment Rental</span>
                    <span>${equipmentCost}</span>
                  </div>
                )}
                {insuranceCost > 0 && (
                  <div className="flex justify-between">
                    <span className="font-body">Travel Insurance</span>
                    <span>${insuranceCost}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalCost}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={bookingData.payment_method} 
                  onValueChange={(value) => setBookingData({...bookingData, payment_method: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="font-body">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="font-body">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="font-body">Bank Transfer</Label>
                  </div>
                </RadioGroup>
                
                {bookingData.payment_method === "card" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="font-heading">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="font-heading">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="font-heading">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-2" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmationPage = () => (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold font-heading text-success mb-4">Booking Confirmed!</h2>
        <p className="text-lg text-muted-foreground font-body">
          Your adventure is booked. Get ready for an unforgettable experience!
        </p>
      </div>
      
      <Card className="text-left">
        <CardHeader>
          <CardTitle className="font-heading">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <QrCode className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-body">Booking Reference: ADV-2024-001234</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold font-heading">Adventure:</span>
              <p className="font-body">{selectedAdventure?.title}</p>
            </div>
            <div>
              <span className="font-semibold font-heading">Date:</span>
              <p className="font-body">
                {isEventBooking && selectedAdventure?.fixedDate ? 
                  selectedAdventure.duration : 
                  selectedDate?.toLocaleDateString()
                }
              </p>
            </div>
            {isEventBooking && selectedAdventure?.time && (
              <div>
                <span className="font-semibold font-heading">Time:</span>
                <p className="font-body">{selectedAdventure.time}</p>
              </div>
            )}
            <div>
              <span className="font-semibold font-heading">Participants:</span>
              <p className="font-body">{bookingData.participants} people</p>
            </div>
            <div>
              <span className="font-semibold font-heading">Total Paid:</span>
              <p className="font-body text-primary font-semibold">$299</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Download Itinerary
        </Button>
        <Button variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Email Confirmation
        </Button>
      </div>
      
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold font-heading mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-body">24/7 Support: +212 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="font-body">help@journeyassociation.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(/book-hero.jpg)`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-overlay)' }} />
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
            Book Your Adventure
          </h1>
          <p className="text-xl text-white/90 mb-8 font-body">
            Secure your spot for an unforgettable journey through Morocco's wonders
          </p>
        </div>
      </section>

      {/* Progress Indicator */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-heading">
              Step {currentStep} of {totalSteps}
            </h2>
            <span className="text-sm text-muted-foreground font-body">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between mt-4 text-sm">
            <span className={`font-body ${currentStep >= 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              Adventure
            </span>
            {!isEventBooking && (
              <span className={`font-body ${currentStep >= 2 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                Date
              </span>
            )}
            <span className={`font-body ${isEventBooking ? (currentStep >= 2 ? 'text-primary font-semibold' : 'text-muted-foreground') : (currentStep >= 3 ? 'text-primary font-semibold' : 'text-muted-foreground')}`}>
              Details
            </span>
            <span className={`font-body ${isEventBooking ? (currentStep >= 3 ? 'text-primary font-semibold' : 'text-muted-foreground') : (currentStep >= 4 ? 'text-primary font-semibold' : 'text-muted-foreground')}`}>
              Payment
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {currentStep <= totalSteps ? renderStepContent() : <ConfirmationPage />}
          
          {/* Navigation */}
          {currentStep <= totalSteps && (
            <div className="flex justify-between mt-12">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedAdventure) ||
                  (currentStep === 2 && !selectedDate)
                }
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
              >
                {currentStep === totalSteps ? 'Complete Booking' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Book;