const About = () => {
  return (
    <section id="discover" className="w-full h-[80vh] flex gap-[2px] scroll-mt-32">
      {/* Left Panel - Tourism */}
      <div className="relative flex-1 overflow-hidden group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url(https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1200)"
          }}
        />
        
        {/* Gradient Overlay - Bottom to Top */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(90, 70, 30, 0.7), transparent)"
          }}
        />
        
        {/* Hover Darkened Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Decorative Birds */}
        <div className="absolute top-8 left-10 opacity-60">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10C7 8 10 5 13 5C16 5 18 7 20 10M25 5C27 3 30 0 33 0C36 0 38 2 40 5M45 15C47 13 50 10 53 10C56 10 58 12 60 15" 
                  stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
          </svg>
        </div>
        
        {/* Text Content */}
        <div className="absolute bottom-10 left-10 text-left">
          <h3 
            className="font-bold mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "28px",
              color: "#F5E2B5"
            }}
          >
            Tourism
          </h3>
          <p 
            className="max-w-xs"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              color: "#E8D8AA",
              lineHeight: "22px"
            }}
          >
            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire
          </p>
        </div>
      </div>

      {/* Center Panel - Culture */}
      <div className="relative flex-1 overflow-hidden group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url(/images/culture.png)"
          }}
        />
        
        {/* Light Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "rgba(0, 0, 0, 0.2)"
          }}
        />
        
        {/* Hover Darkened Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Main Heading at Top Center */}
        <div className="absolute top-[20%] left-0 right-0 text-center px-8">
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
        
        {/* Section Title at Bottom */}
        <div className="absolute bottom-10 left-10">
          <h3 
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "30px",
              color: "#FFFFFF"
            }}
          >
            Culture
          </h3>
        </div>
      </div>

      {/* Right Panel - Entertainment */}
      <div className="relative flex-1 overflow-hidden group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url(/images/entertainment.png)"
          }}
        />
        
        {/* Gradient Overlay - Bottom to Top */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(40, 20, 0, 0.7), transparent)"
          }}
        />
        
        {/* Hover Darkened Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Text Content */}
        <div className="absolute bottom-10 left-10">
          <h3 
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "30px",
              color: "#FFFFFF",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)"
            }}
          >
            Entertainment
          </h3>
        </div>
      </div>
    </section>
  );
};

export default About;
