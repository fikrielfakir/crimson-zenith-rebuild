import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";

const FALLBACK_MEMBERS = [
  {
    id: "fallback-1",
    name: "Youssef El Mansouri",
    role: "Founder & CEO",
    location: "Marrakech, Morocco",
    bio: "Adventure enthusiast with 15+ years experience in sustainable tourism and community development across Morocco.",
    avatar: "👨🏽‍💼",
    email: "youssef@thejourney.ma",
    linkedin: "youssef-elmansouri"
  },
  {
    id: "fallback-2",
    name: "Aicha Benali",
    role: "Cultural Experience Director",
    location: "Fez, Morocco",
    bio: "Cultural anthropologist passionate about preserving Moroccan heritage and connecting travelers with authentic experiences.",
    avatar: "👩🏽‍🏫",
    email: "aicha@thejourney.ma",
    linkedin: "aicha-benali"
  },
  {
    id: "fallback-3",
    name: "Omar Zidane",
    role: "Adventure Operations Manager",
    location: "Imlil, Morocco",
    bio: "Mountain guide and safety expert specializing in Atlas Mountains trekking and desert expeditions.",
    avatar: "👨🏽‍🚀",
    email: "omar@thejourney.ma",
    linkedin: "omar-zidane"
  },
  {
    id: "fallback-4",
    name: "Fatima Alaoui",
    role: "Community Relations Coordinator",
    location: "Chefchaouen, Morocco",
    bio: "Local community advocate focused on sustainable tourism partnerships and cultural preservation initiatives.",
    avatar: "👩🏽‍💼",
    email: "fatima@thejourney.ma",
    linkedin: "fatima-alaoui"
  },
  {
    id: "fallback-5",
    name: "Rachid Benjelloun",
    role: "Safety & Logistics Specialist",
    location: "Casablanca, Morocco",
    bio: "Former emergency response coordinator ensuring the highest safety standards for all adventures and expeditions.",
    avatar: "👨🏽‍⚕️",
    email: "rachid@thejourney.ma",
    linkedin: "rachid-benjelloun"
  },
  {
    id: "fallback-6",
    name: "Laila Hadri",
    role: "Photography & Content Creator",
    location: "Essaouira, Morocco",
    bio: "Visual storyteller capturing the beauty of Morocco and inspiring conscious travel through compelling content.",
    avatar: "👩🏽‍🎨",
    email: "laila@thejourney.ma",
    linkedin: "laila-hadri"
  }
];

const OurTeam = () => {
  const tr = useCmsTranslations('team_member');

  const { data: apiMembers } = useQuery<any[]>({
    queryKey: ["cms-team-members"],
    queryFn: async () => {
      const res = await fetch("/api/cms/team-members", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch team members");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const teamMembers = (apiMembers && apiMembers.length > 0)
    ? apiMembers
        .filter((m: any) => m.isActive !== false)
        .sort((a: any, b: any) => (a.ordering ?? 0) - (b.ordering ?? 0))
        .map((m: any) => ({
          id: String(m.id),
          name: tr(String(m.id), 'name', m.name),
          role: tr(String(m.id), 'role', m.role),
          bio: tr(String(m.id), 'bio', m.bio ?? ''),
          location: m.location ?? '',
          avatar: m.profileImage ?? "👤",
          email: m.email ?? '',
          linkedin: m.socialLinks?.linkedin ?? '',
        }))
    : FALLBACK_MEMBERS;

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
              key={member.id ?? member.name}
              className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center text-4xl overflow-hidden">
                  {member.avatar.startsWith('http') || member.avatar.startsWith('/') ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.avatar
                  )}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>

                <p className="text-primary font-medium mb-2">
                  {member.role}
                </p>

                {member.location && (
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {member.bio}
                </p>

                <div className="flex items-center justify-center gap-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      title={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      title={`LinkedIn profile of ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
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
