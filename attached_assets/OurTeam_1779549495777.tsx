import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Linkedin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";

const FALLBACK_MEMBERS = [
  {
    id: -1,
    name: "Youssef El Mansouri",
    role: "Founder & CEO",
    bio: "Adventure enthusiast with 15+ years experience in sustainable tourism and community development across Morocco.",
    email: "youssef@thejourney.ma",
    ordering: 0,
    isActive: true,
  },
  {
    id: -2,
    name: "Aicha Benali",
    role: "Cultural Experience Director",
    bio: "Cultural anthropologist passionate about preserving Moroccan heritage and connecting travelers with authentic experiences.",
    email: "aicha@thejourney.ma",
    ordering: 1,
    isActive: true,
  },
  {
    id: -3,
    name: "Omar Zidane",
    role: "Adventure Operations Manager",
    bio: "Mountain guide and safety expert specializing in Atlas Mountains trekking and desert expeditions.",
    email: "omar@thejourney.ma",
    ordering: 2,
    isActive: true,
  },
];

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  email?: string;
  ordering: number;
  isActive: boolean;
}

const OurTeam = () => {
  const { t } = useTranslation();
  const tr = useCmsTranslations('team_member');

  const { data: dbMembers } = useQuery<TeamMember[]>({
    queryKey: ["cms-team-members"],
    queryFn: async () => {
      const res = await fetch("/api/cms/team-members", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch team members");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const rawMembers: TeamMember[] =
    dbMembers && dbMembers.length > 0
      ? dbMembers
          .filter((m) => m.isActive !== false)
          .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))
      : FALLBACK_MEMBERS;

  const teamMembers = rawMembers.map((m) => ({
    ...m,
    name: tr(String(m.id), 'name', m.name),
    role: tr(String(m.id), 'role', m.role ?? ''),
    bio: tr(String(m.id), 'bio', m.bio ?? ''),
  }));

  return (
    <section id="membership" className="py-20 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("team.title", "Our Team")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("team.subtitle", "Meet the passionate individuals dedicated to creating authentic and transformative experiences across Morocco")}
          </p>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>{t("team.empty", "No team members available")}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={member.id}
                className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>

                  <p className="text-primary font-medium mb-4">
                    {member.role}
                  </p>

                  {member.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {member.bio}
                    </p>
                  )}

                  {member.email && (
                    <div className="flex items-center justify-center gap-4">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        title={`Email ${member.name}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeam;
