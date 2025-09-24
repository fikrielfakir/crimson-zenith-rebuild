import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Linkedin } from "lucide-react";

const OurTeam = () => {
  const teamMembers = [
    {
      name: "Youssef El Mansouri",
      role: "Founder & CEO",
      location: "Marrakech, Morocco",
      bio: "Adventure enthusiast with 15+ years experience in sustainable tourism and community development across Morocco.",
      avatar: "👨🏽‍💼",
      email: "youssef@thejourney.ma",
      linkedin: "youssef-elmansouri"
    },
    {
      name: "Aicha Benali",
      role: "Cultural Experience Director", 
      location: "Fez, Morocco",
      bio: "Cultural anthropologist passionate about preserving Moroccan heritage and connecting travelers with authentic experiences.",
      avatar: "👩🏽‍🏫",
      email: "aicha@thejourney.ma",
      linkedin: "aicha-benali"
    },
    {
      name: "Omar Zidane",
      role: "Adventure Operations Manager",
      location: "Imlil, Morocco",
      bio: "Mountain guide and safety expert specializing in Atlas Mountains trekking and desert expeditions.",
      avatar: "👨🏽‍🚀",
      email: "omar@thejourney.ma", 
      linkedin: "omar-zidane"
    },
    {
      name: "Fatima Alaoui",
      role: "Community Relations Coordinator",
      location: "Chefchaouen, Morocco",
      bio: "Local community advocate focused on sustainable tourism partnerships and cultural preservation initiatives.",
      avatar: "👩🏽‍💼",
      email: "fatima@thejourney.ma",
      linkedin: "fatima-alaoui"
    },
    {
      name: "Rachid Benjelloun",
      role: "Safety & Logistics Specialist",
      location: "Casablanca, Morocco", 
      bio: "Former emergency response coordinator ensuring the highest safety standards for all adventures and expeditions.",
      avatar: "👨🏽‍⚕️",
      email: "rachid@thejourney.ma",
      linkedin: "rachid-benjelloun"
    },
    {
      name: "Laila Hadri",
      role: "Photography & Content Creator",
      location: "Essaouira, Morocco",
      bio: "Visual storyteller capturing the beauty of Morocco and inspiring conscious travel through compelling content.",
      avatar: "👩🏽‍🎨",
      email: "laila@thejourney.ma",
      linkedin: "laila-hadri"
    }
  ];

  return (
    <section id="membership" className="py-20 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the passionate individuals dedicated to creating authentic and transformative experiences across Morocco
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.name} 
              className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center text-4xl">
                  {member.avatar}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                
                <p className="text-primary font-medium mb-2">
                  {member.role}
                </p>
                
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{member.location}</span>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {member.bio}
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    title={`Email ${member.name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a 
                    href={`https://linkedin.com/in/${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    title={`LinkedIn profile of ${member.name}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;