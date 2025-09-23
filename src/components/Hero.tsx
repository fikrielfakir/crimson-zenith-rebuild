import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          Where Adventure Meets
          <span className="block text-white">
            Enlightenment
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
          Experience Morocco's soul through sustainable journeys.
          <br className="hidden md:block" />
          Discover culture, embrace adventure, and create lasting
          <br className="hidden md:block" />
          connections with local communities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-3 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Your Journey
          </Button>
          <Button variant="outline" className="text-white border-white/70 hover:bg-white hover:text-black text-base px-8 py-3 rounded-md font-medium transition-all duration-300 bg-transparent border-2">
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;