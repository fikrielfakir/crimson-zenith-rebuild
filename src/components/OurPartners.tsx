import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useTranslation } from "react-i18next";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";

interface Partner {
  id: number;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  ordering: number;
  is_active: boolean;
}

interface PartnerSettings {
  title: string;
  subtitle: string;
  is_active: boolean;
}

const moroccanPattern = `
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="moroccan-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <g opacity="0.15">
          <path d="M50,25 L55,40 L70,40 L58,50 L62,65 L50,55 L38,65 L42,50 L30,40 L45,40 Z"
                fill="#C9A35B" stroke="#C9A35B" stroke-width="0.5"/>
          <circle cx="10" cy="10" r="3" fill="#C9A35B" opacity="0.6"/>
          <circle cx="90" cy="10" r="3" fill="#C9A35B" opacity="0.6"/>
          <circle cx="10" cy="90" r="3" fill="#C9A35B" opacity="0.6"/>
          <circle cx="90" cy="90" r="3" fill="#C9A35B" opacity="0.6"/>
          <path d="M10,10 L50,25 L90,10" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
          <path d="M10,90 L50,75 L90,90" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
          <path d="M10,10 L25,50 L10,90" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
          <path d="M90,10 L75,50 L90,90" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
          <path d="M25,25 L27,27 L25,29 L23,27 Z" fill="#D4AF37" opacity="0.7"/>
          <path d="M75,25 L77,27 L75,29 L73,27 Z" fill="#D4AF37" opacity="0.7"/>
          <path d="M25,75 L27,77 L25,79 L23,77 Z" fill="#D4AF37" opacity="0.7"/>
          <path d="M75,75 L77,77 L75,79 L73,77 Z" fill="#D4AF37" opacity="0.7"/>
        </g>
      </pattern>
    </defs>
  </svg>
`;

const makeSvgPlaceholder = (name: string) => {
  const label = encodeURIComponent(name);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='80'%3E%3Crect width='180' height='80' rx='8' fill='%23f0f4ff'/%3E%3Ctext x='90' y='46' font-family='sans-serif' font-size='13' font-weight='600' fill='%23112250' text-anchor='middle' dominant-baseline='middle'%3E${label}%3C/text%3E%3C/svg%3E`;
};

const OurPartners = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const tr = useCmsTranslations('partner_settings');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [settings, setSettings] = useState<PartnerSettings>({
    title: 'Our Partners & Supporters',
    subtitle: 'Associates & Clients',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true, containScroll: 'trimSnaps' },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false })]
  );

  const onMouseEnter = useCallback(() => {
    emblaApi?.plugins()?.autoScroll?.stop();
  }, [emblaApi]);

  const onMouseLeave = useCallback(() => {
    emblaApi?.plugins()?.autoScroll?.play();
  }, [emblaApi]);

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/partners').then(r => r.ok ? r.json() : []),
      fetch('/api/cms/partner-settings').then(r => r.ok ? r.json() : null),
    ])
      .then(([partnersData, settingsData]) => {
        setPartners(Array.isArray(partnersData) ? partnersData : []);
        if (settingsData) {
          setSettings({
            title: settingsData.title ?? 'Our Partners & Supporters',
            subtitle: settingsData.subtitle ?? 'Associates & Clients',
            is_active: settingsData.is_active ?? true,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!settings.is_active) return null;
  if (partners.length === 0) return null;

  // Need enough items to fill the carousel without obvious duplicates.
  // Only loop if there are at least 2 unique partners; otherwise show as-is.
  let loopedPartners = partners;
  if (partners.length >= 2 && partners.length < 6) {
    loopedPartners = [...partners, ...partners, ...partners];
  } else if (partners.length === 1) {
    loopedPartners = partners; // single partner — show once, no duplication
  }

  return (
    <section
      id="partners"
      className="relative w-full py-20 scroll-mt-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0b1a40 0%, #112250 40%, #1a3366 75%, #0e2057 100%)" }}
    >
      {/* Moroccan star-tile pattern — full section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(moroccanPattern)}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
          opacity: 0.55,
          zIndex: 0,
        }}
      />

      {/* Radial glow — centre highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,163,91,0.12) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Thin gold top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C9A35B 30%, #D4AF37 50%, #C9A35B 70%, transparent)", zIndex: 2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#C9A35B",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            {tr('subtitle', 'subtitle', lang !== 'en' ? t('partners.subtitle') : settings.subtitle)}
          </p>
          <h2
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "42px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {tr('title', 'title', lang !== 'en' ? t('partners.title') : settings.title)}
          </h2>
          {/* Gold underline accent */}
          <div className="mx-auto mt-4 h-[2px] w-20 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #C9A35B, transparent)" }} />
        </div>

        {/* Carousel — always LTR so auto-scroll direction is unaffected by RTL */}
        <div
          className="overflow-hidden"
          style={{ minHeight: "200px", padding: "12px 0 24px" }}
          dir="ltr"
          ref={emblaRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="flex gap-6">
            {loopedPartners.map((partner, index) => {
              const isRealUrl = partner.logo_url &&
                (partner.logo_url.startsWith('/') ||
                  partner.logo_url.startsWith('http'));
              const logo = isRealUrl ? partner.logo_url! : makeSvgPlaceholder(partner.name);

              const card = (
                <div
                  className="partner-card group flex items-center justify-center p-8 rounded-2xl"
                  style={{
                    minHeight: "140px",
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <img
                    src={logo}
                    alt={partner.name}
                    className="partner-logo max-w-full h-auto"
                    style={{
                      maxHeight: "70px",
                      objectFit: "contain",
                      opacity: 0.55,
                      filter: "brightness(0) invert(1)",
                      transition: "opacity 0.3s ease",
                    }}
                    onError={e => {
                      (e.target as HTMLImageElement).src = makeSvgPlaceholder(partner.name);
                    }}
                  />
                </div>
              );

              return (
                <div key={`${partner.id}-${index}`} className="flex-[0_0_280px] min-w-0">
                  {partner.website_url ? (
                    <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                      {card}
                    </a>
                  ) : card}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
