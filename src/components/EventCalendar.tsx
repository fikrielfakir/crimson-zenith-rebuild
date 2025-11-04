import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";

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
    },
    {
      title: "Timitar Festival",
      date: "July 15-20, 2024", 
      time: "6:00 PM - 12:00 AM",
      location: "Agadir",
      description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
      image: timitar,
      price: "From $65",
    },
    {
      title: "Mawazine Festival",
      date: "May 24-June 1, 2024",
      time: "8:00 PM - 2:00 AM",
      location: "Rabat",
      description: "One of the world's largest music festivals featuring international and Moroccan artists across multiple genres.",
      image: gnaoua,
      price: "From $35",
    },
    {
      title: "Rose Festival",
      date: "May 10-12, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Kelaat M'Gouna",
      description: "Annual celebration of the rose harvest in the Valley of Roses with traditional music, dances, and rose picking.",
      image: timitar,
      price: "From $25",
    },
    {
      title: "Fez Festival of World Sacred Music",
      date: "September 14-22, 2024",
      time: "7:30 PM - 11:30 PM",
      location: "Fez",
      description: "Spiritual and sacred music from around the world performed in the mystical setting of ancient Fez.",
      image: gnaoua,
      price: "From $55",
    },
    {
      title: "Marrakech International Film Festival",
      date: "November 29 - December 7, 2024",
      time: "6:00 PM - 12:00 AM",
      location: "Marrakech",
      description: "Prestigious film festival showcasing international cinema in the magical city of Marrakech.",
      image: timitar,
      price: "From $75",
    },
    {
      title: "Tan-Tan Moussem",
      date: "August 15-18, 2024",
      time: "10:00 AM - 11:00 PM",
      location: "Tan-Tan",
      description: "UNESCO-recognized cultural gathering celebrating nomadic heritage with camel races and traditional performances.",
      image: gnaoua,
      price: "From $40",
    },
    {
      title: "Chefchaouen Cultural Days",
      date: "April 20-25, 2024",
      time: "2:00 PM - 10:00 PM",
      location: "Chefchaouen",
      description: "Cultural festival in the blue city featuring local artisans, traditional crafts, and mountain folklore.",
      image: timitar,
      price: "From $30",
    },
  ];

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-background via-background to-muted/20 scroll-mt-32">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Events Calendar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Calendar Section - Left Side */}
          <div className="lg:col-span-2 animate-fade-in">
            <Card className="border-border/20 shadow-xl bg-background/80 backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  Event Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="calendar-container mb-6">
                  <CalendarComponent
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="w-full border-none shadow-none rounded-lg"
                  />
                </div>
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                  <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>
                    <span>Selected Date</span>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{events.length}</div>
                    <div className="text-xs text-muted-foreground">Total Events</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-xs text-muted-foreground">Cities</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Events Section - Right Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Events Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Upcoming Events</h3>
              <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                {events.length} events available
              </div>
            </div>
            
            {/* Events Display */}
            <div className="space-y-6">
              {events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage).map((event, index) => (
                <Card 
                  key={event.title} 
                  className="group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 animate-scale-in border-border/20 overflow-hidden bg-background/90 backdrop-blur-sm hover:bg-background"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-40 flex-shrink-0 relative overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 md:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-primary">
                        Featured
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {event.price}
                          </span>
                          <span className="text-xs text-muted-foreground">per person</span>
                        </div>
                        <Button 
                          className="px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-muted/20 rounded-xl">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full">
                  {currentPage * eventsPerPage + 1}-{Math.min((currentPage + 1) * eventsPerPage, events.length)} of {events.length}
                </span>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/discover')}
                  className="flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
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
                className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
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