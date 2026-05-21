import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

interface Partner {
  id: number;
  name: string;
  logo_id?: string;
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

const FALLBACK_PARTNERS: Partner[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Partner ${i + 1}`,
  logo_id: '',
  website_url: '',
  ordering: i + 1,
  is_active: true,
}));

const OurPartners = () => {
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
        const list: Partner[] = Array.isArray(partnersData) ? partnersData : [];
        setPartners(list.length > 0 ? list : FALLBACK_PARTNERS);
        if (settingsData && settingsData.title) {
          setSettings({
            title: settingsData.title ?? 'Our Partners & Supporters',
            subtitle: settingsData.subtitle ?? 'Associates & Clients',
            is_active: settingsData.is_active ?? true,
          });
        }
      })
      .catch(() => setPartners(FALLBACK_PARTNERS))
      .finally(() => setLoading(false));
  }, []);

  if (!settings.is_active && !loading) return null;

  const displayPartners = partners.length > 0 ? partners : FALLBACK_PARTNERS;
  const loopedPartners = displayPartners.length < 6
    ? [...displayPartners, ...displayPartners, ...displayPartners]
    : displayPartners;

  return (
    <section
      id="partners"
      className="relative w-full py-20 scroll-mt-32 bg-white overflow-hidden"
    >
      {/* Moroccan Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(moroccanPattern)}")`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '120px 120px',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Top Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #112250 0%, rgba(17,34,80,0.7) 15%, rgba(17,34,80,0.3) 30%, transparent 50%)",
          zIndex: 1,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {settings.subtitle}
          </p>
          <h2
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "42px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {settings.title}
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="overflow-hidden pb-8"
          style={{ minHeight: "200px" }}
          ref={emblaRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="flex gap-8">
            {loopedPartners.map((partner, index) => {
              const isRealUrl = partner.logo_id &&
                (partner.logo_id.startsWith('/') ||
                  (partner.logo_id.startsWith('http') && !partner.logo_id.includes('via.placeholder.com')));
              const logo = isRealUrl ? partner.logo_id! : makeSvgPlaceholder(partner.name);

              const card = (
                <div
                  className="group flex items-center justify-center p-8 bg-white rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  style={{ border: "2px solid #f3f4f6", minHeight: "140px", width: "100%" }}
                >
                  <img
                    src={logo}
                    alt={partner.name}
                    className="max-w-full h-auto opacity-50 group-hover:opacity-100 transition-all duration-300"
                    style={{ maxHeight: "70px", objectFit: "contain", filter: "grayscale(100%)", transition: "all 0.3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(100%)"; }}
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
