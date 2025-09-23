import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
          Where Adventure Meets
          <br />
          Enlightenment
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-slide-up mb-12">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Your Journey
          </Button>
          <Button variant="outline" className="w-full sm:w-auto text-white border-white/70 hover:bg-white hover:text-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3 rounded-md font-medium transition-all duration-300 bg-transparent border-2">
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center items-center">
          <Mouse className="w-4 h-4 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default Hero;