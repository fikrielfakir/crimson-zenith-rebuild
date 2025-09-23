import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import CalendarComponent from "react-calendar";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
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
  ];

  return (
    <section id="events" className="py-20 bg-background">
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
            {events.map((event, index) => (
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
                      <Button size="sm" className="px-4 py-1 text-sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;