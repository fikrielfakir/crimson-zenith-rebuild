import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";

const FALLBACK_ITEMS = [
  {
    title: null,
    titleKey: "about.tourism",
    description: null,
    descKey: "about.tourismDesc",
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1200",
    showBirds: true,
  },
  {
    title: null,
    titleKey: "about.culture",
    description: null,
    descKey: "about.cultureDesc",
    imageUrl: "/images/culture.png",
    showBirds: false,
  },
  {
    title: null,
    titleKey: "about.entertainment",
    description: null,
    descKey: "about.entertainmentDesc",
    imageUrl: "/images/entertainment.png",
    showBirds: false,
  },
];

interface FocusItem {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  is_active?: boolean;
  isActive?: boolean;
  ordering: number;
}

interface SectionSettings {
  title: string;
  subtitle: string;
  isActive: boolean;
}

const About = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const isAr = lang === 'ar';
  const tr = useCmsTranslations('focus_item');
  const trSection = useCmsTranslations('focus_section');

  const { data: rawItems } = useQuery({
    queryKey: ["cms", "focus-items"],
    queryFn: async () => {
      const res = await fetch("/api/cms/focus-items");
      if (!res.ok) throw new Error("Failed to fetch focus items");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: sectionData } = useQuery<SectionSettings>({
    queryKey: ["cms", "focus-section"],
    queryFn: async () => {
      const res = await fetch("/api/cms/focus-section");
      if (!res.ok) throw new Error("Failed to fetch section settings");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const rawArray: FocusItem[] = Array.isArray(rawItems)
    ? rawItems
    : (rawItems?.items ?? []);

  const apiItems = rawArray.filter((i) => i.is_active !== false && i.isActive !== false);

  const focuses = apiItems.length > 0
    ? apiItems.map((item, idx) => ({
        title: tr(String(item.id), 'title', item.title),
        titleKey: null,
        description: tr(String(item.id), 'description', item.description),
        descKey: null,
        imageUrl: item.imageUrl || item.image_url || FALLBACK_ITEMS[idx % FALLBACK_ITEMS.length]?.imageUrl || "",
        showBirds: idx === 0,
      }))
    : FALLBACK_ITEMS;

  const sectionTitle = trSection(
    'default', 'title',
    isAr ? t("about.ourFocus") : (sectionData?.title || t("about.ourFocus"))
  );
  const sectionSubtitle = trSection(
    'default', 'subtitle',
    isAr
      ? `${t("about.tourism")}, ${t("about.culture")}, ${t("about.entertainment")}`
      : (sectionData?.subtitle || `${t("about.tourism")}, ${t("about.culture")}, ${t("about.entertainment")}`)
  );

  const fontFamily = isAr ? "Cairo, Tajawal, sans-serif" : "Poppins, sans-serif";

  return (
    <section id="discover" className="relative w-full scroll-mt-32">
      <div className="relative w-full flex flex-col sm:flex-row overflow-hidden">
        {focuses.map((focus, index) => (
          <div
            key={focus.titleKey ?? String(index)}
            className="relative flex-1 group cursor-pointer h-[220px] sm:h-[400px] md:h-[600px]"
            style={{
              borderRight: index < focuses.length - 1 ? "3px solid rgba(255,255,255,0.9)" : "none",
              borderBottom: "none",
              borderRadius: index === 0 ? "8px 0 0 8px" : index === focuses.length - 1 ? "0 8px 8px 0" : "0",
              overflow: "hidden",
            }}
          >
            <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${focus.imageUrl})` }} />
              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: "linear-gradient(to top, rgba(90,70,30,0.8), rgba(40,30,20,0.3))" }}
              />
            </div>

            {focus.showBirds && (
              <div className="absolute top-8 left-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 10C7 8 10 5 13 5C16 5 18 7 20 10M25 5C27 3 30 0 33 0C36 0 38 2 40 5M45 15C47 13 50 10 53 10C56 10 58 12 60 15"
                    stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"
                  />
                </svg>
              </div>
            )}

            {/* Card title — RTL-safe: spans full width, text aligns to inline-start */}
            <div
              dir={isAr ? "rtl" : "ltr"}
              className="absolute bottom-6 px-8"
              style={{ left: 0, right: 0 }}
            >
              <h3
                className="font-bold transition-all duration-500"
                style={{ fontFamily, fontSize: "26px", color: "#FFFFFF", textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
              >
                {focus.title ?? (focus.titleKey ? t(focus.titleKey) : '')}
              </h3>
              <p
                className="max-w-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden transform translate-y-4 group-hover:translate-y-0 mt-2"
                style={{ fontFamily, fontSize: "16px", color: "#E8D8AA", lineHeight: "22px" }}
              >
                {focus.description ?? (focus.descKey ? t(focus.descKey) : '')}
              </p>
            </div>
          </div>
        ))}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(#112250 0%, rgba(10,26,61,0.4) 40%, transparent 60%)", zIndex: 1 }}
        />

        {/* Section title — RTL-safe flex centering with dir attribute */}
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-start text-center pt-6 sm:pt-10 md:pt-12"
        >
          <h2
            className="font-bold mb-2 sm:mb-3 w-full"
            style={{
              fontFamily,
              fontSize: "clamp(24px,6vw,48px)",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0px 2px 8px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            {sectionTitle}
          </h2>
          <p
            style={{
              fontFamily,
              fontSize: "clamp(13px,3vw,22px)",
              fontWeight: 400,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
              maxWidth: "85%",
              textAlign: "center",
            }}
          >
            {sectionSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
