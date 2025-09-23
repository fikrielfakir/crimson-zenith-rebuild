import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";
import MoroccoMap from "./MoroccoMap";
import marrakechImg from "@/assets/marrakech-club.jpg";
import fezImg from "@/assets/fez-club.jpg";
import casablancaImg from "@/assets/casablanca-club.jpg";

const ClubsWithMap = () => {
  const clubs = [
    {
      name: "Marrakech Club",
      description: "Explore the vibrant souks and palaces of the Red City",
      image: marrakechImg,
      members: "250+ Members",
      location: "Marrakech, Morocco",
      features: ["Historic Tours", "Local Cuisine", "Artisan Workshops"],
    },
    {
      name: "Fez Club", 
      description: "Discover the ancient medina and cultural heritage",
      image: fezImg,
      members: "180+ Members",
      location: "Fez, Morocco", 
      features: ["Medina Walks", "Traditional Crafts", "Cultural Events"],
    },
    {
      name: "Casablanca Club",
      description: "Experience the modern emerging art scene",
      image: casablancaImg,
      members: "320+ Members",
      location: "Casablanca, Morocco",
      features: ["Art Galleries", "Modern Culture", "Coastal Adventures"],
    },
  ];

  return (
    <section id="clubs" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Clubs
          </h2>
          <p className="text-xl text-muted-foreground">
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="animate-fade-in">
            <Card className="border-border/50 h-[600px]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Morocco Clubs Map
                </CardTitle>
                <p className="text-muted-foreground">
                  Discover our club locations across Morocco
                </p>
              </CardHeader>
              <CardContent className="p-0 h-[500px]">
                <MoroccoMap />
              </CardContent>
            </Card>
          </div>
          
          {/* Clubs Section */}
          <div className="space-y-6">
            {clubs.map((club, index) => (
              <Card 
                key={club.name} 
                className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {club.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {club.members}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {club.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {club.features.map((feature) => (
                        <span 
                          key={feature} 
                          className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Button className="w-full group-hover:shadow-glow transition-all duration-300">
                      Discover
                    </Button>
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

export default ClubsWithMap;