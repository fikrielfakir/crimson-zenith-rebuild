const OurPartners = () => {
  const partners = [
    {
      title: "Tourism Partners",
      description:
        "Leading tourism organizations and travel agencies supporting sustainable travel across Morocco",
      bgImage:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200",
      showBirds: false,
    },
    {
      title: "Cultural Partners",
      description:
        "Museums, cultural centers, and heritage organizations preserving Morocco's rich traditions",
      bgImage: "https://images.unsplash.com/photo-1564760290292-23341e4df6ec?auto=format&fit=crop&q=80&w=1200",
      showBirds: false,
    },
    {
      title: "Government & NGOs",
      description:
        "Public institutions and non-profit organizations working towards community development",
      bgImage: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=1200",
      showBirds: false,
    },
  ];

  return (
    <section
      id="partners"
      className="relative w-full scroll-mt-32"
      style={{ height: "600px" }}
    >
      <div className="relative w-full h-full flex overflow-hidden">
        {partners.map((partner, index) => (
          <div
            key={partner.title}
            className="relative flex-1 group cursor-pointer"
            style={{
              borderRight:
                index < partners.length - 1
                  ? "3px solid rgba(255, 255, 255, 0.9)"
                  : "none",
              borderRadius:
                index === 0
                  ? "8px 0 0 8px"
                  : index === partners.length - 1
                    ? "0 8px 8px 0"
                    : "0",
              overflow: "hidden"
            }}
          >
            <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${partner.bgImage})`,
                }}
              />

              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(90, 70, 30, 0.8), rgba(40, 30, 20, 0.3))",
                }}
              />
            </div>

            <div className="absolute bottom-6 left-8">
              <h3
                className="font-bold transition-all duration-500"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "26px",
                  color: "#FFFFFF",
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                {partner.title}
              </h3>
              <p
                className="max-w-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden transform translate-y-4 group-hover:translate-y-0 mt-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  color: "#E8D8AA",
                  lineHeight: "22px",
                }}
              >
                {partner.description}
              </p>
            </div>
          </div>
        ))}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(#112250 0%, rgba(10, 26, 61, 0.4) 40%, transparent 60%)",
            zIndex: 1,
          }}
        />

        <div className="absolute top-0 left-0 right-0 text-center pt-12 pb-6 z-10 pointer-events-none">
          <h2
            className="font-bold mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0px 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Our Partners
          </h2>
          <p
            className="mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
              maxWidth: "75%",
            }}
          >
            Working together to create sustainable impact across Morocco
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
