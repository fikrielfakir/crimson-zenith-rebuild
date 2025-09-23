import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Users, Heart } from "lucide-react";

const About = () => {
  const focuses = [
    {
      icon: TreePine,
      title: "Sustainable Tourism",
      description: "We prioritize eco-friendly travel experiences, supporting local communities and preserving Morocco's natural beauty for future generations.",
    },
    {
      icon: Heart,
      title: "Cultural Appreciation", 
      description: "Immerse yourself in the vibrant traditions, art, and history of Morocco through our guided experiences with local cultural ambassadors.",
    },
    {
      icon: Users,
      title: "Community Entertainment",
      description: "Enjoy a diverse range of events, from music festivals to cultural performances, fostering connections within our community.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Focus
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sustainable Tourism, Culture, and Entertainment
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {focuses.map((focus, index) => (
            <Card 
              key={focus.title} 
              className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <focus.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {focus.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {focus.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;