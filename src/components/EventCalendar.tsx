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
    <section id="events" className="py-20 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Events Calendar
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover upcoming adventures and cultural experiences
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Calendar Section */}
          <div className="animate-fade-in">
            <Card className="border-border/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Event Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="calendar-container mb-4">
                  <CalendarComponent
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="w-full border-none shadow-none"
                  />
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border">
                  <p className="text-sm font-medium text-foreground mb-1">Selected Date:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Events Section */}
          <div className="space-y-4">
            {/* Events Display */}
            <div className="space-y-4">
              {events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage).map((event, index) => (
              <Card 
                key={event.title} 
                className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {event.price}
                      </span>
                      <Button 
                        size="sm" 
                        className="px-4 py-1 text-sm"
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
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentPage * eventsPerPage + 1}-{Math.min((currentPage + 1) * eventsPerPage, events.length)} of {events.length} events
                  </span>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/events')}
                    className="flex items-center gap-2 text-primary hover:text-primary"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    More Events
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= Math.floor((events.length - 1) / eventsPerPage)}
                  className="flex items-center gap-2"
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