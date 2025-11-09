import { Card } from "@/components/ui/card";

const About = () => {
  const focuses = [
    {
      title: "Tourism",
      description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire",
      bgImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Culture",
      description: "Discover the rich heritage and traditions of Morocco through authentic experiences",
      bgImage: "/images/culture.png"
    },
    {
      title: "Entertainment",
      description: "Experience vibrant festivals, music, and cultural performances",
      bgImage: "/images/entertainment.png"
    },
  ];

  return (
    <section id="discover" className="py-20 bg-gradient-subtle scroll-mt-32">
      <div className="w-full px-0">
        <div className="text-center mb-16 animate-fade-in px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
            Our Focus
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Sustainable Tourism, Culture, and Entertainment
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-0">
          {focuses.map((focus, index) => (
            <Card 
              key={focus.title} 
              className="group relative overflow-hidden border-0 shadow-none hover:shadow-2xl transition-all duration-500 animate-scale-in h-[60vh] md:h-[85vh] cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${focus.bgImage})` }}
              />
              
              {/* Gradient Overlay - Only visible on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Decorative Birds (for Tourism card) */}
              {index === 0 && (
                <div className="absolute top-8 left-8 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20C12 18 15 15 18 15C21 15 23 17 25 20M30 15C32 13 35 10 38 10C41 10 43 12 45 15M50 25C52 23 55 20 58 20C61 20 63 22 65 25" 
                          stroke="currentColor" strokeWidth="1.5" className="text-white/60" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                {/* Title - Always visible, changes size on hover */}
                <h3 className="text-4xl md:text-5xl font-bold mb-0 group-hover:mb-4 group-hover:text-3xl font-heading text-white drop-shadow-lg transition-all duration-500">
                  {focus.title}
                </h3>
                
                {/* Description - Only visible on hover */}
                <p className="text-base md:text-lg leading-relaxed font-body text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 max-h-0 group-hover:max-h-40 overflow-hidden">
                  {focus.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
