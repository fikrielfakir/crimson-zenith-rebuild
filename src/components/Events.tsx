import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslatedList } from "@/hooks/useContentTranslation";

const FALLBACK_EVENTS = [
  {
    id: "fallback-1",
    title: "Gnaoua World Music Festival",
    date: "June 21-23, 2024",
    location: "Essaouira",
    description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
    category: "Cultural Event",
  },
  {
    id: "fallback-2",
    title: "Timitar Festival",
    date: "July 15-20, 2024",
    location: "Agadir",
    description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
    category: "Music Festival",
  },
  {
    id: "fallback-3",
    title: "Desert Adventure Trek",
    date: "September 5-12, 2024",
    location: "Sahara Desert",
    description: "An immersive journey through the golden dunes, including camel trekking and traditional Berber experiences.",
    category: "Adventure",
  },
];

const Events = () => {
  const { data: rawEvents } = useQuery<any[]>({
    queryKey: ["cms-booking-events"],
    queryFn: async () => {
      const res = await fetch("/api/booking-events", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const source = (rawEvents && rawEvents.length > 0)
    ? rawEvents.filter((e: any) => e.isActive !== false).slice(0, 3)
    : FALLBACK_EVENTS;

  const events = useTranslatedList(source, 'event', ['title', 'description', 'location']);

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
          {events.map((event: any, index: number) => (
            <Card
              key={event.id ?? event.title}
              className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  {event.startDate ?? event.date}
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
                {(event.category) && (
                  <div className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full mb-4">
                    {event.category}
                  </div>
                )}
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
