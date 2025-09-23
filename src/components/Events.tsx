import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

const Events = () => {
  const events = [
    {
      title: "Gnaoua World Music Festival",
      date: "June 21-23, 2024",
      location: "Essaouira",
      description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
      category: "Cultural Event",
    },
    {
      title: "Timitar Festival", 
      date: "July 15-20, 2024",
      location: "Agadir",
      description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
      category: "Music Festival",
    },
    {
      title: "Desert Adventure Trek",
      date: "September 5-12, 2024", 
      location: "Sahara Desert",
      description: "An immersive journey through the golden dunes, including camel trekking and traditional Berber experiences.",
      category: "Adventure",
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card 
              key={event.title} 
              className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full mb-4">
                  {event.category}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {event.description}
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;