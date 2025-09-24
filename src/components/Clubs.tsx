import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Camera } from "lucide-react";

const Clubs = () => {
  const clubs = [
    {
      name: "Marrakech Club",
      description: "Explore the vibrant souks and palaces of the Red City",
      image: "🏛️",
      members: "250+ Members",
      location: "Marrakech, Morocco",
      features: ["Historic Tours", "Local Cuisine", "Artisan Workshops"],
    },
    {
      name: "Fez Club", 
      description: "Discover the ancient medina and cultural heritage",
      image: "🕌",
      members: "180+ Members",
      location: "Fez, Morocco", 
      features: ["Medina Walks", "Traditional Crafts", "Cultural Events"],
    },
    {
      name: "Casablanca Club",
      description: "Experience the modern emerging art scene",
      image: "🌊",
      members: "320+ Members",
      location: "Casablanca, Morocco",
      features: ["Art Galleries", "Modern Culture", "Coastal Adventures"],
    },
    {
      name: "Rabat Club",
      description: "Explore Morocco's political capital and historical sites",
      image: "🏰",
      members: "195+ Members",
      location: "Rabat, Morocco",
      features: ["Government Tours", "Royal Palaces", "Archaeological Sites"],
    },
    {
      name: "Chefchaouen Club",
      description: "Wander through the enchanting blue pearl of Morocco",
      image: "🔵",
      members: "145+ Members",
      location: "Chefchaouen, Morocco",
      features: ["Blue City Tours", "Mountain Hiking", "Photography Walks"],
    },
    {
      name: "Tangier Club",
      description: "Gateway to Africa with rich multicultural heritage",
      image: "⛵",
      members: "210+ Members",
      location: "Tangier, Morocco",
      features: ["Port Tours", "International Culture", "Strait Views"],
    },
    {
      name: "Meknes Club",
      description: "Imperial city with magnificent architecture and history",
      image: "👑",
      members: "165+ Members",
      location: "Meknes, Morocco",
      features: ["Imperial Tours", "Ancient Ruins", "Wine Tasting"],
    },
    {
      name: "Essaouira Club",
      description: "Coastal charm with Portuguese influence and ocean breeze",
      image: "🌊",
      members: "175+ Members",
      location: "Essaouira, Morocco",
      features: ["Coastal Activities", "Wind Sports", "Fishing Tours"],
    },
    {
      name: "Ouarzazate Club",
      description: "Gateway to the Sahara Desert and film studios",
      image: "🏜️",
      members: "130+ Members",
      location: "Ouarzazate, Morocco",
      features: ["Desert Tours", "Film Studios", "Kasbah Visits"],
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club, index) => (
            <Card 
              key={club.name} 
              className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 bg-gradient-hero flex items-center justify-center text-6xl">
                {club.image}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {club.name}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {club.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {club.members}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {club.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clubs;