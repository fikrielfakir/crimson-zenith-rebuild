import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight, MoreHorizontal, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";
import "./EventCalendar.calendar.css";

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 2;
  const navigate = useNavigate();

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };


  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(Math.floor((events.length - 1) / eventsPerPage), prev + 1));
  };

  const events = [
    {
      title: "Gnaoua World Music Festival",
      date: "June 21-23, 2024",
      time: "7:00 PM - 11:00 PM",
      location: "Essaouira",
      description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
      image: gnaoua,
      price: "From $45",
      category: "Featured",
      categoryColor: "from-amber-500 to-orange-500"
    },
    {
      title: "Timitar Festival",
      date: "July 15-20, 2024", 
      time: "6:00 PM - 12:00 AM",
      location: "Agadir",
      description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
      image: timitar,
      price: "From $65",
      category: "Festival",
      categoryColor: "from-purple-500 to-pink-500"
    },
    {
      title: "Mawazine Festival",
      date: "May 24-June 1, 2024",
      time: "8:00 PM - 2:00 AM",
      location: "Rabat",
      description: "One of the world's largest music festivals featuring international and Moroccan artists across multiple genres.",
      image: gnaoua,
      price: "From $35",
      category: "Featured",
      categoryColor: "from-amber-500 to-orange-500"
    },
    {
      title: "Rose Festival",
      date: "May 10-12, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Kelaat M'Gouna",
      description: "Annual celebration of the rose harvest in the Valley of Roses with traditional music, dances, and rose picking.",
      image: timitar,
      price: "From $25",
      category: "Cultural",
      categoryColor: "from-rose-400 to-pink-400"
    },
    {
      title: "Fez Festival of World Sacred Music",
      date: "September 14-22, 2024",
      time: "7:30 PM - 11:30 PM",
      location: "Fez",
      description: "Spiritual and sacred music from around the world performed in the mystical setting of ancient Fez.",
      image: gnaoua,
      price: "From $55",
      category: "Festival",
      categoryColor: "from-purple-500 to-pink-500"
    },
    {
      title: "Marrakech International Film Festival",
      date: "November 29 - December 7, 2024",
      time: "6:00 PM - 12:00 AM",
      location: "Marrakech",
      description: "Prestigious film festival showcasing international cinema in the magical city of Marrakech.",
      image: timitar,
      price: "From $75",
      category: "Film",
      categoryColor: "from-blue-500 to-cyan-500"
    },
    {
      title: "Tan-Tan Moussem",
      date: "August 15-18, 2024",
      time: "10:00 AM - 11:00 PM",
      location: "Tan-Tan",
      description: "UNESCO-recognized cultural gathering celebrating nomadic heritage with camel races and traditional performances.",
      image: gnaoua,
      price: "From $40",
      category: "Cultural",
      categoryColor: "from-rose-400 to-pink-400"
    },
    {
      title: "Chefchaouen Cultural Days",
      date: "April 20-25, 2024",
      time: "2:00 PM - 10:00 PM",
      location: "Chefchaouen",
      description: "Cultural festival in the blue city featuring local artisans, traditional crafts, and mountain folklore.",
      image: timitar,
      price: "From $30",
      category: "Cultural",
      categoryColor: "from-rose-400 to-pink-400"
    },
  ];

  return (
    <section id="events" className="py-20 scroll-mt-32" style={{ background: '#FAFAFB' }}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins text-4xl md:text-[42px] font-bold mb-4" style={{ color: '#2C2C2C', letterSpacing: '0.5px' }}>
            Events & Activities <span className="bg-gradient-to-r from-[#D1A954] to-[#F3B33A] bg-clip-text text-transparent">Calendar</span>
          </h2>
          <p className="font-sora text-lg" style={{ color: '#707070', letterSpacing: '0.5px' }}>
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Calendar Section - Left Side */}
          <div className="lg:col-span-2 animate-fade-in">
            <Card className="border-none rounded-2xl overflow-hidden sticky top-6" style={{ 
              backgroundColor: '#FFFFFF', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
            }}>
              {/* Pill-style Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-full" style={{ background: '#F3F5F7' }}>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#1C2140] to-[#2A3558]">
                    <CalendarIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-poppins font-semibold text-base" style={{ color: '#2C2C2C' }}>
                    Event Calendar
                  </span>
                </div>
              </div>
              
              <CardContent className="px-6 pb-6">
                <div className="calendar-container mb-6">
                  <CalendarComponent
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="modern-calendar w-full border-none shadow-none rounded-lg"
                  />
                </div>
                
                {/* Selected Date Display */}
                <div className="p-4 rounded-xl mb-6" style={{ 
                  background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F5F7 100%)',
                  border: '1px solid #E0E0E0'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#D1A954] to-[#F3B33A]"></span>
                    <span className="font-sora font-medium text-sm" style={{ color: '#2C2C2C' }}>Selected Date</span>
                  </div>
                  <div className="font-sora text-sm font-medium" style={{ color: '#707070' }}>
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                {/* Stats as Mini Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ 
                    background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), inset 0 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5" style={{ color: '#D1A954' }} />
                    </div>
                    <div className="text-3xl font-bold font-poppins" style={{ color: '#1C2140' }}>{events.length}</div>
                    <div className="text-xs font-sora mt-1" style={{ color: '#707070' }}>Total Events</div>
                  </div>
                  <div className="text-center p-4 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ 
                    background: 'linear-gradient(135deg, #E8EAFB 0%, #D9DDF8 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), inset 0 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5" style={{ color: '#1C2140' }} />
                    </div>
                    <div className="text-3xl font-bold font-poppins" style={{ color: '#1C2140' }}>8</div>
                    <div className="text-xs font-sora mt-1" style={{ color: '#707070' }}>Cities</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Events Section - Right Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Events Header */}
            <div className="flex items-center justify-between animate-fade-in">
              <h3 className="font-poppins text-2xl font-bold" style={{ color: '#2C2C2C' }}>Upcoming Events</h3>
              <div className="text-sm font-sora px-4 py-2 rounded-full" style={{ 
                color: '#707070',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)'
              }}>
                {events.length} events available
              </div>
            </div>
            
            {/* Events Display */}
            <div className="space-y-6">
              {events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage).map((event, index) => (
                <Card 
                  key={event.title} 
                  className="group border-none rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-scale-in"
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  <div className="flex flex-col">
                    {/* Full-width Cover Image - 4:3 Ratio */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                      
                      {/* Category Tag - Top Right Corner */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${event.categoryColor} shadow-lg backdrop-blur-sm`}>
                          {event.category}
                        </div>
                      </div>
                    </div>
                    
                    {/* Event Details */}
                    <div className="p-6">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#F9FAFB' }}>
                          <CalendarIcon className="w-4 h-4" style={{ color: '#D1A954' }} />
                          <span className="text-sm font-sora font-medium" style={{ color: '#2C2C2C' }}>
                            {event.date}
                          </span>
                        </div>
                      </div>
                      
                      {/* Event Title */}
                      <h3 className="text-xl font-poppins font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-[#1C2140] group-hover:to-[#D1A954] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300" style={{ color: '#2C2C2C' }}>
                        {event.title}
                      </h3>
                      
                      {/* Location & Time */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#F9FAFB' }}>
                          <MapPin className="w-3.5 h-3.5" style={{ color: '#707070' }} />
                          <span className="text-sm font-sora" style={{ color: '#666' }}>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#F9FAFB' }}>
                          <Clock className="w-3.5 h-3.5" style={{ color: '#707070' }} />
                          <span className="text-sm font-sora" style={{ color: '#666' }}>{event.time}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm font-sora leading-relaxed line-clamp-2 mb-5" style={{ color: '#707070' }}>
                        {event.description}
                      </p>
                      
                      {/* Price & Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-3xl font-bold font-poppins bg-gradient-to-r from-[#D1A954] to-[#F3B33A] bg-clip-text text-transparent">
                            {event.price}
                          </span>
                          <span className="text-xs font-sora" style={{ color: '#999' }}>per person</span>
                        </div>
                        <Button 
                          className="px-6 py-3 rounded-lg font-poppins font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                          style={{
                            background: 'linear-gradient(135deg, #1C2140 0%, #D1A954 100%)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(209, 169, 84, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                          }}
                          onClick={() => navigate(`/book?event=${encodeURIComponent(event.title)}`)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Enhanced Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-5 rounded-2xl" style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-sora font-medium border-none transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                style={{
                  background: currentPage === 0 ? '#F3F5F7' : 'linear-gradient(135deg, #1C2140 0%, #2A3558 100%)',
                  color: currentPage === 0 ? '#999' : '#FFFFFF'
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-sora px-4 py-2 rounded-full" style={{
                  color: '#2C2C2C',
                  background: '#F9FAFB'
                }}>
                  {currentPage * eventsPerPage + 1}-{Math.min((currentPage + 1) * eventsPerPage, events.length)} of {events.length}
                </span>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/events')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-sora font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#D1A954] hover:to-[#F3B33A] hover:text-white"
                  style={{ color: '#D1A954' }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  View All Events
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= Math.floor((events.length - 1) / eventsPerPage)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-sora font-medium border-none transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                style={{
                  background: currentPage >= Math.floor((events.length - 1) / eventsPerPage) ? '#F3F5F7' : 'linear-gradient(135deg, #1C2140 0%, #2A3558 100%)',
                  color: currentPage >= Math.floor((events.length - 1) / eventsPerPage) ? '#999' : '#FFFFFF'
                }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;