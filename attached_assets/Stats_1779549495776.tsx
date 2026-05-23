import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Calendar, Heart, Star, Award, Globe, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  MapPin,
  Calendar,
  Heart,
  Star,
  Award,
  Globe,
  TrendingUp,
};

const FALLBACK_STATISTICS = [
  { icon: "Users",       value: "1,200+", labelKey: "stats.participants",   descKey: "stats.participantsDesc" },
  { icon: "MapPin",      value: "500+",   labelKey: "stats.tripsPlanned",   descKey: "stats.tripsPlannedDesc" },
  { icon: "Calendar",    value: "50+",    labelKey: "stats.collaborations", descKey: "stats.collaborationsDesc" },
  { icon: "Heart",       value: "10+",    labelKey: "stats.projects",       descKey: "stats.projectsDesc" },
];

const Stats = () => {
  const { t } = useTranslation();
  const tr = useCmsTranslations('site_stat');

  const { data: dbStats } = useQuery<any[]>({
    queryKey: ["cms-stats"],
    queryFn: async () => {
      const res = await fetch("/api/cms/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const statistics = (dbStats && dbStats.length > 0)
    ? dbStats
        .filter((s: any) => s.isActive !== false)
        .sort((a: any, b: any) => (a.ordering ?? 0) - (b.ordering ?? 0))
        .map((s: any) => ({
          icon: s.icon ?? "Star",
          value: tr(String(s.id), 'value', s.suffix ? `${s.value}${s.suffix}` : s.value),
          label: tr(String(s.id), 'label', s.label),
          labelKey: null,
          descKey: null,
        }))
    : FALLBACK_STATISTICS.map((s) => ({ ...s, label: null }));

  return (
    <section id="stats" className="py-20 bg-primary text-primary-foreground relative overflow-hidden scroll-mt-32">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            {t("stats.title")}
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto font-body">
            {t("stats.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {statistics.map((stat, index) => {
            const IconComponent = ICON_MAP[stat.icon] ?? Star;
            return (
              <Card
                key={index}
                className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 font-heading">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-white mb-1 font-heading">
                    {stat.label ?? (stat.labelKey ? t(stat.labelKey) : "")}
                  </div>
                  <div className="text-xs md:text-sm text-primary-foreground/70 font-body">
                    {stat.descKey ? t(stat.descKey) : ""}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
