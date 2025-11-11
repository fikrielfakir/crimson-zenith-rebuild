import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const OurPartners = () => {
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
      className="relative w-full py-20 scroll-mt-32 bg-white"
    >
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
          className="overflow-hidden" 
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

        {/* Instruction Text */}
        <div className="text-center mt-8">
          <p
            className="text-sm"
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "#6b7280",
              fontStyle: "italic"
            }}
          >
            Hover to pause • Auto-scrolling partners
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
