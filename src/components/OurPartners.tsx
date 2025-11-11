import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const OurPartners = () => {
  const moroccanPattern = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="moroccan-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <!-- Moroccan Zellige-inspired star pattern -->
          <g opacity="0.15">
            <!-- Central star -->
            <path d="M50,25 L55,40 L70,40 L58,50 L62,65 L50,55 L38,65 L42,50 L30,40 L45,40 Z" 
                  fill="#C9A35B" stroke="#C9A35B" stroke-width="0.5"/>
            
            <!-- Corner decorative elements -->
            <circle cx="10" cy="10" r="3" fill="#C9A35B" opacity="0.6"/>
            <circle cx="90" cy="10" r="3" fill="#C9A35B" opacity="0.6"/>
            <circle cx="10" cy="90" r="3" fill="#C9A35B" opacity="0.6"/>
            <circle cx="90" cy="90" r="3" fill="#C9A35B" opacity="0.6"/>
            
            <!-- Connecting lines -->
            <path d="M10,10 L50,25 L90,10" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
            <path d="M10,90 L50,75 L90,90" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
            <path d="M10,10 L25,50 L10,90" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
            <path d="M90,10 L75,50 L90,90" stroke="#C9A35B" stroke-width="0.5" fill="none" opacity="0.4"/>
            
            <!-- Small decorative diamonds -->
            <path d="M25,25 L27,27 L25,29 L23,27 Z" fill="#D4AF37" opacity="0.7"/>
            <path d="M75,25 L77,27 L75,29 L73,27 Z" fill="#D4AF37" opacity="0.7"/>
            <path d="M25,75 L27,77 L25,79 L23,77 Z" fill="#D4AF37" opacity="0.7"/>
            <path d="M75,75 L77,77 L75,79 L73,77 Z" fill="#D4AF37" opacity="0.7"/>
          </g>
        </pattern>
      </defs>
    </svg>
  `;

  const partners = [
    {
      name: "Partner 1",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+1"
    },
    {
      name: "Partner 2",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+2"
    },
    {
      name: "Partner 3",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+3"
    },
    {
      name: "Partner 4",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+4"
    },
    {
      name: "Partner 5",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+5"
    },
    {
      name: "Partner 6",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+6"
    },
    {
      name: "Partner 7",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+7"
    },
    {
      name: "Partner 8",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+8"
    },
    {
      name: "Partner 9",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+9"
    },
    {
      name: "Partner 10",
      logo: "https://via.placeholder.com/180x80/FFFFFF/112250?text=LOGO+10"
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      dragFree: true,
      containScroll: 'trimSnaps'
    },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false })]
  );

  const onMouseEnter = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (autoScroll) autoScroll.stop();
  }, [emblaApi]);

  const onMouseLeave = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (autoScroll) autoScroll.play();
  }, [emblaApi]);

  return (
    <section
      id="partners"
      className="relative w-full py-20 scroll-mt-32 bg-white overflow-hidden"
    >
      {/* Moroccan Pattern Background - Decorative Texture */}
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

      {/* Top Linear Gradient Overlay - Navy Blue to White */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #112250 0%, rgba(17, 34, 80, 0.7) 15%, rgba(17, 34, 80, 0.3) 30%, transparent 50%)",
          zIndex: 1,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
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
              textShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            Associates & Clients
          </p>
          <h2
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "42px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}
          >
            Our Partners & Supporters
          </h2>
        </div>

        {/* Auto-Sliding Carousel */}
        <div 
          className="overflow-hidden pb-8" 
          style={{ minHeight: "200px" }}
          ref={emblaRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="flex gap-8">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex-[0_0_280px] min-w-0"
              >
                <div
                  className="group flex items-center justify-center p-8 bg-white rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  style={{
                    border: "2px solid #f3f4f6",
                    minHeight: "140px",
                    width: "100%"
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full h-auto opacity-50 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      maxHeight: "70px",
                      objectFit: "contain",
                      filter: "grayscale(100%)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "grayscale(0%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "grayscale(100%)";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
