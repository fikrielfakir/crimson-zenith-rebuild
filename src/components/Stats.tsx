import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Calendar, Heart } from "lucide-react";

const Stats = () => {
  const statistics = [
    {
      icon: Users,
      value: "1,200+",
      label: "Participants",
      description: "Adventure seekers joined our community",
    },
    {
      icon: MapPin,
      value: "500+",
      label: "Trips Planned", 
      description: "Unforgettable journeys across Morocco",
    },
    {
      icon: Calendar,
      value: "50+",
      label: "Cultural Collaborations",
      description: "Partnerships with local artisans",
    },
    {
      icon: Heart,
      value: "10+",
      label: "Community Projects",
      description: "Sustainable impact initiatives",
    },
  ];

  return (
    <section id="stats" className="py-20 bg-primary text-primary-foreground relative overflow-hidden scroll-mt-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            Our Footprint
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto font-body">
            Making a positive impact through sustainable tourism and community engagement
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-white mb-1 font-heading">
                  {stat.label}
                </div>
                <p className="text-sm text-primary-foreground/70 font-body">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;