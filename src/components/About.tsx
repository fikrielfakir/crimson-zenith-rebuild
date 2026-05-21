import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const focuses = [
    {
      titleKey: "about.tourism",
      descKey: "about.tourismDesc",
      bgImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1200",
      showBirds: true,
    },
    {
      titleKey: "about.culture",
      descKey: "about.cultureDesc",
      bgImage: "/images/culture.png",
      showBirds: false,
    },
    {
      titleKey: "about.entertainment",
      descKey: "about.entertainmentDesc",
      bgImage: "/images/entertainment.png",
      showBirds: false,
    },
  ];

  return (
    <section id="discover" className="relative w-full scroll-mt-32">
      <div className="relative w-full flex flex-col sm:flex-row overflow-hidden">
        {focuses.map((focus, index) => (
          <div
            key={focus.titleKey}
            className="relative flex-1 group cursor-pointer h-[220px] sm:h-[400px] md:h-[600px]"
            style={{
              borderRight: index < focuses.length - 1 ? "3px solid rgba(255,255,255,0.9)" : "none",
              borderBottom: "none",
              borderRadius: index === 0 ? "8px 0 0 8px" : index === focuses.length - 1 ? "0 8px 8px 0" : "0",
              overflow: "hidden",
            }}
          >
            <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${focus.bgImage})` }} />
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

            <div className="absolute bottom-6 left-8">
              <h3
                className="font-bold transition-all duration-500"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "26px", color: "#FFFFFF", textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
              >
                {t(focus.titleKey)}
              </h3>
              <p
                className="max-w-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden transform translate-y-4 group-hover:translate-y-0 mt-2"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#E8D8AA", lineHeight: "22px" }}
              >
                {t(focus.descKey)}
              </p>
            </div>
          </div>
        ))}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(#112250 0%, rgba(10,26,61,0.4) 40%, transparent 60%)", zIndex: 1 }}
        />

        <div className="absolute top-0 left-0 right-0 text-center pt-6 sm:pt-10 md:pt-12 pb-6 z-10 pointer-events-none">
          <h2
            className="font-bold mb-2 sm:mb-3"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px,6vw,48px)", fontWeight: 700, color: "#FFFFFF", textShadow: "0px 2px 8px rgba(0,0,0,0.3)" }}
          >
            {t("about.ourFocus")}
          </h2>
          <p
            className="mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(13px,3vw,22px)", fontWeight: 400, color: "#FFFFFF", letterSpacing: "0.5px", maxWidth: "85%" }}
          >
            {`${t("about.tourism")}, ${t("about.culture")}, ${t("about.entertainment")}`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
