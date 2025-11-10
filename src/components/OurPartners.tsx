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
    }
  ];

  return (
    <section
      id="partners"
      className="relative w-full py-20 scroll-mt-32"
      style={{ 
        background: "linear-gradient(180deg, #112250 0%, #1a3366 100%)"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p
            className="mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#D8C18D",
              letterSpacing: "2px",
              textTransform: "uppercase"
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
              color: "#FFFFFF"
            }}
          >
            We Have Worked with Great People
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-6 bg-white rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                border: "1px solid #e5e7eb",
                minHeight: "120px",
                width: "100%"
              }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full h-auto opacity-60 group-hover:opacity-100 transition-all duration-300"
                style={{
                  maxHeight: "60px",
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
