import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Enhanced Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto mt-16">
        <h1 
          className="hero-h1-responsive font-bold text-white leading-[1.1] tracking-tight"
          style={{ 
            fontSize: '65px', 
            marginBottom: '2rem',
          }}
        >
          Where Adventure Meets
          <br />
          <span className="text-white/95">Enlightenment</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/85 mb-12 sm:mb-14 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
          Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white text-base px-10 py-4 h-14 rounded-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-0">
            Start Your Journey
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto text-white border-white/60 hover:bg-white/10 hover:border-white hover:backdrop-blur-sm text-base px-10 py-4 h-14 rounded-xl font-medium transition-all duration-300 bg-transparent/10 backdrop-blur-sm border-2 hover:scale-105"
          >
            Learn More
          </Button>
        </div>
      </div>
      

      {/* Add responsive margin for small screens */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (min-width: 640px) {
            .hero-h1-responsive {
              margin-bottom: 1.5rem !important;
            }
          }
        `
      }} />
    </section>
  );
};

export default Hero;