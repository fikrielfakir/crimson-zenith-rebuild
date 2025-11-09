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
    <section id="discover" className="w-full h-[80vh] flex gap-[2px] scroll-mt-32">
      {/* Main Heading - Positioned absolutely over center panel */}
      <div className="absolute top-[15%] left-0 right-0 text-center px-8 z-10 pointer-events-none">
        <h2 
          className="font-extrabold mb-3"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "48px",
            color: "#FFFFFF",
            textShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          Our Focus
        </h2>
        <p 
          className="font-medium"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "24px",
            color: "#EDEDED"
          }}
        >
          Sustainable Tourism, Culture, and Entertainment
        </p>
      </div>

      {focuses.map((focus, index) => (
        <div 
          key={focus.title}
          className="relative flex-1 overflow-hidden group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${focus.bgImage})`
            }}
          />
          
          {/* Gradient Overlay - Same for all cards - Hidden by default, visible on hover */}
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
          
          {/* Text Content */}
          <div className="absolute bottom-10 left-10 text-left">
            <h3 
              className="font-bold mb-0 group-hover:mb-3 transition-all duration-500"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "40px",
                color: "#FFFFFF",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                transition: "font-size 0.5s ease"
              }}
            >
              <span className="group-hover:text-[28px] transition-all duration-500 inline-block">
                {focus.title}
              </span>
            </h3>
            <p 
              className="max-w-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden transform translate-y-4 group-hover:translate-y-0"
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
    </section>
  );
};

export default About;
