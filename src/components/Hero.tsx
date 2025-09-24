import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";
import { useState, useEffect } from "react";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  const taglines = [
    { text: "Where Adventure Meets\nTransformation", twoLines: true },
    { text: "Where Journey Meets\nDiscovery", twoLines: true },
    { text: "Where Exploration Meets\nInspiration", twoLines: true },
    { text: "Where Travel Meets\nPurpose", twoLines: true },
    { text: "Journey Within,\nExplore Without", twoLines: true },
    { text: "Where Journeys Become\nTransformations", twoLines: true },
    { text: "Adventure Towards\nInner Discovery", twoLines: true },
    { text: "Where Soul Meets\nAdventure", twoLines: true },
    { text: "Discover. Transform.\nJourney.", twoLines: true },
    { text: "Explore Beyond\nthe Horizon", twoLines: true },
    { text: "Journey Towards\nSelf-Discovery", twoLines: true },
    { text: "Where Dreams Meet\nAdventure", twoLines: true },
    { text: "Your Path to\nExtraordinary Journeys", twoLines: true },
    { text: "Creating Meaningful\nAdventures", twoLines: true },
    { text: "Where Travelers Become\nExplorers", twoLines: true },
    { text: "Exceptional Journeys for\nExtraordinary People", twoLines: true }
  ];

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const fullText = taglines[currentTaglineIndex].text.replace('\\n', '\n');
    
    if (isTyping) {
      let currentIndex = 0;
      setDisplayedText('');
      
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          
          // Wait 2 seconds before starting to erase
          setTimeout(() => {
            eraseText();
          }, 2000);
        }
      }, 100); // Type speed: 100ms per character
      
      return () => clearInterval(typeInterval);
    }
  }, [currentTaglineIndex, isTyping, taglines]);

  const eraseText = () => {
    const currentText = displayedText;
    let currentIndex = currentText.length;
    
    const eraseInterval = setInterval(() => {
      if (currentIndex > 0) {
        setDisplayedText(currentText.slice(0, currentIndex - 1));
        currentIndex--;
      } else {
        clearInterval(eraseInterval);
        // Move to next tagline and start typing again
        setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setIsTyping(true);
      }
    }, 50); // Erase speed: 50ms per character (faster than typing)
  };

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
      <div className="relative z-10 text-center px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto" style={{ marginTop: '10rem' }}>
        <h1 
          className="hero-h1-responsive leading-[1.1] tracking-tight"
          style={{ 
            fontSize: '65px', 
            marginBottom: '2rem',
          }}
        >
          <span className="hero-heading-gradient hero-heading-typewriter">
            {displayedText.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < displayedText.split('\n').length - 1 && <br />}
              </span>
            ))}
            <span className="typewriter-cursor">|</span>
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/85 mb-12 sm:mb-14 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
          Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            className="w-full sm:w-auto text-white text-base px-10 py-4 h-14 rounded-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-0 hover:opacity-90"
            style={{ backgroundColor: 'hsl(225, 70%, 20%)' }}
          >
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
      
      {/* Simple Mouse Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <Mouse className="w-6 h-6 text-white/60 animate-bounce" />
      </div>

      {/* Add responsive styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (min-width: 640px) {
            .hero-h1-responsive {
              margin-bottom: 1.5rem !important;
            }
            .sm\\:bottom-12 {
              bottom: 1rem;
            }
          }
          @media (min-width: 768px) {
            .md\\:text-2xl {
              font-size: 20px;
              line-height: 25px;
            }
          }
          @media (min-width: 1024px) {
            .lg\\:mb-16 {
              margin-bottom: 2rem;
            }
          }
          .w-6 {
            width: 2.5rem;
          }
          .h-6 {
            height: 2.5rem;
          }
          .typewriter-cursor {
            display: inline-block;
            animation: blink 1s infinite;
            color: white;
            font-weight: normal;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `
      }} />
    </section>
  );
};

export default Hero;