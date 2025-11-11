import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";
import "./EventsActivitiesCalendar.css";

const EventsActivitiesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const events = [
    {
      id: 1,
      title: "Gnaoua World Music Festival",
      date: "June 21-23, 2024",
      time: "7:00 PM",
      location: "Essaouira",
      description: "A vibrant celebration of Gnaoua music and culture, featuring international artists.",
      image: gnaoua,
      price: "45",
    },
    {
      id: 2,
      title: "Timitar Festival",
      date: "July 15-20, 2024", 
      time: "6:00 PM",
      location: "Agadir",
      description: "A festival showcasing a fusion of traditional and world music.",
      image: timitar,
      price: "65",
    },
    {
      id: 3,
      title: "Mawazine Festival",
      date: "May 24-June 1, 2024",
      time: "8:00 PM",
      location: "Rabat",
      description: "One of the world's largest music festivals featuring international artists.",
      image: gnaoua,
      price: "35",
    },
    {
      id: 4,
      title: "Rose Festival",
      date: "May 10-12, 2024",
      time: "9:00 AM",
      location: "Kelaat M'Gouna",
      description: "Annual celebration of the rose harvest in the Valley of Roses.",
      image: timitar,
      price: "25",
    },
    {
      id: 5,
      title: "Fez Festival of Sacred Music",
      date: "September 14-22, 2024",
      time: "7:30 PM",
      location: "Fez",
      description: "Spiritual music from around the world in ancient Fez.",
      image: gnaoua,
      price: "55",
    },
    {
      id: 6,
      title: "Marrakech Film Festival",
      date: "November 29 - December 7, 2024",
      time: "6:00 PM",
      location: "Marrakech",
      description: "Prestigious film festival showcasing international cinema.",
      image: timitar,
      price: "75",
    },
  ];

  const totalEvents = events.length;
  const cities = new Set(events.map(e => e.location)).size;

  return (
    <section className="bg-white">
      <div className="mx-auto px-10" style={{ maxWidth: '1200px', paddingTop: '80px', paddingBottom: '80px' }}>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="font-['Poppins'] text-[40px] leading-tight font-bold mb-3">
            <span style={{ color: '#0A0A0A' }}>Events & Activities </span>
            <span style={{ color: '#D4B26A' }}>Calendar</span>
          </h2>
          <p className="font-['Inter'] text-base" style={{ color: '#666A73', marginTop: '10px' }}>
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[0.35fr_0.65fr] gap-10">
          {/* Calendar Panel - Left Side (35%) */}
          <div className="flex flex-col">
            <Card className="border-none events-activities-calendar" style={{ 
              backgroundColor: '#FFFFFF', 
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              {/* Calendar Component */}
              <div className="mb-6">
                <CalendarComponent
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="w-full"
                />
              </div>
              
              {/* Selected Date Info Box */}
              <div className="p-4 rounded-lg mb-6" style={{ 
                backgroundColor: '#F9EBD0',
                borderRadius: '8px'
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="w-4 h-4" style={{ color: '#D4B26A' }} />
                  <span className="font-['Inter'] text-sm font-medium" style={{ color: '#0A0A0A' }}>
                    Selected Date
                  </span>
                </div>
                <div className="font-['Inter'] text-sm font-medium" style={{ color: '#0A0A0A' }}>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Stats Row - 2 cards side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4" style={{ 
                  backgroundColor: '#F9F9F9',
                  borderRadius: '10px',
                  width: '140px',
                  height: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="text-2xl font-bold font-['Inter']" style={{ color: '#0A0A0A' }}>
                    {totalEvents}
                  </div>
                  <div className="text-sm font-['Inter']" style={{ color: '#757575' }}>
                    Events
                  </div>
                </div>
                <div className="text-center p-4" style={{ 
                  backgroundColor: '#F9F9F9',
                  borderRadius: '10px',
                  width: '140px',
                  height: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="text-2xl font-bold font-['Inter']" style={{ color: '#0A0A0A' }}>
                    {cities}
                  </div>
                  <div className="text-sm font-['Inter']" style={{ color: '#757575' }}>
                    Cities
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Events Cards - Right Side (65%) */}
          <div className="flex flex-col justify-between">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full flex-shrink-0"
            >
              <CarouselContent className="-ml-6">
                {events.map((event) => (
                  <CarouselItem key={event.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                    <div 
                      className="overflow-hidden group transition-all duration-300 hover:shadow-2xl"
                      style={{ 
                        width: '360px',
                        height: '480px',
                        borderRadius: '20px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                        backgroundColor: '#FFFFFF',
                        position: 'relative'
                      }}
                    >
                      {/* Image with Overlay */}
                      <div 
                        className="relative overflow-hidden" 
                        style={{ 
                          height: '60%',
                          width: '100%'
                        }}
                      >
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Gradient Overlay */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                          }}
                        />
                        
                        {/* Icons - Top Right */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button 
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                          >
                            <Heart className="w-5 h-5 text-white" strokeWidth={2} />
                          </button>
                          <button 
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                          >
                            <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
                          </button>
                        </div>
                        
                        {/* Event Info Overlay - Bottom Left */}
                        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                          <h3 className="font-['Poppins'] text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Clock className="w-4 h-4" style={{ opacity: 0.9 }} />
                            <span className="font-['Inter'] text-sm" style={{ opacity: 0.9 }}>
                              {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" style={{ opacity: 0.8 }} />
                            <span className="font-['Inter'] text-sm" style={{ opacity: 0.8 }}>
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Bottom Section */}
                      <div 
                        className="p-5 flex items-center justify-between"
                        style={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '40%',
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 100%)',
                          paddingTop: '20px'
                        }}
                      >
                        <div className="font-['Poppins'] text-lg font-bold" style={{ color: '#D4B26A' }}>
                          ${event.price}
                        </div>
                        <Button 
                          className="font-['Poppins'] text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: '#D4B26A',
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            padding: '10px 24px'
                          }}
                          onClick={() => navigate(`/book?event=${encodeURIComponent(event.title)}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#C9A758';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#D4B26A';
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation Arrows */}
              <div className="hidden lg:block">
                <CarouselPrevious 
                  className="left-0 -translate-x-12"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D4B26A',
                    color: '#D4B26A'
                  }}
                />
                <CarouselNext 
                  className="right-0 translate-x-12"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D4B26A',
                    color: '#D4B26A'
                  }}
                />
              </div>
            </Carousel>
            
            {/* Pagination Dots - Centered at Bottom */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-125"
                  style={{
                    backgroundColor: index === current ? '#D4B26A' : '#E5E7EB',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsActivitiesCalendar;
