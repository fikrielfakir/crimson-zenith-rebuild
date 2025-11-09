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
    <section id="discover" className="py-20 bg-white scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-heading">
            Our Focus
          </h2>
          <p className="text-lg text-slate-400 font-body">
            Sustainable Tourism, Culture, and Entertainment
          </p>
        </div>
        
        <div className="flex gap-4 max-w-7xl mx-auto">
          {focuses.map((focus, index) => (
            <Card 
              key={focus.title} 
              className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-2xl ${
                index === 0 ? 'w-1/4 opacity-40 hover:opacity-100' : 'flex-1'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                height: '500px'
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${focus.bgImage})` }}
              />
              
              {/* Gradient Overlay - Subtle always, darker on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-500" />
              
              {/* Decorative Birds (for Tourism card) */}
              {index === 0 && (
                <div className="absolute top-8 left-8 opacity-60">
                  <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15C7 13 10 10 13 10C16 10 18 12 20 15M25 10C27 8 30 5 33 5C36 5 38 7 40 10M45 20C47 18 50 15 53 15C56 15 58 17 60 20" 
                          stroke="currentColor" strokeWidth="1.5" className="text-white/80" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                {/* Title - Always visible */}
                <h3 className="text-3xl md:text-5xl font-bold mb-2 font-heading text-white drop-shadow-lg">
                  {focus.title}
                </h3>
                
                {/* Description - Always visible for Tourism, visible on hover for others */}
                <p className={`text-sm md:text-base leading-relaxed font-body text-white/90 drop-shadow-md transition-all duration-500 ${
                  index === 0 ? 'opacity-80' : 'opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-40 overflow-hidden transform translate-y-4 group-hover:translate-y-0'
                }`}>
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
