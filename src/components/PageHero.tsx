import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import { useTranslation } from "react-i18next";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";

export interface PageHeroBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeroSettings {
  title?: string | null;
  subtitle?: string | null;
  backgroundType?: "image" | "video" | "gradient" | null;
  backgroundImageUrl?: string | null;
  backgroundVideoUrl?: string | null;
  overlayColor?: string | null;
  overlayOpacity?: number | null;
  isActive?: boolean | null;
}

interface PageHeroProps {
  pageKey: string;
  scrollY: number;
  breadcrumbs: PageHeroBreadcrumb[];
  defaultTitle: string;
  defaultSubtitle: string;
  defaultImage?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  pageKey,
  scrollY,
  breadcrumbs,
  defaultTitle,
  defaultSubtitle,
  defaultImage,
  children,
}: PageHeroProps) {
  const tr = useCmsTranslations('page_hero');
  const { data: settings } = useQuery<PageHeroSettings | null>({
    queryKey: ["page-hero", pageKey],
    queryFn: async () => {
      try {
        const res = await apiFetch(`/api/cms/page-hero/${pageKey}`);
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const backgroundType = settings?.backgroundType || "image";
  const backgroundImageUrl = settings?.backgroundImageUrl || defaultImage || "";
  const backgroundVideoUrl = settings?.backgroundVideoUrl || "";
  const overlayOpacity = ((settings?.overlayOpacity ?? 50) / 100).toFixed(2);
  const overlayColor = settings?.overlayColor || "#000000";
  const title = tr(pageKey, 'title', settings?.title || defaultTitle);
  const subtitle = tr(`${pageKey}_subtitle`, 'subtitle', settings?.subtitle || defaultSubtitle);
  const isVideo = backgroundType === "video" && backgroundVideoUrl;

  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: "15rem", paddingBottom: "3.5rem" }}
    >
      {isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{ filter: "brightness(0.65) saturate(1.1)" }}
        >
          <source src={backgroundVideoUrl} type="video/mp4" />
          <source src={backgroundVideoUrl} type="video/webm" />
        </video>
      ) : backgroundType === "gradient" ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary,220 60% 35%)) 100%)",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: backgroundImageUrl
              ? `url('${backgroundImageUrl}')`
              : undefined,
            transform: `translateY(${scrollY * 0.3}px)`,
            filter: "brightness(0.6) contrast(1.1) saturate(1.2)",
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: `rgba(${hexToRgb(overlayColor)},${overlayOpacity})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />

      <div className="relative container mx-auto px-6">
        <nav className="mb-8">
          <ol className="flex items-center flex-wrap gap-y-1 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
              >
                <Home className="w-4 h-4 mr-1.5" />
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-white/90 hover:text-white transition-colors font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string): string {
  if (hex.startsWith("rgba") || hex.startsWith("rgb")) {
    const m = hex.match(/[\d.]+/g);
    if (m && m.length >= 3) return `${m[0]},${m[1]},${m[2]}`;
  }
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
