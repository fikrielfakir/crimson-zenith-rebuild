const About = () => {
  const focuses = [
    {
      title: "Tourism",
      description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire",
      bgImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1200",
      showBirds: true
    },
    {
      title: "Culture",
      description: "Discover the rich heritage and traditions of Morocco through authentic experiences",
      bgImage: "/images/culture.png",
      showBirds: false
    },
    {
      title: "Entertainment",
      description: "Experience vibrant festivals, music, and cultural performances",
      bgImage: "/images/entertainment.png",
      showBirds: false
    }
  ];

  return (
    <section id="discover" className="relative w-full scroll-mt-32" style={{ height: "500px" }}>
      {/* Three Cards Section - Full Width */}
      <div className="relative w-full h-full flex">
        {focuses.map((focus, index) => (
          <div 
            key={focus.title}
            className="relative flex-1 overflow-hidden group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
            style={{
              borderRight: index < focuses.length - 1 ? "3px solid rgba(255, 255, 255, 0.9)" : "none",
              borderRadius: index === 0 ? "8px 0 0 8px" : index === focuses.length - 1 ? "0 8px 8px 0" : "0"
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${focus.bgImage})`,
                objectFit: "cover"
              }}
            />
            
            {/* Hover Gradient Overlay - Same for all cards */}
            <div 
              className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{
                background: "linear-gradient(to top, rgba(90, 70, 30, 0.8), rgba(40, 30, 20, 0.3))"
              }}
            />
            
            {/* Decorative Birds (Tourism only) */}
            {focus.showBirds && (
              <div className="absolute top-8 left-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10C7 8 10 5 13 5C16 5 18 7 20 10M25 5C27 3 30 0 33 0C36 0 38 2 40 5M45 15C47 13 50 10 53 10C56 10 58 12 60 15" 
                        stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>
            )}
            
            {/* Bottom Text Label */}
            <div className="absolute bottom-6 left-8">
              <h3 
                className="font-bold transition-all duration-500"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "26px",
                  color: "#FFFFFF",
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)"
                }}
              >
                {focus.title}
              </h3>
              <p 
                className="max-w-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden transform translate-y-4 group-hover:translate-y-0 mt-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  color: "#E8D8AA",
                  lineHeight: "22px"
                }}
              >
                {focus.description}
              </p>
            </div>
          </div>
        ))}

        {/* Top Gradient Overlay - Covers ALL three cards collectively */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(10, 26, 61, 0.75) 0%, rgba(10, 26, 61, 0.4) 40%, transparent 60%)",
            zIndex: 1
          }}
        />

        {/* Center Text Section - Title & Subtitle positioned above cards */}
        <div className="absolute top-0 left-0 right-0 text-center pt-12 pb-6 z-10 pointer-events-none">
          <h2 
            className="font-bold mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0px 2px 8px rgba(0,0,0,0.3)"
            }}
          >
            Our Focus
          </h2>
          <p 
            className="mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
              maxWidth: "75%"
            }}
          >
            Sustainable Tourism, Culture, and Entertainmenta
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
