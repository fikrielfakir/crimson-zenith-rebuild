import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import Header from "@/components/Header";
import HeaderSpacer from "@/components/HeaderSpacer";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, MapPin, Target, Heart } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

interface AboutData {
  isActive?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  whoWeAreTitle?: string;
  whoWeAreParagraph2?: string;
  valuesTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  translations?: Record<string, Record<string, string>>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target className="w-8 h-8 text-primary" />,
  users:  <Users  className="w-8 h-8 text-primary" />,
  mapPin: <MapPin className="w-8 h-8 text-primary" />,
  heart:  <Heart  className="w-8 h-8 text-primary" />,
};

const About = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const { data: apiData } = useQuery<AboutData>({
    queryKey: ["cms", "about"],
    queryFn: async () => {
      const res = await apiFetch("/api/cms/about");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Returns translated value → CMS English value → i18n key fallback
  const get = (field: keyof AboutData, i18nKey: string): string => {
    if (lang !== "en" && apiData?.translations?.[lang]?.[field as string]) {
      return apiData.translations[lang][field as string];
    }
    const val = apiData?.[field];
    if (typeof val === "string" && val.trim()) return val;
    return t(i18nKey);
  };

  const heroTitle         = get("title",              "aboutPage.heroTitle");
  const heroSubtitle      = get("subtitle",            "aboutPage.heroSubtitle");
  const whoWeAreTitle     = get("whoWeAreTitle",       "aboutPage.whoWeAreTitle");
  const whoWeAreParagraph1 = get("description",        "aboutPage.whoWeAreParagraph1");
  const whoWeAreParagraph2 = get("whoWeAreParagraph2", "aboutPage.whoWeAreParagraph2");
  const valuesTitle       = get("valuesTitle",         "aboutPage.valuesTitle");
  const ctaTitle          = get("ctaTitle",            "aboutPage.ctaTitle");
  const ctaSubtitle       = get("ctaDescription",      "aboutPage.ctaSubtitle");

  const defaultValues = [
    { icon: "target", title: t("aboutPage.missionTitle"),     desc: t("aboutPage.missionDesc") },
    { icon: "users",  title: t("aboutPage.communityTitle"),   desc: t("aboutPage.communityDesc") },
    { icon: "mapPin", title: t("aboutPage.reachTitle"),       desc: t("aboutPage.reachDesc") },
    { icon: "heart",  title: t("aboutPage.valuesCardTitle"),  desc: t("aboutPage.valuesCardDesc") },
  ];

  const values = (() => {
    // Try translated values first
    if (lang !== "en" && apiData?.translations?.[lang]?.values) {
      try { return JSON.parse(apiData.translations[lang].values); } catch { /* fall through */ }
    }
    return defaultValues;
  })();

  const isAr = lang === "ar";

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      <SEOHead {...routeSEO["/about"]} />
      <Header forceOpaque />
      <HeaderSpacer />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
                {whoWeAreTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {whoWeAreParagraph1}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {whoWeAreParagraph2}
              </p>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {t("aboutPage.exploreClubs")}
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center h-64">
              <div className="text-center text-primary/40">
                <MapPin className="w-16 h-16 mx-auto mb-3" />
                <p className="font-medium text-primary/60">Morocco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold font-heading text-foreground text-center mb-12">
            {valuesTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v: { icon: string; title: string; desc: string }, idx: number) => (
              <div
                key={idx}
                className="bg-background rounded-xl p-6 shadow-sm border border-border/50"
              >
                <div className="mb-4">
                  {ICON_MAP[v.icon] ?? <Target className="w-8 h-8 text-primary" />}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
            {ctaTitle}
          </h2>
          <p className="text-muted-foreground mb-8">
            {ctaSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/join"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t("aboutPage.joinUs")}
            </Link>
            <Link
              to="/contact"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
            >
              {t("aboutPage.contactUs")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
